
import React, { ReactNode, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  
  console.log("[ProtectedRoute] Rendering with user:", user ? "exists" : "null", "loading:", loading);
  
  useEffect(() => {
    console.log("[ProtectedRoute] Effect triggered, user:", user ? "exists" : "null", "loading:", loading);
  }, [user, loading]);

  if (loading) {
    console.log("[ProtectedRoute] Loading state, showing loader");
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    console.log("[ProtectedRoute] No user, redirecting to /auth");
    return <Navigate to="/auth" replace />;
  }

  console.log("[ProtectedRoute] User authenticated, rendering children");
  return <>{children}</>;
};

export default ProtectedRoute;
