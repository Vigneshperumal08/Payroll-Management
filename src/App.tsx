
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { RealTimeDataProvider } from "@/providers/RealTimeDataProvider";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/AdminDashboard";
import HrDashboard from "./pages/HrDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import TaxCalculator from "./pages/TaxCalculator";
import AttendanceManagement from "./pages/AttendanceManagement";
import EmployeeAttendance from "./pages/EmployeeAttendance";
import BenefitsManagement from "./pages/BenefitsManagement";
import UserManagement from "./pages/UserManagement";
import PayrollManagement from "./pages/PayrollManagement";
import EmployeeManagement from "./pages/EmployeeManagement";
import ProfilePage from "./pages/ProfilePage";
import Reports from "./pages/Reports";
import DeductionsManagement from "./pages/DeductionsManagement";
import Notifications from "./pages/Notifications";
import LoadingPage from "./pages/LoadingPage";
import ServerConnectionPage from "./pages/ServerConnectionPage";
import { SplashScreen } from "./components/splash/SplashScreen";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false
    },
  },
});

const App = () => (
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <RealTimeDataProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/" element={<SplashScreen />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/loading" element={<LoadingPage />} />
            <Route path="/connect" element={<ServerConnectionPage />} />
            <Route path="/home" element={<Index />} />
            
            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/user-management" element={<UserManagement />} />
            <Route path="/admin/employee-management" element={<EmployeeManagement />} />
            <Route path="/admin/reports" element={<Reports />} />
            <Route path="/admin/profile" element={<ProfilePage />} />
            <Route path="/admin/payroll" element={<PayrollManagement />} />
            <Route path="/admin/settings" element={<ProfilePage />} />
            <Route path="/admin/security" element={<ProfilePage />} />
            <Route path="/admin/notifications" element={<Notifications />} />
            <Route path="/admin/benefits" element={<BenefitsManagement />} />
            <Route path="/admin/tax-calculator" element={<TaxCalculator />} />
            <Route path="/admin/deductions" element={<DeductionsManagement />} />
            <Route path="/admin/attendance" element={<AttendanceManagement />} />
            
            {/* HR Routes */}
            <Route path="/hr/dashboard" element={<HrDashboard />} />
            <Route path="/hr/tax-calculator" element={<TaxCalculator />} />
            <Route path="/hr/attendance" element={<AttendanceManagement />} />
            <Route path="/hr/benefits" element={<BenefitsManagement />} />
            <Route path="/hr/payroll" element={<PayrollManagement />} />
            <Route path="/hr/employee-management" element={<EmployeeManagement />} />
            <Route path="/hr/reports" element={<Reports />} />
            <Route path="/hr/profile" element={<ProfilePage />} />
            <Route path="/hr/settings" element={<ProfilePage />} />
            <Route path="/hr/deductions" element={<DeductionsManagement />} />
            <Route path="/hr/leave" element={<AttendanceManagement />} />
            <Route path="/hr/notifications" element={<Notifications />} />
            
            {/* Employee Routes */}
            <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
            <Route path="/employee/attendance" element={<EmployeeAttendance />} />
            <Route path="/employee/pay-stubs" element={<Reports />} />
            <Route path="/employee/profile" element={<ProfilePage />} />
            <Route path="/employee/benefits" element={<BenefitsManagement />} />
            <Route path="/employee/tax-info" element={<TaxCalculator />} />
            <Route path="/employee/leave" element={<EmployeeAttendance />} />
            <Route path="/employee/notifications" element={<Notifications />} />
            <Route path="/employee/time-attendance" element={<EmployeeAttendance />} />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </RealTimeDataProvider>
    </QueryClientProvider>
  </BrowserRouter>
);

export default App;
