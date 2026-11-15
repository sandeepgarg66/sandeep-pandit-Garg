import test from 'node:test';
import assert from 'node:assert/strict';
import {
  ROLE_ACTIONS,
  canAccessPanel,
  computeUserManagementStats,
  filterSortPaginateUsers,
  getAvailableRoleActionsForUser,
  validateRoleChangeRequest,
  validateStatusChangeRequest
} from './roleManagementRules.ts';
import type { TeacherProfile, UserAccount } from '../types/quiz.ts';

const OWNER_EMAIL = 'sandeepgarg6375494692@gmail.com';

const sampleUsers: UserAccount[] = [
  {
    uid: 'owner-1',
    id: 'owner-1',
    name: 'Sandeep Owner',
    displayName: 'Sandeep Owner',
    email: OWNER_EMAIL,
    role: 'admin',
    accountStatus: 'Active',
    teacherApprovalStatus: 'Approved',
    createdAt: '2026-01-01T10:00:00.000Z',
    updatedAt: '2026-01-01T10:00:00.000Z'
  },
  {
    uid: 'admin-2',
    id: 'admin-2',
    name: 'Secondary Admin',
    displayName: 'Secondary Admin',
    email: 'admin2@example.com',
    role: 'admin',
    accountStatus: 'Active',
    teacherApprovalStatus: 'Approved',
    createdAt: '2026-01-05T10:00:00.000Z',
    updatedAt: '2026-01-05T10:00:00.000Z'
  },
  {
    uid: 'teacher-1',
    id: 'teacher-1',
    name: 'Kakashi Sensei',
    displayName: 'Kakashi Sensei',
    email: 'kakashi@example.com',
    role: 'teacher',
    accountStatus: 'Active',
    teacherApprovalStatus: 'Approved',
    createdAt: '2026-01-10T10:00:00.000Z',
    updatedAt: '2026-01-10T10:00:00.000Z'
  },
  {
    uid: 'student-pending-1',
    id: 'student-pending-1',
    name: 'Iruka Applicant',
    displayName: 'Iruka Applicant',
    email: 'iruka@example.com',
    role: 'student',
    requestedRole: 'teacher',
    accountStatus: 'Active',
    teacherApprovalStatus: 'Pending',
    createdAt: '2026-02-01T10:00:00.000Z',
    updatedAt: '2026-02-01T10:00:00.000Z'
  },
  {
    uid: 'student-2',
    id: 'student-2',
    name: 'Naruto Uzumaki',
    displayName: 'Naruto Uzumaki',
    email: 'naruto@example.com',
    role: 'student',
    accountStatus: 'Suspended',
    teacherApprovalStatus: 'None',
    createdAt: '2026-02-02T10:00:00.000Z',
    updatedAt: '2026-02-02T10:00:00.000Z'
  }
];

const sampleTeachers: TeacherProfile[] = [
  {
    id: 'teacher-1',
    name: 'Kakashi Sensei',
    email: 'kakashi@example.com',
    photoURL: '',
    qualification: 'M.A. Polity',
    specialization: 'Polity',
    status: 'Approved',
    testsCreated: 3,
    joinedDate: '10 Jan 2026'
  },
  {
    id: 'student-pending-1',
    name: 'Iruka Applicant',
    email: 'iruka@example.com',
    photoURL: '',
    qualification: 'B.Ed',
    specialization: 'Science',
    status: 'Pending',
    testsCreated: 0,
    joinedDate: '01 Feb 2026'
  }
];

test('computeUserManagementStats calculates exact live counts across users and pending teachers', () => {
  const stats = computeUserManagementStats(sampleUsers, sampleTeachers);
  assert.equal(stats.totalUsers, 5);
  assert.equal(stats.totalStudents, 2);
  assert.equal(stats.totalTeachers, 1);
  assert.equal(stats.totalAdmins, 2);
  assert.equal(stats.pendingTeacherRequests, 1);
  assert.equal(stats.suspendedUsers, 1);
});

