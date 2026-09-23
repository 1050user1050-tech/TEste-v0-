import { Item, Stats } from '../types/game';

// Helper to create empty stats for Wiki-only items
const createStats = (overrides: Partial<Stats> = {}): Stats => ({
  health: 0,
  maxHealth: 0,
  physicalAttack: 0,
  physicalDefense: 0,
  magicAttack: 0,
  magicDefense: 0,
  luck: 0,
  accuracy: 0,
  evasion: 0,
  speed: 0,
  critChance: 0,
  critDamage: 0,
  lifeSteal: 0,
  ...overrides
});

// This file is dedicated to items that appear in the Wiki.
export const WIKI_ONLY_ITEMS: Record<string, Item> = {
  'aetheliron': {
    id: 'aetheliron',
    name: 'Aetheliron (Ferro Élfico)',
    description: 'Um metal lendário com brilho prateado e leveza sobrenatural, imbuído de energia antiga da floresta selvagem. Altamente valorizado por sua capacidade de ser forjado em peças flexíveis e extremamente resistentes.',
    modifiers: createStats(),
    imageUrl: '/items/Minerio_de_Prata.png',
    ondeAchar: 'Não disponível (Ainda não implementado)'
  },
  'ignito': {
    id: 'ignito',
    name: 'Ignito (Pedra de Fogo)',
    description: 'Um minério cor-de-laranja vibrante que pulsa calor constante de forma incessante. É incrivelmente útil para forjar armas de fogo incandescentes ou servir como combustível especial de alta potência para forjas avançadas.',
    modifiers: createStats(),
    imageUrl: '/items/Minerio_de_Ouro.png',
    ondeAchar: 'Não disponível (Ainda não implementado)'
  },
  'glaciofilo': {
    id: 'glaciofilo',
    name: 'Glaciofílo (Cristal de Gelo Eterno)',
    description: 'Um cristal azul pálido, quase translúcido, que emana um frio intenso e congelante. É perfeito para criar equipamentos que causam dano elemental de gelo ou para regular a temperatura de ligas metálicas instáveis.',
    modifiers: createStats(),
    imageUrl: '/items/Minerio_de_Cobalto.png',
    ondeAchar: 'Não disponível (Ainda não implementado)'
  },
  'terralumin': {
    id: 'terralumin',
    name: 'Terralumin (Cristal da Terra)',
    description: 'Um cristal marrom robusto com veios que emitem um brilho dourado sutil e constante. Muito empregado para fortalecer as fundações de estruturas mágicas e conceder defesas intransponíveis a escudos e armaduras pesadas.',
    modifiers: createStats(),
    imageUrl: '/items/Minerio_de_Ferro.png',
    ondeAchar: 'Não disponível (Ainda não implementado)'
  },
  'aeraphyre': {
    id: 'aeraphyre',
    name: 'Aeraphyre (Vidro de Vento)',
    description: 'Um material fino e vítreo, contudo incrivelmente resistente a impactos. Torvelinhos de correntes de ar sopram continuamente em seu interior, tornando-o o componente ideal para flechas aerodinâmicas e botas que aumentam a velocidade.',
    modifiers: createStats(),
    imageUrl: '/items/Minerio_de_Cobalto.png',
    ondeAchar: 'Não disponível (Ainda não implementado)'
  },
  'mythrilite': {
    id: 'mythrilite',
    name: 'Mythrilite (Aço Arcano)',
    description: 'Uma liga lendária composta de prata pura e cobalto refinado de alta pureza. Possui uma condutividade mágica sem precedentes, permitindo que encantamentos de alta complexidade fluam sem qualquer resistência pelas runas de forja.',
    modifiers: createStats(),
    imageUrl: '/items/Minerio_de_Platina.png',
    ondeAchar: 'Não disponível (Ainda não implementado)'
  },
  'shadowsteel': {
    id: 'shadowsteel',
    name: 'Shadowsteel (Aço das Sombras)',
    description: 'Um metal de coloração preta e aspecto fosco absoluto que absorve a luz ambiente ao seu redor. É altamente cobiçado para a confecção de armaduras e ferramentas destinadas ao sigilo, infiltração e movimentos rápidos.',
    modifiers: createStats(),
    imageUrl: '/items/Minerio_de_Ferro.png',
    ondeAchar: 'Não disponível (Ainda não implementado)'
  },
  'starmetal': {
    id: 'starmetal',
    name: 'Starmetal (Metal Estellar)',
    description: 'Um metal refinado de tom azul-escuro pontilhado por fragmentos reluzentes que imitam o brilho estelar. Diz-se que este material precioso caiu diretamente do céu noturno, carregando consigo propriedades cósmicas e gravitacionais.',
    modifiers: createStats(),
    imageUrl: '/items/Minerio_de_Platina.png',
    ondeAchar: 'Não disponível (Ainda não implementado)'
  },
  'celestialite': {
    id: 'celestialite',
    name: 'Celestialite (Pedra dos Deuses)',
    description: 'Um cristal de brancura sublime e pureza inigualável que emite uma aura radiante e reconfortante. É utilizado em rituais sagrados para purificar itens amaldiçoados e como núcleo divino no forjamento de equipamentos reluzentes.',
    modifiers: createStats(),
    imageUrl: '/items/Minerio_de_Prata.png',
    ondeAchar: 'Não disponível (Ainda não implementado)'
  },
  'aetherium': {
    id: 'aetherium',
    name: 'Aetherium (Pedra Etérea)',
    description: 'Uma substância semitransparente e semilíquida que desafia a gravidade, flutuando sutilmente se deixada livre. Capaz de se sintonizar diretamente com o plano espiritual, facilitando a criação de artefatos que reduzem peso.',
    modifiers: createStats(),
    imageUrl: '/items/Minerio_de_Cobalto.png',
    ondeAchar: 'Não disponível (Ainda não implementado)'
  },
  'draconyx': {
    id: 'draconyx',
    name: 'Draconyx (Cristal do Dragão)',
    description: 'Uma gema extremamente robusta cuja textura e brilho assemelham-se perfeitamente a uma escama de dragão ancestral. Possui energia elemental pura e indomável pulsando em seu âmago, manifestada ao ser lapilada.',
    modifiers: createStats(),
    imageUrl: '/items/Minerio_de_Ouro.png',
    ondeAchar: 'Não disponível (Ainda não implementado)'
  },
  'soulshard': {
    id: 'soulshard',
    name: 'Soulshard (Caco de Alma)',
    description: 'Um cristal resplandecente que tem o poder de reter a energia espiritual residual de criaturas derrotadas. É o componente vital para alimentar e programar autômatos magitech de alta fidelidade.',
    modifiers: createStats(),
    imageUrl: '/items/Minerio_de_Prata.png',
    ondeAchar: 'Não disponível (Ainda não implementado)'
  },
  'veridian': {
    id: 'veridian',
    name: 'Veridian (Esmeralda Mágica)',
    description: 'Uma gema rara com tonalidade esverdeada brilhante que amplifica de forma exponencial energias vitais e processos de regeneração. Muito usada em elixires de grande poder e báculos lendários de cura.',
    modifiers: createStats(),
    imageUrl: '/items/Minerio_de_Prata.png',
    ondeAchar: 'Não disponível (Ainda não implementado)'
  },
  'crimsonite': {
    id: 'crimsonite',
    name: 'Crimsonite (Jaspe do Caos)',
    description: 'Uma gema vermelha-sangue atravessada por filamentos pretos irregulares e pulsantes. Ela emana uma energia mágica altamente instável e imprevisível, ideal para equipamentos com efeitos extraordinários.',
    modifiers: createStats(),
    imageUrl: '/items/Minerio_de_Ferro.png',
    ondeAchar: 'Não disponível (Ainda não implementado)'
  },
  'lumicrystal': {
    id: 'lumicrystal',
    name: 'Lumicrystal (Cristal de Luz Plena)',
    description: 'Um cristal cintilante de tom amarelado que atua como um acumulador perfeito de raios solares e luz natural pura. Muito útil para banir a escuridão persistente das masmorras e afastar criaturas sombrias.',
    modifiers: createStats(),
    imageUrl: '/items/Minerio_de_Ouro.png',
    ondeAchar: 'Não disponível (Ainda não implementado)'
  }
};
