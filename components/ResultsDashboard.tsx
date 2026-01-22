
import React, { useState, useMemo, useRef } from 'react';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer
} from 'recharts';
import { ProcessedResult, UserInfo } from '../types';
import { generatePsychologicalAnalysis } from '../services/geminiService';
import { Brain, RefreshCcw, Sparkles, Printer, BadgeCheck, ArrowLeft, Send, Loader2, Layers, MessageSquareText, Copy, Check, AlertCircle } from 'lucide-react';

interface ResultsDashboardProps {
  results: ProcessedResult[];
  userInfo: UserInfo | null;
  testId: string;
  onRestart: () => void;
  isAdmin?: boolean;
}

export const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ results, userInfo, testId, onRestart, isAdmin = false }) => {
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [loadingAi, setLoadingAi] = useState<boolean>(false);
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [errorAi, setErrorAi] = useState(false);
  
  const analysisAreaRef = useRef<HTMLDivElement>(null);

  const normalizedResults = useMemo(() => {
    if (!results || !Array.isArray(results)) return [];
    return results.map(r => {
      const data = r as any;
      return {
        dimensionId: data.dimensionId || data.id || "dim",
        dimensionName: data.dimensionName || data.name || "Dimensão",
        score: typeof data.score === 'number' ? data.score : 0,
        description: data.description || ""
      };
    });
  }, [results]);

  const isCorporate = userInfo?.testType === 'corporate';
  const themeColor = isCorporate ? '#ea580c' : '#4f46e5';
  const themeBg = isCorporate ? 'bg-orange-600' : 'bg-indigo-600';
  const themeText = isCorporate ? 'text-orange-600' : 'text-indigo-600';

  const handleSmartAiCall = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (loadingAi || (!customPrompt.trim() && !aiAnalysis)) {
        if (!customPrompt.trim() && !aiAnalysis) {
            // Se for a primeira chamada e não tiver prompt, gera o diagnóstico padrão
        } else if (!customPrompt.trim()) {
            return;
        }
    }
    
    analysisAreaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    setLoadingAi(true);
    setErrorAi(false);
    
    try {
      const result = await generatePsychologicalAnalysis(normalizedResults, isCorporate, customPrompt);
      setAiAnalysis(result);
      setCustomPrompt(''); 
    } catch (error) {
      console.error("Erro na Smartbox:", error);
      setErrorAi(true);
    } finally {
      setLoadingAi(false);
    }
  };

  const copyToChatGPT = () => {
    const dataString = normalizedResults.map(r => `- ${r.dimensionName}: ${r.score}%`).join('\n');
    const fullPrompt = `Analise os dados Insight360 de ${userInfo?.name || 'Candidato'}:\n\n${dataString}\n\nPor favor, forneça um parecer técnico detalhado.`;
    navigator.clipboard.writeText(fullPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="w-full h-screen bg-slate-100 flex flex-col overflow-hidden print:bg-white print:overflow-visible print:h-auto print:block">
      
      <header className="flex-shrink-0 bg-white border-b border-slate-200 px-6 py-4 z-50 print:hidden shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <button onClick={onRestart} className="flex items-center gap-2 text-slate-500 font-bold text-xs hover:text-indigo-600 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Voltar
          </button>
          <div className="flex items-center gap-3">
            <button onClick={copyToChatGPT} className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 shadow-lg transition-all hover:bg-emerald-700">
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copiado' : 'ChatGPT Prompt'}
            </button>
            <button onClick={() => window.print()} className="bg-slate-900 text-white px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 shadow-lg hover:bg-black transition-all">
              <Printer className="w-4 h-4" /> Gerar PDF Final
            </button>
          </div>
        </div>
      </header>

      <div className="flex-grow overflow-y-auto print:overflow-visible print:block print:h-auto custom-scrollbar">
        <main className="max-w-6xl mx-auto p-6 md:p-10 print:p-0">
          
          <div className="bg-white rounded-[3rem] p-10 shadow-2xl mb-10 print:shadow-none print:m-0 print:p-0 print:rounded-none print:w-full print:min-h-[29.7cm] border border-slate-100 print:border-none">
            
            <div className="text-center mb-12 print:pt-6">
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 ${themeBg} text-white print:bg-white print:text-black print:border-2 print:border-black`}>
                <BadgeCheck className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">{isCorporate ? 'Saúde Organizacional VitalPulse' : 'Laudo Psicométrico Insight360'}</span>
              </div>
              <h1 className="text-5xl font-black text-slate-900 mb-1 tracking-tighter print:text-black">Relatório de Diagnóstico</h1>
              <p className={`text-2xl font-black uppercase tracking-widest ${themeText} print:text-black`}>{userInfo?.name}</p>
              <div className="w-16 h-1 bg-slate-200 mx-auto mt-4 mb-2 print:bg-black"></div>
              <p className="text-[9px] font-mono text-slate-400 print:text-black font-bold uppercase tracking-widest">Protocolo: {testId} | Emissão: {new Date().toLocaleDateString('pt-BR')}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              <div className="lg:col-span-7 bg-slate-50 rounded-[2.5rem] p-8 border border-slate-100 print:bg-white print:border-2 print:border-black/10">
                <h3 className="text-[10px] font-black text-slate-400 mb-8 uppercase tracking-widest flex items-center gap-2 print:text-black">
                  <Brain className="w-4 h-4" /> Perfil Comportamental Geométrico
                </h3>
                <div className="h-[450px] w-full print:h-[500px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={normalizedResults}>
                      <PolarGrid stroke="#000000" strokeOpacity={0.15} />
                      <PolarAngleAxis 
                        dataKey="dimensionName" 
                        tick={{ fill: '#000000', fontSize: 11, fontWeight: 900 }} 
                      />
                      <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                      <Radar
                        isAnimationActive={false}
                        name="Perfil"
                        dataKey="score"
                        stroke={themeColor}
                        strokeWidth={4}
                        fill={themeColor}
                        fillOpacity={0.5}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="lg:col-span-5 print:col-span-12">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 print:text-black">Pontuações Analíticas</h3>
                <div className="grid grid-cols-1 gap-2.5 print:grid-cols-3 print:gap-2">
                  {normalizedResults.map(r => (
                    <div key={r.dimensionId} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100 print:bg-white print:border-black print:border-[1px] print:rounded-lg">
                      <span className="font-bold text-slate-700 text-[10px] uppercase tracking-tight print:text-black">{r.dimensionName}</span>
                      <span className={`font-black text-sm ${themeText} print:text-black`}>{r.score}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div ref={analysisAreaRef} id="print-page-2" className="print:break-before-page print:pt-10 mb-20">
            <div className="bg-white rounded-[3rem] shadow-2xl border-4 border-slate-50 print:border-2 print:border-black print:shadow-none overflow-hidden flex flex-col">
              <div className={`${themeBg} p-8 text-white print:bg-black print:text-white`}>
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <Sparkles className="w-5 h-5 text-yellow-300" />
                        <h3 className="text-xl font-black uppercase tracking-widest">Sintetização Estratégica IA</h3>
                    </div>
                    {aiAnalysis && !loadingAi && (
                        <button onClick={handleSmartAiCall} className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-all" title="Regerar diagnóstico">
                            <RefreshCcw className="w-4 h-4" />
                        </button>
                    )}
                </div>
              </div>

              <div className="p-12 min-h-[400px] bg-white print:p-10">
                {loadingAi ? (
                  <div className="flex flex-col items-center justify-center py-20 gap-6">
                    <div className="relative">
                      <Loader2 className={`w-16 h-16 animate-spin ${themeText}`} />
                      <Brain className="absolute inset-0 m-auto w-6 h-6 text-slate-300" />
                    </div>
                    <div className="text-center">
                        <p className="text-[11px] font-black text-slate-900 uppercase tracking-[0.4em] mb-1">Raciocinando...</p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Processando 21 eixos neurais</p>
                    </div>
                  </div>
                ) : aiAnalysis ? (
                  <div className="text-slate-900 text-base leading-relaxed whitespace-pre-line font-medium text-justify print:text-black print:text-[12pt] animate-fade-in-up">
                    {aiAnalysis}
                  </div>
                ) : errorAi ? (
                  <div className="flex flex-col items-center justify-center py-20 gap-4 text-rose-500">
                    <AlertCircle className="w-12 h-12" />
                    <div className="text-center">
                        <p className="font-black uppercase tracking-widest text-xs">Falha na conexão com a IA</p>
                        <p className="text-[10px] font-bold opacity-70 mt-1">Verifique se o ambiente possui acesso à internet ou tente novamente.</p>
                    </div>
                    <button onClick={handleSmartAiCall} className={`mt-4 px-6 py-2 ${themeBg} text-white rounded-xl text-[10px] font-black uppercase tracking-widest`}>
                        Tentar reconectar
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 opacity-30 print:hidden">
                    <MessageSquareText className="w-16 h-16 mb-6 text-slate-300" />
                    <p className="text-xs font-black uppercase tracking-widest text-slate-400 text-center leading-loose">
                      Utilize a Smartbox abaixo para<br/>gerar o diagnóstico detalhado.
                    </p>
                  </div>
                )}
              </div>

              <div className="p-10 bg-slate-50 border-t border-slate-100 print:hidden">
                <form onSubmit={handleSmartAiCall} className="relative group">
                  <textarea 
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    placeholder="Faça uma pergunta específica... Ex: 'Quais os riscos de liderança?' ou 'Como motivar essa pessoa?'"
                    className="w-full bg-white border-2 border-slate-200 rounded-[2.5rem] py-8 pl-8 pr-24 text-slate-800 outline-none focus:border-indigo-400 min-h-[160px] shadow-inner transition-all resize-none text-sm font-medium"
                  />
                  <button 
                    type="submit" 
                    disabled={loadingAi || (!customPrompt.trim() && !!aiAnalysis)} 
                    className={`absolute right-4 bottom-4 p-6 ${themeBg} text-white rounded-[2rem] shadow-xl hover:scale-105 active:scale-95 disabled:opacity-30 disabled:hover:scale-100 transition-all`}
                    title="Enviar pergunta"
                  >
                    {loadingAi ? <Loader2 className="w-6 h-6 animate-spin" /> : <Send className="w-6 h-6" />}
                  </button>
                </form>
                <p className="mt-4 text-[9px] font-bold text-slate-400 text-center uppercase tracking-widest">
                  Tecnologia Gemini 3 Ultra-Flash • Diagnóstico Baseado em Evidências
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>

      <style>{`
        @media print {
          @page { size: A4 portrait; margin: 0.5cm 1cm; }
          body { background: white !important; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          * { color: black !important; background-color: transparent !important; box-shadow: none !important; }
          .bg-white { background: white !important; }
          .print-hidden, header, form, button { display: none !important; }
          .h-screen { height: auto !important; overflow: visible !important; }
          
          .recharts-polar-angle-axis-tick text { 
            fill: black !important; 
            font-weight: 900 !important;
            font-size: 11px !important;
            opacity: 1 !important;
            visibility: visible !important;
            display: block !important;
          }
          .recharts-polar-grid-concentric-path { stroke: black !important; stroke-opacity: 0.2 !important; }
          .recharts-radar-polygon { 
            fill: ${themeColor} !important; 
            fill-opacity: 0.4 !important; 
            stroke: ${themeColor} !important; 
            stroke-width: 5px !important; 
          }
        }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in-up { animation: fadeInUp 0.5s ease-out forwards; }
      `}</style>
    </div>
  );
};
