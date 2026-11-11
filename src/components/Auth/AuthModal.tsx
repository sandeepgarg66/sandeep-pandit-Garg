import React, { useState } from 'react';
import {
  X,
  GraduationCap,
  BookOpen,
  ArrowRight,
  ArrowLeft,
  Mail,
  Lock,
  User,
  Shield,
  CheckCircle2,
  AlertCircle,
  Flame,
  Briefcase
} from 'lucide-react';
import { useQuiz } from '../../context/QuizContext';
import { registerWithEmailPassword, loginWithEmailPassword, signInWithGoogle, db } from '../../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
}

type RegistrationStep = 'category_selection' | 'student_form' | 'teacher_form';

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login'
}) => {
  const { setCurrentRole, setActiveSection, setStudentProfile, setIsRoleSelectionModalOpen } = useQuiz();

  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [regStep, setRegStep] = useState<RegistrationStep>('category_selection');

  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [qualification, setQualification] = useState('');
  const [specialization, setSpecialization] = useState('General Science');
  const [avatarUrl, setAvatarUrl] = useState('');

  // Status
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  if (!isOpen) return null;

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setFullName('');
    setQualification('');
    setSpecialization('General Science');
    setAvatarUrl('');
    setErrorMessage('');
    setSuccessMessage('');
  };

  const switchMode = (newMode: 'login' | 'register') => {
    setMode(newMode);
    setRegStep('category_selection');
    resetForm();
  };

  // Handle Standard Login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    try {
      const user = await loginWithEmailPassword(email.trim(), password);

      // Check if Owner Admin email
      if (user.email === 'sandeepgarg6375494692@gmail.com') {
        setCurrentRole('admin');
        setActiveSection('admin-dashboard');
        onClose();
        return;
      }

      // Query User document from Firestore
      const userDocRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userDocRef);

      if (userSnap.exists() && userSnap.data().role) {
        const userData = userSnap.data();
        if (userData.role === 'admin') {
          setCurrentRole('admin');
          setActiveSection('admin-dashboard');
        } else if (userData.role === 'teacher') {
          // Check Teacher Profile status
          const tchDoc = await getDoc(doc(db, 'teacherProfiles', user.uid));
          if (tchDoc.exists() && tchDoc.data().status === 'Approved') {
            setCurrentRole('teacher');
            setActiveSection('teacher-dashboard');
          } else {
            setCurrentRole('teacher');
            setActiveSection('teacher-pending');
          }
        } else {
          // Student Role
          setCurrentRole('student');
          setActiveSection('student-dashboard');
        }
        onClose();
      } else {
        // No role assigned yet -> trigger Part 2 User Role Selection
        onClose();
        setIsRoleSelectionModalOpen(true);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Google Auth
  const handleGoogleAuth = async () => {
    setErrorMessage('');
    setIsLoading(true);

    try {
      const user = await signInWithGoogle();
      if (!user) return;

      if (user.email === 'sandeepgarg6375494692@gmail.com') {
        setCurrentRole('admin');
        setActiveSection('admin-dashboard');
        onClose();
        return;
      }

      // Check Firestore user doc
      const userDocRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userDocRef);

      if (userSnap.exists() && userSnap.data().role) {
        const role = userSnap.data().role;
        if (role === 'admin') {
          setCurrentRole('admin');
          setActiveSection('admin-dashboard');
        } else if (role === 'teacher') {
          const tchDoc = await getDoc(doc(db, 'teacherProfiles', user.uid));
          if (tchDoc.exists() && tchDoc.data().status === 'Approved') {
            setCurrentRole('teacher');
            setActiveSection('teacher-dashboard');
          } else {
            setCurrentRole('teacher');
            setActiveSection('teacher-pending');
          }
        } else {
          setCurrentRole('student');
          setActiveSection('student-dashboard');
        }
        onClose();
      } else {
        // First-time Google user without role -> Show User Category Selection Modal!
        onClose();
        setIsRoleSelectionModalOpen(true);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Google authentication was cancelled.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Student Registration Submit
  const handleStudentRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter.');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);

    try {
      const user = await registerWithEmailPassword(email.trim(), password, fullName.trim());

      // Save user record with student role
      await setDoc(doc(db, 'users', user.uid), {
        id: user.uid,
        email: email.trim(),
        displayName: fullName.trim(),
        role: 'student',
        photoURL: avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        createdAt: new Date().toISOString()
      });

      // Save initial student profile
      await setDoc(doc(db, 'studentProfiles', user.uid), {
        uid: user.uid,
        rankTitle: 'Academy Aspirant',
        totalTestsAttempted: 0,
        totalQuestionsSolved: 0,
        averageAccuracy: 0,
        lifetimePoints: 0,
        currentDailyPoints: 0,
        currentWeeklyPoints: 0,
        currentGlobalRank: 420,
        streakDays: 1
      });

      setCurrentRole('student');
      setSuccessMessage('Registration successful! Welcome, Aspirant.');
      setTimeout(() => {
        setActiveSection('student-dashboard');
        onClose();
      }, 1000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to register account.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Teacher Registration Submit
  const handleTeacherRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter.');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);

    try {
      const user = await registerWithEmailPassword(email.trim(), password, fullName.trim());

      // Save user with teacher role
      await setDoc(doc(db, 'users', user.uid), {
        id: user.uid,
        email: email.trim(),
        displayName: fullName.trim(),
        role: 'teacher',
        photoURL: avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        createdAt: new Date().toISOString()
      });

      // Save teacher profile as 'Pending' (must be approved by Admin)
      await setDoc(doc(db, 'teacherProfiles', user.uid), {
        id: user.uid,
        name: fullName.trim(),
        email: email.trim(),
        qualification: qualification.trim() || 'Educator Degree',
        specialization: specialization.trim(),
        status: 'Pending',
        testsCreated: 0,
        joinedDate: new Date().toLocaleDateString('en-GB')
      });

      setCurrentRole('teacher');
      setSuccessMessage('Registration submitted! Your educator account is pending verification by the administration.');
      setTimeout(() => {
        setActiveSection('teacher-pending');
        onClose();
      }, 1200);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to submit educator registration.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md">
      <div className="glass-panel p-4 sm:p-8 rounded-2xl sm:rounded-3xl border border-white/20 max-w-lg w-full space-y-5 sm:space-y-6 relative overflow-hidden max-h-[92vh] overflow-y-auto custom-scrollbar shadow-2xl">
        {/* Glow */}
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-[#FF8C32]/20 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#FF8C32]/20 border border-[#FF8C32]/40 flex items-center justify-center text-[#FF8C32]">
              <Flame className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-heading font-extrabold text-white text-base">
                Sanskar-X-NarutoQuiz
              </h2>
              <span className="text-[10px] text-slate-400 font-mono">
                {mode === 'login' ? 'Candidate & Educator Portal' : 'New Account Registration'}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Alert Messages */}
        {errorMessage && (
          <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW 1: LOGIN FORM */}
        {/* ========================================================= */}
        {mode === 'login' && (
          <div className="space-y-4">
            <div className="text-center space-y-1">
              <h3 className="font-heading font-extrabold text-xl text-white">
                Welcome Back
              </h3>
              <p className="text-xs text-slate-400">
                Sign in to your account. Your dashboard will open automatically based on your verified role.
              </p>
            </div>

            {/* Google Sign-In */}
            <button
              onClick={handleGoogleAuth}
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-semibold text-xs flex items-center justify-center gap-2.5 transition cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
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
                <label className="block text-slate-300 font-semibold mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#FF8C32]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#EA580C] to-[#FF8C32] hover:opacity-95 text-slate-950 font-bold text-xs shadow-lg transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>{isLoading ? 'Signing In...' : 'Sign In to Account'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="pt-2 text-center text-xs text-slate-400">
              New to Sanskar-X-NarutoQuiz?{' '}
              <button
                onClick={() => switchMode('register')}
                className="text-[#FF8C32] hover:underline font-bold cursor-pointer"
              >
                Create an Account
              </button>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW 2: REGISTRATION - STEP 1 (CATEGORY SELECTION) */}
        {/* ========================================================= */}
        {mode === 'register' && regStep === 'category_selection' && (
          <div className="space-y-5">
            <div className="text-center space-y-1.5">
              <div className="text-sm font-bold text-[#FF8C32] font-hindi">
                आप Sanskar-X-NarutoQuiz पर किस रूप में जुड़ना चाहते हैं?
              </div>
              <p className="text-xs text-slate-300">
                Choose your registration track. Students access exams and leaderboards; Teachers create and submit tests for moderation.
              </p>
            </div>

            {/* Two Professional Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Card 1: Student */}
              <div
                onClick={() => setRegStep('student_form')}
                className="glass-card p-5 rounded-2xl border border-white/10 hover:border-[#FF8C32] hover:bg-[#FF8C32]/5 transition cursor-pointer space-y-3 flex flex-col justify-between group"
              >
                <div className="space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#FF8C32]/20 to-amber-500/20 border border-[#FF8C32]/40 flex items-center justify-center text-[#FF8C32] group-hover:scale-110 transition">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <h3 className="font-heading font-extrabold text-base text-white">
                    Student
                  </h3>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Register as a student to practice MCQs, attempt tests, view results, and track your performance.
                  </p>
                </div>

                <button
                  type="button"
                  className="w-full py-2 rounded-xl bg-gradient-to-r from-[#EA580C] to-[#FF8C32] text-slate-950 font-bold text-xs shadow transition group-hover:opacity-95 flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span>Continue as Student</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Card 2: Teacher */}
              <div
                onClick={() => setRegStep('teacher_form')}
                className="glass-card p-5 rounded-2xl border border-white/10 hover:border-purple-400 hover:bg-purple-500/5 transition cursor-pointer space-y-3 flex flex-col justify-between group"
              >
                <div className="space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-500/20 to-indigo-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300 group-hover:scale-110 transition">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <h3 className="font-heading font-extrabold text-base text-white">
                    Teacher
                  </h3>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Register as a teacher to create MCQ tests, manage questions, and submit tests for Admin approval.
                  </p>
                </div>

                <button
                  type="button"
                  className="w-full py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow transition flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span>Continue as Teacher</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="pt-2 text-center text-xs text-slate-400">
              Already have an account?{' '}
              <button
                onClick={() => switchMode('login')}
                className="text-[#FF8C32] hover:underline font-bold cursor-pointer"
              >
                Sign In
              </button>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW 3: STUDENT REGISTRATION FORM */}
        {/* ========================================================= */}
        {mode === 'register' && regStep === 'student_form' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setRegStep('category_selection')}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div>
                <h3 className="font-heading font-extrabold text-lg text-white">
                  Student Registration Form
                </h3>
                <span className="text-[10px] text-emerald-400 font-mono">
                  Role: Verified Student Aspirant
                </span>
              </div>
            </div>

            <form onSubmit={handleStudentRegister} className="space-y-3 text-xs">
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
                    placeholder="student@example.com"
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
                      type="password"
                      required
                      placeholder="Min. 6 chars"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#FF8C32]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      placeholder="Repeat password"
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#FF8C32]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Profile Avatar Image URL (Optional)
                </label>
                <input
                  type="url"
                  placeholder="https://example.com/photo.jpg"
                  value={avatarUrl}
                  onChange={e => setAvatarUrl(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-900 border border-white/10 rounded-xl text-white placeholder-slate-500"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#EA580C] to-[#FF8C32] text-slate-950 font-bold text-xs shadow-lg transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>{isLoading ? 'Creating Account...' : 'Register as Student'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="text-center text-xs text-slate-400">
              Already registered?{' '}
              <button
                onClick={() => switchMode('login')}
                className="text-[#FF8C32] hover:underline font-bold cursor-pointer"
              >
                Sign In here
              </button>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW 4: TEACHER REGISTRATION FORM */}
        {/* ========================================================= */}
        {mode === 'register' && regStep === 'teacher_form' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setRegStep('category_selection')}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div>
                <h3 className="font-heading font-extrabold text-lg text-white">
                  Teacher Registration Form
                </h3>
                <span className="text-[10px] text-amber-400 font-mono">
                  Status: Requires Admin Verification after Signup
                </span>
              </div>
            </div>

            <form onSubmit={handleTeacherRegister} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Ramesh Sharma"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-400"
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
                    placeholder="teacher@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Academic Qualification *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. M.Sc. Physics, B.Ed."
                    value={qualification}
                    onChange={e => setQualification(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-white placeholder-slate-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Specialization
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. General Science, Indian Polity"
                    value={specialization}
                    onChange={e => setSpecialization(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-white placeholder-slate-500"
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
                      type="password"
                      required
                      placeholder="Min. 6 chars"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      placeholder="Repeat password"
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-400"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Profile Image URL (Optional)
                </label>
                <input
                  type="url"
                  placeholder="https://example.com/educator-photo.jpg"
                  value={avatarUrl}
                  onChange={e => setAvatarUrl(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-900 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-400"
                />
              </div>

              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px] space-y-1">
                <strong>Institutional Moderation Notice:</strong>
                <p>
                  Teacher accounts remain in <strong>Pending Approval</strong> state upon registration. You will be able to author and submit MCQ tests once certified by the Admin.
                </p>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>{isLoading ? 'Submitting Application...' : 'Register as Teacher'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="text-center text-xs text-slate-400">
              Already registered?{' '}
              <button
                onClick={() => switchMode('login')}
                className="text-purple-300 hover:underline font-bold cursor-pointer"
              >
                Sign In here
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
