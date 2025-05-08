
import React from 'react';
import { Button as UIButton, ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface GlassButtonProps extends Omit<ButtonProps, 'variant'> {
  glowColor?: string;
  glassmorphism?: boolean;
  gradientText?: boolean;
  variant?: 'solid' | 'outline';
}

const GlassButton = React.forwardRef<HTMLButtonElement, GlassButtonProps>(
  ({ 
    className, 
    children, 
    glowColor = "rgba(156, 39, 176, 0.5)",
    glassmorphism = true,
    gradientText = false,
    variant = "solid",
    ...props 
  }, ref) => {
    // Map our custom variants to shadcn button variants
    const buttonVariant = variant === 'solid' ? 
      'default' : 
      'outline';
      
    return (
      <UIButton
        ref={ref}
        variant={buttonVariant}
        className={cn(
          "relative overflow-hidden transition-all duration-300",
          glassmorphism && "backdrop-blur-md bg-opacity-20",
          variant === "solid" ? 
            "cosmic-gradient text-white hover:scale-105 transform" : 
            "border border-white/20 text-white hover:border-white/40 hover:bg-white/10",
          gradientText && "cosmic-text font-medium",
          className
        )}
        style={{
          boxShadow: `0 0 15px ${glowColor}`,
        }}
        {...props}
      >
        {/* Glow effect on hover */}
        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full hover:animate-shine" />
        
        {children}
      </UIButton>
    );
  }
);

GlassButton.displayName = "GlassButton";

export default GlassButton;
