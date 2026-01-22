
import React, { useState, useEffect } from 'react';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip
} from 'recharts';
import { ProcessedResult, UserInfo } from '../types';
import { generatePsychologicalAnalysis, askSmartAiAboutCandidate } from '../services/geminiService';
// Added Layers to the imports from lucide-react
import { Brain, RefreshCcw, Sparkles, Printer, ShieldCheck, Mail, Phone, Hash, BadgeCheck, ArrowLeft, Download, Send, Loader2, MessageSquareText, Building2, Calendar, Layers } from 'lucide-react';

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
  const [smartQuery, setSmartQuery] = useState('');
  const [smartResponse, setSmartResponse] = useState('');
  const [loadingSmart, setLoadingSmart] = useState(false);

  const isCorporate = userInfo?.testType === 'corporate';

  const handleGenerateAnalysis = async () => {
    setLoadingAi(true);
    const analysis = await generatePsychologicalAnalysis(results, isCorporate);
    setAiAnalysis(analysis);
    setLoadingAi(false);
  };

  const handleSmartSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!smartQuery.trim()) return;
    setLoadingSmart(true);
    const response = await askSmartAiAboutCandidate(results, smartQuery);
    setSmartResponse(response);
    setLoadingSmart(false);
  };

  return (
    <div className={`max-w-7xl mx-auto w-full p-4 md:p-8 ${isCorporate ? 'theme-corporate' : 'theme-individual'}`}>
      
      {/* UI VIEW (No Print) */}
      <div className="print:hidden">
        {isAdmin && (
          <button onClick={onRestart} className="mb-6 flex items-center gap-2 text-slate-400 font-bold text-xs hover:text-white transition-all bg-white/5 px-4 py-2 rounded-lg">
            <ArrowLeft className="w-4 h-4" /> Voltar
          </button>
        )}

        <div className="text-center mb-10">
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full shadow-lg border mb-4 ${isCorporate ? 'bg-orange-600 border-orange-400' : 'bg-indigo-600 border-indigo-400'}`}>
            <BadgeCheck className="w-4 h-4 text-white" />
            <span className="text-[10px] font-black text-white uppercase tracking-widest">
              {isCorporate ? 'VitalPulse Saúde Organizacional' : 'Individual 360 Premium'}
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-2">Relatório Insight360</h1>
          <p className="text-slate-500 font-bold text-lg">{userInfo?.name}</p>
          {isCorporate && <p className="text-orange-600 font-black text-xs uppercase tracking-widest mt-1">{userInfo?.company} • CNPJ: {userInfo?.cnpj}</p>}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">
          <div className="lg:col-span-7 bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 p-6 md:p-10">
            <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
              <Brain className={`w-6 h-6 ${isCorporate ? 'text-orange-500' : 'text-indigo-500'}`} />
              Perfil Dinâmico
            </h3>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={results}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="dimensionName" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }} />
                  <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar
                    name="Nível"
                    dataKey="score"
                    stroke={isCorporate ? '#ea580c' : '#4f46e5'}
                    strokeWidth={3}
                    fill={isCorporate ? '#f97316' : '#6366f1'}
                    fillOpacity={0.4}
                  />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className={`p-8 rounded-[2.5rem] shadow-2xl text-white flex-grow flex flex-col ${isCorporate ? 'bg-gradient-to-br from-orange-600 to-amber-800' : 'bg-gradient-to-br from-slate-900 to-indigo-950'}`}>
              <div className="mb-6 flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-yellow-300" />
                <h3 className="text-xl font-black uppercase tracking-widest">Sintetização IA</h3>
              </div>
              
              {!aiAnalysis ? (
                <div className="flex-grow flex flex-col items-center justify-center text-center py-6">
                  <p className="text-white/70 text-sm mb-6 font-light">
                    O processamento de dados multidimensionais está pronto.
                  </p>
                  <button onClick={handleGenerateAnalysis} disabled={loadingAi} className="w-full py-4 bg-white text-slate-900 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                    {loadingAi ? <Loader2 className="animate-spin" /> : 'Gerar Relatório Estratégico'}
                  </button>
                </div>
              ) : (
                <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-6 h-[350px] overflow-y-auto text-xs leading-relaxed whitespace-pre-line font-medium custom-scrollbar">
                  {aiAnalysis}
                </div>
              )}
            </div>
          </div>
        </div>

        {isAdmin && !isCorporate && (
          <div className="bg-slate-900 rounded-[2.5rem] p-8 mb-10 shadow-2xl border border-white/5">
            <div className="flex items-center gap-4 mb-8">
              <MessageSquareText className="w-8 h-8 text-indigo-400" />
              <h3 className="text-2xl font-black text-white">Smartbox Consultoria</h3>
            </div>
            <form onSubmit={handleSmartSubmit} className="relative mb-6">
              <input type="text" value={smartQuery} onChange={(e) => setSmartQuery(e.target.value)} placeholder="Pergunte sobre a aderência a uma vaga ou plano de ação..." className="w-full bg-black/40 border border-white/10 rounded-2xl py-5 pl-6 pr-20 text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-sm" />
              <button disabled={loadingSmart} type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 p-4 bg-indigo-600 text-white rounded-xl shadow-xl">
                {loadingSmart ? <Loader2 className="animate-spin w-5 h-5" /> : <Send className="w-5 h-5" />}
              </button>
            </form>
            {smartResponse && (
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10 text-slate-300 text-sm italic whitespace-pre-line">{smartResponse}</div>
            )}
          </div>
        )}

        <div className="flex flex-wrap justify-center gap-4 pb-20">
          {isAdmin && (
            <button onClick={() => window.print()} className="flex items-center gap-2 px-10 py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl">
              <Printer className="w-5 h-5" /> Imprimir / Exportar PDF
            </button>
          )}
          <button onClick={onRestart} className="flex items-center gap-2 px-10 py-5 bg-white border-2 border-slate-200 text-slate-500 rounded-2xl font-black uppercase tracking-widest text-xs">
            <RefreshCcw className="w-4 h-4" /> Refazer Diagnóstico
          </button>
        </div>
      </div>

      {/* PDF PRINT VIEW (SINGLE PAGE LAYOUT) */}
      <div className="hidden print:block w-full text-slate-900 font-sans p-6 text-[10px]">
        
        {/* Header PDF */}
        <div className={`border-b-4 pb-4 mb-4 flex justify-between items-end ${isCorporate ? 'border-orange-600' : 'border-indigo-600'}`}>
          <div className="flex items-center gap-3">
            <Layers className={`w-8 h-8 ${isCorporate ? 'text-orange-600' : 'text-indigo-600'}`} />
            <div>
              <h1 className="text-2xl font-black tracking-tighter uppercase leading-none">Insight360</h1>
              <p className="text-[7px] font-bold uppercase tracking-[0.2em] opacity-60">
                {isCorporate ? 'Relatório de Saúde VitalPulse' : 'Diagnóstico de Perfil Psicométrico'}
              </p>
            </div>
          </div>
          <div className="text-right">
             <h2 className="text-base font-black uppercase truncate max-w-[300px]">{userInfo?.name}</h2>
             <div className="flex flex-col opacity-50 text-[7px] font-bold">
               {isCorporate && <span>{userInfo?.company} • {userInfo?.cnpj}</span>}
               <span>Protocolo: {testId} • Emissão: {new Date().toLocaleString('pt-BR')}</span>
             </div>
          </div>
        </div>

        {/* Grid PDF */}
        <div className="grid grid-cols-12 gap-4 h-[calc(100vh-180px)]">
          
          {/* Coluna Pontuações */}
          <div className="col-span-4 border border-slate-100 bg-slate-50/30 p-3 rounded-xl overflow-hidden">
            <h3 className="font-black uppercase text-[8px] mb-2 opacity-40 border-b pb-1">Análise de Dimensões (%)</h3>
            <div className="grid grid-cols-1 gap-0.5">
              {results.map(r => (
                <div key={r.dimensionId} className="flex justify-between items-center py-0.5 border-b border-slate-100 last:border-0">
                  <span className="font-bold uppercase text-slate-600 text-[7px]">{r.dimensionName}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1 bg-slate-200 rounded-full overflow-hidden">
                       <div className={`h-full ${isCorporate ? 'bg-orange-500' : 'bg-indigo-500'}`} style={{ width: `${r.score}%` }} />
                    </div>
                    <span className="font-black text-slate-900 min-w-[20px] text-right">{r.score}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Coluna Gráfico e IA */}
          <div className="col-span-8 flex flex-col gap-4">
            
            {/* Gráfico Radar Compacto */}
            <div className="flex-1 border border-slate-100 p-4 rounded-xl bg-white flex flex-col items-center justify-center relative min-h-[300px]">
               <h3 className="absolute top-4 left-4 font-black uppercase text-[8px] opacity-40">Mapeamento Geométrico</h3>
               <div className="w-full h-full">
                 <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="75%" data={results}>
                      <PolarGrid stroke="#f1f5f9" />
                      <PolarAngleAxis dataKey="dimensionName" tick={{ fill: '#94a3b8', fontSize: 6, fontWeight: 700 }} />
                      <Radar
                        dataKey="score"
                        stroke={isCorporate ? '#ea580c' : '#4f46e5'}
                        fill={isCorporate ? '#f97316' : '#6366f1'}
                        fillOpacity={0.3}
                      />
                    </RadarChart>
                 </ResponsiveContainer>
               </div>
            </div>

            {/* Análise IA Footer */}
            <div className="h-1/3 border border-slate-100 p-4 rounded-xl bg-slate-50/50">
               <div className="flex items-center gap-2 mb-2">
                 <Sparkles className={`w-3 h-3 ${isCorporate ? 'text-orange-500' : 'text-indigo-500'}`} />
                 <h3 className="font-black uppercase text-[8px] opacity-40">Conclusões da Inteligência Artificial</h3>
               </div>
               <div className="text-[8px] leading-relaxed text-slate-700 italic font-medium whitespace-pre-line line-clamp-[12]">
                 {aiAnalysis || "Análise sintética não processada. Utilize os dados acima para interpretação técnica."}
                 {smartResponse && (
                   <div className="mt-3 pt-3 border-t border-slate-200">
                     <span className="font-black text-indigo-600 block mb-1 uppercase text-[6px]">Smartbox Insights (ADM)</span>
                     {smartResponse}
                   </div>
                 )}
               </div>
            </div>

          </div>
        </div>

        {/* Footer PDF */}
        <div className="mt-4 pt-2 border-t border-slate-100 flex justify-between items-center text-[6px] font-black uppercase opacity-30">
          <span>Insight360 Intelligence Platform • JOI.A. Platform</span>
          <span>Este documento possui validade técnica para fins de desenvolvimento humano e organizacional.</span>
        </div>

      </div>

      <style>{`
        @media print {
          body { background: white !important; margin: 0; padding: 0; }
          .theme-corporate { --theme-color: #ea580c; }
          .theme-individual { --theme-color: #4f46e5; }
          @page { size: A4; margin: 0.5cm; }
        }
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 10px; }
      `}</style>
    </div>
  );
};
