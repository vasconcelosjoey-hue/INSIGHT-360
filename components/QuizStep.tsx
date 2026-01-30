
import React, { useState, useEffect } from 'react';
import { Question } from '../types';
import { ChevronLeft, ChevronRight, Check, AlertCircle } from 'lucide-react';

interface QuizStepProps {
  question: Question;
  currentNumber: number;
  totalQuestions: number;
  selectedAnswer?: number;
  onAnswer: (value: number) => void;
  onPrevious: () => void;
  onNext: () => void;
  isCorporate?: boolean;
}

export const QuizStep: React.FC<QuizStepProps> = ({ 
  question, 
  currentNumber, 
  totalQuestions, 
  selectedAnswer,
  onAnswer,
  onPrevious,
  onNext,
  isCorporate = false
}) => {
  const [shake, setShake] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [transitioning, setTransitioning] = useState(false);

  // Efeito de transição quando o número da pergunta muda
  useEffect(() => {
    setTransitioning(true);
    const timer = setTimeout(() => setTransitioning(false), 400);
    return () => clearTimeout(timer);
  }, [currentNumber]);

  if (!question) return null;

  const options = [
    { value: 5, label: "Concordo totalmente" },
    { value: 4, label: "Concordo parcialmente" },
    { value: 3, label: "Neutro / Não sei" },
    { value: 2, label: "Discordo parcialmente" },
    { value: 1, label: "Discordo totalmente" },
  ];

  const handleNextClick = () => {
    if (!selectedAnswer) {
      setShake(true);
      setShowErrorPopup(true);
      setTimeout(() => setShake(false), 500);
      setTimeout(() => setShowErrorPopup(false), 3000);
      return;
    }
    onNext();
  };

  const isLastQuestion = currentNumber === totalQuestions;
  const progress = (currentNumber / totalQuestions) * 100;

  const themeColorClass = isCorporate ? 'bg-orange-600' : 'bg-indigo-600';
  const themeBorderClass = isCorporate ? 'border-orange-600' : 'border-indigo-600';
  const themeTextHeader = isCorporate ? 'text-orange-900' : 'text-indigo-900';
  const themeHoverBorder = isCorporate ? 'hover:border-orange-200' : 'hover:border-indigo-200';
  const themeIndicator = isCorporate ? 'text-orange-500' : 'text-indigo-500';

  return (
    <div className="h-full w-full flex flex-col bg-white overflow-hidden relative">
      
      {/* Erro Popup Visual */}
      {showErrorPopup && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-[100] bg-rose-600 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-fade-in-up border border-rose-400">
          <AlertCircle className="w-5 h-5" />
          <span className="font-bold text-sm tracking-tight">Escolha uma alternativa antes de prosseguir!</span>
        </div>
      )}

      {/* Progress Header */}
      <div className="p-4 md:px-8 pt-6 flex-shrink-0">
        <div className="flex justify-between items-center mb-2 px-1">
          <span className={`text-[10px] font-black ${themeTextHeader} tracking-[0.2em] uppercase`}>
            {isCorporate ? 'VitalPulse Analytics' : 'Mapeamento 360°'}
          </span>
          <span className="text-sm font-bold text-slate-500">
            Questão {currentNumber} de {totalQuestions}
          </span>
        </div>
        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div 
            className={`h-full ${themeColorClass} transition-all duration-500 ease-out`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Main Question Area - Compact and scroll-free */}
      <div className={`flex-grow flex flex-col justify-center px-4 md:px-12 py-2 transition-all duration-400 ${transitioning ? 'opacity-0 translate-x-10' : 'opacity-100 translate-x-0'} ${shake ? 'animate-shake' : ''}`}>
        
        <div className="max-w-3xl mx-auto w-full">
          {/* Question Text */}
          <div className="mb-6 md:mb-10 text-center">
            <h3 className="text-lg md:text-3xl font-extrabold text-slate-900 leading-tight">
              {question.text}
            </h3>
            <div className={`w-12 h-1 ${isCorporate ? 'bg-orange-500' : 'bg-indigo-500'} mx-auto mt-4 rounded-full opacity-50`}></div>
          </div>

          {/* Options List */}
          <div className="grid grid-cols-1 gap-2 md:gap-3">
            {options.map((opt) => {
              const isSelected = selectedAnswer === opt.value;
              return (
                <button 
                  key={opt.value} 
                  onClick={() => onAnswer(opt.value)}
                  className={`
                    flex items-center p-3 md:p-4 rounded-2xl transition-all duration-200 border-2 text-left
                    ${isSelected 
                      ? `${themeColorClass} ${themeBorderClass} text-white shadow-lg` 
                      : `bg-white border-slate-100 ${themeHoverBorder} text-slate-600`}
                  `}
                >
                  <div className={`
                    w-5 h-5 rounded-full border-2 flex items-center justify-center mr-3 flex-shrink-0
                    ${isSelected ? 'border-white' : 'border-slate-200'}
                  `}>
                    {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
                  </div>
                  <span className="text-sm md:text-lg font-bold tracking-tight">
                    {opt.label}
                  </span>
                  {isSelected && (
                    <Check className="ml-auto w-4 h-4 text-white" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Navigation Footer - Fixed at bottom */}
      <div className="flex-shrink-0 p-4 md:p-8 bg-slate-50/80 backdrop-blur-sm border-t border-slate-200 flex justify-between items-center z-50">
        <button 
          onClick={onPrevious}
          disabled={currentNumber === 1}
          className={`
            flex items-center gap-1.5 px-4 py-3 rounded-xl font-bold transition-all text-xs md:text-sm uppercase tracking-widest
            ${currentNumber === 1 
              ? 'text-slate-300' 
              : `text-slate-500 hover:${themeIndicator}`}
          `}
        >
          <ChevronLeft className="w-4 h-4" />
          Anterior
        </button>

        <button 
          onClick={handleNextClick}
          className={`
            flex items-center gap-1.5 px-8 md:px-12 py-4 rounded-2xl font-black text-white shadow-xl transition-all duration-300 active:scale-95 text-xs md:text-sm uppercase tracking-[0.2em]
            ${isLastQuestion
              ? 'bg-emerald-600 shadow-emerald-600/20' 
              : 'bg-slate-900 shadow-slate-900/20 hover:bg-black'}
          `}
        >
          {isLastQuestion ? 'Finalizar' : 'Próximo'}
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        .animate-shake { animation: shake 0.5s ease-in-out; }
      `}</style>
    </div>
  );
};
