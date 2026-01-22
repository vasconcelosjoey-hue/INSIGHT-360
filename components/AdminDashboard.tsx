
import React, { useState, useEffect } from 'react';
import { getAllLeads } from '../services/firebase';
import { Layers, Search, Mail, Phone, Calendar, ArrowLeft, ExternalLink, RefreshCcw, Loader2, FileText, UserCheck, Users, UserCircle } from 'lucide-react';
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
    l.testId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.whatsapp?.includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-200 w-full font-sans">
      <header className="bg-slate-900/50 border-b border-white/5 p-6 sticky top-0 z-50 backdrop-blur-3xl">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5">
              <ArrowLeft className="w-5 h-5 text-slate-400" />
            </button>
            <div className="flex items-center gap-3">
              <Layers className="w-8 h-8 text-indigo-500" />
              <h1 className="text-xl font-black uppercase tracking-widest text-white leading-none">Insight<span className="text-indigo-500">360</span></h1>
            </div>
          </div>
          
          <div className="relative w-full md:w-[450px]">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="Pesquisar por nome, ID ou contato..."
              className="w-full bg-black/40 border border-white/10 text-white rounded-2xl py-4 pl-14 pr-4 focus:ring-2 focus:ring-indigo-500 outline-none text-sm placeholder:text-slate-600 transition-all font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <button onClick={fetchLeads} className="p-4 bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 rounded-xl border border-indigo-500/20">
            <RefreshCcw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 md:p-12">
        <div className="mb-10 flex flex-col md:flex-row justify-between items-end gap-4">
          <div>
             <h2 className="text-4xl font-black text-white mb-2">Painel de Gestão</h2>
             <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">Controle de Leads & Diagnósticos</p>
          </div>
          <div className="bg-white/5 border border-white/10 px-6 py-3 rounded-2xl">
            <span className="text-3xl font-black text-indigo-500 leading-none">{filteredLeads.length}</span>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Registros Filtrados</p>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <Loader2 className="w-12 h-12 animate-spin text-indigo-500" />
            <span className="font-black text-[10px] uppercase tracking-[0.5em] text-slate-600">Sincronizando Leads</span>
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className="text-center py-20 bg-white/5 rounded-[3rem] border border-white/5">
            <FileText className="w-16 h-16 text-slate-800 mx-auto mb-4" />
            <p className="text-slate-500 font-bold uppercase tracking-widest">Nenhum resultado para "{searchTerm}"</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLeads.map((lead) => {
              const isCorporate = lead.testType === 'corporate';
              return (
                <div key={lead.id} className="bg-slate-900 border border-white/5 rounded-[2rem] p-8 hover:bg-slate-800 transition-all group relative overflow-hidden flex flex-col">
                  <div className={`absolute top-0 right-0 w-32 h-32 blur-[50px] rounded-full pointer-events-none ${isCorporate ? 'bg-orange-600/10' : 'bg-indigo-600/10'}`} />
                  
                  <div className="flex justify-between items-start mb-6">
                    <div className={`p-3 rounded-xl border ${isCorporate ? 'bg-orange-500/10 border-orange-500/20' : 'bg-indigo-500/10 border-indigo-500/20'}`}>
                      {isCorporate ? <Users className="w-6 h-6 text-orange-400" /> : <UserCircle className="w-6 h-6 text-indigo-400" />}
                    </div>
                    <button 
                      onClick={() => onViewLead(
                        { name: lead.name, email: lead.email, whatsapp: lead.whatsapp, testType: lead.testType },
                        lead.results.map((r: any) => ({ dimensionId: r.id, dimensionName: r.name, score: r.score, description: '' })),
                        lead.testId
                      )}
                      className="p-3 bg-white text-slate-900 rounded-xl hover:bg-indigo-50 transition-all active:scale-95 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest shadow-xl"
                    >
                      Ver Relatório <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors truncate mb-1">{lead.name}</h3>
                    <div className={`text-[10px] font-black uppercase tracking-widest ${isCorporate ? 'text-orange-500' : 'text-indigo-500'}`}>
                      {isCorporate ? 'VitalPulse Corporativo' : 'Individual 360'}
                    </div>
                  </div>

                  <div className="space-y-3 mb-8 text-[11px] text-slate-400 font-medium">
                    <div className="flex items-center gap-3"><Mail className="w-3.5 h-3.5 opacity-50" /> {lead.email || 'N/A'}</div>
                    <div className="flex items-center gap-3"><Phone className="w-3.5 h-3.5 opacity-50" /> {lead.whatsapp}</div>
                    <div className="flex items-center gap-3"><Calendar className="w-3.5 h-3.5 opacity-50" /> {lead.completedAt ? new Date(lead.completedAt).toLocaleDateString() : 'Desconhecida'}</div>
                  </div>

                  <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                     <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Protocolo</span>
                     <span className="text-[10px] font-mono text-white opacity-40">{lead.testId}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};
