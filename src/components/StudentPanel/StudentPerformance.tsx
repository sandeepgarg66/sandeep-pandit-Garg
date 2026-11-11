import React from 'react';
import { TrendingUp, CheckCircle, XCircle, AlertCircle, Clock, Target, Award, ArrowUpRight } from 'lucide-react';
import { useQuiz } from '../../context/QuizContext';

export const StudentPerformance: React.FC = () => {
  const { studentProfile, completedAttempts } = useQuiz();

  const totalCorrect = completedAttempts.reduce((acc, a) => acc + a.correctCount, 0);
  const totalWrong = completedAttempts.reduce((acc, a) => acc + a.wrongCount, 0);
  const totalUnattempted = completedAttempts.reduce((acc, a) => acc + a.unansweredCount, 0);

  // Dynamically compute subject breakdown from genuine completed attempts
  const subjectMap: Record<string, { subject: string; correct: number; total: number }> = {};
  completedAttempts.forEach(att => {
    const s = att.subject || 'General Assessment';
    if (!subjectMap[s]) {
      subjectMap[s] = { subject: s, correct: 0, total: 0 };
    }
    subjectMap[s].correct += att.correctCount;
    subjectMap[s].total += att.correctCount + att.wrongCount + att.unansweredCount;
  });

  const subjectBreakdown = Object.values(subjectMap).map(item => ({
    subject: item.subject,
    accuracy: item.total > 0 ? Math.round((item.correct / item.total) * 100) : 0,
    total: item.total,
    correct: item.correct
  }));

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Header */}
      <div>
        <div className="text-xs uppercase tracking-wider text-[#FF8C32] font-semibold mb-1">
          Analytical Intelligence
        </div>
        <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-white">
          Performance & Accuracy Report
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Detailed metrics based on all submitted tests with negative marking deduction analytics.
        </p>
      </div>

      {/* KPI 4-Card Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-5 rounded-2xl border border-white/5 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] uppercase tracking-wider font-semibold">Overall Accuracy</span>
            <Target className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-emerald-400 pt-1">
            {studentProfile.averageAccuracy}%
          </div>
          <div className="text-[10px] text-slate-400">Based on {studentProfile.totalQuestionsSolved} questions</div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-white/5 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] uppercase tracking-wider font-semibold">Correct Answers</span>
            <CheckCircle className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-white pt-1">
            {totalCorrect}
          </div>
          <div className="text-[10px] text-emerald-400 font-semibold">+2 marks awarded each</div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-white/5 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] uppercase tracking-wider font-semibold">Wrong Answers</span>
            <XCircle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-rose-400 pt-1">
            {totalWrong}
          </div>
          <div className="text-[10px] text-rose-400 font-semibold">Negative deductions applied</div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-white/5 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] uppercase tracking-wider font-semibold">Unanswered (Opt E)</span>
            <AlertCircle className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-slate-300 pt-1">
            {totalUnattempted}
          </div>
          <div className="text-[10px] text-slate-400">0 penalty / protected</div>
        </div>
      </div>

      {/* Subject-wise Mastery Progress Bars */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6">
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <div>
            <h3 className="font-heading font-bold text-lg text-white">
              Subject-wise Mastery Breakdown
            </h3>
            <p className="text-xs text-slate-400">Accuracy rate across verified competitive test subjects</p>
          </div>
          <span className="text-xs text-[#FF8C32] font-mono font-bold">
            {subjectBreakdown.length} Tracked Subject{subjectBreakdown.length === 1 ? '' : 's'}
          </span>
        </div>

        {subjectBreakdown.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400 space-y-2">
            <p>No subject performance data recorded yet.</p>
            <p className="text-slate-500">Attempt published tests across different subjects to generate your mastery metrics.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {subjectBreakdown.map((sb, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white">{sb.subject}</span>
                  <span className="font-mono text-slate-300">
                    <strong className="text-emerald-400">{sb.accuracy}%</strong> ({sb.correct}/{sb.total} Correct)
                  </span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-orange-500 to-[#FF8C32] rounded-full"
                    style={{ width: `${sb.accuracy}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Test Attempt History Table */}
      <div className="space-y-4">
        <h3 className="font-heading font-bold text-lg text-white">
          Completed Test Attempt Records
        </h3>

        <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden">
          {completedAttempts.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400 space-y-2">
              <p>You haven't completed any assessments in this active session yet.</p>
              <p className="text-[#FF8C32]">Go to New Tests to attempt your first official timed exam!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-900/90 text-slate-400 text-xs uppercase tracking-wider border-b border-white/10">
                  <tr>
                    <th className="px-5 py-3.5">Assessment Name</th>
                    <th className="px-5 py-3.5">Subject</th>
                    <th className="px-5 py-3.5 text-center">Score</th>
                    <th className="px-5 py-3.5 text-center">Accuracy</th>
                    <th className="px-5 py-3.5 text-center">Correct / Wrong</th>
                    <th className="px-5 py-3.5 text-right">Submitted At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-medium">
                  {completedAttempts.map((att) => (
                    <tr key={att.id} className="hover:bg-white/5 transition">
                      <td className="px-5 py-3.5 font-bold text-white">
                        {att.testTitle}
                      </td>
                      <td className="px-5 py-3.5 text-slate-400">
                        {att.subject}
                      </td>
                      <td className="px-5 py-3.5 text-center font-mono font-extrabold text-[#FF8C32]">
                        {att.obtainedMarks} / {att.maxMarks}
                      </td>
                      <td className="px-5 py-3.5 text-center font-mono font-bold text-emerald-400">
                        {att.accuracy}%
                      </td>
                      <td className="px-5 py-3.5 text-center font-mono text-xs">
                        <span className="text-emerald-400 font-bold">{att.correctCount}</span> / <span className="text-rose-400 font-bold">{att.wrongCount}</span>
                      </td>
                      <td className="px-5 py-3.5 text-right font-mono text-slate-400 text-xs">
                        {new Date(att.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
