
import React, { useState } from 'react';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip
} from 'recharts';
import { ProcessedResult, UserInfo } from '../types';
import { generatePsychologicalAnalysis } from '../services/geminiService';
import { Brain, RefreshCcw, Sparkles, Printer, ShieldCheck, BadgeCheck, ArrowLeft, Send, Loader2, Building2, Layers, MessageSquareText, ChevronDown } from 'lucide-react';

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

  const handleSmartAiCall = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoadingAi(true);
    const analysis = await generatePsychologicalAnalysis(results, isCorporate, customPrompt);
    setAiAnalysis(analysis);
    setLoadingAi(false);
  };

  return (
    <div className={`w-full min-h-screen bg-slate-50 flex flex-col ${isCorporate ? 'theme-corporate' : 'theme-individual'}`}>
      
      {/* UI VIEW - SCROLLABLE CONTENT */}
      <div className="flex-grow overflow-y-auto print:hidden pb-20 custom-scrollbar">
        
        {/* Header Fixo/Sticky */}
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <button onClick={onRestart} className="flex items-center gap-2 text-slate-500 font-bold text-xs hover:text-slate-900 transition-all">
              <ArrowLeft className="w-4 h-4" /> Voltar
            </button>
            <div className="flex items-center gap-3">
              <Layers className={`w-6 h-6 ${isCorporate ? 'text-orange-500' : 'text-indigo-600'}`} />
              <span className="font-black uppercase tracking-tighter text-slate-900">Insight<span className={isCorporate ? 'text-orange-500' : 'text-indigo-600'}>360</span></span>
            </div>
            <div className="flex gap-2">
              <button onClick={() => window.print()} className="hidden md:flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl font-bold text-[10px] uppercase tracking-widest shadow-lg hover:bg-black transition-all">
                <Printer className="w-4 h-4" /> Exportar PDF
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-6 py-10">
          
          {/* Identificação do Candidato/Empresa */}
          <div className="text-center mb-12 animate-fade-in">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full shadow-sm border mb-6 ${themeBg} border-white/20`}>
              <BadgeCheck className="w-4 h-4 text-white" />
              <span className="text-[10px] font-black text-white uppercase tracking-widest">
                {isCorporate ? 'VitalPulse Saúde Organizacional' : 'Diagnóstico de Perfil Individual'}
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-3 tracking-tighter">Relatório Estratégico</h1>
            <p className="text-slate-500 font-bold text-xl uppercase tracking-tight">{userInfo?.name}</p>
            {isCorporate && (
              <div className="mt-2 flex flex-col items-center gap-1">
                <p className="text-orange-600 font-black text-xs uppercase tracking-widest">{userInfo?.companyName}</p>
                <p className="text-slate-400 font-bold text-[10px]">CNPJ: {userInfo?.cnpj || 'ISENTO'}</p>
              </div>
            )}
            <p className="text-slate-400 font-mono text-[10px] mt-4 opacity-50">PROTOCOLO: {testId}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Esquerda: Radar e Dimensões */}
            <div className="lg:col-span-7 space-y-8">
              <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 p-8 md:p-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                   <Brain className="w-32 h-32 text-slate-900" />
                </div>
                <h3 className="text-xl font-black text-slate-800 mb-8 flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${isCorporate ? 'bg-orange-100' : 'bg-indigo-100'}`}>
                    <Brain className={`w-5 h-5 ${isCorporate ? 'text-orange-600' : 'text-indigo-600'}`} />
                  </div>
                  Mapeamento Geométrico
                </h3>
                
                <div className="h-[450px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={results}>
                      <PolarGrid stroke="#e2e8f0" />
                      <PolarAngleAxis dataKey="dimensionName" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }} />
                      <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                      <Radar
                        name="Nível"
                        dataKey="score"
                        stroke={themeColor}
                        strokeWidth={3}
                        fill={themeColor}
                        fillOpacity={0.4}
                      />
                      <Tooltip 
                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', fontWeight: 'bold' }}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Detalhamento de Scores (Scrollable dentro do card) */}
              <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 p-8">
                <h3 className="text-lg font-black text-slate-800 mb-6 uppercase tracking-widest opacity-50">Score por Dimensão</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {results.map(r => (
                    <div key={r.dimensionId} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex justify-between items-center group hover:bg-white hover:shadow-md transition-all">
                      <span className="font-bold text-slate-600 text-xs uppercase tracking-tight">{r.dimensionName}</span>
                      <span className={`font-black text-lg ${isCorporate ? 'text-orange-600' : 'text-indigo-600'}`}>{r.score}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Direita: Smartbox IA Digitável */}
            <div className="lg:col-span-5 sticky top-28">
              <div className={`rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col h-[700px] border-4 ${isCorporate ? 'border-orange-600/20' : 'border-indigo-600/20'}`}>
                
                {/* Header Smartbox */}
                <div className={`${themeBg} p-8 text-white relative`}>
                  <div className="flex items-center gap-3 mb-2">
                    <Sparkles className="w-6 h-6 text-yellow-300 animate-pulse" />
                    <h3 className="text-xl font-black uppercase tracking-widest">Sintetização IA</h3>
                  </div>
                  <p className="text-white/70 text-[10px] font-bold uppercase tracking-widest leading-none">Smartbox Consultoria Senior</p>
                </div>

                {/* Área de Exibição / Chat */}
                <div className="flex-grow bg-[#fafbfc] p-6 overflow-y-auto custom-scrollbar">
                  {!aiAnalysis && !loadingAi ? (
                    <div className="h-full flex flex-col items-center justify-center text-center px-6">
                      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                        <MessageSquareText className="w-8 h-8 text-slate-300" />
                      </div>
                      <p className="text-slate-400 text-sm font-medium leading-relaxed">
                        Deseja uma análise específica? <br/>
                        Digite no campo abaixo ou clique em "Gerar Geral".
                      </p>
                    </div>
                  ) : loadingAi ? (
                    <div className="h-full flex flex-col items-center justify-center gap-4">
                      <Loader2 className={`w-10 h-10 animate-spin ${isCorporate ? 'text-orange-500' : 'text-indigo-500'}`} />
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 animate-pulse">Sintetizando Conexões Neural...</p>
                    </div>
                  ) : (
                    <div className="animate-fade-in text-slate-700 text-sm leading-relaxed whitespace-pre-line font-medium pb-10">
                      {aiAnalysis}
                    </div>
                  )}
                </div>

                {/* Input Digitável */}
                <div className="p-6 bg-white border-t border-slate-100">
                  <form onSubmit={handleSmartAiCall} className="relative">
                    <textarea 
                      value={customPrompt}
                      onChange={(e) => setCustomPrompt(e.target.value)}
                      placeholder="Ex: Sugira um plano de treinamento para melhorar a Resiliência desta equipe..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-5 pr-14 text-slate-800 outline-none focus:ring-2 focus:ring-slate-200 transition-all font-medium text-xs resize-none min-h-[100px]"
                    />
                    <button 
                      type="submit" 
                      disabled={loadingAi}
                      className={`absolute right-3 bottom-3 p-4 ${themeBg} text-white rounded-xl shadow-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50`}
                    >
                      {loadingAi ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                    </button>
                  </form>
                  <p className="text-[9px] text-slate-400 font-bold mt-3 text-center uppercase tracking-widest">A análise gerada será incluída no PDF final.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Botões Mobile e Adicionais */}
          <div className="mt-12 flex flex-col md:flex-row justify-center gap-4">
             <button onClick={() => window.print()} className="md:hidden w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 shadow-2xl">
                <Printer className="w-5 h-5" /> Exportar PDF Colorido
             </button>
             <button onClick={onRestart} className="w-full md:w-auto px-12 py-5 bg-white border-2 border-slate-200 text-slate-500 rounded-2xl font-black uppercase tracking-widest text-xs hover:border-slate-300 transition-all flex items-center justify-center gap-2">
                <RefreshCcw className="w-4 h-4" /> Refazer Diagnóstico
             </button>
          </div>
        </main>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* PDF PRINT VIEW (Otimizado para impressão colorida e oficial) */}
      <div className="hidden print:block w-full text-slate-900 font-sans p-10 bg-white">
        
        {/* Cabeçalho do PDF */}
        <div className={`border-b-8 pb-6 mb-8 flex justify-between items-end ${isCorporate ? 'border-orange-600' : 'border-indigo-600'}`}>
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-2xl text-white ${themeBg}`}>
              <Layers className="w-10 h-10" />
            </div>
            <div>
              <h1 className="text-4xl font-black tracking-tighter uppercase leading-none">Insight360</h1>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 mt-1">Intelligence Platform • Consultoria Premium</p>
            </div>
          </div>
          <div className="text-right">
             <h2 className="text-xl font-black uppercase leading-tight">{userInfo?.name}</h2>
             <div className="flex flex-col opacity-60 text-[8px] font-bold mt-1">
               {isCorporate && <span>Empresa: {userInfo?.companyName} • {userInfo?.cnpj || 'ISENTO'}</span>}
               <span>Protocolo: {testId} • Emissão: {new Date().toLocaleString('pt-BR')}</span>
             </div>
          </div>
        </div>

        {/* Corpo do PDF - Grid 2 Colunas */}
        <div className="grid grid-cols-12 gap-8">
          
          {/* Lado Esquerdo: Scores e Radar */}
          <div className="col-span-5 space-y-6">
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
              <h3 className="font-black uppercase text-[10px] mb-4 opacity-40 border-b pb-2">Matriz de Scores (%)</h3>
              <div className="space-y-2">
                {results.map(r => (
                  <div key={r.dimensionId} className="flex justify-between items-center py-1 border-b border-slate-200/50 last:border-0">
                    <span className="font-bold uppercase text-slate-600 text-[8px]">{r.dimensionName}</span>
                    <div className="flex items-center gap-3">
                      <div className="w-20 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                         <div className={`h-full ${themeBg}`} style={{ width: `${r.score}%` }} />
                      </div>
                      <span className="font-black text-slate-900 text-[10px] min-w-[30px] text-right">{r.score}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Radar Compacto no PDF */}
            <div className="border border-slate-100 p-6 rounded-3xl bg-white flex flex-col items-center justify-center h-[350px]">
               <h3 className="font-black uppercase text-[10px] opacity-20 mb-4">Geometria Comportamental</h3>
               <div className="w-full h-full">
                 <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="75%" data={results}>
                      <PolarGrid stroke="#f1f5f9" />
                      <PolarAngleAxis dataKey="dimensionName" tick={{ fill: '#94a3b8', fontSize: 7, fontWeight: 700 }} />
                      <Radar
                        dataKey="score"
                        stroke={themeColor}
                        fill={themeColor}
                        fillOpacity={0.3}
                      />
                    </RadarChart>
                 </ResponsiveContainer>
               </div>
            </div>
          </div>

          {/* Lado Direito: Parecer IA */}
          <div className="col-span-7">
            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 min-h-[600px] flex flex-col">
               <div className="flex items-center gap-3 mb-6">
                 <Sparkles className={`w-5 h-5 ${isCorporate ? 'text-orange-500' : 'text-indigo-500'}`} />
                 <h3 className="font-black uppercase text-[12px] text-slate-800">Parecer Técnico da Inteligência Artificial</h3>
               </div>
               <div className="text-[10px] leading-relaxed text-slate-700 font-medium whitespace-pre-line text-justify">
                 {aiAnalysis || "Análise preliminar não solicitada pelo consultor. O parecer técnico deve ser gerado digitalmente antes da exportação para inclusão neste campo."}
               </div>
               
               {/* Rodapé Interno do PDF */}
               <div className="mt-auto pt-10 border-t border-slate-200 flex justify-between items-end opacity-40">
                  <div className="text-[8px] font-black uppercase">
                     <p>Documento Autenticado</p>
                     <p>Insight360 Intelligence System</p>
                  </div>
                  <div className="w-32 h-[1px] bg-slate-900 mb-2" />
                  <span className="text-[8px] font-black uppercase">Assinatura do Consultor</span>
               </div>
            </div>
          </div>
        </div>

        {/* Footer Final PDF */}
        <div className="mt-8 pt-4 border-t border-slate-100 flex justify-between items-center text-[7px] font-black uppercase opacity-30">
          <span>Insight360 • Powered by JOI.A. Platform</span>
          <span>© 2026 Todos os direitos reservados. Confidencial.</span>
        </div>

      </div>

      <style>{`
        @media print {
          @page { size: A4; margin: 0; }
          body { background: white !important; -webkit-print-color-adjust: exact; }
          .print-hidden { display: none !important; }
        }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(0,0,0,0.2); }
      `}</style>
    </div>
  );
};
