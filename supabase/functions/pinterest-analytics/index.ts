
// Pinterest analytics engine
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY") || "";
const USE_NLP = !!OPENAI_API_KEY; // Only use advanced NLP if we have an API key

// Initialize supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// NLP helpers for keyword extraction and analysis
async function analyzeWithOpenAI(text: string, type: 'keyword' | 'trend' | 'profile') {
  if (!USE_NLP) {
    return { keywords: [], analysis: "NLP analysis not available" };
  }
  
  let prompt = "";
  
  if (type === 'keyword') {
    prompt = `Extract and rank the most relevant keywords and hashtags from this Pinterest content. Include main keywords, long-tail keywords, and semantic variations. Format as JSON with fields: keyword, relevance_score (0-100), is_hashtag (boolean), is_trending (boolean).
    
    Content: ${text}`;
  } else if (type === 'trend') {
    prompt = `Analyze this Pinterest content and determine trending topics and keywords. Score each keyword by estimated popularity (0-100) based on context. Format as JSON with fields: keyword, trend_score, estimated_engagement, reasoning.
    
    Content: ${text}`;
  } else if (type === 'profile') {
    prompt = `Generate a profile analysis summary for this Pinterest account data. Identify patterns, top keywords, content strategy, and engagement insights. Format as JSON with fields: summary, top_keywords, content_focus, engagement_rating (0-100), improvement_suggestions.
    
    Content: ${text}`;
  }
  
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a Pinterest SEO and marketing analytics expert. Extract keywords, analyze trends, and provide insights from Pinterest data."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.3
      })
    });
    
    if (!response.ok) {
      const error = await response.text();
      console.error("OpenAI API error:", error);
      throw new Error(`OpenAI API error: ${error}`);
    }
    
    const data = await response.json();
    const output = data.choices[0].message.content;
    
    try {
      // Extract JSON from the response
      const jsonMatch = output.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      } else {
        // If OpenAI didn't return valid JSON, we'll extract keywords manually
        return { 
          keywords: extractKeywords(text), 
          analysis: output 
        };
      }
    } catch (parseError) {
      console.error("Error parsing OpenAI response:", parseError);
      return { 
        keywords: extractKeywords(text), 
        analysis: output 
      };
    }
  } catch (error) {
    console.error("Error with OpenAI analysis:", error);
    return { 
      keywords: extractKeywords(text), 
      analysis: "Error performing NLP analysis" 
    };
  }
}

// Basic keyword extraction as fallback
function extractKeywords(text: string) {
  if (!text) return [];
  
  const stopWords = ["and", "the", "to", "a", "an", "in", "on", "with", "for", "of", "by", "at", "about", "like"];
  const words = text.toLowerCase().split(/\s+/);
  const wordFreq: Record<string, number> = {};
  
  words.forEach(word => {
    // Clean word of punctuation and check length
    const cleanWord = word.replace(/[^\w#]/g, '');
    if (cleanWord.length > 3 && !stopWords.includes(cleanWord)) {
      wordFreq[cleanWord] = (wordFreq[cleanWord] || 0) + 1;
    }
  });
  
  // Convert to array and sort by frequency
  return Object.entries(wordFreq)
    .map(([keyword, frequency]) => ({ 
      keyword, 
      frequency, 
      isHashtag: keyword.startsWith('#'),
      relevance_score: Math.min(100, frequency * 20) // Simple scoring
    }))
    .sort((a, b) => b.frequency - a.frequency);
}

// Calculate engagement scores based on pin data
function calculateEngagementScore(pinData: any) {
  // Pinterest API doesn't directly provide engagement metrics, so we'll estimate
  let score = 50; // Base score
  
  if (pinData.impression_count) {
    score += Math.min(25, pinData.impression_count / 1000);
  }
  
  if (pinData.save_count) {
    score += Math.min(25, pinData.save_count * 2);
  }
  
  if (pinData.click_count) {
    score += Math.min(25, pinData.click_count * 3);
  }
  
  if (pinData.comment_count) {
    score += Math.min(25, pinData.comment_count * 5);
  }
  
  return Math.min(100, score);
}

// Get PIN analytics from Pinterest API and enhance with our analytics
async function getPinAnalytics(pinId: string, accessToken: string) {
  try {
    console.log(`Fetching pin details for pin: ${pinId}`);
    
    // Get pin details
    const pinResponse = await fetch(`https://api.pinterest.com/v5/pins/${pinId}`, {
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      }
    });
    
    if (!pinResponse.ok) {
      const errorText = await pinResponse.text();
      console.error("Error fetching pin details:", errorText);
      throw new Error(`Pinterest API error: ${errorText}`);
    }
    
    const pinData = await pinResponse.json();
    console.log("Pin data retrieved:", pinData.id);
    
    // Extract keywords from title and description
    const combinedText = `${pinData.title || ''} ${pinData.description || ''}`;
    
    // Process with NLP if available, otherwise use basic extraction
    const keywordData = USE_NLP 
      ? await analyzeWithOpenAI(combinedText, 'keyword')
      : { keywords: extractKeywords(combinedText) };
    
    // Calculate engagement score
    const engagementScore = calculateEngagementScore(pinData);
    
    // Get related pins (if available)
    let relatedPins = [];
    try {
      const relatedResponse = await fetch(`https://api.pinterest.com/v5/pins/${pinId}/related`, {
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        }
      });
      
      if (relatedResponse.ok) {
        const relatedData = await relatedResponse.json();
        relatedPins = relatedData.items || [];
      }
    } catch (error) {
      console.error("Error fetching related pins:", error);
    }
    
    // Compile the analytics result
    const analytics = {
      pin_id: pinData.id,
      title: pinData.title,
      description: pinData.description,
      url: pinData.link,
      image_url: pinData.media?.images?.original?.url,
      engagement_score: engagementScore,
      keywords: keywordData.keywords,
      analysis: keywordData.analysis || null,
      related_pins: relatedPins.map((pin: any) => ({
        id: pin.id,
        title: pin.title,
        image_url: pin.media?.images?.original?.url
      }))
    };
    
    return analytics;
  } catch (error) {
    console.error("Error in pin analytics:", error);
    throw error;
  }
}

