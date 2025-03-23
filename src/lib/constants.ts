export const APP_NAME = "Pinterest Grab";
export const APP_DESCRIPTION = "Powerful keyword research, pin analysis, and strategy tools for Pinterest marketers.";

export const DEFAULT_LANGUAGE = "en";

export const NAV_ITEMS = [
  {
    label: "home",
    href: "/",
  },
  {
    label: "dashboard",
    href: "/dashboard",
  },
  {
    label: "keywordResearch",
    href: "/keyword-research",
  },
  {
    label: "pinAnalysis",
    href: "/pin-analysis",
  },
  {
    label: "settings",
    href: "/settings",
  },
];

// List of available languages
export const LANGUAGES = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "it", name: "Italiano", flag: "🇮🇹" },
  { code: "zh", name: "中文", flag: "🇨🇳" },
  { code: "ja", name: "日本語", flag: "🇯🇵" },
  { code: "ko", name: "한국어", flag: "🇰🇷" },
  { code: "ru", name: "Русский", flag: "🇷🇺" },
  { code: "pt", name: "Português", flag: "🇵🇹" },
];

// Mock data for keyword research tool
export const MOCK_POPULAR_KEYWORDS = [
  "home decor",
  "fashion outfits",
  "meal prep",
  "travel destinations",
  "workout routines",
  "diy crafts",
  "wedding ideas",
  "skincare routine",
  "garden ideas",
  "bullet journal",
  "healthy recipes",
  "interior design",
  "photography tips",
  "hairstyle ideas",
  "quotes inspiration",
];

// Mock pin statistics for pin analyzer
export const MOCK_PIN_STATS = {
  pinScore: 87,
  saves: 1243,
  clicks: 872,
  impressions: 15420,
  engagement: 8.2,
  createdAt: "June 12, 2023",
};

