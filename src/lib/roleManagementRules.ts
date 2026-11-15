import type { TeacherProfile, UserAccount, UserRole } from '../types/quiz';

export const ROOT_OWNER_EMAIL = 'sandeepgarg6375494692@gmail.com';

export type RoleActionId =
  | 'make_student'
  | 'make_teacher'
  | 'make_admin'
  | 'teacher_to_student'
  | 'admin_to_student'
  | 'admin_to_teacher'
  | 'remove_teacher'
  | 'remove_admin';

export interface RoleActionDefinition {
  id: RoleActionId;
  label: string;
  targetRole: UserRole;
  requiresExplicitAdminConfirm: boolean;
  description: string;
}

export const ROLE_ACTIONS: Record<RoleActionId, RoleActionDefinition> = {
  make_student: {
    id: 'make_student',
    label: 'Make Student',
    targetRole: 'student',
    requiresExplicitAdminConfirm: false,
    description: 'Assign standard Student role (Student Panel only).'
  },
  make_teacher: {
    id: 'make_teacher',
    label: 'Make Teacher',
    targetRole: 'teacher',
    requiresExplicitAdminConfirm: false,
    description: 'Grant Educator privileges (Student + Teacher Panels).'
  },
  make_admin: {
    id: 'make_admin',
    label: 'Make Admin',
    targetRole: 'admin',
    requiresExplicitAdminConfirm: true,
    description: 'Grant full Administrative authority (Admin, Teacher & Student Panels).'
  },
  teacher_to_student: {
    id: 'teacher_to_student',
    label: 'Change Teacher to Student',
    targetRole: 'student',
    requiresExplicitAdminConfirm: false,
    description: 'Demote Educator to Student and revoke Teacher Panel access.'
  },
  admin_to_student: {
    id: 'admin_to_student',
    label: 'Change Admin to Student',
    targetRole: 'student',
    requiresExplicitAdminConfirm: true,
    description: 'Revoke Admin and Teacher privileges; revert user to Student.'
  },
  admin_to_teacher: {
    id: 'admin_to_teacher',
    label: 'Change Admin to Teacher',
    targetRole: 'teacher',
    requiresExplicitAdminConfirm: true,
    description: 'Revoke Admin Panel authority while keeping Educator (Teacher) access.'
  },
  remove_teacher: {
    id: 'remove_teacher',
    label: 'Remove Teacher Privileges',
    targetRole: 'student',
    requiresExplicitAdminConfirm: false,
    description: 'Revoke Teacher Panel access and keep Student Panel access.'
  },
  remove_admin: {
    id: 'remove_admin',
    label: 'Remove Admin Privileges',
    targetRole: 'student',
    requiresExplicitAdminConfirm: true,
    description: 'Revoke Administrative control and revert account to Student.'
  }
};

export interface UserManagementStats {
  totalUsers: number;
  totalStudents: number;
  totalTeachers: number;
  totalAdmins: number;
  pendingTeacherRequests: number;
  suspendedUsers: number;
}

export function computeUserManagementStats(
  users: UserAccount[],
  teachers: TeacherProfile[] = []
): UserManagementStats {
  const userIdsWithPendingFlag = new Set(
    users.filter(u => u.teacherApprovalStatus === 'Pending').map(u => u.uid)
  );
  teachers.forEach(t => {
    if (t.status === 'Pending') {
      userIdsWithPendingFlag.add(t.id);
    }
  });

  return {
    totalUsers: users.length,
    totalStudents: users.filter(u => u.role === 'student').length,
    totalTeachers: users.filter(u => u.role === 'teacher').length,
    totalAdmins: users.filter(u => u.role === 'admin').length,
    pendingTeacherRequests: userIdsWithPendingFlag.size,
    suspendedUsers: users.filter(u => u.accountStatus === 'Suspended').length
  };
}

export type DirectoryRoleFilter = 'all' | 'student' | 'teacher' | 'admin' | 'pending';
export type DirectoryStatusFilter = 'all' | 'Active' | 'Suspended';
export type DirectorySortOrder = 'newest' | 'oldest';

export interface UserDirectoryQueryOptions {
  searchQuery?: string;
  roleFilter?: DirectoryRoleFilter;
  statusFilter?: DirectoryStatusFilter;
  sortOrder?: DirectorySortOrder;
  page?: number;
  pageSize?: number;
}

