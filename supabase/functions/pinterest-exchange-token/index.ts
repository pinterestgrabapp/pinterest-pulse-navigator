
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const PINTEREST_API_URL = "https://api.pinterest.com/v5/oauth/token";
const CLIENT_ID = Deno.env.get("PINTEREST_CLIENT_ID") || "";
const CLIENT_SECRET = Deno.env.get("PINTEREST_CLIENT_SECRET") || "";
const REDIRECT_URI = Deno.env.get("PINTEREST_REDIRECT_URI") || "";

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  }

  try {
    // Only allow POST requests
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }

    // Parse the request body
    const { code } = await req.json();

    if (!code) {
      return new Response(JSON.stringify({ error: "Authorization code is required" }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }

    // Check if required environment variables are set
    if (!CLIENT_ID || !CLIENT_SECRET || !REDIRECT_URI) {
      return new Response(
        JSON.stringify({ error: "Pinterest API credentials not configured" }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }

    // Prepare the request to exchange code for token
    const formData = new URLSearchParams();
    formData.append("grant_type", "authorization_code");
    formData.append("code", code);
    formData.append("client_id", CLIENT_ID);
    formData.append("client_secret", CLIENT_SECRET);
    formData.append("redirect_uri", REDIRECT_URI);

    // Send the request to Pinterest
    const response = await fetch(PINTEREST_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
    });

    // Parse the response
    const data = await response.json();

    if (!response.ok) {
      console.error("Pinterest API error:", data);
      return new Response(
        JSON.stringify({
          error: "Failed to exchange authorization code for access token",
          details: data,
        }),
        {
          status: response.status,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }

    // Return the access token
    return new Response(JSON.stringify(data), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error", details: error.message }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }
});
