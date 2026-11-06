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

export const MOCK_QUESTIONS: Question[] = [
  {
    id: 'q-101',
    statement: 'Which Article of the Constitution of India provides for the creation of an All India Judicial Service (AIJS) by the Parliament?',
    statementHindi: 'भारत के संविधान का कौन सा अनुच्छेद संसद द्वारा अखिल भारतीय न्यायिक सेवा (AIJS) के निर्माण का प्रावधान करता है?',
    options: {
      A: 'Article 312',
      B: 'Article 315',
      C: 'Article 248',
      D: 'Article 233'
    },
    correctAnswer: 'A',
    explanation: 'Article 312 of the Constitution provides that if the Council of States (Rajya Sabha) declares by resolution supported by not less than two-thirds of the members present and voting that it is necessary, Parliament may by law provide for the creation of one or more all-India services common to the Union and the States, including an all-India judicial service.',
    subject: 'Indian Polity & Governance',
    topic: 'Judiciary & All-India Services',
    difficulty: 'Medium',
    marks: 2
  },
  {
    id: 'q-102',
    statement: 'In the context of modern physics, which phenomenon provides the most direct proof of the particle nature (quantization) of electromagnetic radiation?',
    statementHindi: 'आधुनिक भौतिकी में, कौन सी घटना विद्युत चुम्बकीय विकिरण की कण प्रकृति (क्वांटमीकरण) का प्रत्यक्ष प्रमाण देती है?',
    options: {
      A: 'Photoelectric Effect',
      B: 'Double Slit Interference',
      C: 'Fraunhofer Diffraction',
      D: 'Total Internal Reflection'
    },
    correctAnswer: 'A',
    explanation: 'The Photoelectric Effect (explained by Albert Einstein in 1905 using Max Planck\'s quantum hypothesis) proved that light consists of discrete energy packets called photons. Interference and diffraction demonstrate light\'s wave nature.',
    subject: 'General Science',
    topic: 'Modern Physics & Quantum Theory',
    difficulty: 'Easy',
    marks: 2
  },
  {
    id: 'q-103',
    statement: 'Which among the following Harappan sites has yielded the unique archaeological evidence of an ancient tidal dockyard connected to the Gulf of Khambhat?',
    statementHindi: 'निम्नलिखित में से किस हड़प्पा स्थल से खंभात की खाड़ी से जुड़े एक प्राचीन ज्वारीय गोदी (डॉकयार्ड) के अद्वितीय पुरातात्विक साक्ष्य मिले हैं?',
    options: {
      A: 'Kalibangan',
      B: 'Lothal',
      C: 'Dholavira',
      D: 'Banawali'
    },
    correctAnswer: 'B',
    explanation: 'Lothal in Gujarat was a prominent port city of the Indus Valley Civilization featuring a massive brick basin identified as an engineered tidal dockyard connected to the Bhogavo river and Gulf of Cambay.',
    subject: 'Ancient Indian History',
    topic: 'Indus Valley Civilization',
    difficulty: 'Easy',
    marks: 2
  },
  {
    id: 'q-104',
    statement: 'A shopkeeper marks an article 40% above the cost price and allows a discount of 25% on the marked price. What is the net profit or loss percentage?',
    statementHindi: 'एक दुकानदार एक वस्तु का मूल्य क्रय मूल्य से 40% अधिक अंकित करता है और अंकित मूल्य पर 25% की छूट देता है। शुद्ध लाभ या हानि प्रतिशत क्या है?',
    options: {
      A: '5% Profit',
      B: '10% Profit',
      C: '5% Loss',
      D: '15% Profit'
    },
    correctAnswer: 'A',
    explanation: 'Let CP = 100. Marked Price MP = 140. Selling Price SP = 140 * (1 - 0.25) = 140 * 0.75 = 105. Net Profit = 105 - 100 = 5%.',
    subject: 'Quantitative Aptitude',
    topic: 'Profit, Loss & Discount',
    difficulty: 'Medium',
    marks: 2
  },
  {
    id: 'q-105',
    statement: 'In the ecosystem energy pyramid, according to Lindeman\'s 10% law, if 10,000 J of solar energy is absorbed by primary producers, how much energy reaches the secondary consumers?',
    statementHindi: 'पारिस्थितिक तंत्र ऊर्जा पिरामिड में लिंडेमैन के 10% नियम के अनुसार, यदि प्राथमिक उत्पादकों द्वारा 10,000 J ऊर्जा अवशोषित की जाती है, तो द्वितीयक उपभोक्ताओं तक कितनी ऊर्जा पहुँचती है?',
    options: {
      A: '1,000 Joules',
      B: '100 Joules',
      C: '10 Joules',
      D: '1 Joule'
    },
    correctAnswer: 'B',
    explanation: 'Producers = 10,000 J. Primary Consumers (Herbivores) receive 10% = 1,000 J. Secondary Consumers (Carnivores) receive 10% of that = 100 J.',
    subject: 'Ecology & Environment',
    topic: 'Trophic Levels & Energy Flow',
    difficulty: 'Medium',
    marks: 2
  },
  {
    id: 'q-106',
    statement: 'If in a coded language, "CHAKRA" is written as "EKCMTC", how will "NINJA" be coded under the exact same transformation?',
    statementHindi: 'यदि किसी सांकेतिक भाषा में "CHAKRA" को "EKCMTC" लिखा जाता है, तो उसी नियम के तहत "NINJA" को कैसे कोडित किया जाएगा?',
    options: {
      A: 'PKPLC',
      B: 'PKPMC',
      C: 'QKQLD',
      D: 'OLOKA'
    },
    correctAnswer: 'A',
    explanation: 'Each letter is shifted forward by +2 positions in the English alphabet: N(+2)->P, I(+2)->K, N(+2)->P, J(+2)->L, A(+2)->C => PKPLC.',
    subject: 'Logical Reasoning',
    topic: 'Coding & Decoding',
    difficulty: 'Easy',
    marks: 2
  },
  {
    id: 'q-107',
    statement: 'Under which constitutional amendment act was the Right to Education (Article 21A) inserted into Part III of the Constitution of India?',
    statementHindi: 'किस संविधान संशोधन अधिनियम के तहत शिक्षा का अधिकार (अनुच्छेद 21A) भारत के संविधान के भाग III में शामिल किया गया था?',
    options: {
      A: '42nd Amendment Act, 1976',
      B: '44th Amendment Act, 1978',
      C: '86th Amendment Act, 2002',
      D: '91st Amendment Act, 2003'
    },
    correctAnswer: 'C',
    explanation: 'The 86th Constitutional Amendment Act, 2002 inserted Article 21A, declaring education for children aged 6 to 14 a Fundamental Right.',
    subject: 'Indian Polity & Governance',
    topic: 'Fundamental Rights',
    difficulty: 'Easy',
    marks: 2
  },
  {
    id: 'q-108',
    statement: 'Which hormone is primarily responsible for the "Fight or Flight" stress response, accelerating heart rate and blood glucose levels?',
    statementHindi: 'मानव शरीर में कौन सा हार्मोन "लड़ो या भागो" (Fight or Flight) प्रतिक्रिया के लिए मुख्य रूप से जिम्मेदार है?',
    options: {
      A: 'Thyroxine',
      B: 'Adrenaline (Epinephrine)',
      C: 'Insulin',
      D: 'Melatonin'
    },
    correctAnswer: 'B',
    explanation: 'Adrenaline, secreted by the adrenal medulla, stimulates the sympathetic nervous system during acute crisis or emergency situations.',
    subject: 'General Science',
    topic: 'Human Endocrine System',
    difficulty: 'Easy',
    marks: 2
  }
];

