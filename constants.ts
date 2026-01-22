
import { Dimension, Question } from './types';

export const DIMENSIONS: Dimension[] = [
  { id: 'autodirecionamento', name: 'Autodirecionamento', description: 'Responsabilidade e agência.' },
  { id: 'empatia', name: 'Empatia', description: 'Conexão emocional.' },
  { id: 'autoconfianca', name: 'Autoconfiança', description: 'Segurança interna.' },
  { id: 'independencia', name: 'Independência', description: 'Autonomia emocional.' },
  { id: 'flexibilidade', name: 'Flexibilidade Moral', description: 'Adaptação e pragmatismo.' },
  { id: 'procrastinacao', name: 'Procrastinação', description: 'Gestão de tarefas.' },
  { id: 'inibicao', name: 'Inibição Social', description: 'Comportamento em grupo.' },
  { id: 'persistencia', name: 'Persistência', description: 'Resiliência e foco.' },
  { id: 'auto_aceitacao', name: 'Auto-aceitação', description: 'Visão de si.' },
  { id: 'reflexao', name: 'Reflexão', description: 'Lógica vs Intuição.' },
  { id: 'otimismo', name: 'Otimismo', description: 'Visão de futuro.' },
  { id: 'incerteza', name: 'Medo da Incerteza', description: 'Aversão ao risco.' },
  { id: 'extravagancia', name: 'Extravagância', description: 'Busca por atenção.' },
  { id: 'conquista', name: 'Nec. de Conquista', description: 'Ambição.' },
  { id: 'ordem', name: 'Ordem', description: 'Hierarquia e regras.' },
  { id: 'ideais', name: 'Ideais', description: 'Valores e causas.' },
  { id: 'altruismo', name: 'Altruísmo', description: 'Ajuda ao próximo.' },
  { id: 'sentimentalismo', name: 'Sentimentalismo', description: 'Emoção na decisão.' },
  { id: 'frater', name: 'Frater', description: 'Sociabilidade e confiança.' },
  { id: 'identificacao', name: 'Ident. Transpessoal', description: 'Senso de unidade.' },
  { id: 'espiritualidade', name: 'Espiritualidade', description: 'Senso de propósito.' },
];

export const CORPORATE_DIMENSIONS: Dimension[] = [
  { id: 'engajamento', name: 'Engajamento (Dopamina)', description: 'Nível de motivação e recompensa.' },
  { id: 'pertencimento', name: 'Pertencimento (Ocitocina)', description: 'Conexão e segurança no grupo.' },
  { id: 'seguranca', name: 'Segurança (GABA)', description: 'Ausência de medo e ameaça.' },
  { id: 'proposito', name: 'Propósito (Acetilcolina)', description: 'Foco e significado no trabalho.' },
  { id: 'colaboracao', name: 'Colaboração (Glutamato)', description: 'Excitabilidade e troca entre pares.' },
  { id: 'burnout', name: 'Risco de Burnout', description: 'Esgotamento neurofisiológico.' },
  { id: 'estresse', name: 'Estresse (Cortisol)', description: 'Nível de alerta e pressão crônica.' },
  { id: 'isolamento', name: 'Isolamento Social', description: 'Desconexão e falta de suporte.' },
  { id: 'frustracao', name: 'Frustração', description: 'Sentimento de injustiça ou estagnação.' },
  { id: 'resiliencia', name: 'Resiliência (Endorfina)', description: 'Capacidade de lidar com dor e pressão.' },
];

const INDIVIDUAL_QUESTIONS = [
  "Eu sinto que sou o único responsável pelas direções que minha vida toma.",
  "As escolhas que faço hoje determinam meu sucesso futuro.",
  "Consigo perceber o desconforto de alguém antes mesmo da pessoa falar.",
  "Tenho facilidade em me colocar no lugar do outro.",
  "Acredito que tenho as habilidades para superar qualquer desafio.",
  "Confio plenamente na minha capacidade de resolver situações novas.",
  "Tomo decisões baseadas nas minhas convicções, mesmo sob discordância.",
  "Não busco aprovação constante para me sentir validado.",
  "Acredito que regras podem ser flexibilizadas pelo resultado.",
  "É necessário ser pragmático para atingir objetivos difíceis.",
  "Tenho o hábito de adiar tarefas que considero chatas.",
  "Perco o foco com frequência por causa de distrações.",
  "Em reuniões, costumo ficar em silêncio e evitar atenção.",
  "Sinto ansiedade quando preciso falar em público.",
  "Mantenho o esforço em projetos longos sem resultados imediatos.",
  "Desistir não é uma opção, mesmo sob pressão.",
  "Lido bem com meus erros e não me martirizo.",
  "Aceito minhas vulnerabilidades como parte do crescimento.",
  "Analiso prós e contras exaustivamente antes de decidir.",
  "Prefiro lógica e dados à intuição pura.",
  "Acredito que algo bom sempre sairá de situações difíceis.",
  "Vejo o futuro com entusiasmo e esperança.",
  "Sinto desconforto quando não sei o que vai acontecer.",
  "Prefiro rotinas previsíveis a riscos novos.",
  "Gosto de me expressar de forma marcante e ser reconhecido.",
  "Sinto-me energizado sendo o centro das atenções.",
  "Sucesso e reconhecimento financeiro são meus motores.",
  "Sou altamente competitivo e busco ser o melhor.",
  "Disciplina e respeito à hierarquia são fundamentais.",
  "Mantenho meus pertences e agenda rigorosamente organizados.",
  "Estou disposto a sacrifícios por causas em que acredito.",
  "Meus valores éticos são inegociáveis.",
  "Ajudo pessoas sem esperar nada em troca.",
  "Priorizo o bem coletivo sobre interesses individuais.",
  "Sou facilmente tocado por demonstrações de afeto.",
  "Minhas emoções pesam mais que a lógica nas relações.",
  "Confio na bondade inerente das pessoas.",
  "Tenho facilidade em fazer amigos profundos rapidamente.",
  "Minhas ações impactam o mundo de forma conectada.",
  "Tenho forte senso de pertencimento a comunidades.",
  "Existe uma dimensão espiritual que guia a existência.",
  "Minha vida tem um propósito sagrado além do material."
];

