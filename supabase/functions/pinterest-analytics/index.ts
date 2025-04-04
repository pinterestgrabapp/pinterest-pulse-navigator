
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.38/deno-dom-wasm.ts";
import { OpenAI } from "https://deno.land/x/openai@v4.24.0/mod.ts";

const APIFY_API_TOKEN = Deno.env.get('APIFY_API_TOKEN');
const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');

// Initialize OpenAI client for NLP analysis
const openai = new OpenAI({
  apiKey: OPENAI_API_KEY || "",
});

interface ScrapeRequest {
  type: "keyword" | "pin" | "profile";
  value: string;
  useNlp?: boolean;
  maxResults?: number;
}

interface KeywordData {
  keyword: string;
  frequency: number;
  trendScore: number;
  engagementScore: number;
  relatedKeywords: string[];
}

interface ProfileData {
  username: string;
  totalPins: number;
  followers: number;
  boards: number;
  topKeywords: string[];
  avgEngagement: number;
}

interface PinData {
  title: string;
  description: string;
  repins: number;
  comments: number;
  boardName: string;
  hashtags: string[];
  url: string;
}

interface AnalyticsResponse {
  keywords?: KeywordData[];
  profile?: ProfileData;
  pins?: PinData[];
  insights: string;
  error?: string;
}

