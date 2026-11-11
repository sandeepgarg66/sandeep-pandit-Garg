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

// Teacher & Admin Panels
import { TeacherDashboard } from './components/TeacherPanel/TeacherDashboard';
import { AdminDashboard } from './components/AdminPanel/AdminDashboard';
import { AuthModal } from './components/Auth/AuthModal';
import { TeacherPendingScreen } from './components/Auth/TeacherPendingScreen';

function MainAppContent() {
  const { activeSection, activeExam, isAuthModalOpen, closeAuthModal, authModalMode } = useQuiz();

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

  // Teacher Approval Pending Screen
  if (activeSection === 'teacher-pending') {
    return (
      <div className="min-h-screen flex flex-col bg-[#0B0F19]">
        <Navbar />
        <main className="flex-1">
          <TeacherPendingScreen />
        </main>
        <Footer />
        <AuthModal isOpen={isAuthModalOpen} onClose={closeAuthModal} initialMode={authModalMode} />
      </div>
    );
  }

  // Teacher Workspace
  if (activeSection === 'teacher-dashboard') {
    return (
      <div className="min-h-screen flex flex-col bg-[#0B0F19]">
        <Navbar />
        <main className="flex-1">
          <TeacherDashboard />
        </main>
        <Footer />
        <AuthModal isOpen={isAuthModalOpen} onClose={closeAuthModal} initialMode={authModalMode} />
      </div>
    );
  }

  // Admin Workspace
  if (activeSection === 'admin-dashboard') {
    return (
      <div className="min-h-screen flex flex-col bg-[#0B0F19]">
        <Navbar />
        <main className="flex-1">
          <AdminDashboard />
        </main>
        <Footer />
        <AuthModal isOpen={isAuthModalOpen} onClose={closeAuthModal} initialMode={authModalMode} />
      </div>
    );
  }

  // Student Panel Subsections
  if (activeSection.startsWith('student-')) {
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

  // Standard Landing / Homepage (Step 2)
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
    </QuizProvider>
  );
}

export default App;
