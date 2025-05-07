
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import PageLayout from '@/components/layout/PageLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { 
  Copy, 
  Upload, 
  CircleEllipsis,
  Loader,
  Pencil,
  ArrowUp,
  Linkedin,
  Check
} from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGemini } from '@/lib/gemini';
import { ProfileData } from '@/components/career/ProfileCustomization';

// Post tone options
const TONE_OPTIONS = [
  { value: "professional", label: "Professional", description: "Formal and business-oriented" },
  { value: "inspirational", label: "Inspirational", description: "Motivational and uplifting" },
  { value: "casual", label: "Casual", description: "Friendly and conversational" },
  { value: "technical", label: "Technical", description: "Detailed and technical" },
];

// Get user name from localStorage or use a default name
const getUserName = () => {
  const savedProfile = localStorage.getItem('careerProfileData');
  if (savedProfile) {
    try {
      const profile = JSON.parse(savedProfile) as ProfileData;
      return profile.name || "Creator";
    } catch (error) {
      console.error("Error parsing profile data:", error);
    }
  }
  return "Creator";
};

const LinkedInGenerator = () => {
  // State management
  const [achievement, setAchievement] = useState('');
  const [generatedPost, setGeneratedPost] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [tone, setTone] = useState('professional');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState('');
  const [useCareerData, setUseCareerData] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [userName, setUserName] = useState(getUserName());
  const [loadingMessage, setLoadingMessage] = useState('');

  const { toast } = useToast();
  const { askQuestion } = useGemini();
  
  // Loading messages rotation
  const loadingMessages = [
    "Crafting your narrative...",
    "Fueling creativity...",
    "Polishing your professional story...",
    "Weaving words together...",
    "Designing your digital impression...",
    "Exploring impactful expressions..."
  ];
  
  useEffect(() => {
    if (isGenerating) {
      const interval = setInterval(() => {
        setLoadingMessage(loadingMessages[Math.floor(Math.random() * loadingMessages.length)]);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [isGenerating]);
  
  // Load profile data from local storage
  useEffect(() => {
    const savedProfile = localStorage.getItem('careerProfileData');
    if (savedProfile) {
      try {
        const profile = JSON.parse(savedProfile) as ProfileData;
        setProfileData(profile);
        setUserName(profile.name || "Creator");
      } catch (error) {
        console.error("Error parsing profile data:", error);
      }
    }
  }, []);

  // File upload handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setResumeFile(file);
      toast({
        title: "Resume Uploaded",
        description: `${file.name} has been uploaded.`,
      });
      
      try {
        // Simulate text extraction for this demo
        setTimeout(() => {
          setResumeText(`Resume content extracted from ${file.name}`);
          toast({
            title: "Resume Processed",
            description: "Your resume has been processed successfully.",
          });
        }, 1000);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Processing Error",
          description: "Failed to process your resume. Please try again.",
        });
      }
    }
  };
  
  // Toggle using career profile data
  const toggleUseCareerData = () => {
    setUseCareerData(!useCareerData);
    if (!useCareerData && profileData) {
      // Prepopulate with some career data
      const skills = profileData.targetRoles?.join(", ") || "";
      const goals = profileData.goals || "";
      setAchievement(`Skills: ${skills}\nGoals: ${goals}`);
    }
  };
  
  // Main post generation function
  const handleGenerate = async () => {
    if (!achievement.trim() && !resumeText && !(useCareerData && profileData)) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please add some achievement information or upload a resume.",
      });
      return;
    }
    
    setIsGenerating(true);
    setGenerationProgress(10);
    setLoadingMessage(loadingMessages[Math.floor(Math.random() * loadingMessages.length)]);
    
    try {
      let contentToUse = achievement;
      
      if (resumeText) {
        contentToUse += `\n\nResume Highlights:\n${resumeText}`;
      }
      
      if (useCareerData && profileData) {
        const skills = profileData.targetRoles?.join(", ") || "";
        const goals = profileData.goals || "";
        const dreamJob = profileData.dreamJob || "";
        contentToUse += `\n\nCareer Profile:\nSkills: ${skills}\nGoals: ${goals}\nDream Job: ${dreamJob}`;
      }
      
      setGenerationProgress(30);
      
      const prompt = `Write an engaging LinkedIn post about these professional achievements and information: "${contentToUse}".
      
      Use a ${tone} tone. The post should:
      - Be 2-3 paragraphs maximum
      - Include relevant hashtags at the end
      - Be formatted in a way that's easy to read on LinkedIn
      - Use some appropriate emojis but don't overdo it
      - Sound authentic and conversational
      - End with a question or call-to-action to encourage engagement
      
      The post should be ready to copy and paste to LinkedIn without any additional editing needed.`;
      
      setGenerationProgress(50);
      const response = await askQuestion(prompt);
      
      setGenerationProgress(90);
      
      if (response.text) {
        setGeneratedPost(response.text);
        toast({
          title: "Post Generated!",
          description: "Your LinkedIn post is ready to use.",
        });
      } else if (response.error) {
        throw new Error(response.error);
      }
      
      setGenerationProgress(100);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: "Unable to generate post. Please try again.",
      });
      console.error(error);
    } finally {
      setIsGenerating(false);
      setTimeout(() => setGenerationProgress(0), 1000);
    }
  };
  
  // Clipboard functions
  const handleCopy = () => {
    navigator.clipboard.writeText(generatedPost);
    toast({
      title: "Copied!",
      description: "Post copied to clipboard.",
      action: (
        <div className="h-8 w-8 bg-white/10 rounded-full flex items-center justify-center">
          <Check className="h-4 w-4 text-green-500" />
        </div>
      ),
    });
  };
  
  // Edit mode functions
  const handleEdit = () => {
    setEditMode(true);
  };
  
  const handleSaveEdit = () => {
    setEditMode(false);
    toast({
      title: "Changes Saved",
      description: "Your edits have been saved.",
    });
  };
  
  return (
    <PageLayout title="NovaPost ✨" showFloatingOrbs={false}>
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          {/* Gradient Header */}
          <div className="mb-8 text-center">
            <h1 className="animated-gradient-text text-2xl md:text-3xl font-bold">
              Hello, {userName}, ready to inspire LinkedIn?
            </h1>
          </div>

          {/* Input Section */}
          <div className="glass-card p-6 md:p-8 mb-8 border border-white/10 hover:border-white/20 transition-all duration-300">
            <div className="space-y-6">
              {/* Tone Selection */}
              <div className="space-y-2">
                <Label htmlFor="tone" className="text-white/90 font-medium">Choose Post Style</Label>
                <Select value={tone} onValueChange={setTone}>
                  <SelectTrigger className="bg-white/5 border-white/20">
                    <SelectValue placeholder="Select tone" />
                  </SelectTrigger>
                  <SelectContent>
                    {TONE_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex flex-col">
                          <span>{option.label}</span>
                          <span className="text-xs text-muted-foreground">{option.description}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Achievement Input */}
              <div className="space-y-2">
                <Label htmlFor="achievement" className="text-white/90 font-medium">Describe Your Achievement</Label>
                <Textarea 
                  id="achievement" 
                  placeholder="e.g., Completed a machine learning certification, Got promoted to senior developer, Published a research paper..."
                  className="min-h-[120px] bg-white/5 border-white/20"
                  value={achievement}
                  onChange={(e) => setAchievement(e.target.value)}
                />
              </div>

              {/* Career Profile Toggle */}
              <div className="flex items-center space-x-2">
                <input
                  id="use-career-data"
                  type="checkbox"
                  className="h-4 w-4 cursor-pointer"
                  checked={useCareerData}
                  onChange={toggleUseCareerData}
                  disabled={!profileData}
                />
                <Label htmlFor="use-career-data" className="cursor-pointer">
                  Include my Career Profile data
                </Label>
                
                {!profileData && (
                  <span className="text-sm text-white/50 ml-2">
                    (Complete your career profile first)
                  </span>
                )}
              </div>
              
              {/* Resume Upload */}
              <div className="space-y-2">
                <Label className="text-white/90 font-medium">Upload Resume (Optional)</Label>
                <div className="flex items-center space-x-4">
                  <Label htmlFor="resume-upload" className="cursor-pointer flex items-center px-4 py-2 rounded-md bg-white/10 hover:bg-white/20 transition-colors">
                    <Upload className="mr-2 h-4 w-4" />
                    {resumeFile ? resumeFile.name : "Upload PDF or Doc"}
                    <Input 
                      id="resume-upload" 
                      type="file" 
                      accept=".pdf,.doc,.docx,.txt" 
                      className="hidden" 
                      onChange={handleFileUpload}
                    />
                  </Label>
                  
                  {resumeFile && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="glass-button"
                      onClick={() => {
                        setResumeFile(null);
                        setResumeText('');
                      }}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              </div>
              
              <div className="pt-2">
                <Button 
                  onClick={handleGenerate} 
                  disabled={isGenerating} 
                  className="cosmic-gradient text-white w-full sm:w-auto"
                >
                  {isGenerating ? (
                    <>
                      <Loader className="mr-2 h-4 w-4 animate-spin" />
                      {loadingMessage || "Generating..."}
                    </>
                  ) : (
                    <>✨ Generate Post</>
                  )}
                </Button>
                
                {isGenerating && (
                  <div className="mt-4">
                    <Progress value={generationProgress} className="h-1 bg-white/10" />
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Generated Post Preview */}
          {generatedPost && (
            <div className="glass-card p-6 md:p-8 border border-white/10 hover:border-white/20 transition-all duration-300">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl md:text-2xl font-bold cosmic-text">Your LinkedIn Post</h2>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="glass-button" onClick={handleCopy}>
                    <Copy className="h-4 w-4 mr-2" /> Copy
                  </Button>
                  {!editMode ? (
                    <Button variant="outline" size="sm" className="glass-button" onClick={handleEdit}>
                      <Pencil className="h-4 w-4 mr-2" /> Edit
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm" className="glass-button" onClick={handleSaveEdit}>
                      <Check className="h-4 w-4 mr-2" /> Save
                    </Button>
                  )}
                  <Button variant="outline" size="sm" className="glass-button" onClick={handleGenerate}>
                    <CircleEllipsis className="h-4 w-4 mr-2" /> Regenerate
                  </Button>
                </div>
              </div>
              
              <Card className="bg-black/20 border border-white/10 mb-6">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-novana-purple to-novana-pink mr-3"></div>
                    <div>
                      <p className="font-medium">{userName || "Your Name"}</p>
                      <p className="text-sm text-white/70">Your Professional Title • Just now</p>
                    </div>
                  </div>
                  
                  <div className="max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    {editMode ? (
                      <Textarea 
                        value={generatedPost} 
                        onChange={(e) => setGeneratedPost(e.target.value)}
                        className="min-h-[200px] bg-white/5 border-white/20 mb-4"
                      />
                    ) : (
                      <p className="whitespace-pre-line">{generatedPost}</p>
                    )}
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <div className="flex space-x-4">
                      <div className="text-white/70 text-sm flex items-center">
                        <ArrowUp className="h-4 w-4 mr-1" /> 
                        Like
                      </div>
                      <div className="text-white/70 text-sm flex items-center">
                        Comment
                      </div>
                      <div className="text-white/70 text-sm flex items-center">
                        Share
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-4">
                <Button 
                  className="cosmic-gradient text-white w-full sm:w-auto" 
                  onClick={handleCopy}
                >
                  <Copy className="mr-2 h-5 w-5" />
                  Copy to Clipboard
                </Button>
                
                <a 
                  href="https://linkedin.com/feed" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="glass-button px-4 py-2 rounded-md flex items-center justify-center w-full sm:w-auto"
                >
                  <Linkedin className="mr-2 h-5 w-5" /> 
                  Open LinkedIn →
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default LinkedInGenerator;
