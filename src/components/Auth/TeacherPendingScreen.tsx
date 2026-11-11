import React from 'react';
import {
  Clock,
  ShieldCheck,
  GraduationCap,
  LogOut,
  ArrowRight,
  Flame,
  CheckCircle2,
  FileText
} from 'lucide-react';
import { useQuiz } from '../../context/QuizContext';

export const TeacherPendingScreen: React.FC = () => {
  const { logout, setActiveSection, currentRole, firebaseUser } = useQuiz();

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
            Jonin Educator Verification
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-white">
            Teacher Application Pending Approval
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
            Welcome to <span className="text-[#FF8C32] font-semibold">Sanskar-X-NarutoQuiz</span>. Your educator profile has been submitted and is currently awaiting verification by the Hokage Administration.
          </p>
        </div>

        {/* Verification Checkpoints Card */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-left text-xs space-y-2.5">
          <div className="font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Institutional Quality Standard:
          </div>
          <div className="flex items-start gap-2 text-slate-300 text-[11px]">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
            <span>Credentials and academic qualifications are audited before test-authoring rights are granted.</span>
          </div>
          <div className="flex items-start gap-2 text-slate-300 text-[11px]">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
            <span>5-option OMR question formatting guidelines are enforced on all authored questions.</span>
          </div>
          <div className="flex items-start gap-2 text-slate-300 text-[11px]">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
            <span>Once approved, you will have access to create and submit competitive mock tests.</span>
          </div>
        </div>

        {/* User Details */}
        {firebaseUser && (
          <div className="text-xs text-slate-400 font-mono">
            Registered as: <strong className="text-white">{firebaseUser.email}</strong>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={() => setActiveSection('home')}
            className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs transition cursor-pointer"
          >
            Explore Public Tests
          </button>
          <button
            onClick={logout}
            className="px-5 py-2.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-500/30 font-bold text-xs transition flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};
