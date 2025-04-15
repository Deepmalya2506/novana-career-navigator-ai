import { useState, useEffect } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { EyeOff, Clock, Trophy, Award, Users, Eye, Video, Volume2, Timer } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ProctoredMode = () => {
  const [isActive, setIsActive] = useState(false);
  const [focusLevel, setFocusLevel] = useState(0);
  const [studyTime, setStudyTime] = useState(0);
  const [studyGoal, setStudyGoal] = useState(120); // in minutes
  const { toast } = useToast();
  
  useEffect(() => {
    let focusInterval: number | undefined;
    let timeInterval: number | undefined;
    
    if (isActive) {
      focusInterval = window.setInterval(() => {
        setFocusLevel((prev) => {
          const random = Math.random() * 10 - 3; // Simulates focus fluctuations
          return Math.min(Math.max(prev + random, 0), 100);
        });
      }, 3000);
      
      timeInterval = window.setInterval(() => {
        setStudyTime(prev => prev + 1);
      }, 60000); // Increment study time every minute
      
      toast({
        title: "Proctored Mode Activated",
        description: "Your focus is now being monitored.",
      });
    } else {
      clearInterval(focusInterval);
      clearInterval(timeInterval);
    }
    
    return () => {
      clearInterval(focusInterval);
      clearInterval(timeInterval);
    };
  }, [isActive, toast]);
  
  const getFocusLevelText = () => {
    if (focusLevel > 80) return "Excellent";
    if (focusLevel > 60) return "Good";
    if (focusLevel > 40) return "Average";
    if (focusLevel > 20) return "Distracted";
    return "Very Distracted";
  };
  
  const getFocusLevelColor = () => {
    if (focusLevel > 80) return "text-green-400";
    if (focusLevel > 60) return "text-green-300";
    if (focusLevel > 40) return "text-yellow-300";
    if (focusLevel > 20) return "text-orange-300";
    return "text-red-400";
  };
  
  const getProgressColor = () => {
    if (focusLevel > 80) return "bg-green-400";
    if (focusLevel > 60) return "bg-green-300";
    if (focusLevel > 40) return "bg-yellow-300";
    if (focusLevel > 20) return "bg-orange-300";
    return "bg-red-400";
  };
  
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };
  
  return (
    <PageLayout title="Proctored Mode">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="glass-card p-8 mb-8 text-center">
            <div className="flex flex-col md:flex-row items-center justify-between mb-8">
              <div className="flex items-center mb-4 md:mb-0">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center ${isActive ? 'bg-green-500/20' : 'bg-gray-500/20'}`}>
                  <EyeOff size={32} className={isActive ? 'text-green-400' : 'text-gray-400'} />
                </div>
                <div className="ml-4 text-left">
                  <h2 className="text-2xl font-bold">Proctored Mode</h2>
                  <p className="text-white/70">{isActive ? 'Active - Monitoring Focus' : 'Inactive'}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Label htmlFor="proctored-mode" className={isActive ? 'text-green-400' : 'text-white/70'}>
                  {isActive ? 'Enabled' : 'Disabled'}
                </Label>
                <Switch 
                  id="proctored-mode"
                  checked={isActive}
                  onCheckedChange={setIsActive}
                />
              </div>
            </div>
            
            {isActive && (
              <div className="space-y-8">
                <div>
                  <div className="flex justify-between mb-2">
                    <span>Current Focus Level</span>
                    <span className={getFocusLevelColor()}>{getFocusLevelText()}</span>
                  </div>
                  <Progress 
                    value={focusLevel} 
                    className={`h-3 ${getProgressColor()}`}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="glass-card p-4 flex flex-col items-center">
                    <Clock size={28} className="mb-2 text-novana-light-blue" />
                    <p className="text-white/70 text-sm">Study Time</p>
                    <p className="text-2xl font-bold">{formatTime(studyTime)}</p>
                  </div>
                  
                  <div className="glass-card p-4 flex flex-col items-center">
                    <Trophy size={28} className="mb-2 text-novana-pink" />
                    <p className="text-white/70 text-sm">XP Earned</p>
                    <p className="text-2xl font-bold">{Math.floor(studyTime * (focusLevel / 100))}</p>
                  </div>
                  
                  <div className="glass-card p-4 flex flex-col items-center">
                    <Award size={28} className="mb-2 text-novana-purple" />
                    <p className="text-white/70 text-sm">Current Rank</p>
                    <p className="text-2xl font-bold">Beginner</p>
                  </div>
                </div>
                
                <div className="glass-card p-6">
                  <h3 className="text-xl font-medium mb-4">Study Goal Progress</h3>
                  <div className="flex items-center">
                    <div className="w-full mr-4">
                      <Progress value={(studyTime / studyGoal) * 100} className="h-3" />
                    </div>
                    <span>{formatTime(studyTime)} / {formatTime(studyGoal)}</span>
                  </div>
                </div>
                
                <div className="glass-card p-6">
                  <h3 className="text-xl font-medium mb-4">Leaderboard</h3>
                  <div className="space-y-3">
                    <div className="flex items-center py-2 px-4 bg-white/10 rounded-md">
                      <div className="w-8 h-8 rounded-full bg-novana-blue/40 flex items-center justify-center mr-3">
                        <Trophy size={16} className="text-novana-light-blue" />
                      </div>
                      <div className="flex-grow">
                        <p className="font-medium">Alex J.</p>
                        <p className="text-xs text-white/70">12h study time • 980 XP</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center py-2 px-4 bg-white/5 rounded-md">
                      <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center mr-3">
                        <Users size={16} />
                      </div>
                      <div className="flex-grow">
                        <p className="font-medium">You</p>
                        <p className="text-xs text-white/70">{formatTime(studyTime)} study time • {Math.floor(studyTime * (focusLevel / 100))} XP</p>
                      </div>
                    </div>
                    
                    <Button variant="outline" className="glass-button w-full mt-2">
                      View Full Leaderboard
                    </Button>
                  </div>
                </div>
                
                <div className="glass-card p-6">
                  <h3 className="text-xl font-medium mb-4">Proctoring Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Eye size={20} className="mr-3" />
                        <Label>Focus Detection</Label>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Video size={20} className="mr-3" />
                        <Label>Camera Access</Label>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Volume2 size={20} className="mr-3" />
                        <Label>Sound Alerts</Label>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Timer size={20} className="mr-3" />
                        <Label>Break Reminders</Label>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>
                
                <Button variant="outline" className="glass-button hover:bg-red-900/30 hover:text-red-300 px-8">
                  End Session
                </Button>
              </div>
            )}
            
            {!isActive && (
              <div className="py-6">
                <p className="text-white/70 mb-6">
                  Enable Proctored Mode to track your focus level, earn XP, and compete with peers on the leaderboard.
                </p>
                <Button onClick={() => setIsActive(true)} className="cosmic-gradient text-white px-8">
                  Start Proctored Mode
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default ProctoredMode;
