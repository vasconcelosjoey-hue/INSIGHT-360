
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
    if (admUser === 'admin' && admPass === 'dimensao360') {
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
        <div className="relative w-[60vw] h-[60vw] max-w-[600px] max-h-[600px] opacity-20">
          <div className="absolute inset-0 border-[1px] border-indigo-500/40 rounded-full animate-spin-slow" />
          <div className="absolute inset-12 border-[1px] border-violet-500/30 rounded-full animate-spin-slow-reverse" />
          <div className="absolute inset-24 border-t-2 border-indigo-500/50 rounded-full animate-spin-slow" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-indigo-500 rounded-full shadow-[0_0_20px_rgba(99,102,241,1)]" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-violet-400 rounded-full shadow-[0_0_15px_rgba(167,139,250,1)]" />
          <div className="absolute inset-[35%] bg-indigo-600/10 rounded-full blur-2xl animate-pulse" />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,24,45,0)_0%,rgba(18,24,45,1)_100%),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:100%_100%,60px_60px,60px_60px]" />
      </div>

      {/* LADO DIREITO (Mobile: Superior): LOGO E IDENTIDADE */}
      <div className="flex-1 flex flex-col items-center lg:items-end justify-center p-6 lg:p-24 z-10 text-center lg:text-right">
        <div className="relative mb-6 lg:mb-10 group">
          <div className="absolute -inset-6 bg-indigo-600/30 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <div className="relative flex items-center justify-center">
            <Layers className="w-20 h-20 lg:w-40 lg:h-40 text-white drop-shadow-[0_0_25px_rgba(99,102,241,0.8)]" />
            <div className="absolute inset-0 border-2 border-white/10 rounded-full scale-125 animate-ping opacity-20" />
          </div>
        </div>
        <div className="space-y-2 lg:space-y-4">
          <h1 className="text-5xl lg:text-9xl font-black text-white tracking-tighter leading-none">
            Insight<span className="text-indigo-500">360</span>
          </h1>
          <p className="text-indigo-200/50 text-sm lg:text-2xl font-light uppercase tracking-[0.4em] max-w-lg leading-relaxed">
            Plataforma de Inteligência <br /> Comportamental
          </p>
          <div className="h-1 w-32 bg-indigo-600 rounded-full mt-4 lg:mt-6 hidden lg:block shadow-[0_0_15px_rgba(79,70,229,0.5)] ml-auto" />
        </div>
      </div>

      {/* LADO ESQUERDO (Mobile: Inferior): FORMULÁRIO DE CADASTRO */}
      <div className="flex-1 flex items-center justify-center p-4 lg:p-16 z-10 overflow-hidden">
        <div className="w-full max-w-md bg-slate-900/40 backdrop-blur-3xl border border-white/10 p-6 lg:p-10 rounded-[2.5rem] shadow-2xl relative flex flex-col h-auto max-h-full">
          <div className="absolute top-0 right-0 p-6 lg:p-8">
             <Sparkles className="w-5 h-5 text-indigo-400 opacity-30 animate-pulse" />
          </div>

          <div className="mb-6 lg:mb-8 flex-shrink-0">
            <h2 className="text-2xl lg:text-3xl font-bold text-white mb-1">Acesso</h2>
            <p className="text-slate-400 text-xs lg:text-sm font-light">Identifique-se para gerar seu diagnóstico.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-5 overflow-y-auto custom-scrollbar px-1">
            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-indigo-400 uppercase tracking-[0.2em] ml-1">Entrevistado</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 lg:w-5 lg:h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Seu nome completo"
                  required
                  className="w-full bg-black/40 border border-white/5 text-white rounded-xl lg:rounded-2xl py-3 lg:py-4 pl-11 lg:pl-12 pr-4 focus:ring-1 focus:ring-indigo-500/50 outline-none transition-all placeholder:text-slate-700 text-sm"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-indigo-400 uppercase tracking-[0.2em] ml-1">WhatsApp</label>
              <div className="relative group">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 lg:w-5 lg:h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                <input
                  type="tel"
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleChange}
                  placeholder="(00) 00000-0000"
                  required
                  className="w-full bg-black/40 border border-white/5 text-white rounded-xl lg:rounded-2xl py-3 lg:py-4 pl-11 lg:pl-12 pr-4 focus:ring-1 focus:ring-indigo-500/50 outline-none transition-all placeholder:text-slate-700 text-sm"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-indigo-400 uppercase tracking-[0.2em] ml-1">E-mail</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 lg:w-5 lg:h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="seu@email.com (opcional)"
                  className="w-full bg-black/40 border border-white/5 text-white rounded-xl lg:rounded-2xl py-3 lg:py-4 pl-11 lg:pl-12 pr-4 focus:ring-1 focus:ring-indigo-500/50 outline-none transition-all placeholder:text-slate-700 text-sm"
                />
              </div>
            </div>

            {error && (
              <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[10px] p-3 rounded-lg font-bold flex items-center gap-2">
                <div className="w-1 h-1 bg-rose-500 rounded-full animate-ping" />
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full h-12 lg:h-16 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl lg:rounded-2xl shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-2 lg:gap-3 transition-all active:scale-[0.98] group"
            >
              Iniciar Diagnóstico
              <ArrowRight className="w-4 h-4 lg:w-5 lg:h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-6 lg:mt-8 pt-6 border-t border-white/5 flex justify-between items-center flex-shrink-0">
            <button 
              onClick={() => setIsLoginOpen(true)}
              className="flex items-center gap-2 text-[9px] lg:text-[10px] font-black text-slate-600 hover:text-white transition-all uppercase tracking-[0.3em] group"
            >
              <Shield className="w-3 h-3 lg:w-3.5 lg:h-3.5 text-slate-600 group-hover:text-indigo-400 transition-colors" /> Área ADM
            </button>
            <div className="flex flex-col items-end">
               <span className="text-[8px] lg:text-[9px] font-bold text-slate-700 uppercase tracking-widest leading-none">powered by</span>
               <span className="text-[10px] lg:text-[11px] font-black text-indigo-500 uppercase tracking-tighter">JOI.A. Platform</span>
            </div>
          </div>
        </div>
      </div>

      {/* POPUP DE LOGIN ADMINISTRATIVO */}
      {isLoginOpen && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-xl animate-fade-in">
          <div className="w-full max-w-sm bg-slate-900 border border-white/10 rounded-[2.5rem] p-8 lg:p-10 relative shadow-[0_0_60px_rgba(0,0,0,0.5)] animate-fade-in-up">
            <button 
              onClick={() => setIsLoginOpen(false)}
              className="absolute top-6 right-6 lg:top-8 lg:right-8 p-2 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5 lg:w-6 lg:h-6" />
            </button>
            
            <div className="flex flex-col items-center mb-8 lg:mb-10">
              <div className="w-14 h-14 lg:w-16 lg:h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-4 border border-indigo-500/20">
                <Lock className="w-6 h-6 lg:w-7 lg:h-7 text-indigo-500" />
              </div>
              <h3 className="text-xl lg:text-2xl font-bold text-white">Autenticação</h3>
              <p className="text-slate-500 text-[10px] lg:text-xs mt-1 uppercase tracking-widest font-bold">Gestão Administrativa</p>
            </div>

            <form onSubmit={handleAdmSubmit} className="space-y-3 lg:space-y-4">
              <input
                type="text"
                placeholder="Usuário"
                autoFocus
                value={admUser}
                onChange={(e) => setAdmUser(e.target.value)}
                className="w-full h-12 lg:h-14 bg-black/60 border border-white/5 text-white rounded-xl px-5 outline-none focus:ring-1 focus:ring-indigo-500 transition-all text-xs lg:text-sm"
              />
              <input
                type="password"
                placeholder="Senha"
                value={admPass}
                onChange={(e) => setAdmPass(e.target.value)}
                className="w-full h-12 lg:h-14 bg-black/60 border border-white/5 text-white rounded-xl px-5 outline-none focus:ring-1 focus:ring-indigo-500 transition-all text-xs lg:text-sm"
              />
              
              {loginError && (
                <p className="text-rose-500 text-[9px] lg:text-[10px] font-black text-center uppercase tracking-widest mt-2">{loginError}</p>
              )}
              
              <button 
                type="submit"
                className="w-full h-12 lg:h-14 bg-white text-black font-black rounded-xl hover:bg-indigo-50 transition-all uppercase tracking-[0.2em] text-[10px] lg:text-xs mt-4 shadow-xl active:scale-95"
              >
                Entrar no Painel
              </button>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .animate-spin-slow { animation: spin 25s linear infinite; }
        .animate-spin-slow-reverse { animation: spin 30s linear infinite reverse; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #4f46e5; border-radius: 10px; }
      `}</style>
    </div>
  );
};
