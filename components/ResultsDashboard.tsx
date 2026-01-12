import React, { useState } from 'react';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer,
  Tooltip
} from 'recharts';
import { ProcessedResult, UserInfo } from '../types';
import { generatePsychologicalAnalysis } from '../services/geminiService';
import { Brain, RefreshCcw, Sparkles, Printer, AlertTriangle, CheckCircle, MinusCircle, Mail, Phone, Calendar, Layers } from 'lucide-react';

interface ResultsDashboardProps {
  results: ProcessedResult[];
  userInfo: UserInfo | null;
  onRestart: () => void;
}

export const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ results, userInfo, onRestart }) => {
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [loadingAi, setLoadingAi] = useState<boolean>(false);

  // Group results
  const highScores = results.filter(r => r.score >= 70).sort((a, b) => b.score - a.score);
  const lowScores = results.filter(r => r.score <= 30).sort((a, b) => a.score - b.score);
  const midScores = results.filter(r => r.score > 30 && r.score < 70).sort((a, b) => b.score - a.score);

  const handleGenerateAnalysis = async () => {
    setLoadingAi(true);
    const analysis = await generatePsychologicalAnalysis(results);
    setAiAnalysis(analysis);
    setLoadingAi(false);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto w-full p-4 md:p-8">
      
      {/* --- ON SCREEN DASHBOARD --- */}
      <div className="print:hidden">
        {/* Hero Header */}
        <div className="text-center mb-12 animate-fade-in-up">
           <div className="inline-block mb-4">
             <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-100">
               <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
               <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Relatório Finalizado</span>
             </div>
           </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
            Perfil Insight<span className="text-indigo-600">360</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Olá, <strong className="text-slate-900">{userInfo?.name}</strong>. Mapeamos com sucesso suas 21 dimensões comportamentais.
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 mb-12">
          
          {/* Chart Section - Spans 7 cols */}
          <div className="xl:col-span-7 bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden flex flex-col animate-slide-in-left">
            <div className="p-8 border-b border-slate-50 flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Layers className="w-5 h-5 text-indigo-500" />
                Mapa Radar
              </h3>
              <span className="text-xs font-medium bg-slate-100 text-slate-500 px-3 py-1 rounded-full">Visualização Holística</span>
            </div>
            <div className="p-4 flex-grow flex items-center justify-center bg-slate-50/30">
              <div className="w-full h-[400px] md:h-[500px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={results}>
                    <PolarGrid gridType="polygon" stroke="#cbd5e1" strokeDasharray="4 4" />
                    <PolarAngleAxis 
                      dataKey="dimensionName" 
                      tick={{ fill: '#475569', fontSize: 11, fontWeight: 600 }} 
                    />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar
                      name="Você"
                      dataKey="score"
                      stroke="#4f46e5"
                      strokeWidth={3}
                      fill="#6366f1"
                      fillOpacity={0.4}
                    />
                    <Tooltip 
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)', padding: '12px' }}
                      itemStyle={{ color: '#1e293b', fontWeight: 'bold' }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* AI Analysis Section - Spans 5 cols */}
          <div className="xl:col-span-5 flex flex-col gap-6 animate-slide-in-right">
             {/* AI Card */}
            <div className="bg-gradient-to-br from-slate-900 to-indigo-950 p-8 rounded-[2rem] shadow-2xl text-white relative overflow-hidden flex-grow flex flex-col">
              {/* Background Glows */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>
              
              <div className="relative z-10 mb-6 flex items-center gap-3">
                <div className="bg-white/10 p-2 rounded-lg backdrop-blur-md">
                   <Sparkles className="w-6 h-6 text-amber-300" />
                </div>
                <h3 className="text-2xl font-bold">Insight360 IA</h3>
              </div>
              
              <div className="relative z-10 flex-grow">
                {!aiAnalysis ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-6 py-8">
                    <p className="text-slate-300 leading-relaxed">
                      Utilize nossa Inteligência Artificial para correlacionar suas dimensões e gerar um plano de desenvolvimento personalizado.
                    </p>
                    <button 
                      onClick={handleGenerateAnalysis}
                      disabled={loadingAi}
                      className="w-full py-4 bg-white text-indigo-950 rounded-xl font-bold hover:bg-indigo-50 transition-all shadow-lg hover:shadow-white/20 hover:-translate-y-1 disabled:opacity-70 disabled:translate-y-0 flex items-center justify-center gap-2"
                    >
                      {loadingAi ? (
                        <>
                          <div className="w-5 h-5 border-2 border-indigo-900 border-t-transparent rounded-full animate-spin"></div>
                          Processando...
                        </>
                      ) : (
                        <>Gerar Análise Completa <Sparkles className="w-4 h-4" /></>
                      )}
                    </button>
                  </div>
                ) : (
                  <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 h-[400px] overflow-y-auto custom-scrollbar border border-white/5">
                    <div className="prose prose-invert prose-sm max-w-none text-slate-100 whitespace-pre-line leading-relaxed">
                      {aiAnalysis}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Quick Stats Card */}
             <div className="bg-white p-6 rounded-[2rem] shadow-lg border border-slate-100">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-bold text-slate-700">Resumo Rápido</h4>
                  <div className="flex gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-500" title="Pontos Fortes"></span>
                    <span className="w-3 h-3 rounded-full bg-amber-400" title="Equilíbrio"></span>
                    <span className="w-3 h-3 rounded-full bg-rose-500" title="Atenção"></span>
                  </div>
                </div>
                <div className="flex gap-4 text-center">
                    <div className="flex-1 bg-emerald-50 rounded-xl p-3">
                        <div className="text-2xl font-bold text-emerald-700">{highScores.length}</div>
                        <div className="text-xs font-medium text-emerald-600">Fortes</div>
                    </div>
                    <div className="flex-1 bg-amber-50 rounded-xl p-3">
                        <div className="text-2xl font-bold text-amber-700">{midScores.length}</div>
                        <div className="text-xs font-medium text-amber-600">Médios</div>
                    </div>
                    <div className="flex-1 bg-rose-50 rounded-xl p-3">
                        <div className="text-2xl font-bold text-rose-700">{lowScores.length}</div>
                        <div className="text-xs font-medium text-rose-600">Críticos</div>
                    </div>
                </div>
             </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-6 pb-12 animate-fade-in">
           <button 
            onClick={handlePrint}
            className="flex items-center justify-center gap-3 px-10 py-4 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-500/30 hover:-translate-y-1 font-semibold text-lg group"
          >
            <Printer className="w-6 h-6" />
            Salvar PDF
            <span className="bg-white/20 px-2 py-0.5 rounded text-sm group-hover:bg-white/30 transition-colors">A4</span>
          </button>

          <button 
            onClick={onRestart}
            className="flex items-center justify-center gap-3 px-10 py-4 bg-white border-2 border-slate-200 text-slate-600 rounded-2xl hover:border-slate-300 hover:text-slate-800 transition-all font-semibold text-lg"
          >
            <RefreshCcw className="w-5 h-5" />
            Novo Teste
          </button>
        </div>
      </div>

      {/* --- PRINT ONLY LAYOUT (A4 OPTIMIZED) --- */}
      <div className="hidden print:block print:w-full">
        {/* Print Header */}
        <div className="border-b-2 border-indigo-900 pb-6 mb-8">
           <div className="flex justify-between items-start">
              <div className="flex items-center gap-4">
                  <div className="bg-indigo-900 text-white p-3 rounded-lg">
                    <Layers className="w-8 h-8" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-extrabold text-slate-900">Insight360</h1>
                    <p className="text-indigo-600 font-medium">Relatório Analítico de Personalidade</p>
                  </div>
              </div>
              <div className="text-right">
                 <h2 className="text-xl font-bold text-slate-800">{userInfo?.name || 'Usuário'}</h2>
                 <div className="flex flex-col items-end gap-1 mt-2 text-sm text-slate-500">
                    <div className="flex items-center gap-2">
                       <Mail className="w-3 h-3" /> {userInfo?.email}
                    </div>
                    <div className="flex items-center gap-2">
                       <Phone className="w-3 h-3" /> {userInfo?.whatsapp}
                    </div>
                    <div className="flex items-center gap-2">
                       <Calendar className="w-3 h-3" /> {new Date().toLocaleDateString()}
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* Print Content Grid */}
        <div className="grid grid-cols-2 gap-8 mb-8">
           {/* Left: Chart */}
           <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 flex items-center justify-center">
             <div className="w-full h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="75%" data={results}>
                      <PolarGrid gridType="polygon" stroke="#94a3b8" />
                      <PolarAngleAxis dataKey="dimensionName" tick={{ fill: '#334155', fontSize: 10, fontWeight: 'bold' }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                      <Radar name="Você" dataKey="score" stroke="#312e81" strokeWidth={2} fill="#6366f1" fillOpacity={0.4} />
                    </RadarChart>
                  </ResponsiveContainer>
             </div>
           </div>

           {/* Right: Summary */}
           <div>
              <h3 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-2 mb-4">Resumo Executivo</h3>
              <p className="text-sm text-slate-600 mb-6 text-justify leading-relaxed">
                Este relatório apresenta o mapeamento das 21 dimensões comportamentais do participante. 
                Os resultados são baseados nas respostas fornecidas ao inventário Insight360, indicando tendências naturais de comportamento, 
                estilo de tomada de decisão e inteligência emocional.
              </p>
              
              <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                 <h4 className="font-bold text-indigo-900 text-sm mb-2">Destaques do Perfil</h4>
                 <ul className="text-sm space-y-1">
                    {highScores.slice(0, 3).map(h => (
                      <li key={h.dimensionId} className="flex justify-between text-indigo-800">
                        <span>{h.dimensionName}</span>
                        <span className="font-bold">{h.score.toFixed(0)}%</span>
                      </li>
                    ))}
                 </ul>
              </div>
           </div>
        </div>

        {/* Traffic Light System */}
        <div className="grid grid-cols-1 gap-6 mb-8 break-inside-avoid">
           
           {/* Strengths (Green) */}
           {highScores.length > 0 && (
             <div className="border border-emerald-200 bg-white rounded-xl p-4 break-inside-avoid shadow-sm">
               <div className="flex items-center gap-2 mb-3 border-b border-emerald-100 pb-2">
                 <CheckCircle className="w-5 h-5 text-emerald-600" />
                 <h3 className="text-base font-bold text-emerald-800">Pontos Fortes & Potencialidades</h3>
               </div>
               <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                 {highScores.map(res => (
                   <div key={res.dimensionId} className="flex justify-between items-center border-b border-slate-50 pb-1">
                      <span className="text-sm font-medium text-slate-700">{res.dimensionName}</span>
                      <span className="text-sm font-bold text-emerald-700">{res.score.toFixed(0)}%</span>
                   </div>
                 ))}
               </div>
             </div>
           )}

           {/* Watch Outs (Red) */}
           {lowScores.length > 0 && (
             <div className="border border-rose-200 bg-white rounded-xl p-4 break-inside-avoid shadow-sm">
               <div className="flex items-center gap-2 mb-3 border-b border-rose-100 pb-2">
                 <AlertTriangle className="w-5 h-5 text-rose-600" />
                 <h3 className="text-base font-bold text-rose-800">Pontos de Atenção</h3>
               </div>
               <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                 {lowScores.map(res => (
                   <div key={res.dimensionId} className="flex justify-between items-center border-b border-slate-50 pb-1">
                      <span className="text-sm font-medium text-slate-700">{res.dimensionName}</span>
                      <span className="text-sm font-bold text-rose-700">{res.score.toFixed(0)}%</span>
                   </div>
                 ))}
               </div>
             </div>
           )}

           {/* Balanced (Blue) */}
           {midScores.length > 0 && (
             <div className="border border-slate-200 bg-white rounded-xl p-4 break-inside-avoid shadow-sm">
               <div className="flex items-center gap-2 mb-3 border-b border-slate-100 pb-2">
                 <MinusCircle className="w-5 h-5 text-indigo-600" />
                 <h3 className="text-base font-bold text-slate-800">Em Equilíbrio</h3>
               </div>
               <div className="grid grid-cols-3 gap-x-4 gap-y-2">
                 {midScores.map(res => (
                   <div key={res.dimensionId} className="flex justify-between items-center">
                      <span className="text-xs text-slate-600 truncate mr-2">{res.dimensionName}</span>
                      <span className="text-xs font-bold text-indigo-600">{res.score.toFixed(0)}%</span>
                   </div>
                 ))}
               </div>
             </div>
           )}
        </div>

        {/* AI Analysis Print */}
        {aiAnalysis && (
          <div className="border-t-2 border-slate-200 pt-6 mt-6 break-inside-avoid">
            <h3 className="text-lg font-bold text-indigo-900 mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5" /> Análise Comportamental Detalhada
            </h3>
            <div className="prose prose-sm max-w-none text-justify text-slate-800 whitespace-pre-line columns-2 gap-8 leading-relaxed">
              {aiAnalysis}
            </div>
          </div>
        )}
        
        <div className="fixed bottom-0 left-0 w-full text-center text-[10px] text-slate-400 p-4 border-t border-slate-100 bg-white">
           Insight360 © {new Date().getFullYear()} - Relatório Confidencial gerado para {userInfo?.name}.
        </div>
      </div>
    </div>
  );
};