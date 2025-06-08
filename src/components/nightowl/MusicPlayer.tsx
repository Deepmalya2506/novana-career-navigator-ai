
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { PlayCircle, PauseCircle, Volume2, Music, SkipForward, Loader, AlertCircle } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';
import { tracks, loadAudioWithFallback, preloadAudio, Track } from '@/utils/audioTracks';

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
      initializeAudio(currentTrack);
    }
    
    return () => {
      if (progressIntervalRef.current) {
        window.clearInterval(progressIntervalRef.current);
      }
    };
  }, []);

  const initializeAudio = async (track: Track) => {
    setLoading(true);
    setError(null);
    
    try {
      const workingUrl = await loadAudioWithFallback(track);
      
      audioRef.current = new Audio();
      audioRef.current.loop = true;
      audioRef.current.volume = volume / 100;
      audioRef.current.src = workingUrl;
      
      globalAudioInstance = audioRef.current;
      globalCurrentTrackId = track.id;
      
      audioRef.current.addEventListener('canplaythrough', () => {
        setLoading(false);
        setDuration(audioRef.current?.duration || 0);
        setError(null);
      });
      
      audioRef.current.addEventListener('error', (e) => {
        console.error('Audio error:', e);
        setError(`Failed to load "${track.name}". Audio source may be unavailable.`);
        setLoading(false);
        toast({
          title: "Audio Error",
          description: `Couldn't load ${track.name}. Trying fallback sources...`,
          variant: "destructive"
        });
        
        // Try to load a different track as fallback
        tryFallbackTrack();
      });
      
      audioRef.current.addEventListener('ended', () => {
        if (audioRef.current?.loop) {
          audioRef.current.currentTime = 0;
          audioRef.current.play().catch(err => {
            console.error("Playback failed on loop:", err);
          });
        }
      });
      
      audioRef.current.load();
    } catch (err) {
      console.error('Failed to initialize audio:', err);
      setError('Unable to load any audio sources. Please check your internet connection.');
      setLoading(false);
      toast({
        title: "Connection Error",
        description: "Unable to load audio. Please check your internet connection.",
        variant: "destructive"
      });
    }
  };

  const tryFallbackTrack = async () => {
    const availableTracks = tracks.filter(t => t.id !== currentTrack.id);
    for (const track of availableTracks) {
      try {
        await loadAudioWithFallback(track);
        changeTrack(track);
        toast({
          title: "Switched Track",
          description: `Loaded ${track.name} instead.`,
        });
        break;
      } catch (err) {
        continue;
      }
    }
  };
  
  // Update progress bar
  useEffect(() => {
    if (isPlaying) {
      progressIntervalRef.current = window.setInterval(() => {
        if (audioRef.current && !audioRef.current.paused) {
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
  
  // Handle track change with better error handling
  const changeTrack = useCallback(async (track: Track) => {
    setLoading(true);
    setError(null);
    
    try {
      const workingUrl = await loadAudioWithFallback(track);
      
      if (audioRef.current) {
        const wasPlaying = !audioRef.current.paused;
        audioRef.current.pause();
        audioRef.current.src = workingUrl;
        audioRef.current.load();
        
        const onCanPlay = () => {
          setLoading(false);
          setDuration(audioRef.current?.duration || 0);
          if (wasPlaying) {
            audioRef.current?.play()
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
          audioRef.current?.removeEventListener('canplaythrough', onCanPlay);
        };
        
        audioRef.current.addEventListener('canplaythrough', onCanPlay);
        
        setCurrentTrack(track);
        globalCurrentTrackId = track.id;
        setProgress(0);
        setError(null);
      }
    } catch (err) {
      console.error('Failed to change track:', err);
      setError(`Failed to load "${track.name}". Please try another track.`);
      setLoading(false);
      toast({
        title: "Track Load Error",
        description: `Couldn't load ${track.name}. Please try another track.`,
        variant: "destructive"
      });
    }
  }, [toast]);
  
  // Handle volume change
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);
  
  // Enhanced togglePlay function
  const togglePlay = useCallback(() => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      if (!currentTrack && tracks.length > 0) {
        changeTrack(tracks[0]);
        return;
      }
      
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
          toast({
            title: "Now Playing",
            description: `${currentTrack.name}`,
          });
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
  }, [isPlaying, currentTrack, changeTrack, toast]);
  
  // Handle for Next Track button
  const handleNextTrack = useCallback(() => {
    const filteredTracks = filterType === 'all' 
      ? tracks 
      : tracks.filter(track => track.type === filterType);
    
    if (filteredTracks.length === 0) {
      toast({
        title: "No tracks available",
        description: "Try selecting a different filter.",
        variant: "destructive"
      });
      return;
    }
    
    const currentIndex = filteredTracks.findIndex(track => track.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % filteredTracks.length;
    changeTrack(filteredTracks[nextIndex]);
    
    setIsPlaying(true);
  }, [currentTrack, filterType, changeTrack, toast]);
  
  // Get filtered tracks based on the current filter
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
            disabled={loading || filteredTracks.length <= 1}
          >
            <SkipForward className="h-5 w-5" />
          </Button>
        </div>
        
        <div>
          <p className="text-center text-white/70 mb-2">
            {loading ? 'Loading track...' : 
             error ? 'Audio unavailable' : 
             isPlaying ? `Now Playing: ${currentTrack.name}` : 
             'Select a track to play'}
          </p>
          
          {error && (
            <p className="text-center text-xs text-destructive mb-2">
              {error}
            </p>
          )}
          
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
              onClick={() => {
                changeTrack(track);
                if (audioRef.current && !isPlaying) {
                  setTimeout(() => togglePlay(), 100);
                }
              }}
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
