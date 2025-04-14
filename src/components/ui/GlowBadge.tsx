
import React from 'react';
import { cn } from '@/lib/utils';

interface GlowBadgeProps {
  children: React.ReactNode;
  className?: string;
  color?: 'blue' | 'purple' | 'pink';
}

const GlowBadge = ({ children, className, color = 'blue' }: GlowBadgeProps) => {
  const colorMap = {
    blue: 'bg-novana-blue/20 border-novana-blue/50 text-novana-light-blue',
    purple: 'bg-novana-purple/20 border-novana-purple/50 text-purple-300',
    pink: 'bg-novana-pink/20 border-novana-pink/50 text-pink-300',
  };

  return (
    <span className={cn(
      'px-3 py-1 text-xs font-medium rounded-full border animate-pulse-glow',
      colorMap[color],
      className
    )}>
      {children}
    </span>
  );
};

export default GlowBadge;
