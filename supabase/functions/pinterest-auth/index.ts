
// This is a Supabase Edge Function that handles the Pinterest OAuth flow
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

// Set up the Pinterest API credentials
const PINTEREST_APP_ID = Deno.env.get("PINTEREST_APP_ID") || "1510337";
const PINTEREST_APP_SECRET = Deno.env.get("PINTEREST_APP_SECRET") || "2395c3a967f542bc95dc867a07c6a40e40ee9fe1";

// Function to exchange the authorization code for an access token
async function exchangeCodeForToken(code: string, redirectUri: string) {
  try {
    console.log("Exchanging code for token with redirect URI:", redirectUri);
    console.log("Using App ID:", PINTEREST_APP_ID);
    
    // Build the request body for debugging
    const params = new URLSearchParams({
      grant_type: "authorization_code",
      code: code,
      redirect_uri: redirectUri,
      client_id: PINTEREST_APP_ID,
      client_secret: PINTEREST_APP_SECRET,
    });
    
    console.log("Token exchange request parameters:", params.toString());
    
    const tokenResponse = await fetch("https://api.pinterest.com/v5/oauth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params,
    });

    const responseText = await tokenResponse.text();
    console.log("Token response status:", tokenResponse.status);
    console.log("Token response headers:", JSON.stringify(Object.fromEntries(tokenResponse.headers.entries())));
    
    if (!tokenResponse.ok) {
      console.error("Pinterest token exchange error:", responseText);
      throw new Error(`Pinterest API error: ${responseText}`);
    }

    try {
      return JSON.parse(responseText);
    } catch (e) {
      console.error("Error parsing token response:", e);
      throw new Error(`Error parsing token response: ${responseText}`);
    }
  } catch (error) {
    console.error("Error exchanging code for token:", error);
    throw error;
  }
}

// Function to get user info from Pinterest API
async function getPinterestUserInfo(accessToken: string) {
  try {
    const userResponse = await fetch("https://api.pinterest.com/v5/user_account", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!userResponse.ok) {
      const errorText = await userResponse.text();
      console.error("Pinterest user info error:", errorText);
      try {
        const errorData = JSON.parse(errorText);
        throw new Error(`Pinterest API error: ${JSON.stringify(errorData)}`);
      } catch (e) {
        throw new Error(`Pinterest API error: ${errorText}`);
      }
    }

    return await userResponse.json();
  } catch (error) {
    console.error("Error getting Pinterest user info:", error);
    throw error;
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { code, userId, redirectUri } = await req.json();
    
    console.log("Processing Pinterest auth with code and userId:", { codePresent: !!code, userId });
    console.log("Redirect URI received:", redirectUri);

    // Validate required parameters
    if (!code) {
      return new Response(
        JSON.stringify({ error: "Missing authorization code" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (!userId) {
      return new Response(
        JSON.stringify({ error: "Missing user ID" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (!redirectUri) {
      return new Response(
        JSON.stringify({ error: "Missing redirect URI" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Exchange the authorization code for an access token
    const tokenData = await exchangeCodeForToken(code, redirectUri);
    console.log("Token exchange successful");

    // Get Pinterest user info
    const userInfo = await getPinterestUserInfo(tokenData.access_token);
    console.log("User info retrieved:", userInfo.username);

    // Connect to Supabase API using the supplied environment variables
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Missing Supabase environment variables");
    }

    // Store the credentials in the database
    const storeResponse = await fetch(`${SUPABASE_URL}/rest/v1/pinterest_credentials`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        "apikey": SUPABASE_SERVICE_ROLE_KEY,
        "Prefer": "resolution=merge-duplicates",
      },
      body: JSON.stringify({
        user_id: userId,
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token,
        expires_at: new Date(Date.now() + tokenData.expires_in * 1000).toISOString(),
        pinterest_user_id: userInfo.id,
        username: userInfo.username,
      }),
    });

    if (!storeResponse.ok) {
      const errorText = await storeResponse.text();
      console.error("Error storing credentials:", errorText);
      throw new Error(`Supabase API error: ${errorText}`);
    }

    console.log("Pinterest credentials stored successfully");

    // Add a log entry to confirm completion
    console.log(`Pinterest authentication completed successfully for user ${userId} (${userInfo.username})`);
    
    // Return success response
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Pinterest authentication successful", 
        username: userInfo.username 
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error in Pinterest auth function:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
