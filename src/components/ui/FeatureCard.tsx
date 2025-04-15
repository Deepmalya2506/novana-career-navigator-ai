
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
      className="feature-card group block hover:opacity-90 transition-opacity"
    >
      <div className={`w-12 h-12 rounded-full mb-4 flex items-center justify-center bg-gradient-to-br ${gradient}`}>
        <Icon size={24} className="text-white" />
      </div>
      <h3 className="text-xl font-semibold mb-2 group-hover:cosmic-text transition-all duration-300">{title}</h3>
      <p className="text-white/70 text-sm">{description}</p>
    </Link>
  );
};

export default FeatureCard;
