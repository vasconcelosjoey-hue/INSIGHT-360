
import React, { useState, useEffect, useRef } from 'react';
import { Layers, ArrowRight, Mail, Phone, User, Lock, Users, UserCircle, X } from 'lucide-react';
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
      canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };

    class Particle {
      x: number; y: number; vx: number; vy: number;
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
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
      const color = isCorporate ? 'rgba(249, 115, 22, 0.15)' : 'rgba(99, 102, 241, 0.15)';
      const lineColor = isCorporate ? 'rgba(249, 115, 22, 0.05)' : 'rgba(99, 102, 241, 0.05)';

      particles.forEach((p, i) => {
        p.update();
        ctx.fillStyle = color;
        ctx.beginPath(); ctx.arc(p.x, p.y, 2, 0, Math.PI * 2); ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 150) {
            ctx.strokeStyle = lineColor;
            ctx.lineWidth = 1 - dist / 150;
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
    } else setLoginError('Inválido.');
  };

  return (
    <div className="min-h-screen w-full flex bg-[#fdfdfd] overflow-hidden font-sans">
      
      {/* LADO ESQUERDO: FORMULÁRIO */}
      <div className="flex-1 flex flex-col p-8 md:p-16 lg:p-24 relative z-10 bg-white shadow-[20px_0_50px_rgba(0,0,0,0.02)]">
        
        {/* LOGO SUPERIOR */}
        <div className="flex items-center gap-3 mb-16 animate-fade-in">
          <div className={`p-2 rounded-xl border-2 transition-colors ${isCorporate ? 'border-orange-500 bg-orange-50' : 'border-indigo-600 bg-indigo-50'}`}>
            <Layers className={`w-6 h-6 ${isCorporate ? 'text-orange-600' : 'text-indigo-600'}`} />
          </div>
          <h2 className="text-xl font-black uppercase tracking-tighter text-slate-800">Insight<span className={isCorporate ? 'text-orange-500' : 'text-indigo-600'}>360</span></h2>
        </div>

        <div className="max-w-md w-full mx-auto lg:mx-0">
          <div className="mb-10">
            <h1 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">
              {isCorporate ? 'VitalPulse' : 'Insight360'} | <span className={isCorporate ? 'text-orange-500' : 'text-indigo-600'}>Diagnóstico</span>
            </h1>
            <p className="text-slate-500 text-sm font-medium">Acesse sua jornada e descubra sua inteligência comportamental.</p>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-8 p-1.5 bg-slate-100 rounded-2xl">
            <button onClick={() => setFormData({...formData, testType: 'individual'})} className={`flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${!isCorporate ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}`}>
              <UserCircle className="w-4 h-4" /> Individual
            </button>
            <button onClick={() => setFormData({...formData, testType: 'corporate'})} className={`flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isCorporate ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-400'}`}>
              <Users className="w-4 h-4" /> Corporativo
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Nome Completo</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Digite seu nome" required className="w-full bg-slate-50 border border-slate-100 rounded-xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-slate-200 transition-all text-sm" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">WhatsApp</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                <input type="tel" name="whatsapp" value={formData.whatsapp} onChange={handleChange} placeholder="(00) 00000-0000" required className="w-full bg-slate-50 border border-slate-100 rounded-xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-slate-200 transition-all text-sm" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">E-mail</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="seu@email.com" className="w-full bg-slate-50 border border-slate-100 rounded-xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-slate-200 transition-all text-sm" />
              </div>
            </div>

            <button type="submit" className={`w-full py-5 text-white font-black rounded-xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest text-xs mt-6 ${isCorporate ? 'bg-orange-500 shadow-orange-500/20' : 'bg-indigo-600 shadow-indigo-600/20'}`}>
              Entrar na Jornada
            </button>
          </form>

          <div className="mt-12 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-slate-400">
             <button onClick={() => setIsLoginOpen(true)} className="hover:text-slate-600 transition-colors flex items-center gap-2"><Lock className="w-3 h-3" /> Administração</button>
             <p>Powered By JOI.A.</p>
          </div>
        </div>
      </div>

      {/* LADO DIREITO: INTERATIVO */}
      <div className={`hidden lg:flex flex-1 relative items-center justify-center transition-colors duration-700 ${isCorporate ? 'bg-orange-50' : 'bg-slate-50'}`}>
        <canvas ref={canvasRef} className="absolute inset-0 z-0" />
        
        <div className="relative z-10 flex flex-col items-center">
          {/* LOGO CENTRAL INTERATIVA */}
          <div className="relative group cursor-pointer">
            <div className={`absolute inset-0 blur-[60px] opacity-20 rounded-full animate-pulse transition-colors ${isCorporate ? 'bg-orange-500' : 'bg-indigo-600'}`} />
            
            {/* ANÉIS ORBITAIS */}
            <div className={`absolute -inset-12 border-2 rounded-full border-dashed animate-spin-slow opacity-20 ${isCorporate ? 'border-orange-500' : 'border-indigo-600'}`} />
            <div className={`absolute -inset-24 border border-dashed rounded-full animate-spin-slow-reverse opacity-10 ${isCorporate ? 'border-orange-400' : 'border-indigo-400'}`} />

            <div className="w-48 h-48 bg-white rounded-full shadow-[0_30px_60px_rgba(0,0,0,0.1)] flex items-center justify-center relative overflow-hidden">
               <Layers className={`w-24 h-24 group-hover:scale-110 transition-transform duration-500 ${isCorporate ? 'text-orange-500' : 'text-indigo-600'}`} />
               <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            </div>
          </div>
          
          <div className="mt-16 text-center space-y-2">
            <h3 className="text-2xl font-black text-slate-800 tracking-tight">Mapeamento Geométrico</h3>
            <p className="text-slate-400 text-sm font-medium uppercase tracking-[0.3em]">Neurociência & Comportamento</p>
          </div>
        </div>
      </div>

      {/* LOGIN ADM MODAL */}
      {isLoginOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/90 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-sm bg-white border border-slate-100 rounded-[2.5rem] p-10 relative shadow-2xl">
            <button onClick={() => setIsLoginOpen(false)} className="absolute top-6 right-6 p-2 text-slate-400 hover:text-rose-500 transition-colors"><X className="w-6 h-6" /></button>
            <div className="flex flex-col items-center mb-8">
               <div className="p-4 bg-indigo-50 rounded-2xl mb-4"><Lock className="w-8 h-8 text-indigo-600" /></div>
               <h3 className="text-xl font-black text-slate-800 uppercase tracking-widest">Acesso Restrito</h3>
            </div>
            <form onSubmit={handleAdmSubmit} className="space-y-4">
              <input type="text" placeholder="Usuário" value={admUser} onChange={(e) => setAdmUser(e.target.value)} className="w-full py-4 px-6 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-100 transition-all" />
              <input type="password" placeholder="Senha" value={admPass} onChange={(e) => setAdmPass(e.target.value)} className="w-full py-4 px-6 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-100 transition-all" />
              {loginError && <p className="text-rose-500 text-[10px] font-black text-center uppercase">{loginError}</p>}
              <button type="submit" className="w-full py-4 bg-slate-900 text-white rounded-xl font-black uppercase tracking-widest text-[10px] shadow-xl hover:bg-black transition-all">Autenticar</button>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .animate-spin-slow { animation: spin 12s linear infinite; }
        .animate-spin-slow-reverse { animation: spin 18s linear infinite reverse; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};
