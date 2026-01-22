
import { GoogleGenAI } from "@google/genai";
import { ProcessedResult } from '../types';

export const generatePsychologicalAnalysis = async (
  results: ProcessedResult[], 
  isCorporate: boolean = false,
  customPrompt?: string
): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const dataFormatted = results.map(r => `${r.dimensionName}: ${r.score}%`).join(', ');

    const prompt = `Analise estes resultados psicométricos: ${dataFormatted}. ${customPrompt || "Forneça um diagnóstico técnico."}. Responda em Português, de forma direta e profissional, sem usar Markdown excessivo.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: { 
        systemInstruction: "Você é um psicólogo e consultor técnico. Sua resposta deve ser lida em um relatório formal.",
        temperature: 0.7 
      }
    });

    const text = response.text;
    if (!text) throw new Error("IA_EMPTY");
    return text;
  } catch (error) {
    console.error("Erro Crítico Gemini:", error);
    throw error;
  }
};
