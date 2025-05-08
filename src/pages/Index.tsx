import React from 'react';
import { Link } from 'react-router-dom';
import { Award, BookOpen, Calendar, Laptop, MapPin, MoonStar, Users, Linkedin, ArrowRight, Rocket, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import FeatureCard from '@/components/ui/FeatureCard';
import FloatingOrb from '@/components/ui/FloatingOrb';
import GlowBadge from '@/components/ui/GlowBadge';
import BubbleBackground from '@/components/ui/BubbleBackground';
const Index = () => {
  return <div className="flex min-h-screen flex-col overflow-hidden">
      <Header />
      
      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-32 pb-16 relative">
        <BubbleBackground count={18} maxSize={150} minSize={20} />
        
        <FloatingOrb size="lg" className="absolute -top-20 -right-20 opacity-30 z-0" />
        
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <div className="flex justify-center mb-6 space-x-4">
            <GlowBadge color="blue">AI-Powered</GlowBadge>
            <GlowBadge color="purple">Career Development</GlowBadge>
            <GlowBadge color="pink">Personalized</GlowBadge>
          </div>
          
          <h1 className="text-5xl mb-6 animated-gradient-text font-bold md:text-8xl">novana</h1>
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white">
            Your AI-Powered Career Pilot
          </h2>
          <p className="text-xl text-white/80 mb-10 font-semibold"> As a Star die in Supernova | Let another Star evolve with novana</p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="cosmic-gradient text-white font-medium py-6 px-8 rounded-full hover:opacity-90 transition-opacity">
              Get Started
            </Button>
            <Button variant="outline" className="border-white/20 text-white hover:border-white/40 py-6 px-8 rounded-full">
              Learn More
            </Button>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 cosmic-text">Empowering Features</h2>
          <p className="text-white/70 max-w-2xl mx-auto">
            Everything you need to accelerate your career journey, achieve academic excellence, and connect with like-minded individuals.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard title="Career Roadmap" description="Personalized career planning for your dream company with key milestones tracking." icon={Rocket} to="/career" gradient="from-blue-500 to-indigo-600" />
          
          <FeatureCard title="Exam Preparation" description="AI-driven study plans based on your syllabus, strengths, and schedule." icon={BookOpen} to="/exam" gradient="from-purple-500 to-pink-500" />
          
          <FeatureCard title="Event Aggregator" description="Discover and register for relevant events based on your progress and location." icon={Calendar} to="/events" gradient="from-cyan-500 to-blue-600" />
          
          <FeatureCard title="LinkedIn Generator" description="Create compelling LinkedIn posts that showcase your achievements." icon={Linkedin} to="/linkedin" gradient="from-blue-600 to-blue-800" />
          
          <FeatureCard title="Night Owl Mode" description="Stay motivated during late-night study sessions with AI companionship." icon={MoonStar} to="/night-owl" gradient="from-indigo-600 to-violet-600" />
          
          <FeatureCard title="Community Platform" description="Connect with peers for resource sharing, team formation, and doubt solving." icon={Users} to="/community" gradient="from-amber-500 to-pink-500" />
        </div>
      </section>
      
      {/* How It Works */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 cosmic-text">How NOVANA Works</h2>
          <p className="text-white/70 max-w-2xl mx-auto">
            Our AI-powered platform adapts to your needs and helps you achieve your goals.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="glass-card p-6 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-novana-blue to-novana-purple flex items-center justify-center">
              <Target size={32} className="text-white" />
            </div>
            <h3 className="text-xl font-medium mb-2">Set Your Goals</h3>
            <p className="text-white/70">Define your career path, academic targets, or community involvement.</p>
          </div>
          
          <div className="glass-card p-6 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-novana-purple to-novana-pink flex items-center justify-center">
              <Laptop size={32} className="text-white" />
            </div>
            <h3 className="text-xl font-medium mb-2">Get AI Guidance</h3>
            <p className="text-white/70">Receive personalized recommendations, study plans, and career insights.</p>
          </div>
          
          <div className="glass-card p-6 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-novana-pink to-novana-light-blue flex items-center justify-center">
              <Award size={32} className="text-white" />
            </div>
            <h3 className="text-xl font-medium mb-2">Track Progress</h3>
            <p className="text-white/70">Monitor your achievements, adjust your path, and celebrate successes.</p>
          </div>
        </div>
        
        <div className="text-center mt-12">
          <Button className="cosmic-gradient text-white font-medium py-6 px-8 rounded-full hover:opacity-90 transition-opacity">
            Start Your Journey
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>
      
      {/* Proctored Mode */}
      <section className="container mx-auto px-4 py-16">
        <div className="glass-card p-8 md:p-12 relative overflow-hidden">
          <FloatingOrb size="md" className="absolute -top-24 -right-24 opacity-20" color="from-novana-purple to-novana-pink" />
          
          <div className="relative z-10 max-w-3xl">
            <h2 className="text-3xl font-bold mb-6 cosmic-text">Proctored Mode</h2>
            <p className="text-white/80 text-lg mb-6">
              Stay focused on your studies with our distraction detection feature. Earn ranks and badges as you improve your concentration.
            </p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start">
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-novana-blue to-novana-purple flex items-center justify-center mr-3 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-white/80">Distraction detection and focus monitoring</span>
              </li>
              <li className="flex items-start">
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-novana-blue to-novana-purple flex items-center justify-center mr-3 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-white/80">Earn ranks and badges for consistent focus</span>
              </li>
              <li className="flex items-start">
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-novana-blue to-novana-purple flex items-center justify-center mr-3 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-white/80">Compete with peers on the leaderboard</span>
              </li>
            </ul>
            <Button className="glass-button px-6 py-2">
              Try Proctored Mode
            </Button>
          </div>
        </div>
      </section>
      
      {/* Night Owl Mode */}
      <section className="container mx-auto px-4 py-16">
        <div className="glass-card p-8 md:p-12 relative overflow-hidden bg-gradient-to-br from-black/60 to-novana-dark-blue/40">
          <FloatingOrb size="md" className="absolute -top-20 -left-20 opacity-20" color="from-indigo-600 to-violet-800" />
          
          <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
            <div className="md:w-1/2 space-y-6">
              <h2 className="text-3xl font-bold cosmic-text">Night Owl Mode</h2>
              <p className="text-white/80">
                A special companion mode designed to keep you motivated during late-night study sessions. Talk with our AI agent and enjoy ambient music.
              </p>
              <div className="flex items-center gap-4">
                <Button className="cosmic-gradient text-white">
                  Activate Night Owl
                </Button>
                <Button variant="outline" className="border-white/20 text-white hover:border-white/40">
                  Learn More
                </Button>
              </div>
            </div>
            
            <div className="md:w-1/2 flex justify-center">
              <div className="w-64 h-64 rounded-full bg-gradient-to-br from-indigo-600/30 to-violet-800/30 backdrop-blur-md flex items-center justify-center animate-pulse-glow">
                <MoonStar size={64} className="text-white/80" />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Event Map Preview */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 cosmic-text">Discover Relevant Events</h2>
          <p className="text-white/70 max-w-2xl mx-auto">
            Our event aggregator finds and recommends events based on your career goals and location.
          </p>
        </div>
        
        <div className="glass-card p-6 h-[400px] flex items-center justify-center relative">
          <div className="absolute inset-0 opacity-30 flex items-center justify-center">
            <MapPin size={120} className="text-white/50" />
          </div>
          <div className="z-10 text-center">
            <h3 className="text-2xl font-bold mb-4">Event Map Coming Soon</h3>
            <p className="text-white/70 mb-6">
              Navigate through career-boosting events in your area
            </p>
            <Button className="glass-button">
              Explore Events
            </Button>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="glass-card p-8 md:p-12 bg-gradient-to-r from-black/60 via-novana-purple/20 to-black/60 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 animated-gradient-text">
            Ready to Transform Your Career Journey?
          </h2>
          <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
            Join NOVANA today and unlock personalized AI-driven guidance for your career growth and academic success.
          </p>
          <Button className="cosmic-gradient text-white font-medium py-6 px-10 rounded-full hover:opacity-90 transition-opacity text-lg">
            Get Started Now
          </Button>
        </div>
      </section>
      
      <Footer />
    </div>;
};
export default Index;