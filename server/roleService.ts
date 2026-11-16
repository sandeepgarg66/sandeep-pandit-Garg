import type { AdminAuditLog, NotificationAnnouncement, UserAccount, UserRole } from '../src/types/quiz.ts';
import {
  ROLE_ACTIONS,
  isRootOwnerEmail,
  validateRoleChangeRequest,
  validateStatusChangeRequest,
  type RoleActionId
} from '../src/lib/roleManagementRules.ts';
import type { RoleStoreAdapter, VerifiedCallerToken } from './firebaseAdmin.ts';

export class RoleServiceHttpError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function resolveVerifiedCallerAdmin(
  callerToken: VerifiedCallerToken,
  store: RoleStoreAdapter
): Promise<{
  uid: string;
  email: string | null;
  name: string;
  role: string | null;
  accountStatus: string;
}> {
  const callerRecord = await store.getUser(callerToken.uid);
  const callerIsOwner = isRootOwnerEmail(callerToken.email) && callerToken.emailVerified;

  // Never trust client-provided role fields or unsigned requests; check trusted server/DB state
  const authoritativeRole = callerIsOwner ? 'admin' : callerRecord?.role || null;
  const authoritativeStatus = callerRecord?.accountStatus || 'Active';

  if (authoritativeRole !== 'admin' || authoritativeStatus === 'Suspended') {
    throw new RoleServiceHttpError(
      403,
      'Forbidden: Active verified Administrator credentials are required for this operation.'
    );
  }

  return {
    uid: callerToken.uid,
    email: callerToken.email,
    name: callerRecord?.displayName || callerRecord?.name || callerToken.name || callerToken.email || 'Admin',
    role: authoritativeRole,
    accountStatus: authoritativeStatus
  };
}

export async function resolveVerifiedEducator(
  callerToken: VerifiedCallerToken,
  store: RoleStoreAdapter
): Promise<{
  uid: string;
  email: string | null;
  name: string;
  role: 'admin' | 'teacher';
  accountStatus: string;
}> {
  const callerRecord = await store.getUser(callerToken.uid);
  const callerIsOwner = isRootOwnerEmail(callerToken.email) && callerToken.emailVerified;

  if (callerIsOwner) {
    return {
      uid: callerToken.uid,
      email: callerToken.email,
      name: callerRecord?.displayName || callerRecord?.name || callerToken.name || 'Owner Admin',
      role: 'admin',
      accountStatus: 'Active'
    };
  }

  const authoritativeStatus = callerRecord?.accountStatus || 'Active';
  if (authoritativeStatus === 'Suspended') {
    throw new RoleServiceHttpError(
      403,
      'Account Suspended: Your account is currently suspended. / आपका खाता निलंबित है।'
    );
  }

  const role = callerRecord?.role || null;
  if (role === 'admin') {
    return {
      uid: callerToken.uid,
      email: callerToken.email,
      name: callerRecord?.displayName || callerRecord?.name || callerToken.name || 'Admin',
      role: 'admin',
      accountStatus: authoritativeStatus
    };
  }

  if (role === 'teacher') {
    let teacherProfileStatus = callerRecord?.teacherApprovalStatus || 'Pending';
    if (teacherProfileStatus !== 'Approved') {
      const teacherProfile = await store.getTeacherProfile(callerToken.uid);
      if (teacherProfile?.status) {
        teacherProfileStatus = teacherProfile.status;
      }
    }
    if (teacherProfileStatus === 'Approved') {
      return {
        uid: callerToken.uid,
        email: callerToken.email,
        name: callerRecord?.displayName || callerRecord?.name || callerToken.name || 'Educator',
        role: 'teacher',
        accountStatus: authoritativeStatus
      };
    }
  }

  throw new RoleServiceHttpError(
    403,
    'Forbidden: Active, Admin-approved Teacher or Admin access is required. / केवल सक्रिय और स्वीकृत शिक्षक या एडमिन ही यह सुविधा उपयोग कर सकते हैं।'
  );
}

