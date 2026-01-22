
import { GoogleGenAI, Type } from "@google/genai";
import { ProcessedResult } from '../types';
import { DIMENSIONS } from '../constants';

export const generatePsychologicalAnalysis = async (results: ProcessedResult[], isCorporate: boolean = false): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const scoresSummary = results.map(r => `${r.dimensionName}: ${r.score.toFixed(0)}%`).join('\n');

    const prompt = isCorporate 
      ? `Atue como um consultor de RH e Clima Organizacional. Analise a saúde emocional e o engajamento médio desta amostra corporativa:
         ${scoresSummary}
         Forneça: 1. Diagnóstico Geral do Clima, 2. Pontos Críticos de Atenção, 3. Recomendações de Treinamento para a empresa.`
      : `Atue como um psicólogo organizacional. Analise este perfil individual:
         ${scoresSummary}
         Forneça: 1. Síntese do Perfil, 2. Diferenciais, 3. Mapa de Carreira e 4. Plano de Ação Personalizado.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: { thinkingConfig: { thinkingBudget: 1500 } }
    });

    return response.text || "Análise concluída.";
  } catch (error) {
    console.error("Erro no Gemini:", error);
    return "Análise temporariamente indisponível.";
  }
};

export const askSmartAiAboutCandidate = async (results: ProcessedResult[], query: string): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const scoresSummary = results.map(r => `${r.dimensionName}: ${r.score.toFixed(0)}%`).join('\n');

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `
        DADOS PSICOMÉTRICOS DO CANDIDATO:
        ${scoresSummary}

        PERGUNTA DO RECRUTADOR:
        "${query}"

        Responda tecnicamente se o perfil é compatível, justificando com os dados acima. 
        Inclua um mini plano de ação para o desenvolvimento do candidato se ele for contratado.
      `,
      config: { thinkingConfig: { thinkingBudget: 2000 } }
    });

    return response.text || "Sem resposta da IA.";
  } catch (error) {
    console.error("Erro na Smartbox:", error);
    return "Erro ao processar consulta.";
  }
};
