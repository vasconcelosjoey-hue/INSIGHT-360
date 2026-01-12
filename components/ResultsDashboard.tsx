
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
import { Brain, RefreshCcw, Sparkles, Printer, AlertTriangle, CheckCircle, MinusCircle, Mail, Phone, Calendar, Layers, Hash, BadgeCheck } from 'lucide-react';

interface ResultsDashboardProps {
  results: ProcessedResult[];
  userInfo: UserInfo | null;
  testId: string;
  onRestart: () => void;
}

export const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ results, userInfo, testId, onRestart }) => {
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
        <div className="text-center mb-10 animate-fade-in-up">
           <div className="inline-block mb-4">
             <div className="flex items-center gap-2 bg-indigo-600 px-4 py-2 rounded-full shadow-lg border border-indigo-400">
               <BadgeCheck className="w-4 h-4 text-white" />
               <span className="text-xs font-bold text-white uppercase tracking-wider">Relatório Premium Verificado</span>
             </div>
           </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
            Relatório Insight<span className="text-indigo-600">360</span>
          </h1>
          <div className="flex flex-col items-center justify-center gap-2">
             <p className="text-lg text-slate-600 font-medium">
               Participante: <strong className="text-slate-900">{userInfo?.name}</strong>
             </p>
             <div className="flex items-center gap-4 text-sm text-slate-400">
                <span className="flex items-center gap-1"><Hash className="w-3.5 h-3.5" /> ID: <span className="text-indigo-600 font-mono font-bold">{testId}</span></span>
                <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> {userInfo?.email}</span>
                <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> {userInfo?.whatsapp}</span>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 mb-12">
          
          {/* Chart Section */}
          <div className="xl:col-span-7 bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden flex flex-col animate-slide-in-left">
            <div className="p-8 border-b border-slate-50 flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Layers className="w-5 h-5 text-indigo-500" />
                Mapeamento das 21 Dimensões
              </h3>
              <span className="text-xs font-medium bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full font-bold">Análise 360°</span>
            </div>
            <div className="p-4 flex-grow flex items-center justify-center bg-slate-50/30">
              <div className="w-full h-[400px] md:h-[500px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={results}>
                    <PolarGrid gridType="polygon" stroke="#cbd5e1" strokeDasharray="4 4" />
                    <PolarAngleAxis 
                      dataKey="dimensionName" 
                      tick={{ fill: '#475569', fontSize: 10, fontWeight: 700 }} 
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

          {/* AI Analysis Section */}
          <div className="xl:col-span-5 flex flex-col gap-6 animate-slide-in-right">
            <div className="bg-gradient-to-br from-slate-900 to-indigo-950 p-8 rounded-[2rem] shadow-2xl text-white relative overflow-hidden flex-grow flex flex-col border border-white/5">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
              
              <div className="relative z-10 mb-6 flex items-center gap-3">
                <div className="bg-white/10 p-2 rounded-lg backdrop-blur-md">
                   <Sparkles className="w-6 h-6 text-amber-300" />
                </div>
                <h3 className="text-2xl font-bold tracking-tight">Análise Cognitiva IA</h3>
              </div>
              
              <div className="relative z-10 flex-grow">
                {!aiAnalysis ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-6 py-8">
                    <p className="text-slate-300 leading-relaxed text-sm">
                      Nossa inteligência artificial avançada cruzará suas 21 dimensões para gerar uma síntese personalizada do seu funcionamento psicológico.
                    </p>
                    <button 
                      onClick={handleGenerateAnalysis}
                      disabled={loadingAi}
                      className="w-full py-4 bg-white text-indigo-950 rounded-xl font-bold hover:bg-indigo-50 transition-all shadow-lg hover:shadow-white/20 hover:-translate-y-1 disabled:opacity-70 disabled:translate-y-0 flex items-center justify-center gap-2"
                    >
                      {loadingAi ? (
                        <>
                          <div className="w-5 h-5 border-2 border-indigo-900 border-t-transparent rounded-full animate-spin"></div>
                          Processando Diagnóstico...
                        </>
                      ) : (
                        <>Ativar Análise Premium <Sparkles className="w-4 h-4" /></>
                      )}
                    </button>
                  </div>
                ) : (
                  <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 h-[400px] overflow-y-auto custom-scrollbar border border-white/5">
                    <div className="prose prose-invert prose-sm max-w-none text-slate-100 whitespace-pre-line leading-relaxed italic">
                      {aiAnalysis}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
             <div className="bg-white p-6 rounded-[2rem] shadow-lg border border-slate-100">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-bold text-slate-700">Métricas de Performance</h4>
                  <div className="flex gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                    <span className="w-3 h-3 rounded-full bg-rose-500"></span>
                  </div>
                </div>
                <div className="flex gap-4 text-center">
                    <div className="flex-1 bg-emerald-50 rounded-xl p-4 border border-emerald-100">
                        <div className="text-3xl font-extrabold text-emerald-700">{highScores.length}</div>
                        <div className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mt-1">Traços Fortes</div>
                    </div>
                    <div className="flex-1 bg-rose-50 rounded-xl p-4 border border-rose-100">
                        <div className="text-3xl font-extrabold text-rose-700">{lowScores.length}</div>
                        <div className="text-[10px] font-bold text-rose-600 uppercase tracking-widest mt-1">Pontos de Atenção</div>
                    </div>
                </div>
             </div>
          </div>
        </div>

        {/* Dimension Details List (Compact) */}
        <div className="bg-white rounded-[2rem] p-8 mb-12 shadow-xl border border-slate-100">
          <h3 className="text-xl font-bold text-slate-800 mb-8 border-b border-slate-100 pb-4">Detalhamento das Dimensões</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
            {results.map(dim => (
              <div key={dim.dimensionId} className="group">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-bold text-slate-700 group-hover:text-indigo-600 transition-colors">{dim.dimensionName}</span>
                  <span className={`text-sm font-black ${dim.score >= 70 ? 'text-emerald-600' : dim.score <= 30 ? 'text-rose-600' : 'text-slate-500'}`}>{dim.score}%</span>
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

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-6 pb-20 animate-fade-in">
           <button 
            onClick={handlePrint}
            className="flex items-center justify-center gap-3 px-10 py-4 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-500/30 hover:-translate-y-1 font-bold text-lg group"
          >
            <Printer className="w-6 h-6" />
            Exportar Relatório PDF
            <span className="bg-white/20 px-2 py-0.5 rounded text-xs group-hover:bg-white/30 transition-colors ml-2 uppercase">Premium</span>
          </button>

          <button 
            onClick={onRestart}
            className="flex items-center justify-center gap-3 px-10 py-4 bg-white border-2 border-slate-200 text-slate-500 rounded-2xl hover:border-slate-400 hover:text-slate-700 transition-all font-bold text-lg"
          >
            <RefreshCcw className="w-5 h-5" />
            Novo Diagnóstico
          </button>
        </div>
      </div>

      {/* --- PRINT ONLY LAYOUT (A4 OPTIMIZED) --- */}
      <div className="hidden print:block print:w-full">
        {/* Print Header */}
        <div className="border-b-4 border-indigo-900 pb-6 mb-8">
           <div className="flex justify-between items-start">
              <div className="flex items-center gap-4">
                  <div className="bg-indigo-900 text-white p-3 rounded-lg">
                    <Layers className="w-10 h-10" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">Insight<span className="text-indigo-600">360</span></h1>
                    <p className="text-indigo-700 font-bold text-sm tracking-widest uppercase">Certificado Analítico de Perfil</p>
                  </div>
              </div>
              <div className="text-right">
                 <div className="bg-indigo-50 border border-indigo-200 px-4 py-2 rounded-lg mb-2">
                   <span className="text-[10px] font-bold text-indigo-400 block uppercase">Código de Verificação</span>
                   <span className="text-lg font-black text-indigo-900 font-mono tracking-widest">{testId}</span>
                 </div>
                 <h2 className="text-xl font-bold text-slate-800">{userInfo?.name || 'Participante'}</h2>
              </div>
           </div>
           
           <div className="mt-6 grid grid-cols-3 gap-4 border-t border-slate-100 pt-4">
              <div className="text-[11px] text-slate-500 font-bold uppercase flex items-center gap-2">
                 <Mail className="w-3.5 h-3.5" /> {userInfo?.email}
              </div>
              <div className="text-[11px] text-slate-500 font-bold uppercase flex items-center gap-2">
                 <Phone className="w-3.5 h-3.5" /> {userInfo?.whatsapp}
              </div>
              <div className="text-[11px] text-slate-500 font-bold uppercase flex items-center gap-2 justify-end">
                 <Calendar className="w-3.5 h-3.5" /> {new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
              </div>
           </div>
        </div>

        {/* Print Content Grid */}
        <div className="grid grid-cols-2 gap-10 mb-8">
           <div className="bg-white rounded-xl p-4 border border-slate-200 flex items-center justify-center">
             <div className="w-full h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={results}>
                      <PolarGrid gridType="polygon" stroke="#64748b" strokeWidth={1} />
                      <PolarAngleAxis dataKey="dimensionName" tick={{ fill: '#0f172a', fontSize: 9, fontWeight: 'bold' }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                      <Radar name="Perfil" dataKey="score" stroke="#1e1b4b" strokeWidth={3} fill="#4f46e5" fillOpacity={0.45} />
                    </RadarChart>
                  </ResponsiveContainer>
             </div>
           </div>

           <div>
              <h3 className="text-lg font-black text-slate-900 border-b-2 border-slate-200 pb-2 mb-4 uppercase tracking-tight">Síntese de Diagnóstico</h3>
              <p className="text-xs text-slate-600 mb-6 text-justify leading-relaxed">
                O Inventário Insight360 é um sistema avançado de mapeamento comportamental que analisa 21 dimensões da arquitetura psicológica humana. 
                Os resultados abaixo representam o gradiente de tendências do participante, servindo como base técnica para desenvolvimento de liderança, 
                inteligência emocional e planejamento estratégico de carreira.
              </p>
              
              <div className="bg-indigo-900 p-6 rounded-xl text-white shadow-lg">
                 <h4 className="font-black text-indigo-300 text-xs mb-4 uppercase tracking-widest border-b border-white/10 pb-2">Top Performance (Pontos Fortes)</h4>
                 <div className="space-y-3">
                    {highScores.slice(0, 4).map(h => (
                      <div key={h.dimensionId} className="flex justify-between items-center">
                        <span className="text-sm font-bold uppercase tracking-tight">{h.dimensionName}</span>
                        <div className="flex items-center gap-2">
                           <div className="w-16 h-1.5 bg-white/20 rounded-full overflow-hidden">
                              <div className="h-full bg-indigo-400" style={{ width: `${h.score}%` }} />
                           </div>
                           <span className="font-black text-sm">{h.score.toFixed(0)}%</span>
                        </div>
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>

        {/* Detailed Metrics Table */}
        <div className="mb-10 break-inside-avoid">
           <h3 className="text-base font-black text-slate-900 mb-4 border-l-4 border-indigo-600 pl-3 uppercase">Detalhamento Técnico (21 Dimensões)</h3>
           <div className="grid grid-cols-3 gap-x-10 gap-y-2 border-t border-slate-100 pt-4">
              {results.map(res => (
                <div key={res.dimensionId} className="flex justify-between items-center border-b border-slate-50 py-1.5">
                   <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tight">{res.dimensionName}</span>
                   <span className={`text-[10px] font-black ${res.score >= 70 ? 'text-emerald-700' : res.score <= 30 ? 'text-rose-700' : 'text-indigo-800'}`}>
                     {res.score.toFixed(0)}%
                   </span>
                </div>
              ))}
           </div>
        </div>

        {/* AI Analysis Print */}
        {aiAnalysis && (
          <div className="border-t-4 border-slate-900 pt-6 mt-8 break-inside-avoid">
            <h3 className="text-xl font-black text-indigo-900 mb-6 flex items-center gap-2 uppercase tracking-tighter">
              <Sparkles className="w-6 h-6" /> Conclusão Diagnóstica IA
            </h3>
            <div className="prose prose-sm max-w-none text-justify text-slate-900 whitespace-pre-line columns-2 gap-10 leading-relaxed font-serif italic text-xs">
              {aiAnalysis}
            </div>
          </div>
        )}
        
        <div className="fixed bottom-0 left-0 w-full text-center text-[9px] text-slate-400 p-6 border-t border-slate-100 bg-white">
           Insight360 Diagnostic System • Código {testId} • Relatório Confidencial gerado para {userInfo?.name}.
           <br />A validade técnica deste documento pode ser consultada através do ID alfanumérico em nosso banco de dados.
        </div>
      </div>
    </div>
  );
};
