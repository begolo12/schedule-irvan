import React, { useState, useMemo } from 'react';
import { Task, Member } from '../types';
import { 
  Calendar, 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  User, 
  AlertCircle, 
  SlidersHorizontal,
  Info,
  CheckCircle,
  HelpCircle,
  TrendingUp,
  Activity
} from 'lucide-react';

interface GanttChartProps {
  tasks: Task[];
  members: Member[];
  onEditTask: (task: Task) => void;
  onAddTask: (column: any, prefilledDate?: string) => void;
  currentRole: string;
}

export function GanttChart({ tasks, members, onEditTask, onAddTask, currentRole }: GanttChartProps) {
  // Timeline start and end range configuration (Dynamic view offset or static 15-day range around June 2026)
  const [timelineStartStr, setTimelineStartStr] = useState<string>("2026-06-01");
  const [filterAssignee, setFilterAssignee] = useState<string>("all");
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  // Generate 16 days sequence for timeline column layout
  const timelineDays = useMemo(() => {
    const days = [];
    const baseDate = new Date(timelineStartStr);
    for (let i = 0; i < 16; i++) {
      const d = new Date(baseDate);
      d.setDate(baseDate.getDate() + i);
      const dayNum = d.getDate();
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agt", "Sep", "Okt", "Nov", "Des"];
      const dayNames = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
      
      days.push({
        dateStr: d.toISOString().split('T')[0],
        dayLabel: dayNames[d.getDay()],
        dayNum: dayNum,
        monthLabel: monthNames[d.getMonth()],
        isToday: d.toISOString().split('T')[0] === '2026-06-05' // Hardcoded current date context
      });
    }
    return days;
  }, [timelineStartStr]);

  // Handle navigate timeline range
  const handleShiftTimeline = (daysAmount: number) => {
    const d = new Date(timelineStartStr);
    d.setDate(d.getDate() + daysAmount);
    setTimelineStartStr(d.toISOString().split('T')[0]);
  };

  // Reset timeline to original June 1st, 2026
  const handleResetTimeline = () => {
    setTimelineStartStr("2026-06-01");
  };

  // Filtered Tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      if (filterAssignee !== "all" && task.assigneeId !== filterAssignee) return false;
      if (filterPriority !== "all" && task.priority !== filterPriority) return false;
      return true;
    });
  }, [tasks, filterAssignee, filterPriority]);

  // Find the selected task metadata
  const selectedTask = useMemo(() => {
    return tasks.find(t => t.id === selectedTaskId) || null;
  }, [tasks, selectedTaskId]);

  // Group tasks by division
  const groupedTasks = useMemo(() => {
    const groups: { [key: string]: Task[] } = {};
    filteredTasks.forEach(task => {
      const divName = task.division || "Divisi Operasi";
      if (!groups[divName]) {
        groups[divName] = [];
      }
      groups[divName].push(task);
    });
    return groups;
  }, [filteredTasks]);

  // Helper to place and size Gantt Bars
  // Since we have a simple due date, we assume the task starts:
  // - 3 days before due date for high priority
  // - 2 days before due date for medium priority
  // - 1 day before due date for low priority
  const calculateTaskGanttPlacements = (task: Task) => {
    const duration = task.priority === 'high' ? 4 : task.priority === 'medium' ? 3 : 2;
    const dueTime = new Date(task.dueDate).getTime();
    
    // Calculate start date based on duration
    const startDate = new Date(dueTime);
    startDate.setDate(startDate.getDate() - (duration - 1));
    const startStr = startDate.toISOString().split('T')[0];

    // Find grid position offsets in our 16-day array
    let startIndex = -1;
    let span = 0;

    timelineDays.forEach((td, index) => {
      const tdTime = new Date(td.dateStr).getTime();
      const sTime = new Date(startStr).getTime();
      const eTime = new Date(task.dueDate).getTime();

      // Check overlapping days
      if (tdTime >= sTime && tdTime <= eTime) {
        if (startIndex === -1) {
          startIndex = index;
        }
        span++;
      }
    });

    return {
      startIndex, // if -1, it means it's outside the current timeline display range
      span,
      startStr,
      endStr: task.dueDate
    };
  };

  return (
    <div id="gantt-chart-workspace" className="space-y-6">
      
      {/* Visual Identity Section Header */}
      <div className="p-5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-2xl flex flex-col md:flex-row gap-5 items-center justify-between shadow-sm">
        <div className="space-y-1">
          <div className="text-xs font-black text-indigo-500 uppercase tracking-widest font-mono flex items-center gap-1.5">
            <Activity className="w-4.5 h-4.5 text-indigo-500" />
            Diagram Jadwal & Timeline Gantt
          </div>
          <h1 className="text-xl font-bold text-slate-850 dark:text-white leading-tight">Visualisasikan Berkas Progres Pekerjaan</h1>
          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            Pantau durasi, tumpang tindih waktu kerja, serta tenggat tanggal tugas secara visual. Geser jadwal, filter, 
            dan optimalkan pergerakan pelaksana tim dengan akurasi tinggi.
          </p>
        </div>

        {/* Quick Trigger Navigation */}
        <div className="flex gap-2 self-start md:self-center shrink-0">
          <button
            onClick={() => onAddTask('todo')}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition cursor-pointer flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Tugas Baru</span>
          </button>
        </div>
      </div>

      {/* FILTER & TIMELINE WINDOW NAVIGATION BAR */}
      <div className="p-4 bg-white dark:bg-slate-950 border border-slate-200/80 dark:border-slate-850 rounded-xl shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Dynamic Controls with selectors */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto text-xs">
          <div className="flex items-center gap-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-bold text-slate-400 mr-1 uppercase text-[10px]">Penyaring:</span>
          </div>

          {/* Assignee Filter */}
          <select
            id="gantt-filter-assignee"
            value={filterAssignee}
            onChange={(e) => setFilterAssignee(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-slate-900 font-semibold"
          >
            <option value="all">Semua Pelaksana</option>
            {members.map(m => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>

          {/* Priority filter */}
          <select
            id="gantt-filter-priority"
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-slate-900 font-semibold"
          >
            <option value="all">Semua Urgensi</option>
            <option value="low">Rendah (Low)</option>
            <option value="medium">Sedang (Medium)</option>
            <option value="high">Tinggi (High)</option>
          </select>
        </div>

        {/* Timeline shift pagination controls */}
        <div className="flex items-center gap-2 self-end md:self-center">
          <span className="text-[11px] text-slate-400 font-mono hidden lg:inline mr-2">
            Mulai: <strong className="text-slate-650 dark:text-slate-250">{timelineStartStr}</strong>
          </span>

          <button
            onClick={() => handleShiftTimeline(-7)}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-500 transition cursor-pointer"
            title="Mundur 1 Minggu"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={handleResetTimeline}
            className="px-3 py-1.8 text-[11px] font-bold rounded-xl border border-indigo-200 dark:border-indigo-950/40 bg-indigo-50/20 dark:bg-indigo-950/20 text-indigo-650 dark:text-indigo-400 transition cursor-pointer"
          >
            Awal (Juni 2026)
          </button>

          <button
            onClick={() => handleShiftTimeline(7)}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-500 transition cursor-pointer"
            title="Maju 1 Minggu"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* DETAILED DIAGRAM CONTAINER */}
      <div className="bg-white dark:bg-slate-950 border border-slate-200/85 dark:border-slate-850 rounded-2xl shadow-sm overflow-hidden">
        
        {/* Responsive Scrolling Core Layout */}
        <div className="overflow-x-auto min-w-full">
          <div className="min-w-[980px]">
            
            {/* Timeline header row with exact dates */}
            <div className="grid grid-cols-12 border-b border-slate-100 dark:border-slate-900">
              
              {/* Left Task labels column header */}
              <div className="col-span-4 p-4 border-r border-slate-100 dark:border-slate-900 bg-slate-50/50 dark:bg-slate-900/10 flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Daftar Rincian Tugas</span>
                <span className="text-[10px] font-mono text-slate-400">({filteredTasks.length} Tugas)</span>
              </div>

              {/* Grid 8-column for dates timeline */}
              <div className="col-span-8 grid grid-cols-16 h-full text-center divide-x divide-slate-100 dark:divide-slate-900 text-[10px]">
                {timelineDays.map((td, idx) => (
                  <div 
                    key={idx} 
                    className={`py-3 flex flex-col justify-center items-center ${
                      td.isToday ? 'bg-indigo-50/30 dark:bg-indigo-950/20 relative' : ''
                    }`}
                  >
                    {td.isToday && (
                      <span className="absolute top-0 inset-x-0 h-0.5 bg-indigo-500 animate-pulse"></span>
                    )}
                    <span className="text-slate-400 font-mono text-[9px] uppercase">{td.dayLabel}</span>
                    <span className={`text-[12px] font-bold block mt-0.5 ${
                      td.isToday ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-700 dark:text-slate-300'
                    }`}>
                      {td.dayNum}
                    </span>
                    <span className="text-[8px] text-slate-400 font-mono mt-0.5 uppercase">{td.monthLabel}</span>
                  </div>
                ))}
              </div>

            </div>

            {/* Timeline Task Row Lists */}
            {filteredTasks.length === 0 ? (
              <div className="p-12 text-center">
                <Calendar className="w-10 h-10 text-slate-350 dark:text-slate-650 mx-auto mb-2 opacity-50" />
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">Belum ada tugas terjadwal</h4>
                <p className="text-[11px] text-slate-400 mt-1">Ubah filter pelaksana atau buatlah tugas baru untuk melihat Gantt bar.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-900">
                {(Object.entries(groupedTasks) as [string, Task[]][]).map(([divName, divTasks]) => (
                  <React.Fragment key={divName}>
                    {/* DIVISION HEAD HEADER ROW */}
                    <div className="grid grid-cols-12 items-center bg-slate-50/70 dark:bg-slate-900/40 border-y border-slate-100 dark:border-slate-900">
                      <div className="col-span-12 p-3 flex items-center gap-2">
                        <span className="w-2.5 h-2.5 bg-indigo-505 bg-indigo-500 rounded-full animate-pulse shrink-0"></span>
                        <h3 className="font-extrabold text-xs uppercase tracking-widest text-indigo-650 dark:text-indigo-400 font-mono">
                          {divName} <span className="text-[10px] font-normal text-slate-400 font-sans ml-1 text-lowercase">({divTasks.length} sub-tugas)</span>
                        </h3>
                      </div>
                    </div>

                    {/* SUB-TASKS NESTED ROWS */}
                    {divTasks.map((task) => {
                      const p = calculateTaskGanttPlacements(task);
                      const isCurrentlySelected = selectedTaskId === task.id;

                      // Define dynamic color accents based on status
                      const statusColors = {
                        todo: {
                          bar: "bg-amber-100 dark:bg-amber-950/40 border-amber-300 dark:border-amber-900/60",
                          stripe: "bg-amber-500"
                        },
                        inprogress: {
                          bar: "bg-indigo-500/10 border-indigo-500/30",
                          stripe: "bg-indigo-500"
                        },
                        review: {
                          bar: "bg-purple-100 dark:bg-purple-950/40 border-purple-300 dark:border-purple-850/60",
                          stripe: "bg-purple-500"
                        },
                        done: {
                          bar: "bg-emerald-500/10 border-emerald-500/20 opacity-70",
                          stripe: "bg-emerald-500"
                        }
                      };

                      const activeColor = statusColors[task.status] || statusColors.todo;

                      return (
                        <div 
                          key={task.id} 
                          onClick={() => setSelectedTaskId(isCurrentlySelected ? null : task.id)}
                          className={`grid grid-cols-12 items-center hover:bg-slate-50 dark:hover:bg-slate-900/45 transition-colors cursor-pointer ${
                            isCurrentlySelected ? 'bg-indigo-50/15 dark:bg-indigo-950/10' : ''
                          }`}
                        >
                          
                          {/* Left side Metadata info */}
                          <div className="col-span-4 p-4 pl-6 border-r border-slate-100 dark:border-slate-900 flex flex-col gap-1 pr-3">
                            <div className="flex items-center gap-1.5">
                              {task.status === 'done' ? (
                                <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                              ) : (
                                <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              )}
                              <h4 className="font-bold text-xs text-slate-800 dark:text-slate-155 truncate" title={task.title}>
                                {task.isEncrypted ? "🔒 [E2EE Encrypted]" : task.title}
                              </h4>
                            </div>
                            
                            <div className="flex items-center justify-between gap-1 mt-1 text-[10px]">
                              <div className="flex items-center gap-1 text-slate-500">
                                <span 
                                  className="w-2 rounded-full h-2" 
                                  style={{ backgroundColor: task.assigneeAvatarColor || '#6366f1' }}
                                ></span>
                                <span className="truncate max-w-[120px]">{task.assigneeName}</span>
                              </div>

                              <div className="flex items-center gap-1 font-bold">
                                <span className={`px-1.5 py-0.2 rounded font-mono uppercase text-[9px] ${
                                  task.priority === 'high' 
                                    ? 'bg-rose-100 dark:bg-rose-950/45 text-rose-600' 
                                    : task.priority === 'medium'
                                    ? 'bg-amber-100 dark:bg-amber-950/45 text-amber-600'
                                    : 'bg-slate-100 dark:bg-slate-850 text-slate-500'
                                }`}>
                                  {task.priority.toUpperCase()}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Timeline side bar rendering */}
                          <div className="col-span-8 grid grid-cols-16 h-16 relative items-center divide-x divide-slate-100 dark:divide-slate-900">
                            
                            {/* Static divider background bars */}
                            {Array.from({ length: 16 }).map((_, index) => (
                              <div key={index} className="h-full"></div>
                            ))}

                            {/* Absolutely positioned Gantt timeline block */}
                            {p.startIndex !== -1 && (
                              <div 
                                style={{ 
                                  gridColumnStart: p.startIndex + 1, 
                                  gridColumnEnd: p.startIndex + p.span + 1 
                                }}
                                className={`h-9 border text-[10px] pl-2.5 pr-2 rounded-xl flex items-center justify-between transition-all group shadow-sm z-10 ${activeColor.bar}`}
                              >
                                <div className="flex items-center gap-1.5 truncate">
                                  <span className={`w-1.5 h-4 flex-shrink-0 rounded-full ${activeColor.stripe}`}></span>
                                  <span className="font-bold text-slate-700 dark:text-slate-200 truncate pr-1">
                                    {p.span} Hari Kerja
                                  </span>
                                </div>

                                <span className="text-[8px] font-mono font-bold text-slate-400 bg-white/60 dark:bg-slate-900/50 px-1 py-0.2 rounded hidden group-hover:block whitespace-nowrap">
                                  {p.startStr} - {p.endStr}
                                </span>
                              </div>
                            )}

                            {/* Indication label for schedule that fell completely outside base ranges */}
                            {p.startIndex === -1 && (
                              <div className="absolute inset-x-4 h-full flex items-center justify-center pointer-events-none">
                                <span className="text-[9px] font-mono text-slate-400 bg-slate-50 dark:bg-slate-900 px-2 py-0.5 rounded border border-dashed border-slate-200 dark:border-slate-800">
                                  Deadline ({task.dueDate}) berada diluar rentang grid saat ini
                                </span>
                              </div>
                            )}

                          </div>

                        </div>
                      );
                    })}
                  </React.Fragment>
                ))}
              </div>
            )}

          </div>
        </div>
      </div>

      {/* BOTTOM SELECTION DETAILS PANEL CARD */}
      {selectedTask && (
        <div id="selection-details-card" className="p-5 bg-white dark:bg-slate-950 border border-indigo-200 dark:border-indigo-950/60 rounded-2xl shadow-md space-y-3.5">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-900">
            <div className="flex items-center gap-2">
              <Info className="w-5 h-5 text-indigo-500" />
              <h3 className="font-black text-xs text-slate-800 dark:text-slate-100 uppercase tracking-wider">Detail Schedular Terpilih</h3>
            </div>
            <button 
              onClick={() => setSelectedTaskId(null)}
              className="text-[10px] font-bold text-indigo-500 hover:underline"
            >
              Tutup Panel
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 font-bold block">TUGAS DAN PENANGGUNG JAWAB</span>
              <p className="text-xs font-bold text-slate-800 dark:text-white">
                {selectedTask.isEncrypted ? "🔒 Tugas Terenkripsi E2EE" : selectedTask.title}
              </p>
              <p className="text-[11px] text-slate-450 mt-1 lines-clamp-2 leading-relaxed">
                {selectedTask.description || "Tidak ada deskripsi tambahan untuk tugas yang dipilih."}
              </p>
            </div>

            <div className="space-y-1.5 font-mono text-[11px]">
              <span className="text-[10px] text-slate-400 font-bold block font-sans">PERENCANAAN DURASI JADWAL</span>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">Tenggat Target:</span>
                  <strong className="text-slate-700 dark:text-slate-350">{selectedTask.dueDate}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Estimasi Mulai:</span>
                  <strong className="text-slate-700 dark:text-slate-350">
                    {calculateTaskGanttPlacements(selectedTask).startStr}
                  </strong>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-end gap-2 text-right self-center md:self-end">
              <span className="text-[10px] text-slate-400 font-bold block font-sans text-left md:text-right">TINDAKAN</span>
              <div className="flex items-center gap-2 justify-start md:justify-end">
                <button
                  onClick={() => onEditTask(selectedTask)}
                  className="px-3.5 py-1.8 bg-indigo-650 bg-indigo-600 hover:bg-slate-200 hover:text-indigo-600 font-semibold rounded-xl text-white dark:text-indigo-400 text-xs transition cursor-pointer"
                >
                  Sunting Parameter Tugas
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* METRIC CARD STATISTICS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div className="p-4 bg-white dark:bg-slate-950 border border-slate-200/60 dark:border-slate-850/60 rounded-xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[9px] uppercase font-mono font-bold text-slate-400">Total Progres Selesai</span>
            <h4 className="text-2xl font-black">{tasks.filter(t => t.status === 'done').length} Pekerjaan</h4>
          </div>
          <CheckCircle className="w-8 h-8 text-emerald-500 opacity-40 shrink-0" />
        </div>

        <div className="p-4 bg-white dark:bg-slate-950 border border-slate-200/60 dark:border-slate-850/60 rounded-xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[9px] uppercase font-mono font-bold text-slate-400">Tugas Sedang Berlangsung</span>
            <h4 className="text-2xl font-black">{tasks.filter(t => t.status === 'inprogress').length} Pekerjaan</h4>
          </div>
          <Clock className="w-8 h-8 text-indigo-500 opacity-40 shrink-0" />
        </div>

        <div className="p-4 bg-white dark:bg-slate-950 border border-slate-200/60 dark:border-slate-850/60 rounded-xl flex items-center justify-between overflow-hidden">
          <div className="space-y-1">
            <span className="text-[9px] uppercase font-mono font-bold text-slate-400">Tingkat Urgensi Tinggi</span>
            <h4 className="text-2xl font-black">{tasks.filter(t => t.priority === 'high').length} Kritikal</h4>
          </div>
          <AlertCircle className="w-8 h-8 text-rose-500 opacity-40 shrink-0" />
        </div>

      </div>

    </div>
  );
}
