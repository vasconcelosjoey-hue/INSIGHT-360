
import React, { useState } from 'react';
import { Check, ArrowRight, Layers, Home, ArrowLeft } from 'lucide-react';

interface WelcomeWizardProps {
  onComplete: () => void;
  onBack: () => void;
}

const BRAND_LOGO_URL = "https://firebasestorage.googleapis.com/v0/b/insight360-ae5c7.firebasestorage.app/o/ChatGPT%20Image%2029%20de%20jan.%20de%202026%2C%2022_42_41.png?alt=media&token=26c0189e-d7ee-4591-91bb-b9dcb37f5e12";

export const WelcomeWizard: React.FC<WelcomeWizardProps> = ({ onComplete, onBack }) => {
  const [step, setStep] = useState(1);
  const totalSteps = 3;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      onBack();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0f172a] animate-fade-in overflow-hidden">
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl" />

      <div className="relative w-full max-w-lg bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90dvh] transition-all">
        
        <div className="pt-8 px-8 pb-4 flex-shrink-0 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={onBack}>
            <div className="bg-white p-1 rounded-lg shadow-lg group-hover:scale-110 transition-transform w-10 h-10 flex items-center justify-center overflow-hidden">
               <img src={BRAND_LOGO_URL} alt="Logo" className="w-full h-full object-contain" />
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-white tracking-wide">
              Bem-vindo
            </h2>
          </div>
          <button onClick={onBack} className="p-2 text-slate-500 hover:text-white transition-colors">
            <Home className="w-5 h-5" />
          </button>
        </div>

        <div className="px-8 py-4 flex-shrink-0">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 top-1/2 w-full h-[2px] bg-slate-700/50 -z-10 transform -translate-y-1/2"></div>
            {[1, 2, 3].map((s) => {
              const isActive = s === step;
              const isCompleted = s < step;
              return (
                <div 
                  key={s} 
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-500
                    ${isActive 
                        ? 'bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/50 scale-110' 
                        : isCompleted 
                            ? 'bg-indigo-900/50 text-indigo-400 border border-indigo-500/30' 
                            : 'bg-slate-800 text-slate-500 border border-slate-700'}
                  `}
                >
                  {isCompleted ? <Check className="w-5 h-5" /> : s}
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex-grow px-8 py-6 flex items-center overflow-y-auto">
          <div className="text-slate-300 text-lg leading-relaxed font-light">
            {step === 1 && (
              <div className="animate-fade-in-up space-y-4">
                <h3 className="text-2xl font-bold text-white">Ciência Comportamental</h3>
                <p>
                  O <strong className="text-indigo-400">Insight360</strong> utiliza uma metodologia moderna baseada em neurociências para mapear suas tendências naturais.
                </p>
              </div>
            )}
            {step === 2 && (
              <div className="animate-fade-in-up space-y-4">
                <h3 className="text-2xl font-bold text-white">Análise Multidimensional</h3>
                <p>
                  Analisamos <strong className="text-indigo-400">21 dimensões distintas</strong>. Isso gera uma impressão digital única da sua personalidade.
                </p>
              </div>
            )}
            {step === 3 && (
              <div className="animate-fade-in-up space-y-4">
                <h3 className="text-2xl font-bold text-white">Sem Julgamentos</h3>
                <p>
                  Não existem perfis "bons" ou "ruins". Responda com sinceridade absoluta para garantir a precisão do seu relatório exclusivo.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="p-8 pt-4 flex justify-between gap-4 flex-shrink-0 border-t border-white/5 bg-black/20">
          <button
            onClick={handlePrev}
            className={`px-6 py-3 rounded-xl font-medium transition-all text-sm text-slate-300 hover:text-white hover:bg-white/5 flex items-center gap-2`}
          >
            <ArrowLeft className="w-4 h-4" />
            {step === 1 ? 'Sair' : 'Voltar'}
          </button>
          
          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-105 transition-all duration-300"
          >
            {step === 3 ? 'Vamos Começar' : 'Continuar'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
