
import React from 'react';
import { Toaster } from '../ui/toaster';

interface AppLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
}

const AppLayout = ({ children, title, description }: AppLayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">{title}</h1>
          {description && <p className="text-muted-foreground">{description}</p>}
        </div>
        
        {children}
      </div>
      <Toaster />
    </div>
  );
};

export default AppLayout;
