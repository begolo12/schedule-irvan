import React from 'react';
import { Task, Member, TaskStatus } from '../types';
import { BarChart2, TrendingUp, CheckCircle, Clock, Users, PieChart, Activity } from 'lucide-react';

interface AnalyticsDashboardProps {
  tasks: Task[];
  members: Member[];
}

export function AnalyticsDashboard({ tasks, members }: AnalyticsDashboardProps) {
  // Analytical processing
  const totalTasks = tasks.length;
  const doneTasks = tasks.filter(t => t.status === 'done').length;
  const todoTasks = tasks.filter(t => t.status === 'todo').length;
  const inProgressTasks = tasks.filter(t => t.status === 'inprogress').length;
  const reviewTasks = tasks.filter(t => t.status === 'review').length;

  const completionRate = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

  // Overdue count check
  const now = new Date();
  now.setHours(0,0,0,0);
  const overdueTasks = tasks.filter(t => {
    if (t.status === 'done' || !t.dueDate) return false;
    const due = new Date(t.dueDate);
    due.setHours(0,0,0,0);
    return due < now;
  }).length;

  // Active workload count by assignee
  const workloadByAssignee = members.map(m => {
    const totalAssigned = tasks.filter(t => t.assigneeId === m.id).length;
    const completed = tasks.filter(t => t.assigneeId === m.id && t.status === 'done').length;
    return {
      name: m.name,
      total: totalAssigned,
      done: completed,
      pending: totalAssigned - completed,
      avatarColor: m.avatarColor
    };
  });

  // Priority count helper
  const highPriority = tasks.filter(t => t.priority === 'high').length;
  const mediumPriority = tasks.filter(t => t.priority === 'medium').length;
  const lowPriority = tasks.filter(t => t.priority === 'low').length;

  return (
    <div id="analytics-dashboard-container" className="space-y-6">
      
      {/* High-level performance cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Tasks Card */}
        <div className="p-5 bg-white dark:bg-slate-950 border border-slate-250/60 dark:border-slate-800 rounded-2xl flex items-center justify-between shadow-sm">
          <div>
            <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Total Pekerjaan</span>
            <h3 className="text-3xl font-black text-slate-800 dark:text-slate-100 mt-1">{totalTasks}</h3>
            <p className="text-[10px] text-slate-450 mt-1">Seluruh item di papan proyek</p>
          </div>
          <div className="p-3.5 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-xl">
            <BarChart2 className="w-6 h-6" />
          </div>
        </div>

        {/* Completion Rate Card */}
        <div className="p-5 bg-white dark:bg-slate-950 border border-slate-250/60 dark:border-slate-800 rounded-2xl flex items-center justify-between shadow-sm">
          <div>
            <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider font-sans">Kadar Selesai</span>
            <h3 className="text-3xl font-black text-slate-850 dark:text-slate-100 mt-1">{completionRate}%</h3>
            {/* Visual Mini Progress Bar */}
            <div className="w-24 bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: `${completionRate}%` }}></div>
            </div>
          </div>
          <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-xl">
            <CheckCircle className="w-6 h-6" />
          </div>
        </div>

        {/* Active In-Progress */}
        <div className="p-5 bg-white dark:bg-slate-950 border border-slate-250/60 dark:border-slate-800 rounded-2xl flex items-center justify-between shadow-sm">
          <div>
            <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Sedang Dikerjakan</span>
            <h3 className="text-3xl font-black text-slate-800 dark:text-slate-100 mt-1">{inProgressTasks}</h3>
            <p className="text-[10px] text-slate-450 mt-1 font-sans">{reviewTasks} tugas dalam tahap review</p>
          </div>
          <div className="p-3.5 bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 rounded-xl">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* Overdue Limit */}
        <div className="p-5 bg-white dark:bg-slate-950 border border-slate-250/60 dark:border-slate-800 rounded-2xl flex items-center justify-between shadow-sm">
          <div>
            <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Melewati Tenggat</span>
            <h3 className={`text-3xl font-black mt-1 ${overdueTasks > 0 ? 'text-rose-600 dark:text-rose-450' : 'text-slate-850 dark:text-slate-100'}`}>{overdueTasks}</h3>
            <p className="text-[10px] text-slate-450 mt-1">{overdueTasks > 0 ? 'Butuh penanganan segera!' : 'Semua aman terkendali'}</p>
          </div>
          <div className={`p-3.5 rounded-xl ${overdueTasks > 0 ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-500' : 'bg-slate-50 dark:bg-slate-900 text-slate-500'}`}>
            <Activity className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Grid: Task Status Distribution (Donut Chart) */}
        <div className="col-span-1 lg:col-span-4 p-6 bg-white dark:bg-slate-950 border border-slate-250/60 dark:border-slate-800 rounded-2xl shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <PieChart className="w-4 h-4 text-indigo-500" />
              <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm">Distribusi Status</h4>
            </div>

            {/* Custom SVG Donut */}
            <div className="flex justify-center my-6 relative">
              {totalTasks > 0 ? (
                <svg width="160" height="160" viewBox="0 0 42 42" className="transform -rotate-90">
                  {/* Outer Background circle */}
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="var(--color-slate-100, #e2e8f0)" strokeWidth="3" className="dark:stroke-slate-900"></circle>
                  
                  {/* Done tasks segment */}
                  <circle 
                    cx="21" cy="21" r="15.915" fill="transparent" 
                    stroke="#10b981" strokeWidth="4.5" 
                    strokeDasharray={`${(doneTasks / totalTasks) * 100} ${100 - ((doneTasks / totalTasks) * 100)}`} 
                    strokeDashoffset="0"
                  ></circle>

                  {/* In Progress segment */}
                  <circle 
                    cx="21" cy="21" r="15.915" fill="transparent" 
                    stroke="#f59e0b" strokeWidth="4.5" 
                    strokeDasharray={`${(inProgressTasks / totalTasks) * 100} ${100 - ((inProgressTasks / totalTasks) * 100)}`} 
                    strokeDashoffset={`-${(doneTasks / totalTasks) * 100}`}
                  ></circle>

                  {/* Review segment */}
                  <circle 
                    cx="21" cy="21" r="15.915" fill="transparent" 
                    stroke="#0ea5e9" strokeWidth="4.5" 
                    strokeDasharray={`${(reviewTasks / totalTasks) * 100} ${100 - ((reviewTasks / totalTasks) * 100)}`} 
                    strokeDashoffset={`-${((doneTasks + inProgressTasks) / totalTasks) * 100}`}
                  ></circle>

                  {/* Todo segment */}
                  <circle 
                    cx="21" cy="21" r="15.915" fill="transparent" 
                    stroke="#6366f1" strokeWidth="4.5" 
                    strokeDasharray={`${(todoTasks / totalTasks) * 100} ${100 - ((todoTasks / totalTasks) * 100)}`} 
                    strokeDashoffset={`-${((doneTasks + inProgressTasks + reviewTasks) / totalTasks) * 100}`}
                  ></circle>
                </svg>
              ) : (
                <div className="w-40 h-40 rounded-full border-4 border-dashed border-slate-200 dark:border-slate-800 flex items-center justify-center">
                  <p className="text-xs text-slate-400">Kosong</p>
                </div>
              )}
              {/* Absolutes inner indicator */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                <span className="text-xl font-bold text-slate-800 dark:text-slate-100">{totalTasks}</span>
                <p className="text-[9px] text-slate-400 font-sans tracking-tight uppercase">Tugas</p>
              </div>
            </div>
          </div>

          {/* Color Keys List */}
          <div className="space-y-2 border-t border-slate-100 dark:border-slate-900 pt-4 text-xs font-sans">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span className="text-slate-500 dark:text-slate-400">Selesai (Done)</span>
              </div>
              <span className="font-bold text-slate-700 dark:text-slate-350">{doneTasks}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                <span className="text-slate-500 dark:text-slate-400">Pengerjaan (In Progress)</span>
              </div>
              <span className="font-bold text-slate-700 dark:text-slate-350">{inProgressTasks}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-500"></span>
                <span className="text-slate-500 dark:text-slate-400">Peninjauan (Review)</span>
              </div>
              <span className="font-bold text-slate-700 dark:text-slate-350">{reviewTasks}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
                <span className="text-slate-500 dark:text-slate-400">Daftar Antrean (To Do)</span>
              </div>
              <span className="font-bold text-slate-700 dark:text-slate-350">{todoTasks}</span>
            </div>
          </div>
        </div>

        {/* Right Grid: Team Workload (Bar Chart) */}
        <div className="col-span-1 lg:col-span-8 p-6 bg-white dark:bg-slate-950 border border-slate-250/60 dark:border-slate-800 rounded-2xl shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-emerald-500" />
              <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm">Beban Kerja Detail Anggota Tim</h4>
            </div>
            <p className="text-xs text-slate-400 mb-6">Membantu mendistribusikan penugasan secara adil seimbang ke semua pihak</p>

            {/* Simulated Bar Chart */}
            <div className="space-y-4">
              {workloadByAssignee.map((item, index) => {
                const maxVal = Math.max(...workloadByAssignee.map(w => w.total), 1);
                const percentDone = item.total > 0 ? (item.done / maxVal) * 100 : 0;
                const percentPending = item.total > 0 ? (item.pending / maxVal) * 100 : 0;

                return (
                  <div key={index} className="space-y-1.5">
                    {/* Member Labels */}
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.avatarColor }}></span>
                        <span className="font-semibold text-slate-700 dark:text-slate-300">{item.name}</span>
                      </div>
                      <span className="font-medium text-slate-400 dark:text-slate-500">
                        <strong className="text-emerald-500">{item.done} Selesai</strong> / {item.total} Total
                      </span>
                    </div>

                    {/* Bar stack layout */}
                    <div className="w-full h-4 bg-slate-100 dark:bg-slate-900 rounded-lg overflow-hidden flex shadow-inner">
                      {item.total > 0 ? (
                        <>
                          <div 
                            className="bg-emerald-500 h-full hover:opacity-90 transition-all duration-300 relative group"
                            style={{ width: `${(item.done / item.total) * 100}%` }}
                          >
                          </div>
                          <div 
                            className="bg-indigo-400 dark:bg-indigo-500 h-full hover:opacity-90 transition-all duration-300 relative group"
                            style={{ width: `${(item.pending / item.total) * 100}%` }}
                          >
                          </div>
                        </>
                      ) : (
                        <div className="w-full text-[10px] text-slate-400 flex items-center justify-center">Belum ditugaskan pekerjaan</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-8 border-t border-slate-100 dark:border-slate-900 pt-4 flex gap-6 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-emerald-500"></span>
              <span>Proporsi Selesai (Selesai)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-indigo-550"></span>
              <span>Pekerjaan Tertunda (To Do / In Progress)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Priority & Workload Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Velocity Trend line */}
        <div className="p-6 bg-white dark:bg-slate-950 border border-slate-250/60 dark:border-slate-800 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm">Tren Selesai Mingguan</h4>
            <span className="text-[10px] bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 px-2.5 py-0.5 rounded-full font-bold">Teroptimal</span>
          </div>
          {/* Custom SVG Line Chart */}
          <div className="h-[120px] flex items-end">
            <svg viewBox="0 0 500 100" className="w-full h-full overflow-visible">
              {/* Horizontal Gridlines */}
              <line x1="0" y1="20" x2="500" y2="20" stroke="var(--color-slate-100, #f1f5f9)" strokeDasharray="3" className="dark:stroke-slate-900" />
              <line x1="0" y1="50" x2="500" y2="50" stroke="var(--color-slate-100, #f1f5f9)" strokeDasharray="3" className="dark:stroke-slate-900" />
              <line x1="0" y1="80" x2="500" y2="80" stroke="var(--color-slate-100, #f1f5f9)" strokeDasharray="3" className="dark:stroke-slate-900" />
              
              {/* Trend smooth Area Path */}
              <path 
                d="M 10 90 Q 90 70, 170 50 T 330 30 T 490 10 L 490 90 Z" 
                fill="url(#indigo-grad)" 
                opacity="0.15"
              />

              {/* Trend Line */}
              <path 
                d="M 10 90 Q 90 70, 170 50 T 330 30 T 490 10" 
                fill="none" 
                stroke="#6366f1" 
                strokeWidth="3.5" 
                strokeLinecap="round"
              />

              {/* Points */}
              <circle cx="10" cy="90" r="4.5" fill="#6366f1" stroke="white" strokeWidth="1.5" />
              <circle cx="90" cy="78" r="4.5" fill="#6366f1" stroke="white" strokeWidth="1.5" />
              <circle cx="170" cy="50" r="4.5" fill="#6366f1" stroke="white" strokeWidth="1.5" />
              <circle cx="250" cy="38" r="4.5" fill="#6366f1" stroke="white" strokeWidth="1.5" />
              <circle cx="330" cy="30" r="4.5" fill="#6366f1" stroke="white" strokeWidth="1.5" />
              <circle cx="410" cy="22" r="4.5" fill="#6366f1" stroke="white" strokeWidth="1.5" />
              <circle cx="490" cy="10" r="4.5" fill="#6366f1" stroke="white" strokeWidth="1.5" />

              {/* Gradient definitions */}
              <defs>
                <linearGradient id="indigo-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div className="flex justify-between text-[11px] text-slate-400 mt-2 font-mono">
            <span>Minggu 1</span>
            <span>Minggu 2</span>
            <span>Minggu 3</span>
            <span>Minggu ke-4 (Sekarang)</span>
          </div>
        </div>

        {/* Priority Counts */}
        <div className="p-6 bg-white dark:bg-slate-950 border border-slate-250/60 dark:border-slate-800 rounded-2xl shadow-sm">
          <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm mb-4">Urutan Prioritas Pekerjaan</h4>
          <div className="space-y-4">
            {/* High Priority Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-600 dark:text-slate-400">Tinggi (High)</span>
                <span className="font-bold text-rose-500">{highPriority} Tugas</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-900 h-2.5 rounded-full overflow-hidden">
                <div className="bg-rose-500 h-full rounded-full transition-all duration-300" style={{ width: `${totalTasks > 0 ? (highPriority / totalTasks) * 100 : 0}%` }}></div>
              </div>
            </div>

            {/* Medium Priority Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-600 dark:text-slate-400">Sedang (Medium)</span>
                <span className="font-bold text-amber-500">{mediumPriority} Tugas</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-900 h-2.5 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full transition-all duration-300" style={{ width: `${totalTasks > 0 ? (mediumPriority / totalTasks) * 100 : 0}%` }}></div>
              </div>
            </div>

            {/* Low Priority Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-600 dark:text-slate-400">Rendah (Low)</span>
                <span className="font-bold text-indigo-500">{lowPriority} Tugas</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-900 h-2.5 rounded-full overflow-hidden">
                <div className="bg-indigo-400 h-full rounded-full transition-all duration-300" style={{ width: `${totalTasks > 0 ? (lowPriority / totalTasks) * 100 : 0}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
