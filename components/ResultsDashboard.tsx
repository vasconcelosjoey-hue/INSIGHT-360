
import React, { useState } from 'react';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer
} from 'recharts';
import { ProcessedResult, UserInfo } from '../types';
import { generatePsychologicalAnalysis } from '../services/geminiService';
import { Brain, RefreshCcw, Sparkles, Printer, BadgeCheck, ArrowLeft, Send, Loader2, Layers, MessageSquareText, FileText } from 'lucide-react';

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

  const isCorporate = userInfo?.testType === 'corporate';
  const themeColor = isCorporate ? '#ea580c' : '#4f46e5';
  const themeBg = isCorporate ? 'bg-orange-600' : 'bg-indigo-600';
  const themeText = isCorporate ? 'text-orange-600' : 'text-indigo-600';

  const handleSmartAiCall = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (loadingAi) return;
    setLoadingAi(true);
    const analysis = await generatePsychologicalAnalysis(results, isCorporate, customPrompt);
    setAiAnalysis(analysis);
    setLoadingAi(false);
  };

  return (
    <div className="w-full h-screen bg-slate-100 flex flex-col overflow-hidden print:bg-white print:overflow-visible print:h-auto">
      
      {/* HEADER WEB (OCULTO NA IMPRESSÃO) */}
      <header className="flex-shrink-0 bg-white border-b border-slate-200 px-6 py-4 z-50 print:hidden shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <button onClick={onRestart} className="flex items-center gap-2 text-slate-500 font-bold text-xs hover:text-slate-900 transition-all">
            <ArrowLeft className="w-4 h-4" /> Voltar
          </button>
          <div className="flex items-center gap-2">
            <Layers className={`w-5 h-5 ${themeText}`} />
            <h2 className="font-black uppercase tracking-tighter text-slate-900 text-sm">Insight360</h2>
          </div>
          <button onClick={() => window.print()} className="bg-slate-900 text-white px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:scale-105 transition-all">
            <Printer className="w-4 h-4 mr-2 inline" /> Exportar Relatório PDF
          </button>
        </div>
      </header>

      {/* ÁREA DE CONTEÚDO COM SCROLL (PARA TELA) E PAGINAÇÃO (PARA PDF) */}
      <div className="flex-grow overflow-y-auto custom-scrollbar print:overflow-visible print:h-auto">
        <main className="max-w-7xl mx-auto p-4 md:p-12 print:p-0 print:max-w-none">
          
          {/* ========================================================== */}
          {/* PÁGINA 1: DADOS E QUESTIONÁRIO                           */}
          {/* ========================================================== */}
          <div className="bg-white rounded-[2rem] p-10 shadow-2xl shadow-slate-200/50 mb-10 print:shadow-none print:p-0 print:rounded-none print:mb-0 print:min-h-[29cm]">
            
            {/* Cabeçalho do Relatório */}
            <div className="text-center mb-12 border-b border-slate-100 pb-10 print:pb-6 print:mb-6">
              <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 ${themeBg} text-white print:border print:border-slate-300 print:bg-white print:text-black`}>
                <BadgeCheck className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                  {isCorporate ? 'Saúde Organizacional VitalPulse' : 'Laudo Psicométrico Individual'}
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-2 tracking-tighter print:text-5xl print:text-black">Relatório Estratégico</h1>
              <p className={`text-xl font-black uppercase tracking-widest ${themeText} print:text-black`}>{userInfo?.name}</p>
              {isCorporate && (
                <div className="mt-2 text-slate-500 font-bold text-xs uppercase print:text-black">
                  Candidato da Empresa: {userInfo?.companyName} • CNPJ: {userInfo?.cnpj || 'ISENTO'}
                </div>
              )}
              <div className="flex items-center justify-center gap-4 text-[10px] font-mono text-slate-400 mt-4 print:text-slate-500">
                <span>PROTOCOLO: {testId}</span>
                <span>•</span>
                <span>EMISSÃO: {new Date().toLocaleDateString('pt-BR')}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              {/* RADAR CHART - VISÍVEL NO PDF */}
              <div className="lg:col-span-7 bg-slate-50 rounded-3xl p-8 border border-slate-100 print:bg-white print:border-slate-200 print:p-4">
                <h3 className="text-sm font-black text-slate-900 mb-6 flex items-center gap-2 uppercase tracking-widest print:text-black">
                  <Brain className="w-5 h-5" /> Mapeamento Geométrico
                </h3>
                <div className="h-[450px] w-full print:h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={results}>
                      <PolarGrid stroke="#cbd5e1" strokeWidth={1} />
                      <PolarAngleAxis 
                        dataKey="dimensionName" 
                        tick={{ fill: '#000000', fontSize: 9, fontWeight: 900 }} 
                      />
                      <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                      <Radar
                        isAnimationActive={false} // CRITICAL: Garante que apareça no PDF
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

              {/* SCORES DETALHADOS - 2 COLUNAS NO PDF */}
              <div className="lg:col-span-5 print:col-span-12">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 print:text-black">Scores Consolidados</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-2 print:grid-cols-3">
                  {results.map(r => (
                    <div key={r.dimensionId} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 print:bg-white print:border-slate-200">
                      <span className="font-bold text-slate-700 text-[9px] uppercase tracking-tight print:text-black">{r.dimensionName}</span>
                      <span className={`font-black text-base ${themeText} print:text-black`}>{r.score}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================== */}
          {/* PÁGINA 2: SINTETIZAÇÃO IA                                */}
          {/* ========================================================== */}
          <div className="print:break-before-page print:pt-10">
            <div className={`rounded-[3rem] shadow-2xl overflow-hidden border-4 flex flex-col print:border-slate-200 print:shadow-none print:rounded-3xl ${isCorporate ? 'border-orange-500/10' : 'border-indigo-500/10'}`}>
              
              <div className={`${themeBg} p-8 text-white print:bg-slate-100 print:text-black print:border-b print:border-slate-200`}>
                <div className="flex items-center gap-3 mb-2">
                  <Sparkles className="w-5 h-5 text-yellow-300 print:text-black" />
                  <h3 className="text-xl font-black uppercase tracking-widest">Sintetização IA</h3>
                </div>
                <p className="text-white/70 text-[10px] font-bold uppercase tracking-widest print:text-slate-500">Analista Psicométrico Digital</p>
              </div>

              <div className="bg-white p-12 min-h-[500px] print:min-h-0 print:p-10">
                {loadingAi ? (
                  <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <Loader2 className={`w-12 h-12 animate-spin ${themeText}`} />
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Processando Inteligência...</p>
                  </div>
                ) : aiAnalysis ? (
                  <div className="animate-fade-in text-slate-800 text-base leading-relaxed whitespace-pre-line font-medium text-justify print:text-black print:text-sm">
                    {aiAnalysis}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 opacity-20 print:hidden text-center">
                    <MessageSquareText className="w-16 h-16 mb-4" />
                    <p className="text-sm font-bold uppercase tracking-widest">Solicite uma análise técnica personalizada <br/> para habilitar este campo no PDF.</p>
                  </div>
                )}
              </div>

              {/* INPUT DA SMARTBOX (OCULTO NA IMPRESSÃO) */}
              <div className="p-8 bg-slate-50 border-t border-slate-100 print:hidden">
                <form onSubmit={handleSmartAiCall} className="relative">
                  <textarea 
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    placeholder="Ex: Qual o potencial de liderança desse perfil? / Quais os riscos de burnout desta equipe?"
                    className="w-full bg-white border border-slate-200 rounded-2xl py-6 pl-6 pr-16 text-slate-800 outline-none focus:ring-2 focus:ring-slate-400 text-xs min-h-[160px] shadow-sm transition-all"
                  />
                  <button type="submit" disabled={loadingAi} className={`absolute right-4 bottom-4 p-5 ${themeBg} text-white rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all`}>
                    {loadingAi ? <Loader2 className="w-6 h-6 animate-spin" /> : <Send className="w-6 h-6" />}
                  </button>
                </form>
                <p className="text-[9px] text-slate-400 font-bold mt-4 text-center uppercase tracking-widest">A análise acima ocupará a 2ª página do seu documento final.</p>
              </div>
            </div>

            {/* RODAPÉ DE ASSINATURA NO PDF */}
            <div className="hidden print:flex mt-16 pt-10 border-t-2 border-slate-100 justify-between items-end">
              <div className="text-[9px] font-black uppercase text-slate-400 space-y-1">
                <p>Insight360 Platform • Intelligence Unit</p>
                <p>Autenticidade Garantida via Blockchain ID: {testId}</p>
              </div>
              <div className="text-right">
                <div className="w-56 h-[1px] bg-black mb-2 ml-auto" />
                <p className="text-[10px] font-black uppercase text-black">Assinatura do Consultor Responsável</p>
              </div>
            </div>
          </div>

          <div className="mt-20 flex justify-center gap-4 print:hidden">
            <button onClick={onRestart} className="px-12 py-5 bg-white border-2 border-slate-200 text-slate-400 rounded-2xl font-black uppercase tracking-widest text-xs hover:border-slate-400 hover:text-slate-800 transition-all flex items-center gap-3">
              <RefreshCcw className="w-4 h-4" /> Novo Diagnóstico
            </button>
          </div>

        </main>
      </div>

      <style>{`
        @media print {
          @page { size: A4 portrait; margin: 1.2cm; }
          body { background: white !important; }
          .print-hidden { display: none !important; }
          
          /* RESET DE CORES PARA IMPRESSÃO */
          * { 
            -webkit-print-color-adjust: exact !important; 
            print-color-adjust: exact !important; 
            color: black !important;
          }
          
          /* CORES DE TEMA NO PDF */
          .bg-orange-600 { background-color: #ea580c !important; color: white !important; }
          .bg-indigo-600 { background-color: #4f46e5 !important; color: white !important; }
          
          .h-screen { height: auto !important; overflow: visible !important; }
          .overflow-hidden { overflow: visible !important; }
          
          /* QUEBRA DE PÁGINA RIGOROSA */
          .print-break-before-page { break-before: page !important; page-break-before: always !important; }
          
          /* VISIBILIDADE DOS LABELS DO GRÁFICO */
          .recharts-polar-angle-axis-tick text { 
            fill: #000000 !important; 
            font-weight: 900 !important; 
            font-size: 11px !important;
          }
        }
        
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
      `}</style>
    </div>
  );
};
