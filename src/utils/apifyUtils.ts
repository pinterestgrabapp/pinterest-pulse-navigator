
import { supabase } from "@/integrations/supabase/client";

export interface ApifyPinterestRequest {
  startUrls?: Array<{ url: string }>;
  search?: string;
  resultsPerPage?: number;
  maxItems?: number;
  endPage?: number;
  userId?: string;
}

export interface PinterestPinResult {
  title: string;
  description?: string;
  link?: string;
  pinId: string;
  pinUrl: string;
  imageUrl: string;
  boardName?: string;
  boardUrl?: string;
  userName?: string;
  userProfileUrl?: string;
  repins?: number;
  savedCount?: number;
  commentCount?: number;
  reactionCounts?: Record<string, number>;
}

/**
 * Scrape Pinterest data using the Apify actor
 */
export async function scrapePinterest(params: ApifyPinterestRequest): Promise<PinterestPinResult[] | null> {
  try {
    // Add user ID to params if available
    const user = supabase.auth.getUser();
    if ((await user).data?.user) {
      params.userId = (await user).data.user.id;
    }

    const { data, error } = await supabase.functions.invoke('apify-pinterest', {
      body: params,
    });

    if (error) {
      console.error('Error calling Apify Pinterest scraper:', error);
      return null;
    }

    // Process the response based on Apify's output format
    if (data && Array.isArray(data)) {
      // Transform the data to match our expected format
      return data.map(item => ({
        title: item.title || '',
        description: item.description || '',
        link: item.sourceUrl || item.linkUrl || '',
        pinId: item.pinId || item.id || '',
        pinUrl: item.url || '',
        imageUrl: item.imageUrl || item.image?.url || '',
        boardName: item.board?.name || '',
        boardUrl: item.board?.url || '',
        userName: item.user?.name || item.author?.name || '',
        userProfileUrl: item.user?.url || item.author?.url || '',
        repins: item.statistics?.repins || item.repinCount || 0,
        savedCount: item.statistics?.saves || item.savedCount || 0,
        commentCount: item.statistics?.comments || item.commentCount || 0,
        reactionCounts: item.reactionCounts || {},
      }));
    }

    return null;
  } catch (error) {
    console.error('Error in scrapePinterest:', error);
    return null;
  }
}

/**
 * Search Pinterest by keyword
 */
export async function searchPinterest(query: string, maxItems = 50): Promise<PinterestPinResult[] | null> {
  return scrapePinterest({
    search: query,
    maxItems,
    endPage: Math.ceil(maxItems / 100),
    resultsPerPage: 100,
  });
}

/**
 * Scrape a specific Pinterest pin or account URL
 */
export async function scrapeUrl(url: string): Promise<PinterestPinResult[] | null> {
  return scrapePinterest({
    startUrls: [{ url }],
    maxItems: 100,
  });
}

/**
 * Scrape a Pinterest board
 */
export async function scrapeBoard(boardUrl: string, maxItems = 100): Promise<PinterestPinResult[] | null> {
  return scrapePinterest({
    startUrls: [{ url: boardUrl }],
    maxItems,
    endPage: Math.ceil(maxItems / 100),
    resultsPerPage: 100,
  });
}
