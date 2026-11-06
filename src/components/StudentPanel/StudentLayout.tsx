import React from 'react';
import {
  LayoutDashboard,
  FileCheck,
  BookOpen,
  TrendingUp,
  Trophy,
  History,
  Bookmark,
  User,
  Settings,
  LogOut,
  Flame,
  ChevronRight
} from 'lucide-react';
import { useQuiz } from '../../context/QuizContext';

interface StudentLayoutProps {
  children: React.ReactNode;
}

export const StudentLayout: React.FC<StudentLayoutProps> = ({ children }) => {
  const { activeSection, setActiveSection, studentProfile } = useQuiz();

  const navigationItems = [
    { id: 'student-dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'student-new-tests', label: 'New Tests', icon: FileCheck },
    { id: 'student-practice', label: 'Practice Hub', icon: BookOpen },
    { id: 'student-performance', label: 'Performance', icon: TrendingUp },
    { id: 'student-leaderboard', label: 'Leaderboard', icon: Trophy },
    { id: 'student-previous-rank', label: 'My Previous Rank', icon: History },
    { id: 'student-bookmarks', label: 'Bookmarks', icon: Bookmark },
    { id: 'student-profile', label: 'Profile & Settings', icon: User },
  ];

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 flex flex-col md:flex-row">
      {/* Desktop & Tablet Sidebar */}
      <aside className="hidden md:flex flex-col w-64 lg:w-72 bg-[#0B0F19] border-r border-white/10 shrink-0">
        {/* Student Mini Card Header */}
        <div className="p-5 border-b border-white/10 flex items-center gap-3">
          <div className="relative">
            <img
              src={studentProfile.photoURL}
              alt={studentProfile.name}
              className="w-11 h-11 rounded-full object-cover border-2 border-[#FF8C32]"
            />
            <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[#0B0F19]" />
          </div>
          <div className="min-w-0">
            <h4 className="font-heading font-bold text-sm text-white truncate">
              {studentProfile.name}
            </h4>
            <div className="text-[11px] text-[#FF8C32] font-semibold truncate">
              {studentProfile.rankTitle}
            </div>
            <div className="text-[10px] text-slate-400 font-mono">
              Global Rank #{studentProfile.currentGlobalRank}
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="p-3 space-y-1 flex-1 overflow-y-auto">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  isActive
                    ? 'bg-[#FF8C32] text-slate-950 font-bold shadow-md shadow-orange-500/10'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {isActive && <ChevronRight className="w-3.5 h-3.5" />}
              </button>
            );
          })}
        </nav>

        {/* Bottom Ninja Way Pill & Logout */}
        <div className="p-4 border-t border-white/10 space-y-3">
          <div className="p-3 rounded-xl bg-orange-500/10 border border-orange-500/20 text-xs">
            <div className="flex items-center gap-1.5 text-[#FF8C32] font-bold text-[11px] mb-1">
              <Flame className="w-3.5 h-3.5" />
              <span>Ninja Examination Rule</span>
            </div>
            <p className="text-[10px] text-slate-400 leading-relaxed">
              Option E marks the question as "Unattempted" with 0 negative deduction.
            </p>
          </div>

          <button
            onClick={() => setActiveSection('home')}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold transition cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Return to Homepage</span>
          </button>
        </div>
      </aside>

      {/* Main Content Viewport */}
      <main className="flex-1 min-w-0 pb-20 md:pb-8 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        {children}
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0B0F19]/95 backdrop-blur-md border-t border-white/10 px-3 py-2 flex items-center justify-around">
        {navigationItems.slice(0, 5).map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`flex flex-col items-center gap-1 py-1 px-2 rounded-lg text-[10px] font-semibold transition ${
                isActive ? 'text-[#FF8C32]' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label.split(' ')[0]}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
