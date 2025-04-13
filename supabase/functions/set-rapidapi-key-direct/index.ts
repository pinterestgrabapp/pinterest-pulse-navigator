
// Supabase Edge Function for directly setting the RapidAPI key 
// This is a simplified version that hard-codes the key just to get things working
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Hard-code the RapidAPI key provided by the user
    const rapidApiKey = "1302df995emsh94434bcd769c0cap1edfdfjsnfd73232ea78c";
    
    // Create an environment variable with the key
    Deno.env.set("RAPIDAPI_KEY", rapidApiKey);
    
    return new Response(
      JSON.stringify({ 
        success: true,
        message: "RapidAPI key has been set directly" 
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
