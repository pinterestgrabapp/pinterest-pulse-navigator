import React from 'react';
import { Link } from "react-router-dom";
import { Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/contexts/AuthContext";
const Pricing = () => {
  const {
    user
  } = useAuth();
  return <div className="min-h-screen flex flex-col bg-white dark:bg-black text-black dark:text-white">
      <Navbar />
      
      <main className="flex-1 pt-20">
        {/* Hero Section */}
        <section className="py-16 relative overflow-hidden">
          <div className="container px-4 mx-auto">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 animate-fade-in-up">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-pinterest-red to-pink-600">
                  Choose the Perfect Plan
                </span>
              </h1>
              <p className="text-xl text-gray-700 dark:text-gray-300 mb-8 leading-relaxed animate-fade-in-up">
                Get the most out of Pinterest Grab with our flexible pricing options.
                From casual pinners to professional marketers, we have a plan for you.
              </p>
            </div>
          </div>
        </section>
        
        {/* Pricing Section */}
        <section className="py-16 bg-gray-50 dark:bg-black">
          <div className="container px-4 mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {/* Pro Plan */}
              <div className="glass-card rounded-xl p-8 bg-white/50 dark:bg-black border border-white/30 dark:border-white/10 transition-all duration-300 hover:border-gray-300 dark:hover:border-white/20">
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-2">Pro</h3>
                  <p className="text-3xl font-bold">$19<span className="text-lg text-gray-400">/month</span></p>
                  <p className="text-gray-600 dark:text-gray-400 mt-2">Perfect for Pinterest creators and marketers</p>
                </div>
                
                <hr className="border-gray-200 dark:border-gray-800 my-6" />
                
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-pinterest-red mr-2 mt-0.5" />
                    <span>Keyword Explorer tool</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-pinterest-red mr-2 mt-0.5" />
                    <span>Account Explorer tool</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-pinterest-red mr-2 mt-0.5" />
                    <span>Top Pins tool</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-pinterest-red mr-2 mt-0.5" />
                    <span>Pin Stats tool</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-pinterest-red mr-2 mt-0.5" />
                    <span>Save Pins</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-pinterest-red mr-2 mt-0.5" />
                    <span>Track 35 keyword rankings</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-pinterest-red mr-2 mt-0.5" />
                    <span>Track 60 Pinterest search suggestion changes</span>
                  </li>
                </ul>
                
                <Button asChild size="lg" variant="outline" className="w-full rounded-full border border-white/30 dark:border-white/10">
                  <Link to={user ? "/dashboard" : "/auth"}>
                    Get Started with Pro
                  </Link>
                </Button>
              </div>
              
              {/* Plus Plan */}
              <div className="glass-card rounded-xl p-8 bg-gradient-to-br from-pinterest-red/20 to-transparent border border-pinterest-red/30 dark:border-pinterest-red/30 transition-all duration-300 hover:border-pinterest-red/50 relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-pinterest-red text-white px-4 py-1 text-sm font-bold">
                  POPULAR
                </div>
                
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-2">Plus</h3>
                  <p className="text-3xl font-bold">$39<span className="text-lg text-gray-400">/month</span></p>
                  <p className="text-gray-600 dark:text-gray-400 mt-2">For professional Pinterest marketers</p>
                </div>
                
                <hr className="border-gray-200 dark:border-gray-800 my-6" />
                
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-pinterest-red mr-2 mt-0.5" />
                    <span>Everything in Pro, plus</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-pinterest-red mr-2 mt-0.5" />
                    <span>Track Unlimited keyword rankings</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-pinterest-red mr-2 mt-0.5" />
                    <span>Track Unlimited Pinterest search suggestion changes</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-pinterest-red mr-2 mt-0.5" />
                    <span>Custom lists for saved pins</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-pinterest-red mr-2 mt-0.5" />
                    <span>Custom lists for keywords</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-pinterest-red mr-2 mt-0.5" />
                    <span>Keyword Explorer exporting</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-pinterest-red mr-2 mt-0.5" />
                    <span>Account Explorer exporting</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-pinterest-red mr-2 mt-0.5" />
                    <span>Follow Pinterest Accounts in Account Explorer</span>
                  </li>
                </ul>
                
                <Button asChild size="lg" className="w-full rounded-full bg-pinterest-red hover:bg-pinterest-dark border border-white/10">
                  <Link to={user ? "/dashboard" : "/auth"}>
                    Start Plus Trial
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        {/* FAQ Section */}
        <section className="py-16 bg-white dark:bg-black">
          <div className="container px-4 mx-auto">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
              
              <div className="space-y-6">
                <div className="p-6 rounded-xl border border-white/30 dark:border-white/10 bg-white dark:bg-black/50">
                  <h3 className="text-xl font-semibold mb-2">What's included in the Pro plan?</h3>
                  <p className="text-gray-600 dark:text-gray-400">The Pro plan includes our Keyword Explorer, Account Explorer, Top Pins tool, Pin Stats tool, the ability to save pins, tracking for up to 25 keyword rankings, and tracking for 50 Pinterest search suggestion changes.</p>
                </div>
                
                <div className="p-6 rounded-xl border border-white/30 dark:border-white/10 bg-white dark:bg-black/50">
                  <h3 className="text-xl font-semibold mb-2">What additional features come with the Plus plan?</h3>
                  <p className="text-gray-600 dark:text-gray-400">The Plus plan includes everything in Pro, plus unlimited keyword ranking tracking, unlimited Pinterest search suggestion tracking, custom lists for saved pins and keywords, exporting capabilities for Keyword Explorer and Account Explorer, and the ability to follow Pinterest accounts in Account Explorer.</p>
                </div>
                
                <div className="p-6 rounded-xl border border-white/30 dark:border-white/10 bg-white dark:bg-black/50">
                  <h3 className="text-xl font-semibold mb-2">Can I upgrade or downgrade my plan later?</h3>
                  <p className="text-gray-600 dark:text-gray-400">Yes, you can upgrade or downgrade your plan at any time. Changes will take effect at the end of your current billing cycle.</p>
                </div>
                
                <div className="p-6 rounded-xl border border-white/30 dark:border-white/10 bg-white dark:bg-black/50">
                  <h3 className="text-xl font-semibold mb-2">How often is keyword data updated?</h3>
                  <p className="text-gray-600 dark:text-gray-400">Keyword rankings and search suggestions are updated every 7 days, giving you fresh data to optimize your Pinterest strategy.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 bg-gray-50 dark:bg-black">
          <div className="container px-4 mx-auto">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6">
                Ready to optimize your Pinterest strategy?
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                Join thousands of Pinterest creators who are already using our tools to improve their content.
              </p>
              <Button asChild size="lg" className="rounded-full px-8 bg-pinterest-red hover:bg-pinterest-dark border border-white/10">
                <Link to={user ? "/dashboard" : "/auth"}>
                  Get Started Now <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>;
};
export default Pricing;