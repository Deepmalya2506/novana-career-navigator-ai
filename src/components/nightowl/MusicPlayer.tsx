
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { PlayCircle, PauseCircle, Volume2, Music } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

interface Track {
  id: string;
  name: string;
  url: string;
  type: 'lofi' | 'ambient' | 'piano' | 'nature';
}

const tracks: Track[] = [
  { id: '1', name: 'Lunar Lo-fi', url: 'https://cdn.pixabay.com/download/audio/2022/05/17/audio_99fab6835e.mp3', type: 'lofi' },
  { id: '2', name: 'Midnight Motivation', url: 'https://cdn.pixabay.com/download/audio/2022/07/24/audio_dcf3f8f985.mp3', type: 'ambient' },
  { id: '3', name: 'Focus Flow', url: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1259453f48.mp3', type: 'piano' },
  { id: '4', name: 'Rainfall Calm', url: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d1bbc44873.mp3', type: 'nature' },
];

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<Track>(tracks[0]);
  const [volume, setVolume] = useState(50);
  const [filterType, setFilterType] = useState<string>('all');
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Initialize audio
  useEffect(() => {
    audioRef.current = new Audio(currentTrack.url);
    audioRef.current.loop = true;
    audioRef.current.volume = volume / 100;
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);
  
  // Handle track change
  useEffect(() => {
    if (audioRef.current) {
      const wasPlaying = !audioRef.current.paused;
      audioRef.current.pause();
      audioRef.current.src = currentTrack.url;
      audioRef.current.load();
      if (wasPlaying) {
        audioRef.current.play().catch(err => console.error("Playback failed:", err));
      }
    }
  }, [currentTrack]);
  
  // Handle volume change
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);
  
  const togglePlay = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(err => console.error("Playback failed:", err));
    }
    setIsPlaying(!isPlaying);
  };
  
  const changeTrack = (track: Track) => {
    setCurrentTrack(track);
  };
  
  const filteredTracks = filterType === 'all' 
    ? tracks 
    : tracks.filter(track => track.type === filterType);

  return (
    <Card className="glass-card overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Music className="h-5 w-5 text-novana-light-blue" />
          Ambient Music
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center justify-center">
          <Button
            onClick={togglePlay}
            variant="outline"
            size="icon"
            className="w-16 h-16 rounded-full glass-button flex items-center justify-center"
          >
            {isPlaying ? (
              <PauseCircle className="h-10 w-10 text-novana-light-blue" />
            ) : (
              <PlayCircle className="h-10 w-10 text-novana-light-blue" />
            )}
          </Button>
        </div>
        
        <div>
          <p className="text-center text-white/70 mb-2">
            {isPlaying ? `Now Playing: ${currentTrack.name}` : 'Select to play'}
          </p>
          
          <div className="flex items-center gap-2 mb-4">
            <Volume2 className="h-4 w-4 text-white/70" />
            <Slider
              value={[volume]}
              min={0}
              max={100}
              step={1}
              onValueChange={(value) => setVolume(value[0])}
              className="flex-1"
            />
          </div>
        </div>
        
        <ToggleGroup type="single" value={filterType} onValueChange={(value) => value && setFilterType(value)}>
          <ToggleGroupItem value="all" className="text-xs">All</ToggleGroupItem>
          <ToggleGroupItem value="lofi" className="text-xs">Lo-fi</ToggleGroupItem>
          <ToggleGroupItem value="ambient" className="text-xs">Ambient</ToggleGroupItem>
          <ToggleGroupItem value="piano" className="text-xs">Piano</ToggleGroupItem>
          <ToggleGroupItem value="nature" className="text-xs">Nature</ToggleGroupItem>
        </ToggleGroup>
        
        <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar pr-2">
          {filteredTracks.map((track) => (
            <Button
              key={track.id}
              variant="ghost"
              size="sm"
              className={`w-full justify-start ${currentTrack.id === track.id ? 'bg-white/10' : ''}`}
              onClick={() => changeTrack(track)}
            >
              {track.name}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default MusicPlayer;
