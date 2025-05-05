
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

export async function getDreamJobRoadmap(jobTitle: string): Promise<CareerData> {
  try {
    const prompt = `
    As a career advisor, create a comprehensive roadmap for someone aspiring to become a ${jobTitle}.
    Format your response as a structured JSON with this exact format:

    {
      "description": "A motivating overview of the ${jobTitle} role and its importance in the industry (3-4 sentences). Include what this professional does and why it's a valuable career path.",
      "skills": [
        {
          "name": "Essential Skill Name",
          "topics": ["Specific Topic 1", "Specific Topic 2", "Specific Topic 3", "Specific Topic 4"]
        },
        ... more skills (include 6-8 skills)
      ]
    }

    Include 6-8 essential skills with 4-5 specific subtopics each that are critical for becoming a successful ${jobTitle}.
    The skills should cover both technical and soft skills where appropriate, as well as industry-specific knowledge.
    For each skill topic, be specific and actionable (e.g., instead of "Learn Python", use "Python Data Structures" or "Building APIs with Flask").
    Return ONLY valid JSON without any additional text or formatting.
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
      console.error("Failed to parse Gemini response for dream job:", parseError);
      console.log("Raw response:", response.text);
      throw new Error("Failed to parse dream job roadmap");
    }
  } catch (error) {
    console.error("Error fetching dream job roadmap:", error);
    return { skills: [], description: "Failed to generate a roadmap for your dream job. Please try again." };
  }
}
