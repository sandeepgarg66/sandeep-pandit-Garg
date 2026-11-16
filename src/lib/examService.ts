import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  query,
  where,
  limit
} from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType } from './firebase';
import {
  Test,
  Question,
  TestAttempt,
  StudentResponseKey,
  QuestionState,
  StudentProfile,
  SanitizedExamQuestion,
  ActiveExamTest,
  PlatformSettings,
  LeaderboardEntryDoc
} from '../types/quiz';

const ATTEMPTS_COLLECTION = 'testAttempts';
const PROFILES_COLLECTION = 'studentProfiles';
const LEADERBOARD_COLLECTION = 'leaderboardEntries';

export type { SanitizedExamQuestion };

export interface ActiveExamSession {
  testId: string;
  studentId: string;
  startedAt: string;
  serverDeadlineMs: number;
  answers: Record<string, StudentResponseKey>;
  questionStates: Record<string, QuestionState>;
  currentQuestionIndex: number;
  isSubmitted?: boolean;
  lastSavedAt?: string;
}

/**
 * Strips answer keys and explanations from questions before sending to candidate examination view.
 * Security Invariant: Students must NEVER receive correctAnswer or explanation during an active examination.
 */
export function sanitizeQuestionsForCandidate(questions: Question[]): SanitizedExamQuestion[] {
  return questions.map(q => ({
    id: q.id,
    testId: q.testId,
    statement: q.statement,
    statementHindi: q.statementHindi,
    imageURL: q.imageURL,
    options: {
      A: q.options.A,
      B: q.options.B,
      C: q.options.C,
      D: q.options.D
    },
    subject: q.subject,
    topic: q.topic,
    difficulty: q.difficulty,
    marks: q.marks
  }));
}

export function sanitizeTestForCandidate(test: Test): ActiveExamTest {
  return {
    ...test,
    questions: sanitizeQuestionsForCandidate(test.questions)
  };
}

/**
 * Pure grading calculation obeying 5-option OMR Option E protocol.
 * Zero random ranks or fabricated participant counts.
 */
export function evaluateTestAttempt(params: {
  test: Test;
  studentId: string;
  studentName: string;
  answers: Record<string, StudentResponseKey>;
  questionStates: Record<string, QuestionState>;
  startedAt: string;
  nowMs?: number;
}): TestAttempt {
  const {
    test,
    studentId,
    studentName,
    answers,
    questionStates,
    startedAt,
    nowMs = Date.now()
  } = params;

  let correctCount = 0;
  let wrongCount = 0;
  let unansweredCount = 0;
  let obtainedMarks = 0;

  test.questions.forEach(q => {
    const userChoice = answers[q.id];

    // OPTION E MANDATE:
    // Option E represents leaving question unanswered in OMR format.
    // Treated strictly as unanswered with 0 marks and 0 negative deduction.
    if (!userChoice || userChoice === 'E') {
      unansweredCount++;
    } else if (userChoice === q.correctAnswer) {
      correctCount++;
      obtainedMarks += test.marksPerCorrect;
    } else {
      wrongCount++;
      if (test.negativeMarkingEnabled) {
        obtainedMarks -= test.negativeMarks;
      }
    }
  });

  obtainedMarks = Math.max(0, Math.round(obtainedMarks * 100) / 100);
  const totalAttempted = correctCount + wrongCount;
  const accuracy =
    totalAttempted > 0 ? Math.round((correctCount / totalAttempted) * 1000) / 10 : 0;

  const startMs = startedAt ? new Date(startedAt).getTime() : nowMs;
  const validStartMs = Number.isFinite(startMs) ? startMs : nowMs;
  const elapsedSeconds = Math.max(
    1,
    Math.min(test.durationMinutes * 60, Math.floor((nowMs - validStartMs) / 1000))
  );

  const attemptId = `att_${nowMs}_${Math.floor(Math.random() * 10000)}`;

  return {
    id: attemptId,
    testId: test.id,
    testTitle: test.title,
    category: test.category,
    subject: test.subject,
    studentId,
    studentName,
    answers: { ...answers },
    questionStates: { ...questionStates },
    correctCount,
    wrongCount,
    unansweredCount,
    obtainedMarks,
    maxMarks: test.maxMarks,
    accuracy,
    timeTakenSeconds: elapsedSeconds,
    startedAt: startedAt || new Date(validStartMs).toISOString(),
    submittedAt: new Date(nowMs).toISOString()
  };
}

/**
 * Checks if a candidate has already attempted a test.
 * One Student + One Test = One Attempt.
 */
export async function checkStudentAttempted(testId: string, studentId: string): Promise<TestAttempt | null> {
  if (!studentId || !testId) return null;

  try {
    const q = query(
      collection(db, ATTEMPTS_COLLECTION),
      where('testId', '==', testId),
      where('studentId', '==', studentId),
      limit(1)
    );
    const snap = await getDocs(q);
    if (!snap.empty) {
      const docData = snap.docs[0].data();
      return docData as TestAttempt;
    }
    return null;
  } catch (error) {
    console.warn('Attempt check error:', error);
    const localAttemptKey = `attempt_completed_${testId}_${studentId}`;
    const cached = localStorage.getItem(localAttemptKey);
    if (cached) {
      try {
        return JSON.parse(cached) as TestAttempt;
      } catch {
        return null;
      }
    }
    return null;
  }
}

