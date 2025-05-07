
import { useState, useEffect } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Copy, 
  Upload, 
  MessageSquarePlus, 
  RefreshCw, 
  Settings, 
  FileText,
  Check
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';
import { useGemini, uploadResume, extractResumeText } from '@/utils/geminiService';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProfileData } from '@/components/career/ProfileCustomization';

const TONE_OPTIONS = [
  { value: "professional", label: "Professional", description: "Formal and business-oriented" },
  { value: "inspirational", label: "Inspirational", description: "Motivational and uplifting" },
  { value: "casual", label: "Casual", description: "Friendly and conversational" },
  { value: "technical", label: "Technical", description: "Detailed and technical" },
];

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

  const { toast } = useToast();
  const { askQuestion } = useGemini();
  
  // Load profile data from local storage
  useEffect(() => {
    const savedProfile = localStorage.getItem('careerProfileData');
    if (savedProfile) {
      try {
        const profile = JSON.parse(savedProfile) as ProfileData;
        setProfileData(profile);
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
        const text = await extractResumeText(file);
        setResumeText(text);
        toast({
          title: "Resume Processed",
          description: "Your resume has been processed successfully.",
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Processing Error",
          description: "Failed to process your resume. Please try again.",
        });
      }
    }
  };
  
  const toggleUseCareerData = () => {
    setUseCareerData(!useCareerData);
    if (!useCareerData && profileData) {
      // Prepopulate with some career data
      const skills = profileData.targetRoles?.join(", ") || "";
      const goals = profileData.goals || "";
      setAchievement(`Skills: ${skills}\nGoals: ${goals}`);
    }
  };
  
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
    
    try {
      let contentToUse = achievement;
      
      if (resumeText) {
        contentToUse += `\n\nResume Highlights:\n${resumeText.substring(0, 500)}...`;
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
  
  const handleRegenerate = () => {
    handleGenerate();
  };
  
  return (
    <PageLayout title="LinkedIn Post Generator">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">

          {/* Input Section */}
          <div className="glass-card p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6">Create Your LinkedIn Post</h2>
            
            <div className="space-y-6">
              {/* Tone Selection */}
              <div className="space-y-2">
                <Label htmlFor="tone">Select Post Tone</Label>
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
                <Label htmlFor="achievement">Describe Your Achievements or Milestones</Label>
                <Textarea 
                  id="achievement" 
                  placeholder="e.g., Completed a machine learning certification, Got promoted to senior developer, Published my first research paper..."
                  className="min-h-[120px] bg-white/5 border-white/20"
                  value={achievement}
                  onChange={(e) => setAchievement(e.target.value)}
                />
              </div>

              {/* Career Profile Toggle */}
              <div className="flex items-center space-x-2">
                <Label htmlFor="use-career-data" className="flex items-center space-x-2 cursor-pointer">
                  <input
                    id="use-career-data"
                    type="checkbox"
                    className="h-4 w-4"
                    checked={useCareerData}
                    onChange={toggleUseCareerData}
                    disabled={!profileData}
                  />
                  <span>Include Career Profile Data</span>
                </Label>
                
                {!profileData && (
                  <span className="text-sm text-white/50">
                    (Complete your career profile first)
                  </span>
                )}
              </div>
              
              {/* Resume Upload */}
              <div className="space-y-2">
                <Label htmlFor="resume-upload">Upload Resume (Optional)</Label>
                <div className="flex items-center space-x-4">
                  <Label htmlFor="resume-upload" className="cursor-pointer flex items-center px-4 py-2 rounded-md bg-white/10 hover:bg-white/20 transition-colors">
                    <Upload className="mr-2 h-4 w-4" />
                    {resumeFile ? resumeFile.name : "Upload PDF"}
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
                {resumeText && (
                  <div className="mt-2">
                    <span className="text-sm text-white/70">
                      <FileText className="inline mr-1 h-3 w-3" /> Resume processed successfully
                    </span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center space-x-4">
                <Button 
                  onClick={handleGenerate} 
                  disabled={isGenerating} 
                  className="cosmic-gradient text-white"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>Generate LinkedIn Post</>
                  )}
                </Button>
              </div>
              
              {isGenerating && (
                <Progress value={generationProgress} className="h-1 bg-white/10" />
              )}
            </div>
          </div>
          
          {/* Generated Post Preview */}
          {generatedPost && (
            <div className="glass-card p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Your LinkedIn Post</h2>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="glass-button" onClick={handleCopy}>
                    <Copy className="h-4 w-4 mr-2" /> Copy
                  </Button>
                  {!editMode ? (
                    <Button variant="outline" size="sm" className="glass-button" onClick={handleEdit}>
                      <Settings className="h-4 w-4 mr-2" /> Edit
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm" className="glass-button" onClick={handleSaveEdit}>
                      <Check className="h-4 w-4 mr-2" /> Save
                    </Button>
                  )}
                  <Button variant="outline" size="sm" className="glass-button" onClick={handleRegenerate}>
                    <MessageSquarePlus className="h-4 w-4 mr-2" /> Regenerate
                  </Button>
                </div>
              </div>
              
              <div className="glass-card p-6 mb-6 border border-white/20">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-white/20 mr-3"></div>
                  <div>
                    <p className="font-medium">Your Name</p>
                    <p className="text-sm text-white/70">Your Title • Just now</p>
                  </div>
                </div>
                
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
              
              <div className="text-center">
                <Button 
                  className="cosmic-gradient text-white px-8" 
                  onClick={handleCopy}
                >
                  <Copy className="mr-2 h-5 w-5" />
                  Copy to Clipboard
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default LinkedInGenerator;
