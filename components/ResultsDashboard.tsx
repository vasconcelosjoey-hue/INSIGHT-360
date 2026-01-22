
import React, { useState, useEffect } from 'react';
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

  const isCorporate = userInfo?.testType === 'corporate';
  const themeColor = isCorporate ? '#ea580c' : '#4f46e5';
  const themeBg = isCorporate ? 'bg-orange-600' : 'bg-indigo-600';
  const themeText = isCorporate ? 'text-orange-600' : 'text-indigo-600';

  const handleSmartAiCall = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (loadingAi) return;
    
    setLoadingAi(true);
    setErrorAi(false);
    
    try {
      const result = await generatePsychologicalAnalysis(results, isCorporate, customPrompt);
      setAiAnalysis(result);
    } catch (error) {
      console.error("Erro na Smartbox:", error);
      setErrorAi(true);
    } finally {
      setLoadingAi(false);
    }
  };

  const copyToChatGPT = () => {
    const dataString = results.map(r => `${r.dimensionName}: ${r.score}%`).join('\n');
    const fullPrompt = `Analise os dados Insight360 de ${userInfo?.name}:\n\n${dataString}`;
    navigator.clipboard.writeText(fullPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="w-full h-screen bg-slate-100 flex flex-col overflow-hidden print:bg-white print:overflow-visible print:h-auto print:block">
      
      {/* HEADER FIXO (SUMIR NO PDF) */}
      <header className="flex-shrink-0 bg-white border-b border-slate-200 px-6 py-4 z-50 print:hidden shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <button onClick={onRestart} className="flex items-center gap-2 text-slate-500 font-bold text-xs">
            <ArrowLeft className="w-4 h-4" /> Voltar
          </button>
          <div className="flex items-center gap-3">
            <button onClick={copyToChatGPT} className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2">
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copiado' : 'ChatGPT'}
            </button>
            <button onClick={() => window.print()} className="bg-slate-900 text-white px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2">
              <Printer className="w-4 h-4" /> Imprimir Relatório
            </button>
          </div>
        </div>
      </header>

      {/* ÁREA DE RENDERIZAÇÃO */}
      <div className="flex-grow overflow-y-auto print:overflow-visible print:block print:h-auto">
        <main className="max-w-6xl mx-auto p-6 md:p-10 print:p-0">
          
          {/* PÁGINA 1: GRÁFICO E DADOS */}
          <div id="print-page-1" className="bg-white rounded-[2rem] p-10 shadow-xl mb-10 print:shadow-none print:m-0 print:p-0 print:rounded-none print:w-full print:min-h-[29.7cm] border border-slate-100 print:border-none">
            
            <div className="text-center mb-8 print:pt-4">
              <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4 ${themeBg} text-white print:bg-black print:text-white`}>
                <BadgeCheck className="w-4 h-4" />
                <span className="text-[9px] font-black uppercase tracking-widest">{isCorporate ? 'Saúde Organizacional' : 'Laudo Psicométrico'}</span>
              </div>
              <h1 className="text-4xl font-black text-slate-900 mb-1 print:text-black">Relatório Insight360</h1>
              <p className={`text-xl font-black uppercase tracking-widest ${themeText} print:text-black`}>{userInfo?.name}</p>
              <p className="text-[8px] font-mono text-slate-400 mt-2 print:text-black uppercase">Protocolo: {testId} | Data: {new Date().toLocaleDateString()}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* RADAR CHART - FORÇADO PARA IMPRESSÃO */}
              <div className="lg:col-span-7 bg-slate-50 rounded-[2rem] p-6 border border-slate-100 print:bg-white print:border-2 print:border-black/10">
                <div className="h-[400px] w-full print:h-[450px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={results}>
                      <PolarGrid stroke="#000000" strokeOpacity={0.2} />
                      <PolarAngleAxis dataKey="dimensionName" tick={{ fill: '#000000', fontSize: 9, fontWeight: 900 }} />
                      <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                      <Radar
                        isAnimationActive={false}
                        dataKey="score"
                        stroke={themeColor}
                        strokeWidth={3}
                        fill={themeColor}
                        fillOpacity={0.4}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* LISTA DE SCORES - COLUNAS NO PDF */}
              <div className="lg:col-span-5 print:col-span-12">
                <div className="grid grid-cols-1 gap-2 print:grid-cols-3 print:gap-1">
                  {results.map(r => (
                    <div key={r.dimensionId} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100 print:bg-white print:border-black print:border-[0.5px]">
                      <span className="font-bold text-slate-700 text-[8px] uppercase print:text-black">{r.dimensionName}</span>
                      <span className={`font-black text-xs ${themeText} print:text-black`}>{r.score}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* PÁGINA 2: SINTETIZAÇÃO IA */}
          <div id="print-page-2" className="print:break-before-page print:pt-10 mb-20">
            <div className="bg-white rounded-[2rem] shadow-xl border-4 border-slate-100 print:border-2 print:border-black print:shadow-none overflow-hidden">
              <div className={`${themeBg} p-6 text-white print:bg-black print:text-white`}>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  <h3 className="text-lg font-black uppercase tracking-widest">Sintetização Estratégica IA</h3>
                </div>
              </div>

              <div className="p-10 min-h-[500px] print:p-8">
                {loadingAi ? (
                  <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <Loader2 className={`w-10 h-10 animate-spin ${themeText}`} />
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Analisando Dados...</p>
                  </div>
                ) : aiAnalysis ? (
                  <div className="text-slate-900 text-sm leading-relaxed whitespace-pre-line font-medium text-justify print:text-black print:text-[11pt] print:leading-normal">
                    {aiAnalysis}
                  </div>
                ) : errorAi ? (
                  <div className="text-rose-600 bg-rose-50 p-6 rounded-xl border border-rose-100 text-center font-bold">
                    Ocorreu um erro na IA. Por favor, tente enviar sua pergunta novamente na Smartbox abaixo.
                  </div>
                ) : (
                  <div className="text-center py-20 opacity-30 print:hidden">
                    <MessageSquareText className="w-12 h-12 mx-auto mb-4" />
                    <p className="text-xs font-black uppercase">Escreva na Smartbox abaixo para gerar a análise.</p>
                  </div>
                )}
              </div>

              {/* SMARTBOX (SÓ APARECE NA WEB) */}
              <div className="p-8 bg-slate-50 border-t border-slate-100 print:hidden">
                <form onSubmit={handleSmartAiCall} className="relative">
                  <textarea 
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    placeholder="Faça uma pergunta para a IA sobre estes resultados..."
                    className="w-full bg-white border-2 border-slate-200 rounded-2xl py-6 pl-6 pr-20 text-slate-800 outline-none focus:border-slate-400 min-h-[120px] shadow-inner transition-all resize-none"
                  />
                  <button type="submit" disabled={loadingAi} className={`absolute right-4 bottom-4 p-4 ${themeBg} text-white rounded-xl shadow-lg hover:scale-105 active:scale-95 disabled:opacity-50`}>
                    {loadingAi ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                  </button>
                </form>
              </div>
            </div>
            
            {/* RODAPÉ DO PDF */}
            <div className="hidden print:flex mt-10 pt-6 border-t border-black justify-between text-[8px] font-black uppercase">
              <p>Insight360 • Relatório Gerado via Inteligência Artificial</p>
              <p>Autenticidade: {testId}</p>
            </div>
          </div>
        </main>
      </div>

      <style>{`
        @media print {
          @page { size: A4 portrait; margin: 1.5cm; }
          body { 
            background: white !important; 
            color: black !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          * { 
            color: black !important;
            background: transparent !important;
            box-shadow: none !important;
            text-shadow: none !important;
          }
          .bg-white, .bg-slate-50, .bg-slate-100 { background: white !important; }
          .print-hidden, header, form, .recharts-legend-wrapper { display: none !important; }
          .print-block { display: block !important; }
          .h-screen { height: auto !important; overflow: visible !important; }
          
          /* FORÇAR VISIBILIDADE DOS ELEMENTOS DO RADAR */
          .recharts-polar-grid-concentric-path { stroke: black !important; stroke-opacity: 0.2 !important; }
          .recharts-radar-polygon { 
            fill: ${themeColor} !important; 
            fill-opacity: 0.3 !important; 
            stroke: ${themeColor} !important; 
            stroke-width: 4px !important; 
          }
          .recharts-polar-angle-axis-tick text { 
            fill: black !important; 
            font-weight: 900 !important;
            font-size: 10px !important;
          }
          .recharts-responsive-container { height: 450px !important; }
        }
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
      `}</style>
    </div>
  );
};
