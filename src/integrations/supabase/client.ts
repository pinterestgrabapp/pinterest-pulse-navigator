
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  db: {
    schema: 'public',
  },
});

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
