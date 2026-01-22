
import React, { useState } from 'react';
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
      const analysis = await generatePsychologicalAnalysis(results, isCorporate, customPrompt);
      setAiAnalysis(analysis);
    } catch (error) {
      setErrorAi(true);
      setAiAnalysis("Não foi possível conectar com o servidor de IA. Verifique sua conexão ou tente novamente.");
    } finally {
      setLoadingAi(false);
    }
  };

  const copyToChatGPT = () => {
    const dataString = results.map(r => `- ${r.dimensionName}: ${r.score}%`).join('\n');
    const fullPrompt = `Analise os seguintes dados psicométricos do relatório Insight360 para ${userInfo?.name}:\n\n${dataString}\n\nPor favor, forneça um parecer técnico detalhado, pontos fortes, riscos e sugestões de desenvolvimento organizacional/pessoal.`;
    
    navigator.clipboard.writeText(fullPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="w-full h-screen bg-slate-100 flex flex-col overflow-hidden print:bg-white print:overflow-visible print:h-auto">
      
      {/* HEADER WEB */}
      <header className="flex-shrink-0 bg-white border-b border-slate-200 px-6 py-4 z-50 print:hidden shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-6">
            <button onClick={onRestart} className="flex items-center gap-2 text-slate-500 font-bold text-xs hover:text-slate-900 transition-all">
              <ArrowLeft className="w-4 h-4" /> Voltar
            </button>
            <div className="flex items-center gap-2">
              <Layers className={`w-5 h-5 ${themeText}`} />
              <h2 className="font-black uppercase tracking-tighter text-slate-900 text-sm">Insight360</h2>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={copyToChatGPT} 
              className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg hover:bg-emerald-700 transition-all flex items-center gap-2"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Prompt Copiado!' : 'Copiar p/ ChatGPT'}
            </button>
            <button 
              onClick={() => window.print()} 
              className="bg-slate-900 text-white px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg hover:bg-black transition-all flex items-center gap-2"
            >
              <Printer className="w-4 h-4" /> PDF 2 Páginas
            </button>
          </div>
        </div>
      </header>

      {/* ÁREA DE CONTEÚDO */}
      <div className="flex-grow overflow-y-auto custom-scrollbar print:overflow-visible print:h-auto">
        <main className="max-w-7xl mx-auto p-4 md:p-10 print:p-0 print:max-w-none">
          
          {/* PÁGINA 1: DADOS */}
          <div className="bg-white rounded-[3rem] p-12 shadow-2xl mb-12 print:shadow-none print:p-0 print:rounded-none print:mb-0 print:min-h-[28cm] border border-slate-100 print:border-none">
            
            <div className="text-center mb-10">
              <div className={`inline-flex items-center gap-2 px-5 py-2 rounded-full mb-6 ${themeBg} text-white print:border print:border-slate-300 print:bg-slate-50 print:text-black`}>
                <BadgeCheck className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                  {isCorporate ? 'Saúde Organizacional VitalPulse' : 'Laudo Psicométrico Individual'}
                </span>
              </div>
              <h1 className="text-5xl font-black text-slate-900 mb-2 tracking-tighter print:text-5xl">Relatório Insight360</h1>
              <p className={`text-2xl font-black uppercase tracking-widest ${themeText} print:text-black`}>{userInfo?.name}</p>
              {isCorporate && (
                <div className="mt-2 text-slate-500 font-bold text-[10px] uppercase tracking-widest print:text-black">
                  Empresa: {userInfo?.companyName} • CNPJ: {userInfo?.cnpj || 'ISENTO'}
                </div>
              )}
              <p className="text-[9px] font-mono text-slate-400 mt-4 print:text-slate-500">PROT: {testId} • {new Date().toLocaleDateString('pt-BR')}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-7 bg-slate-50 rounded-[2.5rem] p-10 border border-slate-100 print:bg-white print:border-slate-300">
                <h3 className="text-xs font-black text-slate-900 mb-8 flex items-center gap-2 uppercase tracking-widest print:text-black">
                  <Brain className="w-5 h-5" /> Perfil Geométrico
                </h3>
                <div className="h-[450px] w-full print:h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={results}>
                      <PolarGrid stroke="#94a3b8" strokeWidth={1} />
                      <PolarAngleAxis dataKey="dimensionName" tick={{ fill: '#000000', fontSize: 10, fontWeight: 900 }} />
                      <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                      <Radar
                        isAnimationActive={false}
                        dataKey="score"
                        stroke={themeColor}
                        strokeWidth={4}
                        fill={themeColor}
                        fillOpacity={0.4}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="lg:col-span-5 print:col-span-12">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 print:text-black">Scores Consolidados</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-2 print:grid-cols-3">
                  {results.map(r => (
                    <div key={r.dimensionId} className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-100 print:bg-white print:border-slate-200">
                      <span className="font-bold text-slate-700 text-[9px] uppercase tracking-tight print:text-black">{r.dimensionName}</span>
                      <span className={`font-black text-sm ${themeText} print:text-black`}>{r.score}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* PÁGINA 2: SINTETIZAÇÃO IA */}
          <div className="print:break-before-page print:pt-10 mb-10">
            <div className={`rounded-[3rem] shadow-2xl overflow-hidden border-4 flex flex-col print:border-slate-300 print:shadow-none print:rounded-3xl ${isCorporate ? 'border-orange-500/20' : 'border-indigo-500/20'} bg-white`}>
              
              <div className={`${themeBg} p-8 text-white print:bg-slate-100 print:text-black print:border-b print:border-slate-200`}>
                <div className="flex items-center gap-3 mb-2">
                  <Sparkles className="w-5 h-5 text-yellow-300 print:text-black" />
                  <h3 className="text-xl font-black uppercase tracking-widest">Sintetização IA</h3>
                </div>
                <p className="text-white/70 text-[10px] font-bold uppercase tracking-widest print:text-slate-500">Parecer Técnico Especializado</p>
              </div>

              {/* CAIXA ONDE A IA RESPONDE */}
              <div className="bg-white p-12 min-h-[550px] print:min-h-0 print:p-10 relative">
                {loadingAi ? (
                  <div className="flex flex-col items-center justify-center py-24 gap-4 animate-pulse">
                    <Loader2 className={`w-12 h-12 animate-spin ${themeText}`} />
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">A IA está analisando seus resultados...</p>
                  </div>
                ) : aiAnalysis ? (
                  <div className={`animate-fade-in text-slate-900 text-base leading-relaxed whitespace-pre-line font-medium text-justify print:text-black print:text-sm ${errorAi ? 'text-rose-600 bg-rose-50 p-6 rounded-2xl border border-rose-100 flex items-center gap-3' : ''}`}>
                    {errorAi && <AlertCircle className="w-6 h-6 flex-shrink-0" />}
                    {aiAnalysis}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 opacity-30 print:hidden text-center">
                    <MessageSquareText className="w-16 h-16 mb-4 text-slate-300" />
                    <p className="text-xs font-black uppercase tracking-widest leading-loose text-slate-400">Escreva sua dúvida abaixo e clique no botão enviar <br/> para gerar a análise técnica oficial.</p>
                  </div>
                )}
              </div>

              {/* INPUT DA SMARTBOX (OCULTO NA IMPRESSÃO) */}
              <div className="p-10 bg-slate-50 border-t border-slate-100 print:hidden">
                <form onSubmit={handleSmartAiCall} className="relative group">
                  <textarea 
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    placeholder="Faça uma pergunta específica para a IA... Ex: Quais os riscos de burnout desta equipe?"
                    className="w-full bg-white border-2 border-slate-200 rounded-[2rem] py-8 pl-8 pr-20 text-slate-800 outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100 text-sm min-h-[180px] shadow-inner transition-all resize-none"
                  />
                  <button 
                    type="submit" 
                    disabled={loadingAi} 
                    className={`absolute right-4 bottom-4 p-6 ${themeBg} text-white rounded-[1.5rem] shadow-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100`}
                  >
                    {loadingAi ? <Loader2 className="w-6 h-6 animate-spin" /> : <Send className="w-6 h-6" />}
                  </button>
                </form>
                <div className="flex justify-between items-center mt-6">
                   <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">DICA: Seja específico para resultados mais profundos.</p>
                   {aiAnalysis && !loadingAi && (
                     <button onClick={() => setAiAnalysis('')} className="text-[9px] text-slate-400 font-black uppercase tracking-widest hover:text-rose-500 transition-colors flex items-center gap-1">
                       <RefreshCcw className="w-3 h-3" /> Limpar Análise
                     </button>
                   )}
                </div>
              </div>
            </div>

            {/* RODAPÉ DO PDF */}
            <div className="hidden print:flex mt-16 pt-10 border-t-2 border-slate-100 justify-between items-end">
              <div className="text-[9px] font-black uppercase text-slate-400 space-y-1">
                <p>Insight360 Platform • Powered by Gemini AI</p>
                <p>ID Transação: {testId} • Certificado Digital</p>
              </div>
              <div className="text-right">
                <div className="w-56 h-[1px] bg-black mb-2 ml-auto" />
                <p className="text-[10px] font-black uppercase text-black">Assinatura do Responsável Técnico</p>
              </div>
            </div>
          </div>

          <div className="mt-10 flex justify-center gap-4 print:hidden pb-20">
            <button onClick={onRestart} className="px-12 py-5 bg-white border-2 border-slate-200 text-slate-400 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:border-slate-400 hover:text-slate-800 transition-all flex items-center gap-3">
              <RefreshCcw className="w-4 h-4" /> Novo Mapeamento
            </button>
          </div>

        </main>
      </div>

      <style>{`
        @media print {
          @page { size: A4 portrait; margin: 1cm; }
          body { background: white !important; }
          .print-hidden { display: none !important; }
          * { 
            -webkit-print-color-adjust: exact !important; 
            print-color-adjust: exact !important; 
            color: black !important;
          }
          .h-screen { height: auto !important; overflow: visible !important; }
          .print-break-before-page { break-before: page !important; }
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
