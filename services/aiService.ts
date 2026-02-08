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
  },

  async translateJSON(data: any, targetLanguage: string): Promise<any> {
    const apiKey = process.env.API_KEY;
    if (!apiKey) throw new Error("API Key is not configured.");
    
    const ai = new GoogleGenAI({ apiKey });

    const prompt = `
      You are a professional translator for a resume/portfolio website.
      Translate the values within the following JSON object into ${targetLanguage}.
      
      Rules:
      1. Keep all keys exactly the same.
      2. Do NOT translate IDs, URLs, email addresses, or numeric values.
      3. Translate 'name', 'title', 'bio', 'description', 'role', 'school', 'field', 'degree', 'company' and 'tags'.
      4. Ensure the tone is professional and suitable for a CV/Portfolio.
      5. Return ONLY the valid JSON string, no markdown code blocks.

      JSON to translate:
      ${JSON.stringify(data)}
    `;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          responseMimeType: "application/json"
        }
      });
      
      const text = response.text;
      if (!text) throw new Error("Empty response from AI");
      return JSON.parse(text);
    } catch (error) {
      console.error("AI Translation Error:", error);
      throw error;
    }
  }
};