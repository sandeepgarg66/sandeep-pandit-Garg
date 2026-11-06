import React, { useState } from 'react';
import { Clock, HelpCircle, CheckCircle2, ShieldAlert, ArrowRight, Play, Eye } from 'lucide-react';
import { useQuiz } from '../context/QuizContext';
import { Test, TestCategory } from '../types/quiz';

interface NewTestsSectionProps {
  limit?: number;
  showFilters?: boolean;
}

export const NewTestsSection: React.FC<NewTestsSectionProps> = ({ limit, showFilters = true }) => {
  const { tests, startTestInstructions, hasAttempted, setActiveSection, getAttemptForTest } = useQuiz();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [filterSubject, setFilterSubject] = useState<string>('All');

  const categories = ['All', 'Daily Test', 'Weekly Test', 'Mock Test', 'PYQ Test', 'Chapter Test', 'Subject-wise Test'];
  const subjects = ['All', 'General Science', 'Indian Polity & Governance', 'Ancient Indian History', 'Quantitative Aptitude', 'Ecology & Environment'];

  const filteredTests = tests.filter(test => {
    if (selectedCategory !== 'All' && test.category !== selectedCategory) return false;
    if (filterSubject !== 'All' && !test.subject.toLowerCase().includes(filterSubject.toLowerCase())) return false;
    return true;
  });

  const displayTests = limit ? filteredTests.slice(0, limit) : filteredTests;

  return (
    <section className="py-14 bg-[#111827]/40 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs uppercase tracking-wider text-[#FF8C32] font-semibold mb-1">
              Live Published Assessments
            </div>
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-white">
              Recently Published Tests
            </h2>
          </div>
          {limit && (
            <button
              onClick={() => setActiveSection('student-new-tests')}
              className="px-4 py-2 rounded-xl text-xs font-semibold glass-card text-slate-300 hover:text-white transition"
            >
              View All Tests ({tests.length})
            </button>
          )}
        </div>

        {/* Category & Subject Filters */}
        {showFilters && (
          <div className="space-y-3 mb-8">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-[#FF8C32] text-slate-950 font-bold shadow-md'
                      : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Tests Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayTests.map((test) => {
            const attempted = hasAttempted(test.id);
            const pastAttempt = getAttemptForTest(test.id);

            return (
              <div
                key={test.id}
                className="glass-card rounded-2xl p-6 flex flex-col justify-between hover:border-[#FF8C32]/40 transition group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#FF8C32] bg-[#FF8C32]/10 px-2.5 py-0.5 rounded-md border border-[#FF8C32]/20">
                      {test.category}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      {test.questions.length} Questions
                    </span>
                  </div>

                  <div>
                    <h3 className="font-heading text-lg font-bold text-white group-hover:text-[#FF8C32] transition line-clamp-2">
                      {test.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                      {test.description}
                    </p>
                  </div>

                  {/* Metadata Chips */}
                  <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                    <div className="p-2 rounded-lg bg-white/5 border border-white/5 space-y-0.5">
                      <span className="text-[10px] text-slate-400 uppercase block font-semibold">Subject</span>
                      <span className="font-medium text-slate-200 truncate block">{test.subject}</span>
                    </div>
                    <div className="p-2 rounded-lg bg-white/5 border border-white/5 space-y-0.5">
                      <span className="text-[10px] text-slate-400 uppercase block font-semibold">Duration</span>
                      <span className="font-mono font-medium text-slate-200 block">{test.durationMinutes} Minutes</span>
                    </div>
                    <div className="p-2 rounded-lg bg-white/5 border border-white/5 space-y-0.5">
                      <span className="text-[10px] text-slate-400 uppercase block font-semibold">Total Marks</span>
                      <span className="font-mono font-medium text-[#FF8C32] block">{test.maxMarks} Marks</span>
                    </div>
                    <div className="p-2 rounded-lg bg-white/5 border border-white/5 space-y-0.5">
                      <span className="text-[10px] text-slate-400 uppercase block font-semibold">Negative Marking</span>
                      <span className={`font-mono text-[11px] font-medium block ${test.negativeMarkingEnabled ? 'text-rose-400' : 'text-emerald-400'}`}>
                        {test.negativeMarkingEnabled ? `-${test.negativeMarks} per wrong` : 'None (No penalty)'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="pt-5 mt-4 border-t border-white/10 flex items-center justify-between">
                  <div className="text-[11px] text-slate-500">
                    By: <span className="text-slate-400">{test.teacherName || test.createdBy}</span>
                  </div>

                  {attempted ? (
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/30">
                        Score: {pastAttempt?.obtainedMarks} / {test.maxMarks}
                      </span>
                      <button
                        onClick={() => setActiveSection('student-performance')}
                        className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
                        title="View Attempt Result"
                      >
                        <Eye className="w-4 h-4 text-[#FF8C32]" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => startTestInstructions(test)}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#EA580C] to-[#FF8C32] hover:from-[#FF8C32] hover:to-amber-400 text-slate-950 font-bold text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-slate-950" />
                      <span>Start Test</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
