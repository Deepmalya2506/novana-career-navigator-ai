
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import PageLayout from '@/components/layout/PageLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Calendar, CheckCircle2, Upload, FileText, ClipboardList } from 'lucide-react';

const ExamPrep = () => {
  const [selectedTab, setSelectedTab] = useState('syllabus');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progressValue, setProgressValue] = useState(0);
  const [syllabusName, setSyllabusName] = useState('');
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSyllabusName(file.name);
      toast({
        title: "File uploaded",
        description: `${file.name} has been uploaded successfully.`,
      });
      simulateAnalysis();
    }
  };

  const simulateAnalysis = () => {
    setIsAnalyzing(true);
    setProgressValue(0);
    
    const interval = setInterval(() => {
      setProgressValue(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsAnalyzing(false);
          
          toast({
            title: "Analysis complete!",
            description: "Your study plan is now ready.",
          });
          
          return 100;
        }
        return prev + 10;
      });
    }, 500);
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
                <div className="glass-card p-8 border-dashed border-2 border-white/30 w-full max-w-lg flex flex-col items-center justify-center cursor-pointer hover:border-white/50 transition-all">
                  <Upload size={48} className="mb-4 text-white/70" />
                  
                  <p className="mb-2 text-xl font-medium">Drag and drop your file here</p>
                  <p className="text-sm text-white/70 mb-6">PDF, JPG, PNG or TXT format</p>
                  
                  <Label htmlFor="syllabus-upload" className="cursor-pointer">
                    <Input 
                      id="syllabus-upload" 
                      type="file" 
                      className="hidden" 
                      accept=".pdf,.jpg,.jpeg,.png,.txt"
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
                        <p className="text-white/70">Analyzing syllabus...</p>
                        <Progress value={progressValue} className="h-2" />
                      </div>
                    ) : progressValue === 100 ? (
                      <Button className="w-full cosmic-gradient text-white mt-4">
                        View Your Study Plan
                      </Button>
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
                      onChange={handleFileUpload}
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
