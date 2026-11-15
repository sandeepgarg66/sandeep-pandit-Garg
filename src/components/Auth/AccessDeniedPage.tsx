import React from 'react';
import { ShieldAlert, Lock, Home, LayoutDashboard, LogIn, ArrowLeft } from 'lucide-react';
import { useQuiz } from '../../context/QuizContext';
import { UserRole } from '../../types/quiz';

interface AccessDeniedPageProps {
  requiredRole: UserRole;
  attemptedSection?: string;
}

export const AccessDeniedPage: React.FC<AccessDeniedPageProps> = ({
  requiredRole,
  attemptedSection
}) => {
  const {
    firebaseUser,
    verifiedRole,
    setActiveSection,
    openAuthModal
  } = useQuiz();

  const roleLabels: Record<UserRole, string> = {
    student: 'Verified Student',
    teacher: 'Verified Educator (Teacher)',
    admin: 'Verified Platform Administrator'
  };

  const handleGoToAuthorizedDashboard = () => {
    if (!firebaseUser) {
      openAuthModal('login');
      return;
    }
    if (verifiedRole === 'admin') {
      setActiveSection('admin-dashboard');
    } else if (verifiedRole === 'teacher') {
      setActiveSection('student-dashboard');
    } else {
      setActiveSection('student-dashboard');
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="glass-panel max-w-lg w-full p-6 sm:p-10 rounded-3xl border border-rose-500/30 text-center space-y-6 relative overflow-hidden shadow-2xl">
        <div className="absolute -top-20 -right-20 w-56 h-56 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-rose-500/15 border border-rose-500/40 flex items-center justify-center mx-auto text-rose-400">
          <ShieldAlert className="w-8 h-8 sm:w-10 sm:h-10" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 text-[11px] font-bold uppercase tracking-wider font-mono">
            <Lock className="w-3.5 h-3.5" />
            <span>403 • Access Denied</span>
          </div>

          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-white">
            Unauthorized Route Access Blocked
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {firebaseUser ? (
              <>
                This workspace requires <strong className="text-[#FF8C32]">{roleLabels[requiredRole]}</strong> permissions. Your account is currently verified as{' '}
                <strong className="text-white uppercase font-mono">
                  {verifiedRole || 'Unverified'}
                </strong>
                .
              </>
            ) : (
              <>
                You must be signed in with a <strong className="text-[#FF8C32]">{roleLabels[requiredRole]}</strong> account to access this protected area.
              </>
            )}
          </p>
        </div>

        {attemptedSection && (
          <div className="p-3 rounded-xl bg-slate-900/80 border border-white/10 text-[11px] text-slate-400 font-mono">
            Blocked Route: <span className="text-rose-300">{attemptedSection}</span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          {!firebaseUser ? (
            <button
              onClick={() => openAuthModal('login')}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#EA580C] to-[#FF8C32] hover:opacity-95 text-slate-950 font-bold text-xs shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In to Continue</span>
            </button>
          ) : (
            <button
              onClick={handleGoToAuthorizedDashboard}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#EA580C] to-[#FF8C32] hover:opacity-95 text-slate-950 font-bold text-xs shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Open My Authorized Dashboard</span>
            </button>
          )}

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
