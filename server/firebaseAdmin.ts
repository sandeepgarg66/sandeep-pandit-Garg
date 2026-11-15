import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { initializeApp, cert, getApps, type App } from 'firebase-admin/app';
import { getAuth, type Auth } from 'firebase-admin/auth';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';
import type { AdminAuditLog, NotificationAnnouncement, TeacherProfile, UserAccount } from '../src/types/quiz.ts';

export interface FirebaseAppletConfig {
  projectId: string;
  firestoreDatabaseId: string;
}

export function loadFirebaseConfig(): FirebaseAppletConfig {
  const configPath = path.resolve(process.cwd(), 'firebase-applet-config.json');
  const raw = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  return {
    projectId: String(raw.projectId || ''),
    firestoreDatabaseId: String(raw.firestoreDatabaseId || '(default)')
  };
}

export interface VerifiedCallerToken {
  uid: string;
  email: string | null;
  emailVerified: boolean;
  name: string | null;
  claims: Record<string, unknown>;
}

export interface RoleStoreAdapter {
  readonly mode: 'admin_sdk' | 'verified_token_rest';
  readonly customClaimsSupported: boolean;
  getUser(uid: string): Promise<UserAccount | null>;
  listAllUsers(): Promise<UserAccount[]>;
  getTeacherProfile(uid: string): Promise<TeacherProfile | null>;
  setCustomClaims(uid: string, claims: Record<string, unknown>, revokeTokens?: boolean): Promise<boolean>;
  commitChanges(params: {
    userUpdates?: { uid: string; data: Record<string, unknown> };
    teacherProfileUpdates?: { uid: string; data: Record<string, unknown> };
    studentProfileInit?: { uid: string; data: Record<string, unknown> };
    notificationCreate?: NotificationAnnouncement;
    auditLogCreate: AdminAuditLog;
  }): Promise<void>;
  deleteAccountData?(uid: string, auditLogCreate: AdminAuditLog): Promise<boolean>;
  listAuthMetadata?(): Promise<Record<string, { lastSignInTime?: string; creationTime?: string }>>;
}

// ---------------------------------------------------------------------------
// Firebase Admin SDK Initialization (when FIREBASE_SERVICE_ACCOUNT_JSON is set)
// ---------------------------------------------------------------------------
let adminApp: App | null = null;
let adminAuth: Auth | null = null;
let adminDb: Firestore | null = null;
let adminInitAttempted = false;

function tryInitAdminSdk(): { app: App | null; auth: Auth | null; db: Firestore | null } {
  if (adminInitAttempted) {
    return { app: adminApp, auth: adminAuth, db: adminDb };
  }
  adminInitAttempted = true;

  const rawCreds = process.env.FIREBASE_SERVICE_ACCOUNT_JSON?.trim();
  if (!rawCreds) {
    return { app: null, auth: null, db: null };
  }

  try {
    const config = loadFirebaseConfig();
    const serviceAccount = rawCreds.startsWith('{')
      ? JSON.parse(rawCreds)
      : JSON.parse(fs.readFileSync(path.resolve(process.cwd(), rawCreds), 'utf-8'));

    adminApp =
      getApps().length > 0
        ? getApps()[0]
        : initializeApp({
            credential: cert(serviceAccount),
            projectId: config.projectId
          });

    adminAuth = getAuth(adminApp);
    adminDb = getFirestore(adminApp, config.firestoreDatabaseId);
    return { app: adminApp, auth: adminAuth, db: adminDb };
  } catch (err) {
    console.warn('FIREBASE_SERVICE_ACCOUNT_JSON present but could not initialize Admin SDK:', err);
    adminApp = null;
    adminAuth = null;
    adminDb = null;
    return { app: null, auth: null, db: null };
  }
}

export function isAdminSdkConfigured(): boolean {
  const { auth, db } = tryInitAdminSdk();
  return Boolean(auth && db);
}

// ---------------------------------------------------------------------------
// Cryptographic Firebase ID Token Verification (Google Public x509 Certs)
// ---------------------------------------------------------------------------
let cachedCerts: Record<string, string> = {};
let certsExpiresAtMs = 0;

