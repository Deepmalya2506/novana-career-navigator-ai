
import React, { useState } from 'react';
import { VolumeX, Volume2, ArrowRight } from 'lucide-react';
import StarField from '@/components/ui/StarField';
import RotatingOrb from '@/components/ui/RotatingOrb';
import GlassButton from '@/components/ui/GlassButton';
import ParallaxContainer from '@/components/ui/ParallaxContainer';
import BubbleBackground from '@/components/ui/BubbleBackground';
import GlowBadge from '@/components/ui/GlowBadge';
import { Button } from '@/components/ui/button';

const HeroSection: React.FC = () => {
  const [audioPlaying, setAudioPlaying] = useState(false);

  // Toggle ambient sound
  const toggleSound = () => {
    setAudioPlaying(!audioPlaying);
    // Audio implementation would go here
  };

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden px-4 pt-20 pb-16">
      {/* Background Effects */}
      <StarField count={300} speed={0.3} />
      <BubbleBackground count={18} maxSize={150} minSize={20} />

      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30 z-0" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-novana-purple/20 blur-[100px] z-0" />
      
      <div className="container mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
          {/* Left side content */}
          <div className="lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left">
            <div className="mb-6 flex flex-wrap justify-center lg:justify-start gap-3">
              <GlowBadge color="blue">AI-Powered</GlowBadge>
              <GlowBadge color="purple">Career Development</GlowBadge>
              <GlowBadge color="pink">Personalized</GlowBadge>
            </div>
            
            <ParallaxContainer speed={0.2} className="mb-4">
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-3 animated-gradient-text leading-tight">
                NOVANA
              </h1>
            </ParallaxContainer>
            
            <ParallaxContainer speed={0.3} className="mb-6">
              <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                Your AI-Powered <span className="cosmic-text">Career Pilot</span>
              </h2>
            </ParallaxContainer>
            
            <p className="text-xl text-white/80 mb-10 max-w-lg">
              <span className="cosmic-text font-semibold">Disappear from Crowd</span> | 
              Evolve in silence | 
              <span className="cosmic-text font-semibold"> Rise with Radiance</span>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <GlassButton 
                variant="solid"
                className="py-6 px-8 rounded-full text-lg font-medium"
                glowColor="rgba(107, 208, 255, 0.5)"
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </GlassButton>
              
              <GlassButton 
                variant="outline"
                className="py-6 px-8 rounded-full text-lg"
              >
                Learn More
              </GlassButton>
            </div>
          </div>
          
          {/* Right side - Floating orb */}
          <div className="lg:w-1/2 flex justify-center items-center">
            <ParallaxContainer speed={0.4} className="relative">
              <RotatingOrb 
                size={300} 
                speed={0.8}
                color="from-novana-purple via-novana-light-blue to-novana-pink"
              />
            </ParallaxContainer>
          </div>
        </div>
      </div>
      
      {/* Sound toggle */}
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleSound}
        className="absolute top-24 right-6 z-50 text-white/70 hover:text-white hover:bg-white/10 transition-colors"
      >
        {audioPlaying ? (
          <Volume2 className="h-5 w-5" />
        ) : (
          <VolumeX className="h-5 w-5" />
        )}
      </Button>
    </section>
  );
};

export default HeroSection;
