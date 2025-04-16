
import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  to: string;
  gradient?: string;
}

const FeatureCard = ({ title, description, icon: Icon, to, gradient = "from-novana-blue to-novana-purple" }: FeatureCardProps) => {
  return (
    <Link 
      to={to} 
      className="feature-card group block hover:opacity-100 transition-all relative rounded-xl overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-purple-600 opacity-0 group-hover:opacity-100 blur-[2px] scale-[1.01] transition-all duration-300"></div>
      <div className="bg-black/30 backdrop-blur-lg border border-white/10 rounded-lg shadow-lg p-6 relative z-10 group-hover:border-transparent group-hover:shadow-[0_0_15px_rgba(0,0,0,0.6)] transition-all duration-300">
        <div className={`w-12 h-12 rounded-full mb-4 flex items-center justify-center bg-gradient-to-br ${gradient}`}>
          <Icon size={24} className="text-white" />
        </div>
        <h3 className="text-xl font-semibold mb-2 group-hover:cosmic-text transition-all duration-300">{title}</h3>
        <p className="text-white/70 text-sm">{description}</p>
      </div>
    </Link>
  );
};

export default FeatureCard;
