import React, { useState } from 'react';
import { User, Mail, Shield, Bell, Key, Check, Save } from 'lucide-react';
import { useQuiz } from '../../context/QuizContext';

export const StudentProfileSettings: React.FC = () => {
  const { studentProfile } = useQuiz();

  const [name, setName] = useState(studentProfile.name);
  const [email, setEmail] = useState(studentProfile.email);
  const [examTarget, setExamTarget] = useState('UPSC CSE & State PSC Prelims');
  const [notifications, setNotifications] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div>
        <div className="text-xs uppercase tracking-wider text-[#FF8C32] font-semibold mb-1 flex items-center gap-1.5">
          <User className="w-3.5 h-3.5" />
          <span>Shinobi Account Credentials</span>
        </div>
        <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-white">
          Profile & Examination Settings
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Manage your personal identity, target syllabus parameters, and security preferences.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile Card */}
        <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6">
          <h3 className="font-heading font-bold text-lg text-white border-b border-white/5 pb-3">
            Personal Information
          </h3>

          <div className="flex flex-wrap items-center gap-6">
            <img
              src={studentProfile.photoURL}
              alt={studentProfile.name}
              className="w-20 h-20 rounded-2xl object-cover border-2 border-[#FF8C32] shadow-lg shadow-orange-500/10"
            />
            <div className="space-y-1">
              <span className="text-xs uppercase font-bold text-[#FF8C32] bg-[#FF8C32]/10 px-2 py-0.5 rounded">
                {studentProfile.rankTitle}
              </span>
              <div className="text-sm font-bold text-white">
                Student ID: <span className="font-mono text-slate-300">{studentProfile.uid}</span>
              </div>
              <p className="text-xs text-slate-400">
                Avatar synchronized across all authorized assessments
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs sm:text-sm focus:border-[#FF8C32] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Registered Email *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs sm:text-sm focus:border-[#FF8C32] outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Target Examination Focus
              </label>
              <select
                value={examTarget}
                onChange={(e) => setExamTarget(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs sm:text-sm focus:border-[#FF8C32] outline-none"
              >
                <option value="UPSC CSE & State PSC Prelims">UPSC CSE & State PSC Prelims</option>
                <option value="SSC CGL & Tier 1/2 Exams">SSC CGL & Central Recruitment Exams</option>
                <option value="Judicial Services Examination">State Judicial Services (Judiciary)</option>
                <option value="Defense (CDS, NDA, AFCAT)">Defense Services (CDS, NDA, AFCAT)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Security & Password UI */}
        <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6">
          <h3 className="font-heading font-bold text-lg text-white border-b border-white/5 pb-3 flex items-center gap-2">
            <Key className="w-5 h-5 text-[#FF8C32]" />
            <span>Security & Authentication</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Current Password
              </label>
              <input
                type="password"
                placeholder="••••••••••••"
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs sm:text-sm focus:border-[#FF8C32] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                New Shinobi Password
              </label>
              <input
                type="password"
                placeholder="Minimum 8 characters"
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs sm:text-sm focus:border-[#FF8C32] outline-none"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <input
                type="checkbox"
                id="notif"
                checked={notifications}
                onChange={(e) => setNotifications(e.target.checked)}
                className="rounded accent-[#FF8C32] w-4 h-4 cursor-pointer"
              />
              <label htmlFor="notif" className="cursor-pointer">
                Receive notifications when new Daily & Weekly Tests are published
              </label>
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-between pt-2">
          {saveSuccess ? (
            <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
              <Check className="w-4 h-4" />
              Settings updated successfully!
            </span>
          ) : (
            <span className="text-xs text-slate-500">
              Changes apply locally and prepare for Firebase Auth integration.
            </span>
          )}

          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#EA580C] to-[#FF8C32] hover:from-[#FF8C32] hover:to-amber-400 text-slate-950 font-bold text-xs sm:text-sm shadow-md transition flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4 fill-slate-950" />
            <span>Save Preferences</span>
          </button>
        </div>
      </form>
    </div>
  );
};
