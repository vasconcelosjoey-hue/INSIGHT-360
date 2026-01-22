
import { GoogleGenAI } from "@google/genai";
import { ProcessedResult } from '../types';

export const generatePsychologicalAnalysis = async (
  results: ProcessedResult[], 
  isCorporate: boolean = false,
  customPrompt?: string
): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const dataSummary = results.map(r => `${r.dimensionName}: ${r.score}%`).join('\n');

    const systemInstruction = isCorporate 
      ? "Você é um Consultor Sênior de Saúde Organizacional. Sua tarefa é fornecer um diagnóstico preciso e recomendações estratégicas baseadas em dados psicométricos de grupo."
      : "Você é um Psicólogo Organizacional Especialista. Forneça uma análise técnica do perfil individual, destacando talentos e pontos de atenção.";

    const prompt = `
      RESULTADOS DO QUESTIONÁRIO:
      ${dataSummary}
      
      SOLICITAÇÃO ESPECÍFICA:
      ${customPrompt || "Gere um parecer técnico completo e sugestões de desenvolvimento."}
      
      IMPORTANTE: Responda em Português. Seja profissional, profundo e direto.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: { 
        systemInstruction,
        temperature: 0.6,
        thinkingConfig: { thinkingBudget: 1000 }
      }
    });

    return response.text || "Análise gerada com sucesso.";
  } catch (error: any) {
    console.error("Erro na IA:", error);
    return "O sistema de IA está temporariamente indisponível. Por favor, tente enviar sua pergunta novamente.";
  }
};
