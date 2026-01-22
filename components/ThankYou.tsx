
import React, { useEffect } from 'react';
import { Layers, Heart, Sparkles } from 'lucide-react';

interface ThankYouProps {
  onContinue: () => void;
}

export const ThankYou: React.FC<ThankYouProps> = ({ onContinue }) => {
  useEffect(() => {
    // A tela fica visível por 4 segundos antes de processar os resultados
    const timer = setTimeout(() => {
      onContinue();
    }, 4500);
    return () => clearTimeout(timer);
  }, [onContinue]);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#0f172a] text-center p-6 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="relative z-10 animate-fade-in-up">
        {/* Logo Animation */}
        <div className="flex justify-center mb-8">
          <div className="relative w-24 h-24 flex items-center justify-center">
             <div className="absolute inset-0 border-2 border-indigo-500/30 rounded-full animate-spin-slow-reverse" />
             <div className="absolute inset-2 border-2 border-violet-500/50 rounded-full border-t-transparent animate-spin-slow" />
             <Layers className="w-12 h-12 text-white relative z-10 drop-shadow-[0_0_15px_rgba(139,92,246,0.6)]" />
          </div>
        </div>

        {/* Branding */}
        <div className="mb-6">
          <h2 className="text-white text-xs font-black tracking-[0.5em] uppercase opacity-50 mb-2">Insight360 Intelligence</h2>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
            Grato pelo seu tempo!
          </h1>
        </div>

        <p className="text-slate-300 text-lg md:text-xl font-light mb-8 max-w-lg mx-auto leading-relaxed">
          Suas respostas foram registradas com sucesso. Estamos utilizando nossa IA para gerar seu diagnóstico multidimensional agora mesmo.
        </p>

        {/* Status Indicator */}
        <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 px-8 py-4 rounded-2xl text-indigo-300 backdrop-blur-md">
          <div className="w-2 h-2 bg-indigo-400 rounded-full animate-ping"></div>
          <span className="font-bold text-sm tracking-widest uppercase">Processando Dimensões...</span>
          <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
        </div>
      </div>

      <div className="absolute bottom-10 left-0 w-full text-center opacity-30">
        <p className="text-[10px] font-bold text-slate-500 tracking-[0.4em] uppercase">
          Confidencialidade Garantida
        </p>
      </div>
    </div>
  );
};
