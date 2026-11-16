import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit
} from 'firebase/firestore';
import { db } from './firebase';
import {
  Test,
  Question,
  TestAttempt,
  TeacherProfile,
  AdminAuditLog,
  NotificationAnnouncement,
  LeaderboardEntry,
  LeaderboardEntryDoc,
  BookmarkedQuestion,
  UserAccount,
  SubjectItem,
  PYQSet,
  PlatformSettings
} from '../types/quiz';
import { AdminStudentItem } from '../context/QuizContext';

/**
 * PRODUCTION FIRESTORE DATA SERVICE
 * Single source of truth for all production collections:
 * - tests
 * - questions
 * - testAttempts
 * - users
 * - studentProfiles
 * - teacherProfiles
 * - leaderboardEntries
 * - notifications
 * - subjects
 * - pyqs
 * - platformSettings
 * - auditLogs
 * - bookmarks
 */

export async function fetchPublishedTests(): Promise<Test[]> {
  const q = query(collection(db, 'tests'), where('status', '==', 'Published'));
  const snap = await getDocs(q);
  const tests: Test[] = [];
  snap.forEach(d => {
    tests.push({ id: d.id, ...d.data() } as Test);
  });
  return tests;
}

export async function fetchTeacherTests(uid: string): Promise<Test[]> {
  if (!uid) return [];
  const q = query(collection(db, 'tests'), where('createdBy', '==', uid));
  const snap = await getDocs(q);
  const tests: Test[] = [];
  snap.forEach(d => {
    tests.push({ id: d.id, ...d.data() } as Test);
  });
  return tests;
}

export async function fetchRealTests(): Promise<Test[]> {
  const q = query(collection(db, 'tests'));
  const snap = await getDocs(q);
  const tests: Test[] = [];
  snap.forEach(d => {
    tests.push({ id: d.id, ...d.data() } as Test);
  });
  return tests;
}

export async function fetchTeacherQuestions(uid: string): Promise<Question[]> {
  if (!uid) return [];
  const q = query(collection(db, 'questions'), where('createdBy', '==', uid));
  const snap = await getDocs(q);
  const questions: Question[] = [];
  snap.forEach(d => {
    questions.push({ id: d.id, ...d.data() } as Question);
  });
  return questions;
}

export async function fetchRealQuestions(): Promise<Question[]> {
  const q = query(collection(db, 'questions'));
  const snap = await getDocs(q);
  const questions: Question[] = [];
  snap.forEach(d => {
    questions.push({ id: d.id, ...d.data() } as Question);
  });
  return questions;
}

export async function fetchRealTeachers(): Promise<TeacherProfile[]> {
  const q = query(collection(db, 'teacherProfiles'));
  const snap = await getDocs(q);
  const teachers: TeacherProfile[] = [];
  snap.forEach(d => {
    teachers.push({ id: d.id, ...d.data() } as TeacherProfile);
  });
  return teachers;
}

export async function fetchRealStudents(): Promise<AdminStudentItem[]> {
  const q = query(collection(db, 'users'), where('role', '==', 'student'));
  const snap = await getDocs(q);
  const students: AdminStudentItem[] = [];

  snap.forEach(d => {
    const u = d.data();
    students.push({
      id: d.id,
      name: u.displayName || u.name || 'Candidate',
      email: u.email || '',
      attempts: 0,
      points: 0,
      rank: 0,
      status: u.accountStatus === 'Suspended' || u.status === 'Suspended' ? 'Suspended' : 'Active'
    });
  });

  return students;
}

export async function fetchAllTestAttempts(): Promise<TestAttempt[]> {
  const q = query(collection(db, 'testAttempts'), orderBy('submittedAt', 'desc'), limit(100));
  const snap = await getDocs(q);
  const attempts: TestAttempt[] = [];
  snap.forEach(d => {
    attempts.push({ id: d.id, ...d.data() } as TestAttempt);
  });
  return attempts;
}

