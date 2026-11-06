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
  SubjectItem
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
import { doc, setDoc } from 'firebase/firestore';

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
  updateQuestion: (id: string, updated: Partial<Question>) => void;
  deleteQuestion: (id: string) => void;
  createTest: (testData: Omit<Test, 'id' | 'createdAt' | 'status'>) => void;
  approveTest: (testId: string) => void;
  rejectTest: (testId: string, reason?: string) => void;
  publishTest: (testId: string) => void;
  unpublishTest: (testId: string) => void;
  scheduleTest: (testId: string, startDate: string, endDate: string) => void;
  archiveTest: (testId: string) => void;
  deleteTest: (testId: string) => void;

  // Admin Specific Controls
  updateStudentStatus: (studentId: string, status: 'Active' | 'Suspended') => void;
  approveTeacher: (teacherId: string) => void;
  rejectTeacher: (teacherId: string) => void;
  suspendTeacher: (teacherId: string) => void;
  addNotification: (notif: Omit<NotificationAnnouncement, 'id' | 'createdAt'>) => void;
  toggleNotificationStatus: (id: string) => void;
  deleteNotification: (id: string) => void;
  addPYQ: (pyq: Omit<PYQSet, 'id'>) => void;
  updatePlatformSettings: (settings: Partial<PlatformSettings>) => void;
  addAuditLog: (log: Omit<AdminAuditLog, 'id' | 'timestamp'>) => void;
  addSubject: (subject: SubjectItem) => void;
  updateSubject: (id: string, updated: Partial<SubjectItem>) => void;
  resetLeaderboard: (type: 'daily' | 'weekly') => void;

  // Real Firebase Auth
  firebaseUser: FirebaseUser | null;
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

  const [allStudents, setAllStudents] = useState<AdminStudentItem[]>([
    { id: 'usr_naruto_student_01', name: 'Uzumaki Sanskar', email: 'sanskar.quiz@leafvillage.edu', attempts: 19, points: 3420, rank: 4, status: 'Active' },
    { id: 's-01', name: 'Itachi Uchiha', email: 'itachi.u@leafvillage.edu', attempts: 112, points: 12480, rank: 1, status: 'Active' },
    { id: 's-02', name: 'Sasuke Uchiha', email: 'sasuke.u@leafvillage.edu', attempts: 98, points: 10640, rank: 3, status: 'Active' },
    { id: 's-03', name: 'Shikamaru Nara', email: 'shikamaru.n@leafvillage.edu', attempts: 108, points: 11920, rank: 2, status: 'Active' },
    { id: 's-05', name: 'Neji Hyuga', email: 'neji.h@leafvillage.edu', attempts: 24, points: 3290, rank: 5, status: 'Active' },
    { id: 's-06', name: 'Gaara of the Sand', email: 'gaara.kazekage@sandvillage.edu', attempts: 31, points: 3180, rank: 6, status: 'Active' },
    { id: 's-07', name: 'Hinata Hyuga', email: 'hinata.h@leafvillage.edu', attempts: 18, points: 3050, rank: 7, status: 'Active' },
    { id: 's-08', name: 'Rock Lee', email: 'rock.lee@leafvillage.edu', attempts: 45, points: 2940, rank: 8, status: 'Active' },
  ]);

  const [activeExam, setActiveExam] = useState<ActiveExamState>({
    test: null,
    status: 'idle',
    currentQuestionIndex: 0,
    answers: {},
    questionStates: {},
    remainingSeconds: 0,
    lastAttemptResult: null
  });

  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);

  // Sync Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      setFirebaseUser(user);
      if (user) {
        if (user.email === 'sandeepgarg6375494692@gmail.com') {
          setCurrentRole('admin');
        }
        setStudentProfile(prev => ({
          ...prev,
          uid: user.uid,
          name: user.displayName || prev.name,
          email: user.email || prev.email,
          photoURL: user.photoURL || prev.photoURL
        }));
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
      setCurrentRole('student');
      setActiveSection('home');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Countdown Timer effect during exam
  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | null = null;
    if (activeExam.status === 'in_progress' && activeExam.remainingSeconds > 0) {
      timer = setInterval(() => {
        setActiveExam(prev => {
          if (prev.remainingSeconds <= 1) {
            // Auto submit when timer reaches 0
            return {
              ...prev,
              remainingSeconds: 0
            };
          }
          return {
            ...prev,
            remainingSeconds: prev.remainingSeconds - 1
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
  }, [activeExam.status, activeExam.remainingSeconds]);

  // One Attempt Policy Check
  const hasAttempted = (testId: string) => {
    return completedAttempts.some(a => a.testId === testId);
  };

  const getAttemptForTest = (testId: string) => {
    return completedAttempts.find(a => a.testId === testId);
  };

  const startTestInstructions = (test: Test) => {
    if (hasAttempted(test.id)) {
      alert(`Policy Enforced: You have already attempted '${test.title}'. Each student gets only ONE official attempt per test.`);
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
      lastAttemptResult: null
    });
    setActiveSection('exam');
  };

  const beginExamination = () => {
    if (!activeExam.test) return;
    setActiveExam(prev => ({
      ...prev,
      status: 'in_progress',
      remainingSeconds: (prev.test?.durationMinutes || 10) * 60
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

  const submitTest = () => {
    if (!activeExam.test) return;
    const test = activeExam.test;
    const answers = activeExam.answers;

    let correctCount = 0;
    let wrongCount = 0;
    let unansweredCount = 0;
    let obtainedMarks = 0;

    test.questions.forEach(q => {
      const userChoice = answers[q.id];

      // CRITICAL OPTION E RULE:
      // Option E represents 'Unattempted / No Response'
      // If user selected E or didn't select any option -> treated as Unanswered (0 marks, 0 penalty)
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
    const accuracy =
      correctCount + wrongCount > 0
        ? Math.round((correctCount / (correctCount + wrongCount)) * 1000) / 10
        : 0;

    const totalDurationSeconds = test.durationMinutes * 60;
    const timeTaken = totalDurationSeconds - activeExam.remainingSeconds;

    const attemptResult: TestAttempt = {
      id: `att_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      testId: test.id,
      testTitle: test.title,
      category: test.category,
      subject: test.subject,
      studentId: studentProfile.uid,
      studentName: studentProfile.name,
      answers: { ...answers },
      questionStates: { ...activeExam.questionStates },
      correctCount,
      wrongCount,
      unansweredCount,
      obtainedMarks,
      maxMarks: test.maxMarks,
      accuracy,
      timeTakenSeconds: timeTaken,
      startedAt: new Date(Date.now() - timeTaken * 1000).toISOString(),
      submittedAt: new Date().toISOString(),
      rank: Math.floor(Math.random() * 5) + 1,
      totalParticipants: 420
    };

    setCompletedAttempts(prev => [attemptResult, ...prev]);

    // Persist to Firestore if authenticated
    if (auth.currentUser) {
      setDoc(doc(db, 'testAttempts', attemptResult.id), attemptResult).catch(err => {
        handleFirestoreError(err, OperationType.WRITE, 'testAttempts');
      });
    }

    // Update Student Profile Stats
    setStudentProfile(prev => {
      const newTotal = prev.totalTestsAttempted + 1;
      const newPoints = prev.lifetimePoints + Math.round(obtainedMarks * 10);
      return {
        ...prev,
        totalTestsAttempted: newTotal,
        totalQuestionsSolved: prev.totalQuestionsSolved + (correctCount + wrongCount),
        lifetimePoints: newPoints,
        recentTestActivity: [
          {
            testName: test.title,
            date: 'Just now',
            score: obtainedMarks,
            maxScore: test.maxMarks,
            accuracy
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
    setActiveExam({
      test: null,
      status: 'idle',
      currentQuestionIndex: 0,
      answers: {},
      questionStates: {},
      remainingSeconds: 0,
      lastAttemptResult: null
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

  // Teacher / Admin Actions
  const addQuestion = (q: Omit<Question, 'id'>) => {
    const newQ: Question = {
      ...q,
      id: `q-${Date.now()}`
    };
    setQuestions(prev => [newQ, ...prev]);
    addAuditLog({
      actor: currentRole === 'admin' ? 'Hokage Tsunade (Admin)' : 'Educator',
      actorRole: currentRole === 'admin' ? 'Admin' : 'Teacher',
      action: 'Added New Question',
      target: `${q.subject} - ${q.topic}`,
      status: 'Success'
    });
  };

  const updateQuestion = (id: string, updated: Partial<Question>) => {
    setQuestions(prev => prev.map(q => (q.id === id ? { ...q, ...updated } : q)));
    addAuditLog({
      actor: 'Hokage Tsunade (Admin)',
      actorRole: 'Admin',
      action: 'Updated Question Content',
      target: `Question ID: ${id}`,
      status: 'Success'
    });
  };

  const deleteQuestion = (id: string) => {
    setQuestions(prev => prev.filter(q => q.id !== id));
    addAuditLog({
      actor: 'Hokage Tsunade (Admin)',
      actorRole: 'Admin',
      action: 'Deleted Question from Bank',
      target: `Question ID: ${id}`,
      status: 'Warning'
    });
  };

  const createTest = (testData: Omit<Test, 'id' | 'createdAt' | 'status'>) => {
    const newTest: Test = {
      ...testData,
      id: `test-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: currentRole === 'admin' ? 'Published' : 'Pending Approval'
    };
    setTests(prev => [newTest, ...prev]);
    addAuditLog({
      actor: currentRole === 'admin' ? 'Hokage Tsunade (Admin)' : 'Educator',
      actorRole: currentRole === 'admin' ? 'Admin' : 'Teacher',
      action: currentRole === 'admin' ? 'Created & Published Test' : 'Created Test Draft',
      target: testData.title,
      status: 'Success'
    });
  };

  const approveTest = (testId: string) => {
    const targetTest = tests.find(t => t.id === testId);
    setTests(prev =>
      prev.map(t => (t.id === testId ? { ...t, status: 'Published' } : t))
    );
    addAuditLog({
      actor: 'Hokage Tsunade (Admin)',
      actorRole: 'Admin',
      action: 'Approved & Published Test',
      target: targetTest ? targetTest.title : testId,
      status: 'Success'
    });
  };

  const rejectTest = (testId: string, reason?: string) => {
    const targetTest = tests.find(t => t.id === testId);
    setTests(prev =>
      prev.map(t => (t.id === testId ? { ...t, status: 'Rejected' } : t))
    );
    addAuditLog({
      actor: 'Hokage Tsunade (Admin)',
      actorRole: 'Admin',
      action: `Rejected Test: ${reason || 'Failed moderation guidelines'}`,
      target: targetTest ? targetTest.title : testId,
      status: 'Warning'
    });
  };

  const publishTest = (testId: string) => {
    const targetTest = tests.find(t => t.id === testId);
    setTests(prev =>
      prev.map(t => (t.id === testId ? { ...t, status: 'Published' } : t))
    );
    addAuditLog({
      actor: 'Hokage Tsunade (Admin)',
      actorRole: 'Admin',
      action: 'Published Test for Candidates',
      target: targetTest ? targetTest.title : testId,
      status: 'Success'
    });
  };

  const unpublishTest = (testId: string) => {
    const targetTest = tests.find(t => t.id === testId);
    setTests(prev =>
      prev.map(t => (t.id === testId ? { ...t, status: 'Unpublished' } : t))
    );
    addAuditLog({
      actor: 'Hokage Tsunade (Admin)',
      actorRole: 'Admin',
      action: 'Unpublished Test (Hidden from Student Catalog)',
      target: targetTest ? targetTest.title : testId,
      status: 'Notice'
    });
  };

  const scheduleTest = (testId: string, startDate: string, endDate: string) => {
    const targetTest = tests.find(t => t.id === testId);
    setTests(prev =>
      prev.map(t => (t.id === testId ? { ...t, status: 'Scheduled', startDate, endDate } : t))
    );
    addAuditLog({
      actor: 'Hokage Tsunade (Admin)',
      actorRole: 'Admin',
      action: `Scheduled Test (${startDate} to ${endDate})`,
      target: targetTest ? targetTest.title : testId,
      status: 'Success'
    });
  };

  const archiveTest = (testId: string) => {
    const targetTest = tests.find(t => t.id === testId);
    setTests(prev =>
      prev.map(t => (t.id === testId ? { ...t, status: 'Archived' } : t))
    );
    addAuditLog({
      actor: 'Hokage Tsunade (Admin)',
      actorRole: 'Admin',
      action: 'Archived Test Record',
      target: targetTest ? targetTest.title : testId,
      status: 'Notice'
    });
  };

  const deleteTest = (testId: string) => {
    const targetTest = tests.find(t => t.id === testId);
    setTests(prev => prev.filter(t => t.id !== testId));
    addAuditLog({
      actor: 'Hokage Tsunade (Admin)',
      actorRole: 'Admin',
      action: 'Deleted Test Document',
      target: targetTest ? targetTest.title : testId,
      status: 'Warning'
    });
  };

  // Admin Specific Controls
  const updateStudentStatus = (studentId: string, status: 'Active' | 'Suspended') => {
    setAllStudents(prev =>
      prev.map(s => (s.id === studentId ? { ...s, status } : s))
    );
    addAuditLog({
      actor: 'Hokage Tsunade (Admin)',
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
    addAuditLog({
      actor: 'Hokage Tsunade (Admin)',
      actorRole: 'Admin',
      action: 'Approved Educator Application',
      target: `Teacher ID: ${teacherId}`,
      status: 'Success'
    });
  };

  const rejectTeacher = (teacherId: string) => {
    setTeachers(prev => prev.filter(tch => tch.id !== teacherId));
    addAuditLog({
      actor: 'Hokage Tsunade (Admin)',
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
    addAuditLog({
      actor: 'Hokage Tsunade (Admin)',
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
    addAuditLog({
      actor: 'Hokage Tsunade (Admin)',
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
      actor: 'Hokage Tsunade (Admin)',
      actorRole: 'Admin',
      action: 'Published Past Year Question Set',
      target: `${pyq.examName} (${pyq.year})`,
      status: 'Success'
    });
  };

  const updatePlatformSettings = (settings: Partial<PlatformSettings>) => {
    setPlatformSettings(prev => ({ ...prev, ...settings }));
    addAuditLog({
      actor: 'Hokage Tsunade (Admin)',
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
  };

  const addSubject = (subject: SubjectItem) => {
    setSubjects(prev => [...prev, subject]);
    addAuditLog({
      actor: 'Hokage Tsunade (Admin)',
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
        actor: 'Hokage Tsunade (Admin)',
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
        actor: 'Hokage Tsunade (Admin)',
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

