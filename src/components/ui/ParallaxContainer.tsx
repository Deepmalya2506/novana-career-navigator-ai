
import React, { ReactNode, useRef, useEffect } from 'react';

interface ParallaxContainerProps {
  children: ReactNode;
  className?: string;
  speed?: number; // -1 to 1, negative values move opposite to scroll
  horizontalOnly?: boolean;
}

const ParallaxContainer: React.FC<ParallaxContainerProps> = ({
  children,
  className = '',
  speed = 0.5,
  horizontalOnly = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const childRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current || !childRef.current) return;
      
      const containerRect = containerRef.current.getBoundingClientRect();
      const centerX = containerRect.width / 2;
      const centerY = containerRect.height / 2;
      
      // Calculate mouse position relative to center of container
      const mouseX = e.clientX - containerRect.left - centerX;
      const mouseY = e.clientY - containerRect.top - centerY;
      
      // Apply parallax effect based on mouse position
      const translateX = -mouseX * speed * 0.05;
      const translateY = horizontalOnly ? 0 : -mouseY * speed * 0.05;
      
      childRef.current.style.transform = `translate3d(${translateX}px, ${translateY}px, 0)`;
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [speed, horizontalOnly]);
  
  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      <div ref={childRef} className="transition-transform duration-300 ease-out">
        {children}
      </div>
    </div>
  );
};

export default ParallaxContainer;
