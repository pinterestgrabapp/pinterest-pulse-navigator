
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  // Get the request method and path
  const { method, url } = req;
  const requestUrl = new URL(url);
  const path = requestUrl.pathname.split('/').pop();
  
  // Initialize Supabase client
  const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  
  try {
    // Process scheduled pins
    if (method === 'POST' && path === 'process') {
      console.log("Processing scheduled pins...");
      
      // Get current time
      const now = new Date();
      
      // Get pins that are scheduled to be posted now or in the past
      const { data: scheduledPins, error } = await supabase
        .from('scheduled_pins')
        .select('*, pinterest_credentials!inner(*)')
        .eq('status', 'scheduled')
        .lte('scheduled_time', now.toISOString())
        .order('scheduled_time', { ascending: true });
      
      if (error) {
        console.error("Error fetching scheduled pins:", error);
        return new Response(
          JSON.stringify({ error: "Failed to fetch scheduled pins" }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        );
      }
      
      console.log(`Found ${scheduledPins?.length || 0} pins to process`);
      
      const results = [];
      
      // Process each scheduled pin
      if (scheduledPins && scheduledPins.length > 0) {
        for (const pin of scheduledPins) {
          try {
            // In a real implementation, this would call the Pinterest API to create the pin
            // For this demo, we'll simulate a successful pin creation
            console.log(`Processing pin: ${pin.title}`);
            
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Update pin status to 'posted'
            const { data: updatedPin, error: updateError } = await supabase
              .from('scheduled_pins')
              .update({ status: 'posted' })
              .eq('id', pin.id)
              .select()
              .single();
            
            if (updateError) {
              console.error(`Error updating pin ${pin.id}:`, updateError);
              results.push({
                id: pin.id,
                title: pin.title,
                success: false,
                error: updateError.message
              });
              continue;
            }
            
            results.push({
              id: pin.id,
              title: pin.title,
              success: true
            });
            
            // Add to content calendar if it's not already there
            const { data: existingEvent } = await supabase
              .from('content_calendar')
              .select('*')
              .eq('pin_id', pin.id)
              .maybeSingle();
            
            if (!existingEvent) {
              await supabase
                .from('content_calendar')
                .insert({
                  user_id: pin.user_id,
                  title: `Published: ${pin.title}`,
                  description: pin.description,
                  event_type: 'pin',
                  event_date: new Date().toISOString(),
                  pin_id: pin.id,
                  color: '#ea384c'
                });
            }
          } catch (err) {
            console.error(`Error processing pin ${pin.id}:`, err);
            results.push({
              id: pin.id,
              title: pin.title,
              success: false,
              error: err.message
            });
          }
        }
      }
      
      return new Response(
        JSON.stringify({ 
          processed: results.length,
          successful: results.filter(r => r.success).length,
          failed: results.filter(r => !r.success).length,
          results 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Get pin status
    if (method === 'GET' && path === 'status') {
      const userId = requestUrl.searchParams.get('userId');
      
      if (!userId) {
        return new Response(
          JSON.stringify({ error: "User ID is required" }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        );
      }
      
      // Get stats about scheduled pins
      const { data: stats, error } = await supabase
        .from('scheduled_pins')
        .select('status, count')
        .eq('user_id', userId)
        .group('status');
      
      if (error) {
        console.error("Error fetching pin stats:", error);
        return new Response(
          JSON.stringify({ error: "Failed to fetch pin stats" }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        );
      }
      
      // Format the stats
      const formattedStats = {
        scheduled: 0,
        posted: 0,
        failed: 0
      };
      
      stats?.forEach(stat => {
        formattedStats[stat.status] = parseInt(stat.count);
      });
      
      return new Response(
        JSON.stringify(formattedStats),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Return 404 for unknown paths
    return new Response(
      JSON.stringify({ error: "Not found" }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
    );
  } catch (err) {
    console.error("Unexpected error:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
