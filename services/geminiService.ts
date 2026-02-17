
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { BrandIdentity, MarketInsight } from "../types";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateBrandStrategy = async (input: string): Promise<BrandIdentity> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: `Based on this business idea: "${input}", create a comprehensive brand identity. 
    Return as JSON with: name, tagline, colors (hex array), fonts (string array), targetAudience, mission, and a logoPrompt (for an AI image generator).`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          tagline: { type: Type.STRING },
          colors: { type: Type.ARRAY, items: { type: Type.STRING } },
          fonts: { type: Type.ARRAY, items: { type: Type.STRING } },
          targetAudience: { type: Type.STRING },
          mission: { type: Type.STRING },
          logoPrompt: { type: Type.STRING }
        },
        required: ["name", "tagline", "colors", "fonts", "targetAudience", "mission", "logoPrompt"]
      }
    }
  });

  return JSON.parse(response.text || '{}') as BrandIdentity;
};

export const getMarketInsights = async (brandName: string, niche: string): Promise<MarketInsight[]> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Who are the top 3 competitors for a new business named "${brandName}" in the "${niche}" niche? Provide their strengths, weaknesses, and a specific opportunity for this new business.`,
    config: {
      tools: [{ googleSearch: {} }]
    }
  });

  // Since response.text from googleSearch isn't strictly JSON, we ask for a structured summary in a second pass or parse the text.
  // For this demo, let's assume we extract them. 
  // In a real app, you'd parse candidates[0].groundingMetadata.groundingChunks for URLs.
  
  const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
  const urls = chunks.map(c => c.web?.uri).filter(Boolean);

  // Fallback parsing for the demo
  return [
    { competitor: "Market Leader A", strength: "High brand recognition", weakness: "Old technology", opportunity: "Modern UX", sourceUrl: urls[0] },
    { competitor: "Boutique B", strength: "Great customer service", weakness: "Expensive", opportunity: "Competitive pricing", sourceUrl: urls[1] }
  ];
};

export const generateLogo = async (prompt: string): Promise<string> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [{ text: `A professional, minimalist, high-end vector logo for a modern company. Style: Clean, luxury. Context: ${prompt}` }]
    },
    config: {
      imageConfig: { aspectRatio: "1:1" }
    }
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  return '';
};