// Main edge function handler
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, value, useNlp = false, maxResults = 30 } = await req.json() as ScrapeRequest;
    
    console.log(`Processing ${type} analytics request for: ${value}`);
    
    let response: AnalyticsResponse;
    
    switch (type) {
      case "keyword":
        response = await processKeywordAnalysis(value, useNlp, maxResults);
        break;
      case "pin":
        response = await processPinAnalysis(value, useNlp);
        break;
      case "profile":
        response = await processProfileAnalysis(value, maxResults);
        break;
      default:
        throw new Error("Invalid analysis type");
    }
    
    // Return the response with CORS headers
    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error processing analysis request:", error);
    
    // Return error response with CORS headers
    return new Response(
      JSON.stringify({ 
        error: error.message || "An error occurred during analysis",
        insights: "Analysis failed. Please try again." 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});

// Function to process keyword analysis
async function processKeywordAnalysis(keyword: string, useNlp: boolean, maxResults: number): Promise<AnalyticsResponse> {
  try {
    console.log(`Starting keyword analysis for: ${keyword}`);
    
    // Use Apify to scrape Pinterest for the keyword
    const data = await scrapeWithApify("keyword", keyword, maxResults);
    
    // Extract and analyze keywords from the scraped data
    const keywordData = extractKeywords(data);
    
    // Calculate trend and engagement scores
    const scoredKeywords = calculateScores(keywordData, data);
    
    // Generate insights using NLP if enabled
    let insights = `Analysis of "${keyword}" found ${scoredKeywords.length} related keywords with varying engagement levels.`;
    
    if (useNlp && OPENAI_API_KEY) {
      insights = await generateNlpInsights(keyword, scoredKeywords, data);
    }
    
    return {
      keywords: scoredKeywords.slice(0, 50), // Limit to top 50 keywords
      insights,
    };
  } catch (error) {
    console.error("Error in keyword analysis:", error);
    throw new Error(`Keyword analysis failed: ${error.message}`);
  }
}

// Function to process pin analysis
async function processPinAnalysis(pinUrl: string, useNlp: boolean): Promise<AnalyticsResponse> {
  try {
    console.log(`Starting pin analysis for: ${pinUrl}`);
    
    // Extract pin ID from URL
    const pinId = extractPinId(pinUrl);
    if (!pinId) {
      throw new Error("Invalid Pinterest pin URL");
    }
    
    // Use Apify to scrape Pinterest for the pin data
    const data = await scrapeWithApify("pin", pinId, 1);
    
    if (!data || data.length === 0) {
      throw new Error("Could not retrieve pin data");
    }
    
    // Extract pin details
    const pinData = parsePinData(data[0]);
    
    // Get related pins
    const relatedPins = await scrapeWithApify("related", pinId, 10);
    
    // Extract keywords from pin and related pins
    const keywordData = extractKeywords([...data, ...relatedPins]);
    const scoredKeywords = calculateScores(keywordData, [...data, ...relatedPins]);
    
    // Generate insights
    let insights = `Analysis of pin "${pinData.title}" found ${scoredKeywords.length} related keywords.`;
    
    if (useNlp && OPENAI_API_KEY) {
      insights = await generateNlpInsights(pinData.title, scoredKeywords, data);
    }
    
    return {
      pins: [pinData],
      keywords: scoredKeywords.slice(0, 30), // Limit to top 30 keywords
      insights,
    };
  } catch (error) {
    console.error("Error in pin analysis:", error);
    throw new Error(`Pin analysis failed: ${error.message}`);
  }
}

// Function to process profile analysis
async function processProfileAnalysis(profileUrl: string, maxResults: number): Promise<AnalyticsResponse> {
  try {
    console.log(`Starting profile analysis for: ${profileUrl}`);
    
    // Extract username from profile URL
    const username = extractUsername(profileUrl);
    if (!username) {
      throw new Error("Invalid Pinterest profile URL");
    }
    
    // Use Apify to scrape Pinterest for the profile data
    const data = await scrapeWithApify("profile", username, maxResults);
    
    if (!data || data.length === 0) {
      throw new Error("Could not retrieve profile data");
    }
    
    // Parse profile data
    const profileData = parseProfileData(username, data);
    
    // Extract keywords from pins
    const keywordData = extractKeywords(data);
    const scoredKeywords = calculateScores(keywordData, data);
    
    // Parse pin data
    const pins = data.map(pin => parsePinData(pin)).slice(0, 10);
    
    // Generate insights
    const insights = `Analysis of profile "${username}" found ${pins.length} pins with an average of ${profileData.avgEngagement.toFixed(2)} engagements per pin.`;
    
    return {
      profile: profileData,
      pins: pins,
      keywords: scoredKeywords.slice(0, 30), // Limit to top 30 keywords
      insights,
    };
  } catch (error) {
    console.error("Error in profile analysis:", error);
    throw new Error(`Profile analysis failed: ${error.message}`);
  }
}

// Helper function to scrape Pinterest data using Apify
async function scrapeWithApify(
  type: "keyword" | "pin" | "profile" | "related",
  value: string,
  maxResults: number
): Promise<any[]> {
  if (!APIFY_API_TOKEN) {
    console.warn("APIFY_API_TOKEN not set, using mock data");
    return getMockData(type, value, maxResults);
  }
  
  const actorId = "apify/pinterest-scraper";
  const apiUrl = `https://api.apify.com/v2/acts/${actorId}/runs`;
  
  let input: any = {
    maxItems: maxResults,
    maxConcurrency: 10,
    proxy: {
      useApifyProxy: true,
    },
  };
  
  // Configure input based on type
  switch (type) {
    case "keyword":
      input = { ...input, search: value };
      break;
    case "pin":
      input = { ...input, pinUrls: [`https://www.pinterest.com/pin/${value}`] };
      break;
    case "related":
      input = { ...input, relatedPin: value };
      break;
    case "profile":
      input = { ...input, usernames: [value] };
      break;
  }
  
  try {
    // Start the scraper run
    const startResponse = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${APIFY_API_TOKEN}`,
      },
      body: JSON.stringify({ json: input }),
    });
    
    if (!startResponse.ok) {
      throw new Error(`Failed to start Apify scraper: ${startResponse.statusText}`);
    }
    
    const { data: { id: runId } } = await startResponse.json();
    console.log(`Started Apify scraper run with ID: ${runId}`);
    
    // Wait for the run to complete (with timeout)
    let status = "RUNNING";
    let attempts = 0;
    const maxAttempts = 20; // Maximum wait time = 20 * 3 seconds = 60 seconds
    
    while (status === "RUNNING" && attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 3000)); // Wait 3 seconds
      
      const statusResponse = await fetch(`https://api.apify.com/v2/acts/${actorId}/runs/${runId}`, {
        headers: {
          "Authorization": `Bearer ${APIFY_API_TOKEN}`,
        },
      });
      
      if (!statusResponse.ok) {
        throw new Error(`Failed to check Apify run status: ${statusResponse.statusText}`);
      }
      
      const { data: { status: currentStatus } } = await statusResponse.json();
      status = currentStatus;
      attempts++;
    }
    
    if (status !== "SUCCEEDED") {
      throw new Error(`Apify scraper run did not complete successfully: ${status}`);
    }
    
    // Get the dataset items
    const datasetResponse = await fetch(`https://api.apify.com/v2/acts/${actorId}/runs/${runId}/dataset/items`, {
      headers: {
        "Authorization": `Bearer ${APIFY_API_TOKEN}`,
      },
    });
    
    if (!datasetResponse.ok) {
      throw new Error(`Failed to retrieve Apify dataset: ${datasetResponse.statusText}`);
    }
    
    const data = await datasetResponse.json();
    
    if (!data || data.length === 0) {
      console.warn("No data returned from Apify");
    }
    
    return data || [];
  } catch (error) {
    console.error("Error scraping with Apify:", error);
    return getMockData(type, value, maxResults);
  }
}

