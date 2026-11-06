import React, { useState } from 'react';
import {
  Database,
  Plus,
  Search,
  Filter,
  Trash2,
  Edit2,
  CheckCircle,
  HelpCircle,
  X,
  Layers,
  Sparkles
} from 'lucide-react';
import { useQuiz } from '../../context/QuizContext';
import { Question, QuestionOptionKey } from '../../types/quiz';

export const QuestionBankView: React.FC = () => {
  const { questions, addQuestion, updateQuestion, deleteQuestion, subjects } = useQuiz();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);

  // Form State
  const [statement, setStatement] = useState('');
  const [statementHindi, setStatementHindi] = useState('');
  const [optA, setOptA] = useState('');
  const [optB, setOptB] = useState('');
  const [optC, setOptC] = useState('');
  const [optD, setOptD] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState<QuestionOptionKey>('A');
  const [explanation, setExplanation] = useState('');
  const [subject, setSubject] = useState(subjects[0]?.name || 'Indian Polity & Governance');
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [marks, setMarks] = useState(2);

  const filteredQuestions = questions.filter(q => {
    const matchesSearch =
      q.statement.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (q.statementHindi && q.statementHindi.includes(searchTerm)) ||
      q.topic.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = selectedSubject === 'All' || q.subject === selectedSubject;
    const matchesDifficulty = selectedDifficulty === 'All' || q.difficulty === selectedDifficulty;
    return matchesSearch && matchesSubject && matchesDifficulty;
  });

  const handleOpenAddModal = () => {
    setEditingQuestionId(null);
    setStatement('');
    setStatementHindi('');
    setOptA('');
    setOptB('');
    setOptC('');
    setOptD('');
    setCorrectAnswer('A');
    setExplanation('');
    setSubject(subjects[0]?.name || 'Indian Polity & Governance');
    setTopic('');
    setDifficulty('Medium');
    setMarks(2);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (q: Question) => {
    setEditingQuestionId(q.id);
    setStatement(q.statement);
    setStatementHindi(q.statementHindi || '');
    setOptA(q.options.A);
    setOptB(q.options.B);
    setOptC(q.options.C);
    setOptD(q.options.D);
    setCorrectAnswer(q.correctAnswer);
    setExplanation(q.explanation);
    setSubject(q.subject);
    setTopic(q.topic);
    setDifficulty(q.difficulty);
    setMarks(q.marks);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!statement || !optA || !optB || !optC || !optD) return;

    if (editingQuestionId) {
      updateQuestion(editingQuestionId, {
        statement,
        statementHindi: statementHindi || undefined,
        options: { A: optA, B: optB, C: optC, D: optD },
        correctAnswer,
        explanation,
        subject,
        topic: topic || 'Core Subject Unit',
        difficulty,
        marks: Number(marks)
      });
    } else {
      addQuestion({
        statement,
        statementHindi: statementHindi || undefined,
        options: { A: optA, B: optB, C: optC, D: optD },
        correctAnswer,
        explanation,
        subject,
        topic: topic || 'Core Subject Unit',
        difficulty,
        marks: Number(marks)
      });
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-extrabold text-white">
            Question Bank Repository
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Institutional item repository. Strictly maintains 4 factual options (A–D); Option E is injected at exam runtime.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg transition flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Question</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="glass-panel p-4 rounded-2xl border border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search statement, topic, or keyword..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-900/60 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#FF8C32]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <select
            value={selectedSubject}
            onChange={e => setSelectedSubject(e.target.value)}
            className="px-3 py-2 bg-slate-900/60 border border-white/10 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-[#FF8C32]"
          >
            <option value="All">All Subjects</option>
            {subjects.map(s => (
              <option key={s.id} value={s.name}>
                {s.name}
              </option>
            ))}
          </select>

          <select
            value={selectedDifficulty}
            onChange={e => setSelectedDifficulty(e.target.value)}
            className="px-3 py-2 bg-slate-900/60 border border-white/10 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-[#FF8C32]"
          >
            <option value="All">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>
      </div>

      {/* Questions Catalog */}
      <div className="space-y-3">
        {filteredQuestions.length === 0 ? (
          <div className="glass-panel p-10 text-center rounded-2xl border border-white/10 text-xs text-slate-400">
            No questions matched your search criteria.
          </div>
        ) : (
          filteredQuestions.map((q, idx) => (
            <div
              key={q.id}
              className="glass-card p-5 rounded-2xl border border-white/10 space-y-3 hover:border-purple-500/30 transition"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase text-purple-300 bg-purple-500/20 px-2 py-0.5 rounded">
                      {q.subject}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      Topic: {q.topic}
                    </span>
                    <span
                      className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
                        q.difficulty === 'Easy'
                          ? 'text-emerald-300 bg-emerald-500/10'
                          : q.difficulty === 'Medium'
                          ? 'text-amber-300 bg-amber-500/10'
                          : 'text-rose-300 bg-rose-500/10'
                      }`}
                    >
                      {q.difficulty}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      ID: {q.id}
                    </span>
                  </div>

                  <h3 className="font-heading font-bold text-white text-sm pt-1">
                    <span className="text-[#FF8C32] mr-1.5">Q.</span>
                    {q.statement}
                  </h3>

                  {q.statementHindi && (
                    <p className="text-xs text-slate-400 italic">
                      {q.statementHindi}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => handleOpenEditModal(q)}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition cursor-pointer"
                    title="Edit Question"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => deleteQuestion(q.id)}
                    className="p-1.5 rounded-lg bg-rose-950/30 hover:bg-rose-900/50 text-rose-300 hover:text-rose-200 transition cursor-pointer"
                    title="Delete Question"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* 4 Options Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {(['A', 'B', 'C', 'D'] as const).map(optKey => {
                  const isCorrect = q.correctAnswer === optKey;
                  return (
                    <div
                      key={optKey}
                      className={`p-2 rounded-lg border flex items-center gap-2 ${
                        isCorrect
                          ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-200 font-semibold'
                          : 'bg-white/5 border-white/5 text-slate-300'
                      }`}
                    >
                      <span className={`w-5 h-5 rounded flex items-center justify-center font-bold text-[10px] ${
                        isCorrect ? 'bg-emerald-500 text-slate-950' : 'bg-white/10 text-slate-400'
                      }`}>
                        {optKey}
                      </span>
                      <span>{q.options[optKey]}</span>
                      {isCorrect && (
                        <span className="ml-auto text-[10px] font-bold text-emerald-400 uppercase">
                          Correct
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-white/5 text-[11px] text-slate-400">
                <strong className="text-slate-300">Explanation: </strong>
                {q.explanation}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add / Edit Question Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/20 max-w-2xl w-full space-y-4 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-heading font-bold text-lg text-white">
                {editingQuestionId ? 'Edit Question' : 'Add Question to Bank'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Question Statement (English) *
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="Enter full question text..."
                  value={statement}
                  onChange={e => setStatement(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-white/10 rounded-xl text-white placeholder-slate-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Question Statement (Hindi Translation)
                </label>
                <textarea
                  rows={2}
                  placeholder="हिंदी अनुवाद (वैकल्पिक)..."
                  value={statementHindi}
                  onChange={e => setStatementHindi(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-white/10 rounded-xl text-white placeholder-slate-500"
                />
              </div>

              {/* 4 Factual Options */}
              <div className="space-y-2">
                <div className="font-bold text-slate-200">
                  Four Factual Options (A, B, C, D):
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1">Option A *</label>
                    <input
                      type="text"
                      required
                      value={optA}
                      onChange={e => setOptA(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-white/10 rounded-xl text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Option B *</label>
                    <input
                      type="text"
                      required
                      value={optB}
                      onChange={e => setOptB(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-white/10 rounded-xl text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Option C *</label>
                    <input
                      type="text"
                      required
                      value={optC}
                      onChange={e => setOptC(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-white/10 rounded-xl text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Option D *</label>
                    <input
                      type="text"
                      required
                      value={optD}
                      onChange={e => setOptD(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-white/10 rounded-xl text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Answer Key & Meta */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Correct Key *
                  </label>
                  <select
                    value={correctAnswer}
                    onChange={e => setCorrectAnswer(e.target.value as QuestionOptionKey)}
                    className="w-full px-3 py-2 bg-slate-900 border border-white/10 rounded-xl text-emerald-400 font-bold"
                  >
                    <option value="A">Option A</option>
                    <option value="B">Option B</option>
                    <option value="C">Option C</option>
                    <option value="D">Option D</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Difficulty *
                  </label>
                  <select
                    value={difficulty}
                    onChange={e => setDifficulty(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-900 border border-white/10 rounded-xl text-white"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Subject *
                  </label>
                  <select
                    value={subject}
                    onChange={e => setSubject(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-white/10 rounded-xl text-white truncate"
                  >
                    {subjects.map(s => (
                      <option key={s.id} value={s.name}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Topic
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Fundamental Rights"
                    value={topic}
                    onChange={e => setTopic(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-white/10 rounded-xl text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Comprehensive Explanation *
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="Explain why the selected option is correct and cite sources/articles..."
                  value={explanation}
                  onChange={e => setExplanation(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-white/10 rounded-xl text-white"
                />
              </div>

              <div className="p-3 rounded-xl bg-[#FF8C32]/10 border border-[#FF8C32]/30 text-[#FF8C32] space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  <span>5-Option OMR Standard Reminder:</span>
                </div>
                <p className="text-[11px] text-orange-200">
                  Option E ('Unattempted / No Response') is automatically rendered for the candidate during test execution. Teachers and Admins only provide options A–D.
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/10 text-white font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold shadow-lg cursor-pointer"
                >
                  {editingQuestionId ? 'Save Changes' : 'Save Question'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
