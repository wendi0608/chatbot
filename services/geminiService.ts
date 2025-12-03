import { GoogleGenAI, Type } from "@google/genai";
import { DependencySuggestion } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const suggestDependencies = async (projectDescription: string): Promise<DependencySuggestion[]> => {
  if (!projectDescription.trim()) return [];

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `I am building a Python project with the following description: "${projectDescription}".
      Please suggest a list of popular, standard Python packages (PyPI) that I should install.
      Provide the package name and a very brief reason why.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              package: { type: Type.STRING },
              reason: { type: Type.STRING },
            },
            required: ["package", "reason"],
          },
        },
      },
    });

    if (response.text) {
      const suggestions = JSON.parse(response.text) as DependencySuggestion[];
      return suggestions;
    }
    return [];
  } catch (error) {
    console.error("Failed to fetch suggestions from Gemini:", error);
    return [];
  }
};