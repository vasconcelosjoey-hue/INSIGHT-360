import React, { useState } from 'react';
import { ShieldCheck, ArrowRight, FileText, Lock } from 'lucide-react';

interface DisclaimerProps {
  onAccept: () => void;
}

export const Disclaimer: React.FC<DisclaimerProps> = ({ onAccept }) => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-[#0f172a]">
      {/* Background Ambience */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
         <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-indigo-900/20 rounded-full blur-[120px]" />
      </div>

      <div className="relative w-full max-w-4xl bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="p-6 md:p-8 border-b border-white/5 flex items-center gap-4 bg-black/20 rounded-t-3xl">
           <div className="bg-indigo-500/20 p-3 rounded-2xl border border-indigo-500/30">
             <Lock className="w-6 h-6 text-indigo-300" />
           </div>
           <div>
             <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">Privacidade & Dados</h1>
             <p className="text-sm text-slate-400">Transparência total sobre como usamos suas informações.</p>
           </div>
        </div>
        
        {/* Scrollable Content */}
        <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar flex-grow">
           <div className="prose prose-invert prose-p:text-slate-300 prose-headings:text-white max-w-none">
             
             <div className="bg-indigo-500/10 border border-indigo-500/20 p-5 rounded-xl mb-8">
               <p className="m-0 text-indigo-200 font-medium">
                 No Insight360, seus dados são tratados com o mais alto nível de criptografia e confidencialidade.
               </p>
             </div>

             <h3 className="flex items-center gap-2 text-lg">
                <ShieldCheck className="w-5 h-5 text-indigo-400" /> Finalidade da Coleta
             </h3>
             <p>
               Os dados fornecidos (Nome, WhatsApp, E-mail) são utilizados <strong>exclusivamente</strong> para personalizar seu relatório final e permitir o envio dos resultados. Não vendemos suas informações para terceiros.
             </p>

             <h3 className="flex items-center gap-2 text-lg mt-8">
                <FileText className="w-5 h-5 text-indigo-400" /> Metodologia
             </h3>
             <p>
               Este teste utiliza algoritmos de processamento comportamental local. Em alguns casos, inteligência artificial segura é acionada para gerar insights textuais no seu relatório, sem armazenar seu perfil permanentemente em bases de treinamento públicas.
             </p>

             <h3 className="flex items-center gap-2 text-lg mt-8">
                <Lock className="w-5 h-5 text-indigo-400" /> Seus Direitos
             </h3>
             <p>
               Você tem total controle. O teste é projetado para feedback imediato. Ao fechar a aplicação, os dados temporários da sessão são descartados, mantendo apenas o registro de lead seguro em nossa base administrativa para suporte.
             </p>

             <hr className="border-white/10 my-8" />
             
             <p className="text-sm text-slate-500">
               Ao continuar, você concorda com os termos acima e autoriza o processamento das suas respostas para geração do perfil Insight360.
             </p>
           </div>
        </div>

        {/* Footer */}
        <div className="p-6 md:p-8 border-t border-white/5 bg-black/20 rounded-b-3xl flex flex-col sm:flex-row justify-end items-center gap-4">
          <button
            onClick={onAccept}
            className="w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-4 bg-white text-slate-900 rounded-xl hover:bg-indigo-50 transition-all duration-300 font-bold shadow-lg shadow-white/5 hover:-translate-y-1"
          >
            Concordar e Continuar
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

      </div>
    </div>
  );
};