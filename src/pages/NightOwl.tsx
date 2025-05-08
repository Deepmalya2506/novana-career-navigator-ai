
import { useState, useRef, useEffect } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Send, MoonStar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useGemini } from '@/utils/geminiService';
import StarfieldBackground from '@/components/ui/StarfieldBackground';
import MoonPhaseDisplay from '@/components/nightowl/MoonPhaseDisplay';
import MusicPlayer from '@/components/nightowl/MusicPlayer';
import SelfEvaluationTracker from '@/components/nightowl/SelfEvaluationTracker';
import MotivationalWall from '@/components/nightowl/MotivationalWall';
import SleepGuardian from '@/components/nightowl/SleepGuardian';
import EmergencySOS from '@/components/nightowl/EmergencySOS';

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
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const { toast } = useToast();
  const { askQuestion } = useGemini();

  const promptSuggestions = [
    "I feel stuck with my project",
    "What's a good book to read tonight?",
    "How do I build consistency?",
    "I'm feeling overwhelmed",
    "Share a motivational quote"
  ];

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
    setIsTyping(true);

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
      setIsTyping(false);
      scrollToBottom();
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <PageLayout title="" showFloatingOrbs={false}>
      <StarfieldBackground />
      
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-20 pb-12">
        <div className="text-center max-w-3xl mx-auto">
          <div className="flex items-center justify-center mb-4">
            <MoonStar className="h-8 w-8 mr-3 text-novana-light-blue animate-pulse-glow" />
            <h1 className="text-4xl font-bold cosmic-text">Night Owl</h1>
          </div>
          <p className="text-xl text-white/80 mb-6">
            Darkness doesn't end the story — it begins a chapter where the stars speak.
          </p>
          <MoonPhaseDisplay />
        </div>
      </div>
      
      {/* Main Content */}
      <div className="container mx-auto px-4 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Chat */}
            <div className="glass-card p-6 min-h-[500px] flex flex-col">
              <div className="flex items-center mb-4 pb-4 border-b border-white/10">
                <MoonStar className="h-6 w-6 mr-3 text-novana-purple" />
                <h2 className="text-xl font-semibold">Night Owl Companion</h2>
              </div>

              <div className="flex-grow overflow-y-auto mb-4 space-y-4 pr-2 custom-scrollbar">
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
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="max-w-[80%] rounded-lg p-3 bg-white/10 text-white">
                      <div className="flex space-x-1">
                        <div className="h-2 w-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="h-2 w-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        <div className="h-2 w-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '600ms' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {promptSuggestions.map((suggestion, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="text-xs bg-white/5"
                      onClick={() => setInputMessage(suggestion)}
                    >
                      {suggestion}
                    </Button>
                  ))}
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
            </div>
            
            {/* Self-Evaluation Tracker */}
            <SelfEvaluationTracker />
          </div>
          
          {/* Right Column */}
          <div className="space-y-6">
            <MusicPlayer />
            <MotivationalWall />
            <SleepGuardian />
          </div>
        </div>
      </div>
      
      {/* SOS Button */}
      <EmergencySOS />
    </PageLayout>
  );
};

export default NightOwl;
