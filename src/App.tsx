import React from 'react';
import { QuizProvider, useQuiz } from './context/QuizContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { QuickCategories } from './components/QuickCategories';
import { NewTestsSection } from './components/NewTestsSection';
import { LeaderboardSection } from './components/LeaderboardSection';
import { SearchModal } from './components/SearchModal';
import { Footer } from './components/Footer';

// Student Panel Components
import { StudentLayout } from './components/StudentPanel/StudentLayout';
import { StudentDashboardHome } from './components/StudentPanel/StudentDashboardHome';
import { StudentPractice } from './components/StudentPanel/StudentPractice';
import { StudentPerformance } from './components/StudentPanel/StudentPerformance';
import { StudentPreviousRank } from './components/StudentPanel/StudentPreviousRank';
import { StudentBookmarks } from './components/StudentPanel/StudentBookmarks';
import { StudentProfileSettings } from './components/StudentPanel/StudentProfileSettings';

// Exam Engine Components
import { TestInstructions } from './components/ExamEngine/TestInstructions';
import { ExaminationScreen } from './components/ExamEngine/ExaminationScreen';
import { TestResultScreen } from './components/ExamEngine/TestResultScreen';

// Teacher & Admin Panels + Auth Guards
import { TeacherDashboard } from './components/TeacherPanel/TeacherDashboard';
import { AdminDashboard } from './components/AdminPanel/AdminDashboard';
import { AuthModal } from './components/Auth/AuthModal';
import { TeacherPendingScreen } from './components/Auth/TeacherPendingScreen';
import { RoleSelectionModal } from './components/Auth/RoleSelectionModal';
import { AccessDeniedPage } from './components/Auth/AccessDeniedPage';
import { SuspendedAccountScreen } from './components/Auth/SuspendedAccountScreen';

const PROTECTED_PRIVATE_STUDENT_SECTIONS = new Set([
  'student-dashboard',
  'student-performance',
  'student-previous-rank',
  'student-bookmarks',
  'student-profile'
]);

const AuthVerificationLoader: React.FC = () => (
  <div className="min-h-screen flex flex-col bg-[#0B0F19]">
    <Navbar />
    <main className="flex-1 flex items-center justify-center p-6">
      <div className="glass-panel px-8 py-6 rounded-2xl border border-white/10 text-center space-y-3">
        <div className="w-8 h-8 border-2 border-[#FF8C32] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-slate-300 font-mono">
          Verifying session & role permissions...
        </p>
      </div>
    </main>
    <Footer />
  </div>
);

