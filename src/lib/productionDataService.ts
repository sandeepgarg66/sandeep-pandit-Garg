import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp
} from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType } from './firebase';
import {
  Test,
  Question,
  TestAttempt,
  StudentProfile,
  TeacherProfile,
  AdminAuditLog,
  NotificationAnnouncement,
  LeaderboardEntry,
  BookmarkedQuestion
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
 * - notifications
 * - auditLogs
 * - bookmarks
 */

export async function fetchRealTests(): Promise<Test[]> {
  try {
    const q = query(collection(db, 'tests'));
    const snap = await getDocs(q);
    const tests: Test[] = [];
    snap.forEach(d => {
      tests.push({ id: d.id, ...d.data() } as Test);
    });
    return tests;
  } catch (error) {
    console.warn('Failed to fetch tests from Firestore:', error);
    return [];
  }
}

export async function fetchRealQuestions(): Promise<Question[]> {
  try {
    const q = query(collection(db, 'questions'));
    const snap = await getDocs(q);
    const questions: Question[] = [];
    snap.forEach(d => {
      questions.push({ id: d.id, ...d.data() } as Question);
    });
    return questions;
  } catch (error) {
    console.warn('Failed to fetch questions from Firestore:', error);
    return [];
  }
}

export async function fetchRealTeachers(): Promise<TeacherProfile[]> {
  try {
    const q = query(collection(db, 'teacherProfiles'));
    const snap = await getDocs(q);
    const teachers: TeacherProfile[] = [];
    snap.forEach(d => {
      teachers.push({ id: d.id, ...d.data() } as TeacherProfile);
    });
    return teachers;
  } catch (error) {
    console.warn('Failed to fetch teacher profiles from Firestore:', error);
    return [];
  }
}

export async function fetchRealStudents(): Promise<AdminStudentItem[]> {
  try {
    const q = query(collection(db, 'users'), where('role', '==', 'student'));
    const snap = await getDocs(q);
    const students: AdminStudentItem[] = [];

    snap.forEach(d => {
      const u = d.data();
      students.push({
        id: d.id,
        name: u.displayName || 'Candidate',
        email: u.email || '',
        attempts: 0,
        points: 0,
        rank: 0,
        status: u.status === 'Suspended' ? 'Suspended' : 'Active'
      });
    });

    return students;
  } catch (error) {
    console.warn('Failed to fetch students from Firestore:', error);
    return [];
  }
}

export async function fetchAllTestAttempts(): Promise<TestAttempt[]> {
  try {
    const q = query(collection(db, 'testAttempts'), orderBy('submittedAt', 'desc'), limit(100));
    const snap = await getDocs(q);
    const attempts: TestAttempt[] = [];
    snap.forEach(d => {
      attempts.push({ id: d.id, ...d.data() } as TestAttempt);
    });
    return attempts;
  } catch (error) {
    console.warn('Failed to fetch test attempts from Firestore:', error);
    return [];
  }
}

export async function fetchRealNotifications(): Promise<NotificationAnnouncement[]> {
  try {
    const q = query(collection(db, 'notifications'));
    const snap = await getDocs(q);
    const notifications: NotificationAnnouncement[] = [];
    snap.forEach(d => {
      notifications.push({ id: d.id, ...d.data() } as NotificationAnnouncement);
    });
    return notifications;
  } catch (error) {
    console.warn('Failed to fetch notifications from Firestore:', error);
    return [];
  }
}

export async function fetchRealAuditLogs(): Promise<AdminAuditLog[]> {
  try {
    const q = query(collection(db, 'auditLogs'), orderBy('timestamp', 'desc'), limit(50));
    const snap = await getDocs(q);
    const logs: AdminAuditLog[] = [];
    snap.forEach(d => {
      logs.push({ id: d.id, ...d.data() } as AdminAuditLog);
    });
    return logs;
  } catch (error) {
    console.warn('Failed to fetch audit logs from Firestore:', error);
    return [];
  }
}

export async function fetchRealBookmarks(uid: string): Promise<BookmarkedQuestion[]> {
  if (!uid) return [];
  try {
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
  } catch (error) {
    console.warn('Failed to fetch bookmarks from Firestore:', error);
    return [];
  }
}

/**
 * Computes official real leaderboards dynamically from actual verified test attempts.
 * Private practice scores are strictly excluded.
 * Only genuine student attempts contribute points.
 */
export function computeRealLeaderboards(
  attempts: TestAttempt[]
): {
  daily: LeaderboardEntry[];
  weekly: LeaderboardEntry[];
  global: LeaderboardEntry[];
} {
  const now = Date.now();
  const ONE_DAY_MS = 24 * 60 * 60 * 1000;
  const ONE_WEEK_MS = 7 * ONE_DAY_MS;

  // Filter valid published test attempts (exclude private practice)
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
      // Points formula: 10 points per mark obtained
      rec.points += Math.round(att.obtainedMarks * 10);
      rec.totalCorrect += att.correctCount;
      rec.totalQuestions += att.correctCount + att.wrongCount;
    });

    const list = Object.values(studentMap);
    // Sort descending by points, tie-breaker: accuracy
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
      let badge: LeaderboardEntry['badge'] = 'Genin';
      if (rank === 1) badge = 'Hokage';
      else if (rank <= 3) badge = 'ANBU';
      else if (rank <= 6) badge = 'Jonin';
      else if (rank <= 9) badge = 'Chunin';

      return {
        rank,
        studentId: item.studentId,
        name: item.name,
        avatar:
          item.avatar ||
          `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(item.name)}`,
        points: item.points,
        accuracy,
        badge,
        testsAttempted: item.testsAttempted,
        change: 'same'
      };
    });
  }

  const daily = aggregatePoints(dateMs => now - dateMs <= ONE_DAY_MS);
  const weekly = aggregatePoints(dateMs => now - dateMs <= ONE_WEEK_MS);
  const global = aggregatePoints();

  return { daily, weekly, global };
}
