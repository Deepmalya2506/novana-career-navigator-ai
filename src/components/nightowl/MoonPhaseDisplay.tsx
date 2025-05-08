
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { MoonStar } from 'lucide-react';

const MoonPhaseDisplay = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [moonPhase, setMoonPhase] = useState('');

  // Update the clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Calculate moon phase
    calculateMoonPhase();

    return () => {
      clearInterval(timer);
    };
  }, []);

  // Calculate the current moon phase
  const calculateMoonPhase = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    // Use simple algorithm to calculate moon phase
    const c = Math.floor(year / 100);
    const y = year - 100 * c;
    const j = (month - 1) * 30.6 + day - 694039.09 + 0.0053 * y - 0.0039 * c;
    const s = j / 29.53;
    const phase = s - Math.floor(s);
    
    // Assign moon phase names
    if (phase < 0.0625 || phase >= 0.9375) {
      setMoonPhase('New Moon');
    } else if (phase < 0.1875) {
      setMoonPhase('Waxing Crescent');
    } else if (phase < 0.3125) {
      setMoonPhase('First Quarter');
    } else if (phase < 0.4375) {
      setMoonPhase('Waxing Gibbous');
    } else if (phase < 0.5625) {
      setMoonPhase('Full Moon');
    } else if (phase < 0.6875) {
      setMoonPhase('Waning Gibbous');
    } else if (phase < 0.8125) {
      setMoonPhase('Last Quarter');
    } else {
      setMoonPhase('Waning Crescent');
    }
  };

  return (
    <Card className="glass-card overflow-hidden">
      <CardContent className="p-4 flex items-center space-x-3">
        <MoonStar className="h-6 w-6 text-novana-light-blue animate-pulse-glow" />
        <div>
          <p className="text-2xl font-bold">
            {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
          <p className="text-xs opacity-70">{moonPhase}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default MoonPhaseDisplay;
