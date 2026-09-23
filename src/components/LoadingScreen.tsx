import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2, ShieldAlert, Sparkles, Sword, Award, Play } from 'lucide-react';
import { GAME_ITEMS } from '../services/gameService';
import { WIKI_ONLY_ITEMS } from '../constants/wikiItems';

interface LoadingScreenProps {
  onComplete: () => void;
}

const INSIGHTS_TIPS = [
  "Dica: Minérios raros como Platina, Cobalto e Diamante possuem grande valor de mercado e utilidades especiais de forja!",
  "Curiosidade: O lendário Aetheliron (Ferro Élfico) é apreciado de forma divina por sua leveza sobrenatural e flexibilidade.",
  "Dica: O misterioso Minério de Yodo é extremamente robusto e só pode ser localizado em profundidades abissais insondáveis.",
  "Importante: Agora todos os materiais base são matérias-primas puras, mantendo o foco em suas descrições essenciais e origens.",
  "Inovação: Seu progresso e inventário são sincronizados em tempo real com segurança total em nuvem via Firebase Firestore!",
  "Dica: Utilize a carpintaria na Estação de Trabalho para transformar madeira bruta em Tábuas de Madeira utilizáveis.",
  "Dica: Fique sempre de olho na Wiki para consultar as melhores fontes de obtenção de cada material raro do mundo.",
  "Dica: O cristal Terralumin fortalece as fundações de escudos e armaduras pesadas com defesas intransponíveis."
];

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [loadedCount, setLoadedCount] = useState(0);
  const [currentAsset, setCurrentAsset] = useState('Sincronizando arquivos...');
  const [tipIndex, setTipIndex] = useState(0);
  const [isDone, setIsDone] = useState(false);

  // Compile unique images to preload
  const uniqueAssets = useMemo(() => {
    const list: { name: string; url: string }[] = [
      { name: 'Personagem Masculino', url: '/personagens/Masculino.png' },
      { name: 'Personagem Feminino', url: '/personagens/Feminino.png' },
      { name: 'Fundo da Enciclopédia', url: '/fundo/Fundo de Livro .png' }
    ];

    // Add play items
    Object.values(GAME_ITEMS).forEach(item => {
      if (item.imageUrl) {
        list.push({ name: item.name, url: item.imageUrl });
      }
    });

    // Add wiki items
    Object.values(WIKI_ONLY_ITEMS).forEach(item => {
      if (item.imageUrl) {
        list.push({ name: item.name, url: item.imageUrl });
      }
    });

    // Deduplicate by URL
    const seen = new Set<string>();
    return list.filter(asset => {
      if (!asset.url) return false;
      const isDuplicate = seen.has(asset.url);
      seen.add(asset.url);
      return !isDuplicate;
    });
  }, []);

  const totalAssets = uniqueAssets.length;
  const progressPercent = totalAssets > 0 ? Math.round((loadedCount / totalAssets) * 100) : 100;

  // Preload logic
  useEffect(() => {
    if (totalAssets === 0) {
      setIsDone(true);
      return;
    }

    let active = true;
    let currentlyLoaded = 0;

    uniqueAssets.forEach(asset => {
      const img = new Image();
      
      const handleLoad = () => {
        if (!active) return;
        currentlyLoaded += 1;
        setLoadedCount(currentlyLoaded);
        setCurrentAsset(`Carregado: ${asset.name}`);
        
        if (currentlyLoaded >= totalAssets) {
          // Add a brief delay for visual satisfaction
          setTimeout(() => {
            setIsDone(true);
          }, 600);
        }
      };

      const handleError = () => {
        if (!active) return;
        currentlyLoaded += 1;
        setLoadedCount(currentlyLoaded);
        setCurrentAsset(`Ignorado/Erro: ${asset.name}`);
        
        if (currentlyLoaded >= totalAssets) {
          setTimeout(() => {
            setIsDone(true);
          }, 600);
        }
      };

      img.onload = handleLoad;
      img.onerror = handleError;
      img.src = asset.url;
    });

    // Cycle through loading tips
    const tipInterval = setInterval(() => {
      setTipIndex(prev => (prev + 1) % INSIGHTS_TIPS.length);
    }, 4500);

    return () => {
      active = false;
      clearInterval(tipInterval);
    };
  }, [uniqueAssets, totalAssets]);

  // Handle completed trigger
  const handleStartGame = () => {
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-[200] bg-brand-bg flex flex-col items-center justify-center p-6 select-none overflow-hidden font-sans border-[12px] border-brand-inner">
      <div className="absolute inset-0 bg-radial-gradient from-blue-500/5 via-transparent to-transparent opacity-60 pointer-events-none"></div>
      
      <div className="max-w-xl w-full text-center relative z-10 flex flex-col items-center">
        {/* Top Emblem */}
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="w-24 h-24 bg-gradient-to-tr from-blue-600 to-indigo-700 rounded-3xl mb-8 shadow-2xl flex items-center justify-center rotate-3 relative group"
        >
          <div className="absolute inset-0 bg-blue-400 rounded-3xl blur-md opacity-25 group-hover:opacity-40 transition-opacity"></div>
          <Sparkles className="w-10 h-10 text-white animate-pulse" />
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <p className="text-xs font-black uppercase text-blue-400 tracking-[0.4em] mb-1.5 italic">Pre-carregando Texturas & Interface</p>
          <h1 className="text-4xl md:text-5xl font-black text-white italic tracking-tighter mb-2">
            CHRONICLES INFINIT GRIND
          </h1>
          <p className="text-slate-500 text-xs tracking-widest font-bold uppercase mb-12">
            Preparando Estações e Inventário
          </p>
        </motion.div>

        {/* Loading Progress Frame */}
        <div className="w-full bg-brand-card/40 border border-white/5 rounded-2xl p-6 md:p-8 backdrop-blur-md shadow-2xl mb-8 relative">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-2 text-left">
              <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
              <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 truncate max-w-[200px] md:max-w-xs">
                {currentAsset}
              </span>
            </div>
            <span className="text-sm font-mono font-black text-blue-400">
              {progressPercent}%
            </span>
          </div>

          {/* Progress Bar Container */}
          <div className="w-full h-3 bg-brand-bg rounded-full overflow-hidden border border-white/5 p-[2px]">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ ease: "easeOut", duration: 0.3 }}
              className="h-full rounded-full bg-gradient-to-r from-blue-600 via-cyan-400 to-indigo-600 relative overflow-hidden"
              style={{ boxShadow: '0 0 10px rgba(59, 130, 246, 0.5)' }}
            >
              {/* Highlight Sweep */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
            </motion.div>
          </div>

          <div className="mt-4 flex items-center justify-center gap-1.5 text-[10px] text-slate-500 uppercase font-bold">
            <span>Carregados</span>
            <span className="font-mono text-slate-300">{loadedCount}</span>
            <span>de</span>
            <span className="font-mono text-slate-300">{totalAssets}</span>
            <span>recursos gráficos</span>
          </div>
        </div>

        {/* Tip / Insight Box */}
        <div className="w-full h-18 flex items-center justify-center px-4 mb-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={tipIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="text-slate-400 text-xs font-medium leading-relaxed italic max-w-md"
            >
              {INSIGHTS_TIPS[tipIndex]}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Play Action / Click to Enter */}
        <div className="h-14 flex items-center justify-center">
          <AnimatePresence>
            {isDone && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                onClick={handleStartGame}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3.5 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-slate-950 font-black uppercase tracking-widest text-xs rounded-xl shadow-xl shadow-emerald-500/20 flex items-center gap-2.5 cursor-pointer hover:shadow-emerald-400/35 transition-all text-white border border-emerald-400/30"
              >
                <Play className="w-4 h-4 fill-white text-white" />
                <span>Entrar no Jogo</span>
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Decorative details inside corners */}
      <div className="absolute top-4 left-4 text-white/5 text-[9px] font-mono tracking-widest uppercase hidden md:block">
        Assets Preload Engine • Active
      </div>
      <div className="absolute bottom-4 right-4 text-white/5 text-[9px] font-mono tracking-widest uppercase hidden md:block">
        v1.2.0 • Chronicles
      </div>
    </div>
  );
}
