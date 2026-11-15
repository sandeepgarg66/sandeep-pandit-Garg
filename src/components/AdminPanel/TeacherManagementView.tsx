import React, { useMemo, useState } from 'react';
import {
  GraduationCap,
  CheckCircle2,
  XCircle,
  Search,
  Filter,
  FileText,
  Clock,
  Shield,
  UserCheck,
  AlertTriangle,
  X
} from 'lucide-react';
import { useQuiz } from '../../context/QuizContext';

interface PendingTeacherApplicant {
  uid: string;
  name: string;
  email: string;
  appliedAt: string;
  qualification: string;
  specialization: string;
  photoURL?: string;
}

export const TeacherManagementView: React.FC = () => {
  const {
    teachers,
    allUsers,
    approveTeacher,
    suspendTeacher,
    reviewTeacherRequestViaBackend,
    tests
  } = useQuiz();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Approved' | 'Pending' | 'Suspended' | 'Rejected'>('All');
  const [busyUid, setBusyUid] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Reject Reason Modal
  const [rejectTarget, setRejectTarget] = useState<PendingTeacherApplicant | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  // Assign Admin Confirmation Modal
  const [adminAssignTarget, setAdminAssignTarget] = useState<PendingTeacherApplicant | null>(null);
  const [adminConfirmChecked, setAdminConfirmChecked] = useState(false);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => {
      setToast(prev => (prev?.message === message ? null : prev));
    }, 5000);
  };

  // Merge pending teacher applicants from both users collection & teacherProfiles
  const pendingApplicants = useMemo(() => {
    const map = new Map<string, PendingTeacherApplicant>();

    teachers
      .filter(t => t.status === 'Pending')
      .forEach(t => {
        map.set(t.id, {
          uid: t.id,
          name: t.name,
          email: t.email,
          appliedAt: t.joinedDate,
          qualification: t.qualification || 'Applicant Educator',
          specialization: t.specialization || 'General Studies',
          photoURL: t.photoURL
        });
      });

    allUsers
      .filter(u => u.teacherApprovalStatus === 'Pending')
      .forEach(u => {
        const existing = map.get(u.uid);
        map.set(u.uid, {
          uid: u.uid,
          name: existing?.name || u.name || u.displayName || 'Applicant',
          email: existing?.email || u.email,
          appliedAt: existing?.appliedAt || u.appliedAt || u.createdAt || 'Pending',
          qualification: u.qualification || existing?.qualification || 'Pending Verification',
          specialization: u.specialization || existing?.specialization || 'General Competitive Exams',
          photoURL: existing?.photoURL || u.photoURL
        });
      });

    return Array.from(map.values());
  }, [teachers, allUsers]);

  const filteredTeachers = teachers.filter(tch => {
    const matchesSearch =
      tch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tch.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tch.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || tch.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleApproveAsTeacher = async (applicant: PendingTeacherApplicant) => {
    setBusyUid(applicant.uid);
    try {
      await reviewTeacherRequestViaBackend({
        targetUid: applicant.uid,
        decision: 'approve_teacher',
        reason: 'Approved educator credentials via Pending Teacher Requests queue'
      });
      showToast('success', `${applicant.name} approved as Teacher (Teacher + Student access active).`);
    } catch (err: any) {
      showToast('error', err?.message || 'Failed to approve teacher request.');
    } finally {
      setBusyUid(null);
    }
  };

  const handleAssignStudentInstead = async (applicant: PendingTeacherApplicant) => {
    setBusyUid(applicant.uid);
    try {
      await reviewTeacherRequestViaBackend({
        targetUid: applicant.uid,
        decision: 'assign_student',
        reason: 'Assigned Student role instead of Teacher access'
      });
      showToast('success', `${applicant.name} assigned Student role instead.`);
    } catch (err: any) {
      showToast('error', err?.message || 'Failed to assign Student role.');
    } finally {
      setBusyUid(null);
    }
  };

  const handleConfirmReject = async () => {
    if (!rejectTarget) return;
    if (!rejectReason.trim()) {
      showToast('error', 'Please enter a reason before rejecting a Teacher access request.');
      return;
    }
    setBusyUid(rejectTarget.uid);
    try {
      await reviewTeacherRequestViaBackend({
        targetUid: rejectTarget.uid,
        decision: 'reject',
        reason: rejectReason.trim()
      });
      const name = rejectTarget.name;
      setRejectTarget(null);
      setRejectReason('');
      showToast('success', `Rejected teacher request for ${name} and notified applicant.`);
    } catch (err: any) {
      showToast('error', err?.message || 'Failed to reject teacher request.');
    } finally {
      setBusyUid(null);
    }
  };

  const handleConfirmAssignAdmin = async () => {
    if (!adminAssignTarget || !adminConfirmChecked) return;
    setBusyUid(adminAssignTarget.uid);
    try {
      await reviewTeacherRequestViaBackend({
        targetUid: adminAssignTarget.uid,
        decision: 'assign_admin',
        reason: 'Explicitly promoted applicant to Administrator',
        confirmAdminPrivilegeChange: true
      });
      const name = adminAssignTarget.name;
      setAdminAssignTarget(null);
      setAdminConfirmChecked(false);
      showToast('success', `${name} granted full Administrator authority.`);
    } catch (err: any) {
      showToast('error', err?.message || 'Failed to assign Admin role.');
    } finally {
      setBusyUid(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-extrabold text-white">
            Teacher & Examiner Management
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Review Pending Teacher Requests, grant or revoke educator credentials, and oversee test authors.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-mono text-amber-300 bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/20">
            Pending Requests: {pendingApplicants.length}
          </span>
          <span className="text-xs font-mono text-purple-300 bg-purple-500/10 px-3 py-1.5 rounded-xl border border-purple-500/20">
            Educator Profiles: {teachers.length}
          </span>
        </div>
      </div>

      {/* Inline Toast */}
      {toast && (
        <div
          className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 text-xs font-semibold ${
            toast.type === 'success'
              ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-200'
              : 'bg-rose-500/15 border-rose-500/40 text-rose-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            )}
            <span>{toast.message}</span>
          </div>
          <button onClick={() => setToast(null)} className="p-1 cursor-pointer">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Dedicated Pending Teacher Requests Queue */}
      <section className="glass-panel p-5 sm:p-6 rounded-3xl border border-amber-500/25 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-300">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-heading font-extrabold text-base text-white">
                Pending Teacher Requests ({pendingApplicants.length})
              </h3>
              <p className="text-[11px] text-slate-400">
                Applicants currently hold standard Student access until an Admin reviews their request.
              </p>
            </div>
          </div>
        </div>

        {pendingApplicants.length === 0 ? (
          <div className="p-6 rounded-2xl bg-white/5 border border-white/5 text-center text-xs text-slate-400">
            No pending Teacher access applications right now.
          </div>
        ) : (
          <div className="space-y-3">
            {pendingApplicants.map(applicant => (
              <div
                key={applicant.uid}
                className="p-4 sm:p-5 rounded-2xl bg-slate-900/75 border border-amber-500/25 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3.5 min-w-0">
                  <img
                    src={
                      applicant.photoURL ||
                      `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(applicant.email || applicant.uid)}`
                    }
                    alt={applicant.name}
                    className="w-12 h-12 rounded-xl object-cover border border-amber-500/30 shrink-0"
                  />
                  <div className="min-w-0 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-heading font-bold text-sm text-white">
                        {applicant.name}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        Pending Teacher Request
                      </span>
                    </div>
                    <div className="text-xs text-slate-300">{applicant.email}</div>
                    <div className="text-[11px] text-[#FF8C32] font-semibold">
                      {applicant.specialization} • {applicant.qualification}
                    </div>
                    <div className="text-[10px] font-mono text-slate-500">
                      Applied: {applicant.appliedAt} • UID: {applicant.uid}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleApproveAsTeacher(applicant)}
                    disabled={busyUid === applicant.uid}
                    className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer transition"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Approve as Teacher</span>
                  </button>

                  <button
                    onClick={() => {
                      setRejectTarget(applicant);
                      setRejectReason('');
                    }}
                    disabled={busyUid === applicant.uid}
                    className="px-3.5 py-2 rounded-xl bg-rose-950/60 hover:bg-rose-900/70 disabled:opacity-50 text-rose-200 border border-rose-500/30 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Reject Request</span>
                  </button>

                  <button
                    onClick={() => handleAssignStudentInstead(applicant)}
                    disabled={busyUid === applicant.uid}
                    className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-50 text-slate-200 border border-white/10 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition"
                  >
                    <UserCheck className="w-3.5 h-3.5 text-sky-400" />
                    <span>Assign Student Instead</span>
                  </button>

                  <button
                    onClick={() => {
                      setAdminAssignTarget(applicant);
                      setAdminConfirmChecked(false);
                    }}
                    disabled={busyUid === applicant.uid}
                    className="px-3 py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 disabled:opacity-50 text-purple-200 border border-purple-500/30 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition"
                  >
                    <Shield className="w-3.5 h-3.5 text-purple-300" />
                    <span>Assign Admin</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Controls Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by educator name or subject..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-900/60 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#FF8C32]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs text-slate-400">Filter:</span>
          {(['All', 'Approved', 'Pending', 'Rejected', 'Suspended'] as const).map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                statusFilter === status
                  ? 'bg-purple-600 text-white font-bold'
                  : 'bg-white/5 text-slate-400 hover:text-white'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Educator Profiles Grid */}
      {filteredTeachers.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl border border-white/10 text-center space-y-3">
          <GraduationCap className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="font-heading font-bold text-lg text-white">No Registered Educators Found</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            {searchTerm || statusFilter !== 'All'
              ? 'No educators match your search criteria. Try resetting your filter or search query.'
              : 'When educators register and submit their credentials, their profiles appear here.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTeachers.map(tch => {
            const authorTests = tests.filter(
              t => t.createdBy === tch.id || t.teacherName === tch.name || t.createdBy === tch.name
            );

            return (
              <div
                key={tch.id}
                className="glass-card p-5 rounded-2xl border border-white/10 flex flex-col justify-between space-y-4 hover:border-purple-500/30 transition"
              >
                <div className="flex items-start gap-4">
                  <img
                    src={
                      tch.photoURL ||
                      `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(tch.email || tch.name)}`
                    }
                    alt={tch.name}
                    className="w-14 h-14 rounded-2xl object-cover border border-purple-500/30 shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-heading font-bold text-white text-base truncate">
                        {tch.name}
                      </h3>
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded shrink-0 ${
                          tch.status === 'Approved'
                            ? 'text-emerald-300 bg-emerald-500/20'
                            : tch.status === 'Pending'
                            ? 'text-amber-300 bg-amber-500/20'
                            : 'text-rose-300 bg-rose-500/20'
                        }`}
                      >
                        {tch.status}
                      </span>
                    </div>

                    <div className="text-[11px] text-[#FF8C32] font-semibold mt-0.5">
                      {tch.specialization}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1 line-clamp-2">
                      {tch.qualification}
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono mt-1">
                      Joined: {tch.joinedDate} • UID: {tch.id}
                    </div>
                    {tch.rejectionReason && tch.status === 'Rejected' && (
                      <div className="text-[10px] text-rose-300 mt-1">
                        Rejection Reason: {tch.rejectionReason}
                      </div>
                    )}
                  </div>
                </div>

                {/* Stats & Actions Footer */}
                <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-slate-300">
                    <FileText className="w-3.5 h-3.5 text-purple-400" />
                    <span>
                      <strong>{authorTests.length}</strong> tests authoring
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {tch.status === 'Approved' && (
                      <button
                        onClick={() => suspendTeacher(tch.id)}
                        className="px-3 py-1 rounded-lg bg-white/5 hover:bg-rose-950/40 text-slate-400 hover:text-rose-300 text-xs font-semibold border border-white/10 hover:border-rose-500/30 transition cursor-pointer"
                      >
                        Revoke / Suspend
                      </button>
                    )}

                    {(tch.status === 'Suspended' || tch.status === 'Rejected') && (
                      <button
                        onClick={() => approveTeacher(tch.id)}
                        className="px-3 py-1 rounded-lg bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-300 text-xs font-semibold border border-emerald-500/30 transition cursor-pointer"
                      >
                        Approve Educator
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Reject Reason Modal */}
      {rejectTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-md rounded-3xl border border-rose-500/40 p-6 space-y-4 shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-heading text-lg font-extrabold text-white">
                  Reject Teacher Request
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {rejectTarget.name} ({rejectTarget.email})
                </p>
              </div>
              <button
                onClick={() => setRejectTarget(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 block">
                Rejection Reason (Required & Sent to Applicant)
              </label>
              <textarea
                rows={3}
                value={rejectReason}
                onChange={e => setRejectReason(e.target.value)}
                placeholder="Explain why the educator request was declined..."
                className="w-full p-3 bg-slate-900/70 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-400"
              />
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setRejectTarget(null)}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReject}
                disabled={busyUid === rejectTarget.uid || !rejectReason.trim()}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-40 text-white text-xs font-bold cursor-pointer transition"
              >
                {busyUid === rejectTarget.uid ? 'Rejecting...' : 'Confirm Rejection'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Admin Explicit Confirmation Modal */}
      {adminAssignTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-md rounded-3xl border border-purple-500/40 p-6 space-y-4 shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-heading text-lg font-extrabold text-white">
                  Confirm Admin Role Assignment
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {adminAssignTarget.name} ({adminAssignTarget.email})
                </p>
              </div>
              <button
                onClick={() => setAdminAssignTarget(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Assigning the <strong className="text-purple-300">Admin</strong> role grants full authority over user roles, test approvals, question bank moderation, and audit logs.
            </p>

            <label className="flex items-start gap-2.5 p-3 rounded-xl bg-purple-500/10 border border-purple-500/30 text-xs text-purple-200 cursor-pointer">
              <input
                type="checkbox"
                checked={adminConfirmChecked}
                onChange={e => setAdminConfirmChecked(e.target.checked)}
                className="mt-0.5 accent-[#FF8C32]"
              />
              <span>
                I explicitly confirm granting Administrator privileges to {adminAssignTarget.email}.
              </span>
            </label>

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setAdminAssignTarget(null)}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAssignAdmin}
                disabled={busyUid === adminAssignTarget.uid || !adminConfirmChecked}
                className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white text-xs font-bold cursor-pointer transition"
              >
                {busyUid === adminAssignTarget.uid ? 'Granting...' : 'Grant Admin Role'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
