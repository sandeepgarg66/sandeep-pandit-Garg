import React from 'react';
import { Send, AlertTriangle, CheckCircle, HelpCircle, X } from 'lucide-react';
import { useQuiz } from '../../context/QuizContext';

interface SubmitConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SubmitConfirmationModal: React.FC<SubmitConfirmationModalProps> = ({ isOpen, onClose }) => {
  const { activeExam, submitTest } = useQuiz();

  if (!isOpen || !activeExam.test) return null;
  const test = activeExam.test;
  const total = test.questions.length;

  let answeredCount = 0;
  let markedCount = 0;
  let unattemptedCount = 0;

  test.questions.forEach((q) => {
    const ans = activeExam.answers[q.id];
    const state = activeExam.questionStates[q.id];
    if (ans) {
      answeredCount++;
    } else {
      unattemptedCount++;
    }
    if (state === 'marked_for_review' || state === 'answered_and_marked') {
      markedCount++;
    }
  });

  const handleFinalSubmit = () => {
    onClose();
    submitTest();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B0F19]/80 backdrop-blur-md">
      <div className="w-full max-w-lg bg-slate-900 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-orange-500/20 text-[#FF8C32] flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-lg text-white">
                Final Examination Submission
              </h3>
              <p className="text-xs text-slate-400">{test.title}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Question Status Tally Grid */}
        <div className="grid grid-cols-4 gap-2.5 text-center">
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Total</span>
            <span className="font-mono text-xl sm:text-2xl font-extrabold text-white">{total}</span>
          </div>

          <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-1">
            <span className="text-[10px] uppercase font-bold text-emerald-400 block">Answered</span>
            <span className="font-mono text-xl sm:text-2xl font-extrabold text-white">{answeredCount}</span>
          </div>

          <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 space-y-1">
            <span className="text-[10px] uppercase font-bold text-rose-400 block">Unanswered</span>
            <span className="font-mono text-xl sm:text-2xl font-extrabold text-white">{unattemptedCount}</span>
          </div>

          <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/20 space-y-1">
            <span className="text-[10px] uppercase font-bold text-purple-400 block">Review</span>
            <span className="font-mono text-xl sm:text-2xl font-extrabold text-white">{markedCount}</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-xs text-slate-300 space-y-2">
          <p>
            <strong>Are you sure you want to finalize and submit?</strong>
          </p>
          <p className="text-slate-400 text-[11px]">
            Once finally submitted, your test answers cannot be revised. Your official score, ranking, and detailed answer review with explanations will be generated immediately.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-slate-300 font-semibold text-xs transition cursor-pointer"
          >
            Go Back to Test
          </button>

          <button
            onClick={handleFinalSubmit}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Final Submit</span>
          </button>
        </div>
      </div>
    </div>
  );
};
