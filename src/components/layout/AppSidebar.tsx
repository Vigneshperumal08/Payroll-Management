
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { 
  BarChart3, 
  Building2, 
  Calendar, 
  CreditCard, 
  FileText, 
  Home, 
  LayoutDashboard, 
  LifeBuoy, 
  Settings, 
  UserCog, 
  Users, 
  Wallet,
  Calculator,
  ClipboardCheck,
  HeartHandshake,
  DollarSign,
  BadgePercent,
  Clock,
  Info,
  Shield,
  Bell,
  User,
  FileDown,
  Search,
  Download
} from 'lucide-react';

interface NavigationItem {
  title: string;
  href: string;
  icon: React.ElementType;
}

const commonNavItems: NavigationItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Profile",
    href: "/profile",
    icon: User,
  },
  {
    title: "Notifications",
    href: "/notifications",
    icon: Bell,
  }
];

const adminNavItems: NavigationItem[] = [
  ...commonNavItems,
  {
    title: "Company",
    href: "/admin/company",
    icon: Building2,
  },
  {
    title: "User Management",
    href: "/admin/user-management",
    icon: Users,
  },
  {
    title: "Employee Management",
    href: "/admin/employee-management",
    icon: Users,
  },
  {
    title: "Payroll",
    href: "/admin/payroll",
    icon: CreditCard,
  },
  {
    title: "Tax Calculator",
    href: "/admin/tax-calculator",
    icon: Calculator,
  },
  {
    title: "Benefits",
    href: "/admin/benefits",
    icon: HeartHandshake,
  },
  {
    title: "Attendance",
    href: "/admin/attendance",
    icon: ClipboardCheck,
  },
  {
    title: "Deductions",
    href: "/admin/deductions",
    icon: BadgePercent,
  },
  {
    title: "Reports",
    href: "/admin/reports",
    icon: BarChart3,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
  {
    title: "Security",
    href: "/admin/security",
    icon: Shield,
  },
];

const hrNavItems: NavigationItem[] = [
  ...commonNavItems,
  {
    title: "Employee Management",
    href: "/hr/employee-management",
    icon: Users,
  },
  {
    title: "Tax Calculator",
    href: "/hr/tax-calculator",
    icon: Calculator,
  },
  {
    title: "Attendance",
    href: "/hr/attendance",
    icon: ClipboardCheck,
  },
  {
    title: "Benefits",
    href: "/hr/benefits",
    icon: HeartHandshake,
  },
  {
    title: "Payroll",
    href: "/hr/payroll",
    icon: DollarSign,
  },
  {
    title: "Deductions",
    href: "/hr/deductions",
    icon: BadgePercent,
  },
  {
    title: "Leave Management",
    href: "/hr/leave",
    icon: Calendar,
  },
  {
    title: "Reports",
    href: "/hr/reports",
    icon: FileText,
  },
];

const employeeNavItems: NavigationItem[] = [
  ...commonNavItems,
  {
    title: "Pay Stubs",
    href: "/employee/pay-stubs",
    icon: FileText,
  },
  {
    title: "Attendance",
    href: "/employee/attendance",
    icon: ClipboardCheck,
  },
  {
    title: "Time & Attendance",
    href: "/employee/time-attendance",
    icon: Clock,
  },
  {
    title: "Benefits",
    href: "/employee/benefits",
    icon: HeartHandshake,
  },
  {
    title: "Tax Information",
    href: "/employee/tax-info",
    icon: Info,
  },
  {
    title: "Leave Requests",
    href: "/employee/leave",
    icon: Calendar,
  },
];

interface AppSidebarProps {
  userRole: string | null;
}

export function AppSidebar({ userRole }: AppSidebarProps) {
  const location = useLocation();
  let navItems: NavigationItem[] = [];
  let rolePrefix = '';
  
  switch(userRole) {
    case 'admin':
      navItems = adminNavItems;
      rolePrefix = '/admin';
      break;
    case 'hr':
      navItems = hrNavItems;
      rolePrefix = '/hr';
      break;
    case 'employee':
      navItems = employeeNavItems;
      rolePrefix = '/employee';
      break;
    default:
      navItems = commonNavItems;
  }
  
  // Fix paths to include role prefix
  navItems = navItems.map(item => ({
    ...item,
    href: item.href.startsWith(`/${userRole}`) ? item.href : `${rolePrefix}${item.href}`
  }));

  return (
    <Sidebar>
      <SidebarHeader>
        <NavLink to={`${rolePrefix}/dashboard`} className="flex items-center gap-2 px-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-md bg-primary text-primary-foreground font-bold">
            PR
          </div>
          <div className="font-bold text-lg">PRMS</div>
        </NavLink>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.href}
                      className={({ isActive }) => 
                        cn("flex items-center gap-3 px-3 py-2 rounded-md", 
                          isActive ? "menu-item-active" : "hover:bg-accent/10 transition-colors"
                        )
                      }
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter>
        <div className="px-3 py-2">
          <NavLink
            to="/help"
            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent/10 transition-colors"
          >
            <LifeBuoy className="h-5 w-5" />
            <span>Help & Support</span>
          </NavLink>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
