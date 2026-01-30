
import React, { useMemo } from 'react';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer
} from 'recharts';
import { ProcessedResult, UserInfo } from '../types';
import { Brain, Printer, BadgeCheck, ArrowLeft, Building2, Home, Layers } from 'lucide-react';

interface ResultsDashboardProps {
  results: ProcessedResult[];
  userInfo: UserInfo | null;
  testId: string;
  onRestart: () => void;
  onHome: () => void;
  isAdmin?: boolean;
}

export const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ results, userInfo, testId, onRestart, onHome, isAdmin = false }) => {
  const normalizedResults = useMemo(() => {
    if (!results || !Array.isArray(results)) return [];
    return results.map(r => {
      const data = r as any;
      return {
        dimensionId: data.dimensionId || data.id || "dim",
        dimensionName: data.dimensionName || data.name || "Dimensão",
        score: typeof data.score === 'number' ? data.score : 0
      };
    });
  }, [results]);

  const isCorporate = userInfo?.testType === 'corporate';
  const themeColor = isCorporate ? '#ea580c' : '#4f46e5';
  const themeBg = isCorporate ? 'bg-orange-600' : 'bg-indigo-600';
  const themeText = isCorporate ? 'text-orange-600' : 'text-indigo-600';
  const themeBorder = isCorporate ? 'border-orange-100' : 'border-indigo-100';

  return (
    <div className="w-full h-screen bg-slate-100 flex flex-col overflow-hidden print:bg-white print:overflow-visible print:h-auto print:block">
      
      <header className="flex-shrink-0 bg-white border-b border-slate-200 px-6 py-4 z-50 print:hidden shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button onClick={onRestart} className="flex items-center gap-2 text-slate-500 font-bold text-xs hover:text-indigo-600 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Voltar
            </button>
            <div className="h-4 w-px bg-slate-200"></div>
            <button onClick={onHome} className="flex items-center gap-2 text-slate-500 font-bold text-xs hover:text-indigo-600 transition-colors">
              <Home className="w-4 h-4" /> Início
            </button>
          </div>

          <div className="cursor-pointer group" onClick={onHome}>
            <Layers className={`w-8 h-8 ${isCorporate ? 'text-orange-600' : 'text-indigo-600'} group-hover:scale-110 transition-transform`} />
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Protocolo Ativo</span>
              <span className="text-[11px] font-bold text-slate-900">{testId}</span>
            </div>
            <button onClick={() => window.print()} className={`${themeBg} text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 shadow-lg hover:brightness-110 transition-all active:scale-95`}>
              <Printer className="w-4 h-4" /> Imprimir Diagnóstico
            </button>
          </div>
        </div>
      </header>

      <div className="flex-grow overflow-y-auto print:overflow-visible print:block print:h-auto custom-scrollbar">
        <main className="max-w-6xl mx-auto p-4 md:p-8 print:p-0">
          <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl print:shadow-none print:m-0 print:p-0 print:rounded-none print:w-full border border-slate-100 print:border-none min-h-[calc(100vh-160px)] flex flex-col">
            <div className="text-center mb-10 print:pt-4">
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 ${themeBg} text-white print:bg-white print:text-black print:border-2 print:border-black`}>
                {isCorporate ? <Building2 className="w-4 h-4" /> : <BadgeCheck className="w-4 h-4" />}
                <span className="text-[10px] font-black uppercase tracking-widest">
                  {isCorporate ? 'Saúde Organizacional VitalPulse' : 'Laudo Comportamental Insight360'}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-1 tracking-tighter print:text-black">Relatório de Resultados</h1>
              <p className={`text-2xl font-black uppercase tracking-widest ${themeText} print:text-black`}>{userInfo?.name}</p>
              <div className="w-20 h-1 bg-slate-200 mx-auto mt-6 mb-2 print:bg-black"></div>
              <div className="flex justify-center gap-8 text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] print:text-black">
                <span>Protocolo: {testId}</span>
                <span>Data: {new Date().toLocaleDateString('pt-BR')}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start flex-grow">
              <div className={`lg:col-span-7 bg-slate-50 rounded-[2rem] p-6 border ${themeBorder} print:bg-white print:border-2 print:border-black/5`}>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 print:text-black">
                    <Brain className="w-4 h-4" /> Mapeamento Geométrico
                  </h3>
                  <div className="text-[9px] font-black text-slate-300 uppercase">Escala 0-100%</div>
                </div>
                <div className="h-[400px] md:h-[500px] w-full print:h-[550px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={normalizedResults}>
                      <PolarGrid stroke="#000000" strokeOpacity={0.1} />
                      <PolarAngleAxis dataKey="dimensionName" tick={{ fill: '#475569', fontSize: 9, fontWeight: 800 }} />
                      <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                      <Radar isAnimationActive={true} name="Perfil" dataKey="score" stroke={themeColor} strokeWidth={3} fill={themeColor} fillOpacity={0.4} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="lg:col-span-5 flex flex-col h-full">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 print:text-black">
                  Indicadores Analíticos
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2 print:grid-cols-2 print:gap-1">
                  {normalizedResults.map(r => (
                    <div key={r.dimensionId} className="group flex justify-between items-center p-3.5 bg-white border border-slate-100 rounded-xl hover:border-indigo-200 transition-all print:border-black/10 print:p-2.5">
                      <span className="font-bold text-slate-600 text-[10px] uppercase tracking-tight group-hover:text-slate-900 transition-colors print:text-black">
                        {r.dimensionName}
                      </span>
                      <div className="flex items-center gap-3">
                        <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden hidden md:block print:hidden">
                           <div className={`h-full ${themeBg}`} style={{ width: `${r.score}%` }} />
                        </div>
                        <span className={`font-black text-sm tabular-nums ${themeText} print:text-black`}>{r.score}%</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-auto pt-10 text-center opacity-40 print:opacity-100">
                  <p className="text-[8px] font-black uppercase tracking-[0.5em] text-slate-400 print:text-black">
                    Diagnóstico Gerado por Insight360 Engine
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <style>{`
        @media print {
          @page { size: A4 portrait; margin: 1cm; }
          body { background: white !important; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          * { box-shadow: none !important; }
          .bg-white { background: white !important; }
          .print-hidden, header, button { display: none !important; }
          .h-screen { height: auto !important; overflow: visible !important; }
          .recharts-polar-angle-axis-tick text { fill: black !important; font-weight: 800 !important; font-size: 10px !important; }
          .recharts-polar-grid-concentric-path { stroke: black !important; stroke-opacity: 0.1 !important; }
          .recharts-radar-polygon { fill: ${themeColor} !important; fill-opacity: 0.3 !important; stroke: ${themeColor} !important; stroke-width: 4px !important; }
        }
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
      `}</style>
    </div>
  );
};
