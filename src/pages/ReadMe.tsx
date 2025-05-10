
import React from 'react';
import PageLayout from '@/components/layout/PageLayout';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';

const ReadMe = () => {
  return (
    <PageLayout 
      title="About NOVANA"
      description="Learn more about our AI-powered Career Pilot"
    >
      <div className="container mx-auto px-4 py-8">
        <Link to="/" className="mb-8 flex items-center hover:text-primary transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
        </Link>
        
        <Card className="bg-black/40 border-white/10 p-6 mb-10">
          <div className="prose prose-invert max-w-none">
            <h1>🌌 NOVANA – Your AI-powered Career Pilot 🚀</h1>
            <p className="text-lg font-medium">As a Star dies in Supernova | Let another Star evolve with NOVANA</p>
            
            <p>NOVANA is more than just a dashboard—it's your personal AI co-pilot on the journey of academic brilliance and career transcendence. Built for ambitious dreamers, NOVANA blends tech, strategy, and soul into a seamless futuristic experience.</p>
            
            <h2>🌠 Features</h2>
            
            <h3>🎯 Long Term Career Goals</h3>
            <ul>
              <li>Choose your path: Microsoft, Google, or your own startup!</li>
              <li>Personalized roadmaps.</li>
              <li>ATS-ready virtual interviews with real-time feedback.</li>
              <li>Curated platform-specific questions (LeetCode, GFG, etc.)</li>
            </ul>
            
            <h3>📚 Short Term Exam Goals</h3>
            <ul>
              <li>Upload your syllabus (PDF, text, image) – NOVANA builds your study plan.</li>
              <li>Upload PYQs – AI predicts high-probability questions.</li>
              <li>Learn, revise, and slay one concept at a time.</li>
            </ul>
            
            <h3>🌐 Event Aggregator & Registration</h3>
            <ul>
              <li>Aggregates personalized events based on your progress and interests.</li>
              <li>Auto-registers (with consent) for free events.</li>
            </ul>
            
            <h3>📝 LinkedIn Post Generator</h3>
            <ul>
              <li>Upload your achievement, and watch NOVANA craft a crisp, heartfelt LinkedIn post for you.</li>
              <li>Optional auto-upload to LinkedIn with your credentials.</li>
            </ul>
            
            <h3>👀 Proctored Mode</h3>
            <ul>
              <li>Tracks your focus level while studying.</li>
              <li>Rewards you with XP, badges, and ranks in the NOVANA community.</li>
            </ul>
            
            <h3>🦉 NightOwl Mode</h3>
            <ul>
              <li>An AI companion that chats with you at night.</li>
              <li>Motivates, comforts, and even plays ambient music to keep you going.</li>
            </ul>
            
            <h3>🧠 Community Platform</h3>
            <ul>
              <li>Peer groups, team formations, doubt solving, and social bonding – all in one space.</li>
            </ul>
            
            <h3>🗺️ Event Map UI</h3>
            <ul>
              <li>Visualize your upcoming tech fests, seminars, and hackathons on an interactive map.</li>
            </ul>
            
            <h3>🚀 Career Roadmap Display</h3>
            <ul>
              <li>Visual representation of your journey – milestones, achievements, and what's next.</li>
            </ul>
            
            <h2>🧪 Built With</h2>
            <ul>
              <li>ReactJS + Vite – Superfast, modern frontend.</li>
              <li>TailwindCSS – Glowing neon UI with responsive design.</li>
              <li>Framer Motion – Sweet, smooth animations.</li>
              <li>Lucide Icons – Sharp and modern icon set.</li>
              <li>Gemini Pro API (optional) – For AI features (GPT or Gemini).</li>
            </ul>
            
            <h2>🧠 Future Roadmap</h2>
            <ul>
              <li>Voice commands with Whisper AI</li>
              <li>Real-time chat with NightOwl companion</li>
              <li>AI-based Event Recommendations</li>
              <li>User authentication & profile saving</li>
              <li>PWA support for mobile use</li>
            </ul>
            
            <h2>📬 Contact</h2>
            <p>Made with ❤️ by Deepmalya Koley</p>
            <p>📫 iamdeepmalya@gmail.com</p>
            <p>🔗 LinkedIn</p>
          </div>
        </Card>
        
        <div className="flex justify-center">
          <Button 
            className="cosmic-gradient text-white font-medium rounded-full transition-all hover:opacity-90 hover:shadow-lg hover:scale-105"
            asChild
          >
            <Link to="/auth">Get Started with NOVANA</Link>
          </Button>
        </div>
      </div>
    </PageLayout>
  );
};

export default ReadMe;
