
import React, { useState, useEffect } from 'react';
import { getAllLeads } from '../services/firebase';
import { Layers, Search, Mail, Phone, Calendar, ArrowLeft, ExternalLink, RefreshCcw, Loader2 } from 'lucide-react';
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
    <div className="min-h-screen bg-slate-50 w-full">
      <header className="bg-slate-900 text-white p-4 md:p-6 sticky top-0 z-50 shadow-xl">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-2">
              <Layers className="w-8 h-8 text-indigo-400" />
              <h1 className="text-xl font-bold tracking-tight uppercase">Central de Leads <span className="text-indigo-400">360</span></h1>
            </div>
          </div>
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Buscar por nome, email ou ID..."
              className="w-full bg-slate-800 border-none text-white rounded-xl py-2.5 pl-10 pr-4 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button onClick={fetchLeads} className="p-2 hover:bg-white/10 rounded-lg transition-all active:rotate-180">
            <RefreshCcw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 md:p-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
            <span className="font-bold text-xs uppercase tracking-widest">Carregando Banco de Dados...</span>
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
            <p className="text-slate-500">Nenhum registro encontrado.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
            {filteredLeads.map((lead) => (
              <div key={lead.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all group flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-[10px] font-black bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded uppercase mb-1 inline-block">ID: {lead.testId}</span>
                    <h3 className="text-lg font-bold text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors">{lead.name}</h3>
                  </div>
                  <button 
                    onClick={() => onViewLead(
                      { name: lead.name, email: lead.email, whatsapp: lead.whatsapp },
                      lead.results.map((r: any) => ({ dimensionId: r.id, dimensionName: r.name, score: r.score, description: '' })),
                      lead.testId
                    )}
                    className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                  >
                    <ExternalLink className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Mail className="w-3.5 h-3.5" /> {lead.email}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Phone className="w-3.5 h-3.5" /> {lead.whatsapp}
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 uppercase font-bold tracking-tight">
                    <Calendar className="w-3.5 h-3.5" /> {lead.createdAt?.toDate ? lead.createdAt.toDate().toLocaleString() : lead.completedAt}
                  </div>
                </div>

                <div className="mt-auto pt-4 border-t border-slate-50 grid grid-cols-3 gap-2">
                   {lead.results?.slice(0, 3).map((r: any) => (
                     <div key={r.id} className="text-center">
                        <div className="text-[10px] font-black text-indigo-600">{r.score}%</div>
                        <div className="text-[8px] text-slate-400 uppercase truncate" title={r.name}>{r.name}</div>
                     </div>
                   ))}
                   {lead.results?.length > 3 && (
                     <div className="col-span-3 text-center text-[8px] text-slate-300 font-bold uppercase mt-1">
                       + {lead.results.length - 3} dimensões mapeadas
                     </div>
                   )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
