import { GoogleGenAI, Type } from "@google/genai";
import { CardData, HoodColor, GEAR_CATEGORIES, KINKS_CATEGORIES } from "../types";

const apiKey = process.env.API_KEY || '';

const getAIClient = () => {
  if (!apiKey) {
    throw new Error("API Key is missing");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateCardMetadata = async (prompt: string): Promise<CardData> => {
  const ai = getAIClient();
  
  const systemInstruction = `
    You are a creator for the "Bone Battle" card game, which focuses on "Pup Play" personas.
    Create a fictional Pup Persona based on the user's prompt.
    
    Data Requirements:
    - Name: A fun pup name.
    - Hood Color: Choose one that fits the vibe (Red, Blue, Black, etc.).
    - Birthdate: Format YYYY.MM (e.g., 2019.05).
    - Height: e.g., "180cm" or "5'11".
    - Shoe Size: e.g., "43 EU" or "10 US".
    - Country: A 2-letter country code (e.g., US, DE, FR) or emoji.
    - Gear & Kinks: Assign bone values (0-5) to the specific categories provided.
    
    IMPORTANT: The total sum of all Gear and Kinks values MUST NOT exceed 60. Keep it balanced.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Create a pup persona for: ${prompt}`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            hoodColor: { type: Type.STRING, enum: Object.values(HoodColor) },
            birthdate: { type: Type.STRING },
            height: { type: Type.STRING },
            shoeSize: { type: Type.STRING },
            socialLink: { type: Type.STRING },
            country: { type: Type.STRING },
            gear: { 
              type: Type.OBJECT,
              properties: Object.fromEntries(GEAR_CATEGORIES.map(c => [c, { type: Type.INTEGER }]))
            },
            kinks: {
              type: Type.OBJECT,
              properties: Object.fromEntries(KINKS_CATEGORIES.map(c => [c, { type: Type.INTEGER }]))
            }
          },
          required: ["name", "hoodColor", "birthdate", "height", "shoeSize", "country", "gear", "kinks"],
        },
      },
    });

    const text = response.text;
    if (!text) throw new Error("No data returned");
    
    const parsed = JSON.parse(text);
    return {
        ...parsed,
        consent: true // Default to true for AI generation context
    } as CardData;
  } catch (error) {
    console.error("Error generating card metadata:", error);
    throw error;
  }
};

export const generateCardImage = async (cardDescription: string, artStyle: string): Promise<string> => {
  const ai = getAIClient();
  
  const prompt = `
    A portrait photo of a human puppy player wearing a hood. ${cardDescription}. 
    Style: ${artStyle}.
    The character is wearing a pup hood matching their main color.
    High quality, photorealistic or digital art style, centered composition, looking at camera.
    No text in the image.
  `;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: prompt,
    });
    
    if (response.candidates && response.candidates[0].content && response.candidates[0].content.parts) {
        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
            }
        }
    }
    
    throw new Error("No image data found in response");

  } catch (error) {
    console.error("Error generating card image:", error);
    throw error;
  }
};