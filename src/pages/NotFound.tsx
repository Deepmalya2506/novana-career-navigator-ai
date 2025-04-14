
import React from 'react';
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import FloatingOrb from '@/components/ui/FloatingOrb';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-grow flex items-center justify-center py-20 px-4 relative">
        <FloatingOrb 
          size="lg" 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-10" 
        />
        
        <div className="glass-card p-8 md:p-12 text-center max-w-lg mx-auto z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 cosmic-text">404</h1>
          <p className="text-2xl text-white mb-8">Page Not Found</p>
          <p className="text-white/70 mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <Button className="cosmic-gradient flex items-center gap-2" asChild>
            <a href="/">
              <Home size={16} />
              Return Home
            </a>
          </Button>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default NotFound;
