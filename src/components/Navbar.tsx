import React, { useState } from 'react';
import {
  Search,
  Flame,
  Menu,
  X,
  Shield,
  GraduationCap,
  BookOpen,
  LogIn,
  LogOut
} from 'lucide-react';
import { useQuiz } from '../context/QuizContext';

export const Navbar: React.FC = () => {
  const {
    activeSection,
    setActiveSection,
    currentRole,
    verifiedRole,
    teacherStatus,
    setCurrentRole,
    setIsSearchOpen,
    firebaseUser,
    logout,
    openAuthModal
  } = useQuiz();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'student-new-tests', label: 'New Tests' },
    { id: 'student-practice', label: 'Practice' },
    { id: 'student-leaderboard', label: 'Leaderboard' }
  ];

  const handleNav = (id: string) => {
    setActiveSection(id);
    setMobileMenuOpen(false);
  };

  const openTeacherWorkspace = () => {
    setCurrentRole('teacher');
    if (verifiedRole === 'admin' || teacherStatus === 'Approved') {
      handleNav('teacher-dashboard');
    } else {
      handleNav('teacher-pending');
    }
  };

  const openStudentWorkspace = () => {
    setCurrentRole('student');
    handleNav('student-dashboard');
  };

  const openAdminWorkspace = () => {
    if (verifiedRole !== 'admin') return;
    setCurrentRole('admin');
    handleNav('admin-dashboard');
  };

  const userDisplayName = firebaseUser?.displayName || firebaseUser?.email?.split('@')[0] || 'User';
  const userInitial = userDisplayName.charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-40 bg-[#0B0F19]/90 backdrop-blur-md border-b border-white/10 text-slate-100">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 w-full">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-2 sm:gap-4">
          {/* Logo & Brand */}
          <div
            onClick={() => handleNav('home')}
            className="flex items-center gap-2 sm:gap-3 cursor-pointer group shrink-0 min-w-0"
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-[#EA580C] via-[#FF8C32] to-amber-300 p-0.5 shadow-lg shadow-orange-500/20 group-hover:scale-105 transition shrink-0">
              <div className="w-full h-full bg-[#0B0F19] rounded-[10px] flex items-center justify-center">
                <Flame className="w-4 h-4 sm:w-5 sm:h-5 text-[#FF8C32] animate-pulse" />
              </div>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-heading font-extrabold text-sm sm:text-lg tracking-tight text-white group-hover:text-[#FF8C32] transition">
                  Sanskar-X
                </span>
                <span className="px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] font-bold bg-[#FF8C32]/20 text-[#FF8C32] border border-[#FF8C32]/30 uppercase shrink-0">
                  NarutoQuiz
                </span>
              </div>
              <p className="text-[9px] sm:text-[10px] text-slate-400 tracking-wider font-mono hidden sm:block truncate">
                PREPARE SMARTER • PERFORM BETTER
              </p>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 shrink-0">
            {navLinks.map(item => {
              const active = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    active
                      ? 'bg-[#FF8C32] text-slate-950 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Action Zone: Search, Role-Gated Panel Switcher, & Auth */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Search Trigger */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 text-slate-300 hover:text-white hover:bg-white/5 rounded-lg border border-white/5 transition flex items-center gap-2 cursor-pointer"
              title="Search Tests & Subjects"
              aria-label="Search Tests & Subjects"
            >
              <Search className="w-4 h-4 text-[#FF8C32]" />
              <span className="hidden xl:inline text-xs text-slate-400">Search tests...</span>
            </button>

            {/* Role-Gated Panel Switcher (Desktop) */}
            {firebaseUser && verifiedRole === 'student' && (
              <div className="hidden sm:flex items-center gap-1.5">
                <button
                  onClick={openStudentWorkspace}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer border ${
                    activeSection === 'student-dashboard' ||
                    activeSection === 'student-performance' ||
                    activeSection === 'student-previous-rank' ||
                    activeSection === 'student-bookmarks' ||
                    activeSection === 'student-profile'
                      ? 'bg-[#FF8C32] text-slate-950 border-[#FF8C32]'
                      : 'bg-slate-900/90 text-slate-200 border-white/10 hover:border-[#FF8C32]/50 hover:text-white'
                  }`}
                >
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>Student Panel</span>
                </button>
                {teacherStatus === 'Pending' && (
                  <button
                    onClick={() => handleNav('teacher-pending')}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 hover:bg-amber-500/25 transition cursor-pointer"
                    title="Your Teacher Access Request is Pending Admin Approval."
                  >
                    <span>Teacher Pending</span>
                  </button>
                )}
              </div>
            )}

            {firebaseUser && (verifiedRole === 'teacher' || verifiedRole === 'admin') && (
              <div className="hidden sm:flex bg-slate-900/90 p-0.5 rounded-lg border border-white/10 text-xs">
                <button
                  onClick={openStudentWorkspace}
                  className={`px-2.5 py-1 rounded-md font-medium transition flex items-center gap-1 cursor-pointer ${
                    currentRole === 'student' && activeSection.startsWith('student')
                      ? 'bg-[#FF8C32] text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>Student</span>
                </button>

                <button
                  onClick={openTeacherWorkspace}
                  className={`px-2.5 py-1 rounded-md font-medium transition flex items-center gap-1 cursor-pointer ${
                    (currentRole === 'teacher' &&
                      (activeSection === 'teacher-dashboard' || activeSection === 'teacher-pending')) ||
                    activeSection === 'teacher-dashboard' ||
                    activeSection === 'teacher-pending'
                      ? 'bg-[#FF8C32] text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Teacher</span>
                </button>

                {verifiedRole === 'admin' && (
                  <button
                    onClick={openAdminWorkspace}
                    className={`px-2.5 py-1 rounded-md font-medium transition flex items-center gap-1 cursor-pointer ${
                      activeSection === 'admin-dashboard'
                        ? 'bg-[#FF8C32] text-slate-950 font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Shield className="w-3.5 h-3.5" />
                    <span>Admin</span>
                  </button>
                )}
              </div>
            )}

            {/* Authentication Zone */}
            {firebaseUser ? (
              <div className="flex items-center gap-1.5 sm:gap-2">
                <button
                  onClick={() => {
                    if (verifiedRole === 'admin') openAdminWorkspace();
                    else openStudentWorkspace();
                  }}
                  className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-xl bg-slate-900 border border-[#FF8C32]/40 hover:border-[#FF8C32] transition group cursor-pointer"
                  title={firebaseUser.email || ''}
                >
                  {firebaseUser.photoURL ? (
                    <img
                      src={firebaseUser.photoURL}
                      alt={userDisplayName}
                      className="w-6 h-6 rounded-full border border-[#FF8C32] object-cover shrink-0"
                    />
                  ) : (
                    <span className="w-6 h-6 rounded-full bg-[#FF8C32]/20 border border-[#FF8C32] text-[#FF8C32] text-xs font-extrabold flex items-center justify-center shrink-0">
                      {userInitial}
                    </span>
                  )}
                  <span className="hidden sm:inline text-xs font-bold text-white group-hover:text-[#FF8C32] truncate max-w-[90px]">
                    {userDisplayName.split(' ')[0]}
                  </span>
                </button>
                <button
                  onClick={logout}
                  className="p-1.5 text-slate-400 hover:text-rose-300 hover:bg-rose-950/30 rounded-lg transition cursor-pointer"
                  title="Sign Out"
                  aria-label="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => openAuthModal('login')}
                  className="px-3 sm:px-4 py-1.5 rounded-lg text-xs font-bold bg-[#FF8C32] text-slate-950 hover:bg-orange-400 shadow-md shadow-orange-500/20 transition cursor-pointer flex items-center gap-1.5 shrink-0"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Login</span>
                </button>
              </div>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-300 hover:text-white rounded-lg min-h-[40px] min-w-[40px] flex items-center justify-center hover:bg-white/5 transition cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-[#FF8C32]" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Slide-Out Drawer & Backdrop */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          <div className="fixed inset-y-0 right-0 w-full max-w-xs sm:max-w-sm bg-[#0B0F19] border-l border-white/10 shadow-2xl flex flex-col justify-between overflow-y-auto">
            {/* Drawer Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#EA580C] to-[#FF8C32] p-0.5">
                  <div className="w-full h-full bg-[#0B0F19] rounded-[6px] flex items-center justify-center">
                    <Flame className="w-4 h-4 text-[#FF8C32]" />
                  </div>
                </div>
                <div>
                  <div className="font-heading font-extrabold text-sm text-white">Sanskar-X</div>
                  <div className="text-[9px] text-[#FF8C32] font-mono uppercase">Navigation Menu</div>
                </div>
              </div>

              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition cursor-pointer"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* User Profile / Auth Action Strip */}
            <div className="p-4 bg-slate-900/60 border-b border-white/5">
              {firebaseUser ? (
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    {firebaseUser.photoURL ? (
                      <img
                        src={firebaseUser.photoURL}
                        alt={userDisplayName}
                        className="w-10 h-10 rounded-xl border border-[#FF8C32] object-cover shrink-0"
                      />
                    ) : (
                      <span className="w-10 h-10 rounded-xl bg-[#FF8C32]/20 border border-[#FF8C32] text-[#FF8C32] text-sm font-extrabold flex items-center justify-center shrink-0">
                        {userInitial}
                      </span>
                    )}
                    <div className="min-w-0">
                      <div className="font-bold text-white text-xs truncate">{userDisplayName}</div>
                      <div className="text-[10px] text-slate-400 font-mono truncate">{firebaseUser.email}</div>
                      <div className="text-[10px] text-[#FF8C32] uppercase font-bold mt-0.5">
                        Role: {verifiedRole || 'Pending Verification'}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-rose-950/40 text-rose-300 text-xs font-semibold shrink-0 cursor-pointer"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openAuthModal('login');
                  }}
                  className="w-full py-2.5 rounded-xl bg-[#FF8C32] hover:bg-orange-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow cursor-pointer"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Login / Create Account</span>
                </button>
              )}
            </div>

            {/* Main Navigation Links */}
            <div className="p-4 space-y-4 flex-1">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-2">
                  Primary Pages
                </span>
                <div className="grid grid-cols-1 gap-1.5">
                  {navLinks.map(item => {
                    const active = activeSection === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleNav(item.id)}
                        className={`w-full p-2.5 rounded-xl text-left text-xs font-semibold flex items-center justify-between transition cursor-pointer ${
                          active
                            ? 'bg-[#FF8C32] text-slate-950 font-bold shadow'
                            : 'bg-white/5 text-slate-200 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        <span>{item.label}</span>
                        {active && <span className="w-1.5 h-1.5 rounded-full bg-slate-950" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Role-Gated Workspace Panels (Only shown to verified roles!) */}
              {firebaseUser && verifiedRole && (
                <div className="pt-2 border-t border-white/5">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-2">
                    Authorized Panels
                  </span>
                  <div className="grid grid-cols-1 gap-1.5 text-xs">
                    <button
                      onClick={openStudentWorkspace}
                      className={`w-full p-2.5 rounded-xl text-left flex items-center justify-between cursor-pointer transition ${
                        currentRole === 'student' && activeSection.startsWith('student')
                          ? 'bg-[#FF8C32]/20 border border-[#FF8C32] text-[#FF8C32] font-bold'
                          : 'bg-slate-900 border border-white/5 text-slate-300 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <GraduationCap className="w-4 h-4 text-[#FF8C32]" />
                        <span>Student Panel</span>
                      </div>
                      <span className="text-[10px] text-slate-400">Tests & Ranks</span>
                    </button>

                    {(verifiedRole === 'teacher' || verifiedRole === 'admin') && (
                      <button
                        onClick={openTeacherWorkspace}
                        className={`w-full p-2.5 rounded-xl text-left flex items-center justify-between cursor-pointer transition ${
                          activeSection === 'teacher-dashboard' || activeSection === 'teacher-pending'
                            ? 'bg-[#FF8C32]/20 border border-[#FF8C32] text-[#FF8C32] font-bold'
                            : 'bg-slate-900 border border-white/5 text-slate-300 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-purple-400" />
                          <span>Teacher Panel</span>
                        </div>
                        <span className="text-[10px] text-slate-400">
                          {verifiedRole === 'teacher' && teacherStatus !== 'Approved'
                            ? 'Pending Approval'
                            : 'Author Tests'}
                        </span>
                      </button>
                    )}

                    {verifiedRole === 'admin' && (
                      <button
                        onClick={openAdminWorkspace}
                        className={`w-full p-2.5 rounded-xl text-left flex items-center justify-between cursor-pointer transition ${
                          activeSection === 'admin-dashboard'
                            ? 'bg-[#FF8C32]/20 border border-[#FF8C32] text-[#FF8C32] font-bold'
                            : 'bg-slate-900 border border-white/5 text-slate-300 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Shield className="w-4 h-4 text-cyan-400" />
                          <span>Admin Panel</span>
                        </div>
                        <span className="text-[10px] text-slate-400">Governance</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Drawer Footer Info */}
            <div className="p-4 border-t border-white/10 bg-slate-950/80 text-[10px] text-slate-400 space-y-1">
              <div className="flex items-center justify-between">
                <span>5-Option OMR Standard</span>
                <span className="font-mono text-emerald-400">Active</span>
              </div>
              <div className="text-slate-500">
                Option E protects candidate score from negative penalty.
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
