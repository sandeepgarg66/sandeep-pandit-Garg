import React, { useState } from 'react';
import {
  Sliders,
  CheckCircle,
  Flame,
  Star,
  Eye,
  Save,
  Sparkles
} from 'lucide-react';
import { useQuiz } from '../../context/QuizContext';

export const HomepageManagementView: React.FC = () => {
  const { platformSettings, updatePlatformSettings, tests } = useQuiz();
  const [tickerText, setTickerText] = useState(platformSettings.bannerAnnouncement);
  const [isBannerActive, setIsBannerActive] = useState(platformSettings.isBannerActive);
  const [dailyTestId, setDailyTestId] = useState(platformSettings.dailyChallengeTestId);
  const [featuredIds, setFeaturedIds] = useState<string[]>(platformSettings.featuredTestIds);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const publishedTests = tests.filter(t => t.status === 'Published');

  const toggleFeaturedTest = (id: string) => {
    setFeaturedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updatePlatformSettings({
      bannerAnnouncement: tickerText,
      isBannerActive,
      dailyChallengeTestId: dailyTestId,
      featuredTestIds: featuredIds
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-heading text-2xl font-extrabold text-white">
          Homepage & Curation Control
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Configure featured tests, manage the real-time announcement ticker, and update the Daily Challenge showcase.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Announcement Ticker Section */}
        <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#FF8C32]" />
              <h3 className="font-heading font-bold text-sm text-white">
                Global Homepage Announcement Ticker
              </h3>
            </div>
            <label className="flex items-center gap-2 cursor-pointer text-xs">
              <input
                type="checkbox"
                checked={isBannerActive}
                onChange={e => setIsBannerActive(e.target.checked)}
                className="w-4 h-4 accent-[#FF8C32]"
              />
              <span className="text-slate-300 font-semibold">Enable Banner on Homepage</span>
            </label>
          </div>

          <div className="space-y-2 text-xs">
            <label className="block text-slate-300 font-semibold">
              Ticker Text Content
            </label>
            <input
              type="text"
              value={tickerText}
              onChange={e => setTickerText(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#FF8C32]"
              placeholder="e.g. 🔥 Grand All-India Mock Test Series is LIVE! Benchmarking with 5-option OMR standard."
            />
          </div>
        </div>

        {/* Daily Challenge Selector */}
        <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-[#FF8C32]" />
            <h3 className="font-heading font-bold text-sm text-white">
              Pinned Daily Challenge Test
            </h3>
          </div>

          <div className="text-xs space-y-2">
            <label className="block text-slate-300 font-semibold">
              Select Published Daily Test to Feature in Hero / Quick Access
            </label>
            <select
              value={dailyTestId}
              onChange={e => setDailyTestId(e.target.value)}
              className="w-full sm:w-96 px-4 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#FF8C32]"
            >
              {publishedTests.map(t => (
                <option key={t.id} value={t.id}>
                  {t.title} ({t.subject} - {t.questions.length} Qs)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Featured Tests Checklist */}
        <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-amber-400" />
            <h3 className="font-heading font-bold text-sm text-white">
              Featured Tests on Homepage Showcase ({featuredIds.length} Selected)
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {publishedTests.map(test => {
              const isSelected = featuredIds.includes(test.id);
              return (
                <div
                  key={test.id}
                  onClick={() => toggleFeaturedTest(test.id)}
                  className={`p-4 rounded-2xl border transition cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-[#FF8C32]/10 border-[#FF8C32]/40 text-white'
                      : 'bg-white/5 border-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="font-bold text-sm text-white">{test.title}</div>
                    <div className="text-[11px] text-slate-400">
                      {test.category} • {test.subject} • {test.maxMarks} Marks
                    </div>
                  </div>

                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => {}} // handled by parent onClick
                    className="w-4 h-4 accent-[#FF8C32] pointer-events-none"
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-end gap-3 pt-2">
          {savedSuccess && (
            <span className="text-xs text-emerald-400 flex items-center gap-1 font-semibold">
              <CheckCircle className="w-4 h-4" />
              Homepage settings applied successfully!
            </span>
          )}
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-[#FF8C32] hover:bg-orange-500 text-slate-950 font-bold text-xs shadow-lg transition flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save & Apply Live</span>
          </button>
        </div>
      </form>
    </div>
  );
};
