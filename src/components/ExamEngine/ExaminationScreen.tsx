import React, { useState } from 'react';
import {
  Clock,
  AlertCircle,
  HelpCircle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Bookmark,
  Send,
  RotateCcw,
  Flag,
  Flame,
  Shield,
  LayoutGrid,
  X
} from 'lucide-react';
import { useQuiz } from '../../context/QuizContext';
import { QuestionState, StudentResponseKey } from '../../types/quiz';
import { SubmitConfirmationModal } from './SubmitConfirmationModal';

export const ExaminationScreen: React.FC = () => {
  const {
    activeExam,
    selectAnswer,
    clearResponse,
    markForReview,
    saveAndNext,
    previousQuestion,
    jumpToQuestion,
    studentProfile,
    toggleBookmark,
    isBookmarked
  } = useQuiz();

  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isMobilePaletteOpen, setIsMobilePaletteOpen] = useState(false);

  if (!activeExam.test) return null;
  const test = activeExam.test;
  const currentQ = test.questions[activeExam.currentQuestionIndex];
  const currentAnswer = activeExam.answers[currentQ.id];
  const isLastQuestion = activeExam.currentQuestionIndex === test.questions.length - 1;
  const isFirstQuestion = activeExam.currentQuestionIndex === 0;

  // Answered questions count
  const answeredCount = Object.keys(activeExam.answers).length;
  const totalQuestions = test.questions.length;

  // Format remaining seconds into MM:SS
  const minutes = Math.floor(activeExam.remainingSeconds / 60);
  const seconds = activeExam.remainingSeconds % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const isTimeCritical = activeExam.remainingSeconds <= 120; // 2 minutes or less

  // Palette State Styles
  const getPaletteStateClass = (qId: string, idx: number) => {
    const isCurrent = idx === activeExam.currentQuestionIndex;
    const state = activeExam.questionStates[qId] || 'not_visited';

    let base = 'w-9 h-9 rounded-lg font-mono text-xs font-bold transition flex items-center justify-center cursor-pointer ';
    if (isCurrent) {
      base += 'ring-2 ring-[#FF8C32] ring-offset-2 ring-offset-[#0B0F19] ';
    }

    switch (state) {
      case 'answered':
        return base + 'bg-emerald-600 text-white shadow-sm';
      case 'not_answered':
        return base + 'bg-rose-600 text-white';
      case 'marked_for_review':
        return base + 'bg-purple-600 text-white';
      case 'answered_and_marked':
        return base + 'bg-purple-800 text-white border-2 border-emerald-400';
      case 'not_visited':
      default:
        return base + 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white';
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 flex flex-col w-full max-w-full overflow-x-clip pb-20 lg:pb-0">
      {/* Top Examination Cockpit Bar */}
      <header className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur-md border-b border-white/10 px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3 w-full">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4 w-full">
          {/* Assessment Title & Student identity */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#FF8C32]/20 border border-[#FF8C32]/40 flex items-center justify-center text-[#FF8C32] font-bold shrink-0 text-xs sm:text-sm">
              ⚡
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="font-heading font-bold text-xs sm:text-base text-white truncate">
                {test.title}
              </h2>
              <div className="text-[9px] sm:text-xs text-slate-400 flex items-center gap-1.5 truncate">
                <span className="hidden sm:inline">Candidate: <strong className="text-slate-200">{studentProfile.name.split(' ')[0]}</strong></span>
                <span className="hidden sm:inline">•</span>
                <span className="text-[#FF8C32] truncate">{test.subject}</span>
              </div>
            </div>
          </div>

          {/* Center Timer & Submit Action */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Live Countdown Timer */}
            <div
              className={`px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-xl border flex items-center gap-1.5 sm:gap-2 font-mono text-xs sm:text-base font-extrabold transition ${
                isTimeCritical
                  ? 'bg-rose-950/80 border-rose-500 text-rose-300 animate-pulse'
                  : 'bg-slate-800/90 border-white/10 text-[#FF8C32]'
              }`}
            >
              <Clock className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isTimeCritical ? 'text-rose-400' : 'text-[#FF8C32]'}`} />
              <span>{timeFormatted}</span>
            </div>

            {/* Final Submit Trigger */}
            <button
              onClick={() => setIsSubmitModalOpen(true)}
              className="px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md transition flex items-center gap-1 sm:gap-1.5 cursor-pointer shrink-0"
            >
              <Send className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span className="hidden sm:inline">Submit Test</span>
              <span className="sm:hidden">Submit</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Exam Viewport (Split Layout) */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-3 sm:px-6 lg:px-8 py-4 sm:py-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Question & 5 Response Options */}
        <div className="lg:col-span-8 space-y-6 w-full">
          <div className="glass-panel p-4 sm:p-8 rounded-2xl sm:rounded-3xl border border-white/10 space-y-5 sm:space-y-6 w-full">
            {/* Question Header & Bookmark */}
            <div className="flex items-center justify-between border-b border-white/5 pb-3 sm:pb-4 gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <span className="font-mono text-xs font-extrabold text-[#FF8C32] bg-[#FF8C32]/10 px-2.5 py-1 rounded-md border border-[#FF8C32]/30 shrink-0">
                  Q {activeExam.currentQuestionIndex + 1}/{test.questions.length}
                </span>
                <span className="text-xs text-slate-400 truncate">
                  Topic: <strong className="text-slate-300">{currentQ.topic}</strong>
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-[11px] font-mono text-emerald-400 font-semibold">
                  +{test.marksPerCorrect} / {test.negativeMarkingEnabled ? `-${test.negativeMarks}` : '0'} Marks
                </span>
                <button
                  onClick={() => toggleBookmark(currentQ)}
                  className={`p-1.5 rounded-lg border transition ${
                    isBookmarked(currentQ.id)
                      ? 'border-[#FF8C32] text-[#FF8C32] bg-[#FF8C32]/10'
                      : 'border-white/10 text-slate-400 hover:text-white'
                  }`}
                  title="Bookmark this question"
                >
                  <Bookmark className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Question Statement */}
            <div className="space-y-2">
              <h3 className="font-heading font-semibold text-base sm:text-lg text-white leading-relaxed">
                {currentQ.statement}
              </h3>
              {currentQ.statementHindi && (
                <p className="text-xs sm:text-sm text-slate-400 italic leading-relaxed">
                  {currentQ.statementHindi}
                </p>
              )}
            </div>

            {/* 5 Response Choices (A to E) */}
            <div className="space-y-3 pt-2">
              {(['A', 'B', 'C', 'D'] as const).map((optKey) => {
                const optText = currentQ.options[optKey];
                const isSelected = currentAnswer === optKey;

                return (
                  <button
                    key={optKey}
                    onClick={() => selectAnswer(currentQ.id, optKey)}
                    className={`w-full p-4 rounded-2xl border text-left text-xs sm:text-sm flex items-center justify-between transition cursor-pointer ${
                      isSelected
                        ? 'border-[#FF8C32] bg-[#FF8C32]/15 text-white font-semibold shadow-md shadow-orange-500/10'
                        : 'border-white/10 bg-white/5 hover:border-white/20 text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <span className={`w-7 h-7 rounded-full font-mono text-xs font-bold flex items-center justify-center border transition ${
                        isSelected
                          ? 'border-[#FF8C32] bg-[#FF8C32] text-slate-950 font-extrabold'
                          : 'border-white/20 bg-slate-800 text-slate-300'
                      }`}>
                        {optKey}
                      </span>
                      <span>{optText}</span>
                    </div>

                    {isSelected && (
                      <CheckCircle2 className="w-4 h-4 text-[#FF8C32] shrink-0" />
                    )}
                  </button>
                );
              })}

              {/* SPECIAL OPTION E: UNATTEMPTED / NO RESPONSE */}
              <button
                onClick={() => selectAnswer(currentQ.id, 'E')}
                className={`w-full p-4 rounded-2xl border text-left text-xs sm:text-sm flex items-center justify-between transition cursor-pointer ${
                  currentAnswer === 'E'
                    ? 'border-amber-400 bg-amber-500/20 text-white font-semibold'
                    : 'border-white/10 bg-slate-900/80 hover:border-white/20 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <span className={`w-7 h-7 rounded-full font-mono text-xs font-bold flex items-center justify-center border transition ${
                    currentAnswer === 'E'
                      ? 'border-amber-400 bg-amber-400 text-slate-950 font-extrabold'
                      : 'border-white/20 bg-slate-800 text-slate-400'
                  }`}>
                    E
                  </span>
                  <div>
                    <span className="font-bold text-amber-300">अनुत्तरित प्रश्न / No Response (Unattempted)</span>
                    <span className="block text-[10px] text-slate-400">
                      Select if you wish to leave this question unanswered. Guaranteed 0 marks & NO negative penalty.
                    </span>
                  </div>
                </div>

                {currentAnswer === 'E' && (
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                )}
              </button>
            </div>

            {/* Bottom Question Controls */}
            <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => clearResponse(currentQ.id)}
                  disabled={!currentAnswer}
                  className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Clear Response</span>
                </button>

                <button
                  onClick={() => markForReview(currentQ.id)}
                  className="px-3.5 py-2 rounded-xl bg-purple-900/40 hover:bg-purple-900/60 border border-purple-500/30 text-purple-200 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Flag className="w-3.5 h-3.5" />
                  <span>Mark for Review</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={previousQuestion}
                  disabled={isFirstQuestion}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-slate-300 text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <button
                  onClick={saveAndNext}
                  className="px-5 py-2 rounded-xl bg-[#FF8C32] hover:bg-orange-400 text-slate-950 font-bold text-xs shadow-md transition flex items-center gap-1 cursor-pointer"
                >
                  <span>{isLastQuestion ? 'Review Answers' : 'Save & Next'}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Question Palette & Visual State Legend (Desktop Only) */}
        <div className="hidden lg:block lg:col-span-4 space-y-5">
          <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-heading font-bold text-sm text-white">
                  Question Palette
                </h4>
                <p className="text-[11px] text-slate-400">
                  Click any number to navigate directly to that question.
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-[#FF8C32] bg-[#FF8C32]/10 px-2 py-0.5 rounded">
                {answeredCount}/{totalQuestions}
              </span>
            </div>

            {/* Questions Grid */}
            <div className="grid grid-cols-5 sm:grid-cols-6 lg:grid-cols-5 gap-2">
              {test.questions.map((q, idx) => (
                <button
                  key={q.id}
                  onClick={() => jumpToQuestion(idx)}
                  className={getPaletteStateClass(q.id, idx)}
                >
                  {idx + 1}
                </button>
              ))}
            </div>

            {/* State Color Legend */}
            <div className="pt-4 border-t border-white/10 space-y-2 text-xs">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Palette State Legend
              </div>
              <div className="grid grid-cols-1 gap-2 text-[11px]">
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded bg-emerald-600 shrink-0" />
                  <span className="text-slate-300">Answered (A–D or Option E)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded bg-rose-600 shrink-0" />
                  <span className="text-slate-300">Not Answered (Visited)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded bg-purple-600 shrink-0" />
                  <span className="text-slate-300">Marked for Review</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded bg-purple-800 border border-emerald-400 shrink-0" />
                  <span className="text-slate-300">Answered & Marked for Review</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded bg-slate-800 shrink-0" />
                  <span className="text-slate-300">Not Visited</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Floating Bottom Palette Dock Trigger */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md border-t border-white/10 p-3 flex items-center justify-between gap-3 shadow-2xl">
        <button
          onClick={() => setIsMobilePaletteOpen(true)}
          className="flex-1 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-white/10 flex items-center justify-center gap-2 cursor-pointer shadow min-h-[44px]"
        >
          <LayoutGrid className="w-4 h-4 text-[#FF8C32]" />
          <span>Question Palette ({answeredCount}/{totalQuestions})</span>
        </button>

        <button
          onClick={saveAndNext}
          className="py-2.5 px-4 rounded-xl bg-[#FF8C32] hover:bg-orange-400 text-slate-950 font-bold text-xs shadow flex items-center gap-1 cursor-pointer shrink-0 min-h-[44px]"
        >
          <span>{isLastQuestion ? 'Review' : 'Next'}</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Mobile Question Palette Bottom Sheet Drawer */}
      {isMobilePaletteOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex flex-col justify-end">
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobilePaletteOpen(false)}
          />

          {/* Bottom Sheet Modal */}
          <div className="relative bg-[#0B0F19] border-t border-white/20 rounded-t-3xl p-5 max-h-[85vh] overflow-y-auto space-y-4 shadow-2xl animate-in slide-in-from-bottom duration-200">
            {/* Grab Handle */}
            <div className="w-12 h-1.5 rounded-full bg-slate-700 mx-auto" />

            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h4 className="font-heading font-bold text-base text-white flex items-center gap-2">
                  <LayoutGrid className="w-4 h-4 text-[#FF8C32]" />
                  <span>Question Palette</span>
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Answered: <strong className="text-emerald-400">{answeredCount}</strong> of <strong className="text-white">{totalQuestions}</strong>
                </p>
              </div>

              <button
                onClick={() => setIsMobilePaletteOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-white/5"
                aria-label="Close question palette"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Questions Grid */}
            <div className="grid grid-cols-5 sm:grid-cols-6 gap-2.5 py-1">
              {test.questions.map((q, idx) => (
                <button
                  key={q.id}
                  onClick={() => {
                    jumpToQuestion(idx);
                    setIsMobilePaletteOpen(false);
                  }}
                  className={getPaletteStateClass(q.id, idx)}
                >
                  {idx + 1}
                </button>
              ))}
            </div>

            {/* State Color Legend */}
            <div className="pt-3 border-t border-white/10 space-y-2 text-xs">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Palette State Legend
              </div>
              <div className="grid grid-cols-2 gap-2 text-[10px]">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-emerald-600 shrink-0" />
                  <span className="text-slate-300">Answered (A–E)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-rose-600 shrink-0" />
                  <span className="text-slate-300">Not Answered</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-purple-600 shrink-0" />
                  <span className="text-slate-300">Marked Review</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-purple-800 border border-emerald-400 shrink-0" />
                  <span className="text-slate-300">Ans. & Marked</span>
                </div>
                <div className="flex items-center gap-2 col-span-2">
                  <span className="w-3 h-3 rounded bg-slate-800 shrink-0" />
                  <span className="text-slate-300">Not Visited</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Final Submit Confirmation Modal */}
      <SubmitConfirmationModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
      />
    </div>
  );
};