function MainAppContent() {
  const {
    activeSection,
    activeExam,
    isAuthModalOpen,
    closeAuthModal,
    authModalMode,
    firebaseUser,
    verifiedRole,
    accountStatus,
    teacherStatus,
    authLoading
  } = useQuiz();

  const isSuspended = !!firebaseUser && accountStatus === 'Suspended';

  // Block suspended accounts from active examination engine
  if (
    isSuspended &&
    (activeExam.status === 'instructions' ||
      activeExam.status === 'in_progress' ||
      activeExam.status === 'submitted' ||
      activeExam.status === 'review')
  ) {
    return (
      <div className="min-h-screen flex flex-col bg-[#0B0F19]">
        <Navbar />
        <main className="flex-1">
          <SuspendedAccountScreen />
        </main>
        <Footer />
        <AuthModal isOpen={isAuthModalOpen} onClose={closeAuthModal} initialMode={authModalMode} />
      </div>
    );
  }

  // If candidate is in the middle of a test cycle
  if (activeExam.status === 'instructions') {
    return (
      <>
        <TestInstructions />
        <AuthModal isOpen={isAuthModalOpen} onClose={closeAuthModal} initialMode={authModalMode} />
      </>
    );
  }

  if (activeExam.status === 'in_progress') {
    return <ExaminationScreen />;
  }

  if (activeExam.status === 'submitted' || activeExam.status === 'review') {
    return (
      <>
        <TestResultScreen />
        <AuthModal isOpen={isAuthModalOpen} onClose={closeAuthModal} initialMode={authModalMode} />
      </>
    );
  }

  const isProtectedRoute =
    activeSection === 'admin-dashboard' ||
    activeSection === 'teacher-dashboard' ||
    activeSection === 'teacher-pending' ||
    PROTECTED_PRIVATE_STUDENT_SECTIONS.has(activeSection);

  if (authLoading && isProtectedRoute) {
    return (
      <>
        <AuthVerificationLoader />
        <AuthModal isOpen={isAuthModalOpen} onClose={closeAuthModal} initialMode={authModalMode} />
      </>
    );
  }

  // Block suspended accounts from any protected route
  if (isSuspended && isProtectedRoute) {
    return (
      <div className="min-h-screen flex flex-col bg-[#0B0F19]">
        <Navbar />
        <main className="flex-1">
          <SuspendedAccountScreen />
        </main>
        <Footer />
        <AuthModal isOpen={isAuthModalOpen} onClose={closeAuthModal} initialMode={authModalMode} />
      </div>
    );
  }

  // Protected Route: Teacher Approval Pending Screen
  if (activeSection === 'teacher-pending') {
    const canAccessPendingScreen =
      !!firebaseUser &&
      (teacherStatus === 'Pending' || verifiedRole === 'teacher' || verifiedRole === 'admin');
    return (
      <div className="min-h-screen flex flex-col bg-[#0B0F19]">
        <Navbar />
        <main className="flex-1">
          {canAccessPendingScreen ? (
            <TeacherPendingScreen />
          ) : (
            <AccessDeniedPage requiredRole="teacher" attemptedSection="/teacher-pending" />
          )}
        </main>
        <Footer />
        <AuthModal isOpen={isAuthModalOpen} onClose={closeAuthModal} initialMode={authModalMode} />
      </div>
    );
  }

  // Protected Route: Teacher Workspace (strictly approved teacher or admin)
  if (activeSection === 'teacher-dashboard') {
    const isApprovedEducator =
      !!firebaseUser &&
      (verifiedRole === 'admin' || (verifiedRole === 'teacher' && teacherStatus === 'Approved'));
    const isPendingApplicant = !!firebaseUser && teacherStatus === 'Pending';

    return (
      <div className="min-h-screen flex flex-col bg-[#0B0F19]">
        <Navbar />
        <main className="flex-1">
          {isApprovedEducator ? (
            <TeacherDashboard />
          ) : isPendingApplicant ? (
            <TeacherPendingScreen />
          ) : (
            <AccessDeniedPage requiredRole="teacher" attemptedSection="/teacher" />
          )}
        </main>
        <Footer />
        <AuthModal isOpen={isAuthModalOpen} onClose={closeAuthModal} initialMode={authModalMode} />
      </div>
    );
  }

  // Protected Route: Admin Workspace (strictly verifiedRole === 'admin')
  if (activeSection === 'admin-dashboard') {
    const isVerifiedAdmin = !!firebaseUser && verifiedRole === 'admin';
    return (
      <div className="min-h-screen flex flex-col bg-[#0B0F19]">
        <Navbar />
        <main className="flex-1">
          {isVerifiedAdmin ? (
            <AdminDashboard />
          ) : (
            <AccessDeniedPage requiredRole="admin" attemptedSection="/admin" />
          )}
        </main>
        <Footer />
        <AuthModal isOpen={isAuthModalOpen} onClose={closeAuthModal} initialMode={authModalMode} />
      </div>
    );
  }

  // Student Panel Subsections (public catalog/practice/leaderboard allowed; personal dashboard/profile/bookmarks require login & active status)
  if (activeSection.startsWith('student-')) {
    if (PROTECTED_PRIVATE_STUDENT_SECTIONS.has(activeSection) && !firebaseUser) {
      return (
        <div className="min-h-screen flex flex-col bg-[#0B0F19]">
          <Navbar />
          <main className="flex-1">
            <AccessDeniedPage requiredRole="student" attemptedSection={`/${activeSection}`} />
          </main>
          <Footer />
          <AuthModal isOpen={isAuthModalOpen} onClose={closeAuthModal} initialMode={authModalMode} />
        </div>
      );
    }

    return (
      <div className="min-h-screen flex flex-col bg-[#0B0F19]">
        <Navbar />
        <StudentLayout>
          {activeSection === 'student-dashboard' && <StudentDashboardHome />}
          {activeSection === 'student-new-tests' && <NewTestsSection showFilters={true} />}
          {activeSection === 'student-practice' && <StudentPractice />}
          {activeSection === 'student-performance' && <StudentPerformance />}
          {activeSection === 'student-leaderboard' && <LeaderboardSection />}
          {activeSection === 'student-previous-rank' && <StudentPreviousRank />}
          {activeSection === 'student-bookmarks' && <StudentBookmarks />}
          {activeSection === 'student-profile' && <StudentProfileSettings />}
        </StudentLayout>
        <AuthModal isOpen={isAuthModalOpen} onClose={closeAuthModal} initialMode={authModalMode} />
      </div>
    );
  }

  // Standard Landing / Homepage
  return (
    <div className="min-h-screen flex flex-col bg-[#0B0F19]">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <QuickCategories />
        <NewTestsSection limit={6} showFilters={false} />
        <LeaderboardSection />
      </main>
      <Footer />
      <SearchModal />
      <AuthModal isOpen={isAuthModalOpen} onClose={closeAuthModal} initialMode={authModalMode} />
    </div>
  );
}

export function App() {
  return (
    <QuizProvider>
      <MainAppContent />
      <SearchModal />
      <RoleSelectionModal />
    </QuizProvider>
  );
}

export default App;
