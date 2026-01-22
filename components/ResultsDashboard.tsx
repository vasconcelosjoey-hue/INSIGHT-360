
import React, { useState } from 'react';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip
} from 'recharts';
import { ProcessedResult, UserInfo } from '../types';
import { generatePsychologicalAnalysis } from '../services/geminiService';
import { Brain, RefreshCcw, Sparkles, Printer, BadgeCheck, ArrowLeft, Send, Loader2, Building2, Layers, MessageSquareText, FileText } from 'lucide-react';

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
    <div className="w-full h-screen bg-slate-50 flex flex-col overflow-hidden">
      
      {/* HEADER FIXO - SEMPRE VISÍVEL */}
      <header className="flex-shrink-0 bg-white border-b border-slate-200 px-6 py-4 z-50 print:hidden">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <button onClick={onRestart} className="flex items-center gap-2 text-slate-500 font-bold text-xs hover:text-slate-900 transition-all">
            <ArrowLeft className="w-4 h-4" /> Voltar
          </button>
          <div className="flex items-center gap-2">
            <Layers className={`w-5 h-5 ${themeText}`} />
            <h2 className="font-black uppercase tracking-tighter text-slate-900 text-sm">Insight360</h2>
          </div>
          <button onClick={() => window.print()} className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg hover:bg-black transition-all">
            <Printer className="w-4 h-4 mr-2 inline" /> Exportar Relatório
          </button>
        </div>
      </header>

      {/* ÁREA DE SCROLL DO RELATÓRIO */}
      <div className="flex-grow overflow-y-auto custom-scrollbar print:overflow-visible print:h-auto bg-slate-50 print:bg-white">
        
        <main className="max-w-7xl mx-auto px-6 py-12 print:p-0">
          
          {/* PÁGINA 1: CABEÇALHO, RADAR E DIMENSÕES */}
          <div className="print:min-h-[28cm]">
            
            <section className="text-center mb-16 animate-fade-in print:mb-8">
              <div className={`inline-flex items-center gap-2 px-5 py-2 rounded-full mb-6 ${themeBg} text-white print:border print:border-slate-200 print:bg-slate-50 print:text-slate-900`}>
                <BadgeCheck className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                  {isCorporate ? 'Saúde Organizacional VitalPulse' : 'Laudo Psicométrico Individual'}
                </span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-2 tracking-tighter">Relatório Insight360</h1>
              <p className={`text-2xl font-black uppercase tracking-tight ${themeText} print:text-black`}>{userInfo?.name}</p>
              {isCorporate && (
                <p className="text-slate-500 font-bold text-xs uppercase mt-2">Empresa: {userInfo?.companyName} • CNPJ: {userInfo?.cnpj || 'ISENTO'}</p>
              )}
              <p className="text-[10px] font-mono text-slate-400 mt-4">PROTOCOLO: {testId} • {new Date().toLocaleDateString('pt-BR')}</p>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              
              {/* RADAR CHART - VISIBILIDADE MELHORADA */}
              <div className="lg:col-span-7 bg-white rounded-[3rem] shadow-xl border border-slate-100 p-10 print:shadow-none print:border-slate-200">
                <h3 className="text-xl font-black text-slate-800 mb-8 flex items-center gap-3 print:text-black">
                  <Brain className={`w-6 h-6 ${themeText}`} /> Mapeamento Geométrico
                </h3>
                <div className="h-[450px] w-full print:h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={results}>
                      <PolarGrid stroke="#cbd5e1" strokeWidth={1} />
                      <PolarAngleAxis dataKey="dimensionName" tick={{ fill: '#334155', fontSize: 10, fontWeight: 900 }} />
                      <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                      <Radar
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

              {/* LISTA DE DIMENSÕES - CORES CORRIGIDAS */}
              <div className="lg:col-span-5 bg-white rounded-[3rem] shadow-xl border border-slate-100 p-10 print:shadow-none print:border-slate-200">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-8 print:text-slate-500">Scores Detalhados</h3>
                <div className="space-y-3">
                  {results.map(r => (
                    <div key={r.dimensionId} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 print:bg-white print:border-slate-200">
                      <span className="font-bold text-slate-700 text-[10px] uppercase tracking-tight print:text-black">{r.dimensionName}</span>
                      <span className={`font-black text-lg ${themeText} print:text-black`}>{r.score}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* PÁGINA 2: SINTETIZAÇÃO IA (QUEBRA DE PÁGINA AUTOMÁTICA) */}
          <div className="print:mt-12 print:break-before-page">
            <div className={`mt-10 rounded-[3rem] shadow-2xl overflow-hidden border-4 flex flex-col print:border-slate-200 print:shadow-none ${isCorporate ? 'border-orange-500/10' : 'border-indigo-500/10'}`}>
              
              <div className={`${themeBg} p-8 text-white print:bg-slate-100 print:text-black`}>
                <div className="flex items-center gap-3 mb-2">
                  <Sparkles className="w-5 h-5 text-yellow-300 print:text-black" />
                  <h3 className="text-xl font-black uppercase tracking-widest">Sintetização IA</h3>
                </div>
                <p className="text-white/70 text-[10px] font-bold uppercase tracking-widest print:text-slate-500">Parecer Consultivo Profissional</p>
              </div>

              <div className="bg-white p-10 min-h-[400px] print:min-h-0">
                {loadingAi ? (
                  <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <Loader2 className={`w-10 h-10 animate-spin ${themeText}`} />
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Processando Inteligência...</p>
                  </div>
                ) : aiAnalysis ? (
                  <div className="animate-fade-in text-slate-800 text-sm leading-relaxed whitespace-pre-line font-medium text-justify print:text-black">
                    {aiAnalysis}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 opacity-20 print:hidden">
                    <MessageSquareText className="w-12 h-12 mb-4" />
                    <p className="text-xs font-bold uppercase tracking-widest">Aguardando solicitação do consultor...</p>
                  </div>
                )}
              </div>

              {/* INPUT DA SMARTBOX (OCULTO NA IMPRESSÃO) */}
              <div className="p-8 bg-slate-50 border-t border-slate-100 print:hidden">
                <form onSubmit={handleSmartAiCall} className="relative">
                  <textarea 
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    placeholder="O que você deseja saber sobre esses dados? Ex: Como melhorar o engajamento desta equipe?"
                    className="w-full bg-white border border-slate-200 rounded-2xl py-5 pl-6 pr-16 text-slate-800 outline-none focus:ring-2 focus:ring-slate-300 text-xs min-h-[120px] shadow-inner"
                  />
                  <button type="submit" disabled={loadingAi} className={`absolute right-3 bottom-3 p-4 ${themeBg} text-white rounded-xl shadow-xl hover:scale-105 active:scale-95 transition-all`}>
                    <Send className="w-5 h-5" />
                  </button>
                </form>
              </div>
            </div>
            
            {/* RODAPÉ DO PDF */}
            <div className="hidden print:flex mt-12 pt-8 border-t border-slate-200 justify-between items-end opacity-40">
              <div className="text-[8px] font-black uppercase">
                <p>Insight360 Intelligence System</p>
                <p>© 2026 Todos os direitos reservados</p>
              </div>
              <div className="text-right">
                <div className="w-40 h-[1px] bg-black mb-2 ml-auto" />
                <p className="text-[8px] font-black uppercase">Assinatura do Consultor Responsável</p>
              </div>
            </div>
          </div>

          <div className="mt-16 flex justify-center gap-4 print:hidden">
            <button onClick={onRestart} className="px-12 py-5 bg-white border-2 border-slate-200 text-slate-400 rounded-2xl font-black uppercase tracking-widest text-xs hover:border-slate-300 transition-all flex items-center gap-2">
              <RefreshCcw className="w-4 h-4" /> Novo Teste
            </button>
          </div>

        </main>
      </div>

      <style>{`
        @media print {
          @page { size: A4; margin: 1.5cm; }
          body { background: white !important; }
          .print-hidden { display: none !important; }
          .h-screen { height: auto !important; overflow: visible !important; }
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
      `}</style>
    </div>
  );
};
