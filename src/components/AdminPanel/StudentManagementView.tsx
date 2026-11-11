import React, { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  ShieldAlert,
  Award,
  Eye,
  X
} from 'lucide-react';
import { useQuiz } from '../../context/QuizContext';
import { AdminStudentItem } from '../../context/QuizContext';

export const StudentManagementView: React.FC = () => {
  const { allStudents, updateStudentStatus, completedAttempts } = useQuiz();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'All' | 'Active' | 'Suspended'>('All');
  const [selectedStudent, setSelectedStudent] = useState<AdminStudentItem | null>(null);

  const filteredStudents = allStudents.filter(student => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || student.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-extrabold text-white">
            Student Roster & Verification
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage registered aspirants, track lifetime test participation, and enforce examination integrity.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
            Active Roster: {allStudents.filter(s => s.status === 'Active').length} Candidates
          </span>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search candidate by name or email..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-900/60 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#FF8C32]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs text-slate-400">Status:</span>
          {(['All', 'Active', 'Suspended'] as const).map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                filterStatus === status
                  ? 'bg-[#FF8C32] text-slate-950 font-bold'
                  : 'bg-white/5 text-slate-400 hover:text-white'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Candidates Table */}
      <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-900/90 text-slate-400 text-xs uppercase tracking-wider border-b border-white/10">
              <tr>
                <th className="px-5 py-3.5">Candidate Name</th>
                <th className="px-5 py-3.5">Contact Email</th>
                <th className="px-5 py-3.5 text-center">Attempts</th>
                <th className="px-5 py-3.5 text-center">Lifetime Points</th>
                <th className="px-5 py-3.5 text-center">Global Rank</th>
                <th className="px-5 py-3.5 text-center">Account Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-medium">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-slate-400">
                    <Users className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-slate-300">
                      {searchTerm || filterStatus !== 'All' ? 'No candidates matched your filter criteria.' : 'No candidates registered yet.'}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {searchTerm || filterStatus !== 'All' ? 'Try adjusting your search query or status filter.' : 'When students sign up, their profiles will automatically be registered here.'}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredStudents.map(student => (
                  <tr key={student.id} className="hover:bg-white/5 transition">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#FF8C32] to-amber-600 flex items-center justify-center font-bold text-xs text-slate-950">
                          {student.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-white">{student.name}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{student.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-slate-300 font-mono text-xs">
                      {student.email}
                    </td>
                    <td className="px-5 py-3.5 text-center font-mono font-bold text-white">
                      {student.attempts}
                    </td>
                    <td className="px-5 py-3.5 text-center font-mono font-bold text-[#FF8C32]">
                      {student.points} pts
                    </td>
                    <td className="px-5 py-3.5 text-center font-mono font-bold text-amber-300">
                      #{student.rank}
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <span
                        className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded ${
                          student.status === 'Active'
                            ? 'text-emerald-300 bg-emerald-500/20'
                            : 'text-rose-300 bg-rose-500/20'
                        }`}
                      >
                        {student.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedStudent(student)}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition cursor-pointer"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {student.status === 'Active' ? (
                          <button
                            onClick={() => updateStudentStatus(student.id, 'Suspended')}
                            className="px-2.5 py-1 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 text-xs font-semibold border border-rose-500/30 transition cursor-pointer"
                          >
                            Suspend
                          </button>
                        ) : (
                          <button
                            onClick={() => updateStudentStatus(student.id, 'Active')}
                            className="px-2.5 py-1 rounded-lg bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-300 text-xs font-semibold border border-emerald-500/30 transition cursor-pointer"
                          >
                            Reactivate
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Student Details Inspection Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="glass-panel p-6 rounded-3xl border border-white/20 max-w-lg w-full space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-heading font-bold text-base text-white">
                Candidate Profile Inspection
              </h3>
              <button
                onClick={() => setSelectedStudent(null)}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                <div className="w-12 h-12 rounded-xl bg-[#FF8C32] flex items-center justify-center text-slate-950 font-extrabold text-lg">
                  {selectedStudent.name.charAt(0)}
                </div>
                <div>
                  <div className="text-sm font-bold text-white">{selectedStudent.name}</div>
                  <div className="text-slate-400 font-mono">{selectedStudent.email}</div>
                  <div className="text-[10px] text-emerald-400">Account Status: {selectedStudent.status}</div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-3 rounded-xl bg-white/5">
                  <div className="text-[10px] text-slate-400 uppercase">Total Tests</div>
                  <div className="text-lg font-mono font-bold text-white">{selectedStudent.attempts}</div>
                </div>
                <div className="p-3 rounded-xl bg-white/5">
                  <div className="text-[10px] text-slate-400 uppercase">Lifetime Points</div>
                  <div className="text-lg font-mono font-bold text-[#FF8C32]">{selectedStudent.points}</div>
                </div>
                <div className="p-3 rounded-xl bg-white/5">
                  <div className="text-[10px] text-slate-400 uppercase">Rank</div>
                  <div className="text-lg font-mono font-bold text-amber-300">#{selectedStudent.rank}</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-white/5 space-y-1">
                <div className="font-bold text-slate-300">One Attempt Policy Enforcement:</div>
                <p className="text-slate-400 text-[11px]">
                  All completed submissions by this candidate are mathematically locked to 1 attempt. Option E selections have been audited with zero negative penalty deduction.
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedStudent(null)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
