import React, { useState } from 'react';
import { Task, TaskStatus, TaskPriority, Member, UserRole } from '../types';
import { 
  Plus, 
  Clock, 
  AlertCircle, 
  ShieldCheck, 
  Shield, 
  User, 
  Edit3, 
  Trash2, 
  Check,
  Tag,
  Lock,
  LockKeyhole
} from 'lucide-react';

interface KanbanBoardProps {
  tasks: Task[];
  members: Member[];
  currentRole: UserRole;
  currentUserId: string;
  onAddTask: (column: TaskStatus) => void;
  onUpdateTaskStatus: (taskId: string, newStatus: TaskStatus) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  isOffline: boolean;
  onToggleEncryption: (taskId: string) => void;
}

export function KanbanBoard({
  tasks,
  members,
  currentRole,
  currentUserId,
  onAddTask,
  onUpdateTaskStatus,
  onEditTask,
  onDeleteTask,
  isOffline,
  onToggleEncryption
}: KanbanBoardProps) {
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [activeOverColumn, setActiveOverColumn] = useState<TaskStatus | null>(null);

  const columns: { id: TaskStatus; title: string; color: string; bg: string }[] = [
    { id: 'todo', title: 'To Do', color: 'bg-indigo-500 border-indigo-600', bg: 'bg-slate-50 dark:bg-slate-900/40' },
    { id: 'inprogress', title: 'Sedang Dikerjakan', color: 'bg-amber-500 border-amber-600', bg: 'bg-slate-50 dark:bg-slate-900/40' },
    { id: 'review', title: 'Dalam Tinjauan', color: 'bg-sky-500 border-sky-600', bg: 'bg-slate-50 dark:bg-slate-900/40' },
    { id: 'done', title: 'Selesai', color: 'bg-emerald-500 border-emerald-600', bg: 'bg-slate-50 dark:bg-slate-900/40' },
  ];

  const canModify = currentRole !== 'viewer';

  // HTML5 Drag-and-Drop Handlers
  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    if (!canModify) {
      e.preventDefault();
      alert("Role 'Viewer' tidak memiliki izin untuk memindahkan tugas.");
      return;
    }
    setDraggedTaskId(taskId);
    e.dataTransfer.setData('text/plain', taskId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, colId: TaskStatus) => {
    e.preventDefault();
    if (activeOverColumn !== colId) {
      setActiveOverColumn(colId);
    }
  };

  const handleDragLeave = () => {
    setActiveOverColumn(null);
  };

  const handleDrop = (e: React.DragEvent, newStatus: TaskStatus) => {
    e.preventDefault();
    setActiveOverColumn(null);
    const taskId = e.dataTransfer.getData('text/plain') || draggedTaskId;
    if (taskId) {
      onUpdateTaskStatus(taskId, newStatus);
    }
    setDraggedTaskId(null);
  };

  // Helper for priority badges
  const getPriorityBadge = (priority: TaskPriority) => {
    switch (priority) {
      case 'high':
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/20 uppercase tracking-wide">Tinggi</span>;
      case 'medium':
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-900/20 uppercase tracking-wide">Sedang</span>;
      case 'low':
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700/50 uppercase tracking-wide">Rendah</span>;
    }
  };

  // Check if a task is overdue
  const isOverdue = (dueDate: string, status: TaskStatus) => {
    if (status === 'done' || !dueDate) return false;
    const now = new Date();
    now.setHours(0,0,0,0);
    const due = new Date(dueDate);
    due.setHours(0,0,0,0);
    return due < now;
  };

  return (
    <div id="trello-board-container" className="flex flex-col h-full">
      {/* Role Notice */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-3 mb-4 rounded-xl border border-indigo-100 dark:border-indigo-950/40 bg-indigo-50/50 dark:bg-indigo-950/10 text-xs text-indigo-700 dark:text-indigo-300">
        <div className="flex items-center gap-2">
          {canModify ? (
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
          ) : (
            <Shield className="w-4 h-4 text-rose-500 shrink-0" />
          )}
          <span>
            Mode Izin: Anda bertindak sebagai <strong>{currentRole.toUpperCase()}</strong>.
            {!canModify && " (Anda hanya dapat melihat papan tugas tanpa mengubah data.)"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>{isOffline ? "Mode Offline Bekerja (Tersimpan Lokal)" : "Sinkronisasi Real-time Aktif"}</span>
        </div>
      </div>

      {/* Kanban Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 items-start h-full overflow-y-auto">
        {columns.map((col) => {
          const colTasks = tasks.filter((t) => t.status === col.id);
          const isOver = activeOverColumn === col.id;

          return (
            <div
              key={col.id}
              id={`col-${col.id}`}
              className={`flex flex-col rounded-2xl border border-slate-200/80 dark:border-slate-800/80 ${col.bg} p-4 max-h-[75vh] transition-all duration-300 ${
                isOver ? 'ring-2 ring-indigo-500 dark:ring-indigo-400 scale-[1.01] bg-slate-100/50 dark:bg-slate-900/65' : ''
              }`}
              onDragOver={(e) => handleDragOver(e, col.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, col.id)}
            >
              {/* Card Header */}
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-200/60 dark:border-slate-800/60">
                <div className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${col.color.split(" ")[0]} border ${col.color.split(" ")[1]}`}></span>
                  <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-100 uppercase tracking-wide">{col.title}</h3>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium">
                    {colTasks.length}
                  </span>
                </div>
                {canModify && (
                  <button
                    id={`btn-add-${col.id}`}
                    onClick={() => onAddTask(col.id)}
                    className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                    title="Tambah Tugas ke kolom ini"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Tasks List Container */}
              <div className="flex-1 overflow-y-auto min-h-[150px] space-y-3 pr-1">
                {colTasks.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                    <p className="text-xs text-slate-400 dark:text-slate-500">Belum ada tugas.</p>
                  </div>
                ) : (
                  colTasks.map((task) => {
                    const taskOverdue = isOverdue(task.dueDate, task.status);
                    return (
                      <div
                        key={task.id}
                        id={`task-card-${task.id}`}
                        draggable={canModify}
                        onDragStart={(e) => handleDragStart(e, task.id)}
                        className={`group relative p-4 rounded-xl bg-white dark:bg-slate-950 border border-slate-200/70 dark:border-slate-800 hover:border-slate-300 dark:hover:border-indigo-650 transition-all duration-200 shadow-sm hover:shadow-md cursor-grab active:cursor-grabbing ${
                          draggedTaskId === task.id ? 'opacity-30' : ''
                        }`}
                      >
                        {/* Tags and Badges */}
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <div className="flex flex-wrap gap-1">
                            {getPriorityBadge(task.priority)}
                            {task.isEncrypted && (
                              <span 
                                className="flex items-center gap-0.5 px-1.5 py-0.5 text-[9px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/50 dark:border-emerald-900/35 rounded"
                                title="Data terenkripsi penuh client-side (E2EE)"
                              >
                                <LockKeyhole className="w-2.5 h-2.5" />
                                E2EE
                              </span>
                            )}
                          </div>
                          
                          {/* Quick Edit controls */}
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition duration-150 absolute top-3 right-3 bg-white dark:bg-slate-950 pl-2 rounded-lg">
                            <button
                              id={`edit-task-btn-${task.id}`}
                              onClick={() => onEditTask(task)}
                              className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                              title="Edit Detail"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            {canModify && (
                              <button
                                id={`delete-task-btn-${task.id}`}
                                onClick={() => onDeleteTask(task.id)}
                                className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-rose-500 transition"
                                title="Hapus Tugas"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Division Head Header */}
                        {task.division && (
                          <div className="text-[10px] font-black text-indigo-500 dark:text-indigo-400 uppercase tracking-widest font-mono mb-1.5 flex items-center gap-1 bg-indigo-50/40 dark:bg-indigo-950/20 px-2 py-1 rounded-md w-max border border-indigo-100/50 dark:border-indigo-950/30">
                            <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse"></span>
                            <span>{task.division}</span>
                          </div>
                        )}

                        {/* Task Title */}
                        <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm mb-1.5 leading-snug pr-8 break-words">
                          {task.title}
                        </h4>

                        {/* Task Description */}
                        {task.description && (
                          <p className="text-slate-400 dark:text-slate-500 text-xs mb-3 line-clamp-2 leading-relaxed break-words">
                            {task.description}
                          </p>
                        )}

                        {/* Extra tags list */}
                        {task.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mb-3">
                            {task.tags.map((tag, tagIdx) => (
                              <span key={tagIdx} className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400">
                                <Tag className="w-2.5 h-2.5 text-slate-400" />
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Task Footer Info */}
                        <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-900 pt-2.5 mt-2.5 text-[11px] text-slate-400 dark:text-slate-500">
                          {/* Due Date Indicator */}
                          {task.dueDate ? (
                            <div className={`flex items-center gap-1 font-medium ${
                              taskOverdue 
                                ? 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/20 px-1.5 py-0.5 rounded' 
                                : 'text-slate-500 dark:text-slate-400'
                            }`}>
                              {taskOverdue ? <AlertCircle className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                              <span>{task.dueDate}</span>
                            </div>
                          ) : (
                            <div className="text-slate-350 dark:text-slate-600">No deadline</div>
                          )}

                          {/* Assignee initials bubble */}
                          <div 
                            className={`flex items-center justify-center w-5.5 h-5.5 rounded-full border border-white dark:border-slate-950 text-[10px] font-bold text-white shadow-sm`}
                            style={{ backgroundColor: task.assigneeAvatarColor || '#6366f1' }}
                            title={`Ditugaskan ke: ${task.assigneeName}`}
                          >
                            {task.assigneeName ? task.assigneeName.split(" ").map(n => n[0]).join("").substring(0,2).toUpperCase() : <User className="w-3 h-3" />}
                          </div>
                        </div>

                        {/* E2EE status button */}
                        <div className="absolute top-2 right-2 flex items-center">
                          {task.isEncrypted && (
                            <button
                              onClick={() => onToggleEncryption(task.id)}
                              className="p-1 rounded text-emerald-600 dark:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                              title="Tugas Terenkripsi. Klik untuk mendekripsi kembali"
                            >
                              <Lock className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
