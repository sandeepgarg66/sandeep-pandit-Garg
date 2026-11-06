import React from 'react';
import { History, Trophy, Award, Target, Calendar, CheckCircle2, ArrowUpRight } from 'lucide-react';
import { useQuiz } from '../../context/QuizContext';

export const StudentPreviousRank: React.FC = () => {
  const { completedAttempts, setActiveSection } = useQuiz();

  const mockHistoricalRanks = [
    {
      testName: 'Daily Konoha Speed Test — Day 41 (Polity & Science)',
      rank: 4,
      totalParticipants: 380,
      obtainedMarks: 10,
      highestMarks: 10,
      accuracy: 100,
      testDate: 'Yesterday, 09:30 AM',
      percentile: '98.9th Percentile',
      category: 'Daily Test'
    },
    {
      testName: 'Weekly Chunin Exam Prelims #03 — Paper 1 Full Mock',
      rank: 7,
      totalParticipants: 520,
      obtainedMarks: 14,
      highestMarks: 16,
      accuracy: 87.5,
      testDate: '03 Nov 2026',
      percentile: '96.2th Percentile',
      category: 'Weekly Test'
    },
    {
      testName: 'Chapter Test: Fundamental Rights & Directive Principles',
      rank: 2,
      totalParticipants: 290,
      obtainedMarks: 8,
      highestMarks: 8,
      accuracy: 100,
      testDate: '01 Nov 2026',
      percentile: '99.3th Percentile',
      category: 'Chapter Test'
    },
    {
      testName: 'PYQ Archive 2024: Ancient India & Harappan Archaeology',
      rank: 5,
      totalParticipants: 410,
      obtainedMarks: 11.5,
      highestMarks: 12,
      accuracy: 91.6,
      testDate: '28 Oct 2026',
      percentile: '97.5th Percentile',
      category: 'PYQ Test'
    }
  ];

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

      {/* Historical Cards Grid */}
      <div className="space-y-4">
        {mockHistoricalRanks.map((item, idx) => (
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
    </div>
  );
};
