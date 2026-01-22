
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
  { id: 'engajamento', name: 'Engajamento', description: 'Energia e dedicação ao trabalho.' },
  { id: 'pertencimento', name: 'Pertencimento', description: 'Sentir-se parte essencial da equipe.' },
  { id: 'seguranca', name: 'Segurança Psicológica', description: 'Liberdade para errar e opinar.' },
  { id: 'proposito', name: 'Propósito', description: 'Conexão entre valores pessoais e da empresa.' },
  { id: 'colaboracao', name: 'Colaboração', description: 'Sinergia e auxílio mútuo entre pares.' },
  { id: 'burnout', name: 'Risco de Burnout', description: 'Esgotamento físico e mental.' },
  { id: 'estresse', name: 'Estresse Crônico', description: 'Nível de tensão diária acumulada.' },
  { id: 'isolamento', name: 'Isolamento', description: 'Sentimento de desconexão social no trabalho.' },
  { id: 'frustracao', name: 'Frustração', description: 'Sentimento de estagnação ou injustiça.' },
  { id: 'clima', name: 'Clima Geral', description: 'Percepção da atmosfera organizacional.' },
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
  // Engajamento
  "Sinto-me energizado e motivado ao iniciar minha jornada de trabalho.",
  "O tempo passa rápido quando estou focado em minhas tarefas profissionais.",
  "Sinto que meu trabalho contribui diretamente para o sucesso da organização.",
  "Falo com entusiasmo sobre a empresa para pessoas de fora.",
  // Pertencimento
  "Sinto que meus colegas de equipe realmente se importam comigo como pessoa.",
  "Minha identidade profissional está fortemente ligada a esta equipe.",
  "Sinto que sou ouvido e respeitado dentro do meu departamento.",
  "Vejo-me trabalhando nesta organização pelos próximos anos.",
  // Segurança
  "Sinto-me confortável em admitir um erro sem medo de punição severa.",
  "Posso discordar abertamente de decisões da liderança sem receio.",
  "A equipe é aberta a novas ideias, mesmo as mais inusitadas.",
  "Sinto que posso ser eu mesmo no ambiente de trabalho.",
  // Propósito
  "Os valores da empresa estão alinhados com o que eu acredito pessoalmente.",
  "Entendo perfeitamente como meu papel ajuda a realizar a missão da empresa.",
  "Sinto orgulho do impacto que nosso produto/serviço causa na sociedade.",
  "Trabalho por algo maior do que apenas o salário no final do mês.",
  // Colaboração
  "Meus colegas compartilham conhecimentos livremente uns com os outros.",
  "Em momentos de crise, a equipe se une para resolver o problema rapidamente.",
  "Confio plenamente na qualidade do trabalho entregue pelos meus pares.",
  "A cooperação aqui é mais valorizada do que a competição interna.",
  // Burnout (Invertida)
  "Ao final do dia, sinto-me exausto e sem energia para minha vida pessoal.",
  "Tenho tido dificuldades para dormir pensando em problemas do trabalho.",
  "Sinto que minhas tarefas são esmagadoras e nunca terminam.",
  "Minha paciência com colegas e clientes tem diminuído drasticamente.",
  // Estresse (Invertida)
  "Sinto uma pressão constante para entregar resultados acima do humano.",
  "O ambiente de trabalho é tenso e focado apenas em cobranças.",
  "Sinto dores físicas (cabeça, costas) relacionadas ao estresse laboral.",
  "Tenho dificuldade em me desconectar do trabalho nos fins de semana.",
  // Isolamento (Invertida)
  "Sinto que sou 'apenas um número' dentro desta grande engrenagem.",
  "Frequentemente almoço ou passo os intervalos sozinho por falta de afinidade.",
  "Faltam espaços de interação genuína entre as pessoas da empresa.",
  "Sinto que ninguém realmente conhece minhas habilidades reais aqui.",
  // Frustração (Invertida)
  "Acredito que pessoas menos qualificadas são promovidas antes de mim.",
  "As ferramentas de trabalho fornecidas são inadequadas para minhas tarefas.",
  "Sinto que minha carreira está estagnada nesta organização.",
  "A comunicação interna é falha e recebo informações importantes por último.",
  // Clima
  "Eu recomendaria esta empresa para um amigo próximo trabalhar.",
  "A liderança demonstra empatia e se preocupa com a saúde da equipe.",
  "O clima organizacional favorece a inovação e o bem-estar.",
  "Sinto que sou recompensado de forma justa pelo meu esforço.",
  "Há um equilíbrio saudável entre vida pessoal e profissional aqui.",
  "Confio nas decisões estratégicas tomadas pela diretoria da empresa."
];

export const getQuestions = (type: 'individual' | 'corporate'): Question[] => {
  const list = type === 'corporate' ? CORPORATE_QUESTIONS : INDIVIDUAL_QUESTIONS;
  const dims = type === 'corporate' ? CORPORATE_DIMENSIONS : DIMENSIONS;
  
  return list.map((text, i) => {
    const questionsPerDimension = type === 'corporate' ? 4.2 : 2; // Aproximação
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
