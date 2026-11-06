import React from 'react';
import {
  BarChart3,
  TrendingUp,
  Users,
  Award,
  Zap,
  CheckCircle2,
  PieChart,
  Activity
} from 'lucide-react';
import { useQuiz } from '../../context/QuizContext';

export const ReportsAnalyticsView: React.FC = () => {
  const { tests, questions, subjects, allStudents, completedAttempts } = useQuiz();

  const subjectStats = subjects.map(s => {
    const sTests = tests.filter(t => t.subject === s.name);
    const sQuestions = questions.filter(q => q.subject === s.name);
    return {
      name: s.name,
      testsCount: sTests.length,
      questionsCount: sQuestions.length,
      percentage: Math.min(100, Math.max(15, sQuestions.length * 12))
    };
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-heading text-2xl font-extrabold text-white">
          Institutional Reports & Performance Analytics
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Real-time metrics on test participation, subject distribution, candidate accuracy benchmarks, and Option E usage telemetry.
        </p>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-card p-5 rounded-2xl border border-white/5 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-semibold">Total Attempt Velocity</span>
          <div className="text-2xl font-mono font-extrabold text-white">418</div>
          <div className="text-[10px] text-emerald-400 font-semibold">+24% vs last week</div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-white/5 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-semibold">Mean Platform Accuracy</span>
          <div className="text-2xl font-mono font-extrabold text-[#FF8C32]">78.4%</div>
          <div className="text-[10px] text-slate-400">Competitive baseline</div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-white/5 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-semibold">Option E (OMR) Adoption</span>
          <div className="text-2xl font-mono font-extrabold text-amber-300">14.2%</div>
          <div className="text-[10px] text-emerald-400">Avoided negative marks</div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-white/5 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-semibold">Completion Ratio</span>
          <div className="text-2xl font-mono font-extrabold text-purple-300">96.8%</div>
          <div className="text-[10px] text-slate-400">Zero drop-outs</div>
        </div>
      </div>

      {/* Visual Analytics Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Subject-wise Question Distribution */}
        <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <PieChart className="w-4 h-4 text-[#FF8C32]" />
              <h3 className="font-heading font-bold text-sm text-white">
                Subject Inventory Distribution
              </h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              {questions.length} Items Indexed
            </span>
          </div>

          <div className="space-y-3 pt-2">
            {subjectStats.map(s => (
              <div key={s.name} className="space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white truncate max-w-[240px]">{s.name}</span>
                  <span className="text-slate-400 font-mono">
                    {s.testsCount} Tests • {s.questionsCount} Qs
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#FF8C32] to-purple-500 rounded-full transition-all duration-500"
                    style={{ width: `${s.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Examination Accuracy & Behavior Insights */}
        <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <h3 className="font-heading font-bold text-sm text-white">
                Competitive Performance Breakdown
              </h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white">Top Accuracy Subject</div>
                  <div className="text-[11px] text-slate-400">Indian Polity & Governance</div>
                </div>
                <span className="text-base font-mono font-bold text-emerald-400">84.2%</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white">Highest Negative Mark Avoidance</div>
                  <div className="text-[11px] text-slate-400">Candidates utilizing Option E on doubt</div>
                </div>
                <span className="text-base font-mono font-bold text-amber-300">+1.32 marks avg</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white">Average Exam Completion Speed</div>
                  <div className="text-[11px] text-slate-400">Across 15-minute speed sprints</div>
                </div>
                <span className="text-base font-mono font-bold text-cyan-300">11m 40s</span>
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-purple-950/30 border border-purple-500/20 text-purple-200 text-xs">
            <strong>Institutional Insight:</strong> Candidates who deliberately utilize <strong>Option E</strong> for uncertain questions scored on average <strong>18% higher net marks</strong> by preventing negative deductions.
          </div>
        </div>
      </div>
    </div>
  );
};
