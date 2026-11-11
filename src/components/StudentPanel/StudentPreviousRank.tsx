import React from 'react';
import { History, Trophy, Award, Target, Calendar, CheckCircle2, ArrowUpRight } from 'lucide-react';
import { useQuiz } from '../../context/QuizContext';

export const StudentPreviousRank: React.FC = () => {
  const { completedAttempts, setActiveSection } = useQuiz();

  const realAttemptsList = completedAttempts.map((att) => ({
    testName: att.testTitle,
    rank: att.rank || 1,
    totalParticipants: att.totalParticipants || 420,
    obtainedMarks: att.obtainedMarks,
    highestMarks: att.maxMarks,
    accuracy: att.accuracy,
    testDate: new Date(att.submittedAt).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }),
    percentile: `${Math.min(99.9, Math.max(80, Math.round((1 - (att.rank || 1) / (att.totalParticipants || 420)) * 1000) / 10))}th Percentile`,
    category: att.category
  }));

  const allHistoricalRanks = realAttemptsList;

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Header */}
      <div>
        <div className="text-xs uppercase tracking-wider text-[#FF8C32] font-semibold mb-1 flex items-center gap-1.5">
          <History className="w-3.5 h-3.5" />
          <span>Historical Standing Ledger</span>
        </div>
        <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-white">
          My Previous Ranks & Percentiles
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Historical records of all officially evaluated assessments, benchmarked against state-wide aspirants and test toppers.
        </p>
      </div>

      {/* Historical Cards Grid or Empty State */}
      {allHistoricalRanks.length === 0 ? (
        <div className="glass-card p-12 sm:p-16 rounded-3xl border border-white/10 text-center max-w-lg mx-auto space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto shadow-inner">
            <Trophy className="w-8 h-8 opacity-80" />
          </div>
          <div className="space-y-1.5">
            <h3 className="font-heading font-bold text-lg text-white">
              No completed assessment data yet
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
              Historical records of your evaluated attempts, rank certificates, and percentile standing will appear here once you submit tests from the New Tests catalog.
            </p>
          </div>
          <button
            onClick={() => setActiveSection('student-tests')}
            className="px-5 py-2.5 rounded-xl bg-[#FF8C32] hover:bg-orange-400 text-slate-950 font-bold text-xs shadow transition cursor-pointer"
          >
            Explore Available Tests
          </button>
        </div>
      ) : (
        <div className="space-y-4">
        {allHistoricalRanks.map((item, idx) => (
          <div
            key={idx}
            className="glass-card p-6 rounded-2xl border border-white/10 hover:border-[#FF8C32]/30 transition space-y-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold text-[#FF8C32] bg-[#FF8C32]/10 px-2 py-0.5 rounded">
                    {item.category}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">{item.testDate}</span>
                </div>
                <h3 className="font-heading font-bold text-base sm:text-lg text-white">
                  {item.testName}
                </h3>
              </div>

              {/* Rank Callout */}
              <div className="flex items-center gap-3 bg-slate-900/90 px-4 py-2 rounded-xl border border-white/10 shrink-0">
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Trophy className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Secured Rank</span>
                  <div className="font-mono text-base font-extrabold text-white">
                    Rank <span className="text-[#FF8C32]">#{item.rank}</span> / {item.totalParticipants}
                  </div>
                </div>
              </div>
            </div>

            {/* Metrics Breakdown Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-white/5 text-xs">
              <div className="p-3 rounded-xl bg-white/5 space-y-0.5">
                <span className="text-[10px] text-slate-400 uppercase block font-semibold">Your Score</span>
                <span className="font-mono font-bold text-white text-sm">
                  {item.obtainedMarks} Marks
                </span>
              </div>
              <div className="p-3 rounded-xl bg-white/5 space-y-0.5">
                <span className="text-[10px] text-slate-400 uppercase block font-semibold">Highest Marks (AIR 1)</span>
                <span className="font-mono font-bold text-emerald-400 text-sm">
                  {item.highestMarks} Marks
                </span>
              </div>
              <div className="p-3 rounded-xl bg-white/5 space-y-0.5">
                <span className="text-[10px] text-slate-400 uppercase block font-semibold">Accuracy</span>
                <span className="font-mono font-bold text-sky-400 text-sm">
                  {item.accuracy}%
                </span>
              </div>
              <div className="p-3 rounded-xl bg-white/5 space-y-0.5">
                <span className="text-[10px] text-slate-400 uppercase block font-semibold">Normalized Percentile</span>
                <span className="font-mono font-bold text-[#FF8C32] text-sm">
                  {item.percentile}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      )}
    </div>
  );
};
