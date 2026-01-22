
import { GoogleGenAI } from "@google/genai";
import { ProcessedResult } from '../types';

export const generatePsychologicalAnalysis = async (
  results: ProcessedResult[], 
  isCorporate: boolean = false,
  customPrompt?: string
): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Formatação ultra-simplificada para evitar sobrecarga de tokens
    const dataTable = results.map(r => `${r.dimensionName}: ${r.score}%`).join(' | ');

    const systemInstruction = isCorporate 
      ? "Você é um Consultor de RH Sênior. Analise os scores da equipe e forneça um parecer técnico focado em saúde organizacional e produtividade."
      : "Você é um Psicólogo Organizacional. Analise o perfil individual e forneça um parecer técnico focado em desenvolvimento e carreira.";

    const prompt = `
      DADOS: ${dataTable}
      PERGUNTA DO CONSULTOR: ${customPrompt || "Gere uma síntese estratégica dos resultados."}
      
      INSTRUÇÃO: Responda em Português, seja direto, técnico e profissional. Limite-se a 300 palavras.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: { 
        systemInstruction,
        temperature: 0.5,
        thinkingConfig: { thinkingBudget: 1000 } // Orçamento reduzido para maior velocidade
      }
    });

    return response.text || "Análise concluída com sucesso.";
  } catch (error: any) {
    console.error("Gemini Error:", error);
    return "Ocorreu um erro na conexão com a IA. Por favor, tente enviar sua pergunta novamente.";
  }
};