async function fetchGoogleSecureTokenCerts(): Promise<Record<string, string>> {
  if (Date.now() < certsExpiresAtMs && Object.keys(cachedCerts).length > 0) {
    return cachedCerts;
  }
  const resp = await fetch(
    'https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com'
  );
  if (!resp.ok) {
    throw new Error(`Failed to fetch Google Firebase public keys (${resp.status})`);
  }
  const cacheControl = resp.headers.get('cache-control') || '';
  const maxAgeMatch = cacheControl.match(/max-age=(\d+)/);
  const maxAgeSec = maxAgeMatch ? Number(maxAgeMatch[1]) : 3600;
  cachedCerts = (await resp.json()) as Record<string, string>;
  certsExpiresAtMs = Date.now() + Math.max(60, maxAgeSec) * 1000;
  return cachedCerts;
}

function decodeBase64Url(input: string): Buffer {
  const normalized = input.replace(/-/g, '+').replace(/_/g, '/');
  const pad = normalized.length % 4 === 0 ? '' : '='.repeat(4 - (normalized.length % 4));
  return Buffer.from(normalized + pad, 'base64');
}

export async function verifyCallerFirebaseIdToken(idToken: string): Promise<VerifiedCallerToken> {
  if (!idToken || typeof idToken !== 'string') {
    throw new Error('Missing Firebase ID token.');
  }

  // Prefer Admin SDK verifyIdToken(token, true) with revocation check when configured
  const { auth } = tryInitAdminSdk();
  if (auth) {
    const decoded = await auth.verifyIdToken(idToken, true);
    return {
      uid: decoded.uid,
      email: decoded.email || null,
      emailVerified: decoded.email_verified === true,
      name: (decoded.name as string) || null,
      claims: decoded as unknown as Record<string, unknown>
    };
  }

  // Zero-secret fallback: full RS256 signature verification against Google's official Firebase certs
  const parts = idToken.split('.');
  if (parts.length !== 3) {
    throw new Error('Malformed Firebase ID token.');
  }

  const [headerB64, payloadB64, signatureB64] = parts;
  const header = JSON.parse(decodeBase64Url(headerB64).toString('utf-8')) as {
    alg?: string;
    kid?: string;
  };
  const payload = JSON.parse(decodeBase64Url(payloadB64).toString('utf-8')) as Record<string, unknown>;

  if (header.alg !== 'RS256' || !header.kid) {
    throw new Error('Invalid token algorithm or key identifier.');
  }

  const certs = await fetchGoogleSecureTokenCerts();
  const certPem = certs[header.kid];
  if (!certPem) {
    throw new Error('Firebase token signing key not recognized.');
  }

  const verifier = crypto.createVerify('RSA-SHA256');
  verifier.update(`${headerB64}.${payloadB64}`);
  verifier.end();
  const signature = decodeBase64Url(signatureB64);

  if (!verifier.verify(certPem, signature)) {
    throw new Error('Invalid Firebase ID token signature.');
  }

  const config = loadFirebaseConfig();
  const nowSec = Math.floor(Date.now() / 1000);
  const exp = Number(payload.exp || 0);
  const iat = Number(payload.iat || 0);
  const sub = typeof payload.sub === 'string' ? payload.sub : '';

  if (!sub || sub.length > 128) {
    throw new Error('Invalid Firebase subject claim.');
  }
  if (exp <= nowSec) {
    throw new Error('Firebase ID token has expired.');
  }
  if (iat > nowSec + 300) {
    throw new Error('Firebase ID token issued-at timestamp is invalid.');
  }
  if (payload.aud !== config.projectId) {
    throw new Error('Firebase ID token audience mismatch.');
  }
  if (payload.iss !== `https://securetoken.google.com/${config.projectId}`) {
    throw new Error('Firebase ID token issuer mismatch.');
  }

  return {
    uid: sub,
    email: typeof payload.email === 'string' ? payload.email : null,
    emailVerified: payload.email_verified === true,
    name: typeof payload.name === 'string' ? payload.name : null,
    claims: payload
  };
}

