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

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch =
      log.actor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.target.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'All' || log.actorRole === roleFilter;
    return matchesSearch && matchesRole;
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
            Immutable administrative log trail recording all approvals, test publications, and integrity enforcements.
          </p>
        </div>

        <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
          Non-Destructive Logging Active
        </span>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search action, target, or actor..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-900/60 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
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
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-900/90 text-slate-400 text-xs uppercase tracking-wider border-b border-white/10">
              <tr>
                <th className="px-5 py-3.5">Timestamp</th>
                <th className="px-5 py-3.5">Actor & Authority</th>
                <th className="px-5 py-3.5">Action Executed</th>
                <th className="px-5 py-3.5">Target Resource</th>
                <th className="px-5 py-3.5 text-center">IP Address</th>
                <th className="px-5 py-3.5 text-right">Integrity Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-medium">
              {filteredLogs.map(log => (
                <tr key={log.id} className="hover:bg-white/5 transition">
                  <td className="px-5 py-3.5 font-mono text-xs text-slate-400 shrink-0">
                    {log.timestamp}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="font-bold text-white">{log.actor}</div>
                    <span className="text-[10px] text-purple-300 font-mono">
                      {log.actorRole}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 font-semibold text-slate-200">
                    {log.action}
                  </td>
                  <td className="px-5 py-3.5 text-slate-400 font-mono text-xs">
                    {log.target}
                  </td>
                  <td className="px-5 py-3.5 text-center font-mono text-xs text-slate-500">
                    {log.ipAddress || 'Internal Gateway'}
                  </td>
                  <td className="px-5 py-3.5 text-right">
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
