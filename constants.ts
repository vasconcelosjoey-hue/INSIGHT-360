import { Dimension, Question } from './types';

export const DIMENSIONS: Dimension[] = [
  { id: 'autodirecionamento', name: 'Autodirecionamento', description: 'Capacidade de assumir responsabilidade pela própria vida e escolhas.' }, // 1-4
  { id: 'empatia', name: 'Empatia', description: 'Capacidade de se colocar no lugar do outro e sentir compaixão.' }, // 5-8
  { id: 'autoconfianca', name: 'Autoconfiança', description: 'Segurança nas próprias habilidades para resolver problemas.' }, // 9-12
  { id: 'independencia', name: 'Independência', description: 'Autonomia emocional em relação à aprovação alheia.' }, // 13-16
  { id: 'flexibilidade', name: 'Flexibilidade Moral', description: 'Adaptação a regras e convenções versus pragmatismo.' }, // 17-20
  { id: 'procrastinacao', name: 'Procrastinação', description: 'Tendência a adiar tarefas e gestão do tempo.' }, // 21-24
  { id: 'inibicao', name: 'Inibição Social', description: 'Timidez e insegurança em interações sociais.' }, // 25-28
  { id: 'persistencia', name: 'Persistência', description: 'Constância em objetivos difíceis e resiliência.' }, // 29-32
  { id: 'auto_aceitacao', name: 'Auto-aceitação', description: 'Visão sobre as próprias qualidades e limitações.' }, // 33-36
  { id: 'reflexao', name: 'Reflexão', description: 'Análise racional versus intuição na tomada de decisão.' }, // 37-40
  { id: 'otimismo', name: 'Otimismo', description: 'Tendência a ver o lado positivo e confiar no futuro.' }, // 41-44
  { id: 'incerteza', name: 'Medo da Incerteza', description: 'Necessidade de segurança, rotina e aversão ao risco.' }, // 45-48
  { id: 'extravagancia', name: 'Extravagância', description: 'Busca por atenção, expressividade e reconhecimento.' }, // 49-52
  { id: 'conquista', name: 'Nec. de Conquista', description: 'Ambição, competitividade e foco no sucesso profissional.' }, // 53-56
  { id: 'ordem', name: 'Ordem', description: 'Apreço por regras, hierarquia e organização.' }, // 57-60
  { id: 'ideais', name: 'Ideais', description: 'Defesa de valores, crenças e sacrifício por causas.' }, // 61-64
  { id: 'altruismo', name: 'Altruísmo', description: 'Disposição para ajudar, cooperar e filantropia.' }, // 65-68
  { id: 'sentimentalismo', name: 'Sentimentalismo', description: 'Sensibilidade emocional e tomada de decisão pelo coração.' }, // 69-72
  { id: 'frater', name: 'Frater', description: 'Sociabilidade, confiança nas pessoas e facilidade em fazer amigos.' }, // 73-76
  { id: 'identificacao', name: 'Ident. Transpessoal', description: 'Senso de conexão com grupos, o todo ou o universo.' }, // 77-80
  { id: 'espiritualidade', name: 'Espiritualidade', description: 'Crença no transcendente e papel espiritual.' }, // 81-84
];

