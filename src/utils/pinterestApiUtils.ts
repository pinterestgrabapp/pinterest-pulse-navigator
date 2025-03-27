
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// Define types for Pinterest API responses
export interface PinterestPin {
  id: string;
  title: string;
  description: string;
  link: string;
  media: {
    images: {
      original: {
        url: string;
      };
    };
  };
  created_at: string;
  board: {
    id: string;
    name: string;
  };
  counts: {
    saves: number;
    comments: number;
  };
}

export interface PinterestBoard {
  id: string;
  name: string;
  description: string;
  url: string;
  counts: {
    pins: number;
  };
}

export interface PinterestUser {
  id: string;
  username: string;
  first_name: string;
  last_name: string;
  bio: string;
  counts: {
    pins: number;
    following: number;
    followers: number;
    boards: number;
  };
  profile_image: string;
}

// Store Pinterest credentials in Supabase
export const savePinterestCredentials = async (accessToken: string, userId: string) => {
  try {
    const { error } = await supabase
      .from('pinterest_credentials')
      .upsert(
        { 
          user_id: userId,
          access_token: accessToken,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        { onConflict: 'user_id' }
      );
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error saving Pinterest credentials:', error);
    return false;
  }
};

// Get stored Pinterest access token
export const getPinterestAccessToken = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('pinterest_credentials')
      .select('access_token')
      .eq('user_id', userId)
      .single();
    
    if (error) throw error;
    return data?.access_token;
  } catch (error) {
    console.error('Error getting Pinterest access token:', error);
    return null;
  }
};

// Pinterest API base URL
const PINTEREST_API_BASE = 'https://api.pinterest.com/v5';

// Generic fetch wrapper for Pinterest API calls
export const fetchFromPinterest = async (
  endpoint: string, 
  accessToken: string, 
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  body?: any
) => {
  try {
    const response = await fetch(`${PINTEREST_API_BASE}${endpoint}`, {
      method,
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      ...(body && { body: JSON.stringify(body) }),
    });

    if (!response.ok) {
      throw new Error(`Pinterest API error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Pinterest API error:', error);
    throw error;
  }
};

// Get user profile from Pinterest
export const getPinterestUserProfile = async (accessToken: string) => {
  return fetchFromPinterest('/user_account', accessToken);
};

// Get user boards from Pinterest
export const getUserBoards = async (accessToken: string) => {
  return fetchFromPinterest('/boards', accessToken);
};

// Get pins from a specific board
export const getBoardPins = async (accessToken: string, boardId: string) => {
  return fetchFromPinterest(`/boards/${boardId}/pins`, accessToken);
};

// Search for pins by keyword
export const searchPins = async (accessToken: string, query: string) => {
  return fetchFromPinterest(`/pins/search?query=${encodeURIComponent(query)}`, accessToken);
};

// Create a pin on Pinterest
export const createPin = async (
  accessToken: string,
  boardId: string,
  title: string,
  description: string,
  link: string,
  mediaUrl: string
) => {
  return fetchFromPinterest(
    '/pins',
    accessToken,
    'POST',
    {
      board_id: boardId,
      title,
      description,
      link,
      media_source: {
        source_type: 'image_url',
        url: mediaUrl
      }
    }
  );
};

// Handle Pinterest OAuth flow
export const initiateOAuthFlow = () => {
  // Pinterest OAuth configuration
  const clientId = process.env.VITE_PINTEREST_CLIENT_ID;
  const redirectUri = encodeURIComponent(window.location.origin + '/pinterest-callback');
  const scope = encodeURIComponent('pins:read,pins:write,boards:read,boards:write,user_accounts:read');
  
  // Redirect to Pinterest OAuth page
  window.location.href = `https://www.pinterest.com/oauth/?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}`;
};

// Create a React hook for using Pinterest API
export const usePinterestApi = () => {
  const { toast } = useToast();
  
  const connectPinterest = async () => {
    try {
      initiateOAuthFlow();
    } catch (error) {
      console.error('Error connecting to Pinterest:', error);
      toast({
        title: 'Error',
        description: 'Failed to connect to Pinterest. Please try again.',
        variant: 'destructive'
      });
    }
  };
  
  return { connectPinterest };
};
