import React from 'react';
import { Search, X, Clock, ArrowRight, Play, BookOpen } from 'lucide-react';
import { useQuiz } from '../context/QuizContext';

export const SearchModal: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen, searchQuery, setSearchQuery, tests, startTestInstructions, setActiveSection } = useQuiz();

  if (!isSearchOpen) return null;

  const results = tests.filter(t =>
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:pt-20 bg-[#0B0F19]/80 backdrop-blur-md">
      <div className="w-full max-w-2xl bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-white/10 flex items-center gap-3">
          <Search className="w-5 h-5 text-[#FF8C32] shrink-0" />
          <input
            type="text"
            autoFocus
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by test name, subject (Polity, Science, History), or category..."
            className="w-full bg-transparent text-white placeholder-slate-400 text-sm outline-none"
          />
          <button
            onClick={() => setIsSearchOpen(false)}
            className="p-1 text-slate-400 hover:text-white rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="p-4 max-h-[60vh] overflow-y-auto space-y-2">
          {searchQuery.trim() === '' ? (
            <div className="py-8 text-center text-xs text-slate-400">
              Type keywords like <span className="text-[#FF8C32]">Polity</span>, <span className="text-[#FF8C32]">Science</span>, <span className="text-[#FF8C32]">Chunin</span>, or <span className="text-[#FF8C32]">PYQ</span> to search.
            </div>
          ) : results.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              No matching published tests found for "{searchQuery}".
            </div>
          ) : (
            results.map((test) => (
              <div
                key={test.id}
                className="p-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-[#FF8C32]/30 transition flex items-center justify-between gap-4"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 text-[10px]">
                    <span className="font-bold uppercase text-[#FF8C32] bg-[#FF8C32]/10 px-2 py-0.5 rounded">
                      {test.category}
                    </span>
                    <span className="text-slate-400">{test.subject}</span>
                  </div>
                  <h4 className="font-bold text-xs sm:text-sm text-white truncate">
                    {test.title}
                  </h4>
                  <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono">
                    <span>{test.questions.length} Qs</span>
                    <span>•</span>
                    <span>{test.durationMinutes} Mins</span>
                    <span>•</span>
                    <span className="text-[#FF8C32]">{test.maxMarks} Marks</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setIsSearchOpen(false);
                    startTestInstructions(test);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-[#FF8C32] hover:bg-orange-400 text-slate-950 font-bold text-xs shrink-0 flex items-center gap-1 transition"
                >
                  <Play className="w-3 h-3 fill-slate-950" />
                  <span>Start</span>
                </button>
              </div>
            ))
          )}
        </div>

        <div className="p-3 bg-slate-950/70 border-t border-white/10 text-center text-[11px] text-slate-400">
          Press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">Esc</kbd> to exit search
        </div>
      </div>
    </div>
  );
};
