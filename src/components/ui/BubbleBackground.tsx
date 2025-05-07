
import React, { useEffect, useRef } from 'react';

interface Bubble {
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  color: string;
  glowIntensity: number;
}

interface BubbleBackgroundProps {
  count?: number;
  maxSize?: number;
  minSize?: number;
  className?: string;
}

const BubbleBackground: React.FC<BubbleBackgroundProps> = ({
  count = 15,
  maxSize = 120,
  minSize = 10,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bubbles = useRef<Bubble[]>([]);
  const animationRef = useRef<number>(0);
  
  // Initialize bubbles on component mount
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const resizeCanvas = () => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight * 1.5; // Make canvas taller than viewport
        initBubbles();
      }
    };
    
    // Create bubble colors
    const colors = [
      'rgba(156, 39, 176, 0.4)', // Purple
      'rgba(229, 63, 113, 0.4)', // Pink
      'rgba(29, 25, 168, 0.4)', // Blue
      'rgba(107, 208, 255, 0.4)', // Cyan
    ];
    
    // Initialize bubbles with random properties
    const initBubbles = () => {
      bubbles.current = [];
      for (let i = 0; i < count; i++) {
        const size = minSize + Math.random() * (maxSize - minSize);
        bubbles.current.push({
          x: Math.random() * (canvas.width - size),
          y: Math.random() * (canvas.height - size),
          size,
          speed: 0.2 + Math.random() * 0.5,
          opacity: 0.1 + Math.random() * 0.6,
          color: colors[Math.floor(Math.random() * colors.length)],
          glowIntensity: Math.random() > 0.7 ? 0.5 + Math.random() * 0.5 : 0,
        });
      }
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Animation loop
    const animate = () => {
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      bubbles.current.forEach((bubble) => {
        // Update bubble position
        bubble.y -= bubble.speed;
        
        // Reset bubble when it goes off-screen
        if (bubble.y + bubble.size < 0) {
          bubble.y = canvas.height + bubble.size;
          bubble.x = Math.random() * (canvas.width - bubble.size);
          bubble.opacity = 0.1 + Math.random() * 0.6;
        }
        
        // Slight horizontal movement
        bubble.x += Math.sin(bubble.y * 0.01) * 0.5;
        
        // Draw bubble
        ctx.beginPath();
        
        // Create radial gradient
        const gradient = ctx.createRadialGradient(
          bubble.x + bubble.size / 2,
          bubble.y + bubble.size / 2,
          0,
          bubble.x + bubble.size / 2,
          bubble.y + bubble.size / 2,
          bubble.size / 2
        );
        
        // Get base color without opacity for the glow
        const baseColor = bubble.color.replace(/[\d.]+\)$/g, '1)');
        
        gradient.addColorStop(0, baseColor.replace('1)', `${bubble.opacity + 0.1})`));
        gradient.addColorStop(0.8, bubble.color);
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        ctx.fillStyle = gradient;
        
        // Add glow effect
        if (bubble.glowIntensity > 0) {
          ctx.shadowBlur = 15 * bubble.glowIntensity;
          ctx.shadowColor = baseColor;
        } else {
          ctx.shadowBlur = 0;
        }
        
        // Draw circle
        ctx.arc(
          bubble.x + bubble.size / 2,
          bubble.y + bubble.size / 2,
          bubble.size / 2,
          0,
          Math.PI * 2
        );
        ctx.fill();
        
        // Pulse animation for some bubbles
        if (bubble.glowIntensity > 0) {
          bubble.glowIntensity = 0.5 + 0.4 * Math.sin(Date.now() * 0.001 + bubble.x);
        }
      });
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    // Start animation
    animate();
    
    // Clean up
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationRef.current);
    };
  }, [count, maxSize, minSize]);
  
  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 z-0 ${className}`}
      style={{ pointerEvents: 'none' }}
    />
  );
};

export default BubbleBackground;
