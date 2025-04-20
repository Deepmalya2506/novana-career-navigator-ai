
// Use environment variable instead of hardcoded key
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";
const BASE_URL = "https://generativelanguage.googleapis.com/v1beta";

export interface GeminiResponse {
  text: string;
  error?: string;
}

export async function askGemini(prompt: string): Promise<GeminiResponse> {
  try {
    // Using gemini-2.5-pro model for enhanced capabilities
    const response = await fetch(
      `${BASE_URL}/models/gemini-2.5-pro:generateContent?key=${GEMINI_API_KEY}`,
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
            maxOutputTokens: 4096, // Increased token limit for more detailed responses
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Gemini API error:", errorData);
      return { 
        text: "",
        error: errorData.error?.message || `Error: ${response.status} ${response.statusText}` 
      };
    }

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
  return {
    askQuestion: async (prompt: string): Promise<GeminiResponse> => {
      return await askGemini(prompt);
    }
  };
};
