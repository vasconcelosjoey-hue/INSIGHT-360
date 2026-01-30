
import React, { useState, useEffect } from 'react';
import { getAllLeads, getAllCompanies, saveCompany, getCompanyAggregate, deleteCompany, deleteLead } from '../services/firebase';
import { Layers, Search, Mail, Phone, Calendar, ArrowLeft, ExternalLink, RefreshCcw, Loader2, Building2, Plus, X, UserCircle, Trash2, Home, Link } from 'lucide-react';
import { ProcessedResult, UserInfo, Company } from '../types';

interface AdminDashboardProps {
  onBack: () => void;
  onHome: () => void;
  onViewLead: (userInfo: any, results: ProcessedResult[], testId: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBack, onHome, onViewLead }) => {
  const [activeTab, setActiveTab] = useState<'leads' | 'companies'>('leads');
  const [leadFilter, setLeadFilter] = useState<'all' | 'individual' | 'corporate'>('all');
  const [leads, setLeads] = useState<any[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorState, setErrorState] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [saving, setSaving] = useState(false);
  
  const [showAddCompany, setShowAddCompany] = useState(false);
  const [newCompany, setNewCompany] = useState({ 
    name: '', 
    cnpj: '', 
    logoUrl: '',
    startDay: '', 
    startMonth: '', 
    endDay: '', 
    endMonth: '' 
  });

  const fetchData = async () => {
    setLoading(true);
    setErrorState(null);
    try {
      const [lData, cData] = await Promise.all([getAllLeads(), getAllCompanies()]);
      setLeads(lData || []);
      setCompanies(cData || []);
    } catch (e: any) {
      console.error("Erro ao carregar dados:", e);
      setErrorState('FETCH_ERROR');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleDeleteLead = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este diagnóstico permanentemente?")) return;
    try {
      await deleteLead(id);
      setLeads(leads.filter(l => l.id !== id));
    } catch (e) {
      alert("Erro ao excluir registro.");
    }
  };

  const handleDeleteCompany = async (id: string) => {
    if (!confirm("Ao excluir a empresa, o link de acesso será invalidado. Continuar?")) return;
    try {
      await deleteCompany(id);
      setCompanies(companies.filter(c => c.id !== id));
    } catch (e) {
      alert("Erro ao excluir empresa.");
    }
  };

  const handleAddCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    const formattedStart = `2026-${newCompany.startMonth.padStart(2, '0')}-${newCompany.startDay.padStart(2, '0')}`;
    const formattedEnd = `2026-${newCompany.endMonth.padStart(2, '0')}-${newCompany.endDay.padStart(2, '0')}`;

    try {
      await saveCompany({
        name: newCompany.name.toUpperCase(),
        cnpj: newCompany.cnpj || 'ISENTO',
        logoUrl: newCompany.logoUrl,
        startDate: formattedStart,
        endDate: formattedEnd
      });
      
      setNewCompany({ name: '', cnpj: '', logoUrl: '', startDay: '', startMonth: '', endDay: '', endMonth: '' });
      setShowAddCompany(false);
      await fetchData();
    } catch (error: any) {
      console.error("Erro ao salvar empresa:", error);
      alert("Houve um problema ao salvar.");
    } finally {
      setSaving(false);
    }
  };

  const handleViewCompanyResults = async (company: Company) => {
    const aggregate = await getCompanyAggregate(company.id);
    if (aggregate) {
      onViewLead(
        { name: `RELATÓRIO COLETIVO: ${company.name}`, companyName: company.name, cnpj: company.cnpj, testType: 'corporate' },
        aggregate,
        `CORP-${company.id.substring(0, 5)}`
      );
    } else {
      alert("Nenhum dado coletado para esta empresa ainda.");
    }
  };

  const filteredLeads = (leads || []).filter(l => {
    const matchesSearch = l.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          l.companyName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = leadFilter === 'all' || l.testType === leadFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-200 w-full font-sans pb-20">
      <header className="bg-slate-900/50 border-b border-white/5 p-6 sticky top-0 z-50 backdrop-blur-3xl">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <button onClick={onBack} title="Voltar" className="p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 transition-colors"><ArrowLeft className="w-5 h-5 text-slate-400" /></button>
            <div className="flex items-center gap-3 cursor-pointer group" onClick={onHome}>
              <div className="bg-indigo-600 p-2 rounded-lg group-hover:scale-110 transition-transform">
                <Layers className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-black uppercase tracking-widest text-white leading-none">Insight<span className="text-indigo-500">360</span></h1>
            </div>
          </div>
          <div className="flex gap-2 bg-black/40 p-1 rounded-xl border border-white/5">
            <button onClick={() => setActiveTab('leads')} className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'leads' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}>Entrevistados</button>
            <button onClick={() => setActiveTab('companies')} className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'companies' ? 'bg-orange-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}>Empresas</button>
          </div>
          <button onClick={onHome} className="hidden md:flex items-center gap-2 text-[9px] font-black text-slate-500 uppercase hover:text-white transition-colors">
            <Home className="w-3 h-3" /> Home
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 md:p-12">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 gap-4">
             <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
             <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Sincronizando Banco de Dados...</p>
          </div>
        ) : activeTab === 'leads' ? (
          <>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6 animate-fade-in">
              <div>
                <h2 className="text-4xl font-black text-white leading-tight">Painel de <span className="text-indigo-500">Leads</span></h2>
                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-2">Gerencie diagnósticos individuais e corporativos</p>
              </div>
              
              <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                <div className="flex bg-black/40 p-1 rounded-xl border border-white/10 w-full md:w-auto">
                  <button onClick={() => setLeadFilter('all')} className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${leadFilter === 'all' ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-slate-400'}`}>Todos</button>
                  <button onClick={() => setLeadFilter('individual')} className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${leadFilter === 'individual' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-slate-400'}`}>Individual</button>
                  <button onClick={() => setLeadFilter('corporate')} className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${leadFilter === 'corporate' ? 'bg-orange-600 text-white' : 'text-slate-500 hover:text-slate-400'}`}>Empresa</button>
                </div>
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input type="text" placeholder="Filtrar por nome..." className="w-full bg-black/40 border border-white/10 text-white rounded-xl py-3 pl-11 pr-4 outline-none text-[10px] transition-all focus:border-indigo-500/50" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
              {filteredLeads.map((lead) => (
                <div key={lead.id} className="bg-slate-900 border border-white/5 rounded-[2rem] p-8 hover:bg-slate-800 transition-all flex flex-col group relative overflow-hidden">
                  <div className="flex justify-between items-start mb-6 relative z-10">
                    <div className={`p-3 rounded-xl ${lead.testType === 'corporate' ? 'bg-orange-500/10 text-orange-400' : 'bg-indigo-500/10 text-indigo-400'}`}>
                      {lead.testType === 'corporate' ? <Building2 className="w-6 h-6" /> : <UserCircle className="w-6 h-6" />}
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleDeleteLead(lead.id)} className="p-3 bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white rounded-xl transition-all" title="Excluir"><Trash2 className="w-4 h-4" /></button>
                      <button onClick={() => onViewLead(lead, lead.results, lead.testId)} className="p-3 bg-white text-slate-900 rounded-xl font-black uppercase tracking-widest text-[9px] shadow-xl flex items-center gap-2 hover:bg-indigo-50 transition-all active:scale-95">Relatório <ExternalLink className="w-3 h-3" /></button>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1 truncate">{lead.name}</h3>
                  <div className="flex items-center gap-2 mb-4">
                    <span className={`text-[8px] font-black uppercase tracking-[0.2em] px-2 py-1 rounded-md ${lead.testType === 'corporate' ? 'bg-orange-500/20 text-orange-400' : 'bg-indigo-500/20 text-indigo-400'}`}>
                      {lead.testType === 'corporate' ? (lead.companyName || 'Empresa') : 'Individual'}
                    </span>
                    <span className="text-[8px] font-bold text-slate-600 uppercase tracking-widest">{lead.testId}</span>
                  </div>
                  <div className="space-y-2 mt-auto text-[11px] text-slate-400">
                    <div className="flex items-center gap-2"><Mail className="w-3 h-3 opacity-50" /> {lead.email || 'N/A'}</div>
                    <div className="flex items-center gap-2"><Phone className="w-3 h-3 opacity-50" /> {lead.whatsapp}</div>
                    <div className="flex items-center gap-2"><Calendar className="w-3 h-3 opacity-50" /> {new Date(lead.completedAt || lead.createdAt?.toDate() || Date.now()).toLocaleDateString()}</div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="flex justify-between items-end mb-10 animate-fade-in">
              <div>
                <h2 className="text-4xl font-black text-white leading-tight">Empresas <span className="text-orange-500">Parceiras</span></h2>
                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-2">Configure os links de acesso corporativo</p>
              </div>
              <button onClick={() => setShowAddCompany(true)} className="bg-orange-600 hover:bg-orange-500 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-2 shadow-xl shadow-orange-900/20 transition-all active:scale-95"><Plus className="w-4 h-4" /> Cadastrar Empresa</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
              {companies.map((c) => (
                <div key={c.id} className="bg-slate-900 border border-white/5 rounded-[2rem] p-8 group hover:bg-slate-800 transition-all relative overflow-hidden">
                  <div className="flex justify-between items-start mb-6 relative z-10">
                    <div className="w-14 h-14 bg-white/5 rounded-xl flex items-center justify-center overflow-hidden border border-white/5">
                      {c.logoUrl ? (
                        <img src={c.logoUrl} alt={c.name} className="w-full h-full object-contain" />
                      ) : (
                        <Building2 className="w-6 h-6 text-orange-400" />
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleDeleteCompany(c.id)} className="p-3 bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white rounded-xl transition-all" title="Excluir"><Trash2 className="w-4 h-4" /></button>
                      <button onClick={() => handleViewCompanyResults(c)} className="p-3 bg-orange-600 text-white rounded-xl font-black uppercase tracking-widest text-[9px] shadow-xl flex items-center gap-2 hover:bg-orange-500 transition-all active:scale-95">Radar Coletivo</button>
                    </div>
                  </div>
                  <h3 className="text-xl font-black text-white mb-1">{c.name}</h3>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-6">CNPJ: {c.cnpj}</p>
                  <div className="bg-black/40 rounded-xl p-4 border border-white/5 group-hover:border-white/10 transition-all">
                    <p className="text-[9px] font-black text-orange-400 uppercase tracking-widest mb-2">Janela de Resposta</p>
                    <div className="flex justify-between items-center text-xs font-mono">
                      <span className="text-white">{new Date(c.startDate).toLocaleDateString()}</span>
                      <span className="text-slate-600">➔</span>
                      <span className="text-white">{new Date(c.endDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>

      {showAddCompany && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-6 bg-black/95 backdrop-blur-md animate-fade-in overflow-y-auto">
          <div className="w-full max-w-md bg-[#0a0f1d] border border-white/10 rounded-[2.5rem] p-10 relative shadow-2xl my-auto">
            <button onClick={() => setShowAddCompany(false)} className="absolute top-8 right-8 p-2 text-slate-500 hover:text-white transition-colors"><X className="w-6 h-6" /></button>
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-orange-500/10 rounded-xl"><Plus className="w-6 h-6 text-orange-500" /></div>
              <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Nova Empresa</h3>
            </div>
            <form onSubmit={handleAddCompany} className="space-y-5">
              <div>
                <label className="text-[9px] font-black text-orange-400 uppercase tracking-[0.2em] ml-1 mb-2 block">Nome da Empresa</label>
                <input type="text" required placeholder="DIGITE O NOME" className="w-full bg-black/40 border border-white/10 text-white rounded-2xl py-4 px-6 outline-none transition-all uppercase font-bold text-sm" value={newCompany.name} onChange={(e) => setNewCompany({...newCompany, name: e.target.value})} />
              </div>
              <div>
                <label className="text-[9px] font-black text-orange-400 uppercase tracking-[0.2em] ml-1 mb-2 block">CNPJ</label>
                <input type="text" placeholder="00.000.000/0001-00" className="w-full bg-black/40 border border-white/10 text-white rounded-2xl py-4 px-6 outline-none text-sm transition-all" value={newCompany.cnpj} onChange={(e) => setNewCompany({...newCompany, cnpj: e.target.value})} />
              </div>
              <div>
                <label className="text-[9px] font-black text-orange-400 uppercase tracking-[0.2em] ml-1 mb-2 block flex items-center gap-1"><Link className="w-3 h-3" /> URL da Logomarca (PNG/JPG)</label>
                <input type="url" placeholder="https://exemplo.com/logo.png" className="w-full bg-black/40 border border-white/10 text-white rounded-2xl py-4 px-6 outline-none text-xs transition-all" value={newCompany.logoUrl} onChange={(e) => setNewCompany({...newCompany, logoUrl: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-orange-400 uppercase tracking-[0.2em] ml-1 block">Início (Dia/Mês)</label>
                  <div className="flex gap-2">
                    <input type="number" required min="1" max="31" placeholder="D" className="w-full bg-black/40 border border-white/10 text-white rounded-xl py-3 px-3 outline-none text-center text-sm" value={newCompany.startDay} onChange={(e) => setNewCompany({...newCompany, startDay: e.target.value})} />
                    <input type="number" required min="1" max="12" placeholder="M" className="w-full bg-black/40 border border-white/10 text-white rounded-xl py-3 px-3 outline-none text-center text-sm" value={newCompany.startMonth} onChange={(e) => setNewCompany({...newCompany, startMonth: e.target.value})} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-orange-400 uppercase tracking-[0.2em] ml-1 block">Fim (Dia/Mês)</label>
                  <div className="flex gap-2">
                    <input type="number" required min="1" max="31" placeholder="D" className="w-full bg-black/40 border border-white/10 text-white rounded-xl py-3 px-3 outline-none text-center text-sm" value={newCompany.endDay} onChange={(e) => setNewCompany({...newCompany, endDay: e.target.value})} />
                    <input type="number" required min="1" max="12" placeholder="M" className="w-full bg-black/40 border border-white/10 text-white rounded-xl py-3 px-3 outline-none text-center text-sm" value={newCompany.endMonth} onChange={(e) => setNewCompany({...newCompany, endMonth: e.target.value})} />
                  </div>
                </div>
              </div>
              <button type="submit" disabled={saving} className="w-full py-5 bg-orange-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl hover:bg-orange-500 transition-all flex items-center justify-center gap-3 disabled:opacity-50 mt-4">
                {saving ? <Loader2 className="animate-spin w-5 h-5" /> : 'Salvar Registro'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
