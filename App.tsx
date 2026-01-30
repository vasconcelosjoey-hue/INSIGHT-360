
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
import { Layers, ArrowRight, Building2, ChevronRight, Loader2, Search, ArrowLeft } from 'lucide-react';

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
  
  const resetToHome = () => {
    setQuizState('lead-capture');
    setUserInfo(null);
    setAnswers({});
    setCurrentQuestionIndex(0);
    setResults([]);
    setTestId('');
    setIsAdmin(false);
  };

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
    
    const processed: ProcessedResult[] = dims.map(dim => {
      const questionsOfDim = currentQuestions.filter(q => q.dimensionId === dim.id);
      const values = questionsOfDim.map(q => finalAnswers[q.id] || 3);
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
        {quizState === 'disclaimer' && <Disclaimer onAccept={handleDisclaimerAccept} onBack={() => setQuizState('lead-capture')} />}
        
        {quizState === 'company-selection' && (
          <div className="min-h-screen flex items-center justify-center bg-[#070b14] p-6 animate-fade-in relative">
            <button onClick={() => setQuizState('lead-capture')} className="absolute top-10 left-10 flex items-center gap-2 text-slate-500 font-bold text-xs hover:text-orange-500 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Voltar ao Início
            </button>
            <div className="w-full max-w-lg bg-[#0d121f] border border-white/10 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden">
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-orange-600/10 rounded-full blur-3xl"></div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-10 cursor-pointer" onClick={resetToHome}>
                  <div className="p-4 bg-orange-600/20 rounded-2xl border border-orange-500/30">
                    {/* Aqui mostramos a logo do Insight360 para resetar */}
                    <Layers className="w-8 h-8 text-orange-500" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-white uppercase tracking-tighter leading-tight">ESCOLHA SUA <br/><span className="text-orange-500">EMPRESA</span></h2>
                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1">Sincronizando com VitalPulse</p>
                  </div>
                </div>

                {loadingCompanies ? (
                  <div className="flex flex-col items-center py-20 gap-4">
                    <Loader2 className="w-10 h-10 animate-spin text-orange-500" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] animate-pulse">Buscando cadastros ativos...</span>
                  </div>
                ) : companies.length === 0 ? (
                  <div className="text-center py-16 bg-white/5 rounded-3xl border border-dashed border-white/10">
                    <p className="text-slate-400 text-sm font-medium">Nenhuma empresa encontrada com questionário ativo.</p>
                    <button onClick={() => setQuizState('lead-capture')} className="text-orange-500 font-black uppercase text-[10px] mt-6 hover:underline">Voltar ao Início</button>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-3 custom-scrollbar animate-fade-in-up">
                    <div className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-4 ml-1">Empresas Parceiras Disponíveis</div>
                    {companies.map((c, index) => (
                      <button 
                        key={c.id} 
                        onClick={() => selectCompany(c)} 
                        className="w-full bg-white/5 hover:bg-white/10 border border-white/10 p-6 rounded-2xl flex items-center justify-between group transition-all duration-300 hover:border-orange-500/30 hover:translate-x-1"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="flex items-center gap-4 text-left">
                          <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center overflow-hidden border border-white/5">
                            {c.logoUrl ? (
                              <img src={c.logoUrl} alt={c.name} className="w-full h-full object-contain" />
                            ) : (
                              <Building2 className="w-6 h-6 text-slate-600" />
                            )}
                          </div>
                          <div>
                            <p className="text-white font-black uppercase text-sm tracking-widest group-hover:text-orange-400 transition-colors">{c.name}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                              <p className="text-slate-500 text-[9px] font-bold uppercase">Acesso Liberado até {new Date(c.endDate).toLocaleDateString()}</p>
                            </div>
                          </div>
                        </div>
                        <div className="p-3 bg-white/5 rounded-xl group-hover:bg-orange-600 transition-all">
                          <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-white" />
                        </div>
                      </button>
                    ))}
                  </div>
                )}
                
                <div className="mt-10 pt-6 border-t border-white/5 flex justify-center">
                   <p className="text-[8px] font-bold text-slate-700 uppercase tracking-[0.4em]">JOI.A. Platform • VitalPulse Security</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {quizState === 'welcome' && <WelcomeWizard onComplete={() => setQuizState('intro')} onBack={() => setQuizState('lead-capture')} />}
        {quizState === 'thank-you' && <ThankYou onContinue={() => {}} isFinal={false} />}
        {quizState === 'final-screen' && <ThankYou onContinue={() => window.location.reload()} isFinal={true} />}
        
        {quizState === 'admin' && (
          <AdminDashboard 
            onBack={() => { setIsAdmin(false); setQuizState('lead-capture'); }} 
            onHome={resetToHome}
            onViewLead={(u, r, id) => { setUserInfo(u); setResults(r); setTestId(id); setQuizState('results'); }} 
          />
        )}

        {quizState === 'test' && (
          <QuizStep 
            question={currentQuestions[currentQuestionIndex]} 
            currentNumber={currentQuestionIndex + 1} 
            totalQuestions={currentQuestions.length} 
            selectedAnswer={answers[currentQuestions[currentQuestionIndex]?.id]} 
            onAnswer={(v) => setAnswers({...answers, [currentQuestions[currentQuestionIndex].id]: v})} 
            onPrevious={() => setCurrentQuestionIndex(p => Math.max(0, p - 1))} 
            onNext={() => currentQuestionIndex < currentQuestions.length - 1 ? setCurrentQuestionIndex(p => p + 1) : processResults(answers)} 
          />
        )}

        {quizState === 'results' && (
          <ResultsDashboard 
            results={results} 
            userInfo={userInfo} 
            testId={testId} 
            onRestart={() => setQuizState(isAdmin ? 'admin' : 'lead-capture')} 
            onHome={resetToHome}
            isAdmin={isAdmin} 
          />
        )}

        {quizState === 'intro' && (
          <div className={`h-full flex flex-col items-center justify-center p-4 ${isCorporate ? 'bg-orange-950' : 'bg-[#0f172a]'}`}>
            <div className="max-w-3xl w-full p-12 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[3rem] text-center relative">
              <button onClick={() => setQuizState('welcome')} className="absolute top-8 left-8 text-slate-500 font-bold text-[10px] uppercase tracking-widest hover:text-white flex items-center gap-1 transition-colors">
                <ArrowLeft className="w-3 h-3" /> Voltar
              </button>
              <div className="cursor-pointer mx-auto mb-6 w-fit" onClick={resetToHome}>
                <Layers className={`w-16 h-16 ${isCorporate ? 'text-orange-500' : 'text-indigo-500'}`} />
              </div>
              <h1 className="text-5xl font-black text-white mb-6 uppercase tracking-tighter">
                {isCorporate ? 'VitalPulse' : 'Individual'} <span className={isCorporate ? 'text-orange-500' : 'text-indigo-500'}>360</span>
              </h1>
              <p className="text-slate-300 text-lg mb-10">
                {isCorporate ? `Avaliação estratégica para a equipe da ${userInfo?.companyName}.` : 'Descubra seu perfil comportamental em 21 dimensões.'}
              </p>
              <button onClick={() => { setCurrentQuestionIndex(0); setAnswers({}); setQuizState('test'); }} className={`px-12 py-5 text-white font-black rounded-2xl shadow-2xl transition-all uppercase tracking-widest text-xs ${isCorporate ? 'bg-orange-600 hover:bg-orange-500' : 'bg-indigo-600 hover:bg-indigo-500'}`}>
                Iniciar Diagnóstico
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

const container = document.getElementById('root');
if (container) createRoot(container).render(<App />);
