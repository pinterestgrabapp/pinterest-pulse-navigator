
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useLanguage } from "@/utils/languageUtils";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Link } from "react-router-dom";
import { Mail, MessageCircle, Video, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

const HelpPage = () => {
  const { t } = useLanguage();
  
  const faqs = [
    {
      question: "How do I analyze a Pinterest pin?",
      answer: "Navigate to the Pin Analysis page, enter the URL of the Pinterest pin you want to analyze in the input field, and click on the 'Analyze' button. The system will extract keywords and other data from the pin."
    },
    {
      question: "How accurate is the keyword extraction?",
      answer: "Our keyword extraction uses advanced AI models to identify relevant keywords from Pinterest pins. While it's highly accurate, we recommend reviewing the extracted keywords to ensure they align with your content goals."
    },
    {
      question: "Can I export my analyzed data?",
      answer: "Yes, you can download the data for each analyzed pin by clicking the download icon in the Actions column. You can also visit the Export page to view and download all your analyzed pins."
    },
    {
      question: "Is there a limit to how many pins I can analyze?",
      answer: "Free accounts can analyze up to 10 pins per month. Premium accounts have higher or unlimited limits depending on the subscription tier."
    },
    {
      question: "How do I save my favorite pins?",
      answer: "After analyzing a pin, you can save it to your collection by clicking the bookmark icon. Visit the Saved Pins page to view all your saved pins."
    },
    {
      question: "How is the Pin Score calculated?",
      answer: "The Pin Score is calculated based on a weighted formula that considers saves, clicks, impressions, and engagement rates. Higher scores indicate pins with better performance and potential reach."
    },
    {
      question: "How do I track keyword rankings?",
      answer: "Use our keyword tracking feature to monitor how your pins rank for specific keywords. You can add keywords to track and get weekly reports on ranking changes."
    }
  ];
  
  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Help Center</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Find answers to common questions and learn how to use all features
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="bg-black text-white rounded-xl border border-gray-800 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-900 rounded-lg">
              <Video className="h-5 w-5 text-blue-400" />
            </div>
            <h2 className="text-xl font-semibold">Video Tutorials</h2>
          </div>
          <p className="text-gray-400 mb-4">
            Watch our step-by-step tutorials to learn how to use all features efficiently
          </p>
          <Button variant="outline" className="w-full">
            Watch Tutorials
          </Button>
        </div>
        
        <div className="bg-black text-white rounded-xl border border-gray-800 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-900 rounded-lg">
              <FileText className="h-5 w-5 text-green-400" />
            </div>
            <h2 className="text-xl font-semibold">Documentation</h2>
          </div>
          <p className="text-gray-400 mb-4">
            Explore detailed guides and reference materials for all features
          </p>
          <Button variant="outline" className="w-full">
            View Documentation
          </Button>
        </div>
      </div>
      
      <div className="bg-black text-white rounded-xl border border-gray-800 shadow-sm mb-10">
        <div className="p-6 border-b border-gray-800">
          <h2 className="text-xl font-semibold">Frequently Asked Questions</h2>
        </div>
        <div className="p-6">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                <AccordionContent>
                  <p className="text-gray-400">{faq.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
      
      <div className="bg-black text-white rounded-xl border border-gray-800 shadow-sm">
        <div className="p-6 border-b border-gray-800">
          <h2 className="text-xl font-semibold">Contact Support</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-900 rounded-lg">
                  <Mail className="h-5 w-5 text-purple-400" />
                </div>
                <h3 className="text-lg font-medium">Email Support</h3>
              </div>
              <p className="text-gray-400 mb-4">
                Send us an email with your question or issue. We'll get back to you within 24 hours.
              </p>
              <Button variant="outline" className="mt-auto">
                Email Support
              </Button>
            </div>
            
            <div className="flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-rose-900 rounded-lg">
                  <MessageCircle className="h-5 w-5 text-rose-400" />
                </div>
                <h3 className="text-lg font-medium">Live Chat</h3>
              </div>
              <p className="text-gray-400 mb-4">
                Chat with our support team in real-time. Available Monday-Friday, 9am-5pm EST.
              </p>
              <Button variant="outline" className="mt-auto">
                Start Chat
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default HelpPage;
