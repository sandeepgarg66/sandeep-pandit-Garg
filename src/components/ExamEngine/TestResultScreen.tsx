import React, { useState } from 'react';
import {
  Trophy,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  Target,
  ArrowRight,
  Eye,
  Award,
  Bookmark,
  Home
} from 'lucide-react';
import { useQuiz } from '../../context/QuizContext';

export const TestResultScreen: React.FC = () => {
  const { activeExam, cancelExam, setActiveSection, toggleBookmark, isBookmarked } = useQuiz();
  const [showFullReview, setShowFullReview] = useState(false);

  const result = activeExam.lastAttemptResult;
  const test = activeExam.test;
  if (!result || !test) return null;

  const durationMin = Math.floor(result.timeTakenSeconds / 60);
  const durationSec = result.timeTakenSeconds % 60;

  return (
    <div className="w-full max-w-4xl mx-auto py-6 sm:py-8 px-3 sm:px-6 space-y-6 sm:space-y-8 overflow-x-hidden">
      {/* Top Victory / Score Summary Card */}
      <div className="glass-panel p-4 sm:p-10 rounded-2xl sm:rounded-3xl border border-white/10 relative overflow-hidden shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div className="space-y-1 min-w-0">
            <span className="text-[10px] sm:text-xs uppercase font-bold tracking-widest text-[#FF8C32] bg-[#FF8C32]/10 px-2.5 sm:px-3 py-1 rounded-full border border-[#FF8C32]/20">
              Official Assessment Result
            </span>
            <h2 className="font-heading text-xl sm:text-3xl font-extrabold text-white mt-2 truncate">
              {result.testTitle}
            </h2>
            <p className="text-xs text-slate-400">
              Candidate: <strong className="text-slate-200">{result.studentName}</strong> • Category: <strong className="text-[#FF8C32]">{result.category}</strong>
            </p>
          </div>

          {/* Obtained Marks Circular Badge */}
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-[#FF8C32] bg-slate-900/90 flex flex-col items-center justify-center text-center p-2 shadow-inner shadow-orange-500/20 shrink-0 self-center sm:self-auto">
            <span className="font-mono text-2xl sm:text-3xl font-extrabold text-[#FF8C32]">
              {result.obtainedMarks}
            </span>
            <span className="text-[9px] sm:text-[10px] text-slate-400 uppercase font-semibold">
              out of {result.maxMarks}
            </span>
          </div>
        </div>

        {/* 4 Score Breakdown Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 text-center">
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-1">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 mx-auto" />
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Correct</span>
            <span className="font-mono text-2xl font-extrabold text-white">{result.correctCount}</span>
            <span className="text-[10px] text-emerald-400 block font-semibold">+{result.correctCount * test.marksPerCorrect} marks</span>
          </div>

          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 space-y-1">
            <XCircle className="w-5 h-5 text-rose-400 mx-auto" />
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Wrong</span>
            <span className="font-mono text-2xl font-extrabold text-rose-400">{result.wrongCount}</span>
            <span className="text-[10px] text-rose-400 block font-semibold">
              {test.negativeMarkingEnabled ? `-${Math.round(result.wrongCount * test.negativeMarks * 100) / 100} deduction` : '0 penalty'}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-1">
            <AlertCircle className="w-5 h-5 text-amber-400 mx-auto" />
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Unanswered / Opt E</span>
            <span className="font-mono text-2xl font-extrabold text-white">{result.unansweredCount}</span>
            <span className="text-[10px] text-amber-300 block font-semibold">0 penalty</span>
          </div>

          <div className="p-4 rounded-2xl bg-sky-500/10 border border-sky-500/20 space-y-1">
            <Target className="w-5 h-5 text-sky-400 mx-auto" />
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Accuracy</span>
            <span className="font-mono text-2xl font-extrabold text-sky-300">{result.accuracy}%</span>
            <span className="text-[10px] text-slate-400 block font-mono">{durationMin}m {durationSec}s taken</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <button
            onClick={() => setShowFullReview(!showFullReview)}
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <Eye className="w-4 h-4 text-[#FF8C32]" />
            <span>{showFullReview ? 'Hide Detailed Review' : 'Review Questions & Explanations'}</span>
          </button>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => {
                cancelExam();
                setActiveSection('student-leaderboard');
              }}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Trophy className="w-4 h-4 text-[#FF8C32]" />
              <span>Leaderboard</span>
            </button>

            <button
              onClick={() => {
                cancelExam();
                setActiveSection('student-dashboard');
              }}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#FF8C32] hover:bg-orange-400 text-slate-950 font-bold text-xs shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Home className="w-4 h-4 fill-slate-950" />
              <span>Return to Dashboard</span>
            </button>
          </div>
        </div>
      </div>

      {/* Item-by-item Question Review Section */}
      {showFullReview && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-xl text-white">
              Item-by-Item Answer Review & Explanations
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              Total {test.questions.length} Items Evaluated
            </span>
          </div>

          <div className="space-y-4">
            {test.questions.map((q, idx) => {
              const studentAnswer = result.answers[q.id];
              const isCorrect = studentAnswer === q.correctAnswer;
              const isOptionE = studentAnswer === 'E';
              const isUnanswered = !studentAnswer || isOptionE;

              return (
                <div
                  key={q.id}
                  className={`p-6 rounded-3xl glass-card border space-y-4 ${
                    isCorrect
                      ? 'border-emerald-500/40'
                      : isUnanswered
                      ? 'border-amber-500/40'
                      : 'border-rose-500/40'
                  }`}
                >
                  <div className="flex items-center justify-between border-b border-white/5 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-white bg-white/10 px-2 py-0.5 rounded">
                        Q{idx + 1}
                      </span>
                      <span className="text-xs text-slate-400">{q.subject}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold font-mono px-2.5 py-0.5 rounded-full ${
                        isCorrect
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : isUnanswered
                          ? 'bg-amber-500/20 text-amber-300'
                          : 'bg-rose-500/20 text-rose-300'
                      }`}>
                        {isCorrect ? `+${test.marksPerCorrect} Marks (Correct)` : isUnanswered ? '0 Marks (Unattempted)' : test.negativeMarkingEnabled ? `-${test.negativeMarks} Marks (Wrong)` : '0 Marks (Wrong)'}
                      </span>

                      <button
                        onClick={() => toggleBookmark(q)}
                        className={`p-1 rounded-lg transition ${
                          isBookmarked(q.id) ? 'text-[#FF8C32]' : 'text-slate-400 hover:text-white'
                        }`}
                        title="Bookmark question"
                      >
                        <Bookmark className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h4 className="font-semibold text-sm text-white leading-relaxed">
                      {q.statement}
                    </h4>
                    {q.statementHindi && (
                      <p className="text-xs text-slate-400 italic">
                        {q.statementHindi}
                      </p>
                    )}
                  </div>

                  {/* Options List */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {(['A', 'B', 'C', 'D'] as const).map((key) => {
                      const optText = q.options[key];
                      const isCandidatePick = studentAnswer === key;
                      const isRightKey = key === q.correctAnswer;

                      let rowClass = 'bg-white/5 border-white/5 text-slate-300';
                      if (isRightKey) {
                        rowClass = 'bg-emerald-500/15 border-emerald-500/50 text-emerald-200 font-bold';
                      } else if (isCandidatePick) {
                        rowClass = 'bg-rose-500/15 border-rose-500/50 text-rose-200 font-bold';
                      }

                      return (
                        <div
                          key={key}
                          className={`p-3 rounded-xl border flex items-center justify-between ${rowClass}`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center font-mono font-bold text-[10px]">
                              {key}
                            </span>
                            <span>{optText}</span>
                          </div>
                          {isRightKey && <span className="text-[10px] text-emerald-400 font-bold">✓ Correct Key</span>}
                          {isCandidatePick && !isRightKey && <span className="text-[10px] text-rose-400 font-bold">✗ Your Choice</span>}
                        </div>
                      );
                    })}
                  </div>

                  {/* Option E indication if selected */}
                  {isOptionE && (
                    <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 flex items-center gap-2">
                      <span className="font-bold">Option E selected:</span>
                      <span>Marked as "Unattempted / No Response" — No negative deduction applied.</span>
                    </div>
                  )}

                  {/* In-depth Explanation Box */}
                  <div className="p-4 rounded-2xl bg-slate-950 border border-white/5 text-xs space-y-1">
                    <span className="font-bold uppercase tracking-wider text-[#FF8C32] text-[10px] block">
                      Authoritative Explanation:
                    </span>
                    <p className="text-slate-300 leading-relaxed">
                      {q.explanation}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
