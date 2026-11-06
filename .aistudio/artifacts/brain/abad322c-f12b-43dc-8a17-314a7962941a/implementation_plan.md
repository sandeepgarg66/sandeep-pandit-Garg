# Sanskar-X-NarutoQuiz: Homepage, Student Panel & Examination Engine

A premium dark glassmorphism educational examination platform for competitive MCQ assessments featuring Naruto-inspired aesthetics (#FF8C32), full Student Dashboard, and an authentic 5-option (A–E OMR standard) Test Engine.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> The following architectural and UX choices have been aligned based on your specifications and clarifying answers:

- **Confirmed Decision 1 (Workspace Scope)**: Building the comprehensive **Sanskar-X-NarutoQuiz** platform directly in this workspace, replacing the initial placeholder while maintaining maximum modularity for mobile and Next.js parity.
- **Confirmed Decision 2 (Phased Implementation)**: Delivering the **Homepage UI**, **Student Panel & Dashboard**, and **MCQ Examination Engine (with Option E logic)** first, with tabbed preview access for Teacher and Admin panels.
- **Confirmed Decision 3 (Data & Backend Strategy)**: Beginning with rich, persistent, realistic local mock state and reactive stores, structuring exact collection schemas (`users`, `tests`, `questions`, `test_attempts`, `leaderboard`, `bookmarks`) so Firebase Firestore and Authentication can be connected seamlessly.
- **Confirmed Decision 4 (Option E Rule)**: Option E is strictly defined as *"Unattempted / No Response"* (अनुत्तरित). When chosen, it incurs 0 marks and 0 negative deduction, mirroring actual public service & competitive OMR standards.

---

## 1. Overview & Core Concept

**Sanskar-X-NarutoQuiz** is an educational testing and practice ecosystem engineered for high-stakes MCQ preparation. It balances a focused, serious examination cockpit with an inspiring anime-influenced premium aesthetic (Konoha ninja headband emblems, Naruto Orange `#FF8C32` fire accents, and sleek dark glass surfaces).

### Primary Target Audiences
1. **Competitive Exam Aspirants / Students**: Taking time-bound Daily, Weekly, Mock, and Previous Year Question (PYQ) tests with instant detailed analytics.
2. **Educators / Teachers**: Managing question banks and submitting assessments through structured approval workflows.
3. **Institutional Administrators**: Supervising students, managing leaderboard integrity, and overseeing test publication.

---

## 2. User Experience & Visual Design

### Visual Identity & Theme Tokens
- **Canvas Base**: Deep midnight `#0B0F19` with secondary dark slate `#111827`.
- **Primary Accent**: Naruto Chakra Orange (`#FF8C32` / `#F97316`) for primary action buttons, active navigation indicators, and timer warnings.
- **Glass Surfaces**: Frosted glass containers (`bg-slate-900/70 border border-slate-700/40 backdrop-blur-md shadow-xl`) with subtle 1px hairline borders.
- **Typography**: `Plus Jakarta Sans` for clean, high-legibility interface typography; `Outfit` / `Bricolage Grotesque` for bold display headlines; `JetBrains Mono` / `tabular-nums` for timers and scores.
- **Accessibility & Contrast**: Minimum 4.5:1 text-to-surface contrast; 44px touch targets on mobile; zero uninformative pulsing dots or arbitrary decorative pills.

### Key Workspaces & User Flows
1. **Homepage (Step 2)**:
   - Sticky Glass Navbar: Naruto emblem wordmark, Search modal, and direct role-based navigation.
   - Hero Section: *"Prepare Smarter, Perform Better"* with dual CTAs ("Explore Tests", "Start Practicing") and ninja chakra motif.
   - Quick Category Grid: Daily Tests, Weekly Tests, Mock Tests, PYQ, Chapter Tests, and Subject-wise Tests.
   - New Tests Feed: Filterable test cards with total questions, marks, duration, and negative marking badge.
   - Triple Leaderboards: Daily (Today's top points), Weekly (Current week's champions), and Global (Lifetime test points).
2. **Student Panel (Step 3)**:
   - Left desktop sidebar / compact tablet / mobile bottom navigation bar.
   - Home Dashboard: 5 glass stat cards (Tests Attempted, Questions Solved, Accuracy %, Global Rank, Lifetime Points) and recent activity feed.
   - New Tests Section: Search & filter tests by category (Daily, Weekly, Mock, PYQ, Chapter, Subject).
   - Practice Hub: Subject-wise, topic-wise, random questions, wrong questions revision, and bookmarked questions.
   - Performance Analytics: Visual accuracy rings, subject breakdown bars, and test history.
   - Leaderboard & Previous Ranks: Detailed ranking tables and historical test attempt scorecards.
3. **MCQ Examination Engine (Step 4)**:
   - Pre-Exam Instructions Screen: Test rules, marking scheme, negative marks, and confirmation checkbox.
   - Examination Viewport: Split-layout with live countdown timer, question statement, 5 response options (A–E), question status palette (Answered, Not Answered, Marked for Review, Answered & Marked for Review, Not Visited), and action buttons (Save & Next, Clear Response, Mark for Review).
   - Authoritative Submission Modal: Summary of answered vs unanswered questions before final commitment.
   - Comprehensive Result & Review: Score summary, accuracy percentage, time taken, and item-by-item explanation review.

---

## 3. Key Product Decisions & Trade-Offs

| Decision | Chosen Architecture | Rationale |
| :--- | :--- | :--- |
| **Option E OMR Logic** | 5 choices (A, B, C, D, E) where Option E = No Response | Ensures 100% adherence to actual OMR examination rules; no negative marking deducted for E. |
| **One Attempt Policy** | Single attempt lock per student per test ID | Enforces test integrity; attempts register completion timestamps and store final scores. |
| **Leaderboard Segregation** | 3 independent stores: Daily, Weekly, Global | Prevents private practice drills from polluting competitive global standings. |
| **Multi-Role Switching** | Client-side role toggle between Student, Teacher, Admin | Enables immediate end-to-end evaluation of all 3 personas prior to backend user auth. |

---

## 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Sanskar-X-NarutoQuiz                            │
│                  (Dark Glassmorphic UI Framework)                      │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
       ┌────────────────────────────┼────────────────────────────┐
       ▼                            ▼                            ▼
┌──────────────┐             ┌──────────────┐             ┌──────────────┐
│  Homepage    │             │ Student Hub  │             │ Exam Engine  │
│ - Hero & Nav │             │ - Stats & Kpi│             │ - 5 Opt OMR  │
│ - Categories │             │ - Practice   │             │ - Palette    │
│ - Leaderboard│             │ - History    │             │ - Timer & Res│
└──────┬───────┘             └──────┬───────┘             └──────┬───────┘
       │                            │                            │
       └────────────────────────────┼────────────────────────────┘
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│               Unified App State & Firestore-Ready Store                │
│  - tests: Test[]               - testAttempts: Attempt[]               │
│  - questions: Question[]       - leaderboard: Daily/Weekly/Global      │
│  - userProfile: StudentProfile - bookmarks: Bookmark[]                 │
└────────────────────────────────────────────────────────────────────────┘
```

### Core Schema & Data Entities
- **Test**: `id`, `title`, `subject`, `topic`, `category`, `durationMinutes`, `totalQuestions`, `marksPerCorrect`, `negativeMarkingEnabled`, `negativeMarks`, `status`.
- **Question**: `id`, `testId`, `statement`, `options: { A, B, C, D }`, `correctAnswer: 'A'|'B'|'C'|'D'`, `explanation`, `difficulty`, `marks`.
- **Attempt**: `id`, `studentId`, `testId`, `answers: Record<string, 'A'|'B'|'C'|'D'|'E'>`, `score`, `accuracy`, `timeTakenSeconds`, `submittedAt`.
- **Leaderboard**: `dailyRanks`, `weeklyRanks`, `globalRanks` with points and student profile details.
