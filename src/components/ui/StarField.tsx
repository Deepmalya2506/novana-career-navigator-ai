
import React, { useEffect, useRef } from 'react';

interface StarFieldProps {
  count?: number;
  speed?: number;
  className?: string;
}

const StarField: React.FC<StarFieldProps> = ({
  count = 200,
  speed = 0.5,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Array<{
    x: number;
    y: number;
    z: number;
    radius: number;
    color: string;
  }>>([]);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let animationFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;
    
    const resizeCanvas = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      initStars();
    };
    
    const initStars = () => {
      starsRef.current = [];
      
      // Star colors with cosmic theme
      const colors = [
        'rgba(255, 255, 255, 0.8)',  // White
        'rgba(107, 208, 255, 0.7)',  // Cyan
        'rgba(156, 39, 176, 0.7)',   // Purple
        'rgba(229, 63, 113, 0.7)',   // Pink
      ];
      
      for (let i = 0; i < count; i++) {
        starsRef.current.push({
          x: Math.random() * width,
          y: Math.random() * height,
          z: Math.random() * 1000,
          radius: 0.5 + Math.random() * 1.5,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
    };
    
    const drawStars = () => {
      ctx.clearRect(0, 0, width, height);
      
      starsRef.current.forEach(star => {
        // Update z position (moving towards viewer)
        star.z -= speed;
        
        // Reset star if it moves too close
        if (star.z <= 0) {
          star.z = 1000;
          star.x = Math.random() * width;
          star.y = Math.random() * height;
        }
        
        // Calculate position based on perspective
        const k = 100 / star.z;
        const x = star.x * k + width / 2;
        const y = star.y * k + height / 2;
        
        // Only draw if in canvas boundaries
        if (x >= 0 && x <= width && y >= 0 && y <= height) {
          // Scale radius based on distance
          const radius = star.radius * k;
          
          // Draw star with glow effect
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fillStyle = star.color;
          ctx.fill();
          
          // Add glow effect to some stars
          if (Math.random() > 0.97) {
            ctx.beginPath();
            ctx.arc(x, y, radius * 2, 0, Math.PI * 2);
            ctx.fillStyle = star.color.replace(')', ', 0.3)');
            ctx.fill();
          }
        }
      });
      
      animationFrameId = requestAnimationFrame(drawStars);
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    drawStars();
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [count, speed]);
  
  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 z-0 pointer-events-none ${className}`}
    />
  );
};

export default StarField;
