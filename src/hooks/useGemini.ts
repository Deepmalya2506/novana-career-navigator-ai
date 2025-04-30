
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Google Generative AI with the API key
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || "");

export interface GeminiResponse {
  text: string;
  error?: string;
}

export const useGemini = () => {
  const askQuestion = async (prompt: string): Promise<GeminiResponse> => {
    try {
      // Use gemini-2.0-flash model for faster responses
      const generativeModel = genAI.getGenerativeModel({ 
        model: "gemini-2.0-flash",
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 8192,
        },
      });

      // Generate content
      const result = await generativeModel.generateContent(prompt);
      const response = result.response;
      
      return {
        text: response.text(),
        error: undefined
      };
    } catch (error) {
      console.error("Gemini API error:", error);
      return {
        text: "",
        error: error instanceof Error ? error.message : "Unknown error occurred"
      };
    }
  };

  return { askQuestion };
};
