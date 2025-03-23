
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useLanguage } from '@/utils/languageUtils';
import { APP_NAME, APP_DESCRIPTION } from '@/lib/constants';

const Index = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32">
          <div className="absolute inset-0 bg-gradient-to-br from-pinterest-light via-white to-white dark:from-gray-900 dark:via-gray-900 dark:to-gray-950 z-0"></div>
          <div className="container px-4 mx-auto relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-block mb-4 px-3 py-1 rounded-full bg-accent text-accent-foreground text-sm font-medium animate-fade-in">
                {APP_NAME}
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                {t('hero')}
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                {t('heroSubtitle')}
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                <Button asChild size="lg" className="rounded-full px-8">
                  <Link to="/dashboard">
                    {t('getStarted')} <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="rounded-full px-8">
                  <Link to="/keyword-research">
                    {t('learnMore')}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute -bottom-10 left-0 right-0 h-20 bg-gradient-to-b from-transparent to-background z-10"></div>
        </section>
        
        {/* Features Section */}
        <section className="py-20">
          <div className="container px-4 mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('features')}</h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                {APP_DESCRIPTION}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="glass-card rounded-xl p-6 transition-all duration-300 hover:shadow-lg animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                <div className="w-12 h-12 rounded-xl bg-pinterest-red flex items-center justify-center text-white mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">{t('keywordResearchFeature')}</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {t('keywordResearchFeatureDesc')}
                </p>
              </div>
              
              {/* Feature 2 */}
              <div className="glass-card rounded-xl p-6 transition-all duration-300 hover:shadow-lg animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                <div className="w-12 h-12 rounded-xl bg-pinterest-red flex items-center justify-center text-white mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bar-chart"><line x1="12" x2="12" y1="20" y2="10"/><line x1="18" x2="18" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="16"/></svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">{t('rankTrackingFeature')}</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {t('rankTrackingFeatureDesc')}
                </p>
              </div>
              
              {/* Feature 3 */}
              <div className="glass-card rounded-xl p-6 transition-all duration-300 hover:shadow-lg animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                <div className="w-12 h-12 rounded-xl bg-pinterest-red flex items-center justify-center text-white mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-line-chart"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">{t('pinAnalysisFeature')}</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {t('pinAnalysisFeatureDesc')}
                </p>
              </div>
              
              {/* Feature 4 */}
              <div className="glass-card rounded-xl p-6 transition-all duration-300 hover:shadow-lg animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                <div className="w-12 h-12 rounded-xl bg-pinterest-red flex items-center justify-center text-white mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-hash"><line x1="4" x2="20" y1="9" y2="9"/><line x1="4" x2="20" y1="15" y2="15"/><line x1="10" x2="8" y1="3" y2="21"/><line x1="16" x2="14" y1="3" y2="21"/></svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">{t('keywordExtractionFeature')}</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {t('keywordExtractionFeatureDesc')}
                </p>
              </div>
              
              {/* Feature 5 */}
              <div className="glass-card rounded-xl p-6 transition-all duration-300 hover:shadow-lg animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
                <div className="w-12 h-12 rounded-xl bg-pinterest-red flex items-center justify-center text-white mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-globe"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/><path d="M2 12h20"/></svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">{t('languagePreference')}</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Use Pinterest Grab in your preferred language
                </p>
              </div>
              
              {/* Feature 6 */}
              <div className="glass-card rounded-xl p-6 transition-all duration-300 hover:shadow-lg animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
                <div className="w-12 h-12 rounded-xl bg-pinterest-red flex items-center justify-center text-white mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-image-plus"><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7"/><line x1="16" x2="22" y1="5" y2="5"/><line x1="19" x2="19" y1="2" y2="8"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">{t('pinCreationFeature')}</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {t('pinCreationFeatureDesc')}
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 bg-gray-50 dark:bg-gray-900">
          <div className="container px-4 mx-auto">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to enhance your Pinterest strategy?
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                Join thousands of Pinterest content creators who are already using Pinterest Grab to optimize their content.
              </p>
              <Button asChild size="lg" className="rounded-full px-8">
                <Link to="/dashboard">
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
