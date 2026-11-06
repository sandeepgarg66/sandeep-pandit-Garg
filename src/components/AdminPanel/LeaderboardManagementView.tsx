import React, { useState } from 'react';
import {
  Trophy,
  RotateCcw,
  ShieldCheck,
  AlertTriangle,
  Award,
  Flame,
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import { useQuiz } from '../../context/QuizContext';

export const LeaderboardManagementView: React.FC = () => {
  const {
    dailyLeaderboard,
    weeklyLeaderboard,
    globalLeaderboard,
    resetLeaderboard,
    addAuditLog
  } = useQuiz();

  const [activeBoard, setActiveBoard] = useState<'daily' | 'weekly' | 'global'>('daily');
  const [showResetConfirm, setShowResetConfirm] = useState<'daily' | 'weekly' | null>(null);

  const handleConfirmReset = (type: 'daily' | 'weekly') => {
    resetLeaderboard(type);
    setShowResetConfirm(null);
  };

  const currentList =
    activeBoard === 'daily'
      ? dailyLeaderboard
      : activeBoard === 'weekly'
      ? weeklyLeaderboard
      : globalLeaderboard;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-extrabold text-white">
            Leaderboard & Points Oversight
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Institutional ranking cycles, point recalculation, and strict exclusion of Private Practice scores.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeBoard !== 'global' && (
            <button
              onClick={() => setShowResetConfirm(activeBoard)}
              className="px-3.5 py-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-500/30 text-xs font-bold transition flex items-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset {activeBoard === 'daily' ? 'Daily' : 'Weekly'} Cycle</span>
            </button>
          )}
        </div>
      </div>

      {/* Critical Policy Callout */}
      <div className="glass-panel p-4 rounded-2xl border border-white/10 flex items-start gap-3 bg-purple-950/20">
        <ShieldCheck className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-300 space-y-1">
          <div className="font-bold text-white">Institutional Points Isolation Protocol:</div>
          <p className="text-slate-400 text-[11px]">
            Global Lifetime Points are aggregated <strong>ONLY</strong> from official published tests (Daily, Weekly, Mock, PYQ, Chapter, and Subject-wise Tests). <strong>Private Practice drills do NOT contribute to Global Leaderboard standings.</strong>
          </p>
        </div>
      </div>

      {/* Leaderboard Selector Tabs */}
      <div className="flex border-b border-white/10 gap-2 text-xs font-semibold">
        <button
          onClick={() => setActiveBoard('daily')}
          className={`px-4 py-2.5 border-b-2 transition cursor-pointer ${
            activeBoard === 'daily' ? 'border-[#FF8C32] text-[#FF8C32]' : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          Daily Leaderboard (24hr Sprint)
        </button>
        <button
          onClick={() => setActiveBoard('weekly')}
          className={`px-4 py-2.5 border-b-2 transition cursor-pointer ${
            activeBoard === 'weekly' ? 'border-[#FF8C32] text-[#FF8C32]' : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          Weekly Leaderboard (7-Day Cycle)
        </button>
        <button
          onClick={() => setActiveBoard('global')}
          className={`px-4 py-2.5 border-b-2 transition cursor-pointer ${
            activeBoard === 'global' ? 'border-[#FF8C32] text-[#FF8C32]' : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          Global Hall of Fame (Lifetime Points)
        </button>
      </div>

      {/* Current Board Table */}
      <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-900/90 text-slate-400 text-xs uppercase tracking-wider border-b border-white/10">
              <tr>
                <th className="px-5 py-3.5 text-center">Rank</th>
                <th className="px-5 py-3.5">Aspirant Name</th>
                <th className="px-5 py-3.5">Shinobi Rank Badge</th>
                <th className="px-5 py-3.5 text-center">Tests Attempted</th>
                <th className="px-5 py-3.5 text-center">Accuracy %</th>
                <th className="px-5 py-3.5 text-right">Points Earned</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-medium">
              {currentList.map(entry => (
                <tr key={entry.rank} className="hover:bg-white/5 transition">
                  <td className="px-5 py-3.5 text-center font-mono font-bold">
                    {entry.rank === 1 ? (
                      <span className="w-6 h-6 rounded-full bg-amber-400 text-slate-950 inline-flex items-center justify-center text-xs">1</span>
                    ) : entry.rank === 2 ? (
                      <span className="w-6 h-6 rounded-full bg-slate-300 text-slate-950 inline-flex items-center justify-center text-xs">2</span>
                    ) : entry.rank === 3 ? (
                      <span className="w-6 h-6 rounded-full bg-amber-700 text-white inline-flex items-center justify-center text-xs">3</span>
                    ) : (
                      <span className="text-slate-400">#{entry.rank}</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <img
                        src={entry.avatar}
                        alt={entry.name}
                        className="w-8 h-8 rounded-full object-cover border border-white/10"
                      />
                      <div className="font-bold text-white">{entry.name}</div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-[10px] uppercase font-bold text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                      {entry.badge}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-center font-mono font-bold text-white">
                    {entry.testsAttempted}
                  </td>
                  <td className="px-5 py-3.5 text-center font-mono text-emerald-400">
                    {entry.accuracy}%
                  </td>
                  <td className="px-5 py-3.5 text-right font-mono font-bold text-[#FF8C32]">
                    {entry.points} pts
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="glass-panel p-6 rounded-3xl border border-rose-500/40 max-w-md w-full space-y-4">
            <div className="flex items-center gap-3 text-rose-400">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="font-heading font-bold text-base text-white">
                Confirm {showResetConfirm === 'daily' ? 'Daily' : 'Weekly'} Cycle Reset
              </h3>
            </div>

            <p className="text-xs text-slate-300">
              Are you sure you want to reset the current {showResetConfirm} leaderboard points to zero for all participating candidates? This action will be logged in the permanent audit trail.
            </p>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowResetConfirm(null)}
                className="px-4 py-2 rounded-xl bg-white/10 text-white font-semibold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleConfirmReset(showResetConfirm)}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs cursor-pointer"
              >
                Reset Cycle
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
