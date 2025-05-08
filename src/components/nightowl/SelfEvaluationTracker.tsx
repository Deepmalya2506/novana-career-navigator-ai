
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { BarChart, PieChart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useGemini } from '@/utils/geminiService';
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, BarChart as RechartsBarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

interface EvaluationData {
  categories: {
    name: string;
    value: number;
    color: string;
  }[];
  comparisonData: {
    name: string;
    today: number;
    yesterday: number;
  }[];
  streak: number;
  summary: string;
  goals: {
    growth: string;
    rest: string;
    fun: string;
  };
}

const SelfEvaluationTracker = () => {
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [achievement, setAchievement] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [evaluationData, setEvaluationData] = useState<EvaluationData | null>(null);
  const { toast } = useToast();
  const { askQuestion } = useGemini();

  const COLORS = ['#9C27B0', '#1D19A8', '#E53F71', '#6BD0FF'];

  const handleSubmit = async () => {
    if (!achievement.trim()) {
      toast({
        title: "Input needed",
        description: "Please share what you achieved or learned today.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Generate evaluation using Gemini AI
      const prompt = `
        Based on this daily achievement/learning report: "${achievement}"
        
        Please analyze this text and create a JSON object with the following structure:
        
        {
          "categories": [
            {"name": "Learning", "value": 35, "color": "#9C27B0"},
            {"name": "Work", "value": 25, "color": "#1D19A8"},
            {"name": "Rest", "value": 20, "color": "#E53F71"},
            {"name": "Other", "value": 20, "color": "#6BD0FF"}
          ],
          "comparisonData": [
            {"name": "Productivity", "today": 80, "yesterday": 70},
            {"name": "Focus", "today": 75, "yesterday": 65}, 
            {"name": "Satisfaction", "today": 85, "yesterday": 90}
          ],
          "streak": 3,
          "summary": "You've made excellent progress today. Your focus on learning new skills is paying off, and your productivity has increased by 10% compared to yesterday.",
          "goals": {
            "growth": "Continue the React tutorial for 30 minutes",
            "rest": "Take a 15-minute walk outside before bed",
            "fun": "Watch one episode of your favorite show"
          }
        }
        
        The categories should reflect what areas the person spent their time/effort on.
        The comparisonData should show relevant metrics compared to a hypothetical "yesterday".
        Create a personalized, motivational summary.
        Suggest 3 reasonable goals for tomorrow based on their achievements.
        Return ONLY the valid JSON.
      `;

      const response = await askQuestion(prompt);

      if (response.text) {
        try {
          // Clean the JSON string if needed
          let jsonText = response.text.trim();
          // Remove any markdown code blocks if present
          if (jsonText.startsWith('```json')) {
            jsonText = jsonText.replace(/```json|```/g, '').trim();
          }
          
          const parsedData = JSON.parse(jsonText) as EvaluationData;
          setEvaluationData(parsedData);
          
          toast({
            title: "Evaluation complete",
            description: "Your daily check-in has been processed successfully.",
          });
        } catch (error) {
          console.error("Failed to parse Gemini response:", error);
          toast({
            title: "Processing error",
            description: "Unable to analyze your input. Please try again.",
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Connection issue",
          description: "Unable to connect to AI service. Please try again later.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error during evaluation:", error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const startNewEvaluation = () => {
    setEvaluationData(null);
    setAchievement('');
    setIsEvaluating(true);
  };

  return (
    <Card className="glass-card overflow-hidden">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart className="h-5 w-5 text-novana-light-blue" />
          Daily Check-in
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {!isEvaluating && !evaluationData ? (
          <div className="text-center py-8">
            <p className="mb-4 text-white/70">Ready to reflect on your day?</p>
            <Button 
              onClick={startNewEvaluation}
              className="cosmic-gradient"
            >
              Start Daily Check-in
            </Button>
          </div>
        ) : evaluationData ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Time & Effort Distribution</h3>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={evaluationData.categories}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={60}
                        fill="#8884d8"
                        dataKey="value"
                        label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {evaluationData.categories.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">Today vs Yesterday</h3>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart
                      data={evaluationData.comparisonData}
                      margin={{ top: 5, right: 5, bottom: 5, left: 0 }}
                    >
                      <XAxis dataKey="name" fontSize={10} />
                      <YAxis fontSize={10} />
                      <Tooltip />
                      <Bar dataKey="today" fill="#9C27B0" name="Today" />
                      <Bar dataKey="yesterday" fill="#6BD0FF" name="Yesterday" />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">Streak: {evaluationData.streak} days</h3>
              <div className="flex gap-1">
                {Array(evaluationData.streak).fill(0).map((_, i) => (
                  <div key={i} className="h-2 w-8 bg-novana-purple rounded-full"></div>
                ))}
                <div className="h-2 w-8 bg-white/20 rounded-full"></div>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">Daily Summary</h3>
              <p className="text-white/80 text-sm">{evaluationData.summary}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">Tomorrow's Goals</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <div className="h-5 w-5 rounded-full bg-novana-purple flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs">G</span>
                  </div>
                  <span>{evaluationData.goals.growth}</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-5 w-5 rounded-full bg-novana-light-blue flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs">R</span>
                  </div>
                  <span>{evaluationData.goals.rest}</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-5 w-5 rounded-full bg-novana-pink flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs">F</span>
                  </div>
                  <span>{evaluationData.goals.fun}</span>
                </li>
              </ul>
            </div>
            
            <Button
              onClick={startNewEvaluation}
              variant="outline"
              className="w-full"
            >
              New Check-in
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-white/70 text-sm">What did you achieve or learn today?</p>
            <Textarea
              value={achievement}
              onChange={(e) => setAchievement(e.target.value)}
              placeholder="I completed my project deadline, learned about React hooks, and took a walk to clear my mind..."
              className="min-h-[100px] bg-white/5"
            />
            <div className="flex justify-end">
              <Button
                onClick={handleSubmit}
                className="cosmic-gradient"
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : "Submit"}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SelfEvaluationTracker;
