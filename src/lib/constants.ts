export const APP_NAME = "Pinterest Grab";

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
    
    // Features
    features: "Features",
    featureKeyword: "Keyword Research",
    featureKeywordDesc: "Discover trending interests and keywords that drive traffic.",
    featurePin: "Pin Analysis",
    featurePinDesc: "Extract keywords and metrics from any Pinterest pin.",
    featureTrack: "Rank Tracking",
    featureTrackDesc: "Monitor how your pins rank for important keywords.",
    featureCreate: "Pin Creation",
    featureCreateDesc: "Design and publish Pinterest pins directly from our platform.",
    
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
    privacy: "Privacy",
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
    // Add more Spanish translations here
  },
  // Other languages would follow the same pattern
};