// ---------------------------------------------------------------------------
// Store Adapter 1: Firebase Admin SDK
// ---------------------------------------------------------------------------
class AdminSdkRoleStore implements RoleStoreAdapter {
  readonly mode = 'admin_sdk' as const;
  readonly customClaimsSupported = true;
  private auth: Auth;
  private db: Firestore;

  constructor(auth: Auth, db: Firestore) {
    this.auth = auth;
    this.db = db;
  }

  async getUser(uid: string): Promise<UserAccount | null> {
    const snap = await this.db.collection('users').doc(uid).get();
    if (!snap.exists) return null;
    return normalizeUserDoc(snap.id, snap.data() || {});
  }

  async listAllUsers(): Promise<UserAccount[]> {
    const snap = await this.db.collection('users').get();
    return snap.docs.map(d => normalizeUserDoc(d.id, d.data() || {}));
  }

  async getTeacherProfile(uid: string): Promise<TeacherProfile | null> {
    const snap = await this.db.collection('teacherProfiles').doc(uid).get();
    if (!snap.exists) return null;
    return { id: snap.id, ...(snap.data() as Omit<TeacherProfile, 'id'>) };
  }

  async setCustomClaims(uid: string, claims: Record<string, unknown>, revokeTokens = false): Promise<boolean> {
    await this.auth.setCustomUserClaims(uid, claims);
    if (revokeTokens) {
      await this.auth.revokeRefreshTokens(uid);
    }
    return true;
  }

  async commitChanges(params: {
    userUpdates?: { uid: string; data: Record<string, unknown> };
    teacherProfileUpdates?: { uid: string; data: Record<string, unknown> };
    studentProfileInit?: { uid: string; data: Record<string, unknown> };
    notificationCreate?: NotificationAnnouncement;
    auditLogCreate: AdminAuditLog;
  }): Promise<void> {
    const batch = this.db.batch();
    if (params.userUpdates) {
      batch.set(this.db.collection('users').doc(params.userUpdates.uid), stripUndefined(params.userUpdates.data), {
        merge: true
      });
    }
    if (params.teacherProfileUpdates) {
      batch.set(
        this.db.collection('teacherProfiles').doc(params.teacherProfileUpdates.uid),
        stripUndefined(params.teacherProfileUpdates.data),
        { merge: true }
      );
    }
    if (params.studentProfileInit) {
      batch.set(
        this.db.collection('studentProfiles').doc(params.studentProfileInit.uid),
        stripUndefined(params.studentProfileInit.data),
        { merge: true }
      );
    }
    if (params.notificationCreate) {
      batch.set(
        this.db.collection('notifications').doc(params.notificationCreate.id),
        stripUndefined(params.notificationCreate as unknown as Record<string, unknown>)
      );
    }
    batch.set(
      this.db.collection('auditLogs').doc(params.auditLogCreate.id),
      stripUndefined(params.auditLogCreate as unknown as Record<string, unknown>)
    );
    await batch.commit();
  }

  async deleteAccountData(uid: string, auditLogCreate: AdminAuditLog): Promise<boolean> {
    const batch = this.db.batch();
    batch.delete(this.db.collection('users').doc(uid));
    batch.delete(this.db.collection('teacherProfiles').doc(uid));
    batch.delete(this.db.collection('studentProfiles').doc(uid));
    batch.set(
      this.db.collection('auditLogs').doc(auditLogCreate.id),
      stripUndefined(auditLogCreate as unknown as Record<string, unknown>)
    );
    await batch.commit();
    try {
      await this.auth.deleteUser(uid);
    } catch (err) {
      console.warn('Auth user delete notice (user may already be removed):', err);
    }
    return true;
  }

  async listAuthMetadata(): Promise<Record<string, { lastSignInTime?: string; creationTime?: string }>> {
    const metadataMap: Record<string, { lastSignInTime?: string; creationTime?: string }> = {};
    let pageToken: string | undefined;
    do {
      const result = await this.auth.listUsers(1000, pageToken);
      for (const u of result.users) {
        metadataMap[u.uid] = {
          lastSignInTime: u.metadata.lastSignInTime,
          creationTime: u.metadata.creationTime
        };
      }
      pageToken = result.pageToken;
    } while (pageToken);
    return metadataMap;
  }
}

