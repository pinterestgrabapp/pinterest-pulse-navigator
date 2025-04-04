import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ui/ThemeProvider";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import { LanguageProvider } from "@/utils/languageUtils";

// Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import PinterestCallback from "./pages/PinterestCallback";
import KeywordResearch from "./pages/KeywordResearch";
import PinAnalysis from "./pages/PinAnalysis";
import AdvancedAnalytics from "./pages/AdvancedAnalytics";
import PinStats from "./pages/PinStats";
import ContentCalendar from "./pages/ContentCalendar";
import SavedPins from "./pages/SavedPins";
import Export from "./pages/Export";
import Ecommerce from "./pages/Ecommerce";
import TeamCollaboration from "./pages/TeamCollaboration";
import CreatePin from "./pages/CreatePin";
import AdCampaigns from "./pages/AdCampaigns";
import Analytics from "./pages/Analytics";
import Help from "./pages/Help";
import Pricing from "./pages/Pricing";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AuthProvider>
        <LanguageProvider>
          <Toaster />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/pinterest-callback" element={<PinterestCallback />} />
              
              {/* Protected Routes */}
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
              <Route path="/keyword-research" element={<ProtectedRoute><KeywordResearch /></ProtectedRoute>} />
              <Route path="/pin-analysis" element={<ProtectedRoute><PinAnalysis /></ProtectedRoute>} />
              <Route path="/advanced-analytics" element={<ProtectedRoute><AdvancedAnalytics /></ProtectedRoute>} />
              <Route path="/pin-stats" element={<ProtectedRoute><PinStats /></ProtectedRoute>} />
              <Route path="/content-calendar" element={<ProtectedRoute><ContentCalendar /></ProtectedRoute>} />
              <Route path="/saved-pins" element={<ProtectedRoute><SavedPins /></ProtectedRoute>} />
              <Route path="/export" element={<ProtectedRoute><Export /></ProtectedRoute>} />
              <Route path="/ecommerce" element={<ProtectedRoute><Ecommerce /></ProtectedRoute>} />
              <Route path="/team" element={<ProtectedRoute><TeamCollaboration /></ProtectedRoute>} />
              <Route path="/create-pin" element={<ProtectedRoute><CreatePin /></ProtectedRoute>} />
              <Route path="/ad-campaigns" element={<ProtectedRoute><AdCampaigns /></ProtectedRoute>} />
              <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
              
              {/* Public Routes */}
              <Route path="/help" element={<Help />} />
              <Route path="/pricing" element={<Pricing />} />
              
              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </LanguageProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
