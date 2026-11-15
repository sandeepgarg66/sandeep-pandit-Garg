import React, { useEffect, useMemo, useState } from 'react';
import {
  Search,
  RefreshCw,
  Shield,
  ShieldAlert,
  GraduationCap,
  UserCheck,
  UserX,
  Ban,
  CheckCircle2,
  XCircle,
  Copy,
  Check,
  Eye,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Clock,
  ArrowRight,
  Lock,
  AlertTriangle,
  X
} from 'lucide-react';
import { useQuiz } from '../../context/QuizContext';
import { UserAccount, UserRole } from '../../types/quiz';
import {
  DirectoryRoleFilter,
  DirectorySortOrder,
  DirectoryStatusFilter,
  RoleActionDefinition,
  filterSortPaginateUsers,
  getAvailableRoleActionsForUser,
  isRootOwnerEmail,
  validateRoleChangeRequest,
  validateStatusChangeRequest
} from '../../lib/roleManagementRules';

interface UserDirectoryViewProps {
  initialRoleFilter?: DirectoryRoleFilter;
  initialStatusFilter?: DirectoryStatusFilter;
}

function formatDateTime(value?: string): string {
  if (!value) return 'Not recorded';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function RoleBadge({ role }: { role: UserRole }) {
  if (role === 'admin') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase bg-purple-500/20 text-purple-300 border border-purple-500/30">
        <Shield className="w-3 h-3" />
        Admin
      </span>
    );
  }
  if (role === 'teacher') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase bg-sky-500/20 text-sky-300 border border-sky-500/30">
        <GraduationCap className="w-3 h-3" />
        Teacher
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
      <UserCheck className="w-3 h-3" />
      Student
    </span>
  );
}

function StatusBadge({ status }: { status?: 'Active' | 'Suspended' }) {
  if (status === 'Suspended') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-rose-500/20 text-rose-300 border border-rose-500/30">
        <Ban className="w-3 h-3" />
        Suspended
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-emerald-500/15 text-emerald-300 border border-emerald-500/25">
      <CheckCircle2 className="w-3 h-3" />
      Active
    </span>
  );
}

function TeacherApprovalBadge({ status }: { status?: UserAccount['teacherApprovalStatus'] }) {
  const s = status || 'None';
  if (s === 'Pending') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
        <Clock className="w-3 h-3" />
        Pending
      </span>
    );
  }
  if (s === 'Approved') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
        Approved
      </span>
    );
  }
  if (s === 'Rejected') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-rose-500/15 text-rose-300 border border-rose-500/30">
        Rejected
      </span>
    );
  }
  if (s === 'Suspended') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-rose-500/20 text-rose-300 border border-rose-500/30">
        Suspended
      </span>
    );
  }
  return <span className="text-[11px] text-slate-500 font-mono">None</span>;
}

