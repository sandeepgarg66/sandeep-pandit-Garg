import React, { useState, useEffect } from 'react';
import {
  X,
  GraduationCap,
  BookOpen,
  ArrowRight,
  ArrowLeft,
  Mail,
  Lock,
  User,
  CheckCircle2,
  AlertCircle,
  Flame,
  Eye,
  EyeOff,
  KeyRound
} from 'lucide-react';
import { useQuiz } from '../../context/QuizContext';
import {
  registerWithEmailPassword,
  loginWithEmailPassword,
  signInWithGoogle,
  resetUserPassword,
  getFriendlyAuthError,
  db
} from '../../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
}

type ModalMode = 'login' | 'register' | 'forgot_password';

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login'
}) => {
  const { setCurrentRole, setActiveSection, setIsRoleSelectionModalOpen } = useQuiz();

  const [mode, setMode] = useState<ModalMode>(initialMode);
  const [accountType, setAccountType] = useState<'student' | 'teacher'>('student');

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [qualification, setQualification] = useState('');
  const [specialization, setSpecialization] = useState('Indian Polity & Governance');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Status
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Sync modal mode whenever opened or initialMode prop changes
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setErrorMessage('');
      setSuccessMessage('');
      setPassword('');
      setConfirmPassword('');
      setShowPassword(false);
      setShowConfirmPassword(false);
    }
  }, [isOpen, initialMode]);

  if (!isOpen) return null;

  const resetMessages = () => {
    setErrorMessage('');
    setSuccessMessage('');
  };

  const switchMode = (newMode: ModalMode) => {
    setMode(newMode);
    resetMessages();
    setPassword('');
    setConfirmPassword('');
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  // Part 7 Post-Login Redirection Helper:
  // Student -> Student Panel; Teacher -> Student Panel by default (with Teacher Panel via switcher); Admin -> Admin Panel
  const routeAfterVerifiedAuth = (role: 'student' | 'teacher' | 'admin') => {
    if (role === 'admin') {
      setCurrentRole('admin');
      setActiveSection('admin-dashboard');
    } else if (role === 'teacher') {
      setCurrentRole('teacher');
      setActiveSection('student-dashboard');
    } else {
      setCurrentRole('student');
      setActiveSection('student-dashboard');
    }
  };

  // Handle Standard Email/Password Login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) {
      setErrorMessage('Please enter both your email address and password.');
      return;
    }

    setIsLoading(true);
    try {
      const user = await loginWithEmailPassword(trimmedEmail, password);

      if (user.email === 'sandeepgarg6375494692@gmail.com') {
        routeAfterVerifiedAuth('admin');
        onClose();
        return;
      }

      const tokenResult = await user.getIdTokenResult().catch(() => null);
      if (tokenResult?.claims?.admin === true || tokenResult?.claims?.role === 'admin') {
        routeAfterVerifiedAuth('admin');
        onClose();
        return;
      }

      const userSnap = await getDoc(doc(db, 'users', user.uid));
      const existingRole = userSnap.exists() ? userSnap.data()?.role : null;

      if (existingRole === 'admin' || existingRole === 'teacher' || existingRole === 'student') {
        routeAfterVerifiedAuth(existingRole);
        onClose();
      } else {
        // Legacy account missing a verified role -> prompt safe role selection once
        onClose();
        setIsRoleSelectionModalOpen(true);
      }
    } catch (err: any) {
      setErrorMessage(getFriendlyAuthError(err));
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Google Auth (complete auth first, check Firestore profile, ask Student/Teacher ONLY if new)
  const handleGoogleAuth = async () => {
    resetMessages();
    setIsLoading(true);

    try {
      const user = await signInWithGoogle();
      if (!user) return;

      if (user.email === 'sandeepgarg6375494692@gmail.com') {
        routeAfterVerifiedAuth('admin');
        onClose();
        return;
      }

      const tokenResult = await user.getIdTokenResult().catch(() => null);
      if (tokenResult?.claims?.admin === true || tokenResult?.claims?.role === 'admin') {
        routeAfterVerifiedAuth('admin');
        onClose();
        return;
      }

      const userSnap = await getDoc(doc(db, 'users', user.uid));
      const existingRole = userSnap.exists() ? userSnap.data()?.role : null;

      if (existingRole === 'admin' || existingRole === 'teacher' || existingRole === 'student') {
        routeAfterVerifiedAuth(existingRole);
        onClose();
      } else {
        // First-time Google user without verified role -> open RoleSelectionModal (Student/Teacher only)
        onClose();
        setIsRoleSelectionModalOpen(true);
      }
    } catch (err: any) {
      setErrorMessage(getFriendlyAuthError(err));
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Forgot Password
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setErrorMessage('Please enter the email address registered with your account.');
      return;
    }

    setIsLoading(true);
    try {
      await resetUserPassword(trimmedEmail);
      setSuccessMessage(`Password reset link sent to ${trimmedEmail}. Please check your inbox and spam folder.`);
    } catch (err: any) {
      setErrorMessage(getFriendlyAuthError(err));
    } finally {
      setIsLoading(false);
    }
  };

  // Handle New Account Registration (ONLY Student or Teacher; NEVER Admin)
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();

    const trimmedName = fullName.trim();
    const trimmedEmail = email.trim();

    if (trimmedName.length < 2) {
      setErrorMessage('Please enter your full name (at least 2 characters).');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter both password fields.');
      return;
    }
    if (accountType !== 'student' && accountType !== 'teacher') {
      setErrorMessage('Invalid account type selected.');
      return;
    }

    setIsLoading(true);
    try {
      const user = await registerWithEmailPassword(trimmedEmail, password, trimmedName);
      const nowIso = new Date().toISOString();
      const isTeacherRequest = accountType === 'teacher';

      // Save verified user record in Firestore `users` collection.
      // IMPORTANT: Selecting Teacher NEVER grants the 'teacher' role automatically.
      // Only 'student' role is granted until Admin reviews and approves the request.
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        id: user.uid,
        name: trimmedName,
        displayName: trimmedName,
        email: trimmedEmail,
        role: 'student',
        requestedRole: isTeacherRequest ? 'teacher' : 'student',
        photoURL: user.photoURL || '',
        accountStatus: 'Active',
        teacherApprovalStatus: isTeacherRequest ? 'Pending' : 'None',
        qualification: isTeacherRequest ? (qualification.trim() || 'Academic Faculty') : undefined,
        specialization: isTeacherRequest ? (specialization.trim() || 'Indian Polity & Governance') : undefined,
        appliedAt: isTeacherRequest ? nowIso : undefined,
        lastLoginAt: nowIso,
        createdAt: nowIso,
        updatedAt: nowIso
      });

      // Initialize studentProfiles so Student Panel works immediately
      await setDoc(doc(db, 'studentProfiles', user.uid), {
        uid: user.uid,
        rankTitle: isTeacherRequest ? 'Teacher Applicant (Student Access)' : 'Academy Aspirant',
        totalTestsAttempted: 0,
        totalQuestionsSolved: 0,
        averageAccuracy: 0,
        lifetimePoints: 0,
        currentDailyPoints: 0,
        currentWeeklyPoints: 0,
        currentGlobalRank: 0,
        streakDays: 0
      });

      if (isTeacherRequest) {
        await setDoc(doc(db, 'teacherProfiles', user.uid), {
          id: user.uid,
          name: trimmedName,
          email: trimmedEmail,
          photoURL: user.photoURL || '',
          qualification: qualification.trim() || 'Academic Faculty',
          specialization: specialization.trim() || 'Indian Polity & Governance',
          status: 'Pending',
          testsCreated: 0,
          joinedDate: new Date().toLocaleDateString('en-GB')
        });
      }

      setSuccessMessage(
        isTeacherRequest
          ? 'Your Teacher Access Request is Pending Admin Approval. You have Student Panel access while an Admin reviews your application.'
          : 'Student account created successfully! Opening your Student Panel...'
      );

      setTimeout(() => {
        setCurrentRole('student');
        setActiveSection('student-dashboard');
        onClose();
      }, 1200);
    } catch (err: any) {
      setErrorMessage(getFriendlyAuthError(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <div className="glass-panel p-4 sm:p-8 rounded-2xl sm:rounded-3xl border border-white/20 max-w-lg w-full space-y-5 relative overflow-hidden max-h-[92vh] overflow-y-auto custom-scrollbar shadow-2xl">
        {/* Glow */}
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-[#FF8C32]/20 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#FF8C32]/20 border border-[#FF8C32]/40 flex items-center justify-center text-[#FF8C32]">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h2 id="auth-modal-title" className="font-heading font-extrabold text-white text-base">
                Sanskar-X-NarutoQuiz
              </h2>
              <span className="text-[10px] text-slate-400 font-mono">
                {mode === 'login'
                  ? 'Secure Portal Sign In'
                  : mode === 'forgot_password'
                  ? 'Account Recovery'
                  : 'Create New Account'}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close authentication modal"
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Alert Messages */}
        {errorMessage && (
          <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-200 text-xs flex items-start gap-2.5 leading-relaxed">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-200 text-xs flex items-start gap-2.5 leading-relaxed">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW 1: CLEAN LOGIN MODAL (No registration fields) */}
        {/* ========================================================= */}
        {mode === 'login' && (
          <div className="space-y-4">
            <div className="text-center space-y-1">
              <h3 className="font-heading font-extrabold text-xl text-white">
                Welcome Back
              </h3>
              <p className="text-xs text-slate-400">
                Sign in to access your verified dashboard, OMR tests, and performance analytics.
              </p>
            </div>

            {/* Continue with Google */}
            <button
              type="button"
              onClick={handleGoogleAuth}
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-semibold text-xs flex items-center justify-center gap-2.5 transition cursor-pointer disabled:opacity-60"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="#EA4335"
                  d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z"
                />
                <path
                  fill="#4285F4"
                  d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15s.7 5.3 1.9 7.7l3.7-2.9z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16c1.8 3.7 5.6 7 10.1 7z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">
                Or with email
              </span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="aspirant@leafvillage.edu"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#FF8C32]"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-slate-300 font-semibold">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => switchMode('forgot_password')}
                    className="text-[11px] text-[#FF8C32] hover:underline font-semibold cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full pl-9 pr-10 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#FF8C32]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(prev => !prev)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#EA580C] to-[#FF8C32] hover:opacity-95 text-slate-950 font-bold text-xs shadow-lg transition cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-60"
              >
                <span>{isLoading ? 'Signing In...' : 'Sign In'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="pt-2 border-t border-white/10 text-center text-xs text-slate-400">
              New to Sanskar-X-NarutoQuiz?{' '}
              <button
                type="button"
                onClick={() => switchMode('register')}
                className="text-[#FF8C32] hover:underline font-bold cursor-pointer"
              >
                Create an Account
              </button>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW 2: FORGOT PASSWORD */}
        {/* ========================================================= */}
        {mode === 'forgot_password' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => switchMode('login')}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition cursor-pointer"
                aria-label="Back to login"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div>
                <h3 className="font-heading font-extrabold text-lg text-white">
                  Reset Your Password
                </h3>
                <p className="text-[11px] text-slate-400">
                  Enter your registered email to receive a password reset link.
                </p>
              </div>
            </div>

            <form onSubmit={handleForgotPassword} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Registered Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#FF8C32]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#EA580C] to-[#FF8C32] hover:opacity-95 text-slate-950 font-bold text-xs shadow-lg transition cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-60"
              >
                <KeyRound className="w-4 h-4" />
                <span>{isLoading ? 'Sending Reset Link...' : 'Send Password Reset Email'}</span>
              </button>
            </form>

            <div className="text-center text-xs text-slate-400">
              Remembered your password?{' '}
              <button
                type="button"
                onClick={() => switchMode('login')}
                className="text-[#FF8C32] hover:underline font-bold cursor-pointer"
              >
                Back to Sign In
              </button>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW 3: REGISTRATION FORM (Student & Teacher ONLY) */}
        {/* ========================================================= */}
        {mode === 'register' && (
          <div className="space-y-4">
            <div className="text-center space-y-1">
              <h3 className="font-heading font-extrabold text-xl text-white">
                Create Your Account
              </h3>
              <p className="text-xs text-slate-400">
                Join Sanskar-X-NarutoQuiz as a Student or Teacher.
              </p>
            </div>

            {/* Google Quick Sign-Up */}
            <button
              type="button"
              onClick={handleGoogleAuth}
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-semibold text-xs flex items-center justify-center gap-2.5 transition cursor-pointer disabled:opacity-60"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="#EA4335"
                  d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z"
                />
                <path
                  fill="#4285F4"
                  d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15s.7 5.3 1.9 7.7l3.7-2.9z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16c1.8 3.7 5.6 7 10.1 7z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">
                Or register with email
              </span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            <form onSubmit={handleRegisterSubmit} className="space-y-3 text-xs">
              {/* Account Type Selector (ONLY Student and Teacher — NEVER Admin) */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">
                  Account Type *
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setAccountType('student')}
                    className={`p-3 rounded-xl border text-left transition cursor-pointer flex items-center gap-2.5 ${
                      accountType === 'student'
                        ? 'bg-[#FF8C32]/15 border-[#FF8C32] text-white shadow'
                        : 'bg-slate-900/80 border-white/10 text-slate-300 hover:border-white/25'
                    }`}
                  >
                    <GraduationCap
                      className={`w-5 h-5 shrink-0 ${
                        accountType === 'student' ? 'text-[#FF8C32]' : 'text-slate-400'
                      }`}
                    />
                    <div>
                      <div className="font-bold text-xs">Student</div>
                      <div className="text-[10px] text-slate-400">Practice & Mock Tests</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAccountType('teacher')}
                    className={`p-3 rounded-xl border text-left transition cursor-pointer flex items-center gap-2.5 ${
                      accountType === 'teacher'
                        ? 'bg-purple-500/15 border-purple-400 text-white shadow'
                        : 'bg-slate-900/80 border-white/10 text-slate-300 hover:border-white/25'
                    }`}
                  >
                    <BookOpen
                      className={`w-5 h-5 shrink-0 ${
                        accountType === 'teacher' ? 'text-purple-400' : 'text-slate-400'
                      }`}
                    />
                    <div>
                      <div className="font-bold text-xs">Request Teacher Access</div>
                      <div className="text-[10px] text-slate-400">Requires Admin Approval</div>
                    </div>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Kumar"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#FF8C32]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#FF8C32]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Password *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      placeholder="Min. 6 chars"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="w-full pl-9 pr-9 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#FF8C32]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(prev => !prev)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      placeholder="Repeat password"
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      className="w-full pl-9 pr-9 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#FF8C32]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(prev => !prev)}
                      aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                    >
                      {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              {accountType === 'teacher' && (
                <div className="space-y-3 pt-1">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">
                        Qualification
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. M.Sc, B.Ed, UPSC Mentor"
                        value={qualification}
                        onChange={e => setQualification(e.target.value)}
                        className="w-full px-3.5 py-2 bg-slate-900 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-400"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">
                        Subject Domain
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Indian Polity"
                        value={specialization}
                        onChange={e => setSpecialization(e.target.value)}
                        className="w-full px-3.5 py-2 bg-slate-900 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-400"
                      />
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-[11px] leading-relaxed">
                    <strong>Pending Admin Approval:</strong> Requesting Teacher Access does not grant Teacher Panel privileges automatically. Your account receives Student access while an Admin reviews your application.
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-2.5 rounded-xl font-bold text-xs shadow-lg transition cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-60 ${
                  accountType === 'teacher'
                    ? 'bg-purple-600 hover:bg-purple-500 text-white'
                    : 'bg-gradient-to-r from-[#EA580C] to-[#FF8C32] text-slate-950 hover:opacity-95'
                }`}
              >
                <span>
                  {isLoading
                    ? 'Submitting Request...'
                    : accountType === 'teacher'
                    ? 'Submit Teacher Access Request'
                    : 'Create Student Account'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="pt-2 border-t border-white/10 text-center text-xs text-slate-400">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => switchMode('login')}
                className="text-[#FF8C32] hover:underline font-bold cursor-pointer"
              >
                Sign In
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
