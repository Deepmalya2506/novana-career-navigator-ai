
import React, { useState } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, ClipboardList, ArrowRight } from 'lucide-react';
import SyllabusUpload from '@/components/exam-prep/SyllabusUpload';
import TopicViewer from '@/components/exam-prep/TopicViewer';
import QuestionPredictor from '@/components/exam-prep/QuestionPredictor';

const ExamPrep = () => {
  const [selectedTab, setSelectedTab] = useState('syllabus');
  const [analysisResult, setAnalysisResult] = useState('');
  const [topics, setTopics] = useState<string[]>([]);
  const [currentTopicIndex, setCurrentTopicIndex] = useState(0);

  const handleAnalysisComplete = (result: string, extractedTopics: string[]) => {
    setAnalysisResult(result);
    setTopics(extractedTopics);
    setCurrentTopicIndex(0);
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
            <SyllabusUpload onAnalysisComplete={handleAnalysisComplete} />
          </TabsContent>
          
          <TabsContent value="learn">
            <TopicViewer 
              topics={topics}
              currentTopicIndex={currentTopicIndex}
              analysisResult={analysisResult}
              onNextTopic={handleNextTopic}
              onPrevTopic={handlePrevTopic}
            />
          </TabsContent>
          
          <TabsContent value="predict">
            <QuestionPredictor />
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default ExamPrep;