export const MOCK_TESTS: Test[] = [
  {
    id: 'test-daily-01',
    title: 'Daily Konoha Speed Test — Day 42 (Polity & Science)',
    description: 'High-speed morning diagnostic covering All-India Services, Quantum Radiation, and Endocrine Systems.',
    category: 'Daily Test',
    subject: 'General Studies & Science',
    topic: 'Constitutional Articles & Physics',
    durationMinutes: 10,
    totalQuestions: 5,
    maxMarks: 10,
    marksPerCorrect: 2,
    negativeMarkingEnabled: true,
    negativeMarks: 0.66,
    status: 'Published',
    createdBy: 'Kakashi-Sensei',
    teacherName: 'Kakashi Hatake',
    createdAt: '2026-11-05T08:00:00Z',
    questions: MOCK_QUESTIONS.slice(0, 5)
  },
  {
    id: 'test-weekly-01',
    title: 'Weekly Chunin Exam Prelims — Full Mock Assessment',
    description: 'Comprehensive 8-question mock covering Polity, Science, Ancient History, Quantitative Aptitude, and Environment.',
    category: 'Weekly Test',
    subject: 'Full Syllabus General Studies',
    topic: 'Comprehensive Paper 1',
    durationMinutes: 15,
    totalQuestions: 8,
    maxMarks: 16,
    marksPerCorrect: 2,
    negativeMarkingEnabled: true,
    negativeMarks: 0.5,
    status: 'Published',
    createdBy: 'Jiraiya-Sama',
    teacherName: 'Jiraiya (Toad Sage)',
    createdAt: '2026-11-04T10:00:00Z',
    questions: MOCK_QUESTIONS
  },
  {
    id: 'test-mock-01',
    title: 'All-India Grand Mock Test — Prelims Phase I',
    description: 'Full-length simulation modeled on actual competitive examination patterns with negative marking.',
    category: 'Mock Test',
    subject: 'General Studies Paper I',
    topic: 'Complete Prelims Standard',
    durationMinutes: 20,
    totalQuestions: 8,
    maxMarks: 16,
    marksPerCorrect: 2,
    negativeMarkingEnabled: true,
    negativeMarks: 0.66,
    status: 'Published',
    createdBy: 'Tsunade-Hokage',
    teacherName: 'Lady Tsunade',
    createdAt: '2026-11-03T09:00:00Z',
    questions: MOCK_QUESTIONS
  },
  {
    id: 'test-pyq-01',
    title: 'PYQ Archive: 2024–2025 Solved Examination Papers',
    description: 'Real past examination questions with verified authoritative explanations and scoring rules.',
    category: 'PYQ Test',
    subject: 'Indian Polity & History',
    topic: 'Previous Year Selected MCQs',
    durationMinutes: 12,
    totalQuestions: 6,
    maxMarks: 12,
    marksPerCorrect: 2,
    negativeMarkingEnabled: true,
    negativeMarks: 0.5,
    status: 'Published',
    createdBy: 'Minato-Namikaze',
    teacherName: 'Minato Namikaze',
    createdAt: '2026-11-01T12:00:00Z',
    questions: MOCK_QUESTIONS.slice(0, 6)
  },
  {
    id: 'test-chapter-01',
    title: 'Chapter Test: Fundamental Rights & Directive Principles',
    description: 'Deep dive into Articles 12 to 51A with focus on landmark constitutional amendments.',
    category: 'Chapter Test',
    subject: 'Indian Polity & Governance',
    topic: 'Part III & Part IV Analysis',
    durationMinutes: 10,
    totalQuestions: 4,
    maxMarks: 8,
    marksPerCorrect: 2,
    negativeMarkingEnabled: true,
    negativeMarks: 0.5,
    status: 'Published',
    createdBy: 'Kakashi-Sensei',
    teacherName: 'Kakashi Hatake',
    createdAt: '2026-10-29T14:00:00Z',
    questions: [MOCK_QUESTIONS[0], MOCK_QUESTIONS[6], MOCK_QUESTIONS[1], MOCK_QUESTIONS[4]]
  },
  {
    id: 'test-subject-01',
    title: 'Subject-wise Test: General Science & Everyday Technology',
    description: 'Targeted drill focusing on high-frequency questions in Physics, Chemistry, and Human Biology.',
    category: 'Subject-wise Test',
    subject: 'General Science',
    topic: 'Physics & Human Physiology',
    durationMinutes: 10,
    totalQuestions: 4,
    maxMarks: 8,
    marksPerCorrect: 2,
    negativeMarkingEnabled: false,
    negativeMarks: 0,
    status: 'Published',
    createdBy: 'Tsunade-Hokage',
    teacherName: 'Lady Tsunade',
    createdAt: '2026-10-28T16:00:00Z',
    questions: [MOCK_QUESTIONS[1], MOCK_QUESTIONS[4], MOCK_QUESTIONS[7], MOCK_QUESTIONS[2]]
  }
];

