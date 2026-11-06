import React, { useState } from 'react';
import {
  Layers,
  Plus,
  BookOpen,
  Tag,
  CheckCircle,
  X,
  Sparkles
} from 'lucide-react';
import { useQuiz } from '../../context/QuizContext';
import { SubjectItem } from '../../types/quiz';

export const SubjectTopicView: React.FC = () => {
  const { subjects, addSubject, updateSubject, tests, questions } = useQuiz();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState('');
  const [newHindiName, setNewHindiName] = useState('');
  const [newTopics, setNewTopics] = useState('');

  const [activeSubjectId, setActiveSubjectId] = useState<string | null>(null);
  const [newTopicSingle, setNewTopicSingle] = useState('');

  const handleCreateSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubjectName.trim()) return;

    const topicList = newTopics
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    const newSub: SubjectItem = {
      id: `subj-${Date.now()}`,
      name: newSubjectName.trim(),
      hindiName: newHindiName.trim() || newSubjectName.trim(),
      iconName: 'BookOpen',
      totalTests: 0,
      totalQuestions: 0,
      topics: topicList.length > 0 ? topicList : ['General Fundamentals']
    };

    addSubject(newSub);
    setIsModalOpen(false);
    setNewSubjectName('');
    setNewHindiName('');
    setNewTopics('');
  };

  const handleAddTopicToSubject = (subjectId: string) => {
    if (!newTopicSingle.trim()) return;
    const target = subjects.find(s => s.id === subjectId);
    if (!target) return;

    updateSubject(subjectId, {
      topics: [...target.topics, newTopicSingle.trim()]
    });
    setNewTopicSingle('');
    setActiveSubjectId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-extrabold text-white">
            Subject & Topic Architecture
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Organize competitive syllabus verticals, manage sub-topics, and view question inventory distribution.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-[#FF8C32] hover:bg-orange-500 text-slate-950 font-bold text-xs shadow-lg transition flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Academic Subject</span>
        </button>
      </div>

      {/* Subjects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {subjects.map(subj => {
          const subjectTests = tests.filter(t => t.subject === subj.name);
          const subjectQuestions = questions.filter(q => q.subject === subj.name);

          return (
            <div
              key={subj.id}
              className="glass-card p-6 rounded-2xl border border-white/10 space-y-4 hover:border-[#FF8C32]/30 transition"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#FF8C32]/20 to-purple-500/20 border border-[#FF8C32]/30 flex items-center justify-center text-[#FF8C32]">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-base text-white">
                      {subj.name}
                    </h3>
                    <div className="text-xs text-[#FF8C32] font-medium">
                      {subj.hindiName}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-mono font-bold text-white">
                    {subjectTests.length} Tests
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    {subjectQuestions.length} Questions
                  </div>
                </div>
              </div>

              {/* Topics Pills */}
              <div className="space-y-2">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Curriculum Sub-Topics ({subj.topics.length}):
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {subj.topics.map((t, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/5 text-[11px] text-slate-300"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Add Topic Quick Input */}
              <div className="pt-2 border-t border-white/5 flex items-center gap-2">
                {activeSubjectId === subj.id ? (
                  <div className="flex items-center gap-2 w-full">
                    <input
                      type="text"
                      placeholder="New sub-topic name..."
                      value={newTopicSingle}
                      onChange={e => setNewTopicSingle(e.target.value)}
                      className="flex-1 px-3 py-1.5 bg-slate-900 border border-white/10 rounded-lg text-xs text-white"
                    />
                    <button
                      onClick={() => handleAddTopicToSubject(subj.id)}
                      className="px-3 py-1.5 rounded-lg bg-[#FF8C32] text-slate-950 font-bold text-xs"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setActiveSubjectId(null)}
                      className="p-1.5 text-slate-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setActiveSubjectId(subj.id)}
                    className="text-xs text-[#FF8C32] hover:underline flex items-center gap-1 font-semibold cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Sub-Topic</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Subject Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/20 max-w-md w-full space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-heading font-bold text-base text-white">
                Add Academic Subject
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubject} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Subject Name (English) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Environmental Science & Disasters"
                  value={newSubjectName}
                  onChange={e => setNewSubjectName(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-900 border border-white/10 rounded-xl text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Hindi Representation *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. पर्यावरण विज्ञान एवं आपदा प्रबंधन"
                  value={newHindiName}
                  onChange={e => setNewHindiName(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-900 border border-white/10 rounded-xl text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Sub-Topics (Comma separated)
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Biomes, Food Chains, Climate Agreements, Biodiversity Hotspots"
                  value={newTopics}
                  onChange={e => setNewTopics(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-900 border border-white/10 rounded-xl text-white"
                />
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
                  className="px-5 py-2 rounded-xl bg-[#FF8C32] hover:bg-orange-500 text-slate-950 font-bold"
                >
                  Create Subject
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
