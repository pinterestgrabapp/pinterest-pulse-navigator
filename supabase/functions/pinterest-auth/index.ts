
// Follow Deno conventions for imports
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';
import { corsHeaders } from '../_shared/cors.ts';

// Pinterest API constants
const PINTEREST_TOKEN_URL = "https://api.pinterest.com/v5/oauth/token";

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { code } = await req.json();
    
    if (!code) {
      return new Response(
        JSON.stringify({ error: "No authorization code provided" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get environment variables
    const pinterestAppId = Deno.env.get("PINTEREST_APP_ID");
    const pinterestAppSecret = Deno.env.get("PINTEREST_APP_SECRET");
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    // Validate we have all required secrets
    if (!pinterestAppId || !pinterestAppSecret || !supabaseUrl || !supabaseServiceKey) {
      console.error("Missing required environment variables");
      return new Response(
        JSON.stringify({ error: "Server configuration error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Extract the origin for the redirect URI
    const origin = req.headers.get("origin") || "https://yourdomain.com";
    const redirectUri = `${origin}/pinterest-callback`;

    // Prepare the request to exchange code for access token
    const formData = new URLSearchParams();
    formData.append("grant_type", "authorization_code");
    formData.append("code", code);
    formData.append("redirect_uri", redirectUri);
    
    console.log(`Exchanging code for token with redirect URI: ${redirectUri}`);
    
    // Make request to Pinterest API to exchange code for token
    const response = await fetch(PINTEREST_TOKEN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": `Basic ${btoa(`${pinterestAppId}:${pinterestAppSecret}`)}`
      },
      body: formData.toString()
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      console.error("Pinterest API error:", data);
      return new Response(
        JSON.stringify({ error: "Failed to exchange code for token", details: data }),
        { status: response.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Get user ID from the request headers
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.split(" ")[1];
    
    if (!token) {
      return new Response(
        JSON.stringify({ error: "Authentication required" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Initialize Supabase client with service role key for admin access
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Verify the user token and get user ID
    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !userData.user) {
      console.error("Error getting user:", userError);
      return new Response(
        JSON.stringify({ error: "Invalid user token" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    const userId = userData.user.id;
    
    // Calculate expiration date
    const expiresAt = new Date();
    expiresAt.setSeconds(expiresAt.getSeconds() + data.expires_in);
    
    // Store the credentials in Supabase
    const { error } = await supabase
      .from("pinterest_credentials")
      .upsert({
        user_id: userId,
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        expires_at: expiresAt.toISOString(),
        updated_at: new Date().toISOString()
      });
    
    if (error) {
      console.error("Error storing credentials:", error);
      return new Response(
        JSON.stringify({ error: "Failed to store credentials" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
    
  } catch (error) {
    console.error("Server error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error", message: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
