import React, { useRef, useEffect } from 'react';
interface RotatingOrbProps {
  className?: string;
  size?: number;
  speed?: number;
  color?: string;
}
const RotatingOrb: React.FC<RotatingOrbProps> = ({
  className = '',
  size = 300,
  speed = 0.5,
  color = 'from-novana-purple via-novana-light-blue to-novana-pink'
}) => {
  const orbRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>(0);
  const rotation = useRef({
    x: 0,
    y: 0,
    z: 0
  });
  const mousePosition = useRef({
    x: 0,
    y: 0
  });
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePosition.current = {
        x: (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2),
        y: (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2)
      };
    };
    const animate = () => {
      if (orbRef.current) {
        // Auto rotation
        rotation.current.x += 0.001 * speed;
        rotation.current.y += 0.002 * speed;

        // Mouse influence (subtle)
        rotation.current.x += mousePosition.current.y * 0.002;
        rotation.current.y += mousePosition.current.x * 0.002;

        // Apply rotation
        orbRef.current.style.transform = `
          rotateX(${rotation.current.x * 180}deg) 
          rotateY(${rotation.current.y * 180}deg)
        `;
      }
      animationRef.current = requestAnimationFrame(animate);
    };
    window.addEventListener('mousemove', handleMouseMove);
    animate();
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationRef.current);
    };
  }, [speed]);
  return <div className="rounded-full">
      <div ref={orbRef} className={`
          w-${size} h-${size} rounded-full 
          bg-gradient-to-br ${color}
          relative transform-style-3d animate-float
        `} style={{
      width: size,
      height: size,
      transformStyle: 'preserve-3d',
      boxShadow: '0 0 60px rgba(156, 39, 176, 0.3)',
      backgroundImage: `radial-gradient(circle, rgba(107,208,255,0.8) 0%, rgba(156,39,176,0.6) 50%, rgba(229,63,113,0.4) 100%)`
    }}>
        {/* Inner glow */}
        <div className="absolute inset-5 rounded-full opacity-70 blur-md" style={{
        background: 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.2) 70%, transparent 100%)'
      }} />
        
        {/* Outer rings */}
        <div className="absolute inset-0 rounded-full animate-spin-slow" style={{
        border: '2px solid rgba(156, 39, 176, 0.3)',
        boxShadow: '0 0 20px rgba(107, 208, 255, 0.5)',
        animationDuration: '30s'
      }} />
        
        <div className="absolute inset-0 rounded-full animate-spin-slow" style={{
        border: '1px solid rgba(229, 63, 113, 0.3)',
        transform: 'rotate(60deg)',
        animationDuration: '20s',
        animationDirection: 'reverse'
      }} />
      </div>
    </div>;
};
export default RotatingOrb;