
import { supabase } from "@/integrations/supabase/client";
import { searchPinterest, scrapeUrl, scrapeBoard } from "@/utils/apifyUtils";

// Re-export Apify functions with more descriptive names for better integration
export const searchPinterestPins = searchPinterest;
export const scrapePinterestUrl = scrapeUrl;
export const scrapePinterestBoard = scrapeBoard;

// Check if user has scraping history in their account
export const hasScrapeHistory = async (userId: string) => {
  try {
    const { count, error } = await supabase
      .from("pinterest_analytics")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);
      
    if (error) {
      console.error("Error checking scrape history:", error);
      return false;
    }
    
    return !!count && count > 0;
  } catch (err) {
    console.error("Exception checking scrape history:", err);
    return false;
  }
};

// Get user's scraping history
export const getScrapeHistory = async (userId: string, limit = 10) => {
  try {
    const { data, error } = await supabase
      .from("pinterest_analytics")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit);
      
    if (error) {
      console.error("Error getting scrape history:", error);
      return null;
    }
    
    return data;
  } catch (err) {
    console.error("Exception getting scrape history:", err);
    return null;
  }
};

// Extract keywords from a Pinterest pin URL using Apify
export const extractPinKeywords = async (pinUrl: string) => {
  try {
    const pinData = await scrapeUrl(pinUrl);
    
    if (!pinData || pinData.length === 0) {
      return [];
    }
    
    // Extract keywords from title, description and other attributes
    const keywords = [];
    const pin = pinData[0];
    
    if (pin.title) {
      keywords.push(...pin.title.split(/\s+/).filter((word: string) => word.length > 3));
    }
    
    if (pin.description) {
      keywords.push(...pin.description.split(/\s+/).filter((word: string) => word.length > 3));
    }
    
    // Remove duplicates and common words
    const commonWords = ["and", "the", "this", "that", "with", "for", "from", "have", "your"];
    const uniqueKeywords = [...new Set(keywords)]
      .filter(word => !commonWords.includes(word.toLowerCase()))
      .map(word => word.replace(/[^a-zA-Z0-9]/g, ''));
    
    return uniqueKeywords;
  } catch (error) {
    console.error("Error extracting pin keywords:", error);
    return [];
  }
};

// Analyze a pin for detailed analytics using Apify
export const analyzePinUrl = async (pinUrl: string) => {
  try {
    const pinData = await scrapeUrl(pinUrl);
    
    if (!pinData || pinData.length === 0) {
      throw new Error("No pin data found");
    }
    
    const pin = pinData[0];
    
    // Transform the data into a format similar to what the old API returned
    // This maintains compatibility with existing components
    return {
      success: true,
      data: {
        id: pin.pinId,
        title: pin.title,
        description: pin.description,
        url: pin.pinUrl,
        image_url: pin.imageUrl,
        metrics: {
          saves: pin.savedCount || 0,
          repins: pin.repins || 0,
          comments: pin.commentCount || 0,
          impressions: (pin.savedCount || 0) * 10, // Estimated based on saves
          engagement_rate: (((pin.repins || 0) + (pin.commentCount || 0)) / ((pin.savedCount || 1) * 10) * 100).toFixed(2)
        },
        keywords: extractKeywordsFromText(pin.title + " " + (pin.description || "")),
        insights: generateInsights(pin)
      }
    };
  } catch (error) {
    console.error("Error analyzing pin:", error);
    return null;
  }
};

// Analyze keywords using Apify data
export const analyzeKeywords = async (keyword: string) => {
  try {
    const pinsData = await searchPinterest(keyword, 50);
    
    if (!pinsData || pinsData.length === 0) {
      throw new Error("No pins found for keyword");
    }
    
    // Calculate averages
    const totalSaves = pinsData.reduce((sum, pin) => sum + (pin.savedCount || 0), 0);
    const totalRepins = pinsData.reduce((sum, pin) => sum + (pin.repins || 0), 0);
    const totalComments = pinsData.reduce((sum, pin) => sum + (pin.commentCount || 0), 0);
    const avgSaves = totalSaves / pinsData.length;
    const avgRepins = totalRepins / pinsData.length;
    const avgComments = totalComments / pinsData.length;
    const avgEngagement = avgSaves > 0 ? ((avgRepins + avgComments) / avgSaves) * 100 : 0;
    
    // Get related keywords
    const relatedKeywords = extractRelatedKeywords(pinsData);
    
    // Calculate trend score based on engagement metrics
    const trendScore = Math.min(100, Math.max(1, (avgSaves / 10) + (avgRepins / 5) + (avgComments * 2)));
    
    return {
      success: true,
      data: {
        keyword,
        pins_found: pinsData.length,
        avg_saves: Math.round(avgSaves),
        avg_repins: Math.round(avgRepins),
        avg_comments: Math.round(avgComments),
        avg_engagement: avgEngagement.toFixed(2),
        keywords: relatedKeywords.map(k => ({ 
          keyword: k.keyword, 
          frequency: k.count,
          trend_score: Math.round(trendScore * (k.count / relatedKeywords[0].count))
        })),
        insights: generateKeywordInsights(keyword, pinsData, avgSaves, avgRepins)
      }
    };
  } catch (error) {
    console.error("Error analyzing keywords:", error);
    return null;
  }
};

