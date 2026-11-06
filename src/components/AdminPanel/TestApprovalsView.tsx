import React, { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  FileText,
  Clock,
  Award,
  Zap,
  ShieldCheck,
  Send
} from 'lucide-react';
import { useQuiz } from '../../context/QuizContext';
import { Test } from '../../types/quiz';

export const TestApprovalsView: React.FC = () => {
  const { tests, approveTest, rejectTest } = useQuiz();
  const [expandedTestId, setExpandedTestId] = useState<string | null>(null);
  const [rejectingTestId, setRejectingTestId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const pendingTests = tests.filter(t => t.status === 'Pending Approval');

  const toggleExpand = (id: string) => {
    setExpandedTestId(prev => (prev === id ? null : id));
  };

  const handleConfirmReject = (id: string) => {
    rejectTest(id, rejectReason || 'Did not meet institutional quality standards.');
    setRejectingTestId(null);
    setRejectReason('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-extrabold text-white">
            Educator Test Approvals Queue
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Institutional verification of tests drafted by Jonin Educators prior to candidate catalog deployment.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-amber-300 bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/20">
            Pending Moderation: {pendingTests.length} Submissions
          </span>
        </div>
      </div>

      {/* Guidelines Card */}
      <div className="glass-panel p-4 rounded-2xl border border-white/10 flex items-start gap-3 bg-slate-900/40">
        <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-300 space-y-1">
          <div className="font-bold text-white">Strict Quality Checklist:</div>
          <p className="text-slate-400 text-[11px]">
            1. Ensure all questions contain exactly 4 factual options (A–D). Option E is dynamically handled by the engine.<br />
            2. Verify accurate marking scheme and negative marking penalty ratio.<br />
            3. Ensure explanations are unambiguous and scientifically or constitutionally accurate.
          </p>
        </div>
      </div>

      {/* Pending Tests List */}
      {pendingTests.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl border border-white/10 text-center space-y-3">
          <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
          <h3 className="font-heading font-bold text-lg text-white">
            Approvals Queue Is Completely Clear!
          </h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            All teacher test submissions have been thoroughly reviewed. New tests submitted by educators will appear here immediately.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingTests.map(test => {
            const isExpanded = expandedTestId === test.id;
            const isRejecting = rejectingTestId === test.id;

            return (
              <div
                key={test.id}
                className="glass-panel rounded-2xl border border-amber-500/30 overflow-hidden transition"
              >
                {/* Test Summary Bar */}
                <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/50">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded">
                        {test.category}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">{test.subject}</span>
                    </div>

                    <h3 className="font-heading font-bold text-base text-white">
                      {test.title}
                    </h3>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                      <span>By: <strong className="text-slate-200">{test.teacherName || test.createdBy}</strong></span>
                      <span>•</span>
                      <span>{test.questions.length} Questions</span>
                      <span>•</span>
                      <span>{test.durationMinutes} mins</span>
                      <span>•</span>
                      <span>{test.maxMarks} Max Marks</span>
                      <span>•</span>
                      <span>{test.negativeMarkingEnabled ? `-${test.negativeMarks} Negative` : 'No Negative'}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => toggleExpand(test.id)}
                      className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <span>{isExpanded ? 'Hide Questions' : 'Inspect Questions'}</span>
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>

                    <button
                      onClick={() => setRejectingTestId(test.id)}
                      className="px-3.5 py-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 text-xs font-semibold border border-rose-500/30 transition cursor-pointer"
                    >
                      Reject
                    </button>

                    <button
                      onClick={() => approveTest(test.id)}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Approve & Publish</span>
                    </button>
                  </div>
                </div>

                {/* Reject Note Drawer */}
                {isRejecting && (
                  <div className="p-4 bg-rose-950/20 border-t border-rose-500/20 space-y-3">
                    <div className="text-xs font-bold text-rose-300">
                      Provide Rejection Feedback for Educator:
                    </div>
                    <textarea
                      rows={2}
                      placeholder="Specify rationale (e.g. Questions need clearer explanations, incorrect marks calculation, typos)..."
                      value={rejectReason}
                      onChange={e => setRejectReason(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-white/10 rounded-xl text-xs text-white"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setRejectingTestId(null)}
                        className="px-3 py-1.5 rounded-lg bg-white/5 text-slate-300 text-xs font-semibold"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleConfirmReject(test.id)}
                        className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold"
                      >
                        Confirm Rejection
                      </button>
                    </div>
                  </div>
                )}

                {/* Expandable Question Inspection */}
                {isExpanded && (
                  <div className="p-5 border-t border-white/10 bg-black/40 space-y-4">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span className="font-bold text-slate-200 uppercase tracking-wider">
                        Question Sheet Verification ({test.questions.length} Total)
                      </span>
                      <span className="text-[11px] text-emerald-400 font-mono">
                        OMR Option E Auto-Enabled
                      </span>
                    </div>

                    <div className="space-y-4">
                      {test.questions.map((q, idx) => (
                        <div
                          key={q.id || idx}
                          className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-2.5 text-xs"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="font-bold text-white">
                              <span className="text-[#FF8C32] mr-1.5">Q{idx + 1}.</span>
                              {q.statement}
                            </div>
                            <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[10px] font-mono shrink-0">
                              {q.marks} Marks
                            </span>
                          </div>

                          {q.statementHindi && (
                            <div className="text-slate-300 italic text-[11px] pl-4 border-l border-white/10">
                              {q.statementHindi}
                            </div>
                          )}

                          {/* Options Grid */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                            {(['A', 'B', 'C', 'D'] as const).map(optKey => {
                              const isCorrect = q.correctAnswer === optKey;
                              return (
                                <div
                                  key={optKey}
                                  className={`p-2.5 rounded-lg border text-xs flex items-center gap-2 ${
                                    isCorrect
                                      ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200 font-semibold'
                                      : 'bg-white/5 border-white/5 text-slate-300'
                                  }`}
                                >
                                  <span className={`w-5 h-5 rounded flex items-center justify-center font-bold text-[10px] ${
                                    isCorrect ? 'bg-emerald-500 text-slate-950' : 'bg-white/10 text-slate-400'
                                  }`}>
                                    {optKey}
                                  </span>
                                  <span>{q.options[optKey]}</span>
                                  {isCorrect && (
                                    <span className="ml-auto text-[10px] font-bold text-emerald-400 uppercase">
                                      Key
                                    </span>
                                  )}
                                </div>
                              );
                            })}
                          </div>

                          <div className="p-2.5 rounded-lg bg-slate-900/70 border border-white/5 text-[11px] text-slate-400">
                            <strong className="text-slate-300">Explanation: </strong>
                            {q.explanation}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
