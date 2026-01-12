
import React from 'react';
import { Question } from '../types';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';

interface QuizStepProps {
  question: Question;
  currentNumber: number;
  totalQuestions: number;
  selectedAnswer?: number;
  onAnswer: (value: number) => void;
  onPrevious: () => void;
  onNext: () => void;
}

export const QuizStep: React.FC<QuizStepProps> = ({ 
  question, 
  currentNumber, 
  totalQuestions, 
  selectedAnswer,
  onAnswer,
  onPrevious,
  onNext
}) => {
  
  // Guard clause
  if (!question) return null;

  const options = [
    { value: 5, label: "Concordo totalmente", color: "bg-indigo-600" },
    { value: 4, label: "Concordo parcialmente", color: "bg-indigo-400" },
    { value: 3, label: "Neutro / Não sei", color: "bg-slate-400" },
    { value: 2, label: "Discordo parcialmente", color: "bg-orange-400" },
    { value: 1, label: "Discordo totalmente", color: "bg-red-500" },
  ];

  const isLastQuestion = currentNumber === totalQuestions;
  const progress = (currentNumber / totalQuestions) * 100;

  return (
    <div className="w-full animate-fade-in pb-12">
      
      {/* Premium Progress Header */}
      <div className="mb-8">
        <div className="flex justify-between items-end mb-2 px-1">
          <span className="text-sm font-semibold text-indigo-900 tracking-wider uppercase">Progresso</span>
          <span className="text-2xl font-bold text-slate-900 font-serif italic">
            {currentNumber}<span className="text-sm text-slate-400 font-sans not-italic font-normal">/{totalQuestions}</span>
          </span>
        </div>
        <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden shadow-inner">
          <div 
            className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 transition-all duration-500 ease-out relative"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute inset-0 bg-white/30 animate-pulse-slow"></div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-white overflow-hidden relative flex flex-col transition-all">
        
        {/* Content */}
        <div className="p-6 md:p-12 pb-32 md:pb-32">
          
          {/* Question Card */}
          <div className="mb-10">
            <h3 className="text-2xl md:text-3xl font-bold text-slate-800 leading-tight">
              {question.text}
            </h3>
            <div className="w-16 h-1 bg-indigo-500 mt-6 rounded-full"></div>
          </div>

          {/* Options Grid */}
          <div className="flex flex-col gap-3">
            {options.map((opt) => {
              const isSelected = selectedAnswer === opt.value;
              return (
                <label 
                  key={opt.value} 
                  className={`
                    group relative flex items-center p-4 rounded-xl cursor-pointer transition-all duration-300 border
                    ${isSelected 
                      ? 'bg-indigo-50 border-indigo-200 shadow-md translate-x-2' 
                      : 'bg-white border-slate-100 hover:border-indigo-100 hover:shadow-md hover:translate-x-1'}
                  `}
                  onClick={() => onAnswer(opt.value)}
                >
                  {/* Custom Radio Visual */}
                  <div className={`
                    w-6 h-6 rounded-full border-2 flex items-center justify-center mr-4 transition-all
                    ${isSelected ? 'border-indigo-600' : 'border-slate-300 group-hover:border-indigo-300'}
                  `}>
                    <div className={`
                      w-3 h-3 rounded-full bg-indigo-600 transition-all duration-300
                      ${isSelected ? 'scale-100' : 'scale-0'}
                    `} />
                  </div>

                  <span className={`
                    text-base md:text-lg font-medium transition-colors
                    ${isSelected ? 'text-indigo-900' : 'text-slate-600 group-hover:text-slate-900'}
                  `}>
                    {opt.label}
                  </span>
                  
                  {isSelected && (
                    <Check className="absolute right-4 w-5 h-5 text-indigo-600 animate-fade-in" />
                  )}
                </label>
              );
            })}
          </div>
        </div>

        {/* Floating Action Bar */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-white/90 backdrop-blur-md border-t border-slate-100 flex justify-between items-center z-10">
          <button 
            onClick={onPrevious}
            disabled={currentNumber === 1}
            className={`
              flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all
              ${currentNumber === 1 
                ? 'text-slate-300 cursor-not-allowed' 
                : 'text-slate-500 hover:text-indigo-600 hover:bg-indigo-50'}
            `}
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="hidden md:inline">Anterior</span>
          </button>

          <button 
            onClick={onNext}
            className={`
              flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-white shadow-lg transition-all duration-300 hover:-translate-y-1
              ${isLastQuestion
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 shadow-emerald-500/30 hover:shadow-emerald-500/40' 
                : 'bg-gradient-to-r from-slate-800 to-slate-700 shadow-slate-900/20 hover:shadow-slate-900/30'}
            `}
          >
            {isLastQuestion ? 'Concluir Análise' : 'Próximo'}
            <ChevronRight className={`w-5 h-5 ${!isLastQuestion ? 'ml-0' : ''}`} />
          </button>
        </div>

      </div>
    </div>
  );
};
