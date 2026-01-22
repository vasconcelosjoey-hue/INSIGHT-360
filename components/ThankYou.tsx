
import React, { useEffect } from 'react';
import { Layers, Sparkles, CheckCircle2, Heart, Star, ShieldCheck } from 'lucide-react';

interface ThankYouProps {
  onContinue: () => void;
  isFinal?: boolean;
}

export const ThankYou: React.FC<ThankYouProps> = ({ onContinue, isFinal = false }) => {
  useEffect(() => {
    if (!isFinal) {
      const timer = setTimeout(() => {
        onContinue();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [onContinue, isFinal]);

  return (
    <div className="min-h-screen h-screen w-full flex flex-col items-center justify-center bg-[#070b14] text-center p-6 relative overflow-hidden">
      
      {/* Background Particles & Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100vw] h-[100vw] bg-indigo-600/5 rounded-full blur-[150px]" />
        <div className="absolute top-0 left-0 w-full h-full opacity-30">
          <div className="absolute top-[20%] left-[10%] w-2 h-2 bg-white rounded-full animate-ping" />
          <div className="absolute top-[60%] left-[80%] w-1 h-1 bg-indigo-400 rounded-full animate-pulse" />
          <div className="absolute top-[40%] left-[40%] w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce" />
          <div className="absolute top-[80%] left-[20%] w-2 h-2 bg-white/20 rounded-full animate-pulse" />
        </div>
      </div>
      
      <div className="relative z-10 animate-fade-in-up max-w-2xl w-full">
        
        {/* Animated Brand Core */}
        <div className="flex justify-center mb-12">
          <div className="relative w-32 h-32 lg:w-44 lg:h-44 flex items-center justify-center">
             <div className="absolute inset-0 border-[1px] border-indigo-500/30 rounded-full animate-spin-slow-reverse" />
             <div className="absolute inset-4 border-[1px] border-indigo-400/20 rounded-full border-t-indigo-500 animate-spin-slow" />
             
             {isFinal ? (
               <div className="bg-gradient-to-br from-indigo-500 via-indigo-600 to-violet-700 p-8 rounded-[2.5rem] shadow-[0_0_50px_rgba(79,70,229,0.4)] relative group transition-transform hover:scale-105 duration-500">
                 <CheckCircle2 className="w-16 h-16 lg:w-20 lg:h-20 text-white drop-shadow-lg" />
                 <Star className="absolute -top-2 -right-2 w-8 h-8 text-amber-300 animate-pulse fill-amber-300" />
               </div>
             ) : (
               <div className="relative">
                 <Layers className="w-16 h-16 lg:w-24 lg:h-24 text-white drop-shadow-[0_0_20px_rgba(99,102,241,0.6)]" />
                 <div className="absolute inset-0 bg-indigo-500 blur-2xl opacity-20 animate-pulse" />
               </div>
             )}
          </div>
        </div>

        {/* Messaging Hierarchy */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-6">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-indigo-400 text-[9px] font-black tracking-[0.4em] uppercase">Protocolo Finalizado</span>
          </div>
          
          {isFinal ? (
            <div className="space-y-6">
              <h1 className="text-5xl lg:text-7xl font-black text-white tracking-tighter leading-none">
                Gratidão pela <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-400 to-indigo-400 bg-[length:200%_auto] animate-shimmer">sua jornada.</span>
              </h1>
              
              <div className="space-y-4 max-w-lg mx-auto">
                <p className="text-slate-300 text-lg lg:text-xl font-light leading-relaxed">
                  Suas respostas foram processadas e armazenadas com segurança em nossa base de inteligência.
                </p>
                <div className="h-0.5 w-12 bg-indigo-500/30 mx-auto rounded-full" />
                <p className="text-slate-400 text-sm italic font-serif">
                  "Conhecer a si mesmo é o começo de toda sabedoria verdadeira."
                </p>
              </div>

              <div className="mt-12 bg-white/5 border border-white/10 p-6 lg:p-8 rounded-[2rem] backdrop-blur-xl shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-transparent" />
                <p className="text-slate-200 text-sm lg:text-base leading-relaxed relative z-10">
                  O administrador do <strong>Insight360</strong> recebeu sua notificação. <br />
                  Você será contatado em breve para receber sua devolutiva personalizada e o relatório oficial completo.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              <h1 className="text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
                Analisando Perfil...
              </h1>
              <p className="text-slate-400 text-lg font-light max-w-md mx-auto">
                Nossa IA está cruzando suas 21 dimensões para gerar sua impressão digital comportamental.
              </p>
              
              <div className="relative h-1 w-64 mx-auto bg-slate-800 rounded-full overflow-hidden">
                <div className="absolute top-0 left-0 h-full bg-indigo-500 w-1/3 animate-loading-bar" />
              </div>

              <div className="flex items-center justify-center gap-3 text-indigo-400 font-black text-[10px] tracking-[0.3em] uppercase">
                <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-ping" />
                Sincronizando com a Nuvem
              </div>
            </div>
          )}
        </div>

        {isFinal && (
          <button 
            onClick={onContinue}
            className="group relative px-16 py-5 bg-white text-slate-950 font-black rounded-2xl transition-all shadow-[0_20px_50px_rgba(255,255,255,0.1)] hover:shadow-[0_25px_60px_rgba(99,102,241,0.2)] active:scale-95 uppercase tracking-[0.2em] text-xs overflow-hidden"
          >
            <span className="relative z-10">Finalizar e Sair</span>
            <div className="absolute inset-0 bg-indigo-50 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </button>
        )}
      </div>

      {/* Persistent Footer */}
      <div className="absolute bottom-10 left-0 w-full flex flex-col items-center opacity-40">
        <div className="flex items-center gap-3 mb-2">
           <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
           <p className="text-[10px] font-bold text-slate-500 tracking-[0.4em] uppercase">
             Ecossistema Insight360 • JOI.A. Platform
           </p>
        </div>
      </div>

      <style>{`
        .animate-spin-slow { animation: spin 10s linear infinite; }
        .animate-spin-slow-reverse { animation: spin 15s linear infinite reverse; }
        .animate-shimmer { background-size: 200% auto; animation: shimmer 3s linear infinite; }
        .animate-loading-bar { animation: loading 2s ease-in-out infinite; }
        
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes shimmer { to { background-position: 200% center; } }
        @keyframes loading { 
          0% { left: -40%; width: 40%; }
          50% { left: 40%; width: 60%; }
          100% { left: 100%; width: 40%; }
        }
      `}</style>
    </div>
  );
};
