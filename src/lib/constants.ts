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
    export: "Export",
    help: "Help",
    
    // Pages
    pinAnalyzer: "Pin Analyzer",
    pinAnalyzerDescription: "Enter a Pinterest pin URL to analyze keywords and performance",
    pinAnalysisDescription: "Analyze Pinterest pins to extract keywords and understand their performance metrics",
    keywordResearchDescription: "Discover trending keywords and interests to optimize your Pinterest content",
    keywordExplorerDescription: "Find popular keywords and interests on Pinterest",
    settingsDescription: "Manage your account settings and preferences",
    createPinDescription: "Create and publish Pinterest pins directly from our platform",
    createPinButton: "Create Pin",
    
    // Profile Page
    profile: "Profile",
    manageYourProfileInformation: "Manage your profile information and account settings",
    profileInformation: "Profile Information",
    manageYourPublicProfile: "Manage your public profile",
    edit: "Edit",
    save: "Save",
    cancel: "Cancel",
    changePhoto: "Change Photo",
    name: "Name",
    email: "Email",
    emailCannotBeChanged: "Email address cannot be changed",
    bio: "Bio",
    tellUsAboutYourself: "Tell us about yourself",
    website: "Website",
    accountSecurity: "Account Security",
    managePasswordAndSecurity: "Manage your password and account security",
    changePassword: "Change Password",
    updateYourPassword: "Update your password",
    
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
    profileSettings: "Manage your personal information",
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
    export: "Exportar",
    help: "Ayuda",
    
    // Auth
    login: "Iniciar Sesión",
    signup: "Registrarse",

    // Profile Page
    profile: "Perfil",
    manageYourProfileInformation: "Administre su información de perfil y configuración de cuenta",
    profileInformation: "Información del Perfil",
    manageYourPublicProfile: "Administre su perfil público",
    edit: "Editar",
    save: "Guardar",
    cancel: "Cancelar",
    changePhoto: "Cambiar Foto",
    name: "Nombre",
    email: "Correo",
    emailCannotBeChanged: "El correo electrónico no se puede cambiar",
    bio: "Biografía",
    tellUsAboutYourself: "Cuéntanos sobre ti",
    website: "Sitio Web",
    accountSecurity: "Seguridad de la Cuenta",
    managePasswordAndSecurity: "Administre su contraseña y seguridad de la cuenta",
    changePassword: "Cambiar Contraseña",
    updateYourPassword: "Actualice su contraseña",
    account: "Cuenta",
    
    // Keep minimal Spanish translations for now
    // These will be expanded in the future
  },
  de: {
    // Navigation
    home: "Startseite",
    dashboard: "Dashboard",
    keywordResearch: "Keyword-Recherche",
    pinAnalysis: "Pin-Analyse",
    createPin: "Pin erstellen",
    settings: "Einstellungen",
    navigation: "Navigation",
    tools: "Werkzeuge",
    keywordExplorer: "Keyword-Explorer",
    export: "Exportieren",
    help: "Hilfe",
    
    // Pages
    pinAnalyzer: "Pin-Analysator",
    pinAnalyzerDescription: "Geben Sie eine Pinterest-Pin-URL ein, um Keywords und Leistung zu analysieren",
    pinAnalysisDescription: "Analysieren Sie Pinterest-Pins, um Keywords zu extrahieren und ihre Leistungsmetriken zu verstehen",
    keywordResearchDescription: "Entdecken Sie Trend-Keywords und Interessen, um Ihre Pinterest-Inhalte zu optimieren",
    keywordExplorerDescription: "Finden Sie beliebte Keywords und Interessen auf Pinterest",
    settingsDescription: "Verwalten Sie Ihre Kontoeinstellungen und Präferenzen",
    createPinDescription: "Erstellen und veröffentlichen Sie Pinterest-Pins direkt von unserer Plattform",
    createPinButton: "Pin erstellen",
    
    // Profile Page
    profile: "Profil",
    manageYourProfileInformation: "Verwalten Sie Ihre Profilinformationen und Kontoeinstellungen",
    profileInformation: "Profilinformationen",
    manageYourPublicProfile: "Verwalten Sie Ihr öffentliches Profil",
    edit: "Bearbeiten",
    save: "Speichern",
    cancel: "Abbrechen",
    changePhoto: "Foto ändern",
    name: "Name",
    email: "E-Mail",
    emailCannotBeChanged: "E-Mail-Adresse kann nicht geändert werden",
    bio: "Bio",
    tellUsAboutYourself: "Erzählen Sie uns von sich",
    website: "Webseite",
    accountSecurity: "Kontosicherheit",
    managePasswordAndSecurity: "Verwalten Sie Ihr Passwort und Ihre Kontosicherheit",
    changePassword: "Passwort ändern",
    updateYourPassword: "Aktualisieren Sie Ihr Passwort",
    
    // Keyword Tool
    searchKeywords: "Nach Keywords suchen...",
    loading: "Laden...",
    search: "Suchen",
    popularKeywords: "Beliebte Keywords",
    relatedKeywords: "Verwandte Keywords",
    trending: "Trending",
    noResults: "Keine Ergebnisse gefunden. Versuchen Sie einen anderen Suchbegriff.",
    
    // Pin Analyzer
    enterPinUrl: "Pinterest-Pin-URL eingeben...",
    analyze: "Analysieren",
    keywordsExtracted: "Extrahierte Keywords",
    generateKeywords: "Mehr generieren",
    copyToClipboard: "Alle kopieren",
    copied: "Kopiert!",
    pinScore: "Pin-Score",
    saves: "Speicherungen",
    clicks: "Klicks",
    impressions: "Impressionen",
    engagement: "Engagement",
    createdAt: "Erstellt",
    
    // Features
    keywordResearchFeature: "Keyword-Recherche",
    keywordResearchFeatureDesc: "Entdecken Sie Trends und Keywords, die Traffic generieren.",
    rankTrackingFeature: "Rang-Tracking",
    rankTrackingFeatureDesc: "Überwachen Sie, wie Ihre Pins für wichtige Keywords ranken.",
    pinAnalysisFeature: "Pin-Analyse",
    pinAnalysisFeatureDesc: "Extrahieren Sie Keywords und Metriken von jedem Pinterest-Pin.",
    keywordExtractionFeature: "Keyword-Extraktion",
    keywordExtractionFeatureDesc: "Extrahieren Sie relevante Keywords von jedem Pinterest-Pin.",
    pinCreationFeature: "Pin-Erstellung",
    pinCreationFeatureDesc: "Gestalten und veröffentlichen Sie Pinterest-Pins direkt von unserer Plattform.",
    languagePreference: "Sprachunterstützung",
    
    // Support & Help
    supportAndHelp: "Support & Hilfe",
    accountSettings: "Kontoeinstellungen",
    feedback: "Feedback",
    termsOfService: "Nutzungsbedingungen",
    privacyPolicy: "Datenschutzrichtlinie",
    
    // Settings
    account: "Konto",
    notifications: "Benachrichtigungen",
    privacy: "Datenschutz",
    profileSettings: "Verwalten Sie Ihre persönlichen Informationen",
    saveChanges: "Änderungen speichern",
    notificationSettings: "Benachrichtigungseinstellungen",
    notificationDescription: "Kontrollieren Sie, wie und wann Sie Benachrichtigungen erhalten",
    emailNotifications: "E-Mail-Benachrichtigungen",
    emailNotificationsDescription: "Erhalten Sie Updates per E-Mail",
    rankingAlerts: "Ranking-Alarme",
    rankingAlertsDescription: "Werden Sie benachrichtigt, wenn sich Ihre Pin-Rankings ändern",
    weeklyReports: "Wöchentliche Berichte",
    weeklyReportsDescription: "Erhalten Sie eine wöchentliche Zusammenfassung der Leistung Ihrer Pins",
    privacySettings: "Datenschutzeinstellungen",
    privacyDescription: "Verwalten Sie Ihre Daten und Datenschutzeinstellungen",
    dataSharing: "Datenaustausch",
    dataSharingDescription: "Erlauben Sie uns, anonyme Nutzungsdaten zu teilen",
    analytics: "Analytics-Cookies",
    analyticsDescription: "Erlauben Sie Cookies für erweiterte Analysen",
    
    // Create Pin
    pinDetails: "Pin-Details",
    pinDetailsDescription: "Geben Sie Informationen zu Ihrem neuen Pin ein",
    pinTitle: "Titel",
    pinTitlePlaceholder: "Geben Sie einen ansprechenden Titel für Ihren Pin ein",
    pinDescription: "Beschreibung",
    pinDescriptionPlaceholder: "Beschreiben Sie Ihren Pin mit Keywords, um die Sichtbarkeit zu erhöhen",
    pinKeywords: "Keywords",
    pinKeywordsPlaceholder: "Wohnungsdekoration, minimalistisch, Inneneinrichtung",
    pinKeywordsHelp: "Trennen Sie Keywords mit Kommas",
    destinationLink: "Ziel-URL",
    pinImage: "Pin-Bild",
    pinImageDescription: "Laden Sie ein Bild für Ihren Pin hoch",
    dragImageHere: "Ziehen Sie ein Bild hierher",
    recommendedSize: "Empfohlene Größe: 1000x1500px",
    uploadImage: "Bild hochladen",
    pinPreview: "Pin-Vorschau",
    pinPreviewDescription: "So wird Ihr Pin aussehen",
    previewWillAppearHere: "Ihre Pin-Vorschau wird hier angezeigt",
    
    // Auth
    login: "Anmelden",
    signup: "Registrieren",
    logout: "Abmelden",
    
    // Welcome Page
    welcome: "Willkommen bei Pinterest Grab",
    hero: "Steigern Sie Ihre Pinterest-Sichtbarkeit",
    heroSubtitle: "Leistungsstarke Tools für Keyword-Recherche, Pin-Analyse und Strategie für Pinterest-Vermarkter.",
    getStarted: "Loslegen",
    learnMore: "Mehr erfahren",
    
    // Features section
    features: "Funktionen",
    
    // Testimonials
    testimonials: "Was unsere Nutzer sagen",
    
    // Pricing
    pricing: "Preise",
    pricingSubtitle: "Wählen Sie den Plan, der zu Ihren Bedürfnissen passt",
    planFree: "Kostenlos",
    planPro: "Pro",
    planBusiness: "Business",
    monthly: "Monatlich",
    yearly: "Jährlich",
    currentPlan: "Aktueller Plan",
    upgrade: "Upgrade",
    
    // Footer
    about: "Über uns",
    contact: "Kontakt",
    terms: "Bedingungen",
    faq: "FAQ",
    blog: "Blog",
    copyright: "© 2023 Pinterest Grab. Alle Rechte vorbehalten.",
  },
};
