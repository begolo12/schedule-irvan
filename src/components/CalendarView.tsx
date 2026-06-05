import React, { useState } from 'react';
import { Task, Member, TaskStatus } from '../types';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Plus } from 'lucide-react';

interface CalendarViewProps {
  tasks: Task[];
  onAddTaskWithDate: (dateStr: string) => void;
  onEditTask: (task: Task) => void;
}

export function CalendarView({ tasks, onAddTaskWithDate, onEditTask }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState<Date>(new Date(2026, 5, 5)); // Initialized around current local time June 2026

  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = getDaysInMonth(year, month);
  const firstDayIndex = getFirstDayOfMonth(year, month);

  // Month navigation
  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Generate calendar cells (days)
  const days: { dateStr: string; dayNum: number | null; isCurrentMonth: boolean }[] = [];

  // Blank slots for previous month padding
  for (let i = 0; i < firstDayIndex; i++) {
    days.push({ dateStr: '', dayNum: null, isCurrentMonth: false });
  }

  // Active month days
  for (let i = 1; i <= daysInMonth; i++) {
    const monthStr = String(month + 1).padStart(2, '0');
    const dayStr = String(i).padStart(2, '0');
    const dateStr = `${year}-${monthStr}-${dayStr}`;
    days.push({ dateStr, dayNum: i, isCurrentMonth: true });
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-rose-500 hover:bg-rose-600 text-white';
      case 'medium': return 'bg-amber-500 hover:bg-amber-600 text-white';
      default: return 'bg-slate-500 hover:bg-slate-600 text-white';
    }
  };

  return (
    <div id="calendar-integration-container" className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 flex flex-col h-full shadow-sm">
      {/* Calendar Header with Navigation */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-150 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-xl">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-150">Kalender Penjadwalan</h2>
            <p className="text-xs text-slate-400 dark:text-slate-500">Visualisasi deadline dan tenggat penyelesaian pekerjaan</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="calendar-today-btn"
            onClick={goToToday}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-350 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            Hari Ini
          </button>
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 rounded-lg p-1">
            <button
              id="calendar-prev-btn"
              onClick={prevMonth}
              className="p-1 rounded-md hover:bg-white dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-bold px-3 text-slate-700 dark:text-slate-300 min-w-[120px] text-center">
              {monthNames[month]} {year}
            </span>
            <button
              id="calendar-next-btn"
              onClick={nextMonth}
              className="p-1 rounded-md hover:bg-white dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 transition"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Days of the week abbreviations */}
      <div className="grid grid-cols-7 gap-2 text-center font-bold text-xs text-slate-400 dark:text-slate-500 uppercase tracking-widest pb-3">
        {dayNames.map((d, index) => (
          <div key={index} className="py-1">{d}</div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-2 flex-grow min-h-[400px]">
        {days.map((day, cellIndex) => {
          // Find tasks due on this date
          const dayTasks = tasks.filter((t) => t.dueDate === day.dateStr);

          return (
            <div
              key={cellIndex}
              className={`min-h-[90px] border border-slate-100 dark:border-slate-900 rounded-xl p-2 transition-all flex flex-col justify-between ${
                day.dayNum 
                  ? 'bg-slate-50/45 dark:bg-slate-900/10 hover:bg-indigo-50/20 dark:hover:bg-indigo-950/5 cursor-pointer relative' 
                  : 'bg-transparent border-transparent opacity-0 select-none'
              }`}
              onClick={() => day.dateStr && dayTasks.length === 0 && onAddTaskWithDate(day.dateStr)}
            >
              {/* Day Number and Quick Add Button */}
              {day.dayNum && (
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center ${
                    day.dateStr === new Date().toISOString().split('T')[0]
                      ? 'bg-indigo-600 text-white font-black'
                      : 'text-slate-700 dark:text-slate-300'
                  }`}>
                    {day.dayNum}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddTaskWithDate(day.dateStr);
                    }}
                    className="p-0.5 opacity-0 hover:opacity-100 group-hover:opacity-100 hover:bg-slate-150 dark:hover:bg-slate-800 rounded transition absolute top-1 right-1 text-slate-400 hover:text-indigo-600"
                    title="Tambah Tugas untuk tanggal ini"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Tasks List in Cell */}
              {day.dayNum && (
                <div className="flex-grow overflow-y-auto space-y-1.5 max-h-[75px] scrollbar-thin">
                  {dayTasks.map((task) => (
                    <div
                      key={task.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditTask(task);
                      }}
                      className={`px-2 py-0.5 rounded text-[10px] font-medium truncate select-none shadow-sm ${getPriorityColor(task.priority)}`}
                      title={`${task.title} [${task.priority.toUpperCase()}] - Klik untuk Edit`}
                    >
                      {task.status === 'done' ? '✓ ' : ''}{task.title}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
