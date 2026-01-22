
import React, { useState, useEffect } from 'react';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer,
  RadarProps,
  Tooltip
} from 'recharts';
import { ProcessedResult, UserInfo } from '../types';
import { generatePsychologicalAnalysis } from '../services/geminiService';
import { Brain, RefreshCcw, Sparkles, Printer, AlertTriangle, CheckCircle, MinusCircle, Mail, Phone, Calendar, Layers, Hash, BadgeCheck, ArrowLeft, Download } from 'lucide-react';

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

  const highScores = results.filter(r => r.score >= 70).sort((a, b) => b.score - a.score);
  const lowScores = results.filter(r => r.score <= 30).sort((a, b) => a.score - b.score);

  const handleGenerateAnalysis = async () => {
    setLoadingAi(true);
    const analysis = await generatePsychologicalAnalysis(results);
    setAiAnalysis(analysis);
    setLoadingAi(false);
  };

  const handlePrint = () => {
    if (!isAdmin) {
      alert("Apenas administradores podem exportar o relatório oficial em PDF.");
      return;
    }
    const originalTitle = document.title;
    const safeName = userInfo?.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '_') || 'Candidato';
    const fileName = `Relatorio_Insight360_${safeName}_${testId}`;
    document.title = fileName;
    window.print();
    setTimeout(() => {
      document.title = originalTitle;
    }, 1000);
  };

  return (
    <div className="max-w-7xl mx-auto w-full p-4 md:p-8">
      
      {/* --- DASHBOARD VISUAL --- */}
      <div className="print:hidden">
        {isAdmin && (
          <button onClick={onRestart} className="mb-6 flex items-center gap-2 text-indigo-600 font-bold text-sm hover:translate-x-[-4px] transition-all bg-indigo-50 px-4 py-2 rounded-lg">
            <ArrowLeft className="w-4 h-4" /> Voltar para Painel Admin
          </button>
        )}

        <div className="text-center mb-8 md:mb-10 animate-fade-in-up">
           <div className="inline-block mb-3 md:mb-4">
             <div className="flex items-center gap-2 bg-indigo-600 px-4 py-2 rounded-full shadow-lg border border-indigo-400">
               <BadgeCheck className="w-4 h-4 text-white" />
               <span className="text-xs font-bold text-white uppercase tracking-wider">Relatório Premium</span>
             </div>
           </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-3 tracking-tight">
            Relatório Insight<span className="text-indigo-600">360</span>
          </h1>
          <div className="flex flex-col items-center justify-center gap-2">
             <p className="text-lg text-slate-600 font-medium">
               <strong className="text-slate-900">{userInfo?.name}</strong>
             </p>
             <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-1 text-xs md:text-sm text-slate-400">
                <span className="flex items-center gap-1 font-mono"><Hash className="w-3.5 h-3.5" /> ID: <span className="text-indigo-600 font-bold">{testId}</span></span>
                {userInfo?.email && <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> {userInfo.email}</span>}
                {userInfo?.whatsapp && <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> {userInfo.whatsapp}</span>}
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 md:gap-8 mb-10">
          <div className="xl:col-span-7 bg-white rounded-[2rem] shadow-xl border border-slate-100 overflow-hidden flex flex-col animate-slide-in-left">
            <div className="p-6 md:p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-lg md:text-xl font-bold text-slate-800 flex items-center gap-2">
                <Layers className="w-5 h-5 text-indigo-500" />
                Gráfico de Dimensões 360°
              </h3>
            </div>
            <div className="p-4 flex-grow flex items-center justify-center min-h-[400px]">
              <ResponsiveContainer width="100%" height={400}>
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={results}>
                  <PolarGrid stroke="#cbd5e1" />
                  <PolarAngleAxis dataKey="dimensionName" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 600 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar
                    name="Perfil"
                    dataKey="score"
                    stroke="#4f46e5"
                    strokeWidth={3}
                    fill="#6366f1"
                    fillOpacity={0.5}
                  />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="xl:col-span-5 flex flex-col gap-6 animate-slide-in-right">
            <div className="bg-gradient-to-br from-slate-900 to-indigo-950 p-8 rounded-[2rem] shadow-2xl text-white relative overflow-hidden flex-grow flex flex-col border border-white/5">
              <div className="relative z-10 mb-6 flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-amber-300" />
                <h3 className="text-xl font-bold tracking-tight">Análise Estratégica IA</h3>
              </div>
              <div className="relative z-10 flex-grow">
                {!aiAnalysis ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-6 py-8">
                    <p className="text-slate-300 text-sm font-light leading-relaxed">
                      Sua análise personalizada está pronta para ser gerada. Nossa IA cruzará suas 21 dimensões para criar um mapa de carreira e plano de ação.
                    </p>
                    <button 
                      onClick={handleGenerateAnalysis}
                      disabled={loadingAi}
                      className="w-full py-4 bg-white text-indigo-950 rounded-xl font-bold hover:bg-indigo-50 transition-all shadow-xl active:scale-95 disabled:opacity-70 flex items-center justify-center gap-2"
                    >
                      {loadingAi ? <div className="w-5 h-5 border-2 border-indigo-900 border-t-transparent rounded-full animate-spin"></div> : "Gerar Análise Premium"}
                    </button>
                  </div>
                ) : (
                  <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 h-[400px] overflow-y-auto custom-scrollbar italic text-sm leading-relaxed whitespace-pre-line">
                    {aiAnalysis}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Dimension Table */}
        <div className="bg-white rounded-[2rem] p-8 mb-12 shadow-xl border border-slate-100">
          <h3 className="text-xl font-bold text-slate-800 mb-8 uppercase tracking-widest text-sm opacity-50">Detalhamento das 21 Dimensões</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map(dim => (
              <div key={dim.dimensionId} className="group">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-[11px] font-black text-slate-500 uppercase tracking-tighter group-hover:text-indigo-600 transition-colors">{dim.dimensionName}</span>
                  <span className={`text-xs font-bold ${dim.score >= 70 ? 'text-emerald-600' : dim.score <= 30 ? 'text-rose-600' : 'text-slate-400'}`}>{dim.score}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                   <div 
                    className={`h-full transition-all duration-1000 ${dim.score >= 70 ? 'bg-emerald-500' : dim.score <= 30 ? 'bg-rose-500' : 'bg-indigo-400'}`}
                    style={{ width: `${dim.score}%` }}
                   />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 pb-20 px-4">
           {isAdmin ? (
             <button 
              onClick={handlePrint}
              className="flex items-center justify-center gap-3 px-10 py-5 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-500/30 font-bold group"
            >
              <Download className="w-6 h-6" />
              Exportar Relatório Oficial (PDF)
            </button>
           ) : (
             <div className="flex flex-col items-center gap-2">
                <button 
                  disabled
                  className="flex items-center justify-center gap-3 px-10 py-5 bg-slate-200 text-slate-400 rounded-2xl cursor-not-allowed font-bold"
                >
                  <Printer className="w-6 h-6" />
                  Salvar PDF (Apenas Admin)
                </button>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Contate o administrador para o arquivo PDF</p>
             </div>
           )}

          <button 
            onClick={onRestart}
            className="flex items-center justify-center gap-3 px-10 py-5 bg-white border-2 border-slate-200 text-slate-500 rounded-2xl hover:border-slate-400 hover:text-slate-700 transition-all font-bold"
          >
            <RefreshCcw className="w-5 h-5" />
            Novo Diagnóstico
          </button>
        </div>
      </div>

      {/* --- PRINT LAYOUT --- */}
      <div className="hidden print:block w-full">
         <div className="border-b-4 border-indigo-900 pb-8 mb-10 flex justify-between items-end">
            <div>
               <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase">Insight<span className="text-indigo-600">360</span></h1>
               <p className="text-indigo-700 font-bold text-sm tracking-[0.3em] uppercase mt-2">Relatório de Perfil Psicométrico</p>
            </div>
            <div className="text-right">
               <p className="text-slate-400 text-[10px] font-bold uppercase mb-1">Candidato(a)</p>
               <h2 className="text-2xl font-bold text-slate-900">{userInfo?.name}</h2>
            </div>
         </div>
         {/* Conteúdo do PDF simplificado para impressão rápida */}
         <div className="grid grid-cols-2 gap-10">
            <div className="border border-slate-200 p-6 rounded-2xl">
               <h3 className="font-bold text-slate-800 mb-4 border-b pb-2 uppercase text-xs">Pontuações por Dimensão</h3>
               {results.map(r => (
                 <div key={r.dimensionId} className="flex justify-between items-center py-1 text-[10px] border-b border-slate-50">
                   <span className="font-medium text-slate-600 uppercase">{r.dimensionName}</span>
                   <span className="font-bold text-indigo-700">{r.score}%</span>
                 </div>
               ))}
            </div>
            <div className="space-y-8">
               <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                  <h3 className="font-bold text-slate-800 mb-4 uppercase text-xs">Identificação do Teste</h3>
                  <p className="text-sm font-mono mb-1">ID: {testId}</p>
                  <p className="text-sm">E-mail: {userInfo?.email}</p>
                  <p className="text-sm">Data: {new Date().toLocaleDateString()}</p>
               </div>
               {aiAnalysis && (
                 <div className="p-6">
                    <h3 className="font-bold text-slate-800 mb-4 uppercase text-xs">Síntese do Perfil</h3>
                    <p className="text-[11px] leading-relaxed italic text-slate-600">{aiAnalysis.slice(0, 1500)}...</p>
                 </div>
               )}
            </div>
         </div>
         <div className="fixed bottom-0 left-0 w-full p-8 border-t border-slate-100 flex justify-between items-center text-[10px] text-slate-400 font-bold uppercase tracking-widest">
            <span>insight360 intelligence platform</span>
            <span>Relatório Oficial Gerado pelo Administrador</span>
         </div>
      </div>
    </div>
  );
};