test('filterSortPaginateUsers searches by name/email/UID, filters roles/status, sorts, and paginates', () => {
  const byUid = filterSortPaginateUsers(sampleUsers, { searchQuery: 'student-pending-1' });
  assert.equal(byUid.totalMatched, 1);
  assert.equal(byUid.items[0].email, 'iruka@example.com');

  const pendingOnly = filterSortPaginateUsers(sampleUsers, { roleFilter: 'pending' });
  assert.equal(pendingOnly.totalMatched, 1);
  assert.equal(pendingOnly.items[0].role, 'student');

  const suspendedOnly = filterSortPaginateUsers(sampleUsers, { statusFilter: 'Suspended' });
  assert.equal(suspendedOnly.totalMatched, 1);
  assert.equal(suspendedOnly.items[0].uid, 'student-2');

  const oldestFirst = filterSortPaginateUsers(sampleUsers, {
    sortOrder: 'oldest',
    pageSize: 2,
    page: 1
  });
  assert.equal(oldestFirst.items.length, 2);
  assert.equal(oldestFirst.totalPages, 3);
  assert.equal(oldestFirst.items[0].uid, 'owner-1');
});

test('all 8 required role actions exist and map to valid roles', () => {
  assert.equal(Object.keys(ROLE_ACTIONS).length, 8);
  assert.equal(ROLE_ACTIONS.make_student.targetRole, 'student');
  assert.equal(ROLE_ACTIONS.make_teacher.targetRole, 'teacher');
  assert.equal(ROLE_ACTIONS.make_admin.targetRole, 'admin');
  assert.equal(ROLE_ACTIONS.teacher_to_student.targetRole, 'student');
  assert.equal(ROLE_ACTIONS.admin_to_student.targetRole, 'student');
  assert.equal(ROLE_ACTIONS.admin_to_teacher.targetRole, 'teacher');
  assert.equal(ROLE_ACTIONS.remove_teacher.targetRole, 'student');
  assert.equal(ROLE_ACTIONS.remove_admin.targetRole, 'student');
});

test('getAvailableRoleActionsForUser yields appropriate actions per current role', () => {
  const studentActions = getAvailableRoleActionsForUser(sampleUsers[3]).map(a => a.id);
  assert.ok(studentActions.includes('make_teacher'));
  assert.ok(studentActions.includes('make_admin'));
  assert.ok(studentActions.includes('remove_teacher'));

  const teacherActions = getAvailableRoleActionsForUser(sampleUsers[2]).map(a => a.id);
  assert.deepEqual(teacherActions, ['teacher_to_student', 'remove_teacher', 'make_admin']);

  const adminActions = getAvailableRoleActionsForUser(sampleUsers[1]).map(a => a.id);
  assert.deepEqual(adminActions, ['admin_to_teacher', 'admin_to_student', 'remove_admin']);
});

test('validateRoleChangeRequest blocks non-admins, requires explicit admin confirm, and protects root owner & last admin', () => {
  const nonAdminCaller = validateRoleChangeRequest({
    caller: { uid: 'student-2', email: 'naruto@example.com', role: 'student', accountStatus: 'Active' },
    target: sampleUsers[3],
    newRole: 'admin',
    allUsers: sampleUsers,
    confirmAdminPrivilegeChange: true
  });
  assert.equal(nonAdminCaller.allowed, false);
  assert.equal(nonAdminCaller.httpStatus, 403);

  const missingAdminConfirm = validateRoleChangeRequest({
    caller: { uid: 'owner-1', email: OWNER_EMAIL, role: 'admin', accountStatus: 'Active', emailVerified: true },
    target: sampleUsers[3],
    newRole: 'admin',
    allUsers: sampleUsers,
    confirmAdminPrivilegeChange: false
  });
  assert.equal(missingAdminConfirm.allowed, false);
  assert.equal(missingAdminConfirm.httpStatus, 400);

  const secondaryCannotDemoteOwner = validateRoleChangeRequest({
    caller: { uid: 'admin-2', email: 'admin2@example.com', role: 'admin', accountStatus: 'Active' },
    target: sampleUsers[0],
    newRole: 'student',
    allUsers: sampleUsers,
    confirmAdminPrivilegeChange: true
  });
  assert.equal(secondaryCannotDemoteOwner.allowed, false);
  assert.equal(secondaryCannotDemoteOwner.httpStatus, 403);

  const singleAdminUsers = [sampleUsers[0], sampleUsers[2]];
  const lastAdminBlocked = validateRoleChangeRequest({
    caller: { uid: 'owner-1', email: OWNER_EMAIL, role: 'admin', accountStatus: 'Active', emailVerified: true },
    target: sampleUsers[0],
    newRole: 'student',
    allUsers: singleAdminUsers,
    confirmAdminPrivilegeChange: true
  });
  assert.equal(lastAdminBlocked.allowed, false);
  assert.equal(lastAdminBlocked.httpStatus, 409);
});

