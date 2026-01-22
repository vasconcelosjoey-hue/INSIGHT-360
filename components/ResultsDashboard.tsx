
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
    // Garantindo que nomes não sejam undefined no prompt
    const dataString = results.map(r => `- ${r.dimensionName || 'Dimensão'}: ${r.score}%`).join('\n');
    const fullPrompt = `Analise os dados Insight360 de ${userInfo?.name || 'Candidato'}:\n\n${dataString}\n\nPor favor, forneça um parecer técnico detalhado.`;
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
            <button onClick={copyToChatGPT} className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 shadow-lg transition-transform active:scale-95">
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Prompt Copiado' : 'ChatGPT Prompt'}
            </button>
            <button onClick={() => window.print()} className="bg-slate-900 text-white px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 shadow-lg transition-transform active:scale-95">
              <Printer className="w-4 h-4" /> Gerar PDF Final
            </button>
          </div>
        </div>
      </header>

      {/* ÁREA DE RENDERIZAÇÃO */}
      <div className="flex-grow overflow-y-auto print:overflow-visible print:block print:h-auto custom-scrollbar">
        <main className="max-w-6xl mx-auto p-6 md:p-10 print:p-0">
          
          {/* PÁGINA 1: GRÁFICO E DADOS */}
          <div id="print-page-1" className="bg-white rounded-[3rem] p-10 shadow-2xl mb-10 print:shadow-none print:m-0 print:p-0 print:rounded-none print:w-full print:min-h-[29.7cm] border border-slate-100 print:border-none flex flex-col">
            
            <div className="text-center mb-8 print:pt-6">
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 ${themeBg} text-white print:bg-black print:text-white print:border-2 print:border-black`}>
                <BadgeCheck className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">{isCorporate ? 'Saúde Organizacional VitalPulse' : 'Laudo Psicométrico Insight360'}</span>
              </div>
              <h1 className="text-5xl font-black text-slate-900 mb-1 tracking-tighter print:text-black print:text-5xl">Relatório de Diagnóstico</h1>
              <p className={`text-2xl font-black uppercase tracking-widest ${themeText} print:text-black`}>{userInfo?.name}</p>
              <div className="w-16 h-1 bg-slate-200 mx-auto mt-4 mb-2 print:bg-black"></div>
              <p className="text-[9px] font-mono text-slate-400 print:text-black font-bold uppercase tracking-widest">Protocolo: {testId} | Emissão: {new Date().toLocaleDateString('pt-BR')}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start flex-grow">
              {/* RADAR CHART - FORÇADO PARA IMPRESSÃO */}
              <div className="lg:col-span-7 bg-slate-50 rounded-[2.5rem] p-8 border border-slate-100 print:bg-white print:border-2 print:border-black/20 print:shadow-none">
                <h3 className="text-[10px] font-black text-slate-400 mb-6 uppercase tracking-widest flex items-center gap-2 print:text-black">
                  <Brain className="w-4 h-4" /> Perfil Comportamental Geométrico
                </h3>
                <div className="h-[450px] w-full print:h-[500px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={results}>
                      <PolarGrid stroke="#000000" strokeOpacity={0.15} />
                      <PolarAngleAxis 
                        dataKey="dimensionName" 
                        tick={{ fill: '#000000', fontSize: 10, fontWeight: 900, textAnchor: 'middle' }} 
                      />
                      <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                      <Radar
                        isAnimationActive={false}
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

              {/* LISTA DE SCORES - COLUNAS NO PDF */}
              <div className="lg:col-span-5 print:col-span-12">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 print:text-black">Pontuações Analíticas</h3>
                <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-1 print:grid-cols-3 print:gap-1.5">
                  {results.map(r => (
                    <div key={r.dimensionId} className="flex justify-between items-center p-3.5 bg-slate-50 rounded-2xl border border-slate-100 print:bg-white print:border-black print:border-[1px] print:rounded-lg">
                      <span className="font-bold text-slate-700 text-[9px] uppercase tracking-tight print:text-black">{r.dimensionName}</span>
                      <span className={`font-black text-sm ${themeText} print:text-black`}>{r.score}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* PÁGINA 2: SINTETIZAÇÃO IA */}
          <div id="print-page-2" className="print:break-before-page print:pt-10 mb-20">
            <div className="bg-white rounded-[3rem] shadow-2xl border-4 border-slate-50 print:border-2 print:border-black print:shadow-none overflow-hidden flex flex-col">
              <div className={`${themeBg} p-8 text-white print:bg-black print:text-white`}>
                <div className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-yellow-300 print:text-white" />
                  <h3 className="text-xl font-black uppercase tracking-widest">Sintetização Estratégica IA</h3>
                </div>
                <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest mt-1 print:text-white/80">Parecer Técnico Processado por Redes Neurais</p>
              </div>

              <div className="p-12 min-h-[600px] print:p-10 flex flex-col">
                {loadingAi ? (
                  <div className="flex-grow flex flex-col items-center justify-center gap-4">
                    <Loader2 className={`w-12 h-12 animate-spin ${themeText}`} />
                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em]">Gerando Análise Personalizada...</p>
                  </div>
                ) : aiAnalysis ? (
                  <div className="text-slate-900 text-base leading-relaxed whitespace-pre-line font-medium text-justify print:text-black print:text-[12pt] print:leading-normal animate-fade-in">
                    {aiAnalysis}
                  </div>
                ) : errorAi ? (
                  <div className="flex flex-col items-center justify-center flex-grow gap-4 text-rose-600 bg-rose-50 p-10 rounded-[2rem] border border-rose-100">
                    <AlertCircle className="w-12 h-12" />
                    <p className="font-black uppercase tracking-widest text-xs text-center">Falha na conexão com o cérebro artificial.<br/>Tente enviar sua pergunta novamente abaixo.</p>
                  </div>
                ) : (
                  <div className="flex-grow flex flex-col items-center justify-center opacity-30 print:hidden text-center">
                    <MessageSquareText className="w-16 h-16 mb-6 text-slate-300" />
                    <p className="text-xs font-black uppercase tracking-widest leading-loose text-slate-400">Utilize a Smartbox abaixo para <br/> gerar este diagnóstico textual.</p>
                  </div>
                )}
              </div>

              {/* SMARTBOX (SÓ APARECE NA WEB) */}
              <div className="p-10 bg-slate-50 border-t border-slate-100 print:hidden">
                <form onSubmit={handleSmartAiCall} className="relative group">
                  <textarea 
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    placeholder="Faça uma pergunta específica para a IA... Ex: Quais os 3 pontos de maior atenção neste perfil?"
                    className="w-full bg-white border-2 border-slate-200 rounded-[2.5rem] py-8 pl-8 pr-24 text-slate-800 outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 transition-all text-sm min-h-[160px] shadow-inner resize-none"
                  />
                  <button 
                    type="submit" 
                    disabled={loadingAi} 
                    className={`absolute right-4 bottom-4 p-6 ${themeBg} text-white rounded-[1.8rem] shadow-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50`}
                  >
                    {loadingAi ? <Loader2 className="w-6 h-6 animate-spin" /> : <Send className="w-6 h-6" />}
                  </button>
                </form>
              </div>
            </div>
            
            {/* RODAPÉ DO PDF */}
            <div className="hidden print:flex mt-16 pt-8 border-t-2 border-black justify-between items-end">
              <div className="text-[9px] font-black uppercase text-slate-400 space-y-1 print:text-black">
                <p>Plataforma Insight360 • Intelligence Unit</p>
                <p>Hash de Verificação: {testId}-{Date.now().toString().slice(-4)}</p>
              </div>
              <div className="text-right">
                <div className="w-64 h-[2px] bg-black mb-2 ml-auto" />
                <p className="text-[10px] font-black uppercase text-black tracking-widest">Assinatura Digital Autorizada</p>
              </div>
            </div>
          </div>
        </main>
      </div>

      <style>{`
        @media print {
          @page { size: A4 portrait; margin: 0.5cm 1cm; }
          body { 
            background: #ffffff !important; 
            color: #000000 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          * { 
            color: #000000 !important;
            background-color: transparent !important;
            box-shadow: none !important;
            text-shadow: none !important;
            border-color: rgba(0,0,0,0.1) !important;
          }
          
          .bg-white, .bg-slate-50, .bg-slate-100 { background-color: #ffffff !important; }
          .print-hidden, header, form, button, .recharts-legend-wrapper { display: none !important; }
          .print-block { display: block !important; }
          .h-screen { height: auto !important; overflow: visible !important; }
          
          /* FORÇAR VISIBILIDADE DO RADAR */
          svg { overflow: visible !important; }
          .recharts-polar-grid-concentric-path { stroke: #000000 !important; stroke-opacity: 0.2 !important; fill: none !important; }
          .recharts-radar-polygon { 
            fill: ${themeColor} !important; 
            fill-opacity: 0.4 !important; 
            stroke: ${themeColor} !important; 
            stroke-width: 5px !important; 
          }
          .recharts-polar-angle-axis-tick text { 
            fill: #000000 !important; 
            font-weight: 900 !important;
            font-size: 11px !important;
            opacity: 1 !important;
            visibility: visible !important;
          }
          
          /* CORES DOS CABEÇALHOS NO PDF */
          .print\\:bg-black { background-color: #000000 !important; color: #ffffff !important; }
          .print\\:text-white { color: #ffffff !important; }
        }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
      `}</style>
    </div>
  );
};
