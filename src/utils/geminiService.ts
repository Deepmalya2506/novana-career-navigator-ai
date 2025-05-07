
// Use environment variable instead of hardcoded key
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";
const BASE_URL = "https://generativelanguage.googleapis.com/v1";

export interface GeminiResponse {
  text: string;
  error?: string;
}

export interface EventData {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  type: string;
  description: string;
  url: string;
  image: string;
}

export async function askGemini(prompt: string): Promise<GeminiResponse> {
  try {
    // Using gemini-2.0-flash model for enhanced speed and capabilities
    const response = await fetch(
      `${BASE_URL}/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
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
            maxOutputTokens: 4096,
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

// Function to get relevant tech events based on user skills and goals
export async function getRelevantEvents(skills: string[], goals: string[], dreamJob?: string): Promise<EventData[]> {
  try {
    const skillsString = skills.join(", ");
    const prompt = `
    Create a list of 5 tech events (workshops, seminars, hackathons, conferences, or webinars) that would be relevant for someone with the following skills: ${skillsString}
    ${goals ? `\nTheir career goals are: ${goals}` : ''}
    ${dreamJob ? `\nTheir dream job is: ${dreamJob}` : ''}
    
    Format your response as a valid JSON array with ONLY these objects containing these exact fields:
    [
      {
        "id": "unique-id-1",
        "title": "Event Title",
        "date": "Month Day, Year", 
        "time": "Start Time - End Time",
        "location": "City, Country or Online",
        "type": "Conference|Workshop|Hackathon|Webinar|Career Fair",
        "description": "Brief 1-2 sentence description of the event",
        "url": "https://example.com/event-registration",
        "image": "https://images.unsplash.com/photo-[unique-id]" (use realistic Unsplash image URLs for tech events)
      },
      ...
    ]
    Return ONLY valid JSON without markdown formatting, comments or any other text.
    `;
    
    const response = await askGemini(prompt);
    
    if (response.error) {
      throw new Error(response.error);
    }
    
    try {
      let cleanJson = response.text.trim();
      // Handle potential markdown code blocks
      if (cleanJson.startsWith('```json')) {
        cleanJson = cleanJson.replace(/```json|```/g, '').trim();
      }
      
      const events = JSON.parse(cleanJson) as EventData[];
      return events;
    } catch (error) {
      console.error("Failed to parse events data:", error);
      console.log("Raw response:", response.text);
      throw new Error("Failed to parse events data");
    }
  } catch (error) {
    console.error("Error fetching relevant events:", error);
    return [];
  }
}

// Hook for using Gemini in components
export const useGemini = () => {
  return {
    askQuestion: async (prompt: string): Promise<GeminiResponse> => {
      return await askGemini(prompt);
    },
    getRelevantEvents: async (skills: string[], goals: string[], dreamJob?: string): Promise<EventData[]> => {
      return await getRelevantEvents(skills, goals, dreamJob);
    }
  };
};
