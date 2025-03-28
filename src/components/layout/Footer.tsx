import { Link, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
interface FooterProps {
  className?: string;
}
const Footer = ({
  className
}: FooterProps) => {
  const {
    signOut,
    user
  } = useAuth();
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Success",
        description: "You have been logged out successfully"
      });
      navigate('/auth');
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive"
      });
    }
  };
  return <footer className={cn("bg-white dark:bg-black py-6 border-t border-gray-200 dark:border-white/5", className)}>
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center">
            
          </div>
          
          
          
          <div className="text-gray-600 dark:text-gray-400 text-sm mx-[240px]">
            &copy; {new Date().getFullYear()} Pinterest Grab. All rights reserved.
          </div>
        </div>
      </div>
    </footer>;
};
export default Footer;