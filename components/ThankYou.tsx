
import React, { useEffect } from 'react';
import { Layers, Sparkles, CheckCircle2, Heart } from 'lucide-react';

interface ThankYouProps {
  onContinue: () => void;
  isFinal?: boolean; // Define se é a tela final ou apenas de processamento
}

export const ThankYou: React.FC<ThankYouProps> = ({ onContinue, isFinal = false }) => {
  useEffect(() => {
    if (!isFinal) {
      // Se for apenas processamento, aguarda um tempo e continua automaticamente
      const timer = setTimeout(() => {
        onContinue();
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [onContinue, isFinal]);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#0f172a] text-center p-6 relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] bg-indigo-600/10 rounded-full blur-[120px]" />
        <div className="absolute top-0 right-0 w-[40vw] h-[40vw] bg-violet-600/5 rounded-full blur-[100px]" />
      </div>
      
      <div className="relative z-10 animate-fade-in-up max-w-2xl w-full">
        
        {/* Logo & Icon Animation */}
        <div className="flex justify-center mb-10">
          <div className="relative w-28 h-28 lg:w-36 lg:h-36 flex items-center justify-center">
             <div className="absolute inset-0 border-2 border-indigo-500/20 rounded-full animate-spin-slow-reverse" />
             <div className="absolute inset-3 border-[1px] border-indigo-400/40 rounded-full border-t-transparent animate-spin-slow" />
             
             {isFinal ? (
               <div className="bg-gradient-to-br from-indigo-500 to-violet-600 p-6 rounded-3xl shadow-[0_0_30px_rgba(99,102,241,0.5)] animate-bounce-slow">
                 <CheckCircle2 className="w-12 h-12 lg:w-16 lg:h-16 text-white" />
               </div>
             ) : (
               <Layers className="w-12 h-12 lg:w-16 lg:h-16 text-white relative z-10 drop-shadow-[0_0_20px_rgba(139,92,246,0.8)]" />
             )}
          </div>
        </div>

        {/* Branding & Message */}
        <div className="mb-8">
          <h2 className="text-indigo-400 text-[10px] lg:text-xs font-black tracking-[0.6em] uppercase mb-4 select-none">
            Insight360 Intelligence
          </h2>
          
          {isFinal ? (
            <>
              <h1 className="text-4xl lg:text-6xl font-black text-white mb-6 tracking-tight leading-tight">
                Mapeamento <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">Concluído!</span>
              </h1>
              <p className="text-slate-300 text-lg lg:text-2xl font-light mb-10 leading-relaxed italic">
                "O autoconhecimento é o início de toda a sabedoria."
              </p>
              <div className="space-y-6 text-slate-400 text-sm lg:text-base leading-relaxed bg-white/5 border border-white/10 p-8 rounded-[2.5rem] backdrop-blur-sm">
                <p>
                  Agradecemos imensamente o tempo e a sinceridade dedicados a este diagnóstico. Suas respostas foram processadas com sucesso em nossa base de inteligência.
                </p>
                <p className="font-medium text-indigo-300">
                  Seu perfil agora faz parte do nosso ecossistema 360°. O administrador entrará em contato em breve para a devolutiva do seu relatório completo.
                </p>
              </div>
            </>
          ) : (
            <>
              <h1 className="text-4xl lg:text-5xl font-extrabold text-white mb-6 tracking-tight">
                Quase lá...
              </h1>
              <p className="text-slate-300 text-lg lg:text-xl font-light mb-10 max-w-lg mx-auto leading-relaxed">
                Estamos correlacionando suas 21 dimensões comportamentais para gerar sua impressão digital psicológica.
              </p>
              <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 px-10 py-5 rounded-2xl text-indigo-300 backdrop-blur-md shadow-2xl">
                <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-ping"></div>
                <span className="font-black text-xs tracking-[0.3em] uppercase">Sincronizando Dados...</span>
                <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
              </div>
            </>
          )}
        </div>

        {isFinal && (
          <button 
            onClick={onContinue}
            className="mt-8 px-12 py-5 bg-white text-slate-900 font-black rounded-2xl hover:bg-indigo-50 transition-all shadow-2xl active:scale-95 uppercase tracking-[0.2em] text-xs"
          >
            Finalizar Sessão
          </button>
        )}
      </div>

      <div className="absolute bottom-10 left-0 w-full text-center px-6">
        <div className="flex items-center justify-center gap-2 mb-2">
           <Heart className="w-3 h-3 text-rose-500 fill-rose-500 animate-pulse" />
           <p className="text-[10px] font-bold text-slate-500 tracking-[0.4em] uppercase">
             Segurança e Confidencialidade JOI.A.
           </p>
        </div>
      </div>

      <style>{`
        .animate-spin-slow { animation: spin 4s linear infinite; }
        .animate-spin-slow-reverse { animation: spin 5s linear infinite reverse; }
        .animate-bounce-slow { animation: bounce 3s ease-in-out infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
      `}</style>
    </div>
  );
};