export interface PaginatedUsersResult {
  items: UserAccount[];
  totalMatched: number;
  totalPages: number;
  currentPage: number;
}

export function filterSortPaginateUsers(
  users: UserAccount[],
  options: UserDirectoryQueryOptions
): PaginatedUsersResult {
  const q = (options.searchQuery || '').trim().toLowerCase();
  const roleFilter = options.roleFilter || 'all';
  const statusFilter = options.statusFilter || 'all';
  const sortOrder = options.sortOrder || 'newest';
  const pageSize = Math.max(1, options.pageSize || 10);

  const filtered = users.filter(u => {
    const matchesSearch =
      !q ||
      (u.name || '').toLowerCase().includes(q) ||
      (u.displayName || '').toLowerCase().includes(q) ||
      (u.email || '').toLowerCase().includes(q) ||
      (u.uid || '').toLowerCase().includes(q);

    const matchesRole =
      roleFilter === 'all' ||
      (roleFilter === 'pending'
        ? u.teacherApprovalStatus === 'Pending'
        : u.role === roleFilter);

    const status = u.accountStatus || 'Active';
    const matchesStatus = statusFilter === 'all' || status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  filtered.sort((a, b) => {
    const aMs = new Date(a.createdAt || 0).getTime() || 0;
    const bMs = new Date(b.createdAt || 0).getTime() || 0;
    return sortOrder === 'newest' ? bMs - aMs : aMs - bMs;
  });

  const totalMatched = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalMatched / pageSize));
  const currentPage = Math.min(Math.max(1, options.page || 1), totalPages);
  const start = (currentPage - 1) * pageSize;

  return {
    items: filtered.slice(start, start + pageSize),
    totalMatched,
    totalPages,
    currentPage
  };
}

export function getAvailableRoleActionsForUser(user: UserAccount): RoleActionDefinition[] {
  const actions: RoleActionDefinition[] = [];
  if (user.role === 'student') {
    actions.push(ROLE_ACTIONS.make_teacher, ROLE_ACTIONS.make_admin);
    if (user.teacherApprovalStatus === 'Pending' || user.teacherApprovalStatus === 'Approved') {
      actions.push(ROLE_ACTIONS.remove_teacher);
    }
  } else if (user.role === 'teacher') {
    actions.push(
      ROLE_ACTIONS.teacher_to_student,
      ROLE_ACTIONS.remove_teacher,
      ROLE_ACTIONS.make_admin
    );
  } else if (user.role === 'admin') {
    actions.push(
      ROLE_ACTIONS.admin_to_teacher,
      ROLE_ACTIONS.admin_to_student,
      ROLE_ACTIONS.remove_admin
    );
  }
  return actions;
}

export function isRootOwnerEmail(email?: string | null): boolean {
  return (email || '').trim().toLowerCase() === ROOT_OWNER_EMAIL;
}

export function countActiveAdmins(users: UserAccount[]): number {
  return users.filter(u => u.role === 'admin' && (u.accountStatus || 'Active') !== 'Suspended').length;
}

export interface RoleValidationResult {
  allowed: boolean;
  error?: string;
  httpStatus?: number;
}

export function validateRoleChangeRequest(params: {
  caller: { uid: string; email?: string | null; role?: string | null; accountStatus?: string | null; emailVerified?: boolean };
  target: UserAccount;
  newRole: UserRole;
  allUsers: UserAccount[];
  confirmAdminPrivilegeChange?: boolean;
}): RoleValidationResult {
  const { caller, target, newRole, allUsers, confirmAdminPrivilegeChange } = params;

  const callerIsOwner = isRootOwnerEmail(caller.email) && caller.emailVerified !== false;
  const callerIsActiveAdmin =
    callerIsOwner || (caller.role === 'admin' && (caller.accountStatus || 'Active') !== 'Suspended');

  if (!callerIsActiveAdmin) {
    return {
      allowed: false,
      httpStatus: 403,
      error: 'Forbidden: Only active verified Administrators can change user roles.'
    };
  }

  if (newRole !== 'student' && newRole !== 'teacher' && newRole !== 'admin') {
    return {
      allowed: false,
      httpStatus: 400,
      error: 'Invalid target role. Allowed values: student, teacher, admin.'
    };
  }

  const involvesAdminPrivilege = target.role === 'admin' || newRole === 'admin';
  if (involvesAdminPrivilege && confirmAdminPrivilegeChange !== true) {
    return {
      allowed: false,
      httpStatus: 400,
      error: 'Explicit confirmation is required before granting or removing Admin privileges.'
    };
  }

  // Owner-level recovery protection: non-owners cannot alter the root owner's admin role
  if (isRootOwnerEmail(target.email) && newRole !== 'admin' && !callerIsOwner) {
    return {
      allowed: false,
      httpStatus: 403,
      error: 'Protected Account: Secondary admins cannot remove Admin privileges from the platform owner.'
    };
  }

  // Last active admin protection: never leave zero active admins
  if (target.role === 'admin' && newRole !== 'admin') {
    const remainingActiveAdmins = allUsers.filter(
      u => u.uid !== target.uid && u.role === 'admin' && (u.accountStatus || 'Active') !== 'Suspended'
    );
    if (remainingActiveAdmins.length === 0) {
      return {
        allowed: false,
        httpStatus: 409,
        error: 'Safeguard Blocked: Cannot demote or remove the last active Administrator.'
      };
    }
  }

  return { allowed: true };
}

