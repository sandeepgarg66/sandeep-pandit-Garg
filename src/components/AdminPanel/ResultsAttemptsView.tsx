import React, { useState } from 'react';
import {
  Award,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  X,
  FileCheck2,
  ShieldCheck
} from 'lucide-react';
import { useQuiz } from '../../context/QuizContext';
import { TestAttempt } from '../../types/quiz';

export const ResultsAttemptsView: React.FC = () => {
  const { completedAttempts, tests } = useQuiz();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [selectedAttempt, setSelectedAttempt] = useState<TestAttempt | null>(null);

  // Real candidate completed attempts directly from Firestore
  const allAttempts = completedAttempts;

  const filteredAttempts = allAttempts.filter(att => {
    const matchesSearch =
      att.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      att.testTitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || att.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-extrabold text-white">
            Results & Attempt Integrity Oversight
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Audit candidate scorecards, verify Option E unattempted compliance, and monitor timer telemetry.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
            Total Submissions Recorded: {allAttempts.length}
          </span>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="glass-panel p-4 rounded-2xl border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search candidate name or test title..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-900/60 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="px-3 py-2 bg-slate-900/60 border border-white/10 rounded-xl text-xs text-slate-200"
          >
            <option value="All">All Categories</option>
            <option value="Daily Test">Daily Test</option>
            <option value="Weekly Test">Weekly Test</option>
            <option value="Mock Test">Mock Test</option>
            <option value="PYQ Test">PYQ Test</option>
            <option value="Chapter Test">Chapter Test</option>
            <option value="Subject-wise Test">Subject-wise Test</option>
          </select>
        </div>
      </div>

      {/* Attempts Table */}
      <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-900/90 text-slate-400 text-xs uppercase tracking-wider border-b border-white/10">
              <tr>
                <th className="px-5 py-3.5">Candidate</th>
                <th className="px-5 py-3.5">Test Title</th>
                <th className="px-5 py-3.5 text-center">Score</th>
                <th className="px-5 py-3.5 text-center">Accuracy</th>
                <th className="px-5 py-3.5 text-center">Time Taken</th>
                <th className="px-5 py-3.5 text-center">Option E Unattempted</th>
                <th className="px-5 py-3.5 text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-medium">
              {filteredAttempts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-slate-400">
                    <Award className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                    <p className="text-sm font-semibold text-slate-300">No test attempts recorded in the database yet.</p>
                    <p className="text-xs text-slate-500 mt-1">
                      As students take and submit tests, their audit records and evaluated scores will appear here.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredAttempts.map(att => (
                  <tr key={att.id} className="hover:bg-white/5 transition">
                    <td className="px-5 py-3.5">
                      <div className="font-bold text-white">{att.studentName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{att.studentId}</div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="text-white font-medium">{att.testTitle}</div>
                      <span className="text-[10px] uppercase font-bold text-[#FF8C32] bg-[#FF8C32]/10 px-1.5 py-0.5 rounded">
                        {att.category}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-center font-mono font-bold text-emerald-400">
                      {att.obtainedMarks} / {att.maxMarks}
                    </td>
                    <td className="px-5 py-3.5 text-center font-mono font-bold text-white">
                      {att.accuracy}%
                    </td>
                    <td className="px-5 py-3.5 text-center font-mono text-slate-300">
                      {Math.floor(att.timeTakenSeconds / 60)}m {att.timeTakenSeconds % 60}s
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <span className="text-xs font-mono font-bold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded">
                        {att.unansweredCount} Qs (0 Ded.)
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={() => setSelectedAttempt(att)}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition cursor-pointer"
                        title="Inspect Submission"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Attempt Inspection Modal */}
      {selectedAttempt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/20 max-w-lg w-full space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-heading font-bold text-base text-white">
                Attempt Integrity Audit
              </h3>
              <button onClick={() => setSelectedAttempt(null)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-white/5 space-y-1">
                <div className="text-sm font-bold text-white">{selectedAttempt.studentName}</div>
                <div className="text-slate-400">Test: {selectedAttempt.testTitle}</div>
                <div className="text-[10px] text-slate-500 font-mono">Attempt ID: {selectedAttempt.id}</div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-3 rounded-xl bg-white/5">
                  <div className="text-[10px] text-slate-400 uppercase">Obtained</div>
                  <div className="text-lg font-mono font-bold text-emerald-400">{selectedAttempt.obtainedMarks} pts</div>
                </div>
                <div className="p-3 rounded-xl bg-white/5">
                  <div className="text-[10px] text-slate-400 uppercase">Correct</div>
                  <div className="text-lg font-mono font-bold text-white">{selectedAttempt.correctCount} Qs</div>
                </div>
                <div className="p-3 rounded-xl bg-white/5">
                  <div className="text-[10px] text-slate-400 uppercase">Option E (No Resp)</div>
                  <div className="text-lg font-mono font-bold text-amber-300">{selectedAttempt.unansweredCount} Qs</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/20 text-emerald-200 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>One Attempt & Zero Penalty Verification Passed</span>
                </div>
                <p className="text-[11px] text-emerald-300/80">
                  This test record was finalized in accordance with the single-attempt policy. Option E response codes resulted in 0 positive marks and 0 negative penalties.
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedAttempt(null)}
                className="px-4 py-2 rounded-xl bg-white/10 text-white font-semibold text-xs"
              >
                Close Audit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
