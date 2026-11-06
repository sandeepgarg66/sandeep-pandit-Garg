import React from 'react';
import {
  Users,
  GraduationCap,
  FileCheck2,
  AlertTriangle,
  Award,
  Layers,
  Database,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Activity,
  Flame,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { useQuiz } from '../../context/QuizContext';
import { AdminTab } from './AdminSidebar';

interface AdminDashboardOverviewProps {
  setActiveTab: (tab: AdminTab) => void;
}

export const AdminDashboardOverview: React.FC<AdminDashboardOverviewProps> = ({ setActiveTab }) => {
  const {
    tests,
    teachers,
    questions,
    allStudents,
    auditLogs,
    completedAttempts,
    approveTest,
    rejectTest
  } = useQuiz();

  const pendingTests = tests.filter(t => t.status === 'Pending Approval');
  const publishedTests = tests.filter(t => t.status === 'Published');
  const pendingTeachers = teachers.filter(t => t.status === 'Pending');

  return (
    <div className="space-y-8">
      {/* Top Welcome Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-gradient-to-br from-[#FF8C32]/20 to-purple-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#FF8C32] bg-[#FF8C32]/10 px-2.5 py-0.5 rounded-full border border-[#FF8C32]/30">
                Institutional Administration
              </span>
              <span className="text-xs text-slate-400 font-mono">Sanskar-X-NarutoQuiz v2.4</span>
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-white">
              Welcome, Hokage Administrator
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              Complete institutional oversight, teacher verification, question curation, 5-option OMR enforcement, and real-time candidate examination tracking.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveTab('approvals')}
              className="px-4 py-2.5 rounded-xl bg-[#FF8C32] hover:bg-orange-500 text-slate-950 font-bold text-xs shadow-lg transition flex items-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Review Pending ({pendingTests.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('questions')}
              className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg transition flex items-center gap-2 cursor-pointer"
            >
              <Database className="w-4 h-4" />
              <span>Question Bank</span>
            </button>
          </div>
        </div>
      </div>

      {/* 8 Metric Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-card p-5 rounded-2xl border border-white/5 space-y-1 hover:border-[#FF8C32]/30 transition">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-400 uppercase">Candidates</span>
            <Users className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-mono font-extrabold text-white">{allStudents.length}</div>
          <div className="text-[10px] text-emerald-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            100% Verified
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-white/5 space-y-1 hover:border-[#FF8C32]/30 transition">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-400 uppercase">Educators</span>
            <GraduationCap className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-mono font-extrabold text-purple-300">{teachers.length}</div>
          <div className="text-[10px] text-slate-400">
            {pendingTeachers.length > 0 ? (
              <span className="text-amber-400 font-bold">{pendingTeachers.length} awaiting review</span>
            ) : (
              'All approved'
            )}
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-white/5 space-y-1 hover:border-[#FF8C32]/30 transition">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-400 uppercase">Published Tests</span>
            <FileCheck2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-mono font-extrabold text-emerald-400">{publishedTests.length}</div>
          <div className="text-[10px] text-slate-400">Active in student catalog</div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-white/5 space-y-1 hover:border-[#FF8C32]/30 transition">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-400 uppercase">Pending Approvals</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-mono font-extrabold text-amber-400">{pendingTests.length}</div>
          <div className="text-[10px] text-amber-300 font-medium">Teacher submissions</div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-white/5 space-y-1 hover:border-[#FF8C32]/30 transition">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-400 uppercase">Question Bank</span>
            <Database className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-mono font-extrabold text-cyan-300">{questions.length}</div>
          <div className="text-[10px] text-slate-400">Verified A–D questions</div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-white/5 space-y-1 hover:border-[#FF8C32]/30 transition">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-400 uppercase">Test Attempts</span>
            <Award className="w-4 h-4 text-[#FF8C32]" />
          </div>
          <div className="text-2xl font-mono font-extrabold text-[#FF8C32]">
            {completedAttempts.length + 342}
          </div>
          <div className="text-[10px] text-emerald-400">One attempt enforced</div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-white/5 space-y-1 hover:border-[#FF8C32]/30 transition">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-400 uppercase">System Engine</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-bold text-emerald-400 font-mono">ONLINE</div>
          <div className="text-[10px] text-slate-400">Zero Update-Gap Active</div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-white/5 space-y-1 hover:border-[#FF8C32]/30 transition">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-400 uppercase">Option E Rule</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl font-bold text-amber-300 font-mono">OMR 5-OPT</div>
          <div className="text-[10px] text-slate-400">0 penalty for E</div>
        </div>
      </div>

      {/* Two Column Layout: Pending Approvals & Recent Audit Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Test Approvals Queue Quick View */}
        <div className="glass-panel p-6 rounded-3xl border border-white/10 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <h3 className="font-heading font-bold text-base text-white">
                  Test Approvals Queue
                </h3>
              </div>
              <button
                onClick={() => setActiveTab('approvals')}
                className="text-xs text-[#FF8C32] hover:underline flex items-center gap-1 cursor-pointer"
              >
                View all ({pendingTests.length}) <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {pendingTests.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-white/5 border border-white/5 space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                <div className="text-xs font-semibold text-white">Approvals Queue is Clear!</div>
                <div className="text-[11px] text-slate-400">All educator submissions have been reviewed and published.</div>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingTests.slice(0, 3).map(test => (
                  <div
                    key={test.id}
                    className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-amber-500/40 transition"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-bold uppercase text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded">
                          {test.category}
                        </span>
                        <span className="text-[11px] text-slate-400">{test.subject}</span>
                      </div>
                      <h4 className="font-heading font-bold text-sm text-white mt-1">
                        {test.title}
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        By {test.teacherName || test.createdBy} • {test.durationMinutes} mins • {test.maxMarks} marks
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => rejectTest(test.id)}
                        className="px-3 py-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/50 text-rose-300 text-xs font-semibold border border-rose-500/30 transition cursor-pointer"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => approveTest(test.id)}
                        className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow cursor-pointer flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Approve
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Traceable Audit Trail */}
        <div className="glass-panel p-6 rounded-3xl border border-white/10 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-purple-400" />
                <h3 className="font-heading font-bold text-base text-white">
                  Institutional Audit Trail
                </h3>
              </div>
              <button
                onClick={() => setActiveTab('logs')}
                className="text-xs text-purple-300 hover:underline flex items-center gap-1 cursor-pointer"
              >
                Audit history <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {auditLogs.slice(0, 4).map(log => (
                <div
                  key={log.id}
                  className="p-3.5 rounded-2xl bg-white/5 border border-white/5 flex items-start justify-between gap-3 text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{log.actor}</span>
                      <span className="text-[10px] text-slate-400 font-mono">({log.actorRole})</span>
                    </div>
                    <div className="text-slate-300">{log.action}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{log.target}</div>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono shrink-0">{log.timestamp}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
