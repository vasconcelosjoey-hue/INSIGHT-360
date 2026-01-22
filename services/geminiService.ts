
import { GoogleGenAI } from "@google/genai";
import { ProcessedResult } from '../types';

export const generatePsychologicalAnalysis = async (
  results: ProcessedResult[], 
  isCorporate: boolean = false,
  customPrompt?: string
): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const dataFormatted = results.map(r => `${r.dimensionName}: ${r.score}%`).join('\n');

    const promptText = `
      Você é um Especialista em Diagnóstico Psicométrico. 
      Analise estes resultados (0 a 100%):
      ${dataFormatted}
      
      FOCO DA ANÁLISE: ${customPrompt || "Gere um parecer técnico estratégico."}
      
      REGRAS:
      - Responda em Português.
      - Seja direto e profissional.
      - Divida em tópicos curtos.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ parts: [{ text: promptText }] }], // Estrutura de partes mais estável
      config: { 
        systemInstruction: isCorporate 
          ? "Você é um Consultor de RH. Foque em performance de equipe e cultura." 
          : "Você é um Psicólogo Organizacional. Foque em talentos e desenvolvimento individual.",
        temperature: 0.7,
      }
    });

    if (!response.text) {
      throw new Error("Resposta vazia da IA");
    }

    return response.text;
  } catch (error: any) {
    console.error("Falha na IA Insight360:", error);
    throw error;
  }
};