function buildAuditId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
}

export async function executeChangeRole(params: {
  callerToken: VerifiedCallerToken;
  store: RoleStoreAdapter;
  body: {
    targetUid?: string;
    newRole?: UserRole;
    actionId?: RoleActionId;
    reason?: string;
    confirmAdminPrivilegeChange?: boolean;
  };
  ipAddress?: string;
}): Promise<{
  success: true;
  targetUid: string;
  previousRole: UserRole;
  newRole: UserRole;
  customClaimsSynced: boolean;
  auditLog: AdminAuditLog;
}> {
  const { callerToken, store, body, ipAddress } = params;
  const caller = await resolveVerifiedCallerAdmin(callerToken, store);

  const targetUid = (body.targetUid || '').trim();
  const actionDef = body.actionId ? ROLE_ACTIONS[body.actionId] : undefined;
  const requestedRole = (actionDef?.targetRole || body.newRole) as UserRole;

  if (!targetUid) {
    throw new RoleServiceHttpError(400, 'Target user UID is required.');
  }

  const allUsers = await store.listAllUsers();
  const target = allUsers.find(u => u.uid === targetUid);
  if (!target) {
    throw new RoleServiceHttpError(404, 'Target user account does not exist.');
  }

  const validation = validateRoleChangeRequest({
    caller: {
      uid: caller.uid,
      email: caller.email,
      role: caller.role,
      accountStatus: caller.accountStatus,
      emailVerified: callerToken.emailVerified
    },
    target,
    newRole: requestedRole,
    allUsers,
    confirmAdminPrivilegeChange: body.confirmAdminPrivilegeChange
  });

  if (!validation.allowed) {
    throw new RoleServiceHttpError(validation.httpStatus || 403, validation.error || 'Role change denied.');
  }

  const nowIso = new Date().toISOString();
  const previousRole = target.role;
  const actionLabel = actionDef?.label || `Changed Role (${previousRole} -> ${requestedRole})`;

  // Sync teacherApprovalStatus cleanly
  let nextTeacherApprovalStatus = target.teacherApprovalStatus;
  let teacherProfileUpdates: { uid: string; data: Record<string, unknown> } | undefined;

  if (requestedRole === 'teacher') {
    nextTeacherApprovalStatus = 'Approved';
    const existingTeacher = await store.getTeacherProfile(targetUid);
    teacherProfileUpdates = {
      uid: targetUid,
      data: {
        id: targetUid,
        name: target.displayName || target.name || 'Educator',
        email: target.email || '',
        photoURL: target.photoURL || '',
        qualification: existingTeacher?.qualification || target.qualification || 'Verified Educator',
        specialization: existingTeacher?.specialization || target.specialization || 'General Studies & CSAT',
        status: 'Approved',
        testsCreated: existingTeacher?.testsCreated || 0,
        joinedDate: existingTeacher?.joinedDate || new Date().toLocaleDateString('en-GB'),
        approvedBy: caller.uid,
        approvedAt: nowIso
      }
    };
  } else if (previousRole === 'teacher' && requestedRole === 'student') {
    nextTeacherApprovalStatus = 'None';
    const existingTeacher = await store.getTeacherProfile(targetUid);
    if (existingTeacher) {
      teacherProfileUpdates = {
        uid: targetUid,
        data: {
          id: targetUid,
          name: existingTeacher.name || target.displayName || target.name,
          email: existingTeacher.email || target.email,
          status: 'Suspended'
        }
      };
    }
  } else if (body.actionId === 'remove_teacher') {
    nextTeacherApprovalStatus = 'None';
    const existingTeacher = await store.getTeacherProfile(targetUid);
    if (existingTeacher) {
      teacherProfileUpdates = {
        uid: targetUid,
        data: {
          id: targetUid,
          name: existingTeacher.name || target.displayName || target.name,
          email: existingTeacher.email || target.email,
          status: 'Suspended'
        }
      };
    }
  }

  const userUpdatesData: Record<string, unknown> = {
    uid: targetUid,
    id: targetUid,
    email: target.email,
    role: requestedRole,
    teacherApprovalStatus: nextTeacherApprovalStatus,
    updatedAt: nowIso
  };

  if (requestedRole === 'teacher') {
    userUpdatesData.approvedBy = caller.uid;
    userUpdatesData.approvedAt = nowIso;
  }

  const auditLog: AdminAuditLog = {
    id: buildAuditId('log-role'),
    timestamp: nowIso,
    actor: `${caller.name} (Admin)`,
    actorRole: 'Admin',
    action: `${actionLabel}: ${previousRole} -> ${requestedRole}`,
    target: `${target.email || target.name} (${targetUid})`,
    status: requestedRole === 'admin' || previousRole === 'admin' ? 'Warning' : 'Success',
    ipAddress: ipAddress || 'Server Gateway',
    targetUserUid: targetUid,
    previousRole,
    newRole: requestedRole,
    actionPerformed: actionLabel,
    adminUid: caller.uid,
    reason: body.reason?.trim() || undefined,
    category: 'role_management'
  };

  await store.commitChanges({
    userUpdates: { uid: targetUid, data: userUpdatesData },
    teacherProfileUpdates,
    auditLogCreate: auditLog
  });

  const shouldRevokeTokens =
    (previousRole === 'admin' && requestedRole !== 'admin') ||
    (previousRole === 'teacher' && requestedRole === 'student');

  const customClaimsSynced = await store.setCustomClaims(
    targetUid,
    {
      role: requestedRole,
      admin: requestedRole === 'admin',
      accountStatus: target.accountStatus || 'Active'
    },
    shouldRevokeTokens
  );

  return {
    success: true,
    targetUid,
    previousRole,
    newRole: requestedRole,
    customClaimsSynced,
    auditLog
  };
}

