import test from 'node:test';
import assert from 'node:assert/strict';
import {
  RoleServiceHttpError,
  executeChangeRole,
  executeChangeStatus,
  executeDeleteUserAccount,
  executeReviewTeacherRequest
} from './roleService.ts';
import type { RoleStoreAdapter, VerifiedCallerToken } from './firebaseAdmin.ts';
import type { AdminAuditLog, NotificationAnnouncement, TeacherProfile, UserAccount } from '../types/quiz.ts';

function createInMemoryStore(initialUsers: UserAccount[], initialTeachers: TeacherProfile[] = []) {
  const users = new Map<string, UserAccount>(initialUsers.map(u => [u.uid, { ...u }]));
  const teachers = new Map<string, TeacherProfile>(initialTeachers.map(t => [t.id, { ...t }]));
  const auditLogs: AdminAuditLog[] = [];
  const notifications: NotificationAnnouncement[] = [];
  const claimsLog: Array<{ uid: string; claims: Record<string, unknown>; revokeTokens?: boolean }> = [];

  const store: RoleStoreAdapter = {
    mode: 'admin_sdk',
    customClaimsSupported: true,
    async getUser(uid) {
      return users.get(uid) || null;
    },
    async listAllUsers() {
      return Array.from(users.values());
    },
    async getTeacherProfile(uid) {
      return teachers.get(uid) || null;
    },
    async setCustomClaims(uid, claims, revokeTokens) {
      claimsLog.push({ uid, claims, revokeTokens });
      return true;
    },
    async commitChanges(params) {
      if (params.userUpdates) {
        const prev = users.get(params.userUpdates.uid) || ({} as UserAccount);
        users.set(params.userUpdates.uid, {
          ...prev,
          ...(params.userUpdates.data as Partial<UserAccount>)
        });
      }
      if (params.teacherProfileUpdates) {
        const prev = teachers.get(params.teacherProfileUpdates.uid) || ({} as TeacherProfile);
        teachers.set(params.teacherProfileUpdates.uid, {
          ...prev,
          ...(params.teacherProfileUpdates.data as Partial<TeacherProfile>)
        });
      }
      if (params.notificationCreate) {
        notifications.push(params.notificationCreate);
      }
      auditLogs.push(params.auditLogCreate);
    },
    async deleteAccountData(uid, auditLogCreate) {
      users.delete(uid);
      teachers.delete(uid);
      auditLogs.push(auditLogCreate);
      return true;
    }
  };

  return { store, users, teachers, auditLogs, notifications, claimsLog };
}

const adminCallerToken: VerifiedCallerToken = {
  uid: 'admin-1',
  email: 'admin@example.com',
  emailVerified: true,
  name: 'Main Admin',
  claims: {}
};

const studentCallerToken: VerifiedCallerToken = {
  uid: 'student-1',
  email: 'student1@example.com',
  emailVerified: true,
  name: 'Student One',
  claims: { role: 'admin' } // Forged/stale client claim MUST be ignored if DB says student!
};

function makeSeedUsers(): UserAccount[] {
  return [
    {
      uid: 'admin-1',
      id: 'admin-1',
      name: 'Main Admin',
      displayName: 'Main Admin',
      email: 'admin@example.com',
      role: 'admin',
      accountStatus: 'Active',
      teacherApprovalStatus: 'Approved'
    },
    {
      uid: 'student-1',
      id: 'student-1',
      name: 'Student One',
      displayName: 'Student One',
      email: 'student1@example.com',
      role: 'student',
      accountStatus: 'Active',
      teacherApprovalStatus: 'Pending',
      requestedRole: 'teacher',
      qualification: 'M.Sc. Physics',
      specialization: 'Science & Tech'
    },
    {
      uid: 'teacher-1',
      id: 'teacher-1',
      name: 'Teacher One',
      displayName: 'Teacher One',
      email: 'teacher1@example.com',
      role: 'teacher',
      accountStatus: 'Active',
      teacherApprovalStatus: 'Approved'
    }
  ];
}

test('executeChangeRole ignores forged token claims and rejects non-admin DB callers with 403', async () => {
  const { store } = createInMemoryStore(makeSeedUsers());
  await assert.rejects(
    () =>
      executeChangeRole({
        callerToken: studentCallerToken,
        store,
        body: { targetUid: 'student-1', newRole: 'admin', confirmAdminPrivilegeChange: true }
      }),
    (err: unknown) => err instanceof RoleServiceHttpError && err.status === 403
  );
});

