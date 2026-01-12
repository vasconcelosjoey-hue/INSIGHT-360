
import { Dimension, Question } from './types';

export const DIMENSIONS: Dimension[] = [
  { id: 'autodirecionamento', name: 'Autodirecionamento', description: 'Capacidade de assumir responsabilidade pela própria vida e escolhas.' },
  { id: 'empatia', name: 'Empatia', description: 'Capacidade de se colocar no lugar do outro e sentir compaixão.' },
  { id: 'autoconfianca', name: 'Autoconfiança', description: 'Segurança nas próprias habilidades para resolver problemas.' },
  { id: 'independencia', name: 'Independência', description: 'Autonomia emocional em relação à aprovação alheia.' },
  { id: 'flexibilidade', name: 'Flexibilidade Moral', description: 'Adaptação a regras e convenções versus pragmatismo.' },
  { id: 'procrastinacao', name: 'Procrastinação', description: 'Tendência a adiar tarefas e gestão do tempo.' },
  { id: 'inibicao', name: 'Inibição Social', description: 'Timidez e insegurança em interações sociais.' },
  { id: 'persistencia', name: 'Persistência', description: 'Constância em objetivos difíceis e resiliência.' },
  { id: 'auto_aceitacao', name: 'Auto-aceitação', description: 'Visão sobre as próprias qualidades e limitações.' },
  { id: 'reflexao', name: 'Reflexão', description: 'Análise racional versus intuição na tomada de decisão.' },
  { id: 'otimismo', name: 'Otimismo', description: 'Tendência a ver o lado positivo e confiar no futuro.' },
  { id: 'incerteza', name: 'Medo da Incerteza', description: 'Necessidade de segurança, rotina e aversão ao risco.' },
  { id: 'extravagancia', name: 'Extravagância', description: 'Busca por atenção, expressividade e reconhecimento.' },
  { id: 'conquista', name: 'Nec. de Conquista', description: 'Ambição, competitividade e foco no sucesso profissional.' },
  { id: 'ordem', name: 'Ordem', description: 'Apreço por regras, hierarquia e organização.' },
  { id: 'ideais', name: 'Ideais', description: 'Defesa de valores, crenças e sacrifício por causas.' },
  { id: 'altruismo', name: 'Altruísmo', description: 'Disposição para ajudar, cooperar e filantropia.' },
  { id: 'sentimentalismo', name: 'Sentimentalismo', description: 'Sensibilidade emocional e tomada de decisão pelo coração.' },
  { id: 'frater', name: 'Frater', description: 'Sociabilidade, confiança nas pessoas e facilidade em fazer amigos.' },
  { id: 'identificacao', name: 'Ident. Transpessoal', description: 'Senso de conexão com grupos, o todo ou o universo.' },
  { id: 'espiritualidade', name: 'Espiritualidade', description: 'Crença no transcendente e papel espiritual.' },
];

