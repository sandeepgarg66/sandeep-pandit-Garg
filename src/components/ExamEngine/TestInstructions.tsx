import React, { useState } from 'react';
import { ShieldAlert, Clock, CheckCircle2, AlertTriangle, ArrowLeft, Play, Flame } from 'lucide-react';
import { useQuiz } from '../../context/QuizContext';

export const TestInstructions: React.FC = () => {
  const { activeExam, beginExamination, cancelExam, studentProfile } = useQuiz();
  const [agreed, setAgreed] = useState(false);

  if (!activeExam.test) return null;
  const test = activeExam.test;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-white/10 space-y-8 shadow-2xl">
        {/* Header Ribbon */}
        <div className="flex items-center justify-between border-b border-white/10 pb-6">
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#FF8C32] bg-[#FF8C32]/10 px-2.5 py-0.5 rounded">
              Official Examination Briefing
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-white">
              {test.title}
            </h2>
            <p className="text-xs text-slate-400">
              Subject: <strong className="text-slate-200">{test.subject}</strong> • Topic: <strong className="text-slate-200">{test.topic}</strong>
            </p>
          </div>

          <button
            onClick={cancelExam}
            className="p-2 text-slate-400 hover:text-white rounded-lg transition"
            title="Cancel & Go Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>

        {/* Test Specifications Summary Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-0.5">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Total Questions</span>
            <span className="font-mono text-base font-extrabold text-white">
              {test.questions.length} Questions
            </span>
          </div>

          <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-0.5">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Test Duration</span>
            <span className="font-mono text-base font-extrabold text-[#FF8C32]">
              {test.durationMinutes} Minutes
            </span>
          </div>

          <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-0.5">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Maximum Marks</span>
            <span className="font-mono text-base font-extrabold text-emerald-400">
              {test.maxMarks} Marks
            </span>
          </div>

          <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-0.5">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Marking Scheme</span>
            <span className="font-mono text-xs font-bold text-slate-200 block">
              +{test.marksPerCorrect} / {test.negativeMarkingEnabled ? `-${test.negativeMarks}` : '0'}
            </span>
          </div>
        </div>

        {/* Important Examination Rules */}
        <div className="space-y-4">
          <h3 className="font-heading font-bold text-base text-white flex items-center gap-2">
            <Flame className="w-4 h-4 text-[#FF8C32]" />
            <span>Important Shinobi Examination Rules & OMR Convention</span>
          </h3>

          <div className="p-5 rounded-2xl bg-slate-900 border border-orange-500/30 space-y-3 text-xs leading-relaxed">
            <div className="flex items-start gap-2 text-slate-200">
              <span className="font-bold text-[#FF8C32] shrink-0 font-mono">1.</span>
              <span>
                <strong>CRITICAL OPTION E CONVENTION:</strong> Each question contains 5 response options (A to E). <strong>Option E represents "Unattempted / No Response" (अनुत्तरित)</strong>. Selecting Option E guarantees <strong>0 marks and ZERO negative penalty</strong>. If you are unsure about an answer, select Option E or clear your response.
              </span>
            </div>

            <div className="flex items-start gap-2 text-slate-200">
              <span className="font-bold text-[#FF8C32] shrink-0 font-mono">2.</span>
              <span>
                <strong>ONE ATTEMPT ENFORCEMENT:</strong> A candidate can attempt this published assessment only <strong>ONCE</strong>. Once submitted or when the countdown reaches zero, answers become permanent and cannot be modified.
              </span>
            </div>

            <div className="flex items-start gap-2 text-slate-200">
              <span className="font-bold text-[#FF8C32] shrink-0 font-mono">3.</span>
              <span>
                <strong>TIMER & AUTO-SUBMISSION:</strong> The countdown timer will begin immediately upon clicking "Start Examination". If time expires, your responses will be submitted automatically.
              </span>
            </div>

            <div className="flex items-start gap-2 text-slate-200">
              <span className="font-bold text-[#FF8C32] shrink-0 font-mono">4.</span>
              <span>
                <strong>NAVIGATION AFFORDANCES:</strong> Use the Question Palette to jump to any question. You may Mark questions for Review and revisit them at any point prior to final submission.
              </span>
            </div>
          </div>
        </div>

        {/* Student Affirmation Agreement */}
        <div className="pt-2 border-t border-white/10 space-y-4">
          <label className="flex items-start gap-3 text-xs text-slate-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-0.5 rounded accent-[#FF8C32] w-4 h-4 cursor-pointer"
            />
            <span>
              I, <strong>{studentProfile.name}</strong>, have read and understood all the above examination instructions, including the <strong>Option E No-Response rule</strong> and <strong>One Attempt Policy</strong>. I declare that I will attempt this test with integrity.
            </span>
          </label>

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={cancelExam}
              className="px-5 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-slate-300 font-semibold text-xs transition cursor-pointer"
            >
              Cancel & Return
            </button>

            <button
              onClick={beginExamination}
              disabled={!agreed}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#EA580C] to-[#FF8C32] hover:from-[#FF8C32] hover:to-amber-400 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-orange-500/20 transition flex items-center gap-2 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-slate-950" />
              <span>Start Examination</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
