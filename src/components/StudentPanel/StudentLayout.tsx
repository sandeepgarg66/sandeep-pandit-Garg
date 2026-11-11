import React, { useState } from 'react';
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
  ChevronRight,
  Menu,
  X
} from 'lucide-react';
import { useQuiz } from '../../context/QuizContext';

interface StudentLayoutProps {
  children: React.ReactNode;
}

export const StudentLayout: React.FC<StudentLayoutProps> = ({ children }) => {
  const { activeSection, setActiveSection, studentProfile, currentRole } = useQuiz();
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

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

  const currentTab = navigationItems.find(item => item.id === activeSection) || navigationItems[0];
  const CurrentIcon = currentTab.icon;

  const handleNavClick = (id: string) => {
    setActiveSection(id);
    setIsMobileDrawerOpen(false);
  };

  return (
    <div className="w-full max-w-full overflow-x-hidden min-h-screen bg-[#0B0F19] text-slate-100 flex flex-col md:flex-row">
      {/* Mobile Top Sub-Header Bar (md:hidden) */}
      <div className="md:hidden w-full bg-slate-900/90 border-b border-white/10 px-4 py-3 flex items-center justify-between sticky top-0 z-30 backdrop-blur-md">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-[#FF8C32]/15 text-[#FF8C32] flex items-center justify-center shrink-0">
            <CurrentIcon className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold text-white truncate">{currentTab.label}</div>
            <div className="text-[10px] text-slate-400 truncate">
              {studentProfile.name} • #{studentProfile.currentGlobalRank || 1}
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsMobileDrawerOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[#FF8C32] text-xs font-bold cursor-pointer transition shrink-0 min-h-[36px]"
          aria-label="Open Student Navigation Menu"
        >
          <Menu className="w-4 h-4" />
          <span>Menu</span>
        </button>
      </div>

      {/* Mobile Slide-Out Hamburger Navigation Drawer */}
      {isMobileDrawerOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileDrawerOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="relative w-72 max-w-[85vw] bg-[#0B0F19] border-r border-white/10 h-full flex flex-col z-10 shadow-2xl animate-in slide-in-from-left duration-200">
            {/* Drawer Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative shrink-0">
                  <img
                    src={studentProfile.photoURL}
                    alt={studentProfile.name}
                    className="w-10 h-10 rounded-full object-cover border-2 border-[#FF8C32]"
                  />
                  <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#0B0F19]" />
                </div>
                <div className="min-w-0">
                  <h4 className="font-heading font-bold text-xs text-white truncate">
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

              <button
                onClick={() => setIsMobileDrawerOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 cursor-pointer transition shrink-0"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Links */}
            <nav className="p-3 space-y-1 flex-1 overflow-y-auto">
              {currentRole === 'teacher' && (
                <button
                  onClick={() => {
                    setActiveSection('teacher-dashboard');
                    setIsMobileDrawerOpen(false);
                  }}
                  className="w-full mb-3 flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold bg-purple-600/20 text-purple-300 border border-purple-500/30 hover:bg-purple-600/30 transition cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <BookOpen className="w-4 h-4 text-purple-400" />
                    <span>Teacher Workspace</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
              <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Candidate Workspace
              </div>
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
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

            {/* Bottom Rules & Return */}
            <div className="p-4 border-t border-white/10 space-y-3">
              <div className="p-2.5 rounded-xl bg-orange-500/10 border border-orange-500/20 text-xs">
                <div className="flex items-center gap-1.5 text-[#FF8C32] font-bold text-[11px] mb-1">
                  <Flame className="w-3.5 h-3.5" />
                  <span>Ninja Examination Rule</span>
                </div>
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  Option E marks the question as "Unattempted" with 0 negative deduction.
                </p>
              </div>

              <button
                onClick={() => {
                  setActiveSection('home');
                  setIsMobileDrawerOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold transition cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Return to Homepage</span>
              </button>
            </div>
          </div>
        </div>
      )}

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
          {currentRole === 'teacher' && (
            <button
              onClick={() => setActiveSection('teacher-dashboard')}
              className="w-full mb-3 flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold bg-purple-600/20 text-purple-300 border border-purple-500/30 hover:bg-purple-600/30 transition cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <BookOpen className="w-4 h-4 text-purple-400" />
                <span>Teacher Workspace</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
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
      <main className="flex-1 w-full max-w-full min-w-0 pb-12 p-3 sm:p-6 lg:p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

