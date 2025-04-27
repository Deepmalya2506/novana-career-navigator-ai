import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import PageLayout from '@/components/layout/PageLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Calendar, CheckCircle2, Upload, FileText, ClipboardList, ArrowRight, Send } from 'lucide-react';
import { useGemini } from '@/hooks/useGemini';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { readFileContent } from '@/utils/fileHandlers';

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

  const analyzeWithGemini = async (content: string) => {
    setIsAnalyzing(true);
    setProgressValue(0);
    setAnalysisResult('');
    
    const interval = setInterval(() => {
      setProgressValue(prev => Math.min(prev + 5, 95));
    }, 200);
    
    try {
      const prompt = `
      Act as an expert educational content creator and tutor. Analyze the following study material and create a comprehensive, well-structured learning guide. Follow this exact format for EACH topic:

      First, list all main topics with "TOPIC:" prefix.

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

      Make sure each section is thorough and includes clear explanations. For mathematical topics, include formulas and their applications. For theoretical topics, include diagrams or flowcharts in text form.

      Study material to analyze:
      ${content}
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
        description: `Successfully analyzed ${extractedTopics.length} topics with detailed examples and solutions.`,
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
      setProgressValue(100);
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
      As an expert exam analyzer and question predictor, analyze these previous year questions carefully. Consider:

      1. Pattern Analysis:
         - Identify recurring question types
         - Note the frequency of topics
         - Analyze marking schemes and question formats
         - Detect any trends in difficulty levels

      2. Based on your analysis, predict:
         - 7-10 most likely questions for the upcoming exam
         - Explanation of why each question is likely to appear
         - Recommended approach to answer each question
         - Important points to include in answers

      Structure your response clearly with sections for Pattern Analysis and Predicted Questions.
      
      Previous year questions:
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
        description: "Question predictions are ready with detailed explanations.",
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
    
    // Find the index of the current topic
    const topicIndex = lines.findIndex(line => 
      line.trim().replace('TOPIC:', '').trim() === currentTopic
    );
    
    if (topicIndex === -1) return '';
    
    // Find the index of the next topic (if any)
    const nextTopicIndex = lines.findIndex((line, index) => 
      index > topicIndex && line.trim().startsWith('TOPIC:')
    );
    
    // Extract content between current topic and next topic (or end of text)
    const endIndex = nextTopicIndex !== -1 ? nextTopicIndex : lines.length;
    const topicContent = lines.slice(topicIndex + 1, endIndex)
      .filter(line => line.trim() !== '')
      .join('\n');
    
    return topicContent;
  };

  const formatTopicContent = (content: string) => {
    if (!content) return '';

    // Split content by sections
    const sections = [
      { title: "EXPLANATION", content: extractSection(content, "EXPLANATION", "KEY CONCEPTS") },
      { title: "KEY CONCEPTS", content: extractSection(content, "KEY CONCEPTS", "FORMULAS/PRINCIPLES") },
      { title: "FORMULAS/PRINCIPLES", content: extractSection(content, "FORMULAS/PRINCIPLES", "SOLVED EXAMPLES") },
      { title: "SOLVED EXAMPLES", content: extractSection(content, "SOLVED EXAMPLES", "PRACTICE EXERCISES") },
      { title: "PRACTICE EXERCISES", content: extractSection(content, "PRACTICE EXERCISES", "EXAM QUESTIONS") },
      { title: "EXAM QUESTIONS", content: extractSection(content, "EXAM QUESTIONS", "STUDY TIPS") },
      { title: "STUDY TIPS", content: extractSection(content, "STUDY TIPS", null) }
    ];

    // Format content with proper styling
    return (
      <div className="space-y-6">
        {sections.map((section, index) => (
          section.content && (
            <div key={index} className="mt-6">
              <h3 className="text-xl font-bold mb-3">{section.title}</h3>
              <div className="whitespace-pre-wrap">{section.content}</div>
            </div>
          )
        ))}
      </div>
    );
  };

  const extractSection = (content: string, sectionName: string, nextSectionName: string | null) => {
    // Find the section
    const sectionStart = content.indexOf(sectionName + ":");
    if (sectionStart === -1) return '';
    
    let sectionEnd;
    if (nextSectionName) {
      sectionEnd = content.indexOf(nextSectionName + ":", sectionStart);
      if (sectionEnd === -1) sectionEnd = content.length;
    } else {
      sectionEnd = content.length;
    }
    
    // Extract and format the section content
    return content.substring(sectionStart + sectionName.length + 1, sectionEnd).trim();
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
                <ArrowRight className="mr-2 h-5 w-5" />
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
                    <div className="prose prose-invert max-w-none overflow-auto max-h-[70vh]">
                      {formatTopicContent(getCurrentTopicContent())}
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
