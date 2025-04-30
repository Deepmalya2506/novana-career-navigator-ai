
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { Upload } from 'lucide-react';
import { useGemini } from '@/hooks/useGemini';
import { readFileContent } from '@/utils/fileHandlers';

const QuestionPredictor: React.FC = () => {
  const [previousQuestions, setPreviousQuestions] = useState('');
  const [predictedQuestions, setPredictedQuestions] = useState('');
  const [isPredicting, setIsPredicting] = useState(false);
  const [progressValue, setProgressValue] = useState(0);
  const { toast } = useToast();
  const { askQuestion } = useGemini();

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

  return (
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
  );
};

export default QuestionPredictor;
