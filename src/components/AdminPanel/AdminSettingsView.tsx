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
  const { platformSettings, updatePlatformSettings, firebaseUser, allUsers, promoteUserToAdmin, revokeAdminRole } = useQuiz();

  const [oneAttempt, setOneAttempt] = useState(platformSettings.enforceOneAttempt);
  const [optionE, setOptionE] = useState(platformSettings.enforceOptionE);
  const [negDefault, setNegDefault] = useState(platformSettings.enableNegativeMarkingDefault);
  const [penaltyRatio, setPenaltyRatio] = useState(platformSettings.defaultNegativeMarkPenalty);
  const [sessionTimeoutMinutes, setSessionTimeoutMinutes] = useState(60);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [adminActionNotice, setAdminActionNotice] = useState<string | null>(null);

  const isPlatformOwner = firebaseUser?.email === 'sandeepgarg6375494692@gmail.com';

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

  const handlePromote = async (uid: string) => {
    try {
      await promoteUserToAdmin(uid);
      setAdminActionNotice(`Promoted user ${uid} to Administrator.`);
      setTimeout(() => setAdminActionNotice(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to promote user.');
    }
  };

  const handleRevoke = async (uid: string) => {
    if (!confirm('Are you sure you want to revoke Administrator privileges from this user?')) return;
    try {
      await revokeAdminRole(uid, 'student');
      setAdminActionNotice(`Revoked Admin privileges for user ${uid}.`);
      setTimeout(() => setAdminActionNotice(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to revoke role.');
    }
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

      {/* Owner-Only Administrator Management Section (Part 6) */}
      {isPlatformOwner && (
        <div className="glass-panel p-6 rounded-3xl border border-[#FF8C32]/40 bg-[#FF8C32]/5 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#FF8C32]" />
              <div>
                <h3 className="font-heading font-bold text-base text-white">
                  Owner-Only Administrator Management
                </h3>
                <span className="text-[10px] text-amber-300 font-mono">
                  Restricted to Platform Owner: sandeepgarg6375494692@gmail.com
                </span>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-slate-300 leading-relaxed">
            As the sole platform owner, you have exclusive authority to assign or revoke Administrator permissions. Regular registrations can never sign up as Admin.
          </p>

          {adminActionNotice && (
            <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold">
              {adminActionNotice}
            </div>
          )}

          <div className="overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/90 text-slate-400 text-[10px] uppercase tracking-wider border-b border-white/10">
                <tr>
                  <th className="px-4 py-3">User</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3 text-center">Current Role</th>
                  <th className="px-4 py-3 text-right">Owner Authority Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-medium">
                {allUsers.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-6 text-center text-slate-400">
                      No registered user accounts found in database.
                    </td>
                  </tr>
                ) : (
                  allUsers.map((u) => {
                    const isOwnerSelf = u.email === 'sandeepgarg6375494692@gmail.com';
                    return (
                      <tr key={u.uid} className="hover:bg-white/5 transition">
                        <td className="px-4 py-3 font-bold text-white">
                          {u.displayName || u.name || 'Candidate'}
                          {isOwnerSelf && <span className="ml-1 text-[10px] text-[#FF8C32] font-normal">(You - Root Owner)</span>}
                        </td>
                        <td className="px-4 py-3 text-slate-400 font-mono text-[11px]">
                          {u.email}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            u.role === 'admin'
                              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                              : u.role === 'teacher'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          {isOwnerSelf ? (
                            <span className="text-[10px] text-slate-500">Permanent Root Owner</span>
                          ) : u.role === 'admin' ? (
                            <button
                              onClick={() => handleRevoke(u.uid)}
                              className="px-3 py-1 rounded-lg bg-rose-950/60 hover:bg-rose-900 border border-rose-500/30 text-rose-300 text-[10px] font-bold transition cursor-pointer"
                            >
                              Revoke Admin
                            </button>
                          ) : (
                            <button
                              onClick={() => handlePromote(u.uid)}
                              className="px-3 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-[10px] font-bold transition cursor-pointer"
                            >
                              Promote to Admin
                            </button>
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
      )}

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
