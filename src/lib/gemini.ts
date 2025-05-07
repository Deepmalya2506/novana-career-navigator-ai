
import { GoogleGenerativeAI } from "@google/generative-ai";

// Use environment variable instead of hardcoded key
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || "");

export interface GeminiResponse {
  text: string;
  error?: string;
}

/**
 * Sends a prompt to the Gemini API and returns the response
 * @param prompt - The text prompt to send to Gemini
 * @returns Promise<GeminiResponse> - The response from Gemini
 */
export async function askGemini(prompt: string): Promise<GeminiResponse> {
  try {
    // Using gemini-2.0-flash model for enhanced speed and capabilities
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash",
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 4096,
      },
    });
    const result = await model.generateContent(prompt);
    const response = result.response;

    return {
      text: response.text(),
      error: undefined,
    };
  } catch (error) {
    console.error("Gemini API error:", error);
    return {
      text: "",
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

// React hook for using Gemini in components
export const useGemini = () => {
  return {
    askQuestion: async (prompt: string): Promise<GeminiResponse> => {
      return await askGemini(prompt);
    },
  };
};
