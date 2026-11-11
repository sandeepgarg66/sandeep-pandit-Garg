import React, { useState } from 'react';
import {
  Menu,
  Bell,
  CheckCircle2,
  AlertTriangle,
  Flame,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { useQuiz } from '../../context/QuizContext';
import { AdminSidebar, AdminTab } from './AdminSidebar';
import { AdminDashboardOverview } from './AdminDashboardOverview';
import { StudentManagementView } from './StudentManagementView';
import { TeacherManagementView } from './TeacherManagementView';
import { TestManagementView } from './TestManagementView';
import { TestApprovalsView } from './TestApprovalsView';
import { QuestionBankView } from './QuestionBankView';
import { SubjectTopicView } from './SubjectTopicView';
import { PYQManagementView } from './PYQManagementView';
import { ResultsAttemptsView } from './ResultsAttemptsView';
import { LeaderboardManagementView } from './LeaderboardManagementView';
import { NotificationsManagementView } from './NotificationsManagementView';
import { HomepageManagementView } from './HomepageManagementView';
import { ReportsAnalyticsView } from './ReportsAnalyticsView';
import { AdminLogsView } from './AdminLogsView';
import { AdminSettingsView } from './AdminSettingsView';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { tests, setCurrentRole, setActiveSection } = useQuiz();

  const pendingApprovalsCount = tests.filter(t => t.status === 'Pending Approval').length;

  return (
    <div className="w-full max-w-full overflow-x-hidden flex min-h-[calc(100vh-4rem)] bg-[#0B0F19]">
      {/* 15-Section Responsive Sidebar */}
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Admin Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto min-w-0 overflow-y-auto px-3 sm:px-8 py-6 space-y-6">
        {/* Mobile Sidebar Trigger & Admin Top Bar */}
        <div className="flex items-center justify-between lg:hidden pb-4 border-b border-white/10">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-semibold"
          >
            <Menu className="w-4 h-4 text-[#FF8C32]" />
            <span>Admin Menu</span>
          </button>

          <span className="text-[10px] uppercase font-bold text-purple-300 bg-purple-500/20 px-2.5 py-1 rounded border border-purple-500/30">
            Hokage Root Authority
          </span>
        </div>

        {/* Global Pending Test Banner Alert if items await approval */}
        {pendingApprovalsCount > 0 && activeTab !== 'approvals' && (
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <span className="font-bold text-amber-200 text-xs">
                  {pendingApprovalsCount} Test{pendingApprovalsCount > 1 ? 's' : ''} Awaiting Review:
                </span>
                <span className="text-amber-300/80 text-xs ml-1.5 hidden sm:inline">
                  Teachers have submitted new tests. Verify 5-option OMR compliance before publishing.
                </span>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('approvals')}
              className="px-3.5 py-1.5 rounded-xl bg-[#FF8C32] hover:bg-orange-500 text-slate-950 font-bold text-xs shrink-0 transition flex items-center gap-1 cursor-pointer"
            >
              <span>Review Queue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Dynamic View Rendering based on activeTab */}
        {activeTab === 'overview' && (
          <AdminDashboardOverview setActiveTab={setActiveTab} />
        )}
        {activeTab === 'students' && <StudentManagementView />}
        {activeTab === 'teachers' && <TeacherManagementView />}
        {activeTab === 'tests' && <TestManagementView />}
        {activeTab === 'approvals' && <TestApprovalsView />}
        {activeTab === 'questions' && <QuestionBankView />}
        {activeTab === 'subjects' && <SubjectTopicView />}
        {activeTab === 'pyq' && <PYQManagementView />}
        {activeTab === 'results' && <ResultsAttemptsView />}
        {activeTab === 'leaderboard' && <LeaderboardManagementView />}
        {activeTab === 'notifications' && <NotificationsManagementView />}
        {activeTab === 'homepage' && <HomepageManagementView />}
        {activeTab === 'analytics' && <ReportsAnalyticsView />}
        {activeTab === 'logs' && <AdminLogsView />}
        {activeTab === 'settings' && <AdminSettingsView />}
      </main>
    </div>
  );
};
