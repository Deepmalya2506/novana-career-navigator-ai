
import { useState } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Linkedin, Copy, Upload, MessageSquarePlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useGemini } from '@/utils/geminiService';

const LinkedInGenerator = () => {
  const [achievement, setAchievement] = useState('');
  const [generatedPost, setGeneratedPost] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  const { askQuestion } = useGemini();
  
  const handleGenerate = async () => {
    if (!achievement.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please describe your achievement first.",
      });
      return;
    }
    
    setIsGenerating(true);
    
    try {
      const prompt = `Write an engaging LinkedIn post about this achievement: "${achievement}". 
      The post should be professional, include relevant hashtags, and be no longer than 3 paragraphs. 
      Make it sound enthusiastic but not over the top.`;
      
      const response = await askQuestion(prompt);
      
      if (response) {
        setGeneratedPost(response);
        toast({
          title: "Post Generated!",
          description: "Your LinkedIn post is ready to use.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: "Unable to generate post. Please try again.",
      });
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleCopy = () => {
    navigator.clipboard.writeText(generatedPost);
    toast({
      title: "Copied!",
      description: "Post copied to clipboard.",
    });
  };
  
  const handleShare = () => {
    // Simulating sharing to LinkedIn
    toast({
      title: "LinkedIn Integration Required",
      description: "Connect your LinkedIn account to share directly.",
    });
  };
  
  return (
    <PageLayout title="LinkedIn Post Generator">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="glass-card p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6">Describe Your Achievement</h2>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="achievement">What have you accomplished?</Label>
                <Textarea 
                  id="achievement" 
                  placeholder="e.g., Completed a machine learning certification, Got promoted to senior developer, Published my first research paper..."
                  className="min-h-[120px] bg-white/5 border-white/20"
                  value={achievement}
                  onChange={(e) => setAchievement(e.target.value)}
                />
              </div>
              
              <div className="flex items-center space-x-4">
                <Label htmlFor="achievement-image" className="cursor-pointer flex items-center px-4 py-2 rounded-md bg-white/10 hover:bg-white/20 transition-colors">
                  <Upload className="mr-2 h-4 w-4" />
                  Add Image
                  <Input id="achievement-image" type="file" className="hidden" />
                </Label>
                
                <Button 
                  onClick={handleGenerate} 
                  disabled={isGenerating} 
                  className="cosmic-gradient text-white"
                >
                  {isGenerating ? "Generating..." : "Generate LinkedIn Post"}
                </Button>
              </div>
            </div>
          </div>
          
          {generatedPost && (
            <div className="glass-card p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Your LinkedIn Post</h2>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="glass-button" onClick={handleCopy}>
                    <Copy className="h-4 w-4 mr-2" /> Copy
                  </Button>
                  <Button variant="outline" size="sm" className="glass-button" onClick={() => setGeneratedPost("")}>
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
                
                <p className="whitespace-pre-line">{generatedPost}</p>
              </div>
              
              <div className="text-center">
                <Button className="cosmic-gradient text-white px-8" onClick={handleShare}>
                  <Linkedin className="mr-2 h-5 w-5" />
                  Share to LinkedIn
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
