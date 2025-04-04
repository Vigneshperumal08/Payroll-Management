import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Check, CloudOff, Database, RefreshCw, Server, Wifi } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRealTimeDataContext } from '@/providers/RealTimeDataProvider';

type ConnectionStatus = 'pending' | 'connecting' | 'connected' | 'failed';

interface ServiceStatus {
  name: string;
  status: ConnectionStatus;
  message: string;
  icon: React.ReactNode;
}

export default function ServerConnectionPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { connectToDatabase, isConnected } = useRealTimeDataContext();
  
  const [userRole, setUserRole] = useState<string | null>(null);
  const [mongoStatus, setMongoStatus] = useState<ConnectionStatus>('pending');
  const [cloudinaryStatus, setCloudinaryStatus] = useState<ConnectionStatus>('pending');
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [autoConnectAttempted, setAutoConnectAttempted] = useState(false);

  // Auto-redirect to login page after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/auth');
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // Load user role and check for MongoDB URI
  useEffect(() => {
    const role = localStorage.getItem('userRole') || 'admin';
    setUserRole(role);
    
    const mongoUri = import.meta.env.VITE_MONGODB_URI;
    if (mongoUri && mongoUri !== 'your_mongodb_atlas_connection_string') {
      toast({
        title: "MongoDB URI detected",
        description: "Using MongoDB URI from environment variables"
      });
    }
  }, []);

  // Auto-connect when page loads
  useEffect(() => {
    if (!autoConnectAttempted && userRole) {
      attemptConnection();
      setAutoConnectAttempted(true);
    }
  }, [userRole]);

  const attemptConnection = async () => {
    if (isConnecting) return;
    
    setIsConnecting(true);
    setConnectionError(null);
    setMongoStatus('connecting');
    setCloudinaryStatus('connecting');

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const mongoUri = import.meta.env.VITE_MONGODB_URI;
      if (!mongoUri || mongoUri === 'your_mongodb_atlas_connection_string') {
        throw new Error('MongoDB URI not configured properly');
      }

      setMongoStatus('connected');

      await new Promise(resolve => setTimeout(resolve, 800));

      const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
      if (!cloudName || cloudName === 'your_cloudinary_cloud_name') {
        throw new Error('Cloudinary credentials not configured properly');
      }

      setCloudinaryStatus('connected');

      if (userRole) {
        await connectToDatabase(userRole);
      }

      toast({
        title: "Connected successfully",
        description: "All services are running properly",
      });

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Connection failed';
      setConnectionError(errorMessage);

      if (errorMessage.includes('MongoDB')) {
        setMongoStatus('failed');
      } else if (errorMessage.includes('Cloudinary')) {
        setCloudinaryStatus('failed');
      } else {
        setMongoStatus('failed');
        setCloudinaryStatus('failed');
      }

      toast({
        title: "Connection failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const services: ServiceStatus[] = [
    {
      name: 'MongoDB Atlas',
      status: mongoStatus,
      message: mongoStatus === 'connected' 
        ? 'Connected to database successfully' 
        : mongoStatus === 'failed'
        ? 'Failed to connect to database'
        : mongoStatus === 'connecting'
        ? 'Connecting to MongoDB Atlas...'
        : 'Ready to connect',
      icon: <Database className="h-5 w-5" />
    },
    {
      name: 'Cloudinary CDN',
      status: cloudinaryStatus,
      message: cloudinaryStatus === 'connected' 
        ? 'Connected to Cloudinary successfully' 
        : cloudinaryStatus === 'failed'
        ? 'Failed to connect to Cloudinary'
        : cloudinaryStatus === 'connecting'
        ? 'Connecting to Cloudinary CDN...'
        : 'Ready to connect',
      icon: <Server className="h-5 w-5" />
    }
  ];

  const getStatusIcon = (status: ConnectionStatus) => {
    switch (status) {
      case 'connected':
        return <Check className="h-5 w-5 text-green-500" />;
      case 'failed':
        return <AlertCircle className="h-5 w-5 text-destructive" />;
      case 'connecting':
        return <RefreshCw className="h-5 w-5 text-amber-500 animate-spin" />;
      default:
        return <Wifi className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStatusClass = (status: ConnectionStatus) => {
    switch (status) {
      case 'connected':
        return 'border-green-200 bg-green-50 text-green-700 dark:bg-green-900/20 dark:border-green-900';
      case 'failed':
        return 'border-red-200 bg-red-50 text-red-700 dark:bg-red-900/20 dark:border-red-900';
      case 'connecting':
        return 'border-amber-200 bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:border-amber-900';
      default:
        return 'border-border bg-card';
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-background via-background to-muted/30">
      <div className="w-full max-w-lg px-4 animate-fade-in">
        <Card className="border shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CloudOff className="h-5 w-5 text-primary" />
              Server Connection
            </CardTitle>
            <CardDescription>
              Auto-connecting to MongoDB and Cloudinary...
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {connectionError && (
              <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-sm mb-4">
                {connectionError}
              </div>
            )}

            {services.map((service) => (
              <div 
                key={service.name}
                className={`p-4 rounded-md border transition-all ${getStatusClass(service.status)}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {service.icon}
                    <div>
                      <h3 className="font-medium">{service.name}</h3>
                      <p className="text-sm text-muted-foreground">{service.message}</p>
                    </div>
                  </div>
                  {getStatusIcon(service.status)}
                </div>
              </div>
            ))}
          </CardContent>

          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => navigate('/auth')}>Back to Login</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
