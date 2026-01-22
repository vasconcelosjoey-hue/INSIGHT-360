
import React, { useState, useEffect } from 'react';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip
} from 'recharts';
import { ProcessedResult, UserInfo } from '../types';
import { generatePsychologicalAnalysis, askSmartAiAboutCandidate } from '../services/geminiService';
import { Brain, RefreshCcw, Sparkles, Printer, ShieldCheck, Mail, Phone, Hash, BadgeCheck, ArrowLeft, Download, Send, Loader2, MessageSquareText } from 'lucide-react';

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

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className={`max-w-7xl mx-auto w-full p-4 md:p-8 ${isCorporate ? 'theme-corporate' : 'theme-individual'}`}>
      
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
              {isCorporate ? 'VitalPulse Corporativo' : 'Individual 360 Premium'}
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-2">Relatório Insight360</h1>
          <p className="text-slate-500 font-bold text-lg">{userInfo?.name}</p>
          <div className="flex flex-wrap justify-center gap-4 text-xs text-slate-400 mt-2 font-mono">
             <span>ID: {testId}</span>
             {userInfo?.whatsapp && <span>• {userInfo.whatsapp}</span>}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">
          {/* Chart */}
          <div className="lg:col-span-7 bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden p-6 md:p-10">
            <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
              <Brain className={`w-6 h-6 ${isCorporate ? 'text-orange-500' : 'text-indigo-500'}`} />
              Gráfico Radar
            </h3>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={results}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="dimensionName" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }} />
                  <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar
                    name="Perfil"
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

          {/* AI Synthesis */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className={`p-8 rounded-[2.5rem] shadow-2xl text-white flex-grow flex flex-col ${isCorporate ? 'bg-gradient-to-br from-orange-600 to-amber-800' : 'bg-gradient-to-br from-slate-900 to-indigo-950'}`}>
              <div className="mb-6 flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-yellow-300" />
                <h3 className="text-xl font-black uppercase tracking-widest">Síntese Estratégica</h3>
              </div>
              
              {!aiAnalysis ? (
                <div className="flex-grow flex flex-col items-center justify-center text-center py-6">
                  <p className="text-white/70 text-sm mb-6 font-light">
                    Sua análise personalizada será gerada agora pela nossa IA de elite.
                  </p>
                  <button onClick={handleGenerateAnalysis} disabled={loadingAi} className="w-full py-4 bg-white text-slate-900 rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                    {loadingAi ? <Loader2 className="animate-spin" /> : 'Gerar Relatório IA'}
                  </button>
                </div>
              ) : (
                <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-6 h-[350px] overflow-y-auto text-sm leading-relaxed whitespace-pre-line custom-scrollbar font-medium">
                  {aiAnalysis}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* SMARTBOX ADM (Exclusivo Individual) */}
        {isAdmin && !isCorporate && (
          <div className="bg-slate-900 rounded-[2.5rem] p-8 md:p-12 mb-10 shadow-2xl border border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-[80px] -z-10" />
            <div className="flex items-center gap-4 mb-8">
              <div className="p-4 bg-indigo-600/20 rounded-2xl border border-indigo-500/30">
                <MessageSquareText className="w-8 h-8 text-indigo-400" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-white leading-none">Smartbox Recrutamento</h3>
                <p className="text-slate-500 text-xs mt-1 uppercase tracking-widest font-bold">Consulte a IA sobre este perfil</p>
              </div>
            </div>

            <form onSubmit={handleSmartSubmit} className="relative mb-6">
              <input 
                type="text" 
                value={smartQuery}
                onChange={(e) => setSmartQuery(e.target.value)}
                placeholder="Ex: Este candidato serve para construção civil? Ou: Como lidar com sua inibição social?"
                className="w-full bg-black/40 border border-white/10 rounded-2xl py-5 pl-6 pr-20 text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-sm"
              />
              <button disabled={loadingSmart} type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 p-4 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 transition-all disabled:opacity-50 shadow-xl">
                {loadingSmart ? <Loader2 className="animate-spin w-5 h-5" /> : <Send className="w-5 h-5" />}
              </button>
            </form>

            {smartResponse && (
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10 animate-fade-in">
                <div className="flex items-center gap-2 text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-4">
                  <BadgeCheck className="w-4 h-4" /> Resposta Técnica da IA
                </div>
                <div className="text-slate-300 text-sm leading-relaxed italic whitespace-pre-line">
                  {smartResponse}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4 pb-20">
          {isAdmin && (
            <button onClick={handlePrint} className="flex items-center gap-2 px-10 py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-black transition-all shadow-2xl">
              <Download className="w-5 h-5" /> Exportar PDF Oficial
            </button>
          )}
          <button onClick={onRestart} className="flex items-center gap-2 px-10 py-5 bg-white border-2 border-slate-200 text-slate-500 rounded-2xl font-black uppercase tracking-widest text-xs hover:border-slate-400 transition-all">
            <RefreshCcw className="w-4 h-4" /> Novo Teste
          </button>
        </div>
      </div>

      {/* PRINT VIEW */}
      <div className="hidden print:block w-full text-slate-900 font-sans p-10">
        <div className={`border-b-8 pb-10 mb-10 flex justify-between items-end ${isCorporate ? 'border-orange-600' : 'border-indigo-600'}`}>
          <div>
            <h1 className="text-6xl font-black tracking-tighter uppercase">Insight360</h1>
            <p className="text-lg font-bold uppercase tracking-[0.3em] mt-2 opacity-60">Relatório Psicométrico Oficial</p>
          </div>
          <div className="text-right">
            <h2 className="text-3xl font-black">{userInfo?.name}</h2>
            <p className="font-mono text-sm">ID: {testId} • {new Date().toLocaleDateString()}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-10">
          <div className="border border-slate-200 p-8 rounded-3xl">
            <h3 className="font-black uppercase text-xs mb-6 opacity-50 border-b pb-2">Resultados por Dimensão</h3>
            {results.map(r => (
              <div key={r.dimensionId} className="flex justify-between items-center py-1.5 text-xs border-b border-slate-50 last:border-0">
                <span className="font-bold uppercase text-slate-600">{r.dimensionName}</span>
                <span className="font-black text-slate-900">{r.score}%</span>
              </div>
            ))}
          </div>
          <div className="space-y-10">
            {aiAnalysis && (
              <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200">
                <h3 className="font-black uppercase text-xs mb-4 opacity-50">Análise Sintética</h3>
                <p className="text-[11px] leading-relaxed italic text-slate-700 whitespace-pre-line">{aiAnalysis}</p>
              </div>
            )}
            {smartResponse && (
              <div className="bg-indigo-50 p-8 rounded-3xl border border-indigo-200">
                <h3 className="font-black uppercase text-xs mb-4 text-indigo-600">Smartbox Insights (ADM)</h3>
                <p className="text-[10px] font-bold text-slate-500 mb-2 uppercase italic">P: {smartQuery}</p>
                <p className="text-[11px] leading-relaxed text-indigo-900 italic whitespace-pre-line">{smartResponse}</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="fixed bottom-10 left-0 w-full px-10 flex justify-between text-[8px] font-black uppercase tracking-widest opacity-30">
          <span>Insight360 Intelligence • JOI.A. Platform</span>
          <span>Cópia Controlada para fins de Recrutamento</span>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.1); }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 10px; }
        @media print { .no-print { display: none !important; } }
      `}</style>
    </div>
  );
};
