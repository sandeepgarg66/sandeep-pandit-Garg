import React, { useState } from 'react';
import {
  Sparkles,
  UploadCloud,
  FileText,
  ClipboardPaste,
  CheckCircle2,
  AlertTriangle,
  X,
  Edit2,
  Trash2,
  Layers,
  ArrowRight,
  Database,
  Plus,
  RefreshCw,
  Eye,
  SlidersHorizontal,
  HelpCircle,
  FileSpreadsheet,
  Check,
  FileCode
} from 'lucide-react';
import { useQuiz } from '../../context/QuizContext';
import { Question, QuestionOptionKey } from '../../types/quiz';
import {
  StagedQuestion,
  generateQuestionsWithAI,
  parseBulkTextToQuestions,
  AIGenerationParams
} from '../../lib/aiQuestionService';

export const AIBulkQuestionManager: React.FC = () => {
  const { tests, addBulkQuestions, addQuestionsToTest } = useQuiz();

  const [activeMethod, setActiveMethod] = useState<'ai' | 'file' | 'paste'>('ai');

  // AI Form State
  const [aiSubject, setAiSubject] = useState('Indian Polity & Governance');
  const [aiTopic, setAiTopic] = useState('Fundamental Rights & Directive Principles');
  const [aiCount, setAiCount] = useState<number>(5);
  const [aiDifficulty, setAiDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [aiLanguage, setAiLanguage] = useState<'English' | 'Hindi' | 'Both'>('Both');
  const [aiInstructions, setAiInstructions] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // File Upload State
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [isFileParsing, setIsFileParsing] = useState(false);

  // Bulk Paste State
  const [pastedText, setPastedText] = useState('');
  const [pasteSubject, setPasteSubject] = useState('General Science');
  const [pasteTopic, setPasteTopic] = useState('Modern Physics & Optics');

  // Staged Questions for Review
  const [stagedQuestions, setStagedQuestions] = useState<StagedQuestion[]>([]);
  const [filterMode, setFilterMode] = useState<'all' | 'needs_review' | 'valid' | 'selected'>('all');
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);

  // Modals for Saving
  const [isTestSelectModalOpen, setIsTestSelectModalOpen] = useState(false);
  const [selectedTargetTestId, setSelectedTargetTestId] = useState('');
  const [saveOutcomeNotice, setSaveOutcomeNotice] = useState<{
    open: boolean;
    title: string;
    added: number;
    duplicates: number;
    failed: number;
    targetName: string;
  } | null>(null);

  // Helper sample questions for 1-click paste testing
  const samplePasteSnippet = `1. Under which Article of the Constitution can the President proclaim Financial Emergency?
A) Article 352
B) Article 356
C) Article 360
D) Article 365
Answer: C
Explanation: Article 360 empowers the President to proclaim a Financial Emergency if satisfied that the financial stability or credit of India is threatened.

2. Which Indian state has the largest coastline along the Arabian Sea?
A) Maharashtra
B) Gujarat
C) Karnataka
D) Kerala
Answer: B
Explanation: Gujarat possesses the longest coastline among all Indian states, extending approximately 1,600 km.

3. What is the working principle of an optical fiber used in telecommunications?
A) Total Internal Reflection
B) Rayleigh Scattering
C) Diffraction of light
D) Polarisation
Answer: A
Explanation: Optical fibers transmit light pulses based on the principle of Total Internal Reflection (TIR).

4. In which year was the Goods and Services Tax (GST) rolled out across India?
A) 1 July 2015
B) 1 July 2016
C) 1 July 2017
D) 1 January 2018
Answer: C
Explanation: The 101st Constitutional Amendment Act introduced GST in India with effect from 1 July 2017.`;

  // Handle AI Question Generation
  const handleGenerateAI = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    try {
      const generated = await generateQuestionsWithAI({
        subject: aiSubject,
        topic: aiTopic,
        count: Number(aiCount),
        difficulty: aiDifficulty,
        language: aiLanguage,
        instructionsOrSource: aiInstructions
      });
      setStagedQuestions(prev => [...generated, ...prev]);
    } catch (err) {
      console.error('AI Generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle Bulk Paste Parsing
  const handleParsePastedText = () => {
    if (!pastedText.trim()) return;
    const parsed = parseBulkTextToQuestions(pastedText, pasteSubject, pasteTopic, 'Medium');
    setStagedQuestions(prev => [...parsed, ...prev]);
    setPastedText('');
  };

  // Handle File Upload Parsing
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);
    setIsFileParsing(true);

    const reader = new FileReader();
    reader.onload = event => {
      const content = event.target?.result as string;
      if (content) {
        // If file is JSON formatted
        try {
          const jsonParsed = JSON.parse(content);
          if (Array.isArray(jsonParsed)) {
            const mapped: StagedQuestion[] = jsonParsed.map((item, idx) => ({
              id: `staged-file-${Date.now()}-${idx}`,
              statement: item.statement || item.question || 'Untitled Question',
              statementHindi: item.statementHindi,
              options: {
                A: item.options?.A || '',
                B: item.options?.B || '',
                C: item.options?.C || '',
                D: item.options?.D || ''
              },
              correctAnswer: (['A', 'B', 'C', 'D'].includes(item.correctAnswer) ? item.correctAnswer : '') as QuestionOptionKey,
              explanation: item.explanation || 'Verified curriculum standard answer.',
              subject: item.subject || 'General Studies',
              topic: item.topic || 'Curriculum Assessment',
              difficulty: item.difficulty || 'Medium',
              marks: 2,
              selected: true,
              source: 'file',
              validationFlags: {
                missingAnswer: !item.correctAnswer,
                missingOption: !item.options?.A || !item.options?.B || !item.options?.C || !item.options?.D,
                uncertainAnswer: false,
                duplicate: false
              }
            }));
            setStagedQuestions(prev => [...mapped, ...prev]);
            setIsFileParsing(false);
            return;
          }
        } catch {
          // Fall back to text parsing
        }

        // Standard text/CSV document parsing
        const parsed = parseBulkTextToQuestions(content, 'Uploaded Document', file.name.replace(/\.[^/.]+$/, ''), 'Medium');
        setStagedQuestions(prev => [...parsed, ...prev]);
      }
      setIsFileParsing(false);
    };
    reader.readAsText(file);
  };

  // Staged Question Modification Helpers
  const toggleSelectQuestion = (id: string) => {
    setStagedQuestions(prev =>
      prev.map(q => (q.id === id ? { ...q, selected: !q.selected } : q))
    );
  };

  const selectAllStaged = (selectAll: boolean) => {
    setStagedQuestions(prev => prev.map(q => ({ ...q, selected: selectAll })));
  };

  const deleteStagedQuestion = (id: string) => {
    setStagedQuestions(prev => prev.filter(q => q.id !== id));
  };

  const updateStagedField = (id: string, field: keyof StagedQuestion, value: any) => {
    setStagedQuestions(prev =>
      prev.map(q => {
        if (q.id !== id) return q;
        const updated = { ...q, [field]: value };
        // Recalculate validation flags
        const missingOpt =
          !updated.options.A || !updated.options.B || !updated.options.C || !updated.options.D;
        const missingAns = !updated.correctAnswer;
        updated.validationFlags = {
          ...updated.validationFlags,
          missingOption: missingOpt,
          missingAnswer: missingAns
        };
        return updated;
      })
    );
  };

  const updateStagedOption = (id: string, optKey: 'A' | 'B' | 'C' | 'D', value: string) => {
    setStagedQuestions(prev =>
      prev.map(q => {
        if (q.id !== id) return q;
        const updatedOptions = { ...q.options, [optKey]: value };
        const missingOpt =
          !updatedOptions.A || !updatedOptions.B || !updatedOptions.C || !updatedOptions.D;
        return {
          ...q,
          options: updatedOptions,
          validationFlags: {
            ...q.validationFlags,
            missingOption: missingOpt
          }
        };
      })
    );
  };

  // Filtered Staged Questions
  const filteredStaged = stagedQuestions.filter(q => {
    if (filterMode === 'needs_review') {
      return q.validationFlags.missingAnswer || q.validationFlags.missingOption;
    }
    if (filterMode === 'valid') {
      return !q.validationFlags.missingAnswer && !q.validationFlags.missingOption;
    }
    if (filterMode === 'selected') {
      return q.selected;
    }
    return true;
  });

  const validSelectedQuestions = stagedQuestions.filter(
    q => q.selected && !q.validationFlags.missingAnswer && !q.validationFlags.missingOption && q.correctAnswer
  );

  const flaggedCount = stagedQuestions.filter(
    q => q.validationFlags.missingAnswer || q.validationFlags.missingOption
  ).length;

  // Save to Question Bank Action
  const handleSaveToQuestionBank = () => {
    if (validSelectedQuestions.length === 0) return;

    const formattedPayload: Omit<Question, 'id'>[] = validSelectedQuestions.map(q => ({
      statement: q.statement,
      statementHindi: q.statementHindi,
      options: q.options,
      correctAnswer: q.correctAnswer as QuestionOptionKey,
      explanation: q.explanation,
      subject: q.subject,
      topic: q.topic,
      difficulty: q.difficulty,
      marks: q.marks
    }));

    const result = addBulkQuestions(formattedPayload);

    // Remove saved questions from staged list
    const savedIds = new Set(validSelectedQuestions.map(q => q.id));
    setStagedQuestions(prev => prev.filter(q => !savedIds.has(q.id)));

    setSaveOutcomeNotice({
      open: true,
      title: 'Bulk Saved to Central Question Bank',
      added: result.added,
      duplicates: result.duplicates,
      failed: result.failed,
      targetName: 'Master Question Repository'
    });
  };

  // Add to Existing Test Action
  const handleAddApprovedToTest = () => {
    if (!selectedTargetTestId || validSelectedQuestions.length === 0) return;

    const targetTest = tests.find(t => t.id === selectedTargetTestId);
    if (!targetTest) return;

    const formattedQuestions: Question[] = validSelectedQuestions.map((q, idx) => ({
      id: `q-test-appended-${Date.now()}-${idx}`,
      testId: selectedTargetTestId,
      statement: q.statement,
      statementHindi: q.statementHindi,
      options: q.options,
      correctAnswer: q.correctAnswer as QuestionOptionKey,
      explanation: q.explanation,
      subject: q.subject,
      topic: q.topic,
      difficulty: q.difficulty,
      marks: targetTest.marksPerCorrect || 2
    }));

    addQuestionsToTest(selectedTargetTestId, formattedQuestions);

    // Remove saved questions from staged list
    const savedIds = new Set(validSelectedQuestions.map(q => q.id));
    setStagedQuestions(prev => prev.filter(q => !savedIds.has(q.id)));

    setIsTestSelectModalOpen(false);
    setSaveOutcomeNotice({
      open: true,
      title: `Appended to '${targetTest.title}'`,
      added: formattedQuestions.length,
      duplicates: 0,
      failed: 0,
      targetName: targetTest.title
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-[#FF8C32]/30 relative overflow-hidden space-y-2">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF8C32]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase font-extrabold tracking-widest text-[#FF8C32] bg-[#FF8C32]/10 px-3 py-1 rounded-full border border-[#FF8C32]/30 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#FF8C32]" />
            <span>AI Pedagogy Engine & Bulk Ingestion</span>
          </span>
          <span className="text-xs text-slate-400 font-mono">Teacher Assessment Suite</span>
        </div>
        <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-white">
          AI Question Generator & Bulk Import
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
          Quickly generate curriculum-standard 4-option MCQs using AI, import question documents, or bulk paste questions from Word/Excel/PDF. Review and approve before saving directly to your Question Bank or draft tests.
        </p>
      </div>

      {/* 3 Creation Method Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Method 1: AI Generator */}
        <button
          onClick={() => setActiveMethod('ai')}
          className={`glass-card p-5 rounded-2xl border text-left transition cursor-pointer space-y-3 group ${
            activeMethod === 'ai'
              ? 'border-[#FF8C32] bg-[#FF8C32]/10 shadow-lg shadow-orange-500/10'
              : 'border-white/10 hover:border-white/20'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition ${
              activeMethod === 'ai' ? 'bg-[#FF8C32] text-slate-950 font-bold' : 'bg-white/5 text-[#FF8C32]'
            }`}>
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">Method A</span>
          </div>
          <div>
            <h3 className="font-heading font-bold text-sm sm:text-base text-white group-hover:text-[#FF8C32] transition">
              Generate Questions with AI
            </h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Synthesize 4-option MCQs by entering a subject, topic, difficulty, and language.
            </p>
          </div>
        </button>

        {/* Method 2: File Import */}
        <button
          onClick={() => setActiveMethod('file')}
          className={`glass-card p-5 rounded-2xl border text-left transition cursor-pointer space-y-3 group ${
            activeMethod === 'file'
              ? 'border-purple-400 bg-purple-500/10 shadow-lg shadow-purple-500/10'
              : 'border-white/10 hover:border-white/20'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition ${
              activeMethod === 'file' ? 'bg-purple-500 text-white font-bold' : 'bg-white/5 text-purple-400'
            }`}>
              <UploadCloud className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">Method B</span>
          </div>
          <div>
            <h3 className="font-heading font-bold text-sm sm:text-base text-white group-hover:text-purple-300 transition">
              Import Questions from Files
            </h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Upload PDF, DOCX, XLSX, TXT, or CSV question papers with automatic question parsing.
            </p>
          </div>
        </button>

        {/* Method 3: Bulk Paste */}
        <button
          onClick={() => setActiveMethod('paste')}
          className={`glass-card p-5 rounded-2xl border text-left transition cursor-pointer space-y-3 group ${
            activeMethod === 'paste'
              ? 'border-sky-400 bg-sky-500/10 shadow-lg shadow-sky-500/10'
              : 'border-white/10 hover:border-white/20'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition ${
              activeMethod === 'paste' ? 'bg-sky-500 text-slate-950 font-bold' : 'bg-white/5 text-sky-400'
            }`}>
              <ClipboardPaste className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">Method C</span>
          </div>
          <div>
            <h3 className="font-heading font-bold text-sm sm:text-base text-white group-hover:text-sky-300 transition">
              Bulk Copy-Paste Editor
            </h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Paste 10–50 questions at once. Our parser detects numbers, options A–D, answers & solutions.
            </p>
          </div>
        </button>
      </div>

      {/* ========================================================= */}
      {/* METHOD ZONE PANELS */}
      {/* ========================================================= */}

      {/* METHOD A: AI GENERATOR */}
      {activeMethod === 'ai' && (
        <form onSubmit={handleGenerateAI} className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div>
              <h3 className="font-heading font-bold text-base text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#FF8C32]" />
                <span>AI Question Generator Configuration</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Generates high-stakes competitive MCQs compliant with the 4-factual-option standard.
              </p>
            </div>
            <span className="text-[10px] uppercase font-bold px-2.5 py-1 rounded bg-[#FF8C32]/20 text-[#FF8C32] border border-[#FF8C32]/30">
              Server AI Assisted
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Subject *</label>
              <input
                type="text"
                required
                value={aiSubject}
                onChange={e => setAiSubject(e.target.value)}
                placeholder="e.g. Indian Polity & Governance"
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#FF8C32]"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Topic *</label>
              <input
                type="text"
                required
                value={aiTopic}
                onChange={e => setAiTopic(e.target.value)}
                placeholder="e.g. Fundamental Rights, Optics, Cell Biology"
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#FF8C32]"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Number of Questions</label>
              <select
                value={aiCount}
                onChange={e => setAiCount(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#FF8C32]"
              >
                <option value={5}>5 Questions (Fast Preview)</option>
                <option value={10}>10 Questions (Standard Drill)</option>
                <option value={20}>20 Questions (Sectional Mock)</option>
                <option value={50}>50 Questions (Full Mock)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Difficulty & Language</label>
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={aiDifficulty}
                  onChange={e => setAiDifficulty(e.target.value as any)}
                  className="w-full px-2.5 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#FF8C32]"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
                <select
                  value={aiLanguage}
                  onChange={e => setAiLanguage(e.target.value as any)}
                  className="w-full px-2.5 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#FF8C32]"
                >
                  <option value="Both">Both (EN + HI)</option>
                  <option value="English">English</option>
                  <option value="Hindi">Hindi Only</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1 text-xs">
              Optional Instructions or Source Paragraph (Reference Material)
            </label>
            <textarea
              rows={3}
              value={aiInstructions}
              onChange={e => setAiInstructions(e.target.value)}
              placeholder="e.g. Focus on recent constitutional amendments, NCERT chapter 4, or paste a reference paragraph from which questions should be extracted..."
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-white placeholder-slate-500 text-xs focus:outline-none focus:border-[#FF8C32]"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-[11px] text-slate-400">
              ⚡ Generated questions will be placed in the <strong>Review Workspace</strong> below before any database save.
            </span>
            <button
              type="submit"
              disabled={isGenerating}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#EA580C] to-[#FF8C32] hover:opacity-95 text-slate-950 font-bold text-xs shadow-lg transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Synthesizing MCQs with AI...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Questions Now</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* METHOD B: FILE IMPORT */}
      {activeMethod === 'file' && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6">
          <div className="border-b border-white/5 pb-3">
            <h3 className="font-heading font-bold text-base text-white flex items-center gap-2">
              <UploadCloud className="w-4 h-4 text-purple-400" />
              <span>Import Questions from Document or Spreadsheet</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Supports standard structured files: PDF, DOCX, XLSX, CSV, JSON, and TXT.
            </p>
          </div>

          {/* Drag & Drop Upload Zone */}
          <div className="border-2 border-dashed border-white/15 hover:border-purple-400/60 rounded-3xl p-8 sm:p-12 text-center space-y-4 transition bg-white/[0.02]">
            <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center mx-auto text-purple-300">
              <FileSpreadsheet className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <div className="font-heading font-bold text-base text-white">
                Drag and drop your question file here
              </div>
              <p className="text-xs text-slate-400">
                Supports <strong className="text-slate-200">PDF, Word (DOCX), Excel (XLSX/CSV), JSON, and Plain Text</strong>
              </p>
            </div>

            <label className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition cursor-pointer shadow-md">
              <UploadCloud className="w-4 h-4" />
              <span>Browse File to Ingest</span>
              <input
                type="file"
                accept=".txt,.csv,.json,.pdf,.docx,.xlsx"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

            {uploadedFileName && (
              <div className="text-xs text-emerald-400 font-mono pt-2 flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Loaded file: {uploadedFileName}</span>
              </div>
            )}

            {isFileParsing && (
              <div className="text-xs text-purple-300 flex items-center justify-center gap-2 font-mono">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Parsing question structures from document...</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* METHOD C: BULK COPY-PASTE */}
      {activeMethod === 'paste' && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/5 pb-3">
            <div>
              <h3 className="font-heading font-bold text-base text-white flex items-center gap-2">
                <ClipboardPaste className="w-4 h-4 text-sky-400" />
                <span>Bulk Copy-Paste Ingestion Workspace</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Paste question papers directly. Parser extracts questions, options A–D, answers and explanations.
              </p>
            </div>

            <button
              onClick={() => setPastedText(samplePasteSnippet)}
              className="px-3 py-1.5 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 border border-sky-500/30 font-bold text-xs transition cursor-pointer flex items-center gap-1"
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>Load 4 Sample Questions</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Default Subject</label>
              <input
                type="text"
                value={pasteSubject}
                onChange={e => setPasteSubject(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-white focus:outline-none focus:border-sky-400"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Default Topic</label>
              <input
                type="text"
                value={pasteTopic}
                onChange={e => setPasteTopic(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-white focus:outline-none focus:border-sky-400"
              />
            </div>
          </div>

          <div>
            <textarea
              rows={8}
              value={pastedText}
              onChange={e => setPastedText(e.target.value)}
              placeholder={`Paste questions here, for example:

1. What is the capital of India?
A) Mumbai
B) New Delhi
C) Kolkata
D) Chennai
Answer: B
Explanation: New Delhi was inaugurated as capital in 1931.`}
              className="w-full px-4 py-3 bg-slate-900 border border-white/10 rounded-2xl text-white font-mono text-xs placeholder-slate-500 focus:outline-none focus:border-sky-400 leading-relaxed"
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-400">
              Format: Numbered questions with options A–D, optional Answer line (Answer: X), and Explanation.
            </span>
            <button
              onClick={handleParsePastedText}
              disabled={!pastedText.trim()}
              className="px-6 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 disabled:opacity-40 text-slate-950 font-bold text-xs shadow transition flex items-center gap-1.5 cursor-pointer"
            >
              <ClipboardPaste className="w-4 h-4" />
              <span>Parse & Ingest into Review Workspace</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* SECTION 2: QUESTION REVIEW WORKSPACE (BEFORE SAVING) */}
      {/* ========================================================= */}
      <div className="space-y-6 pt-4">
        {/* Workspace Summary Bar & Actions */}
        <div className="glass-panel p-5 sm:p-6 rounded-3xl border border-white/10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-extrabold text-lg text-white">
                  Staged Questions Review Workspace
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-white/10 text-white">
                  {stagedQuestions.length} Total
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Review and verify questions before saving. Flagged questions highlight missing options or answer keys.
              </p>
            </div>

            {/* Save Action Triggers */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleSaveToQuestionBank}
                disabled={validSelectedQuestions.length === 0}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs shadow transition flex items-center gap-1.5 cursor-pointer"
              >
                <Database className="w-4 h-4" />
                <span>Save {validSelectedQuestions.length} to Question Bank</span>
              </button>

              <button
                onClick={() => setIsTestSelectModalOpen(true)}
                disabled={validSelectedQuestions.length === 0}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#EA580C] to-[#FF8C32] hover:opacity-95 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-bold text-xs shadow transition flex items-center gap-1.5 cursor-pointer"
              >
                <Layers className="w-4 h-4" />
                <span>Add {validSelectedQuestions.length} to Existing Test</span>
              </button>
            </div>
          </div>

          {/* Filter Chips & Selection Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-1.5 overflow-x-auto">
              <button
                onClick={() => setFilterMode('all')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                  filterMode === 'all'
                    ? 'bg-white/20 text-white'
                    : 'bg-white/5 text-slate-400 hover:text-white'
                }`}
              >
                All Staged ({stagedQuestions.length})
              </button>

              <button
                onClick={() => setFilterMode('valid')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                  filterMode === 'valid'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-white/5 text-slate-400 hover:text-white'
                }`}
              >
                Ready & Valid ({stagedQuestions.length - flaggedCount})
              </button>

              <button
                onClick={() => setFilterMode('needs_review')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                  filterMode === 'needs_review'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'bg-white/5 text-slate-400 hover:text-white'
                }`}
              >
                Needs Verification ({flaggedCount})
              </button>

              <button
                onClick={() => setFilterMode('selected')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                  filterMode === 'selected'
                    ? 'bg-[#FF8C32]/20 text-[#FF8C32] border border-[#FF8C32]/30'
                    : 'bg-white/5 text-slate-400 hover:text-white'
                }`}
              >
                Selected ({validSelectedQuestions.length})
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => selectAllStaged(true)}
                className="px-2.5 py-1 text-[11px] rounded bg-white/5 text-slate-300 hover:text-white transition"
              >
                Select All
              </button>
              <button
                onClick={() => selectAllStaged(false)}
                className="px-2.5 py-1 text-[11px] rounded bg-white/5 text-slate-300 hover:text-white transition"
              >
                Deselect All
              </button>
              <button
                onClick={() => setStagedQuestions([])}
                className="px-2.5 py-1 text-[11px] rounded bg-rose-950/40 text-rose-300 hover:bg-rose-900/60 transition"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>

        {/* Empty Staged List Placeholder */}
        {stagedQuestions.length === 0 && (
          <div className="glass-panel p-12 text-center rounded-3xl border border-white/10 space-y-3">
            <Layers className="w-12 h-12 text-slate-500 mx-auto" />
            <h4 className="font-heading font-bold text-base text-white">No Staged Questions Yet</h4>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Use <strong>Generate Questions with AI</strong>, upload a question paper file, or copy-paste text above. Your extracted questions will appear here for review and editing before being committed.
            </p>
          </div>
        )}

        {/* Staged Question Cards List */}
        <div className="space-y-4">
          {filteredStaged.map((q, idx) => {
            const hasError = q.validationFlags.missingAnswer || q.validationFlags.missingOption;
            const isEditing = editingQuestionId === q.id;

            return (
              <div
                key={q.id}
                className={`glass-card p-6 rounded-3xl border transition space-y-4 relative ${
                  hasError
                    ? 'border-amber-500/50 bg-amber-950/10'
                    : q.selected
                    ? 'border-[#FF8C32]/40 bg-[#FF8C32]/5'
                    : 'border-white/10'
                }`}
              >
                {/* Header Row: Checkbox, Metadata, Flags, and Controls */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/5 pb-3">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={q.selected}
                      onChange={() => toggleSelectQuestion(q.id)}
                      className="w-4 h-4 rounded accent-[#FF8C32] cursor-pointer"
                    />

                    <span className="font-mono text-xs font-bold text-white bg-white/10 px-2 py-0.5 rounded">
                      #{idx + 1}
                    </span>

                    <span className="text-xs text-slate-300 font-semibold">{q.subject}</span>
                    <span className="text-xs text-slate-500">•</span>
                    <span className="text-xs text-slate-400">{q.topic}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Error / Warning Flags */}
                    {q.validationFlags.missingAnswer && (
                      <span className="text-[10px] font-bold text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/30 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        <span>Missing Correct Key</span>
                      </span>
                    )}

                    {q.validationFlags.missingOption && (
                      <span className="text-[10px] font-bold text-rose-300 bg-rose-500/20 px-2 py-0.5 rounded border border-rose-500/30 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        <span>Incomplete Options</span>
                      </span>
                    )}

                    <span className="text-[10px] uppercase font-bold text-slate-400 bg-white/5 px-2 py-0.5 rounded">
                      {q.difficulty}
                    </span>

                    <button
                      onClick={() => setEditingQuestionId(isEditing ? null : q.id)}
                      className={`p-1.5 rounded-lg border transition ${
                        isEditing
                          ? 'bg-[#FF8C32] text-slate-950 border-[#FF8C32]'
                          : 'bg-white/5 text-slate-400 hover:text-white border-white/10'
                      }`}
                      title={isEditing ? 'Done Editing' : 'Edit Question'}
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => deleteStagedQuestion(q.id)}
                      className="p-1.5 rounded-lg bg-white/5 text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 border border-white/10 transition"
                      title="Discard Question"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Question Statement (View or Edit) */}
                {isEditing ? (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[11px] text-slate-400 font-semibold mb-1">
                        Question Statement (English)
                      </label>
                      <textarea
                        rows={2}
                        value={q.statement}
                        onChange={e => updateStagedField(q.id, 'statement', e.target.value)}
                        className="w-full px-3 py-2 bg-slate-900 border border-white/15 rounded-xl text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-400 font-semibold mb-1">
                        Question Statement (Hindi - Optional)
                      </label>
                      <textarea
                        rows={2}
                        value={q.statementHindi || ''}
                        onChange={e => updateStagedField(q.id, 'statementHindi', e.target.value)}
                        placeholder="हिंदी अनुवाद..."
                        className="w-full px-3 py-2 bg-slate-900 border border-white/15 rounded-xl text-xs text-white"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <h4 className="font-heading font-semibold text-sm sm:text-base text-white leading-relaxed">
                      {q.statement}
                    </h4>
                    {q.statementHindi && (
                      <p className="text-xs text-slate-400 italic font-hindi leading-relaxed">
                        {q.statementHindi}
                      </p>
                    )}
                  </div>
                )}

                {/* 4 Factual Options (A, B, C, D) & Correct Answer Selector */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[11px] uppercase font-bold text-slate-400">
                      Options & Correct Key (Choose A, B, C, or D)
                    </span>
                    <span className="text-[10px] text-amber-300">
                      Note: Option E is strictly reserved for Candidate No-Response
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {(['A', 'B', 'C', 'D'] as const).map(optKey => {
                      const isCorrect = q.correctAnswer === optKey;
                      const optVal = q.options[optKey];

                      return (
                        <div
                          key={optKey}
                          className={`p-3 rounded-2xl border flex items-center justify-between gap-3 transition ${
                            isCorrect
                              ? 'border-emerald-500/60 bg-emerald-500/10 text-emerald-200'
                              : 'border-white/10 bg-white/5 text-slate-300'
                          }`}
                        >
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <button
                              type="button"
                              onClick={() => updateStagedField(q.id, 'correctAnswer', optKey)}
                              className={`w-6 h-6 rounded-full font-mono text-xs font-bold shrink-0 flex items-center justify-center border transition cursor-pointer ${
                                isCorrect
                                  ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-extrabold shadow'
                                  : 'bg-slate-800 text-slate-400 border-white/20 hover:border-emerald-400'
                              }`}
                              title={`Set ${optKey} as correct answer`}
                            >
                              {optKey}
                            </button>

                            {isEditing ? (
                              <input
                                type="text"
                                value={optVal}
                                onChange={e => updateStagedOption(q.id, optKey, e.target.value)}
                                placeholder={`Enter option ${optKey}...`}
                                className="w-full px-2 py-1 bg-slate-900 border border-white/10 rounded-lg text-xs text-white"
                              />
                            ) : (
                              <span className="truncate">{optVal || <em className="text-rose-400">Empty option</em>}</span>
                            )}
                          </div>

                          {isCorrect && (
                            <span className="text-[10px] font-bold text-emerald-400 shrink-0">
                              ✓ Correct Key
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Explanation */}
                <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-white/5 text-xs space-y-1">
                  <span className="text-[10px] uppercase font-bold text-[#FF8C32] block">
                    Authoritative Solution & Pedagogical Explanation:
                  </span>
                  {isEditing ? (
                    <textarea
                      rows={2}
                      value={q.explanation}
                      onChange={e => updateStagedField(q.id, 'explanation', e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-900 border border-white/15 rounded-xl text-xs text-white"
                    />
                  ) : (
                    <p className="text-slate-300 leading-relaxed">{q.explanation}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================= */}
      {/* MODAL 1: ADD QUESTIONS TO EXISTING TEST */}
      {/* ========================================================= */}
      {isTestSelectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/20 max-w-lg w-full space-y-6 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#FF8C32]" />
                <h3 className="font-heading font-bold text-lg text-white">
                  Add to Existing Assessment
                </h3>
              </div>
              <button
                onClick={() => setIsTestSelectModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Select one of your existing assessments to append these <strong className="text-emerald-400">{validSelectedQuestions.length} approved questions</strong> to. Total questions and maximum marks will be automatically recalibrated.
            </p>

            <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
              {tests.map(t => (
                <div
                  key={t.id}
                  onClick={() => setSelectedTargetTestId(t.id)}
                  className={`p-3.5 rounded-2xl border text-left cursor-pointer transition flex items-center justify-between ${
                    selectedTargetTestId === t.id
                      ? 'border-[#FF8C32] bg-[#FF8C32]/15 text-white font-semibold'
                      : 'border-white/10 bg-white/5 hover:border-white/20 text-slate-200'
                  }`}
                >
                  <div>
                    <div className="font-bold text-sm text-white">{t.title}</div>
                    <div className="text-[11px] text-slate-400">
                      {t.subject} • {t.questions.length} Questions ({t.status})
                    </div>
                  </div>
                  {selectedTargetTestId === t.id && (
                    <Check className="w-5 h-5 text-[#FF8C32] shrink-0" />
                  )}
                </div>
              ))}
            </div>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-white/10">
              <button
                onClick={() => setIsTestSelectModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-white/10 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleAddApprovedToTest}
                disabled={!selectedTargetTestId}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#EA580C] to-[#FF8C32] disabled:opacity-40 text-slate-950 font-bold text-xs shadow"
              >
                Append Questions to Test
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: SAVE OUTCOME NOTIFICATION */}
      {/* ========================================================= */}
      {saveOutcomeNotice?.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="glass-panel p-8 rounded-3xl border border-emerald-500/40 max-w-md w-full space-y-6 text-center shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="font-heading font-extrabold text-xl text-white">
                {saveOutcomeNotice.title}
              </h3>
              <p className="text-xs text-slate-300">
                Action executed successfully for destination: <strong className="text-emerald-400">{saveOutcomeNotice.targetName}</strong>
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <span className="text-[10px] uppercase font-bold text-emerald-400 block">Added</span>
                <span className="font-mono text-xl font-extrabold text-white">{saveOutcomeNotice.added}</span>
              </div>
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                <span className="text-[10px] uppercase font-bold text-amber-400 block">Duplicates</span>
                <span className="font-mono text-xl font-extrabold text-white">{saveOutcomeNotice.duplicates}</span>
              </div>
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20">
                <span className="text-[10px] uppercase font-bold text-rose-400 block">Failed</span>
                <span className="font-mono text-xl font-extrabold text-white">{saveOutcomeNotice.failed}</span>
              </div>
            </div>

            <button
              onClick={() => setSaveOutcomeNotice(null)}
              className="w-full py-2.5 rounded-xl bg-[#FF8C32] hover:bg-orange-400 text-slate-950 font-bold text-xs shadow"
            >
              Done & Return to Workspace
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
