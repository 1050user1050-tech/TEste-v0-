import { useState, useEffect } from 'react';
import { UserProfile, Stats } from '../types/game';
import { calculateTotalStat } from './Game';
import { GAME_ITEMS, gameService } from '../services/gameService';
import { 
  Swords, 
  Shield, 
  Sparkles, 
  Database, 
  Globe, 
  Heart, 
  Zap, 
  Compass, 
  ShieldAlert,
  ShieldCheck, 
  Flame, 
  Droplets,
  Trophy,
  Sprout,
  Trees,
  Waves,
  Pickaxe,
  Cog,
  Anvil,
  FlaskConical,
  ChefHat,
  VenetianMask,
  Wand2,
  Coins,
  ShieldCheck as KnightIcon,
  Church,
  Hammer,
  GraduationCap
} from 'lucide-react';
import { motion } from 'motion/react';

interface ProfileStatsProps {
  profile: UserProfile;
}

export function ProfileStats({ profile }: ProfileStatsProps) {
  const [gender, setGender] = useState<'masculino' | 'feminino'>(() => {
    try {
      const saved = localStorage.getItem('character_gender');
      return (saved === 'feminino' || saved === 'masculino') ? saved : 'masculino';
    } catch {
      return 'masculino';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('character_gender', gender);
    } catch (e) {
      console.error(e);
    }
  }, [gender]);

  const combatStats = [
    { label: 'Phys. Attack', key: 'physicalAttack', icon: Swords, color: 'bg-rose-500', text: 'text-rose-400' },
    { label: 'Magic Attack', key: 'magicAttack', icon: Flame, color: 'bg-amber-500', text: 'text-amber-400' },
    { label: 'Accuracy', key: 'accuracy', icon: Compass, color: 'bg-blue-400', text: 'text-blue-400', max: 200 },
    { label: 'Crit. Chance', key: 'critChance', icon: Zap, color: 'bg-yellow-400', text: 'text-yellow-400', suffix: '%' },
    { label: 'Crit. Damage', key: 'critDamage', icon: Zap, color: 'bg-orange-500', text: 'text-orange-400', suffix: '%' },
    { label: 'Life Steal', key: 'lifeSteal', icon: Droplets, color: 'bg-pink-600', text: 'text-pink-400', suffix: '%' },
  ];

  const defenseStats = [
    { label: 'Max HP', key: 'maxHealth', icon: Heart, color: 'bg-red-500', text: 'text-red-400' },
    { label: 'Phys. Defense', key: 'physicalDefense', icon: Shield, color: 'bg-sky-500', text: 'text-sky-400' },
    { label: 'Magic Defense', key: 'magicDefense', icon: ShieldAlert, color: 'bg-indigo-500', text: 'text-indigo-400' },
    { label: 'Evasion', key: 'evasion', icon: Sparkles, color: 'bg-emerald-400', text: 'text-emerald-400', suffix: '%' },
    { label: 'Luck', key: 'luck', icon: Sparkles, color: 'bg-purple-400', text: 'text-purple-400' },
    { label: 'Speed', key: 'speed', icon: Zap, color: 'bg-teal-400', text: 'text-teal-400' },
  ];

  const combatSkills = [
    { label: 'Combate', key: 'combat', icon: Trophy },
    { label: 'Atq. Físico', key: 'physicalAttack', icon: Swords },
    { label: 'Atq. Mágico', key: 'magicAttack', icon: Flame },
    { label: 'Vida (HP)', key: 'hp', icon: Heart },
    { label: 'Def. Física', key: 'physicalDefense', icon: Shield },
    { label: 'Def. Mágica', key: 'magicDefense', icon: ShieldAlert },
    { label: 'Evasão', key: 'evasion', icon: Sparkles },
    { label: 'Velocidade', key: 'speed', icon: Zap },
  ];

  const professionSkills = [
    { label: 'Fazendeiro', key: 'farmer', icon: Sprout },
    { label: 'Lenhador', key: 'lumberjack', icon: Trees },
    { label: 'Pescador', key: 'fisherman', icon: Waves },
    { label: 'Minerador', key: 'miner', icon: Pickaxe },
    { label: 'Artesão', key: 'crafter', icon: Cog },
    { label: 'Metalúrgico', key: 'metallurgist', icon: Zap },
    { label: 'Poções', key: 'potion', icon: FlaskConical },
    { label: 'Cozinheiro', key: 'cook', icon: ChefHat },
    { label: 'Aventureiro', key: 'adventurer', icon: Compass },
    { label: 'Ladrão', key: 'thief', icon: VenetianMask },
    { label: 'Magia', key: 'magic', icon: Wand2 },
    { label: 'Mercador', key: 'merchant', icon: Coins },
    { label: 'Cavaleiro', key: 'knight', icon: KnightIcon },
    { label: 'Religião', key: 'religion', icon: Church },
    { label: 'Carpinteiro', key: 'carpenter', icon: Hammer },
  ];

  const slots = [
    { type: 'hat', icon: '👒' },
    { type: 'vest', icon: '👕' },
    { type: 'pants', icon: '👖' },
    { type: 'gloves', icon: '🧤' },
    { type: 'weapon', icon: '⚔️' },
    { type: 'shield', icon: '🛡️' },
    { type: 'special', icon: '✨' },
    { type: 'pet', icon: '🐾' },
  ];

  const renderSkillLevel = (skill: any) => {
    const levelData = profile.skills?.[skill.key as keyof typeof profile.skills] || { level: 1, exp: 0 };
    const level = levelData.level;
    const totalExp = levelData.exp;
    
    // Leveling Logic Constants
    const MAX_LEVEL = 99;
    
    // Current level threshold (total exp at start of this level)
    const currentLevelBaseTotalExp = gameService.getTotalExpForLevel(level);
    // XP increment needed for this specific level (e.g., L1 -> L2 needs 100)
    const requiredIncrement = gameService.getExpForLevelIncrement(level);
    // Next level threshold (total exp needed to reach level+1)
    const nextLevelTotalExp = currentLevelBaseTotalExp + requiredIncrement;
    
    // Progress calculation
    const expInCurrentLevel = Math.max(0, totalExp - currentLevelBaseTotalExp);
    const progress = level >= MAX_LEVEL ? 100 : Math.min(100, (expInCurrentLevel / requiredIncrement) * 100);

    return (
      <div key={skill.key} className="bg-brand-inner/20 border border-white/5 p-4 rounded-xl flex items-center gap-4">
        <div className="w-10 h-10 rounded-lg bg-brand-inner flex items-center justify-center text-blue-400 shrink-0 shadow-inner">
           <skill.icon size={18} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
             <span className="text-[10px] font-black uppercase tracking-wider text-slate-300 truncate">{skill.label}</span>
             <span className="text-[10px] font-black text-blue-400">Nív. {level} {level >= MAX_LEVEL ? '(MAX)' : ''}</span>
          </div>
          <div className="h-1.5 bg-brand-inner rounded-full overflow-hidden border border-white/5">
             <motion.div 
               initial={{ width: 0 }}
               animate={{ width: `${progress}%` }}
               className={`h-full rounded-full ${level >= MAX_LEVEL ? 'bg-amber-500' : 'bg-blue-500'}`}
             />
          </div>
          <div className="flex justify-between mt-1">
             <span className="text-[8px] font-bold text-slate-600 uppercase italic">Exp Histórica</span>
             <span className="text-[8px] font-mono text-slate-500">
               {totalExp.toLocaleString()} / {level >= MAX_LEVEL ? '∞' : nextLevelTotalExp.toLocaleString()}
             </span>
          </div>
        </div>
      </div>
    );
  };

  const renderStatGroup = (title: string, group: any[]) => (
    <div className="space-y-4">
      <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-500 italic px-4">{title}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {group.map((stat) => {
          const baseValue = profile.stats[stat.key as keyof Stats];
          const base = (typeof baseValue === 'number' && !isNaN(baseValue)) ? baseValue : 0;
          const total = calculateTotalStat(profile, stat.key as keyof Stats);
          const bonus = total - base;
          const hasBonus = !isNaN(bonus) && bonus !== 0;
          
          return (
            <motion.div
              key={stat.key}
              whileHover={{ x: 5 }}
              className="p-5 bg-brand-card border border-white/5 rounded-2xl flex items-center justify-between shadow-lg"
            >
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-lg bg-white/5 ${stat.text}`}>
                   <stat.icon size={16} />
                </div>
                <div>
                  <p className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">{stat.label}</p>
                  <p className="text-lg font-black text-white italic tracking-tighter">
                    {isNaN(total) ? 0 : total}{stat.suffix}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[8px] font-mono text-slate-600 block">BASE {base}</span>
                {hasBonus && (
                  <span className={`text-[10px] font-black ${bonus > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {bonus > 0 ? '+' : ''}{bonus}
                  </span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="space-y-12">
      {/* Header Info */}
      <div className="bg-brand-card border border-white/5 p-10 rounded-[2.5rem] flex flex-col items-center text-center overflow-hidden relative shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.1)_0%,transparent_70%)]"></div>
        
        <div className="relative mb-8">
           <button
             onClick={() => setGender(prev => prev === 'masculino' ? 'feminino' : 'masculino')}
             className="aspect-square w-48 bg-brand-inner rounded-full border-[8px] border-brand-bg flex items-center justify-center overflow-hidden relative group shadow-2xl z-10 transition-transform active:scale-95 cursor-pointer focus:outline-none"
             title="Clique para alternar o gênero"
           >
              <div className="absolute inset-0 bg-gradient-to-t from-brand-bg/80 via-brand-bg/20 to-transparent"></div>
              
              {/* Hover state toggle indicator */}
              <div className="absolute inset-0 bg-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white text-[9px] font-black uppercase tracking-wider bg-black/50 px-3 py-1.5 rounded-full backdrop-blur-sm shadow-xl border border-white/10 z-20">
                  Alternar Gênero
                </span>
              </div>
              
              <img 
                src={gender === 'masculino' ? '/personagens/Masculino.png' : '/personagens/Feminino.png'} 
                alt={gender} 
                className="w-full h-full object-contain scale-150 z-10 relative drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const fb = e.currentTarget.parentElement?.querySelector('.fallback-emoji') as HTMLElement;
                  if (fb) {
                    fb.style.display = 'block';
                  }
                }}
              />
              
              <span className="text-8xl drop-shadow-2xl z-10 fallback-emoji" style={{ display: 'none' }}>
                {gender === 'masculino' ? '🧑🌾' : '👩🌾'}
              </span>
           </button>

            {slots.map((slot, i) => {
              const equippedId = (profile.equipped as any)[slot.type];
              const item = equippedId ? GAME_ITEMS[equippedId] : null;
              const angle = (i / slots.length) * (2 * Math.PI);
              const x = Math.cos(angle) * 120;
              const y = Math.sin(angle) * 120;
              
              return (
                <motion.div
                  key={slot.type}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1, x, y }}
                  transition={{ delay: 0.5 + (i * 0.05), type: 'spring' }}
                  className={`absolute top-1/2 left-1/2 -ml-6 -mt-6 w-12 h-12 rounded-xl border flex items-center justify-center shadow-lg backdrop-blur-md transition-colors overflow-hidden ${
                    equippedId ? 'bg-blue-500/20 border-blue-500/50 text-white' : 'bg-brand-inner/40 border-white/5 text-slate-800'
                  }`}
                >
                   {item && item.imageUrl ? (
                     <img src={item.imageUrl} alt={item.name} className="w-full h-full object-contain p-2" />
                   ) : (
                     <span className={`text-xl ${!equippedId ? 'grayscale opacity-20' : ''}`}>
                        {slot.icon}
                     </span>
                   )}
                </motion.div>
              );
           })}
        </div>

        {/* Gender Selection Segmented Controls */}
        <div className="flex bg-brand-inner/60 p-1 rounded-full border border-white/5 shadow-inner mt-4 z-10 gap-1 select-none">
          <button
            onClick={() => setGender('masculino')}
            className={`px-4.5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer flex items-center gap-1.5 ${
              gender === 'masculino'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <span>♂️</span> Homem
          </button>
          <button
            onClick={() => setGender('feminino')}
            className={`px-4.5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer flex items-center gap-1.5 ${
              gender === 'feminino'
                ? 'bg-pink-600 text-white shadow-lg'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <span>♀️</span> Mulher
          </button>
        </div>
        
        <div className="z-10 mt-8">
          <h2 className="text-4xl font-black text-white italic tracking-tighter">{profile.displayName}</h2>
          <div className="flex items-center justify-center gap-4 mt-3">
            <span className="px-3 py-1 bg-blue-500/10 text-blue-400 text-[10px] font-black uppercase rounded-full tracking-[0.2em] border border-blue-500/20 shadow-lg">
              Rank {profile.level}
            </span>
            <span className="text-slate-500 text-[10px] uppercase font-black tracking-widest italic">
              Celestial Farmer
            </span>
          </div>
        </div>
      </div>

      {/* Grid of Stat Groups */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {renderStatGroup("Combat Matrix", combatStats)}
        {renderStatGroup("Aura & Vitality", defenseStats)}
      </div>

      {/* Combat Skill Levels */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-4">
          <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-500 italic">Evolução de Combate</h3>
          <span className="text-[8px] font-black uppercase text-blue-500 tracking-widest">Níveis de Habilidade</span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {combatSkills.map(renderSkillLevel)}
        </div>
      </div>

      {/* Profession Skill Levels */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-4">
          <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-500 italic">Evolução de Profissões</h3>
          <span className="text-[8px] font-black uppercase text-amber-500 tracking-widest">Níveis de Carreira</span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {professionSkills.map(renderSkillLevel)}
        </div>
      </div>

      {/* Cloud Metadata */}
      <div className="bg-brand-card/50 border border-white/5 p-8 rounded-[2rem] flex flex-col md:flex-row items-center justify-between gap-6 backdrop-blur-sm">
         <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-inner flex items-center justify-center text-blue-400 shadow-inner">
               <Database size={20} />
            </div>
            <div>
               <p className="text-[10px] uppercase font-black text-slate-500 tracking-widest">Distributed Ledger</p>
               <p className="text-xs font-mono text-slate-400 italic">ID: {profile.uid.slice(0, 16)}...</p>
            </div>
         </div>
         <div className="flex items-center gap-4">
            <Globe className="text-emerald-500 animate-pulse" size={20} />
            <div className="text-right flex flex-col items-end">
               <p className="text-[10px] uppercase font-black text-slate-500 tracking-widest">Region Node</p>
               <p className="text-xs font-bold text-white uppercase italic tracking-tighter">US-EAST-1_CLUSTER</p>
            </div>
         </div>
      </div>
    </div>
  );
}