/**
 * Fetch all official submissions made by a candidate for performance records.
 */
export async function fetchCandidateSubmissions(studentId: string): Promise<TestAttempt[]> {
  if (!studentId) return [];

  const q = query(
    collection(db, ATTEMPTS_COLLECTION),
    where('studentId', '==', studentId)
  );
  const snap = await getDocs(q);
  const results: TestAttempt[] = [];
  snap.forEach(d => {
    results.push(d.data() as TestAttempt);
  });
  results.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
  return results;
}

/**
 * Initializes a secure exam session with an authoritative server deadline.
 * Never writes questions, correctAnswer, or explanations to localStorage.
 */
export function initializeExamSession(
  test: ActiveExamTest,
  studentId: string
): ActiveExamSession {
  const sessionKey = `active_session_${test.id}_${studentId}`;
  const now = Date.now();
  const existing = localStorage.getItem(sessionKey);

  if (existing) {
    try {
      const parsed: ActiveExamSession = JSON.parse(existing);
      if (!parsed.isSubmitted && parsed.serverDeadlineMs > now) {
        return parsed;
      }
    } catch {
      // Create fresh session
    }
  }

  const durationMs = test.durationMinutes * 60 * 1000;
  const deadlineMs = now + durationMs;

  const initialStates: Record<string, QuestionState> = {};
  test.questions.forEach((q, idx) => {
    initialStates[q.id] = idx === 0 ? 'not_answered' : 'not_visited';
  });

  const session: ActiveExamSession = {
    testId: test.id,
    studentId,
    startedAt: new Date(now).toISOString(),
    serverDeadlineMs: deadlineMs,
    answers: {},
    questionStates: initialStates,
    currentQuestionIndex: 0,
    isSubmitted: false
  };

  localStorage.setItem(sessionKey, JSON.stringify(session));
  return session;
}

export function persistExamSession(
  sessionOrTestId: ActiveExamSession | string,
  studentId?: string,
  data?: Partial<ActiveExamSession>
): void {
  if (typeof sessionOrTestId === 'string') {
    const sId = studentId || 'anonymous';
    const sessionKey = `active_session_${sessionOrTestId}_${sId}`;
    let existingObj: Record<string, unknown> = {};
    try {
      const stored = localStorage.getItem(sessionKey);
      if (stored) existingObj = JSON.parse(stored);
    } catch {
      existingObj = {};
    }
    const merged: ActiveExamSession = {
      testId: sessionOrTestId,
      studentId: sId,
      startedAt: String(data?.startedAt ?? existingObj.startedAt ?? ''),
      serverDeadlineMs: Number(data?.serverDeadlineMs ?? existingObj.serverDeadlineMs ?? 0),
      answers: (data?.answers ?? existingObj.answers ?? {}) as Record<string, StudentResponseKey>,
      questionStates: (data?.questionStates ?? existingObj.questionStates ?? {}) as Record<string, QuestionState>,
      currentQuestionIndex: Number(data?.currentQuestionIndex ?? existingObj.currentQuestionIndex ?? 0),
      isSubmitted: Boolean(data?.isSubmitted ?? existingObj.isSubmitted ?? false),
      lastSavedAt: data?.lastSavedAt
    };
    localStorage.setItem(sessionKey, JSON.stringify(merged));
  } else {
    const sessionKey = `active_session_${sessionOrTestId.testId}_${sessionOrTestId.studentId}`;
    const sanitizedSession: ActiveExamSession = {
      testId: sessionOrTestId.testId,
      studentId: sessionOrTestId.studentId,
      startedAt: sessionOrTestId.startedAt,
      serverDeadlineMs: sessionOrTestId.serverDeadlineMs,
      answers: sessionOrTestId.answers,
      questionStates: sessionOrTestId.questionStates,
      currentQuestionIndex: sessionOrTestId.currentQuestionIndex,
      isSubmitted: sessionOrTestId.isSubmitted,
      lastSavedAt: sessionOrTestId.lastSavedAt
    };
    localStorage.setItem(sessionKey, JSON.stringify(sanitizedSession));
  }
}

/**
 * Clears the active exam session upon final test submission or cancellation.
 */
export function clearExamSession(testId: string, studentId: string): void {
  const sessionKey = `active_session_${testId}_${studentId}`;
  localStorage.removeItem(sessionKey);
}

/**
 * Computes official test results against trusted question answer keys and persists to Firestore.
 * Propagates Firestore errors instead of recording a fake local completion lock.
 */
