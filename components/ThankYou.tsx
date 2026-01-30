
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
    <div className="min-h-screen h-screen w-full flex flex-col items-center justify-center bg-[#070b14] text-center p-6 relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] h-[120vw] bg-indigo-600/5 rounded-full blur-[150px]" />
      </div>
      
      <div className="relative z-10 animate-fade-in-up flex flex-col items-center max-w-2xl w-full h-full justify-center max-h-[90vh] py-8">
        
        {/* Brand Core (Optimized for mobile) */}
        <div className="flex-shrink-0 mb-4 lg:mb-8">
          <div className="relative w-20 h-20 lg:w-32 lg:h-32 flex items-center justify-center mx-auto">
             <div className="absolute inset-0 border-[1px] border-indigo-500/30 rounded-full animate-spin-slow-reverse" />
             
             {isFinal ? (
               <div className="bg-gradient-to-br from-indigo-500 to-violet-700 p-5 lg:p-8 rounded-[1.8rem] shadow-2xl relative">
                 <CheckCircle2 className="w-8 h-8 lg:w-12 lg:h-12 text-white" />
                 <Star className="absolute -top-1 -right-1 w-5 h-5 text-amber-300 animate-pulse fill-amber-300" />
               </div>
             ) : (
               <div className="relative">
                 <Layers className="w-10 h-10 lg:w-16 lg:h-16 text-white" />
                 <div className="absolute inset-0 bg-indigo-500 blur-xl opacity-20 animate-pulse" />
               </div>
             )}
          </div>
        </div>

        {/* Messaging */}
        <div className="flex-shrink-1 flex flex-col items-center overflow-y-auto custom-scrollbar px-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-3 lg:mb-6">
            <ShieldCheck className="w-3 h-3 text-indigo-400" />
            <span className="text-indigo-400 text-[8px] font-black tracking-[0.4em] uppercase">Protocolo Sincronizado</span>
          </div>
          
          {isFinal ? (
            <div className="space-y-3 lg:space-y-6">
              <h1 className="text-3xl lg:text-5xl font-black text-white tracking-tighter leading-tight">
                Gratidão pela <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">sua jornada.</span>
              </h1>
              
              <p className="text-slate-300 text-xs lg:text-base font-light leading-relaxed max-w-md mx-auto opacity-90">
                Suas respostas foram processadas e armazenadas em nossa base de inteligência. Você será contatado em breve.
              </p>

              <div className="bg-white/5 border border-white/10 p-4 lg:p-6 rounded-[1.2rem] lg:rounded-[2rem] backdrop-blur-xl relative overflow-hidden mt-2 max-w-xs mx-auto">
                <p className="text-slate-400 text-[9px] lg:text-xs leading-relaxed relative z-10 italic">
                  "Conhecer a si mesmo é o começo de toda sabedoria verdadeira."
                </p>
              </div>

              <div className="pt-4 lg:pt-6">
                <button 
                  onClick={onContinue}
                  className="px-8 py-3.5 lg:px-12 lg:py-4 bg-white text-slate-950 font-black rounded-xl lg:rounded-2xl shadow-2xl hover:scale-105 active:scale-95 transition-all uppercase tracking-widest text-[9px] lg:text-xs"
                >
                  Finalizar Sessão
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
                Processando Perfil...
              </h1>
              <div className="relative h-1 w-40 lg:w-64 mx-auto bg-slate-800 rounded-full overflow-hidden">
                <div className="absolute top-0 left-0 h-full bg-indigo-500 w-1/3 animate-loading-bar" />
              </div>
              <p className="text-indigo-400 font-black text-[9px] tracking-[0.3em] uppercase animate-pulse">
                Sincronizando com a Nuvem
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Footer (Reduced opacity and size) */}
      <div className="absolute bottom-4 left-0 w-full flex flex-col items-center opacity-20">
        <div className="flex items-center gap-1.5">
           <Heart className="w-2.5 h-2.5 text-rose-500 fill-rose-500" />
           <p className="text-[7px] font-bold text-slate-500 tracking-[0.3em] uppercase">
             Insight360 • JOI.A. Platform
           </p>
        </div>
      </div>

      <style>{`
        .animate-spin-slow { animation: spin 10s linear infinite; }
        .animate-spin-slow-reverse { animation: spin 15s linear infinite reverse; }
        .animate-loading-bar { animation: loading 2s ease-in-out infinite; }
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes loading { 
          0% { left: -40%; width: 40%; }
          100% { left: 100%; width: 40%; }
        }
      `}</style>
    </div>
  );
};
