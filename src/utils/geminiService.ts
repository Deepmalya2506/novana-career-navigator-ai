
import { useToast } from "@/hooks/use-toast";

// API Key for Gemini
const GEMINI_API_KEY = "AIzaSyA3iwhnvvC6mdHsFkGjMNDH7FrG4acZzq0";
const BASE_URL = "https://generativelanguage.googleapis.com/v1beta";

export interface GeminiResponse {
  text: string;
  error?: string;
}

export async function askGemini(prompt: string): Promise<GeminiResponse> {
  try {
    // Using gemini-1.0-pro-vision model instead of gemini-pro
    const response = await fetch(
      `${BASE_URL}/models/gemini-1.0-pro-vision:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
        }),
      }
    );

    const data = await response.json();
    
    if (data.error) {
      console.error("Gemini API error:", data.error);
      return { 
        text: "",
        error: data.error.message || "Failed to get response from Gemini" 
      };
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response generated";
    return { text };
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return { 
      text: "",
      error: error instanceof Error ? error.message : "Unknown error occurred" 
    };
  }
}

// Hook for using Gemini in components
export const useGemini = () => {
  const { toast } = useToast();
  
  const askQuestion = async (prompt: string): Promise<string> => {
    const response = await askGemini(prompt);
    
    if (response.error) {
      toast({
        variant: "destructive",
        title: "AI Error",
        description: response.error || "Failed to get AI response",
      });
      return "";
    }
    
    return response.text;
  };
  
  return { askQuestion };
};
