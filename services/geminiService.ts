
import { GoogleGenAI } from "@google/genai";
import { ProcessedResult } from '../types';

export const generatePsychologicalAnalysis = async (
  results: ProcessedResult[], 
  isCorporate: boolean = false,
  customPrompt?: string
): Promise<string> => {
  try {
    // Inicialização segura conforme documentação técnica
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Preparação dos dados: transforma o array de resultados em uma string legível para a IA
    const dataString = results.map(r => `- ${r.dimensionName}: ${r.score}%`).join('\n');

    const systemInstruction = isCorporate 
      ? "Você é um Consultor de RH e Saúde Organizacional experiente. Analise os scores de uma equipe e forneça diagnóstico e plano de ação."
      : "Você é um Psicólogo Clínico e Organizacional. Analise os scores individuais e forneça um parecer técnico e PDI.";

    const fullPrompt = `
      CONTEXTO: Relatório de Diagnóstico Comportamental Insight360.
      TIPO: ${isCorporate ? 'CORPORATIVO/EQUIPE' : 'INDIVIDUAL'}
      
      DADOS OBTIDOS (SCORES):
      ${dataString}
      
      PEDIDO ADICIONAL DO CONSULTOR:
      ${customPrompt || "Gere um parecer técnico completo com análise de pontos fortes, pontos de risco e sugestões de desenvolvimento."}
      
      IMPORTANTE: Responda em Português, de forma executiva, técnica e profissional.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: fullPrompt,
      config: { 
        systemInstruction,
        temperature: 0.7,
        thinkingConfig: { thinkingBudget: 2000 }
      }
    });

    // Acessa a propriedade .text diretamente conforme as regras da SDK
    return response.text || "Análise processada com sucesso. Nenhuma observação adicional.";
  } catch (error: any) {
    console.error("Falha Crítica Gemini:", error);
    return "O sistema de IA está processando muitos dados agora. Por favor, clique no botão de enviar novamente em alguns segundos.";
  }
};
