
import { GoogleGenAI } from "@google/genai";
import { Verse } from '../types';

export const generateVerseReflection = async (verse: Verse): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Provide a short, uplifting, and encouraging reflection or spiritual insight on the following Bible verse (KJV):
"${verse.text}" (${verse.book} ${verse.chapter}:${verse.verse})

Focus on its meaning for daily life and give practical application. Keep it concise, around 100-150 words.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        temperature: 0.7,
        topP: 0.95,
        topK: 64,
        maxOutputTokens: 250, // Enough for 100-150 words
      },
    });

    const text = response.text;
    if (text) {
      return text;
    } else {
      console.error('Gemini API response was empty.');
      return 'Could not generate a reflection at this time. Please try again later.';
    }
  } catch (error) {
    console.error('Error generating reflection with Gemini API:', error);
    return 'Failed to generate reflection. Please check your API key and try again.';
  }
};
