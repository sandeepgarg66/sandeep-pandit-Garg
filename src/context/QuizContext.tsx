import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  Test,
  Question,
  TestAttempt,
  StudentProfile,
  StudentResponseKey,
  QuestionState,
  UserRole,
  BookmarkedQuestion,
  TeacherProfile,
  AdminAuditLog,
  NotificationAnnouncement,
  PYQSet,
  PlatformSettings,
  SubjectItem,
  UserAccount
} from '../types/quiz';
import {
  MOCK_TESTS,
  MOCK_QUESTIONS,
  INITIAL_STUDENT_PROFILE,
  INITIAL_BOOKMARKS,
  DAILY_LEADERBOARD,
  WEEKLY_LEADERBOARD,
  GLOBAL_LEADERBOARD,
  MOCK_TEACHERS,
  MOCK_AUDIT_LOGS,
  MOCK_NOTIFICATIONS,
  MOCK_PYQS,
  INITIAL_PLATFORM_SETTINGS,
  SUBJECTS_LIST
} from '../data/mockData';
import {
  auth,
  db,
  handleFirestoreError,
  OperationType,
  signInWithGoogle,
  logOutUser
} from '../lib/firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import {
  initializeExamSession,
  persistExamSession,
  clearExamSession,
  calculateAndPersistTestResult,
  checkStudentAttempted,
  fetchCandidateSubmissions,
  ActiveExamSession
} from '../lib/examService';
import {
  fetchRealTests,
  fetchRealQuestions,
  fetchRealTeachers,
  fetchRealStudents,
  fetchAllTestAttempts,
  fetchRealNotifications,
  fetchRealAuditLogs,
  fetchRealBookmarks,
  computeRealLeaderboards,
  fetchRealUsers
} from '../lib/productionDataService';

export interface AdminStudentItem {
  id: string;
  name: string;
  email: string;
  attempts: number;
  points: number;
  rank: number;
  status: 'Active' | 'Suspended';
}

interface ActiveExamState {
  test: Test | null;
  status: 'idle' | 'instructions' | 'in_progress' | 'submitted' | 'review';
  currentQuestionIndex: number;
  answers: Record<string, StudentResponseKey>;
  questionStates: Record<string, QuestionState>;
  remainingSeconds: number;
  lastAttemptResult: TestAttempt | null;
  serverDeadlineMs: number;
  startedAt: string;
}

interface QuizContextType {
  // Navigation & Role
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  activeSection: string;
  setActiveSection: (section: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;

  // Data Stores
  tests: Test[];
  questions: Question[];
  studentProfile: StudentProfile;
  setStudentProfile: React.Dispatch<React.SetStateAction<StudentProfile>>;
  completedAttempts: TestAttempt[];
  bookmarks: BookmarkedQuestion[];
  dailyLeaderboard: typeof DAILY_LEADERBOARD;
  weeklyLeaderboard: typeof WEEKLY_LEADERBOARD;
  globalLeaderboard: typeof GLOBAL_LEADERBOARD;
  teachers: TeacherProfile[];
  auditLogs: AdminAuditLog[];
  notifications: NotificationAnnouncement[];
  pyqs: PYQSet[];
  platformSettings: PlatformSettings;
  subjects: SubjectItem[];
  allStudents: AdminStudentItem[];

  // Examination Engine
  activeExam: ActiveExamState;
  startTestInstructions: (test: Test) => void;
  beginExamination: () => void;
  selectAnswer: (questionId: string, option: StudentResponseKey) => void;
  clearResponse: (questionId: string) => void;
  markForReview: (questionId: string) => void;
  saveAndNext: () => void;
  previousQuestion: () => void;
  jumpToQuestion: (index: number) => void;
  submitTest: () => void;
  cancelExam: () => void;
  startReview: () => void;

  // Question & Attempt Operations
  hasAttempted: (testId: string) => boolean;
  getAttemptForTest: (testId: string) => TestAttempt | undefined;
  toggleBookmark: (question: Question) => void;
  isBookmarked: (questionId: string) => boolean;

  // Teacher & Admin Actions
  addQuestion: (q: Omit<Question, 'id'>) => void;
  addBulkQuestions: (questionsList: Omit<Question, 'id'>[]) => { added: number; duplicates: number; failed: number };
  addQuestionsToTest: (testId: string, questionsList: Question[]) => void;
  updateQuestion: (id: string, updated: Partial<Question>) => void;
  deleteQuestion: (id: string) => void;
  createTest: (testData: Omit<Test, 'id' | 'createdAt' | 'status'>) => void;
  approveTest: (testId: string) => void;
  rejectTest: (testId: string, reason?: string) => void;
  publishTest: (testId: string) => void;
  unpublishTest: (testId: string) => void;
  scheduleTest: (testId: string, startDate: string, endDate: string) => void;
  archiveTest: (testId: string) => void;
  updateTest: (testId: string, updatedData: Partial<Test>) => Promise<void>;
  deleteTest: (testId: string) => Promise<void>;

  // Admin Specific Controls
  allUsers: UserAccount[];
  updateStudentStatus: (studentId: string, status: 'Active' | 'Suspended') => void;
  approveTeacher: (teacherId: string) => void;
  rejectTeacher: (teacherId: string) => void;
  suspendTeacher: (teacherId: string) => void;
  promoteUserToAdmin: (targetUid: string) => Promise<void>;
  revokeAdminRole: (targetUid: string, fallbackRole?: 'student' | 'teacher') => Promise<void>;
  addNotification: (notif: Omit<NotificationAnnouncement, 'id' | 'createdAt'>) => void;
  toggleNotificationStatus: (id: string) => void;
  deleteNotification: (id: string) => void;
  addPYQ: (pyq: Omit<PYQSet, 'id'>) => void;
  updatePlatformSettings: (settings: Partial<PlatformSettings>) => void;
  addAuditLog: (log: Omit<AdminAuditLog, 'id' | 'timestamp'>) => void;
  addSubject: (subject: SubjectItem) => void;
  updateSubject: (id: string, updated: Partial<SubjectItem>) => void;
  resetLeaderboard: (type: 'daily' | 'weekly') => void;

  // Real Firebase Auth & Modal Controls
  firebaseUser: FirebaseUser | null;
  teacherStatus: 'Approved' | 'Pending' | 'Suspended' | null;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalMode: 'login' | 'register';
  openAuthModal: (mode: 'login' | 'register') => void;
  closeAuthModal: () => void;
  isRoleSelectionModalOpen: boolean;
  setIsRoleSelectionModalOpen: (open: boolean) => void;
  assignRoleToCurrentUser: (role: 'student' | 'teacher', details?: { qualification?: string; specialization?: string }) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export const QuizProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<UserRole>('student');
  const [activeSection, setActiveSection] = useState<string>('home');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);