// ---------------------------------------------------------------------------
// Store Adapter 2: Verified ID Token + Firestore REST API v1 (Rules-Enforced)
// ---------------------------------------------------------------------------
type FirestoreValue =
  | { stringValue: string }
  | { integerValue: string }
  | { doubleValue: number }
  | { booleanValue: boolean }
  | { nullValue: null }
  | { mapValue: { fields: Record<string, FirestoreValue> } }
  | { arrayValue: { values: FirestoreValue[] } };

function toFirestoreValue(val: unknown): FirestoreValue {
  if (val === null || val === undefined) return { nullValue: null };
  if (typeof val === 'string') return { stringValue: val };
  if (typeof val === 'boolean') return { booleanValue: val };
  if (typeof val === 'number') {
    return Number.isInteger(val) ? { integerValue: String(val) } : { doubleValue: val };
  }
  if (Array.isArray(val)) {
    return { arrayValue: { values: val.map(v => toFirestoreValue(v)) } };
  }
  if (typeof val === 'object') {
    const fields: Record<string, FirestoreValue> = {};
    for (const [k, v] of Object.entries(val as Record<string, unknown>)) {
      if (v !== undefined) {
        fields[k] = toFirestoreValue(v);
      }
    }
    return { mapValue: { fields } };
  }
  return { stringValue: String(val) };
}

function fromFirestoreValue(val: Record<string, unknown>): unknown {
  if ('stringValue' in val) return val.stringValue;
  if ('booleanValue' in val) return val.booleanValue;
  if ('integerValue' in val) return Number(val.integerValue);
  if ('doubleValue' in val) return Number(val.doubleValue);
  if ('nullValue' in val) return null;
  if ('timestampValue' in val) return val.timestampValue;
  if ('arrayValue' in val) {
    const arr = (val.arrayValue as { values?: Record<string, unknown>[] })?.values || [];
    return arr.map(fromFirestoreValue);
  }
  if ('mapValue' in val) {
    const fields = (val.mapValue as { fields?: Record<string, Record<string, unknown>> })?.fields || {};
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(fields)) {
      out[k] = fromFirestoreValue(v);
    }
    return out;
  }
  return undefined;
}

function decodeFirestoreDoc(docJson: { name: string; fields?: Record<string, Record<string, unknown>> }): {
  id: string;
  data: Record<string, unknown>;
} {
  const id = docJson.name.split('/').pop() || '';
  const data: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(docJson.fields || {})) {
    data[k] = fromFirestoreValue(v);
  }
  return { id, data };
}

class VerifiedTokenFirestoreRestStore implements RoleStoreAdapter {
  readonly mode = 'verified_token_rest' as const;
  readonly customClaimsSupported = false;
  private callerIdToken: string;
  private baseDocPath: string;
  private restBaseUrl: string;

  constructor(callerIdToken: string, config: FirebaseAppletConfig) {
    this.callerIdToken = callerIdToken;
    this.baseDocPath = `projects/${config.projectId}/databases/${config.firestoreDatabaseId}/documents`;
    this.restBaseUrl = `https://firestore.googleapis.com/v1/${this.baseDocPath}`;
  }

