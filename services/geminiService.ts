
import { GoogleGenAI } from "@google/genai";
import { ProcessedResult } from '../types';

export const generatePsychologicalAnalysis = async (results: ProcessedResult[]): Promise<string> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
        return "Para gerar uma análise detalhada com IA, configure sua API Key do Google Gemini no ambiente. Por enquanto, baseie-se nos gráficos e pontuações apresentados.";
    }

    const ai = new GoogleGenAI({ apiKey: apiKey });
    
    // Format the results for the prompt
    const scoresSummary = results.map(r => `${r.dimensionName}: ${r.score.toFixed(0)}%`).join('\n');

    const prompt = `
      Atue como um psicólogo especialista em psicometria e análise comportamental.
      Analise o seguinte perfil de personalidade baseado em 21 dimensões (escala 0-100).
      
      DADOS DO PACIENTE:
      ${scoresSummary}
      
      TAREFA:
      Forneça um resumo executivo de 3 parágrafos:
      1. Pontos Fortes: Destaque as 3 características mais marcantes (pontuações mais altas ou equilibradas positivamente).
      2. Pontos de Atenção: Destaque áreas que podem causar conflito ou sofrimento (pontuações muito baixas ou excessivamente altas que indiquem rigidez).
      3. Sugestão de Desenvolvimento: Uma recomendação prática baseada na combinação única dos traços (ex: se tiver alta Empatia mas baixa Independência).

      Use um tom profissional, acolhedor e direto. Fale diretamente com o usuário ("Você...").
      Não liste todos os pontos, foque na síntese.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "Não foi possível gerar a análise no momento.";
  } catch (error) {
    console.error("Erro ao chamar Gemini:", error);
    return "Ocorreu um erro ao tentar gerar a análise de inteligência artificial. Verifique sua conexão ou tente novamente mais tarde.";
  }
};
