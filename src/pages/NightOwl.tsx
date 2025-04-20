import { useState, useRef } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { MoonStar, PlayCircle, PauseCircle, Send, Volume2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useGemini } from '@/utils/geminiService';

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
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();
  const { askQuestion } = useGemini();

  // URL for the soft strings ambient music
  const musicUrl = 'https://pixabay.com/music/ambient-mellow-ambient-piano-pad-guitar-strings-138801/';

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const newMessage: Message = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputMessage('');

    // Show typing indicator
    scrollToBottom();

    try {
      // Generate AI response using Gemini
      const prompt = `You are Night Owl, an AI companion for students studying late at night. 
      You're supportive, motivational, and provide concise advice. 
      The user says: "${inputMessage}". 
      Respond in a helpful, encouraging way that helps them stay focused and motivated during their late-night study session. 
      Keep your response under 100 words.`;

      const response = await askQuestion(prompt);

      if (response) {
        const aiResponse: Message = {
          id: Date.now(),
          text: response.text,
          sender: 'ai',
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, aiResponse]);
      } else {
        // Fallback response if Gemini fails
        const fallbackResponse: Message = {
          id: Date.now(),
          text: "I'm here to support you! Remember to take short breaks if you feel your focus waning. You've got this!",
          sender: 'ai',
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, fallbackResponse]);
      }
    } catch (error) {
      console.error('Error generating response:', error);

      // Fallback on error
      const errorResponse: Message = {
        id: Date.now(),
        text: "I'm having a bit of trouble connecting right now, but I'm still here for you. Keep pushing forward with your work!",
        sender: 'ai',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorResponse]);
    } finally {
      scrollToBottom();
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleMusic = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio(musicUrl);
      audioRef.current.loop = true; // Loop the track indefinitely
    }

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }

    setIsPlaying((prev) => !prev);

    toast({
      title: isPlaying ? 'Music Paused' : 'Music Playing',
      description: isPlaying
        ? 'Ambient music has been paused.'
        : 'Relaxing soft strings ambient music is now playing.',
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
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.sender === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.sender === 'user'
                          ? 'bg-novana-purple/40 text-white'
                          : 'bg-white/10 text-white'
                      }`}
                    >
                      <p>{message.text}</p>
                      <p className="text-xs text-white/50 mt-1">
                        {formatTime(message.timestamp)}
                      </p>
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
                      {isPlaying ? (
                        <PauseCircle className="h-10 w-10 text-novana-light-blue" />
                      ) : (
                        <PlayCircle className="h-10 w-10 text-novana-light-blue" />
                      )}
                    </Button>
                  </div>

                  <div>
                    <p className="text-center text-white/70">
                      {isPlaying ? 'Playing Soft Strings Music' : 'Select to play'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="glass-card p-6">
                <h3 className="font-semibold mb-4">Motivation Quote</h3>
                <blockquote className="italic text-white/80">
                  "The night is darkest just before the dawn. And I promise you,
                  the dawn is coming."
                </blockquote>
                <p className="text-right text-sm text-white/50 mt-2">
                  — Harvey Dent
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default NightOwl;
