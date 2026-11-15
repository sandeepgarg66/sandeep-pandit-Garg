import React, { useState, useMemo } from 'react';
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
  Sparkles,
  Search,
  Filter,
  CheckSquare,
  Square,
  AlertCircle,
  X,
  Eye,
  Check
} from 'lucide-react';
import { useQuiz } from '../../context/QuizContext';
import { Test, Question, TestCategory, QuestionOptionKey } from '../../types/quiz';
import { AIBulkQuestionManager } from './AIBulkQuestionManager';

export const TeacherDashboard: React.FC = () => {
  const { tests, createTest, deleteTest, questions, addQuestion, setActiveSection, firebaseUser } = useQuiz();
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
  const [validationError, setValidationError] = useState<string | null>(null);

  // Question Selection State for Create Assessment Form
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<string[]>([]);
  const [questionSearchQuery, setQuestionSearchQuery] = useState('');
  const [questionSubjectFilter, setQuestionSubjectFilter] = useState('All');
  const [questionDifficultyFilter, setQuestionDifficultyFilter] = useState('All');
  const [expandedPreviewQId, setExpandedPreviewQId] = useState<string | null>(null);

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

  // STRICT TEACHER ISOLATION:
  // 1. My Tests: only tests where createdBy === current authenticated teacher's UID
  const currentTeacherUid = firebaseUser?.uid;
  const myTests = useMemo(() => {
    if (!currentTeacherUid) return [];
    return tests.filter(t => t.createdBy === currentTeacherUid);
  }, [tests, currentTeacherUid]);

  // 2. My Questions Bank: only questions created by the currently authenticated teacher
  // Questions with no verified owner or created by another teacher are strictly excluded!
  const myQuestions = useMemo(() => {
    if (!currentTeacherUid) return [];
    return questions.filter(q => q.createdBy === currentTeacherUid);
  }, [questions, currentTeacherUid]);

  // Distinct subjects available in the teacher's own question bank
  const mySubjects = useMemo(() => {
    const set = new Set<string>();
    myQuestions.forEach(q => {
      if (q.subject) set.add(q.subject);
    });
    return Array.from(set);
  }, [myQuestions]);

  // Filtered Questions for Selection
  const filteredMyQuestions = useMemo(() => {
    return myQuestions.filter(q => {
      const matchSearch = questionSearchQuery.trim() === '' ||
        q.statement.toLowerCase().includes(questionSearchQuery.toLowerCase()) ||
        q.topic?.toLowerCase().includes(questionSearchQuery.toLowerCase());
      const matchSubject = questionSubjectFilter === 'All' || q.subject === questionSubjectFilter;
      const matchDiff = questionDifficultyFilter === 'All' || q.difficulty === questionDifficultyFilter;
      return matchSearch && matchSubject && matchDiff;
    });
  }, [myQuestions, questionSearchQuery, questionSubjectFilter, questionDifficultyFilter]);

  // Selected Question Objects
  const selectedQuestionObjects = useMemo(() => {
    const map = new Map<string, Question>();
    myQuestions.forEach(q => map.set(q.id, q));
    return selectedQuestionIds.map(id => map.get(id)).filter((q): q is Question => Boolean(q));
  }, [myQuestions, selectedQuestionIds]);

  // Automatic calculations according to existing project rules
  const calculatedTotalQuestions = selectedQuestionObjects.length;
  const marksPerCorrect = 2; // Standard competitive exam unit
  const calculatedMaxMarks = calculatedTotalQuestions * marksPerCorrect;
  const calculatedNegativeMarks = negativeMarking ? 0.5 : 0; // -0.5 per wrong answer (1/4th penalty)

  // Toggle selection for an individual question
  const toggleSelectQuestion = (qId: string) => {
    setValidationError(null);
    setSelectedQuestionIds(prev =>
      prev.includes(qId) ? prev.filter(id => id !== qId) : [...prev, qId]
    );
  };

  // Select all visible / Deselect all
  const handleSelectAllVisible = () => {
    setValidationError(null);
    const visibleIds = filteredMyQuestions.map(q => q.id);
    setSelectedQuestionIds(prev => {
      const combined = new Set([...prev, ...visibleIds]);
      return Array.from(combined);
    });
  };

  const handleDeselectAll = () => {
    setValidationError(null);
    setSelectedQuestionIds([]);
  };

  const handleRemoveSelectedQuestion = (qId: string) => {
    setSelectedQuestionIds(prev => prev.filter(id => id !== qId));
  };

  const handleCreateTestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!currentTeacherUid) {
      setValidationError('Authentication required: You must be logged in as a teacher.');
      return;
    }

    if (!testTitle.trim()) {
      setValidationError('Test Title is required.');
      return;
    }

    if (selectedQuestionObjects.length === 0) {
      setValidationError('Question Bank Selection Required: You must select at least 1 question from your Question Bank to create a test.');
      return;
    }

    // Verify all selected questions strictly belong to the current teacher
    const unauthorizedQ = selectedQuestionObjects.find(q => q.createdBy !== currentTeacherUid);
    if (unauthorizedQ) {
      setValidationError('Security Violation: One or more selected questions do not belong to your account.');
      return;
    }

    // Check for duplicate questions
    const qIdsSet = new Set<string>();
    for (const q of selectedQuestionObjects) {
      if (qIdsSet.has(q.id)) {
        setValidationError(`Duplicate question detected: "${q.statement.slice(0, 40)}..."`);
        return;
      }
      qIdsSet.add(q.id);
    }

    createTest({
      title: testTitle.trim(),
      description: testDescription.trim(),
      category: testCategory,
      subject: testSubject.trim(),
      topic: testTopic.trim(),
      durationMinutes: Number(testDuration),
      totalQuestions: calculatedTotalQuestions,
      maxMarks: calculatedMaxMarks,
      marksPerCorrect: marksPerCorrect,
      negativeMarkingEnabled: negativeMarking,
      negativeMarks: calculatedNegativeMarks,
      createdBy: currentTeacherUid,
      teacherName: firebaseUser?.displayName || 'Faculty Educator',
      questions: selectedQuestionObjects,
      status: 'Pending Approval'
    });

    setTestCreatedNotice(true);
    // Reset selection and form
    setTestTitle('');
    setTestDescription('');
    setSelectedQuestionIds([]);
    setTimeout(() => {
      setTestCreatedNotice(false);
      setActiveTab('tests');
    }, 2200);
  };

  const handleAddQuestionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTeacherUid) {
      alert('Authentication required: You must be signed in as an educator.');
      return;
    }

    addQuestion({
      statement: qStatement.trim(),
      options: { A: optA.trim(), B: optB.trim(), C: optC.trim(), D: optD.trim() },
      correctAnswer: correctKey,
      explanation: qExplanation.trim(),
      subject: qSubject.trim(),
      topic: 'General Topic',
      difficulty: qDifficulty,
      marks: 2,
      createdBy: currentTeacherUid,
      createdByName: firebaseUser?.displayName || 'Faculty Educator'
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
    <div className="w-full max-w-6xl mx-auto py-6 sm:py-8 px-3 sm:px-6 space-y-6 sm:space-y-8 overflow-x-hidden">
      {/* Teacher Profile Header */}
      <div className="glass-panel p-5 sm:p-8 rounded-2xl sm:rounded-3xl border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 w-full">
        <div className="flex items-center gap-3.5 sm:gap-4 min-w-0 w-full md:w-auto">
          <div className="w-13 h-13 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-[#EA580C] to-[#FF8C32] p-0.5 shadow-lg shrink-0">
            <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center text-xl sm:text-2xl font-bold text-[#FF8C32]">
              {(firebaseUser?.displayName ? firebaseUser.displayName.charAt(0).toUpperCase() : '忍')}
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] sm:text-xs uppercase font-bold text-[#FF8C32] bg-[#FF8C32]/10 px-2 py-0.5 rounded">
                Verified Educator
              </span>
              <span className="text-[10px] sm:text-xs text-slate-400 font-mono">Academic Faculty</span>
            </div>
            <h2 className="font-heading text-lg sm:text-2xl lg:text-3xl font-extrabold text-white mt-1 truncate">
              {firebaseUser?.displayName || 'Faculty Educator'}
            </h2>
            <p className="text-[11px] sm:text-xs text-slate-400 truncate">
              {firebaseUser?.email || 'Department of Competitive Examination & Shastra Pedagogy'}
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full md:w-auto">
          {/* Part 4: Teacher Can Use Student Panel */}
          <button
            onClick={() => setActiveSection('student-dashboard')}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white font-bold text-xs shadow transition flex items-center justify-center gap-1.5 cursor-pointer min-h-[40px]"
            title="Practice MCQs, attempt exams, track rank using your faculty account"
          >
            <BookOpen className="w-4 h-4 text-[#FF8C32] shrink-0" />
            <span>Open Student Panel</span>
          </button>
          <button
            onClick={() => setActiveTab('ai-bulk-import')}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-[#FF8C32] hover:opacity-95 text-white font-bold text-xs shadow transition flex items-center justify-center gap-1.5 cursor-pointer min-h-[40px]"
          >
            <Sparkles className="w-4 h-4 shrink-0" />
            <span>AI Question Generator</span>
          </button>
          <button
            onClick={() => setActiveTab('create-test')}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#FF8C32] hover:bg-orange-400 text-slate-950 font-bold text-xs shadow transition flex items-center justify-center gap-1.5 cursor-pointer min-h-[40px]"
          >
            <PlusCircle className="w-4 h-4 shrink-0" />
            <span>Create New Test</span>
          </button>
        </div>
      </div>

      {/* 4 Stat Cards - Filtered Strictly to Current Teacher */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 w-full">
        <div className="glass-card p-4 sm:p-5 rounded-2xl border border-white/5 space-y-1">
          <span className="text-[11px] text-slate-400 uppercase font-semibold">My Authored Tests</span>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white">{myTests.length}</div>
          <span className="text-[10px] text-slate-400">Created by you</span>
        </div>

        <div className="glass-card p-4 sm:p-5 rounded-2xl border border-white/5 space-y-1">
          <span className="text-[11px] text-slate-400 uppercase font-semibold">Published</span>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-400">
            {myTests.filter(t => t.status === 'Published').length}
          </div>
          <span className="text-[10px] text-emerald-400 font-medium">Live for students</span>
        </div>

        <div className="glass-card p-4 sm:p-5 rounded-2xl border border-white/5 space-y-1">
          <span className="text-[11px] text-slate-400 uppercase font-semibold">Pending Approval</span>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-amber-400">
            {myTests.filter(t => t.status === 'Pending Approval').length}
          </div>
          <span className="text-[10px] text-amber-300">Under Admin review</span>
        </div>

        <div className="glass-card p-4 sm:p-5 rounded-2xl border border-white/5 space-y-1">
          <span className="text-[11px] text-slate-400 uppercase font-semibold">My Question Bank</span>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-[#FF8C32]">{myQuestions.length}</div>
          <span className="text-[10px] text-slate-400">Your private MCQs</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="w-full max-w-full overflow-x-auto pb-1 scrollbar-none flex border-b border-white/10 gap-2 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('tests')}
          className={`px-4 py-2.5 border-b-2 whitespace-nowrap transition cursor-pointer ${
            activeTab === 'tests' ? 'border-[#FF8C32] text-[#FF8C32]' : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          My Tests Catalog ({myTests.length})
        </button>
        <button
          onClick={() => setActiveTab('create-test')}
          className={`px-4 py-2.5 border-b-2 whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'create-test' ? 'border-[#FF8C32] text-[#FF8C32]' : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <PlusCircle className="w-3.5 h-3.5 text-[#FF8C32]" />
          <span>Create Assessment Form</span>
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
          onClick={() => setActiveTab('question-bank')}
          className={`px-4 py-2.5 border-b-2 whitespace-nowrap transition cursor-pointer ${
            activeTab === 'question-bank' ? 'border-[#FF8C32] text-[#FF8C32]' : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          MCQ Builder (Manual)
        </button>
      </div>

      {/* Tab 1: My Tests Catalog (Strictly Isolated to Current Teacher) */}
      {activeTab === 'tests' && (
        <div className="space-y-4">
          <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden">
            <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-white/10">
              <table className="w-full text-left text-xs sm:text-sm border-collapse min-w-[760px]">
                <thead className="bg-slate-900/90 text-slate-400 text-xs uppercase tracking-wider border-b border-white/10">
                  <tr>
                    <th className="px-5 py-3.5 min-w-[220px]">Test Title</th>
                    <th className="px-5 py-3.5 min-w-[120px]">Category</th>
                    <th className="px-5 py-3.5 min-w-[140px]">Subject</th>
                    <th className="px-5 py-3.5 min-w-[110px] text-center">Questions</th>
                    <th className="px-5 py-3.5 min-w-[140px] text-center">Status</th>
                    <th className="px-5 py-3.5 min-w-[200px] text-left">Approval Workflow</th>
                    <th className="px-5 py-3.5 min-w-[80px] text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-medium">
                  {myTests.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-5 py-12 text-center text-slate-400">
                        <BookOpen className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                        <p className="text-sm font-semibold text-slate-300">You haven't created any tests yet.</p>
                        <p className="text-xs text-slate-500 mt-1">
                          Use the <strong>Create Assessment Form</strong> to select questions from your private Question Bank and submit your first test for institutional review.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    myTests.map((t) => {
                      const canDelete = t.status !== 'Published';
                      const isPending = t.status === 'Pending Approval';
                      const isPublished = t.status === 'Published';
                      const isRejected = t.status === 'Rejected';
                      const hasAdminApproval = Boolean(t.approvedBy || t.approvalStatus === 'Approved');

                      return (
                        <tr key={t.id} className="hover:bg-white/5 transition">
                          <td className="px-5 py-3.5 font-bold text-white max-w-[260px] break-words">
                            <div>{t.title}</div>
                            <span className="text-[10px] text-slate-400 font-normal">
                              Author: {t.teacherName || firebaseUser?.displayName || 'Educator'}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-[#FF8C32] whitespace-nowrap">
                            {t.category}
                          </td>
                          <td className="px-5 py-3.5 text-slate-300">
                            {t.subject}
                          </td>
                          <td className="px-5 py-3.5 text-center font-mono whitespace-nowrap">
                            {t.questions.length} Qs <span className="text-slate-400 text-[11px]">({t.maxMarks} M)</span>
                          </td>
                          <td className="px-5 py-3.5 text-center whitespace-nowrap">
                            <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              isPublished
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : isPending
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                : isRejected
                                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                : 'bg-slate-800 text-slate-300 border border-white/10'
                            }`}>
                              {t.status}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-left">
                            {isPending && (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-300 text-[11px] font-semibold border border-amber-500/20 whitespace-nowrap">
                                <Clock className="w-3.5 h-3.5 shrink-0" />
                                <span>Awaiting Admin Review</span>
                              </span>
                            )}
                            {isPublished && hasAdminApproval && (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 text-[11px] font-semibold border border-emerald-500/20 whitespace-nowrap">
                                <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                                <span>Approved by Admin</span>
                              </span>
                            )}
                            {isPublished && !hasAdminApproval && (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 text-[11px] font-semibold border border-emerald-500/20 whitespace-nowrap">
                                <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                                <span>Published (Institutional)</span>
                              </span>
                            )}
                            {isRejected && (
                              <div className="space-y-0.5">
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-500/10 text-rose-300 text-[11px] font-semibold border border-rose-500/20 whitespace-nowrap">
                                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                                  <span>Rejected by Admin</span>
                                </span>
                                {t.rejectionReason && (
                                  <p className="text-[10px] text-rose-300/80 max-w-[200px] truncate" title={t.rejectionReason}>
                                    Note: {t.rejectionReason}
                                  </p>
                                )}
                              </div>
                            )}
                            {t.status === 'Draft' && (
                              <span className="text-[11px] text-slate-400">
                                Unsubmitted Draft
                              </span>
                            )}
                          </td>
                          <td className="px-5 py-3.5 text-right whitespace-nowrap">
                            {canDelete ? (
                              <button
                                onClick={() => {
                                  if (confirm(`Are you sure you want to delete "${t.title}"?`)) {
                                    deleteTest(t.id);
                                  }
                                }}
                                className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition cursor-pointer"
                                title="Delete Test"
                              >
                                <Trash2 className="w-4 h-4 inline" />
                              </button>
                            ) : (
                              <span className="text-[10px] text-slate-500 italic">Locked</span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Structured Test Creation Form with Integrated Question Bank Selector */}
      {activeTab === 'create-test' && (
        <form onSubmit={handleCreateTestSubmit} className="space-y-6">
          {/* Card 1: Test Metadata & Configuration */}
          <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6">
            <div className="border-b border-white/5 pb-3">
              <h3 className="font-heading font-bold text-lg text-white">
                Create New Assessment Configuration
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Configure test information, syllabus parameters, and select questions from your verified Question Bank.
              </p>
            </div>

            {testCreatedNotice && (
              <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs font-bold flex items-center gap-2">
                <CheckCircle className="w-5 h-5 shrink-0" />
                <span>Assessment created successfully with {calculatedTotalQuestions} questions! Submitted to Admin for verification and publishing.</span>
              </div>
            )}

            {validationError && (
              <div className="p-4 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{validationError}</span>
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
                  onChange={(e) => {
                    setTestTitle(e.target.value);
                    setValidationError(null);
                  }}
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
                  placeholder="Brief guidelines regarding syllabus coverage, exam pattern and time limits..."
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
                  Topic / Syllabus Scope *
                </label>
                <input
                  type="text"
                  required
                  value={testTopic}
                  onChange={(e) => setTestTopic(e.target.value)}
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

              <div className="sm:col-span-2 flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="negMark"
                  checked={negativeMarking}
                  onChange={(e) => setNegativeMarking(e.target.checked)}
                  className="rounded accent-[#FF8C32] w-4 h-4 cursor-pointer"
                />
                <label htmlFor="negMark" className="text-xs text-slate-200 cursor-pointer">
                  Enable Negative Marking (-0.5 per wrong answer; Option E has 0 penalty as per Ninja Rule)
                </label>
              </div>
            </div>
          </div>

          {/* Card 2: Select Questions from My Question Bank (Strictly Teacher Isolated) */}
          <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <Layers className="w-5 h-5 text-[#FF8C32]" />
                  <h3 className="font-heading font-bold text-lg text-white">
                    Select Questions from My Question Bank
                  </h3>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Showing only questions created by your account ({firebaseUser?.email || 'Authenticated Faculty'}). Strict teacher isolation is active.
                </p>
              </div>

              {/* Counts Badge */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold px-3 py-1.5 rounded-xl bg-[#FF8C32]/20 text-[#FF8C32] border border-[#FF8C32]/30">
                  {selectedQuestionIds.length} Selected
                </span>
                <span className="text-xs font-mono text-slate-400 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10">
                  {myQuestions.length} Available in Bank
                </span>
              </div>
            </div>

            {/* Search, Filter & Bulk Select Controls */}
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3 text-xs">
              {/* Search input */}
              <div className="flex-1 relative min-w-[200px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={questionSearchQuery}
                  onChange={(e) => setQuestionSearchQuery(e.target.value)}
                  placeholder="Search question statement or topic..."
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#FF8C32]"
                />
              </div>

              {/* Subject filter */}
              <div className="w-full lg:w-48">
                <select
                  value={questionSubjectFilter}
                  onChange={(e) => setQuestionSubjectFilter(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#FF8C32]"
                >
                  <option value="All">All Subjects ({mySubjects.length})</option>
                  {mySubjects.map(sub => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
                </select>
              </div>

              {/* Difficulty filter */}
              <div className="w-full lg:w-36">
                <select
                  value={questionDifficultyFilter}
                  onChange={(e) => setQuestionDifficultyFilter(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#FF8C32]"
                >
                  <option value="All">All Difficulties</option>
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>

              {/* Select All / Deselect Controls */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleSelectAllVisible}
                  disabled={filteredMyQuestions.length === 0}
                  className="flex-1 sm:flex-initial px-3 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-30 text-white font-semibold text-xs transition cursor-pointer flex items-center justify-center gap-1.5"
                  title="Select all currently filtered questions"
                >
                  <CheckSquare className="w-3.5 h-3.5 text-[#FF8C32]" />
                  <span>Select All</span>
                </button>
                <button
                  type="button"
                  onClick={handleDeselectAll}
                  disabled={selectedQuestionIds.length === 0}
                  className="flex-1 sm:flex-initial px-3 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-30 text-slate-300 font-semibold text-xs transition cursor-pointer flex items-center justify-center gap-1.5"
                  title="Deselect all"
                >
                  <Square className="w-3.5 h-3.5" />
                  <span>Clear</span>
                </button>
              </div>
            </div>

            {/* Questions List from Teacher's Bank */}
            {myQuestions.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
                <HelpCircle className="w-10 h-10 text-slate-500 mx-auto" />
                <h4 className="font-heading font-bold text-sm text-white">Your Question Bank is Empty</h4>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  You haven't authored any questions yet. Use the <strong>MCQ Builder (Manual)</strong> tab or the <strong>AI Question Generator</strong> to create and save questions to your private bank first.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab('question-bank')}
                  className="px-4 py-2 rounded-xl bg-[#FF8C32] hover:bg-orange-400 text-slate-950 font-bold text-xs shadow transition cursor-pointer"
                >
                  Open MCQ Builder (Manual)
                </button>
              </div>
            ) : filteredMyQuestions.length === 0 ? (
              <div className="p-6 text-center text-slate-400 text-xs">
                No questions match your current search and filter criteria.
              </div>
            ) : (
              <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1 custom-scrollbar">
                {filteredMyQuestions.map((q, idx) => {
                  const isSelected = selectedQuestionIds.includes(q.id);
                  const isExpanded = expandedPreviewQId === q.id;

                  return (
                    <div
                      key={q.id}
                      className={`p-4 rounded-2xl border transition ${
                        isSelected
                          ? 'bg-[#FF8C32]/10 border-[#FF8C32]/50 shadow-md shadow-orange-500/5'
                          : 'bg-white/[0.02] border-white/5 hover:border-white/15'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {/* Checkbox */}
                        <button
                          type="button"
                          onClick={() => toggleSelectQuestion(q.id)}
                          className="mt-0.5 shrink-0 text-[#FF8C32] cursor-pointer"
                          aria-label={isSelected ? 'Deselect question' : 'Select question'}
                        >
                          {isSelected ? (
                            <CheckSquare className="w-5 h-5 text-[#FF8C32] fill-[#FF8C32]/20" />
                          ) : (
                            <Square className="w-5 h-5 text-slate-500 hover:text-slate-300" />
                          )}
                        </button>

                        {/* Question Content */}
                        <div className="flex-1 min-w-0 space-y-1.5">
                          <div className="flex flex-wrap items-center gap-2 text-[10px]">
                            <span className="font-mono text-slate-400 font-bold">#{idx + 1}</span>
                            <span className="px-2 py-0.5 rounded bg-white/5 text-slate-300 font-semibold">{q.subject}</span>
                            <span className="text-slate-500">•</span>
                            <span className="text-slate-400">{q.topic}</span>
                            <span className="text-slate-500">•</span>
                            <span className={`px-2 py-0.5 rounded uppercase font-bold ${
                              q.difficulty === 'Easy' ? 'text-emerald-400 bg-emerald-500/10' :
                              q.difficulty === 'Hard' ? 'text-rose-400 bg-rose-500/10' :
                              'text-amber-400 bg-amber-500/10'
                            }`}>
                              {q.difficulty}
                            </span>
                            <span className="text-[10px] text-emerald-400 font-mono font-bold">
                              Key: {q.correctAnswer}
                            </span>
                          </div>

                          <div
                            onClick={() => setExpandedPreviewQId(isExpanded ? null : q.id)}
                            className="font-heading text-xs sm:text-sm font-semibold text-white leading-relaxed cursor-pointer hover:text-[#FF8C32] transition"
                          >
                            {q.statement}
                          </div>

                          {/* 4 Options Preview */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-[11px]">
                            {(['A', 'B', 'C', 'D'] as const).map(optKey => {
                              const isCorrect = q.correctAnswer === optKey;
                              return (
                                <div
                                  key={optKey}
                                  className={`p-2.5 rounded-xl border flex items-start gap-2.5 transition min-h-[38px] ${
                                    isCorrect
                                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 font-medium'
                                      : 'bg-white/5 border-white/5 text-slate-300'
                                  }`}
                                >
                                  <span className={`w-5 h-5 rounded text-[10px] font-mono flex items-center justify-center font-bold shrink-0 mt-0.5 ${
                                    isCorrect ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                                  }`}>
                                    {optKey}
                                  </span>
                                  <span className="break-words leading-relaxed flex-1">{q.options[optKey]}</span>
                                  {isCorrect && <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />}
                                </div>
                              );
                            })}
                          </div>

                          {/* Expanded Explanation Preview */}
                          {isExpanded && q.explanation && (
                            <div className="p-3 rounded-xl bg-slate-900 border border-white/10 text-xs text-slate-300 mt-2 space-y-1">
                              <span className="font-bold text-[#FF8C32] text-[10px] uppercase">Author Explanation:</span>
                              <p className="text-[11px] leading-relaxed text-slate-300">{q.explanation}</p>
                            </div>
                          )}
                        </div>

                        {/* Quick Action: Toggle Selection */}
                        <button
                          type="button"
                          onClick={() => toggleSelectQuestion(q.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 cursor-pointer ${
                            isSelected
                              ? 'bg-[#FF8C32] text-slate-950 shadow'
                              : 'bg-white/5 hover:bg-white/10 text-slate-300'
                          }`}
                        >
                          {isSelected ? 'Selected' : 'Select'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Card 3: Complete Test Preview & Live Calculation Bar */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-[#FF8C32]/30 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <span className="text-[10px] font-bold text-[#FF8C32] uppercase tracking-wider font-mono">
                  Live Test Blueprint Preview
                </span>
                <h4 className="font-heading font-extrabold text-xl text-white mt-0.5">
                  {testTitle.trim() || 'Untitled Assessment'}
                </h4>
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mt-1">
                  <span>Category: <strong className="text-white">{testCategory}</strong></span>
                  <span>•</span>
                  <span>Subject: <strong className="text-white">{testSubject || 'Not set'}</strong></span>
                  <span>•</span>
                  <span>Duration: <strong className="text-white">{testDuration} Minutes</strong></span>
                </div>
              </div>

              {/* 3 Summary Stat Pills */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3 shrink-0 text-center w-full sm:w-auto">
                <div className="p-2.5 sm:p-3 rounded-2xl bg-white/5 border border-white/10 min-w-[75px]">
                  <span className="text-[10px] text-slate-400 block font-semibold uppercase">Questions</span>
                  <span className="text-base sm:text-xl font-extrabold font-mono text-white">{calculatedTotalQuestions}</span>
                </div>
                <div className="p-2.5 sm:p-3 rounded-2xl bg-white/5 border border-white/10 min-w-[75px]">
                  <span className="text-[10px] text-slate-400 block font-semibold uppercase">Marks</span>
                  <span className="text-base sm:text-xl font-extrabold font-mono text-emerald-400">{calculatedMaxMarks}</span>
                </div>
                <div className="p-2.5 sm:p-3 rounded-2xl bg-white/5 border border-white/10 min-w-[75px]">
                  <span className="text-[10px] text-slate-400 block font-semibold uppercase">Negative</span>
                  <span className="text-base sm:text-xl font-extrabold font-mono text-amber-400">
                    {negativeMarking ? `-${calculatedNegativeMarks}` : '0'}
                  </span>
                </div>
              </div>
            </div>

            {/* Selected Questions Chip Tray with Remove Button */}
            {selectedQuestionObjects.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-300">
                  Attached Questions ({selectedQuestionObjects.length}):
                </span>
                <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto custom-scrollbar p-1">
                  {selectedQuestionObjects.map((q, idx) => (
                    <div
                      key={q.id}
                      className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2 text-xs text-slate-200"
                    >
                      <span className="w-5 h-5 rounded-full bg-[#FF8C32]/20 text-[#FF8C32] font-mono text-[10px] font-bold flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <span className="max-w-[200px] sm:max-w-xs truncate">{q.statement}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSelectedQuestion(q.id)}
                        className="p-0.5 rounded text-slate-400 hover:text-rose-400 transition cursor-pointer"
                        title="Remove question from test"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Submit Action Bar */}
            <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-slate-400">
                {selectedQuestionIds.length === 0 ? (
                  <span className="text-amber-400 flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>Please select at least 1 question from your Question Bank above to enable submission.</span>
                  </span>
                ) : (
                  <span className="text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 shrink-0" />
                    <span>Test is valid and ready for submission into Pending Approval review queue.</span>
                  </span>
                )}
              </div>

              <button
                type="submit"
                disabled={selectedQuestionIds.length === 0 || !testTitle.trim()}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#EA580C] to-[#FF8C32] hover:opacity-95 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-extrabold text-sm shadow-xl transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4 fill-slate-950" />
                <span>Submit Complete Test for Admin Approval</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Tab 3: MCQ Question Builder (Manual) - Tags Questions with createdBy UID */}
      {activeTab === 'question-bank' && (
        <form onSubmit={handleAddQuestionSubmit} className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6">
          <div className="border-b border-white/5 pb-3">
            <h3 className="font-heading font-bold text-lg text-white">
              MCQ Question Builder (Manual)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              <strong>Mandatory Rule:</strong> Educators create exactly 4 factual answer choices (A, B, C, D). Option E is reserved in the student test interface as "No Response / Unattempted". Saved questions will be stored in your private bank (Owner: <code className="text-[#FF8C32]">{firebaseUser?.email}</code>).
            </p>
          </div>

          {qSavedNotice && (
            <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs font-bold flex items-center gap-2">
              <CheckCircle className="w-5 h-5 shrink-0" />
              <span>Question saved to your verified Question Bank! It is now selectable in the Create Assessment Form.</span>
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
              <span>Add to My Question Bank</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab 4: AI Question Generator & Bulk Import */}
      {activeTab === 'ai-bulk-import' && <AIBulkQuestionManager />}
    </div>
  );
};
