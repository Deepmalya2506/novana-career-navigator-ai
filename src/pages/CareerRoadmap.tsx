
import React, { useState } from 'react';
import { 
  ArrowRight, 
  ChevronRight, 
  Rocket, 
  CheckCircle, 
  Circle, 
  FileText, 
  Book, 
  Award, 
  Video, 
  MessageSquare,
  Upload
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import GlowBadge from '@/components/ui/GlowBadge';

const companies = [
  { name: "Google", icon: "🔍" },
  { name: "Microsoft", icon: "🪟" },
  { name: "Amazon", icon: "📦" },
  { name: "Apple", icon: "🍎" },
  { name: "Startup", icon: "🚀" }
];

const roadmapSteps = [
  {
    id: 1,
    title: "Foundation",
    completed: true,
    tasks: [
      { name: "Complete programming basics", completed: true },
      { name: "Build a portfolio project", completed: true },
      { name: "Learn data structures", completed: true }
    ]
  },
  {
    id: 2,
    title: "Skill Building",
    completed: false,
    current: true,
    tasks: [
      { name: "Master advanced algorithms", completed: false },
      { name: "Complete system design fundamentals", completed: true },
      { name: "Build distributed systems knowledge", completed: false }
    ]
  },
  {
    id: 3,
    title: "Interview Prep",
    completed: false,
    tasks: [
      { name: "Complete 100 LeetCode problems", completed: false },
      { name: "Mock interviews with AI", completed: false },
      { name: "Resume optimization", completed: false }
    ]
  },
  {
    id: 4,
    title: "Application",
    completed: false,
    tasks: [
      { name: "Apply to target companies", completed: false },
      { name: "Interview process", completed: false },
      { name: "Offer negotiation", completed: false }
    ]
  }
];

const CareerRoadmap = () => {
  const [selectedCompany, setSelectedCompany] = useState("Google");
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = () => {
    setIsUploading(true);
    // Simulate upload process
    setTimeout(() => setIsUploading(false), 2000);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-grow pt-28 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <div className="flex items-center gap-2 text-sm text-white/60 mb-4">
              <a href="/" className="hover:text-white">Home</a>
              <ChevronRight size={16} />
              <span className="text-white">Career Roadmap</span>
            </div>
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2 cosmic-text">Career Roadmap</h1>
                <p className="text-white/70">
                  Your personalized journey to landing your dream tech role
                </p>
              </div>
              
              <div className="flex gap-3">
                <GlowBadge color="blue">AI-Powered</GlowBadge>
                <GlowBadge color="purple">Personalized</GlowBadge>
              </div>
            </div>
          </div>
          
          {/* Company Selection */}
          <div className="glass-card p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Select Your Target Company</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {companies.map(company => (
                <button 
                  key={company.name}
                  onClick={() => setSelectedCompany(company.name)}
                  className={`glass-button p-4 flex flex-col items-center justify-center ${
                    selectedCompany === company.name ? 'border-novana-blue/50 bg-novana-blue/10' : ''
                  }`}
                >
                  <span className="text-3xl mb-2">{company.icon}</span>
                  <span className="text-sm font-medium">{company.name}</span>
                </button>
              ))}
            </div>
          </div>
          
          {/* Roadmap */}
          <div className="glass-card p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Your Google Career Roadmap</h2>
              <Button className="glass-button flex items-center gap-1" size="sm">
                <Rocket size={16} />
                <span>Update Plan</span>
              </Button>
            </div>
            
            <div className="space-y-6">
              {roadmapSteps.map((step, index) => (
                <div key={step.id} className="relative">
                  {index < roadmapSteps.length - 1 && (
                    <div className={`absolute top-12 left-6 h-[calc(100%-36px)] w-0.5 ${
                      step.completed ? 'bg-novana-blue' : 'bg-white/20'
                    }`}></div>
                  )}
                  
                  <div className="flex gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                      step.completed ? 'bg-novana-blue' : step.current ? 'bg-novana-purple' : 'bg-white/10'
                    }`}>
                      {step.completed ? (
                        <CheckCircle size={24} className="text-white" />
                      ) : (
                        <Circle size={24} className={`${step.current ? 'text-white' : 'text-white/50'}`} />
                      )}
                    </div>
                    
                    <div className={`glass-card p-4 flex-grow ${
                      step.current ? 'border-novana-purple/50' : step.completed ? 'border-novana-blue/30' : ''
                    }`}>
                      <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                        <span>{step.title}</span>
                        {step.current && <GlowBadge color="purple" className="text-xs">Current</GlowBadge>}
                      </h3>
                      
                      <ul className="space-y-2">
                        {step.tasks.map((task, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                              task.completed ? 'bg-novana-blue/30' : 'bg-white/10'
                            }`}>
                              {task.completed ? (
                                <CheckCircle size={16} className="text-novana-light-blue" />
                              ) : (
                                <Circle size={16} className="text-white/50" />
                              )}
                            </div>
                            <span className={task.completed ? 'text-white' : 'text-white/70'}>
                              {task.name}
                            </span>
                          </li>
                        ))}
                      </ul>
                      
                      {step.current && (
                        <div className="mt-4 pt-4 border-t border-white/10">
                          <div className="flex flex-wrap gap-2">
                            <Button variant="outline" size="sm" className="border-white/20 hover:border-white/40 flex items-center gap-1">
                              <Book size={16} />
                              <span>Resources</span>
                            </Button>
                            <Button variant="outline" size="sm" className="border-white/20 hover:border-white/40 flex items-center gap-1">
                              <MessageSquare size={16} />
                              <span>AI Coach</span>
                            </Button>
                            <Button variant="outline" size="sm" className="border-white/20 hover:border-white/40 flex items-center gap-1">
                              <Video size={16} />
                              <span>Practice Interview</span>
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Resources */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="glass-card p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <FileText size={20} className="text-novana-light-blue" />
                <span>Learning Resources</span>
              </h2>
              <ul className="space-y-3">
                <li className="glass-button p-3 flex items-center gap-3">
                  <Book size={18} className="text-white/70" />
                  <span>System Design Interview Guide</span>
                </li>
                <li className="glass-button p-3 flex items-center gap-3">
                  <Book size={18} className="text-white/70" />
                  <span>Advanced Algorithms Workshop</span>
                </li>
                <li className="glass-button p-3 flex items-center gap-3">
                  <Book size={18} className="text-white/70" />
                  <span>Google Specific Interview Questions</span>
                </li>
              </ul>
              <Button className="w-full mt-4 glass-button">
                View All Resources
              </Button>
            </div>
            
            <div className="glass-card p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Award size={20} className="text-novana-pink" />
                <span>Mock Interviews</span>
              </h2>
              <p className="text-white/70 mb-4">Practice with our AI-powered interview simulator tailored for Google interviews.</p>
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-white/70">Coding Interviews</span>
                  <span className="text-white/90">3/10 completed</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-novana-blue to-novana-purple w-[30%] rounded-full"></div>
                </div>
              </div>
              <Button className="w-full cosmic-gradient">
                Start Interview Session
              </Button>
            </div>
            
            <div className="glass-card p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Upload size={20} className="text-novana-light-blue" />
                <span>Resume Analysis</span>
              </h2>
              <p className="text-white/70 mb-4">Upload your resume for AI analysis and tailored recommendations for Google applications.</p>
              <div className="border-2 border-dashed border-white/20 rounded-lg p-6 flex flex-col items-center justify-center mb-4">
                <Upload size={32} className="text-white/50 mb-2" />
                <p className="text-sm text-white/60 text-center mb-3">
                  Drop your resume here or click to upload
                </p>
                <input type="file" className="hidden" id="resume-upload" />
                <Button 
                  className="glass-button" 
                  size="sm"
                  onClick={handleUpload}
                  disabled={isUploading}
                >
                  {isUploading ? "Uploading..." : "Select File"}
                </Button>
              </div>
            </div>
          </div>
          
          {/* Next Steps */}
          <div className="glass-card p-6">
            <h2 className="text-xl font-semibold mb-4">Recommended Next Steps</h2>
            <ul className="space-y-3">
              <li className="glass-button p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-novana-blue/20 flex items-center justify-center">
                    <Book size={20} className="text-novana-light-blue" />
                  </div>
                  <div>
                    <h3 className="font-medium">Complete System Design Course</h3>
                    <p className="text-sm text-white/60">Estimated time: 12 hours</p>
                  </div>
                </div>
                <Button size="sm" className="glass-button">
                  Start
                  <ArrowRight size={16} className="ml-1" />
                </Button>
              </li>
              
              <li className="glass-button p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-novana-purple/20 flex items-center justify-center">
                    <Video size={20} className="text-purple-300" />
                  </div>
                  <div>
                    <h3 className="font-medium">Google Mock Interview</h3>
                    <p className="text-sm text-white/60">AI-powered interview simulation</p>
                  </div>
                </div>
                <Button size="sm" className="glass-button">
                  Schedule
                  <ArrowRight size={16} className="ml-1" />
                </Button>
              </li>
              
              <li className="glass-button p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-novana-pink/20 flex items-center justify-center">
                    <MessageSquare size={20} className="text-pink-300" />
                  </div>
                  <div>
                    <h3 className="font-medium">AI Career Coaching Session</h3>
                    <p className="text-sm text-white/60">Get personalized guidance</p>
                  </div>
                </div>
                <Button size="sm" className="glass-button">
                  Start Session
                  <ArrowRight size={16} className="ml-1" />
                </Button>
              </li>
            </ul>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CareerRoadmap;