export async function fetchRealNotifications(): Promise<NotificationAnnouncement[]> {
  const q = query(collection(db, 'notifications'));
  const snap = await getDocs(q);
  const notifications: NotificationAnnouncement[] = [];
  snap.forEach(d => {
    notifications.push({ id: d.id, ...d.data() } as NotificationAnnouncement);
  });
  return notifications;
}

export async function fetchRealSubjects(): Promise<SubjectItem[]> {
  const q = query(collection(db, 'subjects'));
  const snap = await getDocs(q);
  const subjects: SubjectItem[] = [];
  snap.forEach(d => {
    subjects.push({ id: d.id, ...d.data() } as SubjectItem);
  });
  return subjects;
}

export async function fetchRealPYQs(): Promise<PYQSet[]> {
  const q = query(collection(db, 'pyqs'));
  const snap = await getDocs(q);
  const pyqs: PYQSet[] = [];
  snap.forEach(d => {
    pyqs.push({ id: d.id, ...d.data() } as PYQSet);
  });
  return pyqs;
}

export async function fetchRealPlatformSettings(): Promise<PlatformSettings | null> {
  const snap = await getDoc(doc(db, 'platformSettings', 'global'));
  if (!snap.exists()) return null;
  return snap.data() as PlatformSettings;
}

export async function fetchLeaderboardEntries(): Promise<LeaderboardEntryDoc[]> {
  const q = query(collection(db, 'leaderboardEntries'), orderBy('lifetimePoints', 'desc'), limit(100));
  const snap = await getDocs(q);
  const entries: LeaderboardEntryDoc[] = [];
  snap.forEach(d => {
    entries.push({ id: d.id, ...d.data() } as LeaderboardEntryDoc);
  });
  return entries;
}

export async function fetchRealAuditLogs(): Promise<AdminAuditLog[]> {
  const q = query(collection(db, 'auditLogs'), orderBy('timestamp', 'desc'), limit(50));
  const snap = await getDocs(q);
  const logs: AdminAuditLog[] = [];
  snap.forEach(d => {
    logs.push({ id: d.id, ...d.data() } as AdminAuditLog);
  });
  return logs;
}

export async function fetchRealBookmarks(uid: string): Promise<BookmarkedQuestion[]> {
  if (!uid) return [];
  const q = query(collection(db, 'bookmarks'), where('userId', '==', uid));
  const snap = await getDocs(q);
  const bookmarks: BookmarkedQuestion[] = [];
  snap.forEach(d => {
    const data = d.data();
    bookmarks.push({
      questionId: data.questionId,
      question: data.question,
      savedDate: data.savedDate || 'Recent',
      notes: data.notes
    });
  });
  return bookmarks;
}

function deriveBadgeForRank(rank: number): LeaderboardEntry['badge'] {
  if (rank === 1) return 'Hokage';
  if (rank <= 3) return 'ANBU';
  if (rank <= 6) return 'Jonin';
  if (rank <= 9) return 'Chunin';
  return 'Genin';
}

/**
 * Computes Daily, Weekly, and Global Leaderboards from public non-PII LeaderboardEntryDocs.
 * Respects admin reset timestamps (dailyResetAt, weeklyResetAt).
 */
