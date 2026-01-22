
import React, { useState } from 'react';
import { Layers, ArrowRight, Mail, Phone, User, Sparkles, Shield, X, Lock } from 'lucide-react';
import { UserInfo } from '../types';

interface LeadCaptureProps {
  onComplete: (info: UserInfo) => void;
  onAdminLogin: () => void;
}

export const LeadCapture: React.FC<LeadCaptureProps> = ({ onComplete, onAdminLogin }) => {
  const [formData, setFormData] = useState<UserInfo>({
    name: '',
    email: '',
    whatsapp: ''
  });
  const [error, setError] = useState('');
  
  // Login ADM states
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [admUser, setAdmUser] = useState('');
  const [admPass, setAdmPass] = useState('');
  const [loginError, setLoginError] = useState('');

  const formatWhatsApp = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      return numbers
        .replace(/^(\d{2})(\d)/g, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2')
        .substring(0, 15);
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
      setError('Por favor, preencha seu nome e whatsapp para continuar.');
      return;
    }
    onComplete(formData);
  };

  const handleAdmSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Credenciais atualizadas conforme solicitação
    if (admUser === 'cafe360' && admPass === '360cafe') {
      onAdminLogin();
      setIsLoginOpen(false);
    } else {
      setLoginError('Credenciais inválidas.');
    }
  };

  return (
    <div className="h-screen w-full flex flex-col lg:flex-row-reverse bg-[#0f172a] overflow-hidden relative">
      
      {/* Elementos Tecnológicos Animados (Fundo) */}
      <div className="absolute inset-0 pointer-events-none z-0 flex items-center justify-center">
        <div className="relative w-[70vw] h-[70vw] max-w-[700px] max-h-[700px] opacity-25">
          <div className="absolute inset-0 border-[1.5px] border-indigo-500/30 rounded-full animate-spin-slow" />
          <div className="absolute inset-16 border-[1px] border-violet-500/20 rounded-full animate-spin-slow-reverse" />
          <div className="absolute inset-32 border-t-2 border-indigo-400/40 rounded-full animate-spin-slow" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-5 h-5 bg-indigo-500 rounded-full shadow-[0_0_25px_rgba(99,102,241,1)]" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-violet-400 rounded-full shadow-[0_0_20px_rgba(167,139,250,1)]" />
          <div className="absolute inset-[40%] bg-indigo-600/15 rounded-full blur-3xl animate-pulse" />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,24,45,0)_0%,rgba(18,24,45,1)_100%),linear-gradient(90deg,rgba(99,102,241,0.04)_1px,transparent_1px),linear-gradient(rgba(99,102,241,0.04)_1px,transparent_1px)] bg-[size:100%_100%,70px_70px,70px_70px]" />
      </div>

      {/* SEÇÃO DIREITA: LOGO (Brand) */}
      <div className="flex-1 flex flex-col items-center lg:items-end justify-center p-6 lg:p-20 z-10 text-center lg:text-right">
        <div className="relative mb-6 lg:mb-12 group">
          <div className="absolute -inset-10 bg-indigo-600/30 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          <div className="relative flex items-center justify-center">
            <Layers className="w-24 h-24 lg:w-48 lg:h-48 text-white drop-shadow-[0_0_35px_rgba(99,102,241,0.9)]" />
            <div className="absolute inset-0 border-2 border-white/20 rounded-full scale-150 animate-ping opacity-10" />
          </div>
        </div>
        <div className="space-y-3 lg:space-y-6">
          <h1 className="text-6xl lg:text-[10rem] font-black text-white tracking-tighter leading-none select-none">
            Insight<span className="text-indigo-500">360</span>
          </h1>
          <p className="text-indigo-200/40 text-sm lg:text-3xl font-light uppercase tracking-[0.5em] max-w-xl leading-relaxed">
            Plataforma de Inteligência <br /> Comportamental
          </p>
          <div className="h-1.5 w-40 bg-indigo-600 rounded-full mt-6 hidden lg:block shadow-[0_0_20px_rgba(79,70,229,0.6)] ml-auto" />
        </div>
      </div>

      {/* SEÇÃO ESQUERDA: CADASTRO (Acesso) */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-16 z-10">
        <div className="w-full max-w-md bg-slate-900/60 backdrop-blur-3xl border border-white/10 p-8 lg:p-12 rounded-[3rem] shadow-2xl relative flex flex-col max-h-[90vh]">
          
          <div className="absolute top-0 right-0 p-8">
             <Sparkles className="w-6 h-6 text-indigo-400 opacity-40 animate-pulse" />
          </div>

          <div className="mb-8 lg:mb-10 flex-shrink-0">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-2">Acesso</h2>
            <p className="text-slate-400 text-sm font-light">Identifique-se para gerar seu diagnóstico.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 lg:space-y-7 overflow-y-auto custom-scrollbar pr-1">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] ml-1">Entrevistado</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-500 group-focus-within:text-white transition-colors" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Seu nome completo"
                  required
                  className="w-full bg-black/50 border border-white/10 text-white rounded-2xl py-4 lg:py-5 pl-12 pr-4 focus:ring-2 focus:ring-indigo-500/40 outline-none transition-all placeholder:text-slate-300 text-sm lg:text-base font-medium"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] ml-1">WhatsApp</label>
              <div className="relative group">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-500 group-focus-within:text-white transition-colors" />
                <input
                  type="tel"
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleChange}
                  placeholder="(00) 00000-0000"
                  required
                  className="w-full bg-black/50 border border-white/10 text-white rounded-2xl py-4 lg:py-5 pl-12 pr-4 focus:ring-2 focus:ring-indigo-500/40 outline-none transition-all placeholder:text-slate-300 text-sm lg:text-base font-medium"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] ml-1">E-mail</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-500 group-focus-within:text-white transition-colors" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="seu@email.com (opcional)"
                  className="w-full bg-black/50 border border-white/10 text-white rounded-2xl py-4 lg:py-5 pl-12 pr-4 focus:ring-2 focus:ring-indigo-500/40 outline-none transition-all placeholder:text-slate-300 text-sm lg:text-base font-medium"
                />
              </div>
            </div>

            {error && (
              <div className="bg-rose-500/15 border border-rose-500/30 text-rose-300 text-[11px] p-4 rounded-xl font-bold flex items-center gap-3 animate-fade-in">
                <div className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-ping" />
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full h-14 lg:h-20 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl lg:rounded-[1.5rem] shadow-2xl shadow-indigo-900/40 flex items-center justify-center gap-3 transition-all active:scale-[0.98] group uppercase tracking-widest"
            >
              Iniciar Diagnóstico
              <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-white/10 flex justify-between items-center flex-shrink-0">
            <button 
              onClick={() => setIsLoginOpen(true)}
              className="flex items-center gap-2 text-xs lg:text-sm font-black text-white hover:text-indigo-300 transition-all uppercase tracking-[0.3em] group"
            >
              <Shield className="w-4 h-4 lg:w-5 lg:h-5 text-white group-hover:text-indigo-400 transition-colors" /> Área ADM
            </button>
            <div className="flex flex-col items-end">
               <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest leading-none">powered by</span>
               <span className="text-[12px] font-black text-indigo-400 uppercase tracking-tighter">JOI.A. Platform</span>
            </div>
          </div>
        </div>
      </div>

      {/* POPUP DE LOGIN ADMINISTRATIVO */}
      {isLoginOpen && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-6 bg-slate-950/95 backdrop-blur-2xl animate-fade-in">
          <div className="w-full max-w-sm bg-slate-900 border border-white/10 rounded-[3rem] p-10 relative shadow-[0_0_80px_rgba(0,0,0,0.8)] animate-fade-in-up">
            <button 
              onClick={() => setIsLoginOpen(false)}
              className="absolute top-8 right-8 p-2 text-slate-500 hover:text-white transition-colors"
            >
              <X className="w-7 h-7" />
            </button>
            
            <div className="flex flex-col items-center mb-10">
              <div className="w-20 h-20 bg-indigo-500/15 rounded-3xl flex items-center justify-center mb-6 border border-indigo-500/30 shadow-[0_0_30px_rgba(99,102,241,0.2)]">
                <Lock className="w-10 h-10 text-indigo-400" />
              </div>
              <h3 className="text-2xl font-bold text-white tracking-tight">Autenticação</h3>
              <p className="text-slate-500 text-[10px] mt-1 uppercase tracking-widest font-black">Módulo de Gestão</p>
            </div>

            <form onSubmit={handleAdmSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Usuário"
                autoFocus
                value={admUser}
                onChange={(e) => setAdmUser(e.target.value)}
                className="w-full h-14 bg-black/60 border border-white/10 text-white rounded-xl px-5 outline-none focus:ring-1 focus:ring-indigo-500 transition-all text-sm font-medium"
              />
              <input
                type="password"
                placeholder="Senha"
                value={admPass}
                onChange={(e) => setAdmPass(e.target.value)}
                className="w-full h-14 bg-black/60 border border-white/10 text-white rounded-xl px-5 outline-none focus:ring-1 focus:ring-indigo-500 transition-all text-sm font-medium"
              />
              
              {loginError && (
                <p className="text-rose-500 text-[11px] font-black text-center uppercase tracking-widest mt-2">{loginError}</p>
              )}
              
              <button 
                type="submit"
                className="w-full h-16 bg-white text-black font-black rounded-2xl hover:bg-indigo-50 transition-all uppercase tracking-[0.3em] text-xs mt-6 shadow-2xl active:scale-95"
              >
                Entrar no Painel
              </button>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .animate-spin-slow { animation: spin 30s linear infinite; }
        .animate-spin-slow-reverse { animation: spin 35s linear infinite reverse; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #4f46e5; border-radius: 10px; }
        ::placeholder { color: #cbd5e1 !important; opacity: 0.8 !important; }
      `}</style>
    </div>
  );
};