export function validateStatusChangeRequest(params: {
  caller: { uid: string; email?: string | null; role?: string | null; accountStatus?: string | null; emailVerified?: boolean };
  target: UserAccount;
  newStatus: 'Active' | 'Suspended';
  allUsers: UserAccount[];
}): RoleValidationResult {
  const { caller, target, newStatus, allUsers } = params;

  const callerIsOwner = isRootOwnerEmail(caller.email) && caller.emailVerified !== false;
  const callerIsActiveAdmin =
    callerIsOwner || (caller.role === 'admin' && (caller.accountStatus || 'Active') !== 'Suspended');

  if (!callerIsActiveAdmin) {
    return {
      allowed: false,
      httpStatus: 403,
      error: 'Forbidden: Only active verified Administrators can suspend or reactivate accounts.'
    };
  }

  if (newStatus !== 'Active' && newStatus !== 'Suspended') {
    return {
      allowed: false,
      httpStatus: 400,
      error: 'Invalid account status. Allowed values: Active, Suspended.'
    };
  }

  if (newStatus === 'Suspended') {
    if (caller.uid === target.uid) {
      return {
        allowed: false,
        httpStatus: 409,
        error: 'Safeguard Blocked: Administrators cannot suspend their own active session.'
      };
    }

    if (isRootOwnerEmail(target.email)) {
      return {
        allowed: false,
        httpStatus: 403,
        error: 'Protected Account: The platform owner recovery account cannot be suspended.'
      };
    }

    if (target.role === 'admin') {
      const remainingActiveAdmins = allUsers.filter(
        u => u.uid !== target.uid && u.role === 'admin' && (u.accountStatus || 'Active') !== 'Suspended'
      );
      if (remainingActiveAdmins.length === 0) {
        return {
          allowed: false,
          httpStatus: 409,
          error: 'Safeguard Blocked: Cannot suspend the last active Administrator.'
        };
      }
    }
  }

  return { allowed: true };
}

export function canAccessPanel(params: {
  isAuthenticated: boolean;
  verifiedRole: UserRole | null;
  accountStatus?: 'Active' | 'Suspended' | null;
  teacherStatus?: 'Approved' | 'Pending' | 'Rejected' | 'Suspended' | null;
  panel: 'student' | 'teacher' | 'admin';
}): { allowed: boolean; reason?: 'unauthenticated' | 'suspended' | 'pending_teacher' | 'forbidden' } {
  const { isAuthenticated, verifiedRole, accountStatus, teacherStatus, panel } = params;

  if (!isAuthenticated) {
    return { allowed: false, reason: 'unauthenticated' };
  }

  if (accountStatus === 'Suspended') {
    return { allowed: false, reason: 'suspended' };
  }

  if (panel === 'admin') {
    return verifiedRole === 'admin'
      ? { allowed: true }
      : { allowed: false, reason: 'forbidden' };
  }

  if (panel === 'teacher') {
    if (verifiedRole === 'admin') return { allowed: true };
    if (verifiedRole === 'teacher' && teacherStatus === 'Approved') return { allowed: true };
    if (teacherStatus === 'Pending') return { allowed: false, reason: 'pending_teacher' };
    return { allowed: false, reason: 'forbidden' };
  }

  // student panel
  if (verifiedRole === 'student' || verifiedRole === 'teacher' || verifiedRole === 'admin') {
    return { allowed: true };
  }

  return { allowed: false, reason: 'forbidden' };
}
