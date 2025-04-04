
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/hooks/use-theme";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import KeywordResearch from "./pages/KeywordResearch";
import PinAnalysis from "./pages/PinAnalysis";
import PinterestAnalytics from "./pages/PinterestAnalytics";
import CreatePin from "./pages/CreatePin";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import Export from "./pages/Export";
import Help from "./pages/Help";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import Pricing from "./pages/Pricing";
import PinStats from "./pages/PinStats";
import SavedPins from "./pages/SavedPins";
import PinterestCallback from "./pages/PinterestCallback";

// New pages for additional features
import Analytics from "./pages/Analytics";
import AdCampaigns from "./pages/AdCampaigns";
import ContentCalendar from "./pages/ContentCalendar";
import TeamCollaboration from "./pages/TeamCollaboration";
import Ecommerce from "./pages/Ecommerce";

// Create a new query client instance outside the component
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const App = () => (
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter basename="/">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/help" element={<Help />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/pinterest-callback" element={<PinterestCallback />} />
                
                {/* Protected Routes */}
                <Route path="/dashboard" element={<ProtectedRoute><PinAnalysis /></ProtectedRoute>} />
                <Route path="/pin-analysis" element={<ProtectedRoute><PinAnalysis /></ProtectedRoute>} />
                <Route path="/keyword-research" element={<ProtectedRoute><KeywordResearch /></ProtectedRoute>} />
                <Route path="/dashboard-home" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/create-pin" element={<ProtectedRoute><CreatePin /></ProtectedRoute>} />
                <Route path="/export" element={<ProtectedRoute><Export /></ProtectedRoute>} />
                <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/pin-stats" element={<ProtectedRoute><PinStats /></ProtectedRoute>} />
                <Route path="/saved-pins" element={<ProtectedRoute><SavedPins /></ProtectedRoute>} />
                <Route path="/pinterest-analytics" element={<ProtectedRoute><PinterestAnalytics /></ProtectedRoute>} />
                
                {/* New Protected Routes for Additional Features */}
                <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
                <Route path="/ad-campaigns" element={<ProtectedRoute><AdCampaigns /></ProtectedRoute>} />
                <Route path="/content-calendar" element={<ProtectedRoute><ContentCalendar /></ProtectedRoute>} />
                <Route path="/team-collaboration" element={<ProtectedRoute><TeamCollaboration /></ProtectedRoute>} />
                <Route path="/ecommerce" element={<ProtectedRoute><Ecommerce /></ProtectedRoute>} />
                
                {/* 404 Route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

export default App;
