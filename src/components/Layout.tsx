import React from 'react';
import { LogOut, User as UserIcon, Coins, Gem } from 'lucide-react';
import { auth } from '../lib/firebase';
import { UserProfile } from '../types/game';

export function Layout({ children, profile }: { children: React.ReactNode, profile?: UserProfile | null }) {
  return (
    <div id="app-layout" className="min-h-screen bg-brand-bg text-slate-100 selection:bg-blue-500/30 border-[12px] border-brand-inner">
      <nav className="fixed top-3 left-3 right-3 z-50 bg-brand-card/80 backdrop-blur-md border border-white/5 rounded-xl mx-4">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-lg shadow-lg shadow-blue-500/20">
              <span className="text-white">C</span>
            </div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-bold leading-tight">Chronicles</p>
              <h1 className="font-bold tracking-tight text-white leading-none">Infinit Grind</h1>
            </div>
          </div>
          
          <div className="flex items-center gap-8">
            {profile && (
              <div className="hidden lg:flex items-center gap-6 pr-6 border-r border-white/5">
                <div className="flex items-center gap-2 group transition-all" title="Prata">
                  <div className="w-6 h-6 rounded-full bg-slate-300/10 border border-slate-300/20 flex items-center justify-center shadow-[0_0_10px_rgba(203,213,225,0.1)] group-hover:scale-110 transition-transform">
                    <Coins className="w-3.5 h-3.5 text-slate-300" />
                  </div>
                  <span className="text-sm font-mono font-black text-slate-200 tracking-tighter">{profile.currencies?.silver || 0}</span>
                </div>
                <div className="flex items-center gap-2 group transition-all" title="Ouro">
                  <div className="w-6 h-6 rounded-full bg-amber-400/10 border border-amber-400/20 flex items-center justify-center shadow-[0_0_10px_rgba(251,191,36,0.1)] group-hover:scale-110 transition-transform">
                    <Coins className="w-3.5 h-3.5 text-amber-400" />
                  </div>
                  <span className="text-sm font-mono font-black text-amber-400 tracking-tighter">{profile.currencies?.gold || 0}</span>
                </div>
                <div className="flex items-center gap-2 group transition-all" title="Crystal">
                  <div className="w-6 h-6 rounded-full bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center shadow-[0_0_10px_rgba(34,211,238,0.1)] group-hover:scale-110 transition-transform">
                    <Gem className="w-3.5 h-3.5 text-cyan-400" />
                  </div>
                  <span className="text-sm font-mono font-black text-cyan-400 tracking-tighter">{profile.currencies?.crystal || 0}</span>
                </div>
              </div>
            )}

            {auth.currentUser && (
              <div className="flex items-center gap-4">
                <div className="hidden sm:flex flex-col items-end">
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Cloud Account</p>
                  <p className="text-xs font-semibold italic text-blue-400">
                    {auth.currentUser.email}
                  </p>
                </div>
                <div className="w-px h-8 bg-slate-800"></div>
                <button 
                  onClick={() => auth.signOut()}
                  className="p-2 hover:bg-white/5 rounded-full transition-colors group"
                  title="Sair"
                >
                  <LogOut className="w-5 h-5 text-slate-500 group-hover:text-rose-400" />
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
      
      <main className="pt-32 pb-12 px-6 max-w-5xl mx-auto min-h-[calc(100vh-24px)]">
        {children}
      </main>
      
      <footer className="py-8 text-center text-slate-600 text-[10px] uppercase tracking-[0.3em] font-bold">
        &copy; 2026 Chronicles Infinit Grind • Cloud Synced
      </footer>
    </div>
  );
}
