
import React, { useState, useEffect } from 'react';
import { getAllLeads, getAllCompanies, saveCompany, getCompanyAggregate } from '../services/firebase';
import { Layers, Search, Mail, Phone, Calendar, ArrowLeft, ExternalLink, RefreshCcw, Loader2, FileText, Users, UserCircle, Building2, Plus, X, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { ProcessedResult, UserInfo, Company } from '../types';

// Fix: Added missing interface definition for AdminDashboard component props
interface AdminDashboardProps {
  onBack: () => void;
  onViewLead: (userInfo: any, results: ProcessedResult[], testId: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBack, onViewLead }) => {
  const [activeTab, setActiveTab] = useState<'leads' | 'companies'>('leads');
  const [leads, setLeads] = useState<any[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [saving, setSaving] = useState(false);
  
  // Modal State
  const [showAddCompany, setShowAddCompany] = useState(false);
  const [newCompany, setNewCompany] = useState({ 
    name: '', 
    cnpj: '', 
    startDay: '', 
    startMonth: '', 
    endDay: '', 
    endMonth: '' 
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [lData, cData] = await Promise.all([getAllLeads(), getAllCompanies()]);
      setLeads(lData);
      setCompanies(cData);
    } catch (e) {
      console.error("Erro ao carregar dados:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleAddCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    // Formata as datas para YYYY-MM-DD (Ano fixo 2026)
    const formattedStart = `2026-${newCompany.startMonth.padStart(2, '0')}-${newCompany.startDay.padStart(2, '0')}`;
    const formattedEnd = `2026-${newCompany.endMonth.padStart(2, '0')}-${newCompany.endDay.padStart(2, '0')}`;

    try {
      await saveCompany({
        name: newCompany.name.toUpperCase(),
        cnpj: newCompany.cnpj || 'ISENTO',
        startDate: formattedStart,
        endDate: formattedEnd
      });
      
      setNewCompany({ name: '', cnpj: '', startDay: '', startMonth: '', endDay: '', endMonth: '' });
      setShowAddCompany(false);
      await fetchData();
    } catch (error) {
      console.error("Erro ao salvar empresa:", error);
      alert("Houve um erro ao salvar o registro. Verifique a conexão.");
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

  const filteredLeads = leads.filter(l => 
    l.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.companyName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-200 w-full font-sans pb-20">
      <header className="bg-slate-900/50 border-b border-white/5 p-6 sticky top-0 z-50 backdrop-blur-3xl">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5"><ArrowLeft className="w-5 h-5 text-slate-400" /></button>
            <div className="flex items-center gap-3">
              <Layers className="w-8 h-8 text-indigo-500" />
              <h1 className="text-xl font-black uppercase tracking-widest text-white leading-none">Insight<span className="text-indigo-500">360</span></h1>
            </div>
          </div>
          <div className="flex gap-2 bg-black/40 p-1 rounded-xl border border-white/5">
            <button onClick={() => setActiveTab('leads')} className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'leads' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500'}`}>Entrevistados</button>
            <button onClick={() => setActiveTab('companies')} className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'companies' ? 'bg-orange-600 text-white shadow-lg' : 'text-slate-500'}`}>Empresas</button>
          </div>
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
            <div className="relative mb-8 max-w-xl">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input type="text" placeholder="Filtrar por nome ou empresa..." className="w-full bg-black/40 border border-white/10 text-white rounded-2xl py-4 pl-14 pr-4 outline-none text-sm" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredLeads.map((lead) => (
                <div key={lead.id} className="bg-slate-900 border border-white/5 rounded-[2rem] p-8 hover:bg-slate-800 transition-all flex flex-col">
                  <div className="flex justify-between items-start mb-6">
                    <div className={`p-3 rounded-xl ${lead.testType === 'corporate' ? 'bg-orange-500/10' : 'bg-indigo-500/10'}`}>
                      {lead.testType === 'corporate' ? <Building2 className="w-6 h-6 text-orange-400" /> : <UserCircle className="w-6 h-6 text-indigo-400" />}
                    </div>
                    <button onClick={() => onViewLead(lead, lead.results, lead.testId)} className="p-3 bg-white text-slate-900 rounded-xl font-black uppercase tracking-widest text-[9px] shadow-xl flex items-center gap-2">Resultados <ExternalLink className="w-3 h-3" /></button>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1 truncate">{lead.name}</h3>
                  <p className={`text-[10px] font-black uppercase tracking-widest mb-4 ${lead.testType === 'corporate' ? 'text-orange-500' : 'text-indigo-500'}`}>{lead.testType === 'corporate' ? lead.companyName : 'Individual'}</p>
                  <div className="space-y-2 text-[11px] text-slate-400">
                    <div className="flex items-center gap-2"><Mail className="w-3 h-3" /> {lead.email}</div>
                    <div className="flex items-center gap-2"><Phone className="w-3 h-3" /> {lead.whatsapp}</div>
                    <div className="flex items-center gap-2"><Calendar className="w-3 h-3" /> {new Date(lead.completedAt).toLocaleDateString()}</div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="flex justify-between items-end mb-10">
              <h2 className="text-4xl font-black text-white">Empresas <span className="text-orange-500">VitalPulse</span></h2>
              <button onClick={() => setShowAddCompany(true)} className="bg-orange-600 hover:bg-orange-500 text-white px-6 py-3 rounded-xl font-black uppercase tracking-widest text-xs flex items-center gap-2 shadow-xl shadow-orange-900/20"><Plus className="w-4 h-4" /> Cadastrar Empresa</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {companies.map((c) => (
                <div key={c.id} className="bg-slate-900 border border-white/5 rounded-[2rem] p-8">
                  <div className="flex justify-between items-start mb-6">
                    <div className="p-3 bg-orange-500/10 rounded-xl"><Building2 className="w-6 h-6 text-orange-400" /></div>
                    <button onClick={() => handleViewCompanyResults(c)} className="p-3 bg-orange-600 text-white rounded-xl font-black uppercase tracking-widest text-[9px] shadow-xl flex items-center gap-2">Radar Coletivo <CheckCircle2 className="w-3 h-3" /></button>
                  </div>
                  <h3 className="text-xl font-black text-white mb-1">{c.name}</h3>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-6">CNPJ: {c.cnpj}</p>
                  <div className="bg-black/40 rounded-xl p-4 border border-white/5">
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

      {/* Modal Cadastro Empresa */}
      {showAddCompany && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-6 bg-black/95 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md bg-[#0a0f1d] border border-white/10 rounded-[2.5rem] p-10 relative shadow-2xl">
            <button onClick={() => setShowAddCompany(false)} className="absolute top-8 right-8 p-2 text-slate-500 hover:text-white transition-colors"><X className="w-6 h-6" /></button>
            
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-orange-500/10 rounded-xl"><Building2 className="w-6 h-6 text-orange-500" /></div>
              <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Nova Empresa</h3>
            </div>

            <form onSubmit={handleAddCompany} className="space-y-6">
              <div>
                <label className="text-[9px] font-black text-orange-400 uppercase tracking-[0.2em] ml-1 mb-2 block">Nome da Empresa (CAPSLOCK)</label>
                <input 
                  type="text" 
                  required 
                  placeholder="DIGITE O NOME" 
                  className="w-full bg-black/40 border border-white/10 text-white rounded-2xl py-5 px-6 outline-none focus:ring-1 focus:ring-orange-500 transition-all uppercase font-bold text-sm" 
                  value={newCompany.name} 
                  onChange={(e) => setNewCompany({...newCompany, name: e.target.value.toUpperCase()})} 
                />
              </div>

              <div>
                <label className="text-[9px] font-black text-orange-400 uppercase tracking-[0.2em] ml-1 mb-2 block">CNPJ (Opcional)</label>
                <input 
                  type="text" 
                  placeholder="00.000.000/0001-00" 
                  className="w-full bg-black/40 border border-white/10 text-white rounded-2xl py-5 px-6 outline-none text-sm" 
                  value={newCompany.cnpj} 
                  onChange={(e) => setNewCompany({...newCompany, cnpj: e.target.value})} 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-orange-400 uppercase tracking-[0.2em] ml-1 block">Início (Dia/Mês)</label>
                  <div className="flex gap-2">
                    <input type="number" required min="1" max="31" placeholder="Dia" className="w-full bg-black/40 border border-white/10 text-white rounded-xl py-4 px-4 outline-none text-center text-sm" value={newCompany.startDay} onChange={(e) => setNewCompany({...newCompany, startDay: e.target.value})} />
                    <input type="number" required min="1" max="12" placeholder="Mês" className="w-full bg-black/40 border border-white/10 text-white rounded-xl py-4 px-4 outline-none text-center text-sm" value={newCompany.startMonth} onChange={(e) => setNewCompany({...newCompany, startMonth: e.target.value})} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-orange-400 uppercase tracking-[0.2em] ml-1 block">Fim (Dia/Mês)</label>
                  <div className="flex gap-2">
                    <input type="number" required min="1" max="31" placeholder="Dia" className="w-full bg-black/40 border border-white/10 text-white rounded-xl py-4 px-4 outline-none text-center text-sm" value={newCompany.endDay} onChange={(e) => setNewCompany({...newCompany, endDay: e.target.value})} />
                    <input type="number" required min="1" max="12" placeholder="Mês" className="w-full bg-black/40 border border-white/10 text-white rounded-xl py-4 px-4 outline-none text-center text-sm" value={newCompany.endMonth} onChange={(e) => setNewCompany({...newCompany, endMonth: e.target.value})} />
                  </div>
                </div>
              </div>

              <div className="bg-orange-500/5 border border-orange-500/10 p-4 rounded-xl text-center">
                 <p className="text-[8px] font-black text-orange-400 uppercase tracking-widest">Ano Automático: 2026</p>
              </div>

              <button 
                type="submit" 
                disabled={saving}
                className="w-full py-5 bg-orange-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-orange-900/40 hover:bg-orange-500 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {saving ? <Loader2 className="animate-spin w-5 h-5" /> : 'Salvar Registro'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
