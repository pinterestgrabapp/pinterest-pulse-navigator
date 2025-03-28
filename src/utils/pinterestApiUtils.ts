
import { supabase } from "@/integrations/supabase/client";

// Pinterest API configuration
export const PINTEREST_API_URL = "https://api.pinterest.com/v5";
export const PINTEREST_AUTH_URL = "https://www.pinterest.com/oauth";
export const PINTEREST_REDIRECT_URI = `${window.location.origin}/pinterest-callback`;

// Pinterest API scopes
export const PINTEREST_SCOPES = [
  "boards:read",
  "pins:read",
  "user_accounts:read",
  "pins:write",
  "boards:write"
].join(",");

// Get Pinterest API credentials - needs to be set up in your Pinterest Developer account
export const PINTEREST_APP_ID = "YOUR_PINTEREST_APP_ID"; // Replace with your actual App ID

// Helper function to generate Pinterest OAuth URL
export const getPinterestAuthUrl = () => {
  const state = generateRandomString(32);
  localStorage.setItem("pinterest_auth_state", state);
  
  return `${PINTEREST_AUTH_URL}?client_id=${PINTEREST_APP_ID}&redirect_uri=${encodeURIComponent(PINTEREST_REDIRECT_URI)}&response_type=code&scope=${encodeURIComponent(PINTEREST_SCOPES)}&state=${state}`;
};

// Generate a random string for state parameter
const generateRandomString = (length: number) => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

// Check if user has connected their Pinterest account
export const isPinterestConnected = async (userId: string) => {
  const { data, error } = await supabase
    .from("pinterest_credentials")
    .select("*")
    .eq("user_id", userId)
    .single();
    
  if (error) {
    console.error("Error checking Pinterest connection:", error);
    return false;
  }
  
  return !!data && !!data.access_token;
};

// Get Pinterest credentials for user
export const getPinterestCredentials = async (userId: string) => {
  const { data, error } = await supabase
    .from("pinterest_credentials")
    .select("*")
    .eq("user_id", userId)
    .single();
    
  if (error) {
    console.error("Error getting Pinterest credentials:", error);
    return null;
  }
  
  return data;
};

// Fetch Pinterest pins for the authenticated user
export const fetchUserPins = async (accessToken: string) => {
  try {
    const response = await fetch(`${PINTEREST_API_URL}/user_pins`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      }
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching user pins:", error);
    return null;
  }
};

// Fetch Pinterest boards for the authenticated user
export const fetchUserBoards = async (accessToken: string) => {
  try {
    const response = await fetch(`${PINTEREST_API_URL}/boards`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      }
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching user boards:", error);
    return null;
  }
};

// Create a new Pinterest pin
export const createPin = async (accessToken: string, pinData: any) => {
  try {
    const response = await fetch(`${PINTEREST_API_URL}/pins`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(pinData)
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating pin:", error);
    return null;
  }
};

// Extract keywords from a Pinterest pin URL
export const extractPinKeywords = async (pinUrl: string, accessToken: string) => {
  try {
    // Extract the pin ID from the URL
    const pinIdMatch = pinUrl.match(/pin\/(\d+)/);
    if (!pinIdMatch) throw new Error("Invalid Pinterest pin URL");
    
    const pinId = pinIdMatch[1];
    
    // Fetch the pin details
    const response = await fetch(`${PINTEREST_API_URL}/pins/${pinId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      }
    });
    
    const data = await response.json();
    
    // Extract keywords from title, description and other attributes
    const keywords = [];
    
    if (data.title) {
      keywords.push(...data.title.split(/\s+/).filter((word: string) => word.length > 3));
    }
    
    if (data.description) {
      keywords.push(...data.description.split(/\s+/).filter((word: string) => word.length > 3));
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