export const UserDirectoryView: React.FC<UserDirectoryViewProps> = ({
  initialRoleFilter = 'all',
  initialStatusFilter = 'all'
}) => {
  const {
    allUsers,
    auditLogs,
    firebaseUser,
    verifiedRole,
    accountStatus,
    adminSdkConfigured,
    authMetadataMap,
    refreshAdminDirectoryData,
    changeUserRoleViaBackend,
    changeUserStatusViaBackend,
    deleteUserAccountViaBackend
  } = useQuiz();

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<DirectoryRoleFilter>(initialRoleFilter);
  const [statusFilter, setStatusFilter] = useState<DirectoryStatusFilter>(initialStatusFilter);
  const [sortOrder, setSortOrder] = useState<DirectorySortOrder>('newest');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [copiedUid, setCopiedUid] = useState<string | null>(null);

  // Selected user inspection modal
  const [selectedUserUid, setSelectedUserUid] = useState<string | null>(null);

  // Role Change Confirmation Modal
  const [pendingRoleChange, setPendingRoleChange] = useState<{
    user: UserAccount;
    action: RoleActionDefinition;
  } | null>(null);
  const [roleChangeReason, setRoleChangeReason] = useState('');
  const [adminConfirmChecked, setAdminConfirmChecked] = useState(false);
  const [submittingAction, setSubmittingAction] = useState(false);

  // Status Change Confirmation Modal
  const [pendingStatusChange, setPendingStatusChange] = useState<{
    user: UserAccount;
    newStatus: 'Active' | 'Suspended';
  } | null>(null);
  const [statusReason, setStatusReason] = useState('');

  // Permanent Delete Confirmation state inside inspection modal
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [deleteReason, setDeleteReason] = useState('');

  // Inline Toast
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    setRoleFilter(initialRoleFilter);
    setPage(1);
  }, [initialRoleFilter]);

  useEffect(() => {
    setStatusFilter(initialStatusFilter);
    setPage(1);
  }, [initialStatusFilter]);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => {
      setToast(prev => (prev?.message === message ? null : prev));
    }, 6000);
  };

  const paginated = useMemo(
    () =>
      filterSortPaginateUsers(allUsers, {
        searchQuery,
        roleFilter,
        statusFilter,
        sortOrder,
        page,
        pageSize
      }),
    [allUsers, searchQuery, roleFilter, statusFilter, sortOrder, page, pageSize]
  );

  const selectedUser = useMemo(
    () => allUsers.find(u => u.uid === selectedUserUid) || null,
    [allUsers, selectedUserUid]
  );

  const selectedUserAuditLogs = useMemo(() => {
    if (!selectedUser) return [];
    return auditLogs.filter(
      log =>
        log.targetUserUid === selectedUser.uid ||
        log.target.includes(selectedUser.uid) ||
        log.target.toLowerCase().includes(selectedUser.email.toLowerCase())
    );
  }, [auditLogs, selectedUser]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshAdminDirectoryData();
      showToast('success', 'User directory synchronized with Firebase.');
    } catch (err: any) {
      showToast('error', err?.message || 'Failed to refresh directory.');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleCopyUid = (uid: string) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(uid).catch(() => {});
    }
    setCopiedUid(uid);
    setTimeout(() => setCopiedUid(null), 1500);
  };

  const openRoleConfirmation = (user: UserAccount, action: RoleActionDefinition) => {
    setPendingRoleChange({ user, action });
    setRoleChangeReason('');
    setAdminConfirmChecked(false);
  };

  const handleConfirmRoleChange = async () => {
    if (!pendingRoleChange) return;
    const { user, action } = pendingRoleChange;
    const involvesAdmin = user.role === 'admin' || action.targetRole === 'admin';

    const localValidation = validateRoleChangeRequest({
      caller: {
        uid: firebaseUser?.uid || '',
        email: firebaseUser?.email,
        role: verifiedRole,
        accountStatus: accountStatus || 'Active',
        emailVerified: firebaseUser?.emailVerified
      },
      target: user,
      newRole: action.targetRole,
      allUsers,
      confirmAdminPrivilegeChange: involvesAdmin ? adminConfirmChecked : true
    });

    if (!localValidation.allowed) {
      showToast('error', localValidation.error || 'Role change blocked by safeguard.');
      return;
    }

    setSubmittingAction(true);
    try {
      const result = await changeUserRoleViaBackend({
        targetUid: user.uid,
        newRole: action.targetRole,
        actionId: action.id,
        reason: roleChangeReason.trim() || undefined,
        confirmAdminPrivilegeChange: involvesAdmin ? adminConfirmChecked : false
      });

      setPendingRoleChange(null);
      showToast(
        'success',
        `Updated ${user.name} from ${user.role} to ${action.targetRole}.${
          result.customClaimsSynced ? ' Firebase Custom Claims synced.' : ''
        }`
      );
    } catch (err: any) {
      showToast('error', err?.message || 'Backend rejected role update.');
    } finally {
      setSubmittingAction(false);
    }
  };

  const handleConfirmStatusChange = async () => {
    if (!pendingStatusChange) return;
    const { user, newStatus } = pendingStatusChange;

    const localValidation = validateStatusChangeRequest({
      caller: {
        uid: firebaseUser?.uid || '',
        email: firebaseUser?.email,
        role: verifiedRole,
        accountStatus: accountStatus || 'Active',
        emailVerified: firebaseUser?.emailVerified
      },
      target: user,
      newStatus,
      allUsers
    });

    if (!localValidation.allowed) {
      showToast('error', localValidation.error || 'Status change blocked by safeguard.');
      return;
    }

    setSubmittingAction(true);
    try {
      await changeUserStatusViaBackend({
        targetUid: user.uid,
        newStatus,
        reason: statusReason.trim() || undefined
      });
      setPendingStatusChange(null);
      setStatusReason('');
      showToast('success', `Account for ${user.name} is now ${newStatus}.`);
    } catch (err: any) {
      showToast('error', err?.message || 'Failed to update account status.');
    } finally {
      setSubmittingAction(false);
    }
  };

  const handlePermanentDelete = async (user: UserAccount) => {
    if (deleteConfirmText.trim() !== 'DELETE') {
      showToast('error', 'Type DELETE in uppercase to confirm permanent account deletion.');
      return;
    }
    setSubmittingAction(true);
    try {
      await deleteUserAccountViaBackend({
        targetUid: user.uid,
        confirmDelete: true,
        reason: deleteReason.trim() || undefined
      });
      setSelectedUserUid(null);
      setDeleteConfirmText('');
      setDeleteReason('');
      showToast('success', `Deleted account ${user.email}. Historical tests & attempts were preserved.`);
    } catch (err: any) {
      showToast('error', err?.message || 'Failed to delete user account.');
    } finally {
      setSubmittingAction(false);
    }
  };

  const getLastLoginDisplay = (user: UserAccount) => {
    const raw = user.lastLoginAt || authMetadataMap[user.uid]?.lastSignInTime;
    return raw ? formatDateTime(raw) : 'Not recorded';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-extrabold text-white">
            User Directory & Role Management
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Central administrative control over user roles, educator privileges, account status, and security audit logs.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <span
            className={`text-[11px] font-mono px-3 py-1.5 rounded-xl border ${
              adminSdkConfigured
                ? 'text-emerald-300 bg-emerald-500/10 border-emerald-500/30'
                : 'text-cyan-300 bg-cyan-500/10 border-cyan-500/30'
            }`}
          >
            {adminSdkConfigured
              ? 'Admin SDK + Custom Claims Active'
              : 'Verified ID-Token Backend Active'}
          </span>

          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-white flex items-center gap-1.5 cursor-pointer transition disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#FF8C32] ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Inline Toast Feedback */}
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
          <button onClick={() => setToast(null)} className="p-1 hover:bg-white/10 rounded cursor-pointer">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Search, Filter, Sort & Page Size Controls */}
      <div className="glass-panel p-4 rounded-2xl border border-white/10 space-y-3">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Search by full name, email, or Firebase UID..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-900/70 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#FF8C32]"
            />
          </div>

          {/* Sort & Status Controls */}
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={statusFilter}
              onChange={e => {
                setStatusFilter(e.target.value as DirectoryStatusFilter);
                setPage(1);
              }}
              aria-label="Filter by account status"
              className="px-3 py-2 bg-slate-900/70 border border-white/10 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-[#FF8C32]"
            >
              <option value="all">Status: All</option>
              <option value="Active">Active Only</option>
              <option value="Suspended">Suspended Only</option>
            </select>

            <select
              value={sortOrder}
              onChange={e => {
                setSortOrder(e.target.value as DirectorySortOrder);
                setPage(1);
              }}
              aria-label="Sort by registration date"
              className="px-3 py-2 bg-slate-900/70 border border-white/10 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-[#FF8C32]"
            >
              <option value="newest">Registered: Newest First</option>
              <option value="oldest">Registered: Oldest First</option>
            </select>

            <select
              value={pageSize}
              onChange={e => {
                setPageSize(Number(e.target.value));
                setPage(1);
              }}
              aria-label="Rows per page"
              className="px-3 py-2 bg-slate-900/70 border border-white/10 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-[#FF8C32]"
            >
              <option value={10}>10 / page</option>
              <option value={25}>25 / page</option>
              <option value={50}>50 / page</option>
            </select>
          </div>
        </div>

        {/* Role Filter Pills */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-white/5">
          <div className="flex flex-wrap items-center gap-1.5">
            {(
              [
                { id: 'all', label: 'All Users' },
                { id: 'student', label: 'Students' },
                { id: 'teacher', label: 'Teachers' },
                { id: 'admin', label: 'Admins' },
                { id: 'pending', label: 'Pending Teacher Requests' }
              ] as { id: DirectoryRoleFilter; label: string }[]
            ).map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setRoleFilter(tab.id);
                  setPage(1);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  roleFilter === tab.id
                    ? 'bg-[#FF8C32] text-slate-950 font-bold'
                    : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <span className="text-[11px] font-mono text-slate-400">
            Showing {paginated.items.length} of {paginated.totalMatched} matched users
          </span>
        </div>
      </div>

      {/* Empty State */}
      {paginated.items.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl border border-white/10 text-center space-y-2">
          <UserX className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="font-heading font-bold text-base text-white">No Matching Users Found</h3>
          <p className="text-xs text-slate-400">
            Try clearing the search query or switching role/status filters.
          </p>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block glass-panel rounded-2xl border border-white/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider border-b border-white/10">
                  <tr>
                    <th className="px-4 py-3.5">User & Email</th>
                    <th className="px-4 py-3.5">User UID</th>
                    <th className="px-4 py-3.5">Current Role</th>
                    <th className="px-4 py-3.5">Status</th>
                    <th className="px-4 py-3.5">Teacher Request</th>
                    <th className="px-4 py-3.5">Registered / Last Login</th>
                    <th className="px-4 py-3.5 text-right">Manage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {paginated.items.map(user => {
                    const isOwner = isRootOwnerEmail(user.email);
                    return (
                      <tr key={user.uid} className="hover:bg-white/5 transition">
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-3">
                            {user.photoURL ? (
                              <img
                                src={user.photoURL}
                                alt={user.name}
                                className="w-9 h-9 rounded-xl object-cover border border-white/10 shrink-0"
                              />
                            ) : (
                              <div className="w-9 h-9 rounded-xl bg-[#FF8C32]/15 border border-[#FF8C32]/30 text-[#FF8C32] font-bold flex items-center justify-center shrink-0">
                                {(user.name || user.email || 'U').charAt(0).toUpperCase()}
                              </div>
                            )}
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-white truncate max-w-[180px]">
                                  {user.name}
                                </span>
                                {isOwner && (
                                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase">
                                    Owner
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] text-slate-400 truncate max-w-[200px]">
                                {user.email}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-300">
                            <span title={user.uid}>{user.uid.slice(0, 12)}...</span>
                            <button
                              onClick={() => handleCopyUid(user.uid)}
                              className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white cursor-pointer"
                              title="Copy full UID"
                            >
                              {copiedUid === user.uid ? (
                                <Check className="w-3 h-3 text-emerald-400" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          </div>
                        </td>

                        <td className="px-4 py-3.5">
                          <RoleBadge role={user.role} />
                        </td>

                        <td className="px-4 py-3.5">
                          <StatusBadge status={user.accountStatus} />
                        </td>

                        <td className="px-4 py-3.5">
                          <TeacherApprovalBadge status={user.teacherApprovalStatus} />
                        </td>

                        <td className="px-4 py-3.5 text-[11px] font-mono text-slate-400">
                          <div>Reg: {formatDateTime(user.createdAt)}</div>
                          <div className="text-slate-500">Login: {getLastLoginDisplay(user)}</div>
                        </td>

                        <td className="px-4 py-3.5 text-right">
                          <button
                            onClick={() => {
                              setSelectedUserUid(user.uid);
                              setDeleteConfirmText('');
                              setDeleteReason('');
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FF8C32]/15 hover:bg-[#FF8C32]/25 text-[#FF8C32] border border-[#FF8C32]/30 font-bold text-xs cursor-pointer transition"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Inspect & Roles</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-3">
            {paginated.items.map(user => (
              <div
                key={user.uid}
                className="glass-card p-4 rounded-2xl border border-white/10 space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-bold text-sm text-white truncate">{user.name}</div>
                    <div className="text-[11px] text-slate-400 truncate">{user.email}</div>
                    <div className="text-[10px] font-mono text-slate-500 mt-0.5 truncate">
                      UID: {user.uid}
                    </div>
                  </div>
                  <RoleBadge role={user.role} />
                </div>

                <div className="flex flex-wrap items-center gap-2 text-[11px]">
                  <StatusBadge status={user.accountStatus} />
                  <TeacherApprovalBadge status={user.teacherApprovalStatus} />
                </div>

                <div className="text-[10px] font-mono text-slate-400 space-y-0.5">
                  <div>Registered: {formatDateTime(user.createdAt)}</div>
                  <div>Last Login: {getLastLoginDisplay(user)}</div>
                </div>

                <button
                  onClick={() => {
                    setSelectedUserUid(user.uid);
                    setDeleteConfirmText('');
                    setDeleteReason('');
                  }}
                  className="w-full py-2 rounded-xl bg-[#FF8C32]/15 hover:bg-[#FF8C32]/25 text-[#FF8C32] border border-[#FF8C32]/30 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Inspect & Manage Role</span>
                </button>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
            <span className="font-mono">
              Page {paginated.currentPage} of {paginated.totalPages} ({paginated.totalMatched} users)
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={paginated.currentPage <= 1}
                className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 disabled:opacity-40 cursor-pointer flex items-center gap-1"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </button>
              <button
                onClick={() => setPage(p => Math.min(paginated.totalPages, p + 1))}
                disabled={paginated.currentPage >= paginated.totalPages}
                className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 disabled:opacity-40 cursor-pointer flex items-center gap-1"
              >
                <span>Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </>
      )}

      {/* Individual User Inspection & Role Control Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-white/15 p-6 space-y-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-heading text-xl font-extrabold text-white">
                    {selectedUser.name}
                  </h3>
                  <RoleBadge role={selectedUser.role} />
                  <StatusBadge status={selectedUser.accountStatus} />
                  {isRootOwnerEmail(selectedUser.email) && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase">
                      Protected Owner
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 mt-1">{selectedUser.email}</p>
                <div className="flex items-center gap-2 text-[11px] font-mono text-slate-500 mt-1">
                  <span>UID: {selectedUser.uid}</span>
                  <button
                    onClick={() => handleCopyUid(selectedUser.uid)}
                    className="text-slate-400 hover:text-white cursor-pointer"
                  >
                    {copiedUid === selectedUser.uid ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </div>
              <button
                onClick={() => setSelectedUserUid(null)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Metadata Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-900/70 border border-white/5">
                <div className="text-[10px] uppercase text-slate-500">Registration Date</div>
                <div className="font-mono text-slate-200 mt-0.5">
                  {formatDateTime(selectedUser.createdAt)}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/70 border border-white/5">
                <div className="text-[10px] uppercase text-slate-500">Last Login</div>
                <div className="font-mono text-slate-200 mt-0.5">
                  {getLastLoginDisplay(selectedUser)}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/70 border border-white/5">
                <div className="text-[10px] uppercase text-slate-500">Teacher Approval Status</div>
                <div className="mt-1">
                  <TeacherApprovalBadge status={selectedUser.teacherApprovalStatus} />
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/70 border border-white/5">
                <div className="text-[10px] uppercase text-slate-500">Educator Details</div>
                <div className="text-slate-300 mt-0.5">
                  {selectedUser.specialization || selectedUser.qualification
                    ? `${selectedUser.specialization || 'General'} • ${selectedUser.qualification || ''}`
                    : 'Standard candidate account'}
                </div>
              </div>
            </div>

            {/* Manual Role Actions */}
            <div className="space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Manual Role Assignment
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {getAvailableRoleActionsForUser(selectedUser).map(action => {
                  const isHighRisk = action.requiresExplicitAdminConfirm;
                  return (
                    <button
                      key={action.id}
                      onClick={() => openRoleConfirmation(selectedUser, action)}
                      className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                        isHighRisk
                          ? 'bg-purple-500/10 hover:bg-purple-500/20 border-purple-500/30 text-purple-200'
                          : 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs">{action.label}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-[#FF8C32]" />
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1">{action.description}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Account Status Management */}
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="text-xs font-bold text-white">Account Access Status</div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {selectedUser.accountStatus === 'Suspended'
                    ? 'Account is currently suspended from all protected panels and exam actions.'
                    : 'Suspend account immediately to revoke protected panel and assessment access.'}
                </p>
              </div>
              {selectedUser.accountStatus === 'Suspended' ? (
                <button
                  onClick={() => {
                    setPendingStatusChange({ user: selectedUser, newStatus: 'Active' });
                    setStatusReason('');
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shrink-0 cursor-pointer transition"
                >
                  Reactivate Account
                </button>
              ) : (
                <button
                  onClick={() => {
                    setPendingStatusChange({ user: selectedUser, newStatus: 'Suspended' });
                    setStatusReason('');
                  }}
                  className="px-4 py-2 rounded-xl bg-rose-950/60 hover:bg-rose-900/80 text-rose-200 border border-rose-500/40 text-xs font-bold shrink-0 cursor-pointer transition"
                >
                  Suspend User
                </button>
              )}
            </div>

            {/* Separate Destructive Permanent Deletion */}
            <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/30 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-rose-300">
                <Trash2 className="w-4 h-4" />
                <span>Destructive Action: Permanent Account Deletion</span>
              </div>
              <p className="text-[11px] text-rose-200/80">
                Deletes the user profile while retaining authored tests and historical exam attempts for institutional integrity. Protected owner and last active Admin accounts cannot be deleted.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="text"
                  value={deleteReason}
                  onChange={e => setDeleteReason(e.target.value)}
                  placeholder="Optional deletion reason..."
                  className="px-3 py-2 bg-slate-950/70 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500"
                />
                <input
                  type="text"
                  value={deleteConfirmText}
                  onChange={e => setDeleteConfirmText(e.target.value)}
                  placeholder='Type "DELETE" to enable'
                  className="px-3 py-2 bg-slate-950/70 border border-rose-500/30 rounded-xl text-xs text-white placeholder-slate-500 font-mono"
                />
              </div>
              <button
                onClick={() => handlePermanentDelete(selectedUser)}
                disabled={submittingAction || deleteConfirmText.trim() !== 'DELETE'}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-40 text-white text-xs font-bold cursor-pointer transition"
              >
                Permanently Delete Account
              </button>
            </div>

            {/* User-Specific Audit History */}
            <div className="space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Recent Audit Logs for This User
              </div>
              {selectedUserAuditLogs.length === 0 ? (
                <div className="text-xs text-slate-500 p-3 rounded-xl bg-white/5">
                  No role or status audit entries recorded for this user yet.
                </div>
              ) : (
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {selectedUserAuditLogs.slice(0, 6).map(log => (
                    <div
                      key={log.id}
                      className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-[11px] flex items-center justify-between gap-2"
                    >
                      <div>
                        <span className="font-bold text-white">{log.action}</span>
                        {log.previousRole && log.newRole && (
                          <span className="ml-2 font-mono text-[#FF8C32]">
                            ({log.previousRole} → {log.newRole})
                          </span>
                        )}
                        {log.reason && <div className="text-slate-400">Reason: {log.reason}</div>}
                      </div>
                      <span className="font-mono text-[10px] text-slate-500 shrink-0">
                        {formatDateTime(log.timestamp)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Role Change Confirmation Modal */}
      {pendingRoleChange && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-md rounded-3xl border border-[#FF8C32]/40 p-6 space-y-5 shadow-2xl">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-[#FF8C32]/20 border border-[#FF8C32]/40 flex items-center justify-center text-[#FF8C32]">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading text-lg font-extrabold text-white">
                    Confirm Role Change
                  </h3>
                  <p className="text-[11px] text-slate-400">{pendingRoleChange.action.label}</p>
                </div>
              </div>
              <button
                onClick={() => setPendingRoleChange(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/10 space-y-2 text-xs">
              <div className="font-bold text-white">{pendingRoleChange.user.name}</div>
              <div className="text-slate-400">{pendingRoleChange.user.email}</div>
              <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                <RoleBadge role={pendingRoleChange.user.role} />
                <ArrowRight className="w-4 h-4 text-[#FF8C32]" />
                <RoleBadge role={pendingRoleChange.action.targetRole} />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-300 block">
                Audit Reason (Optional)
              </label>
              <input
                type="text"
                value={roleChangeReason}
                onChange={e => setRoleChangeReason(e.target.value)}
                placeholder="Reason for role modification..."
                className="w-full px-3.5 py-2.5 bg-slate-900/70 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#FF8C32]"
              />
            </div>

            {(pendingRoleChange.user.role === 'admin' ||
              pendingRoleChange.action.targetRole === 'admin') && (
              <label className="flex items-start gap-2.5 p-3 rounded-xl bg-purple-500/10 border border-purple-500/30 text-xs text-purple-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={adminConfirmChecked}
                  onChange={e => setAdminConfirmChecked(e.target.checked)}
                  className="mt-0.5 accent-[#FF8C32]"
                />
                <span>
                  <strong className="text-white block">Explicit Admin Authority Confirmation</strong>
                  I confirm granting or removing full Administrator privileges for this account.
                </span>
              </label>
            )}

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                onClick={() => setPendingRoleChange(null)}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRoleChange}
                disabled={
                  submittingAction ||
                  ((pendingRoleChange.user.role === 'admin' ||
                    pendingRoleChange.action.targetRole === 'admin') &&
                    !adminConfirmChecked)
                }
                className="px-5 py-2 rounded-xl bg-[#FF8C32] hover:bg-orange-400 disabled:opacity-40 text-slate-950 text-xs font-extrabold cursor-pointer transition"
              >
                {submittingAction ? 'Applying...' : 'Confirm Role Update'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Account Status Change Confirmation Modal */}
      {pendingStatusChange && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-md rounded-3xl border border-rose-500/40 p-6 space-y-5 shadow-2xl">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-300">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading text-lg font-extrabold text-white">
                    {pendingStatusChange.newStatus === 'Suspended'
                      ? 'Suspend User Account'
                      : 'Reactivate User Account'}
                  </h3>
                  <p className="text-[11px] text-slate-400">{pendingStatusChange.user.email}</p>
                </div>
              </div>
              <button
                onClick={() => setPendingStatusChange(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-300 block">
                Reason (Recorded in Audit Log)
              </label>
              <input
                type="text"
                value={statusReason}
                onChange={e => setStatusReason(e.target.value)}
                placeholder="Enter administrative reason..."
                className="w-full px-3.5 py-2.5 bg-slate-900/70 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setPendingStatusChange(null)}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmStatusChange}
                disabled={submittingAction}
                className={`px-5 py-2 rounded-xl text-xs font-extrabold cursor-pointer transition ${
                  pendingStatusChange.newStatus === 'Suspended'
                    ? 'bg-rose-600 hover:bg-rose-500 text-white'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                }`}
              >
                {submittingAction
                  ? 'Updating...'
                  : pendingStatusChange.newStatus === 'Suspended'
                  ? 'Confirm Suspension'
                  : 'Confirm Reactivation'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
