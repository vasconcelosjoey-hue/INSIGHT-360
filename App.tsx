
import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { QUESTIONS, DIMENSIONS, TOTAL_QUESTIONS } from './constants';
import { ProcessedResult, QuizState, UserInfo } from './types';
import { QuizStep } from './components/QuizStep';
import { ResultsDashboard } from './components/ResultsDashboard';
import { Disclaimer } from './components/Disclaimer';
import { WelcomeWizard } from './components/WelcomeWizard';
import { LeadCapture } from './components/LeadCapture';
import { saveTestResult } from './services/firebase';
import { Brain, ArrowRight, Layers, Save } from 'lucide-react';

const App: React.FC = () => {
  const [quizState, setQuizState] = useState<QuizState>('lead-capture');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [results, setResults] = useState<ProcessedResult[]>([]);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [testId, setTestId] = useState<string>('');
  const [shakeQuestion, setShakeQuestion] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isValidatingCompleteness, setIsValidatingCompleteness] = useState(false);
  
  const [manualScores, setManualScores] = useState<Record<string, number>>({});

  const generateTestId = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = 'IS360-';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const handleLeadSubmit = (info: UserInfo) => {
    setUserInfo(info);
    setQuizState('disclaimer');
  };

  const handleDisclaimerAccept = () => {
    setQuizState('welcome');
  };

  const handleWelcomeComplete = () => {
    setQuizState('intro');
  };

  const handleStart = () => {
    setQuizState('test');
    setCurrentQuestionIndex(0);
    setAnswers({});
    setIsValidatingCompleteness(false);
  };

  const handleDirectManualEntry = () => {
    setUserInfo({
      name: 'Visitante (Manual)',
      email: '',
      whatsapp: ''
    });
    const initial: Record<string, number> = {};
    DIMENSIONS.forEach(d => initial[d.id] = 50);
    setManualScores(initial);
    setQuizState('manual_input');
  };

  const handleManualSubmit = () => {
    const newId = generateTestId();
    setTestId(newId);
    const processed: ProcessedResult[] = DIMENSIONS.map(dim => ({
      dimensionId: dim.id,
      dimensionName: dim.name,
      score: manualScores[dim.id] || 0,
      description: dim.description
    }));
    
    setResults(processed);
    setQuizState('results');
  };

  const handleAnswer = (value: number) => {
    const currentQuestion = QUESTIONS[currentQuestionIndex];
    if (!currentQuestion) return;

    const currentQId = currentQuestion.id;
    const newAnswers = { ...answers, [currentQId]: value };
    setAnswers(newAnswers);

    if (isValidatingCompleteness) {
      setTimeout(() => {
        validateAndFinish(newAnswers);
      }, 300);
      return;
    }

    if (currentQuestionIndex < TOTAL_QUESTIONS - 1) {
      setTimeout(() => {
        setCurrentQuestionIndex(prev => Math.min(prev + 1, TOTAL_QUESTIONS - 1));
      }, 300);
    } else {
      setTimeout(() => {
        validateAndFinish(newAnswers);
      }, 300);
    }
  };

  const handlePrevious = () => {
    setCurrentQuestionIndex(prev => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    if (currentQuestionIndex < TOTAL_QUESTIONS - 1) {
      setCurrentQuestionIndex(prev => Math.min(prev + 1, TOTAL_QUESTIONS - 1));
    } else {
      validateAndFinish(answers);
    }
  };

  const validateAndFinish = (currentAnswers: Record<number, number>) => {
    let firstUnansweredIndex = -1;
    for (let i = 0; i < TOTAL_QUESTIONS; i++) {
      const question = QUESTIONS[i];
      if (question && currentAnswers[question.id] === undefined) {
        firstUnansweredIndex = i;
        break;
      }
    }

    if (firstUnansweredIndex !== -1) {
      setIsValidatingCompleteness(true);
      setCurrentQuestionIndex(firstUnansweredIndex);
      setShakeQuestion(true);
      setTimeout(() => setShakeQuestion(false), 800);
    } else {
      calculateResults(currentAnswers);
    }
  };

  const calculateResults = async (finalAnswers: Record<number, number>) => {
    setQuizState('calculating');
    setIsSaving(true);
    
    const newId = generateTestId();
    setTestId(newId);
    
    const rawScores: Record<string, number[]> = {};
    DIMENSIONS.forEach(d => rawScores[d.id] = []);

    QUESTIONS.forEach(q => {
      const val = finalAnswers[q.id];
      if (val !== undefined && rawScores[q.dimensionId]) {
        rawScores[q.dimensionId].push(val);
      }
    });

    const processed: ProcessedResult[] = DIMENSIONS.map(dim => {
      const values = rawScores[dim.id];
      const count = values.length;
      if (count === 0) return { dimensionId: dim.id, dimensionName: dim.name, score: 0, description: dim.description };
      const sum = values.reduce((a, b) => a + b, 0);
      const minPossible = count * 1;
      const maxPossible = count * 5;
      const normalized = ((sum - minPossible) / (maxPossible - minPossible)) * 100;
      return {
        dimensionId: dim.id,
        dimensionName: dim.name,
        score: Math.round(normalized),
        description: dim.description
      };
    });

    if (userInfo && userInfo.email !== '') {
      saveTestResult(userInfo, processed, newId).catch(err => console.warn("Background save failed:", err));
    }

    setTimeout(() => {
      setIsSaving(false);
      setResults(processed);
      setQuizState('results');
    }, 2500);
  };

  if (quizState === 'lead-capture') {
    return <LeadCapture onComplete={handleLeadSubmit} onManualMode={handleDirectManualEntry} />;
  }

  const currentQuestion = QUESTIONS[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      
      {quizState !== 'intro' && quizState !== 'welcome' && quizState !== 'disclaimer' && (
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/60 sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-tr from-indigo-600 to-violet-600 p-2 rounded-lg shadow-lg shadow-indigo-500/20">
                <Layers className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight text-slate-900">Insight<span className="text-indigo-600">360</span></span>
            </div>
            {userInfo && (
              <div className="hidden md:flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs">
                  {userInfo.name.charAt(0)}
                </div>
                <span className="text-sm font-medium text-slate-600">{userInfo.name.split(' ')[0]}</span>
              </div>
            )}
          </div>
        </header>
      )}

      <main className="flex flex-col items-center justify-start min-h-[calc(100vh-80px)] w-full relative">
        {quizState === 'disclaimer' && <Disclaimer onAccept={handleDisclaimerAccept} />}
        {quizState === 'welcome' && <WelcomeWizard onComplete={handleWelcomeComplete} />}
        {quizState === 'intro' && (
          <div className="min-h-screen w-full flex items-center justify-center bg-[#0f172a] p-4 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />
             <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="max-w-3xl w-full px-8 py-16 text-center animate-fade-in-up bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] shadow-2xl relative z-10">
              <div className="inline-flex items-center justify-center p-4 bg-gradient-to-br from-indigo-500/20 to-violet-500/20 rounded-2xl mb-8 border border-white/5 shadow-inner">
                <Layers className="w-12 h-12 text-indigo-300 drop-shadow-lg" />
              </div>
              <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">
                Mapeie seu <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">Perfil Insight360</span>
              </h1>
              <p className="text-lg md:text-xl text-slate-300 mb-12 leading-relaxed max-w-2xl mx-auto font-light">
                Olá, <span className="text-indigo-300 font-medium">{userInfo?.name.split(' ')[0]}</span>. 
                Prepare-se para analisar suas 21 dimensões psicológicas e descobrir onde seus traços convergem.
              </p>
              <div className="flex flex-col items-center gap-4">
                <button 
                  onClick={handleStart}
                  className="group relative inline-flex items-center justify-center px-12 py-5 text-lg font-semibold text-white transition-all duration-300 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl shadow-xl shadow-indigo-500/40 hover:shadow-indigo-500/60 hover:-translate-y-1 hover:scale-105 w-full md:w-auto"
                >
                  Iniciar Análise (42 Questões)
                  <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
              <p className="mt-8 text-xs text-slate-500 uppercase tracking-widest font-medium italic">ANÁLISE PREMIUM ATIVADA</p>
            </div>
          </div>
        )}

        {quizState === 'manual_input' && (
          <div className="w-full max-w-5xl px-4 py-8 animate-fade-in">
            <div className="bg-white rounded-[2rem] shadow-xl p-6 md:p-8">
              <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-100">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Entrada Manual de Dados</h2>
                  <p className="text-slate-500">Transcreva os resultados (%) do seu documento.</p>
                </div>
                <button onClick={() => setQuizState('lead-capture')} className="text-sm text-slate-400 hover:text-rose-500 transition-colors">Cancelar</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
                {DIMENSIONS.map((dim) => (
                  <div key={dim.id} className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <div className="flex justify-between mb-2 items-center">
                      <label className="text-sm font-semibold text-slate-700 block truncate flex-1" title={dim.name}>{dim.name}</label>
                      <input 
                        type="number" min="0" max="100"
                        value={manualScores[dim.id] || 0}
                        onChange={(e) => {
                          const val = Math.min(100, Math.max(0, parseInt(e.target.value) || 0));
                          setManualScores({...manualScores, [dim.id]: val});
                        }}
                        className="w-16 text-right font-bold text-indigo-600 bg-white border border-slate-200 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                      <span className="text-xs text-slate-400 ml-1">%</span>
                    </div>
                    <input 
                      type="range" min="0" max="100" 
                      value={manualScores[dim.id] || 0}
                      onChange={(e) => setManualScores({...manualScores, [dim.id]: parseInt(e.target.value)})}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 hover:bg-slate-300 transition-colors"
                    />
                  </div>
                ))}
              </div>
              <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
                 <button onClick={handleManualSubmit} className="flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20 hover:-translate-y-1 font-bold">
                   <Save className="w-5 h-5" /> Gerar Relatório Premium
                 </button>
              </div>
            </div>
          </div>
        )}

        {quizState === 'test' && currentQuestion && (
          <div className="w-full max-w-5xl px-4 py-8">
            {shakeQuestion && (
              <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[60] bg-rose-600 text-white px-6 py-3 rounded-xl animate-bounce shadow-2xl flex items-center gap-3 border border-rose-400">
                <div className="bg-white/20 p-1 rounded-full"><Brain className="w-4 h-4" /></div>
                <span className="font-bold">Atenção: Por favor, responda esta questão para prosseguir.</span>
              </div>
            )}
            <div className={shakeQuestion ? "animate-shake" : ""}>
              <QuizStep 
                question={currentQuestion}
                currentNumber={currentQuestionIndex + 1}
                totalQuestions={TOTAL_QUESTIONS}
                selectedAnswer={answers[currentQuestion.id]}
                onAnswer={handleAnswer}
                onPrevious={handlePrevious}
                onNext={handleNext}
              />
            </div>
          </div>
        )}

        {quizState === 'calculating' && (
          <div className="min-h-[80vh] flex flex-col items-center justify-center text-center p-4">
             <div className="relative w-32 h-32 mb-8">
               <div className="absolute inset-0 border-4 border-indigo-100 rounded-full"></div>
               <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
               <Brain className="absolute inset-0 m-auto w-12 h-12 text-indigo-600 animate-pulse" />
             </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Gerando Relatório Premium</h2>
            <p className="text-slate-500 text-lg max-w-md mx-auto">
              Nossa IA está cruzando suas 42 respostas para mapear suas 21 dimensões psicológicas...
            </p>
          </div>
        )}

        {quizState === 'results' && (
          <ResultsDashboard 
            results={results}
            userInfo={userInfo}
            testId={testId}
            onRestart={() => setQuizState('lead-capture')}
          />
        )}
      </main>
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
        }
      `}</style>
    </div>
  );
};

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
