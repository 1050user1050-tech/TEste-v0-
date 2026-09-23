import { useState, useEffect, useRef } from 'react';
import { UserProfile } from '../types/game';
import { gameService, GAME_ITEMS } from '../services/gameService';
import { Pickaxe, Timer, Package, Gem, Zap, Lock, RotateCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(' ');
}

interface MiningActionProps {
  profile: UserProfile;
  onUpdate: () => void;
}

export function MiningAction({ profile, onUpdate }: MiningActionProps) {
  const [mining, setMining] = useState(false);
  const [activeSpot, setActiveSpot] = useState<number | null>(null);
  const [showChances, setShowChances] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<{ id: string, text: string, type: 'exp' | 'item' | 'info' }[]>([]);
  const [debugUnlocked, setDebugUnlocked] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const generateMiningSpots = () => {
    return [
      {
        id: 1,
        name: "Solo Superficial",
        description: "Região inicial cheia de terra macia, cascalho e pedras comuns.",
        levelRequired: 1,
        time: 5,
        icon: "🌱",
        drops: [
          { id: 'dirt', name: 'Terra', chance: 70, xp: 1 },
          { id: 'stone', name: 'Pedra', chance: 20, xp: 2 },
          { id: 'cascalho', name: 'Cascalho', chance: 10, xp: 3 }
        ]
      },
      {
        id: 5,
        name: "Pedreira Rasa",
        description: "Depósito de pedras e cascalho logo abaixo da camada de terra fértil.",
        levelRequired: 5,
        time: 6,
        icon: "🪨",
        drops: [
          { id: 'stone', name: 'Pedra', chance: 60, xp: 3 },
          { id: 'cascalho', name: 'Cascalho', chance: 30, xp: 4 },
          { id: 'calcario', name: 'Calcario', chance: 10, xp: 5 }
        ]
      },
      {
        id: 10,
        name: "Caverna Calcária",
        description: "Estruturas rochosas antigas ricas em depósitos de calcário e carvão minerado.",
        levelRequired: 10,
        time: 7,
        icon: "🐚",
        drops: [
          { id: 'calcario', name: 'Calcario', chance: 60, xp: 6 },
          { id: 'stone', name: 'Pedra', chance: 25, xp: 4 },
          { id: 'coal', name: 'Minerio de Carvão', chance: 15, xp: 8 }
        ]
      },
      {
        id: 15,
        name: "Mina de Carvão",
        description: "Antiga galeria de extração com veios abundantes de minério de carvão.",
        levelRequired: 15,
        time: 8,
        icon: "🌑",
        drops: [
          { id: 'coal', name: 'Minerio de Carvão', chance: 65, xp: 10 },
          { id: 'calcario', name: 'Calcario', chance: 25, xp: 7 },
          { id: 'copper_ore', name: 'Minerio de Cobre', chance: 10, xp: 12 }
        ]
      },
      {
        id: 20,
        name: "Filão de Cobre",
        description: "Rocha rica em cobre, com veios brilhantes avermelhados cruzando a pedra.",
        levelRequired: 20,
        time: 9,
        icon: "🟠",
        drops: [
          { id: 'copper_ore', name: 'Minerio de Cobre', chance: 60, xp: 14 },
          { id: 'coal', name: 'Minerio de Carvão', chance: 25, xp: 11 },
          { id: 'iron_ore', name: 'Minerio de Ferro', chance: 15, xp: 16 }
        ]
      },
      {
        id: 25,
        name: "Mina de Ferro",
        description: "Caverna densa onde blocos pesados de minério de ferro cobrem as paredes.",
        levelRequired: 25,
        time: 10,
        icon: "⛏️",
        drops: [
          { id: 'iron_ore', name: 'Minerio de Ferro', chance: 60, xp: 18 },
          { id: 'copper_ore', name: 'Minerio de Cobre', chance: 25, xp: 15 },
          { id: 'basalt', name: 'Basalto', chance: 15, xp: 20 }
        ]
      },
      {
        id: 30,
        name: "Depósitos de Basalto",
        description: "Muralhas escuras de basalto vulcânico de altíssima dureza.",
        levelRequired: 30,
        time: 11,
        icon: "🌋",
        drops: [
          { id: 'basalt', name: 'Basalto', chance: 60, xp: 22 },
          { id: 'iron_ore', name: 'Minerio de Ferro', chance: 25, xp: 19 },
          { id: 'silver_ore', name: 'Minerio de Prata', chance: 15, xp: 25 }
        ]
      },
      {
        id: 35,
        name: "Filão de Prata",
        description: "Regiões subterrâneas frias onde a prata brilha sob a luz da lanterna.",
        levelRequired: 35,
        time: 12,
        icon: "⚪",
        drops: [
          { id: 'silver_ore', name: 'Minerio de Prata', chance: 60, xp: 28 },
          { id: 'basalt', name: 'Basalto', chance: 25, xp: 23 },
          { id: 'gold_ore', name: 'Minerio de Ouro', chance: 15, xp: 32 }
        ]
      },
      {
        id: 40,
        name: "Caverna de Ouro",
        description: "Galeria de rochas reluzentes com veios puros de minério de ouro.",
        levelRequired: 40,
        time: 13,
        icon: "🪙",
        drops: [
          { id: 'gold_ore', name: 'Minerio de Ouro', chance: 60, xp: 35 },
          { id: 'silver_ore', name: 'Minerio de Prata', chance: 25, xp: 30 },
          { id: 'sapphire_ore', name: 'Minerio de safira', chance: 15, xp: 42 }
        ]
      },
      {
        id: 45,
        name: "Caverna de Safiras",
        description: "Câmara repleta de cristais lapidares azuis e formações de safira bruta.",
        levelRequired: 45,
        time: 14,
        icon: "🔵",
        drops: [
          { id: 'sapphire_ore', name: 'Minerio de safira', chance: 60, xp: 45 },
          { id: 'gold_ore', name: 'Minerio de Ouro', chance: 25, xp: 38 },
          { id: 'emerald_ore', name: 'Minerio de Esmeralda', chance: 15, xp: 52 }
        ]
      },
      {
        id: 50,
        name: "Depósitos de Esmeraldas",
        description: "As paredes cintilam em verde esmeralda em uma fenda de temperatura úmida.",
        levelRequired: 50,
        time: 15,
        icon: "🟢",
        drops: [
          { id: 'emerald_ore', name: 'Minerio de Esmeralda', chance: 60, xp: 55 },
          { id: 'sapphire_ore', name: 'Minerio de safira', chance: 25, xp: 48 },
          { id: 'ruby_ore', name: 'Minerio De Ruby', chance: 15, xp: 62 }
        ]
      },
      {
        id: 55,
        name: "Vale do Rubi",
        description: "Uma caverna profunda esculpida por canais termais, rica em cristais vermelhos.",
        levelRequired: 55,
        time: 16,
        icon: "🔴",
        drops: [
          { id: 'ruby_ore', name: 'Minerio De Ruby', chance: 60, xp: 65 },
          { id: 'emerald_ore', name: 'Minerio de Esmeralda', chance: 25, xp: 58 },
          { id: 'platinum_ore', name: 'Minerio de Platina', chance: 15, xp: 75 }
        ]
      },
      {
        id: 60,
        name: "Filão de Platina",
        description: "Regiões de pressão extrema que forjam o duríssimo minério de platina branco-metálico.",
        levelRequired: 60,
        time: 17,
        icon: "💿",
        drops: [
          { id: 'platinum_ore', name: 'Minerio de Platina', chance: 60, xp: 80 },
          { id: 'ruby_ore', name: 'Minerio De Ruby', chance: 25, xp: 68 },
          { id: 'cobalt_ore', name: 'Minerio de Cobalto', chance: 15, xp: 95 }
        ]
      },
      {
        id: 65,
        name: "Depósitos de Cobalto",
        description: "Gretas com minério de cobalto de tom azul royal metálico, muito magnetizado.",
        levelRequired: 65,
        time: 18,
        icon: "🌀",
        drops: [
          { id: 'cobalt_ore', name: 'Minerio de Cobalto', chance: 60, xp: 100 },
          { id: 'platinum_ore', name: 'Minerio de Platina', chance: 25, xp: 85 },
          { id: 'obsidian', name: 'Obsidian', chance: 15, xp: 120 }
        ]
      },
      {
        id: 70,
        name: "Fenda de Obsidiana",
        description: "Antigos vulcões extintos onde a lava resfriou rapidamente formando vidro obsidian.",
        levelRequired: 70,
        time: 19,
        icon: "🕶️",
        drops: [
          { id: 'obsidian', name: 'Obsidian', chance: 60, xp: 130 },
          { id: 'cobalt_ore', name: 'Minerio de Cobalto', chance: 25, xp: 105 },
          { id: 'diamond_ore', name: 'Minerio de Diamante', chance: 15, xp: 160 }
        ]
      },
      {
        id: 75,
        name: "Mina de Diamantes",
        description: "Paredes de rochas kimberlíticas que abrigam diamantes com brilho espetacular.",
        levelRequired: 75,
        time: 20,
        icon: "💎",
        drops: [
          { id: 'diamond_ore', name: 'Minerio de Diamante', chance: 60, xp: 180 },
          { id: 'obsidian', name: 'Obsidian', chance: 25, xp: 135 },
          { id: 'yodo_ore', name: 'Minerio de Yodo', chance: 15, xp: 220 }
        ]
      },
      {
        id: 80,
        name: "Caverna de Iodo",
        description: "Formações cristalinas salinas escuras ricas em minérios puros de iodo roxo-escuro.",
        levelRequired: 80,
        time: 21,
        icon: "🔮",
        drops: [
          { id: 'yodo_ore', name: 'Minerio de Yodo', chance: 60, xp: 240 },
          { id: 'diamond_ore', name: 'Minerio de Diamante', chance: 25, xp: 185 },
          { id: 'gemstone', name: 'Gema Preciosa', chance: 15, xp: 100 }
        ]
      },
      {
        id: 85,
        name: "Abismo de Gemas",
        description: "Depósitos geotérmicos de gemas e pedras raras integradas à rocha mãe.",
        levelRequired: 85,
        time: 22,
        icon: "👑",
        drops: [
          { id: 'gemstone', name: 'Gema Preciosa', chance: 60, xp: 150 },
          { id: 'yodo_ore', name: 'Minerio de Yodo', chance: 25, xp: 250 },
          { id: 'crystal_shard', name: 'Fragmento de Cristal', chance: 15, xp: 300 }
        ]
      },
      {
        id: 90,
        name: "Profundezas Cristalinas",
        description: "Fossas imensas com grandes pilares de cristais puros irradiando luz suave.",
        levelRequired: 90,
        time: 23,
        icon: "✨",
        drops: [
          { id: 'crystal_shard', name: 'Fragmento de Cristal', chance: 60, xp: 400 },
          { id: 'gemstone', name: 'Gema Preciosa', chance: 30, xp: 180 },
          { id: 'yodo_ore', name: 'Minerio de Yodo', chance: 10, xp: 280 }
        ]
      },
      {
        id: 95,
        name: "Cratera Abissal",
        description: "Uma imensa fenda de calor escaldante no limite da crosta planetária.",
        levelRequired: 95,
        time: 24,
        icon: "🌋",
        drops: [
          { id: 'obsidian', name: 'Obsidian', chance: 40, xp: 150 },
          { id: 'diamond_ore', name: 'Minerio de Diamante', chance: 40, xp: 200 },
          { id: 'crystal_shard', name: 'Fragmento de Cristal', chance: 20, xp: 500 }
        ]
      },
      {
        id: 96,
        name: "Abismo Profundo",
        description: "As partes mais escuras do mundo, onde tudo que restou foi cascalho abrasivo e diamantes.",
        levelRequired: 96,
        time: 25,
        icon: "🕳️",
        drops: [
          { id: 'diamond_ore', name: 'Minerio de Diamante', chance: 80, xp: 250 },
          { id: 'cascalho', name: 'Cascalho', chance: 20, xp: 10 }
        ]
      },
      {
        id: 97,
        name: "Abismo de Safira",
        description: "Fosso abissal onde luz refletida em safiras brutas ilumina as profundezas.",
        levelRequired: 97,
        time: 25,
        icon: "🌊",
        drops: [
          { id: 'sapphire_ore', name: 'Minerio de safira', chance: 70, xp: 200 },
          { id: 'crystal_shard', name: 'Fragmento de Cristal', chance: 30, xp: 600 }
        ]
      },
      {
        id: 98,
        name: "Abismo Flamejante",
        description: "Ambiente vulcânico extremamente hostil sob emanações gasosas de iodo e rubis ferventes.",
        levelRequired: 98,
        time: 25,
        icon: "🔥",
        drops: [
          { id: 'ruby_ore', name: 'Minerio De Ruby', chance: 60, xp: 250 },
          { id: 'yodo_ore', name: 'Minerio de Yodo', chance: 40, xp: 350 }
        ]
      },
      {
        id: 99,
        name: "Coração do Mundo",
        description: "O núcleo do planeta, onde cristais cintilantes orbitam em perfeita harmonia mineral.",
        levelRequired: 99,
        time: 25,
        icon: "💖",
        drops: [
          { id: 'crystal_shard', name: 'Fragmento de Cristal', chance: 50, xp: 1000 },
          { id: 'diamond_ore', name: 'Minerio de Diamante', chance: 30, xp: 400 },
          { id: 'yodo_ore', name: 'Minerio de Yodo', chance: 20, xp: 450 }
        ]
      }
    ];
  };

  const miningSpots = generateMiningSpots();

  const addLog = (text: string, type: 'exp' | 'item' | 'info') => {
    setLogs(prev => [{ id: `${Date.now()}-${Math.random()}`, text, type }, ...prev].slice(0, 5));
  };

  const startMining = (spotIndex: number) => {
    const spot = miningSpots[spotIndex];
    const spotLocked = !debugUnlocked && profile.level < spot.levelRequired;
    if (mining || spotLocked) return;
    
    setMining(true);
    setActiveSpot(spotIndex);
    setProgress(0);
    
    addLog(`Iniciando extração em ${spot.name}...`, 'info');
    
    let currentProgress = 0;
    const duration = spot.time * 1000;
    const tick = 100;
    const increment = (tick / duration) * 100;

    const interval = setInterval(() => {
      currentProgress += increment;
      setProgress(Math.min(100, currentProgress));
      
      if (currentProgress >= 100) {
        clearInterval(interval);
        finishMining(spotIndex);
      }
    }, tick);
    
    timerRef.current = interval;
  };

  const finishMining = async (spotIndex: number) => {
    const spot = miningSpots[spotIndex];
    
    // Randomize item drop based on spot chances
    const rand = Math.random() * 100;
    let cumulativeChance = 0;
    let dropFound = spot.drops[0];

    for (const drop of spot.drops) {
      cumulativeChance += drop.chance;
      if (rand <= cumulativeChance) {
        dropFound = drop;
        break;
      }
    }
    
    const itemFoundId = dropFound.id;
    const expGain = dropFound.xp || (12 + (spotIndex * 2));
    
    // Calculate Mining Mastery Bonus
    const currentMinedCount = (profile.miningStats?.[itemFoundId] || 0);
    const bonusChance = Math.floor(currentMinedCount / 1000) * 0.3;
    const isBonusTriggered = Math.random() * 100 < bonusChance;
    const quantity = isBonusTriggered ? 2 : 1;

    const itemFound = GAME_ITEMS[itemFoundId] || { id: itemFoundId, name: itemFoundId, type: 'item' };
    
    // Prepare updated inventory and stats
    const itemsToAdd = Array(quantity).fill(itemFound.id);
    const newItems = [...profile.inventory, ...itemsToAdd];
    const newTotalExp = profile.exp + expGain;
    const newLevel = gameService.calculateLevelFromExp(newTotalExp);
    
    // Update mining stats
    const newMiningStats = {
      ...(profile.miningStats || {}),
      [itemFoundId]: (profile.miningStats?.[itemFoundId] || 0) + quantity
    };

    if (newLevel > profile.level) {
      addLog(`LEVEL UP! Você atingiu o nível ${newLevel}!`, 'info');
    }

    // Update Miner Skill
    const currentMinerSkill = profile.skills.miner || { level: 1, exp: 0 };
    const newMinerExp = currentMinerSkill.exp + expGain;
    const newMinerLevel = gameService.calculateLevelFromExp(newMinerExp);

    if (newMinerLevel > currentMinerSkill.level) {
      addLog(`Habilidade MINERAÇÃO subiu para nível ${newMinerLevel}!`, 'info');
    }

    const newSkills = {
      ...profile.skills,
      miner: { level: newMinerLevel, exp: newMinerExp }
    };

    try {
      await gameService.updateProfile(profile.uid, {
        exp: newTotalExp,
        level: newLevel,
        inventory: newItems,
        skills: newSkills,
        miningStats: newMiningStats
      });
      
      addLog(`Ganhou +${expGain} EXP de Mineração`, 'exp');
      if (isBonusTriggered) {
        addLog(`BÔNUS DE MESTRIA! Coletou: ${quantity}x ${itemFound.name || itemFoundId}!`, 'item');
      } else {
        addLog(`Coletou: ${itemFound.name || itemFoundId}!`, 'item');
      }
      
      onUpdate();
    } catch (error) {
      console.error(error);
      addLog('Erro ao salvar progresso da mineração.', 'info');
    } finally {
      setMining(false);
      setActiveSpot(null);
      setProgress(0);
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return (
    <div className="space-y-8">
      {/* Mining Info Header */}
      <div className="bg-brand-card border border-white/5 p-8 rounded-[2rem] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent"></div>
        <div className="flex justify-between items-center">
          <div>
            <span className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">Ambiente Ativo</span>
            <div className="text-3xl font-black text-white italic tracking-tighter mt-1 flex items-center gap-3">
              <Pickaxe className="text-amber-500" />
              Caverna de Mineração
            </div>
          </div>
          <div className="bg-amber-500/10 border border-amber-500/20 px-4 py-2 rounded-xl text-[10px] font-black text-amber-500 uppercase tracking-widest">
            Selecione um local
          </div>
        </div>
      </div>

      {/* Mining Stations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-8 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {miningSpots.map((spot, idx) => {
              const isLocked = !debugUnlocked && profile.level < spot.levelRequired;
              const isCurrentMining = mining && activeSpot === idx;
              const showingDetails = showChances === idx;

              return (
                <div 
                  key={spot.id}
                  className="relative transition-all duration-500 col-span-1"
                >
                  <div className={cn(
                    "bg-brand-card border p-8 rounded-[2.5rem] flex flex-col transition-all relative overflow-hidden h-full",
                    isLocked ? "border-white/5 opacity-60 grayscale" : 
                    isCurrentMining ? "border-amber-500/50 scale-[1.02]" : "border-white/5 hover:border-amber-500/20",
                    showingDetails && "border-amber-500/30 shadow-[0_0_40px_rgba(245,158,11,0.05)]"
                  )}>
                    {isLocked && (
                      <div className="absolute inset-0 bg-brand-bg/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center p-6">
                        <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mb-4">
                           <Pickaxe size={24} className="text-slate-600" />
                        </div>
                        <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-1">Local Bloqueado</p>
                        <p className="text-white text-xs font-bold font-mono">Requer Nível {spot.levelRequired}</p>
                      </div>
                    )}

                    <div className="flex flex-col items-center text-center gap-6">
                      <motion.button 
                        whileHover={!isLocked && !mining ? { scale: 1.1 } : {}}
                        whileTap={!isLocked && !mining ? { scale: 0.95 } : {}}
                        onClick={() => !isLocked && !mining && setShowChances(showingDetails ? null : idx)}
                        className="w-24 h-24 shrink-0 bg-brand-inner rounded-3xl flex items-center justify-center text-4xl shadow-inner border border-white/5 relative hover:shadow-[0_0_20px_rgba(245,158,11,0.1)] transition-all cursor-help"
                      >
                        <div className="absolute inset-0 bg-amber-500/10 rounded-3xl blur-xl opacity-0 transition-opacity"></div>
                        {spot.icon}
                      </motion.button>
                      
                      <div className="w-full">
                        <h3 className="text-xl font-black text-white italic mb-1 tracking-tight">{spot.name}</h3>
                        <p className="text-slate-500 text-[10px] italic leading-relaxed">{spot.description}</p>
                        
                        {!showingDetails && !isCurrentMining && !isLocked && (
                          <p className="mt-4 text-[9px] font-black text-amber-500/50 uppercase tracking-[0.2em] italic animate-pulse">
                            Clique para detalhes & iniciar
                          </p>
                        )}
                      </div>

                      <div className="w-full pt-4 mt-2 border-t border-white/5">
                         <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-500">
                           <span>Tempo</span>
                           <span className="text-amber-500">{spot.time}s</span>
                         </div>
                      </div>
                    </div>
                    
                    <AnimatePresence>
                      {showingDetails && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="w-full overflow-hidden"
                        >
                          <div className="pt-8 space-y-6">
                            <div className="space-y-4">
                              <p className="text-[9px] font-black text-amber-500 uppercase tracking-[0.4em] text-center mb-8 opacity-80">Itens Disponíveis</p>
                              <div className="space-y-0 px-6">
                                {spot.drops.map(drop => (
                                  <div key={drop.id} className="flex justify-between items-center border-b border-white/5 py-4 group/drop">
                                    <span className="text-slate-200 font-bold italic text-sm group-hover/drop:text-white transition-colors">{drop.name}</span>
                                    <span className="text-amber-600 font-mono text-xs font-black">{drop.chance}%</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (!mining && !isLocked) startMining(idx);
                              }}
                              disabled={mining}
                              className="w-full py-4 bg-amber-500 hover:bg-amber-400 text-black rounded-2xl font-black text-xs transition-all duration-300 uppercase tracking-widest italic shadow-[0_0_30px_rgba(245,158,11,0.2)] active:scale-95 mt-4"
                            >
                              Iniciar Extração
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {isCurrentMining && (
                      <div className="w-full space-y-4 mt-8 pt-8 border-t border-white/5">
                        <div className="flex justify-between text-[11px] uppercase font-black tracking-widest text-amber-500 px-2">
                          <span className="flex items-center gap-2">
                            <motion.span
                              animate={{ rotate: 360 }}
                              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                            >
                              <RotateCw className="w-3 h-3" />
                            </motion.span>
                            Extraindo...
                          </span>
                          <span className="italic">{Math.floor(progress)}%</span>
                        </div>
                        <div className="h-1.5 bg-brand-bg rounded-full overflow-hidden border border-white/5">
                          <motion.div 
                            className="h-full bg-gradient-to-r from-amber-600 to-amber-400"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Logs and Details */}
        <div className="md:col-span-4 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-[10px] uppercase tracking-[0.4em] font-black text-slate-500 italic">Relatório de Escavação</h3>
            <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.8)]"></div>
          </div>
          
          <div className="bg-brand-card/30 border border-white/5 p-6 rounded-[2rem] font-mono text-[11px] leading-relaxed space-y-3 min-h-[400px] backdrop-blur-sm shadow-inner overflow-hidden">
            <AnimatePresence initial={false}>
              {logs.map((log) => (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex gap-3 group border-b border-white/5 pb-2 cursor-default"
                >
                  <span className="text-slate-600 shrink-0">[{new Date(Number(log.id.split('-')[0])).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}]</span>
                  <span className={`italic ${
                    log.type === 'item' ? 'text-amber-400 font-bold' : 
                    log.type === 'info' ? 'text-blue-400 font-bold uppercase' : 'text-slate-400'
                  }`}>
                    {log.text}
                  </span>
                </motion.div>
              ))}
              {logs.length === 0 && (
                <div className="flex flex-col items-center justify-center h-48 text-slate-700 opacity-50">
                  <Pickaxe size={32} className="mb-2" />
                  <p className="italic">Nenhuma atividade recente</p>
                </div>
              )}
            </AnimatePresence>
          </div>

          <div className="bg-brand-card border border-white/5 p-6 rounded-[2rem]">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-[10px] uppercase tracking-[0.3em] font-black text-amber-500 italic">Maestria de Mineração</h4>
              <button 
                onClick={() => {
                  setDebugUnlocked(true);
                  addLog('Todos os locais desbloqueados para visualização!', 'info');
                }}
                className="text-[8px] text-amber-500/50 hover:text-amber-500 uppercase font-black tracking-widest transition-colors"
              >
                Desbloquear Tudo
              </button>
            </div>
            <p className="text-[9px] text-slate-500 italic mb-4 leading-relaxed">
              Sua experiência acumulada aumenta a eficiência. A cada 1.000 itens minerados do mesmo tipo, você ganha +0.3% de chance de obter um drop duplo daquele recurso.
            </p>
            <div className="space-y-3">
              {Object.entries(profile.miningStats || {}).length === 0 ? (
                <p className="text-[10px] text-slate-500 italic">Comece a minerar para ver suas estatísticas.</p>
              ) : (
                Object.entries(profile.miningStats || {}).map(([itemId, count]) => {
                  const item = GAME_ITEMS[itemId];
                  const name = item ? item.name : itemId;
                  const bonus = (Math.floor(count / 1000) * 0.3).toFixed(1);
                  return (
                    <div key={itemId} className="flex justify-between items-center text-[10px]">
                      <span className="text-white font-bold italic flex items-center gap-2">
                        {item?.imageUrl && <img src={item.imageUrl} alt={name} className="w-4 h-4 object-contain" referrerPolicy="no-referrer" />}
                        {name}
                      </span>
                      <div className="flex items-center gap-3">
                        <span className="text-slate-500 font-mono">{count}x</span>
                        <span className="text-amber-500 font-black">+{bonus}%</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