const CORPORATE_QUESTIONS = [
  // Engajamento (Dopamina)
  "Sinto que sou recompensado de forma justa pelo meu esforço.",
  "Tenho clareza dos meus objetivos e sinto prazer em alcançá-los.",
  "O ambiente de trabalho me estimula a buscar novos desafios diariamente.",
  "Sinto-me motivado a entregar mais do que o esperado pela empresa.",
  // Pertencimento (Ocitocina)
  "Sinto que faço parte de um grupo que me apoia e me protege.",
  "Confio nas intenções dos meus colegas de trabalho.",
  "Existe um forte senso de comunidade em nosso departamento.",
  "Sinto que minhas opiniões são valorizadas pela equipe.",
  // Segurança (GABA)
  "Sinto-me seguro para expressar minhas ideias sem medo de críticas.",
  "O ambiente de trabalho é tranquilo e livre de ameaças constantes.",
  "Sinto que meus erros são vistos como oportunidades de aprendizado.",
  "Tenho previsibilidade sobre minhas tarefas e responsabilidades.",
  // Propósito (Acetilcolina)
  "Meu trabalho tem um significado que vai além do retorno financeiro.",
  "Sinto que meus valores pessoais estão alinhados com a empresa.",
  "O que eu faço diariamente contribui para um bem maior.",
  "Entendo o impacto real do meu trabalho na vida das pessoas.",
  // Colaboração (Glutamato)
  "A troca de informações entre os membros da equipe é fluida e intensa.",
  "Aprendo constantemente com meus pares através da cooperação.",
  "Sinto que a equipe é um motor de ideias em constante atividade.",
  "A colaboração aqui é mais importante que a competição individual.",
  // Burnout
  "Sinto-me exausto logo ao acordar para mais um dia de trabalho.",
  "Minha produtividade caiu drasticamente nos últimos meses.",
  "Tenho dificuldade em me concentrar em tarefas simples.",
  "Sinto que não tenho mais energia emocional para investir no trabalho.",
  // Estresse (Cortisol)
  "Sinto uma pressão constante no peito por causa das cobranças.",
  "O clima de trabalho me deixa em estado de alerta o tempo todo.",
  "Tenho tido reações exageradas a pequenos problemas profissionais.",
  "Sinto que as exigências do cargo superam minha capacidade de entrega.",
  // Isolamento Social
  "Sinto que trabalho sozinho, mesmo estando rodeado de pessoas.",
  "Não sinto conexão emocional com nenhum dos meus colegas.",
  "Frequentemente me sinto ignorado em decisões que me afetam.",
  "Faltam momentos de interação genuína na empresa.",
  // Frustração
  "Sinto que meu crescimento está bloqueado por questões políticas.",
  "As decisões da liderança parecem injustas e desmotivadoras.",
  "Sinto que meus talentos estão sendo desperdiçados nesta posição.",
  "Raramente recebo feedback construtivo sobre meu desempenho.",
  // Resiliência (Endorfina)
  "Consigo manter o foco mesmo em situações de alta pressão.",
  "Supero crises profissionais com relativa rapidez e equilíbrio.",
  "Vejo dificuldades como degraus para o meu fortalecimento.",
  "Tenho ferramentas emocionais para lidar com o estresse diário.",
  "Sinto orgulho da minha capacidade de adaptação a mudanças.",
  "Consigo rir de situações difíceis para aliviar a tensão da equipe."
];

export const getQuestions = (type: 'individual' | 'corporate'): Question[] => {
  const list = type === 'corporate' ? CORPORATE_QUESTIONS : INDIVIDUAL_QUESTIONS;
  const dims = type === 'corporate' ? CORPORATE_DIMENSIONS : DIMENSIONS;
  
  return list.map((text, i) => {
    const dimIndex = Math.floor(i / (list.length / dims.length));
    return {
      id: i + 1,
      dimensionId: dims[dimIndex]?.id || dims[0].id,
      text
    };
  });
};

export const QUESTIONS = getQuestions('individual');
export const TOTAL_QUESTIONS = QUESTIONS.length;
