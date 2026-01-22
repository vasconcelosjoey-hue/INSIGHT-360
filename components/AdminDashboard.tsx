
import React, { useState, useEffect } from 'react';
import { getAllLeads } from '../services/firebase';
import { Layers, Search, Mail, Phone, Calendar, ArrowLeft, ExternalLink, RefreshCcw, Loader2, FileText, UserCheck } from 'lucide-react';
import { ProcessedResult, UserInfo } from '../types';

interface AdminDashboardProps {
  onBack: () => void;
  onViewLead: (userInfo: UserInfo, results: any[], testId: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBack, onViewLead }) => {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchLeads = async () => {
    setLoading(true);
    const data = await getAllLeads();
    setLeads(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const filteredLeads = leads.filter(l => 
    l.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.testId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 w-full font-sans">
      <header className="bg-slate-900 border-b border-white/5 p-6 md:px-12 sticky top-0 z-50 shadow-2xl backdrop-blur-xl bg-opacity-80">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-all border border-white/5">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3">
              <Layers className="w-10 h-10 text-indigo-500" />
              <div>
                <h1 className="text-xl font-black uppercase tracking-widest text-white leading-none">Insight<span className="text-indigo-500">360</span></h1>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] mt-1">Gestão de Dados</p>
              </div>
            </div>
          </div>
          
          <div className="relative w-full md:w-[400px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="Buscar entrevistado, e-mail ou protocolo..."
              className="w-full bg-black/40 border border-white/5 text-white rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-indigo-500 outline-none text-sm placeholder:text-slate-600 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <button onClick={fetchLeads} className="p-4 bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 rounded-2xl transition-all border border-indigo-500/20 group">
            <RefreshCcw className={`w-5 h-5 ${loading ? 'animate-spin' : 'group-active:rotate-180 transition-transform'}`} />
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 md:p-12">
        <div className="mb-8 flex justify-between items-end">
          <div>
             <h2 className="text-3xl font-bold text-white mb-1">Entrevistados</h2>
             <p className="text-slate-500 text-sm">Visualize e exporte diagnósticos comportamentais realizados.</p>
          </div>
          <div className="text-right">
            <span className="text-4xl font-black text-indigo-500">{filteredLeads.length}</span>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Total de Registros</p>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-6">
            <Loader2 className="w-12 h-12 animate-spin text-indigo-500" />
            <span className="font-black text-xs uppercase tracking-[0.5em] text-slate-600">Sincronizando Banco de Dados</span>
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className="text-center py-20 bg-white/5 rounded-[3rem] border border-white/5">
            <FileText className="w-16 h-16 text-slate-800 mx-auto mb-4" />
            <p className="text-slate-500 font-bold uppercase tracking-widest">Nenhum entrevistado encontrado.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLeads.map((lead) => (
              <div key={lead.id} className="bg-slate-900 border border-white/5 rounded-[2.5rem] p-8 hover:bg-slate-800/80 transition-all group flex flex-col relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/5 blur-[40px] rounded-full pointer-events-none" />
                
                <div className="flex justify-between items-start mb-6">
                  <div className="p-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/20">
                    <UserCheck className="w-6 h-6 text-indigo-400" />
                  </div>
                  <button 
                    onClick={() => onViewLead(
                      { name: lead.name, email: lead.email, whatsapp: lead.whatsapp },
                      lead.results.map((r: any) => ({ dimensionId: r.id, dimensionName: r.name, score: r.score, description: '' })),
                      lead.testId
                    )}
                    className="p-3 bg-white hover:bg-indigo-50 text-slate-900 rounded-2xl transition-all shadow-xl active:scale-95 flex items-center gap-2 text-xs font-black uppercase tracking-widest"
                  >
                    Abrir <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-bold text-white leading-tight mb-1 group-hover:text-indigo-400 transition-colors truncate" title={lead.name}>{lead.name}</h3>
                  <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                    <span className="text-indigo-500">#</span> {lead.testId}
                  </div>
                </div>

                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-3 text-[11px] text-slate-400">
                    <div className="w-8 h-8 rounded-lg bg-black/40 flex items-center justify-center text-slate-600">
                      <Mail className="w-3.5 h-3.5" />
                    </div>
                    {lead.email || 'Não informado'}
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-slate-400">
                    <div className="w-8 h-8 rounded-lg bg-black/40 flex items-center justify-center text-slate-600">
                      <Phone className="w-3.5 h-3.5" />
                    </div>
                    {lead.whatsapp}
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-slate-400">
                    <div className="w-8 h-8 rounded-lg bg-black/40 flex items-center justify-center text-slate-600">
                      <Calendar className="w-3.5 h-3.5" />
                    </div>
                    {lead.createdAt?.toDate ? lead.createdAt.toDate().toLocaleString('pt-BR') : lead.completedAt ? new Date(lead.completedAt).toLocaleString('pt-BR') : 'Data desconhecida'}
                  </div>
                </div>

                <div className="mt-auto pt-6 border-t border-white/5">
                   <div className="flex items-center justify-between mb-2">
                     <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Questionário Respondido</span>
                     <span className="text-[10px] font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded uppercase">Multidimensional 360</span>
                   </div>
                   <div className="grid grid-cols-4 gap-2">
                     {lead.results?.slice(0, 4).map((r: any) => (
                        <div key={r.id} className="text-center p-2 bg-black/20 rounded-xl border border-white/5">
                           <div className="text-[10px] font-black text-white leading-none mb-1">{r.score}%</div>
                           <div className="text-[7px] text-slate-500 uppercase truncate" title={r.name}>{r.name}</div>
                        </div>
                     ))}
                   </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="p-12 text-center text-[10px] font-bold text-slate-700 uppercase tracking-[0.5em] border-t border-white/5">
         Security Protocol Enabled • Insight360 Cloud Platform
      </footer>
    </div>
  );
};
