
import React, { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
  color: string;
}

interface Nebula {
  x: number;
  y: number;
  radius: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
}

interface StarfieldBackgroundProps {
  starCount?: number;
  nebulaCount?: number;
  className?: string;
}

const StarfieldBackground: React.FC<StarfieldBackgroundProps> = ({
  starCount = 200,
  nebulaCount = 3,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stars = useRef<Star[]>([]);
  const nebulae = useRef<Nebula[]>([]);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initStars();
        initNebulae();
      }
    };

    const starColors = [
      '#ffffff', // White
      '#ffffdd', // Warm white
      '#ddddff', // Cool blue
      '#ffdddd', // Warm red
      '#ddffff', // Cyan tint
    ];

    const nebulaColors = [
      'rgba(76, 0, 153, 0.15)', // Purple
      'rgba(0, 76, 153, 0.15)', // Blue
      'rgba(153, 0, 76, 0.15)', // Pink
      'rgba(153, 76, 0, 0.15)', // Orange
    ];

    const initStars = () => {
      stars.current = [];
      for (let i = 0; i < starCount; i++) {
        const size = Math.random() * 2 + 0.5;
        stars.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size,
          opacity: Math.random() * 0.8 + 0.2,
          speed: Math.random() * 0.05 + 0.01,
          color: starColors[Math.floor(Math.random() * starColors.length)],
        });
      }
    };

    const initNebulae = () => {
      nebulae.current = [];
      for (let i = 0; i < nebulaCount; i++) {
        const radius = Math.random() * 300 + 150;
        nebulae.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius,
          color: nebulaColors[Math.floor(Math.random() * nebulaColors.length)],
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() * 0.0002 + 0.0001) * (Math.random() > 0.5 ? 1 : -1),
        });
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const animate = () => {
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw nebulae
      nebulae.current.forEach(nebula => {
        ctx.save();
        ctx.translate(nebula.x, nebula.y);
        ctx.rotate(nebula.rotation);
        
        // Create gradient for nebula
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, nebula.radius);
        gradient.addColorStop(0, nebula.color.replace('0.15', '0.25'));
        gradient.addColorStop(0.5, nebula.color);
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        // Draw the nebula
        ctx.fillStyle = gradient;
        ctx.beginPath();
        
        // Create a cloud-like shape
        for (let angle = 0; angle < Math.PI * 2; angle += 0.1) {
          const radiusVariation = 0.8 + Math.sin(angle * 3) * 0.2;
          const x = Math.cos(angle) * nebula.radius * radiusVariation;
          const y = Math.sin(angle) * nebula.radius * radiusVariation;
          
          if (angle === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        
        ctx.closePath();
        ctx.fill();
        
        // Update rotation
        nebula.rotation += nebula.rotationSpeed;
        
        ctx.restore();
      });

      // Draw stars
      stars.current.forEach(star => {
        // Twinkle effect
        const twinkle = 0.7 + Math.sin(Date.now() * 0.003 + star.x + star.y) * 0.3;
        
        // Draw star
        ctx.fillStyle = star.color;
        ctx.globalAlpha = star.opacity * twinkle;
        
        // Glow effect
        ctx.shadowBlur = star.size * 2;
        ctx.shadowColor = star.color;
        
        // Draw star as a small circle
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Reset shadow
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
        
        // Move star
        star.y += star.speed;
        
        // Wrap around if off screen
        if (star.y > canvas.height) {
          star.y = 0;
          star.x = Math.random() * canvas.width;
        }
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationRef.current);
    };
  }, [starCount, nebulaCount]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 z-0 ${className}`}
      style={{ pointerEvents: 'none' }}
    />
  );
};

export default StarfieldBackground;
