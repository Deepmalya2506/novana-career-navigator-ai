
import React from 'react';

interface GlowBadgeProps {
  children: React.ReactNode;
  color?: 'blue' | 'purple' | 'pink' | 'green' | 'orange';
}

const GlowBadge = ({ children, color = 'blue' }: GlowBadgeProps) => {
  const colorClasses = {
    blue: 'from-novana-blue to-novana-light-blue',
    purple: 'from-novana-purple to-novana-blue',
    pink: 'from-novana-pink to-novana-purple',
    green: 'from-green-500 to-cyan-500',
    orange: 'from-orange-500 to-yellow-500'
  };

  return (
    <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r ${colorClasses[color]} shadow-md`}>
      {children}
    </div>
  );
};

export default GlowBadge;
