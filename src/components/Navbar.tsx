import React, { useState } from 'react';
import { Search, Flame, Menu, X, User, Shield, GraduationCap, Trophy, BookOpen, Compass, LogIn, LogOut } from 'lucide-react';
import { useQuiz } from '../context/QuizContext';

export const Navbar: React.FC = () => {
  const {
    activeSection,
    setActiveSection,
    currentRole,
    setCurrentRole,
    setIsSearchOpen,
    studentProfile,
    firebaseUser,
    loginWithGoogle,
    logout,
    openAuthModal
  } = useQuiz();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'student-new-tests', label: 'New Tests' },
    { id: 'student-practice', label: 'Practice' },
    { id: 'student-leaderboard', label: 'Leaderboard' },
  ];

  const handleNav = (id: string) => {
    setActiveSection(id);
    setMobileMenuOpen(false);
  };

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
            {navLinks.map((item) => {
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

          {/* Action Zone: Search, Role Switcher, & Dashboard Trigger */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Search Trigger */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 text-slate-300 hover:text-white hover:bg-white/5 rounded-lg border border-white/5 transition flex items-center gap-2"
              title="Search Tests & Subjects"
            >
              <Search className="w-4 h-4 text-[#FF8C32]" />
              <span className="hidden xl:inline text-xs text-slate-400">Search tests...</span>
            </button>

            {/* Role Switcher Pill for Testing All 3 Panels */}
            <div className="hidden sm:flex bg-slate-900/90 p-0.5 rounded-lg border border-white/10 text-xs">
              <button
                onClick={() => {
                  setCurrentRole('student');
                  setActiveSection('student-dashboard');
                }}
                className={`px-2.5 py-1 rounded-md font-medium transition flex items-center gap-1 ${
                  currentRole === 'student' && activeSection.startsWith('student')
                    ? 'bg-[#FF8C32] text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Student</span>
              </button>
              <button
                onClick={() => {
                  setCurrentRole('teacher');
                  setActiveSection('teacher-dashboard');
                }}
                className={`px-2.5 py-1 rounded-md font-medium transition flex items-center gap-1 ${
                  currentRole === 'teacher' && activeSection === 'teacher-dashboard'
                    ? 'bg-[#FF8C32] text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Teacher</span>
              </button>
              <button
                onClick={() => {
                  setCurrentRole('admin');
                  setActiveSection('admin-dashboard');
                }}
                className={`px-2.5 py-1 rounded-md font-medium transition flex items-center gap-1 ${
                  currentRole === 'admin' && activeSection === 'admin-dashboard'
                    ? 'bg-[#FF8C32] text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Admin</span>
              </button>
            </div>

            {/* Authentication Buttons (Login & Register Modal) */}
            {firebaseUser ? (
              <div className="flex items-center gap-1.5 sm:gap-2">
                <button
                  onClick={() => {
                    if (currentRole === 'admin') handleNav('admin-dashboard');
                    else if (currentRole === 'teacher') handleNav('teacher-dashboard');
                    else handleNav('student-dashboard');
                  }}
                  className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-xl bg-slate-900 border border-[#FF8C32]/40 hover:border-[#FF8C32] transition group cursor-pointer"
                  title={firebaseUser.email || ''}
                >
                  <img
                    src={firebaseUser.photoURL || studentProfile.photoURL}
                    alt="Avatar"
                    className="w-6 h-6 rounded-full border border-[#FF8C32] object-cover shrink-0"
                  />
                  <span className="hidden sm:inline text-xs font-bold text-white group-hover:text-[#FF8C32] truncate max-w-[90px]">
                    {firebaseUser.displayName?.split(' ')[0] || 'User'}
                  </span>
                </button>
                <button
                  onClick={logout}
                  className="p-1.5 text-slate-400 hover:text-rose-300 hover:bg-rose-950/30 rounded-lg transition cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => openAuthModal('login')}
                  className="px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-200 hover:text-white hover:bg-white/5 border border-white/10 transition cursor-pointer flex items-center gap-1 shrink-0"
                >
                  <LogIn className="w-3.5 h-3.5 text-[#FF8C32]" />
                  <span>Login</span>
                </button>
                <button
                  onClick={() => openAuthModal('register')}
                  className="hidden sm:inline-flex px-3 py-1.5 rounded-lg text-xs font-bold bg-[#FF8C32] text-slate-950 hover:bg-orange-400 shadow-sm transition cursor-pointer shrink-0"
                >
                  Register
                </button>
              </div>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-300 hover:text-white rounded-lg min-h-[40px] min-w-[40px] flex items-center justify-center hover:bg-white/5 transition"
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
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer container */}
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
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition"
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
                    <img
                      src={firebaseUser.photoURL || studentProfile.photoURL}
                      alt="Avatar"
                      className="w-10 h-10 rounded-xl border border-[#FF8C32] object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="font-bold text-white text-xs truncate">{firebaseUser.displayName || 'Candidate'}</div>
                      <div className="text-[10px] text-slate-400 font-mono truncate">{firebaseUser.email}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-rose-950/40 text-rose-300 text-xs font-semibold shrink-0"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      openAuthModal('login');
                    }}
                    className="w-full py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white font-semibold text-xs flex items-center justify-center gap-1.5 border border-white/10"
                  >
                    <LogIn className="w-3.5 h-3.5 text-[#FF8C32]" />
                    <span>Login</span>
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      openAuthModal('register');
                    }}
                    className="w-full py-2 rounded-xl bg-[#FF8C32] hover:bg-orange-400 text-slate-950 font-bold text-xs flex items-center justify-center"
                  >
                    <span>Register</span>
                  </button>
                </div>
              )}
            </div>

            {/* Main Navigation Links */}
            <div className="p-4 space-y-4 flex-1">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-2">
                  Primary Pages
                </span>
                <div className="grid grid-cols-1 gap-1.5">
                  {navLinks.map((item) => {
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

              {/* Workspace Panels */}
              <div className="pt-2 border-t border-white/5">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-2">
                  Workspace Dashboards
                </span>
                <div className="grid grid-cols-1 gap-1.5 text-xs">
                  <button
                    onClick={() => {
                      setCurrentRole('student');
                      handleNav('student-dashboard');
                    }}
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

                  <button
                    onClick={() => {
                      setCurrentRole('teacher');
                      handleNav('teacher-dashboard');
                    }}
                    className={`w-full p-2.5 rounded-xl text-left flex items-center justify-between cursor-pointer transition ${
                      currentRole === 'teacher' && activeSection === 'teacher-dashboard'
                        ? 'bg-[#FF8C32]/20 border border-[#FF8C32] text-[#FF8C32] font-bold'
                        : 'bg-slate-900 border border-white/5 text-slate-300 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-purple-400" />
                      <span>Teacher Workspace</span>
                    </div>
                    <span className="text-[10px] text-slate-400">Author Tests</span>
                  </button>

                  <button
                    onClick={() => {
                      setCurrentRole('admin');
                      handleNav('admin-dashboard');
                    }}
                    className={`w-full p-2.5 rounded-xl text-left flex items-center justify-between cursor-pointer transition ${
                      currentRole === 'admin' && activeSection === 'admin-dashboard'
                        ? 'bg-[#FF8C32]/20 border border-[#FF8C32] text-[#FF8C32] font-bold'
                        : 'bg-slate-900 border border-white/5 text-slate-300 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-cyan-400" />
                      <span>Admin Oversight</span>
                    </div>
                    <span className="text-[10px] text-slate-400">Governance</span>
                  </button>
                </div>
              </div>
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
