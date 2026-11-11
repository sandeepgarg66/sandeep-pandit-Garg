import React from 'react';
import { Flame, ArrowRight, BookOpen, ShieldCheck, Zap, Award } from 'lucide-react';
import { useQuiz } from '../context/QuizContext';

export const Hero: React.FC = () => {
  const { setActiveSection, tests, platformSettings } = useQuiz();

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-[#0B0F19] via-[#111827] to-[#0B0F19] text-slate-100 pt-8 pb-16 border-b border-white/5">
      {/* Subtle Naruto Chakra backdrop glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[#FF8C32]/10 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#FF8C32_1px,transparent_1px)] [background-size:28px_28px] pointer-events-none" />

      {/* Global Homepage Announcement Ticker */}
      {platformSettings.isBannerActive && platformSettings.bannerAnnouncement && (
        <div className="max-w-4xl mx-auto px-4 mb-6">
          <div className="p-3 rounded-2xl bg-gradient-to-r from-[#FF8C32]/20 via-purple-500/10 to-[#FF8C32]/20 border border-[#FF8C32]/40 text-center flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,140,50,0.15)]">
            <span className="text-xs sm:text-sm font-semibold text-white">
              {platformSettings.bannerAnnouncement}
            </span>
          </div>
        </div>
      )}

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          {/* Ninja Academy Kicker */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FF8C32]/15 border border-[#FF8C32]/30 text-[#FF8C32] text-xs font-semibold tracking-wider uppercase">
            <Flame className="w-3.5 h-3.5" />
            <span>The Shinobi Path to Academic Excellence</span>
          </div>

          {/* Main Heading */}
          <h1 className="font-heading text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Prepare Smarter,
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#FF8C32] via-orange-400 to-amber-300">
              Perform Better.
            </span>
          </h1>

          {/* Description */}
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-light max-w-2xl mx-auto">
            A battle-tested examination platform engineered for competitive exam aspirants. Practice time-bound mock drills, conquer standardized OMR assessments with Option E negative-marking protection, and rise through the Chunin to Hokage leaderboards.
          </p>

          {/* CTA Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full max-w-md mx-auto">
            <button
              onClick={() => setActiveSection('student-new-tests')}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-[#EA580C] to-[#FF8C32] hover:from-[#FF8C32] hover:to-amber-400 text-slate-950 font-bold text-sm sm:text-base shadow-lg shadow-orange-500/20 hover:scale-[1.02] active:scale-[0.98] transition flex items-center justify-center gap-2 cursor-pointer min-h-[44px]"
            >
              <span>Explore Tests</span>
              <ArrowRight className="w-4 h-4 text-slate-950" />
            </button>
            <button
              onClick={() => setActiveSection('student-practice')}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl glass-card hover:border-[#FF8C32]/50 text-slate-200 hover:text-white font-semibold text-sm sm:text-base transition hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer min-h-[44px]"
            >
              <BookOpen className="w-4 h-4 text-[#FF8C32]" />
              <span>Start Practicing</span>
            </button>
          </div>

          {/* Trust Metrics Strip */}
          <div className="pt-8 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-3">
              <div className="text-2xl sm:text-3xl font-extrabold font-mono text-[#FF8C32]">
                {tests.length}+
              </div>
              <div className="text-xs text-slate-400 mt-0.5">Live Published Tests</div>
            </div>
            <div className="p-3">
              <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white">
                5-Option
              </div>
              <div className="text-xs text-slate-400 mt-0.5">OMR Standard (A–E)</div>
            </div>
            <div className="p-3">
              <div className="text-2xl sm:text-3xl font-extrabold font-mono text-[#FF8C32]">
                100%
              </div>
              <div className="text-xs text-slate-400 mt-0.5">Negative Mark Accuracy</div>
            </div>
            <div className="p-3">
              <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white">
                Triple
              </div>
              <div className="text-xs text-slate-400 mt-0.5">Daily, Weekly & Global Ranks</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
