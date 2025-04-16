
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import PageLayout from '@/components/layout/PageLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Calendar, CheckCircle2, Upload, FileText, ClipboardList, Send } from 'lucide-react';
import { askGemini } from '@/utils/geminiService';
import { Textarea } from '@/components/ui/textarea';

const ExamPrep = () => {
  const [selectedTab, setSelectedTab] = useState('syllabus');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progressValue, setProgressValue] = useState(0);
  const [syllabusName, setSyllabusName] = useState('');
  const [syllabusContent, setSyllabusContent] = useState('');
  const [analysisResult, setAnalysisResult] = useState('');
  const [followUpQuestion, setFollowUpQuestion] = useState('');
  const [isSendingFollowUp, setIsSendingFollowUp] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    try {
      setSyllabusName(file.name);
      
      // Read file content
      const content = await readFileContent(file);
      setSyllabusContent(content);
      
      toast({
        title: "File uploaded",
        description: `${file.name} has been uploaded successfully.`,
      });
      
      // Start analysis
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
      
      reader.onerror = () => {
        reject(new Error("Error reading file"));
      };
      
      if (file.type === "application/pdf") {
        // For PDFs, notify the user that text extraction might be limited
        toast({
          title: "PDF detected",
          description: "PDF analysis is limited to text content only.",
        });
        reader.readAsText(file);
      } else {
        // For text files, read as text
        reader.readAsText(file);
      }
    });
  };
  
  const analyzeWithGemini = async (content: string) => {
    setIsAnalyzing(true);
    setProgressValue(0);
    setAnalysisResult('');
    
    // Start progress animation
    const interval = setInterval(() => {
      setProgressValue(prev => {
        if (prev >= 95) {
          clearInterval(interval);
          return 95;
        }
        return prev + 5;
      });
    }, 200);
    
    try {
      // Create a prompt for Gemini to analyze the syllabus
      const prompt = `
      You are an expert academic advisor. Please analyze this course syllabus and provide:
      1. A summary of key topics and concepts
      2. A recommended study schedule based on topic complexity
      3. Potential exam questions based on the content
      4. Learning resources for each major topic
      
      Format your response in clear sections with headers. Here's the syllabus:
      
      ${content.slice(0, 15000)} // Limit content to avoid token limits
      `;
      
      // Call Gemini API
      const response = await askGemini(prompt);
      
      if (response.error) {
        toast({
          variant: "destructive",
          title: "Analysis failed",
          description: response.error,
        });
        
        setIsAnalyzing(false);
        setProgressValue(0);
        clearInterval(interval);
        return;
      }
      
      // Set analysis result
      setAnalysisResult(response.text);
      
      // Complete progress
      clearInterval(interval);
      setProgressValue(100);
      
      toast({
        title: "Analysis complete!",
        description: "Your syllabus has been analyzed by AI.",
      });
      
    } catch (error) {
      console.error("Error analyzing syllabus:", error);
      toast({
        variant: "destructive",
        title: "Analysis failed",
        description: "An error occurred while analyzing your syllabus.",
      });
    } finally {
      setIsAnalyzing(false);
      clearInterval(interval);
    }
  };
  
  const handleFollowUpQuestion = async () => {
    if (!followUpQuestion.trim() || !syllabusContent) return;
    
    setIsSendingFollowUp(true);
    
    try {
      const prompt = `
      Based on this syllabus content:
      ${syllabusContent.slice(0, 10000)}
      
      Please answer the following question in detail:
      ${followUpQuestion}
      `;
      
      const response = await askGemini(prompt);
      
      if (response.error) {
        toast({
          variant: "destructive",
          title: "Failed to answer question",
          description: response.error,
        });
      } else {
        // Append the follow-up Q&A to the existing analysis
        setAnalysisResult(prev => 
          `${prev}\n\n## Follow-up Question\n\n**Q: ${followUpQuestion}**\n\n**A: ${response.text}**`
        );
        
        // Clear the input
        setFollowUpQuestion('');
        
        toast({
          title: "Question answered",
          description: "Your follow-up question has been answered.",
        });
      }
    } catch (error) {
      console.error("Error sending follow-up question:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to process your question.",
      });
    } finally {
      setIsSendingFollowUp(false);
    }
  };

  return (
    <PageLayout title="Exam Preparation">
      <div className="container mx-auto px-4 py-12">
        <Tabs defaultValue="syllabus" onValueChange={setSelectedTab} className="w-full">
          <div className="flex justify-center mb-8">
            <TabsList className="glass-card p-1">
              <TabsTrigger value="syllabus" className="data-[state=active]:bg-white/20 px-6 py-3">
                <FileText className="mr-2 h-5 w-5" />
                Syllabus Analysis
              </TabsTrigger>
              <TabsTrigger value="questions" className="data-[state=active]:bg-white/20 px-6 py-3">
                <ClipboardList className="mr-2 h-5 w-5" />
                Predicted Questions
              </TabsTrigger>
              <TabsTrigger value="planner" className="data-[state=active]:bg-white/20 px-6 py-3">
                <Calendar className="mr-2 h-5 w-5" />
                Study Planner
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="syllabus" className="space-y-8">
            <div className="glass-card p-8">
              <h2 className="text-2xl font-bold mb-6 text-center">Upload Your Syllabus</h2>
              
              <div className="flex flex-col items-center space-y-6">
                <div 
                  className="glass-card p-8 border-dashed border-2 border-white/30 w-full max-w-lg flex flex-col items-center justify-center cursor-pointer hover:border-white/50 transition-all"
                  onClick={() => document.getElementById('syllabus-upload')?.click()}
                >
                  <Upload size={48} className="mb-4 text-white/70" />
                  
                  <p className="mb-2 text-xl font-medium">Drag and drop your file here</p>
                  <p className="text-sm text-white/70 mb-6">PDF, TXT or other text files</p>
                  
                  <Label htmlFor="syllabus-upload" className="cursor-pointer">
                    <Input 
                      id="syllabus-upload" 
                      type="file" 
                      className="hidden" 
                      accept=".pdf,.txt,.docx,.doc,.rtf,.md"
                      onChange={handleFileUpload}
                    />
                    <Button className="cosmic-gradient text-white">Browse files</Button>
                  </Label>
                </div>
                
                {syllabusName && (
                  <div className="w-full max-w-lg">
                    <p className="text-white mb-2 flex items-center">
                      <CheckCircle2 className="mr-2 h-5 w-5 text-green-500" />
                      {syllabusName}
                    </p>
                    
                    {isAnalyzing ? (
                      <div className="space-y-2">
                        <p className="text-white/70">Analyzing syllabus with Gemini AI...</p>
                        <Progress value={progressValue} className="h-2" />
                      </div>
                    ) : progressValue === 100 ? (
                      <div className="mt-6 space-y-4">
                        <h3 className="text-xl font-semibold mb-4">AI Analysis Results</h3>
                        <div className="bg-black/30 backdrop-blur-sm rounded-lg p-6 whitespace-pre-wrap overflow-auto max-h-[500px]">
                          {analysisResult}
                        </div>
                        
                        {/* Follow-up question section */}
                        <div className="mt-4">
                          <h4 className="text-lg font-medium mb-2">Ask a follow-up question</h4>
                          <div className="flex gap-2">
                            <Textarea
                              placeholder="Ask anything about this syllabus..."
                              value={followUpQuestion}
                              onChange={(e) => setFollowUpQuestion(e.target.value)}
                              className="flex-grow"
                              disabled={isSendingFollowUp}
                            />
                            <Button 
                              onClick={handleFollowUpQuestion} 
                              disabled={!followUpQuestion.trim() || isSendingFollowUp}
                              className="cosmic-gradient"
                            >
                              {isSendingFollowUp ? "Sending..." : <Send className="h-4 w-4" />}
                            </Button>
                          </div>
                        </div>
                      </div>
                    ) : null}
                  </div>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="feature-card">
                <h3 className="text-xl font-semibold mb-3">Intelligent Analysis</h3>
                <p className="text-white/70 mb-4">Our AI processes your syllabus and identifies key topics and concepts.</p>
              </div>
              
              <div className="feature-card">
                <h3 className="text-xl font-semibold mb-3">Personalized Plan</h3>
                <p className="text-white/70 mb-4">Get a study plan tailored to your strengths, weaknesses, and schedule.</p>
              </div>
              
              <div className="feature-card">
                <h3 className="text-xl font-semibold mb-3">Progress Tracking</h3>
                <p className="text-white/70 mb-4">Monitor your progress as you complete each topic and concept.</p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="questions" className="space-y-8">
            <div className="glass-card p-8">
              <h2 className="text-2xl font-bold mb-6 text-center">Upload Previous Year Questions</h2>
              
              <div className="flex flex-col items-center space-y-6">
                <div className="glass-card p-8 border-dashed border-2 border-white/30 w-full max-w-lg flex flex-col items-center justify-center cursor-pointer hover:border-white/50 transition-all">
                  <Upload size={48} className="mb-4 text-white/70" />
                  
                  <p className="mb-2 text-xl font-medium">Upload PYQs</p>
                  <p className="text-sm text-white/70 mb-6">Upload PDFs or images of previous year questions</p>
                  
                  <Label htmlFor="pyq-upload" className="cursor-pointer">
                    <Input 
                      id="pyq-upload" 
                      type="file" 
                      className="hidden" 
                      accept=".pdf,.jpg,.jpeg,.png"
                    />
                    <Button className="cosmic-gradient text-white">Browse files</Button>
                  </Label>
                </div>
              </div>
              
              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4">High-Probability Questions</h3>
                <div className="space-y-4">
                  {['What are the key principles of Object-Oriented Programming?', 
                    'Explain the differences between process and thread.', 
                    'Describe the working of TCP/IP protocol.'].map((question, index) => (
                    <div key={index} className="glass-card p-4">
                      <p className="text-white">{question}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="planner" className="space-y-8">
            <div className="glass-card p-8">
              <h2 className="text-2xl font-bold mb-6">Your Study Schedule</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
                {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day, index) => (
                  <div key={index} className="glass-card p-4">
                    <h3 className="font-medium mb-2">{day}</h3>
                    <div className="space-y-2">
                      <p className="text-sm text-white/70">9:00 AM - 11:00 AM</p>
                      <p className="text-sm">Data Structures</p>
                      
                      <p className="text-sm text-white/70 mt-4">1:00 PM - 3:00 PM</p>
                      <p className="text-sm">Algorithms</p>
                      
                      <p className="text-sm text-white/70 mt-4">4:00 PM - 6:00 PM</p>
                      <p className="text-sm">System Design</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 text-center">
                <Button className="cosmic-gradient text-white px-8 py-2">
                  Adjust Schedule
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default ExamPrep;
