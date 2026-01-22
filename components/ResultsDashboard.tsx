
import React, { useState, useRef } from 'react';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip
} from 'recharts';
import { ProcessedResult, UserInfo } from '../types';
import { generatePsychologicalAnalysis } from '../services/geminiService';
import { Brain, RefreshCcw, Sparkles, Printer, ShieldCheck, BadgeCheck, ArrowLeft, Send, Loader2, Building2, Layers, MessageSquareText, FileText } from 'lucide-react';

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
  const scrollContainerRef = useRef<HTMLDivElement>(null);

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

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full h-screen bg-slate-50 flex flex-col overflow-hidden">
      
      {/* HEADER FIXO NO TOPO */}
      <header className="flex-shrink-0 bg-white border-b border-slate-200 px-6 py-4 z-50 shadow-sm print:hidden">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <button onClick={onRestart} className="flex items-center gap-2 text-slate-500 font-bold text-xs hover:text-slate-900 transition-all">
            <ArrowLeft className="w-4 h-4" /> Voltar
          </button>
          
          <div className="flex items-center gap-2">
            <Layers className={`w-5 h-5 ${themeText}`} />
            <h2 className="font-black uppercase tracking-tighter text-slate-900 text-sm">Insight360</h2>
          </div>

          <button onClick={handlePrint} className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg hover:bg-black transition-all active:scale-95">
            <Printer className="w-4 h-4" /> Salvar PDF
          </button>
        </div>
      </header>

      {/* ÁREA DE CONTEÚDO COM SCROLL */}
      <div ref={scrollContainerRef} className="flex-grow overflow-y-auto custom-scrollbar print:overflow-visible print:h-auto">
        
        <main className="max-w-7xl mx-auto px-6 py-12 print:p-0">
          
          {/* CABEÇALHO DO RELATÓRIO */}
          <section className="text-center mb-16 animate-fade-in print:mb-8">
            <div className={`inline-flex items-center gap-2 px-5 py-2 rounded-full mb-8 shadow-sm border ${themeBg} border-white/20 print:border-slate-200 print:bg-slate-100 print:text-slate-900`}>
              <BadgeCheck className="w-4 h-4 text-white print:text-slate-900" />
              <span className="text-[10px] font-black text-white uppercase tracking-[0.2em] print:text-slate-900">
                {isCorporate ? 'Relatório de Saúde Organizacional' : 'Laudo Psicométrico Individual'}
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-4 tracking-tighter leading-none">Relatório Insight360</h1>
            <p className={`text-2xl font-black uppercase tracking-tight ${themeText}`}>{userInfo?.name}</p>
            
            {isCorporate && (
              <div className="mt-4">
                <p className="text-slate-500 font-black text-xs uppercase tracking-[0.3em]">Candidato da Empresa: {userInfo?.companyName}</p>
                <p className="text-slate-400 font-bold text-[9px] mt-1">CNPJ: {userInfo?.cnpj || 'ISENTO'}</p>
              </div>
            )}
            <div className="mt-6 flex items-center justify-center gap-4 text-[10px] font-mono text-slate-400 opacity-60">
               <span>PROTOCOLO: {testId}</span>
               <span>•</span>
               <span>EMISSÃO: {new Date().toLocaleDateString('pt-BR')}</span>
            </div>
          </section>

          {/* GRID PRINCIPAL */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* COLUNA ESQUERDA: GRÁFICO E SCORES */}
            <div className="lg:col-span-7 space-y-10">
              
              {/* CARD DO RADAR */}
              <div className="bg-white rounded-[3rem] shadow-xl shadow-slate-200/50 border border-slate-100 p-10 print:shadow-none print:border-slate-200">
                <div className="flex justify-between items-center mb-10">
                  <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight flex items-center gap-3">
                    <Brain className={`w-6 h-6 ${themeText}`} />
                    Mapeamento Geométrico
                  </h3>
                </div>

                <div className="h-[450px] w-full print:h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={results}>
                      <PolarGrid stroke="#f1f5f9" />
                      <PolarAngleAxis dataKey="dimensionName" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 800 }} />
                      <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                      <Radar
                        name="Nível"
                        dataKey="score"
                        stroke={themeColor}
                        strokeWidth={4}
                        fill={themeColor}
                        fillOpacity={0.4}
                      />
                      <Tooltip contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.1)' }} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* CARD DE SCORES */}
              <div className="bg-white rounded-[3rem] shadow-xl shadow-slate-200/50 border border-slate-100 p-10 print:shadow-none print:border-slate-200">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-8">Detalhamento por Dimensão</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {results.map(r => (
                    <div key={r.dimensionId} className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100/50 group hover:bg-white transition-all">
                      <span className="font-bold text-slate-500 text-[10px] uppercase tracking-tight leading-tight max-w-[150px]">{r.dimensionName}</span>
                      <div className="flex items-center gap-3">
                        <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden hidden md:block">
                          <div className={`h-full ${themeBg}`} style={{ width: `${r.score}%` }} />
                        </div>
                        <span className={`font-black text-xl ${themeText}`}>{r.score}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* COLUNA DIREITA: SMARTBOX IA */}
            <div className="lg:col-span-5 print:col-span-12">
              <div className={`rounded-[3rem] shadow-2xl overflow-hidden flex flex-col border-4 print:border-slate-100 print:shadow-none ${isCorporate ? 'border-orange-500/10' : 'border-indigo-500/10'}`}>
                
                {/* CABEÇALHO SMARTBOX */}
                <div className={`${themeBg} p-8 text-white print:bg-slate-100 print:text-slate-900`}>
                  <div className="flex items-center gap-3 mb-2">
                    <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse print:text-slate-900" />
                    <h3 className="text-lg font-black uppercase tracking-widest">Sintetização IA</h3>
                  </div>
                  <p className="text-white/70 text-[9px] font-bold uppercase tracking-[0.2em] print:text-slate-500">Analista Psicométrico Digital</p>
                </div>

                {/* ÁREA DE RESULTADO DA IA */}
                <div className="bg-white p-8 min-h-[400px] print:min-h-0">
                  {loadingAi ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                      <Loader2 className={`w-10 h-10 animate-spin ${themeText}`} />
                      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 animate-pulse">Cruzando Dados...</p>
                    </div>
                  ) : aiAnalysis ? (
                    <div className="animate-fade-in">
                      <div className="flex items-center gap-2 mb-6 opacity-30">
                        <MessageSquareText className="w-4 h-4" />
                        <span className="text-[9px] font-black uppercase tracking-widest">Parecer Técnico Gerado</span>
                      </div>
                      <div className="text-slate-700 text-sm leading-relaxed whitespace-pre-line font-medium text-justify">
                        {aiAnalysis}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center opacity-30">
                      <FileText className="w-12 h-12 mb-4" />
                      <p className="text-xs font-bold uppercase tracking-widest">Solicite uma análise <br/> personalizada abaixo</p>
                    </div>
                  )}
                </div>

                {/* FORMULÁRIO DE INPUT (OCULTO NA IMPRESSÃO) */}
                <div className="p-8 bg-slate-50 border-t border-slate-100 print:hidden">
                  <form onSubmit={handleSmartAiCall} className="relative">
                    <textarea 
                      value={customPrompt}
                      onChange={(e) => setCustomPrompt(e.target.value)}
                      placeholder="Ex: Como lidar com o estresse dessa pessoa? / Crie um plano de ação para esta empresa..."
                      className="w-full bg-white border border-slate-200 rounded-2xl py-5 pl-6 pr-16 text-slate-800 outline-none focus:ring-2 focus:ring-slate-200 transition-all font-medium text-xs resize-none min-h-[120px] shadow-inner"
                    />
                    <button 
                      type="submit" 
                      disabled={loadingAi}
                      className={`absolute right-3 bottom-3 p-4 ${themeBg} text-white rounded-xl shadow-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50`}
                    >
                      {loadingAi ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                    </button>
                  </form>
                  <p className="text-[9px] text-slate-400 font-bold mt-4 text-center uppercase tracking-widest">Esta análise será incluída automaticamente no PDF.</p>
                </div>
              </div>

              {/* RODAPÉ DO DOCUMENTO NO PDF */}
              <div className="hidden print:block mt-12 pt-8 border-t-2 border-slate-100">
                <div className="flex justify-between items-end opacity-40">
                  <div className="text-[8px] font-black uppercase space-y-1">
                    <p>Insight360 Intelligence Platform</p>
                    <p>Autenticação: {testId.split('-')[1] || testId}</p>
                    <p>© 2026 Todos os direitos reservados</p>
                  </div>
                  <div className="text-right">
                    <div className="w-40 h-[1px] bg-slate-900 mb-2 ml-auto" />
                    <p className="text-[8px] font-black uppercase">Assinatura do Responsável Técnico</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* BOTÕES DE AÇÃO INFERIORES */}
          <div className="mt-16 flex flex-col md:flex-row justify-center gap-4 print:hidden">
            <button onClick={handlePrint} className="flex md:hidden items-center justify-center gap-3 w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl">
              <Printer className="w-5 h-5" /> Exportar Relatório
            </button>
            <button onClick={onRestart} className="flex items-center justify-center gap-3 px-12 py-5 bg-white border-2 border-slate-200 text-slate-400 rounded-2xl font-black uppercase tracking-widest text-xs hover:border-slate-300 hover:text-slate-600 transition-all">
              <RefreshCcw className="w-4 h-4" /> Novo Diagnóstico
            </button>
          </div>

        </main>
      </div>

      <style>{`
        @media print {
          @page { size: A4; margin: 1cm; }
          body { background: white !important; }
          .print-hidden { display: none !important; }
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          .h-screen { height: auto !important; }
          .overflow-hidden { overflow: visible !important; }
        }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f8fafc; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
      `}</style>
    </div>
  );
};