export async function executeChangeStatus(params: {
  callerToken: VerifiedCallerToken;
  store: RoleStoreAdapter;
  body: {
    targetUid?: string;
    newStatus?: 'Active' | 'Suspended';
    reason?: string;
  };
  ipAddress?: string;
}): Promise<{
  success: true;
  targetUid: string;
  newStatus: 'Active' | 'Suspended';
  customClaimsSynced: boolean;
  auditLog: AdminAuditLog;
}> {
  const { callerToken, store, body, ipAddress } = params;
  const caller = await resolveVerifiedCallerAdmin(callerToken, store);

  const targetUid = (body.targetUid || '').trim();
  const newStatus = body.newStatus;
  if (!targetUid || (newStatus !== 'Active' && newStatus !== 'Suspended')) {
    throw new RoleServiceHttpError(400, 'Target UID and valid status (Active or Suspended) are required.');
  }

  const allUsers = await store.listAllUsers();
  const target = allUsers.find(u => u.uid === targetUid);
  if (!target) {
    throw new RoleServiceHttpError(404, 'Target user account not found.');
  }

  const validation = validateStatusChangeRequest({
    caller: {
      uid: caller.uid,
      email: caller.email,
      role: caller.role,
      accountStatus: caller.accountStatus,
      emailVerified: callerToken.emailVerified
    },
    target,
    newStatus,
    allUsers
  });

  if (!validation.allowed) {
    throw new RoleServiceHttpError(validation.httpStatus || 403, validation.error || 'Status update denied.');
  }

  const nowIso = new Date().toISOString();
  const auditLog: AdminAuditLog = {
    id: buildAuditId('log-status'),
    timestamp: nowIso,
    actor: `${caller.name} (Admin)`,
    actorRole: 'Admin',
    action: `${newStatus === 'Suspended' ? 'Suspended' : 'Reactivated'} User Account`,
    target: `${target.email || target.name} (${targetUid})`,
    status: newStatus === 'Suspended' ? 'Warning' : 'Success',
    ipAddress: ipAddress || 'Server Gateway',
    targetUserUid: targetUid,
    previousRole: target.role,
    newRole: target.role,
    actionPerformed: newStatus === 'Suspended' ? 'Suspend User' : 'Reactivate User',
    adminUid: caller.uid,
    reason: body.reason?.trim() || undefined,
    category: 'account_status'
  };

  let teacherProfileUpdates: { uid: string; data: Record<string, unknown> } | undefined;
  if (target.role === 'teacher') {
    const existingTeacher = await store.getTeacherProfile(targetUid);
    if (existingTeacher) {
      teacherProfileUpdates = {
        uid: targetUid,
        data: {
          id: targetUid,
          name: existingTeacher.name,
          email: existingTeacher.email,
          status: newStatus === 'Suspended' ? 'Suspended' : 'Approved'
        }
      };
    }
  }

  await store.commitChanges({
    userUpdates: {
      uid: targetUid,
      data: {
        uid: targetUid,
        id: targetUid,
        email: target.email,
        role: target.role,
        accountStatus: newStatus,
        updatedAt: nowIso
      }
    },
    teacherProfileUpdates,
    auditLogCreate: auditLog
  });

  const customClaimsSynced = await store.setCustomClaims(
    targetUid,
    {
      role: target.role,
      admin: target.role === 'admin',
      accountStatus: newStatus
    },
    newStatus === 'Suspended'
  );

  return {
    success: true,
    targetUid,
    newStatus,
    customClaimsSynced,
    auditLog
  };
}

