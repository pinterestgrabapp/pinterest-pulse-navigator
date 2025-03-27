
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

interface FooterProps {
  className?: string;
}

const Footer = ({
  className
}: FooterProps) => {
  const { signOut, user } = useAuth();

  const handleLogout = async () => {
    await signOut();
  };

  return <footer className={cn("bg-white dark:bg-black py-6 border-t border-gray-200 dark:border-white/5", className)}>
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <img src="/lovable-uploads/6d729402-326b-4ed3-a98b-f5f9eb232592.png" alt="Pinterest Grab" className="h-6" />
              <span className="font-medium">Pinterest Grab</span>
            </Link>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
            <Link to="/help" className="text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary transition-colors">
              Help
            </Link>
            <Link to="/pricing" className="text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary transition-colors">
              Pricing
            </Link>
            <Link to="/settings" className="text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary transition-colors">
              Settings
            </Link>
            {user && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleLogout} 
                className="text-gray-600 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-500 flex items-center gap-2 transition-colors"
              >
                <LogOut className="h-4 w-4" /> Logout
              </Button>
            )}
          </div>
          
          <div className="text-gray-600 dark:text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} Pinterest Grab. All rights reserved.
          </div>
        </div>
      </div>
    </footer>;
};

export default Footer;
