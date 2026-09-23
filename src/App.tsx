import { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, signInWithGoogle, testConnection } from './lib/firebase';
import { gameService } from './services/gameService';
import { UserProfile } from './types/game';
import { Layout } from './components/Layout';
import { Game } from './components/Game';
import { LoadingScreen } from './components/LoadingScreen';
import { LogIn, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [assetsLoaded, setAssetsLoaded] = useState(false);

  const [setupName, setSetupName] = useState('');
  const [isNamingUser, setIsNamingUser] = useState(false);

  useEffect(() => {
    testConnection();
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        try {
          const userProfile = await gameService.getUserProfile(firebaseUser.uid);
          if (!userProfile) {
            setIsNamingUser(true);
          } else {
            setProfile(userProfile);
          }
        } catch (error) {
          console.error("Erro ao carregar perfil:", error);
        }
      } else {
        setProfile(null);
        setIsNamingUser(false);
        setAssetsLoaded(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleCreateProfile = async () => {
    if (!user || !setupName.trim()) return;
    setLoading(true);
    try {
      const p = await gameService.createUserProfile(user.uid, setupName.trim());
      setProfile(p);
      setIsNamingUser(false);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const refreshProfile = async () => {
    if (user) {
      const p = await gameService.getUserProfile(user.uid);
      setProfile(p);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-bg flex flex-col items-center justify-center text-slate-100 font-sans border-[12px] border-brand-inner">
        <Loader2 className="w-12 h-12 animate-spin text-blue-500 mb-4" />
        <p className="text-slate-500 animate-pulse uppercase tracking-[0.4em] text-[10px] font-black">Establishing Connection...</p>
      </div>
    );
  }

  return (
    <Layout profile={profile}>
      <AnimatePresence mode="wait">
        {!user ? (
          <motion.div 
            key="login"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-md mx-auto mt-20 p-10 border border-white/5 bg-brand-card/50 backdrop-blur-2xl rounded-3xl text-center shadow-2xl"
          >
            <div className="w-20 h-20 bg-gradient-to-tr from-blue-600 to-indigo-700 rounded-2xl mx-auto mb-8 shadow-xl shadow-blue-500/20 flex items-center justify-center rotate-3">
               <span className="text-3xl font-black text-white">C</span>
            </div>
            <h1 className="text-4xl font-black mb-2 text-white italic tracking-tighter">
              Chronicles Infinit Grind
            </h1>
            <p className="text-slate-500 mb-10 text-xs uppercase tracking-widest font-bold">
              Secure Cloud RPG Adventure
            </p>
            <button
              onClick={signInWithGoogle}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-slate-100 text-slate-950 font-black uppercase tracking-widest text-xs rounded-xl hover:bg-white transition-all active:scale-95 shadow-xl"
            >
              <LogIn className="w-4 h-4" />
              Sign in with Google
            </button>
          </motion.div>
        ) : isNamingUser ? (
          <motion.div
            key="naming"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md mx-auto mt-20 p-10 border border-white/5 bg-brand-card/50 backdrop-blur-2xl rounded-3xl text-center shadow-2xl"
          >
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-400 italic mb-2">New Identity Required</h2>
            <h1 className="text-3xl font-black text-white italic tracking-tighter mb-8">Character Alias</h1>
            
            <div className="space-y-6">
              <div className="relative">
                <input 
                  type="text" 
                  value={setupName}
                  onChange={(e) => setSetupName(e.target.value)}
                  placeholder="Enter your name..."
                  className="w-full bg-brand-bg border border-white/10 rounded-xl px-4 py-4 text-white focus:border-blue-500 outline-none transition-all placeholder:text-slate-700 font-bold"
                />
              </div>
              
              <button
                onClick={handleCreateProfile}
                disabled={!setupName.trim()}
                className="w-full py-4 bg-blue-600 text-white font-black uppercase tracking-widest text-xs rounded-xl hover:bg-blue-500 transition-all disabled:opacity-30 disabled:pointer-events-none"
              >
                Assemble Character
              </button>
            </div>
          </motion.div>
        ) : (
          profile && (
            !assetsLoaded ? (
              <LoadingScreen onComplete={() => setAssetsLoaded(true)} />
            ) : (
              <Game 
                user={user} 
                profile={profile} 
                onUpdate={refreshProfile} 
              />
            )
          )
        )}
      </AnimatePresence>
    </Layout>
  );
}