export async function executeReviewTeacherRequest(params: {
  callerToken: VerifiedCallerToken;
  store: RoleStoreAdapter;
  body: {
    targetUid?: string;
    decision?: 'approve_teacher' | 'reject' | 'assign_student' | 'assign_admin';
    reason?: string;
    confirmAdminPrivilegeChange?: boolean;
  };
  ipAddress?: string;
}): Promise<{
  success: true;
  targetUid: string;
  decision: string;
  newRole: UserRole;
  customClaimsSynced: boolean;
  auditLog: AdminAuditLog;
}> {
  const { callerToken, store, body, ipAddress } = params;
  const caller = await resolveVerifiedCallerAdmin(callerToken, store);

  const targetUid = (body.targetUid || '').trim();
  const decision = body.decision;

  if (!targetUid || !decision) {
    throw new RoleServiceHttpError(400, 'Target UID and decision are required.');
  }

  const allUsers = await store.listAllUsers();
  const target = allUsers.find(u => u.uid === targetUid);
  if (!target) {
    throw new RoleServiceHttpError(404, 'Applicant account not found.');
  }

  let newRole: UserRole = target.role;
  let teacherApprovalStatus: UserAccount['teacherApprovalStatus'] = target.teacherApprovalStatus;
  let teacherProfileStatus: 'Approved' | 'Rejected' | 'Suspended' = 'Approved';
  let actionPerformed = '';
  let notif: NotificationAnnouncement | undefined;

  const nowIso = new Date().toISOString();

  if (decision === 'approve_teacher') {
    newRole = 'teacher';
    teacherApprovalStatus = 'Approved';
    teacherProfileStatus = 'Approved';
    actionPerformed = 'Approved Teacher Request';
    notif = {
      id: `notif-tch-${Date.now()}`,
      title: `Teacher Access Approved (${target.name})`,
      message: `Educator privileges have been approved for ${target.name} (${target.email}). You can now switch to Teacher Panel.`,
      targetAudience: 'Teachers',
      type: 'celebration',
      createdAt: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      isActive: true,
      bannerDisplay: false
    };
  } else if (decision === 'reject') {
    if (!body.reason || !body.reason.trim()) {
      throw new RoleServiceHttpError(400, 'Rejection reason is required when rejecting a Teacher Access Request.');
    }
    newRole = 'student';
    teacherApprovalStatus = 'Rejected';
    teacherProfileStatus = 'Rejected';
    actionPerformed = 'Rejected Teacher Request';
    notif = {
      id: `notif-tch-rej-${Date.now()}`,
      title: `Teacher Request Update (${target.name})`,
      message: `Teacher Access Request for ${target.email} was declined. Reason: ${body.reason.trim()}. Student Panel access remains active.`,
      targetAudience: 'All',
      type: 'warning',
      createdAt: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      isActive: true,
      bannerDisplay: false
    };
  } else if (decision === 'assign_student') {
    newRole = 'student';
    teacherApprovalStatus = 'None';
    teacherProfileStatus = 'Suspended';
    actionPerformed = 'Assigned Student Instead of Teacher';
  } else if (decision === 'assign_admin') {
    if (body.confirmAdminPrivilegeChange !== true) {
      throw new RoleServiceHttpError(400, 'Explicit confirmation is required to assign Admin role.');
    }
    newRole = 'admin';
    teacherApprovalStatus = 'Approved';
    teacherProfileStatus = 'Approved';
    actionPerformed = 'Assigned Admin from Teacher Request';
  } else {
    throw new RoleServiceHttpError(400, 'Invalid teacher review decision.');
  }

  const validation = validateRoleChangeRequest({
    caller: {
      uid: caller.uid,
      email: caller.email,
      role: caller.role,
      accountStatus: caller.accountStatus,
      emailVerified: callerToken.emailVerified
    },
    target,
    newRole,
    allUsers,
    confirmAdminPrivilegeChange: decision === 'assign_admin' ? body.confirmAdminPrivilegeChange : true
  });

  if (!validation.allowed) {
    throw new RoleServiceHttpError(validation.httpStatus || 403, validation.error || 'Teacher review blocked.');
  }

  const existingTeacher = await store.getTeacherProfile(targetUid);
  const teacherProfileUpdates = {
    uid: targetUid,
    data: {
      id: targetUid,
      name: existingTeacher?.name || target.displayName || target.name || 'Applicant',
      email: existingTeacher?.email || target.email || '',
      photoURL: existingTeacher?.photoURL || target.photoURL || '',
      qualification: existingTeacher?.qualification || target.qualification || 'Academic Faculty',
      specialization: existingTeacher?.specialization || target.specialization || 'General Studies & CSAT',
      status: teacherProfileStatus,
      testsCreated: existingTeacher?.testsCreated || 0,
      joinedDate: existingTeacher?.joinedDate || new Date().toLocaleDateString('en-GB'),
      ...(decision === 'approve_teacher' || decision === 'assign_admin'
        ? { approvedBy: caller.uid, approvedAt: nowIso }
        : {}),
      ...(decision === 'reject'
        ? { rejectedBy: caller.uid, rejectedAt: nowIso, rejectionReason: body.reason?.trim() }
        : {})
    }
  };

  const userUpdatesData: Record<string, unknown> = {
    uid: targetUid,
    id: targetUid,
    email: target.email,
    role: newRole,
    teacherApprovalStatus,
    updatedAt: nowIso,
    ...(decision === 'approve_teacher' || decision === 'assign_admin'
      ? { approvedBy: caller.uid, approvedAt: nowIso }
      : {}),
    ...(decision === 'reject'
      ? { rejectedBy: caller.uid, rejectedAt: nowIso, rejectionReason: body.reason?.trim() }
      : {})
  };

  const auditLog: AdminAuditLog = {
    id: buildAuditId('log-tch'),
    timestamp: nowIso,
    actor: `${caller.name} (Admin)`,
    actorRole: 'Admin',
    action: `${actionPerformed}${body.reason ? ` — ${body.reason.trim()}` : ''}`,
    target: `${target.email || target.name} (${targetUid})`,
    status: decision === 'reject' ? 'Warning' : 'Success',
    ipAddress: ipAddress || 'Server Gateway',
    targetUserUid: targetUid,
    previousRole: target.role,
    newRole,
    actionPerformed,
    adminUid: caller.uid,
    reason: body.reason?.trim() || undefined,
    category: 'teacher_approval'
  };

  await store.commitChanges({
    userUpdates: { uid: targetUid, data: userUpdatesData },
    teacherProfileUpdates,
    notificationCreate: notif,
    auditLogCreate: auditLog
  });

  const customClaimsSynced = await store.setCustomClaims(targetUid, {
    role: newRole,
    admin: newRole === 'admin',
    accountStatus: target.accountStatus || 'Active'
  });

  return {
    success: true,
    targetUid,
    decision,
    newRole,
    customClaimsSynced,
    auditLog
  };
}

