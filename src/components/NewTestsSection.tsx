import React, { useState, useMemo } from 'react';
import {
  Clock,
  HelpCircle,
  CheckCircle2,
  ShieldAlert,
  ArrowRight,
  Play,
  Eye,
  Search,
  Filter,
  Calendar,
  Layers,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Sparkles
} from 'lucide-react';
import { useQuiz } from '../context/QuizContext';
import { Test, TestCategory } from '../types/quiz';

interface NewTestsSectionProps {
  limit?: number;
  showFilters?: boolean;
}

export const NewTestsSection: React.FC<NewTestsSectionProps> = ({ limit, showFilters = true }) => {
  const { tests, startTestInstructions, hasAttempted, setActiveSection, getAttemptForTest } = useQuiz();

  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [availabilityFilter, setAvailabilityFilter] = useState<'All' | 'Available' | 'Attempted'>('All');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = limit || 6;

  const categories = [
    'All',
    'Daily Test',
    'Weekly Test',
    'Mock Test',
    'PYQ Test',
    'Chapter Test',
    'Subject-wise Test'
  ];

  const subjects = useMemo(() => {
    const set = new Set<string>();
    tests.forEach((t) => set.add(t.subject));
    return ['All', ...Array.from(set)];
  }, [tests]);

  const filteredTests = useMemo(() => {
    return tests.filter((test) => {
      // Must be published
      if (test.status !== 'Published') return false;

      // Category filter
      if (selectedCategory !== 'All' && test.category !== selectedCategory) return false;

      // Subject filter
      if (selectedSubject !== 'All' && test.subject !== selectedSubject) return false;

      // Search keyword
      if (
        searchKeyword.trim() &&
        !test.title.toLowerCase().includes(searchKeyword.toLowerCase()) &&
        !test.topic.toLowerCase().includes(searchKeyword.toLowerCase()) &&
        !test.subject.toLowerCase().includes(searchKeyword.toLowerCase())
      ) {
        return false;
      }

      // Availability filter
      const attempted = hasAttempted(test.id);
      if (availabilityFilter === 'Attempted' && !attempted) return false;
      if (availabilityFilter === 'Available' && attempted) return false;

      return true;
    });
  }, [tests, selectedCategory, selectedSubject, searchKeyword, availabilityFilter, hasAttempted]);

  const totalPages = Math.max(1, Math.ceil(filteredTests.length / itemsPerPage));
  const effectivePage = Math.min(currentPage, totalPages);
  const startIndex = (effectivePage - 1) * itemsPerPage;
  const displayTests = filteredTests.slice(startIndex, startIndex + itemsPerPage);

  return (
    <section className="py-14 bg-[#111827]/40 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Section Heading & Action Header */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-wider text-[#FF8C32] font-semibold mb-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#FF8C32]" />
              <span>Live Examination Portal</span>
            </div>
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-white">
              Available & Published Assessments
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Official timed tests with authoritative 5-Option OMR rules & automated result generation.
            </p>
          </div>

          {limit && (
            <button
              onClick={() => setActiveSection('student-new-tests')}
              className="px-4 py-2 rounded-xl text-xs font-semibold glass-card text-slate-300 hover:text-white transition flex items-center gap-1.5 cursor-pointer"
            >
              <span>Explore All Assessments ({tests.length})</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#FF8C32]" />
            </button>
          )}
        </div>

        {/* Search & Multi-Filter Controls */}
        {showFilters && (
          <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              {/* Search Bar */}
              <div className="md:col-span-5 relative">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchKeyword}
                  onChange={(e) => {
                    setSearchKeyword(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Search by test name, topic, or subject..."
                  className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-white/10 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#FF8C32] transition"
                />
              </div>

              {/* Subject Selector */}
              <div className="md:col-span-4">
                <select
                  value={selectedSubject}
                  onChange={(e) => {
                    setSelectedSubject(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full px-3 py-2 bg-slate-900 border border-white/10 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-[#FF8C32] transition"
                >
                  <option value="All">All Subjects ({subjects.length - 1})</option>
                  {subjects
                    .filter((s) => s !== 'All')
                    .map((sub) => (
                      <option key={sub} value={sub}>
                        {sub}
                      </option>
                    ))}
                </select>
              </div>

              {/* Availability Filter */}
              <div className="md:col-span-3 flex bg-slate-900 p-1 rounded-xl border border-white/10 text-xs">
                {(['All', 'Available', 'Attempted'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => {
                      setAvailabilityFilter(mode);
                      setCurrentPage(1);
                    }}
                    className={`flex-1 py-1 text-center rounded-lg font-medium transition cursor-pointer text-[11px] ${
                      availabilityFilter === mode
                        ? 'bg-[#FF8C32] text-slate-950 font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            {/* Test Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none pt-1 border-t border-white/5">
              <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider shrink-0 mr-1">
                Category:
              </span>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setCurrentPage(1);
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
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

        {/* Empty State */}
        {displayTests.length === 0 && (
          <div className="glass-panel p-12 text-center rounded-3xl border border-white/10 space-y-3">
            <BookOpen className="w-10 h-10 text-slate-500 mx-auto" />
            <h3 className="font-heading font-bold text-base text-white">No Matching Assessments Found</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              No examination matches your current search or filter criteria. Try resetting the filters or searching for different topics.
            </p>
            <button
              onClick={() => {
                setSearchKeyword('');
                setSelectedCategory('All');
                setSelectedSubject('All');
                setAvailabilityFilter('All');
              }}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-bold transition cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        )}

        {/* Tests Cards Grid or Clean Empty State */}
        {displayTests.length === 0 ? (
          <div className="glass-card p-12 sm:p-16 rounded-3xl border border-white/10 text-center max-w-lg mx-auto space-y-4 my-4">
            <div className="w-16 h-16 rounded-2xl bg-[#FF8C32]/10 border border-[#FF8C32]/20 text-[#FF8C32] flex items-center justify-center mx-auto shadow-inner">
              <BookOpen className="w-8 h-8 opacity-80" />
            </div>
            <div className="space-y-1.5">
              <h3 className="font-heading font-bold text-lg text-white">
                No tests are currently available.
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
                {searchKeyword || selectedCategory !== 'All' || selectedSubject !== 'All' || availabilityFilter !== 'All'
                  ? 'No examinations matched your active filter selections. Try clearing your filters to view all scheduled tests.'
                  : 'Official examinations and practice tests will be published here once authoring educators and administrators publish new assessments.'}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayTests.map((test) => {
              const attempted = hasAttempted(test.id);
              const pastAttempt = getAttemptForTest(test.id);

              return (
                <div
                  key={test.id}
                  className="glass-card rounded-2xl p-6 flex flex-col justify-between hover:border-[#FF8C32]/40 transition group relative overflow-hidden"
                >
                {/* Status indicator bar */}
                <div
                  className={`absolute top-0 left-0 right-0 h-1 ${
                    attempted ? 'bg-emerald-500' : 'bg-gradient-to-r from-orange-500 to-[#FF8C32]'
                  }`}
                />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#FF8C32] bg-[#FF8C32]/10 px-2.5 py-0.5 rounded-md border border-[#FF8C32]/20">
                      {test.category}
                    </span>

                    {attempted ? (
                      <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Attempted</span>
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400 font-mono">
                        {test.questions.length} Questions
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="font-heading text-lg font-bold text-white group-hover:text-[#FF8C32] transition line-clamp-2">
                      {test.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {test.description}
                    </p>
                  </div>

                  {/* Metadata Specification Grid */}
                  <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                    <div className="p-2 rounded-lg bg-white/5 border border-white/5 space-y-0.5">
                      <span className="text-[10px] text-slate-400 uppercase block font-semibold">Subject</span>
                      <span className="font-medium text-slate-200 truncate block" title={test.subject}>
                        {test.subject}
                      </span>
                    </div>

                    <div className="p-2 rounded-lg bg-white/5 border border-white/5 space-y-0.5">
                      <span className="text-[10px] text-slate-400 uppercase block font-semibold">Topic</span>
                      <span className="font-medium text-slate-300 truncate block" title={test.topic}>
                        {test.topic}
                      </span>
                    </div>

                    <div className="p-2 rounded-lg bg-white/5 border border-white/5 space-y-0.5">
                      <span className="text-[10px] text-slate-400 uppercase block font-semibold">Duration</span>
                      <span className="font-mono font-medium text-slate-200 block">
                        {test.durationMinutes} Minutes
                      </span>
                    </div>

                    <div className="p-2 rounded-lg bg-white/5 border border-white/5 space-y-0.5">
                      <span className="text-[10px] text-slate-400 uppercase block font-semibold">Max Marks</span>
                      <span className="font-mono font-medium text-[#FF8C32] block">
                        {test.maxMarks} Marks (+{test.marksPerCorrect}/Q)
                      </span>
                    </div>

                    <div className="p-2 rounded-lg bg-white/5 border border-white/5 space-y-0.5 col-span-2">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-[10px] text-slate-400 uppercase font-semibold">Negative Marking</span>
                        <span
                          className={`font-mono font-medium ${
                            test.negativeMarkingEnabled ? 'text-rose-400' : 'text-emerald-400'
                          }`}
                        >
                          {test.negativeMarkingEnabled
                            ? `-${test.negativeMarks} per wrong`
                            : 'None (0 penalty)'}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500 block">
                        Option E (अनुत्तरित) available for zero risk
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer Action Card Area */}
                <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between">
                  <div className="text-[11px] text-slate-400">
                    Faculty: <span className="text-slate-300 font-semibold">{test.teacherName || test.createdBy}</span>
                  </div>

                  {attempted ? (
                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 block">Your Score</span>
                        <span className="text-xs font-mono font-bold text-emerald-400">
                          {pastAttempt?.obtainedMarks} / {test.maxMarks}
                        </span>
                      </div>
                      <button
                        onClick={() => setActiveSection('student-performance')}
                        className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition flex items-center gap-1 cursor-pointer"
                        title="Review Attempt Result"
                      >
                        <Eye className="w-3.5 h-3.5 text-[#FF8C32]" />
                        <span>Scorecard</span>
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
        )}

        {/* Pagination Controls */}
        {showFilters && totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-white/10 pt-4 text-xs text-slate-400">
            <div>
              Showing {startIndex + 1}–{Math.min(startIndex + itemsPerPage, filteredTests.length)} of{' '}
              {filteredTests.length} tests
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={effectivePage === 1}
                className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-slate-300 transition"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {Array.from({ length: totalPages }).map((_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-8 h-8 rounded-lg font-mono text-xs font-bold transition ${
                      effectivePage === pageNum
                        ? 'bg-[#FF8C32] text-slate-950 shadow-md'
                        : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={effectivePage === totalPages}
                className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-slate-300 transition"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
