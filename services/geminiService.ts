
import { GoogleGenAI, Type } from "@google/genai";
import { ProcessedResult } from '../types';
import { DIMENSIONS } from '../constants';

export const generatePsychologicalAnalysis = async (results: ProcessedResult[]): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const scoresSummary = results.map(r => `${r.dimensionName}: ${r.score.toFixed(0)}%`).join('\n');

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `
        Atue como um psicólogo organizacional de elite e especialista em análise psicométrica.
        Analise o seguinte perfil comportamental baseado em 21 dimensões (escala 0-100).
        
        DADOS DO PARTICIPANTE:
        ${scoresSummary}
        
        ESTRUTURA DA RESPOSTA:
        1. SÍNTESE DO PERFIL: O core do comportamento.
        2. DIFERENCIAIS COMPETITIVOS: Os 3 traços mais potentes.
        3. RISCOS E DESAFIOS: Pontos de atenção.
        4. MAPA DE CARREIRA: 3 sugestões de áreas/cargos com justificativa técnica.
        5. PLANO DE AÇÃO: Recomendação prática imediata.

        DIRETRIZES:
        - Tom profissional e direto. Use a segunda pessoa ("Você...").
        - Explore a sinergia entre as dimensões.
      `,
      config: {
        thinkingConfig: { thinkingBudget: 2000 }
      }
    });

    return response.text || "Análise concluída.";
  } catch (error) {
    console.error("Erro no Gemini (Analysis):", error);
    return "O sistema de IA está em alta demanda. Use os gráficos abaixo para sua interpretação.";
  }
};

export const extractScoresFromText = async (text: string): Promise<ProcessedResult[]> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `
        Analise o texto de diagnóstico abaixo e extraia as pontuações para as 21 dimensões psicológicas.
        Se uma dimensão não for mencionada, atribua o valor 50 (neutro).
        Retorne APENAS um objeto JSON onde a chave é o ID da dimensão e o valor é o score de 0 a 100.

        DIMENSÕES ESPERADAS (IDs):
        ${DIMENSIONS.map(d => d.id).join(', ')}

        TEXTO DO DOCUMENTO:
        ---
        ${text}
        ---
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: DIMENSIONS.reduce((acc: any, dim) => {
            acc[dim.id] = { type: Type.NUMBER, description: `Score for ${dim.name}` };
            return acc;
          }, {}),
          required: DIMENSIONS.map(d => d.id)
        }
      }
    });

    const scores = JSON.parse(response.text || '{}');
    
    return DIMENSIONS.map(dim => ({
      dimensionId: dim.id,
      dimensionName: dim.name,
      score: Math.round(scores[dim.id] ?? 50),
      description: dim.description
    }));
  } catch (error) {
    console.error("Erro no Gemini (Extraction):", error);
    throw new Error("Não foi possível extrair dados do texto fornecido.");
  }
};
