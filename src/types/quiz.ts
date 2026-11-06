export type TestCategory =
  | 'Daily Test'
  | 'Weekly Test'
  | 'Mock Test'
  | 'PYQ Test'
  | 'Chapter Test'
  | 'Subject-wise Test';

export type TestStatus =
  | 'Draft'
  | 'Pending Approval'
  | 'Approved'
  | 'Published'
  | 'Scheduled'
  | 'Unpublished'
  | 'Archived'
  | 'Rejected';

export type UserRole = 'student' | 'teacher' | 'admin';

export type QuestionOptionKey = 'A' | 'B' | 'C' | 'D';
export type StudentResponseKey = 'A' | 'B' | 'C' | 'D' | 'E'; // E = Unattempted / No Response

export type QuestionState =
  | 'answered'
  | 'not_answered'
  | 'not_visited'
  | 'marked_for_review'
  | 'answered_and_marked';

export interface Question {
  id: string;
  testId?: string;
  statement: string;
  statementHindi?: string;
  imageURL?: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctAnswer: QuestionOptionKey;
  explanation: string;
  subject: string;
  topic: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  marks: number;
}

export interface Test {
  id: string;
  title: string;
  description: string;
  category: TestCategory;
  subject: string;
  topic: string;
  durationMinutes: number;
  totalQuestions: number;
  maxMarks: number;
  marksPerCorrect: number;
  negativeMarkingEnabled: boolean;
  negativeMarks: number;
  startDate?: string;
  endDate?: string;
  status: TestStatus;
  createdBy: string;
  teacherName?: string;
  approvedBy?: string;
  createdAt: string;
  questions: Question[];
}

export interface TestAttempt {
  id: string;
  testId: string;
  testTitle: string;
  category: TestCategory;
  subject: string;
  studentId: string;
  studentName: string;
  answers: Record<string, StudentResponseKey>; // questionId -> A|B|C|D|E
  questionStates: Record<string, QuestionState>;
  correctCount: number;
  wrongCount: number;
  unansweredCount: number; // Includes explicit Option E and unselected
  obtainedMarks: number;
  maxMarks: number;
  accuracy: number; // percentage
  timeTakenSeconds: number;
  startedAt: string;
  submittedAt: string;
  rank?: number;
  totalParticipants?: number;
}

export interface StudentProfile {
  uid: string;
  name: string;
  email: string;
  photoURL: string;
  rankTitle: string; // e.g. "Special Jonin", "Hokage Aspirant"
  totalTestsAttempted: number;
  totalQuestionsSolved: number;
  averageAccuracy: number;
  lifetimePoints: number;
  currentDailyPoints: number;
  currentWeeklyPoints: number;
  currentGlobalRank: number;
  streakDays: number;
  recentTestActivity: {
    testName: string;
    date: string;
    score: number;
    maxScore: number;
    accuracy: number;
  }[];
}

export interface LeaderboardEntry {
  rank: number;
  studentId: string;
  name: string;
  avatar: string;
  points: number;
  accuracy: number;
  badge: 'Genin' | 'Chunin' | 'Jonin' | 'ANBU' | 'Hokage';
  testsAttempted: number;
  change: 'up' | 'down' | 'same';
}

export interface BookmarkedQuestion {
  questionId: string;
  question: Question;
  savedDate: string;
  notes?: string;
}

export interface SubjectItem {
  id: string;
  name: string;
  hindiName: string;
  iconName: string;
  totalTests: number;
  totalQuestions: number;
  topics: string[];
}

export interface TeacherProfile {
  id: string;
  name: string;
  email: string;
  photoURL: string;
  qualification: string;
  specialization: string;
  status: 'Approved' | 'Pending' | 'Suspended';
  testsCreated: number;
  joinedDate: string;
}

export interface AdminAuditLog {
  id: string;
  timestamp: string;
  actor: string;
  actorRole: 'Admin' | 'Teacher' | 'System' | 'Student';
  action: string;
  target: string;
  status: 'Success' | 'Warning' | 'Notice';
  ipAddress?: string;
}

export interface NotificationAnnouncement {
  id: string;
  title: string;
  message: string;
  targetAudience: 'All' | 'Students' | 'Teachers';
  type: 'info' | 'warning' | 'celebration' | 'alert';
  createdAt: string;
  isActive: boolean;
  bannerDisplay: boolean;
}

export interface PYQSet {
  id: string;
  examName: string;
  year: number;
  subject: string;
  totalQuestions: number;
  testId?: string;
  difficulty: 'Moderate' | 'Hard' | 'Tough';
}

export interface PlatformSettings {
  enforceOneAttempt: boolean;
  enforceOptionE: boolean; // 5-option OMR standard
  enableNegativeMarkingDefault: boolean;
  defaultNegativeMarkPenalty: number;
  dailyChallengeTestId: string;
  featuredTestIds: string[];
  bannerAnnouncement: string;
  isBannerActive: boolean;
}

