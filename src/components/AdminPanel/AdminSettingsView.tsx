import React, { useState } from 'react';
import {
  Settings,
  ShieldCheck,
  Save,
  CheckCircle,
  Lock,
  Zap,
  Clock,
  UserCheck
} from 'lucide-react';
import { useQuiz } from '../../context/QuizContext';

export const AdminSettingsView: React.FC = () => {
  const { platformSettings, updatePlatformSettings, firebaseUser } = useQuiz();

  const [oneAttempt, setOneAttempt] = useState(platformSettings.enforceOneAttempt);
  const [optionE, setOptionE] = useState(platformSettings.enforceOptionE);
  const [negDefault, setNegDefault] = useState(platformSettings.enableNegativeMarkingDefault);
  const [penaltyRatio, setPenaltyRatio] = useState(platformSettings.defaultNegativeMarkPenalty);
  const [sessionTimeoutMinutes, setSessionTimeoutMinutes] = useState(60);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updatePlatformSettings({
      enforceOneAttempt: oneAttempt,
      enforceOptionE: optionE,
      enableNegativeMarkingDefault: negDefault,
      defaultNegativeMarkPenalty: Number(penaltyRatio)
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h2 className="font-heading text-2xl font-extrabold text-white">
          Examination Engine Policies & Security
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Configure institutional assessment invariants, OMR standards, and session authentication limits.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* Core Exam Rules */}
        <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-5">
          <div className="flex items-center gap-2 border-b border-white/10 pb-3">
            <ShieldCheck className="w-5 h-5 text-[#FF8C32]" />
            <h3 className="font-heading font-bold text-base text-white">
              Core Examination Rule Invariants
            </h3>
          </div>

          {/* Policy 1: One Attempt */}
          <div className="flex items-start justify-between gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
            <div className="space-y-1">
              <div className="font-bold text-white text-sm">
                Enforce Strict "One Student = One Attempt" Policy
              </div>
              <p className="text-slate-400 text-[11px] max-w-xl">
                When enabled, once a candidate confirms test submission or timer expires, no retakes or second attempts are permitted under any circumstance.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
              <input
                type="checkbox"
                checked={oneAttempt}
                onChange={e => setOneAttempt(e.target.checked)}
                className="w-5 h-5 accent-[#FF8C32]"
              />
            </label>
          </div>

          {/* Policy 2: Option E Standard */}
          <div className="flex items-start justify-between gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
            <div className="space-y-1">
              <div className="font-bold text-white text-sm">
                Mandatory Option E (5-Option OMR Protocol)
              </div>
              <p className="text-slate-400 text-[11px] max-w-xl">
                Enforces the standard 5-option examination format: Option E is strictly "Unattempted / No Response" (0 marks, 0 negative penalty). Clear response resets choice to unanswered.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
              <input
                type="checkbox"
                checked={optionE}
                onChange={e => setOptionE(e.target.checked)}
                className="w-5 h-5 accent-[#FF8C32]"
              />
            </label>
          </div>

          {/* Policy 3: Negative Marking */}
          <div className="flex items-start justify-between gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
            <div className="space-y-1">
              <div className="font-bold text-white text-sm">
                Default Negative Marking for Competitive Tests
              </div>
              <p className="text-slate-400 text-[11px] max-w-xl">
                Automatically applies standard negative penalty to newly created tests. Does NOT penalize Option E selections.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
              <input
                type="checkbox"
                checked={negDefault}
                onChange={e => setNegDefault(e.target.checked)}
                className="w-5 h-5 accent-[#FF8C32]"
              />
            </label>
          </div>

          {/* Penalty Ratio Input */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Default Negative Penalty per Wrong Question (Ratio)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="1"
                value={penaltyRatio}
                onChange={e => setPenaltyRatio(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-white font-mono"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Standard: 0.33 (1/3rd mark deduction) or 0.25 (1/4th deduction)
              </span>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Candidate Browser Inactivity Guard (Minutes)
              </label>
              <input
                type="number"
                min="10"
                max="180"
                value={sessionTimeoutMinutes}
                onChange={e => setSessionTimeoutMinutes(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-white font-mono"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Forces auto-submit if candidate tab loses focus past threshold
              </span>
            </div>
          </div>
        </div>

        {/* Administrator Credentials & Security */}
        <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
          <div className="flex items-center gap-2 border-b border-white/10 pb-3">
            <Lock className="w-5 h-5 text-purple-400" />
            <h3 className="font-heading font-bold text-base text-white">
              Institutional Administration Security
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Root Administrator Alias
              </label>
              <input
                type="text"
                disabled
                value={firebaseUser?.displayName ? `${firebaseUser.displayName} (Root Authority)` : "Institutional Administrator (Root Authority)"}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-white/5 rounded-xl text-slate-400 font-medium"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Institutional Contact Channel
              </label>
              <input
                type="email"
                disabled
                value={firebaseUser?.email || "admin@sanskarquiz.edu"}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-white/5 rounded-xl text-slate-400 font-medium"
              />
            </div>
          </div>
        </div>

        {/* Action Save Bar */}
        <div className="flex items-center justify-end gap-3 pt-2">
          {savedSuccess && (
            <span className="text-xs text-emerald-400 flex items-center gap-1 font-semibold">
              <CheckCircle className="w-4 h-4" />
              Platform security policies updated!
            </span>
          )}
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-[#FF8C32] hover:bg-orange-500 text-slate-950 font-bold text-xs shadow-lg transition flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Update System Policies</span>
          </button>
        </div>
      </form>
    </div>
  );
};
