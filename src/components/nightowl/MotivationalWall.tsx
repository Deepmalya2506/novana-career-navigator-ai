
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Heart } from 'lucide-react';

interface Achievement {
  id: string;
  title: string;
  date: string;
  affirmation: string;
}

const MotivationalWall = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: '1',
      title: 'Completed React Course',
      date: 'May 5',
      affirmation: 'Your consistency in learning is building your future success.'
    },
    {
      id: '2',
      title: 'Submitted Portfolio Project',
      date: 'May 3',
      affirmation: 'Your creative work speaks volumes about your potential.'
    },
    {
      id: '3',
      title: 'Helped 3 classmates debug their code',
      date: 'May 1',
      affirmation: 'The knowledge you share multiplies your own understanding.'
    },
    {
      id: '4',
      title: '7-Day Meditation Streak',
      date: 'April 28',
      affirmation: 'Your commitment to mental clarity enhances all areas of your life.'
    },
  ]);

  const nextAchievement = () => {
    setCurrentIndex((prev) => (prev + 1) % achievements.length);
  };

  const prevAchievement = () => {
    setCurrentIndex((prev) => (prev - 1 + achievements.length) % achievements.length);
  };

  // Auto-rotate achievements every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      nextAchievement();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="glass-card overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-novana-pink" />
          Memory Wall
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="relative min-h-[150px] flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute left-0 z-10 h-8 w-8 rounded-full opacity-70 hover:opacity-100" 
              onClick={prevAchievement}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute right-0 z-10 h-8 w-8 rounded-full opacity-70 hover:opacity-100" 
              onClick={nextAchievement}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="text-center px-8 animate-fade-in">
            <h3 className="font-medium text-lg text-white mb-2">
              {achievements[currentIndex].title}
            </h3>
            <p className="text-sm text-white/60 mb-3">
              {achievements[currentIndex].date}
            </p>
            <p className="text-white/80 italic">
              "{achievements[currentIndex].affirmation}"
            </p>
            <div className="mt-4 flex justify-center gap-1">
              {achievements.map((_, i) => (
                <div 
                  key={i} 
                  className={`h-1.5 w-1.5 rounded-full ${i === currentIndex ? 'bg-novana-pink' : 'bg-white/30'}`} 
                />
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MotivationalWall;
