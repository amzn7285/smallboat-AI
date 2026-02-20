// services/geminiService.ts

import { BrandIdentity, MarketInsight } from "../types";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const BASE_URL =
  "https://generativelanguage.googleapis.com/v1beta/models";

if (!API_KEY) {
  console.error("❌ VITE_GEMINI_API_KEY is missing");
}

async function callGemini(prompt: string) {
  const response = await fetch(
    `${BASE_URL}/gemini-1.5-flash:generateContent?key=${API_KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      }),
    }
  );

  if (!response.ok) {
    const err = await response.text();
    console.error("Gemini API error:", err);
    throw new Error("Gemini request failed");
  }

  const data = await response.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
}

export const generateBrandStrategy = async (
  input: string
): Promise<BrandIdentity> => {
  const prompt = `
Create a complete brand identity for this business idea:

"${input}"

Return ONLY valid JSON in this format:
{
  "name": "",
  "tagline": "",
  "colors": ["#000000", "#FFFFFF"],
  "fonts": ["Font1", "Font2"],
  "targetAudience": "",
  "mission": "",
  "logoPrompt": ""
}
`;

  const text = await callGemini(prompt);

  try {
    return JSON.parse(text) as BrandIdentity;
  } catch {
    console.error("Brand JSON parse failed:", text);
    throw new Error("Invalid brand response format");
  }
};

export const getMarketInsights = async (
  brandName: string,
  niche: string
): Promise<MarketInsight[]> => {
  const prompt = `
List 3 competitors for a business called "${brandName}" in the "${niche}" niche.

Return ONLY valid JSON array:
[
  {
    "competitor": "",
    "strength": "",
    "weakness": "",
    "opportunity": "",
    "sourceUrl": ""
  }
]
`;

  const text = await callGemini(prompt);

  try {
    return JSON.parse(text) as MarketInsight[];
  } catch {
    console.error("Insights JSON parse failed:", text);
    return [];
  }
};

export const generateLogo = async (
  prompt: string
): Promise<string> => {
  // Gemini image models require different endpoint setup.
  // For now we simulate a logo image.
  return `https://dummyimage.com/600x400/000/fff&text=${encodeURIComponent(
    "Logo Preview"
  )}`;
};