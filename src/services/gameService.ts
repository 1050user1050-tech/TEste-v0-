import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  getDocs,
  query,
  where,
  serverTimestamp
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { UserProfile, Item, OperationType, FirestoreErrorInfo } from '../types/game';

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const isOffline = error instanceof Error && error.message.includes('the client is offline');
  const errorMsg = isOffline 
    ? "Conexão com Firestore falhou. O cliente parece estar offline." 
    : (error instanceof Error ? error.message : String(error));

  const errInfo: FirestoreErrorInfo = {
    error: errorMsg,
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export const gameService = {
  getDefaultSkills(): UserProfile['skills'] {
    const emptyLevel = () => ({ level: 1, exp: 0 });
    return {
      combat: emptyLevel(),
      physicalAttack: emptyLevel(),
      magicAttack: emptyLevel(),
      hp: emptyLevel(),
      physicalDefense: emptyLevel(),
      magicDefense: emptyLevel(),
      evasion: emptyLevel(),
      speed: emptyLevel(),
      farmer: emptyLevel(),
      lumberjack: emptyLevel(),
      fisherman: emptyLevel(),
      miner: emptyLevel(),
      crafter: emptyLevel(),
      metallurgist: emptyLevel(),
      potion: emptyLevel(),
      cook: emptyLevel(),
      adventurer: emptyLevel(),
      thief: emptyLevel(),
      magic: emptyLevel(),
      merchant: emptyLevel(),
      knight: emptyLevel(),
      religion: emptyLevel(),
      carpenter: emptyLevel()
    };
  },

  async getUserProfile(uid: string): Promise<UserProfile | null> {
    const path = `users/${uid}`;
    try {
      const docSnap = await getDoc(doc(db, path));
      if (docSnap.exists()) {
        const data = docSnap.data() as UserProfile;
        // Migration: Ensure all stats exist
        const defaultStats = this.getDefaultStats();
        data.stats = { ...defaultStats, ...data.stats };
        
        // Migration: Ensure all skills exist
        if (!data.skills) {
          data.skills = this.getDefaultSkills();
        } else {
          // Deep merge or ensure all keys exist
          const defaultSkills = this.getDefaultSkills();
          data.skills = { ...defaultSkills, ...data.skills };
        }

        // Migration: Ensure currencies exist
        if (!data.currencies) {
          data.currencies = { silver: 0, gold: 0, crystal: 0 };
        }

        // Migration: Ensure equipped exists
        if (!data.equipped) {
          data.equipped = {};
        }

        // Migration/Cleanup: Remove invalid items from inventory that might cause crashes
        if (data.inventory) {
          data.inventory = data.inventory.filter(itemId => !!GAME_ITEMS[itemId]);
        }
        
        return data;
      }
      return null;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, path);
      return null; // unreachable due to throw
    }
  },

  getDefaultStats(): UserProfile['stats'] {
    return {
      health: 1,
      maxHealth: 1,
      physicalAttack: 1,
      physicalDefense: 0,
      magicAttack: 0,
      magicDefense: 0,
      luck: 0,
      accuracy: 1,
      evasion: 0,
      speed: 1,
      critChance: 0,
      critDamage: 0,
      lifeSteal: 0
    };
  },

  async createUserProfile(uid: string, displayName: string): Promise<UserProfile> {
    const path = `users/${uid}`;
    const initialProfile: UserProfile = {
      uid,
      displayName,
      level: 1,
      exp: 0,
      currencies: {
        silver: 100,
        gold: 10,
        crystal: 0
      },
      stats: this.getDefaultStats(),
      skills: this.getDefaultSkills(),
      inventory: ['wooden_sword_basic'],
      equipped: {
        weapon: 'wooden_sword_basic'
      },
      updatedAt: serverTimestamp() as any
    };

    try {
      await setDoc(doc(db, path), initialProfile);
      return initialProfile;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
      throw error;
    }
  },

  async updateProfile(uid: string, updates: Partial<UserProfile>): Promise<void> {
    const path = `users/${uid}`;
    try {
      await updateDoc(doc(db, path), {
        ...updates,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  },

  async getItems(): Promise<Item[]> {
    const path = 'items';
    try {
      const querySnapshot = await getDocs(collection(db, path));
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Item));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
      return [];
    }
  },

  // Leveling Utilities
  getExpForLevelIncrement(level: number): number {
    if (level <= 0) return 0;
    if (level === 1) return 100;
    
    // f(n) = f(n-1) + (n * 10) + (f(n-1) * 0.1)
    const prevIncrement = this.getExpForLevelIncrement(level - 1);
    return Math.floor(prevIncrement + (level * 10) + (prevIncrement * 0.1));
  },

  getTotalExpForLevel(level: number): number {
    let total = 0;
    for (let i = 1; i < level; i++) {
        total += this.getExpForLevelIncrement(i);
    }
    return total;
  },

  calculateLevelFromExp(totalExp: number): number {
    let level = 1;
    const MAX_LEVEL = 99;
    while (level < MAX_LEVEL) {
      const nextLevelTotalExp = this.getTotalExpForLevel(level + 1);
      if (totalExp >= nextLevelTotalExp) {
        level++;
      } else {
        break;
      }
    }
    return level;
  },

  formatLargeNumber(num: number): string {
    if (num < 1000) return num.toString();
    if (num < 1000000) return `${(num / 1000).toFixed(1).replace(/\.0$/, '')}k`;
    if (num < 1000000000) return `${(num / 1000000).toFixed(1).replace(/\.0$/, '')}kk`;
    return `${(num / 1000000000).toFixed(1).replace(/\.0$/, '')}b`;
  }
};

// Helper to create empty stats
const createStats = (overrides: Partial<Item['modifiers']> = {}): Item['modifiers'] => ({
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

// Hardcoded starter items since we can't easily seed Firestore via this tool
export const GAME_ITEMS: Record<string, Item> = {
  'wooden_sword_basic': {
    id: 'wooden_sword_basic',
    name: 'Espada Básica de Madeira',
    description: 'A espada mais básica de todas',
    type: 'arma',
    modifiers: createStats({ physicalAttack: 5 }),
    imageUrl: '/items/Espada%20de%20Madeira.png',
    source: 'Estação de Trabalho',
    rarity: 'Comum',
    value: 50
  },
  'wood_plank': {
    id: 'wood_plank',
    name: 'Tábua de Madeira',
    description: 'Uma tábua de madeira lixada e pronta para uso.',
    modifiers: createStats(),
    imageUrl: '/items/Tabua%20de%20Madeira.png',
    source: 'Estação de Trabalho'
  },
  'dirt': {
    id: 'dirt',
    name: 'Terra',
    description: 'Um punhado de terra fértil.',
    modifiers: createStats(),
    imageUrl: '/items/Terra.png',
    source: 'Fazenda / Exploração',
    ondeAchar: 'Mina'
  },
  'stone': {
    id: 'stone',
    name: 'Pedra',
    description: 'Uma pedra comum encontrada em abundância.',
    modifiers: createStats(),
    imageUrl: '/items/Pedra.png',
    source: 'Mineração / Cavernas',
    ondeAchar: 'Mina'
  },
  'cascalho': {
    id: 'cascalho',
    name: 'Cascalho',
    description: 'Um amontoado de pequenas pedras e areia grossa.',
    modifiers: createStats(),
    imageUrl: '/items/Pedra.png',
    source: 'Mineração / Cavernas',
    ondeAchar: 'Mina'
  },
  'calcario': {
    id: 'calcario',
    name: 'Calcario',
    description: 'Rocha calcária sedimentar muito útil para processos metalúrgicos.',
    modifiers: createStats(),
    imageUrl: '/items/Pedra.png',
    source: 'Mineração / Cavernas'
  },
  'coal': {
    id: 'coal',
    name: 'Minerio de Carvão',
    description: 'Um pedaço de mineral fóssil usado como combustível.',
    modifiers: createStats(),
    imageUrl: '/items/Carvao.png',
    source: 'Mineração / Cavernas'
  },
  'copper_ore': {
    id: 'copper_ore',
    name: 'Minerio de Cobre',
    description: 'Minério de cobre bruto com coloração avermelhada característica.',
    modifiers: createStats(),
    imageUrl: '/items/Minerio%20de%20Cobre.png',
    source: 'Mineração / Cavernas'
  },
  'iron_ore': {
    id: 'iron_ore',
    name: 'Minerio de Ferro',
    description: 'Um pedaço de ferro bruto extraído das cavernas.',
    modifiers: createStats(),
    imageUrl: '/items/Minerio%20de%20Ferro.png',
    source: 'Cavernas / Mineração'
  },
  'basalt': {
    id: 'basalt',
    name: 'Basalto',
    description: 'Uma rocha vulcânica extremamente densa e escura.',
    modifiers: createStats(),
    imageUrl: '/items/Pedra.png',
    source: 'Mineração / Cavernas'
  },
  'silver_ore': {
    id: 'silver_ore',
    name: 'Minerio de Prata',
    description: 'Um minério brilhante que contém pureza considerável de prata.',
    modifiers: createStats(),
    imageUrl: '/items/Minerio%20de%20Prata.png',
    source: 'Mineração / Cavernas'
  },
  'gold_ore': {
    id: 'gold_ore',
    name: 'Minerio de Ouro',
    description: 'Minério de ouro bruto, reluzente e valioso por si só.',
    modifiers: createStats(),
    imageUrl: '/items/Minerio%20de%20Ouro.png',
    source: 'Mineração / Cavernas'
  },
  'sapphire_ore': {
    id: 'sapphire_ore',
    name: 'Minerio de safira',
    description: 'Minério rico em safiras de coloração azulada.',
    modifiers: createStats(),
    imageUrl: '/items/Gema%20Preciosa.png',
    source: 'Mineração / Cavernas'
  },
  'emerald_ore': {
    id: 'emerald_ore',
    name: 'Minerio de Esmeralda',
    description: 'Um pedaço de rocha densa com cristais de esmeralda incrustados.',
    modifiers: createStats(),
    imageUrl: '/items/Gema%20Preciosa.png',
    source: 'Mineração / Cavernas'
  },
  'ruby_ore': {
    id: 'ruby_ore',
    name: 'Minerio De Ruby',
    description: 'Um belo minério com cristais de rubi de cor carmesim intensa.',
    modifiers: createStats(),
    imageUrl: '/items/Gema%20Preciosa.png',
    source: 'Mineração / Cavernas'
  },
  'platinum_ore': {
    id: 'platinum_ore',
    name: 'Minerio de Platina',
    description: 'Um mineral prateado extremamente raro e resistente.',
    modifiers: createStats(),
    imageUrl: '/items/Minerio%20de%20Platina.png',
    source: 'Mineração / Cavernas'
  },
  'cobalt_ore': {
    id: 'cobalt_ore',
    name: 'Minerio de Cobalto',
    description: 'Um brilhante minério azulado, conhecido por sua alta dureza.',
    modifiers: createStats(),
    imageUrl: '/items/Minerio%20de%20Cobalto.png',
    source: 'Mineração / Cavernas'
  },
  'obsidian': {
    id: 'obsidian',
    name: 'Obsidian',
    description: 'Vidro vulcânico escuro formado pelo resfriamento rápido de lava.',
    modifiers: createStats(),
    imageUrl: '/items/Pedra.png',
    source: 'Mineração / Cavernas'
  },
  'diamond_ore': {
    id: 'diamond_ore',
    name: 'Minerio de Diamante',
    description: 'A joia mais resistente e brilhante que pode ser extraída da rocha.',
    modifiers: createStats(),
    imageUrl: '/items/Gema%20Preciosa.png',
    source: 'Mineração / Cavernas'
  },
  'yodo_ore': {
    id: 'yodo_ore',
    name: 'Minerio de Yodo',
    description: 'Mineral de iodo raro, com brilho metálico e coloração escura.',
    modifiers: createStats(),
    imageUrl: '/items/Pedra.png',
    source: 'Mineração / Cavernas'
  },
  'gemstone': {
    id: 'gemstone',
    name: 'Gema Preciosa',
    description: 'Uma pedra preciosa brilhante e rara.',
    modifiers: createStats(),
    imageUrl: '/items/Gema%20Preciosa.png',
    source: 'Mineração / Cavernas'
  },
  'crystal_shard': {
    id: 'crystal_shard',
    name: 'Fragmento de Cristal',
    description: 'Um fragmento de cristal que emana uma energia suave.',
    modifiers: createStats(),
    imageUrl: '/items/Fragmento%20de%20Cristal.png',
    source: 'Zona Abissal'
  }
};