export const INITIAL_STUDENT_PROFILE: StudentProfile = {
  uid: 'usr_naruto_student_01',
  name: 'Uzumaki Sanskar',
  email: 'sanskar.quiz@leafvillage.edu',
  photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  rankTitle: 'Special Jonin Aspirant',
  totalTestsAttempted: 19,
  totalQuestionsSolved: 248,
  averageAccuracy: 84.6,
  lifetimePoints: 3420,
  currentDailyPoints: 180,
  currentWeeklyPoints: 940,
  currentGlobalRank: 4,
  streakDays: 14,
  recentTestActivity: [
    {
      testName: 'Daily Konoha Speed Test — Day 41',
      date: 'Yesterday, 09:30 AM',
      score: 10,
      maxScore: 10,
      accuracy: 100
    },
    {
      testName: 'Weekly Chunin Exam Prelims #03',
      date: '03 Nov 2026',
      score: 14,
      maxScore: 16,
      accuracy: 87.5
    },
    {
      testName: 'Chapter Test: Fundamental Rights',
      date: '01 Nov 2026',
      score: 8,
      maxScore: 8,
      accuracy: 100
    }
  ]
};

export const DAILY_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, studentId: 's-01', name: 'Itachi Uchiha', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80', points: 340, accuracy: 98.2, badge: 'Hokage', testsAttempted: 4, change: 'up' },
  { rank: 2, studentId: 's-02', name: 'Sasuke Uchiha', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80', points: 310, accuracy: 94.5, badge: 'ANBU', testsAttempted: 3, change: 'same' },
  { rank: 3, studentId: 's-03', name: 'Shikamaru Nara', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80', points: 290, accuracy: 96.0, badge: 'Jonin', testsAttempted: 3, change: 'up' },
  { rank: 4, studentId: 'usr_naruto_student_01', name: 'Uzumaki Sanskar (You)', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80', points: 180, accuracy: 88.4, badge: 'Jonin', testsAttempted: 2, change: 'up' },
  { rank: 5, studentId: 's-05', name: 'Neji Hyuga', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80', points: 170, accuracy: 91.2, badge: 'Chunin', testsAttempted: 2, change: 'down' },
  { rank: 6, studentId: 's-06', name: 'Sakura Haruno', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80', points: 160, accuracy: 85.0, badge: 'Chunin', testsAttempted: 2, change: 'same' },
  { rank: 7, studentId: 's-07', name: 'Rock Lee', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop&q=80', points: 140, accuracy: 79.5, badge: 'Genin', testsAttempted: 3, change: 'up' },
  { rank: 8, studentId: 's-08', name: 'Hinata Hyuga', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80', points: 130, accuracy: 89.0, badge: 'Chunin', testsAttempted: 2, change: 'down' },
  { rank: 9, studentId: 's-09', name: 'Gaara of Sand', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=80', points: 120, accuracy: 92.4, badge: 'Jonin', testsAttempted: 1, change: 'same' },
  { rank: 10, studentId: 's-10', name: 'Temari', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80', points: 110, accuracy: 86.8, badge: 'Chunin', testsAttempted: 1, change: 'down' }
];

export const WEEKLY_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, studentId: 's-03', name: 'Shikamaru Nara', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80', points: 1640, accuracy: 97.5, badge: 'Hokage', testsAttempted: 16, change: 'up' },
  { rank: 2, studentId: 's-01', name: 'Itachi Uchiha', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80', points: 1580, accuracy: 98.1, badge: 'Hokage', testsAttempted: 14, change: 'down' },
  { rank: 3, studentId: 's-02', name: 'Sasuke Uchiha', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80', points: 1420, accuracy: 93.6, badge: 'ANBU', testsAttempted: 15, change: 'same' },
  { rank: 4, studentId: 's-05', name: 'Neji Hyuga', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80', points: 1150, accuracy: 90.0, badge: 'Jonin', testsAttempted: 12, change: 'up' },
  { rank: 5, studentId: 'usr_naruto_student_01', name: 'Uzumaki Sanskar (You)', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80', points: 940, accuracy: 86.4, badge: 'Jonin', testsAttempted: 10, change: 'up' },
  { rank: 6, studentId: 's-06', name: 'Sakura Haruno', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80', points: 880, accuracy: 88.0, badge: 'Chunin', testsAttempted: 9, change: 'same' },
  { rank: 7, studentId: 's-09', name: 'Gaara of Sand', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=80', points: 840, accuracy: 91.5, badge: 'Jonin', testsAttempted: 8, change: 'up' },
  { rank: 8, studentId: 's-07', name: 'Rock Lee', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop&q=80', points: 810, accuracy: 81.2, badge: 'Chunin', testsAttempted: 11, change: 'down' },
  { rank: 9, studentId: 's-08', name: 'Hinata Hyuga', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80', points: 760, accuracy: 87.0, badge: 'Chunin', testsAttempted: 8, change: 'same' },
  { rank: 10, studentId: 's-10', name: 'Temari', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80', points: 720, accuracy: 85.5, badge: 'Chunin', testsAttempted: 7, change: 'down' }
];

export const GLOBAL_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, studentId: 's-01', name: 'Itachi Uchiha', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80', points: 12480, accuracy: 98.4, badge: 'Hokage', testsAttempted: 112, change: 'same' },
  { rank: 2, studentId: 's-03', name: 'Shikamaru Nara', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80', points: 11920, accuracy: 97.2, badge: 'Hokage', testsAttempted: 108, change: 'same' },
  { rank: 3, studentId: 's-02', name: 'Sasuke Uchiha', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80', points: 10640, accuracy: 94.1, badge: 'ANBU', testsAttempted: 98, change: 'same' },
  { rank: 4, studentId: 'usr_naruto_student_01', name: 'Uzumaki Sanskar (You)', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80', points: 3420, accuracy: 84.6, badge: 'Jonin', testsAttempted: 19, change: 'up' },
  { rank: 5, studentId: 's-05', name: 'Neji Hyuga', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80', points: 3290, accuracy: 90.8, badge: 'Jonin', testsAttempted: 24, change: 'down' },
  { rank: 6, studentId: 's-09', name: 'Gaara of Sand', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=80', points: 2980, accuracy: 91.0, badge: 'Jonin', testsAttempted: 22, change: 'same' },
  { rank: 7, studentId: 's-06', name: 'Sakura Haruno', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80', points: 2840, accuracy: 86.5, badge: 'Chunin', testsAttempted: 25, change: 'same' },
  { rank: 8, studentId: 's-07', name: 'Rock Lee', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop&q=80', points: 2610, accuracy: 80.4, badge: 'Chunin', testsAttempted: 31, change: 'up' },
  { rank: 9, studentId: 's-08', name: 'Hinata Hyuga', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80', points: 2490, accuracy: 87.2, badge: 'Chunin', testsAttempted: 21, change: 'down' },
  { rank: 10, studentId: 's-10', name: 'Temari', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80', points: 2310, accuracy: 85.0, badge: 'Chunin', testsAttempted: 18, change: 'same' }
];

export const SUBJECTS_LIST: SubjectItem[] = [
  {
    id: 'polity',
    name: 'Indian Polity & Governance',
    hindiName: 'भारतीय राजव्यवस्था एवं संविधान',
    iconName: 'Shield',
    totalTests: 14,
    totalQuestions: 210,
    topics: ['Constitutional Framework', 'Fundamental Rights', 'Parliament & State Legislatures', 'Judiciary & AIJS', 'Emergency Provisions']
  },
  {
    id: 'science',
    name: 'General Science & Tech',
    hindiName: 'सामान्य विज्ञान एवं प्रौद्योगिकी',
    iconName: 'Zap',
    totalTests: 18,
    totalQuestions: 270,
    topics: ['Modern Physics', 'Endocrine & Human Biology', 'Applied Chemistry', 'Space & Defense Technology', 'Biotechnology']
  },
  {
    id: 'history',
    name: 'History of India & National Movement',
    hindiName: 'भारत का इतिहास एवं राष्ट्रीय आन्दोलन',
    iconName: 'BookOpen',
    totalTests: 16,
    totalQuestions: 240,
    topics: ['Indus Valley & Vedic Period', 'Maurya & Gupta Empires', 'Bhakti & Sufi Movements', 'Freedom Struggle 1857-1947', 'Post-Independence Consolidation']
  },
  {
    id: 'quant',
    name: 'Quantitative Aptitude & CSAT',
    hindiName: 'संख्यात्मक अभियोग्यता (मैथ्स)',
    iconName: 'BarChart3',
    totalTests: 22,
    totalQuestions: 330,
    topics: ['Percentages & Profit Loss', 'Time, Speed & Distance', 'Number Systems', 'Permutation & Probability', 'Data Interpretation']
  },
  {
    id: 'reasoning',
    name: 'Logical Reasoning & Analytical Ability',
    hindiName: 'तार्किक एवं विश्लेषणात्मक तर्कशक्ति',
    iconName: 'Brain',
    totalTests: 15,
    totalQuestions: 225,
    topics: ['Coding-Decoding', 'Syllogism', 'Blood Relations', 'Direction Sense', 'Seating Arrangements & Puzzles']
  },
  {
    id: 'ecology',
    name: 'Ecology & Environment',
    hindiName: 'पर्यावरण एवं पारिस्थितिकी',
    iconName: 'Flame',
    totalTests: 12,
    totalQuestions: 180,
    topics: ['Trophic Levels & Biomes', 'Biodiversity Hotspots', 'Climate Agreements & Conventions', 'Pollution & Waste Norms', 'National Parks & Sanctuaries']
  }
];

export const INITIAL_BOOKMARKS: BookmarkedQuestion[] = [
  {
    questionId: 'q-101',
    question: MOCK_QUESTIONS[0],
    savedDate: '02 Nov 2026',
    notes: 'Important Article 312 regarding All India Judicial Service.'
  },
  {
    questionId: 'q-105',
    question: MOCK_QUESTIONS[4],
    savedDate: '03 Nov 2026',
    notes: 'Remember Lindeman 10% trophic transfer calculation.'
  }
];

export const MOCK_TEACHERS: TeacherProfile[] = [
  {
    id: 'tch-01',
    name: 'Kakashi Hatake',
    email: 'kakashi.sensei@leafvillage.edu',
    photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    qualification: 'M.Sc. Physics (Gold Medalist), Former Jonin Chief Examiner',
    specialization: 'General Science & Applied Physics',
    status: 'Approved',
    testsCreated: 14,
    joinedDate: '15 Jan 2026'
  },
  {
    id: 'tch-02',
    name: 'Shikamaru Nara',
    email: 'shikamaru.nara@leafvillage.edu',
    photoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    qualification: 'Ph.D. Operations Research & Game Theory',
    specialization: 'Quantitative Aptitude & Strategic Reasoning',
    status: 'Approved',
    testsCreated: 21,
    joinedDate: '10 Feb 2026'
  },
  {
    id: 'tch-03',
    name: 'Tsunade Senju',
    email: 'tsunade.senju@leafvillage.edu',
    photoURL: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    qualification: 'M.D. Cell Biology & Bio-Medical Sciences',
    specialization: 'Biology, Ecology & Environment',
    status: 'Approved',
    testsCreated: 18,
    joinedDate: '01 Mar 2026'
  },
  {
    id: 'tch-04',
    name: 'Jiraiya Ogata',
    email: 'jiraiya.sage@leafvillage.edu',
    photoURL: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    qualification: 'M.A. Modern & Ancient History, Author & Fellow',
    specialization: 'Ancient & Modern Indian History, World Geopolitics',
    status: 'Approved',
    testsCreated: 9,
    joinedDate: '18 Mar 2026'
  },
  {
    id: 'tch-05',
    name: 'Yamato Wood',
    email: 'yamato.tenzo@leafvillage.edu',
    photoURL: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    qualification: 'M.Sc. Environmental Geography & Disaster Management',
    specialization: 'Geography & Environmental Sciences',
    status: 'Pending',
    testsCreated: 2,
    joinedDate: '04 Nov 2026'
  }
];

export const MOCK_AUDIT_LOGS: AdminAuditLog[] = [
  {
    id: 'log-01',
    timestamp: 'Just now',
    actor: 'Hokage Tsunade (Admin)',
    actorRole: 'Admin',
    action: 'Approved & Published Test',
    target: 'Konoha Grand All-India Mock Test #01',
    status: 'Success',
    ipAddress: '192.168.1.101'
  },
  {
    id: 'log-02',
    timestamp: '14 mins ago',
    actor: 'Kakashi Hatake (Teacher)',
    actorRole: 'Teacher',
    action: 'Submitted Test for Approval',
    target: 'Weekly Chunin Exam Prelims #04',
    status: 'Notice',
    ipAddress: '10.0.4.88'
  },
  {
    id: 'log-03',
    timestamp: '42 mins ago',
    actor: 'System OMR Validator',
    actorRole: 'System',
    action: 'One-Attempt Integrity Check Passed',
    target: 'Enforced Option E for candidate att_1048',
    status: 'Success',
    ipAddress: 'Internal VPC'
  },
  {
    id: 'log-04',
    timestamp: '2 hours ago',
    actor: 'Hokage Tsunade (Admin)',
    actorRole: 'Admin',
    action: 'Updated Global Leaderboard Interval',
    target: 'Daily Points Recalibration Cycle',
    status: 'Success',
    ipAddress: '192.168.1.101'
  },
  {
    id: 'log-05',
    timestamp: '5 hours ago',
    actor: 'Yamato Wood (Educator)',
    actorRole: 'Teacher',
    action: 'Educator Registration Submitted',
    target: 'Pending Admin Verification',
    status: 'Notice',
    ipAddress: '172.16.20.14'
  },
  {
    id: 'log-06',
    timestamp: 'Yesterday at 18:30',
    actor: 'Security Guard System',
    actorRole: 'System',
    action: 'Suspicious Attempt Flagged & Cleared',
    target: 'Session replay verified within time limits',
    status: 'Warning',
    ipAddress: '49.36.12.90'
  }
];

export const MOCK_NOTIFICATIONS: NotificationAnnouncement[] = [
  {
    id: 'notif-01',
    title: 'Konoha Grand All-India Mock Test #01 is LIVE!',
    message: 'National rank benchmarking is open now. Remember the 5-option OMR standard: select Option E if you wish to leave a question unattempted with zero penalty.',
    targetAudience: 'All',
    type: 'celebration',
    createdAt: '06 Nov 2026',
    isActive: true,
    bannerDisplay: true
  },
  {
    id: 'notif-02',
    title: 'Daily Speed Test Leaderboard Resets at 00:00 UTC',
    message: 'Top 10 aspirants win special chakra streak badges. Make sure you complete your daily test attempt before midnight.',
    targetAudience: 'Students',
    type: 'info',
    createdAt: '05 Nov 2026',
    isActive: true,
    bannerDisplay: false
  },
  {
    id: 'notif-03',
    title: 'Educator Question Moderation Guidelines',
    message: 'All questions must contain exactly 4 factual options (A–D). Option E (Unattempted) is dynamically injected by the examination engine.',
    targetAudience: 'Teachers',
    type: 'warning',
    createdAt: '04 Nov 2026',
    isActive: true,
    bannerDisplay: false
  }
];

export const MOCK_PYQS: PYQSet[] = [
  {
    id: 'pyq-01',
    examName: 'UPSC Civil Services Prelims (GS Paper 1)',
    year: 2025,
    subject: 'Indian Polity & Governance',
    totalQuestions: 100,
    testId: 'test-pyq-2025',
    difficulty: 'Tough'
  },
  {
    id: 'pyq-02',
    examName: 'SSC CGL Tier-1 General Studies',
    year: 2025,
    subject: 'General Science & History',
    totalQuestions: 25,
    testId: 'test-pyq-cgl-2025',
    difficulty: 'Moderate'
  },
  {
    id: 'pyq-03',
    examName: 'NEET UG Physics & Chemistry',
    year: 2024,
    subject: 'General Science',
    totalQuestions: 90,
    testId: 'test-pyq-neet-2024',
    difficulty: 'Hard'
  },
  {
    id: 'pyq-04',
    examName: 'JEE Main Physics Section A',
    year: 2024,
    subject: 'General Science',
    totalQuestions: 30,
    testId: 'test-pyq-jee-2024',
    difficulty: 'Tough'
  },
  {
    id: 'pyq-05',
    examName: 'State PCS Prelims Combined Paper',
    year: 2023,
    subject: 'Modern & Ancient Indian History',
    totalQuestions: 150,
    testId: 'test-pyq-pcs-2023',
    difficulty: 'Moderate'
  }
];

export const INITIAL_PLATFORM_SETTINGS: PlatformSettings = {
  enforceOneAttempt: true,
  enforceOptionE: true,
  enableNegativeMarkingDefault: true,
  defaultNegativeMarkPenalty: 0.33,
  dailyChallengeTestId: 'test-01',
  featuredTestIds: ['test-01', 'test-02', 'test-03'],
  bannerAnnouncement: '🔥 Grand All-India Mock Test Series is LIVE! Benchmarking with 5-option OMR standard.',
  isBannerActive: true
};

