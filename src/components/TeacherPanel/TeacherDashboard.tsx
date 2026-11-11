import React, { useState } from 'react';
import {
  BookOpen,
  PlusCircle,
  FileCheck,
  CheckCircle,
  Clock,
  Send,
  Trash2,
  Edit,
  ArrowRight,
  Shield,
  Layers,
  HelpCircle,
  Sparkles
} from 'lucide-react';
import { useQuiz } from '../../context/QuizContext';
import { Test, Question, TestCategory, QuestionOptionKey } from '../../types/quiz';
import { AIBulkQuestionManager } from './AIBulkQuestionManager';

export const TeacherDashboard: React.FC = () => {
  const { tests, createTest, questions, addQuestion, setActiveSection, firebaseUser } = useQuiz();
  const [activeTab, setActiveTab] = useState<'tests' | 'create-test' | 'question-bank' | 'ai-bulk-import'>('tests');

  // Test creation form state
  const [testTitle, setTestTitle] = useState('');
  const [testDescription, setTestDescription] = useState('');
  const [testCategory, setTestCategory] = useState<TestCategory>('Daily Test');
  const [testSubject, setTestSubject] = useState('Indian Polity & Governance');
  const [testTopic, setTestTopic] = useState('Constitutional Bodies');
  const [testDuration, setTestDuration] = useState(15);
  const [negativeMarking, setNegativeMarking] = useState(true);
  const [testCreatedNotice, setTestCreatedNotice] = useState(false);

  // Question builder state
  const [qStatement, setQStatement] = useState('');
  const [optA, setOptA] = useState('');
  const [optB, setOptB] = useState('');
  const [optC, setOptC] = useState('');
  const [optD, setOptD] = useState('');
  const [correctKey, setCorrectKey] = useState<QuestionOptionKey>('A');
  const [qExplanation, setQExplanation] = useState('');
  const [qSubject, setQSubject] = useState('Indian Polity & Governance');
  const [qDifficulty, setQDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [qSavedNotice, setQSavedNotice] = useState(false);

  const handleCreateTestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createTest({
      title: testTitle,
      description: testDescription,
      category: testCategory,
      subject: testSubject,
      topic: testTopic,
      durationMinutes: Number(testDuration),
      totalQuestions: 5,
      maxMarks: 10,
      marksPerCorrect: 2,
      negativeMarkingEnabled: negativeMarking,
      negativeMarks: 0.5,
      createdBy: firebaseUser?.uid || 'Faculty Educator',
      teacherName: firebaseUser?.displayName || 'Faculty Educator',
      questions: questions.slice(0, 5)
    });
    setTestCreatedNotice(true);
    setTimeout(() => {
      setTestCreatedNotice(false);
      setActiveTab('tests');
    }, 2000);
  };

  const handleAddQuestionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addQuestion({
      statement: qStatement,
      options: { A: optA, B: optB, C: optC, D: optD },
      correctAnswer: correctKey,
      explanation: qExplanation,
      subject: qSubject,
      topic: 'General Topic',
      difficulty: qDifficulty,
      marks: 2
    });
    setQSavedNotice(true);
    setQStatement('');
    setOptA('');
    setOptB('');
    setOptC('');
    setOptD('');
    setQExplanation('');
    setTimeout(() => setQSavedNotice(false), 2500);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto py-8 px-4 sm:px-6">
      {/* Teacher Profile Header */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#EA580C] to-[#FF8C32] p-0.5 shadow-lg">
            <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center text-2xl font-bold text-[#FF8C32]">
              {(firebaseUser?.displayName ? firebaseUser.displayName.charAt(0).toUpperCase() : '忍')}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-bold text-[#FF8C32] bg-[#FF8C32]/10 px-2.5 py-0.5 rounded">
                Verified Educator
              </span>
              <span className="text-xs text-slate-400 font-mono">Academic Faculty</span>
            </div>
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-white mt-1">
              {firebaseUser?.displayName || 'Faculty Educator'}
            </h2>
            <p className="text-xs text-slate-400">
              {firebaseUser?.email || 'Department of Competitive Examination & Shastra Pedagogy'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('ai-bulk-import')}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-[#FF8C32] hover:opacity-95 text-white font-bold text-xs shadow transition flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>AI Question Generator</span>
          </button>
          <button
            onClick={() => setActiveTab('create-test')}
            className="px-4 py-2.5 rounded-xl bg-[#FF8C32] hover:bg-orange-400 text-slate-950 font-bold text-xs shadow transition flex items-center gap-1.5 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create New Test</span>
          </button>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-card p-5 rounded-2xl border border-white/5 space-y-1">
          <span className="text-[11px] text-slate-400 uppercase font-semibold">Total Tests</span>
          <div className="text-3xl font-extrabold font-mono text-white">{tests.length}</div>
          <span className="text-[10px] text-slate-400">Under administration</span>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-white/5 space-y-1">
          <span className="text-[11px] text-slate-400 uppercase font-semibold">Published</span>
          <div className="text-3xl font-extrabold font-mono text-emerald-400">
            {tests.filter(t => t.status === 'Published').length}
          </div>
          <span className="text-[10px] text-emerald-400 font-medium">Live for students</span>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-white/5 space-y-1">
          <span className="text-[11px] text-slate-400 uppercase font-semibold">Pending Approval</span>
          <div className="text-3xl font-extrabold font-mono text-amber-400">
            {tests.filter(t => t.status === 'Pending Approval').length}
          </div>
          <span className="text-[10px] text-amber-300">Under Admin review</span>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-white/5 space-y-1">
          <span className="text-[11px] text-slate-400 uppercase font-semibold">Questions Bank</span>
          <div className="text-3xl font-extrabold font-mono text-[#FF8C32]">{questions.length}</div>
          <span className="text-[10px] text-slate-400">Verified MCQ items</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-white/10 gap-2 text-xs font-semibold overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('tests')}
          className={`px-4 py-2.5 border-b-2 whitespace-nowrap transition cursor-pointer ${
            activeTab === 'tests' ? 'border-[#FF8C32] text-[#FF8C32]' : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          My Tests Catalog
        </button>
        <button
          onClick={() => setActiveTab('ai-bulk-import')}
          className={`px-4 py-2.5 border-b-2 whitespace-nowrap transition flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'ai-bulk-import' ? 'border-[#FF8C32] text-[#FF8C32]' : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-[#FF8C32]" />
          <span>AI Question Generator & Bulk Import</span>
        </button>
        <button
          onClick={() => setActiveTab('create-test')}
          className={`px-4 py-2.5 border-b-2 whitespace-nowrap transition cursor-pointer ${
            activeTab === 'create-test' ? 'border-[#FF8C32] text-[#FF8C32]' : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          Create Assessment Form
        </button>
        <button
          onClick={() => setActiveTab('question-bank')}
          className={`px-4 py-2.5 border-b-2 whitespace-nowrap transition cursor-pointer ${
            activeTab === 'question-bank' ? 'border-[#FF8C32] text-[#FF8C32]' : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          MCQ Builder (Manual)
        </button>
      </div>

      {/* Tab 1: My Tests Table */}
      {activeTab === 'tests' && (
        <div className="space-y-4">
          <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-900/90 text-slate-400 text-xs uppercase tracking-wider border-b border-white/10">
                  <tr>
                    <th className="px-5 py-3.5">Test Title</th>
                    <th className="px-5 py-3.5">Category</th>
                    <th className="px-5 py-3.5">Subject</th>
                    <th className="px-5 py-3.5 text-center">Questions</th>
                    <th className="px-5 py-3.5 text-center">Status</th>
                    <th className="px-5 py-3.5 text-right">Approval Workflow</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-medium">
                  {tests.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-5 py-12 text-center text-slate-400">
                        <BookOpen className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                        <p className="text-sm font-semibold text-slate-300">No tests created yet.</p>
                        <p className="text-xs text-slate-500 mt-1">
                          Use the Create Assessment Form or AI Question Generator to create your first test.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    tests.map((t) => (
                      <tr key={t.id} className="hover:bg-white/5 transition">
                        <td className="px-5 py-3.5 font-bold text-white">
                          {t.title}
                        </td>
                        <td className="px-5 py-3.5 text-[#FF8C32]">
                          {t.category}
                        </td>
                        <td className="px-5 py-3.5 text-slate-400">
                          {t.subject}
                        </td>
                        <td className="px-5 py-3.5 text-center font-mono">
                          {t.questions.length} Qs ({t.maxMarks} Marks)
                        </td>
                        <td className="px-5 py-3.5 text-center">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            t.status === 'Published'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : t.status === 'Pending Approval'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'bg-slate-800 text-slate-300 border border-white/10'
                          }`}>
                            {t.status}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <span className="text-[11px] text-slate-400">
                            {t.status === 'Published' ? 'Approved by Admin' : 'Submitted for review'}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Structured Test Creation Form */}
      {activeTab === 'create-test' && (
        <form onSubmit={handleCreateTestSubmit} className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6">
          <h3 className="font-heading font-bold text-lg text-white border-b border-white/5 pb-3">
            Publish New Assessment Configuration
          </h3>

          {testCreatedNotice && (
            <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs font-bold flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              <span>Assessment created successfully! Submitted to Admin for verification and publishing.</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Test Title *
              </label>
              <input
                type="text"
                required
                value={testTitle}
                onChange={(e) => setTestTitle(e.target.value)}
                placeholder="e.g. Daily Speed Drill — Parliament & Union Executive"
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs sm:text-sm focus:border-[#FF8C32] outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Description & Target Audience *
              </label>
              <textarea
                rows={2}
                required
                value={testDescription}
                onChange={(e) => setTestDescription(e.target.value)}
                placeholder="Brief guidelines regarding syllabus coverage and time limits..."
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs sm:text-sm focus:border-[#FF8C32] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Test Category *
              </label>
              <select
                value={testCategory}
                onChange={(e) => setTestCategory(e.target.value as TestCategory)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs sm:text-sm focus:border-[#FF8C32] outline-none"
              >
                <option value="Daily Test">Daily Test (प्रतिदिन अभ्यास)</option>
                <option value="Weekly Test">Weekly Test (साप्ताहिक परीक्षा)</option>
                <option value="Mock Test">Mock Test (सम्पूर्ण मॉक)</option>
                <option value="PYQ Test">PYQ Test (विगत वर्ष प्रश्न)</option>
                <option value="Chapter Test">Chapter Test (अध्याय-वार)</option>
                <option value="Subject-wise Test">Subject-wise Test (विषय-वार)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Subject Domain *
              </label>
              <input
                type="text"
                required
                value={testSubject}
                onChange={(e) => setTestSubject(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs sm:text-sm focus:border-[#FF8C32] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Duration (Minutes) *
              </label>
              <input
                type="number"
                min={5}
                max={180}
                required
                value={testDuration}
                onChange={(e) => setTestDuration(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs sm:text-sm focus:border-[#FF8C32] outline-none"
              />
            </div>

            <div className="flex items-center gap-3 pt-5">
              <input
                type="checkbox"
                id="negMark"
                checked={negativeMarking}
                onChange={(e) => setNegativeMarking(e.target.checked)}
                className="rounded accent-[#FF8C32] w-4 h-4 cursor-pointer"
              />
              <label htmlFor="negMark" className="text-xs text-slate-200 cursor-pointer">
                Enable Negative Marking (-0.5 per wrong answer; Option E has 0 penalty)
              </label>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-[#FF8C32] hover:bg-orange-400 text-slate-950 font-bold text-xs sm:text-sm shadow-md transition flex items-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4 fill-slate-950" />
              <span>Submit Test for Admin Approval</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab 3: MCQ Question Builder */}
      {activeTab === 'question-bank' && (
        <form onSubmit={handleAddQuestionSubmit} className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6">
          <div className="border-b border-white/5 pb-3">
            <h3 className="font-heading font-bold text-lg text-white">
              MCQ Question Builder
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              <strong>Mandatory Rule:</strong> Educators create exactly 4 factual answer choices (A, B, C, D). Option E is reserved in the student test interface as "No Response / Unattempted".
            </p>
          </div>

          {qSavedNotice && (
            <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs font-bold flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              <span>Question saved to centralized Question Bank!</span>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Question Statement *
              </label>
              <textarea
                rows={3}
                required
                value={qStatement}
                onChange={(e) => setQStatement(e.target.value)}
                placeholder="Enter clear, factual question statement..."
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs sm:text-sm focus:border-[#FF8C32] outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Option A *</label>
                <input
                  type="text"
                  required
                  value={optA}
                  onChange={(e) => setOptA(e.target.value)}
                  placeholder="Choice A"
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-[#FF8C32] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Option B *</label>
                <input
                  type="text"
                  required
                  value={optB}
                  onChange={(e) => setOptB(e.target.value)}
                  placeholder="Choice B"
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-[#FF8C32] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Option C *</label>
                <input
                  type="text"
                  required
                  value={optC}
                  onChange={(e) => setOptC(e.target.value)}
                  placeholder="Choice C"
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-[#FF8C32] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Option D *</label>
                <input
                  type="text"
                  required
                  value={optD}
                  onChange={(e) => setOptD(e.target.value)}
                  placeholder="Choice D"
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-[#FF8C32] outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Correct Answer Key *
                </label>
                <select
                  value={correctKey}
                  onChange={(e) => setCorrectKey(e.target.value as QuestionOptionKey)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:border-[#FF8C32] outline-none"
                >
                  <option value="A">Option A</option>
                  <option value="B">Option B</option>
                  <option value="C">Option C</option>
                  <option value="D">Option D</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Subject</label>
                <input
                  type="text"
                  value={qSubject}
                  onChange={(e) => setQSubject(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-[#FF8C32] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Difficulty</label>
                <select
                  value={qDifficulty}
                  onChange={(e) => setQDifficulty(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:border-[#FF8C32] outline-none"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Detailed Authoritative Explanation *
              </label>
              <textarea
                rows={3}
                required
                value={qExplanation}
                onChange={(e) => setQExplanation(e.target.value)}
                placeholder="Explain why the key is correct and provide background references..."
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs sm:text-sm focus:border-[#FF8C32] outline-none"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#FF8C32] hover:bg-orange-400 text-slate-950 font-bold text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add to Question Bank</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab 4: AI Question Generator & Bulk Import */}
      {activeTab === 'ai-bulk-import' && <AIBulkQuestionManager />}
    </div>
  );
};
