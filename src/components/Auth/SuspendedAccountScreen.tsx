import React from 'react';
import { Ban, LogOut, Home, ShieldAlert } from 'lucide-react';
import { useQuiz } from '../../context/QuizContext';

export const SuspendedAccountScreen: React.FC = () => {
  const { logout, setActiveSection, firebaseUser } = useQuiz();

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="glass-panel max-w-lg w-full p-6 sm:p-10 rounded-3xl border border-rose-500/40 text-center space-y-6 relative overflow-hidden shadow-2xl">
        <div className="absolute -top-20 -right-20 w-56 h-56 bg-rose-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-rose-500/15 border border-rose-500/40 flex items-center justify-center mx-auto text-rose-400">
          <Ban className="w-8 h-8 sm:w-10 sm:h-10" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 text-[11px] font-bold uppercase tracking-wider font-mono">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Account Suspended</span>
          </div>

          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-white">
            Protected Workspace Access Suspended
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Your account (<span className="font-mono text-white">{firebaseUser?.email}</span>) has been suspended by an Administrator. Protected panels and examination actions are disabled until your account is reactivated.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={logout}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>

          <button
            onClick={() => setActiveSection('home')}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 font-semibold text-xs transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <Home className="w-4 h-4 text-[#FF8C32]" />
            <span>Return to Home</span>
          </button>
        </div>
      </div>
    </div>
  );
};