// Helper function to extract keywords from text
const extractKeywordsFromText = (text: string) => {
  if (!text) return [];
  
  // Split by spaces and non-alphanumeric characters
  const words = text.toLowerCase().split(/\W+/);
  
  // Filter out common words and short words
  const commonWords = ["and", "the", "this", "that", "with", "for", "from", "have", "your", "will", "about", "there", "their"];
  const filteredWords = words.filter(word => 
    word.length > 3 && !commonWords.includes(word)
  );
  
  // Count occurrences
  const wordCounts: {[key: string]: number} = {};
  filteredWords.forEach(word => {
    wordCounts[word] = (wordCounts[word] || 0) + 1;
  });
  
  // Convert to array and sort
  return Object.entries(wordCounts)
    .map(([keyword, count]) => ({ keyword, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)
    .map(item => item.keyword);
};

// Helper function to extract related keywords from pins
const extractRelatedKeywords = (pins: any[]) => {
  // Combine all text from pins
  const allText = pins
    .map(pin => `${pin.title || ""} ${pin.description || ""}`)
    .join(" ");
  
  // Get keywords
  const words = allText.toLowerCase().split(/\W+/);
  
  // Filter and count
  const commonWords = ["and", "the", "this", "that", "with", "for", "from", "have", "your", "will", "about"];
  const wordCounts: {[key: string]: number} = {};
  
  words.forEach(word => {
    if (word.length > 3 && !commonWords.includes(word)) {
      wordCounts[word] = (wordCounts[word] || 0) + 1;
    }
  });
  
  // Convert to array and sort
  return Object.entries(wordCounts)
    .map(([keyword, count]) => ({ keyword, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 15);
};

// Generate insights for a pin
const generateInsights = (pin: any) => {
  const insights = [];
  
  // Title insights
  if (pin.title && pin.title.length < 20) {
    insights.push("Consider using a longer, more descriptive title to improve visibility.");
  } else if (pin.title && pin.title.length > 60) {
    insights.push("Your title is quite long. Consider making it more concise while keeping keywords.");
  }
  
  // Description insights
  if (!pin.description || pin.description.length < 30) {
    insights.push("Add a detailed description with relevant keywords to increase search visibility.");
  }
  
  // Engagement insights
  if ((pin.savedCount || 0) > 100) {
    insights.push(`This pin has good save metrics (${pin.savedCount} saves), indicating strong audience interest.`);
  }
  
  if ((pin.repins || 0) > 50) {
    insights.push(`With ${pin.repins} repins, this content has good viral potential.`);
  }
  
  if ((pin.commentCount || 0) > 10) {
    insights.push(`${pin.commentCount} comments indicate good audience engagement.`);
  }
  
  // Add general insights if we don't have enough
  if (insights.length < 3) {
    insights.push("Using high-quality images with a 2:3 aspect ratio typically performs best on Pinterest.");
    insights.push("Consider creating a series of related pins to boost visibility across the platform.");
    insights.push("Adding text overlay to your image can increase engagement rates by 30%.");
  }
  
  return insights;
};

// Generate insights for keywords
const generateKeywordInsights = (keyword: string, pins: any[], avgSaves: number, avgRepins: number) => {
  const insights = [];
  
  // Keyword competition insights
  if (pins.length > 30) {
    insights.push(`"${keyword}" has ${pins.length} results, indicating high competition. Consider using more specific keywords.`);
  } else if (pins.length < 10) {
    insights.push(`"${keyword}" returned only ${pins.length} pins, suggesting a niche opportunity with low competition.`);
  }
  
  // Engagement insights
  if (avgSaves > 50) {
    insights.push(`Pins with this keyword average ${Math.round(avgSaves)} saves, indicating good audience interest.`);
  } else if (avgSaves < 10) {
    insights.push(`Low average saves (${Math.round(avgSaves)}) suggest this keyword may not be driving significant engagement.`);
  }
  
  if (avgRepins > 20) {
    insights.push(`High average repins (${Math.round(avgRepins)}) indicate content with this keyword has viral potential.`);
  }
  
  // Add general insights
  insights.push(`For "${keyword}", create pins with clear, high-quality images and descriptive text overlays for maximum impact.`);
  insights.push(`Consider creating themed collections around "${keyword}" to improve visibility in Pinterest's algorithm.`);
  
  return insights;
};
