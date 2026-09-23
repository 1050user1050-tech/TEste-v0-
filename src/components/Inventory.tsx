import { UserProfile, Item } from '../types/game';
import { gameService, GAME_ITEMS } from '../services/gameService';
import { 
  XCircle, 
  CheckCircle2, 
  Trash2,
  Package,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';

interface InventoryProps {
  profile: UserProfile;
  onUpdate: () => void;
}

export function Inventory({ profile, onUpdate }: InventoryProps) {
  const [selectedItem, setSelectedItem] = useState<(Item & { count?: number }) | null>(null);

  const equipItem = async (item: Item) => {
    const newEquipped = { ...(profile.equipped || {}) };
    const slot = item.type === 'arma' ? 'weapon' : (item.type as keyof UserProfile['equipped']);
    const currentEquippedId = (newEquipped as any)[slot];
    
    if (currentEquippedId === item.id) {
       // Unequip
      delete (newEquipped as any)[slot];
    } else {
       // Equip
      (newEquipped as any)[slot] = item.id;
    }

    try {
      await gameService.updateProfile(profile.uid, { equipped: newEquipped });
      onUpdate();
    } catch (error) {
      console.error(error);
    }
  };

  const stackedItems = profile.inventory.reduce((acc, id) => {
    if (!GAME_ITEMS[id]) return acc;
    if (!acc[id]) {
      acc[id] = { ...GAME_ITEMS[id], count: 0 };
    }
    acc[id].count += 1;
    return acc;
  }, {} as Record<string, Item & { count: number }>);

  const inventoryItems = Object.values(stackedItems);

  const formatCount = (count: number) => {
    return gameService.formatLargeNumber(count);
  };

  const slots = [
    { type: 'hat', label: 'Chapéu', icon: '👒' },
    { type: 'vest', label: 'Colete', icon: '👕' },
    { type: 'pants', label: 'Calça', icon: '👖' },
    { type: 'gloves', label: 'Luvas', icon: '🧤' },
    { type: 'weapon', label: 'Arma', icon: '⚔️' },
    { type: 'shield', label: 'Escudo', icon: '🛡️' },
    { type: 'special', label: 'Especial', icon: '✨' },
    { type: 'pet', label: 'Pet', icon: '🐾' },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Inventory Grid */}
        <div className="md:col-span-12 space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 italic flex items-center gap-2">
              <Package size={14} /> Artifacts Recovery
            </h3>
            <span className="text-[10px] font-mono text-slate-600 uppercase italic">
              {inventoryItems.length} slots used
            </span>
          </div>

          <div className="grid grid-cols-5 sm:grid-cols-10 gap-3">
            {inventoryItems.map((item) => (
              <motion.button
                key={item.id}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedItem(item)}
                className={`aspect-square rounded-xl border flex items-center justify-center relative transition-all group overflow-hidden ${
                  (item.type && profile.equipped?.[item.type === 'arma' ? 'weapon' : (item.type as any)] === item.id)
                    ? 'bg-blue-500/10 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.3)]'
                    : 'bg-brand-card border-white/5 hover:border-white/10'
                } ${selectedItem?.id === item.id ? 'ring-2 ring-white/20' : ''}`}
              >
                <div className="w-full h-full p-2 flex items-center justify-center">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-contain pointer-events-none" />
                  ) : (
                    <div className="text-2xl drop-shadow-sm group-hover:scale-110 transition-transform">
                      {getIconForType(item.type || '')}
                    </div>
                  )}
                </div>
                
                {/* Quantity Badge */}
                {item.count > 1 && (
                  <div className="absolute bottom-1 right-1 bg-brand-bg/80 backdrop-blur-sm border border-white/10 px-1.5 py-0.5 rounded-lg">
                    <span className="text-[10px] font-black text-white italic drop-shadow-md">
                      {formatCount(item.count)}
                    </span>
                  </div>
                )}

                {item.type && profile.equipped?.[item.type === 'arma' ? 'weapon' : (item.type as any)] === item.id && (
                  <div className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,1)] animate-pulse"></div>
                )}
              </motion.button>
            ))}
            {/* Empty Slots */}
            {Array.from({ length: Math.max(0, 30 - inventoryItems.length) }).map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square bg-white/[0.01] border border-white/5 rounded-xl flex items-center justify-center overflow-hidden">
                 <span className="text-white/2 font-black text-lg select-none">?</span>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Overlay / Detail */}
        <AnimatePresence>
          {selectedItem && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="md:col-span-12"
            >
              <div className="bg-brand-card border border-white/5 p-8 rounded-[2.5rem] relative overflow-hidden shadow-2xl">
                 <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/30 to-transparent"></div>
                 <button 
                  onClick={() => setSelectedItem(null)}
                  className="absolute top-6 right-6 text-slate-600 hover:text-white transition-colors"
                 >
                   <XCircle size={24} />
                 </button>

                 <div className="flex flex-col md:flex-row gap-10">
                    <div className="w-32 h-32 bg-brand-bg rounded-3xl flex items-center justify-center text-6xl shadow-inner border border-white/5 shrink-0 rotate-3 overflow-hidden">
                       {selectedItem.imageUrl ? (
                         <img src={selectedItem.imageUrl} alt={selectedItem.name} className="w-full h-full object-contain p-4" />
                       ) : (
                         getIconForType(selectedItem.type || '')
                       )}
                    </div>
                    
                    <div className="flex-1 space-y-6">
                       <div>
                          {selectedItem.type && (
                            <p className="text-[10px] text-blue-400 uppercase font-black tracking-[0.4em] mb-1 italic">
                              {selectedItem.type} Gear
                            </p>
                          )}
                         <h4 className="text-3xl font-black text-white italic tracking-tighter">{selectedItem.name}</h4>
                         <div className="flex flex-wrap gap-2 mt-2">
                           {selectedItem.rarity && (
                             <div className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest border border-white/10 ${
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
                             <div className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest border border-white/10 bg-brand-inner text-amber-500 flex items-center gap-1">
                               🪙 Val: {selectedItem.value.toLocaleString()}
                             </div>
                           )}
                         </div>
                         <p className="text-slate-500 text-sm italic mt-3">{selectedItem.description}</p>
                       </div>

                       <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {Object.entries(selectedItem.modifiers).map(([key, value]) => {
                            const val = typeof value === 'number' && !isNaN(value) ? value : 0;
                            if (val === 0) return null;
                            const labelMap: any = {
                              health: 'HP',
                              maxHealth: 'MAX HP',
                              physicalAttack: 'P.ATK',
                              physicalDefense: 'P.DEF',
                              magicAttack: 'M.ATK',
                              magicDefense: 'M.DEF',
                              luck: 'LUCK',
                              accuracy: 'ACC',
                              evasion: 'EVA',
                              speed: 'SPD',
                              critChance: 'CRIT%',
                              critDamage: 'C.DMG%',
                              lifeSteal: 'STEAL%'
                            };
                            return (
                              <div key={key} className="p-3 rounded-xl bg-white/5 border border-white/5 text-center">
                                 <p className="text-[8px] uppercase font-black text-slate-500 mb-1">{labelMap[key] || key}</p>
                                 <p className={`text-sm font-black font-mono tracking-tighter ${val > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                   {val > 0 ? '+' : ''}{val}
                                 </p>
                              </div>
                            );
                          })}
                       </div>

                       <div className="flex gap-4">
                          {['arma', 'weapon', 'hat', 'vest', 'pants', 'gloves', 'shield', 'special', 'pet'].includes(selectedItem.type) && (
                            <button 
                               onClick={() => equipItem(selectedItem as Item)}
                               className={`flex-1 py-4 rounded-xl font-black text-xs uppercase tracking-[0.3em] transition-all shadow-xl flex items-center justify-center gap-3 ${
                                 profile.equipped?.[selectedItem.type === 'arma' ? 'weapon' : (selectedItem.type as any)] === selectedItem.id
                                   ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20 shadow-none'
                                   : 'bg-slate-100 text-slate-900 hover:bg-white'
                               }`}
                            >
                               {profile.equipped?.[selectedItem.type === 'arma' ? 'weapon' : (selectedItem.type as any)] === selectedItem.id ? (
                                 <>Unequip Artifact</>
                               ) : (
                                 <>Equip Artifact</>
                               )}
                            </button>
                          )}
                       </div>
                    </div>
                 </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Current Equipment Slots (Visual) */}
        {!selectedItem && (
          <div className="md:col-span-12 bg-brand-card/30 border border-white/5 p-8 rounded-[2.5rem] backdrop-blur-sm shadow-inner">
             <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 italic text-center mb-8">Active Battle Gear</h3>
             <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-4">
                {slots.map((slot) => {
                  const equippedId = profile.equipped ? (profile.equipped as any)[slot.type] : null;
                  const item = equippedId ? GAME_ITEMS[equippedId] : null;
                  return (
                    <div key={slot.type} className="flex flex-col items-center gap-3">
                       <button
                         onClick={() => item && setSelectedItem(item)}
                         className={`w-16 h-16 rounded-2xl border transition-all flex items-center justify-center relative group ${
                           item 
                            ? 'bg-brand-inner border-blue-500/40 shadow-lg shadow-blue-500/10' 
                            : 'bg-brand-bg/50 border-white/5 border-dashed grayscale opacity-40'
                         }`}
                       >
                         <div className="w-full h-full flex items-center justify-center">
                           {item && item.imageUrl ? (
                             <img src={item.imageUrl} alt={item.name} className="w-full h-full object-contain p-2" />
                           ) : (
                             <span className="text-2xl group-hover:scale-110 transition-transform">
                                {item ? getIconForType(item.type) : slot.icon}
                             </span>
                           )}
                         </div>
                         {item && <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full shadow-lg"></div>}
                       </button>
                       <span className="text-[8px] uppercase font-black tracking-widest text-slate-600">{slot.label}</span>
                    </div>
                  );
                })}
             </div>
          </div>
        )}
      </div>
    </div>
  );
}

function getIconForType(type: string) {
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
