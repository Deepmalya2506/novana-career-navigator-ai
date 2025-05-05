import { useState, useEffect } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { BriefcaseBusiness, Cpu, Rocket, Loader2, BookOpen, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import ProfileCustomization, { ProfileData } from '@/components/career/ProfileCustomization';
import SkillItem from '@/components/career/SkillItem';
import { getCareerSkills, getSkillDetails, getDreamJobRoadmap, SkillData, CareerData } from '@/services/careerService';

const PROFILE_STORAGE_KEY = 'careerProfileData';
const PROGRESS_STORAGE_KEY = 'careerProgressData';

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
  
  // Load saved profile data on component mount
  useEffect(() => {
    const loadProfileData = () => {
      try {
        const savedProfile = localStorage.getItem(PROFILE_STORAGE_KEY);
        if (savedProfile) {
          setProfile(JSON.parse(savedProfile));
        }
        
        const savedProgress = localStorage.getItem(PROGRESS_STORAGE_KEY);
        if (savedProgress) {
          const progressData = JSON.parse(savedProgress);
          setCompletedSkills(progressData.completedSkills || {});
          setCompletedTopics(progressData.completedTopics || {});
        }
      } catch (error) {
        console.error("Error loading saved profile data:", error);
      }
    };
    
    loadProfileData();
  }, []);
  
  // Save progress data whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify({
        completedSkills,
        completedTopics
      }));
    } catch (error) {
      console.error("Error saving progress data:", error);
    }
  }, [completedSkills, completedTopics]);
  
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
  
  // Load career data when company or profile changes
  useEffect(() => {
    const fetchCareerData = async () => {
      setLoading(true);
      try {
        let data: CareerData;
        
        // Use dream job roadmap if available, otherwise use regular career skills
        if (profile.dreamJob && selectedCompany === 'startup') {
          data = await getDreamJobRoadmap(profile.dreamJob);
        } else {
          const selectedRole = profile.targetRoles.length > 0 ? profile.targetRoles[0] : 'Software Engineer';
          data = await getCareerSkills(selectedRole, selectedCompany);
        }
        
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
  }, [selectedCompany, profile.targetRoles, profile.dreamJob, toast]);
  
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
  
  // Handle profile data updates
  const handleProfileUpdate = (updatedProfile: ProfileData) => {
    setProfile(updatedProfile);
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
            onSave={handleProfileUpdate} 
            initialData={profile}
          />
        </div>
        
        {/* Career objective banner when dream job is set */}
        {profile.dreamJob && (
          <div className="glass-card p-6 mb-8 text-center">
            <h2 className="text-2xl cosmic-text mb-2">Your Career Objective</h2>
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mr-4">
                <Rocket size={30} className="text-primary" />
              </div>
              <h3 className="text-3xl font-bold">{profile.dreamJob}</h3>
            </div>
            <p className="text-white/70 max-w-2xl mx-auto">
              We've generated a personalized roadmap to help you become a {profile.dreamJob}. 
              Select the "Dream Job" tab below to see your custom skill path and resources.
            </p>
          </div>
        )}
        
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
                {profile.dreamJob || "Dream Job"}
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
            <p className="text-white/70">
              {selectedCompany === 'startup' && profile.dreamJob
                ? `Complete towards your ${profile.dreamJob} career goal`
                : `Complete towards your ${selectedCompany} career goal`}
            </p>
            
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
          
          {/* Dream Job tab */}
          <TabsContent value="startup" className="space-y-8">
            {!profile.dreamJob ? (
              <div className="glass-card p-12 text-center">
                <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-6">
                  <Search className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-2xl font-semibold mb-3 cosmic-text">Define Your Dream Job</h3>
                <p className="text-white/70 mb-6 max-w-lg mx-auto">
                  Tell us your dream job title and we'll create a personalized career roadmap 
                  with all the skills and resources you need to achieve your goal.
                </p>
                <Button 
                  onClick={() => setDialogOpen(true)}
                  className="cosmic-gradient text-white py-2 px-6"
                >
                  Set Career Objective
                </Button>
              </div>
            ) : (
              <>
                <div className="glass-card p-6">
                  <h3 className="text-xl font-semibold mb-2 cosmic-text flex items-center">
                    <BookOpen className="mr-2" size={20} />
                    Roadmap to Becoming a {profile.dreamJob}
                  </h3>
                  
                  {careerData.description && (
                    <p className="mb-4 text-white/90">{careerData.description}</p>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Essential Skills */}
                    <div>
                      <h4 className="text-lg font-medium mb-3 text-white/80">Core Skills</h4>
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
                    <div>
                      <h4 className="text-lg font-medium mb-3 text-white/80">Advanced & Specialized Skills</h4>
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
                </div>
                
                {/* Learning Resources */}
                <div className="glass-card p-6">
                  <h3 className="text-xl font-semibold mb-4 cosmic-text">
                    {profile.dreamJob} Learning Resources
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button variant="outline" className="glass-button flex items-center justify-center">
                      <BookOpen className="mr-2" size={16} />
                      Online Courses
                    </Button>
                    <Button variant="outline" className="glass-button flex items-center justify-center">
                      <Search className="mr-2" size={16} />
                      Industry Certifications
                    </Button>
                    <Button variant="outline" className="glass-button flex items-center justify-center">
                      <BriefcaseBusiness className="mr-2" size={16} />
                      Job Interview Prep
                    </Button>
                  </div>
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>

        {/* Dialog for AI responses on skills */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="glass-card max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="cosmic-text text-xl">{selectedSkill}</DialogTitle>
              <DialogDescription>
                Skills insights for your {selectedCompany === 'startup' ? (profile.dreamJob || 'dream job') : selectedCompany} career path
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
