
import { askGemini } from '@/utils/geminiService';

export interface SkillData {
  name: string;
  topics: string[];
}

export interface CareerData {
  skills: SkillData[];
  description: string;
}

export async function getCareerSkills(role: string, company: string): Promise<CareerData> {
  try {
    const prompt = `
    As a career advisor, provide a structured response with skills and subtopics needed for a ${role} position at ${company}.
    Format your response as follows:

    {
      "description": "A brief overview of the role and its importance at ${company} (2-3 sentences)",
      "skills": [
        {
          "name": "Skill Name",
          "topics": ["Topic 1", "Topic 2", "Topic 3"]
        },
        ... more skills
      ]
    }

    Include 5-7 key skills with 3-5 subtopics each that are specifically relevant for ${company}.
    Return ONLY valid JSON without any additional text, explanation or formatting.
    `;

    const response = await askGemini(prompt);
    
    if (response.error) {
      throw new Error(response.error);
    }
    
    try {
      // Clean the response to ensure it's valid JSON
      let cleanJson = response.text.trim();
      if (cleanJson.startsWith('```json')) {
        cleanJson = cleanJson.replace(/```json|```/g, '').trim();
      }
      
      const data = JSON.parse(cleanJson) as CareerData;
      
      return {
        skills: data.skills || [],
        description: data.description || ''
      };
    } catch (parseError) {
      console.error("Failed to parse Gemini response as JSON:", parseError);
      console.log("Raw response:", response.text);
      throw new Error("Failed to parse career data");
    }
  } catch (error) {
    console.error("Error fetching career skills:", error);
    return { skills: [], description: "" };
  }
}

export async function getSkillDetails(skill: string): Promise<string> {
  try {
    const prompt = `
    Provide a detailed explanation of the skill "${skill}" for software engineering careers.
    Include:
    1. Why this skill is important
    2. How to master this skill (concrete steps)
    3. Common challenges when learning this skill
    4. Resources for learning (books, courses, websites)
    
    Make it informative, practical and motivating. Format your response with markdown headings and bullet points for readability.
    `;

    const response = await askGemini(prompt);
    
    if (response.error) {
      throw new Error(response.error);
    }
    
    return response.text;
  } catch (error) {
    console.error("Error fetching skill details:", error);
    return "Failed to load skill details. Please try again later.";
  }
}
