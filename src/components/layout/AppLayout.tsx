
import React, { ReactNode, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from './AppSidebar';
import { AppHeader } from './AppHeader';
import { useToast } from '@/hooks/use-toast';
import { useRealTimeDataContext } from '@/providers/RealTimeDataProvider';

interface AppLayoutProps {
  children: ReactNode;
  allowedRoles?: string[];
}

export function AppLayout({ children, allowedRoles = [] }: AppLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { connectToDatabase, isConnected } = useRealTimeDataContext();

  useEffect(() => {
    let cleanupFn: (() => void) | undefined;
    const setupUser = async () => {
      // In a real app, this would be a proper auth check
      const role = localStorage.getItem('userRole');
      
      // If no role is found, use the current path to extract a role (for demo purposes)
      const pathRole = location.pathname.split('/')[1];
      const validRoles = ['admin', 'hr', 'employee'];
      const detectedRole = role || (validRoles.includes(pathRole) ? pathRole : null);
      
      setUserRole(detectedRole);
      
      if (!detectedRole) {
        navigate('/auth');
        toast({
          title: "Authentication required",
          description: "Please log in to continue.",
          variant: "destructive",
        });
      } else if (allowedRoles.length > 0 && !allowedRoles.includes(detectedRole)) {
        navigate(`/${detectedRole}/dashboard`);
        toast({
          title: "Access denied",
          description: "You don't have permission to access this page.",
          variant: "destructive",
        });
      } else {
        // If no role in localStorage, but we detected one from URL, save it (for demo)
        if (!role && validRoles.includes(pathRole)) {
          localStorage.setItem('userRole', pathRole);
        }
        
        // Connect to database for real-time updates if not already connected
        if (!isConnected && detectedRole) {
          cleanupFn = await connectToDatabase(detectedRole);
        }
      }
      
      setIsLoading(false);
    };
    
    setupUser();
    
    return () => {
      if (cleanupFn) cleanupFn();
    };
  }, [navigate, allowedRoles, toast, location, connectToDatabase, isConnected]);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse text-lg font-medium">Loading...</div>
    </div>;
  }

  if (!userRole || (allowedRoles.length > 0 && !allowedRoles.includes(userRole))) {
    return null;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar userRole={userRole} />
        <div className="flex-1 flex flex-col">
          <AppHeader userRole={userRole} />
          <main className="flex-1 px-6 py-4 overflow-auto">
            <div className="mx-auto w-full max-w-7xl">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
