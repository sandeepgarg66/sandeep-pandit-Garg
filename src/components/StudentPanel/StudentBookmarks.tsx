import React, { useState } from 'react';
import { Bookmark, Trash2, Play, BookOpen, CheckCircle2, ChevronRight, XCircle } from 'lucide-react';
import { useQuiz } from '../../context/QuizContext';
import { Question } from '../../types/quiz';

export const StudentBookmarks: React.FC = () => {
  const { bookmarks, toggleBookmark } = useQuiz();
  const [activeQuestion, setActiveQuestion] = useState<Question | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [revealed, setRevealed] = useState<boolean>(false);

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Header */}
      <div>
        <div className="text-xs uppercase tracking-wider text-[#FF8C32] font-semibold mb-1 flex items-center gap-1.5">
          <Bookmark className="w-3.5 h-3.5" />
          <span>Curated Question Vault</span>
        </div>
        <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-white">
          Bookmarked Questions ({bookmarks.length})
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          High-yield questions saved during timed examinations or practice drills for quick conceptual revision.
        </p>
      </div>

      {bookmarks.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl border border-white/10 text-center space-y-3">
          <Bookmark className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="font-heading font-bold text-lg text-white">
            No Bookmarked Questions Yet
          </h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            While taking a test or practicing, click the bookmark icon next to any challenging question to save it here for targeted revision.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookmarks.map((b) => (
            <div
              key={b.questionId}
              className="glass-card p-6 rounded-2xl border border-white/10 hover:border-[#FF8C32]/30 transition space-y-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/5 pb-3">
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-bold text-[#FF8C32] bg-[#FF8C32]/10 px-2.5 py-0.5 rounded text-[10px] uppercase">
                    {b.question.subject}
                  </span>
                  <span className="text-slate-400">{b.question.topic}</span>
                  <span className="text-slate-600">•</span>
                  <span className="text-slate-400 font-mono text-[11px]">Saved on {b.savedDate}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setActiveQuestion(b.question);
                      setSelectedAnswer(null);
                      setRevealed(false);
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-[#FF8C32] hover:bg-orange-400 text-slate-950 font-bold text-xs shadow flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-slate-950" />
                    <span>Practice Question</span>
                  </button>

                  <button
                    onClick={() => toggleBookmark(b.question)}
                    className="p-1.5 rounded-xl bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition cursor-pointer"
                    title="Remove from Bookmarks"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <p className="font-medium text-xs sm:text-sm text-slate-100 leading-relaxed">
                  {b.question.statement}
                </p>
                {b.question.statementHindi && (
                  <p className="text-xs text-slate-400 italic">
                    {b.question.statementHindi}
                  </p>
                )}
              </div>

              {b.notes && (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200">
                  <strong>Revision Note:</strong> {b.notes}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Drill Modal */}
      {activeQuestion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B0F19]/80 backdrop-blur-md">
          <div className="w-full max-w-2xl bg-slate-900 border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="font-bold text-xs text-[#FF8C32]">{activeQuestion.subject}</span>
              <button
                onClick={() => setActiveQuestion(null)}
                className="text-slate-400 hover:text-white text-xs font-semibold cursor-pointer"
              >
                Close ✕
              </button>
            </div>

            <h4 className="font-heading text-base font-bold text-white">
              {activeQuestion.statement}
            </h4>

            <div className="space-y-2.5">
              {(['A', 'B', 'C', 'D'] as const).map((key) => {
                const optText = activeQuestion.options[key];
                const isSelected = selectedAnswer === key;
                const isCorrect = key === activeQuestion.correctAnswer;

                let btnClass = 'border-white/10 bg-white/5 text-slate-200';
                if (revealed) {
                  if (isCorrect) btnClass = 'border-emerald-500 bg-emerald-500/10 text-emerald-200 font-bold';
                  else if (isSelected) btnClass = 'border-rose-500 bg-rose-500/10 text-rose-200';
                } else if (isSelected) {
                  btnClass = 'border-[#FF8C32] bg-[#FF8C32]/10 text-white font-bold';
                }

                return (
                  <button
                    key={key}
                    onClick={() => {
                      if (!revealed) setSelectedAnswer(key);
                    }}
                    className={`w-full p-3 rounded-xl border text-left text-xs sm:text-sm flex items-center justify-between transition cursor-pointer ${btnClass}`}
                  >
                    <span><strong>{key}.</strong> {optText}</span>
                    {revealed && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                    {revealed && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-rose-400" />}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => setRevealed(true)}
                disabled={!selectedAnswer}
                className="px-5 py-2.5 rounded-xl bg-[#FF8C32] hover:bg-orange-400 disabled:opacity-40 text-slate-950 font-bold text-xs transition cursor-pointer"
              >
                Reveal Answer
              </button>
            </div>

            {revealed && (
              <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/30 text-xs space-y-1">
                <span className="text-emerald-400 font-bold block">Correct Explanation:</span>
                <p className="text-slate-300 leading-relaxed">{activeQuestion.explanation}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
