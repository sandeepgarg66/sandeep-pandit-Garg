import React from 'react';
import { Flame, ShieldCheck, Mail, MapPin, Heart } from 'lucide-react';
import { useQuiz } from '../context/QuizContext';

export const Footer: React.FC = () => {
  const { setActiveSection } = useQuiz();

  return (
    <footer className="bg-[#0B0F19] text-slate-400 border-t border-white/10 text-xs">
      {/* Top Ninja Banner */}
      <div className="bg-gradient-to-r from-orange-950/40 via-slate-900 to-orange-950/40 py-4 px-4 text-center border-b border-white/5">
        <p className="font-mono text-xs text-[#FF8C32] tracking-wider">
          ⚡ "A TRUE SHINOBI NEVER GIVES UP ON EXCELLENCE." — STANDARDIZED OMR EVALUATION ENGINE
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Col 1: Brand & Moto */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#FF8C32] flex items-center justify-center text-slate-950 font-bold">
                <Flame className="w-5 h-5 fill-slate-950" />
              </div>
              <span className="font-heading font-extrabold text-base text-white">
                Sanskar-X-NarutoQuiz
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed text-xs">
              A high-precision educational testing and practice ecosystem engineered for high-stakes competitive examinations. Providing authentic 5-option OMR testing with Option E no-response rules.
            </p>
            <div className="pt-2 text-[11px] text-slate-500">
              Compatible across Web & Future Mobile Application.
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div>
            <h4 className="font-heading text-xs uppercase tracking-wider text-white font-bold mb-4">
              Examination Modules
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => setActiveSection('student-new-tests')}
                  className="hover:text-[#FF8C32] transition text-left"
                >
                  Daily & Weekly Tests
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveSection('student-practice')}
                  className="hover:text-[#FF8C32] transition text-left"
                >
                  Subject-wise Practice Hub
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveSection('student-leaderboard')}
                  className="hover:text-[#FF8C32] transition text-left"
                >
                  Daily & Global Leaderboards
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveSection('student-performance')}
                  className="hover:text-[#FF8C32] transition text-left"
                >
                  Performance Analytics
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveSection('student-bookmarks')}
                  className="hover:text-[#FF8C32] transition text-left"
                >
                  Bookmarked Question Vault
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Legal & Examination Terms */}
          <div>
            <h4 className="font-heading text-xs uppercase tracking-wider text-white font-bold mb-4">
              Integrity & Policies
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>• One Candidate, One Attempt Policy</li>
              <li>• Option E (No Response) Marking Rule</li>
              <li>• Non-Destructive Audit Trail</li>
              <li>• Privacy Policy & Data Safeguards</li>
              <li>• Terms & Examination Conditions</li>
            </ul>
          </div>

          {/* Col 4: Platform Coordination */}
          <div>
            <h4 className="font-heading text-xs uppercase tracking-wider text-white font-bold mb-4">
              Institutional Contact
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#FF8C32]" />
                <span className="text-slate-300">exam.support@sanskar-narutoquiz.edu</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#FF8C32] shrink-0 mt-0.5" />
                <span>Konoha Academic Examination Board • All-India Prelims Portal</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 border-t border-white/5 flex flex-wrap items-center justify-between gap-4 text-[11px] text-slate-500">
          <span>© {new Date().getFullYear()} Sanskar-X-NarutoQuiz. All rights reserved.</span>
          <span>Designed with Premium Dark Glassmorphism & High-Stakes Examination Integrity.</span>
        </div>
      </div>
    </footer>
  );
};
