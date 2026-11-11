import React, { useState } from 'react';
import { Trophy, Flame, Award, ChevronUp, ChevronDown, Minus, Crown } from 'lucide-react';
import { useQuiz } from '../context/QuizContext';
import { LeaderboardEntry } from '../types/quiz';

export const LeaderboardSection: React.FC = () => {
  const { dailyLeaderboard, weeklyLeaderboard, globalLeaderboard, setActiveSection, studentProfile } = useQuiz();
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly' | 'global'>('global');

  const currentList =
    activeTab === 'daily'
      ? dailyLeaderboard
      : activeTab === 'weekly'
      ? weeklyLeaderboard
      : globalLeaderboard;

  const getRankBadgeStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return 'border-amber-400 text-amber-300 bg-amber-500/20';
      case 2:
        return 'border-slate-300 text-slate-200 bg-slate-400/20';
      case 3:
        return 'border-amber-600 text-amber-500 bg-amber-700/20';
      default:
        return 'border-white/10 text-slate-400 bg-white/5';
    }
  };

  const getNinjaBadgeColor = (badge: LeaderboardEntry['badge']) => {
    switch (badge) {
      case 'Hokage':
        return 'bg-gradient-to-r from-red-600 to-orange-500 text-white font-bold';
      case 'ANBU':
        return 'bg-purple-900/80 text-purple-200 border border-purple-500/40';
      case 'Jonin':
        return 'bg-emerald-900/80 text-emerald-200 border border-emerald-500/40';
      case 'Chunin':
        return 'bg-blue-900/80 text-blue-200 border border-blue-500/40';
      case 'Genin':
        return 'bg-slate-800 text-slate-300 border border-white/10';
    }
  };

  return (
    <section className="py-14 bg-[#0B0F19]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs uppercase tracking-wider text-[#FF8C32] font-semibold mb-1 flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5" />
              <span>Competitive Rankings</span>
            </div>
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-white">
              Shinobi Leaderboard Arena
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Top 10 aspirants ranked by verified published test scores. Private practice scores are strictly excluded from Global standings.
            </p>
          </div>

          {/* Leaderboard Tabs */}
          <div className="flex bg-slate-900 p-1 rounded-xl border border-white/10">
            <button
              onClick={() => setActiveTab('daily')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                activeTab === 'daily'
                  ? 'bg-[#FF8C32] text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Daily Ranks
            </button>
            <button
              onClick={() => setActiveTab('weekly')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                activeTab === 'weekly'
                  ? 'bg-[#FF8C32] text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Weekly Ranks
            </button>
            <button
              onClick={() => setActiveTab('global')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                activeTab === 'global'
                  ? 'bg-[#FF8C32] text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Global Lifetime
            </button>
          </div>
        </div>

        {/* Empty or Loaded Leaderboard Display */}
        {currentList.length === 0 ? (
          <div className="glass-card p-12 sm:p-16 rounded-3xl border border-white/10 text-center max-w-xl mx-auto my-6 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto shadow-inner">
              <Trophy className="w-8 h-8 opacity-80" />
            </div>
            <div className="space-y-1.5">
              <h3 className="font-heading font-bold text-lg text-white">
                No leaderboard data available yet
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed max-w-md mx-auto">
                Rankings are calculated dynamically from genuine candidate test submissions. Once registered students attempt and submit published examinations, live standings will appear here.
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Podium Top 3 Spotlight */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {currentList.slice(0, 3).map((student, idx) => {
                const podiumOrder =
                  idx === 0
                    ? 'order-1 md:order-2 md:-translate-y-2'
                    : idx === 1
                    ? 'order-2 md:order-1'
                    : 'order-3 md:order-3';
                const isFirst = student.rank === 1;

                return (
                  <div
                    key={student.studentId}
                    className={`glass-card p-6 rounded-2xl border flex flex-col items-center text-center relative overflow-hidden ${podiumOrder} ${
                      isFirst ? 'border-amber-400/50 shadow-lg shadow-amber-500/10' : 'border-white/10'
                    }`}
                  >
                    {isFirst && (
                      <div className="absolute top-3 right-3 text-amber-400">
                        <Crown className="w-5 h-5" />
                      </div>
                    )}

                    <div className="relative mb-3">
                      <img
                        src={student.avatar}
                        alt={student.name}
                        className="w-16 h-16 rounded-full object-cover border-2 border-white/20"
                      />
                      <span
                        className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full border text-xs font-mono font-bold flex items-center justify-center ${getRankBadgeStyle(
                          student.rank
                        )}`}
                      >
                        #{student.rank}
                      </span>
                    </div>

                    <h3 className="font-heading font-bold text-base text-white mt-1">
                      {student.name}
                    </h3>
                    <span
                      className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full mt-1 ${getNinjaBadgeColor(
                        student.badge
                      )}`}
                    >
                      {student.badge}
                    </span>

                    <div className="mt-4 pt-3 border-t border-white/10 w-full grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 block">Total Points</span>
                        <span className="font-mono font-extrabold text-[#FF8C32] text-sm">
                          {student.points.toLocaleString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Accuracy</span>
                        <span className="font-mono font-bold text-emerald-400 text-sm">
                          {student.accuracy}%
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Full Table Ranks */}
            <div className="glass-panel rounded-2xl overflow-hidden border border-white/10">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-slate-900/80 text-slate-400 text-xs uppercase tracking-wider border-b border-white/10">
                    <tr>
                      <th className="px-5 py-3.5 text-center">Rank</th>
                      <th className="px-5 py-3.5">Candidate Aspirant</th>
                      <th className="px-5 py-3.5 text-center">Class / Badge</th>
                      <th className="px-5 py-3.5 text-center">Tests Taken</th>
                      <th className="px-5 py-3.5 text-center">Accuracy</th>
                      <th className="px-5 py-3.5 text-right">Points</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-medium">
                    {currentList.map(entry => {
                      const isUser = Boolean(studentProfile.uid && entry.studentId === studentProfile.uid);
                      return (
                        <tr
                          key={entry.studentId}
                          className={`hover:bg-white/5 transition ${
                            isUser ? 'bg-[#FF8C32]/10 border-l-2 border-[#FF8C32]' : ''
                          }`}
                        >
                      <td className="px-5 py-3 text-center">
                        <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full font-mono text-xs font-bold border ${getRankBadgeStyle(entry.rank)}`}>
                          {entry.rank}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={entry.avatar}
                            alt={entry.name}
                            className="w-8 h-8 rounded-full object-cover border border-white/10"
                          />
                          <div>
                            <span className="font-bold text-white block">
                              {entry.name}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              ID: {entry.studentId}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-center">
                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${getNinjaBadgeColor(entry.badge)}`}>
                          {entry.badge}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-center font-mono text-slate-300">
                        {entry.testsAttempted}
                      </td>
                      <td className="px-5 py-3 text-center font-mono text-emerald-400 font-semibold">
                        {entry.accuracy}%
                      </td>
                      <td className="px-5 py-3 text-right font-mono font-extrabold text-[#FF8C32] text-sm">
                        {entry.points.toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="p-4 bg-slate-900/60 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
            <span>Points calculated strictly from authorized published assessments.</span>
            <button
              onClick={() => setActiveSection('student-leaderboard')}
              className="text-[#FF8C32] hover:underline font-semibold"
            >
              View Full Leaderboard & Filter by Subject
            </button>
          </div>
        </div>
        </>
        )}
      </div>
    </section>
  );
};
