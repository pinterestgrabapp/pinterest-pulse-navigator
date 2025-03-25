import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useLanguage } from '@/utils/languageUtils';
import { APP_NAME, APP_DESCRIPTION } from '@/lib/constants';
import KeywordDownloader from "@/components/KeywordDownloader";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { t } = useLanguage();
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-black text-black dark:text-white">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section - Centered with no image */}
        <section className="relative py-20 md:py-32 overflow-hidden pt-24 bg-white dark:bg-black">
          <div className="container px-4 mx-auto relative z-10">
            <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-pinterest-red/10 to-purple-500/10 rounded-2xl blur-xl"></div>
              </div>
              <div className="inline-block mb-4 px-3 py-1 rounded-full bg-pinterest-red/20 border border-pinterest-red/30 text-pinterest-red text-sm font-medium animate-fade-in">
                {APP_NAME}
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-black to-gray-700 dark:from-white dark:to-gray-400">
                  {t('hero')}
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                {t('heroSubtitle')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                <Button asChild size="lg" className="rounded-full px-8 bg-pinterest-red hover:bg-pinterest-dark border border-white/10">
                  <Link to={user ? "/dashboard" : "/auth"}>
                    {t('getStarted')} <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="rounded-full px-8 border-gray-300 dark:border-white/10 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-900">
                  <a href="#how-it-works">
                    {t('learnMore')}
                  </a>
                </Button>
              </div>
            </div>
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute -bottom-10 left-0 right-0 h-20 bg-gradient-to-b from-transparent to-white dark:to-black z-10"></div>
        </section>
        
        {/* How It Works Section */}
        <section id="how-it-works" className="py-20 bg-white dark:bg-black">
          <div className="container px-4 mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-pinterest-red to-pink-600">
                How It Works
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Extract valuable keywords from any Pinterest pin in seconds. Optimize your content strategy with our powerful tool.
              </p>
            </div>
            
            <div className="max-w-4xl mx-auto">
              <KeywordDownloader />
            </div>
            
            <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="glass-card rounded-xl p-6 bg-white/50 dark:bg-black/50 border border-white/30 dark:border-white/10 transition-all duration-300 hover:border-pinterest-red/50">
                <div className="w-12 h-12 rounded-xl bg-pinterest-red flex items-center justify-center text-white mb-4">
                  1
                </div>
                <h3 className="text-xl font-semibold mb-2">Paste any Pinterest URL</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Simply copy and paste the URL of any Pinterest pin you want to analyze.
                </p>
              </div>
              
              <div className="glass-card rounded-xl p-6 bg-white/50 dark:bg-black/50 border border-white/30 dark:border-white/10 transition-all duration-300 hover:border-pinterest-red/50">
                <div className="w-12 h-12 rounded-xl bg-pinterest-red flex items-center justify-center text-white mb-4">
                  2
                </div>
                <h3 className="text-xl font-semibold mb-2">Get Pinterest Keywords</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Our AI analysis extracts the most valuable keywords from the pin content and metadata.
                </p>
              </div>
              
              <div className="glass-card rounded-xl p-6 bg-white/50 dark:bg-black/50 border border-white/30 dark:border-white/10 transition-all duration-300 hover:border-pinterest-red/50">
                <div className="w-12 h-12 rounded-xl bg-pinterest-red flex items-center justify-center text-white mb-4">
                  3
                </div>
                <h3 className="text-xl font-semibold mb-2">Optimize Your Content</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Use these keywords to create better Pinterest pins and improve your SEO rankings.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-20 bg-gray-50 dark:bg-black border-t border-b border-gray-200 dark:border-white/5">
          <div className="container px-4 mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('features')}</h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                {APP_DESCRIPTION}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="glass-card rounded-xl p-6 bg-white/50 dark:bg-black/50 border border-white/30 dark:border-white/10 transition-all duration-300 hover:border-pinterest-red/50 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                <div className="w-12 h-12 rounded-xl bg-pinterest-red flex items-center justify-center text-white mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">{t('keywordResearchFeature')}</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {t('keywordResearchFeatureDesc')}
                </p>
              </div>
              
              {/* Feature 2 */}
              <div className="glass-card rounded-xl p-6 bg-white/50 dark:bg-black/50 border border-white/30 dark:border-white/10 transition-all duration-300 hover:border-pinterest-red/50 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                <div className="w-12 h-12 rounded-xl bg-pinterest-red flex items-center justify-center text-white mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bar-chart"><line x1="12" x2="12" y1="20" y2="10"/><line x1="18" x2="18" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="16"/></svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">{t('rankTrackingFeature')}</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {t('rankTrackingFeatureDesc')}
                </p>
              </div>
              
              {/* Feature 3 */}
              <div className="glass-card rounded-xl p-6 bg-white/50 dark:bg-black/50 border border-white/30 dark:border-white/10 transition-all duration-300 hover:border-pinterest-red/50 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                <div className="w-12 h-12 rounded-xl bg-pinterest-red flex items-center justify-center text-white mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-line-chart"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">{t('pinAnalysisFeature')}</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {t('pinAnalysisFeatureDesc')}
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Illustrated Section */}
        <section className="py-20 bg-white dark:bg-black">
          <div className="container px-4 mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="md:w-1/2">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-pinterest-red/10 to-purple-500/10 rounded-2xl blur-xl"></div>
                  <svg className="w-full h-auto max-w-md mx-auto" viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
                    <rect x="400" y="100" width="300" height="400" rx="20" fill="#f0f0f0" stroke="#E60023" strokeWidth="2" />
                    <rect x="430" y="130" width="240" height="160" rx="10" fill="#E60023" />
                    <rect x="430" y="310" width="240" height="30" rx="5" fill="#333" />
                    <rect x="430" y="350" width="180" height="20" rx="5" fill="#666" />
                    <rect x="430" y="380" width="160" height="20" rx="5" fill="#888" />
                    <rect x="430" y="410" width="200" height="20" rx="5" fill="#aaa" />
                    <rect x="430" y="440" width="120" height="40" rx="5" fill="#E60023" />
                    <circle cx="250" cy="300" r="150" fill="none" stroke="#E60023" strokeWidth="2" strokeDasharray="10 5" />
                    <path d="M250,170 L250,430" stroke="#E60023" strokeWidth="2" />
                    <path d="M120,300 L380,300" stroke="#E60023" strokeWidth="2" />
                    <circle cx="250" cy="300" r="80" fill="#f0f0f0" stroke="#E60023" strokeWidth="2" />
                    <path d="M250,250 L290,300 L250,350 L210,300 Z" fill="#E60023" />
                    <circle cx="250" cy="300" r="20" fill="#fff" />
                  </svg>
                </div>
              </div>
              <div className="md:w-1/2">
                <h2 className="text-3xl font-bold mb-6">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-pinterest-red to-pink-600">
                    Unlock the Power of Pinterest SEO
                  </span>
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                  Pinterest is a search engine disguised as a social platform. With our tools, you'll discover exactly what keywords are driving traffic to successful pins.
                </p>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-pinterest-red mr-2 mt-1" />
                    <span className="text-gray-600 dark:text-gray-300">Identify trending keywords in your niche</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-pinterest-red mr-2 mt-1" />
                    <span className="text-gray-600 dark:text-gray-300">Analyze competitor pins to learn their strategy</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-pinterest-red mr-2 mt-1" />
                    <span className="text-gray-600 dark:text-gray-300">Optimize your own pins for maximum reach</span>
                  </li>
                </ul>
                <Button asChild size="lg" className="rounded-full px-8 bg-pinterest-red hover:bg-pinterest-dark border border-white/10">
                  <Link to="/pricing">
                    View Pricing Plans
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 bg-gray-50 dark:bg-black border-t border-gray-200 dark:border-white/5">
          <div className="container px-4 mx-auto">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to enhance your Pinterest strategy?
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                Join thousands of Pinterest content creators who are already using Pinterest Grab to optimize their content.
              </p>
              <Button asChild size="lg" className="rounded-full px-8 bg-pinterest-red hover:bg-pinterest-dark border border-white/10">
                <Link to={user ? "/dashboard" : "/auth"}>
                  {t('getStarted')} <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
