import React, { useState } from 'react';
import {
  GraduationCap,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Search,
  Filter,
  FileText,
  Mail,
  ShieldCheck,
  UserPlus
} from 'lucide-react';
import { useQuiz } from '../../context/QuizContext';
import { TeacherProfile } from '../../types/quiz';

export const TeacherManagementView: React.FC = () => {
  const { teachers, approveTeacher, rejectTeacher, suspendTeacher, tests } = useQuiz();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Approved' | 'Pending' | 'Suspended'>('All');
  const [selectedTeacherTests, setSelectedTeacherTests] = useState<{ teacherName: string; count: number } | null>(null);

  const filteredTeachers = teachers.filter(tch => {
    const matchesSearch =
      tch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tch.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tch.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || tch.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-extrabold text-white">
            Teacher & Examiner Management
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Oversee certified educators, review teacher verification submissions, and audit test authoring rights.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-purple-300 bg-purple-500/10 px-3 py-1.5 rounded-xl border border-purple-500/20">
            Total Jonin Educators: {teachers.length}
          </span>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by educator name or subject..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-900/60 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#FF8C32]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs text-slate-400">Filter:</span>
          {(['All', 'Approved', 'Pending', 'Suspended'] as const).map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                statusFilter === status
                  ? 'bg-purple-600 text-white font-bold'
                  : 'bg-white/5 text-slate-400 hover:text-white'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Teacher Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTeachers.map(tch => {
          const authorTests = tests.filter(t => t.teacherName === tch.name || t.createdBy === tch.name);

          return (
            <div
              key={tch.id}
              className="glass-card p-5 rounded-2xl border border-white/10 flex flex-col justify-between space-y-4 hover:border-purple-500/30 transition"
            >
              <div className="flex items-start gap-4">
                <img
                  src={tch.photoURL}
                  alt={tch.name}
                  className="w-14 h-14 rounded-2xl object-cover border border-purple-500/30 shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-heading font-bold text-white text-base truncate">
                      {tch.name}
                    </h3>
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded shrink-0 ${
                        tch.status === 'Approved'
                          ? 'text-emerald-300 bg-emerald-500/20'
                          : tch.status === 'Pending'
                          ? 'text-amber-300 bg-amber-500/20'
                          : 'text-rose-300 bg-rose-500/20'
                      }`}
                    >
                      {tch.status}
                    </span>
                  </div>

                  <div className="text-[11px] text-[#FF8C32] font-semibold mt-0.5">
                    {tch.specialization}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1 line-clamp-2">
                    {tch.qualification}
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono mt-1">
                    Joined: {tch.joinedDate} • ID: {tch.id}
                  </div>
                </div>
              </div>

              {/* Stats & Actions Footer */}
              <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-slate-300">
                  <FileText className="w-3.5 h-3.5 text-purple-400" />
                  <span>
                    <strong>{authorTests.length}</strong> tests authoring
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {tch.status === 'Pending' && (
                    <>
                      <button
                        onClick={() => rejectTeacher(tch.id)}
                        className="px-3 py-1 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 text-xs font-semibold border border-rose-500/30 transition cursor-pointer"
                      >
                        Decline
                      </button>
                      <button
                        onClick={() => approveTeacher(tch.id)}
                        className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow cursor-pointer flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Approve
                      </button>
                    </>
                  )}

                  {tch.status === 'Approved' && (
                    <button
                      onClick={() => suspendTeacher(tch.id)}
                      className="px-3 py-1 rounded-lg bg-white/5 hover:bg-rose-950/40 text-slate-400 hover:text-rose-300 text-xs font-semibold border border-white/10 hover:border-rose-500/30 transition cursor-pointer"
                    >
                      Suspend Access
                    </button>
                  )}

                  {tch.status === 'Suspended' && (
                    <button
                      onClick={() => approveTeacher(tch.id)}
                      className="px-3 py-1 rounded-lg bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-300 text-xs font-semibold border border-emerald-500/30 transition cursor-pointer"
                    >
                      Restore Privileges
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