// Helper function to extract keywords from scraped data
function extractKeywords(data: any[]): Map<string, { count: number, pins: any[] }> {
  const keywordsMap = new Map<string, { count: number, pins: any[] }>();
  
  for (const pin of data) {
    // Extract potential keywords from title and description
    const title = pin.title || "";
    const description = pin.description || "";
    
    // Combine and clean text
    const text = `${title} ${description}`.toLowerCase();
    
    // Extract hashtags
    const hashtags = (text.match(/#[a-z0-9]+/g) || [])
      .map(tag => tag.substring(1))
      .filter(tag => tag.length > 2);
    
    // Extract words (excluding common stop words)
    const stopWords = ["the", "and", "is", "in", "to", "with", "for", "on", "of", "a", "an"];
    const words = text
      .replace(/[^\w\s#]/g, " ")
      .split(/\s+/)
      .filter(word => word.length > 3 && !stopWords.includes(word));
    
    // Process all potential keywords (words and hashtags)
    const allKeywords = [...words, ...hashtags];
    
    for (const keyword of allKeywords) {
      if (keywordsMap.has(keyword)) {
        const current = keywordsMap.get(keyword)!;
        current.count++;
        current.pins.push(pin);
        keywordsMap.set(keyword, current);
      } else {
        keywordsMap.set(keyword, { count: 1, pins: [pin] });
      }
    }
  }
  
  return keywordsMap;
}

// Helper function to calculate trend and engagement scores
function calculateScores(
  keywordsMap: Map<string, { count: number, pins: any[] }>,
  allPins: any[]
): KeywordData[] {
  const result: KeywordData[] = [];
  const now = new Date();
  
  keywordsMap.forEach((data, keyword) => {
    // Skip keywords that appear less than twice
    if (data.count < 2) return;
    
    // Calculate engagement (repins + comments) for all pins with this keyword
    let totalEngagement = 0;
    
    for (const pin of data.pins) {
      const repins = parseInt(pin.repins || "0", 10) || 0;
      const comments = parseInt(pin.comments || "0", 10) || 0;
      totalEngagement += repins + comments;
    }
    
    // Calculate recency score (higher for newer pins)
    let recencyScore = 0;
    for (const pin of data.pins) {
      if (pin.created) {
        const created = new Date(pin.created);
        const ageInDays = (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24);
        // Newer pins get higher recency score (max 1.0 for pins created today)
        recencyScore += Math.max(0, 1 - (ageInDays / 30)); // Linear decay over 30 days
      }
    }
    recencyScore = recencyScore / data.pins.length;
    
    // Average engagement per pin
    const avgEngagement = totalEngagement / data.pins.length;
    
    // Calculate trend score (0-100) based on frequency, engagement and recency
    const freqFactor = Math.min(1, data.count / (allPins.length * 0.5)); // Frequency factor (max 1.0)
    const engagementFactor = Math.min(1, avgEngagement / 50); // Engagement factor (assumes 50 engagements is high)
    
    const trendScore = Math.round((freqFactor * 0.4 + engagementFactor * 0.4 + recencyScore * 0.2) * 100);
    
    // Find related keywords
    const relatedKeywords = new Set<string>();
    for (const pin of data.pins) {
      const text = `${pin.title || ""} ${pin.description || ""}`.toLowerCase();
      const words = text
        .replace(/[^\w\s#]/g, " ")
        .split(/\s+/)
        .filter(word => word.length > 3 && word !== keyword);
      
      words.slice(0, 5).forEach(word => relatedKeywords.add(word));
    }
    
    result.push({
      keyword,
      frequency: data.count,
      trendScore,
      engagementScore: Math.round(avgEngagement * 10) / 10, // Round to 1 decimal place
      relatedKeywords: Array.from(relatedKeywords).slice(0, 5),
    });
  });
  
  // Sort by trend score (descending)
  return result.sort((a, b) => b.trendScore - a.trendScore);
}

// Helper function to parse pin data
function parsePinData(pin: any): PinData {
  return {
    title: pin.title || "Untitled Pin",
    description: pin.description || "",
    repins: parseInt(pin.repins || "0", 10) || 0,
    comments: parseInt(pin.comments || "0", 10) || 0,
    boardName: pin.boardName || "Unknown Board",
    hashtags: extractHashtags(pin),
    url: pin.url || "",
  };
}

// Helper function to extract hashtags from pin
function extractHashtags(pin: any): string[] {
  const text = `${pin.title || ""} ${pin.description || ""}`.toLowerCase();
  const hashtags = text.match(/#[a-z0-9]+/g) || [];
  return hashtags.map(tag => tag.substring(1));
}

// Helper function to parse profile data
function parseProfileData(username: string, pins: any[]): ProfileData {
  // Calculate total engagement
  let totalEngagement = 0;
  const keywordFrequency: { [key: string]: number } = {};
  
  for (const pin of pins) {
    const repins = parseInt(pin.repins || "0", 10) || 0;
    const comments = parseInt(pin.comments || "0", 10) || 0;
    totalEngagement += repins + comments;
    
    // Extract keywords
    const text = `${pin.title || ""} ${pin.description || ""}`.toLowerCase();
    const words = text
      .replace(/[^\w\s#]/g, " ")
      .split(/\s+/)
      .filter(word => word.length > 3);
    
    for (const word of words) {
      keywordFrequency[word] = (keywordFrequency[word] || 0) + 1;
    }
  }
  
  // Get top keywords
  const topKeywords = Object.entries(keywordFrequency)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([keyword]) => keyword);
  
  return {
    username,
    totalPins: pins.length,
    followers: pins.length > 0 && pins[0].userInfo ? parseInt(pins[0].userInfo.followers || "0", 10) : 0,
    boards: pins.length > 0 && pins[0].userInfo ? parseInt(pins[0].userInfo.boards || "0", 10) : 0,
    topKeywords,
    avgEngagement: pins.length > 0 ? totalEngagement / pins.length : 0,
  };
}

// Helper function to extract pin ID from URL
function extractPinId(url: string): string | null {
  const match = url.match(/pinterest\.com\/pin\/([0-9]+)/);
  return match ? match[1] : null;
}

// Helper function to extract username from profile URL
function extractUsername(url: string): string | null {
  const match = url.match(/pinterest\.com\/([^\/]+)/);
  return match ? match[1] : null;
}

// Helper function to generate insights using NLP
async function generateNlpInsights(
  query: string,
  keywords: KeywordData[],
  data: any[]
): Promise<string> {
  if (!OPENAI_API_KEY) {
    return "NLP analysis not available (API key not configured).";
  }
  
  try {
    const keywordSummary = keywords
      .slice(0, 10)
      .map(k => `${k.keyword} (trend score: ${k.trendScore}, frequency: ${k.frequency})`)
      .join(", ");
    
    const prompt = `
      Analyze Pinterest data for query "${query}".
      
      Top keywords: ${keywordSummary}
      
      Total pins analyzed: ${data.length}
      
      Please provide:
      1. A summary of keyword trends (2 sentences)
      2. Content optimization recommendations (2 sentences)
      3. One interesting insight from the data
      
      Format as a short paragraph, max 100 words.
    `;
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a Pinterest SEO analytics expert providing concise insights." },
        { role: "user", content: prompt }
      ],
      max_tokens: 150,
    });
    
    return response.choices[0].message.content || "Could not generate NLP insights.";
  } catch (error) {
    console.error("Error generating NLP insights:", error);
    return `Analysis found ${keywords.length} keywords related to "${query}". Top trends include ${
      keywords.slice(0, 3).map(k => k.keyword).join(", ")
    }.`;
  }
}

// Mock data function for when Apify is not configured
function getMockData(type: string, value: string, count: number): any[] {
  console.log(`Generating mock data for ${type}: ${value}`);
  
  const now = new Date();
  const oneDay = 24 * 60 * 60 * 1000;
  const mockData = [];
  
  for (let i = 0; i < count; i++) {
    // Create dates spaced over last 30 days
    const daysAgo = Math.floor(Math.random() * 30);
    const createdDate = new Date(now.getTime() - (daysAgo * oneDay));
    
    mockData.push({
      id: `mock-pin-${i}`,
      title: `${value} inspiration ideas for your next project ${i}`,
      description: `Check out these amazing ${value} ideas that will transform your Pinterest strategy! #${value} #inspiration #ideas #trending`,
      url: `https://www.pinterest.com/pin/mock${i}`,
      repins: Math.floor(Math.random() * 200).toString(),
      comments: Math.floor(Math.random() * 20).toString(),
      created: createdDate.toISOString(),
      boardName: `Best ${value} Ideas`,
      userInfo: {
        username: "mockuser",
        followers: "1245",
        boards: "32"
      }
    });
  }
  
  return mockData;
}
