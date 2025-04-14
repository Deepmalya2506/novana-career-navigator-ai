
import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full z-50 glass-card bg-black/40 border-b border-white/10">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-novana-blue to-novana-purple flex items-center justify-center">
            <div className="h-6 w-6 rounded-full bg-white/20 animate-pulse-glow"></div>
          </div>
          <span className="text-2xl font-bold animated-gradient-text">NOVANA</span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/career" className="text-white/80 hover:text-white transition-colors">Career Pilot</Link>
          <Link to="/exam" className="text-white/80 hover:text-white transition-colors">Exam Prep</Link>
          <Link to="/events" className="text-white/80 hover:text-white transition-colors">Events</Link>
          <Link to="/community" className="text-white/80 hover:text-white transition-colors">Community</Link>
          <Button className="glass-button">
            Sign In
          </Button>
        </nav>
        
        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-white p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden glass-card border-t border-white/10 py-4">
          <nav className="flex flex-col items-center gap-4">
            <Link to="/career" className="text-white/80 hover:text-white transition-colors py-2" onClick={() => setIsMenuOpen(false)}>
              Career Pilot
            </Link>
            <Link to="/exam" className="text-white/80 hover:text-white transition-colors py-2" onClick={() => setIsMenuOpen(false)}>
              Exam Prep
            </Link>
            <Link to="/events" className="text-white/80 hover:text-white transition-colors py-2" onClick={() => setIsMenuOpen(false)}>
              Events
            </Link>
            <Link to="/community" className="text-white/80 hover:text-white transition-colors py-2" onClick={() => setIsMenuOpen(false)}>
              Community
            </Link>
            <Button className="glass-button w-3/4 mt-2" onClick={() => setIsMenuOpen(false)}>
              Sign In
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
