
import { useState, useEffect } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { BriefcaseBusiness, Cpu, Rocket, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import ProfileCustomization from '@/components/career/ProfileCustomization';
import SkillItem from '@/components/career/SkillItem';
import { getCareerSkills, getSkillDetails, SkillData, CareerData } from '@/services/careerService';

interface ProfileData {
  name: string;
  objective: string;
  goals: string;
  targetRoles: string[];
}

const CareerRoadmap = () => {
  // State management
  const [selectedCompany, setSelectedCompany] = useState('microsoft');
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();
  const [selectedSkill, setSelectedSkill] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [aiResponse, setAiResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [careerData, setCareerData] = useState<CareerData>({ skills: [], description: '' });
  const [loading, setLoading] = useState(false);
  
  // New state for profile and progress tracking
  const [profile, setProfile] = useState<ProfileData>({
    name: 'User',
    objective: 'Land a software engineering position at a top tech company',
    goals: 'Learn key technical skills and prepare for technical interviews',
    targetRoles: ['Software Engineer'],
  });
  
  const [completedSkills, setCompletedSkills] = useState<Record<string, boolean>>({});
  const [completedTopics, setCompletedTopics] = useState<Record<string, boolean>>({});
  
  // Calculate progress based on completed skills and topics
  useEffect(() => {
    if (careerData.skills.length === 0) return;
    
    let totalTopics = 0;
    let completedCount = 0;
    
    careerData.skills.forEach(skill => {
      totalTopics += skill.topics.length;
      
      skill.topics.forEach(topic => {
        if (completedTopics[topic]) {
          completedCount++;
        }
      });
    });
    
    const newProgress = totalTopics > 0 ? Math.round((completedCount / totalTopics) * 100) : 0;
    setProgress(newProgress);
  }, [completedSkills, completedTopics, careerData.skills]);
  
  // Load career data when company changes
  useEffect(() => {
    const fetchCareerData = async () => {
      setLoading(true);
      try {
        const selectedRole = profile.targetRoles.length > 0 ? profile.targetRoles[0] : 'Software Engineer';
        const data = await getCareerSkills(selectedRole, selectedCompany);
        setCareerData(data);
      } catch (error) {
        console.error('Failed to fetch career data:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load career data. Please try again.",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchCareerData();
  }, [selectedCompany, profile.targetRoles, toast]);
  
  // Handle skill selection
  const handleSkillClick = async (skill: string) => {
    setSelectedSkill(skill);
    setDialogOpen(true);
    setIsLoading(true);
    setAiResponse('');
    
    try {
      const response = await getSkillDetails(skill);
      setAiResponse(response);
    } catch (error) {
      console.error("Error getting skill details:", error);
      setAiResponse("Sorry, I couldn't retrieve information about this skill right now. Please try again later.");
      
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to get skill details. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Toggle skill completion status
  const handleToggleSkill = (skill: string, completed: boolean) => {
    setCompletedSkills(prev => ({
      ...prev,
      [skill]: completed
    }));
    
    // If marking a skill as complete, also mark all its topics as complete
    if (completed) {
      const skillData = careerData.skills.find(s => s.name === skill);
      if (skillData) {
        const newTopics = { ...completedTopics };
        skillData.topics.forEach(topic => {
          newTopics[topic] = true;
        });
        setCompletedTopics(newTopics);
      }
    }
  };
  
  // Toggle topic completion status
  const handleToggleTopic = (skill: string, topic: string, completed: boolean) => {
    setCompletedTopics(prev => ({
      ...prev,
      [topic]: completed
    }));
    
    // Check if all topics for this skill are completed
    const skillData = careerData.skills.find(s => s.name === skill);
    if (skillData) {
      const allCompleted = skillData.topics.every(t => 
        completedTopics[t] === true || (t === topic && completed)
      );
      
      if (allCompleted) {
        setCompletedSkills(prev => ({
          ...prev,
          [skill]: true
        }));
      } else {
        setCompletedSkills(prev => ({
          ...prev,
          [skill]: false
        }));
      }
    }
  };
  
  // Render loading state
  if (loading) {
    return (
      <PageLayout title="Career Roadmap">
        <div className="container mx-auto px-4 py-12 flex justify-center items-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-lg">Loading your personalized career roadmap...</p>
          </div>
        </div>
      </PageLayout>
    );
  }
  
  return (
    <PageLayout title="Career Roadmap">
      <div className="container mx-auto px-4 py-12">
        {/* Profile customization */}
        <div className="flex justify-center">
          <ProfileCustomization 
            onSave={setProfile} 
            initialData={profile}
          />
        </div>
        
        {/* Company selection */}
        <Tabs defaultValue={selectedCompany} onValueChange={setSelectedCompany} className="w-full">
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
                <Rocket className="mr-2 h-5 w-5" />
                Startup
              </TabsTrigger>
            </TabsList>
          </div>
          
          {/* Progress tracking */}
          <div className="glass-card p-6 md:p-10 mb-8">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-2xl font-semibold">Your Progress</h2>
              <span className="text-xl font-bold">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2 mb-2" />
            <p className="text-white/70">Complete towards your {selectedCompany} career goal</p>
            
            {/* Career description */}
            {careerData.description && (
              <div className="mt-6 p-4 bg-white/5 rounded-lg">
                <p className="italic text-white/80">{careerData.description}</p>
              </div>
            )}
          </div>
          
          {/* Skills for each company */}
          <TabsContent value="microsoft" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Technical Skills */}
              <div className="glass-card p-6">
                <h3 className="text-xl font-semibold mb-4 cosmic-text">Technical Skills</h3>
                <div className="space-y-1">
                  {careerData.skills
                    .filter((skill, index) => index < Math.ceil(careerData.skills.length / 2))
                    .map((skill, index) => (
                      <SkillItem 
                        key={index}
                        skill={skill.name} 
                        topics={skill.topics}
                        isCompleted={completedSkills[skill.name] === true}
                        onToggleSkill={handleToggleSkill}
                        onToggleTopic={handleToggleTopic}
                        completedTopics={completedTopics}
                        onClick={handleSkillClick}
                      />
                    ))}
                </div>
              </div>
              
              {/* Soft Skills and Preparation */}
              <div className="glass-card p-6">
                <h3 className="text-xl font-semibold mb-4 cosmic-text">Additional Skills</h3>
                <div className="space-y-1">
                  {careerData.skills
                    .filter((skill, index) => index >= Math.ceil(careerData.skills.length / 2))
                    .map((skill, index) => (
                      <SkillItem 
                        key={index}
                        skill={skill.name} 
                        topics={skill.topics}
                        isCompleted={completedSkills[skill.name] === true}
                        onToggleSkill={handleToggleSkill}
                        onToggleTopic={handleToggleTopic}
                        completedTopics={completedTopics}
                        onClick={handleSkillClick}
                      />
                    ))}
                </div>
              </div>
            </div>
            
            {/* Resource links */}
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
          
          {/* Google tab - uses the same skills data but for Google */}
          <TabsContent value="google" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Technical Skills */}
              <div className="glass-card p-6">
                <h3 className="text-xl font-semibold mb-4 cosmic-text">Technical Skills</h3>
                <div className="space-y-1">
                  {careerData.skills
                    .filter((skill, index) => index < Math.ceil(careerData.skills.length / 2))
                    .map((skill, index) => (
                      <SkillItem 
                        key={index}
                        skill={skill.name} 
                        topics={skill.topics}
                        isCompleted={completedSkills[skill.name] === true}
                        onToggleSkill={handleToggleSkill}
                        onToggleTopic={handleToggleTopic}
                        completedTopics={completedTopics}
                        onClick={handleSkillClick}
                      />
                    ))}
                </div>
              </div>
              
              {/* Additional Skills */}
              <div className="glass-card p-6">
                <h3 className="text-xl font-semibold mb-4 cosmic-text">Additional Skills</h3>
                <div className="space-y-1">
                  {careerData.skills
                    .filter((skill, index) => index >= Math.ceil(careerData.skills.length / 2))
                    .map((skill, index) => (
                      <SkillItem 
                        key={index}
                        skill={skill.name} 
                        topics={skill.topics}
                        isCompleted={completedSkills[skill.name] === true}
                        onToggleSkill={handleToggleSkill}
                        onToggleTopic={handleToggleTopic}
                        completedTopics={completedTopics}
                        onClick={handleSkillClick}
                      />
                    ))}
                </div>
              </div>
            </div>
            
            {/* Resource links for Google */}
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
          
          {/* Startup tab - uses the same skills data but for startup */}
          <TabsContent value="startup" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Essential Skills */}
              <div className="glass-card p-6">
                <h3 className="text-xl font-semibold mb-4 cosmic-text">Essential Skills</h3>
                <div className="space-y-1">
                  {careerData.skills
                    .filter((skill, index) => index < Math.ceil(careerData.skills.length / 2))
                    .map((skill, index) => (
                      <SkillItem 
                        key={index}
                        skill={skill.name} 
                        topics={skill.topics}
                        isCompleted={completedSkills[skill.name] === true}
                        onToggleSkill={handleToggleSkill}
                        onToggleTopic={handleToggleTopic}
                        completedTopics={completedTopics}
                        onClick={handleSkillClick}
                      />
                    ))}
                </div>
              </div>
              
              {/* Action Plan */}
              <div className="glass-card p-6">
                <h3 className="text-xl font-semibold mb-4 cosmic-text">Action Plan</h3>
                <div className="space-y-1">
                  {careerData.skills
                    .filter((skill, index) => index >= Math.ceil(careerData.skills.length / 2))
                    .map((skill, index) => (
                      <SkillItem 
                        key={index}
                        skill={skill.name} 
                        topics={skill.topics}
                        isCompleted={completedSkills[skill.name] === true}
                        onToggleSkill={handleToggleSkill}
                        onToggleTopic={handleToggleTopic}
                        completedTopics={completedTopics}
                        onClick={handleSkillClick}
                      />
                    ))}
                </div>
              </div>
            </div>
            
            {/* Startup resources */}
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

        {/* Dialog for AI responses on skills */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="glass-card max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="cosmic-text text-xl">{selectedSkill}</DialogTitle>
              <DialogDescription>
                Skills insights for your {selectedCompany} career path
              </DialogDescription>
            </DialogHeader>
            
            <div className="mt-4">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin mb-4 text-primary" />
                  <p>Getting insights about {selectedSkill}...</p>
                </div>
              ) : (
                <div className="prose prose-invert max-w-none">
                  <div className="whitespace-pre-wrap">
                    {aiResponse}
                  </div>
                </div>
              )}
            </div>
            
            <div className="mt-6 flex justify-end">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </PageLayout>
  );
};

export default CareerRoadmap;
