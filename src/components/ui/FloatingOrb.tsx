
import React from 'react';

interface FloatingOrbProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  className?: string;
}

const FloatingOrb = ({ 
  size = 'md', 
  color = 'from-novana-blue to-novana-purple', 
  className = '' 
}: FloatingOrbProps) => {
  const sizeClasses = {
    sm: 'w-24 h-24',
    md: 'w-40 h-40',
    lg: 'w-64 h-64'
  };

  return (
    <div className={`rounded-full bg-gradient-to-br ${color} animate-float ${sizeClasses[size]} opacity-80 blur-sm ${className}`}>
      <div className="w-full h-full rounded-full bg-black/10 backdrop-blur-md"></div>
    </div>
  );
};

export default FloatingOrb;
