
import { GoogleGenAI } from "@google/genai";
import { ProcessedResult } from '../types';

export const generatePsychologicalAnalysis = async (
  results: ProcessedResult[], 
  isCorporate: boolean = false,
  customPrompt?: string
): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Filtra apenas resultados válidos para o prompt
    const dataFormatted = results
      .filter(r => r.dimensionName && r.score !== undefined)
      .map(r => `${r.dimensionName}: ${r.score}%`)
      .join(', ');

    if (!dataFormatted) {
      throw new Error("DADOS_INSUFICIENTES");
    }

    const context = isCorporate 
      ? "Este é um diagnóstico de Saúde Organizacional (VitalPulse)." 
      : "Este é um laudo de perfil psicométrico individual (Insight360).";

    const prompt = `
      CONTEXTO: ${context}
      DADOS COLETADOS: ${dataFormatted}
      PERGUNTA DO USUÁRIO: ${customPrompt || "Gere um diagnóstico técnico completo sobre este perfil."}
      
      INSTRUÇÕES:
      1. Responda em Português do Brasil.
      2. Seja direto, profissional e técnico (como um psicólogo ou consultor sênior).
      3. Use parágrafos claros. Não use Markdown exagerado (evite muitos negritos ou tabelas complexas).
      4. Identifique pontos fortes e pontos de melhoria baseados nos scores.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: { 
        systemInstruction: "Você é um especialista em análise comportamental e neurociência. Suas respostas compõem um relatório oficial de diagnóstico.",
        temperature: 0.7,
        topP: 0.95
      }
    });

    const text = response.text;
    if (!text) throw new Error("IA_SEM_RESPOSTA");
    
    return text.trim();
  } catch (error: any) {
    console.error("Erro Crítico no Serviço Gemini:", error);
    if (error.message?.includes("API_KEY")) return "Erro: Chave de API inválida ou não configurada.";
    throw error;
  }
};