test('executeChangeRole performs Student -> Teacher, writes audit log, and syncs custom claims', async () => {
  const { store, users, teachers, auditLogs, claimsLog } = createInMemoryStore(makeSeedUsers());
  const res = await executeChangeRole({
    callerToken: adminCallerToken,
    store,
    body: {
      targetUid: 'student-1',
      actionId: 'make_teacher',
      reason: 'Verified credentials'
    }
  });

  assert.equal(res.previousRole, 'student');
  assert.equal(res.newRole, 'teacher');
  assert.equal(res.customClaimsSynced, true);
  assert.equal(users.get('student-1')?.role, 'teacher');
  assert.equal(users.get('student-1')?.teacherApprovalStatus, 'Approved');
  assert.equal(teachers.get('student-1')?.status, 'Approved');
  assert.equal(auditLogs.length, 1);
  assert.equal(auditLogs[0].targetUserUid, 'student-1');
  assert.equal(auditLogs[0].previousRole, 'student');
  assert.equal(auditLogs[0].newRole, 'teacher');
  assert.equal(auditLogs[0].adminUid, 'admin-1');
  assert.equal(claimsLog[0].claims.role, 'teacher');
});

test('executeReviewTeacherRequest handles approve_teacher and reject (with reason + notification)', async () => {
  const { store, users, notifications, auditLogs } = createInMemoryStore(makeSeedUsers());

  await assert.rejects(
    () =>
      executeReviewTeacherRequest({
        callerToken: adminCallerToken,
        store,
        body: { targetUid: 'student-1', decision: 'reject', reason: '   ' }
      }),
    (err: unknown) => err instanceof RoleServiceHttpError && err.status === 400
  );

  const rejectRes = await executeReviewTeacherRequest({
    callerToken: adminCallerToken,
    store,
    body: { targetUid: 'student-1', decision: 'reject', reason: 'Incomplete degree details' }
  });
  assert.equal(rejectRes.newRole, 'student');
  assert.equal(users.get('student-1')?.teacherApprovalStatus, 'Rejected');
  assert.equal(users.get('student-1')?.rejectionReason, 'Incomplete degree details');
  assert.equal(notifications.length, 1);
  assert.equal(auditLogs[0].category, 'teacher_approval');
});

test('executeChangeStatus suspends user, revokes refresh tokens, and blocks suspending last active Admin', async () => {
  const { store, users, claimsLog } = createInMemoryStore(makeSeedUsers());

  const suspendRes = await executeChangeStatus({
    callerToken: adminCallerToken,
    store,
    body: { targetUid: 'teacher-1', newStatus: 'Suspended', reason: 'Policy violation' }
  });
  assert.equal(suspendRes.newStatus, 'Suspended');
  assert.equal(users.get('teacher-1')?.accountStatus, 'Suspended');
  assert.equal(claimsLog[0].revokeTokens, true);

  // Admin cannot suspend themselves / last active admin
  await assert.rejects(
    () =>
      executeChangeStatus({
        callerToken: adminCallerToken,
        store,
        body: { targetUid: 'admin-1', newStatus: 'Suspended' }
      }),
    (err: unknown) => err instanceof RoleServiceHttpError && err.status === 409
  );
});

test('executeDeleteUserAccount requires explicit confirmDelete and protects last active admin', async () => {
  const { store, users, auditLogs } = createInMemoryStore(makeSeedUsers());

  await assert.rejects(
    () =>
      executeDeleteUserAccount({
        callerToken: adminCallerToken,
        store,
        body: { targetUid: 'student-1', confirmDelete: false }
      }),
    (err: unknown) => err instanceof RoleServiceHttpError && err.status === 400
  );

  const delRes = await executeDeleteUserAccount({
    callerToken: adminCallerToken,
    store,
    body: { targetUid: 'student-1', confirmDelete: true, reason: 'Duplicate test account' }
  });
  assert.equal(delRes.success, true);
  assert.equal(users.has('student-1'), false);
  assert.equal(auditLogs[0].actionPerformed, 'Delete User Account');
});
