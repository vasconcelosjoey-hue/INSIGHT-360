
import React, { useEffect } from 'react';
import { Layers, CheckCircle2, Star, ShieldCheck, Heart } from 'lucide-react';

interface ThankYouProps {
  onContinue: () => void;
  isFinal?: boolean;
}

export const ThankYou: React.FC<ThankYouProps> = ({ onContinue, isFinal = false }) => {
  useEffect(() => {
    if (!isFinal) {
      const timer = setTimeout(() => {
        onContinue();
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [onContinue, isFinal]);

  return (
    <div className="min-h-screen h-screen w-full flex flex-col items-center justify-center bg-[#070b14] text-center p-4 relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] h-[120vw] bg-indigo-600/5 rounded-full blur-[150px]" />
      </div>
      
      <div className="relative z-10 animate-fade-in-up flex flex-col items-center max-w-2xl w-full h-full justify-center max-h-screen">
        
        {/* Brand Core (Smaller for mobile) */}
        <div className="flex-shrink-0 mb-6 lg:mb-10">
          <div className="relative w-24 h-24 lg:w-40 lg:h-40 flex items-center justify-center">
             <div className="absolute inset-0 border-[1px] border-indigo-500/30 rounded-full animate-spin-slow-reverse" />
             
             {isFinal ? (
               <div className="bg-gradient-to-br from-indigo-500 to-violet-700 p-6 lg:p-10 rounded-[2rem] shadow-2xl relative">
                 <CheckCircle2 className="w-10 h-10 lg:w-16 lg:h-16 text-white" />
                 <Star className="absolute -top-1 -right-1 w-6 h-6 text-amber-300 animate-pulse fill-amber-300" />
               </div>
             ) : (
               <div className="relative">
                 <Layers className="w-12 h-12 lg:w-20 lg:h-20 text-white" />
                 <div className="absolute inset-0 bg-indigo-500 blur-xl opacity-20 animate-pulse" />
               </div>
             )}
          </div>
        </div>

        {/* Messaging */}
        <div className="flex-shrink-0 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-4 lg:mb-6">
            <ShieldCheck className="w-3 h-3 text-indigo-400" />
            <span className="text-indigo-400 text-[8px] font-black tracking-[0.4em] uppercase">Protocolo Sincronizado</span>
          </div>
          
          {isFinal ? (
            <div className="space-y-4 lg:space-y-8 px-2">
              <h1 className="text-3xl lg:text-6xl font-black text-white tracking-tighter leading-tight">
                Gratidão pela <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">sua jornada.</span>
              </h1>
              
              <p className="text-slate-300 text-sm lg:text-lg font-light leading-relaxed max-w-md mx-auto">
                Suas respostas foram processadas e armazenadas em nossa base de inteligência. Você será contatado em breve.
              </p>

              <div className="bg-white/5 border border-white/10 p-4 lg:p-8 rounded-[1.5rem] lg:rounded-[2.5rem] backdrop-blur-xl relative overflow-hidden mt-4">
                <p className="text-slate-400 text-[10px] lg:text-xs leading-relaxed relative z-10 italic">
                  "Conhecer a si mesmo é o começo de toda sabedoria verdadeira."
                </p>
              </div>

              <div className="pt-4 lg:pt-8">
                <button 
                  onClick={onContinue}
                  className="px-10 py-4 lg:px-14 lg:py-5 bg-white text-slate-950 font-black rounded-xl lg:rounded-2xl shadow-2xl hover:scale-105 active:scale-95 transition-all uppercase tracking-widest text-[10px] lg:text-xs"
                >
                  Finalizar Sessão
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <h1 className="text-2xl lg:text-4xl font-extrabold text-white tracking-tight">
                Processando Perfil...
              </h1>
              <div className="relative h-1 w-48 lg:w-64 mx-auto bg-slate-800 rounded-full overflow-hidden">
                <div className="absolute top-0 left-0 h-full bg-indigo-500 w-1/3 animate-loading-bar" />
              </div>
              <p className="text-indigo-400 font-black text-[9px] tracking-[0.3em] uppercase animate-pulse">
                Sincronizando com a Nuvem
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-6 left-0 w-full flex flex-col items-center opacity-30">
        <div className="flex items-center gap-2">
           <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
           <p className="text-[8px] font-bold text-slate-500 tracking-[0.3em] uppercase">
             Insight360 • JOI.A. Platform
           </p>
        </div>
      </div>

      <style>{`
        .animate-spin-slow { animation: spin 10s linear infinite; }
        .animate-spin-slow-reverse { animation: spin 15s linear infinite reverse; }
        .animate-loading-bar { animation: loading 2s ease-in-out infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes loading { 
          0% { left: -40%; width: 40%; }
          100% { left: 100%; width: 40%; }
        }
      `}</style>
    </div>
  );
};
