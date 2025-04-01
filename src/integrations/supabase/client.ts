
import { createClient } from '@supabase/supabase-js';

// Use the actual values from Supabase project secrets
const supabaseUrl = 'https://nfmstsrqfyhpooikhfns.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5mbXN0c3JxZnlocG9vaWtoZm5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIwNzE5MjYsImV4cCI6MjA1NzY0NzkyNn0.vwSrJzvsIHuxMOxPEc8JpR6Z75OqHsst7masA58cMng';

// Create the Supabase client
export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
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
