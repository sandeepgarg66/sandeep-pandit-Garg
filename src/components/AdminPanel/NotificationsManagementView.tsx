import React, { useState } from 'react';
import {
  Bell,
  Send,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Info,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  Plus
} from 'lucide-react';
import { useQuiz } from '../../context/QuizContext';
import { NotificationAnnouncement } from '../../types/quiz';

export const NotificationsManagementView: React.FC = () => {
  const {
    notifications,
    addNotification,
    toggleNotificationStatus,
    deleteNotification
  } = useQuiz();

  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [targetAudience, setTargetAudience] = useState<'All' | 'Students' | 'Teachers'>('All');
  const [type, setType] = useState<'info' | 'warning' | 'celebration' | 'alert'>('info');
  const [bannerDisplay, setBannerDisplay] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    addNotification({
      title: title.trim(),
      message: message.trim(),
      targetAudience,
      type,
      bannerDisplay,
      isActive: true
    });

    setTitle('');
    setMessage('');
    setBannerDisplay(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-heading text-2xl font-extrabold text-white">
          Institutional Announcements & Notifications
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Broadcast official examination updates, schedule alerts, and banner notices to candidates and educators.
        </p>
      </div>

      {/* Broadcast Form */}
      <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
        <div className="flex items-center gap-2">
          <Send className="w-4 h-4 text-[#FF8C32]" />
          <h3 className="font-heading font-bold text-sm text-white">
            Broadcast New Announcement
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-slate-300 font-semibold mb-1">
                Announcement Headline *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Grand All-India Mock Test #02 Live Tomorrow at 10:00 AM"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#FF8C32]"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Target Audience *
              </label>
              <select
                value={targetAudience}
                onChange={e => setTargetAudience(e.target.value as any)}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-white"
              >
                <option value="All">All Users (Students + Teachers)</option>
                <option value="Students">Candidates Only</option>
                <option value="Teachers">Jonin Educators Only</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Announcement Message Body *
            </label>
            <textarea
              required
              rows={2}
              placeholder="Provide detailed instructions or exam guidelines..."
              value={message}
              onChange={e => setMessage(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-900 border border-white/10 rounded-xl text-white placeholder-slate-500"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Notice Category:</span>
                {(['info', 'celebration', 'warning', 'alert'] as const).map(t => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setType(t)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase transition cursor-pointer ${
                      type === t
                        ? 'bg-[#FF8C32] text-slate-950'
                        : 'bg-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={bannerDisplay}
                  onChange={e => setBannerDisplay(e.target.checked)}
                  className="w-4 h-4 accent-[#FF8C32]"
                />
                <span className="text-slate-300 font-medium">Pin to Homepage Banner</span>
              </label>
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#FF8C32] hover:bg-orange-500 text-slate-950 font-bold shadow-lg transition flex items-center gap-2 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Broadcast Notice</span>
            </button>
          </div>
        </form>
      </div>

      {/* Broadcast History List */}
      <div className="space-y-3">
        <h3 className="font-heading font-bold text-sm text-slate-300">
          Active & Historical Announcements ({notifications.length})
        </h3>

        <div className="space-y-3">
          {notifications.map(notif => (
            <div
              key={notif.id}
              className={`glass-card p-5 rounded-2xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                notif.isActive ? 'border-white/10 bg-white/5' : 'border-white/5 opacity-60 bg-black/30'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded ${
                      notif.type === 'celebration'
                        ? 'text-emerald-300 bg-emerald-500/20'
                        : notif.type === 'warning'
                        ? 'text-amber-300 bg-amber-500/20'
                        : notif.type === 'alert'
                        ? 'text-rose-300 bg-rose-500/20'
                        : 'text-cyan-300 bg-cyan-500/20'
                    }`}
                  >
                    {notif.type}
                  </span>
                  <span className="text-[10px] text-purple-300 font-mono">
                    Target: {notif.targetAudience}
                  </span>
                  {notif.bannerDisplay && (
                    <span className="text-[9px] text-[#FF8C32] bg-[#FF8C32]/10 px-1.5 py-0.5 rounded border border-[#FF8C32]/20 font-bold">
                      Homepage Banner
                    </span>
                  )}
                  <span className="text-[10px] text-slate-500 font-mono">
                    {notif.createdAt}
                  </span>
                </div>

                <h4 className="font-heading font-bold text-sm text-white">
                  {notif.title}
                </h4>
                <p className="text-xs text-slate-300 max-w-2xl">
                  {notif.message}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => toggleNotificationStatus(notif.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition cursor-pointer ${
                    notif.isActive
                      ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/30'
                      : 'bg-white/5 text-slate-400 border-white/10'
                  }`}
                >
                  {notif.isActive ? 'Active' : 'Muted'}
                </button>

                <button
                  onClick={() => deleteNotification(notif.id)}
                  className="p-1.5 rounded-lg bg-rose-950/30 hover:bg-rose-900/50 text-rose-300 transition cursor-pointer"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
