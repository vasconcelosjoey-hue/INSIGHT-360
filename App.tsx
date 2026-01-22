
import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { QUESTIONS, DIMENSIONS, TOTAL_QUESTIONS } from './constants';
import { ProcessedResult, QuizState, UserInfo } from './types';
import { QuizStep } from './components/QuizStep';
import { ResultsDashboard } from './components/ResultsDashboard';
import { Disclaimer } from './components/Disclaimer';
import { WelcomeWizard } from './components/WelcomeWizard';
import { LeadCapture } from './components/LeadCapture';
import { ThankYou } from './components/ThankYou';
import { AdminDashboard } from './components/AdminDashboard';
import { saveTestResult } from './services/firebase';
import { extractScoresFromText } from './services/geminiService';
import { Brain, ArrowRight, Layers, FileText, ClipboardList, Settings } from 'lucide-react';

const App: React.FC = () => {
  const [quizState, setQuizState] = useState<QuizState>('lead-capture');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [results, setResults] = useState<ProcessedResult[]>([]);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [testId, setTestId] = useState<string>('');
  const [shakeQuestion, setShakeQuestion] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  
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

  const handleAdminTrigger = () => {
    const secret = prompt("Configurações do Sistema - Digite a frase secreta:");
    if (secret === "dimensao360") {
      setIsAdmin(true);
      setQuizState('admin');
    } else if (secret !== null) {
      alert("Acesso negado. Frase incorreta.");
    }
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
      setExtractError('Falha ao processar texto. Verifique se o documento contém pontuações válidas.');
    } finally {
      setIsExtracting(false);
    }
  };

  const handleAnswer = (value: number) => {
    const currentQuestion = QUESTIONS[currentQuestionIndex];
    if (!currentQuestion) return;

    const newAnswers = { ...answers, [currentQuestion.id]: value };
    setAnswers(newAnswers);

    if (currentQuestionIndex < TOTAL_QUESTIONS - 1) {
      setTimeout(() => {
        setCurrentQuestionIndex(prev => prev + 1);
      }, 300);
    } else {
      setTimeout(() => {
        validateAndFinish(newAnswers);
      }, 300);
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
      setCurrentQuestionIndex(firstUnansweredIndex);
      setShakeQuestion(true);
      setTimeout(() => setShakeQuestion(false), 800);
    } else {
      setQuizState('thank-you');
    }
  };

  const handleThankYouComplete = () => {
    calculateResults(answers);
  };

  const calculateResults = async (finalAnswers: Record<number, number>) => {
    setQuizState('calculating');
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
      if (count === 0) return { dimensionId: dim.id, dimensionName: dim.name, score: 50, description: dim.description };
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

    if (userInfo) {
      saveTestResult(userInfo, processed, newId).catch(console.error);
    }

    setTimeout(() => {
      setResults(processed);
      setQuizState('results');
    }, 2500);
  };

  const handleViewLead = (info: UserInfo, res: ProcessedResult[], id: string) => {
    setUserInfo(info);
    setResults(res);
    setTestId(id);
    setQuizState('results');
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col relative overflow-x-hidden">
      
      {/* Botão Admin Secreto (Canto superior direito, quase invisível) */}
      {(quizState === 'lead-capture' || quizState === 'intro') && (
        <button 
          onClick={handleAdminTrigger}
          className="fixed top-2 right-2 z-[200] p-4 opacity-0 hover:opacity-10 transition-opacity"
          title="Acesso Admin"
        >
          <Settings className="w-5 h-5 text-slate-400" />
        </button>
      )}

      <main className="flex-grow w-full">
        {quizState === 'lead-capture' && <LeadCapture onComplete={handleLeadSubmit} />}
        {quizState === 'disclaimer' && <Disclaimer onAccept={handleDisclaimerAccept} />}
        {quizState === 'welcome' && <WelcomeWizard onComplete={handleWelcomeComplete} />}
        {quizState === 'thank-you' && <ThankYou onContinue={handleThankYouComplete} />}
        {quizState === 'admin' && <AdminDashboard onBack={() => { setIsAdmin(false); setQuizState('lead-capture'); }} onViewLead={handleViewLead} />}

        {quizState === 'intro' && (
          <div className="min-h-screen w-full flex items-center justify-center bg-[#0f172a] p-4 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />
             <div className="max-w-3xl w-full px-6 py-16 text-center animate-fade-in-up bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] shadow-2xl relative z-10">
              <div className="inline-flex items-center justify-center p-4 bg-gradient-to-br from-indigo-500/20 to-violet-500/20 rounded-2xl mb-8 border border-white/5">
                <Layers className="w-12 h-12 text-indigo-300 drop-shadow-lg" />
              </div>
              <h1 className="text-3xl md:text-6xl font-extrabold text-white mb-6 tracking-tight leading-tight">
                Perfil <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">Insight360</span>
              </h1>
              <p className="text-base md:text-xl text-slate-300 mb-12 max-w-2xl mx-auto font-light leading-relaxed">
                Bem-vindo(a), <span className="text-indigo-300 font-medium">{userInfo?.name.split(' ')[0]}</span>. Inicie seu mapeamento comportamental agora.
              </p>
              <div className="flex flex-col items-center gap-4">
                <button 
                  onClick={handleStart}
                  className="group relative inline-flex items-center justify-center px-12 py-5 text-lg font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl shadow-xl shadow-indigo-500/40 hover:scale-105 transition-all w-full md:w-auto"
                >
                  Iniciar Novo Diagnóstico
                  <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button onClick={handleImportRequest} className="flex items-center justify-center gap-2 px-6 py-3 text-slate-400 hover:text-white border border-white/10 hover:bg-white/5 rounded-xl transition-all font-medium text-xs uppercase tracking-widest">
                    <FileText className="w-4 h-4" /> Importar Documento
                  </button>
                  <button onClick={() => { 
                    const initial: Record<string, number> = {}; 
                    DIMENSIONS.forEach(d => initial[d.id] = 50); 
                    setManualScores(initial); 
                    setQuizState('manual_input'); 
                  }} className="flex items-center justify-center gap-2 px-6 py-3 text-slate-400 hover:text-white border border-white/10 hover:bg-white/5 rounded-xl transition-all font-medium text-xs uppercase tracking-widest">
                    <ClipboardList className="w-4 h-4" /> Entrada Manual
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {quizState === 'test' && QUESTIONS[currentQuestionIndex] && (
           <div className="w-full max-w-5xl mx-auto px-4 py-8">
             <div className={shakeQuestion ? "animate-shake" : ""}>
               <QuizStep 
                  question={QUESTIONS[currentQuestionIndex]}
                  currentNumber={currentQuestionIndex + 1}
                  totalQuestions={TOTAL_QUESTIONS}
                  selectedAnswer={answers[QUESTIONS[currentQuestionIndex].id]}
                  onAnswer={handleAnswer}
                  onPrevious={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
                  onNext={() => {
                    if (answers[QUESTIONS[currentQuestionIndex].id]) {
                      if (currentQuestionIndex < TOTAL_QUESTIONS - 1) setCurrentQuestionIndex(currentQuestionIndex + 1);
                      else validateAndFinish(answers);
                    } else {
                      setShakeQuestion(true);
                      setTimeout(() => setShakeQuestion(false), 800);
                    }
                  }}
                />
             </div>
           </div>
        )}

        {quizState === 'results' && (
          <ResultsDashboard 
            results={results}
            userInfo={userInfo}
            testId={testId}
            onRestart={() => isAdmin ? setQuizState('admin') : setQuizState('lead-capture')}
            isAdmin={isAdmin}
          />
        )}

        {quizState === 'calculating' && (
          <div className="min-h-screen flex flex-col items-center justify-center text-center p-6 bg-slate-50">
             <div className="relative w-32 h-32 mb-8">
               <div className="absolute inset-0 border-4 border-indigo-100 rounded-full"></div>
               <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
               <Brain className="absolute inset-0 m-auto w-12 h-12 text-indigo-600 animate-pulse" />
             </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Construindo Gráfico 360°</h2>
            <p className="text-slate-500 text-lg">Nossa IA está correlacionando suas tendências comportamentais...</p>
          </div>
        )}

        {/* Import Text View */}
        {quizState === 'import-text' && (
          <div className="min-h-screen w-full flex items-center justify-center bg-[#0f172a] p-4">
            <div className="max-w-2xl w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-10 shadow-2xl animate-fade-in-up">
              <h2 className="text-3xl font-bold text-white mb-2">Importar Diagnóstico</h2>
              <p className="text-slate-400 text-sm mb-6">Cole o texto do seu relatório para que nossa IA extraia os dados e gere o dashboard.</p>
              <textarea 
                className="w-full h-64 bg-slate-900/50 border border-slate-700 text-white rounded-2xl p-4 focus:ring-2 focus:ring-indigo-500 outline-none mb-6 resize-none font-mono text-sm"
                placeholder="Cole o texto aqui..."
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
              />
              <div className="flex gap-4">
                <button onClick={() => setQuizState('intro')} className="px-6 py-4 text-slate-400 font-bold hover:text-white transition-colors">Voltar</button>
                <button 
                  onClick={handleImportSubmit}
                  disabled={isExtracting || !importText.trim()}
                  className="flex-grow py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                  {isExtracting ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : "Processar Documento"}
                </button>
              </div>
              {extractError && <p className="mt-4 text-red-400 text-xs font-bold text-center">{extractError}</p>}
            </div>
          </div>
        )}
      </main>

      {quizState !== 'admin' && (
        <footer className="w-full py-6 text-center border-t border-slate-200 bg-white/50 backdrop-blur-sm print:hidden">
          <p className="text-[10px] font-bold text-slate-400 tracking-[0.4em] uppercase">
            powered By <span className="text-indigo-600">JOI.A.</span>
          </p>
        </footer>
      )}

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        .animate-shake { animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both; }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #4f46e5; border-radius: 10px; }
      `}</style>
    </div>
  );
};

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
