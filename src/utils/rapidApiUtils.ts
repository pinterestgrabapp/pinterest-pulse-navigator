
import { supabase } from "@/integrations/supabase/client";

// Define interfaces for RapidAPI Pinterest Scraper
export interface RapidAPIPinterestResponse {
  success: boolean;
  message?: string;
  data?: any;
}

export interface PinterestPinResult {
  title: string;
  description?: string;
  link?: string;
  pinId: string;
  pinUrl: string;
  imageUrl: string;
  boardName?: string;
  boardUrl?: string;
  userName?: string;
  userProfileUrl?: string;
  repins?: number;
  savedCount?: number;
  commentCount?: number;
  reactionCounts?: Record<string, number>;
}

// Base function to make requests to RapidAPI Pinterest Scraper
async function callRapidApi(endpoint: string, body: any): Promise<RapidAPIPinterestResponse> {
  try {
    // Get RapidAPI key from Supabase secrets
    const { data: secretData, error } = await supabase.functions.invoke("get-rapidapi-key", {});
    
    if (error) {
      console.error('Error getting RapidAPI key:', error);
      return { success: false, message: `Error getting API key: ${error.message}` };
    }
    
    const rapidApiKey = secretData?.key;
    
    if (!rapidApiKey) {
      console.error('RapidAPI key not found');
      
      // Try using a hardcoded key as a fallback for demo purposes only
      console.warn('Using fallback RapidAPI key');
      const fallbackKey = "1302df995emsh94434bcd769c0cap1edfdfjsnfd73232ea78c";
      
      // Make the request to RapidAPI with the fallback key
      try {
        const response = await fetch(`https://pinterest-scraper.p.rapidapi.com/social-media/pinterest-scraper/${endpoint}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-RapidAPI-Key': fallbackKey,
            'X-RapidAPI-Host': 'pinterest-scraper.p.rapidapi.com'
          },
          body: JSON.stringify(body)
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`RapidAPI error (${response.status}) with fallback key:`, errorText);
          return { success: false, message: `API error: ${response.status} ${response.statusText}` };
        }

        const data = await response.json();
        return { success: true, data };
      } catch (error) {
        console.error('Error in fallback RapidAPI call:', error);
        return { success: false, message: 'Fallback API key failed' };
      }
    }

    // Make the request to RapidAPI
    const response = await fetch(`https://pinterest-scraper.p.rapidapi.com/social-media/pinterest-scraper/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-RapidAPI-Key': rapidApiKey,
        'X-RapidAPI-Host': 'pinterest-scraper.p.rapidapi.com'
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`RapidAPI error (${response.status}):`, errorText);
      return { 
        success: false, 
        message: `API error: ${response.status} ${response.statusText}` 
      };
    }

    const data = await response.json();
    
    // Store analytics data if user is logged in
    const { data: { user } } = await supabase.auth.getUser();
    if (user?.id) {
      try {
        const { error } = await supabase.from("pinterest_analytics").insert({
          user_id: user.id,
          type: endpoint,
          query: JSON.stringify(body),
          results: data
        });
        if (error) console.error("Error storing analytics:", error);
      } catch (err) {
        console.error("Exception storing analytics:", err);
      }
    }
    
    return { success: true, data };
  } catch (error) {
    console.error('Error in RapidAPI call:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

// Get pin details by URL
export async function getPinDetails(pinUrl: string): Promise<RapidAPIPinterestResponse> {
  return callRapidApi('posts', { url: pinUrl });
}

// Search pins by keyword
export async function searchPins(keyword: string): Promise<RapidAPIPinterestResponse> {
  return callRapidApi('posts-by-keyword', { keyword });
}

// Get pins from a profile
export async function getProfilePins(profileUrl: string): Promise<RapidAPIPinterestResponse> {
  return callRapidApi('posts-by-profile', { url: profileUrl });
}

// Get profile details
export async function getProfileDetails(profileUrl: string): Promise<RapidAPIPinterestResponse> {
  return callRapidApi('profiles', { url: profileUrl });
}

// Search for profiles by keyword
export async function searchProfiles(keyword: string): Promise<RapidAPIPinterestResponse> {
  return callRapidApi('profiles-by-keyword', { keyword });
}

// Transform RapidAPI response to our standard format
export function transformPinData(data: any): PinterestPinResult[] {
  if (!data || !Array.isArray(data.posts)) {
    return [];
  }
  
  return data.posts.map((item: any) => ({
    title: item.title || '',
    description: item.description || '',
    link: item.link || '',
    pinId: item.id || '',
    pinUrl: item.url || '',
    imageUrl: item.image || '',
    boardName: item.board?.name || '',
    boardUrl: item.board?.url || '',
    userName: item.creator?.name || '',
    userProfileUrl: item.creator?.url || '',
    repins: item.stats?.repins || 0,
    savedCount: item.stats?.saves || 0,
    commentCount: item.stats?.comments || 0
  }));
}