  private async restFetch(url: string, init?: RequestInit) {
    const resp = await fetch(url, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.callerIdToken}`,
        ...(init?.headers || {})
      }
    });
    if (!resp.ok) {
      const text = await resp.text();
      throw new Error(`Firestore REST error (${resp.status}): ${text}`);
    }
    return resp.json();
  }

  async getUser(uid: string): Promise<UserAccount | null> {
    try {
      const docJson = await this.restFetch(`${this.restBaseUrl}/users/${encodeURIComponent(uid)}`);
      const { id, data } = decodeFirestoreDoc(docJson);
      return normalizeUserDoc(id, data);
    } catch (err) {
      if (err instanceof Error && err.message.includes('(404)')) return null;
      throw err;
    }
  }

  async listAllUsers(): Promise<UserAccount[]> {
    const users: UserAccount[] = [];
    let pageToken = '';
    do {
      const qs = pageToken ? `?pageSize=300&pageToken=${encodeURIComponent(pageToken)}` : '?pageSize=300';
      const json = (await this.restFetch(`${this.restBaseUrl}/users${qs}`)) as {
        documents?: Array<{ name: string; fields?: Record<string, Record<string, unknown>> }>;
        nextPageToken?: string;
      };
      for (const docJson of json.documents || []) {
        const { id, data } = decodeFirestoreDoc(docJson);
        users.push(normalizeUserDoc(id, data));
      }
      pageToken = json.nextPageToken || '';
    } while (pageToken);
    return users;
  }

  async getTeacherProfile(uid: string): Promise<TeacherProfile | null> {
    try {
      const docJson = await this.restFetch(`${this.restBaseUrl}/teacherProfiles/${encodeURIComponent(uid)}`);
      const { id, data } = decodeFirestoreDoc(docJson);
      return { id, ...(data as Omit<TeacherProfile, 'id'>) };
    } catch (err) {
      if (err instanceof Error && err.message.includes('(404)')) return null;
      throw err;
    }
  }

  async setCustomClaims(): Promise<boolean> {
    // Requires FIREBASE_SERVICE_ACCOUNT_JSON to mint Admin Auth custom claims
    return false;
  }

  async commitChanges(params: {
    userUpdates?: { uid: string; data: Record<string, unknown> };
    teacherProfileUpdates?: { uid: string; data: Record<string, unknown> };
    studentProfileInit?: { uid: string; data: Record<string, unknown> };
    notificationCreate?: NotificationAnnouncement;
    auditLogCreate: AdminAuditLog;
  }): Promise<void> {
    const writes: Array<Record<string, unknown>> = [];

    if (params.userUpdates) {
      const cleaned = stripUndefined(params.userUpdates.data);
      const fieldPaths = Object.keys(cleaned);
      const fields: Record<string, FirestoreValue> = {};
      fieldPaths.forEach(k => {
        fields[k] = toFirestoreValue(cleaned[k]);
      });
      writes.push({
        updateMask: { fieldPaths },
        update: {
          name: `${this.baseDocPath}/users/${params.userUpdates.uid}`,
          fields
        }
      });
    }

    if (params.teacherProfileUpdates) {
      const cleaned = stripUndefined(params.teacherProfileUpdates.data);
      const fieldPaths = Object.keys(cleaned);
      const fields: Record<string, FirestoreValue> = {};
      fieldPaths.forEach(k => {
        fields[k] = toFirestoreValue(cleaned[k]);
      });
      writes.push({
        updateMask: { fieldPaths },
        update: {
          name: `${this.baseDocPath}/teacherProfiles/${params.teacherProfileUpdates.uid}`,
          fields
        }
      });
    }

    if (params.studentProfileInit) {
      const cleaned = stripUndefined(params.studentProfileInit.data);
      const fieldPaths = Object.keys(cleaned);
      const fields: Record<string, FirestoreValue> = {};
      fieldPaths.forEach(k => {
        fields[k] = toFirestoreValue(cleaned[k]);
      });
      writes.push({
        updateMask: { fieldPaths },
        update: {
          name: `${this.baseDocPath}/studentProfiles/${params.studentProfileInit.uid}`,
          fields
        }
      });
    }

    if (params.notificationCreate) {
      const cleaned = stripUndefined(params.notificationCreate as unknown as Record<string, unknown>);
      const fields: Record<string, FirestoreValue> = {};
      Object.keys(cleaned).forEach(k => {
        fields[k] = toFirestoreValue(cleaned[k]);
      });
      writes.push({
        update: {
          name: `${this.baseDocPath}/notifications/${params.notificationCreate.id}`,
          fields
        }
      });
    }

    {
      const cleaned = stripUndefined(params.auditLogCreate as unknown as Record<string, unknown>);
      const fields: Record<string, FirestoreValue> = {};
      Object.keys(cleaned).forEach(k => {
        fields[k] = toFirestoreValue(cleaned[k]);
      });
      writes.push({
        currentDocument: { exists: false },
        update: {
          name: `${this.baseDocPath}/auditLogs/${params.auditLogCreate.id}`,
          fields
        }
      });
    }

    await this.restFetch(`${this.restBaseUrl}:commit`, {
      method: 'POST',
      body: JSON.stringify({ writes })
    });
  }

  async deleteAccountData(uid: string, auditLogCreate: AdminAuditLog): Promise<boolean> {
    const writes: Array<Record<string, unknown>> = [
      { delete: `${this.baseDocPath}/users/${uid}` },
      { delete: `${this.baseDocPath}/teacherProfiles/${uid}` },
      { delete: `${this.baseDocPath}/studentProfiles/${uid}` }
    ];
    const cleaned = stripUndefined(auditLogCreate as unknown as Record<string, unknown>);
    const fields: Record<string, FirestoreValue> = {};
    Object.keys(cleaned).forEach(k => {
      fields[k] = toFirestoreValue(cleaned[k]);
    });
    writes.push({
      currentDocument: { exists: false },
      update: {
        name: `${this.baseDocPath}/auditLogs/${auditLogCreate.id}`,
        fields
      }
    });

    await this.restFetch(`${this.restBaseUrl}:commit`, {
      method: 'POST',
      body: JSON.stringify({ writes })
    });
    return true;
  }
}

export function createRoleStoreForCaller(callerIdToken: string): RoleStoreAdapter {
  const { auth, db } = tryInitAdminSdk();
  if (auth && db) {
    return new AdminSdkRoleStore(auth, db);
  }
  return new VerifiedTokenFirestoreRestStore(callerIdToken, loadFirebaseConfig());
}

function stripUndefined(obj: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v !== undefined) out[k] = v;
  }
  return out;
}

function normalizeUserDoc(uid: string, raw: Record<string, unknown>): UserAccount {
  const roleVal = raw.role === 'admin' || raw.role === 'teacher' || raw.role === 'student' ? raw.role : 'student';
  return {
    uid,
    id: uid,
    name: String(raw.displayName || raw.name || 'User'),
    displayName: String(raw.displayName || raw.name || 'User'),
    email: String(raw.email || ''),
    photoURL: typeof raw.photoURL === 'string' ? raw.photoURL : '',
    role: roleVal,
    requestedRole:
      raw.requestedRole === 'teacher' || raw.requestedRole === 'student' ? raw.requestedRole : undefined,
    accountStatus: raw.accountStatus === 'Suspended' ? 'Suspended' : 'Active',
    teacherApprovalStatus:
      raw.teacherApprovalStatus === 'Pending' ||
      raw.teacherApprovalStatus === 'Approved' ||
      raw.teacherApprovalStatus === 'Rejected' ||
      raw.teacherApprovalStatus === 'Suspended' ||
      raw.teacherApprovalStatus === 'None'
        ? raw.teacherApprovalStatus
        : roleVal === 'teacher'
        ? 'Pending'
        : 'None',
    qualification: typeof raw.qualification === 'string' ? raw.qualification : undefined,
    specialization: typeof raw.specialization === 'string' ? raw.specialization : undefined,
    appliedAt: typeof raw.appliedAt === 'string' ? raw.appliedAt : undefined,
    approvedBy: typeof raw.approvedBy === 'string' ? raw.approvedBy : undefined,
    approvedAt: typeof raw.approvedAt === 'string' ? raw.approvedAt : undefined,
    rejectedBy: typeof raw.rejectedBy === 'string' ? raw.rejectedBy : undefined,
    rejectedAt: typeof raw.rejectedAt === 'string' ? raw.rejectedAt : undefined,
    rejectionReason: typeof raw.rejectionReason === 'string' ? raw.rejectionReason : undefined,
    lastLoginAt: typeof raw.lastLoginAt === 'string' ? raw.lastLoginAt : undefined,
    createdAt: typeof raw.createdAt === 'string' ? raw.createdAt : new Date().toISOString(),
    updatedAt: typeof raw.updatedAt === 'string' ? raw.updatedAt : new Date().toISOString()
  };
}
