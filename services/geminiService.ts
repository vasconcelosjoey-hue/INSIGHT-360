
import { GoogleGenAI } from "@google/genai";
import { ProcessedResult } from '../types';

export const generatePsychologicalAnalysis = async (
  results: ProcessedResult[], 
  isCorporate: boolean = false,
  customPrompt?: string
): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const scoresSummary = results.map(r => `${r.dimensionName}: ${r.score.toFixed(0)}%`).join('\n');

    const basePrompt = isCorporate 
      ? `Atue como um Consultor de Cultura e Saúde Organizacional Senior. Analise estes dados agregados de uma empresa:
         ${scoresSummary}
         
         Instrução adicional do consultor: ${customPrompt || "Gere um diagnóstico geral, pontos de atenção e plano estratégico de melhoria."}`
      : `Atue como um Psicólogo Organizacional e Mentor de Carreira. Analise este perfil individual:
         ${scoresSummary}
         
         Instrução adicional do consultor: ${customPrompt || "Gere uma síntese do perfil, diferenciais competitivos e um plano de desenvolvimento individual (PDI)."}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: basePrompt,
      config: { 
        thinkingConfig: { thinkingBudget: 2500 },
        temperature: 0.7
      }
    });

    return response.text || "Análise concluída.";
  } catch (error) {
    console.error("Erro no Gemini:", error);
    return "Erro ao processar análise. Verifique sua conexão ou chave de API.";
  }
};
