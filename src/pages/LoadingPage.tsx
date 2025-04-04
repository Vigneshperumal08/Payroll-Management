
import React, { useEffect, useState } from 'react';
import { Loader, CheckCircle2, Server, Database, CloudCog } from 'lucide-react';

export default function LoadingPage() {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('Initializing...');
  const [completed, setCompleted] = useState<string[]>([]);

  useEffect(() => {
    const steps = [
      'Connecting to database...',
      'Loading resources...',
      'Preparing workspace...',
      'Finalizing setup...'
    ];
    
    let currentStep = 0;
    
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        setStatus(steps[currentStep]);
        setProgress(Math.min(100, (currentStep + 1) * 25));
        setCompleted(prev => [...prev, steps[currentStep]]);
        currentStep++;
      } else {
        clearInterval(interval);
      }
    }, 800);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-background to-secondary/20">
      <div className="w-full max-w-md px-8 py-12 flex flex-col items-center gap-6 animate-fade-in">
        <div className="flex flex-col items-center gap-2">
          <div className="relative">
            <Database className="h-10 w-10 text-primary/30 absolute" />
            <CloudCog className="h-12 w-12 text-primary animate-pulse" />
          </div>
          
          <h1 className="text-2xl font-bold tracking-tight mt-6">Loading your workspace</h1>
          <p className="text-muted-foreground text-center">
            {status}
          </p>
        </div>
        
        <div className="w-full bg-secondary/50 h-2 rounded-full overflow-hidden mt-4">
          <div 
            className="bg-primary h-full rounded-full transition-all duration-500 ease-in-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        
        <div className="w-full space-y-2 mt-2">
          {completed.map((step, index) => (
            <div key={index} className="flex items-center text-sm gap-2 text-muted-foreground animate-fade-in">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span>{step}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
