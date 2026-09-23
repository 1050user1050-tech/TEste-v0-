import { useState } from 'react';
import { UserProfile } from '../types/game';
import { gameService, GAME_ITEMS } from '../services/gameService';
import { Sprout, Sparkles, TrendingUp, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface FarmActionProps {
  profile: UserProfile;
  onUpdate: () => void;
}

export function FarmAction({ profile, onUpdate }: FarmActionProps) {
  const [farming, setFarming] = useState(false);
  const [logs, setLogs] = useState<{ id: string, text: string, type: 'exp' | 'item' | 'info' }[]>([]);

  const addLog = (text: string, type: 'exp' | 'item' | 'info') => {
    setLogs(prev => [{ id: `${Date.now()}-${Math.random()}`, text, type }, ...prev].slice(0, 5));
  };

  const farm = async () => {
    if (farming) return;
    setFarming(true);

    // Calculate rewards
    const expGain = Math.floor(Math.random() * 5) + 5;
    let itemFound = null;

    // Luck check for item (10% base + luck modifier)
    const luckRoll = Math.random() * 100;
    const luckChance = 10 + (profile.stats.luck / 5);

    if (luckRoll < luckChance) {
      const rand = Math.random();
      if (rand < 0.4) {
        itemFound = GAME_ITEMS['dirt'];
      } else {
        const items = Object.values(GAME_ITEMS);
        itemFound = items[Math.floor(Math.random() * items.length)];
      }
    }

    // Update state
    const newItems = itemFound ? [...profile.inventory, itemFound.id] : profile.inventory;
    const newTotalExp = profile.exp + expGain;
    const newLevel = gameService.calculateLevelFromExp(newTotalExp);
    
    if (newLevel > profile.level) {
      addLog(`LEVEL UP! Você agora é nível ${newLevel}!`, 'info');
    }

    // Update Farmer Skill
    const currentFarmerSkill = profile.skills.farmer || { level: 1, exp: 0 };
    const newFarmerExp = currentFarmerSkill.exp + expGain;
    const newFarmerLevel = gameService.calculateLevelFromExp(newFarmerExp);

    if (newFarmerLevel > currentFarmerSkill.level) {
      addLog(`Habilidade FAZENDEIRO subiu para nível ${newFarmerLevel}!`, 'info');
    }

    const newSkills = {
      ...profile.skills,
      farmer: { level: newFarmerLevel, exp: newFarmerExp }
    };

    try {
      await gameService.updateProfile(profile.uid, {
        exp: newTotalExp,
        level: newLevel,
        inventory: newItems,
        skills: newSkills
      });
      
      addLog(`Ganhou +${expGain} EXP`, 'exp');
      if (itemFound) {
        addLog(`Encontrou: ${itemFound.name}!`, 'item');
      }
      
      onUpdate();
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => setFarming(false), 300);
    }
  };

  const currentLevelBaseTotalExp = gameService.getTotalExpForLevel(profile.level);
  const requiredIncrement = gameService.getExpForLevelIncrement(profile.level);
  const nextLevelTotalExp = currentLevelBaseTotalExp + requiredIncrement;
  const expInCurrentLevel = Math.max(0, profile.exp - currentLevelBaseTotalExp);
  const progressPercent = Math.min(100, (expInCurrentLevel / requiredIncrement) * 100);

  return (
    <div className="space-y-8">
      {/* Level Progress */}
      <div className="bg-brand-card border border-white/5 p-8 rounded-[2rem] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
        <div className="flex justify-between items-end mb-6">
          <div>
            <span className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">Character Status</span>
            <div className="text-5xl font-black text-white italic tracking-tighter mt-1">Lvl {profile.level}</div>
          </div>
          <div className="text-right">
            <span className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">Total Experience</span>
            <div className="text-sm font-mono text-emerald-400 font-bold italic">{profile.exp.toLocaleString()} <span className="opacity-30">/</span> {profile.level >= 99 ? 'MAX' : nextLevelTotalExp.toLocaleString()}</div>
          </div>
        </div>
        
        <div className="relative h-2 bg-brand-bg rounded-full overflow-hidden border border-white/5">
          <motion.div 
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-600 to-indigo-500 shadow-[0_0_10px_rgba(37,99,235,0.5)]"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Main Action Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        <div className="md:col-span-12 flex flex-col items-center">
           <div className="w-full h-48 bg-brand-bg rounded-3xl border border-white/5 flex items-center justify-center flex-col text-center p-4 relative group overflow-hidden mb-8 shadow-inner">
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.05)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity"></div>
             <div className="text-6xl mb-4 drop-shadow-2xl">🌳</div>
             <h3 className="text-2xl font-serif italic text-white">Celestial Oakwood</h3>
             <p className="text-slate-500 text-xs italic tracking-wide">An ancient tree pulsing with magical energy.</p>
          </div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            disabled={farming}
            onClick={farm}
            className={`w-full max-w-sm py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] transition-all shadow-xl ${
              farming 
                ? 'bg-brand-inner text-slate-700 pointer-events-none' 
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/20 active:scale-95'
            }`}
          >
            {farming ? 'Searching Loot...' : 'Farm Area'}
          </motion.button>
        </div>

        {/* Activity Logs */}
        <div className="md:col-span-12 w-full space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-[10px] uppercase tracking-[0.4em] font-black text-slate-500 italic">Farm Logs</h3>
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
          </div>
          
          <div className="bg-brand-card/30 border border-white/5 p-6 rounded-[2rem] font-mono text-[11px] leading-relaxed space-y-3 min-h-[160px] backdrop-blur-sm shadow-inner">
            <AnimatePresence initial={false}>
              {logs.map((log) => (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex gap-3 group"
                >
                  <span className="text-slate-600 shrink-0">[{new Date(log.id).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}]</span>
                  <span className={`italic ${
                    log.type === 'item' ? 'text-amber-400 font-bold' : 
                    log.type === 'info' ? 'text-blue-400 font-bold uppercase' : 'text-slate-400'
                  }`}>
                    {log.text}
                  </span>
                </motion.div>
              ))}
              {logs.length === 0 && (
                <p className="text-slate-700 italic">Waiting for activity...</p>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
