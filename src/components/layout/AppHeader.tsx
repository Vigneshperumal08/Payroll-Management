
import React, { useState } from 'react';
import { Bell, Search, User, Download, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useNavigate } from 'react-router-dom';
import { SidebarTrigger } from '@/components/ui/sidebar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

interface AppHeaderProps {
  userRole: string | null;
}

interface SearchResult {
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
  category: string;
}

export function AppHeader({ userRole }: AppHeaderProps) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  
  const handleLogout = () => {
    localStorage.removeItem('userRole');
    navigate('/auth');
  };
  
  const userRoleLabel = userRole ? userRole.charAt(0).toUpperCase() + userRole.slice(1) : 'User';
  
  let userName = 'John Doe';
  let userEmail = 'user@example.com';
  
  switch(userRole) {
    case 'admin':
      userName = 'Admin User';
      userEmail = 'admin@prms.com';
      break;
    case 'hr':
      userName = 'HR Manager';
      userEmail = 'hr@prms.com';
      break;
    case 'employee':
      userName = 'Employee User';
      userEmail = 'employee@prms.com';
      break;
  }
  
  const userInitials = userName.split(' ').map(name => name[0]).join('');

  // Mock search function - in a real app this would search through data
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    const query_lower = query.toLowerCase();

    const mockData: Record<string, SearchResult[]> = {
      admin: [
        { 
          title: 'Payroll Management',
          description: 'Manage company payroll',
          icon: <FileText className="h-4 w-4" />,
          path: '/admin/payroll',
          category: 'Page'
        },
        { 
          title: 'Employee Management',
          description: 'View and manage employees',
          icon: <User className="h-4 w-4" />,
          path: '/admin/employee-management',
          category: 'Page'
        },
        { 
          title: 'Tax Calculator',
          description: 'Calculate employee taxes',
          icon: <FileText className="h-4 w-4" />,
          path: '/admin/tax-calculator',
          category: 'Tool'
        },
        { 
          title: 'Generate Reports',
          description: 'Create and download reports',
          icon: <Download className="h-4 w-4" />,
          path: '/admin/reports',
          category: 'Action'
        },
      ],
      hr: [
        { 
          title: 'Employee Management',
          description: 'View and manage employees',
          icon: <User className="h-4 w-4" />,
          path: '/hr/employee-management',
          category: 'Page'
        },
        { 
          title: 'Tax Calculator',
          description: 'Calculate employee taxes',
          icon: <FileText className="h-4 w-4" />,
          path: '/hr/tax-calculator',
          category: 'Tool'
        },
        { 
          title: 'Benefits Management',
          description: 'Manage employee benefits',
          icon: <FileText className="h-4 w-4" />,
          path: '/hr/benefits',
          category: 'Page'
        },
        { 
          title: 'Generate Reports',
          description: 'Create and download reports',
          icon: <Download className="h-4 w-4" />,
          path: '/hr/reports',
          category: 'Action'
        },
      ],
      employee: [
        { 
          title: 'Pay Stubs',
          description: 'View your past pay stubs',
          icon: <FileText className="h-4 w-4" />,
          path: '/employee/pay-stubs',
          category: 'Page'
        },
        { 
          title: 'Attendance Record',
          description: 'Check your attendance history',
          icon: <FileText className="h-4 w-4" />,
          path: '/employee/attendance',
          category: 'Page'
        },
        { 
          title: 'Benefits',
          description: 'View your employee benefits',
          icon: <FileText className="h-4 w-4" />,
          path: '/employee/benefits',
          category: 'Page'
        },
        { 
          title: 'Leave Request',
          description: 'Submit a leave request',
          icon: <Download className="h-4 w-4" />,
          path: '/employee/leave',
          category: 'Action'
        },
      ]
    };

    // Filter results based on role and search term
    const roleResults = mockData[userRole || 'employee'] || [];
    const filteredResults = roleResults.filter(item => 
      item.title.toLowerCase().includes(query_lower) || 
      item.description.toLowerCase().includes(query_lower)
    );
    
    setSearchResults(filteredResults);
  };

  const handleSearchResultClick = (path: string) => {
    setSearchDialogOpen(false);
    setSearchQuery('');
    navigate(path);
  };

  return (
    <header className="border-b sticky top-0 z-10 bg-background/95 backdrop-blur">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-2 lg:gap-4 lg:hidden">
          <SidebarTrigger />
        </div>
        
        <div className="hidden md:flex md:flex-1">
          <div className="max-w-sm w-full">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                className="w-full bg-background pl-8 md:w-[200px] lg:w-[300px]"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                onFocus={() => setSearchDialogOpen(true)}
              />
            </div>
          </div>
        </div>
        
        <Dialog open={searchDialogOpen} onOpenChange={setSearchDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Search</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <div className="relative mb-4">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search for pages, tools, and more..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  autoFocus
                />
              </div>
              
              {searchQuery.trim() && (
                <>
                  {searchResults.length > 0 ? (
                    <div className="space-y-4">
                      <div className="text-sm font-medium text-muted-foreground">
                        Results
                      </div>
                      <div className="space-y-2">
                        {searchResults.map((result, index) => (
                          <div 
                            key={index}
                            className="flex items-start p-2 rounded-md hover:bg-accent/50 cursor-pointer"
                            onClick={() => handleSearchResultClick(result.path)}
                          >
                            <div className="h-8 w-8 flex-shrink-0 rounded-md border bg-background p-1 flex items-center justify-center">
                              {result.icon}
                            </div>
                            <div className="ml-3 overflow-hidden">
                              <div className="font-medium">{result.title}</div>
                              <div className="text-sm text-muted-foreground truncate">{result.description}</div>
                            </div>
                            <Badge variant="outline" className="ml-auto">
                              {result.category}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-muted-foreground">No results found</p>
                    </div>
                  )}
                </>
              )}
              
              {!searchQuery.trim() && (
                <div className="text-center py-6">
                  <p className="text-muted-foreground">Try searching for pages, tools, or actions</p>
                </div>
              )}
              
              <div className="text-xs text-muted-foreground mt-6">
                <p>Press <kbd className="px-1 py-0.5 rounded border bg-background">ESC</kbd> to close</p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative"
            onClick={() => navigate(`/${userRole}/notifications`)}
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary"></span>
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="" alt={userName} />
                  <AvatarFallback>{userInitials}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{userName}</p>
                  <p className="text-xs leading-none text-muted-foreground">{userEmail}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate(`/${userRole}/profile`)}>
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate(`/${userRole}/settings`)}>
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