export function computeLeaderboardsFromDocs(
  docs: LeaderboardEntryDoc[],
  settings?: Pick<PlatformSettings, 'dailyResetAt' | 'weeklyResetAt'>,
  nowMs: number = Date.now()
): {
  daily: LeaderboardEntry[];
  weekly: LeaderboardEntry[];
  global: LeaderboardEntry[];
  rankByStudentId: Record<string, { globalRank: number; dailyPoints: number; weeklyPoints: number }>;
} {
  const ONE_DAY_MS = 24 * 60 * 60 * 1000;
  const ONE_WEEK_MS = 7 * ONE_DAY_MS;
  const dailyCutoff = Math.max(
    nowMs - ONE_DAY_MS,
    settings?.dailyResetAt ? new Date(settings.dailyResetAt).getTime() : 0
  );
  const weeklyCutoff = Math.max(
    nowMs - ONE_WEEK_MS,
    settings?.weeklyResetAt ? new Date(settings.weeklyResetAt).getTime() : 0
  );

  const normalized = docs.map(d => {
    const accuracy =
      d.totalAttemptedQuestions > 0
        ? Math.round((d.totalCorrect / d.totalAttemptedQuestions) * 1000) / 10
        : 0;
    const dailyValid =
      typeof d.lastDailyUpdatedAt === 'string' &&
      new Date(d.lastDailyUpdatedAt).getTime() >= dailyCutoff;
    const weeklyValid =
      typeof d.lastWeeklyUpdatedAt === 'string' &&
      new Date(d.lastWeeklyUpdatedAt).getTime() >= weeklyCutoff;

    return {
      studentId: d.studentId || d.id,
      name: d.name || 'Candidate',
      avatar:
        d.avatar ||
        `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(d.name || d.id)}`,
      lifetimePoints: Number(d.lifetimePoints) || 0,
      dailyPoints: dailyValid ? Number(d.dailyPoints) || 0 : 0,
      weeklyPoints: weeklyValid ? Number(d.weeklyPoints) || 0 : 0,
      accuracy,
      testsAttempted: Number(d.testsAttempted) || 0
    };
  });

  const buildBoard = (
    items: typeof normalized,
    scoreKey: 'dailyPoints' | 'weeklyPoints' | 'lifetimePoints',
    excludeZero: boolean
  ): LeaderboardEntry[] => {
    const filtered = excludeZero ? items.filter(i => i[scoreKey] > 0) : items.filter(i => i.testsAttempted > 0 || i[scoreKey] > 0);
    const sorted = [...filtered].sort((a, b) => {
      if (b[scoreKey] !== a[scoreKey]) return b[scoreKey] - a[scoreKey];
      return b.accuracy - a.accuracy;
    });
    return sorted.slice(0, 10).map((item, idx) => {
      const rank = idx + 1;
      return {
        rank,
        studentId: item.studentId,
        name: item.name,
        avatar: item.avatar,
        points: item[scoreKey],
        accuracy: item.accuracy,
        badge: deriveBadgeForRank(rank),
        testsAttempted: item.testsAttempted,
        change: 'same'
      };
    });
  };

  const fullGlobalSorted = [...normalized]
    .filter(i => i.testsAttempted > 0 || i.lifetimePoints > 0)
    .sort((a, b) => (b.lifetimePoints !== a.lifetimePoints ? b.lifetimePoints - a.lifetimePoints : b.accuracy - a.accuracy));

  const rankByStudentId: Record<string, { globalRank: number; dailyPoints: number; weeklyPoints: number }> = {};
  fullGlobalSorted.forEach((item, idx) => {
    rankByStudentId[item.studentId] = {
      globalRank: idx + 1,
      dailyPoints: item.dailyPoints,
      weeklyPoints: item.weeklyPoints
    };
  });

  return {
    daily: buildBoard(normalized, 'dailyPoints', true),
    weekly: buildBoard(normalized, 'weeklyPoints', true),
    global: buildBoard(normalized, 'lifetimePoints', false),
    rankByStudentId
  };
}

/**
 * Fallback computation from raw TestAttempts when needed by Admin oversight.
 */
