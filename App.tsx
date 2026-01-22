
import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { getQuestions, DIMENSIONS, CORPORATE_DIMENSIONS } from './constants';
import { ProcessedResult, QuizState, UserInfo, Question, Company } from './types';
import { QuizStep } from './components/QuizStep';
import { ResultsDashboard } from './components/ResultsDashboard';
import { Disclaimer } from './components/Disclaimer';
import { WelcomeWizard } from './components/WelcomeWizard';
import { LeadCapture } from './components/LeadCapture';
import { ThankYou } from './components/ThankYou';
import { AdminDashboard } from './components/AdminDashboard';
import { saveTestResult, getActiveCompanies } from './services/firebase';
import { Layers, ArrowRight, Building2, ChevronRight, Loader2 } from 'lucide-react';

const App: React.FC = () => {
  const [quizState, setQuizState] = useState<QuizState>('lead-capture');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [results, setResults] = useState<ProcessedResult[]>([]);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [testId, setTestId] = useState<string>('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentQuestions, setCurrentQuestions] = useState<Question[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loadingCompanies, setLoadingCompanies] = useState(false);
  
  const generateTestId = (type: string) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let prefix = type === 'corporate' ? 'VP-' : 'IS360-';
    let result = prefix;
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
    if (userInfo?.testType === 'corporate') {
      setLoadingCompanies(true);
      setQuizState('company-selection');
      getActiveCompanies().then(list => {
        setCompanies(list);
        setLoadingCompanies(false);
      });
    } else {
      const questions = getQuestions('individual');
      setCurrentQuestions(questions);
      setQuizState('welcome');
    }
  };

  const selectCompany = (company: Company) => {
    setUserInfo(prev => prev ? ({ ...prev, companyId: company.id, companyName: company.name, cnpj: company.cnpj }) : null);
    setCurrentQuestions(getQuestions('corporate'));
    setQuizState('welcome');
  };

  const processResults = async (finalAnswers: Record<number, number>) => {
    setQuizState('thank-you');
    const type = userInfo?.testType || 'individual';
    const newId = generateTestId(type);
    setTestId(newId);
    
    const dims = type === 'corporate' ? CORPORATE_DIMENSIONS : DIMENSIONS;
    
    // Mapeamento forçado para garantir dimensionName
    const processed: ProcessedResult[] = dims.map(dim => {
      const questionsOfDim = currentQuestions.filter(q => q.dimensionId === dim.id);
      const values = questionsOfDim.map(q => finalAnswers[q.id] || 3); // Default neutro se faltar
      const avg = values.length ? values.reduce((a, b) => a + b, 0) / values.length : 3;
      
      return { 
        dimensionId: dim.id, 
        dimensionName: dim.name || "Dimensão", 
        score: Math.round(((avg - 1) / 4) * 100), 
        description: dim.description || "" 
      };
    });
    
    setResults(processed);
    if (userInfo) {
      await saveTestResult(userInfo, processed, newId);
    }
    
    setTimeout(() => setQuizState(isAdmin ? 'results' : 'final-screen'), 4000);
  };

  const isCorporate = userInfo?.testType === 'corporate';

  return (
    <div className={`min-h-screen h-screen bg-slate-50 font-sans text-slate-900 flex flex-col relative overflow-hidden ${isCorporate ? 'theme-corporate' : 'theme-individual'}`}>
      <main className="flex-grow w-full h-full overflow-hidden">
        {quizState === 'lead-capture' && <LeadCapture onComplete={handleLeadSubmit} onAdminLogin={() => { setIsAdmin(true); setQuizState('admin'); }} />}
        {quizState === 'disclaimer' && <Disclaimer onAccept={handleDisclaimerAccept} />}
        {quizState === 'company-selection' && (
          <div className="min-h-screen flex items-center justify-center bg-[#070b14] p-6 animate-fade-in">
            <div className="w-full max-w-md bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-10">
              <div className="flex items-center gap-3 mb-8">
                <Building2 className="w-10 h-10 text-orange-500" />
                <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Selecione sua <br/> Empresa</h2>
              </div>
              {loadingCompanies ? (
                <div className="flex flex-col items-center py-10 gap-3">
                  <Loader2 className="animate-spin text-orange-500" />
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Validando parcerias...</span>
                </div>
              ) : companies.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-slate-400 text-sm">Nenhuma empresa com questionário ativo.</p>
                  <button onClick={() => setQuizState('lead-capture')} className="text-orange-500 font-black uppercase text-[10px] mt-4">Voltar</button>
                </div>
              ) : (
                <div className="space-y-3 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                  {companies.map(c => (
                    <button key={c.id} onClick={() => selectCompany(c)} className="w-full bg-white/5 hover:bg-white/10 border border-white/10 p-5 rounded-2xl flex items-center justify-between group transition-all">
                      <div className="text-left">
                        <p className="text-white font-black uppercase text-xs tracking-widest">{c.name}</p>
                        <p className="text-slate-500 text-[8px] font-bold">DISPONÍVEL ATÉ {new Date(c.endDate).toLocaleDateString()}</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-orange-500 group-hover:translate-x-1 transition-transform" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
        {quizState === 'welcome' && <WelcomeWizard onComplete={() => setQuizState('intro')} />}
        {quizState === 'thank-you' && <ThankYou onContinue={() => {}} isFinal={false} />}
        {quizState === 'final-screen' && <ThankYou onContinue={() => window.location.reload()} isFinal={true} />}
        {quizState === 'admin' && <AdminDashboard onBack={() => { setIsAdmin(false); setQuizState('lead-capture'); }} onViewLead={(u, r, id) => { setUserInfo(u); setResults(r); setTestId(id); setQuizState('results'); }} />}
        {quizState === 'test' && <QuizStep question={currentQuestions[currentQuestionIndex]} currentNumber={currentQuestionIndex + 1} totalQuestions={currentQuestions.length} selectedAnswer={answers[currentQuestions[currentQuestionIndex]?.id]} onAnswer={(v) => setAnswers({...answers, [currentQuestions[currentQuestionIndex].id]: v})} onPrevious={() => setCurrentQuestionIndex(p => Math.max(0, p - 1))} onNext={() => currentQuestionIndex < currentQuestions.length - 1 ? setCurrentQuestionIndex(p => p + 1) : processResults(answers)} />}
        {quizState === 'results' && <ResultsDashboard results={results} userInfo={userInfo} testId={testId} onRestart={() => setQuizState(isAdmin ? 'admin' : 'lead-capture')} isAdmin={isAdmin} />}
        {quizState === 'intro' && (
          <div className={`h-full flex items-center justify-center p-4 ${isCorporate ? 'bg-orange-950' : 'bg-[#0f172a]'}`}>
            <div className="max-w-3xl w-full p-12 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[3rem] text-center">
              <h1 className="text-5xl font-black text-white mb-6 uppercase tracking-tighter">{isCorporate ? 'VitalPulse' : 'Individual'} <span className={isCorporate ? 'text-orange-500' : 'text-indigo-500'}>360</span></h1>
              <p className="text-slate-300 text-lg mb-10">{isCorporate ? `Avaliação estratégica para a equipe da ${userInfo?.companyName}.` : 'Descubra seu perfil comportamental em 21 dimensões.'}</p>
              <button onClick={() => { setCurrentQuestionIndex(0); setAnswers({}); setQuizState('test'); }} className={`px-12 py-5 text-white font-black rounded-2xl shadow-2xl transition-all uppercase tracking-widest text-xs ${isCorporate ? 'bg-orange-600 hover:bg-orange-500' : 'bg-indigo-600 hover:bg-indigo-500'}`}>Iniciar Diagnóstico</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

const container = document.getElementById('root');
if (container) createRoot(container).render(<App />);
