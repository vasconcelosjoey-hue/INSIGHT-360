
import { GoogleGenAI } from "@google/genai";
import { ProcessedResult } from '../types';

export const generatePsychologicalAnalysis = async (
  results: ProcessedResult[], 
  isCorporate: boolean = false,
  customPrompt?: string
): Promise<string> => {
  try {
    // Inicialização segura dentro da função para evitar chaves obsoletas
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Formatação rigorosa dos dados para a IA
    const dataFormatted = results
      .filter(r => r.dimensionName && r.score !== undefined)
      .map(r => `${r.dimensionName}: ${r.score}%`)
      .join('\n');

    if (!dataFormatted) {
      throw new Error("DADOS_INSUFICIENTES");
    }

    const context = isCorporate 
      ? "Diagnóstico de Saúde Organizacional e Clima (VitalPulse)." 
      : "Laudo de Perfil Psicométrico e Comportamental (Insight360).";

    const systemInstruction = `Você é um Especialista Sênior em Psicometria, Neurociência Comportamental e Consultoria de RH. 
    Sua tarefa é analisar os scores de 21 dimensões e fornecer um diagnóstico clínico e profissional.
    Não seja genérico. Use os dados fornecidos para criar correlações entre as dimensões.
    Se o usuário fizer uma pergunta específica, foque nela, mas mantenha o embasamento técnico.
    Responda sempre em Português (Brasil).`;

    const mainPrompt = `
      ${context}
      
      DADOS DO ENTREVISTADO:
      ${dataFormatted}
      
      SOLICITAÇÃO DO USUÁRIO: 
      "${customPrompt || "Gere um parecer técnico completo sobre este perfil, destacando riscos e potencialidades."}"
      
      REGRAS DE RESPOSTA:
      - Divida em tópicos claros (ex: Carreira, Relacionamentos, Riscos).
      - Use uma linguagem de alto nível.
      - Se houver scores abaixo de 30%, identifique como pontos críticos de atenção.
      - Se houver scores acima de 80%, identifique como talentos naturais.
    `;

    // Chamada com Thinking Budget para raciocínio avançado
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: mainPrompt,
      config: { 
        systemInstruction: systemInstruction,
        temperature: 0.7,
        thinkingConfig: { thinkingBudget: 2000 } // Reserva tokens para a IA "raciocinar" o diagnóstico
      }
    });

    const text = response.text;
    if (!text) throw new Error("A IA não retornou conteúdo.");
    
    return text.trim();
  } catch (error: any) {
    console.error("Erro no Gemini Service:", error);
    
    // Fallback amigável
    if (error.message?.includes("API_KEY")) {
      return "Erro de Configuração: A chave de acesso à Inteligência Artificial não foi detectada. Verifique as configurações do sistema.";
    }
    
    throw new Error("Não foi possível gerar a análise no momento. Tente novamente.");
  }
};
