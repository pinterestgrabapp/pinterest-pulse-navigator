
import { supabase } from "@/integrations/supabase/client";

export type AnalysisType = 'pin' | 'profile' | 'keyword';

export interface AnalyticsRequest {
  type: AnalysisType;
  query: string;
  userId: string;
}

export interface PinAnalytics {
  pin_id: string;
  title: string;
  description: string;
  url: string;
  image_url: string;
  engagement_score: number;
  keywords: Array<{
    keyword: string;
    frequency?: number;
    relevance_score?: number;
    isHashtag?: boolean;
  }>;
  analysis: any;
  related_pins: Array<{
    id: string;
    title: string;
    image_url: string;
  }>;
}

export interface KeywordAnalytics {
  keyword: string;
  pin_count: number;
  trend_score: number;
  average_engagement: string;
  related_keywords: Array<{
    keyword: string;
    frequency?: number;
    relevance_score?: number;
  }>;
  sample_pins: Array<{
    id: string;
    title: string;
    description: string;
    image_url: string;
    engagement_score: number;
  }>;
  analysis: any;
}

export interface ProfileAnalytics {
  username: string;
  profile_id: string;
  pin_count: number;
  profile_image: string;
  website_url: string | null;
  top_keywords: Array<{
    keyword: string;
    frequency?: number;
    relevance_score?: number;
  }>;
  top_pins: Array<{
    id: string;
    title: string;
    description: string;
    image_url: string;
    engagement_score: number;
  }>;
  analysis: any;
}

export type AnalyticsResult = PinAnalytics | KeywordAnalytics | ProfileAnalytics;

export const analyzePin = async (pinUrl: string, userId: string): Promise<PinAnalytics> => {
  return analyzePinterest('pin', pinUrl, userId) as Promise<PinAnalytics>;
};

export const analyzeProfile = async (profileUrl: string, userId: string): Promise<ProfileAnalytics> => {
  return analyzePinterest('profile', profileUrl, userId) as Promise<ProfileAnalytics>;
};

export const analyzeKeyword = async (keyword: string, userId: string): Promise<KeywordAnalytics> => {
  return analyzePinterest('keyword', keyword, userId) as Promise<KeywordAnalytics>;
};

export const analyzePinterest = async (
  type: AnalysisType, 
  query: string, 
  userId: string
): Promise<AnalyticsResult> => {
  try {
    const { data, error } = await supabase.functions.invoke('pinterest-analytics', {
      body: { type, query, userId }
    });

    if (error) {
      throw new Error(error.message || 'Error analyzing Pinterest data');
    }

    return data.data;
  } catch (error: any) {
    console.error(`Error in ${type} analysis:`, error);
    throw new Error(error.message || `Failed to analyze ${type}`);
  }
};

export const getPreviousAnalyses = async (userId: string): Promise<any[]> => {
  try {
    const { data, error } = await supabase
      .from('pinterest_analytics')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching previous analyses:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching previous analyses:', error);
    return [];
  }
};
