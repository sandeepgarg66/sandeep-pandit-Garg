import React, { useState } from 'react';
import {
  FileQuestion,
  Plus,
  Calendar,
  Layers,
  Award,
  Search,
  Filter,
  CheckCircle,
  X,
  ExternalLink
} from 'lucide-react';
import { useQuiz } from '../../context/QuizContext';
import { PYQSet } from '../../types/quiz';

export const PYQManagementView: React.FC = () => {
  const { pyqs, addPYQ, subjects } = useQuiz();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [examName, setExamName] = useState('');
  const [year, setYear] = useState(2025);
  const [subject, setSubject] = useState(subjects[0]?.name || 'Indian Polity & Governance');
  const [totalQuestions, setTotalQuestions] = useState(50);
  const [difficulty, setDifficulty] = useState<'Moderate' | 'Hard' | 'Tough'>('Moderate');

  const filteredPyqs = pyqs.filter(p =>
    p.examName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreatePYQ = (e: React.FormEvent) => {
    e.preventDefault();
    if (!examName.trim()) return;

    addPYQ({
      examName: examName.trim(),
      year: Number(year),
      subject,
      totalQuestions: Number(totalQuestions),
      difficulty,
      testId: `pyq-test-${Date.now()}`
    });

    setIsModalOpen(false);
    setExamName('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-extrabold text-white">
            Previous Year Questions (PYQ) Catalog
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Organize official past papers from competitive examinations (UPSC, SSC, NEET, JEE) for aspirant practice drills.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-lg transition flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add PYQ Paper Set</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-white/10 flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search exam paper or year..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-900/60 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500"
          />
        </div>

        <span className="text-xs font-mono text-cyan-300">
          {pyqs.length} Official Papers Registered
        </span>
      </div>

      {/* PYQ Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPyqs.map(p => (
          <div
            key={p.id}
            className="glass-card p-5 rounded-2xl border border-white/10 space-y-3 hover:border-cyan-500/30 transition flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-lg bg-cyan-500/20 text-cyan-300 text-[10px] font-mono font-bold">
                  {p.year} Exam Paper
                </span>
                <span
                  className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded ${
                    p.difficulty === 'Moderate'
                      ? 'text-emerald-300 bg-emerald-500/20'
                      : p.difficulty === 'Hard'
                      ? 'text-amber-300 bg-amber-500/20'
                      : 'text-rose-300 bg-rose-500/20'
                  }`}
                >
                  {p.difficulty}
                </span>
              </div>

              <h3 className="font-heading font-bold text-white text-base">
                {p.examName}
              </h3>
              <div className="text-xs text-slate-400">{p.subject}</div>
            </div>

            <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-300">
              <span className="font-mono">{p.totalQuestions} Questions</span>
              <span className="text-[11px] text-cyan-400 flex items-center gap-1 font-semibold">
                Available in Practice <ExternalLink className="w-3 h-3" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/20 max-w-md w-full space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-heading font-bold text-base text-white">
                Add Past Year Question Set
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePYQ} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Target Exam Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. UPSC CSE Prelims 2025 Paper 1"
                  value={examName}
                  onChange={e => setExamName(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-900 border border-white/10 rounded-xl text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Exam Year *</label>
                  <input
                    type="number"
                    min="2015"
                    max="2026"
                    value={year}
                    onChange={e => setYear(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-900 border border-white/10 rounded-xl text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Total Questions *</label>
                  <input
                    type="number"
                    min="5"
                    max="200"
                    value={totalQuestions}
                    onChange={e => setTotalQuestions(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-900 border border-white/10 rounded-xl text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Subject *</label>
                  <select
                    value={subject}
                    onChange={e => setSubject(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-white/10 rounded-xl text-white"
                  >
                    {subjects.map(s => (
                      <option key={s.id} value={s.name}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Difficulty *</label>
                  <select
                    value={difficulty}
                    onChange={e => setDifficulty(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-900 border border-white/10 rounded-xl text-white"
                  >
                    <option value="Moderate">Moderate</option>
                    <option value="Hard">Hard</option>
                    <option value="Tough">Tough</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/10 text-white font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold"
                >
                  Register PYQ Set
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
