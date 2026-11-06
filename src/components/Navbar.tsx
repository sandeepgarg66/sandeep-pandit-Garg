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
    logout
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
      {/* Top Banner Ribbon */}
      <div className="bg-gradient-to-r from-orange-950/60 via-[#FF8C32]/20 to-orange-950/60 py-1 px-4 text-center text-[11px] font-medium text-orange-200/90 border-b border-orange-500/20 flex items-center justify-between">
        <span className="hidden sm:inline font-mono tracking-wider text-orange-400">
          CHUNIN PRELIMS 2026 LIVE
        </span>
        <div className="mx-auto flex items-center gap-2">
          <span>⚡ 5-Option OMR Standard (Option E = Unattempted)</span>
          <span className="hidden md:inline text-orange-400/60">•</span>
          <span className="hidden md:inline">Negative Marking Protection Applied</span>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-orange-300">
          <span>Streak:</span>
          <strong className="text-orange-400 font-mono">{studentProfile.streakDays} Days 🔥</strong>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Brand */}
          <div
            onClick={() => handleNav('home')}
            className="flex items-center gap-3 cursor-pointer group shrink-0"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#EA580C] via-[#FF8C32] to-amber-300 p-0.5 shadow-lg shadow-orange-500/20 group-hover:scale-105 transition">
              <div className="w-full h-full bg-[#0B0F19] rounded-[10px] flex items-center justify-center">
                <Flame className="w-5 h-5 text-[#FF8C32] animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-extrabold text-base sm:text-lg tracking-tight text-white group-hover:text-[#FF8C32] transition">
                  Sanskar-X
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#FF8C32]/20 text-[#FF8C32] border border-[#FF8C32]/30 uppercase">
                  NarutoQuiz
                </span>
              </div>
              <p className="text-[10px] text-slate-400 tracking-wider font-mono">
                PREPARE SMARTER • PERFORM BETTER
              </p>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((item) => {
              const active = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
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
          <div className="flex items-center gap-2.5">
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

            {/* Google Firebase Auth Button */}
            {firebaseUser ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleNav('student-dashboard')}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-[#FF8C32]/40 hover:border-[#FF8C32] transition group"
                  title={firebaseUser.email || ''}
                >
                  <img
                    src={firebaseUser.photoURL || studentProfile.photoURL}
                    alt="Avatar"
                    className="w-6 h-6 rounded-full border border-[#FF8C32] object-cover"
                  />
                  <span className="hidden sm:inline text-xs font-bold text-white group-hover:text-[#FF8C32] truncate max-w-[100px]">
                    {firebaseUser.displayName?.split(' ')[0] || 'User'}
                  </span>
                </button>
                <button
                  onClick={logout}
                  className="p-2 text-slate-400 hover:text-rose-300 hover:bg-rose-950/30 rounded-xl transition"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={loginWithGoogle}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-[#FF8C32] hover:opacity-95 text-white font-bold text-xs shadow-md transition cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Google Sign In</span>
              </button>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-300 hover:text-white rounded-lg"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0B0F19]/98 border-b border-white/10 px-4 pt-3 pb-6 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            {navLinks.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`p-2.5 rounded-xl text-left text-xs font-semibold ${
                  activeSection === item.id
                    ? 'bg-[#FF8C32] text-slate-950 font-bold'
                    : 'bg-white/5 text-slate-200'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-white/10 space-y-2">
            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold block">
              Workspace Role Selector
            </span>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <button
                onClick={() => {
                  setCurrentRole('student');
                  handleNav('student-dashboard');
                }}
                className={`p-2 rounded-lg text-center ${currentRole === 'student' ? 'bg-[#FF8C32] text-slate-950 font-bold' : 'bg-slate-800 text-slate-300'}`}
              >
                Student
              </button>
              <button
                onClick={() => {
                  setCurrentRole('teacher');
                  handleNav('teacher-dashboard');
                }}
                className={`p-2 rounded-lg text-center ${currentRole === 'teacher' ? 'bg-[#FF8C32] text-slate-950 font-bold' : 'bg-slate-800 text-slate-300'}`}
              >
                Teacher
              </button>
              <button
                onClick={() => {
                  setCurrentRole('admin');
                  handleNav('admin-dashboard');
                }}
                className={`p-2 rounded-lg text-center ${currentRole === 'admin' ? 'bg-[#FF8C32] text-slate-950 font-bold' : 'bg-slate-800 text-slate-300'}`}
              >
                Admin
              </button>
            </div>
            <div className="pt-2">
              {firebaseUser ? (
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                  <div className="flex items-center gap-2">
                    <img
                      src={firebaseUser.photoURL || studentProfile.photoURL}
                      alt="Avatar"
                      className="w-7 h-7 rounded-full border border-[#FF8C32]"
                    />
                    <div className="text-xs">
                      <div className="font-bold text-white">{firebaseUser.displayName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{firebaseUser.email}</div>
                    </div>
                  </div>
                  <button
                    onClick={logout}
                    className="px-3 py-1.5 rounded-lg bg-rose-950/40 text-rose-300 text-xs font-semibold"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={loginWithGoogle}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-[#FF8C32] text-white font-bold text-xs flex items-center justify-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign in with Google</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
