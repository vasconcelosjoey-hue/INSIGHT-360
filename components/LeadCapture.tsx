
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
  const themeColor = isCorporate ? '#f97316' : '#6366f1';

  // Animação de Rede Neural Interativa
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: any[] = [];
    const particleCount = 80;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    class Particle {
      x: number; y: number; vx: number; vy: number; size: number;
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.size = Math.random() * 2 + 1;
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
      
      particles.forEach((p, i) => {
        p.update();
        ctx.fillStyle = isCorporate ? 'rgba(249, 115, 22, 0.4)' : 'rgba(165, 180, 252, 0.4)';
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 180) {
            ctx.strokeStyle = isCorporate ? `rgba(249, 115, 22, ${0.15 - dist/1200})` : `rgba(165, 180, 252, ${0.15 - dist/1200})`;
            ctx.lineWidth = 0.8;
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
      setError('Campos obrigatórios: Nome e WhatsApp.');
      return;
    }
    onComplete(formData);
  };

  const handleAdmSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (admUser === 'cafe360' && admPass === '360cafe') {
      onAdminLogin(); setIsLoginOpen(false);
    } else setLoginError('Credenciais inválidas.');
  };

  return (
    <div className="min-h-screen w-full flex bg-[#070b14] overflow-hidden font-sans relative">
      
      {/* BACKGROUND INTERATIVO (CANVAS) */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0 opacity-40 pointer-events-none" />

      {/* LADO ESQUERDO: FORMULÁRIO (ROXO/LARANJA) */}
      <div className="flex-1 flex flex-col justify-center p-8 md:p-16 lg:p-24 relative z-10">
        <div className="max-w-md w-full animate-fade-in-up">
          
          {/* LOGO SUPERIOR ESQUERDA */}
          <div className="flex items-center gap-3 mb-10">
             <Layers className={`w-14 h-14 ${isCorporate ? 'text-orange-500' : 'text-indigo-500'}`} />
          </div>

          <div className="mb-8">
            <h1 className="text-4xl font-black text-white mb-2 tracking-tight">
              Insight360 | <span className={isCorporate ? 'text-orange-500' : 'text-indigo-500'}>Diagnóstico</span>
            </h1>
            <p className="text-slate-400 text-sm font-medium">Acesse sua jornada e descubra sua inteligência comportamental.</p>
          </div>

          {/* TOGGLE TYPE */}
          <div className="grid grid-cols-2 gap-2 mb-8 p-1 bg-white/5 border border-white/10 rounded-2xl">
            <button onClick={() => setFormData({...formData, testType: 'individual'})} className={`flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${!isCorporate ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}>
              <UserCircle className="w-4 h-4" /> Individual
            </button>
            <button onClick={() => setFormData({...formData, testType: 'corporate'})} className={`flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isCorporate ? 'bg-orange-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}>
              <Users className="w-4 h-4" /> Corporativo
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Nome Completo</label>
              <div className="relative group">
                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Digite seu nome" required className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-5 text-white outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all text-sm placeholder:text-slate-600" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">WhatsApp</label>
              <div className="relative group">
                <input type="tel" name="whatsapp" value={formData.whatsapp} onChange={handleChange} placeholder="(00) 00000-0000" required className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-5 text-white outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all text-sm placeholder:text-slate-600" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">E-mail</label>
              <div className="relative group">
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="seu@email.com" className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-5 text-white outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all text-sm placeholder:text-slate-600" />
              </div>
            </div>

            <button type="submit" className={`w-full py-5 text-white font-black rounded-xl shadow-2xl hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest text-xs mt-4 flex items-center justify-center gap-2 group ${isCorporate ? 'bg-orange-600 shadow-orange-600/20' : 'bg-indigo-600 shadow-indigo-600/20'}`}>
              Entrar <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-12 flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-600">
             <button onClick={() => setIsLoginOpen(true)} className="hover:text-slate-300 transition-colors flex items-center gap-2"><Lock className="w-3 h-3" /> Gestão ADM</button>
             <p className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Servidor Ativo</p>
          </div>
        </div>
      </div>

      {/* LADO DIREITO: INTERATIVO (CENTRALIZADO) */}
      <div className={`hidden lg:flex flex-1 relative items-center justify-center transition-colors duration-1000 ${isCorporate ? 'bg-orange-950/20' : 'bg-indigo-950/20'}`}>
        
        {/* ELEMENTOS DE MOVIMENTO */}
        <div className="relative flex flex-col items-center animate-fade-in">
          
          <div className="relative group">
            {/* GLOW DINÂMICO */}
            <div className={`absolute inset-0 blur-[100px] opacity-20 rounded-full animate-pulse-slow transition-colors duration-700 ${isCorporate ? 'bg-orange-500' : 'bg-indigo-500'}`} />
            
            {/* ANÉIS ROTATIVOS */}
            <div className={`absolute -inset-16 border border-white/10 rounded-full animate-spin-slow-reverse`} />
            <div className={`absolute -inset-24 border border-dashed border-white/5 rounded-full animate-spin-slow`} />

            {/* LOGO CENTRAL (COMPASSO STYLE) */}
            <div className="w-64 h-64 bg-white rounded-full shadow-[0_50px_100px_rgba(0,0,0,0.5)] flex items-center justify-center relative z-10 transition-transform duration-700 hover:scale-105 group">
               <Layers className={`w-32 h-32 transition-all duration-700 ${isCorporate ? 'text-orange-500' : 'text-indigo-600'}`} />
               
               {/* EFEITO DE BRILHO PASSANTE */}
               <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            </div>
          </div>
          
          <div className="mt-20 text-center space-y-4">
            <h3 className="text-3xl font-black text-white tracking-tight uppercase">Mapeamento Geométrico</h3>
            <div className={`h-1 w-20 mx-auto rounded-full transition-colors ${isCorporate ? 'bg-orange-500' : 'bg-indigo-500'}`} />
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.5em]">Neurociência & Comportamento 360</p>
          </div>
        </div>
      </div>

      {/* LOGIN ADM MODAL (SOFISTICADO) */}
      {isLoginOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/95 backdrop-blur-2xl animate-fade-in">
          <div className="w-full max-w-sm bg-slate-900 border border-white/10 rounded-[3rem] p-10 relative shadow-2xl">
            <button onClick={() => setIsLoginOpen(false)} className="absolute top-8 right-8 p-2 text-slate-500 hover:text-white transition-colors"><X className="w-6 h-6" /></button>
            <div className="flex flex-col items-center mb-8">
               <div className="p-5 bg-white/5 rounded-2xl mb-4 border border-white/10"><Lock className="w-8 h-8 text-indigo-400" /></div>
               <h3 className="text-xl font-black text-white uppercase tracking-widest">Acesso Restrito</h3>
            </div>
            <form onSubmit={handleAdmSubmit} className="space-y-4">
              <input type="text" placeholder="ID Usuário" value={admUser} onChange={(e) => setAdmUser(e.target.value)} className="w-full py-4 px-6 bg-black/40 border border-white/10 rounded-xl text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all" />
              <input type="password" placeholder="Chave de Acesso" value={admPass} onChange={(e) => setAdmPass(e.target.value)} className="w-full py-4 px-6 bg-black/40 border border-white/10 rounded-xl text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all" />
              {loginError && <p className="text-rose-500 text-[9px] font-black text-center uppercase tracking-widest bg-rose-500/10 p-2 rounded-lg">{loginError}</p>}
              <button type="submit" className="w-full py-4 bg-white text-slate-900 rounded-xl font-black uppercase tracking-widest text-[10px] shadow-xl hover:bg-slate-200 transition-all">Validar Acesso</button>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .animate-spin-slow { animation: spin 25s linear infinite; }
        .animate-spin-slow-reverse { animation: spin 35s linear infinite reverse; }
        .animate-pulse-slow { animation: pulseGlow 4s ease-in-out infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes pulseGlow { 0%, 100% { opacity: 0.15; transform: scale(1); } 50% { opacity: 0.3; transform: scale(1.1); } }
      `}</style>
    </div>
  );
};
