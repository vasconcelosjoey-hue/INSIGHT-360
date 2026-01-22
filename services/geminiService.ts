
import { GoogleGenAI } from "@google/genai";
import { ProcessedResult } from '../types';

export const generatePsychologicalAnalysis = async (
  results: ProcessedResult[], 
  isCorporate: boolean = false,
  customPrompt?: string
): Promise<string> => {
  try {
    // Inicialização conforme diretrizes: usa process.env.API_KEY injetado
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const scoresSummary = results.map(r => `${r.dimensionName}: ${r.score.toFixed(0)}%`).join('\n');

    const systemInstruction = isCorporate 
      ? `Você é um Consultor de Cultura Organizacional Sênior. Sua missão é analisar dados psicométricos agregados de uma equipe e fornecer insights profundos, planos de ação e diagnósticos de saúde mental corporativa.`
      : `Você é um Psicólogo Organizacional e Mentor de Carreira. Sua missão é analisar o perfil individual de um candidato e fornecer um Plano de Desenvolvimento Individual (PDI) estratégico e análise de soft skills.`;

    const prompt = `
      DADOS DO DIAGNÓSTICO:
      ${scoresSummary}
      
      SOLICITAÇÃO DO CONSULTOR:
      ${customPrompt || "Gere uma análise completa dos pontos fortes, riscos e sugestões de melhoria baseada nesses dados."}
      
      Responda de forma profissional, direta e em formato de parecer técnico.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: { 
        systemInstruction,
        thinkingConfig: { thinkingBudget: 2000 },
        temperature: 0.7
      }
    });

    // Uso correto da propriedade .text (não é método)
    return response.text || "Análise processada com sucesso.";
  } catch (error) {
    console.error("Erro no Gemini:", error);
    return "Não foi possível gerar a análise no momento. Verifique se os dados estão completos e tente novamente.";
  }
};