  const [tests, setTests] = useState<Test[]>(MOCK_TESTS);
  const [questions, setQuestions] = useState<Question[]>(MOCK_QUESTIONS);
  const [studentProfile, setStudentProfile] = useState<StudentProfile>(INITIAL_STUDENT_PROFILE);
  const [completedAttempts, setCompletedAttempts] = useState<TestAttempt[]>([]);
  const [bookmarks, setBookmarks] = useState<BookmarkedQuestion[]>(INITIAL_BOOKMARKS);
  const [teachers, setTeachers] = useState<TeacherProfile[]>(MOCK_TEACHERS);
  const [auditLogs, setAuditLogs] = useState<AdminAuditLog[]>(MOCK_AUDIT_LOGS);
  const [notifications, setNotifications] = useState<NotificationAnnouncement[]>(MOCK_NOTIFICATIONS);
  const [pyqs, setPYQs] = useState<PYQSet[]>(MOCK_PYQS);
  const [platformSettings, setPlatformSettings] = useState<PlatformSettings>(INITIAL_PLATFORM_SETTINGS);
  const [subjects, setSubjects] = useState<SubjectItem[]>(SUBJECTS_LIST);
  const [dailyLeaderboardState, setDailyLeaderboardState] = useState(DAILY_LEADERBOARD);
  const [weeklyLeaderboardState, setWeeklyLeaderboardState] = useState(WEEKLY_LEADERBOARD);

  const [allStudents, setAllStudents] = useState<AdminStudentItem[]>([]);

  const [activeExam, setActiveExam] = useState<ActiveExamState>({
    test: null,
    status: 'idle',
    currentQuestionIndex: 0,
    answers: {},
    questionStates: {},
    remainingSeconds: 0,
    lastAttemptResult: null,
    serverDeadlineMs: 0,
    startedAt: ''
  });

  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [teacherStatus, setTeacherStatus] = useState<'Approved' | 'Pending' | 'Suspended' | null>(null);
  const [allUsers, setAllUsers] = useState<UserAccount[]>([]);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [isRoleSelectionModalOpen, setIsRoleSelectionModalOpen] = useState(false);

  const openAuthModal = (m: 'login' | 'register') => {
    setAuthModalMode(m);
    setIsAuthModalOpen(true);
  };
  const closeAuthModal = () => setIsAuthModalOpen(false);