test('validateStatusChangeRequest blocks self-suspend, owner-suspend, and last-active-admin suspend', () => {
  const selfSuspend = validateStatusChangeRequest({
    caller: { uid: 'admin-2', email: 'admin2@example.com', role: 'admin', accountStatus: 'Active' },
    target: sampleUsers[1],
    newStatus: 'Suspended',
    allUsers: sampleUsers
  });
  assert.equal(selfSuspend.allowed, false);

  const ownerSuspend = validateStatusChangeRequest({
    caller: { uid: 'admin-2', email: 'admin2@example.com', role: 'admin', accountStatus: 'Active' },
    target: sampleUsers[0],
    newStatus: 'Suspended',
    allUsers: sampleUsers
  });
  assert.equal(ownerSuspend.allowed, false);
  assert.equal(ownerSuspend.httpStatus, 403);

  const validSuspend = validateStatusChangeRequest({
    caller: { uid: 'owner-1', email: OWNER_EMAIL, role: 'admin', accountStatus: 'Active', emailVerified: true },
    target: sampleUsers[2],
    newStatus: 'Suspended',
    allUsers: sampleUsers
  });
  assert.equal(validSuspend.allowed, true);
});

test('canAccessPanel isolates Student, Pending Teacher, Approved Teacher, Admin, and Suspended accounts', () => {
  // Pending teacher gets Student Panel, NOT Teacher Panel or Admin Panel
  assert.deepEqual(
    canAccessPanel({
      isAuthenticated: true,
      verifiedRole: 'student',
      accountStatus: 'Active',
      teacherStatus: 'Pending',
      panel: 'student'
    }),
    { allowed: true }
  );
  assert.deepEqual(
    canAccessPanel({
      isAuthenticated: true,
      verifiedRole: 'student',
      accountStatus: 'Active',
      teacherStatus: 'Pending',
      panel: 'teacher'
    }),
    { allowed: false, reason: 'pending_teacher' }
  );
  assert.deepEqual(
    canAccessPanel({
      isAuthenticated: true,
      verifiedRole: 'student',
      accountStatus: 'Active',
      teacherStatus: 'Pending',
      panel: 'admin'
    }),
    { allowed: false, reason: 'forbidden' }
  );

  // Suspended user is blocked from all protected panels
  assert.deepEqual(
    canAccessPanel({
      isAuthenticated: true,
      verifiedRole: 'teacher',
      accountStatus: 'Suspended',
      teacherStatus: 'Approved',
      panel: 'student'
    }),
    { allowed: false, reason: 'suspended' }
  );

  // Approved teacher accesses Student + Teacher, NOT Admin
  assert.deepEqual(
    canAccessPanel({
      isAuthenticated: true,
      verifiedRole: 'teacher',
      accountStatus: 'Active',
      teacherStatus: 'Approved',
      panel: 'teacher'
    }),
    { allowed: true }
  );
  assert.deepEqual(
    canAccessPanel({
      isAuthenticated: true,
      verifiedRole: 'teacher',
      accountStatus: 'Active',
      teacherStatus: 'Approved',
      panel: 'admin'
    }),
    { allowed: false, reason: 'forbidden' }
  );
});
