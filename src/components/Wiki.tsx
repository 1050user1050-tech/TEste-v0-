import { useState, useMemo, useEffect } from 'react';
import { Search, BookOpen, X, Swords, Shield, Heart, Sparkles, Zap, Target, Eye, Footprints, Droplet, Star, Clover, Wand2, ImageOff } from 'lucide-react';
import { GAME_ITEMS } from '../services/gameService';
import { WIKI_ONLY_ITEMS } from '../constants/wikiItems';
import { Item } from '../types/game';
import { motion, AnimatePresence } from 'motion/react';

export function Wiki() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [iconFilter, setIconFilter] = useState<'all' | 'no-icon' | 'with-icon'>('all');
  const [locationFilter, setLocationFilter] = useState<'all' | 'with-location' | 'no-location'>('all');
  const [missingIcons, setMissingIcons] = useState<Record<string, boolean>>({});

  const allItems = useMemo(() => {
    return { ...GAME_ITEMS, ...WIKI_ONLY_ITEMS };
  }, []);

  // Set and restore custom background for Wiki page
  useEffect(() => {
    const layout = document.getElementById('app-layout');
    if (layout) {
      const originalBgImage = layout.style.backgroundImage;
      const originalBgSize = layout.style.backgroundSize;
      const originalBgPosition = layout.style.backgroundPosition;
      const originalBgRepeat = layout.style.backgroundRepeat;
      const originalBgAttachment = layout.style.backgroundAttachment;

      layout.style.backgroundImage = "url('/fundo/Fundo de Livro .png')";
      layout.style.backgroundSize = "cover";
      layout.style.backgroundPosition = "center";
      layout.style.backgroundRepeat = "no-repeat";
      layout.style.backgroundAttachment = "fixed";

      return () => {
        layout.style.backgroundImage = originalBgImage;
        layout.style.backgroundSize = originalBgSize;
        layout.style.backgroundPosition = originalBgPosition;
        layout.style.backgroundRepeat = originalBgRepeat;
        layout.style.backgroundAttachment = originalBgAttachment;
      };
    }
  }, []);

  const itemsList = useMemo(() => Object.values(allItems), [allItems]);

  // Check which images exist dynamically
  useEffect(() => {
    itemsList.forEach(item => {
      if (!item.imageUrl) {
        setMissingIcons(prev => ({ ...prev, [item.id]: true }));
        return;
      }
      
      const img = new Image();
      img.onload = () => {
        setMissingIcons(prev => ({ ...prev, [item.id]: false }));
      };
      img.onerror = () => {
        setMissingIcons(prev => ({ ...prev, [item.id]: true }));
      };
      img.src = item.imageUrl;
    });
  }, [itemsList]);
  
  const filteredItems = useMemo(() => {
    return itemsList.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            (item.type && item.type.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const isMissingIcon = missingIcons[item.id] !== false; // true if missing/loading
      
      let matchesIcon = true;
      if (iconFilter === 'no-icon') {
        matchesIcon = isMissingIcon;
      } else if (iconFilter === 'with-icon') {
        matchesIcon = !isMissingIcon;
      }
      
      let matchesLocation = true;
      const hasLocation = !!item.ondeAchar;
      if (locationFilter === 'with-location') {
        matchesLocation = hasLocation;
      } else if (locationFilter === 'no-location') {
        matchesLocation = !hasLocation;
      }
      
      return matchesSearch && matchesIcon && matchesLocation;
    });
  }, [searchTerm, itemsList, iconFilter, locationFilter, missingIcons]);

  const getStatIcon = (statName: string) => {
    switch (statName) {
      case 'physicalAttack': return <Swords size={12} className="text-rose-400" />;
      case 'magicAttack': return <Wand2 size={12} className="text-purple-400" />;
      case 'physicalDefense': return <Shield size={12} className="text-blue-400" />;
      case 'magicDefense': return <Shield size={12} className="text-indigo-400" />;
      case 'health': 
      case 'maxHealth': return <Heart size={12} className="text-emerald-400" />;
      case 'luck': return <Clover size={12} className="text-amber-400" />;
      case 'accuracy': return <Target size={12} className="text-sky-400" />;
      case 'evasion': return <Footprints size={12} className="text-orange-400" />;
      case 'speed': return <Zap size={12} className="text-yellow-400" />;
      case 'critChance': return <Star size={12} className="text-fuchsia-400" />;
      case 'critDamage': return <Sparkles size={12} className="text-pink-400" />;
      case 'lifeSteal': return <Droplet size={12} className="text-red-400" />;
      default: return <Search size={12} className="text-slate-400" />;
    }
  };

  const getStatLabel = (statName: string) => {
    const labels: Record<string, string> = {
      physicalAttack: 'Atq. Físico',
      magicAttack: 'Atq. Mágico',
      physicalDefense: 'Def. Física',
      magicDefense: 'Def. Mágica',
      health: 'Vida',
      maxHealth: 'Vida Máxima',
      luck: 'Sorte',
      accuracy: 'Precisão',
      evasion: 'Evasão',
      speed: 'Velocidade',
      critChance: 'Chance Crítica',
      critDamage: 'Dano Crítico',
      lifeSteal: 'Roubo de Vida'
    };
    return labels[statName] || statName;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-brand-card/50 p-6 rounded-2xl border border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
            <BookOpen size={20} className="text-blue-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">Wiki de Itens</h1>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Enciclopédia Chronicles</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-1 max-w-2xl md:justify-end">
          <div className="relative group flex-1 max-w-md">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search size={16} className="text-slate-500 group-focus-within:text-blue-400 transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Pesquisar itens..."
              className="w-full bg-brand-bg/50 border border-white/5 rounded-xl py-2.5 pl-12 pr-4 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <button
            onClick={() => {
              setIconFilter(prev => {
                if (prev === 'all') return 'no-icon';
                if (prev === 'no-icon') return 'with-icon';
                return 'all';
              });
            }}
            className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest border transition-all duration-300 flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer ${
              iconFilter === 'no-icon'
                ? 'bg-rose-500/20 text-rose-400 border-rose-500/30 shadow-[0_0_15px_rgba(244,63,94,0.1)]'
                : iconFilter === 'with-icon'
                ? 'bg-blue-500/20 text-blue-400 border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.1)]'
                : 'bg-brand-bg/40 text-slate-400 border-white/5 hover:border-white/10 hover:text-white'
            }`}
          >
            {iconFilter === 'no-icon' && <ImageOff size={14} className="text-rose-400" />}
            {iconFilter === 'with-icon' && <Eye size={14} className="text-blue-400" />}
            {iconFilter === 'all' && <Eye size={14} className="text-slate-500" />}
            {iconFilter === 'no-icon' ? 'Sem Ícone' : iconFilter === 'with-icon' ? 'Com Ícone' : 'Todos Ícones'}
          </button>

          <button
            onClick={() => {
              setLocationFilter(prev => {
                if (prev === 'all') return 'with-location';
                if (prev === 'with-location') return 'no-location';
                return 'all';
              });
            }}
            className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest border transition-all duration-300 flex items-center justify-center whitespace-nowrap cursor-pointer ${
              locationFilter === 'with-location'
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.1)]'
                : locationFilter === 'no-location'
                ? 'bg-amber-500/20 text-amber-400 border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.1)]'
                : 'bg-brand-bg/40 text-slate-400 border-white/5 hover:border-white/10 hover:text-white'
            }`}
          >
            {locationFilter === 'with-location' ? 'Com Local' : locationFilter === 'no-location' ? 'Sem Local' : 'Todos Locais'}
          </button>
        </div>
      </div>

      {/* Grid of icons/names */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {filteredItems.map((item) => {
          const isMissingIcon = missingIcons[item.id] !== false;
          return (
            <button
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className={`flex items-center gap-3 p-3 bg-brand-card border rounded-xl hover:bg-blue-500/5 transition-all text-left group overflow-hidden relative ${
                isMissingIcon && iconFilter === 'no-icon'
                  ? 'border-rose-500/30 hover:border-rose-500/50'
                  : 'border-white/5 hover:border-blue-500/30'
              }`}
            >
              <div className="w-12 h-12 bg-brand-inner rounded-lg flex items-center justify-center text-xl border border-white/5 shadow-inner group-hover:scale-110 transition-transform shrink-0 overflow-hidden relative">
                {!isMissingIcon && item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.name} className="w-full h-full object-contain p-1" />
                ) : (
                  getItemIcon(item.type)
                )}
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-xs font-bold text-slate-300 truncate tracking-tight">{item.name}</span>
                {isMissingIcon && (
                  <span className="text-[8px] font-black uppercase tracking-widest text-rose-500/70 mt-0.5">Sem Imagem</span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {filteredItems.length === 0 && (
        <div className="py-20 text-center text-slate-600 italic">
          <p>Nenhum item encontrado.</p>
        </div>
      )}

      {/* Selection Modal/Overlay */}
      <AnimatePresence>
        {selectedItem && (
          <div 
            onClick={() => setSelectedItem(null)}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-brand-bg/80 backdrop-blur-sm overflow-y-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-brand-card border border-white/10 rounded-3xl w-full max-w-lg shadow-2xl relative max-h-[85vh] overflow-y-auto select-none"
            >
              <div className="p-8 relative">
                <button 
                  onClick={() => setSelectedItem(null)}
                  className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/5 text-slate-500 hover:text-white transition-colors z-20"
                >
                  <X size={20} />
                </button>

                <div className="flex flex-col items-center text-center mb-8">
                  <div className="w-32 h-32 bg-brand-inner rounded-3xl flex items-center justify-center text-5xl mb-4 border border-white/5 shadow-2xl relative overflow-hidden">
                    <div className="absolute -inset-1 bg-blue-500/10 blur-xl rounded-full"></div>
                    {selectedItem.imageUrl ? (
                      <img src={selectedItem.imageUrl} alt={selectedItem.name} className="relative z-10 w-full h-full object-contain p-4" />
                    ) : (
                      <span className="relative">{getItemIcon(selectedItem.type)}</span>
                    )}
                  </div>
                  <h2 className="text-2xl font-black text-white tracking-tighter italic mb-1">{selectedItem.name}</h2>
                  {(selectedItem.type || selectedItem.rarity || selectedItem.value !== undefined) && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {selectedItem.type && selectedItem.type !== 'materia de craft' && selectedItem.type !== 'arma' && (
                        <span className="text-[10px] uppercase font-black px-3 py-1 rounded-full bg-blue-600/10 text-blue-400 border border-blue-500/20">
                          {selectedItem.type}
                        </span>
                      )}
                      {selectedItem.rarity && (
                        <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-white/10 ${
                          selectedItem.rarity === 'Comum' ? 'bg-slate-500/20 text-slate-400' :
                          selectedItem.rarity === 'Incomum' ? 'bg-emerald-500/20 text-emerald-400' :
                          selectedItem.rarity === 'Raro' ? 'bg-blue-500/20 text-blue-400' :
                          selectedItem.rarity === 'Épico' ? 'bg-purple-500/20 text-purple-400' :
                          selectedItem.rarity === 'Lendário' ? 'bg-amber-500/20 text-amber-400' :
                          'bg-rose-500/20 text-rose-400'
                        }`}>
                          {selectedItem.rarity}
                        </div>
                      )}
                      {selectedItem.value !== undefined && (
                        <div className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-white/10 bg-brand-inner text-amber-500 flex items-center gap-1">
                          🪙 Val: {selectedItem.value.toLocaleString()}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-brand-bg/50 rounded-2xl p-6 border border-white/5 flex flex-col justify-center text-center">
                    <h4 className="text-[10px] uppercase font-black text-slate-500 tracking-[0.2em] mb-3">Descrição</h4>
                    <p className="text-sm text-slate-300 leading-relaxed italic">
                      "{selectedItem.description}"
                    </p>
                  </div>

                  {selectedItem.source && (
                    <div className="bg-brand-bg/50 rounded-2xl p-6 border border-white/5 flex flex-col justify-center text-center">
                      <h4 className="text-[10px] uppercase font-black text-slate-500 tracking-[0.2em] mb-3">Onde Criar</h4>
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 shadow-lg">
                          <Zap size={18} className="text-blue-400" />
                        </div>
                        <span className="text-xs font-black text-blue-400 italic">
                          {selectedItem.source}
                        </span>
                      </div>
                    </div>
                  )}

                  {selectedItem.ondeAchar && (
                    <div className="bg-brand-bg/50 rounded-2xl p-6 border border-white/5 flex flex-col justify-center text-center">
                      <h4 className="text-[10px] uppercase font-black text-slate-500 tracking-[0.2em] mb-3">Onde Achar</h4>
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shadow-lg">
                          <Footprints size={18} className="text-emerald-400" />
                        </div>
                        <span className="text-xs font-black text-emerald-400 italic">
                          {selectedItem.ondeAchar}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {Object.values(selectedItem.modifiers).some(val => (val as number) !== 0) && (
                  <div className="space-y-3">
                    <h3 className="text-[10px] uppercase font-bold text-slate-500 tracking-[0.2em] px-1">Atributos do Item</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(selectedItem.modifiers).map(([stat, value]) => {
                        const numValue = value as number;
                        if (numValue === 0) return null;
                        return (
                          <div key={stat} className="flex items-center justify-between gap-3 bg-white/5 border border-white/5 rounded-xl px-4 py-2.5">
                            <div className="flex items-center gap-2">
                              {getStatIcon(stat)}
                              <span className="text-[11px] font-bold text-slate-400">
                                {getStatLabel(stat)}
                              </span>
                            </div>
                            <span className={`text-xs font-mono font-bold ${numValue > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                              {numValue > 0 ? `+${numValue}` : numValue}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function getItemIcon(type: string) {
  switch (type) {
    case 'hat': return '👒';
    case 'vest': return '👕';
    case 'pants': return '👖';
    case 'gloves': return '🧤';
    case 'weapon':
    case 'arma': return '⚔️';
    case 'shield': return '🛡️';
    case 'special': return '✨';
    case 'pet': return '🐾';
    case 'materia de craft': return '🛠️';
    default: return '📦';
  }
}

