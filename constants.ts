
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

// Seleção de 42 perguntas (2 por dimensão) para manter a precisão com metade do tempo
const COMPACT_QUESTIONS_LIST = [
  // Autodirecionamento
  "Está apenas nas minhas mãos o meu destino e as escolhas que faço.",
  "Os problemas que enfrento são, em sua maioria, resultado das minhas próprias ações e não da sorte.",
  
  // Empatia
  "Ao ver alguém em dificuldade, consigo sentir e imaginar exatamente o que a pessoa está passando.",
  "Tenho facilidade em perceber os sentimentos alheios e ajustar meu comportamento para ser acolhedor.",
  
  // Autoconfiança
  "Sinto-me totalmente capaz de identificar oportunidades e resolver qualquer problema que surja.",
  "Não tenho medo do futuro, pois confio na minha habilidade de lidar com qualquer imprevisto.",
  
  // Independência
  "Sinto-me muito bem e produtivo mesmo quando estou sozinho por longos períodos.",
  "Consigo agir conforme minhas convicções sem depender da aprovação ou opinião alheia.",
  
  // Flexibilidade
  "Acredito que, para alcançar um objetivo importante, os fins podem justificar os meios.",
  "Sinto-me confortável em passar por cima de certas regras se isso me ajudar a vencer.",
  
  // Procrastinação
  "Frequentemente deixo tarefas importantes para a última hora e acabo trabalhando sob pressão.",
  "Tenho o hábito de priorizar atividades prazerosas e adiar as obrigações mais difíceis.",
  
  // Inibição Social
  "Costumo me sentir inseguro ou tímido ao interagir com pessoas desconhecidas.",
  "Tenho grande dificuldade em dizer 'não' às solicitações das pessoas ou em reclamar meus direitos.",
  
  // Persistência
  "Mesmo diante de obstáculos extremos, persisto até o fim em meus objetivos.",
  "Sou conhecido por ser teimoso em continuar uma tarefa, mesmo quando parece impossível.",
  
  // Auto-aceitação
  "Reconheço com clareza minhas limitações e aceito que não sou capaz de fazer tudo bem.",
  "Sou honesto comigo mesmo sobre meus defeitos e como eles impactam minha vida.",
  
  // Reflexão
  "Prefiro refletir profundamente sobre todos os fatos antes de tomar qualquer decisão importante.",
  "Demoro a decidir porque analiso racionalmente todas as variáveis, ignorando a intuição.",
  
  // Otimismo
  "Tenho a convicção profunda de que, no final, tudo sempre vai dar certo.",
  "Acredito que sou uma pessoa de sorte e que o futuro reserva coisas melhores.",
  
  // Medo da Incerteza
  "Prefiro o caminho seguro e conhecido, mesmo que o duvidoso prometa maiores recompensas.",
  "Sinto-me desconfortável em situações novas e prefiro manter minhas rotinas habituais.",
  
  // Extravagância
  "Gosto de expressar minhas emoções abertamente e de causar uma boa impressão nas pessoas.",
  "Sinto que só serei plenamente realizado se alcançar uma conquista grandiosa e marcante.",
  
  // Conquista / Ambição
  "Considero-me uma pessoa muito ambiciosa, focada no sucesso e no crescimento profissional.",
  "Minha felicidade pessoal está diretamente ligada às minhas grandes conquistas profissionais.",
  
  // Ordem
  "Acredito rigorosamente que toda e qualquer regra ou lei existe para ser cumprida sem questionamento.",
  "Mantenho minha vida e minhas atividades sempre muito bem organizadas e estruturadas.",
  
  // Ideais
  "Muitas vezes mudo minha rotina ou faço sacrifícios pessoais em função das minhas crenças e valores.",
  "Eu brigo e defendo com firmeza as ideias e verdades que considero corretas.",
  
  // Altruísmo
  "Sinto grande satisfação em ajudar as pessoas e cooperar, mesmo sem receber reconhecimento.",
  "Ofereço ajuda com frequência para quem precisa, inclusive para quem não tenho afinidade.",
  
  // Sentimentalismo
  "Na hora de tomar decisões difíceis, prefiro ouvir o que o meu coração diz em vez da razão.",
  "Considero-me uma pessoa altamente sentimental e me comovo facilmente com histórias tristes.",
  
  // Frater
  "Acredito sinceramente que a maioria das pessoas é boa e digna de confiança.",
  "Tenho grande facilidade em fazer novos amigos e compartilhar meus sentimentos com eles.",
  
  // Identificação
  "Sinto-me parte de algo maior e costumo ter um forte senso de conexão com o universo ou o todo.",
  "Gosto de pertencer a grupos específicos e sinto que minha identidade está ligada a eles.",
  
  // Espiritualidade
  "Acredito firmemente que tenho um propósito ou papel espiritual a cumprir neste mundo.",
  "Tenho convicção na existência de uma força divina superior ou de vida após a morte."
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