export async function executeDeleteUserAccount(params: {
  callerToken: VerifiedCallerToken;
  store: RoleStoreAdapter;
  body: {
    targetUid?: string;
    confirmDelete?: boolean;
    reason?: string;
  };
  ipAddress?: string;
}): Promise<{ success: true; targetUid: string; auditLog: AdminAuditLog }> {
  const { callerToken, store, body, ipAddress } = params;
  const caller = await resolveVerifiedCallerAdmin(callerToken, store);

  if (body.confirmDelete !== true) {
    throw new RoleServiceHttpError(400, 'Explicit destructive confirmation is required to delete a user account.');
  }

  const targetUid = (body.targetUid || '').trim();
  if (!targetUid) {
    throw new RoleServiceHttpError(400, 'Target UID is required.');
  }

  if (targetUid === caller.uid) {
    throw new RoleServiceHttpError(409, 'Safeguard Blocked: Administrators cannot delete their own account.');
  }

  const allUsers = await store.listAllUsers();
  const target = allUsers.find(u => u.uid === targetUid);
  if (!target) {
    throw new RoleServiceHttpError(404, 'Target user not found.');
  }

  if (isRootOwnerEmail(target.email)) {
    throw new RoleServiceHttpError(403, 'Protected Account: The platform owner recovery account cannot be deleted.');
  }

  if (target.role === 'admin') {
    const remainingAdmins = allUsers.filter(
      u => u.uid !== targetUid && u.role === 'admin' && (u.accountStatus || 'Active') !== 'Suspended'
    );
    if (remainingAdmins.length === 0) {
      throw new RoleServiceHttpError(409, 'Safeguard Blocked: Cannot delete the last active Administrator.');
    }
  }

  const nowIso = new Date().toISOString();
  const auditLog: AdminAuditLog = {
    id: buildAuditId('log-del'),
    timestamp: nowIso,
    actor: `${caller.name} (Admin)`,
    actorRole: 'Admin',
    action: `Permanently Removed User Account (Tests & Attempts Retained)`,
    target: `${target.email || target.name} (${targetUid})`,
    status: 'Warning',
    ipAddress: ipAddress || 'Server Gateway',
    targetUserUid: targetUid,
    previousRole: target.role,
    newRole: 'deleted',
    actionPerformed: 'Delete User Account',
    adminUid: caller.uid,
    reason: body.reason?.trim() || 'Explicit Admin account removal',
    category: 'account_status'
  };

  if (store.deleteAccountData) {
    await store.deleteAccountData(targetUid, auditLog);
  }

  return { success: true, targetUid, auditLog };
}

export async function executeGetAuthMetadata(params: {
  callerToken: VerifiedCallerToken;
  store: RoleStoreAdapter;
}): Promise<{
  adminSdkConfigured: boolean;
  metadata: Record<string, { lastSignInTime?: string; creationTime?: string }>;
}> {
  await resolveVerifiedCallerAdmin(params.callerToken, params.store);
  if (!params.store.listAuthMetadata) {
    return { adminSdkConfigured: false, metadata: {} };
  }
  const metadata = await params.store.listAuthMetadata();
  return { adminSdkConfigured: true, metadata };
}

export type { UserAccount };
