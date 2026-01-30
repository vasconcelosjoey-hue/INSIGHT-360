
import React, { useState, useEffect, useRef } from 'react';
import { Layers, ArrowRight, Mail, Phone, User, Lock, Users, UserCircle, X, ChevronRight } from 'lucide-react';
import { UserInfo } from '../types';

interface LeadCaptureProps {
  onComplete: (info: UserInfo) => void;
  onAdminLogin: () => void;
}

const BRAND_LOGO_URL = "https://firebasestorage.googleapis.com/v0/b/insight360-ae5c7.firebasestorage.app/o/ChatGPT%20Image%2029%20de%20jan.%20de%202026%2C%2022_42_41.png?alt=media&token=26c0189e-d7ee-4591-91bb-b9dcb37f5e12";

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
  const accentColor = isCorporate ? 'text-orange-500' : 'text-indigo-400';
  const buttonBg = isCorporate ? 'bg-orange-600' : 'bg-indigo-600';

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: any[] = [];
    const particleCount = 50;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    class Particle {
      x: number; y: number; vx: number; vy: number;
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.2;
        this.vy = (Math.random() - 0.5) * 0.2;
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
      const dotColor = isCorporate ? 'rgba(249, 115, 22, 0.15)' : 'rgba(129, 140, 248, 0.15)';
      const lineColor = isCorporate ? 'rgba(249, 115, 22, 0.05)' : 'rgba(129, 140, 248, 0.05)';

      particles.forEach((p, i) => {
        p.update();
        ctx.fillStyle = dotColor;
        ctx.beginPath(); ctx.arc(p.x, p.y, 1.2, 0, Math.PI * 2); ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 150) {
            ctx.strokeStyle = lineColor;
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
      setError('Por favor, preencha os campos obrigatórios.');
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
    <div className={`min-h-screen w-full flex flex-col lg:flex-row bg-[#070b14] overflow-hidden font-sans relative`}>
      <canvas ref={canvasRef} className="absolute inset-0 z-0 opacity-40 pointer-events-none" />

      {/* COLUNA ESQUERDA: FORMULÁRIO */}
      <div className="w-full lg:w-[45%] flex flex-col justify-center items-center p-6 md:p-12 relative z-10">
        <div className="max-w-sm w-full animate-fade-in-up flex flex-col min-h-[600px] justify-center">
          
          <div className="mb-6">
            <h1 className="text-3xl font-black text-white mb-2 tracking-tight">
               {isCorporate ? 'VitalPulse' : 'Diagnóstico'} | <span className={accentColor}>360°</span>
            </h1>
            <p className="text-slate-400 text-xs font-medium leading-relaxed">
              Descubra sua inteligência comportamental através da neurociência aplicada em minutos.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-6 p-1 bg-white/5 border border-white/10 rounded-xl">
            <button onClick={() => setFormData({...formData, testType: 'individual'})} className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${!isCorporate ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500'}`}>
              <UserCircle className="w-3.5 h-3.5" /> Individual
            </button>
            <button onClick={() => setFormData({...formData, testType: 'corporate'})} className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${isCorporate ? 'bg-orange-600 text-white shadow-lg' : 'text-slate-500'}`}>
              <Users className="w-3.5 h-3.5" /> Corporativo
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
               <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Nome Completo</label>
               <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Digite seu nome" required className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-white outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all text-xs" />
            </div>

            <div className="space-y-1">
               <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">WhatsApp</label>
               <input type="tel" name="whatsapp" value={formData.whatsapp} onChange={handleChange} placeholder="(00) 00000-0000" required className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-white outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all text-xs" />
            </div>

            <div className="space-y-1">
               <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">E-mail (Opcional)</label>
               <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="seu@email.com" className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-white outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all text-xs" />
            </div>

            {error && <p className="text-rose-500 text-[9px] font-bold text-center bg-rose-500/10 py-2 rounded-lg">{error}</p>}

            <button type="submit" className={`w-full py-4 text-white font-black rounded-lg shadow-xl hover:scale-[1.01] active:scale-95 transition-all uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 ${buttonBg}`}>
              Entrar na Jornada <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Footer Alinhado com fonte aumentada */}
          <div className="mt-8 flex items-center justify-between text-[11px] font-black uppercase tracking-widest text-slate-600 border-t border-white/5 pt-6">
             <button onClick={() => setIsLoginOpen(true)} className="hover:text-slate-400 transition-colors flex items-center gap-1.5"><Lock className="w-3 h-3" /> Administração</button>
             <p className="opacity-80">POWERED BY JOI.A.</p>
          </div>
        </div>
      </div>

      {/* COLUNA DIREITA: BRANDING (CENTRALIZADO) */}
      <div className={`hidden lg:flex lg:w-[55%] relative items-center justify-center border-l border-white/5 bg-black/20`}>
        <div className="relative flex flex-col items-center">
          
          <div className="relative group">
            <div className={`absolute inset-0 blur-[100px] opacity-20 rounded-full animate-pulse-slow transition-colors duration-1000 ${isCorporate ? 'bg-orange-500' : 'bg-indigo-500'}`} />
            <div className="absolute -inset-10 border border-white/10 rounded-full animate-spin-slow-reverse" />
            <div className="absolute -inset-20 border border-dashed border-white/5 rounded-full animate-spin-slow opacity-30" />

            {/* LOGO CENTRAL - APENAS A LOGO, RESPONSIVA NO CONTAINER */}
            <div className="w-64 h-64 lg:w-80 lg:h-80 bg-white rounded-full shadow-[0_40px_80px_rgba(0,0,0,0.6)] flex items-center justify-center relative z-10 hover:scale-105 transition-transform duration-700 overflow-hidden border-8 border-white/5">
               <img src={BRAND_LOGO_URL} alt="Insight360 Logo" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </div>

      {/* MODAL ADM */}
      {isLoginOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/95 backdrop-blur-xl">
          <div className="w-full max-w-xs bg-slate-900 border border-white/10 rounded-3xl p-8 relative">
            <button onClick={() => setIsLoginOpen(false)} className="absolute top-6 right-6 p-2 text-slate-500 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
            <div className="flex flex-col items-center mb-6">
               <div className="p-4 bg-white/5 rounded-xl mb-3"><Lock className="w-6 h-6 text-indigo-400" /></div>
               <h3 className="text-sm font-black text-white uppercase tracking-widest">Acesso Restrito</h3>
            </div>
            <form onSubmit={handleAdmSubmit} className="space-y-3">
              <input type="text" placeholder="Usuário" value={admUser} onChange={(e) => setAdmUser(e.target.value)} className="w-full py-3 px-4 bg-black/40 border border-white/10 rounded-lg text-white text-xs outline-none focus:ring-1 focus:ring-indigo-500/50" />
              <input type="password" placeholder="Senha" value={admPass} onChange={(e) => setAdmPass(e.target.value)} className="w-full py-3 px-4 bg-black/40 border border-white/10 rounded-lg text-white text-xs outline-none focus:ring-1 focus:ring-indigo-500/50" />
              {loginError && <p className="text-rose-500 text-[8px] font-black text-center uppercase">{loginError}</p>}
              <button type="submit" className="w-full py-3 bg-white text-slate-900 rounded-lg font-black uppercase tracking-widest text-[9px] hover:bg-slate-200 transition-all">Entrar</button>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .animate-spin-slow { animation: spin 20s linear infinite; }
        .animate-spin-slow-reverse { animation: spin 25s linear infinite reverse; }
        .animate-pulse-slow { animation: pulseGlow 4s ease-in-out infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes pulseGlow { 0%, 100% { opacity: 0.1; transform: scale(1); } 50% { opacity: 0.25; transform: scale(1.1); } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in-up { animation: fadeInUp 0.6s ease-out forwards; }
      `}</style>
    </div>
  );
};
