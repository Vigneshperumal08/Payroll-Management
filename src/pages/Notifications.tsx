
import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Bell, 
  Calendar, 
  Clock, 
  AlertCircle,
  FileText, 
  CheckCircle2,
  XCircle,
  Calendar as CalendarIcon,
  Inbox
} from 'lucide-react';

type Notification = {
  id: string;
  title: string;
  description: string;
  date: string;
  read: boolean;
  type: 'alert' | 'info' | 'success' | 'warning';
  category: 'system' | 'payroll' | 'leave' | 'task';
};

const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'Payroll Processing Complete',
    description: 'July 2023 payroll has been processed successfully.',
    date: '2023-07-05T10:30:00',
    read: false,
    type: 'success',
    category: 'payroll'
  },
  {
    id: '2',
    title: 'Tax Filing Deadline',
    description: 'Quarterly tax filing deadline is approaching on July 15.',
    date: '2023-07-01T09:15:00',
    read: false,
    type: 'warning',
    category: 'system'
  },
  {
    id: '3',
    title: 'New Leave Request',
    description: 'John Smith has requested vacation leave from Jul 20-25.',
    date: '2023-06-28T14:20:00',
    read: true,
    type: 'info',
    category: 'leave'
  },
  {
    id: '4',
    title: 'System Update',
    description: 'The system will undergo maintenance on July 10 from 10PM-2AM.',
    date: '2023-06-27T11:45:00',
    read: true,
    type: 'alert',
    category: 'system'
  },
  {
    id: '5',
    title: 'Benefits Enrollment Period',
    description: 'Annual benefits enrollment period starts on August 1.',
    date: '2023-06-25T16:30:00',
    read: true,
    type: 'info',
    category: 'system'
  }
];

const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [notificationSettings, setNotificationSettings] = useState({
    email: true,
    app: true,
    payroll: true,
    leave: true,
    system: true,
    task: false
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true } 
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => 
      prev.filter(notification => notification.id !== id)
    );
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch(type) {
      case 'alert': return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'info': return <Inbox className="h-5 w-5 text-blue-500" />;
      case 'success': return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'warning': return <AlertCircle className="h-5 w-5 text-amber-500" />;
      default: return <Bell className="h-5 w-5" />;
    }
  };

  const getCategoryIcon = (category: Notification['category']) => {
    switch(category) {
      case 'payroll': return <FileText className="h-4 w-4" />;
      case 'leave': return <CalendarIcon className="h-4 w-4" />;
      case 'task': return <Clock className="h-4 w-4" />;
      case 'system': return <Bell className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Today ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return 'Yesterday ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays < 7) {
      return diffDays + ' days ago';
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' }) + 
        ', ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  };

  return (
    <AppLayout allowedRoles={['admin', 'hr', 'employee']}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
            <p className="text-muted-foreground">
              Manage your notifications and alerts
            </p>
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button variant="outline" size="sm" onClick={markAllAsRead}>
                Mark all as read
              </Button>
            )}
          </div>
        </div>
        
        <Tabs defaultValue="all" className="space-y-6">
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="all">
                All
                {unreadCount > 0 && (
                  <Badge variant="secondary" className="ml-2">{unreadCount}</Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="unread">Unread</TabsTrigger>
              <TabsTrigger value="payroll">Payroll</TabsTrigger>
              <TabsTrigger value="leave">Leave</TabsTrigger>
              <TabsTrigger value="system">System</TabsTrigger>
            </TabsList>
          </div>
          
          {['all', 'unread', 'payroll', 'leave', 'system'].map((tab) => (
            <TabsContent key={tab} value={tab} className="space-y-4">
              {notifications
                .filter(notification => {
                  if (tab === 'all') return true;
                  if (tab === 'unread') return !notification.read;
                  return notification.category === tab;
                })
                .map(notification => (
                  <Card 
                    key={notification.id} 
                    className={`transition-all ${!notification.read ? 'border-l-4 border-l-primary' : ''}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex gap-4">
                          <div className="mt-0.5">
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className={`font-medium ${!notification.read ? 'font-semibold' : ''}`}>
                                {notification.title}
                              </h3>
                              <Badge variant="outline" className="text-xs">
                                <span className="mr-1">{getCategoryIcon(notification.category)}</span>
                                {notification.category.charAt(0).toUpperCase() + notification.category.slice(1)}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {notification.description}
                            </p>
                            <p className="text-xs text-muted-foreground mt-2">
                              {formatDate(notification.date)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {!notification.read && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => markAsRead(notification.id)}
                            >
                              Mark as read
                            </Button>
                          )}
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => deleteNotification(notification.id)}
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {notifications.filter(notification => {
                  if (tab === 'all') return true;
                  if (tab === 'unread') return !notification.read;
                  return notification.category === tab;
                }).length === 0 && (
                  <div className="text-center p-8">
                    <Inbox className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-1">No notifications</h3>
                    <p className="text-sm text-muted-foreground">
                      {tab === 'unread' 
                        ? "You're all caught up! No unread notifications." 
                        : `You don't have any ${tab === 'all' ? '' : tab + ' '}notifications.`}
                    </p>
                  </div>
                )}
            </TabsContent>
          ))}
        </Tabs>

        <Card>
          <CardHeader>
            <CardTitle>Notification Settings</CardTitle>
            <CardDescription>Customize how you receive notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h4 className="font-medium">Delivery methods</h4>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Label htmlFor="email-notifications">Email notifications</Label>
                </div>
                <Switch
                  id="email-notifications"
                  checked={notificationSettings.email}
                  onCheckedChange={(checked) => 
                    setNotificationSettings(prev => ({ ...prev, email: checked }))
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Label htmlFor="app-notifications">In-app notifications</Label>
                </div>
                <Switch
                  id="app-notifications"
                  checked={notificationSettings.app}
                  onCheckedChange={(checked) => 
                    setNotificationSettings(prev => ({ ...prev, app: checked }))
                  }
                />
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Notification types</h4>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Label htmlFor="payroll-notifications">Payroll notifications</Label>
                </div>
                <Switch
                  id="payroll-notifications"
                  checked={notificationSettings.payroll}
                  onCheckedChange={(checked) => 
                    setNotificationSettings(prev => ({ ...prev, payroll: checked }))
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Label htmlFor="leave-notifications">Leave & time off notifications</Label>
                </div>
                <Switch
                  id="leave-notifications"
                  checked={notificationSettings.leave}
                  onCheckedChange={(checked) => 
                    setNotificationSettings(prev => ({ ...prev, leave: checked }))
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Label htmlFor="system-notifications">System notifications</Label>
                </div>
                <Switch
                  id="system-notifications"
                  checked={notificationSettings.system}
                  onCheckedChange={(checked) => 
                    setNotificationSettings(prev => ({ ...prev, system: checked }))
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Label htmlFor="task-notifications">Task notifications</Label>
                </div>
                <Switch
                  id="task-notifications"
                  checked={notificationSettings.task}
                  onCheckedChange={(checked) => 
                    setNotificationSettings(prev => ({ ...prev, task: checked }))
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Notifications;
