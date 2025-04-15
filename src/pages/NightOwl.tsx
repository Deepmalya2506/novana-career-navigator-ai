
import { useState, useRef } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { MoonStar, PlayCircle, PauseCircle, Send, ListMusic, Volume2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

const NightOwl = () => {
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: 1, 
      text: "Hello! I'm your Night Owl companion. How can I help you stay motivated tonight?", 
      sender: 'ai', 
      timestamp: new Date() 
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const { toast } = useToast();
  
  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    
    const newMessage: Message = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');
    
    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "You're doing great! Remember why you started this journey. Keep going!",
        "It's normal to feel tired at this hour. Try taking a 5-minute break, drink some water, and then get back to it.",
        "You've got this! Just focus on one small step at a time.",
        "Success is the sum of small efforts repeated day in and day out. Keep pushing!",
        "Night hours can be the most productive. Fewer distractions, more focus. Use this time wisely!"
      ];
      
      const aiResponse: Message = {
        id: Date.now(),
        text: responses[Math.floor(Math.random() * responses.length)],
        sender: 'ai',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiResponse]);
      scrollToBottom();
    }, 1000);
  };
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const toggleMusic = () => {
    setIsPlaying(prev => !prev);
    
    toast({
      title: isPlaying ? "Music Paused" : "Music Playing",
      description: isPlaying ? "Ambient music has been paused." : "Relaxing ambient music is now playing.",
    });
  };
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <PageLayout title="Night Owl Mode" showFloatingOrbs={false}>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="glass-card p-6 md:w-2/3 flex flex-col h-[600px]">
              <div className="flex items-center mb-4 pb-4 border-b border-white/10">
                <MoonStar className="h-6 w-6 mr-3 text-novana-purple" />
                <h2 className="text-xl font-semibold">Night Owl Companion</h2>
              </div>
              
              <div className="flex-grow overflow-y-auto mb-4 space-y-4 pr-2">
                {messages.map(message => (
                  <div 
                    key={message.id} 
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.sender === 'user' 
                          ? 'bg-novana-purple/40 text-white'
                          : 'bg-white/10 text-white'
                      }`}
                    >
                      <p>{message.text}</p>
                      <p className="text-xs text-white/50 mt-1">{formatTime(message.timestamp)}</p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              
              <div className="flex gap-2">
                <Textarea 
                  placeholder="Ask me anything or share how you're feeling..."
                  className="min-h-[60px] bg-white/5 border-white/20 resize-none"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
                <Button 
                  onClick={handleSendMessage} 
                  className="cosmic-gradient text-white self-end"
                >
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </div>
            
            <div className="md:w-1/3 space-y-6">
              <div className="glass-card p-6">
                <h3 className="text-xl font-semibold mb-4">Ambient Music</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-center">
                    <Button 
                      onClick={toggleMusic}
                      variant="outline" 
                      className="w-16 h-16 rounded-full glass-button flex items-center justify-center"
                    >
                      {isPlaying 
                        ? <PauseCircle className="h-10 w-10 text-novana-light-blue" /> 
                        : <PlayCircle className="h-10 w-10 text-novana-light-blue" />
                      }
                    </Button>
                  </div>
                  
                  <div>
                    <p className="text-center text-white/70">
                      {isPlaying ? 'Cosmic Dreams' : 'Select to play'}
                    </p>
                  </div>
                  
                  <div className="pt-4 border-t border-white/10">
                    <Button variant="outline" className="glass-button w-full">
                      <ListMusic className="mr-2 h-4 w-4" />
                      Change Track
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="glass-card p-6">
                <h3 className="font-semibold mb-4">Sound Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="volume">Volume</Label>
                    <div className="flex items-center">
                      <Volume2 className="h-4 w-4 mr-2 text-white/70" />
                      <Input 
                        id="volume" 
                        type="range" 
                        className="w-32" 
                        defaultValue={70}
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label>Auto-pause timer</Label>
                    <div className="flex items-center space-x-2">
                      <Input 
                        type="time" 
                        defaultValue="01:00"
                        className="w-24 bg-white/5 border-white/20" 
                      />
                      <Switch />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="glass-card p-6">
                <h3 className="font-semibold mb-4">Motivation Quote</h3>
                <blockquote className="italic text-white/80">
                  "The night is darkest just before the dawn. And I promise you, the dawn is coming."
                </blockquote>
                <p className="text-right text-sm text-white/50 mt-2">— Harvey Dent</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default NightOwl;
