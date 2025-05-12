
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { PlayCircle, PauseCircle, Volume2, Music, SkipForward, Loader, AlertCircle } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';

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

// Create a global audio context to persist across page navigation
let globalAudioInstance: HTMLAudioElement | null = null;
let globalCurrentTrackId: string | null = null;

const MusicPlayer = () => {
  const { toast } = useToast();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<Track>(tracks[0]);
  const [volume, setVolume] = useState(50);
  const [filterType, setFilterType] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressIntervalRef = useRef<number | null>(null);
  
  // Initialize audio with global instance if it exists
  useEffect(() => {
    if (globalAudioInstance) {
      audioRef.current = globalAudioInstance;
      const trackId = globalCurrentTrackId;
      if (trackId) {
        const track = tracks.find(t => t.id === trackId);
        if (track) {
          setCurrentTrack(track);
          setIsPlaying(!audioRef.current.paused);
          setLoading(false);
        }
      }
    } else {
      audioRef.current = new Audio();
      audioRef.current.loop = true;
      audioRef.current.volume = volume / 100;
      audioRef.current.src = currentTrack.url;
      
      globalAudioInstance = audioRef.current;
      globalCurrentTrackId = currentTrack.id;
      
      audioRef.current.addEventListener('canplaythrough', () => {
        setLoading(false);
        setDuration(audioRef.current?.duration || 0);
      });
      
      audioRef.current.addEventListener('error', (e) => {
        console.error('Audio error:', e);
        setError('Failed to load audio file. Please try again.');
        setLoading(false);
        toast({
          title: "Audio Error",
          description: "Couldn't play the selected track. Please try another track.",
          variant: "destructive"
        });
      });
      
      audioRef.current.load();
    }
    
    return () => {
      if (progressIntervalRef.current) {
        window.clearInterval(progressIntervalRef.current);
      }
    };
  }, []);
  
  // Update progress bar
  useEffect(() => {
    if (isPlaying) {
      progressIntervalRef.current = window.setInterval(() => {
        if (audioRef.current) {
          const currentTime = audioRef.current.currentTime;
          const audioDuration = audioRef.current.duration || 0;
          setProgress(audioDuration > 0 ? (currentTime / audioDuration) * 100 : 0);
        }
      }, 1000);
    } else if (progressIntervalRef.current) {
      window.clearInterval(progressIntervalRef.current);
    }
    
    return () => {
      if (progressIntervalRef.current) {
        window.clearInterval(progressIntervalRef.current);
      }
    };
  }, [isPlaying]);
  
  // Handle track change
  const changeTrack = useCallback((track: Track) => {
    setLoading(true);
    setError(null);
    
    if (audioRef.current) {
      const wasPlaying = !audioRef.current.paused;
      audioRef.current.pause();
      audioRef.current.src = track.url;
      audioRef.current.load();
      
      audioRef.current.addEventListener('canplaythrough', function onCanPlay() {
        setLoading(false);
        setDuration(audioRef.current?.duration || 0);
        if (wasPlaying) {
          audioRef.current?.play()
            .catch(err => {
              console.error("Playback failed:", err);
              toast({
                title: "Playback Error",
                description: "Browser requires user interaction before playing audio.",
                variant: "destructive"
              });
              setIsPlaying(false);
            });
        }
        // Remove the event listener to avoid duplicates
        audioRef.current?.removeEventListener('canplaythrough', onCanPlay);
      }, { once: true });
      
      setCurrentTrack(track);
      globalCurrentTrackId = track.id;
      setProgress(0);
    }
  }, [toast]);
  
  // Handle volume change
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);
  
  const togglePlay = useCallback(() => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      // Handle autoplay restrictions by catching the promise rejection
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(err => {
          console.error("Playback failed:", err);
          toast({
            title: "Playback Error",
            description: "Browser requires user interaction before playing audio.",
            variant: "destructive"
          });
          setIsPlaying(false);
        });
    }
  }, [isPlaying, toast]);
  
  const handleNextTrack = useCallback(() => {
    const filteredTracks = filterType === 'all' 
      ? tracks 
      : tracks.filter(track => track.type === filterType);
    
    const currentIndex = filteredTracks.findIndex(track => track.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % filteredTracks.length;
    changeTrack(filteredTracks[nextIndex]);
  }, [currentTrack, filterType, changeTrack]);
  
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
            disabled={loading || !!error}
          >
            {loading ? (
              <Loader className="h-10 w-10 text-novana-light-blue animate-spin" />
            ) : error ? (
              <AlertCircle className="h-10 w-10 text-destructive" />
            ) : isPlaying ? (
              <PauseCircle className="h-10 w-10 text-novana-light-blue" />
            ) : (
              <PlayCircle className="h-10 w-10 text-novana-light-blue" />
            )}
          </Button>
          
          <Button
            onClick={handleNextTrack}
            variant="ghost"
            size="icon"
            className="ml-2"
            disabled={loading}
          >
            <SkipForward className="h-5 w-5" />
          </Button>
        </div>
        
        <div>
          <p className="text-center text-white/70 mb-2">
            {loading ? 'Loading...' : error ? 'Error loading track' : isPlaying ? `Now Playing: ${currentTrack.name}` : 'Select to play'}
          </p>
          
          {!error && (
            <div className="mb-2">
              <Progress value={progress} className="h-1" />
            </div>
          )}
          
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
              disabled={loading && currentTrack.id === track.id}
            >
              {currentTrack.id === track.id && loading ? (
                <Loader className="h-3 w-3 mr-2 animate-spin" />
              ) : null}
              {track.name}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default MusicPlayer;
