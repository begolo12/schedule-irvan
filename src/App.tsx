import React, { useState, useEffect } from 'react';
import { KanbanBoard } from './components/KanbanBoard';
import { CalendarView } from './components/CalendarView';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { WeeklyReport } from './components/WeeklyReport';
import { SecurityE2EE } from './components/SecurityE2EE';
import { CollaborationSettings } from './components/CollaborationSettings';
import { APIWorkspace } from './components/APIWorkspace';
import { AICoach } from './components/AICoach';
import { GanttChart } from './components/GanttChart';
import { 
  Task, 
  Member, 
  UserRole, 
  RealtimeEvent, 
  WebNotification, 
  DeveloperApiKey, 
  SyncDevice, 
  TaskStatus, 
  TaskPriority 
} from './types';
import { 
  Trello, 
  Calendar as CalendarIcon, 
  BarChart3, 
  FileText, 
  Lock, 
  Users, 
  Terminal, 
  Brain, 
  Sun, 
  Moon, 
  Bell, 
  Smartphone, 
  Settings, 
  ToggleLeft, 
  Check, 
  Trash2, 
  AlertCircle,
  X,
  Plus,
  Wifi,
  Battery,
  ShieldCheck,
  Award,
  Activity
} from 'lucide-react';

export default function App() {
  // Theme State
  const [darkMode, setDarkMode] = useState<boolean>(true);

  // Active Screen Selector
  const [activeTab, setActiveTab] = useState<string>('kanban');

  // Emulator Mode State (Android / iOS design wrapper)
  const [isMobileEmulator, setIsMobileEmulator] = useState<boolean>(false);

  // Active Role and User Id state
  const [currentRole, setCurrentRole] = useState<UserRole>('admin');

  // Initial Seed Mock Members
  const [members, setMembers] = useState<Member[]>([
    { id: 'user-1', name: 'Begolo Solusi', email: 'begolo111@gmail.com', role: 'admin', avatarColor: '#6366f1' },
    { id: 'user-2', name: 'Aswin Ahmad', email: 'aswin.ahmad@perusahaan.com', role: 'manager', avatarColor: '#f59e0b' },
    { id: 'user-3', name: 'Siti Rahma', email: 'siti.rahma@perusahaan.com', role: 'member', avatarColor: '#10b981' },
    { id: 'user-4', name: 'Budi Hartono', email: 'budi.hartono@perusahaan.com', role: 'viewer', avatarColor: '#0ea5e9' }
  ]);

  // Initial Seed Mock Tasks
  const [tasks, setTasks] = useState<Task[]>([
    { 
      id: 'task-1', 
      title: 'Penyusunan Arsitektur Server Cloud ERP', 
      description: 'Menyusun database schema master ERP dan deployment kontainer Docker.', 
      status: 'done', 
      priority: 'high', 
      dueDate: '2026-06-02', 
      assigneeId: 'user-2', 
      assigneeName: 'Aswin Ahmad', 
      assigneeAvatarColor: '#f59e0b', 
      tags: ['Arsitektur', 'IT Core'], 
      isEncrypted: false,
      division: 'Divisi IT & Infrastruktur'
    },
    { 
      id: 'task-2', 
      title: 'Pembentukan Form Penawaran Penjualan', 
      description: 'Membuat modul input penawaran (quotation) dengan kalkulasi diskon bertingkat otomatis.', 
      status: 'inprogress', 
      priority: 'high', 
      dueDate: '2026-06-08', 
      assigneeId: 'user-1', 
      assigneeName: 'Begolo Solusi', 
      assigneeAvatarColor: '#6366f1', 
      tags: ['Sales', 'Operasi'], 
      isEncrypted: false,
      division: 'Divisi Operasi'
    },
    { 
      id: 'task-3', 
      title: 'Enkripsi Data Nilai Transaksi Sensitif (E2EE)', 
      description: 'Implementasikan Client-Side encryption (E2EE) untuk payload nominal penawaran khusus.', 
      status: 'todo', 
      priority: 'high', 
      dueDate: '2026-06-06', 
      assigneeId: 'user-1', 
      assigneeName: 'Begolo Solusi', 
      assigneeAvatarColor: '#6366f1', 
      tags: ['Keamanan', 'E2EE'], 
      isEncrypted: true,
      division: 'Divisi IT & Infrastruktur'
    },
    { 
      id: 'task-4', 
      title: 'Integrasi Scan Barcode Stok Gudang', 
      description: 'Menghubungkan device scanner fisik dengan basis data inventori lokasi rak gudang.', 
      status: 'todo', 
      priority: 'medium', 
      dueDate: '2026-06-10', 
      assigneeId: 'user-3', 
      assigneeName: 'Siti Rahma', 
      assigneeAvatarColor: '#10b981', 
      tags: ['Logistik', 'Stok'], 
      isEncrypted: false,
      division: 'Divisi Gudang & Logistik'
    },
    { 
      id: 'task-5', 
      title: 'Laporan Kartu Stok Otomatis', 
      description: 'Menyusun alur mutasi barang otomatis setiap terjadi pengiriman order dari sales.', 
      status: 'done', 
      priority: 'low', 
      dueDate: '2026-06-01', 
      assigneeId: 'user-4', 
      assigneeName: 'Budi Hartono', 
      assigneeAvatarColor: '#0ea5e9', 
      tags: ['Reporting', 'Gudang'], 
      isEncrypted: false,
      division: 'Divisi Gudang & Logistik'
    },
    { 
      id: 'task-6', 
      title: 'Penjurnalatan Otomatis Invoice Customer', 
      description: 'Pengembangan webhook trigger dari modul sales invoice ke jurnal debit/kredit keuangan.', 
      status: 'review', 
      priority: 'medium', 
      dueDate: '2026-06-05', 
      assigneeId: 'user-3', 
      assigneeName: 'Siti Rahma', 
      assigneeAvatarColor: '#10b981', 
      tags: ['Akuntansi', 'Komersial'], 
      isEncrypted: false,
      division: 'Divisi Keuangan & Finansial'
    },
    { 
      id: 'task-7', 
      title: 'Buku Besar & Neraca Keuangan Realtime', 
      description: 'Merangkum selisih akun neraca dan menampilkan grafik posisi kas perusahaan.', 
      status: 'todo', 
      priority: 'high', 
      dueDate: '2026-06-12', 
      assigneeId: 'user-2', 
      assigneeName: 'Aswin Ahmad', 
      assigneeAvatarColor: '#f59e0b', 
      tags: ['Finansial', 'Reporting'], 
      isEncrypted: false,
      division: 'Divisi Keuangan & Finansial'
    }
  ]);

  // Devices state used in synchronization tab
  const [syncDevices, setSyncDevices] = useState<SyncDevice[]>([
    { id: 'dev-1', name: 'Android Emulator Xiaomi', type: 'mobile', isOnline: true, lastSync: '10 menit yang lalu' },
    { id: 'dev-2', name: 'iPhone 15 Pro Max', type: 'mobile', isOnline: true, lastSync: 'Baru saja' },
    { id: 'dev-3', name: 'iPad Pro Tim Lapangan', type: 'tablet', isOnline: false, lastSync: '1 hari yang lalu' }
  ]);

  // Real-time synchronization log feeds
  const [realtimeEvents, setRealtimeEvents] = useState<RealtimeEvent[]>([
    { id: 'evt-1', userId: 'user-2', userName: 'Aswin Ahmad', action: 'menyelesaikan', taskTitle: 'Desain Sistem Arsitektur Database', timestamp: '10:02 AM' },
    { id: 'evt-2', userId: 'user-1', userName: 'Begolo Solusi', action: 'mengupdate status', taskTitle: 'Migrasi Layanan Cloud Run Container', timestamp: '10:14 AM' },
    { id: 'evt-3', userId: 'user-3', userName: 'Siti Rahma', action: 'mengirim tinjauan', taskTitle: 'Reviu Laporan Bulanan Stakeholder', timestamp: '10:28 AM' }
  ]);

  // Notifications center state
  const [notifications, setNotifications] = useState<WebNotification[]>([
    { id: 'not-1', title: 'Tenggat Tugas Dekat!', body: 'Tugas "Reviu Laporan Bulanan Stakeholder" berakhir hari ini.', timestamp: '10:30 AM', read: false, type: 'reminder' }
  ]);
  const [showNotificationCenter, setShowNotificationCenter] = useState<boolean>(false);

  // Developer API Keys State
  const [apiKeys, setApiKeys] = useState<DeveloperApiKey[]>([
    { id: 'api-1', name: 'Integrasi CRM Utama', key: 'pet_api_live_f89sdb87f8f9024c089ds7', createdAt: '2026-06-01', lastUsed: 'Baru saja', status: 'active' }
  ]);

  // Offline/Online State Controller
  const [isOffline, setIsOffline] = useState<boolean>(false);

  // Modal Control States
  const [showTaskModal, setShowTaskModal] = useState<boolean>(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  // Task Form fields state
  const [formTitle, setFormTitle] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formStatus, setFormStatus] = useState<TaskStatus>("todo");
  const [formPriority, setFormPriority] = useState<TaskPriority>("medium");
  const [formDueDate, setFormDueDate] = useState("2026-06-05");
  const [formAssigneeId, setFormAssigneeId] = useState("user-1");
  const [formTags, setFormTags] = useState("");
  const [formIsEncrypted, setFormIsEncrypted] = useState(false);
  const [formDivision, setFormDivision] = useState("Divisi Operasi");

  // Effect to toggle DOM HTML class for dark mode
  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [darkMode]);

  // Helper Web Audio API notification sound generator
  const triggerAudioPing = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      
      osc.type = "sine";
      // Arpeggio sound note (D5 to A5 to D6) - extremely energetic and pleasant
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); 
      osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.08); 
      osc.frequency.setValueAtTime(1174.66, audioCtx.currentTime + 0.16); 
      
      gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
      
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      
      osc.start();
      osc.stop(audioCtx.currentTime + 0.45);
    } catch (e) {
      console.log("Audio feedback blocked by browser policies.");
    }
  };

  // Add notification wrapper
  const triggerNotification = (title: string, body: string, type: 'reminder' | 'collaboration' | 'sync' | 'system' = 'system') => {
    const newNot: WebNotification = {
      id: `not-${Math.floor(Math.random() * 100000)}`,
      title,
      body,
      timestamp: 'Baru saja',
      read: false,
      type
    };
    setNotifications(prev => [newNot, ...prev]);
    triggerAudioPing();
  };

  // Background mock syncer simulation (simulates multi-tab / multiplayer updates real-time!)
  useEffect(() => {
    const timer = setInterval(() => {
      if (isOffline) return; // Skip sync if user turned on Offline mode!

      // 10% chance per interval of receiving a simulated coworker event
      if (Math.random() < 0.15) {
        const coworkers = [
          { name: 'Siti Rahma', action: 'menyunting', task: 'Uji Coba Integrasi API Layanan CRM' },
          { name: 'Aswin Ahmad', action: 'menambahkan deskripsi di', task: 'Migrasi Layanan Cloud Run Container' },
          { name: 'Budi Hartono', action: 'menandai selesai', task: 'Uji Coba Integrasi API Layanan CRM' }
        ];
        const selected = coworkers[Math.floor(Math.random() * coworkers.length)];
        
        const timestamp = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
        
        const newEvt: RealtimeEvent = {
          id: `evt-${Math.floor(Math.random() * 100000)}`,
          userId: 'user-3',
          userName: selected.name,
          action: selected.action,
          taskTitle: selected.task,
          timestamp
        };

        setRealtimeEvents(prev => [newEvt, ...prev].slice(0, 8));
        triggerNotification(
          `Aktivitas Baru dari ${selected.name}`,
          `Telah ${selected.action} tugas "${selected.task}"`,
          'collaboration'
        );
      }
    }, 15000); // Trigger every 15 seconds

    return () => clearInterval(timer);
  }, [isOffline]);

  // Handle open modal for creation
  const handleOpenAddTaskModal = (column: TaskStatus = 'todo', prefilledDate: string = "") => {
    if (currentRole === 'viewer') {
      alert("Role 'Viewer' tidak diizinkan membuat tugas baru.");
      return;
    }
    setTaskToEdit(null);
    setFormTitle("");
    setFormDesc("");
    setFormStatus(column);
    setFormPriority("medium");
    setFormDueDate(prefilledDate || new Date().toISOString().split('T')[0]);
    setFormAssigneeId("user-1");
    setFormTags("");
    setFormIsEncrypted(false);
    setFormDivision("Divisi Operasi");
    setShowTaskModal(true);
  };

  // Handle open modal for edit
  const handleOpenEditTaskModal = (task: Task) => {
    setTaskToEdit(task);
    setFormTitle(task.title);
    setFormDesc(task.description);
    setFormStatus(task.status);
    setFormPriority(task.priority);
    setFormDueDate(task.dueDate);
    setFormAssigneeId(task.assigneeId);
    setFormTags(task.tags.join(", "));
    setFormIsEncrypted(task.isEncrypted);
    setFormDivision(task.division || "Divisi Operasi");
    setShowTaskModal(true);
  };

  // Save or Update task handler
  const handleSaveTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle) return;

    const assignee = members.find(m => m.id === formAssigneeId) || members[0];
    const tagsArr = formTags ? formTags.split(",").map(t => t.trim()).filter(t => t) : [];

    if (taskToEdit) {
      // Edit task update
      setTasks(prev => prev.map(t => {
        if (t.id === taskToEdit.id) {
          return {
            ...t,
            title: formTitle,
            description: formDesc,
            status: formStatus,
            priority: formPriority,
            dueDate: formDueDate,
            assigneeId: formAssigneeId,
            assigneeName: assignee.name,
            assigneeAvatarColor: assignee.avatarColor,
            tags: tagsArr,
            isEncrypted: formIsEncrypted,
            division: formDivision
          };
        }
        return t;
      }));

      triggerNotification(
        "Tugas Diperbarui",
        `Tugas "${formTitle}" telah diperbarui dan disinkronisasikan ke multi-device.`,
        'sync'
      );
    } else {
      // Create new task
      const newTask: Task = {
        id: `task-${Math.floor(Math.random() * 1000000)}`,
        title: formTitle,
        description: formDesc,
        status: formStatus,
        priority: formPriority,
        dueDate: formDueDate,
        assigneeId: formAssigneeId,
        assigneeName: assignee.name,
        assigneeAvatarColor: assignee.avatarColor,
        tags: tagsArr,
        isEncrypted: formIsEncrypted,
        division: formDivision
      };
      setTasks(prev => [...prev, newTask]);

      triggerNotification(
        "Tugas Ditambahkan",
        `Tugas baru "${formTitle}" telah ditambahkan ke kolom ${formStatus.toUpperCase()}.`,
        'sync'
      );
    }

    setShowTaskModal(false);
  };

  // Status drag-drop/quick change trigger
  const handleUpdateTaskStatus = (taskId: string, newStatus: TaskStatus) => {
    if (currentRole === 'viewer') {
      alert("Role 'Viewer' tidak diizinkan mengubah status tugas.");
      return;
    }

    const taskToUpdate = tasks.find(t => t.id === taskId);
    if (!taskToUpdate) return;

    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return { ...t, status: newStatus };
      }
      return t;
    }));

    // Record Event log
    const timestamp = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    const currentMember = members.find(m => m.id === 'user-1')!;

    const newEvt: RealtimeEvent = {
      id: `evt-${Math.floor(Math.random() * 100000)}`,
      userId: 'user-1',
      userName: `${currentMember.name} (Anda)`,
      action: `memindahkan tugas ke status "${newStatus}"`,
      taskTitle: taskToUpdate.title,
      timestamp
    };
    setRealtimeEvents(prev => [newEvt, ...prev]);

    triggerNotification(
      "Status Tugas Diubah",
      `"${taskToUpdate.title}" dipindahkan ke kolom "${newStatus.toUpperCase()}"`,
      'sync'
    );
  };

  // Delete task action
  const handleDeleteTask = (taskId: string) => {
    if (currentRole === 'viewer') {
      alert("Viewer tidak memiliki izin untuk menghapus tugas.");
      return;
    }
    if (currentRole === 'member') {
      alert("Role 'Member' tidak memiliki hak menghapus data. Silakan hubungi Admin.");
      return;
    }

    const target = tasks.find(t => t.id === taskId);
    if (!target) return;

    setTasks(prev => prev.filter(t => t.id !== taskId));
    triggerNotification("Tugas Dihapus", `Tugas "${target.title}" telah dihapus secara permanen dari server.`, 'system');
  };

  // Toggle E2EE encryption status back and forth
  const handleToggleEncryption = (taskId: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const nextState = !t.isEncrypted;
        triggerNotification(
          nextState ? "Enkripsi Klien Aktif!" : "Tugas Didekripsi",
          nextState 
            ? `Tugas "${t.title}" telah diamankan client-side menggunakan Kunci AES.`
            : `Tugas "${t.title}" didekripsi kembali ke format plain-text.`,
          'system'
        );
        return { ...t, isEncrypted: nextState };
      }
      return t;
    }));
  };

  // Trigger manual cloud sync
  const handleTriggerManualSync = () => {
    if (isOffline) {
      alert("Gagal melakukan sinkronisasi: Perangkat sedang berada dalam Mode Offline.");
      return;
    }
    setSyncDevices(prev => prev.map(d => {
      if (d.isOnline) {
        return { ...d, lastSync: 'Baru saja diselaraskan' };
      }
      return d;
    }));
    triggerNotification("Sinkronisasi Berhasil", "Seluruh data Kanban telah disinkronisasikan ke server cloud utama.", 'sync');
  };

  // Adds a collaborative member
  const handleAddMember = (name: string, email: string, role: UserRole) => {
    const newMember: Member = {
      id: `user-${Math.floor(Math.random() * 100000)}`,
      name,
      email,
      role,
      avatarColor: ['#ec4899', '#f43f5e', '#3b82f6', '#10b981', '#8b5cf6', '#6366f1'][Math.floor(Math.random() * 6)]
    };
    setMembers(prev => [...prev, newMember]);
    triggerNotification("Kolaborator Baru", `${name} ditambahkan sebagai ${role.toUpperCase()}`, 'collaboration');
  };

  // Toggles device online state for sync test
  const handleToggleDeviceOnline = (deviceId: string) => {
    setSyncDevices(prev => prev.map(d => {
      if (d.id === deviceId) {
        const nextState = !d.isOnline;
        return { ...d, isOnline: nextState, lastSync: nextState ? 'Baru saja terhubung' : d.lastSync };
      }
      return d;
    }));
    const target = syncDevices.find(d => d.id === deviceId)!;
    triggerNotification(
      `Sambungan Device Berubah`,
      `${target.name} sekarang ${!target.isOnline ? "Online & Terhubung" : "Offline terputus"}`,
      'system'
    );
  };

  // Developer API Token Generator
  const handleGenerateApiKey = (name: string) => {
    const tokenPart = Math.floor(Math.random() * 100000000000000);
    const newKey: DeveloperApiKey = {
      id: `api-${Math.floor(Math.random() * 1000)}`,
      name,
      key: `pet_api_live_${btoa(String(tokenPart)).substring(0, 20)}`,
      createdAt: new Date().toISOString().split('T')[0],
      lastUsed: 'Belum pernah',
      status: 'active'
    };
    setApiKeys(prev => [...prev, newKey]);
    triggerNotification("API Token Dibuat", `Token "${name}" berhasil di-generate.`, 'system');
  };

  // Developer API Token Revocation
  const handleRevokeApiKey = (keyId: string) => {
    setApiKeys(prev => prev.map(k => {
      if (k.id === keyId) {
        return { ...k, status: 'revoked' };
      }
      return k;
    }));
    triggerNotification("API Token Dicabut", "Akses API pihak ketiga dibatalkan demi keamanan.", 'system');
  };

  const currentActiveUser = members[0];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-sans transition-colors duration-300">
      
      {/* GLOBAL BANNER MODE OFFLINE */}
      {isOffline && (
        <div className="bg-rose-600 text-white px-4 py-2 text-center text-xs font-bold leading-relaxed shrink-0 animate-pulse flex items-center justify-center gap-2 z-50">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>Anda sedang dalam Mode Offline. Seluruh perubahan tersimpan di database lokal browser.</span>
        </div>
      )}

      {/* TOP DECK HEADER BAR */}
      <nav id="app-navigation-bar" className="sticky top-0 bg-white/95 dark:bg-slate-950/95 backdrop-blur border-b border-slate-200 dark:border-slate-800/80 px-4 py-3 flex items-center justify-between z-40">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 bg-indigo-600 rounded-xl text-white shadow-md shadow-indigo-600/10">
            <Trello className="w-5.5 h-5.5 fill-current" />
          </div>
          <div>
            <h1 className="font-extrabold tracking-tight text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
              PetaTugas
              <span className="text-[10px] bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-bold px-1.5 py-0.2 rounded border border-indigo-250/20 font-mono uppercase tracking-widest leading-none">v1.2</span>
            </h1>
            <p className="text-[10px] text-slate-400 font-medium">Sistem Penjadwalan & Kolaborasi Instan</p>
          </div>
        </div>

        {/* Action controllers */}
        <div className="flex items-center gap-2">
          {/* Mock Mobile Emulator Toggle */}
          <button
            id="mobile-emulator-toggle"
            onClick={() => {
              setIsMobileEmulator(!isMobileEmulator);
              triggerAudioPing();
            }}
            className={`p-2 rounded-xl transition ${
              isMobileEmulator 
                ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400' 
                : 'hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-500 hover:text-slate-850'
            }`}
            title="Toggle Simulasi Tampilan Mobile (Android/iOS)"
          >
            <Smartphone className="w-5 h-5" />
          </button>

          {/* Network Connection Toggle */}
          <button
            id="network-connection-toggle"
            onClick={() => {
              setIsOffline(!isOffline);
              triggerNotification(
                isOffline ? "Terhubung Kembali" : "Mode Offline Aktif", 
                isOffline ? "Aplikasi kembali online. Memulai sinkronisasi payload..." : "Sambungan diputus. Bekerja dengan database lokal.",
                'system'
              );
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border cursor-pointer ${
              isOffline
                ? 'border-rose-200 dark:border-rose-950/40 bg-rose-50 dark:bg-rose-950/10 text-rose-600 dark:text-rose-400'
                : 'border-emerald-200 dark:border-emerald-950/40 bg-emerald-50 dark:bg-emerald-950/10 text-emerald-600 dark:text-emerald-400'
            }`}
            title="Uji coba Mode Offline"
          >
            <span className={`w-2 h-2 rounded-full ${isOffline ? 'bg-rose-500 animate-ping' : 'bg-emerald-500 animate-pulse'}`}></span>
            <span>{isOffline ? "Garis Offline" : "Tautan Online"}</span>
          </button>

          {/* Theme Mode Toggle */}
          <button
            id="theme-toggler"
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition"
          >
            {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* Notifications Trigger */}
          <div className="relative">
            <button
              id="notifications-popover-trigger"
              onClick={() => setShowNotificationCenter(!showNotificationCenter)}
              className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition relative"
            >
              <Bell className="w-5 h-5" />
              {notifications.some(n => !n.read) && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
              )}
            </button>
            
            {/* Popover list */}
            {showNotificationCenter && (
              <div className="absolute right-0 mt-2.5 w-80 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-2xl shadow-xl z-50 p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-900 pb-2">
                  <h3 className="font-bold text-xs text-slate-800 dark:text-slate-200">Alert & Notifikasi ({notifications.filter(n => !n.read).length})</h3>
                  <button 
                    onClick={() => {
                      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
                      setShowNotificationCenter(false);
                    }}
                    className="text-[10px] text-indigo-650 font-bold dark:text-indigo-400 hover:underline"
                  >
                    Tandai Semua Dibaca
                  </button>
                </div>
                
                <div className="space-y-2 max-h-[250px] overflow-y-auto pr-1 text-xs">
                  {notifications.length === 0 ? (
                    <p className="text-center text-slate-400 py-6">Bersih! Tidak ada riwayat notifikasi baru.</p>
                  ) : (
                    notifications.map(n => (
                      <div key={n.id} className={`p-2.5 rounded-xl border transition ${n.read ? 'border-slate-100 dark:border-slate-900 bg-slate-50/20 dark:bg-slate-950' : 'border-indigo-100 dark:border-indigo-950 bg-indigo-50/15 dark:bg-indigo-950/10'}`}>
                        <div className="flex items-center justify-between gap-1 mb-0.5">
                          <h4 className="font-bold text-slate-800 dark:text-slate-200 truncate">{n.title}</h4>
                          <span className="text-[9px] text-slate-400 font-mono">{n.timestamp}</span>
                        </div>
                        <p className="text-slate-550 text-slate-500 dark:text-slate-400 font-sans tracking-wide leading-relaxed text-[11px]">{n.body}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
          
          {/* User Profile Avatar with context placeholder */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-150 dark:border-slate-850">
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-xs text-white shadow shadow-indigo-600/10" title="Profil Akun Anda">
              BS
            </div>
            <div className="hidden lg:block text-left">
              <h4 className="text-xs font-bold leading-tight">Begolo Solusi</h4>
              <span className="text-[10px] text-slate-400 font-mono tracking-tight">{currentRole.toUpperCase()}</span>
            </div>
          </div>
        </div>
      </nav>

      {/* CORE FRAME LAYOUT */}
      <div className={`max-w-7xl mx-auto px-4 py-6 ${isMobileEmulator ? 'flex justify-center' : ''}`}>
        
        {/* MOBILE DEVICES SIMULATION WRAPPER */}
        <div className={`transition-all duration-300 ${
          isMobileEmulator 
            ? 'w-[375px] h-[780px] border-[10px] border-slate-800 dark:border-slate-950 rounded-[40px] overflow-hidden shadow-2xl relative bg-white dark:bg-slate-950 flex flex-col justify-between'
            : 'w-full'
        }`}>
          
          {/* MOBILE EMULATOR TOP STATUS BAR */}
          {isMobileEmulator && (
            <div className="bg-slate-100 dark:bg-slate-900 px-6 py-2.5 flex items-center justify-between text-[11px] font-mono text-slate-605 select-none shrink-0">
              <span className="font-bold">10:33 AM</span>
              <div className="w-18 bg-slate-200 dark:bg-slate-850 h-4.5 rounded-full mx-auto hidden sm:block"></div>
              <div className="flex items-center gap-1.5 font-bold">
                <Wifi className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-[9px]">4G</span>
                <Battery className="w-4 h-4 text-slate-600" />
              </div>
            </div>
          )}

          {/* CONTAINER SCROLLER FOR VIEWPORTS */}
          <div className={`flex-grow overflow-y-auto flex flex-col ${isMobileEmulator ? 'p-4' : ''}`}>
            
            {/* SIDE NAVIGATION AND CONTENT ROW GRID */}
            <div className={`flex-1 ${isMobileEmulator ? 'flex flex-col' : 'grid grid-cols-1 lg:grid-cols-12 gap-6'}`}>
              
              {/* SIDEBAR TABS CONTROLLERS */}
              <aside className={`lg:col-span-3 space-y-2 shrink-0 ${isMobileEmulator ? 'mb-4 overflow-x-auto flex gap-2 pb-2 space-y-0 scrollbar-none' : ''}`}>
                <div className={`mb-3 pb-2 border-b border-slate-150 dark:border-slate-850 text-xs font-bold text-slate-400 uppercase tracking-widest ${isMobileEmulator ? 'hidden' : 'block'}`}>
                  MENU DAN NAVIGASI
                </div>

                {/* Tabs button grid */}
                {[
                  { id: 'kanban', title: 'Papan Kanban Trello', icon: Trello },
                  { id: 'gantt', title: 'Diagram Gantt Jadwal', icon: Activity },
                  { id: 'calendar', title: 'Kalender Pekerjaan', icon: CalendarIcon },
                  { id: 'analytics', title: 'Analitik Dashboard', icon: BarChart3 },
                  { id: 'report', title: 'Laporan Mingguan PDF', icon: FileText },
                  { id: 'security', title: 'Keamanan Sandi E2EE', icon: Lock },
                  { id: 'collaboration', title: 'Kolaborasi & Peran', icon: Users },
                  { id: 'api', title: 'Workspace Integrasi API', icon: Terminal },
                  { id: 'coach', title: 'Pendamping AI Coach', icon: Brain },
                ].map(tab => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      id={`tab-navigate-${tab.id}`}
                      onClick={() => {
                        setActiveTab(tab.id);
                        triggerAudioPing();
                      }}
                      className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition shrink-0 cursor-pointer ${
                        isActive
                          ? 'bg-indigo-650 bg-indigo-600 text-white shadow shadow-indigo-600/10'
                          : 'hover:bg-slate-200/50 dark:hover:bg-slate-800/40 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                      }`}
                    >
                      <Icon className={`w-4.5 h-4.5 shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-800'}`} />
                      <span className={isMobileEmulator ? 'whitespace-nowrap' : 'block'}>{tab.title}</span>
                    </button>
                  );
                })}
              </aside>

              {/* MAIN CONTENT VIEWPORT ROW */}
              <main className={`lg:col-span-9 flex-grow ${isMobileEmulator ? 'h-full' : ''}`}>
                
                {activeTab === 'kanban' && (
                  <KanbanBoard
                    tasks={tasks}
                    members={members}
                    currentRole={currentRole}
                    currentUserId="user-1"
                    onAddTask={(column) => handleOpenAddTaskModal(column)}
                    onUpdateTaskStatus={handleUpdateTaskStatus}
                    onEditTask={handleOpenEditTaskModal}
                    onDeleteTask={handleDeleteTask}
                    isOffline={isOffline}
                    onToggleEncryption={handleToggleEncryption}
                  />
                )}

                {activeTab === 'gantt' && (
                  <GanttChart
                    tasks={tasks}
                    members={members}
                    onEditTask={handleOpenEditTaskModal}
                    onAddTask={(column, date) => handleOpenAddTaskModal(column, date)}
                    currentRole={currentRole}
                  />
                )}

                {activeTab === 'calendar' && (
                  <CalendarView
                    tasks={tasks}
                    onAddTaskWithDate={(dateStr) => handleOpenAddTaskModal('todo', dateStr)}
                    onEditTask={handleOpenEditTaskModal}
                  />
                )}

                {activeTab === 'analytics' && (
                  <AnalyticsDashboard
                    tasks={tasks}
                    members={members}
                  />
                )}

                {activeTab === 'report' && (
                  <WeeklyReport
                    tasks={tasks}
                    members={members}
                  />
                )}

                {activeTab === 'security' && (
                  <SecurityE2EE
                    tasks={tasks}
                  />
                )}

                {activeTab === 'collaboration' && (
                  <CollaborationSettings
                    members={members}
                    onAddMember={handleAddMember}
                    currentRole={currentRole}
                    onChangeRole={setCurrentRole}
                    syncDevices={syncDevices}
                    onToggleDeviceOnline={handleToggleDeviceOnline}
                    onTriggerManualSync={handleTriggerManualSync}
                    realtimeEvents={realtimeEvents}
                  />
                )}

                {activeTab === 'api' && (
                  <APIWorkspace
                    apiKeys={apiKeys}
                    onGenerateKey={handleGenerateApiKey}
                    onRevokeKey={handleRevokeApiKey}
                    tasks={tasks}
                  />
                )}

                {activeTab === 'coach' && (
                  <AICoach
                    tasks={tasks}
                    members={members}
                    userName="Begolo Solusi"
                  />
                )}
              </main>

            </div>
          </div>

          {/* EMULATOR BOTTOM BAR INDICATOR */}
          {isMobileEmulator && (
            <div className="bg-slate-100 dark:bg-slate-900 border-t border-slate-205 dark:border-slate-850 py-3.5 text-center shrink-0">
              <div className="w-28 bg-slate-300 dark:bg-slate-800 h-1.5 rounded-full mx-auto"></div>
            </div>
          )}

        </div>
      </div>

      {/* RENDER DYNAMIC MODAL FOR TASK ADD / EDIT */}
      {showTaskModal && (
        <div className="fixed inset-0 bg-slate-950/70 dark:bg-slate-950/85 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-2xl shadow-xl z-50 overflow-hidden flex flex-col justify-between max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-100 dark:border-slate-900 flex items-center justify-between bg-slate-50 dark:bg-slate-900/40">
              <div className="flex items-center gap-2">
                <Settings className="w-4.5 h-4.5 text-indigo-500 animate-spin" />
                <h3 className="font-extrabold text-sm text-slate-850 dark:text-white">
                  {taskToEdit ? "Sunting Detail Pekerjaan" : "Buat Pekerjaan Baru"}
                </h3>
              </div>
              <button
                onClick={() => setShowTaskModal(false)}
                className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 hover:text-rose-500 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body / Form Container */}
            <form onSubmit={handleSaveTask} className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
              
              {/* Task Title */}
              <div>
                <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Judul Tugas / Plan *</label>
                <input
                  id="task-title-input"
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-250 focus:ring-2 focus:ring-indigo-500 transition"
                  placeholder="cth. Perbaiki Bugs Sistem Otentikasi"
                />
              </div>

              {/* Task Description */}
              <div>
                <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Deskripsi Tambahan</label>
                <textarea
                  id="task-desc-input"
                  rows={2}
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-250 focus:ring-2 focus:ring-indigo-500 transition"
                  placeholder="Tambahkan detail target atau rincian checklist kerja..."
                />
              </div>

              {/* Division ERP (Head Grouping) */}
              <div>
                <label className="text-[10px] text-zinc-400 tracking-wider font-extrabold uppercase block mb-1">Grup Utama / Divisi (Head)</label>
                <select
                  id="task-division-select"
                  value={formDivision}
                  onChange={(e) => setFormDivision(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-250 font-bold focus:ring-2 focus:ring-indigo-500 text-indigo-650 dark:text-indigo-400"
                >
                  <option value="Divisi Operasi">Divisi Operasi (Operations & Workflows)</option>
                  <option value="Divisi Keuangan & Finansial">Divisi Keuangan & Finansial (Finance & Accounting)</option>
                  <option value="Divisi Gudang & Logistik">Divisi Gudang & Logistik (Inventory & Supply Chain)</option>
                  <option value="Divisi IT & Infrastruktur">Divisi IT & Infrastruktur (Core Engineering / Databases)</option>
                  <option value="Divisi Sales & Marketing">Divisi Sales & Marketing (CRM / Leads)</option>
                  <option value="Divisi Human Resources (HR)">Divisi Human Resources (HR)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Column placement status dropdown */}
                <div>
                  <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Kolom Papan Kanban</label>
                  <select
                    id="task-status-select"
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as TaskStatus)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-250 font-bold"
                  >
                    <option value="todo">To Do</option>
                    <option value="inprogress">In Progress</option>
                    <option value="review">Review</option>
                    <option value="done">Done</option>
                  </select>
                </div>

                {/* Priority Selection */}
                <div>
                  <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Tingkat Urgensi</label>
                  <select
                    id="task-priority-select"
                    value={formPriority}
                    onChange={(e) => setFormPriority(e.target.value as TaskPriority)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-250 font-bold text-indigo-500"
                  >
                    <option value="low">Rendah (Low)</option>
                    <option value="medium">Sedang (Medium)</option>
                    <option value="high">Tinggi (High / Urgent)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Due Date picker */}
                <div>
                  <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Tenggat Tanggal (Deadline)</label>
                  <input
                    id="task-duedate-input"
                    type="date"
                    required
                    value={formDueDate}
                    onChange={(e) => setFormDueDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-850 dark:text-slate-100 font-bold"
                  />
                </div>

                {/* Task Assignee selection */}
                <div>
                  <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Pihak Penanggung Jawab</label>
                  <select
                    id="task-assignee-select"
                    value={formAssigneeId}
                    onChange={(e) => setFormAssigneeId(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-250 font-semibold"
                  >
                    {members.map(m => (
                      <option key={m.id} value={m.id}>{m.name} ({m.role})</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Tags comma split */}
              <div>
                <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Tags Kategori (Pisahkan dengan Koma)</label>
                <input
                  id="task-tags-input"
                  type="text"
                  value={formTags}
                  onChange={(e) => setFormTags(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-250 focus:ring-2 focus:ring-indigo-500"
                  placeholder="cth. Keamanan, Database, Urgen"
                />
              </div>

              {/* E2EE client encryption toggle option */}
              <div className="p-3 bg-indigo-50/50 dark:bg-indigo-950/10 border border-indigo-150 dark:border-indigo-900/30 rounded-xl space-y-2 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-200 text-xs flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5 text-indigo-500" />
                    Enkripsi Klien-Sisi (End-to-End E2EE)
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">Gunakan kunci lokal unik untuk menyelubungi payload teks tugas ini.</p>
                </div>
                
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    id="task-e2ee-toggle"
                    type="checkbox"
                    checked={formIsEncrypted}
                    onChange={(e) => setFormIsEncrypted(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-300 dark:bg-slate-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
              </div>

              {/* Action trigger footer */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-900 flex justify-end gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowTaskModal(false)}
                  className="px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-500 text-xs font-bold rounded-xl transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  id="task-save-btn"
                  type="submit"
                  className="px-5 py-2 bg-indigo-650 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition shadow cursor-pointer"
                >
                  {taskToEdit ? "Perbarui Perubahan" : "Simpan Tugas"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* FOOTER BAR BRAND */}
      <footer className="py-8 bg-white dark:bg-slate-950 border-t border-slate-200/80 dark:border-slate-900/60 text-center font-sans">
        <p className="text-xs text-slate-400 dark:text-slate-500 flex items-center justify-center gap-1">
          <span>Dibuat dengan dedikasi tertinggi untuk Begolo Solusi. Keamanan & Sinkronisasi Terjamin.</span>
        </p>
      </footer>

    </div>
  );
}
