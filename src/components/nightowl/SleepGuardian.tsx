
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { BedDouble, Droplet, HeartPulse } from 'lucide-react';

const stories = [
  {
    id: '1',
    title: 'The Quiet Forest',
    content: 'As you close your eyes, imagine yourself walking through a quiet forest. The soft moss beneath your feet cushions each step. Sunlight filters through the canopy above, creating dappled patterns on the ground. The air is cool and fresh, carrying the scent of pine and earth. You hear the gentle rustling of leaves and the distant sound of a stream...'
  },
  {
    id: '2',
    title: 'Ocean Waves',
    content: 'Picture yourself on a secluded beach at sunset. The warm sand holds the day\'s heat beneath your feet. Before you, gentle waves roll in and out with a soothing rhythm. The horizon glows with amber and pink as the sun begins its descent. Each wave brings a sense of calm as it reaches the shore and retreats back to the vast blue expanse...'
  },
  {
    id: '3',
    title: 'Mountain Sanctuary',
    content: 'You\'re sitting on a smooth stone at the peak of a mountain. The air is thin and cool, filling your lungs with clarity. Below you, valleys and forests stretch to the horizon. A gentle breeze carries the scent of wildflowers. The world below seems distant and peaceful from this height. Your thoughts grow quiet as you breathe in the serenity of this sanctuary...'
  }
];

const meditations = [
  {
    id: '1',
    title: 'Body Scan Relaxation',
    content: 'Starting at your toes, focus your attention slowly upward through your body. Notice each area without judgment, releasing tension as you go. Feel your toes, feet, ankles becoming heavy and relaxed. Continue through your calves, knees, thighs... all the way to the crown of your head, allowing each part to soften and let go.'
  },
  {
    id: '2',
    title: 'Breath Counting',
    content: 'Settle into a comfortable position and begin to focus on your breath. Inhale deeply through your nose for a count of four, feeling your chest and abdomen expand. Hold briefly, then exhale slowly through your mouth for a count of six, feeling all tension release. Count each complete breath cycle until you reach ten, then begin again.'
  }
];

const SleepGuardian = () => {
  const [selectedStory, setSelectedStory] = useState(stories[0]);
  const [selectedMeditation, setSelectedMeditation] = useState(meditations[0]);
  const [autoShutdown, setAutoShutdown] = useState(true);
  const [showStory, setShowStory] = useState(false);
  const [showMeditation, setShowMeditation] = useState(false);
  
  return (
    <Card className="glass-card overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <BedDouble className="h-5 w-5 text-novana-purple" />
          Sleep Guardian
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {!showStory && !showMeditation ? (
          <>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BedDouble className="h-4 w-4 text-novana-light-blue" />
                  <Label htmlFor="auto-shutdown">Auto-shutdown after 30 min</Label>
                </div>
                <Switch 
                  id="auto-shutdown"
                  checked={autoShutdown}
                  onCheckedChange={setAutoShutdown}
                />
              </div>
              
              <div className="flex flex-col gap-2">
                <Button
                  onClick={() => setShowStory(true)}
                  variant="outline"
                  className="w-full justify-start gap-2"
                >
                  <BedDouble className="h-4 w-4" /> Bedtime Story
                </Button>
                
                <Button
                  onClick={() => setShowMeditation(true)}
                  variant="outline"
                  className="w-full justify-start gap-2"
                >
                  <HeartPulse className="h-4 w-4" /> Meditation Script
                </Button>
                
                <div className="p-3 bg-white/5 rounded-md flex items-center gap-2 mt-2">
                  <Droplet className="h-4 w-4 text-novana-light-blue" />
                  <p className="text-sm text-white/80">Time for a glass of water before sleep</p>
                </div>
              </div>
            </div>
            
            <div className="text-xs text-white/50 text-center pt-2">
              Sleep is the best meditation — Dalai Lama
            </div>
          </>
        ) : showStory ? (
          <div className="space-y-4">
            <h3 className="font-medium">{selectedStory.title}</h3>
            
            <div className="text-sm text-white/80 leading-relaxed">
              {selectedStory.content}
            </div>
            
            <div className="flex gap-2">
              {stories.map((story) => (
                <Button
                  key={story.id}
                  variant={selectedStory.id === story.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedStory(story)}
                  className="flex-1 min-w-0"
                >
                  {story.id}
                </Button>
              ))}
            </div>
            
            <Button
              variant="ghost"
              onClick={() => setShowStory(false)}
              className="w-full"
            >
              Back
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <h3 className="font-medium">{selectedMeditation.title}</h3>
            
            <div className="text-sm text-white/80 leading-relaxed">
              {selectedMeditation.content}
            </div>
            
            <div className="flex gap-2">
              {meditations.map((meditation) => (
                <Button
                  key={meditation.id}
                  variant={selectedMeditation.id === meditation.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedMeditation(meditation)}
                  className="flex-1 min-w-0"
                >
                  {meditation.id}
                </Button>
              ))}
            </div>
            
            <Button
              variant="ghost"
              onClick={() => setShowMeditation(false)}
              className="w-full"
            >
              Back
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SleepGuardian;
