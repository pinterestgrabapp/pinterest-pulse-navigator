
// Supabase Edge Function for Apify Pinterest Scraper integration
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Define request type
interface ApifyPinterestRequest {
  startUrls?: Array<{ url: string }>;
  search?: string;
  resultsPerPage?: number; 
  maxItems?: number;
  endPage?: number;
  userId?: string;
}

// CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get API key from edge function secrets
    const APIFY_API_KEY = Deno.env.get("APIFY_API_KEY");
    
    if (!APIFY_API_KEY) {
      return new Response(
        JSON.stringify({ 
          error: "API key not configured", 
          message: "APIFY_API_KEY is not set in the edge function secrets" 
        }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Parse request body
    const requestData: ApifyPinterestRequest = await req.json();
    
    // Default parameters
    const {
      startUrls,
      search,
      resultsPerPage = 100,
      maxItems = 100,
      endPage = 1,
    } = requestData;
    
    // Validate input - at least one of startUrls or search must be provided
    if (!startUrls?.length && !search) {
      return new Response(
        JSON.stringify({ 
          error: "Invalid input", 
          message: "Either 'startUrls' or 'search' parameter must be provided" 
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Configure actor input
    const actorInput = {
      startUrls,
      search,
      resultsPerPage,
      maxItems,
      endPage,
    };
    
    console.log("Sending request to Apify with input:", JSON.stringify(actorInput));
    
    // Call the Apify API
    const response = await fetch(
      "https://api.apify.com/v2/acts/epctex~pinterest-scraper/run-sync?token=" + APIFY_API_KEY,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(actorInput),
      }
    );
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Apify API error:", errorText);
      return new Response(
        JSON.stringify({ error: "Apify API error", message: errorText }),
        { status: response.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Parse and return actor results
    const responseData = await response.json();
    
    // Store the results in our database if userId is provided
    if (requestData.userId) {
      try {
        const { createClient } = await import("https://esm.sh/@supabase/supabase-js@2");
        const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
        const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
        
        const supabase = createClient(supabaseUrl, supabaseServiceKey);
        
        // Store the analytics data
        await supabase.from("pinterest_analytics").insert({
          user_id: requestData.userId,
          type: search ? 'search' : 'pin_scrape',
          query: search || (startUrls ? JSON.stringify(startUrls) : ''),
          results: responseData,
        });
      } catch (error) {
        console.error("Error storing results in database:", error);
        // Continue anyway - we'll still return the results to the client
      }
    }
    
    return new Response(
      JSON.stringify(responseData),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
    
  } catch (error) {
    console.error("Edge function error:", error);
    return new Response(
      JSON.stringify({ error: "Server error", message: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
