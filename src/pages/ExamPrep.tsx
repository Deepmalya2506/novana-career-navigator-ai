import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import PageLayout from '@/components/layout/PageLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Calendar, CheckCircle2, Upload, FileText, ClipboardList, Send, Predict } from 'lucide-react';
import { useGemini } from '@/hooks/useGemini';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';

const ExamPrep = () => {
  const [selectedTab, setSelectedTab] = useState('syllabus');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progressValue, setProgressValue] = useState(0);
  const [syllabusName, setSyllabusName] = useState('');
  const [syllabusContent, setSyllabusContent] = useState('');
  const [analysisResult, setAnalysisResult] = useState('');
  const [previousQuestions, setPreviousQuestions] = useState('');
  const [predictedQuestions, setPredictedQuestions] = useState('');
  const [isPredicting, setIsPredicting] = useState(false);
  const [topics, setTopics] = useState<string[]>([]);
  const [currentTopicIndex, setCurrentTopicIndex] = useState(0);
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
      
      await analyzeWithGemini(content);
    } catch (error) {
      console.error("Error handling file upload:", error);
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: "There was a problem processing your file.",
      });
    }
  };

  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const result = e.target?.result;
        if (typeof result === 'string') {
          resolve(result);
        } else {
          reject(new Error("Failed to read file as text"));
        }
      };
      
      reader.onerror = () => reject(new Error("Error reading file"));
      reader.readAsText(file);
    });
  };

  const analyzeWithGemini = async (content: string) => {
    setIsAnalyzing(true);
    setProgressValue(0);
    setAnalysisResult('');
    
    const interval = setInterval(() => {
      setProgressValue(prev => Math.min(prev + 5, 95));
    }, 200);
    
    try {
      const prompt = `
      You are an expert academic advisor. Please analyze this course content and provide:
      1. A detailed breakdown of main topics (one per line, prefixed with TOPIC:)
      2. For each topic, provide a comprehensive explanation suitable for teaching
      
      First list all topics, then provide the explanations.
      Here's the content to analyze:
      
      ${content.slice(0, 15000)}
      `;
      
      const response = await askQuestion(prompt);
      
      if (response.error) {
        throw new Error(response.error);
      }

      const lines = response.text.split('\n');
      const extractedTopics = lines
        .filter(line => line.trim().startsWith('TOPIC:'))
        .map(line => line.replace('TOPIC:', '').trim());
      
      setTopics(extractedTopics);
      setAnalysisResult(response.text);
      setCurrentTopicIndex(0);
      
      clearInterval(interval);
      setProgressValue(100);
      
      toast({
        title: "Analysis complete!",
        description: `Found ${extractedTopics.length} topics to study.`,
      });
      
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
    }
  };

  const handlePreviousQuestionsUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    try {
      const content = await readFileContent(file);
      setPreviousQuestions(content);
      
      toast({
        title: "Questions uploaded",
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

  const predictQuestions = async () => {
    if (!previousQuestions) {
      toast({
        variant: "destructive",
        title: "No questions uploaded",
        description: "Please upload previous year questions first.",
      });
      return;
    }

    setIsPredicting(true);
    setPredictedQuestions('');
    setProgressValue(0);

    const interval = setInterval(() => {
      setProgressValue(prev => Math.min(prev + 5, 95));
    }, 200);

    try {
      const prompt = `
      As an expert exam analyzer, analyze these previous year questions and predict the most likely questions for the upcoming exam. Consider:
      1. Identify patterns in question types and topics
      2. Analyze frequency of topics
      3. Predict 5-7 most likely questions with brief explanations
      
      Previous questions:
      ${previousQuestions}
      `;

      const response = await askQuestion(prompt);
      
      if (response.error) {
        throw new Error(response.error);
      }

      setPredictedQuestions(response.text);
      
      clearInterval(interval);
      setProgressValue(100);
      
      toast({
        title: "Prediction complete!",
        description: "Check out the predicted questions below.",
      });
      
    } catch (error) {
      console.error("Error predicting questions:", error);
      toast({
        variant: "destructive",
        title: "Prediction failed",
        description: error instanceof Error ? error.message : "An error occurred during prediction",
      });
    } finally {
      setIsPredicting(false);
      clearInterval(interval);
    }
  };

  const handleNextTopic = () => {
    if (currentTopicIndex < topics.length - 1) {
      setCurrentTopicIndex(prev => prev + 1);
    }
  };

  const handlePrevTopic = () => {
    if (currentTopicIndex > 0) {
      setCurrentTopicIndex(prev => prev - 1);
    }
  };

  const getCurrentTopicContent = () => {
    if (!analysisResult || topics.length === 0) return '';
    const currentTopic = topics[currentTopicIndex];
    const lines = analysisResult.split('\n');
    const topicIndex = lines.findIndex(line => 
      line.trim().replace('TOPIC:', '').trim() === currentTopic
    );
    
    if (topicIndex === -1) return '';
    
    let content = [];
    for (let i = topicIndex + 1; i < lines.length; i++) {
      if (lines[i].trim().startsWith('TOPIC:')) break;
      if (lines[i].trim()) content.push(lines[i]);
    }
    
    return content.join('\n');
  };

  return (
    <PageLayout title="Exam Preparation">
      <div className="container mx-auto px-4 py-12">
        <Tabs defaultValue="syllabus" onValueChange={setSelectedTab} className="w-full">
          <div className="flex justify-center mb-8">
            <TabsList className="glass-card p-1">
              <TabsTrigger value="syllabus" className="data-[state=active]:bg-white/20 px-6 py-3">
                <FileText className="mr-2 h-5 w-5" />
                Upload & Analyze
              </TabsTrigger>
              <TabsTrigger value="learn" className="data-[state=active]:bg-white/20 px-6 py-3">
                <ClipboardList className="mr-2 h-5 w-5" />
                Learn Topics
              </TabsTrigger>
              <TabsTrigger value="predict" className="data-[state=active]:bg-white/20 px-6 py-3">
                <Predict className="mr-2 h-5 w-5" />
                Predict Questions
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="syllabus">
            <div className="glass-card p-8 max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold mb-6 text-center">Upload Your Study Material</h2>
              
              <div className="flex flex-col items-center space-y-6">
                <div 
                  className="glass-card p-8 border-dashed border-2 border-white/30 w-full cursor-pointer hover:border-white/50 transition-all"
                  onClick={() => document.getElementById('syllabus-upload')?.click()}
                >
                  <Upload size={48} className="mx-auto mb-4 text-white/70" />
                  <p className="text-center mb-2 text-xl font-medium">Upload your study material</p>
                  <p className="text-center text-sm text-white/70 mb-6">PDF, TXT or other text files</p>
                  
                  <div className="text-center">
                    <Label htmlFor="syllabus-upload" className="cursor-pointer">
                      <Input 
                        id="syllabus-upload" 
                        type="file" 
                        className="hidden" 
                        accept=".pdf,.txt,.docx,.doc"
                        onChange={handleFileUpload}
                      />
                      <Button className="cosmic-gradient text-white">Select File</Button>
                    </Label>
                  </div>
                </div>
                
                {syllabusName && (
                  <div className="w-full">
                    <p className="text-white mb-2 flex items-center">
                      <CheckCircle2 className="mr-2 h-5 w-5 text-green-500" />
                      {syllabusName}
                    </p>
                    
                    {isAnalyzing && (
                      <div className="space-y-2">
                        <p className="text-white/70">Analyzing content with AI...</p>
                        <Progress value={progressValue} className="h-2" />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="learn">
            {topics.length > 0 ? (
              <div className="max-w-3xl mx-auto space-y-6">
                <Card className="glass-card">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <Button 
                        onClick={handlePrevTopic}
                        disabled={currentTopicIndex === 0}
                        variant="outline"
                      >
                        Previous
                      </Button>
                      <span className="text-lg font-medium">
                        Topic {currentTopicIndex + 1} of {topics.length}
                      </span>
                      <Button 
                        onClick={handleNextTopic}
                        disabled={currentTopicIndex === topics.length - 1}
                        variant="outline"
                      >
                        Next
                      </Button>
                    </div>
                    
                    <h3 className="text-xl font-bold mb-4">{topics[currentTopicIndex]}</h3>
                    <div className="prose prose-invert max-w-none">
                      {getCurrentTopicContent()}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-lg text-white/70">
                  Upload your study material in the "Upload & Analyze" tab to start learning
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="predict">
            <div className="glass-card p-8 max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold mb-6 text-center">Question Predictor</h2>
              
              <div className="flex flex-col items-center space-y-6">
                <div 
                  className="glass-card p-8 border-dashed border-2 border-white/30 w-full cursor-pointer hover:border-white/50 transition-all"
                  onClick={() => document.getElementById('questions-upload')?.click()}
                >
                  <Upload size={48} className="mx-auto mb-4 text-white/70" />
                  <p className="text-center mb-2 text-xl font-medium">Upload previous year questions</p>
                  <p className="text-center text-sm text-white/70 mb-6">TXT or PDF files</p>
                  
                  <div className="text-center">
                    <Label htmlFor="questions-upload" className="cursor-pointer">
                      <Input 
                        id="questions-upload" 
                        type="file" 
                        className="hidden" 
                        accept=".txt,.pdf"
                        onChange={handlePreviousQuestionsUpload}
                      />
                      <Button className="cosmic-gradient text-white">Select File</Button>
                    </Label>
                  </div>
                </div>

                {previousQuestions && (
                  <div className="w-full space-y-4">
                    <Button 
                      onClick={predictQuestions} 
                      className="w-full cosmic-gradient"
                      disabled={isPredicting}
                    >
                      {isPredicting ? 'Analyzing...' : 'Predict Questions'}
                    </Button>

                    {isPredicting && (
                      <div className="space-y-2">
                        <p className="text-white/70">Analyzing question patterns...</p>
                        <Progress value={progressValue} className="h-2" />
                      </div>
                    )}

                    {predictedQuestions && (
                      <Card className="mt-6">
                        <CardContent className="p-6">
                          <h3 className="text-xl font-bold mb-4">Predicted Questions</h3>
                          <div className="prose prose-invert max-w-none whitespace-pre-wrap">
                            {predictedQuestions}
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default ExamPrep;
