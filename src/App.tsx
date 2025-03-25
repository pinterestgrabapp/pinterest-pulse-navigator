
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
import CreatePin from "./pages/CreatePin";
import Settings from "./pages/Settings";
import Export from "./pages/Export";
import Help from "./pages/Help";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="dark">
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/help" element={<Help />} />
              
              {/* Protected Routes */}
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/keyword-research" element={<ProtectedRoute><KeywordResearch /></ProtectedRoute>} />
              <Route path="/pin-analysis" element={<ProtectedRoute><PinAnalysis /></ProtectedRoute>} />
              <Route path="/create-pin" element={<ProtectedRoute><CreatePin /></ProtectedRoute>} />
              <Route path="/export" element={<ProtectedRoute><Export /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
              <Route path="/pin-status" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              
              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
