import React from 'react';
import {
  Clock,
  ShieldCheck,
  GraduationCap,
  LogOut,
  CheckCircle2
} from 'lucide-react';
import { useQuiz } from '../../context/QuizContext';

export const TeacherPendingScreen: React.FC = () => {
  const { logout, setActiveSection, firebaseUser } = useQuiz();

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-amber-500/30 max-w-xl w-full text-center space-y-6 relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute -top-16 -right-16 w-56 h-56 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="w-20 h-20 rounded-3xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
          <Clock className="w-10 h-10 animate-pulse" />
        </div>

        <div className="space-y-2">
          <span className="text-xs uppercase font-extrabold tracking-widest text-amber-300 bg-amber-500/20 px-3 py-1 rounded-full border border-amber-500/30">
            Admin Approval Required
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-white">
            Your Teacher Access Request is Pending Admin Approval.
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
            Welcome to <span className="text-[#FF8C32] font-semibold">Sanskar-X-NarutoQuiz</span>. Until an Administrator approves your Teacher application, your account remains on standard Student access and Teacher Panel access is restricted.
          </p>
        </div>

        {/* Verification Checkpoints Card */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-left text-xs space-y-2.5">
          <div className="font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Institutional Role Verification Standard:
          </div>
          <div className="flex items-start gap-2 text-slate-300 text-[11px]">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
            <span>Credentials and academic qualifications are reviewed by Admin before assigning the Teacher role.</span>
          </div>
          <div className="flex items-start gap-2 text-slate-300 text-[11px]">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
            <span>Student Panel access, mock tests, and 5-option OMR practice drills remain active for you right now.</span>
          </div>
          <div className="flex items-start gap-2 text-slate-300 text-[11px]">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
            <span>Once approved by Admin, your Teacher Panel unlocks automatically.</span>
          </div>
        </div>

        {/* User Details */}
        {firebaseUser && (
          <div className="text-xs text-slate-400 font-mono">
            Signed in as: <strong className="text-white">{firebaseUser.email}</strong>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => setActiveSection('student-dashboard')}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#EA580C] to-[#FF8C32] hover:opacity-95 text-slate-950 font-bold text-xs shadow-lg transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <GraduationCap className="w-4 h-4" />
            <span>Open Student Panel</span>
          </button>
          <button
            onClick={() => setActiveSection('home')}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs transition cursor-pointer"
          >
            Explore Public Tests
          </button>
          <button
            onClick={logout}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-500/30 font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};
