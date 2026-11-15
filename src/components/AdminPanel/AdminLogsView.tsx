import React, { useState } from 'react';
import {
  ShieldAlert,
  Search,
  Filter,
  Activity,
  CheckCircle,
  AlertTriangle,
  Info,
  Clock
} from 'lucide-react';
import { useQuiz } from '../../context/QuizContext';

export const AdminLogsView: React.FC = () => {
  const { auditLogs } = useQuiz();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const filteredLogs = auditLogs.filter(log => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      !q ||
      log.actor.toLowerCase().includes(q) ||
      log.action.toLowerCase().includes(q) ||
      log.target.toLowerCase().includes(q) ||
      (log.targetUserUid || '').toLowerCase().includes(q) ||
      (log.adminUid || '').toLowerCase().includes(q) ||
      (log.reason || '').toLowerCase().includes(q);
    const matchesRole = roleFilter === 'All' || log.actorRole === roleFilter;
    const matchesCategory = categoryFilter === 'All' || (log.category || 'system') === categoryFilter;
    return matchesSearch && matchesRole && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-extrabold text-white">
            System Security & Audit Trail
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Immutable administrative log trail recording all role changes, approvals, test publications, and security enforcements.
          </p>
        </div>

        <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
          Immutable Audit Logging Active
        </span>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-white/10 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search action, target, UID, reason, or actor..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-900/60 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="px-3 py-2 bg-slate-900/60 border border-white/10 rounded-xl text-xs text-slate-200"
          >
            <option value="All">All Categories</option>
            <option value="role_management">Role Management</option>
            <option value="teacher_approval">Teacher Approval</option>
            <option value="account_status">Account Status</option>
            <option value="assessment">Assessments</option>
            <option value="system">General System</option>
          </select>

          <select
            value={roleFilter}
            onChange={e => setRoleFilter(e.target.value)}
            className="px-3 py-2 bg-slate-900/60 border border-white/10 rounded-xl text-xs text-slate-200"
          >
            <option value="All">All Roles</option>
            <option value="Admin">Admin Only</option>
            <option value="Teacher">Teacher Only</option>
            <option value="System">System Only</option>
          </select>
        </div>
      </div>

      {/* Logs Table */}
      <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider border-b border-white/10">
              <tr>
                <th className="px-4 py-3.5">Timestamp</th>
                <th className="px-4 py-3.5">Admin / Actor</th>
                <th className="px-4 py-3.5">Action & Role Change</th>
                <th className="px-4 py-3.5">Target User / Resource</th>
                <th className="px-4 py-3.5">Reason</th>
                <th className="px-4 py-3.5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-medium">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-slate-500">
                    No matching audit log entries found.
                  </td>
                </tr>
              ) : (
                filteredLogs.map(log => (
                  <tr key={log.id} className="hover:bg-white/5 transition">
                    <td className="px-4 py-3.5 font-mono text-[11px] text-slate-400 shrink-0">
                      {log.timestamp}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="font-bold text-white">{log.actor}</div>
                      <div className="text-[10px] text-purple-300 font-mono">
                        {log.actorRole}
                        {log.adminUid ? ` • ${log.adminUid.slice(0, 10)}...` : ''}
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="font-semibold text-slate-200">
                        {log.actionPerformed || log.action}
                      </div>
                      {log.previousRole && log.newRole && (
                        <div className="text-[10px] font-mono text-[#FF8C32] mt-0.5">
                          {log.previousRole} → {log.newRole}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-slate-300 font-mono text-[11px]">
                      <div>{log.target}</div>
                      {log.targetUserUid && (
                        <div className="text-[10px] text-slate-500">
                          UID: {log.targetUserUid}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-[11px] text-slate-400 max-w-[220px]">
                      {log.reason || '—'}
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <span
                        className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded ${
                          log.status === 'Success'
                            ? 'text-emerald-300 bg-emerald-500/20'
                            : log.status === 'Warning'
                            ? 'text-amber-300 bg-amber-500/20'
                            : 'text-cyan-300 bg-cyan-500/20'
                        }`}
                      >
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