// Analyze Pinterest profile
async function getProfileAnalytics(username: string, accessToken: string) {
  try {
    console.log(`Analyzing profile for username: ${username}`);
    
    // Get user pins
    const pinsResponse = await fetch(`https://api.pinterest.com/v5/user_account/pins`, {
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      }
    });
    
    if (!pinsResponse.ok) {
      const errorText = await pinsResponse.text();
      console.error("Error fetching user pins:", errorText);
      throw new Error(`Pinterest API error: ${errorText}`);
    }
    
    const pinsData = await pinsResponse.json();
    const pins = pinsData.items || [];
    
    console.log(`Found ${pins.length} pins for analysis`);
    
    // Get user profile
    const profileResponse = await fetch(`https://api.pinterest.com/v5/user_account`, {
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      }
    });
    
    if (!profileResponse.ok) {
      const errorText = await profileResponse.text();
      console.error("Error fetching user profile:", errorText);
      throw new Error(`Pinterest API error: ${errorText}`);
    }
    
    const profileData = await profileResponse.json();
    
    // Compile all pin titles and descriptions for keyword analysis
    const combinedContent = pins.map((pin: any) => 
      `${pin.title || ''} ${pin.description || ''}`
    ).join(' ');
    
    // Process with NLP if available, otherwise use basic extraction
    const keywordData = USE_NLP 
      ? await analyzeWithOpenAI(combinedContent, 'profile')
      : { 
          keywords: extractKeywords(combinedContent),
          analysis: null
        };
    
    // Find top performing pins by engagement (if available)
    const topPins = pins
      .map((pin: any) => ({
        id: pin.id,
        title: pin.title,
        description: pin.description,
        image_url: pin.media?.images?.original?.url,
        engagement_score: calculateEngagementScore(pin)
      }))
      .sort((a: any, b: any) => b.engagement_score - a.engagement_score)
      .slice(0, 5);
    
    // Compile the profile analytics
    const analytics = {
      username: profileData.username,
      profile_id: profileData.id,
      pin_count: pins.length,
      profile_image: profileData.profile_image,
      website_url: profileData.website_url || null,
      top_keywords: keywordData.keywords?.slice(0, 20) || [],
      top_pins: topPins,
      analysis: keywordData.analysis || "No advanced analysis available"
    };
    
    return analytics;
  } catch (error) {
    console.error("Error in profile analytics:", error);
    throw error;
  }
}

