
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const quotes = [
  "The darkest hour has only sixty minutes.",
  "This moment is temporary, but your strength is permanent.",
  "Even the night must end and the sun will rise.",
  "You are not alone in this journey.",
  "One small positive thought can change your whole day.",
  "Rest if you must, but don't quit.",
  "Stars can't shine without darkness.",
  "Your story isn't over yet.",
  "Breathe. It's just a bad day, not a bad life.",
  "This too shall pass."
];

const EmergencySOS = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [quote, setQuote] = useState(quotes[0]);
  const { toast } = useToast();

  const getRandomQuote = () => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setQuote(quotes[randomIndex]);
    
    toast({
      title: "Encouragement",
      description: quotes[randomIndex],
      duration: 5000,
    });
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isExpanded ? (
        <Card className="glass-card w-64 shadow-lg animate-fade-in">
          <CardContent className="p-4 space-y-3">
            <p className="text-sm text-white/90 text-center italic">
              "{quote}"
            </p>
            
            <div className="grid grid-cols-2 gap-2">
              <Button
                size="sm"
                className="cosmic-gradient w-full text-xs"
                onClick={getRandomQuote}
              >
                New Quote
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-xs"
                onClick={() => setIsExpanded(false)}
              >
                Close
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Button
          className="cosmic-gradient rounded-full shadow-glow h-12 w-12 p-0 flex items-center justify-center"
          onClick={() => setIsExpanded(true)}
        >
          SOS
        </Button>
      )}
    </div>
  );
};

export default EmergencySOS;
