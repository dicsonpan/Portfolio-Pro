import { GoogleGenAI } from "@google/genai";

export const aiService = {
  async polishText(text: string, context: string = 'resume'): Promise<string> {
    const apiKey = process.env.API_KEY;
    if (!apiKey) throw new Error("API Key is not configured in environment variables.");
    if (!text) return "";

    const ai = new GoogleGenAI({ apiKey });
    
    let prompt = "";
    if (context === 'resume') {
      prompt = `Rewrite the following text for a professional resume/portfolio. 
      Make it concise, impactful, and use action verbs. 
      Keep the same language as the input (English or Chinese). 
      Return ONLY the polished text, no explanations.
      
      Input text: "${text}"`;
    } else {
      prompt = `Polish this text: "${text}"`;
    }

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });
      return response.text?.trim() || text;
    } catch (error) {
      console.error("AI Polish Error:", error);
      throw error;
    }
  }
};