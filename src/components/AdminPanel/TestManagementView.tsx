import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Plus,
  Search,
  Filter,
  Calendar,
  Clock,
  Award,
  CheckCircle,
  Eye,
  Trash2,
  Archive,
  ArrowUpRight,
  X
} from 'lucide-react';
import { useQuiz } from '../../context/QuizContext';
import { Test, TestCategory, TestStatus } from '../../types/quiz';

export const TestManagementView: React.FC = () => {
  const {
    tests,
    publishTest,
    unpublishTest,
    archiveTest,
    deleteTest,
    scheduleTest,
    createTest,
    questions,
    subjects
  } = useQuiz();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [schedulingTestId, setSchedulingTestId] = useState<string | null>(null);
  const [scheduleStart, setScheduleStart] = useState('');
  const [scheduleEnd, setScheduleEnd] = useState('');

  // Form State for Admin New Test Creation
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<TestCategory>('Daily Test');
  const [newSubject, setNewSubject] = useState(subjects[0]?.name || 'Indian Polity & Governance');
  const [newDuration, setNewDuration] = useState(15);
  const [newMarksPerCorrect, setNewMarksPerCorrect] = useState(2);
  const [newNegativeMarking, setNewNegativeMarking] = useState(true);
  const [newNegativeMarks, setNewNegativeMarks] = useState(0.66);

  const filteredTests = tests.filter(test => {
    const matchesSearch =
      test.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || test.category === selectedCategory;
    const matchesStatus = selectedStatus === 'All' || test.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleCreateTestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    // Pick available questions matching subject or slice general questions
    const relevantQuestions = questions.filter(q => q.subject === newSubject);
    const testQuestions = relevantQuestions.length > 0 ? relevantQuestions : questions.slice(0, 5);

    createTest({
      title: newTitle.trim(),
      description: `Institutional assessment for ${newSubject} curated under Hokage examination authority.`,
      category: newCategory,
      subject: newSubject,
      topic: 'Comprehensive Assessment',
      durationMinutes: Number(newDuration),
      totalQuestions: testQuestions.length,
      maxMarks: testQuestions.length * Number(newMarksPerCorrect),
      marksPerCorrect: Number(newMarksPerCorrect),
      negativeMarkingEnabled: newNegativeMarking,
      negativeMarks: Number(newNegativeMarks),
      createdBy: 'Hokage Administration',
      questions: testQuestions
    });

    setIsCreateModalOpen(false);
    setNewTitle('');
  };

  const handleScheduleSubmit = (testId: string) => {
    if (!scheduleStart || !scheduleEnd) return;
    scheduleTest(testId, scheduleStart, scheduleEnd);
    setSchedulingTestId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-extrabold text-white">
            Comprehensive Test Catalog
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Create, moderate, schedule, and configure published tests across all 6 competitive categories.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-[#FF8C32] hover:bg-orange-500 text-slate-950 font-bold text-xs shadow-lg transition flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Test</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search tests..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-900/60 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#FF8C32]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="px-3 py-2 bg-slate-900/60 border border-white/10 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-[#FF8C32]"
          >
            <option value="All">All Categories</option>
            <option value="Daily Test">Daily Test</option>
            <option value="Weekly Test">Weekly Test</option>
            <option value="Mock Test">Mock Test</option>
            <option value="PYQ Test">PYQ Test</option>
            <option value="Chapter Test">Chapter Test</option>
            <option value="Subject-wise Test">Subject-wise Test</option>
          </select>

          {/* Status Dropdown */}
          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            className="px-3 py-2 bg-slate-900/60 border border-white/10 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-[#FF8C32]"
          >
            <option value="All">All Statuses</option>
            <option value="Published">Published</option>
            <option value="Pending Approval">Pending Approval</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Unpublished">Unpublished</option>
            <option value="Archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Tests Table */}
      <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-900/90 text-slate-400 text-xs uppercase tracking-wider border-b border-white/10">
              <tr>
                <th className="px-5 py-3.5">Test Details</th>
                <th className="px-5 py-3.5">Category & Subject</th>
                <th className="px-5 py-3.5 text-center">Questions</th>
                <th className="px-5 py-3.5 text-center">Duration</th>
                <th className="px-5 py-3.5 text-center">Status</th>
                <th className="px-5 py-3.5 text-right">Administrative Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-medium">
              {filteredTests.map(test => (
                <tr key={test.id} className="hover:bg-white/5 transition">
                  <td className="px-5 py-3.5">
                    <div className="font-bold text-white text-sm">{test.title}</div>
                    <div className="text-[11px] text-slate-400">
                      Author: <span className="text-slate-300">{test.teacherName || test.createdBy}</span> • Max Marks: {test.maxMarks}
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-[10px] font-bold uppercase text-[#FF8C32] bg-[#FF8C32]/10 px-2 py-0.5 rounded border border-[#FF8C32]/20">
                      {test.category}
                    </span>
                    <div className="text-xs text-slate-300 mt-1">{test.subject}</div>
                  </td>
                  <td className="px-5 py-3.5 text-center font-mono font-bold text-white">
                    {test.questions.length} Qs
                  </td>
                  <td className="px-5 py-3.5 text-center font-mono text-slate-300">
                    {test.durationMinutes} mins
                  </td>
                  <td className="px-5 py-3.5 text-center">
                    <span
                      className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded ${
                        test.status === 'Published'
                          ? 'text-emerald-300 bg-emerald-500/20'
                          : test.status === 'Pending Approval'
                          ? 'text-amber-300 bg-amber-500/20'
                          : test.status === 'Scheduled'
                          ? 'text-cyan-300 bg-cyan-500/20'
                          : test.status === 'Archived'
                          ? 'text-slate-400 bg-slate-800'
                          : 'text-rose-300 bg-rose-500/20'
                      }`}
                    >
                      {test.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {test.status !== 'Published' ? (
                        <button
                          onClick={() => publishTest(test.id)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-300 text-xs font-semibold border border-emerald-500/30 transition cursor-pointer"
                        >
                          Publish
                        </button>
                      ) : (
                        <button
                          onClick={() => unpublishTest(test.id)}
                          className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold border border-white/10 transition cursor-pointer"
                        >
                          Unpublish
                        </button>
                      )}

                      <button
                        onClick={() => setSchedulingTestId(test.id)}
                        className="px-2.5 py-1 rounded-lg bg-cyan-950/40 hover:bg-cyan-900/60 text-cyan-300 text-xs font-semibold border border-cyan-500/30 transition cursor-pointer"
                        title="Set Exam Window"
                      >
                        Schedule
                      </button>

                      <button
                        onClick={() => archiveTest(test.id)}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition cursor-pointer"
                        title="Archive"
                      >
                        <Archive className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => deleteTest(test.id)}
                        className="p-1.5 rounded-lg bg-rose-950/30 hover:bg-rose-900/60 text-rose-300 hover:text-rose-200 transition cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Schedule Window Modal */}
      {schedulingTestId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="glass-panel p-6 rounded-3xl border border-white/20 max-w-md w-full space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-heading font-bold text-base text-white">
                Schedule Examination Window
              </h3>
              <button
                onClick={() => setSchedulingTestId(null)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Start Date & Time</label>
                <input
                  type="datetime-local"
                  value={scheduleStart}
                  onChange={e => setScheduleStart(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-white/10 rounded-xl text-white"
                />
              </div>
              <div>
                <label className="block text-slate-300 mb-1">Deadline Date & Time</label>
                <input
                  type="datetime-local"
                  value={scheduleEnd}
                  onChange={e => setScheduleEnd(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-white/10 rounded-xl text-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setSchedulingTestId(null)}
                className="px-4 py-2 rounded-xl bg-white/10 text-white font-semibold text-xs"
              >
                Cancel
              </button>
              <button
                onClick={() => handleScheduleSubmit(schedulingTestId)}
                className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs"
              >
                Save Schedule
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin New Test Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/20 max-w-xl w-full space-y-5 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-heading font-bold text-lg text-white">
                Create Institutional Test
              </h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTestSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Test Title (Name) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Daily General Studies Speed Sprint #45"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#FF8C32]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Category *
                  </label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value as TestCategory)}
                    className="w-full px-3 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-white"
                  >
                    <option value="Daily Test">Daily Test</option>
                    <option value="Weekly Test">Weekly Test</option>
                    <option value="Mock Test">Mock Test</option>
                    <option value="PYQ Test">PYQ Test</option>
                    <option value="Chapter Test">Chapter Test</option>
                    <option value="Subject-wise Test">Subject-wise Test</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Academic Subject *
                  </label>
                  <select
                    value={newSubject}
                    onChange={e => setNewSubject(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-white"
                  >
                    {subjects.map(s => (
                      <option key={s.id} value={s.name}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Duration (Minutes) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="180"
                    value={newDuration}
                    onChange={e => setNewDuration(Number(e.target.value))}
                    className="w-full px-3 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Marks per Correct *
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="1"
                    value={newMarksPerCorrect}
                    onChange={e => setNewMarksPerCorrect(Number(e.target.value))}
                    className="w-full px-3 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-white"
                  />
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-900/60 border border-white/5 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-white">Negative Marking Policy</div>
                    <div className="text-[10px] text-slate-400">
                      Standard competitive penalty for wrong responses
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={newNegativeMarking}
                    onChange={e => setNewNegativeMarking(e.target.checked)}
                    className="w-4 h-4 accent-[#FF8C32]"
                  />
                </div>

                {newNegativeMarking && (
                  <div>
                    <label className="block text-slate-400 text-[11px] mb-1">
                      Penalty deduction marks per incorrect answer:
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={newNegativeMarks}
                      onChange={e => setNewNegativeMarks(Number(e.target.value))}
                      className="w-32 px-3 py-1.5 bg-slate-950 border border-white/10 rounded-lg text-white"
                    />
                  </div>
                )}
              </div>

              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-200 space-y-1">
                <div className="font-bold">5-Option OMR Engine Compliance:</div>
                <p className="text-[11px] text-amber-300/80">
                  Option E (Unattempted) will automatically be injected during the student examination session. Candidates selecting Option E or leaving questions unattempted receive 0 marks and 0 negative penalty.
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#FF8C32] hover:bg-orange-500 text-slate-950 font-bold shadow-lg cursor-pointer"
                >
                  Create & Publish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
