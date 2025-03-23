
export const APP_NAME = "Pinterest Grab";
export const APP_DESCRIPTION = "Enhance your Pinterest marketing strategy with keyword research, analytics, and pin tracking";

export const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'it', name: 'Italian', flag: '🇮🇹' },
  { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
  { code: 'ru', name: 'Russian', flag: '🇷🇺' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
  { code: 'ko', name: 'Korean', flag: '🇰🇷' },
];

export const TRANSLATIONS = {
  en: {
    home: "Home",
    dashboard: "Dashboard",
    keywordResearch: "Keyword Research",
    pinAnalysis: "Pin Analysis",
    settings: "Settings",
    login: "Login",
    signup: "Sign Up",
    logout: "Logout",
    welcome: "Welcome to Pinterest Grab",
    hero: "Elevate Your Pinterest Strategy",
    heroSubtitle: "Discover keywords, track rankings, and analyze pins to boost your Pinterest performance",
    getStarted: "Get Started",
    learnMore: "Learn More",
    features: "Features",
    keywordResearchFeature: "Keyword Research",
    keywordResearchDescription: "Access a vast database of Pinterest interests and topics",
    rankTrackingFeature: "Rank Tracking",
    rankTrackingDescription: "Monitor pin rankings for specific keywords",
    pinAnalysisFeature: "Pin Analysis",
    pinAnalysisDescription: "Evaluate pin popularity based on saves, clicks, and impressions",
    keywordExtractionFeature: "Keyword Extraction",
    keywordExtractionDescription: "Extract keywords from any Pinterest pin URL",
    pinCreationFeature: "Pin Creation",
    pinCreationDescription: "Create and post pins directly to Pinterest",
    enterPinUrl: "Enter Pinterest Pin URL",
    analyze: "Analyze",
    loading: "Loading...",
    noResults: "No results found",
    keywordsExtracted: "Keywords Extracted",
    generateKeywords: "Generate Keywords",
    copyToClipboard: "Copy to Clipboard",
    copied: "Copied!",
    searchKeywords: "Search for keywords",
    search: "Search",
    popularKeywords: "Popular Keywords",
    relatedKeywords: "Related Keywords",
    trending: "Trending",
    pinScore: "Pin Score",
    followers: "Followers",
    engagement: "Engagement",
    saves: "Saves",
    clicks: "Clicks",
    impressions: "Impressions",
    createdAt: "Created At",
    languagePreference: "Language Preference",
    theme: "Theme",
    lightMode: "Light Mode",
    darkMode: "Dark Mode",
    accountSettings: "Account Settings",
    profilePicture: "Profile Picture",
    name: "Name",
    email: "Email",
    password: "Password",
    updateProfile: "Update Profile",
    saveChanges: "Save Changes",
    cancel: "Cancel",
    feedback: "Feedback",
    supportAndHelp: "Support & Help",
    termsOfService: "Terms of Service",
    privacyPolicy: "Privacy Policy",
    copyright: "© 2023 Pinterest Grab. All rights reserved.",
  },
  // Additional languages would be added here
};

export const NAV_ITEMS = [
  { label: "home", href: "/" },
  { label: "dashboard", href: "/dashboard" },
  { label: "keywordResearch", href: "/keyword-research" },
  { label: "pinAnalysis", href: "/pin-analysis" },
  { label: "settings", href: "/settings" },
];

export const DEFAULT_LANGUAGE = 'en';

export const MOCK_POPULAR_KEYWORDS = [
  "home decor",
  "recipes",
  "fashion outfits",
  "travel destinations",
  "DIY crafts",
  "wedding ideas",
  "workout routines",
  "bullet journal",
  "garden ideas",
  "hair styles",
  "nail art",
  "quotes inspiration",
  "organization",
  "healthy meals",
  "kids activities"
];

export const MOCK_PIN_STATS = {
  pinScore: 85,
  followers: 12500,
  engagement: 4.2,
  saves: 1250,
  clicks: 842,
  impressions: 25000,
  createdAt: "2023-06-15"
};