export function computeRealLeaderboards(
  attempts: TestAttempt[],
  settings?: Pick<PlatformSettings, 'dailyResetAt' | 'weeklyResetAt'>
): {
  daily: LeaderboardEntry[];
  weekly: LeaderboardEntry[];
  global: LeaderboardEntry[];
} {
  const now = Date.now();
  const ONE_DAY_MS = 24 * 60 * 60 * 1000;
  const ONE_WEEK_MS = 7 * ONE_DAY_MS;
  const dailyStart = Math.max(
    now - ONE_DAY_MS,
    settings?.dailyResetAt ? new Date(settings.dailyResetAt).getTime() : 0
  );
  const weeklyStart = Math.max(
    now - ONE_WEEK_MS,
    settings?.weeklyResetAt ? new Date(settings.weeklyResetAt).getTime() : 0
  );

  const validAttempts = attempts.filter(
    a => a.category !== ('Private Practice' as any)
  );

  function aggregatePoints(periodFilter?: (dateMs: number) => boolean): LeaderboardEntry[] {
    const studentMap: Record<
      string,
      {
        studentId: string;
        name: string;
        avatar?: string;
        points: number;
        testsAttempted: number;
        totalCorrect: number;
        totalQuestions: number;
      }
    > = {};

    validAttempts.forEach(att => {
      const submittedMs = new Date(att.submittedAt).getTime();
      if (periodFilter && !periodFilter(submittedMs)) return;

      if (!studentMap[att.studentId]) {
        studentMap[att.studentId] = {
          studentId: att.studentId,
          name: att.studentName || 'Candidate',
          points: 0,
          testsAttempted: 0,
          totalCorrect: 0,
          totalQuestions: 0
        };
      }

      const rec = studentMap[att.studentId];
      rec.testsAttempted += 1;
      rec.points += Math.round(att.obtainedMarks * 10);
      rec.totalCorrect += att.correctCount;
      rec.totalQuestions += att.correctCount + att.wrongCount;
    });

    const list = Object.values(studentMap);
    list.sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      const accA = a.totalQuestions > 0 ? a.totalCorrect / a.totalQuestions : 0;
      const accB = b.totalQuestions > 0 ? b.totalCorrect / b.totalQuestions : 0;
      return accB - accA;
    });

    return list.slice(0, 10).map((item, idx) => {
      const accuracy =
        item.totalQuestions > 0
          ? Math.round((item.totalCorrect / item.totalQuestions) * 1000) / 10
          : 0;

      const rank = idx + 1;
      return {
        rank,
        studentId: item.studentId,
        name: item.name,
        avatar:
          item.avatar ||
          `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(item.name)}`,
        points: item.points,
        accuracy,
        badge: deriveBadgeForRank(rank),
        testsAttempted: item.testsAttempted,
        change: 'same'
      };
    });
  }

  return {
    daily: aggregatePoints(dateMs => dateMs >= dailyStart),
    weekly: aggregatePoints(dateMs => dateMs >= weeklyStart),
    global: aggregatePoints()
  };
}

export async function fetchRealUsers(): Promise<UserAccount[]> {
  const q = query(collection(db, 'users'));
  const snap = await getDocs(q);
  const users: UserAccount[] = [];
  snap.forEach(d => {
    const u = d.data();
    const role = u.role === 'admin' || u.role === 'teacher' || u.role === 'student' ? u.role : 'student';
    users.push({
      uid: d.id,
      id: d.id,
      name: u.displayName || u.name || 'User',
      displayName: u.displayName || u.name || 'User',
      email: u.email || '',
      photoURL: u.photoURL || '',
      role,
      requestedRole: u.requestedRole === 'teacher' || u.requestedRole === 'student' ? u.requestedRole : undefined,
      accountStatus: u.accountStatus === 'Suspended' ? 'Suspended' : 'Active',
      teacherApprovalStatus: u.teacherApprovalStatus || (role === 'teacher' ? 'Pending' : 'None'),
      qualification: typeof u.qualification === 'string' ? u.qualification : undefined,
      specialization: typeof u.specialization === 'string' ? u.specialization : undefined,
      appliedAt: typeof u.appliedAt === 'string' ? u.appliedAt : undefined,
      approvedBy: typeof u.approvedBy === 'string' ? u.approvedBy : undefined,
      approvedAt: typeof u.approvedAt === 'string' ? u.approvedAt : undefined,
      rejectedBy: typeof u.rejectedBy === 'string' ? u.rejectedBy : undefined,
      rejectedAt: typeof u.rejectedAt === 'string' ? u.rejectedAt : undefined,
      rejectionReason: typeof u.rejectionReason === 'string' ? u.rejectionReason : undefined,
      lastLoginAt: typeof u.lastLoginAt === 'string' ? u.lastLoginAt : undefined,
      createdAt: u.createdAt || new Date().toISOString(),
      updatedAt: u.updatedAt || new Date().toISOString()
    });
  });
  return users;
}
