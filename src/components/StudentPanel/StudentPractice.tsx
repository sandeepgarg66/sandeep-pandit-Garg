import React, { useState } from 'react';
import { BookOpen, Layers, Zap, FileText, AlertCircle, Bookmark, CheckCircle2, XCircle, ChevronRight, HelpCircle } from 'lucide-react';
import { useQuiz } from '../../context/QuizContext';
import { SUBJECTS_LIST } from '../../data/mockData';
import { Question } from '../../types/quiz';

export const StudentPractice: React.FC = () => {
  const { questions, bookmarks, toggleBookmark, isBookmarked } = useQuiz();
  const [selectedPracticeMode, setSelectedPracticeMode] = useState<string>('Subject-wise Practice');
  const [activePracticeQuestion, setActivePracticeQuestion] = useState<Question | null>(null);
  const [selectedPracticeAnswer, setSelectedPracticeAnswer] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);

  const practiceModes = [
    { title: 'Subject-wise Practice', desc: 'Focus specifically on Indian Polity, General Science, or Quantitative Aptitude.', icon: BookOpen, count: `${questions.length} Questions` },
    { title: 'Topic-wise Practice', desc: 'Target key topics like Fundamental Rights, Quantum Radiation, or Harappan Ports.', icon: Layers, count: '12 Topics' },
    { title: 'Random Questions Drill', desc: 'Shuffle full question bank across all categories for unexpected exam agility.', icon: Zap, count: 'Infinite Shuffle' },
    { title: 'PYQ Practice', desc: 'Solve selected MCQs directly sourced from past competitive examination archives.', icon: FileText, count: '2024-2025 Papers' },
    { title: 'Wrong Questions Revision', desc: 'Re-attempt tricky questions you previously made errors on to solidify concepts.', icon: AlertCircle, count: 'Saved Errata' },
    { title: 'Bookmarked Questions', desc: 'Review questions you flagged for last-minute conceptual revision.', icon: Bookmark, count: `${bookmarks.length} Saved` },
  ];

  const handleStartDrill = (q: Question) => {
    setActivePracticeQuestion(q);
    setSelectedPracticeAnswer(null);
    setShowExplanation(false);
  };

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Header */}
      <div>
        <div className="text-xs uppercase tracking-wider text-[#FF8C32] font-semibold mb-1">
          Self-Paced Training Grounds
        </div>
        <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-white">
          Shinobi Practice Hub
        </h2>
        <div className="p-3.5 rounded-xl bg-slate-900 border border-white/10 text-xs text-slate-300 mt-2 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#FF8C32] shrink-0" />
          <span><strong>Official Examination Rule:</strong> Private practice drills allow unlimited instant re-attempts and reveal explanations immediately. Practice scores do NOT contribute to Global Leaderboard standings.</span>
        </div>
      </div>

      {/* Modes Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {practiceModes.map((mode) => {
          const Icon = mode.icon;
          const isSelected = selectedPracticeMode === mode.title;

          return (
            <div
              key={mode.title}
              onClick={() => setSelectedPracticeMode(mode.title)}
              className={`p-5 rounded-2xl glass-card border transition cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'border-[#FF8C32] bg-[#FF8C32]/10 shadow-md shadow-orange-500/10'
                  : 'border-white/10 hover:border-white/20'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-[#FF8C32]">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="font-mono text-[11px] text-slate-400">
                    {mode.count}
                  </span>
                </div>
                <h3 className="font-heading font-bold text-base text-white">
                  {mode.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  {mode.desc}
                </p>
              </div>

              <div className="pt-4 mt-3 border-t border-white/5 flex items-center justify-between text-xs font-semibold text-[#FF8C32]">
                <span>{isSelected ? 'Active Mode' : 'Select Mode'}</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Questions list for selected practice mode */}
      <div className="space-y-4">
        <h3 className="font-heading font-bold text-lg text-white">
          Available Practice Questions ({questions.length})
        </h3>

        <div className="space-y-3">
          {questions.map((q, idx) => {
            const bookmarked = isBookmarked(q.id);
            return (
              <div
                key={q.id}
                className="p-5 rounded-2xl glass-card border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2 text-[10px]">
                    <span className="font-bold text-[#FF8C32] uppercase bg-[#FF8C32]/10 px-2 py-0.5 rounded">
                      {q.subject}
                    </span>
                    <span className="text-slate-400">{q.topic}</span>
                    <span className="text-slate-500">•</span>
                    <span className="text-emerald-400 font-mono font-semibold">{q.difficulty}</span>
                  </div>
                  <p className="font-medium text-xs sm:text-sm text-slate-100">
                    {idx + 1}. {q.statement}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <button
                    onClick={() => toggleBookmark(q)}
                    className={`p-2 rounded-xl border transition ${
                      bookmarked
                        ? 'border-[#FF8C32] text-[#FF8C32] bg-[#FF8C32]/10'
                        : 'border-white/10 text-slate-400 hover:text-white'
                    }`}
                    title={bookmarked ? 'Remove Bookmark' : 'Bookmark Question'}
                  >
                    <Bookmark className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleStartDrill(q)}
                    className="px-4 py-2 rounded-xl bg-[#FF8C32] hover:bg-orange-400 text-slate-950 font-bold text-xs shadow transition cursor-pointer"
                  >
                    Solve Now
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Practice Question Modal */}
      {activePracticeQuestion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B0F19]/80 backdrop-blur-md">
          <div className="w-full max-w-2xl bg-slate-900 border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2 text-xs">
                <span className="font-bold text-[#FF8C32]">{activePracticeQuestion.subject}</span>
                <span className="text-slate-500">•</span>
                <span className="text-slate-400">{activePracticeQuestion.topic}</span>
              </div>
              <button
                onClick={() => setActivePracticeQuestion(null)}
                className="text-slate-400 hover:text-white text-xs font-semibold cursor-pointer"
              >
                Close Drill ✕
              </button>
            </div>

            <div className="space-y-2">
              <h4 className="font-heading text-base sm:text-lg font-bold text-white">
                {activePracticeQuestion.statement}
              </h4>
              {activePracticeQuestion.statementHindi && (
                <p className="text-xs text-slate-400 italic">
                  {activePracticeQuestion.statementHindi}
                </p>
              )}
            </div>

            {/* 4 Factual Options (A–D) for Practice */}
            <div className="space-y-2.5">
              {(['A', 'B', 'C', 'D'] as const).map((optKey) => {
                const optText = activePracticeQuestion.options[optKey];
                const isSelected = selectedPracticeAnswer === optKey;
                const isCorrect = optKey === activePracticeQuestion.correctAnswer;
                const showValidation = showExplanation;

                let optClass = 'border-white/10 bg-white/5 hover:border-white/20 text-slate-200';
                if (showValidation) {
                  if (isCorrect) {
                    optClass = 'border-emerald-500 bg-emerald-500/10 text-emerald-200 font-bold';
                  } else if (isSelected) {
                    optClass = 'border-rose-500 bg-rose-500/10 text-rose-200';
                  }
                } else if (isSelected) {
                  optClass = 'border-[#FF8C32] bg-[#FF8C32]/10 text-white font-semibold';
                }

                return (
                  <button
                    key={optKey}
                    onClick={() => {
                      if (!showExplanation) {
                        setSelectedPracticeAnswer(optKey);
                      }
                    }}
                    className={`w-full p-3.5 rounded-xl border text-left text-xs sm:text-sm flex items-center justify-between transition cursor-pointer ${optClass}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full border border-white/20 font-mono text-xs font-bold flex items-center justify-center">
                        {optKey}
                      </span>
                      <span>{optText}</span>
                    </div>
                    {showValidation && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                    {showValidation && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-rose-400" />}
                  </button>
                );
              })}
            </div>

            {/* Action Bar */}
            <div className="pt-2 flex items-center justify-between">
              <button
                onClick={() => setShowExplanation(true)}
                disabled={!selectedPracticeAnswer}
                className="px-5 py-2.5 rounded-xl bg-[#FF8C32] hover:bg-orange-400 disabled:opacity-40 text-slate-950 font-bold text-xs transition cursor-pointer"
              >
                Check Answer & Explanation
              </button>

              <button
                onClick={() => toggleBookmark(activePracticeQuestion)}
                className="text-xs text-slate-400 hover:text-[#FF8C32] flex items-center gap-1 font-semibold"
              >
                <Bookmark className="w-4 h-4" />
                <span>{isBookmarked(activePracticeQuestion.id) ? 'Saved' : 'Bookmark'}</span>
              </button>
            </div>

            {/* In-depth Explanation Drawer */}
            {showExplanation && (
              <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/30 text-xs space-y-1.5 animate-in fade-in duration-200">
                <div className="flex items-center gap-1 text-emerald-400 font-bold uppercase tracking-wider text-[11px]">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Authoritative Examination Explanation:</span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  {activePracticeQuestion.explanation}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
