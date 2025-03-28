
// This is a Supabase Edge Function that handles the Pinterest OAuth flow
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

// Set up the Pinterest API credentials
const PINTEREST_APP_ID = Deno.env.get("PINTEREST_APP_ID") || "";
const PINTEREST_APP_SECRET = Deno.env.get("PINTEREST_APP_SECRET") || "";
const PINTEREST_REDIRECT_URI = Deno.env.get("PINTEREST_REDIRECT_URI") || "";

// Function to exchange the authorization code for an access token
async function exchangeCodeForToken(code: string) {
  try {
    const tokenResponse = await fetch("https://api.pinterest.com/v5/oauth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code: code,
        redirect_uri: PINTEREST_REDIRECT_URI,
        client_id: PINTEREST_APP_ID,
        client_secret: PINTEREST_APP_SECRET,
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json();
      console.error("Pinterest token exchange error:", errorData);
      throw new Error(`Pinterest API error: ${JSON.stringify(errorData)}`);
    }

    return await tokenResponse.json();
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
      const errorData = await userResponse.json();
      console.error("Pinterest user info error:", errorData);
      throw new Error(`Pinterest API error: ${JSON.stringify(errorData)}`);
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
    // Parse the request URL
    const url = new URL(req.url);
    const code = url.searchParams.get("code");
    const userId = url.searchParams.get("userId");
    const state = url.searchParams.get("state");

    // Validate required parameters
    if (!code || !userId) {
      return new Response(
        JSON.stringify({ error: "Missing required parameters" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Exchange the authorization code for an access token
    const tokenData = await exchangeCodeForToken(code);
    console.log("Token exchange successful");

    // Get Pinterest user info
    const userInfo = await getPinterestUserInfo(tokenData.access_token);
    console.log("User info retrieved:", userInfo.username);

    // Connect to Supabase API using the supplied SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

    // Store the credentials in the database
    const storeResponse = await fetch(`${SUPABASE_URL}/rest/v1/pinterest_credentials`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        "apikey": `${SUPABASE_SERVICE_ROLE_KEY}`,
        "Prefer": "resolution=merge-duplicates",
      },
      body: JSON.stringify({
        user_id: userId,
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token,
        expires_at: new Date(Date.now() + tokenData.expires_in * 1000).toISOString(),
      }),
    });

    if (!storeResponse.ok) {
      const errorData = await storeResponse.json();
      console.error("Error storing credentials:", errorData);
      throw new Error(`Supabase API error: ${JSON.stringify(errorData)}`);
    }

    console.log("Pinterest credentials stored successfully");

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
  } catch (error) {
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
