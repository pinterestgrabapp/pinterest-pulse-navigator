
import { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="glass-card p-8 rounded-xl border border-gray-800 max-w-md w-full">
        <div className="text-center">
          <h1 className="text-6xl font-bold mb-4 text-pinterest-red">404</h1>
          <p className="text-xl text-gray-300 mb-6">Oops! Page not found</p>
          <p className="text-gray-400 mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
          
          <div className="space-y-3">
            <Link 
              to="/" 
              className="block w-full py-2 px-4 bg-pinterest-red hover:bg-pinterest-dark text-white rounded-md transition-colors"
            >
              Return to Home
            </Link>
            
            <Link 
              to="/dashboard" 
              className="block w-full py-2 px-4 bg-gray-800 hover:bg-gray-700 text-white rounded-md transition-colors"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
