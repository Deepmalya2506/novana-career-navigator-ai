
import React, { useEffect, useRef } from 'react';

interface Bubble {
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  color: string;
  glowIntensity: number;
  z: number; // Added z-coordinate for 3D effect
  rotationSpeed: number;
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
    
    // Create bubble colors with enhanced transparency for 3D look
    const colors = [
      'rgba(156, 39, 176, 0.3)', // Purple
      'rgba(229, 63, 113, 0.3)', // Pink
      'rgba(29, 25, 168, 0.3)', // Blue
      'rgba(107, 208, 255, 0.3)', // Cyan
    ];
    
    // Initialize bubbles with additional 3D properties
    const initBubbles = () => {
      bubbles.current = [];
      for (let i = 0; i < count; i++) {
        const size = minSize + Math.random() * (maxSize - minSize);
        bubbles.current.push({
          x: Math.random() * (canvas.width - size),
          y: Math.random() * (canvas.height - size),
          size,
          speed: 0.2 + Math.random() * 0.5,
          opacity: 0.1 + Math.random() * 0.4, // Reduced max opacity for more transparency
          color: colors[Math.floor(Math.random() * colors.length)],
          glowIntensity: Math.random() > 0.5 ? 0.3 + Math.random() * 0.4 : 0,
          z: Math.random() * 100, // Z-coordinate for depth
          rotationSpeed: (Math.random() - 0.5) * 0.02,
        });
      }
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Animation loop with enhanced 3D rendering
    const animate = () => {
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Sort bubbles by z-index to create proper depth perception
      const sortedBubbles = [...bubbles.current].sort((a, b) => a.z - b.z);
      
      sortedBubbles.forEach((bubble) => {
        // Update bubble position with slight wobble for realism
        bubble.y -= bubble.speed;
        bubble.x += Math.sin(bubble.y * 0.01 + Date.now() * 0.001) * 0.5;
        
        // Reset bubble when it goes off-screen
        if (bubble.y + bubble.size < 0) {
          bubble.y = canvas.height + bubble.size;
          bubble.x = Math.random() * (canvas.width - bubble.size);
          bubble.opacity = 0.1 + Math.random() * 0.4;
          bubble.z = Math.random() * 100;
        }
        
        // Calculate scale based on z-coordinate for 3D effect
        const scale = 0.7 + ((100 - bubble.z) / 100) * 0.6;
        const scaledSize = bubble.size * scale;
        
        // Draw the bubble with 3D effect
        ctx.save();
        ctx.translate(bubble.x + bubble.size / 2, bubble.y + bubble.size / 2);
        
        // Create a realistic bubble with highlights and soft edges
        const bubbleGradient = ctx.createRadialGradient(
          0, 0, 0,
          0, 0, scaledSize / 2
        );
        
        // Base color without opacity for the glow
        const baseColor = bubble.color.replace(/[\d.]+\)$/g, '1)');
        
        // Create a realistic bubble gradient
        bubbleGradient.addColorStop(0, `rgba(255, 255, 255, ${bubble.opacity * 0.6})`);
        bubbleGradient.addColorStop(0.4, baseColor.replace('1)', `${bubble.opacity * 0.8})`));
        bubbleGradient.addColorStop(0.8, baseColor.replace('1)', `${bubble.opacity * 0.5})`));
        bubbleGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        // Add glow effect
        if (bubble.glowIntensity > 0) {
          ctx.shadowBlur = 15 * bubble.glowIntensity;
          ctx.shadowColor = baseColor;
        } else {
          ctx.shadowBlur = 0;
        }
        
        // Draw circular bubble
        ctx.fillStyle = bubbleGradient;
        ctx.beginPath();
        ctx.arc(0, 0, scaledSize / 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Add highlight for 3D effect (small white circle offset from center)
        const highlightGradient = ctx.createRadialGradient(
          -scaledSize / 5, -scaledSize / 5, 0,
          -scaledSize / 5, -scaledSize / 5, scaledSize / 3
        );
        highlightGradient.addColorStop(0, `rgba(255, 255, 255, ${bubble.opacity * 0.9})`);
        highlightGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        ctx.fillStyle = highlightGradient;
        ctx.beginPath();
        ctx.arc(-scaledSize / 5, -scaledSize / 5, scaledSize / 4, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
        
        // Pulse animation for some bubbles
        if (bubble.glowIntensity > 0) {
          bubble.glowIntensity = 0.3 + 0.3 * Math.sin(Date.now() * 0.001 + bubble.x);
        }
        
        // Update z position with subtle movement
        bubble.z += Math.sin(Date.now() * 0.0005) * 0.2;
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
