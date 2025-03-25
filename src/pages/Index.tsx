
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
    <div className="min-h-screen flex flex-col bg-black text-white">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black z-0"></div>
          
          {/* Animated Background Elements */}
          <div className="absolute inset-0 z-0 opacity-30">
            <div className="absolute -top-20 -left-20 w-60 h-60 bg-pinterest-red rounded-full filter blur-3xl animate-float" style={{ animationDelay: '0s' }}></div>
            <div className="absolute top-40 right-20 w-80 h-80 bg-purple-700 rounded-full filter blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
            <div className="absolute bottom-20 left-40 w-60 h-60 bg-blue-700 rounded-full filter blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
          </div>
          
          <div className="container px-4 mx-auto relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-block mb-4 px-3 py-1 rounded-full bg-pinterest-red/20 border border-pinterest-red/30 text-pinterest-red text-sm font-medium animate-fade-in">
                {APP_NAME}
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                  {t('hero')}
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                {t('heroSubtitle')}
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                <Button asChild size="lg" className="rounded-full px-8 bg-pinterest-red hover:bg-pinterest-dark">
                  <Link to={user ? "/dashboard" : "/auth"}>
                    {t('getStarted')} <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="rounded-full px-8 border-gray-700 text-white hover:bg-gray-800">
                  <a href="#how-it-works">
                    {t('learnMore')}
                  </a>
                </Button>
              </div>
            </div>
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute -bottom-10 left-0 right-0 h-20 bg-gradient-to-b from-transparent to-black z-10"></div>
        </section>
        
        {/* How It Works Section */}
        <section id="how-it-works" className="py-20 bg-black">
          <div className="container px-4 mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-pinterest-red to-pink-600">
                How It Works
              </h2>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                Extract valuable keywords from any Pinterest pin in seconds. Optimize your content strategy with our powerful tool.
              </p>
            </div>
            
            <div className="max-w-4xl mx-auto">
              <KeywordDownloader />
            </div>
            
            <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="glass-card rounded-xl p-6 bg-gray-900/50 border border-gray-800 transition-all duration-300 hover:border-pinterest-red/50">
                <div className="w-12 h-12 rounded-xl bg-pinterest-red flex items-center justify-center text-white mb-4">
                  1
                </div>
                <h3 className="text-xl font-semibold mb-2">Paste any Pinterest URL</h3>
                <p className="text-gray-400">
                  Simply copy and paste the URL of any Pinterest pin you want to analyze.
                </p>
              </div>
              
              <div className="glass-card rounded-xl p-6 bg-gray-900/50 border border-gray-800 transition-all duration-300 hover:border-pinterest-red/50">
                <div className="w-12 h-12 rounded-xl bg-pinterest-red flex items-center justify-center text-white mb-4">
                  2
                </div>
                <h3 className="text-xl font-semibold mb-2">Get Pinterest Keywords</h3>
                <p className="text-gray-400">
                  Our AI analysis extracts the most valuable keywords from the pin content and metadata.
                </p>
              </div>
              
              <div className="glass-card rounded-xl p-6 bg-gray-900/50 border border-gray-800 transition-all duration-300 hover:border-pinterest-red/50">
                <div className="w-12 h-12 rounded-xl bg-pinterest-red flex items-center justify-center text-white mb-4">
                  3
                </div>
                <h3 className="text-xl font-semibold mb-2">Optimize Your Content</h3>
                <p className="text-gray-400">
                  Use these keywords to create better Pinterest pins and improve your SEO rankings.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-20 bg-gradient-to-b from-black to-gray-900">
          <div className="container px-4 mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('features')}</h2>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                {APP_DESCRIPTION}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="glass-card rounded-xl p-6 bg-gray-900/50 border border-gray-800 transition-all duration-300 hover:border-pinterest-red/50 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                <div className="w-12 h-12 rounded-xl bg-pinterest-red flex items-center justify-center text-white mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">{t('keywordResearchFeature')}</h3>
                <p className="text-gray-400">
                  {t('keywordResearchFeatureDesc')}
                </p>
              </div>
              
              {/* Feature 2 */}
              <div className="glass-card rounded-xl p-6 bg-gray-900/50 border border-gray-800 transition-all duration-300 hover:border-pinterest-red/50 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                <div className="w-12 h-12 rounded-xl bg-pinterest-red flex items-center justify-center text-white mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bar-chart"><line x1="12" x2="12" y1="20" y2="10"/><line x1="18" x2="18" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="16"/></svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">{t('rankTrackingFeature')}</h3>
                <p className="text-gray-400">
                  {t('rankTrackingFeatureDesc')}
                </p>
              </div>
              
              {/* Feature 3 */}
              <div className="glass-card rounded-xl p-6 bg-gray-900/50 border border-gray-800 transition-all duration-300 hover:border-pinterest-red/50 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                <div className="w-12 h-12 rounded-xl bg-pinterest-red flex items-center justify-center text-white mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-line-chart"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">{t('pinAnalysisFeature')}</h3>
                <p className="text-gray-400">
                  {t('pinAnalysisFeatureDesc')}
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Pricing Section */}
        <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
          <div className="container px-4 mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Pricing Plans</h2>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                Choose the perfect plan for your Pinterest marketing needs
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {/* Free Plan */}
              <div className="glass-card rounded-xl p-8 bg-gray-900/50 border border-gray-800 transition-all duration-300 hover:border-gray-700">
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-2">Free</h3>
                  <p className="text-3xl font-bold">$0<span className="text-lg text-gray-400">/month</span></p>
                  <p className="text-gray-400 mt-2">Perfect for casual Pinterest users</p>
                </div>
                
                <hr className="border-gray-800 my-6" />
                
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-pinterest-red mr-2 mt-0.5" />
                    <span>2 pin analyses per account</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-pinterest-red mr-2 mt-0.5" />
                    <span>Basic keyword data</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-pinterest-red mr-2 mt-0.5" />
                    <span>CSV export</span>
                  </li>
                  <li className="flex items-start opacity-50">
                    <Check className="h-5 w-5 mr-2 mt-0.5" />
                    <span>Historical data tracking</span>
                  </li>
                  <li className="flex items-start opacity-50">
                    <Check className="h-5 w-5 mr-2 mt-0.5" />
                    <span>Pin performance analytics</span>
                  </li>
                </ul>
                
                <Button asChild size="lg" variant="outline" className="w-full rounded-full">
                  <Link to={user ? "/dashboard" : "/auth"}>
                    Get Started Free
                  </Link>
                </Button>
              </div>
              
              {/* Pro Plan */}
              <div className="glass-card rounded-xl p-8 bg-gradient-to-br from-pinterest-red/20 to-black border border-pinterest-red/30 transition-all duration-300 hover:border-pinterest-red/50 relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-pinterest-red text-white px-4 py-1 text-sm font-bold">
                  POPULAR
                </div>
                
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-2">Pro</h3>
                  <p className="text-3xl font-bold">$19<span className="text-lg text-gray-400">/month</span></p>
                  <p className="text-gray-400 mt-2">For serious Pinterest marketers</p>
                </div>
                
                <hr className="border-gray-800 my-6" />
                
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-pinterest-red mr-2 mt-0.5" />
                    <span>Unlimited pin analyses</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-pinterest-red mr-2 mt-0.5" />
                    <span>Advanced keyword metrics</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-pinterest-red mr-2 mt-0.5" />
                    <span>Multiple export formats</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-pinterest-red mr-2 mt-0.5" />
                    <span>Historical data tracking</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-pinterest-red mr-2 mt-0.5" />
                    <span>Pin performance analytics</span>
                  </li>
                </ul>
                
                <Button asChild size="lg" className="w-full rounded-full bg-pinterest-red hover:bg-pinterest-dark">
                  <Link to={user ? "/dashboard" : "/auth"}>
                    Start Pro Trial
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 bg-black">
          <div className="container px-4 mx-auto">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to enhance your Pinterest strategy?
              </h2>
              <p className="text-lg text-gray-300 mb-8">
                Join thousands of Pinterest content creators who are already using Pinterest Grab to optimize their content.
              </p>
              <Button asChild size="lg" className="rounded-full px-8 bg-pinterest-red hover:bg-pinterest-dark">
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