// Translations
export const TRANSLATIONS = {
  en: {
    // Navigation
    home: "Home",
    dashboard: "Dashboard",
    keywordResearch: "Keyword Research",
    pinAnalysis: "Pin Analysis",
    createPin: "Create Pin",
    settings: "Settings",
    navigation: "Navigation",
    tools: "Tools",
    keywordExplorer: "Keyword Explorer",
    
    // Pages
    pinAnalyzer: "Pin Analyzer",
    pinAnalyzerDescription: "Enter a Pinterest pin URL to analyze keywords and performance",
    pinAnalysisDescription: "Analyze Pinterest pins to extract keywords and understand their performance metrics",
    keywordResearchDescription: "Discover trending keywords and interests to optimize your Pinterest content",
    keywordExplorerDescription: "Find popular keywords and interests on Pinterest",
    settingsDescription: "Manage your account settings and preferences",
    createPinDescription: "Create and publish Pinterest pins directly from our platform",
    createPinButton: "Create Pin",
    
    // Keyword Tool
    searchKeywords: "Search for keywords...",
    loading: "Loading...",
    search: "Search",
    popularKeywords: "Popular Keywords",
    relatedKeywords: "Related Keywords",
    trending: "Trending",
    noResults: "No results found. Try a different search term.",
    
    // Pin Analyzer
    enterPinUrl: "Enter Pinterest pin URL...",
    analyze: "Analyze",
    keywordsExtracted: "Extracted Keywords",
    generateKeywords: "Generate More",
    copyToClipboard: "Copy All",
    copied: "Copied!",
    pinScore: "Pin Score",
    saves: "Saves",
    clicks: "Clicks",
    impressions: "Impressions",
    engagement: "Engagement",
    createdAt: "Created",
    
    // Features
    keywordResearchFeature: "Keyword Research",
    keywordResearchFeatureDesc: "Discover trending interests and keywords that drive traffic.",
    rankTrackingFeature: "Rank Tracking",
    rankTrackingFeatureDesc: "Monitor how your pins rank for important keywords.",
    pinAnalysisFeature: "Pin Analysis",
    pinAnalysisFeatureDesc: "Extract keywords and metrics from any Pinterest pin.",
    keywordExtractionFeature: "Keyword Extraction",
    keywordExtractionFeatureDesc: "Extract relevant keywords from any Pinterest pin.",
    pinCreationFeature: "Pin Creation",
    pinCreationFeatureDesc: "Design and publish Pinterest pins directly from our platform.",
    languagePreference: "Language Support",
    
    // Support & Help
    supportAndHelp: "Support & Help",
    accountSettings: "Account Settings",
    feedback: "Feedback",
    termsOfService: "Terms of Service",
    privacyPolicy: "Privacy Policy",
    
    // Settings
    account: "Account",
    notifications: "Notifications",
    privacy: "Privacy",
    profile: "Profile",
    profileSettings: "Manage your personal information",
    name: "Name",
    email: "Email",
    saveChanges: "Save Changes",
    notificationSettings: "Notification Preferences",
    notificationDescription: "Control how and when you receive notifications",
    emailNotifications: "Email Notifications",
    emailNotificationsDescription: "Receive updates via email",
    rankingAlerts: "Ranking Alerts",
    rankingAlertsDescription: "Get notified when your pin rankings change",
    weeklyReports: "Weekly Reports",
    weeklyReportsDescription: "Receive a weekly summary of your pins' performance",
    privacySettings: "Privacy Settings",
    privacyDescription: "Manage your data and privacy preferences",
    dataSharing: "Data Sharing",
    dataSharingDescription: "Allow us to share anonymous usage data",
    analytics: "Analytics Cookies",
    analyticsDescription: "Allow cookies for enhanced analytics",
    
    // Create Pin
    pinDetails: "Pin Details",
    pinDetailsDescription: "Enter information about your new pin",
    pinTitle: "Title",
    pinTitlePlaceholder: "Enter a catchy title for your pin",
    pinDescription: "Description",
    pinDescriptionPlaceholder: "Describe your pin with keywords to increase visibility",
    pinKeywords: "Keywords",
    pinKeywordsPlaceholder: "home decor, minimalist, interior design",
    pinKeywordsHelp: "Separate keywords with commas",
    destinationLink: "Destination URL",
    pinImage: "Pin Image",
    pinImageDescription: "Upload an image for your pin",
    dragImageHere: "Drag and drop an image here",
    recommendedSize: "Recommended size: 1000x1500px",
    uploadImage: "Upload Image",
    pinPreview: "Pin Preview",
    pinPreviewDescription: "See how your pin will look",
    previewWillAppearHere: "Your pin preview will appear here",
    
    // Auth
    login: "Log In",
    signup: "Sign Up",
    logout: "Log Out",
    
    // Welcome Page
    welcome: "Welcome to Pinterest Grab",
    hero: "Skyrocket Your Pinterest Visibility",
    heroSubtitle: "Powerful keyword research, pin analysis, and strategy tools for Pinterest marketers.",
    getStarted: "Get Started",
    learnMore: "Learn More",
    
    // Features section
    features: "Features",
    
    // Testimonials
    testimonials: "What Our Users Say",
    
    // Pricing
    pricing: "Pricing",
    pricingSubtitle: "Choose the plan that fits your needs",
    planFree: "Free",
    planPro: "Pro",
    planBusiness: "Business",
    monthly: "Monthly",
    yearly: "Yearly",
    currentPlan: "Current Plan",
    upgrade: "Upgrade",
    
    // Footer
    about: "About",
    contact: "Contact",
    terms: "Terms",
    faq: "FAQ",
    blog: "Blog",
    copyright: "© 2023 Pinterest Grab. All rights reserved.",
  },
  // Other languages would go here with the same keys
  es: {
    // Navigation
    home: "Inicio",
    dashboard: "Panel",
    keywordResearch: "Investigación de Palabras Clave",
    pinAnalysis: "Análisis de Pines",
    createPin: "Crear Pin",
    settings: "Configuración",
    navigation: "Navegación",
    tools: "Herramientas",
    keywordExplorer: "Explorador de Palabras Clave",
    
    // Auth
    login: "Iniciar Sesión",
    signup: "Registrarse",
    
    // Keep minimal Spanish translations for now
    // These will be expanded in the future
  },
  // Other languages would follow the same pattern
};
