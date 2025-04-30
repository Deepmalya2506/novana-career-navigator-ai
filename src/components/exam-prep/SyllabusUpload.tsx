
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Upload, CheckCircle2, Send, FileText, Type } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGemini } from '@/hooks/useGemini';
import { readFileContent } from '@/utils/fileHandlers';

interface SyllabusUploadProps {
  onAnalysisComplete: (result: string, topics: string[]) => void;
}

const SyllabusUpload: React.FC<SyllabusUploadProps> = ({ onAnalysisComplete }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progressValue, setProgressValue] = useState(0);
  const [syllabusName, setSyllabusName] = useState('');
  const [syllabusContent, setSyllabusContent] = useState('');
  const [question, setQuestion] = useState('');
  const [inputMethod, setInputMethod] = useState<'file' | 'text'>('file');
  const { toast } = useToast();
  const { askQuestion } = useGemini();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    try {
      setSyllabusName(file.name);
      
      const content = await readFileContent(file);
      setSyllabusContent(content);
      
      toast({
        title: "File uploaded",
        description: `${file.name} has been uploaded successfully.`,
      });
    } catch (error) {
      console.error("Error handling file upload:", error);
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: "There was a problem processing your file.",
      });
    }
  };

  const analyzeContent = async () => {
    let contentToAnalyze = '';
    
    if (inputMethod === 'file') {
      if (!syllabusContent) {
        toast({
          variant: "destructive",
          title: "No content",
          description: "Please upload a file first.",
        });
        return;
      }
      contentToAnalyze = syllabusContent;
    } else {
      if (!question.trim()) {
        toast({
          variant: "destructive",
          title: "No question",
          description: "Please enter a question or topic to analyze.",
        });
        return;
      }
      contentToAnalyze = question;
    }
    
    setIsAnalyzing(true);
    setProgressValue(0);
    
    const interval = setInterval(() => {
      setProgressValue(prev => Math.min(prev + 5, 95));
    }, 200);
    
    try {
      const promptPrefix = inputMethod === 'file' 
        ? "Act as an expert educational content creator and academic tutor. Analyze the following study material and create a comprehensive, well-structured learning guide."
        : "Act as an expert educational content creator and academic tutor. Based on the following question or topic, create a comprehensive, well-structured learning guide.";
      
      const prompt = `
      ${promptPrefix}

      Your analysis MUST follow this exact format for EACH topic:

      First, list all main topics with "TOPIC:" prefix. Each topic should be clearly separated.

      Then, for each topic, provide:

      [TOPIC_NAME]
      ================
      
      CORE CONCEPTS:
      - Detailed explanation of fundamental principles
      - Key definitions and terminology
      - Important relationships and dependencies
      
      DETAILED EXPLANATION:
      - In-depth breakdown of the topic
      - Step-by-step concept development
      - Real-world applications and significance
      
      EXAMPLES:
      1. Basic example with detailed explanation
      2. Intermediate example showing concept application
      3. Advanced example demonstrating mastery
      
      SOLVED PROBLEMS:
      Problem 1:
      [Problem statement]
      Solution:
      [Step-by-step solution with explanations]
      
      Problem 2:
      [Different type of problem]
      Solution:
      [Detailed solution steps]
      
      Problem 3:
      [Complex application]
      Solution:
      [Comprehensive solution]
      
      PRACTICE EXERCISES:
      1. [Exercise with solution outline]
      2. [Exercise with key points]
      3. [Challenge exercise]
      
      KEY TAKEAWAYS:
      - Main points to remember
      - Common pitfalls to avoid
      - Exam tips and tricks

      =================

      Make each section extremely thorough and include clear explanations. For mathematical topics, include formulas and their applications. For theoretical topics, include diagrams or flowcharts in text form.
      
      IMPORTANT: Make sure to include 3 solved examples for EACH topic with detailed step-by-step solutions that a student can follow. Each example should increase in difficulty level.

      ${inputMethod === 'file' ? 'Study material to analyze:' : 'Question/Topic to analyze:'}
      ${contentToAnalyze}
      `;
      
      const response = await askQuestion(prompt);
      
      if (response.error) {
        throw new Error(response.error);
      }

      const lines = response.text.split('\n');
      const extractedTopics = lines
        .filter(line => line.trim().startsWith('TOPIC:'))
        .map(line => line.replace('TOPIC:', '').trim());
      
      clearInterval(interval);
      setProgressValue(100);
      
      toast({
        title: "Analysis complete!",
        description: `Successfully analyzed ${extractedTopics.length} topics with detailed examples and solutions.`,
      });
      
      onAnalysisComplete(response.text, extractedTopics);
      
    } catch (error) {
      console.error("Error analyzing content:", error);
      toast({
        variant: "destructive",
        title: "Analysis failed",
        description: error instanceof Error ? error.message : "An error occurred during analysis",
      });
    } finally {
      setIsAnalyzing(false);
      clearInterval(interval);
      setProgressValue(100);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Tabs 
        defaultValue="file" 
        value={inputMethod} 
        onValueChange={(value) => setInputMethod(value as 'file' | 'text')}
      >
        <div className="flex justify-center mb-6">
          <TabsList className="glass-card">
            <TabsTrigger value="file" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Upload File
            </TabsTrigger>
            <TabsTrigger value="text" className="flex items-center gap-2">
              <Type className="h-4 w-4" />
              Ask Question
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="file">
          <Card className="glass-card">
            <CardContent className="p-6">
              <div 
                className="border-dashed border-2 border-white/30 p-8 rounded-lg cursor-pointer hover:border-white/50 transition-all text-center"
                onClick={() => document.getElementById('syllabus-upload')?.click()}
              >
                <Upload size={48} className="mx-auto mb-4 text-white/70" />
                <p className="mb-2 text-xl font-medium">Upload your study material</p>
                <p className="text-sm text-white/70 mb-6">PDF, TXT or other text files</p>
                
                <Label htmlFor="syllabus-upload" className="cursor-pointer">
                  <Input 
                    id="syllabus-upload" 
                    type="file" 
                    className="hidden" 
                    accept=".pdf,.txt,.docx,.doc,.jpg,.jpeg,.png"
                    onChange={handleFileUpload}
                  />
                  <Button className="cosmic-gradient text-white">Select File</Button>
                </Label>
              </div>
              
              {syllabusName && (
                <div className="mt-4">
                  <p className="text-white mb-2 flex items-center">
                    <CheckCircle2 className="mr-2 h-5 w-5 text-green-500" />
                    {syllabusName}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="text">
          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="space-y-4">
                <Label htmlFor="question-input">Enter your question or topic</Label>
                <Textarea 
                  id="question-input"
                  placeholder="E.g., Explain quantum computing principles, or What are the key concepts of neural networks?"
                  className="min-h-[150px]"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="mt-6">
        <Button 
          onClick={analyzeContent}
          className="w-full cosmic-gradient"
          disabled={isAnalyzing || (inputMethod === 'file' ? !syllabusContent : !question)}
        >
          {isAnalyzing ? 'Analyzing...' : 'Generate Study Guide'}
          {!isAnalyzing && <Send className="ml-2 h-4 w-4" />}
        </Button>
        
        {isAnalyzing && (
          <div className="space-y-2 mt-4">
            <p className="text-white/70">Analyzing content with AI...</p>
            <Progress value={progressValue} className="h-2" />
          </div>
        )}
      </div>
    </div>
  );
};

export default SyllabusUpload;
