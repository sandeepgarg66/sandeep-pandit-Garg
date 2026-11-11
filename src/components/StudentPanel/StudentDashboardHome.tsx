import React from 'react';
import {
  Trophy,
  CheckCircle,
  Clock,
  Target,
  Flame,
  Zap,
  ArrowRight,
  TrendingUp,
  Award,
  BookOpen,
  Calendar
} from 'lucide-react';
import { useQuiz } from '../../context/QuizContext';

export const StudentDashboardHome: React.FC = () => {
  const { studentProfile, setActiveSection, tests, startTestInstructions, hasAttempted } = useQuiz();

  const nextUnattemptedTest = tests.find(t => !hasAttempted(t.id));

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Welcome & Ninja Rank Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#FF8C32]/10 blur-[100px] pointer-events-none" />

        <div className="flex flex-wrap items-center justify-between gap-6 relative">
          <div className="flex items-center gap-4">
            <img
              src={
                studentProfile.photoURL ||
                `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(studentProfile.name || 'Candidate')}`
              }
              alt={studentProfile.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-[#FF8C32] shadow-lg shadow-orange-500/20"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-bold tracking-wider text-[#FF8C32] bg-[#FF8C32]/10 px-2 py-0.5 rounded">
                  {studentProfile.rankTitle}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {studentProfile.streakDays > 0 ? `${studentProfile.streakDays} Days Continuous Streak 🔥` : 'Ready to start'}
                </span>
              </div>
              <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-white mt-1">
                Welcome back, {studentProfile.name || 'Candidate'}!
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-lg">
                {studentProfile.totalTestsAttempted > 0
                  ? `Your overall examination accuracy is ${studentProfile.averageAccuracy}% across verified assessment attempts.`
                  : 'Welcome to your official examination workspace. Complete timed assessments under real exam conditions to establish your leaderboard standing.'}
              </p>
            </div>
          </div>

          {nextUnattemptedTest && (
            <button
              onClick={() => startTestInstructions(nextUnattemptedTest)}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-[#EA580C] to-[#FF8C32] hover:from-[#FF8C32] hover:to-amber-400 text-slate-950 font-bold text-xs sm:text-sm shadow-md transition flex items-center gap-2 shrink-0 cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-slate-950" />
              <span>Resume Daily Assessment</span>
            </button>
          )}
        </div>
      </div>

      {/* 5 Glass Statistic Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Card 1: Tests Attempted */}
        <div className="glass-card p-5 rounded-2xl border border-white/5 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] uppercase tracking-wider font-semibold">Total Tests</span>
            <CheckCircle className="w-4 h-4 text-[#FF8C32]" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white pt-1">
            {studentProfile.totalTestsAttempted}
          </div>
          <div className="text-[10px] text-slate-400">All submitted attempts</div>
        </div>

        {/* Card 2: Questions Solved */}
        <div className="glass-card p-5 rounded-2xl border border-white/5 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] uppercase tracking-wider font-semibold">Solved Questions</span>
            <BookOpen className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white pt-1">
            {studentProfile.totalQuestionsSolved}
          </div>
          <div className="text-[10px] text-slate-400">Across verified subjects</div>
        </div>

        {/* Card 3: Average Accuracy */}
        <div className="glass-card p-5 rounded-2xl border border-white/5 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] uppercase tracking-wider font-semibold">Average Accuracy</span>
            <Target className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-400 pt-1">
            {studentProfile.averageAccuracy}%
          </div>
          <div className="text-[10px] text-emerald-400/80 font-medium">
            {studentProfile.totalTestsAttempted > 0 ? 'Verified test average' : 'Awaiting first test'}
          </div>
        </div>

        {/* Card 4: Current Global Rank */}
        <div className="glass-card p-5 rounded-2xl border border-white/5 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] uppercase tracking-wider font-semibold">Global Rank</span>
            <Trophy className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-amber-400 pt-1">
            {studentProfile.currentGlobalRank > 0 ? `#${studentProfile.currentGlobalRank}` : '—'}
          </div>
          <div className="text-[10px] text-slate-400">
            {studentProfile.currentGlobalRank > 0 ? 'Verified ranking' : 'Unranked'}
          </div>
        </div>

        {/* Card 5: Lifetime Points */}
        <div className="glass-card p-5 rounded-2xl border border-white/5 space-y-1 col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] uppercase tracking-wider font-semibold">Lifetime Points</span>
            <Flame className="w-4 h-4 text-orange-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-[#FF8C32] pt-1">
            {studentProfile.lifetimePoints}
          </div>
          <div className="text-[10px] text-slate-400">Eligible published tests only</div>
        </div>
      </div>

      {/* Main Grid: Recent Test Activity & Recommended Modules */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Recent Test Activity */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-lg text-white">
              Recent Test Activity
            </h3>
            <button
              onClick={() => setActiveSection('student-performance')}
              className="text-xs text-[#FF8C32] hover:underline font-semibold"
            >
              View Full History
            </button>
          </div>

          {studentProfile.recentTestActivity.length === 0 ? (
            <div className="glass-card rounded-2xl border border-white/10 p-8 text-center space-y-2">
              <p className="text-xs text-slate-400">No recent test activity recorded yet.</p>
              <button
                onClick={() => setActiveSection('student-tests')}
                className="text-xs text-[#FF8C32] hover:underline font-semibold cursor-pointer"
              >
                Attempt a published test from the catalog to record your score →
              </button>
            </div>
          ) : (
            <div className="glass-card rounded-2xl border border-white/10 divide-y divide-white/5 overflow-hidden">
              {studentProfile.recentTestActivity.map((act, idx) => (
                <div key={idx} className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-white/5 transition">
                  <div className="space-y-1 min-w-0">
                    <h4 className="font-bold text-xs sm:text-sm text-white truncate">
                      {act.testName}
                    </h4>
                    <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono">
                      <span>{act.date}</span>
                      <span>•</span>
                      <span className="text-[#FF8C32]">Score: {act.score} / {act.maxScore}</span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-sm font-bold font-mono text-emerald-400">
                      {act.accuracy}%
                    </div>
                    <span className="text-[10px] text-slate-400 uppercase">Accuracy</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Fast Practice Shortcuts */}
        <div className="lg:col-span-5 space-y-4">
          <h3 className="font-heading font-bold text-lg text-white">
            Quick Practice Modes
          </h3>

          <div className="space-y-3">
            <div
              onClick={() => setActiveSection('student-practice')}
              className="p-4 rounded-2xl glass-card border border-white/10 hover:border-[#FF8C32]/40 transition cursor-pointer flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-[#FF8C32]">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white group-hover:text-[#FF8C32] transition">
                    Subject-wise Practice
                  </h4>
                  <p className="text-xs text-slate-400">Target Polity, Science & Quant</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-white group-hover:translate-x-1 transition" />
            </div>

            <div
              onClick={() => setActiveSection('student-bookmarks')}
              className="p-4 rounded-2xl glass-card border border-white/10 hover:border-[#FF8C32]/40 transition cursor-pointer flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white group-hover:text-[#FF8C32] transition">
                    Bookmarked Questions
                  </h4>
                  <p className="text-xs text-slate-400">Revise tricky conceptual traps</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-white group-hover:translate-x-1 transition" />
            </div>

            <div
              onClick={() => setActiveSection('student-previous-rank')}
              className="p-4 rounded-2xl glass-card border border-white/10 hover:border-[#FF8C32]/40 transition cursor-pointer flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
                  <Trophy className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white group-hover:text-[#FF8C32] transition">
                    My Historical Ranks
                  </h4>
                  <p className="text-xs text-slate-400">Compare percentiles & highest marks</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-white group-hover:translate-x-1 transition" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
