
import { Link, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { toast } from "sonner";

interface FooterProps {
  className?: string;
}

const Footer = ({
  className
}: FooterProps) => {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success("You have been logged out successfully");
      navigate('/auth');
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to log out. Please try again.");
    }
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
            <Link to="/help" className="text-gray-600 hover:text-pinterest-red dark:text-gray-400 dark:hover:text-pinterest-red transition-colors hover:glow-text-red">
              Help
            </Link>
            <Link to="/pricing" className="text-gray-600 hover:text-pinterest-red dark:text-gray-400 dark:hover:text-pinterest-red transition-colors hover:glow-text-red">
              Pricing
            </Link>
            <Link to="/settings" className="text-gray-600 hover:text-pinterest-red dark:text-gray-400 dark:hover:text-pinterest-red transition-colors hover:glow-text-red">
              Settings
            </Link>
            {user && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleLogout} 
                className="text-gray-600 hover:text-pinterest-red dark:text-gray-400 dark:hover:text-pinterest-red flex items-center gap-2 transition-colors group"
              >
                <LogOut className="h-4 w-4 group-hover:text-pinterest-red transition-colors" /> 
                <span className="group-hover:text-pinterest-red">Logout</span>
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
