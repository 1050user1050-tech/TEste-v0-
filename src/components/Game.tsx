import { useState } from 'react';
import { User } from 'firebase/auth';
import { UserProfile, Item, Stats } from '../types/game';
import { ProfileStats } from './ProfileStats';
import { Inventory } from './Inventory';
import { FarmAction } from './FarmAction';
import { MiningAction } from './MiningAction';
import { Wiki } from './Wiki';
import { 
  Swords, 
  Backpack, 
  Sprout, 
  Shield, 
  Sparkles, 
  Globe, 
  Heart,
  BookOpen,
  PawPrint,
  ListChecks,
  VenetianMask,
  Pickaxe,
  Zap,
  Coins,
  Compass,
  Wand2,
  Church,
  Hammer,
  Target,
  Cog,
  Waves,
  Store,
  ChefHat,
  Home,
  Trees,
  FlaskConical,
  ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface GameProps {
  user: User;
  profile: UserProfile;
  onUpdate: () => void;
}

type Tab = 
  | 'farm' | 'inventory' | 'profile' | 'wiki' | 'pets' | 'missions' 
  | 'guild_knights' | 'guild_thieves' | 'guild_merchant' | 'guild_adventurers' | 'guild_mages' 
  | 'guild_religious' | 'guild_carpenters' | 'hunting_grounds' 
  | 'workstation' | 'fishing' | 'mining' | 'market' | 'kitchen' | 'home' | 'forest' | 'potions';

export function Game({ user, profile, onUpdate }: GameProps) {
  const [activeTab, setActiveTab] = useState<Tab>('wiki');

  const tabs = [
    { id: 'wiki', label: 'Wiki', icon: BookOpen },
    { id: 'profile', label: 'Personagem', icon: Swords },
    { id: 'inventory', label: 'Equipamento', icon: Backpack },
    { id: 'skill_tree', label: 'Árvore de Habilidades', icon: Zap },
    { id: 'farm', label: 'Fazenda', icon: Sprout },
    { id: 'home', label: 'Casa/Base', icon: Home },
    { id: 'pets', label: 'Pets', icon: PawPrint },
    { id: 'missions', label: 'Missões', icon: ListChecks },
    { id: 'market', label: 'Mercado', icon: Store },
    { id: 'forest', label: 'Floresta', icon: Trees },
    { id: 'hunting_grounds', label: 'Áreas de Caça', icon: Target },
    { id: 'fishing', label: 'Áreas de Pesca', icon: Waves },
    { id: 'mining', label: 'Caverna de Mineração', icon: Pickaxe },
    { id: 'workstation', label: 'Estação de Trabalho', icon: Cog },
    { id: 'potions', label: 'Estação de Poções', icon: FlaskConical },
    { id: 'kitchen', label: 'Cozinha', icon: ChefHat },
    { id: 'guild_adventurers', label: 'G. Aventureiros', icon: Compass },
    { id: 'guild_knights', label: 'G. dos Cavaleiros', icon: ShieldCheck },
    { id: 'guild_mages', label: 'G. dos Magos', icon: Wand2 },
    { id: 'guild_thieves', label: 'G. de Ladrões', icon: VenetianMask },
    { id: 'guild_merchant', label: 'G. Mercante', icon: Coins },
    { id: 'guild_religious', label: 'Religião', icon: Church },
    { id: 'guild_carpenters', label: 'Oficina Central', icon: Hammer },
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start">
      {/* Sidebar Desktop */}
      <div className="hidden lg:flex flex-col w-64 bg-brand-card border border-white/5 rounded-[2rem] p-6 sticky top-32 shadow-2xl max-h-[calc(100vh-10rem)] overflow-y-auto scrollbar-hide">
         <div className="flex items-center gap-4 mb-8 px-2 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg">
               <Globe size={18} />
            </div>
            <div>
               <p className="text-[8px] uppercase font-black text-slate-500 tracking-widest">Main Hub</p>
               <p className="text-xs font-bold text-white italic tracking-tighter">Terras Verdes</p>
            </div>
         </div>

         <div className="space-y-2 pb-10">
           {tabs.map((tab) => (
             <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as Tab)}
                className={`w-full flex items-center gap-4 px-4 py-4 rounded-xl transition-all group shrink-0 ${
                  activeTab === tab.id 
                    ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20' 
                    : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
                }`}
             >
                <tab.icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${activeTab === tab.id ? 'text-white' : ''}`} />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">{tab.label}</span>
             </button>
           ))}
         </div>

         <div className="mt-auto pt-6 border-t border-white/5 px-2 shrink-0">
            <p className="text-[9px] uppercase font-black text-slate-600 tracking-widest mb-4">Active Buffs</p>
            <div className="flex gap-2">
               <div className="w-6 h-6 rounded-md bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-[10px]" title="Rested">🌿</div>
               <div className="w-6 h-6 rounded-md bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-[10px]" title="Lucky">✨</div>
            </div>
         </div>
      </div>

      <div className="flex-1 w-full space-y-8 min-w-0">
        {/* Mobile Tabs Navigation */}
        <div className="lg:hidden flex overflow-x-auto py-6 border-b border-white/5 scrollbar-hide gap-8 px-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={`group flex flex-col items-center gap-2 transition-all relative shrink-0 ${
                activeTab === tab.id ? 'opacity-100' : 'opacity-40 hover:opacity-70'
              }`}
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center border transition-all ${
                activeTab === tab.id 
                  ? 'bg-blue-600/10 border-blue-600' 
                  : 'bg-white/5 border-white/10'
              }`}>
                <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-blue-400' : 'text-slate-400'}`} />
              </div>
              <span className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors ${
                activeTab === tab.id ? 'text-white' : 'text-slate-500'
              }`}>
                {tab.label}
              </span>
            </button>
          ))}
        </div>

        {/* Main Content Area */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="min-h-[400px]"
          >
            {activeTab === 'farm' && (
              <FarmAction profile={profile} onUpdate={onUpdate} />
            )}
            {activeTab === 'mining' && (
              <MiningAction profile={profile} onUpdate={onUpdate} />
            )}
            {activeTab === 'inventory' && (
              <Inventory profile={profile} onUpdate={onUpdate} />
            )}
            {activeTab === 'profile' && (
              <ProfileStats profile={profile} />
            )}
            {activeTab === 'wiki' && (
              <Wiki />
            )}
            {activeTab === 'skill_tree' && (
              <div className="bg-brand-card border border-white/5 p-12 rounded-[2.5rem] flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-brand-inner rounded-3xl flex items-center justify-center text-3xl mb-6 shadow-inner border border-white/5">
                  <Zap className="text-amber-500" />
                </div>
                <h2 className="text-2xl font-black text-white italic tracking-tighter mb-4">Árvore de Habilidades</h2>
                <p className="text-slate-500 max-w-sm italic text-sm">
                  Desbloqueie talentos passivos e habilidades ativas conforme você progride no jogo.
                </p>
                <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
                  {['Combat', 'Gathering', 'Crafting'].map(skill => (
                    <div key={skill} className="bg-brand-bg/50 p-6 rounded-2xl border border-white/5 opacity-50 grayscale hover:opacity-100 hover:grayscale-0 transition-all cursor-not-allowed group">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 group-hover:text-amber-500">{skill}</p>
                      <p className="text-xs text-white font-bold italic">Em breve</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {!['farm', 'inventory', 'profile', 'wiki', 'mining', 'skill_tree'].includes(activeTab) && (
              <div className="bg-brand-card border border-white/5 p-20 rounded-[2.5rem] flex flex-col items-center text-center justify-center min-h-[500px] relative overflow-hidden shadow-2xl">
                 <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.05)_0%,transparent_70%)]"></div>
                 <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="w-32 h-32 bg-brand-inner rounded-3xl flex items-center justify-center text-5xl mb-8 shadow-inner border border-white/5 relative z-10"
                 >
                    {tabs.find(t => t.id === activeTab)?.icon && <div className="text-blue-500"><IconComponent icon={tabs.find(t => t.id === activeTab)!.icon} /></div>}
                 </motion.div>
                 <div className="relative z-10">
                   <h2 className="text-[10px] font-black uppercase tracking-[0.6em] text-slate-500 italic mb-4">Area Under Reconstruction</h2>
                   <h1 className="text-4xl font-black text-white italic tracking-tighter mb-6">{tabs.find(t => t.id === activeTab)?.label} Hub</h1>
                   <p className="text-slate-500 max-w-sm mx-auto italic text-sm leading-relaxed">
                     Os arquitetos do reino estão trabalhando incansavelmente para restaurar esta seção. Volte em breve para novas aventuras e funcionalidades.
                   </p>
                 </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function IconComponent({ icon: Icon }: { icon: any }) {
  return <Icon size={48} />;
}

function StatCard({ label, value, icon: Icon, color }: { label: string, value: number, icon: any, color: string }) {
  const colorMap: any = {
    rose: 'text-rose-500 bg-rose-500/10 border-rose-500/20',
    sky: 'text-sky-500 bg-sky-500/10 border-sky-500/20',
    amber: 'text-amber-500 bg-amber-500/10 border-amber-500/20'
  };

  return (
    <div className={`p-5 rounded-2xl border ${colorMap[color]} flex flex-col items-center justify-center gap-1 shadow-2xl backdrop-blur-md`}>
      <Icon className="w-5 h-5 opacity-80" />
      <span className="text-3xl font-black font-mono tracking-tighter">{value}</span>
      <span className="text-[9px] uppercase tracking-[0.2em] font-black opacity-50">{label}</span>
    </div>
  );
}

// Utility to calculate total stats including equipment
import { GAME_ITEMS } from '../services/gameService';

export function calculateTotalStat(profile: UserProfile, stat: keyof Stats) {
  if (!profile || !profile.stats) return 0;
  let total = profile.stats[stat] || 0;
  
  if (profile.equipped) {
    Object.values(profile.equipped).forEach(itemId => {
      if (itemId && GAME_ITEMS[itemId]) {
        const modifier = (GAME_ITEMS[itemId].modifiers as any)[stat];
        total += (typeof modifier === 'number' && !isNaN(modifier)) ? modifier : 0;
      }
    });
  }

  return isNaN(total) ? 0 : total;
}
