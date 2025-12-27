import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Auth from "./pages/Auth";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Reporting from "./pages/Reporting";
import MaintenanceDetails from "./pages/MaintenanceDetails";
import MaintenanceCalendar from "./pages/MaintenanceCalendar";
import Teams from "./pages/Teams";

// 👇 1. IMPORT EQUIPMENT PAGES
import WorkCenter from "./pages/equipments/WorkCenter";
import Machines from "./pages/equipments/Machines"; 

const queryClient = new QueryClient();

// Protected Route wrapper
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('authToken');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster position="top-right" richColors />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Auth />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Protected Routes with Layout */}
          <Route
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            
            {/* Maintenance */}
            <Route path="/maintenance" element={<MaintenanceCalendar />} />
            <Route path="/maintenance/:id" element={<MaintenanceDetails />} />
            
            {/* 👇 2. ADD EQUIPMENT ROUTES HERE */}
            <Route path="/equipment/work-center" element={<WorkCenter />} />
            <Route path="/equipment/machines" element={<Machines />} />

            <Route path="/teams" element={<Teams />} />
            <Route path="/reporting" element={<Reporting />} />
            <Route path="/settings" element={<Settings />} />
          </Route>

          {/* Redirects */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;