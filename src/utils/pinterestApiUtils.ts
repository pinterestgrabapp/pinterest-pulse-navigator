
import { supabase } from "@/integrations/supabase/client";

// Pinterest API configuration - updated to use v5
export const PINTEREST_API_URL = "https://api.pinterest.com/v5";
export const PINTEREST_AUTH_URL = "https://www.pinterest.com/oauth";

// Make sure the redirect URI uses the full URL including the protocol
export const PINTEREST_REDIRECT_URI = `${window.location.origin}/pinterest-callback`;

// Pinterest API scopes - adding all needed scopes
export const PINTEREST_SCOPES = [
  "boards:read",
  "pins:read",
  "user_accounts:read",
  "pins:write",
  "boards:write"
].join(",");

// Get Pinterest API credentials
export const PINTEREST_APP_ID = import.meta.env.VITE_PINTEREST_APP_ID || "1510337";

// Helper function to generate Pinterest OAuth URL
export const getPinterestAuthUrl = () => {
  const state = generateRandomString(32);
  localStorage.setItem("pinterest_auth_state", state);
  
  const authUrl = `${PINTEREST_AUTH_URL}?client_id=${PINTEREST_APP_ID}&redirect_uri=${encodeURIComponent(PINTEREST_REDIRECT_URI)}&response_type=code&scope=${encodeURIComponent(PINTEREST_SCOPES)}&state=${state}`;
  console.log("Generated Pinterest auth URL:", authUrl);
  return authUrl;
};

// Function to open Pinterest auth in a popup window
export const openPinterestAuthPopup = () => {
  const authUrl = getPinterestAuthUrl();
  const width = 600;
  const height = 700;
  const left = window.innerWidth / 2 - width / 2;
  const top = window.innerHeight / 2 - height / 2;
  
  // Open popup window with specified dimensions and position
  const popup = window.open(
    authUrl,
    "Pinterest Authorization",
    `width=${width},height=${height},left=${left},top=${top},location=yes,toolbar=no,menubar=no`
  );
  
  // Check if popup was blocked
  if (!popup || popup.closed || typeof popup.closed === 'undefined') {
    console.error("Pinterest popup was blocked. Please allow popups for this site.");
    alert("Pinterest popup was blocked. Please allow popups for this site.");
    // Fallback to redirect
    window.location.href = authUrl;
    return null;
  }
  
  return popup;
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
  try {
    const { data, error } = await supabase
      .from("pinterest_credentials")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle(); // Using maybeSingle instead of single to avoid errors when no record is found
      
    if (error) {
      console.error("Error checking Pinterest connection:", error);
      return false;
    }
    
    return !!data && !!data.access_token;
  } catch (err) {
    console.error("Exception checking Pinterest connection:", err);
    return false;
  }
};

// Get Pinterest credentials for user
export const getPinterestCredentials = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from("pinterest_credentials")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle(); // Using maybeSingle instead of single
      
    if (error) {
      console.error("Error getting Pinterest credentials:", error);
      return null;
    }
    
    return data;
  } catch (err) {
    console.error("Exception getting Pinterest credentials:", err);
    return null;
  }
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
