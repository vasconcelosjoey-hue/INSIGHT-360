
import React, { useState } from 'react';
import { Layers, ArrowRight, Mail, Phone, User, Sparkles } from 'lucide-react';
import { UserInfo } from '../types';

interface LeadCaptureProps {
  onComplete: (info: UserInfo) => void;
}

export const LeadCapture: React.FC<LeadCaptureProps> = ({ onComplete }) => {
  const [formData, setFormData] = useState<UserInfo>({
    name: '',
    email: '',
    whatsapp: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.whatsapp) {
      setError('Por favor, preencha todos os campos para continuar.');
      return;
    }
    onComplete(formData);
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 relative overflow-hidden bg-[#0f172a]">
      
      {/* --- NOVO HEADER SIMPLIFICADO --- */}
      <div className="fixed top-0 left-0 w-full bg-slate-900/80 backdrop-blur-md border-b border-white/5 z-[100] px-4 py-4 flex justify-center items-center shadow-lg animate-fade-in">
           <span className="text-white text-[10px] md:text-xs font-black tracking-[0.4em] uppercase text-center">
             Insight<span className="text-indigo-400">360</span> - Mapeamento de autoconhecimento
           </span>
      </div>

      {/* Dynamic Background Elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse-slow pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-violet-600/20 rounded-full blur-[100px] animate-pulse-slow pointer-events-none" style={{ animationDelay: '1s' }} />

      <div className="relative z-10 w-full max-w-md animate-fade-in-up px-2 md:px-0 mt-8">
        
        {/* Premium Animation Centerpiece */}
        <div className="flex justify-center mb-4 md:mb-6 relative">
          <div className="relative w-16 h-16 md:w-24 md:h-24 flex items-center justify-center">
             <div className="absolute inset-0 border-2 border-indigo-500/30 rounded-full animate-spin-slow-reverse" />
             <div className="absolute inset-2 border-2 border-violet-500/50 rounded-full border-t-transparent animate-spin-slow" />
             <div className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-full animate-pulse" />
             <Layers className="w-8 h-8 md:w-12 md:h-12 text-white relative z-10 drop-shadow-[0_0_15px_rgba(139,92,246,0.6)]" />
             <Sparkles className="absolute -top-3 -right-3 w-4 h-4 text-yellow-300 animate-bounce" />
          </div>
        </div>

        <div className="text-center mb-4 md:mb-6">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-2 md:mb-3 tracking-tight">
            Insight<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">360</span>
          </h1>
          <p className="text-slate-400 text-xs md:text-base font-light px-6">
            Inicie agora sua jornada de autoconhecimento estratégico.
          </p>
        </div>

        {/* Glassmorphism Form Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 md:p-8 rounded-[1.5rem] md:rounded-3xl shadow-2xl relative">
          
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-500/90 text-white text-[9px] font-bold px-3 py-1 rounded-full border border-indigo-400 shadow-lg whitespace-nowrap uppercase tracking-widest">
            Acesso Diagnóstico
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5 mt-2">
            
            <div className="group">
              <label className="block text-[10px] md:text-xs font-medium text-indigo-200 mb-1 ml-1 uppercase tracking-wider">Nome Completo</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-slate-500" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Seu nome"
                  className="w-full bg-slate-900/50 border border-slate-700 text-white rounded-xl py-3 md:py-3.5 pl-11 md:pl-12 pr-4 focus:ring-2 focus:ring-indigo-500/50 outline-none text-sm md:text-base placeholder:text-slate-600 transition-all"
                />
              </div>
            </div>

            <div className="group">
              <label className="block text-[10px] md:text-xs font-medium text-indigo-200 mb-1 ml-1 uppercase tracking-wider">E-mail Corporativo</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-slate-500" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="seu@email.com"
                  className="w-full bg-slate-900/50 border border-slate-700 text-white rounded-xl py-3 md:py-3.5 pl-11 md:pl-12 pr-4 focus:ring-2 focus:ring-indigo-500/50 outline-none text-sm md:text-base placeholder:text-slate-600 transition-all"
                />
              </div>
            </div>

            <div className="group">
              <label className="block text-[10px] md:text-xs font-medium text-indigo-200 mb-1 ml-1 uppercase tracking-wider">WhatsApp</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-slate-500" />
                <input
                  type="tel"
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleChange}
                  placeholder="(00) 00000-0000"
                  className="w-full bg-slate-900/50 border border-slate-700 text-white rounded-xl py-3 md:py-3.5 pl-11 md:pl-12 pr-4 focus:ring-2 focus:ring-indigo-500/50 outline-none text-sm md:text-base placeholder:text-slate-600 transition-all"
                />
              </div>
            </div>

            {error && (
              <p className="text-red-400 text-[10px] md:text-xs text-center bg-red-500/10 py-2 rounded-lg border border-red-500/20">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="w-full relative group overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 p-[1px] shadow-lg active:scale-95 transition-all"
            >
              <div className="relative bg-transparent rounded-xl px-4 py-3.5 md:py-4 flex items-center justify-center gap-2 transition-all">
                <span className="font-bold text-white tracking-wide text-sm md:text-base">Prosseguir para Diagnóstico</span>
                <ArrowRight className="w-4 h-4 md:w-5 md:h-5 text-white" />
              </div>
            </button>
            
          </form>
          
          <div className="mt-4 text-center border-t border-white/5 pt-4">
              <p className="text-slate-500 text-[9px] md:text-xs leading-relaxed uppercase tracking-tighter">
                 Ambiente seguro e criptografado
              </p>
          </div>
        </div>
      </div>
    </div>
  );
};
