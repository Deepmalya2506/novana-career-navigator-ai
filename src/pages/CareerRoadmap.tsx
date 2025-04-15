
import { useState, useEffect } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Circle, ArrowRight, BriefcaseBusiness, Cpu, RocketLaunch } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const CareerRoadmap = () => {
  const [selectedCompany, setSelectedCompany] = useState('microsoft');
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();
  
  // Simulate loading progress
  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(15);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [selectedCompany]);
  
  const handleMilestoneClick = (milestone: string) => {
    toast({
      title: "Milestone Selected",
      description: `You're now working on: ${milestone}`,
    });
  };
  
  return (
    <PageLayout title="Career Roadmap">
      <div className="container mx-auto px-4 py-12">
        <Tabs defaultValue="microsoft" onValueChange={setSelectedCompany} className="w-full">
          <div className="flex justify-center mb-8">
            <TabsList className="glass-card p-1">
              <TabsTrigger value="microsoft" className="data-[state=active]:bg-white/20 px-6 py-3">
                <BriefcaseBusiness className="mr-2 h-5 w-5" />
                Microsoft
              </TabsTrigger>
              <TabsTrigger value="google" className="data-[state=active]:bg-white/20 px-6 py-3">
                <Cpu className="mr-2 h-5 w-5" />
                Google
              </TabsTrigger>
              <TabsTrigger value="startup" className="data-[state=active]:bg-white/20 px-6 py-3">
                <RocketLaunch className="mr-2 h-5 w-5" />
                Startup
              </TabsTrigger>
            </TabsList>
          </div>
          
          <div className="glass-card p-6 md:p-10 mb-8">
            <h2 className="text-2xl font-semibold mb-2">Your Progress</h2>
            <Progress value={progress} className="h-2 mb-2" />
            <p className="text-white/70">{progress}% complete towards your {selectedCompany} career goal</p>
          </div>
          
          <TabsContent value="microsoft" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass-card p-6">
                <h3 className="text-xl font-semibold mb-4 cosmic-text">Technical Skills</h3>
                <ul className="space-y-3">
                  {["Data Structures & Algorithms", "System Design", "C#/.NET", "Azure Cloud Services"].map((skill, index) => (
                    <li key={index} className="flex items-center cursor-pointer hover:bg-white/5 p-2 rounded-md transition-colors" onClick={() => handleMilestoneClick(skill)}>
                      {index === 0 ? 
                        <CheckCircle size={20} className="mr-3 text-green-500" /> : 
                        <Circle size={20} className="mr-3 text-white/50" />}
                      {skill}
                      <ArrowRight size={16} className="ml-auto" />
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="glass-card p-6">
                <h3 className="text-xl font-semibold mb-4 cosmic-text">Interview Preparation</h3>
                <ul className="space-y-3">
                  {["Company Values & Culture", "Behavioral Questions", "Technical Interviews", "Virtual Interview Simulator"].map((item, index) => (
                    <li key={index} className="flex items-center cursor-pointer hover:bg-white/5 p-2 rounded-md transition-colors" onClick={() => handleMilestoneClick(item)}>
                      {index === 0 ? 
                        <CheckCircle size={20} className="mr-3 text-green-500" /> : 
                        <Circle size={20} className="mr-3 text-white/50" />}
                      {item}
                      <ArrowRight size={16} className="ml-auto" />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="glass-card p-6">
              <h3 className="text-xl font-semibold mb-4 cosmic-text">Key Resource Links</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="glass-button">
                  LeetCode Problems
                </Button>
                <Button variant="outline" className="glass-button">
                  Microsoft Interview Questions
                </Button>
                <Button variant="outline" className="glass-button">
                  Resume Builder
                </Button>
              </div>
            </div>
            
            <div className="text-center">
              <Button className="cosmic-gradient text-white font-medium py-6 px-8 rounded-full">
                Start Virtual Interview
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="google" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass-card p-6">
                <h3 className="text-xl font-semibold mb-4 cosmic-text">Technical Skills</h3>
                <ul className="space-y-3">
                  {["Advanced Algorithms", "Distributed Systems", "Machine Learning Basics", "Google Cloud Platform"].map((skill, index) => (
                    <li key={index} className="flex items-center cursor-pointer hover:bg-white/5 p-2 rounded-md transition-colors" onClick={() => handleMilestoneClick(skill)}>
                      <Circle size={20} className="mr-3 text-white/50" />
                      {skill}
                      <ArrowRight size={16} className="ml-auto" />
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="glass-card p-6">
                <h3 className="text-xl font-semibold mb-4 cosmic-text">Interview Preparation</h3>
                <ul className="space-y-3">
                  {["Google Leadership Principles", "Project Experience Questions", "Technical Problem Solving", "System Design Interview"].map((item, index) => (
                    <li key={index} className="flex items-center cursor-pointer hover:bg-white/5 p-2 rounded-md transition-colors" onClick={() => handleMilestoneClick(item)}>
                      <Circle size={20} className="mr-3 text-white/50" />
                      {item}
                      <ArrowRight size={16} className="ml-auto" />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="glass-card p-6">
              <h3 className="text-xl font-semibold mb-4 cosmic-text">Key Resource Links</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="glass-button">
                  Google Tech Dev Guide
                </Button>
                <Button variant="outline" className="glass-button">
                  System Design Primer
                </Button>
                <Button variant="outline" className="glass-button">
                  Google Career Resources
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="startup" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass-card p-6">
                <h3 className="text-xl font-semibold mb-4 cosmic-text">Essential Skills</h3>
                <ul className="space-y-3">
                  {["Full-stack Development", "Product Management", "Growth Hacking", "Entrepreneurship Basics"].map((skill, index) => (
                    <li key={index} className="flex items-center cursor-pointer hover:bg-white/5 p-2 rounded-md transition-colors" onClick={() => handleMilestoneClick(skill)}>
                      <Circle size={20} className="mr-3 text-white/50" />
                      {skill}
                      <ArrowRight size={16} className="ml-auto" />
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="glass-card p-6">
                <h3 className="text-xl font-semibold mb-4 cosmic-text">Action Plan</h3>
                <ul className="space-y-3">
                  {["Build MVP", "Market Research", "Fundraising Strategy", "Building a Team"].map((item, index) => (
                    <li key={index} className="flex items-center cursor-pointer hover:bg-white/5 p-2 rounded-md transition-colors" onClick={() => handleMilestoneClick(item)}>
                      <Circle size={20} className="mr-3 text-white/50" />
                      {item}
                      <ArrowRight size={16} className="ml-auto" />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="glass-card p-6">
              <h3 className="text-xl font-semibold mb-4 cosmic-text">Startup Resources</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="glass-button">
                  Y Combinator Resources
                </Button>
                <Button variant="outline" className="glass-button">
                  Startup Pitch Templates
                </Button>
                <Button variant="outline" className="glass-button">
                  Funding Opportunities
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default CareerRoadmap;
