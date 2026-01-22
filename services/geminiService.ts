
import { GoogleGenAI } from "@google/genai";
import { ProcessedResult } from '../types';

export const generatePsychologicalAnalysis = async (
  results: ProcessedResult[], 
  isCorporate: boolean = false,
  customPrompt?: string
): Promise<string> => {
  try {
    // Inicializa a IA com a chave de ambiente
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Formata os scores para a IA processar
    const dataFormatted = results.map(r => `${r.dimensionName}: ${r.score}%`).join('\n');

    const systemInstruction = isCorporate 
      ? "Você é um Consultor de RH Sênior e Analista de Saúde Organizacional. Escreva um parecer técnico profissional, direto e acionável sobre os resultados de uma equipe."
      : "Você é um Psicólogo Organizacional e Mentor de Carreira. Escreva uma análise empática e técnica sobre o perfil individual do avaliado.";

    const prompt = `
      RESULTADOS DO MAPEAMENTO (SCORES 0-100%):
      ${dataFormatted}
      
      SOLICITAÇÃO DO CONSULTOR:
      ${customPrompt || "Gere uma síntese estratégica dos resultados destacando pontos fortes e áreas de desenvolvimento."}
      
      REGRAS:
      - Responda em Português do Brasil.
      - Use um tom técnico e respeitoso.
      - Não use formatação Markdown pesada (evite excesso de #).
      - Foque no diagnóstico e em passos práticos.
    `;

    // Usando gemini-3-flash-preview para maior estabilidade e velocidade
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: { 
        systemInstruction,
        temperature: 0.5,
      }
    });

    if (!response || !response.text) {
      throw new Error("Resposta vazia da IA");
    }

    return response.text;
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    // Retorno amigável para o componente tratar
    throw new Error("INSTABILITY_ERROR");
  }
};
