
import React from 'react';
import ExploreBoard from './ExploreBoard';
import { Toaster } from './ui/toaster';

const StandaloneExploreApp = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b py-4">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold"></h1>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <h2 className="text-xl font-semibold mb-6">WanderBoard</h2>
        <ExploreBoard />
      </main>
      
      <Toaster />
    </div>
  );
};

export default StandaloneExploreApp;