// Analyze keywords on Pinterest
async function getKeywordAnalytics(keyword: string, accessToken: string) {
  try {
    console.log(`Analyzing keyword: ${keyword}`);
    
    // Search for pins with the keyword
    const searchResponse = await fetch(
      `https://api.pinterest.com/v5/search?query=${encodeURIComponent(keyword)}&pin_filter=explore`, 
      {
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        }
      }
    );
    
    if (!searchResponse.ok) {
      const errorText = await searchResponse.text();
      console.error("Error searching pins:", errorText);
      throw new Error(`Pinterest API error: ${errorText}`);
    }
    
    const searchData = await searchResponse.json();
    const pins = searchData.items || [];
    
    console.log(`Found ${pins.length} pins for keyword analysis`);
    
    // Compile all pin titles and descriptions
    const combinedContent = pins.map((item: any) => {
      if (item.pin) {
        return `${item.pin.title || ''} ${item.pin.description || ''}`;
      }
      return '';
    }).join(' ');
    
    // Process with NLP if available, otherwise use basic extraction
    const keywordData = USE_NLP 
      ? await analyzeWithOpenAI(combinedContent, 'trend')
      : { 
          keywords: extractKeywords(combinedContent),
          analysis: null
        };
    
    // Calculate trending score based on recency and engagement
    const pinAnalytics = pins.map((item: any) => {
      if (item.pin) {
        const pin = item.pin;
        return {
          id: pin.id,
          title: pin.title,
          description: pin.description,
          image_url: pin.media?.images?.original?.url,
          engagement_score: calculateEngagementScore(pin)
        };
      }
      return null;
    }).filter(Boolean);
    
    // Calculate average engagement across pins
    const avgEngagement = pinAnalytics.reduce(
      (sum: number, pin: any) => sum + pin.engagement_score, 0
    ) / (pinAnalytics.length || 1);
    
    // Generate related keywords based on the content
    const relatedKeywords = keywordData.keywords?.filter(
      (k: any) => k.keyword !== keyword
    ).slice(0, 15) || [];
    
    // Compile the keyword analytics
    const analytics = {
      keyword,
      pin_count: pinAnalytics.length,
      trend_score: Math.min(100, avgEngagement + (pinAnalytics.length / 3)),
      average_engagement: avgEngagement.toFixed(1),
      related_keywords: relatedKeywords,
      sample_pins: pinAnalytics.slice(0, 5),
      analysis: keywordData.analysis || "No advanced analysis available"
    };
    
    return analytics;
  } catch (error) {
    console.error("Error in keyword analytics:", error);
    throw error;
  }
}

// The main function handler
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, query, userId } = await req.json();
    
    console.log("Processing Pinterest analytics request:", { type, query, userPresent: !!userId });

    if (!type || !query || !userId) {
      return new Response(
        JSON.stringify({ error: "Missing required parameters" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Get Pinterest credentials for the user
    const { data: credentials, error: credsError } = await supabase
      .from("pinterest_credentials")
      .select("access_token")
      .eq("user_id", userId)
      .single();
      
    if (credsError || !credentials || !credentials.access_token) {
      console.error("Error fetching Pinterest credentials:", credsError);
      return new Response(
        JSON.stringify({ error: "Pinterest credentials not found. Please connect your Pinterest account." }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
    
    let result;
    let analysisType = "";
    
    // Process based on analytics type
    switch (type) {
      case "pin":
        // Extract pin ID from URL if needed
        const pinId = query.includes('pin/') ? query.split('pin/')[1].split('/')[0] : query;
        result = await getPinAnalytics(pinId, credentials.access_token);
        analysisType = "pin";
        break;
        
      case "profile":
        // Extract username from URL if needed
        const username = query.includes('pinterest.com/') ? query.split('pinterest.com/')[1].split('/')[0] : query;
        result = await getProfileAnalytics(username, credentials.access_token);
        analysisType = "profile";
        break;
        
      case "keyword":
        result = await getKeywordAnalytics(query, credentials.access_token);
        analysisType = "keyword";
        break;
        
      default:
        return new Response(
          JSON.stringify({ error: "Invalid analysis type" }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
    }

    // Save the analysis to database
    const { data: savedAnalysis, error: saveError } = await supabase
      .from("pinterest_analytics")
      .insert({
        user_id: userId,
        query: query,
        type: analysisType,
        results: result
      })
      .select("id")
      .single();
      
    if (saveError) {
      console.error("Error saving analysis to database:", saveError);
    } else {
      console.log("Analysis saved with ID:", savedAnalysis.id);
      result.analysis_id = savedAnalysis.id;
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: result 
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error in Pinterest analytics function:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
