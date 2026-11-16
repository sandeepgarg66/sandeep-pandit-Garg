import {
  Test,
  Question,
  StudentProfile,
  LeaderboardEntry,
  SubjectItem,
  BookmarkedQuestion,
  TeacherProfile,
  AdminAuditLog,
  NotificationAnnouncement,
  PYQSet,
  PlatformSettings
} from '../types/quiz';

export const MOCK_QUESTIONS: Question[] = [];


export const MOCK_TESTS: Test[] = [];


export const INITIAL_STUDENT_PROFILE: StudentProfile = {
  uid: '',
  name: 'Candidate Aspirant',
  email: '',
  photoURL: '',
  rankTitle: 'Candidate Aspirant',
  totalTestsAttempted: 0,
  totalQuestionsSolved: 0,
  averageAccuracy: 0,
  lifetimePoints: 0,
  currentDailyPoints: 0,
  currentWeeklyPoints: 0,
  currentGlobalRank: 0,
  streakDays: 0,
  recentTestActivity: []
};

export const DAILY_LEADERBOARD: LeaderboardEntry[] = [];

export const WEEKLY_LEADERBOARD: LeaderboardEntry[] = [];

export const GLOBAL_LEADERBOARD: LeaderboardEntry[] = [];

export const SUBJECTS_LIST: SubjectItem[] = [
  {
    id: 'polity',
    name: 'Indian Polity & Governance',
    hindiName: 'भारतीय राजव्यवस्था एवं संविधान',
    iconName: 'Shield',
    totalTests: 0,
    totalQuestions: 0,
    topics: ['Constitutional Framework', 'Fundamental Rights', 'Parliament & State Legislatures', 'Judiciary & AIJS', 'Emergency Provisions']
  },
  {
    id: 'science',
    name: 'General Science & Tech',
    hindiName: 'सामान्य विज्ञान एवं प्रौद्योगिकी',
    iconName: 'Zap',
    totalTests: 0,
    totalQuestions: 0,
    topics: ['Modern Physics', 'Endocrine & Human Biology', 'Applied Chemistry', 'Space & Defense Technology', 'Biotechnology']
  },
  {
    id: 'history',
    name: 'History of India & National Movement',
    hindiName: 'भारत का इतिहास एवं राष्ट्रीय आन्दोलन',
    iconName: 'BookOpen',
    totalTests: 0,
    totalQuestions: 0,
    topics: ['Indus Valley & Vedic Period', 'Maurya & Gupta Empires', 'Bhakti & Sufi Movements', 'Freedom Struggle 1857-1947', 'Post-Independence Consolidation']
  },
  {
    id: 'quant',
    name: 'Quantitative Aptitude & CSAT',
    hindiName: 'संख्यात्मक अभियोग्यता (मैथ्स)',
    iconName: 'BarChart3',
    totalTests: 0,
    totalQuestions: 0,
    topics: ['Percentages & Profit Loss', 'Time, Speed & Distance', 'Number Systems', 'Permutation & Probability', 'Data Interpretation']
  },
  {
    id: 'reasoning',
    name: 'Logical Reasoning & Analytical Ability',
    hindiName: 'तार्किक एवं विश्लेषणात्मक तर्कशक्ति',
    iconName: 'Brain',
    totalTests: 0,
    totalQuestions: 0,
    topics: ['Coding-Decoding', 'Syllogism', 'Blood Relations', 'Direction Sense', 'Seating Arrangements & Puzzles']
  },
  {
    id: 'ecology',
    name: 'Ecology & Environment',
    hindiName: 'पर्यावरण एवं पारिस्थितिकी',
    iconName: 'Flame',
    totalTests: 0,
    totalQuestions: 0,
    topics: ['Trophic Levels & Biomes', 'Biodiversity Hotspots', 'Climate Agreements & Conventions', 'Pollution & Waste Norms', 'National Parks & Sanctuaries']
  }
];

export const INITIAL_BOOKMARKS: BookmarkedQuestion[] = [];

export const MOCK_TEACHERS: TeacherProfile[] = [];

export const MOCK_AUDIT_LOGS: AdminAuditLog[] = [];

export const MOCK_NOTIFICATIONS: NotificationAnnouncement[] = [];

export const MOCK_PYQS: PYQSet[] = [];

export const INITIAL_PLATFORM_SETTINGS: PlatformSettings = {
  enforceOneAttempt: true,
  enforceOptionE: true,
  enableNegativeMarkingDefault: true,
  defaultNegativeMarkPenalty: 0.33,
  dailyChallengeTestId: '',
  featuredTestIds: [],
  bannerAnnouncement: '',
  isBannerActive: false
};

