
import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import FloatingOrb from '@/components/ui/FloatingOrb';

interface PageLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;  // Added description prop
  showFloatingOrbs?: boolean;
}

const PageLayout = ({ children, title, description, showFloatingOrbs = true }: PageLayoutProps) => {
  return (
    <div className="flex min-h-screen flex-col overflow-hidden">
      <Header />
      
      {(title || description) && (
        <section className="container mx-auto px-4 pt-32 pb-8 text-center">
          {title && <h1 className="text-4xl md:text-5xl font-bold mb-4 cosmic-text">{title}</h1>}
          {description && <p className="text-white/70 max-w-2xl mx-auto">{description}</p>}
        </section>
      )}
      
      {showFloatingOrbs && (
        <>
          <FloatingOrb size="lg" className="fixed -top-20 -right-20 opacity-30 z-0" />
          <FloatingOrb size="md" className="fixed bottom-20 -left-20 opacity-20 z-0" color="from-novana-purple to-novana-pink" />
        </>
      )}
      
      <div className="flex-grow relative z-10">
        {children}
      </div>
      
      <Footer />
    </div>
  );
};

export default PageLayout;