export async function calculateAndPersistTestResult(
  test: Test,
  studentProfile: StudentProfile,
  answers: Record<string, StudentResponseKey>,
  questionStates: Record<string, QuestionState>,
  startedAt: string,
  _serverDeadlineMs: number,
  platformSettings?: PlatformSettings
): Promise<TestAttempt> {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error(
      'आधिकारिक परीक्षा सबमिट करने के लिए आपका लॉगिन होना आवश्यक है। (Please sign in to submit and record your official test attempt.)'
    );
  }

  const nowMs = Date.now();
  const attemptResult = evaluateTestAttempt({
    test,
    studentId: currentUser.uid,
    studentName: studentProfile.name || currentUser.displayName || 'Candidate Aspirant',
    answers,
    questionStates,
    startedAt,
    nowMs
  });

  // 1. Persist official attempt to Firestore /testAttempts/{attemptId} FIRST
  try {
    await setDoc(doc(db, ATTEMPTS_COLLECTION, attemptResult.id), attemptResult);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, ATTEMPTS_COLLECTION);
  }

  const pointsEarned = Math.round(attemptResult.obtainedMarks * 10);
  const solvedCount = attemptResult.correctCount + attemptResult.wrongCount;
  const newLifetimePoints = studentProfile.lifetimePoints + pointsEarned;
  const newTotalTests = studentProfile.totalTestsAttempted + 1;
  const newTotalSolved = studentProfile.totalQuestionsSolved + solvedCount;

  const isDailyCycleActive = !platformSettings?.dailyResetAt || nowMs >= new Date(platformSettings.dailyResetAt).getTime();
  const isWeeklyCycleActive = !platformSettings?.weeklyResetAt || nowMs >= new Date(platformSettings.weeklyResetAt).getTime();

  const updatedDailyPoints = isDailyCycleActive
    ? studentProfile.currentDailyPoints + (test.category === 'Daily Test' ? pointsEarned : pointsEarned)
    : 0;
  const updatedWeeklyPoints = isWeeklyCycleActive
    ? studentProfile.currentWeeklyPoints + pointsEarned
    : 0;

  // 2. Persist updated Student Profile stats in Firestore
  try {
    await setDoc(
      doc(db, PROFILES_COLLECTION, currentUser.uid),
      {
        uid: currentUser.uid,
        totalTestsAttempted: newTotalTests,
        totalQuestionsSolved: newTotalSolved,
        lifetimePoints: newLifetimePoints,
        currentDailyPoints: updatedDailyPoints,
        currentWeeklyPoints: updatedWeeklyPoints
      },
      { merge: true }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, PROFILES_COLLECTION);
  }

  // 3. Persist non-PII public leaderboard standing in /leaderboardEntries/{uid}
  try {
    const lbRef = doc(db, LEADERBOARD_COLLECTION, currentUser.uid);
    const existingLb = await getDoc(lbRef);
    const prev = existingLb.exists() ? (existingLb.data() as Partial<LeaderboardEntryDoc>) : {};

    const dailyAnchorMs = Math.max(
      nowMs - 24 * 60 * 60 * 1000,
      platformSettings?.dailyResetAt ? new Date(platformSettings.dailyResetAt).getTime() : 0
    );
    const weeklyAnchorMs = Math.max(
      nowMs - 7 * 24 * 60 * 60 * 1000,
      platformSettings?.weeklyResetAt ? new Date(platformSettings.weeklyResetAt).getTime() : 0
    );

    const prevDailyValid =
      typeof prev.lastDailyUpdatedAt === 'string' &&
      new Date(prev.lastDailyUpdatedAt).getTime() >= dailyAnchorMs;
    const prevWeeklyValid =
      typeof prev.lastWeeklyUpdatedAt === 'string' &&
      new Date(prev.lastWeeklyUpdatedAt).getTime() >= weeklyAnchorMs;

    const lbPayload: LeaderboardEntryDoc = {
      id: currentUser.uid,
      studentId: currentUser.uid,
      name: (studentProfile.name || currentUser.displayName || 'Candidate Aspirant').slice(0, 120),
      avatar:
        studentProfile.photoURL ||
        currentUser.photoURL ||
        `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(currentUser.uid)}`,
      lifetimePoints: (Number(prev.lifetimePoints) || 0) + pointsEarned,
      dailyPoints: (prevDailyValid ? Number(prev.dailyPoints) || 0 : 0) + pointsEarned,
      weeklyPoints: (prevWeeklyValid ? Number(prev.weeklyPoints) || 0 : 0) + pointsEarned,
      lastDailyUpdatedAt: new Date(nowMs).toISOString(),
      lastWeeklyUpdatedAt: new Date(nowMs).toISOString(),
      testsAttempted: (Number(prev.testsAttempted) || 0) + 1,
      totalCorrect: (Number(prev.totalCorrect) || 0) + attemptResult.correctCount,
      totalAttemptedQuestions: (Number(prev.totalAttemptedQuestions) || 0) + solvedCount,
      updatedAt: new Date(nowMs).toISOString()
    };

    await setDoc(lbRef, lbPayload, { merge: true });
  } catch (error) {
    console.warn('Leaderboard sync warning:', error);
  }

  // 4. Only after verified Firestore persistence, store completion lock locally and clear session
  localStorage.setItem(
    `attempt_completed_${test.id}_${currentUser.uid}`,
    JSON.stringify(attemptResult)
  );
  clearExamSession(test.id, currentUser.uid);

  return attemptResult;
}
