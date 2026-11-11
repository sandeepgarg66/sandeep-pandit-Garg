import React, { useState } from 'react';
import {
  GraduationCap,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  Flame,
  Briefcase,
  AlertCircle
} from 'lucide-react';
import { useQuiz } from '../../context/QuizContext';

export const RoleSelectionModal: React.FC = () => {
  const {
    isRoleSelectionModalOpen,
    setIsRoleSelectionModalOpen,
    assignRoleToCurrentUser,
    firebaseUser
  } = useQuiz();

  const [selectedRole, setSelectedRole] = useState<'student' | 'teacher' | null>(null);
  const [qualification, setQualification] = useState('');
  const [specialization, setSpecialization] = useState('Indian Polity & Governance');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isRoleSelectionModalOpen) return null;

  const handleContinueStudent = async () => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      await assignRoleToCurrentUser('student');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to assign Student role.');
      setIsLoading(false);
    }
  };

  const handleContinueTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');
    try {
      await assignRoleToCurrentUser('teacher', {
        qualification: qualification.trim() || 'Academic Faculty',
        specialization: specialization.trim()
      });
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit Educator registration.');
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md">
      <div className="glass-panel p-5 sm:p-8 rounded-2xl sm:rounded-3xl border border-white/20 max-w-xl w-full space-y-6 relative overflow-hidden max-h-[92vh] overflow-y-auto custom-scrollbar shadow-2xl">
        {/* Subtle glow */}
        <div className="absolute -top-16 -right-16 w-56 h-56 bg-[#FF8C32]/15 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="text-center space-y-2 border-b border-white/10 pb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF8C32]/15 border border-[#FF8C32]/30 text-[#FF8C32] text-xs font-bold tracking-wider uppercase">
            <Flame className="w-3.5 h-3.5" />
            <span>Welcome to Sanskar-X-NarutoQuiz</span>
          </div>

          <h2 className="font-heading text-xl sm:text-2xl font-extrabold text-white mt-1">
            आप Sanskar-X-NarutoQuiz पर किस रूप में जुड़ना चाहते हैं?
          </h2>
          <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
            Please select your primary participation track. Your choice configures your workspace and permissions.
          </p>
          {firebaseUser && (
            <div className="text-[11px] text-slate-400 font-mono">
              Signed in as: <span className="text-[#FF8C32] font-semibold">{firebaseUser.email || firebaseUser.displayName}</span>
            </div>
          )}
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* STEP 1: Two Options Selection */}
        {selectedRole !== 'teacher' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* OPTION 1: STUDENT */}
            <div
              onClick={() => setSelectedRole('student')}
              className={`glass-card p-5 rounded-2xl border transition cursor-pointer flex flex-col justify-between space-y-4 group ${
                selectedRole === 'student'
                  ? 'border-[#FF8C32] bg-[#FF8C32]/10 shadow-lg shadow-orange-500/10'
                  : 'border-white/10 hover:border-[#FF8C32]/50 hover:bg-white/5'
              }`}
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#EA580C]/20 to-[#FF8C32]/20 border border-[#FF8C32]/40 flex items-center justify-center text-[#FF8C32] group-hover:scale-105 transition">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-heading font-extrabold text-lg text-white">
                    Student (विद्यार्थी)
                  </h3>
                  <p className="text-[11px] text-[#FF8C32] font-semibold">
                    Competitive Examination Aspirant
                  </p>
                </div>
                <ul className="text-xs text-slate-300 space-y-1.5 pt-1">
                  <li className="flex items-start gap-1.5 text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Register as Student</span>
                  </li>
                  <li className="flex items-start gap-1.5 text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Access Student Dashboard</span>
                  </li>
                  <li className="flex items-start gap-1.5 text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Attempt published tests with 5-Option OMR</span>
                  </li>
                  <li className="flex items-start gap-1.5 text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Practice MCQs & view results/performance</span>
                  </li>
                  <li className="flex items-start gap-1.5 text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Access leaderboards and bookmarks</span>
                  </li>
                </ul>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleContinueStudent();
                }}
                disabled={isLoading}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#EA580C] to-[#FF8C32] text-slate-950 font-bold text-xs shadow-md transition hover:opacity-95 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <span>{isLoading ? 'Setting up...' : 'Continue as Student'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* OPTION 2: TEACHER */}
            <div
              onClick={() => setSelectedRole('teacher')}
              className="glass-card p-5 rounded-2xl border border-white/10 hover:border-purple-400 hover:bg-purple-500/5 transition cursor-pointer flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-500/20 to-indigo-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300 group-hover:scale-105 transition">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-heading font-extrabold text-lg text-white">
                    Teacher (शिक्षक / परीक्षक)
                  </h3>
                  <p className="text-[11px] text-purple-300 font-semibold">
                    Academic Faculty & Test Author
                  </p>
                </div>
                <ul className="text-xs text-slate-300 space-y-1.5 pt-1">
                  <li className="flex items-start gap-1.5 text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                    <span>Register as Teacher</span>
                  </li>
                  <li className="flex items-start gap-1.5 text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                    <span>Access Teacher Dashboard after approval</span>
                  </li>
                  <li className="flex items-start gap-1.5 text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                    <span>Create MCQ questions & mock tests</span>
                  </li>
                  <li className="flex items-start gap-1.5 text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                    <span>Manage & edit your authored tests</span>
                  </li>
                  <li className="flex items-start gap-1.5 text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                    <span>Also use all Student Panel features!</span>
                  </li>
                </ul>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedRole('teacher');
                }}
                className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Continue as Teacher</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: TEACHER DETAILS PROMPT */}
        {selectedRole === 'teacher' && (
          <form onSubmit={handleContinueTeacher} className="space-y-4">
            <div className="p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-xs text-purple-200">
              <span className="font-bold">Jonin Verification Protocol:</span> Teachers can author tests, submit assessments for review, and also access all Student Panel drills.
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-slate-300 font-semibold text-xs mb-1">
                  Academic Qualification / Faculty Designation *
                </label>
                <div className="relative">
                  <Briefcase className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. M.Sc, Ph.D, UGC-NET Qualified, Civil Services Mentor"
                    value={qualification}
                    onChange={e => setQualification(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-white text-xs placeholder-slate-500 focus:outline-none focus:border-purple-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold text-xs mb-1">
                  Primary Subject Domain *
                </label>
                <select
                  value={specialization}
                  onChange={e => setSpecialization(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-purple-400"
                >
                  <option value="Indian Polity & Governance">Indian Polity & Governance</option>
                  <option value="General Science & Technology">General Science & Technology</option>
                  <option value="History of India & National Movement">History of India & National Movement</option>
                  <option value="Quantitative Aptitude & CSAT">Quantitative Aptitude & CSAT</option>
                  <option value="Logical Reasoning & Analytical Ability">Logical Reasoning & Analytical Ability</option>
                  <option value="Ecology, Environment & Geography">Ecology, Environment & Geography</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSelectedRole(null)}
                className="px-4 py-2 rounded-xl border border-white/10 hover:bg-white/5 text-slate-300 text-xs font-semibold cursor-pointer"
              >
                Back
              </button>

              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <span>{isLoading ? 'Submitting Application...' : 'Submit & Register as Teacher'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