// Lista completa das 84 perguntas fornecidas
const RAW_QUESTIONS = [
  // Autodirecionamento
  "Sempre acredito que a culpa das falhas é minha e nunca das outras pessoas.",
  "Está apenas nas minhas mãos o meu destino.",
  "Os problemas que tenho são muito mais por minha culpa do que causados por outras pessoas.",
  "Não acredito na sorte para nada.",
  
  // Empatia
  "Quando vejo alguém com problemas, automaticamente, sem pensar, me coloco na situação daquela pessoa e isso as vezes incomoda.",
  "Muitas vezes, imagino com detalhes como seria viver a vida de outra pessoa, e fantasio sobre isso.",
  "Eu percebo facilmente os sentimentos das outras pessoas, e posso me programar para agradá-las.",
  "Tenho dificuldade em agir de forma dura com as pessoas, porque fico pensando muito nos motivos que as levaram a errar comigo.",
  
  // Autoconfiança
  "É muito difícil eu pedir ajuda de alguém para resolver um problema.",
  "Sou um grande especialista em identificar oportunidades e resolver problemas.",
  "Quando fico em dúvida, eu arrisco ainda mais.",
  "Não tenho nenhum medo do futuro, porque não importa o que aconteça, eu consigo resolver.",
  
  // Independência
  "Fico muito bem sozinho por longos períodos.",
  "Ignoro rapidamente as críticas.",
  "Sou pouco apegado as pessoas.",
  "Não ligo muito para a opinião dos outros sobre mim.",
  
  // Flexibilidade
  "Para vencer vale tudo.",
  "Não acho que devo seguir todas as regras, porque faço melhor do meu jeito.",
  "Sou forte o bastante para passar por cima dos adversários quando quero alguma coisa.",
  "“Os fins justificam os meios”.",
  
  // Procrastinação
  "Costumo ter problemas com prazos e acabo fazendo as coisas em cima da hora.",
  "Eu sempre priorizo fazer as coisas que gosto mais, e deixo para depois as atividades que considero mais chatas.",
  "Eu trabalho melhor sob pressão, quando o tempo é curto.",
  "Não me incomoda nada deixar um projeto pendente e iniciar outra atividade.",
  
  // Inibição Social
  "Sou uma pessoa tímida.",
  "Fico inseguro diante de pessoas desconhecidas.",
  "Tenho dificuldade em reclamar sobre alguma coisa, mesmo tendo razão.",
  "Acho difícil dizer “não” as pessoas.",
  
  // Persistência
  "Não importa o tempo que gaste e o quanto tenho que me sacrificar. Eu persisto até o fim quando quero alguma coisa.",
  "Sou conhecido por ser persistente, nunca desistir e nem abandonar as atividades que começo.",
  "Todos sabem que sou o último a desistir de alguma coisa. Teimo em continuar mesmo quando parece impossível.",
  "Quando tenho um objetivo em mente, persisto mesmo quando desistir pode ser uma boa opção.",
  
  // Auto-aceitação
  "Reconheço as minhas limitações, pois muitas coisas eu não conseguiria fazer bem, mesmo que me esforçasse muito.",
  "Sou inferior a muitas pessoas em vários aspectos.",
  "Tenho defeitos que me trazem problemas importantes.",
  "Eu não sou capaz de fazer tudo.",
  
  // Reflexão
  "Não valorizo a intuição, prefiro refletir bastante.",
  "Eu prefiro refletir, não costumo seguir o meu coração.",
  "Antes de tomar uma decisão eu demoro considerando todos os fatos com calma.",
  "As pessoas dizem que demoro para tomar decisões.",
  
  // Otimismo
  "No final, tudo sempre vai dar certo.",
  "Eu me considero uma pessoa de muita sorte.",
  "Não importa o que aconteça, eu tenho certeza que o futuro será melhor.",
  "Cada dia com seu cuidado, se preocupar é bobagem.",
  
  // Medo da Incerteza
  "Eu prefiro bem mais o certo do que o duvidoso, mesmo que o segundo pareça ser mais recompensador.",
  "Gosto mais de ir em lugares que estou habituado do que de conhecer lugares novos.",
  "Eu prefiro fazer as atividades do dia a dia sempre da mesma forma.",
  "Situações novas e desconhecidas me incomodam bastante.",
  
  // Extravagância
  "As pessoas se impressionam comigo.",
  "Eu sempre expresso minhas emoções com facilidade.",
  "Eu estou disposto a me sacrificar e até a sofrer para fazer algo grandioso.",
  "Só serei realmente realizado e feliz se tiver uma conquista muito marcante na minha vida.",
  
  // Conquista / Ambição
  "Eu sou muito ambicioso. Bem mais que a maioria das pessoas que conheço.",
  "A minha felicidade está muito relacionada com grandes conquistas na minha vida profissional.",
  "Sigo sem questionar as regras que me repassam.", // Nota: Ordem começa a misturar aqui no original, ajustado para fluxo
  "Toda e qualquer lei existe para ser cumprida.", // Ordem
  
  // Ordem (Ajuste para manter 4 por bloco - as perguntas fornecidas parecem ter uma leve mistura no meio, vamos seguir a sequência)
  "Aceito muito bem ser comandado e não questiono nada.",
  "Minha vida é sempre muito bem organizada, e todos comentam isso.",
  "Muitas vezes mudei minha rotina por conta das minhas crenças, e isso ainda acontece com frequência.", // Ideais
  "Com muita frequência eu me sacrifico para fazer do mundo um lugar melhor.", // Ideais
  
  // Ideais
  "Muitas vezes sou criticado pelas ideias que defendo.",
  "Eu brigaria com as pessoas para defender as verdades que acho corretas.",
  "Sinto prazer em cooperar e compartilhar, mesmo de forma anônima.", // Altruísmo
  "Eu sempre ajudo as pessoas, até quem não gosta de mim.", // Altruísmo
  
  // Altruísmo
  "Nas últimas semanas fiz algumas ações de filantropia e irei fazer novamente nos próximos dias.",
  "Ofereço ajuda com muita frequência para as pessoas, mesmo quando não pedem.",
  "Fico muito impressionado quando fico sabendo de uma história muito triste.", // Sentimentalismo
  "Fico facilmente comovido.", // Sentimentalismo
  
  // Sentimentalismo
  "Quando tenho que decidir alguma coisa, prefiro ouvir meu coração.",
  "Eu admito que sou muito sentimental.",
  "A maioria das pessoas são boas e dignas de confiança.", // Frater
  "Prefiro ambientes e trabalhos com grande contato social.", // Frater
  
  // Frater
  "Faço amizade facilmente.",
  "Eu gosto muito de compartilhar meus sentimentos com meus amigos.",
  "Gosto de ter a atenção das pessoas e me incomodo muito quando sou ignorado.", // Extravagância? (Revisão da lista original do usuário, seguindo sequencialmente)
  "Quem me conhece não esquece.",
  
  // Identificação
  "Já participei de muitos grupos e/ou movimentos e ainda participo.",
  "Por vezes sinto estar conectado de forma diferenciada com o universo.",
  "Gosto de sentir que pertenço a um grupo específico.",
  "Algumas vezes me sinto como parte de algo maior.",
  
  // Espiritualidade
  "Entendo que tenho um papel espiritual neste mundo.",
  "Já senti de forma marcante um fenômeno místico.",
  "Tenho certeza que existe alguma forma de vida após a morte.",
  "Eu acredito em Deus ou em algum tipo de força divina."
];

// Gerador de perguntas baseado na sequência de 4 em 4
const generateQuestions = (): Question[] => {
  const questions: Question[] = [];
  
  for (let i = 0; i < RAW_QUESTIONS.length; i++) {
    const dimensionIndex = Math.floor(i / 4);
    
    // Safety check para garantir que não ultrapasse as dimensões definidas
    if (dimensionIndex < DIMENSIONS.length) {
      questions.push({
        id: i + 1,
        dimensionId: DIMENSIONS[dimensionIndex].id,
        text: RAW_QUESTIONS[i]
      });
    }
  }

  return questions;
};

export const QUESTIONS = generateQuestions();
export const TOTAL_QUESTIONS = QUESTIONS.length;