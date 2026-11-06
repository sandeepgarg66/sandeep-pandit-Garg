import React from 'react';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  FileSpreadsheet,
  CheckCircle2,
  Database,
  Layers,
  FileQuestion,
  Award,
  Trophy,
  Bell,
  Sliders,
  BarChart3,
  ShieldAlert,
  Settings,
  X
} from 'lucide-react';
import { useQuiz } from '../../context/QuizContext';

export type AdminTab =
  | 'overview'
  | 'students'
  | 'teachers'
  | 'tests'
  | 'approvals'
  | 'questions'
  | 'subjects'
  | 'pyq'
  | 'results'
  | 'leaderboard'
  | 'notifications'
  | 'homepage'
  | 'analytics'
  | 'logs'
  | 'settings';

interface AdminSidebarProps {
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  setActiveTab,
  isOpen,
  onClose
}) => {
  const { tests, teachers, notifications } = useQuiz();

  const pendingApprovalsCount = tests.filter(t => t.status === 'Pending Approval').length;
  const pendingTeachersCount = teachers.filter(tch => tch.status === 'Pending').length;
  const activeAnnouncementsCount = notifications.filter(n => n.isActive).length;

  const navItems: { id: AdminTab; label: string; icon: React.ElementType; badge?: number }[] = [
    { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard },
    { id: 'students', label: 'Student Roster', icon: Users },
    { id: 'teachers', label: 'Teacher Management', icon: GraduationCap, badge: pendingTeachersCount },
    { id: 'tests', label: 'Test Management', icon: FileSpreadsheet },
    { id: 'approvals', label: 'Test Approvals', icon: CheckCircle2, badge: pendingApprovalsCount },
    { id: 'questions', label: 'Question Bank', icon: Database },
    { id: 'subjects', label: 'Subjects & Topics', icon: Layers },
    { id: 'pyq', label: 'PYQ Sets Catalog', icon: FileQuestion },
    { id: 'results', label: 'Results & Attempts', icon: Award },
    { id: 'leaderboard', label: 'Leaderboard Control', icon: Trophy },
    { id: 'notifications', label: 'Announcements', icon: Bell, badge: activeAnnouncementsCount },
    { id: 'homepage', label: 'Homepage Control', icon: Sliders },
    { id: 'analytics', label: 'Reports & Analytics', icon: BarChart3 },
    { id: 'logs', label: 'Activity Audit Logs', icon: ShieldAlert },
    { id: 'settings', label: 'Exam & Security Rules', icon: Settings }
  ];

  const content = (
    <div className="flex flex-col h-full bg-[#0E1424] border-r border-white/10 text-slate-200 w-72">
      {/* Brand & Admin Badge */}
      <div className="p-5 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-[#FF8C32] p-0.5 shadow-md flex items-center justify-center">
            <span className="font-bold text-white text-base">火</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-300 bg-purple-500/20 px-1.5 py-0.5 rounded border border-purple-500/30">
                Hokage Admin
              </span>
            </div>
            <h1 className="font-heading font-extrabold text-white text-sm tracking-tight mt-0.5">
              Control Center
            </h1>
          </div>
        </div>

        <button
          onClick={onClose}
          className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1 custom-scrollbar">
        <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Platform Administration
        </div>
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                onClose();
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-[#FF8C32]/20 to-purple-500/10 text-white border border-[#FF8C32]/40 shadow-[0_0_15px_rgba(255,140,50,0.15)]'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#FF8C32]' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && item.badge > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FF8C32] text-slate-950">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Admin User Footer Card */}
      <div className="p-4 border-t border-white/10 bg-slate-900/60">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-purple-600/30 border border-purple-500/40 flex items-center justify-center text-xs font-bold text-purple-200">
            HT
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-bold text-white truncate">Hokage Tsunade</div>
            <div className="text-[10px] text-emerald-400 font-mono">Super Admin • Live</div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-72 shrink-0 h-[calc(100vh-4rem)] sticky top-16">
        {content}
      </aside>

      {/* Mobile / Tablet Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
          <div className="fixed inset-y-0 left-0 max-w-full flex">
            <div className="relative w-72">{content}</div>
          </div>
        </div>
      )}
    </>
  );
};
