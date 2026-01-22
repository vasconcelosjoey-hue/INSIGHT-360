
import React, { useState } from 'react';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip
} from 'recharts';
import { ProcessedResult, UserInfo } from '../types';
import { generatePsychologicalAnalysis } from '../services/geminiService';
import { Brain, RefreshCcw, Sparkles, Printer, BadgeCheck, ArrowLeft, Send, Loader2, Layers, MessageSquareText, Layout } from 'lucide-react';

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
    <div className="w-full h-screen bg-slate-50 flex flex-col overflow-hidden print:h-auto print:overflow-visible print:bg-white">
      
      {/* HEADER FIXO (OCULTO NA IMPRESSÃO) */}
      <header className="flex-shrink-0 bg-white border-b border-slate-200 px-6 py-4 z-50 print:hidden shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <button onClick={onRestart} className="flex items-center gap-2 text-slate-500 font-bold text-xs hover:text-slate-900 transition-all">
            <ArrowLeft className="w-4 h-4" /> Voltar
          </button>
          <div className="flex items-center gap-2">
            <Layers className={`w-5 h-5 ${themeText}`} />
            <h2 className="font-black uppercase tracking-tighter text-slate-900 text-sm">Insight360</h2>
          </div>
          <button onClick={() => window.print()} className="bg-slate-900 text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:scale-105 transition-all">
            <Printer className="w-4 h-4 mr-2 inline" /> Salvar Relatório PDF
          </button>
        </div>
      </header>

      {/* ÁREA DE CONTEÚDO COM SCROLL */}
      <div className="flex-grow overflow-y-auto custom-scrollbar print:overflow-visible print:h-auto">
        
        <main className="max-w-7xl mx-auto px-6 py-12 print:p-0 print:max-w-none">
          
          {/* ========================================================== */}
          {/* PÁGINA 1: CABEÇALHO E MAPEAMENTO GEOMÉTRICO (DADOS)      */}
          {/* ========================================================== */}
          <div className="print-page-1 print:mb-20">
            
            <section className="text-center mb-16 animate-fade-in print:mb-10">
              <div className={`inline-flex items-center gap-2 px-5 py-2 rounded-full mb-6 ${themeBg} text-white print:bg-slate-100 print:text-black print:border print:border-slate-300 shadow-sm`}>
                <BadgeCheck className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                  {isCorporate ? 'Saúde Organizacional VitalPulse' : 'Laudo Psicométrico Individual'}
                </span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-2 tracking-tighter print:text-6xl">Relatório Insight360</h1>
              <p className={`text-2xl font-black uppercase tracking-tight ${themeText} print:text-black`}>{userInfo?.name}</p>
              {isCorporate && (
                <p className="text-slate-500 font-bold text-xs uppercase mt-2 print:text-black">Empresa: {userInfo?.companyName}</p>
              )}
              <div className="flex items-center justify-center gap-4 text-[10px] font-mono text-slate-400 mt-4 print:text-slate-500">
                <span>PROTOCOLO: {testId}</span>
                <span>•</span>
                <span>DATA: {new Date().toLocaleDateString('pt-BR')}</span>
              </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              
              {/* RADAR CHART - VISIBILIDADE MÁXIMA PARA IMPRESSÃO */}
              <div className="lg:col-span-7 bg-white rounded-[3rem] shadow-xl border border-slate-100 p-10 print:shadow-none print:border-slate-300 print:rounded-3xl">
                <h3 className="text-xl font-black text-slate-800 mb-8 flex items-center gap-3 print:text-black">
                  <Brain className={`w-6 h-6 ${themeText} print:text-black`} /> Mapeamento Geométrico
                </h3>
                <div className="h-[450px] w-full print:h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={results}>
                      {/* Grid escurecido para aparecer no PDF */}
                      <PolarGrid stroke="#94a3b8" strokeWidth={1} />
                      <PolarAngleAxis 
                        dataKey="dimensionName" 
                        tick={{ fill: '#0f172a', fontSize: 10, fontWeight: 900 }} 
                      />
                      <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                      <Radar
                        isAnimationActive={false} // Desativa animação para garantir que apareça no PDF
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

              {/* LISTA DE SCORES - TEXTO PRETO GARANTIDO */}
              <div className="lg:col-span-5 bg-white rounded-[3rem] shadow-xl border border-slate-100 p-10 print:shadow-none print:border-slate-300 print:rounded-3xl">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-8 print:text-black">Scores Consolidados</h3>
                <div className="grid grid-cols-1 gap-3">
                  {results.map(r => (
                    <div key={r.dimensionId} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 print:bg-white print:border-slate-200">
                      <span className="font-bold text-slate-700 text-[10px] uppercase tracking-tight print:text-black print:font-black">{r.dimensionName}</span>
                      <span className={`font-black text-lg ${themeText} print:text-black`}>{r.score}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================== */}
          {/* PÁGINA 2: SINTETIZAÇÃO IA (QUEBRA DE PÁGINA OBRIGATÓRIA)  */}
          {/* ========================================================== */}
          <div className="print-page-2 print:break-before-page mt-12 print:mt-0 print:pt-10">
            <div className={`rounded-[3rem] shadow-2xl overflow-hidden border-4 flex flex-col print:border-slate-300 print:shadow-none print:rounded-3xl ${isCorporate ? 'border-orange-500/10' : 'border-indigo-500/10'}`}>
              
              <div className={`${themeBg} p-8 text-white print:bg-slate-100 print:text-black print:border-b print:border-slate-200`}>
                <div className="flex items-center gap-3 mb-2">
                  <Sparkles className="w-5 h-5 text-yellow-300 print:text-black" />
                  <h3 className="text-xl font-black uppercase tracking-widest">Sintetização IA</h3>
                </div>
                <p className="text-white/70 text-[10px] font-bold uppercase tracking-widest print:text-slate-500">Parecer Técnico da Consultoria</p>
              </div>

              <div className="bg-white p-10 min-h-[400px] print:min-h-0 print:p-8">
                {loadingAi ? (
                  <div className="flex flex-col items-center justify-center py-20 gap-4 print:hidden">
                    <Loader2 className={`w-10 h-10 animate-spin ${themeText}`} />
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">IA Analisando dados...</p>
                  </div>
                ) : aiAnalysis ? (
                  <div className="animate-fade-in text-slate-800 text-sm leading-relaxed whitespace-pre-line font-medium text-justify print:text-black print:text-sm">
                    {aiAnalysis}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 opacity-20 print:hidden text-center">
                    <MessageSquareText className="w-12 h-12 mb-4" />
                    <p className="text-xs font-bold uppercase tracking-widest leading-loose">Solicite uma análise específica para <br/> gerar o parecer técnico deste documento.</p>
                  </div>
                )}
              </div>

              {/* SMARTBOX (OCULTA NA IMPRESSÃO) */}
              <div className="p-8 bg-slate-50 border-t border-slate-100 print:hidden">
                <form onSubmit={handleSmartAiCall} className="relative">
                  <textarea 
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    placeholder="Ex: Como lidar com o estresse desse funcionário? / Crie um plano de ação para a equipe..."
                    className="w-full bg-white border border-slate-200 rounded-2xl py-5 pl-6 pr-16 text-slate-800 outline-none focus:ring-2 focus:ring-slate-400 text-xs min-h-[140px] shadow-sm transition-all"
                  />
                  <button type="submit" disabled={loadingAi} className={`absolute right-3 bottom-3 p-4 ${themeBg} text-white rounded-xl shadow-xl hover:scale-110 active:scale-95 transition-all`}>
                    {loadingAi ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                  </button>
                </form>
                <p className="text-[9px] text-slate-400 font-bold mt-4 text-center uppercase tracking-widest">A análise gerada aparecerá na 2ª página do PDF.</p>
              </div>
            </div>

            {/* RODAPÉ DO PDF (ASSINATURA) */}
            <div className="hidden print:flex mt-12 pt-10 border-t-2 border-slate-100 justify-between items-end">
              <div className="text-[9px] font-black uppercase text-slate-400 space-y-1">
                <p>Insight360 Platform • Powered by JOI.A.</p>
                <p>ID Transação: {testId}</p>
              </div>
              <div className="text-right">
                <div className="w-48 h-[1px] bg-black mb-2 ml-auto" />
                <p className="text-[9px] font-black uppercase text-black">Assinatura do Consultor Responsável</p>
              </div>
            </div>
          </div>

          <div className="mt-16 flex justify-center gap-4 print:hidden">
            <button onClick={onRestart} className="px-10 py-5 bg-white border-2 border-slate-200 text-slate-400 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:border-slate-400 hover:text-slate-700 transition-all flex items-center gap-2">
              <RefreshCcw className="w-4 h-4" /> Reiniciar Diagnóstico
            </button>
          </div>

        </main>
      </div>

      <style>{`
        /* AJUSTES TÉCNICOS DE IMPRESSÃO */
        @media print {
          @page { size: A4 portrait; margin: 1cm; }
          body { background: white !important; }
          .print-hidden { display: none !important; }
          
          /* FORÇA TEXTO PRETO E BG BRANCO */
          * { 
            -webkit-print-color-adjust: exact !important; 
            print-color-adjust: exact !important; 
            color: black !important;
            border-color: #cbd5e1 !important;
          }
          
          /* CORES DOS TEMAS (EXCEÇÕES AO PRETO PARA LOGOS E DESTAQUES) */
          .bg-orange-600 { background-color: #ea580c !important; color: white !important; }
          .bg-indigo-600 { background-color: #4f46e5 !important; color: white !important; }
          .text-orange-600 { color: #ea580c !important; }
          .text-indigo-600 { color: #4f46e5 !important; }
          
          .h-screen { height: auto !important; }
          .overflow-hidden { overflow: visible !important; }
          
          /* QUEBRA DE PÁGINA */
          .print-break-before-page { break-before: page !important; }
          .print-page-2 { break-before: page !important; }
          
          /* GARANTIA DE VISIBILIDADE DOS LABELS DO RADAR */
          .recharts-polar-angle-axis-tick text { 
            fill: black !important; 
            font-weight: 900 !important; 
            font-size: 11px !important;
          }
        }
        
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
      `}</style>
    </div>
  );
};
