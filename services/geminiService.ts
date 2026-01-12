
import { GoogleGenAI } from "@google/genai";
import { ProcessedResult } from '../types';

export const generatePsychologicalAnalysis = async (results: ProcessedResult[]): Promise<string> => {
  try {
    // Inicialização direta conforme diretrizes: assumimos que process.env.API_KEY existe.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Formata o resumo das pontuações para a IA
    const scoresSummary = results.map(r => `${r.dimensionName}: ${r.score.toFixed(0)}%`).join('\n');

    const prompt = `
      Atue como um psicólogo organizacional de elite, especialista em análise psicométrica e orientação de carreira.
      Analise o seguinte perfil comportamental baseado em 21 dimensões da arquitetura psicológica humana (escala 0-100).
      
      DADOS DO PARTICIPANTE:
      ${scoresSummary}
      
      ESTRUTURA DA RESPOSTA (Obrigatória):
      
      1. SÍNTESE DO PERFIL: Descreva o "core" do comportamento deste indivíduo em um parágrafo.
      
      2. DIFERENCIAIS COMPETITIVOS: Identifique os 3 traços mais potentes e como eles geram valor.
      
      3. RISCOS E DESAFIOS: Pontue áreas onde o excesso ou a falta de um traço pode gerar gargalos de performance ou estresse.
      
      4. MAPA DE CARREIRA E MERCADO: Baseado na combinação dessas 21 dimensões, sugira explicitamente 3 áreas de atuação ou cargos específicos onde este perfil teria maior probabilidade de sucesso e satisfação. Justifique brevemente cada sugestão com base nos dados.
      
      5. PLANO DE AÇÃO: Uma recomendação prática e imediata para potencializar os resultados.

      DIRETRIZES:
      - Use um tom profissional, inspirador e direto. 
      - Fale na segunda pessoa ("Você...").
      - Foque na correlação entre os traços (ex: como sua alta Empatia combinada com sua baixa Inibição Social te torna um líder nato).
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "A análise foi concluída, mas o conteúdo está vazio. Por favor, tente novamente.";
  } catch (error) {
    console.error("Erro ao chamar Gemini:", error);
    return "O sistema de IA está temporariamente indisponível devido a alta demanda. Por favor, utilize os gráficos e o detalhamento técnico abaixo para sua interpretação inicial.";
  }
};