  // Load real production data from Firestore on mount
  useEffect(() => {
    let isMounted = true;
    async function loadProductionData() {
      try {
        const [realTests, realQuestions, realTeachers, realStudents, allAttempts, realNotifs, realLogs, realUsers] = await Promise.all([
          fetchRealTests(),
          fetchRealQuestions(),
          fetchRealTeachers(),
          fetchRealStudents(),
          fetchAllTestAttempts(),
          fetchRealNotifications(),
          fetchRealAuditLogs(),
          fetchRealUsers()
        ]);

        if (!isMounted) return;

        if (realTests && realTests.length > 0) setTests(realTests);
        if (realQuestions && realQuestions.length > 0) setQuestions(realQuestions);
        if (realTeachers && realTeachers.length > 0) setTeachers(realTeachers);
        if (realStudents && realStudents.length > 0) setAllStudents(realStudents);
        if (realUsers && realUsers.length > 0) setAllUsers(realUsers);
        if (allAttempts && allAttempts.length > 0) {
          setCompletedAttempts(allAttempts);
          const computed = computeRealLeaderboards(allAttempts);
          setDailyLeaderboardState(computed.daily);
          setWeeklyLeaderboardState(computed.weekly);
        }
        if (realNotifs && realNotifs.length > 0) setNotifications(realNotifs);
        if (realLogs && realLogs.length > 0) setAuditLogs(realLogs);
      } catch (err) {
        console.warn('Failed to load initial Firestore data:', err);
      }
    }

    loadProductionData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Sync Firebase Auth state, verify roles in Firestore, and fetch candidate data
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async user => {
      setFirebaseUser(user);
      if (user) {
        // Owner verification: sandeepgarg6375494692@gmail.com is the permanent root administrator
        if (user.email === 'sandeepgarg6375494692@gmail.com') {
          setCurrentRole('admin');
          try {
            await setDoc(doc(db, 'users', user.uid), {
              uid: user.uid,
              id: user.uid,
              name: user.displayName || 'Sandeep Garg (Owner)',
              displayName: user.displayName || 'Sandeep Garg (Owner)',
              email: user.email,
              photoURL: user.photoURL || '',
              role: 'admin',
              accountStatus: 'Active',
              teacherApprovalStatus: 'None',
              updatedAt: new Date().toISOString()
            }, { merge: true });
          } catch (e) {
            console.warn('Owner profile sync notice:', e);
          }
        } else {
          try {
            const userSnap = await getDoc(doc(db, 'users', user.uid));
            if (userSnap.exists() && userSnap.data()?.role) {
              const uData = userSnap.data();
              if (uData.role === 'admin') {
                setCurrentRole('admin');
              } else if (uData.role === 'teacher') {
                setCurrentRole('teacher');
                const tchDoc = await getDoc(doc(db, 'teacherProfiles', user.uid));
                if (tchDoc.exists()) {
                  setTeacherStatus(tchDoc.data().status);
                } else {
                  setTeacherStatus('Pending');
                }
              } else {
                setCurrentRole('student');
              }
            } else {
              // Role not yet assigned in Firestore! Prompt role selection modal
              setIsRoleSelectionModalOpen(true);
            }
          } catch (e) {
            console.warn('User role fetch error:', e);
          }
        }

        // Fetch candidate real submissions and bookmarks from Firestore
        let userAttempts: TestAttempt[] = [];
        try {
          userAttempts = await fetchCandidateSubmissions(user.uid);
          if (userAttempts && userAttempts.length > 0) {
            setCompletedAttempts(userAttempts);
          }
        } catch (e) {
          console.warn('Submissions fetch error:', e);
        }

        try {
          const userBookmarks = await fetchRealBookmarks(user.uid);
          if (userBookmarks && userBookmarks.length > 0) {
            setBookmarks(userBookmarks);
          }
        } catch (e) {
          console.warn('Bookmarks fetch error:', e);
        }

        // Calculate verified candidate statistics strictly from real attempts
        const totalAttempts = userAttempts ? userAttempts.length : 0;
        const totalSolved = userAttempts
          ? userAttempts.reduce((acc, a) => acc + (a.correctCount + a.wrongCount), 0)
          : 0;
        const avgAcc =
          totalAttempts > 0
            ? Math.round((userAttempts.reduce((acc, a) => acc + a.accuracy, 0) / totalAttempts) * 10) / 10
            : 0;
        const pts = userAttempts
          ? userAttempts.reduce((acc, a) => acc + Math.round(a.obtainedMarks * 10), 0)
          : 0;
        const recentActs = userAttempts
          ? userAttempts.slice(0, 5).map(att => ({
              testName: att.testTitle,
              date: new Date(att.submittedAt).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
              }),
              score: att.obtainedMarks,
              maxScore: att.maxMarks,
              accuracy: att.accuracy
            }))
          : [];

        setStudentProfile({
          uid: user.uid,
          name: user.displayName || 'Candidate Aspirant',
          email: user.email || '',
          photoURL:
            user.photoURL ||
            `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(user.displayName || user.uid)}`,
          rankTitle: totalAttempts > 0 ? 'Verified Aspirant' : 'Candidate Aspirant',
          totalTestsAttempted: totalAttempts,
          totalQuestionsSolved: totalSolved,
          averageAccuracy: avgAcc,
          lifetimePoints: pts,
          currentDailyPoints: 0,
          currentWeeklyPoints: 0,
          currentGlobalRank: 0,
          streakDays: totalAttempts > 0 ? 1 : 0,
          recentTestActivity: recentActs
        });
      } else {
        setTeacherStatus(null);
        setStudentProfile(INITIAL_STUDENT_PROFILE);
      }
    });
    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    try {
      const user = await signInWithGoogle();
      if (user?.email === 'sandeepgarg6375494692@gmail.com') {
        setCurrentRole('admin');
        setActiveSection('admin-dashboard');
      }
    } catch (error) {
      console.error('Google sign-in error:', error);
    }
  };

  const logout = async () => {
    try {
      await logOutUser();
      setFirebaseUser(null);
      setTeacherStatus(null);
      setCurrentRole('student');
      setActiveSection('home');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Authoritative Server-Deadline Timer effect during exam
  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | null = null;
    if (activeExam.status === 'in_progress' && activeExam.serverDeadlineMs > 0) {
      timer = setInterval(() => {
        const remaining = Math.max(0, Math.floor((activeExam.serverDeadlineMs - Date.now()) / 1000));
        setActiveExam(prev => {
          if (remaining <= 0) {
            return {
              ...prev,
              remainingSeconds: 0
            };
          }
          return {
            ...prev,
            remainingSeconds: remaining
          };
        });
      }, 1000);
    } else if (activeExam.status === 'in_progress' && activeExam.remainingSeconds === 0 && activeExam.test) {
      // Automatic Submission when countdown reaches zero
      submitTest();
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [activeExam.status, activeExam.serverDeadlineMs, activeExam.remainingSeconds]);

  // One Attempt Policy Check
  const hasAttempted = (testId: string) => {
    return completedAttempts.some(a => a.testId === testId);
  };

  const getAttemptForTest = (testId: string) => {
    return completedAttempts.find(a => a.testId === testId);
  };

  const startTestInstructions = async (test: Test) => {
    const uid = auth.currentUser ? auth.currentUser.uid : studentProfile.uid;

    // Check One Attempt Policy
    const pastAttempt = await checkStudentAttempted(test.id, uid);
    if (pastAttempt || hasAttempted(test.id)) {
      alert(`One Student = One Attempt Policy Enforced:\nYou have already submitted '${test.title}'. Retaking an official competitive examination is strictly prohibited.`);
      return;
    }

    const initialStates: Record<string, QuestionState> = {};
    test.questions.forEach((q, idx) => {
      initialStates[q.id] = idx === 0 ? 'not_answered' : 'not_visited';
    });

    setActiveExam({
      test,
      status: 'instructions',
      currentQuestionIndex: 0,
      answers: {},
      questionStates: initialStates,
      remainingSeconds: test.durationMinutes * 60,
      lastAttemptResult: null,
      serverDeadlineMs: 0,
      startedAt: ''
    });
    setActiveSection('exam');
  };

  const beginExamination = () => {
    if (!activeExam.test) return;
    const uid = auth.currentUser ? auth.currentUser.uid : studentProfile.uid;
    const session = initializeExamSession(activeExam.test, uid);
    const remainingSecs = Math.max(0, Math.floor((session.serverDeadlineMs - Date.now()) / 1000));

    setActiveExam(prev => ({
      ...prev,
      status: 'in_progress',
      answers: session.answers,
      questionStates: session.questionStates,
      currentQuestionIndex: session.currentQuestionIndex,
      serverDeadlineMs: session.serverDeadlineMs,
      startedAt: session.startedAt,
      remainingSeconds: remainingSecs
    }));
  };

  const selectAnswer = (questionId: string, option: StudentResponseKey) => {
    setActiveExam(prev => {
      const newAnswers = { ...prev.answers, [questionId]: option };
      const currentQState = prev.questionStates[questionId];
      const newQuestionStates = {
        ...prev.questionStates,
        [questionId]:
          currentQState === 'marked_for_review' || currentQState === 'answered_and_marked'
            ? ('answered_and_marked' as QuestionState)
            : ('answered' as QuestionState)
      };

      if (prev.test) {
        const uid = auth.currentUser ? auth.currentUser.uid : studentProfile.uid;
        persistExamSession(prev.test.id, uid, {
          testId: prev.test.id,
          studentId: uid,
          startedAt: prev.startedAt,
          serverDeadlineMs: prev.serverDeadlineMs,
          currentQuestionIndex: prev.currentQuestionIndex,
          answers: newAnswers,
          questionStates: newQuestionStates,
          lastSavedAt: new Date().toISOString()
        });
      }

      return {
        ...prev,
        answers: newAnswers,
        questionStates: newQuestionStates
      };
    });
  };

  const clearResponse = (questionId: string) => {
    setActiveExam(prev => {
      const newAnswers = { ...prev.answers };
      delete newAnswers[questionId];

      const currentQState = prev.questionStates[questionId];
      const newQuestionStates = {
        ...prev.questionStates,
        [questionId]:
          currentQState === 'answered_and_marked'
            ? ('marked_for_review' as QuestionState)
            : ('not_answered' as QuestionState)
      };

      if (prev.test) {
        const uid = auth.currentUser ? auth.currentUser.uid : studentProfile.uid;
        persistExamSession(prev.test.id, uid, {
          testId: prev.test.id,
          studentId: uid,
          startedAt: prev.startedAt,
          serverDeadlineMs: prev.serverDeadlineMs,
          currentQuestionIndex: prev.currentQuestionIndex,
          answers: newAnswers,
          questionStates: newQuestionStates,
          lastSavedAt: new Date().toISOString()
        });
      }

      return {
        ...prev,
        answers: newAnswers,
        questionStates: newQuestionStates
      };
    });
  };

  const markForReview = (questionId: string) => {
    setActiveExam(prev => {
      const hasAnswer = !!prev.answers[questionId];
      const newQuestionStates = {
        ...prev.questionStates,
        [questionId]: (hasAnswer ? 'answered_and_marked' : 'marked_for_review') as QuestionState
      };

      if (prev.test) {
        const uid = auth.currentUser ? auth.currentUser.uid : studentProfile.uid;
        persistExamSession(prev.test.id, uid, {
          testId: prev.test.id,
          studentId: uid,
          startedAt: prev.startedAt,
          serverDeadlineMs: prev.serverDeadlineMs,
          currentQuestionIndex: prev.currentQuestionIndex,
          answers: prev.answers,
          questionStates: newQuestionStates,
          lastSavedAt: new Date().toISOString()
        });
      }

      return {
        ...prev,
        questionStates: newQuestionStates
      };
    });
  };

  const jumpToQuestion = (index: number) => {
    if (!activeExam.test || index < 0 || index >= activeExam.test.questions.length) return;
    const targetQ = activeExam.test.questions[index];
    setActiveExam(prev => {
      const updatedStates = { ...prev.questionStates };
      if (updatedStates[targetQ.id] === 'not_visited') {
        updatedStates[targetQ.id] = 'not_answered';
      }

      if (prev.test) {
        const uid = auth.currentUser ? auth.currentUser.uid : studentProfile.uid;
        persistExamSession(prev.test.id, uid, {
          testId: prev.test.id,
          studentId: uid,
          startedAt: prev.startedAt,
          serverDeadlineMs: prev.serverDeadlineMs,
          currentQuestionIndex: index,
          answers: prev.answers,
          questionStates: updatedStates,
          lastSavedAt: new Date().toISOString()
        });
      }

      return {
        ...prev,
        currentQuestionIndex: index,
        questionStates: updatedStates
      };
    });
  };

  const saveAndNext = () => {
    if (!activeExam.test) return;
    const nextIdx = activeExam.currentQuestionIndex + 1;
    if (nextIdx < activeExam.test.questions.length) {
      jumpToQuestion(nextIdx);
    }
  };

  const previousQuestion = () => {
    if (!activeExam.test) return;
    const prevIdx = activeExam.currentQuestionIndex - 1;
    if (prevIdx >= 0) {
      jumpToQuestion(prevIdx);
    }
  };

  const submitTest = async () => {
    if (!activeExam.test) return;
    const test = activeExam.test;
    const uid = auth.currentUser ? auth.currentUser.uid : studentProfile.uid;

    const attemptResult = await calculateAndPersistTestResult(
      test,
      studentProfile,
      activeExam.answers,
      activeExam.questionStates,
      activeExam.startedAt,
      activeExam.serverDeadlineMs
    );

    clearExamSession(test.id, uid);

    setCompletedAttempts(prev => [attemptResult, ...prev]);

    // Update Student Profile Stats
    setStudentProfile(prev => {
      const newTotal = prev.totalTestsAttempted + 1;
      const newPoints = prev.lifetimePoints + Math.round(attemptResult.obtainedMarks * 10);
      return {
        ...prev,
        totalTestsAttempted: newTotal,
        totalQuestionsSolved: prev.totalQuestionsSolved + (attemptResult.correctCount + attemptResult.wrongCount),
        lifetimePoints: newPoints,
        recentTestActivity: [
          {
            testName: test.title,
            date: 'Just now',
            score: attemptResult.obtainedMarks,
            maxScore: test.maxMarks,
            accuracy: attemptResult.accuracy
          },
          ...prev.recentTestActivity.slice(0, 4)
        ]
      };
    });

    setActiveExam(prev => ({
      ...prev,
      status: 'submitted',
      lastAttemptResult: attemptResult
    }));
  };

  const cancelExam = () => {
    if (activeExam.test) {
      const uid = auth.currentUser ? auth.currentUser.uid : studentProfile.uid;
      clearExamSession(activeExam.test.id, uid);
    }
    setActiveExam({
      test: null,
      status: 'idle',
      currentQuestionIndex: 0,
      answers: {},
      questionStates: {},
      remainingSeconds: 0,
      lastAttemptResult: null,
      serverDeadlineMs: 0,
      startedAt: ''
    });
    setActiveSection('home');
  };

  const startReview = () => {
    setActiveExam(prev => ({ ...prev, status: 'review' }));
  };

  const toggleBookmark = (question: Question) => {
    setBookmarks(prev => {
      const exists = prev.some(b => b.questionId === question.id);
      if (exists) {
        return prev.filter(b => b.questionId !== question.id);
      } else {
        return [
          {
            questionId: question.id,
            question,
            savedDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
          },
          ...prev
        ];
      }
    });
  };

  const isBookmarked = (questionId: string) => {
    return bookmarks.some(b => b.questionId === questionId);
  };

  // Helper for dynamic actor identification
  const getActorName = (roleOverride?: 'Admin' | 'Teacher' | 'Student') => {
    const role =
      roleOverride ||
      (currentRole === 'admin' ? 'Admin' : currentRole === 'teacher' ? 'Teacher' : 'Student');
    if (firebaseUser?.displayName) {
      return `${firebaseUser.displayName} (${role})`;
    }
    if (firebaseUser?.email) {
      return `${firebaseUser.email} (${role})`;
    }
    return role === 'Admin'
      ? 'System Administrator'
      : role === 'Teacher'
      ? 'Faculty Educator'
      : 'Candidate Aspirant';
  };

  // Teacher / Admin Actions
  const addQuestion = (q: Omit<Question, 'id'>) => {
    const newQ: Question = {
      ...q,
      id: `q-${Date.now()}`
    };
    setQuestions(prev => [newQ, ...prev]);
    if (auth.currentUser) {
      setDoc(doc(db, 'questions', newQ.id), newQ).catch(err => {
        handleFirestoreError(err, OperationType.WRITE, 'questions');
      });
    }
    addAuditLog({
      actor: getActorName(),
      actorRole: currentRole === 'admin' ? 'Admin' : 'Teacher',
      action: 'Added New Question',
      target: `${q.subject} - ${q.topic}`,
      status: 'Success'
    });
  };

  const addBulkQuestions = (newQuestions: Omit<Question, 'id'>[]) => {
    let added = 0;
    let duplicates = 0;
    let failed = 0;

    const currentStatements = new Set(questions.map(q => q.statement.trim().toLowerCase()));
    const validQuestions: Question[] = [];

    newQuestions.forEach(q => {
      if (
        !q.statement ||
        !q.options.A ||
        !q.options.B ||
        !q.options.C ||
        !q.options.D ||
        !['A', 'B', 'C', 'D'].includes(q.correctAnswer)
      ) {
        failed++;
        return;
      }

      if (currentStatements.has(q.statement.trim().toLowerCase())) {
        duplicates++;
        return;
      }

      currentStatements.add(q.statement.trim().toLowerCase());
      const item: Question = {
        ...q,
        id: `q-bulk-${Date.now()}-${Math.floor(Math.random() * 10000)}`
      };
      validQuestions.push(item);
      added++;

      // Persist to Firestore if authenticated
      if (auth.currentUser) {
        setDoc(doc(db, 'questions', item.id), item).catch(err => {
          handleFirestoreError(err, OperationType.WRITE, 'questions');
        });
      }
    });

    if (validQuestions.length > 0) {
      setQuestions(prev => [...validQuestions, ...prev]);
      addAuditLog({
        actor: getActorName(),
        actorRole: currentRole === 'admin' ? 'Admin' : 'Teacher',
        action: `Bulk Imported ${validQuestions.length} Questions`,
        target: `${validQuestions.length} questions into Question Bank`,
        status: 'Success'
      });
    }

    return { added, duplicates, failed };
  };

  const addQuestionsToTest = (testId: string, newQs: Question[]) => {
    setTests(prev =>
      prev.map(t => {
        if (t.id !== testId) return t;
        const combined = [...t.questions, ...newQs];
        const updated = {
          ...t,
          questions: combined,
          totalQuestions: combined.length,
          maxMarks: combined.length * t.marksPerCorrect
        };
        if (auth.currentUser) {
          updateDoc(doc(db, 'tests', testId), {
            questions: combined,
            totalQuestions: combined.length,
            maxMarks: combined.length * t.marksPerCorrect
          }).catch(err => {
            handleFirestoreError(err, OperationType.UPDATE, 'tests');
          });
        }
        return updated;
      })
    );
    addAuditLog({
      actor: getActorName(),
      actorRole: currentRole === 'admin' ? 'Admin' : 'Teacher',
      action: `Appended ${newQs.length} Questions to Test`,
      target: `Test ID: ${testId}`,
      status: 'Success'
    });
  };

  const updateQuestion = (id: string, updated: Partial<Question>) => {
    setQuestions(prev => prev.map(q => (q.id === id ? { ...q, ...updated } : q)));
    if (auth.currentUser) {
      updateDoc(doc(db, 'questions', id), updated).catch(err => {
        handleFirestoreError(err, OperationType.UPDATE, 'questions');
      });
    }
    addAuditLog({
      actor: getActorName('Admin'),
      actorRole: 'Admin',
      action: 'Updated Question Content',
      target: `Question ID: ${id}`,
      status: 'Success'
    });
  };

  const deleteQuestion = (id: string) => {
    setQuestions(prev => prev.filter(q => q.id !== id));
    addAuditLog({
      actor: getActorName('Admin'),
      actorRole: 'Admin',
      action: 'Deleted Question from Bank',
      target: `Question ID: ${id}`,
      status: 'Warning'
    });
  };

  const createTest = (testData: Omit<Test, 'id' | 'createdAt' | 'status'>) => {
    const creatorName = firebaseUser?.displayName || (currentRole === 'admin' ? 'Administrator' : 'Educator');
    const creatorUid = auth.currentUser?.uid || 'Faculty Educator';
    const isSysAdmin = currentRole === 'admin' || auth.currentUser?.email === 'sandeepgarg6375494692@gmail.com';

    const newTest: Test = {
      ...testData,
      id: `test-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: isSysAdmin ? 'Published' : 'Pending Approval',
      createdBy: creatorUid,
      teacherName: creatorName
    };
    setTests(prev => [newTest, ...prev]);
    if (auth.currentUser) {
      setDoc(doc(db, 'tests', newTest.id), newTest).catch(err => {
        handleFirestoreError(err, OperationType.WRITE, 'tests');
      });
    }
    addAuditLog({
      actor: getActorName(),
      actorRole: isSysAdmin ? 'Admin' : 'Teacher',
      action: isSysAdmin ? 'Created & Published Test' : 'Created Test Draft',
      target: testData.title,
      status: 'Success'
    });
  };

  const approveTest = (testId: string) => {
    setTests(prev => prev.map(t => (t.id === testId ? { ...t, status: 'Published' as const } : t)));
    if (auth.currentUser) {
      updateDoc(doc(db, 'tests', testId), { status: 'Published' }).catch(err => {
        handleFirestoreError(err, OperationType.UPDATE, 'tests');
      });
    }
    const testTitle = tests.find(t => t.id === testId)?.title || testId;
    addAuditLog({
      actor: getActorName('Admin'),
      actorRole: 'Admin',
      action: 'Approved & Published Assessment',
      target: testTitle,
      status: 'Success'
    });
  };

  const rejectTest = (testId: string, reason?: string) => {
    setTests(prev => prev.map(t => (t.id === testId ? { ...t, status: 'Draft' as const } : t)));
    if (auth.currentUser) {
      updateDoc(doc(db, 'tests', testId), { status: 'Draft' }).catch(err => {
        handleFirestoreError(err, OperationType.UPDATE, 'tests');
      });
    }
    const testTitle = tests.find(t => t.id === testId)?.title || testId;
    addAuditLog({
      actor: getActorName('Admin'),
      actorRole: 'Admin',
      action: `Rejected Assessment: ${reason || 'Changes Requested'}`,
      target: testTitle,
      status: 'Warning'
    });
  };

  const publishTest = (testId: string) => {
    approveTest(testId);
  };

  const unpublishTest = (testId: string) => {
    setTests(prev => prev.map(t => (t.id === testId ? { ...t, status: 'Draft' as const } : t)));
    if (auth.currentUser) {
      updateDoc(doc(db, 'tests', testId), { status: 'Draft' }).catch(err => {
        handleFirestoreError(err, OperationType.UPDATE, 'tests');
      });
    }
    const testTitle = tests.find(t => t.id === testId)?.title || testId;
    addAuditLog({
      actor: getActorName('Admin'),
      actorRole: 'Admin',
      action: 'Unpublished Assessment to Draft',
      target: testTitle,
      status: 'Notice'
    });
  };

  const scheduleTest = (testId: string, startDate: string, endDate: string) => {
    setTests(prev => prev.map(t => (t.id === testId ? { ...t, status: 'Scheduled' as const, startDate, endDate } : t)));
    if (auth.currentUser) {
      updateDoc(doc(db, 'tests', testId), { status: 'Scheduled', startDate, endDate }).catch(err => {
        handleFirestoreError(err, OperationType.UPDATE, 'tests');
      });
    }
    const testTitle = tests.find(t => t.id === testId)?.title || testId;
    addAuditLog({
      actor: getActorName('Admin'),
      actorRole: 'Admin',
      action: `Scheduled Assessment for ${startDate} to ${endDate}`,
      target: testTitle,
      status: 'Success'
    });
  };

  const archiveTest = (testId: string) => {
    setTests(prev => prev.map(t => (t.id === testId ? { ...t, status: 'Archived' as const } : t)));
    if (auth.currentUser) {
      updateDoc(doc(db, 'tests', testId), { status: 'Archived' }).catch(err => {
        handleFirestoreError(err, OperationType.UPDATE, 'tests');
      });
    }
    const testTitle = tests.find(t => t.id === testId)?.title || testId;
    addAuditLog({
      actor: getActorName('Admin'),
      actorRole: 'Admin',
      action: 'Archived Assessment from Catalog',
      target: testTitle,
      status: 'Warning'
    });
  };

  const updateTest = async (testId: string, updatedData: Partial<Test>) => {
    const existingTest = tests.find(t => t.id === testId);
    if (!existingTest) throw new Error('Test not found');

    const currentUserUid = auth.currentUser?.uid;
    const isOwner = currentUserUid && existingTest.createdBy === currentUserUid;
    const isSysAdmin = currentRole === 'admin' || auth.currentUser?.email === 'sandeepgarg6375494692@gmail.com';

    if (!isOwner && !isSysAdmin) {
      throw new Error('Unauthorized: You can only edit tests you created.');
    }

    // Critical security: If a teacher modifies a test, preserve createdBy UID.
    // If test was already 'Published', modifying it resets status to 'Pending Approval' for moderation.
    let newStatus = updatedData.status || existingTest.status;
    if (!isSysAdmin && existingTest.status === 'Published') {
      newStatus = 'Pending Approval';
    }

    const sanitized: Partial<Test> = {
      ...updatedData,
      status: newStatus,
      createdBy: existingTest.createdBy // Protected: ownership cannot be transferred!
    };

    setTests(prev => prev.map(t => (t.id === testId ? { ...t, ...sanitized } : t)));

    if (auth.currentUser) {
      await updateDoc(doc(db, 'tests', testId), sanitized).catch(err => {
        handleFirestoreError(err, OperationType.UPDATE, 'tests');
      });
    }

    addAuditLog({
      actor: getActorName(),
      actorRole: isSysAdmin ? 'Admin' : 'Teacher',
      action: `Updated Test: ${existingTest.title} (Status: ${newStatus})`,
      target: existingTest.title,
      status: 'Success'
    });
  };

  const deleteTest = async (testId: string) => {
    const existingTest = tests.find(t => t.id === testId);
    if (!existingTest) throw new Error('Test not found');

    const currentUserUid = auth.currentUser?.uid;
    const isOwner = currentUserUid && existingTest.createdBy === currentUserUid;
    const isSysAdmin = currentRole === 'admin' || auth.currentUser?.email === 'sandeepgarg6375494692@gmail.com';

    if (!isOwner && !isSysAdmin) {
      throw new Error('Unauthorized: You can only delete tests you created.');
    }

    if (!isSysAdmin && existingTest.status === 'Published') {
      throw new Error('Cannot delete a published test. Request an administrator to unpublish or archive.');
    }

    setTests(prev => prev.filter(t => t.id !== testId));

    if (auth.currentUser) {
      await deleteDoc(doc(db, 'tests', testId)).catch(err => {
        handleFirestoreError(err, OperationType.DELETE, 'tests');
      });
    }

    addAuditLog({
      actor: getActorName(),
      actorRole: isSysAdmin ? 'Admin' : 'Teacher',
      action: `Deleted Test Document: ${existingTest.title}`,
      target: existingTest.title,
      status: 'Warning'
    });
  };

  const promoteUserToAdmin = async (targetUid: string) => {
    if (auth.currentUser?.email !== 'sandeepgarg6375494692@gmail.com') {
      throw new Error('Unauthorized: Only the verified platform owner (sandeepgarg6375494692@gmail.com) can authorize Administrators.');
    }
    await setDoc(doc(db, 'users', targetUid), {
      role: 'admin',
      updatedAt: new Date().toISOString()
    }, { merge: true });

    setAllUsers(prev => prev.map(u => u.uid === targetUid ? { ...u, role: 'admin' } : u));

    addAuditLog({
      actor: 'Sandeep Garg (Root Owner)',
      actorRole: 'Admin',
      action: `Granted Administrator Privileges for UID ${targetUid}`,
      target: `UID: ${targetUid}`,
      status: 'Success'
    });
  };

  const revokeAdminRole = async (targetUid: string, fallbackRole: 'student' | 'teacher' = 'student') => {
    if (auth.currentUser?.email !== 'sandeepgarg6375494692@gmail.com') {
      throw new Error('Unauthorized: Only the verified platform owner can revoke Administrator privileges.');
    }
    await setDoc(doc(db, 'users', targetUid), {
      role: fallbackRole,
      updatedAt: new Date().toISOString()
    }, { merge: true });

    setAllUsers(prev => prev.map(u => u.uid === targetUid ? { ...u, role: fallbackRole } : u));

    addAuditLog({
      actor: 'Sandeep Garg (Root Owner)',
      actorRole: 'Admin',
      action: `Revoked Admin role for UID ${targetUid} to ${fallbackRole}`,
      target: `UID: ${targetUid}`,
      status: 'Notice'
    });
  };

  const assignRoleToCurrentUser = async (
    role: 'student' | 'teacher',
    details?: { qualification?: string; specialization?: string }
  ) => {
    const user = auth.currentUser;
    if (!user) throw new Error('No authenticated user session found.');

    const nowIso = new Date().toISOString();
    const isOwner = user.email === 'sandeepgarg6375494692@gmail.com';
    const finalRole: UserRole = isOwner ? 'admin' : role;
    const approvalStatus = finalRole === 'teacher' ? 'Pending' : 'None';

    const userData: UserAccount = {
      uid: user.uid,
      id: user.uid,
      name: user.displayName || (finalRole === 'teacher' ? 'Faculty Educator' : 'Candidate Aspirant'),
      displayName: user.displayName || (finalRole === 'teacher' ? 'Faculty Educator' : 'Candidate Aspirant'),
      email: user.email || '',
      photoURL: user.photoURL || '',
      role: finalRole,
      accountStatus: 'Active',
      teacherApprovalStatus: approvalStatus,
      createdAt: nowIso,
      updatedAt: nowIso
    };

    // 1. Save to users/{uid}
    await setDoc(doc(db, 'users', user.uid), userData, { merge: true });

    // 2. Initialize studentProfiles/{uid} for BOTH student and teacher (enables Part 4: Teacher can use student panel!)
    await setDoc(doc(db, 'studentProfiles', user.uid), {
      uid: user.uid,
      rankTitle: finalRole === 'teacher' ? 'Educator Aspirant' : 'Academy Aspirant',
      totalTestsAttempted: 0,
      totalQuestionsSolved: 0,
      averageAccuracy: 0,
      lifetimePoints: 0,
      currentDailyPoints: 0,
      currentWeeklyPoints: 0,
      currentGlobalRank: 0,
      streakDays: 0
    }, { merge: true });

    // 3. If teacher, create teacherProfiles/{uid} with Pending status
    if (finalRole === 'teacher') {
      await setDoc(doc(db, 'teacherProfiles', user.uid), {
        id: user.uid,
        name: userData.name,
        email: userData.email,
        qualification: details?.qualification?.trim() || 'Academic Faculty',
        specialization: details?.specialization?.trim() || 'General Studies & CSAT',
        status: 'Pending',
        testsCreated: 0,
        joinedDate: new Date().toLocaleDateString('en-GB')
      });
      setTeacherStatus('Pending');
    }

    setCurrentRole(finalRole);
    setIsRoleSelectionModalOpen(false);

    // 4. Role-based Navigation Redirection
    if (finalRole === 'admin') {
      setActiveSection('admin-dashboard');
    } else if (finalRole === 'teacher') {
      setActiveSection('teacher-pending');
    } else {
      setActiveSection('student-dashboard');
    }
  };

  // Admin Specific Controls
  const updateStudentStatus = (studentId: string, status: 'Active' | 'Suspended') => {
    setAllStudents(prev =>
      prev.map(s => (s.id === studentId ? { ...s, status } : s))
    );
    addAuditLog({
      actor: getActorName('Admin'),
      actorRole: 'Admin',
      action: `Changed Student Status to ${status}`,
      target: `Student ID: ${studentId}`,
      status: status === 'Active' ? 'Success' : 'Warning'
    });
  };

  const approveTeacher = (teacherId: string) => {
    setTeachers(prev =>
      prev.map(tch => (tch.id === teacherId ? { ...tch, status: 'Approved' } : tch))
    );
    if (auth.currentUser) {
      setDoc(doc(db, 'teacherProfiles', teacherId), { status: 'Approved' }, { merge: true }).catch(err => {
        handleFirestoreError(err, OperationType.UPDATE, 'teacherProfiles');
      });
    }
    addAuditLog({
      actor: getActorName('Admin'),
      actorRole: 'Admin',
      action: 'Approved Educator Application',
      target: `Teacher ID: ${teacherId}`,
      status: 'Success'
    });
  };

  const rejectTeacher = (teacherId: string) => {
    setTeachers(prev => prev.filter(tch => tch.id !== teacherId));
    if (auth.currentUser) {
      setDoc(doc(db, 'teacherProfiles', teacherId), { status: 'Suspended' }, { merge: true }).catch(err => {
        handleFirestoreError(err, OperationType.UPDATE, 'teacherProfiles');
      });
    }
    addAuditLog({
      actor: getActorName('Admin'),
      actorRole: 'Admin',
      action: 'Rejected & Removed Educator Application',
      target: `Teacher ID: ${teacherId}`,
      status: 'Warning'
    });
  };

  const suspendTeacher = (teacherId: string) => {
    setTeachers(prev =>
      prev.map(tch => (tch.id === teacherId ? { ...tch, status: 'Suspended' } : tch))
    );
    if (auth.currentUser) {
      setDoc(doc(db, 'teacherProfiles', teacherId), { status: 'Suspended' }, { merge: true }).catch(err => {
        handleFirestoreError(err, OperationType.UPDATE, 'teacherProfiles');
      });
    }
    addAuditLog({
      actor: getActorName('Admin'),
      actorRole: 'Admin',
      action: 'Suspended Educator Privileges',
      target: `Teacher ID: ${teacherId}`,
      status: 'Warning'
    });
  };

  const addNotification = (notif: Omit<NotificationAnnouncement, 'id' | 'createdAt'>) => {
    const newNotif: NotificationAnnouncement = {
      ...notif,
      id: `notif-${Date.now()}`,
      createdAt: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    };
    setNotifications(prev => [newNotif, ...prev]);
    if (auth.currentUser) {
      setDoc(doc(db, 'notifications', newNotif.id), newNotif).catch(err => {
        handleFirestoreError(err, OperationType.WRITE, 'notifications');
      });
    }
    addAuditLog({
      actor: getActorName('Admin'),
      actorRole: 'Admin',
      action: `Broadcasted Announcement (${notif.targetAudience})`,
      target: notif.title,
      status: 'Success'
    });
  };

  const toggleNotificationStatus = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, isActive: !n.isActive } : n))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const addPYQ = (pyq: Omit<PYQSet, 'id'>) => {
    const newPyq: PYQSet = {
      ...pyq,
      id: `pyq-${Date.now()}`
    };
    setPYQs(prev => [newPyq, ...prev]);
    addAuditLog({
      actor: getActorName('Admin'),
      actorRole: 'Admin',
      action: 'Published Past Year Question Set',
      target: `${pyq.examName} (${pyq.year})`,
      status: 'Success'
    });
  };

  const updatePlatformSettings = (settings: Partial<PlatformSettings>) => {
    setPlatformSettings(prev => ({ ...prev, ...settings }));
    addAuditLog({
      actor: getActorName('Admin'),
      actorRole: 'Admin',
      action: 'Updated Global Examination Policies',
      target: 'Platform Settings System Configuration',
      status: 'Success'
    });
  };

  const addAuditLog = (log: Omit<AdminAuditLog, 'id' | 'timestamp'>) => {
    const newLog: AdminAuditLog = {
      ...log,
      id: `log-${Date.now()}`,
      timestamp: 'Just now',
      ipAddress: '192.168.1.101'
    };
    setAuditLogs(prev => [newLog, ...prev.slice(0, 49)]);
    if (auth.currentUser) {
      setDoc(doc(db, 'auditLogs', newLog.id), newLog).catch(err => {
        handleFirestoreError(err, OperationType.WRITE, 'auditLogs');
      });
    }
  };

  const addSubject = (subject: SubjectItem) => {
    setSubjects(prev => [...prev, subject]);
    addAuditLog({
      actor: getActorName('Admin'),
      actorRole: 'Admin',
      action: 'Created New Academic Subject',
      target: subject.name,
      status: 'Success'
    });
  };

  const updateSubject = (id: string, updated: Partial<SubjectItem>) => {
    setSubjects(prev => prev.map(s => (s.id === id ? { ...s, ...updated } : s)));
  };

  const resetLeaderboard = (type: 'daily' | 'weekly') => {
    if (type === 'daily') {
      setDailyLeaderboardState(prev =>
        prev.map(item => ({ ...item, points: 0, testsAttempted: 0, change: 'same' as const }))
      );
      addAuditLog({
        actor: getActorName('Admin'),
        actorRole: 'Admin',
        action: 'Reset Daily Leaderboard Cycle',
        target: 'Daily Points Reset to Zero',
        status: 'Warning'
      });
    } else {
      setWeeklyLeaderboardState(prev =>
        prev.map(item => ({ ...item, points: 0, testsAttempted: 0, change: 'same' as const }))
      );
      addAuditLog({
        actor: getActorName('Admin'),
        actorRole: 'Admin',
        action: 'Reset Weekly Leaderboard Cycle',
        target: 'Weekly Points Reset to Zero',
        status: 'Warning'
      });
    }
  };

  return (
    <QuizContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        activeSection,
        setActiveSection,
        searchQuery,
        setSearchQuery,
        isSearchOpen,
        setIsSearchOpen,
        tests,
        questions,
        studentProfile,
        setStudentProfile,
        completedAttempts,
        bookmarks,
        dailyLeaderboard: dailyLeaderboardState,
        weeklyLeaderboard: weeklyLeaderboardState,
        globalLeaderboard: GLOBAL_LEADERBOARD,
        teachers,
        auditLogs,
        notifications,
        pyqs,
        platformSettings,
        subjects,
        allStudents,
        activeExam,
        startTestInstructions,
        beginExamination,
        selectAnswer,
        clearResponse,
        markForReview,
        saveAndNext,
        previousQuestion,
        jumpToQuestion,
        submitTest,
        cancelExam,
        startReview,
        hasAttempted,
        getAttemptForTest,
        toggleBookmark,
        isBookmarked,
        addQuestion,
        addBulkQuestions,
        addQuestionsToTest,
        updateQuestion,
        deleteQuestion,
        createTest,
        approveTest,
        rejectTest,
        publishTest,
        unpublishTest,
        scheduleTest,
        archiveTest,
        deleteTest,
        updateTest,
        allUsers,
        promoteUserToAdmin,
        revokeAdminRole,
        isRoleSelectionModalOpen,
        setIsRoleSelectionModalOpen,
        assignRoleToCurrentUser,
        updateStudentStatus,
        approveTeacher,
        rejectTeacher,
        suspendTeacher,
        addNotification,
        toggleNotificationStatus,
        deleteNotification,
        addPYQ,
        updatePlatformSettings,
        addAuditLog,
        addSubject,
        updateSubject,
        resetLeaderboard,
        firebaseUser,
        teacherStatus,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalMode,
        openAuthModal,
        closeAuthModal,
        loginWithGoogle,
        logout
      }}
    >
      {children}
    </QuizContext.Provider>
  );
};

export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
};

