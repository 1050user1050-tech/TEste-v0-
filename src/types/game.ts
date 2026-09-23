export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  }
}

export interface Stats {
  health: number;
  maxHealth: number;
  physicalAttack: number;
  physicalDefense: number;
  magicAttack: number;
  magicDefense: number;
  luck: number;
  accuracy: number;
  evasion: number;
  speed: number;
  critChance: number;
  critDamage: number;
  lifeSteal: number;
}

export interface LevelData {
  level: number;
  exp: number;
}

export interface UserSkills {
  // Combat Levels
  combat: LevelData;
  physicalAttack: LevelData;
  magicAttack: LevelData;
  hp: LevelData;
  physicalDefense: LevelData;
  magicDefense: LevelData;
  evasion: LevelData;
  speed: LevelData;

  // Profession Levels
  farmer: LevelData;
  lumberjack: LevelData;
  fisherman: LevelData;
  miner: LevelData;
  crafter: LevelData;
  metallurgist: LevelData;
  potion: LevelData;
  cook: LevelData;
  adventurer: LevelData;
  thief: LevelData;
  magic: LevelData;
  merchant: LevelData;
  knight: LevelData;
  religion: LevelData;
  carpenter: LevelData;
}

export interface UserGuild {
  id: string;
  name: string;
  rank: string;
  joinedAt: string;
}

export interface UserProfile {
  uid: string;
  displayName: string;
  level: number;
  exp: number;
  currencies: {
    silver: number;
    gold: number;
    crystal: number;
  };
  stats: Stats;
  skills: UserSkills;
  guild?: UserGuild;
  inventory: string[];
  equipped: {
    hat?: string;
    vest?: string;
    pants?: string;
    gloves?: string;
    weapon?: string;
    shield?: string;
    special?: string;
    pet?: string;
  };
  miningStats?: Record<string, number>;
  updatedAt: string;
}

export interface Item {
  id: string;
  name: string;
  description: string;
  type?: 'hat' | 'vest' | 'pants' | 'gloves' | 'weapon' | 'shield' | 'special' | 'pet' | 'item' | 'arma' | 'materia de craft';
  modifiers: Stats;
  imageUrl?: string;
  source?: string;
  rarity?: 'Comum' | 'Incomum' | 'Raro' | 'Épico' | 'Lendário' | 'Mítico';
  value?: number;
  ondeAchar?: string;
}
