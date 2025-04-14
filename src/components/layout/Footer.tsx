
import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Linkedin, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="glass-card mt-20 border-t border-white/10 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-novana-blue to-novana-purple flex items-center justify-center">
                <div className="h-4 w-4 rounded-full bg-white/20"></div>
              </div>
              <span className="text-xl font-bold cosmic-text">NOVANA</span>
            </Link>
            <p className="text-white/70 text-sm">
              Your AI powered Career Pilot. Disappear from Crowd | Evolve in silence | Rise with Radiance
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-white/70 hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-white/70 hover:text-white transition-colors">
                <Linkedin size={20} />
              </a>
              <a href="#" className="text-white/70 hover:text-white transition-colors">
                <Github size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-white font-medium mb-4">Features</h3>
            <ul className="space-y-2">
              <li><Link to="/career" className="text-white/70 hover:text-white text-sm transition-colors">Career Roadmap</Link></li>
              <li><Link to="/exam" className="text-white/70 hover:text-white text-sm transition-colors">Exam Preparation</Link></li>
              <li><Link to="/events" className="text-white/70 hover:text-white text-sm transition-colors">Event Aggregator</Link></li>
              <li><Link to="/linkedin" className="text-white/70 hover:text-white text-sm transition-colors">LinkedIn Generator</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-medium mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><Link to="/community" className="text-white/70 hover:text-white text-sm transition-colors">Community</Link></li>
              <li><Link to="/night-owl" className="text-white/70 hover:text-white text-sm transition-colors">Night Owl Mode</Link></li>
              <li><Link to="/proctored" className="text-white/70 hover:text-white text-sm transition-colors">Proctored Mode</Link></li>
              <li><a href="#" className="text-white/70 hover:text-white text-sm transition-colors">Documentation</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-medium mb-4">Company</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-white/70 hover:text-white text-sm transition-colors">About Us</a></li>
              <li><a href="#" className="text-white/70 hover:text-white text-sm transition-colors">Contact</a></li>
              <li><a href="#" className="text-white/70 hover:text-white text-sm transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-white/70 hover:text-white text-sm transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-white/10 text-center">
          <p className="text-white/50 text-sm">
            &copy; {new Date().getFullYear()} NOVANA. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
