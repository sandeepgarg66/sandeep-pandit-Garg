import { auth } from './firebase';
import type { AdminAuditLog, UserRole } from '../types/quiz';
import type { RoleActionId } from './roleManagementRules';

async function getVerifiedIdToken(): Promise<string> {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('Authentication required. Please sign in again.');
  }
  return user.getIdToken(true);
}

async function postAdminApi<TResponse>(endpoint: string, payload: Record<string, unknown>): Promise<TResponse> {
  const token = await getVerifiedIdToken();
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data?.error || `Server rejected request (${response.status})`);
  }
  return data as TResponse;
}

export async function apiChangeUserRole(params: {
  targetUid: string;
  newRole: UserRole;
  actionId?: RoleActionId;
  reason?: string;
  confirmAdminPrivilegeChange?: boolean;
}) {
  return postAdminApi<{
    success: true;
    targetUid: string;
    previousRole: UserRole;
    newRole: UserRole;
    customClaimsSynced: boolean;
    auditLog: AdminAuditLog;
  }>('/api/admin/users/change-role', params);
}

export async function apiChangeUserStatus(params: {
  targetUid: string;
  newStatus: 'Active' | 'Suspended';
  reason?: string;
}) {
  return postAdminApi<{
    success: true;
    targetUid: string;
    newStatus: 'Active' | 'Suspended';
    customClaimsSynced: boolean;
    auditLog: AdminAuditLog;
  }>('/api/admin/users/change-status', params);
}

export async function apiReviewTeacherRequest(params: {
  targetUid: string;
  decision: 'approve_teacher' | 'reject' | 'assign_student' | 'assign_admin';
  reason?: string;
  confirmAdminPrivilegeChange?: boolean;
}) {
  return postAdminApi<{
    success: true;
    targetUid: string;
    decision: string;
    newRole: UserRole;
    customClaimsSynced: boolean;
    auditLog: AdminAuditLog;
  }>('/api/admin/users/review-teacher-request', params);
}

export async function apiDeleteUserAccount(params: {
  targetUid: string;
  confirmDelete: boolean;
  reason?: string;
}) {
  return postAdminApi<{
    success: true;
    targetUid: string;
    auditLog: AdminAuditLog;
  }>('/api/admin/users/delete-account', params);
}

export async function apiFetchAuthMetadata(): Promise<{
  adminSdkConfigured: boolean;
  metadata: Record<string, { lastSignInTime?: string; creationTime?: string }>;
}> {
  const token = await getVerifiedIdToken();
  const response = await fetch('/api/admin/users/auth-metadata', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  if (!response.ok) {
    return { adminSdkConfigured: false, metadata: {} };
  }
  return response.json();
}
