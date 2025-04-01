
import { createClient } from '@supabase/supabase-js';

// Make sure these environment variables are defined and accessible
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Add fallback values or throw more descriptive errors if environment variables are missing
if (!supabaseUrl) {
  console.error('VITE_SUPABASE_URL environment variable is not defined');
}

if (!supabaseAnonKey) {
  console.error('VITE_SUPABASE_ANON_KEY environment variable is not defined');
}

export const supabase = createClient(
  supabaseUrl || '',  // Provide an empty string as fallback to prevent runtime error
  supabaseAnonKey || '',  // Provide an empty string as fallback to prevent runtime error
  {
    db: {
      schema: 'public',
    },
  }
);

// Add specific types for database tables to help with TypeScript
export type Tables = {
  pins: Record<string, any>;
  pin_limits: Record<string, any>;
  pinterest_credentials: Record<string, any>;
  profiles: Record<string, any>;
  user_scrapes: Record<string, any>;
  scheduled_pins: Record<string, any>;
  pin_templates: Record<string, any>;
  ad_campaigns: Record<string, any>;
  workspaces: Record<string, any>;
  workspace_collaborators: Record<string, any>;
  ecommerce_integrations: Record<string, any>;
  content_calendar: Record<string, any>;
};
