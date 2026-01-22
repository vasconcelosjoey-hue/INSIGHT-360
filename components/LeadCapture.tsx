
import React, { useState } from 'react';
import { Layers, ArrowRight, Mail, Phone, User, Sparkles, Shield, X, Lock, Users, UserCircle, Building2, Briefcase } from 'lucide-react';
import { UserInfo } from '../types';

interface LeadCaptureProps {
  onComplete: (info: UserInfo) => void;
  onAdminLogin: () => void;
}

export const LeadCapture: React.FC<LeadCaptureProps> = ({ onComplete, onAdminLogin }) => {
  const [formData, setFormData] = useState<UserInfo>({
    name: '',
    email: '',
    whatsapp: '',
    testType: 'individual'
  });
  const [error, setError] = useState('');
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [admUser, setAdmUser] = useState('');
  const [admPass, setAdmPass] = useState('');
  const [loginError, setLoginError] = useState('');

  const formatWhatsApp = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      return numbers.replace(/^(\d{2})(\d)/g, '($1) $2').replace(/(\d{5})(\d)/, '$1-$2').substring(0, 15);
    }
    return value.substring(0, 15);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let { name, value } = e.target;
    if (name === 'whatsapp') value = formatWhatsApp(value);
    setFormData({ ...formData, [name]: value });
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.whatsapp.trim()) {
      setError('Por favor, preencha os campos obrigatórios.');
      return;
    }
    onComplete(formData);
  };

  const handleAdmSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (admUser === 'cafe360' && admPass === '360cafe') {
      onAdminLogin();
      setIsLoginOpen(false);
    } else {
      setLoginError('Credenciais inválidas.');
    }
  };

  const isCorporate = formData.testType === 'corporate';

  return (
    <div className="h-screen w-full flex flex-col lg:flex-row-reverse bg-[#070b14] overflow-hidden relative">
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className={`absolute inset-0 transition-all duration-700 ${isCorporate ? 'bg-orange-600/10' : 'bg-indigo-600/5'}`} />
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[120px] animate-pulse ${isCorporate ? 'bg-orange-500/10' : 'bg-white/5'}`} />
      </div>

      <div className="flex-1 flex flex-col items-center lg:items-end justify-center p-6 lg:pr-24 z-10 text-center lg:text-right">
        <div className="relative mb-4 group">
          <div className={`absolute -inset-10 blur-3xl rounded-full opacity-20 transition-all ${isCorporate ? 'bg-orange-500' : 'bg-indigo-500'}`} />
          <Layers className={`w-16 h-16 lg:w-28 lg:h-28 text-white relative z-10 transition-all ${isCorporate ? 'text-orange-400' : 'text-white'}`} />
        </div>
        <div className="space-y-1">
          <h1 className="text-3xl lg:text-6xl font-black text-white tracking-tighter leading-none">Insight<span className={isCorporate ? 'text-orange-500' : 'text-indigo-500'}>360</span></h1>
          <p className="text-white/40 text-[9px] lg:text-lg font-light uppercase tracking-[0.4em]">Inteligência Comportamental</p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-4 lg:p-8 z-10">
        <div className="w-full max-w-md bg-white/5 backdrop-blur-2xl border border-white/10 p-8 rounded-[2rem] shadow-2xl flex flex-col">
          <h2 className="text-2xl font-bold text-white mb-6">Acesso</h2>
          <div className="grid grid-cols-2 gap-2 mb-6 p-1 bg-black/40 rounded-xl border border-white/5">
            <button onClick={() => setFormData({...formData, testType: 'individual'})} className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all gap-1 ${!isCorporate ? 'bg-indigo-600 text-white' : 'text-slate-500'}`}>
              <UserCircle className="w-4 h-4" /><span className="text-[9px] font-black uppercase tracking-widest">Individual</span>
            </button>
            <button onClick={() => setFormData({...formData, testType: 'corporate'})} className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all gap-1 ${isCorporate ? 'bg-orange-600 text-white' : 'text-slate-500'}`}>
              <Users className="w-4 h-4" /><span className="text-[9px] font-black uppercase tracking-widest">Corporativo</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Seu nome completo" required className="w-full bg-black/40 border border-white/10 text-white rounded-xl py-4 px-5 outline-none text-xs" />
            <input type="tel" name="whatsapp" value={formData.whatsapp} onChange={handleChange} placeholder="WhatsApp (00) 00000-0000" required className="w-full bg-black/40 border border-white/10 text-white rounded-xl py-4 px-5 outline-none text-xs" />
            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="E-mail" className="w-full bg-black/40 border border-white/10 text-white rounded-xl py-4 px-5 outline-none text-xs" />
            {error && <p className="text-rose-400 text-[9px] font-bold text-center bg-rose-500/10 p-2 rounded-lg">{error}</p>}
            <button type="submit" className={`w-full h-14 text-white font-black rounded-xl shadow-xl flex items-center justify-center gap-2 transition-all uppercase tracking-widest text-[10px] ${isCorporate ? 'bg-orange-600' : 'bg-indigo-600'}`}>Prosseguir <ArrowRight className="w-4 h-4" /></button>
          </form>
          <div className="mt-6 pt-6 border-t border-white/5 flex justify-between items-center opacity-40">
            <button onClick={() => setIsLoginOpen(true)} className="flex items-center gap-2 text-[9px] font-black text-white uppercase tracking-widest"><Lock className="w-3 h-3" /> Gestão ADM</button>
            <span className="text-[7px] font-bold text-slate-600 uppercase tracking-widest">Insight360 • JOI.A.</span>
          </div>
        </div>
      </div>

      {isLoginOpen && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-6 bg-slate-950/95 backdrop-blur-2xl">
          <div className="w-full max-w-sm bg-slate-900 border border-white/10 rounded-[2rem] p-8 relative">
            <button onClick={() => setIsLoginOpen(false)} className="absolute top-6 right-6 p-2 text-slate-500 hover:text-white"><X className="w-5 h-5" /></button>
            <h3 className="text-lg font-bold text-white text-center mb-6">Área Administrativa</h3>
            <form onSubmit={handleAdmSubmit} className="space-y-3">
              <input type="text" placeholder="Usuário" value={admUser} onChange={(e) => setAdmUser(e.target.value)} className="w-full h-12 bg-black/40 border border-white/10 text-white rounded-lg px-4 outline-none text-xs" />
              <input type="password" placeholder="Senha" value={admPass} onChange={(e) => setAdmPass(e.target.value)} className="w-full h-12 bg-black/40 border border-white/10 text-white rounded-lg px-4 outline-none text-xs" />
              {loginError && <p className="text-rose-500 text-[9px] font-black text-center">{loginError}</p>}
              <button type="submit" className="w-full h-12 bg-white text-black font-black rounded-lg uppercase tracking-widest text-[10px]">Entrar</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