const COMPACT_QUESTIONS_LIST = [
  // Autodirecionamento
  "Eu sinto que sou o único responsável pelas direções que minha vida toma.",
  "As escolhas que faço hoje determinam meu sucesso futuro, independente de sorte.",
  // Empatia
  "Consigo perceber e sentir o desconforto de alguém antes mesmo da pessoa falar.",
  "Tenho facilidade em me colocar no lugar do outro para entender suas motivações.",
  // Autoconfiança
  "Acredito firmemente que tenho as habilidades necessárias para superar qualquer desafio.",
  "Diante de uma situação nova e complexa, confio plenamente na minha capacidade de resolvê-la.",
  // Independência
  "Tomo decisões importantes baseadas nas minhas convicções, mesmo que outros discordem.",
  "Não sinto necessidade de buscar aprovação constante das pessoas para me sentir validado.",
  // Flexibilidade
  "Acredito que as regras podem ser flexibilizadas se o resultado final for mais importante.",
  "Em certas situações, é necessário ser pragmático e ignorar convenções para atingir o objetivo.",
  // Procrastinação
  "Tenho o hábito de adiar tarefas que considero chatas ou difíceis até o último momento.",
  "Muitas vezes perco o foco em obrigações importantes por causa de distrações momentâneas.",
  // Inibição Social
  "Em reuniões com pessoas desconhecidas, costumo ficar em silêncio e evitar chamar atenção.",
  "Sinto uma certa ansiedade ou timidez quando preciso expressar minha opinião em público.",
  // Persistência
  "Sou capaz de manter o esforço em um projeto por meses, mesmo sem ver resultados imediatos.",
  "Desistir não é uma opção para mim, mesmo quando todos dizem que é impossível.",
  // Auto-aceitação
  "Lido bem com meus erros e não me martirizo por não ser perfeito em tudo.",
  "Aceito minhas vulnerabilidades como parte natural do meu crescimento como ser humano.",
  // Reflexão
  "Sempre analiso todos os prós e contras exaustivamente antes de tomar uma decisão.",
  "Prefiro a lógica e os dados concretos à intuição na hora de planejar meus passos.",
  // Otimismo
  "Acredito que, não importa quão difícil seja a situação, algo bom sairá dela.",
  "Vejo o futuro com entusiasmo e espero que grandes coisas aconteçam na minha vida.",
  // Medo da Incerteza
  "Sinto um grande desconforto quando não sei exatamente o que vai acontecer a seguir.",
  "Prefiro manter rotinas previsíveis a me arriscar em situações totalmente novas.",
  // Extravagância
  "Gosto de me expressar de forma marcante e de ser reconhecido pelo meu estilo ou ideias.",
  "Sinto-me energizado quando sou o centro das atenções em um ambiente social ou profissional.",
  // Conquista
  "O sucesso profissional e o reconhecimento financeiro são meus principais motores de vida.",
  "Sou altamente competitivo e busco sempre estar entre os melhores naquilo que faço.",
  // Ordem
  "Para mim, a disciplina e o respeito à hierarquia são fundamentais para qualquer sociedade.",
  "Mantenho meus pertences e minha agenda rigorosamente organizados e planejados.",
  // Ideais
  "Estou disposto a fazer grandes sacrifícios pessoais por uma causa em que acredito.",
  "Meus valores éticos são inegociáveis, mesmo que isso me traga prejuízos imediatos.",
  // Altruísmo
  "Frequentemente ajudo pessoas sem esperar absolutamente nada em troca, nem mesmo um obrigado.",
  "Priorizo o bem-estar coletivo sobre meus interesses individuais em projetos de equipe.",
  // Sentimentalismo
  "Sou facilmente tocado por demonstrações de afeto e me emociono com frequência.",
  "Minhas emoções costumam ter um peso maior do que a lógica pura nas minhas relações.",
  // Frater
  "Confio na bondade inerente das pessoas até que me provem o contrário.",
  "Tenho facilidade em estabelecer vínculos profundos de amizade em pouco tempo.",
  // Identificação
  "Sinto que minhas ações individuais impactam o mundo como um todo de forma conectada.",
  "Tenho um forte senso de pertencimento a comunidades que compartilham meus propósitos.",
  // Espiritualidade
  "Acredito que existe uma dimensão espiritual ou transcendente que guia nossa existência.",
  "Sinto que minha vida tem um propósito sagrado ou uma missão que vai além do material."
];

const generateQuestions = (): Question[] => {
  const questions: Question[] = [];
  for (let i = 0; i < COMPACT_QUESTIONS_LIST.length; i++) {
    const dimensionIndex = Math.floor(i / 2);
    if (dimensionIndex < DIMENSIONS.length) {
      questions.push({
        id: i + 1,
        dimensionId: DIMENSIONS[dimensionIndex].id,
        text: COMPACT_QUESTIONS_LIST[i]
      });
    }
  }
  return questions;
};

export const QUESTIONS = generateQuestions();
export const TOTAL_QUESTIONS = QUESTIONS.length;
