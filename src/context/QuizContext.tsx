import React, { createContext, useContext, useState, useEffect, useRef, useCallback, ReactNode } from 'react';
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
  UserAccount,
  TestStatus,
  LeaderboardEntry,
  LeaderboardEntryDoc,
  SanitizedExamQuestion,
  ActiveExamTest
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
import { doc, getDoc, setDoc, updateDoc, deleteDoc, onSnapshot } from 'firebase/firestore';
import {
  apiChangeUserRole,
  apiChangeUserStatus,
  apiDeleteUserAccount,
  apiFetchAuthMetadata,
  apiReviewTeacherRequest
} from '../lib/adminRoleApi';
import type { RoleActionId } from '../lib/roleManagementRules';
import {
  initializeExamSession,
  persistExamSession,
  clearExamSession,
  calculateAndPersistTestResult,
  checkStudentAttempted,
  fetchCandidateSubmissions,
  sanitizeTestForCandidate
} from '../lib/examService';
import {
  fetchPublishedTests,
  fetchTeacherTests,
  fetchTeacherQuestions,
  fetchRealTests,
  fetchRealQuestions,
  fetchRealTeachers,
  fetchRealStudents,
  fetchAllTestAttempts,
  fetchRealNotifications,
  fetchRealAuditLogs,
  fetchRealBookmarks,
  fetchRealSubjects,
  fetchRealPYQs,
  fetchRealPlatformSettings,
  fetchLeaderboardEntries,
  computeLeaderboardsFromDocs,
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

export interface ActionBannerState {
  type: 'error' | 'info' | 'warning' | 'success';
  message: string;
}

interface ActiveExamState {
  test: ActiveExamTest | null;
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
  verifiedRole: UserRole | null;
  authLoading: boolean;
  dataLoading: boolean;
  dataError: string | null;
  retryLoadData: () => void;
  actionBanner: ActionBannerState | null;
  showActionBanner: (type: ActionBannerState['type'], message: string) => void;
  dismissActionBanner: () => void;
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
  dailyLeaderboard: LeaderboardEntry[];
  weeklyLeaderboard: LeaderboardEntry[];
  globalLeaderboard: LeaderboardEntry[];
  teachers: TeacherProfile[];
  auditLogs: AdminAuditLog[];
  notifications: NotificationAnnouncement[];
  pyqs: PYQSet[];
  platformSettings: PlatformSettings;
  subjects: SubjectItem[];
  allStudents: AdminStudentItem[];

  // Examination Engine
  activeExam: ActiveExamState;
  startTestInstructions: (test: Test) => Promise<void>;
  beginExamination: () => void;
  selectAnswer: (questionId: string, option: StudentResponseKey) => void;
  clearResponse: (questionId: string) => void;
  markForReview: (questionId: string) => void;
  saveAndNext: () => void;
  previousQuestion: () => void;
  jumpToQuestion: (index: number) => void;
  submitTest: () => Promise<void>;
  cancelExam: () => void;
  startReview: () => void;

  // Question & Attempt Operations
  hasAttempted: (testId: string) => boolean;
  getAttemptForTest: (testId: string) => TestAttempt | undefined;
  toggleBookmark: (question: Question | SanitizedExamQuestion) => void;
  isBookmarked: (questionId: string) => boolean;

  // Teacher & Admin Actions
  addQuestion: (q: Omit<Question, 'id'>) => void;
  addBulkQuestions: (questionsList: Omit<Question, 'id'>[]) => { added: number; duplicates: number; failed: number };
  addQuestionsToTest: (testId: string, questionsList: Question[]) => void;
  updateQuestion: (id: string, updated: Partial<Question>) => void;
  deleteQuestion: (id: string) => void;
  createTest: (testData: Omit<Test, 'id' | 'createdAt' | 'status'> & { status?: TestStatus }) => void;
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
  adminSdkConfigured: boolean;
  authMetadataMap: Record<string, { lastSignInTime?: string; creationTime?: string }>;
  refreshAdminDirectoryData: () => Promise<void>;
  changeUserRoleViaBackend: (params: {
    targetUid: string;
    newRole: UserRole;
    actionId?: RoleActionId;
    reason?: string;
    confirmAdminPrivilegeChange?: boolean;
  }) => Promise<{ customClaimsSynced: boolean; auditLog: AdminAuditLog }>;
  changeUserStatusViaBackend: (params: {
    targetUid: string;
    newStatus: 'Active' | 'Suspended';
    reason?: string;
  }) => Promise<{ customClaimsSynced: boolean; auditLog: AdminAuditLog }>;
  reviewTeacherRequestViaBackend: (params: {
    targetUid: string;
    decision: 'approve_teacher' | 'reject' | 'assign_student' | 'assign_admin';
    reason?: string;
    confirmAdminPrivilegeChange?: boolean;
  }) => Promise<{ customClaimsSynced: boolean; auditLog: AdminAuditLog }>;
  deleteUserAccountViaBackend: (params: {
    targetUid: string;
    confirmDelete: boolean;
    reason?: string;
  }) => Promise<{ auditLog: AdminAuditLog }>;
  updateStudentStatus: (studentId: string, status: 'Active' | 'Suspended') => Promise<void>;
  approveTeacher: (teacherId: string) => Promise<void>;
  rejectTeacher: (teacherId: string, reason?: string) => Promise<void>;
  suspendTeacher: (teacherId: string) => Promise<void>;
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
  accountStatus: 'Active' | 'Suspended' | null;
  teacherStatus: 'Approved' | 'Pending' | 'Rejected' | 'Suspended' | null;
  teacherRejectionReason: string | null;
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

const SECTION_TO_PATH: Record<string, string> = {
  'home': '/',
  'student-new-tests': '/new-tests',
  'student-practice': '/practice',
  'student-leaderboard': '/leaderboard',
  'student-dashboard': '/student',
  'student-performance': '/student/performance',
  'student-previous-rank': '/student/rank',
  'student-bookmarks': '/student/bookmarks',
  'student-profile': '/student/profile',
  'teacher-dashboard': '/teacher',
  'teacher-pending': '/teacher-pending',
  'admin-dashboard': '/admin'
};

function resolveSectionFromLocation(): string {
  if (typeof window === 'undefined') return 'home';
  const rawHash = window.location.hash.replace(/^#\/?/, '').trim().toLowerCase();
  const rawPath = window.location.pathname.replace(/\/+$/, '').toLowerCase() || '/';
  const candidate = rawHash || rawPath;

  if (candidate === '/' || candidate === '' || candidate === 'home') return 'home';
  if (candidate === '/new-tests' || candidate === 'new-tests' || candidate === 'student-new-tests') return 'student-new-tests';
  if (candidate === '/practice' || candidate === 'practice' || candidate === 'student-practice') return 'student-practice';
  if (candidate === '/leaderboard' || candidate === 'leaderboard' || candidate === 'student-leaderboard') return 'student-leaderboard';
  if (candidate === '/student' || candidate === '/student-dashboard' || candidate === 'student' || candidate === 'student-dashboard') return 'student-dashboard';
  if (candidate === '/student/performance' || candidate === 'student-performance') return 'student-performance';
  if (candidate === '/student/rank' || candidate === 'student-previous-rank') return 'student-previous-rank';
  if (candidate === '/student/bookmarks' || candidate === 'student-bookmarks') return 'student-bookmarks';
  if (candidate === '/student/profile' || candidate === 'student-profile') return 'student-profile';
  if (candidate === '/teacher' || candidate === '/teacher-dashboard' || candidate === 'teacher' || candidate === 'teacher-dashboard') return 'teacher-dashboard';
  if (candidate === '/teacher-pending' || candidate === 'teacher-pending') return 'teacher-pending';
  if (candidate === '/admin' || candidate === '/admin-dashboard' || candidate === 'admin' || candidate === 'admin-dashboard') return 'admin-dashboard';
  return 'home';
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export const QuizProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRoleState] = useState<UserRole>('student');
  const [verifiedRole, setVerifiedRole] = useState<UserRole | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [activeSection, setActiveSectionState] = useState<string>(() => resolveSectionFromLocation());
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);

  const setActiveSection = (section: string) => {
    setActiveSectionState(section);
    if (typeof window !== 'undefined' && section !== 'exam') {
      const targetPath = SECTION_TO_PATH[section] || '/';
      if (window.location.pathname !== targetPath || window.location.hash) {
        try {
          window.history.pushState({ section }, '', targetPath);
        } catch {
          // Ignore pushState restrictions in sandboxed environments
        }
      }
    }
  };

  // Strict Role Switcher Guard: prevents client-side escalation above verifiedRole
  const setCurrentRole = (requestedRole: UserRole) => {
    if (verifiedRole === 'admin') {
      setCurrentRoleState(requestedRole);
      return;
    }
    if (verifiedRole === 'teacher') {
      if (requestedRole === 'teacher' || requestedRole === 'student') {
        setCurrentRoleState(requestedRole);
      } else {
        setCurrentRoleState('student');
      }
      return;
    }
    setCurrentRoleState('student');
  };

  useEffect(() => {
    const onPopState = () => {
      setActiveSectionState(resolveSectionFromLocation());
    };
    window.addEventListener('popstate', onPopState);
    window.addEventListener('hashchange', onPopState);
    return () => {
      window.removeEventListener('popstate', onPopState);
      window.removeEventListener('hashchange', onPopState);
    };
  }, []);

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
  const [dailyLeaderboardState, setDailyLeaderboardState] = useState<LeaderboardEntry[]>(DAILY_LEADERBOARD);
  const [weeklyLeaderboardState, setWeeklyLeaderboardState] = useState<LeaderboardEntry[]>(WEEKLY_LEADERBOARD);
  const [globalLeaderboardState, setGlobalLeaderboardState] = useState<LeaderboardEntry[]>(GLOBAL_LEADERBOARD);

  const [dataLoading, setDataLoading] = useState<boolean>(true);
  const [dataError, setDataError] = useState<string | null>(null);
  const [reloadCounter, setReloadCounter] = useState<number>(0);
  const [actionBanner, setActionBanner] = useState<ActionBannerState | null>(null);

  const activeExamTestRef = useRef<Test | null>(null);
  const isSubmittingRef = useRef<boolean>(false);
  const latestLeaderboardDocsRef = useRef<LeaderboardEntryDoc[]>([]);
  const latestRankMapRef = useRef<Record<string, { globalRank: number; dailyPoints: number; weeklyPoints: number }>>({});

  const showActionBanner = useCallback((type: ActionBannerState['type'], message: string) => {
    setActionBanner({ type, message });
  }, []);

  const dismissActionBanner = useCallback(() => {
    setActionBanner(null);
  }, []);

  const retryLoadData = useCallback(() => {
    setReloadCounter(c => c + 1);
  }, []);

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
  const [accountStatus, setAccountStatus] = useState<'Active' | 'Suspended' | null>(null);
  const [teacherStatus, setTeacherStatus] = useState<'Approved' | 'Pending' | 'Rejected' | 'Suspended' | null>(null);
  const [teacherRejectionReason, setTeacherRejectionReason] = useState<string | null>(null);
  const [allUsers, setAllUsers] = useState<UserAccount[]>([]);
  const [adminSdkConfigured, setAdminSdkConfigured] = useState<boolean>(false);
  const [authMetadataMap, setAuthMetadataMap] = useState<Record<string, { lastSignInTime?: string; creationTime?: string }>>({});
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [isRoleSelectionModalOpen, setIsRoleSelectionModalOpen] = useState(false);

  const openAuthModal = (m: 'login' | 'register') => {
    setAuthModalMode(m);
    setIsAuthModalOpen(true);
  };
  const closeAuthModal = () => setIsAuthModalOpen(false);

  // Load role-scoped data from Firestore whenever verifiedRole / user / reloadCounter changes
  useEffect(() => {
    let isMounted = true;
    async function loadRoleScopedData() {
      setDataLoading(true);
      setDataError(null);

      try {
        const [publishedTests, lbDocs, realSubjects, realPyqs, fetchedSettings] = await Promise.all([
          fetchPublishedTests(),
          fetchLeaderboardEntries().catch(() => [] as LeaderboardEntryDoc[]),
          fetchRealSubjects().catch(() => [] as SubjectItem[]),
          fetchRealPYQs().catch(() => [] as PYQSet[]),
          fetchRealPlatformSettings().catch(() => null)
        ]);
        if (!isMounted) return;

        const effectiveSettings: PlatformSettings = fetchedSettings
          ? { ...INITIAL_PLATFORM_SETTINGS, ...fetchedSettings }
          : INITIAL_PLATFORM_SETTINGS;
        setPlatformSettings(effectiveSettings);

        if (realSubjects && realSubjects.length > 0) {
          setSubjects(realSubjects);
        } else {
          setSubjects(SUBJECTS_LIST);
        }

        setPYQs(realPyqs || []);

        latestLeaderboardDocsRef.current = lbDocs || [];
        const computedBoards = computeLeaderboardsFromDocs(lbDocs || [], effectiveSettings);
        latestRankMapRef.current = computedBoards.rankByStudentId;
        setDailyLeaderboardState(computedBoards.daily);
        setWeeklyLeaderboardState(computedBoards.weekly);
        setGlobalLeaderboardState(computedBoards.global);

        if (firebaseUser?.uid && computedBoards.rankByStudentId[firebaseUser.uid]) {
          const standing = computedBoards.rankByStudentId[firebaseUser.uid];
          setStudentProfile(prev =>
            prev.uid === firebaseUser.uid
              ? {
                  ...prev,
                  currentGlobalRank: standing.globalRank,
                  currentDailyPoints: standing.dailyPoints,
                  currentWeeklyPoints: standing.weeklyPoints
                }
              : prev
          );
        }

        if (firebaseUser?.uid) {
          const realNotifs = await fetchRealNotifications().catch(() => [] as NotificationAnnouncement[]);
          if (isMounted) {
            setNotifications(realNotifs || []);
          }
        } else {
          setNotifications([]);
        }

        if (verifiedRole === 'admin' && accountStatus !== 'Suspended') {
          const [realTests, realQuestions, realTeachers, realStudents, realLogs, realUsers, allAttempts, authMeta] =
            await Promise.all([
              fetchRealTests(),
              fetchRealQuestions(),
              fetchRealTeachers(),
              fetchRealStudents(),
              fetchRealAuditLogs(),
              fetchRealUsers(),
              fetchAllTestAttempts(),
              apiFetchAuthMetadata().catch(() => ({ adminSdkConfigured: false, metadata: {} }))
            ]);
          if (!isMounted) return;
          setTests(realTests && realTests.length > 0 ? realTests : publishedTests || []);
          setQuestions(realQuestions || []);
          setTeachers(realTeachers || []);
          setAllStudents(realStudents || []);
          setAllUsers(realUsers || []);
          setAuditLogs(realLogs || []);
          setAdminSdkConfigured(authMeta.adminSdkConfigured);
          setAuthMetadataMap(authMeta.metadata || {});
          if (allAttempts && allAttempts.length > 0) {
            setCompletedAttempts(allAttempts);
            if (!lbDocs || lbDocs.length === 0) {
              const fallbackBoards = computeRealLeaderboards(allAttempts, effectiveSettings);
              setDailyLeaderboardState(fallbackBoards.daily);
              setWeeklyLeaderboardState(fallbackBoards.weekly);
              setGlobalLeaderboardState(fallbackBoards.global);
            }
          }
        } else if (verifiedRole === 'teacher' && accountStatus !== 'Suspended' && firebaseUser?.uid) {
          const [teacherTests, teacherQuestions] = await Promise.all([
            fetchTeacherTests(firebaseUser.uid),
            fetchTeacherQuestions(firebaseUser.uid)
          ]);
          if (!isMounted) return;
          const mergedMap = new Map<string, Test>();
          [...(publishedTests || []), ...(teacherTests || [])].forEach(t => mergedMap.set(t.id, t));
          setTests(Array.from(mergedMap.values()));
          setQuestions(teacherQuestions || []);
          setAllUsers([]);
          setAllStudents([]);
          setAdminSdkConfigured(false);
          setAuthMetadataMap({});
        } else {
          setTests(publishedTests || []);
          setQuestions([]);
          setAllUsers([]);
          setAllStudents([]);
          setAdminSdkConfigured(false);
          setAuthMetadataMap({});
        }
      } catch (err) {
        console.error('Failed to load Firestore data:', err);
        if (isMounted) {
          setDataError(
            'डेटाबेस से परीक्षा व लीडरबोर्ड डेटा लोड नहीं हो सका। कृपया इंटरनेट या अनुमति जांचकर पुनः प्रयास करें। (Failed to load data from Firestore. Please retry.)'
          );
        }
      } finally {
        if (isMounted) {
          setDataLoading(false);
        }
      }
    }

    loadRoleScopedData();
    return () => {
      isMounted = false;
    };
  }, [verifiedRole, accountStatus, firebaseUser?.uid, reloadCounter]);

  // Sync Firebase Auth state, subscribe to live user role/status changes, and fetch candidate data
  useEffect(() => {
    let unsubscribeUserDoc: (() => void) | null = null;
    let unsubscribeTeacherDoc: (() => void) | null = null;

    const cleanupDocListeners = () => {
      if (unsubscribeUserDoc) {
        unsubscribeUserDoc();
        unsubscribeUserDoc = null;
      }
      if (unsubscribeTeacherDoc) {
        unsubscribeTeacherDoc();
        unsubscribeTeacherDoc = null;
      }
    };

    const unsubscribeAuth = onAuthStateChanged(auth, async user => {
      cleanupDocListeners();
      setAuthLoading(true);
      setFirebaseUser(user);

      if (user) {
        try {
          const isOwnerEmail =
            user.email === 'sandeepgarg6375494692@gmail.com' && user.emailVerified !== false;
          const nowIso = new Date().toISOString();

          const applyRoleFromDoc = async (uData: Record<string, unknown> | null) => {
            let hasAdminClaim = false;
            try {
              const tokenResult = await user.getIdTokenResult();
              hasAdminClaim = tokenResult.claims?.admin === true || tokenResult.claims?.role === 'admin';
            } catch {
              hasAdminClaim = false;
            }

            if (isOwnerEmail) {
              setVerifiedRole('admin');
              setCurrentRoleState('admin');
              setAccountStatus('Active');
              setTeacherStatus(null);
              setTeacherRejectionReason(null);
              setIsRoleSelectionModalOpen(false);
              return;
            }

            const docStatus: 'Active' | 'Suspended' =
              uData?.accountStatus === 'Suspended' ? 'Suspended' : 'Active';
            setAccountStatus(docStatus);

            const dbRole = uData?.role;
            const approvalState = uData?.teacherApprovalStatus;
            const rejectionReasonVal =
              typeof uData?.rejectionReason === 'string' ? uData.rejectionReason : null;
            setTeacherRejectionReason(rejectionReasonVal);

            if (dbRole === 'admin' || (hasAdminClaim && !dbRole)) {
              setVerifiedRole('admin');
              setCurrentRoleState(prev => (prev === 'student' || prev === 'teacher' ? prev : 'admin'));
              setTeacherStatus(null);
              setIsRoleSelectionModalOpen(false);
            } else if (dbRole === 'teacher') {
              setVerifiedRole('teacher');
              setCurrentRoleState(prev => (prev === 'student' ? 'student' : 'teacher'));
              setIsRoleSelectionModalOpen(false);
              try {
                const tchDoc = await getDoc(doc(db, 'teacherProfiles', user.uid));
                if (tchDoc.exists() && tchDoc.data()?.status) {
                  setTeacherStatus(tchDoc.data().status);
                } else if (
                  approvalState === 'Approved' ||
                  approvalState === 'Rejected' ||
                  approvalState === 'Suspended' ||
                  approvalState === 'Pending'
                ) {
                  setTeacherStatus(approvalState);
                } else {
                  setTeacherStatus('Pending');
                }
              } catch {
                setTeacherStatus(
                  approvalState === 'Approved'
                    ? 'Approved'
                    : approvalState === 'Suspended'
                    ? 'Suspended'
                    : approvalState === 'Rejected'
                    ? 'Rejected'
                    : 'Pending'
                );
              }
            } else if (dbRole === 'student') {
              setVerifiedRole('student');
              setCurrentRoleState('student');
              setIsRoleSelectionModalOpen(false);
              if (
                approvalState === 'Pending' ||
                approvalState === 'Rejected' ||
                approvalState === 'Suspended' ||
                approvalState === 'Approved'
              ) {
                setTeacherStatus(approvalState);
              } else {
                setTeacherStatus(null);
              }
            } else {
              // Missing or unverified role (new Google Sign-In or legacy user without role) -> Prompt Role Selection
              setVerifiedRole(null);
              setCurrentRoleState('student');
              setTeacherStatus(null);
              setIsRoleSelectionModalOpen(true);
            }
          };

          if (isOwnerEmail) {
            try {
              const existingOwnerSnap = await getDoc(doc(db, 'users', user.uid));
              await setDoc(
                doc(db, 'users', user.uid),
                {
                  uid: user.uid,
                  id: user.uid,
                  name: user.displayName || existingOwnerSnap.data()?.name || 'Sandeep Garg (Owner)',
                  displayName: user.displayName || existingOwnerSnap.data()?.displayName || 'Sandeep Garg (Owner)',
                  email: user.email,
                  photoURL: user.photoURL || existingOwnerSnap.data()?.photoURL || '',
                  role: 'admin',
                  accountStatus: 'Active',
                  teacherApprovalStatus: 'None',
                  lastLoginAt: nowIso,
                  createdAt: existingOwnerSnap.exists()
                    ? existingOwnerSnap.data()?.createdAt || nowIso
                    : nowIso,
                  updatedAt: nowIso
                },
                { merge: true }
              );
            } catch (e) {
              console.warn('Owner profile sync notice:', e);
            }
          } else {
            try {
              const initialSnap = await getDoc(doc(db, 'users', user.uid));
              if (initialSnap.exists()) {
                await applyRoleFromDoc(initialSnap.data());
                // Record lastLoginAt safely for existing user
                setDoc(
                  doc(db, 'users', user.uid),
                  {
                    uid: user.uid,
                    id: user.uid,
                    email: initialSnap.data()?.email || user.email || '',
                    role: initialSnap.data()?.role || 'student',
                    lastLoginAt: nowIso
                  },
                  { merge: true }
                ).catch(() => {});
              } else {
                await applyRoleFromDoc(null);
              }
            } catch (e) {
              console.warn('User role fetch error:', e);
              setVerifiedRole(null);
              setCurrentRoleState('student');
            }
          }

          // Live onSnapshot listener on users/{uid} to enforce role/status revocations immediately
          unsubscribeUserDoc = onSnapshot(
            doc(db, 'users', user.uid),
            snapshot => {
              if (snapshot.exists()) {
                applyRoleFromDoc(snapshot.data());
                user.getIdToken(true).catch(() => {});
              }
            },
            err => {
              console.warn('User role listener warning:', err);
            }
          );

          // Live listener on teacherProfiles/{uid} for immediate Teacher approval reflection
          unsubscribeTeacherDoc = onSnapshot(
            doc(db, 'teacherProfiles', user.uid),
            snapshot => {
              if (snapshot.exists() && snapshot.data()?.status) {
                setTeacherStatus(snapshot.data().status);
              }
            },
            () => {}
          );

          if (isOwnerEmail) {
            await applyRoleFromDoc({ role: 'admin', accountStatus: 'Active' });
          }

          // Fetch candidate real submissions and bookmarks from Firestore
          let userAttempts: TestAttempt[] = [];
          try {
            userAttempts = await fetchCandidateSubmissions(user.uid);
            setCompletedAttempts(userAttempts || []);
          } catch (e) {
            console.warn('Submissions fetch error:', e);
            setCompletedAttempts([]);
          }

          try {
            const userBookmarks = await fetchRealBookmarks(user.uid);
            if (userBookmarks && userBookmarks.length > 0) {
              setBookmarks(userBookmarks);
            } else {
              setBookmarks([]);
            }
          } catch (e) {
            console.warn('Bookmarks fetch error:', e);
          }

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

          const standing = latestRankMapRef.current[user.uid];
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
            currentDailyPoints: standing?.dailyPoints || 0,
            currentWeeklyPoints: standing?.weeklyPoints || 0,
            currentGlobalRank: standing?.globalRank || 0,
            streakDays: totalAttempts > 0 ? 1 : 0,
            recentTestActivity: recentActs
          });
        } finally {
          setAuthLoading(false);
        }
      } else {
        setVerifiedRole(null);
        setAccountStatus(null);
        setTeacherStatus(null);
        setTeacherRejectionReason(null);
        setCurrentRoleState('student');
        setCompletedAttempts([]);
        setBookmarks(INITIAL_BOOKMARKS);
        setStudentProfile(INITIAL_STUDENT_PROFILE);
        setIsRoleSelectionModalOpen(false);
        setAuthLoading(false);
      }
    });
    return () => {
      cleanupDocListeners();
      unsubscribeAuth();
    };
  }, []);

  const loginWithGoogle = async () => {
    const user = await signInWithGoogle();
    if (user?.email === 'sandeepgarg6375494692@gmail.com') {
      setVerifiedRole('admin');
      setCurrentRoleState('admin');
      setActiveSection('admin-dashboard');
    }
  };

  const logout = async () => {
    try {
      await logOutUser();
      setFirebaseUser(null);
      setVerifiedRole(null);
      setTeacherStatus(null);
      setCurrentRoleState('student');
      setCompletedAttempts([]);
      setIsRoleSelectionModalOpen(false);
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
    } else if (
      activeExam.status === 'in_progress' &&
      activeExam.remainingSeconds === 0 &&
      activeExam.test &&
      !isSubmittingRef.current
    ) {
      // Automatic Submission when countdown reaches zero
      submitTest();
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [activeExam.status, activeExam.serverDeadlineMs, activeExam.remainingSeconds]);

  // One Attempt Policy Check (scoped to current candidate UID)
  const hasAttempted = (testId: string) => {
    const uid = auth.currentUser ? auth.currentUser.uid : studentProfile.uid;
    return completedAttempts.some(a => a.testId === testId && a.studentId === uid);
  };

  const getAttemptForTest = (testId: string) => {
    const uid = auth.currentUser ? auth.currentUser.uid : studentProfile.uid;
    return completedAttempts.find(a => a.testId === testId && a.studentId === uid);
  };

  const startTestInstructions = async (test: Test) => {
    if (!auth.currentUser) {
      showActionBanner(
        'info',
        'आधिकारिक परीक्षा शुरू करने के लिए कृपया साइन इन करें। (Please sign in before starting an official test.)'
      );
      openAuthModal('login');
      return;
    }

    if (!test.questions || test.questions.length === 0) {
      showActionBanner(
        'warning',
        `परीक्षा '${test.title}' में अभी कोई प्रश्न उपलब्ध नहीं है।`
      );
      return;
    }

    const uid = auth.currentUser.uid;

    // Check One Attempt Policy
    const pastAttempt = await checkStudentAttempted(test.id, uid);
    if (pastAttempt || hasAttempted(test.id)) {
      showActionBanner(
        'warning',
        `One Student = One Attempt Policy: आपने '${test.title}' पहले ही सबमिट कर दिया है। दोबारा परीक्षा देने की अनुमति नहीं है।`
      );
      return;
    }

    // Keep full Test (including correctAnswer & explanation) in memory ref only for post-submit grading/review
    activeExamTestRef.current = test;
    const sanitizedTest = sanitizeTestForCandidate(test);

    const initialStates: Record<string, QuestionState> = {};
    sanitizedTest.questions.forEach((q, idx) => {
      initialStates[q.id] = idx === 0 ? 'not_answered' : 'not_visited';
    });

    setActiveExam({
      test: sanitizedTest,
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
    if (isSubmittingRef.current) return;
    const fullTest = activeExamTestRef.current;
    if (!fullTest || !activeExam.test) return;
    const uid = auth.currentUser ? auth.currentUser.uid : studentProfile.uid;

    isSubmittingRef.current = true;
    try {
      const attemptResult = await calculateAndPersistTestResult(
        fullTest,
        studentProfile,
        activeExam.answers,
        activeExam.questionStates,
        activeExam.startedAt,
        activeExam.serverDeadlineMs,
        platformSettings
      );

      clearExamSession(fullTest.id, uid);
      setCompletedAttempts(prev => [attemptResult, ...prev]);

      // Refresh public leaderboards cleanly after submission
      fetchLeaderboardEntries()
        .then(lbDocs => {
          latestLeaderboardDocsRef.current = lbDocs;
          const computed = computeLeaderboardsFromDocs(lbDocs, platformSettings);
          latestRankMapRef.current = computed.rankByStudentId;
          setDailyLeaderboardState(computed.daily);
          setWeeklyLeaderboardState(computed.weekly);
          setGlobalLeaderboardState(computed.global);
          const standing = uid ? computed.rankByStudentId[uid] : undefined;
          if (standing) {
            setStudentProfile(prev => ({
              ...prev,
              currentGlobalRank: standing.globalRank,
              currentDailyPoints: standing.dailyPoints,
              currentWeeklyPoints: standing.weeklyPoints
            }));
          }
        })
        .catch(() => {});

      const pointsEarned = Math.round(attemptResult.obtainedMarks * 10);

      // Update Student Profile Stats locally alongside Firestore persistence
      setStudentProfile(prev => {
        const newTotal = prev.totalTestsAttempted + 1;
        const newPoints = prev.lifetimePoints + pointsEarned;
        return {
          ...prev,
          totalTestsAttempted: newTotal,
          totalQuestionsSolved:
            prev.totalQuestionsSolved + (attemptResult.correctCount + attemptResult.wrongCount),
          lifetimePoints: newPoints,
          currentDailyPoints: prev.currentDailyPoints + pointsEarned,
          currentWeeklyPoints: prev.currentWeeklyPoints + pointsEarned,
          recentTestActivity: [
            {
              testName: fullTest.title,
              date: 'Just now',
              score: attemptResult.obtainedMarks,
              maxScore: fullTest.maxMarks,
              accuracy: attemptResult.accuracy
            },
            ...prev.recentTestActivity.slice(0, 4)
          ]
        };
      });

      // Reveal full Test (with correctAnswer & explanation) ONLY now that exam is submitted
      setActiveExam(prev => ({
        ...prev,
        test: fullTest,
        status: 'submitted',
        lastAttemptResult: attemptResult,
        serverDeadlineMs: 0
      }));
    } catch (error: unknown) {
      const msg =
        error instanceof Error
          ? error.message
          : 'परीक्षा सबमिट करने में त्रुटि हुई। कृपया पुनः प्रयास करें। (Failed to save test attempt.)';
      showActionBanner('error', msg);
    } finally {
      isSubmittingRef.current = false;
    }
  };

  const cancelExam = () => {
    if (activeExam.test) {
      const uid = auth.currentUser ? auth.currentUser.uid : studentProfile.uid;
      clearExamSession(activeExam.test.id, uid);
    }
    activeExamTestRef.current = null;
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

  const toggleBookmark = (question: Question | SanitizedExamQuestion) => {
    const uid = auth.currentUser?.uid;
    const resolvedFullQuestion: Question =
      activeExamTestRef.current?.questions.find(q => q.id === question.id) ||
      questions.find(q => q.id === question.id) ||
      (question as Question);

    const exists = bookmarks.some(b => b.questionId === question.id);
    const savedDate = new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });

    if (exists) {
      setBookmarks(prev => prev.filter(b => b.questionId !== question.id));
      if (uid) {
        const bookmarkDocId = `${uid}_${question.id}`;
        deleteDoc(doc(db, 'bookmarks', bookmarkDocId)).catch(err => {
          console.error('Bookmark delete error:', err);
          showActionBanner(
            'error',
            'बुकमार्क हटाने में त्रुटि हुई। (Failed to remove bookmark in Firestore.)'
          );
        });
      }
    } else {
      const newEntry: BookmarkedQuestion = {
        questionId: resolvedFullQuestion.id,
        question: resolvedFullQuestion,
        savedDate
      };
      setBookmarks(prev => [newEntry, ...prev]);
      if (uid) {
        const bookmarkDocId = `${uid}_${resolvedFullQuestion.id}`;
        setDoc(doc(db, 'bookmarks', bookmarkDocId), {
          id: bookmarkDocId,
          userId: uid,
          questionId: resolvedFullQuestion.id,
          question: resolvedFullQuestion,
          savedDate
        }).catch(err => {
          console.error('Bookmark save error:', err);
          showActionBanner(
            'error',
            'बुकमार्क सहेजने में त्रुटि हुई। (Failed to persist bookmark in Firestore.)'
          );
        });
      }
    }
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
    const authorUid = auth.currentUser?.uid || 'Faculty Educator';
    const authorName = firebaseUser?.displayName || (currentRole === 'admin' ? 'Administrator' : 'Faculty Educator');

    const newQ: Question = {
      ...q,
      id: `q-${Date.now()}`,
      createdBy: q.createdBy || authorUid,
      createdByName: q.createdByName || authorName
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

    const authorUid = auth.currentUser?.uid || 'Faculty Educator';
    const authorName = firebaseUser?.displayName || (currentRole === 'admin' ? 'Administrator' : 'Faculty Educator');

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
        id: `q-bulk-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
        createdBy: q.createdBy || authorUid,
        createdByName: q.createdByName || authorName
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
    const actorRoleLabel = currentRole === 'admin' ? 'Admin' : 'Teacher';
    setQuestions(prev => prev.map(q => (q.id === id ? { ...q, ...updated } : q)));
    if (auth.currentUser) {
      updateDoc(doc(db, 'questions', id), updated).catch(err => {
        console.error('Update question error:', err);
        showActionBanner('error', 'प्रश्न अपडेट करने में त्रुटि हुई। (Failed to update question in Firestore.)');
      });
    }
    addAuditLog({
      actor: getActorName(),
      actorRole: actorRoleLabel,
      action: 'Updated Question Content',
      target: `Question ID: ${id}`,
      status: 'Success'
    });
  };

  const deleteQuestion = (id: string) => {
    const actorRoleLabel = currentRole === 'admin' ? 'Admin' : 'Teacher';
    setQuestions(prev => prev.filter(q => q.id !== id));
    if (auth.currentUser) {
      deleteDoc(doc(db, 'questions', id)).catch(err => {
        console.error('Delete question error:', err);
        showActionBanner('error', 'प्रश्न हटाने में त्रुटि हुई। (Failed to delete question from Firestore.)');
      });
    }
    addAuditLog({
      actor: getActorName(),
      actorRole: actorRoleLabel,
      action: 'Deleted Question from Bank',
      target: `Question ID: ${id}`,
      status: 'Warning'
    });
  };

  const createTest = (testData: Omit<Test, 'id' | 'createdAt' | 'status'> & { status?: TestStatus }) => {
    if (verifiedRole !== 'teacher' && verifiedRole !== 'admin') {
      console.warn('Unauthorized attempt to create test by non-educator role.');
      return;
    }
    const creatorName = firebaseUser?.displayName || (verifiedRole === 'admin' ? 'Administrator' : 'Educator');
    const creatorUid = auth.currentUser?.uid || 'Faculty Educator';
    const isSysAdmin = verifiedRole === 'admin' || auth.currentUser?.email === 'sandeepgarg6375494692@gmail.com';

    // Mandatory Rule: Teacher submissions MUST ALWAYS start in 'Pending Approval' with 'Pending' approvalStatus.
    // Only an Admin creating a test directly in the Admin Panel can publish directly if specifically requested.
    const willPublishDirectly = isSysAdmin && testData.status === 'Published';
    const initialStatus: TestStatus = willPublishDirectly ? 'Published' : 'Pending Approval';
    const initialApprovalStatus: 'Pending' | 'Approved' = willPublishDirectly ? 'Approved' : 'Pending';
    const nowIso = new Date().toISOString();

    const newTest: Test = {
      ...testData,
      id: `test-${Date.now()}`,
      createdAt: nowIso,
      submittedAt: nowIso,
      status: initialStatus,
      approvalStatus: initialApprovalStatus,
      createdBy: creatorUid,
      teacherName: creatorName,
      approvedBy: willPublishDirectly ? creatorUid : undefined,
      approvedByName: willPublishDirectly ? creatorName : undefined,
      approvedAt: willPublishDirectly ? nowIso : undefined
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
      action: willPublishDirectly ? 'Created & Published Test' : 'Submitted Assessment for Admin Approval',
      target: testData.title,
      status: 'Success'
    });
  };

  const approveTest = (testId: string) => {
    const isSysAdmin = verifiedRole === 'admin' || auth.currentUser?.email === 'sandeepgarg6375494692@gmail.com';
    if (!isSysAdmin) {
      console.warn('Access Denied: Only authenticated administrators can approve and publish assessments.');
      return;
    }
    const adminUid = auth.currentUser?.uid || 'admin-root';
    const adminName = firebaseUser?.displayName || 'Institutional Administrator';
    const approvedTimestamp = new Date().toISOString();

    setTests(prev =>
      prev.map(t =>
        t.id === testId
          ? {
              ...t,
              status: 'Published' as const,
              approvalStatus: 'Approved' as const,
              approvedBy: adminUid,
              approvedByName: adminName,
              approvedAt: approvedTimestamp
            }
          : t
      )
    );
    if (auth.currentUser) {
      updateDoc(doc(db, 'tests', testId), {
        status: 'Published',
        approvalStatus: 'Approved',
        approvedBy: adminUid,
        approvedByName: adminName,
        approvedAt: approvedTimestamp
      }).catch(err => {
        handleFirestoreError(err, OperationType.UPDATE, 'tests');
      });
    }
    const testTitle = tests.find(t => t.id === testId)?.title || testId;
    addAuditLog({
      actor: adminName,
      actorRole: 'Admin',
      action: 'Approved & Published Assessment',
      target: testTitle,
      status: 'Success'
    });
  };

  const rejectTest = (testId: string, reason?: string) => {
    const isSysAdmin = verifiedRole === 'admin' || auth.currentUser?.email === 'sandeepgarg6375494692@gmail.com';
    if (!isSysAdmin) {
      console.warn('Access Denied: Only authenticated administrators can moderate assessments.');
      return;
    }
    const adminUid = auth.currentUser?.uid || 'admin-root';
    const adminName = firebaseUser?.displayName || 'Institutional Administrator';
    const rejectedTimestamp = new Date().toISOString();
    const finalReason = reason?.trim() || 'Did not meet institutional quality standards.';

    setTests(prev =>
      prev.map(t =>
        t.id === testId
          ? {
              ...t,
              status: 'Rejected' as const,
              approvalStatus: 'Rejected' as const,
              rejectedBy: adminUid,
              rejectedByName: adminName,
              rejectedAt: rejectedTimestamp,
              rejectionReason: finalReason
            }
          : t
      )
    );
    if (auth.currentUser) {
      updateDoc(doc(db, 'tests', testId), {
        status: 'Rejected',
        approvalStatus: 'Rejected',
        rejectedBy: adminUid,
        rejectedByName: adminName,
        rejectedAt: rejectedTimestamp,
        rejectionReason: finalReason
      }).catch(err => {
        handleFirestoreError(err, OperationType.UPDATE, 'tests');
      });
    }
    const testTitle = tests.find(t => t.id === testId)?.title || testId;
    addAuditLog({
      actor: adminName,
      actorRole: 'Admin',
      action: `Rejected Assessment: ${finalReason}`,
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
    const isSysAdmin = verifiedRole === 'admin' || auth.currentUser?.email === 'sandeepgarg6375494692@gmail.com';

    if (!isOwner && !isSysAdmin) {
      throw new Error('Unauthorized: You can only edit tests you created.');
    }

    // Critical security: If a teacher modifies a test, preserve createdBy UID.
    // If test was already 'Published', modifying it resets status to 'Pending Approval' for moderation.
    let newStatus = isSysAdmin ? (updatedData.status || existingTest.status) : 'Pending Approval';
    let newApprovalStatus = isSysAdmin
      ? (updatedData.approvalStatus || existingTest.approvalStatus)
      : 'Pending';

    const sanitized: Partial<Test> = {
      ...updatedData,
      status: newStatus,
      approvalStatus: newApprovalStatus,
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
    const isSysAdmin = verifiedRole === 'admin' || auth.currentUser?.email === 'sandeepgarg6375494692@gmail.com';

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

  const refreshAdminDirectoryData = async () => {
    if (verifiedRole !== 'admin' || accountStatus === 'Suspended') return;
    const [realUsers, realTeachers, realStudents, realLogs, realNotifs, authMeta] = await Promise.all([
      fetchRealUsers(),
      fetchRealTeachers(),
      fetchRealStudents(),
      fetchRealAuditLogs(),
      fetchRealNotifications(),
      apiFetchAuthMetadata().catch(() => ({ adminSdkConfigured: false, metadata: {} }))
    ]);
    setAllUsers(realUsers || []);
    setTeachers(realTeachers || []);
    setAllStudents(realStudents || []);
    setAuditLogs(realLogs || []);
    if (realNotifs) setNotifications(realNotifs);
    setAdminSdkConfigured(authMeta.adminSdkConfigured);
    setAuthMetadataMap(authMeta.metadata || {});
  };

  const changeUserRoleViaBackend = async (params: {
    targetUid: string;
    newRole: UserRole;
    actionId?: RoleActionId;
    reason?: string;
    confirmAdminPrivilegeChange?: boolean;
  }) => {
    const res = await apiChangeUserRole(params);
    await refreshAdminDirectoryData();
    if (auth.currentUser?.uid === params.targetUid) {
      await auth.currentUser.getIdToken(true);
    }
    return { customClaimsSynced: res.customClaimsSynced, auditLog: res.auditLog };
  };

  const changeUserStatusViaBackend = async (params: {
    targetUid: string;
    newStatus: 'Active' | 'Suspended';
    reason?: string;
  }) => {
    const res = await apiChangeUserStatus(params);
    await refreshAdminDirectoryData();
    return { customClaimsSynced: res.customClaimsSynced, auditLog: res.auditLog };
  };

  const reviewTeacherRequestViaBackend = async (params: {
    targetUid: string;
    decision: 'approve_teacher' | 'reject' | 'assign_student' | 'assign_admin';
    reason?: string;
    confirmAdminPrivilegeChange?: boolean;
  }) => {
    const res = await apiReviewTeacherRequest(params);
    await refreshAdminDirectoryData();
    return { customClaimsSynced: res.customClaimsSynced, auditLog: res.auditLog };
  };

  const deleteUserAccountViaBackend = async (params: {
    targetUid: string;
    confirmDelete: boolean;
    reason?: string;
  }) => {
    const res = await apiDeleteUserAccount(params);
    await refreshAdminDirectoryData();
    return { auditLog: res.auditLog };
  };

  const promoteUserToAdmin = async (targetUid: string) => {
    await changeUserRoleViaBackend({
      targetUid,
      newRole: 'admin',
      actionId: 'make_admin',
      confirmAdminPrivilegeChange: true
    });
  };

  const revokeAdminRole = async (targetUid: string, fallbackRole: 'student' | 'teacher' = 'student') => {
    await changeUserRoleViaBackend({
      targetUid,
      newRole: fallbackRole,
      actionId: fallbackRole === 'teacher' ? 'admin_to_teacher' : 'remove_admin',
      confirmAdminPrivilegeChange: true
    });
  };

  const assignRoleToCurrentUser = async (
    role: 'student' | 'teacher',
    details?: { qualification?: string; specialization?: string }
  ) => {
    const user = auth.currentUser;
    if (!user) throw new Error('No authenticated user session found.');
    if (role !== 'student' && role !== 'teacher') {
      throw new Error('Only Student or Request Teacher Access may be selected during onboarding.');
    }

    const nowIso = new Date().toISOString();
    const isOwner = user.email === 'sandeepgarg6375494692@gmail.com' && user.emailVerified;

    // Preserve any existing verified role & createdAt (Part 10 safe protection)
    const existingSnap = await getDoc(doc(db, 'users', user.uid));
    const existingData = existingSnap.exists() ? existingSnap.data() : null;
    if (existingData?.role === 'admin' || existingData?.role === 'teacher' || existingData?.role === 'student') {
      const preservedRole = existingData.role as UserRole;
      setVerifiedRole(preservedRole);
      setCurrentRoleState(preservedRole);
      setIsRoleSelectionModalOpen(false);
      setActiveSection(preservedRole === 'admin' ? 'admin-dashboard' : 'student-dashboard');
      return;
    }

    // PART 1: Selecting Teacher MUST NOT automatically grant the Teacher role!
    // Assign 'student' role and mark teacherApprovalStatus as 'Pending' until Admin approves.
    const finalRole: UserRole = isOwner ? 'admin' : 'student';
    const isTeacherRequest = !isOwner && role === 'teacher';
    const approvalStatus = isTeacherRequest ? 'Pending' : 'None';

    const userData: UserAccount = {
      uid: user.uid,
      id: user.uid,
      name: user.displayName || existingData?.name || (isTeacherRequest ? 'Teacher Applicant' : 'Candidate Aspirant'),
      displayName: user.displayName || existingData?.displayName || (isTeacherRequest ? 'Teacher Applicant' : 'Candidate Aspirant'),
      email: user.email || '',
      photoURL: user.photoURL || existingData?.photoURL || '',
      role: finalRole,
      requestedRole: isOwner ? undefined : role,
      accountStatus: 'Active',
      teacherApprovalStatus: approvalStatus,
      qualification: isTeacherRequest ? (details?.qualification?.trim() || 'Academic Faculty') : undefined,
      specialization: isTeacherRequest ? (details?.specialization?.trim() || 'General Studies & CSAT') : undefined,
      appliedAt: isTeacherRequest ? nowIso : undefined,
      lastLoginAt: nowIso,
      createdAt: existingData?.createdAt || nowIso,
      updatedAt: nowIso
    };

    // 1. Save to users/{uid} safely merging any pre-existing metadata
    await setDoc(doc(db, 'users', user.uid), userData, { merge: true });

    // 2. Initialize studentProfiles/{uid} if absent
    await setDoc(doc(db, 'studentProfiles', user.uid), {
      uid: user.uid,
      rankTitle: isTeacherRequest ? 'Teacher Applicant (Student Access)' : 'Academy Aspirant',
      totalTestsAttempted: 0,
      totalQuestionsSolved: 0,
      averageAccuracy: 0,
      lifetimePoints: 0,
      currentDailyPoints: 0,
      currentWeeklyPoints: 0,
      currentGlobalRank: 0,
      streakDays: 0
    }, { merge: true });

    // 3. If requesting Teacher access, create teacherProfiles/{uid} with Pending status
    if (isTeacherRequest) {
      await setDoc(doc(db, 'teacherProfiles', user.uid), {
        id: user.uid,
        name: userData.name,
        email: userData.email,
        photoURL: userData.photoURL || '',
        qualification: details?.qualification?.trim() || 'Academic Faculty',
        specialization: details?.specialization?.trim() || 'General Studies & CSAT',
        status: 'Pending',
        testsCreated: 0,
        joinedDate: new Date().toLocaleDateString('en-GB')
      }, { merge: true });
      setTeacherStatus('Pending');
    }

    setVerifiedRole(finalRole);
    setCurrentRoleState(finalRole);
    setAccountStatus('Active');
    setIsRoleSelectionModalOpen(false);

    if (finalRole === 'admin') {
      setActiveSection('admin-dashboard');
    } else {
      setActiveSection('student-dashboard');
    }
  };

  // Admin Specific Controls (all backed by secure server endpoints)
  const updateStudentStatus = async (studentId: string, status: 'Active' | 'Suspended') => {
    if (verifiedRole !== 'admin') return;
    await changeUserStatusViaBackend({ targetUid: studentId, newStatus: status });
  };

  const approveTeacher = async (teacherId: string) => {
    if (verifiedRole !== 'admin') return;
    await reviewTeacherRequestViaBackend({ targetUid: teacherId, decision: 'approve_teacher' });
  };

  const rejectTeacher = async (teacherId: string, reason = 'Application declined by Admin review.') => {
    if (verifiedRole !== 'admin') return;
    await reviewTeacherRequestViaBackend({ targetUid: teacherId, decision: 'reject', reason });
  };

  const suspendTeacher = async (teacherId: string) => {
    if (verifiedRole !== 'admin') return;
    await changeUserStatusViaBackend({
      targetUid: teacherId,
      newStatus: 'Suspended',
      reason: 'Suspended by Admin'
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
    const target = notifications.find(n => n.id === id);
    if (!target) return;
    const nextActive = !target.isActive;
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, isActive: nextActive } : n))
    );
    if (auth.currentUser) {
      updateDoc(doc(db, 'notifications', id), { isActive: nextActive }).catch(err => {
        console.error('Toggle notification error:', err);
        showActionBanner('error', 'सूचना स्थिति अपडेट करने में त्रुटि हुई।');
      });
    }
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    if (auth.currentUser) {
      deleteDoc(doc(db, 'notifications', id)).catch(err => {
        console.error('Delete notification error:', err);
        showActionBanner('error', 'सूचना हटाने में त्रुटि हुई।');
      });
    }
  };

  const addPYQ = (pyq: Omit<PYQSet, 'id'>) => {
    const newPyq: PYQSet = {
      ...pyq,
      id: `pyq-${Date.now()}`
    };
    setPYQs(prev => [newPyq, ...prev]);
    if (auth.currentUser) {
      setDoc(doc(db, 'pyqs', newPyq.id), newPyq).catch(err => {
        console.error('Add PYQ error:', err);
        showActionBanner('error', 'PYQ सेट सहेजने में त्रुटि हुई।');
      });
    }
    addAuditLog({
      actor: getActorName('Admin'),
      actorRole: 'Admin',
      action: 'Published Past Year Question Set',
      target: `${pyq.examName} (${pyq.year})`,
      status: 'Success'
    });
  };

  const updatePlatformSettings = (settings: Partial<PlatformSettings>) => {
    const nextSettings: PlatformSettings = { ...platformSettings, ...settings };
    setPlatformSettings(nextSettings);
    if (auth.currentUser) {
      setDoc(doc(db, 'platformSettings', 'global'), nextSettings, { merge: true }).catch(err => {
        console.error('Update platform settings error:', err);
        showActionBanner('error', 'प्लेटफ़ॉर्म सेटिंग्स सहेजने में त्रुटि हुई।');
      });
    }
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
      timestamp: new Date().toISOString(),
      ipAddress: '127.0.0.1'
    };
    setAuditLogs(prev => [newLog, ...prev.slice(0, 49)]);
    if (auth.currentUser) {
      setDoc(doc(db, 'auditLogs', newLog.id), newLog).catch(err => {
        console.warn('Audit log write notice:', err);
      });
    }
  };

  const addSubject = (subject: SubjectItem) => {
    setSubjects(prev => [...prev, subject]);
    if (auth.currentUser) {
      setDoc(doc(db, 'subjects', subject.id), subject).catch(err => {
        console.error('Add subject error:', err);
        showActionBanner('error', 'विषय सहेजने में त्रुटि हुई।');
      });
    }
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
    if (auth.currentUser) {
      updateDoc(doc(db, 'subjects', id), updated).catch(err => {
        console.error('Update subject error:', err);
        showActionBanner('error', 'विषय अपडेट करने में त्रुटि हुई।');
      });
    }
  };

  const resetLeaderboard = (type: 'daily' | 'weekly') => {
    const nowIso = new Date().toISOString();
    const nextSettings: PlatformSettings =
      type === 'daily'
        ? { ...platformSettings, dailyResetAt: nowIso }
        : { ...platformSettings, weeklyResetAt: nowIso };
    setPlatformSettings(nextSettings);

    if (auth.currentUser) {
      setDoc(doc(db, 'platformSettings', 'global'), nextSettings, { merge: true }).catch(err => {
        console.error('Leaderboard reset persist error:', err);
        showActionBanner('error', 'लीडरबोर्ड रीसेट सहेजने में त्रुटि हुई।');
      });
    }

    const recomputed = computeLeaderboardsFromDocs(latestLeaderboardDocsRef.current, nextSettings);
    latestRankMapRef.current = recomputed.rankByStudentId;
    setDailyLeaderboardState(recomputed.daily);
    setWeeklyLeaderboardState(recomputed.weekly);
    setGlobalLeaderboardState(recomputed.global);

    if (type === 'daily') {
      addAuditLog({
        actor: getActorName('Admin'),
        actorRole: 'Admin',
        action: 'Reset Daily Leaderboard Cycle',
        target: 'Daily Points Reset to Zero',
        status: 'Warning'
      });
    } else {
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
        verifiedRole,
        authLoading,
        dataLoading,
        dataError,
        retryLoadData,
        actionBanner,
        showActionBanner,
        dismissActionBanner,
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
        globalLeaderboard: globalLeaderboardState,
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
        adminSdkConfigured,
        authMetadataMap,
        refreshAdminDirectoryData,
        changeUserRoleViaBackend,
        changeUserStatusViaBackend,
        reviewTeacherRequestViaBackend,
        deleteUserAccountViaBackend,
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
        accountStatus,
        teacherStatus,
        teacherRejectionReason,
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

