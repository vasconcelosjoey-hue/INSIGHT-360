
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
import { extractScoresFromText } from './services/geminiService';
import { Brain, ArrowRight, Layers, Save, FileText, ClipboardList, Loader2, AlertCircle } from 'lucide-react';

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
  const [importText, setImportText] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractError, setExtractError] = useState('');

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

  const handleImportRequest = () => {
    setQuizState('import-text');
  };

  const handleImportSubmit = async () => {
    if (!importText.trim()) return;
    setIsExtracting(true);
    setExtractError('');
    try {
      const extractedResults = await extractScoresFromText(importText);
      const newId = generateTestId();
      setTestId(newId);
      setResults(extractedResults);
      setQuizState('results');
    } catch (err) {
      setExtractError('Não conseguimos identificar os scores no texto. Tente colar o diagnóstico completo ou use a entrada manual.');
    } finally {
      setIsExtracting(false);
    }
  };

  const handleDirectManualEntry = () => {
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
    return (
      <div className="flex flex-col min-h-screen">
        <LeadCapture onComplete={handleLeadSubmit} />
        <footer className="w-full py-6 bg-[#0f172a] text-center border-t border-white/5 relative z-10">
          <p className="text-[10px] font-bold text-slate-500 tracking-[0.3em] uppercase">
            powered By <span className="text-indigo-400">JOI.A.</span>
          </p>
        </footer>
      </div>
    );
  }

  const currentQuestion = QUESTIONS[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900 flex flex-col">
      
      <main className="flex flex-col items-center justify-start flex-grow w-full relative">
        {quizState === 'disclaimer' && <Disclaimer onAccept={handleDisclaimerAccept} />}
        {quizState === 'welcome' && <WelcomeWizard onComplete={handleWelcomeComplete} />}
        
        {quizState === 'intro' && (
          <div className="min-h-screen w-full flex items-center justify-center bg-[#0f172a] p-4 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />
             <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="max-w-3xl w-full px-6 py-12 md:py-16 text-center animate-fade-in-up bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] md:rounded-[2.5rem] shadow-2xl relative z-10">
              <div className="inline-flex items-center justify-center p-4 bg-gradient-to-br from-indigo-500/20 to-violet-500/20 rounded-2xl mb-6 md:mb-8 border border-white/5 shadow-inner">
                <Layers className="w-10 h-10 md:w-12 md:h-12 text-indigo-300 drop-shadow-lg" />
              </div>
              <h1 className="text-3xl md:text-6xl font-extrabold text-white mb-4 md:mb-6 tracking-tight leading-tight">
                Mapeie seu <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">Perfil Insight360</span>
              </h1>
              <p className="text-base md:text-xl text-slate-300 mb-8 md:mb-12 leading-relaxed max-w-2xl mx-auto font-light px-2">
                Olá, <span className="text-indigo-300 font-medium">{userInfo?.name.split(' ')[0]}</span>. 
                Escolha como deseja prosseguir com seu diagnóstico.
              </p>
              <div className="flex flex-col items-center gap-4 w-full">
                <button 
                  onClick={handleStart}
                  className="group relative inline-flex items-center justify-center px-8 md:px-12 py-4 md:py-5 text-lg font-semibold text-white transition-all duration-300 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl shadow-xl shadow-indigo-500/40 hover:shadow-indigo-500/60 hover:-translate-y-1 hover:scale-105 w-full md:w-auto"
                >
                  Fazer Novo Teste (42 Questões)
                  <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                
                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                  <button 
                    onClick={handleImportRequest}
                    className="flex items-center justify-center gap-2 px-6 py-3 text-slate-300 hover:text-white border border-white/10 hover:bg-white/5 rounded-xl transition-all font-medium text-sm"
                  >
                    <FileText className="w-4 h-4" /> Importar Documento Existente
                  </button>
                  <button 
                    onClick={handleDirectManualEntry}
                    className="flex items-center justify-center gap-2 px-6 py-3 text-slate-300 hover:text-white border border-white/10 hover:bg-white/5 rounded-xl transition-all font-medium text-sm"
                  >
                    <ClipboardList className="w-4 h-4" /> Entrada Manual de Scores
                  </button>
                </div>
              </div>
              <p className="mt-8 text-[10px] md:text-xs text-slate-500 uppercase tracking-widest font-medium italic">Powered by Gemini 3 Pro Elite Analysis</p>
            </div>
          </div>
        )}

        {quizState === 'import-text' && (
          <div className="min-h-screen w-full flex items-center justify-center bg-[#0f172a] p-4">
            <div className="max-w-2xl w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-10 shadow-2xl animate-fade-in-up">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Importar Diagnóstico</h2>
              <p className="text-slate-400 text-sm mb-6">Cole o texto do seu diagnóstico anterior. Nossa IA (Gemini 3 Pro) extrairá automaticamente as dimensões para você.</p>
              
              <div className="relative mb-6">
                <textarea 
                  className="w-full h-64 bg-slate-900/50 border border-slate-700 text-white rounded-2xl p-4 focus:ring-2 focus:ring-indigo-500/50 outline-none text-sm placeholder:text-slate-600 transition-all resize-none font-mono"
                  placeholder="Cole aqui o texto do seu relatório ou as respostas..."
                  value={importText}
                  onChange={(e) => setImportText(e.target.value)}
                />
                {isExtracting && (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center gap-4 text-white">
                    <Loader2 className="w-10 h-10 animate-spin text-indigo-400" />
                    <span className="font-bold tracking-widest uppercase text-xs">Mapeando Dimensões...</span>
                  </div>
                )}
              </div>

              {extractError && (
                <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-xl flex items-start gap-3 mb-6">
                  <AlertCircle className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
                  <p className="text-rose-200 text-xs leading-relaxed">{extractError}</p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => setQuizState('intro')}
                  className="px-8 py-4 text-slate-400 font-bold hover:text-white transition-all text-sm"
                >
                  Voltar
                </button>
                <button 
                  onClick={handleImportSubmit}
                  disabled={!importText.trim() || isExtracting}
                  className="flex-grow flex items-center justify-center gap-3 px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold shadow-xl shadow-indigo-500/20 hover:bg-indigo-700 disabled:opacity-50 transition-all active:scale-95"
                >
                  Extrair e Gerar Dashboard
                </button>
              </div>
            </div>
          </div>
        )}

        {quizState === 'manual_input' && (
          <div className="w-full max-w-5xl px-4 py-6 md:py-8 animate-fade-in">
            <div className="bg-white rounded-[1.5rem] md:rounded-[2rem] shadow-xl p-5 md:p-8">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-slate-900 leading-tight">Entrada Manual</h2>
                  <p className="text-sm text-slate-500">Transcreva os resultados do documento.</p>
                </div>
                <button onClick={() => setQuizState('intro')} className="text-xs text-slate-400 hover:text-rose-500 transition-colors">Cancelar</button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
                {DIMENSIONS.map((dim) => (
                  <div key={dim.id} className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <div className="flex justify-between mb-2 items-center">
                      <label className="text-xs font-bold text-slate-700 block truncate flex-1" title={dim.name}>{dim.name}</label>
                      <input 
                        type="number" min="0" max="100"
                        value={manualScores[dim.id] || 0}
                        onChange={(e) => {
                          const val = Math.min(100, Math.max(0, parseInt(e.target.value) || 0));
                          setManualScores({...manualScores, [dim.id]: val});
                        }}
                        className="w-14 text-right font-bold text-indigo-600 bg-white border border-slate-200 rounded px-1 py-0.5 text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                      <span className="text-[10px] text-slate-400 ml-1">%</span>
                    </div>
                    <input 
                      type="range" min="0" max="100" 
                      value={manualScores[dim.id] || 0}
                      onChange={(e) => setManualScores({...manualScores, [dim.id]: parseInt(e.target.value)})}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    />
                  </div>
                ))}
              </div>
              <div className="mt-8 pt-6 border-t border-slate-100 flex justify-center md:justify-end">
                 <button onClick={handleManualSubmit} className="flex items-center justify-center gap-2 w-full md:w-auto px-8 py-4 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20 font-bold">
                   <Save className="w-5 h-5" /> Visualizar Dashboard
                 </button>
              </div>
            </div>
          </div>
        )}

        {quizState === 'test' && currentQuestion && (
          <div className="w-full max-w-5xl px-4 py-4 md:py-8">
            {shakeQuestion && (
              <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[60] bg-rose-600 text-white px-5 py-3 rounded-xl animate-bounce shadow-2xl flex items-center gap-3 border border-rose-400 w-[90%] md:w-auto">
                <Brain className="w-4 h-4 flex-shrink-0" />
                <span className="font-bold text-sm">Responda esta questão para prosseguir.</span>
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
          <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6">
             <div className="relative w-24 h-24 md:w-32 md:h-32 mb-6 md:mb-8">
               <div className="absolute inset-0 border-4 border-indigo-100 rounded-full"></div>
               <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
               <Brain className="absolute inset-0 m-auto w-10 h-10 md:w-12 md:h-12 text-indigo-600 animate-pulse" />
             </div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Processando Dados</h2>
            <p className="text-slate-500 text-base md:text-lg max-w-md mx-auto">
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

      <footer className="w-full py-8 mt-auto border-t border-slate-200/60 bg-white/50 backdrop-blur-sm text-center print:hidden">
        <p className="text-[10px] font-bold text-slate-400 tracking-[0.3em] uppercase">
          powered By <span className="text-indigo-600">JOI.A.</span>
        </p>
      </footer>

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
