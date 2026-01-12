import React, { useState } from 'react';
import { Layers, ArrowRight, Mail, Phone, User, Sparkles, Settings, FileSpreadsheet } from 'lucide-react';
import { UserInfo } from '../types';

interface LeadCaptureProps {
  onComplete: (info: UserInfo) => void;
  onManualMode?: () => void;
}

export const LeadCapture: React.FC<LeadCaptureProps> = ({ onComplete, onManualMode }) => {
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
      
      {/* --- BARRA FIXA DE ATALHO (GARANTE VISIBILIDADE) --- */}
      {onManualMode && (
        <div className="fixed top-0 left-0 w-full bg-slate-900/90 backdrop-blur-md border-b border-white/10 z-[100] px-4 md:px-8 py-3 flex justify-between items-center shadow-2xl animate-fade-in">
           <div className="flex items-center gap-3">
              <div className="bg-emerald-500/20 p-1.5 rounded-lg border border-emerald-500/30 hidden md:block">
                <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-white text-sm font-bold tracking-wide">Modo Diagnóstico Rápido</span>
                <span className="text-slate-400 text-xs hidden sm:block">Já possui o documento com as porcentagens?</span>
              </div>
           </div>
           
           <button 
             onClick={onManualMode}
             className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs md:text-sm font-bold py-2.5 px-5 rounded-lg transition-all shadow-lg shadow-emerald-600/20 flex items-center gap-2 border border-emerald-400/50 hover:scale-105"
           >
             <Settings className="w-4 h-4" />
             INSERIR DADOS AGORA
           </button>
        </div>
      )}

      {/* Dynamic Background Elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse-slow pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-violet-600/20 rounded-full blur-[100px] animate-pulse-slow pointer-events-none" style={{ animationDelay: '1s' }} />

      <div className="relative z-10 w-full max-w-md animate-fade-in-up mt-12">
        
        {/* Premium Animation Centerpiece */}
        <div className="flex justify-center mb-6 relative">
          <div className="relative w-24 h-24 flex items-center justify-center">
             {/* Outer Ring */}
             <div className="absolute inset-0 border-2 border-indigo-500/30 rounded-full animate-spin-slow-reverse" />
             {/* Inner Ring */}
             <div className="absolute inset-2 border-2 border-violet-500/50 rounded-full border-t-transparent animate-spin-slow" />
             {/* Core Glow */}
             <div className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-full animate-pulse" />
             {/* Icon */}
             <Layers className="w-12 h-12 text-white relative z-10 drop-shadow-[0_0_15px_rgba(139,92,246,0.6)]" />
             {/* Particles */}
             <Sparkles className="absolute -top-4 -right-4 w-5 h-5 text-yellow-300 animate-bounce" style={{ animationDuration: '3s' }} />
          </div>
        </div>

        <div className="text-center mb-6">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight">
            Insight<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">360</span>
          </h1>
          <p className="text-slate-400 text-sm md:text-base font-light mb-6">
            Sua jornada de autoconhecimento começa agora.
          </p>
        </div>

        {/* Glassmorphism Form Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl relative">
          
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-500/90 text-white text-[10px] font-bold px-3 py-1 rounded-full border border-indigo-400 shadow-lg">
            NOVA ANÁLISE
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 mt-2">
            
            <div className="group">
              <label className="block text-xs font-medium text-indigo-200 mb-1 ml-1">Nome Completo</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-400 transition-colors" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Seu nome"
                  className="w-full bg-slate-900/50 border border-slate-700 text-white rounded-xl py-3.5 pl-12 pr-4 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-600"
                />
              </div>
            </div>

            <div className="group">
              <label className="block text-xs font-medium text-indigo-200 mb-1 ml-1">E-mail</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-400 transition-colors" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="seu@email.com"
                  className="w-full bg-slate-900/50 border border-slate-700 text-white rounded-xl py-3.5 pl-12 pr-4 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-600"
                />
              </div>
            </div>

            <div className="group">
              <label className="block text-xs font-medium text-indigo-200 mb-1 ml-1">WhatsApp</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-400 transition-colors" />
                <input
                  type="tel"
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleChange}
                  placeholder="(00) 00000-0000"
                  className="w-full bg-slate-900/50 border border-slate-700 text-white rounded-xl py-3.5 pl-12 pr-4 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-600"
                />
              </div>
            </div>

            {error && (
              <p className="text-red-400 text-xs text-center bg-red-500/10 py-2 rounded-lg border border-red-500/20 animate-shake">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="w-full relative group overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 p-[1px] shadow-lg shadow-indigo-500/30 transition-all hover:shadow-indigo-500/50 hover:-translate-y-0.5"
            >
              <div className="relative bg-transparent rounded-xl px-4 py-4 flex items-center justify-center gap-2 transition-all group-hover:bg-white/5">
                <span className="font-semibold text-white tracking-wide">Iniciar Diagnóstico</span>
                <ArrowRight className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
            
          </form>
          
          <div className="mt-4 text-center border-t border-white/5 pt-4">
              <p className="text-slate-500 text-xs">
                 Caso não tenha os dados, preencha o formulário acima para iniciar o teste.
              </p>
          </div>
        </div>
      </div>
    </div>
  );
};