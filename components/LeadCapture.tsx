
import React, { useState, useEffect, useRef } from 'react';
import { Layers, ArrowRight, Mail, Phone, User, Lock, Users, UserCircle, X, ChevronRight } from 'lucide-react';
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
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const isCorporate = formData.testType === 'corporate';
  
  // Cores dinâmicas para o fundo e elementos baseadas no tipo de teste
  const bgColor = isCorporate ? 'bg-[#1a0f05]' : 'bg-[#0f0a2e]';
  const accentColor = isCorporate ? 'text-orange-500' : 'text-indigo-400';
  const buttonBg = isCorporate ? 'bg-orange-600' : 'bg-indigo-600';
  const shadowColor = isCorporate ? 'shadow-orange-950/40' : 'shadow-indigo-950/40';

  // Animação de Rede Neural no Background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: any[] = [];
    const particleCount = 60;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    class Particle {
      x: number; y: number; vx: number; vy: number;
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = (Math.random() - 0.5) * 0.3;
      }
      update() {
        this.x += this.vx; this.y += this.vy;
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      }
    }

    const init = () => {
      particles = [];
      for (let i = 0; i < particleCount; i++) particles.push(new Particle());
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const dotColor = isCorporate ? 'rgba(249, 115, 22, 0.2)' : 'rgba(129, 140, 248, 0.2)';
      const lineAlpha = isCorporate ? 'rgba(249, 115, 22,' : 'rgba(129, 140, 248,';

      particles.forEach((p, i) => {
        p.update();
        ctx.fillStyle = dotColor;
        ctx.beginPath(); ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2); ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 200) {
            ctx.strokeStyle = `${lineAlpha} ${0.1 - dist/2000})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p2.x, p2.y); ctx.stroke();
          }
        }
      });
      animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener('resize', resize);
    resize(); init(); draw();
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
    };
  }, [isCorporate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.whatsapp.trim()) {
      setError('Por favor, preencha Nome e WhatsApp.');
      return;
    }
    onComplete(formData);
  };

  const handleAdmSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (admUser === 'cafe360' && admPass === '360cafe') {
      onAdminLogin(); setIsLoginOpen(false);
    } else setLoginError('Inválido.');
  };

  return (
    <div className={`min-h-screen w-full flex flex-col lg:flex-row ${bgColor} transition-colors duration-1000 overflow-x-hidden relative`}>
      
      {/* BACKGROUND CANVAS */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0 opacity-50 pointer-events-none" />

      {/* LADO ESQUERDO: FORMULÁRIO */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between p-8 md:p-16 lg:p-24 relative z-10 min-h-screen">
        
        {/* Header Logo */}
        <div className="mb-12">
          <div className="flex items-center gap-3 animate-fade-in">
             <div className={`p-2 rounded-xl bg-white/5 border border-white/10 ${isCorporate ? 'border-orange-500/30' : 'border-indigo-500/30'}`}>
                <Layers className={`w-8 h-8 ${accentColor}`} />
             </div>
             <h2 className="text-xl font-black uppercase tracking-tighter text-white">Insight<span className={isCorporate ? 'text-orange-500' : 'text-indigo-400'}>360</span></h2>
          </div>
        </div>

        {/* Form Container */}
        <div className="max-w-md w-full animate-fade-in-up">
          <div className="mb-10">
            <h1 className="text-4xl md:text-5xl font-black text-white mb-3 tracking-tight">
              {isCorporate ? 'VitalPulse' : 'Insight360'} | <span className={isCorporate ? 'text-orange-500' : 'text-indigo-400'}>Diagnóstico</span>
            </h1>
            <p className="text-slate-400 text-sm font-medium">Acesse sua jornada e descubra sua inteligência comportamental através da neurociência aplicada.</p>
          </div>

          {/* Toggle Button */}
          <div className="grid grid-cols-2 gap-2 mb-8 p-1.5 bg-white/5 border border-white/10 rounded-2xl">
            <button onClick={() => setFormData({...formData, testType: 'individual'})} className={`flex items-center justify-center gap-2 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${!isCorporate ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}>
              <UserCircle className="w-4 h-4" /> Individual
            </button>
            <button onClick={() => setFormData({...formData, testType: 'corporate'})} className={`flex items-center justify-center gap-2 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isCorporate ? 'bg-orange-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}>
              <Users className="w-4 h-4" /> Corporativo
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
               <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Usuário / Nome Completo</label>
               <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Digite seu nome completo" required className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-5 text-white outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all text-sm" />
            </div>

            <div className="space-y-1">
               <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">WhatsApp</label>
               <input type="tel" name="whatsapp" value={formData.whatsapp} onChange={handleChange} placeholder="(00) 00000-0000" required className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-5 text-white outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all text-sm" />
            </div>

            <div className="space-y-1">
               <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">E-mail Corporativo (Opcional)</label>
               <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="seu@email.com" className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-5 text-white outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all text-sm" />
            </div>

            {error && <p className="text-rose-500 text-[10px] font-bold text-center bg-rose-500/10 p-2 rounded-lg">{error}</p>}

            <button type="submit" className={`w-full py-5 text-white font-black rounded-xl shadow-2xl hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest text-xs mt-4 flex items-center justify-center gap-2 ${buttonBg} ${shadowColor}`}>
              Entrar <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Footer info - Ajustado para garantir visibilidade */}
        <div className="mt-12 flex flex-col md:flex-row items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-600 gap-4 border-t border-white/5 pt-8">
           <button onClick={() => setIsLoginOpen(true)} className="hover:text-slate-300 transition-colors flex items-center gap-2"><Lock className="w-3 h-3" /> Acesso Administrativo</button>
           <div className="flex items-center gap-4">
              <p>Powered By JOI.A.</p>
              <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Sistema Seguro</div>
           </div>
        </div>
      </div>

      {/* LADO DIREITO: INTERATIVO (COMPASSO STYLE) */}
      <div className="hidden lg:flex flex-1 relative items-center justify-center p-12 bg-black/10">
        <div className="relative flex flex-col items-center">
          
          <div className="relative group">
            {/* EFEITO DE BRILHO AO FUNDO */}
            <div className={`absolute inset-0 blur-[120px] opacity-30 rounded-full animate-pulse-slow transition-colors duration-1000 ${isCorporate ? 'bg-orange-500' : 'bg-indigo-500'}`} />
            
            {/* ANÉIS ORBITAIS DINÂMICOS */}
            <div className="absolute -inset-12 border border-white/10 rounded-full animate-spin-slow-reverse" />
            <div className="absolute -inset-24 border border-dashed border-white/5 rounded-full animate-spin-slow" />
            <div className="absolute -inset-36 border border-white/5 rounded-full opacity-20" />

            {/* LOGO CENTRALIZADA (FLUTUANTE) */}
            <div className="w-72 h-72 bg-white rounded-full shadow-[0_40px_80px_rgba(0,0,0,0.6)] flex items-center justify-center relative z-10 animate-bounce-slow transition-transform hover:scale-105 duration-700">
               <Layers className={`w-32 h-32 ${isCorporate ? 'text-orange-500' : 'text-indigo-600'}`} />
               
               {/* Reflexo */}
               <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            </div>
          </div>
          
          <div className="mt-24 text-center space-y-3 animate-fade-in">
            <h3 className="text-3xl font-black text-white tracking-tight uppercase">Mapeamento Geométrico</h3>
            <div className={`h-1 w-16 mx-auto rounded-full ${isCorporate ? 'bg-orange-500' : 'bg-indigo-500'}`} />
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.5em] mt-2">Neurociência & Comportamento 360</p>
          </div>
        </div>
      </div>

      {/* MODAL ADM */}
      {isLoginOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/95 backdrop-blur-xl">
          <div className="w-full max-w-sm bg-slate-900 border border-white/10 rounded-[3rem] p-10 relative">
            <button onClick={() => setIsLoginOpen(false)} className="absolute top-8 right-8 p-2 text-slate-500 hover:text-white"><X className="w-6 h-6" /></button>
            <div className="flex flex-col items-center mb-8">
               <div className="p-5 bg-indigo-500/10 rounded-2xl mb-4 border border-indigo-500/20"><Lock className="w-8 h-8 text-indigo-400" /></div>
               <h3 className="text-xl font-black text-white uppercase tracking-widest">Acesso Restrito</h3>
            </div>
            <form onSubmit={handleAdmSubmit} className="space-y-4">
              <input type="text" placeholder="ID Usuário" value={admUser} onChange={(e) => setAdmUser(e.target.value)} className="w-full py-4 px-6 bg-black/40 border border-white/10 rounded-xl text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500/50" />
              <input type="password" placeholder="Password" value={admPass} onChange={(e) => setAdmPass(e.target.value)} className="w-full py-4 px-6 bg-black/40 border border-white/10 rounded-xl text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500/50" />
              {loginError && <p className="text-rose-500 text-[9px] font-black text-center uppercase tracking-widest">{loginError}</p>}
              <button type="submit" className="w-full py-4 bg-white text-slate-900 rounded-xl font-black uppercase tracking-widest text-[10px] shadow-xl hover:bg-slate-200">Validar Identidade</button>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .animate-spin-slow { animation: spin 25s linear infinite; }
        .animate-spin-slow-reverse { animation: spin 40s linear infinite reverse; }
        .animate-pulse-slow { animation: pulseGlow 4s ease-in-out infinite; }
        .animate-bounce-slow { animation: float 6s ease-in-out infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes pulseGlow { 0%, 100% { opacity: 0.15; transform: scale(1); } 50% { opacity: 0.4; transform: scale(1.15); } }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-15px); } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in-up { animation: fadeInUp 0.8s ease-out forwards; }
      `}</style>
    </div>
  );
};
