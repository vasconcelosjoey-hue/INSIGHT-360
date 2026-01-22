
import React, { useState } from 'react';
import { Layers, ArrowRight, Mail, Phone, User, Sparkles, Shield, X, Lock, Users, UserCircle } from 'lucide-react';
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

  const setTestType = (type: 'individual' | 'corporate') => {
    setFormData({ ...formData, testType: type });
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
      
      {/* Visual Background */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className={`absolute inset-0 transition-all duration-700 ${isCorporate ? 'bg-orange-600/5' : 'bg-indigo-600/5'}`} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-[120px] animate-pulse" />
      </div>

      {/* RIGHT: Logo/Brand (Smaller and more centered) */}
      <div className="flex-1 flex flex-col items-center lg:items-end justify-center p-6 lg:pr-24 z-10 text-center lg:text-right">
        <div className="relative mb-4 lg:mb-8 group">
          <div className={`absolute -inset-10 blur-3xl rounded-full opacity-20 transition-all ${isCorporate ? 'bg-orange-500' : 'bg-indigo-500'}`} />
          <Layers className="w-20 h-20 lg:w-32 lg:h-32 text-white relative z-10 drop-shadow-2xl" />
        </div>
        <div className="space-y-2 lg:space-y-4">
          <h1 className="text-4xl lg:text-7xl font-black text-white tracking-tighter leading-none">
            Insight<span className={isCorporate ? 'text-orange-500' : 'text-indigo-500'}>360</span>
          </h1>
          <p className="text-white/40 text-[10px] lg:text-xl font-light uppercase tracking-[0.4em]">
            Inteligência <br className="hidden lg:block" /> Comportamental
          </p>
        </div>
      </div>

      {/* LEFT: Access Form (Optimized height for no scroll) */}
      <div className="flex-1 flex items-center justify-center p-4 lg:p-12 z-10">
        <div className="w-full max-w-md bg-white/5 backdrop-blur-2xl border border-white/10 p-6 lg:p-10 rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden max-h-[95vh]">
          
          <div className="mb-6">
            <h2 className="text-2xl lg:text-3xl font-bold text-white mb-1">Acesso</h2>
            <p className="text-slate-400 text-xs font-light">Selecione o diagnóstico e identifique-se.</p>
          </div>

          {/* Test Type Toggle */}
          <div className="grid grid-cols-2 gap-2 mb-6 p-1 bg-black/40 rounded-2xl border border-white/5">
            <button 
              onClick={() => setTestType('individual')}
              className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all gap-1 ${!isCorporate ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <UserCircle className="w-5 h-5" />
              <span className="text-[10px] font-black uppercase tracking-widest">Individual</span>
            </button>
            <button 
              onClick={() => setTestType('corporate')}
              className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all gap-1 ${isCorporate ? 'bg-orange-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <Users className="w-5 h-5" />
              <span className="text-[10px] font-black uppercase tracking-widest">Corporativo</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${isCorporate ? 'text-orange-400' : 'text-indigo-400'}`}>Nome Completo</label>
              <div className="relative group">
                <User className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${isCorporate ? 'text-orange-500' : 'text-indigo-500'}`} />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Seu nome"
                  required
                  className="w-full bg-black/40 border border-white/10 text-white rounded-xl py-3.5 pl-11 pr-4 focus:ring-1 focus:ring-white/20 outline-none transition-all text-sm"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${isCorporate ? 'text-orange-400' : 'text-indigo-400'}`}>WhatsApp</label>
              <div className="relative group">
                <Phone className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${isCorporate ? 'text-orange-500' : 'text-indigo-500'}`} />
                <input
                  type="tel"
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleChange}
                  placeholder="(00) 00000-0000"
                  required
                  className="w-full bg-black/40 border border-white/10 text-white rounded-xl py-3.5 pl-11 pr-4 focus:ring-1 focus:ring-white/20 outline-none transition-all text-sm"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${isCorporate ? 'text-orange-400' : 'text-indigo-400'}`}>E-mail (opcional)</label>
              <div className="relative group">
                <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${isCorporate ? 'text-orange-500' : 'text-indigo-500'}`} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="seu@email.com"
                  className="w-full bg-black/40 border border-white/10 text-white rounded-xl py-3.5 pl-11 pr-4 focus:ring-1 focus:ring-white/20 outline-none transition-all text-sm"
                />
              </div>
            </div>

            {error && <p className="text-rose-400 text-[10px] font-bold text-center bg-rose-500/10 p-2 rounded-lg">{error}</p>}

            <button
              type="submit"
              className={`w-full h-14 text-white font-black rounded-xl shadow-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] group uppercase tracking-widest text-xs mt-4 ${isCorporate ? 'bg-orange-600 hover:bg-orange-500 shadow-orange-900/20' : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-900/20'}`}
            >
              Iniciar {isCorporate ? 'VitalPulse' : 'Individual 360'}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/5 flex justify-between items-center">
            <button 
              onClick={() => setIsLoginOpen(true)}
              className="flex items-center gap-2 text-[10px] font-black text-white hover:text-indigo-300 transition-all uppercase tracking-widest group"
            >
              <Shield className="w-3.5 h-3.5 group-hover:text-indigo-400 transition-colors" /> ADM
            </button>
            <div className="flex flex-col items-end opacity-50">
               <span className="text-[7px] font-bold text-slate-500 uppercase tracking-widest">JOI.A. Platform</span>
            </div>
          </div>
        </div>
      </div>

      {/* ADMIN LOGIN POPUP */}
      {isLoginOpen && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-6 bg-slate-950/95 backdrop-blur-2xl">
          <div className="w-full max-w-sm bg-slate-900 border border-white/10 rounded-[2.5rem] p-10 relative">
            <button onClick={() => setIsLoginOpen(false)} className="absolute top-6 right-6 p-2 text-slate-500 hover:text-white"><X className="w-6 h-6" /></button>
            <div className="flex flex-col items-center mb-8">
              <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-4 border border-indigo-500/20"><Lock className="w-8 h-8 text-indigo-400" /></div>
              <h3 className="text-xl font-bold text-white">Gestão Insight360</h3>
            </div>
            <form onSubmit={handleAdmSubmit} className="space-y-3">
              <input type="text" placeholder="Usuário" value={admUser} onChange={(e) => setAdmUser(e.target.value)} className="w-full h-12 bg-black/40 border border-white/10 text-white rounded-lg px-4 outline-none text-sm" />
              <input type="password" placeholder="Senha" value={admPass} onChange={(e) => setAdmPass(e.target.value)} className="w-full h-12 bg-black/40 border border-white/10 text-white rounded-lg px-4 outline-none text-sm" />
              {loginError && <p className="text-rose-500 text-[10px] font-black text-center uppercase">{loginError}</p>}
              <button type="submit" className="w-full h-14 bg-white text-black font-black rounded-lg uppercase tracking-widest text-xs mt-4 shadow-xl active:scale-95">Entrar</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
