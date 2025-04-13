
import { supabase } from "@/integrations/supabase/client";

/**
 * Initialize the RapidAPI key by calling a special edge function
 * This should be called once at app startup to set the key
 */
export async function initializeRapidApiKey(): Promise<boolean> {
  try {
    console.log("Attempting to initialize RapidAPI key...");
    
    const { data, error } = await supabase.functions.invoke(
      "set-rapidapi-key-direct", 
      { body: {} }
    );
    
    if (error) {
      console.error("Failed to initialize RapidAPI key:", error);
      return false;
    }
    
    console.log("RapidAPI key initialized successfully:", data);
    return true;
  } catch (err) {
    console.error("Error initializing RapidAPI key:", err);
    return false;
  }
}
