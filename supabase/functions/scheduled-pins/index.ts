
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Create a Supabase client with the service role key
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check if this is a scheduled invocation
    const currentTime = new Date();
    
    // Get pins that are scheduled for now or in the past and still have 'scheduled' status
    const { data: pinsToPost, error } = await supabase
      .from('scheduled_pins')
      .select('*')
      .eq('status', 'scheduled')
      .lte('scheduled_time', currentTime.toISOString());
    
    if (error) {
      console.error('Error fetching scheduled pins:', error);
      return new Response(JSON.stringify({ error: error.message }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }

    console.log(`Found ${pinsToPost?.length || 0} pins to post`);
    
    // Process each pin that needs to be posted
    const results = [];
    
    for (const pin of pinsToPost || []) {
      try {
        // Get Pinterest credentials for the user
        const { data: credentials, error: credError } = await supabase
          .from('pinterest_credentials')
          .select('*')
          .eq('user_id', pin.user_id)
          .single();
        
        if (credError || !credentials?.access_token) {
          console.error(`No valid Pinterest credentials for user ${pin.user_id}`);
          // Update pin status to failed
          await supabase
            .from('scheduled_pins')
            .update({ status: 'failed' })
            .eq('id', pin.id);
          
          results.push({ id: pin.id, status: 'failed', reason: 'No valid Pinterest credentials' });
          continue;
        }
        
        // In a real implementation, you would call the Pinterest API to create the pin
        // For this example, we'll just simulate a successful post
        console.log(`Posting pin ${pin.id} to Pinterest board ${pin.board_id}`);
        
        // Update pin status to posted
        await supabase
          .from('scheduled_pins')
          .update({ status: 'posted' })
          .eq('id', pin.id);
        
        results.push({ id: pin.id, status: 'posted' });
      } catch (err) {
        console.error(`Error posting pin ${pin.id}:`, err);
        
        // Update pin status to failed
        await supabase
          .from('scheduled_pins')
          .update({ status: 'failed' })
          .eq('id', pin.id);
        
        results.push({ id: pin.id, status: 'failed', reason: err.message });
      }
    }
    
    return new Response(
      JSON.stringify({ 
        message: `Processed ${results.length} scheduled pins`,
        results 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (err) {
    console.error('Error in scheduled pins function:', err);
    
    return new Response(
      JSON.stringify({ error: err.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
