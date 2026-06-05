import React, { useState, useEffect } from 'react';
import { Member, UserRole, RealtimeEvent, SyncDevice } from '../types';
import { Users, UserPlus, ShieldAlert, Monitor, Smartphone, Tablet, RefreshCw, Send, CheckCircle } from 'lucide-react';

interface CollaborationSettingsProps {
  members: Member[];
  onAddMember: (name: string, email: string, role: UserRole) => void;
  currentRole: UserRole;
  onChangeRole: (role: UserRole) => void;
  syncDevices: SyncDevice[];
  onToggleDeviceOnline: (deviceId: string) => void;
  onTriggerManualSync: () => void;
  realtimeEvents: RealtimeEvent[];
}

export function CollaborationSettings({
  members,
  onAddMember,
  currentRole,
  onChangeRole,
  syncDevices,
  onToggleDeviceOnline,
  onTriggerManualSync,
  realtimeEvents
}: CollaborationSettingsProps) {
  const [newMemberName, setNewMemberName] = useState("");
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [newMemberRole, setNewMemberRole] = useState<UserRole>("member");
  const [syncing, setSyncing] = useState(false);

  const handleCreateMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName || !newMemberEmail) return;
    onAddMember(newMemberName, newMemberEmail, newMemberRole);
    setNewMemberName("");
    setNewMemberEmail("");
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return <span className="px-2 py-0.5 text-[9px] font-bold rounded-full bg-indigo-100 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-451 uppercase">Admin</span>;
      case 'manager':
        return <span className="px-2 py-0.5 text-[9px] font-bold rounded-full bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-451 uppercase">Manager</span>;
      case 'member':
        return <span className="px-2 py-0.5 text-[9px] font-bold rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-451 uppercase">Member</span>;
      case 'viewer':
        return <span className="px-2 py-0.5 text-[9px] font-bold rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 uppercase">Viewer</span>;
    }
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'desktop': return <Monitor className="w-5 h-5" />;
      case 'mobile': return <Smartphone className="w-5 h-5" />;
      default: return <Tablet className="w-5 h-5" />;
    }
  };

  const handleSyncClick = () => {
    setSyncing(true);
    setTimeout(() => {
      onTriggerManualSync();
      setSyncing(false);
    }, 1200);
  };

  return (
    <div id="collab-and-sync-settings" className="space-y-6">
      
      {/* Top section: Interactive Role switcher */}
      <div className="p-6 bg-white dark:bg-slate-950 border border-slate-200/80 dark:border-slate-850 rounded-2xl shadow-sm">
        <h3 className="font-bold text-slate-850 dark:text-slate-100 text-sm mb-2 flex items-center gap-1.5">
          <ShieldAlert className="w-4.5 h-4.5 text-indigo-505 text-indigo-500" />
          Uji Izin Peran (Role-Based Access Control)
        </h3>
        <p className="text-xs text-slate-400 mb-4">
          Ubah peran bertindak Anda di bawah untuk menguji perilaku pembatasan keamanan secara langsung pada papan Kanban.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-slate-50/50 dark:bg-slate-905 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-850">
          <div className="w-full sm:w-1/3">
            <label className="text-[10px] font-bold text-slate-450 uppercase mb-1 block">Silakan Pilih Peran Anda</label>
            <select
              id="role-switcher-select"
              value={currentRole}
              onChange={(e) => onChangeRole(e.target.value as UserRole)}
              className="w-full px-3 py-2 text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-250 focus:ring-2 focus:ring-indigo-500"
            >
              <option value="admin">ADMIN (Sunting Bebas + Hapus + Tambah)</option>
              <option value="manager">MANAGER (Sunting + Tambah, Tanpa Izin Hapus)</option>
              <option value="member">MEMBER (Anggota Pelaksana Tugas)</option>
              <option value="viewer">VIEWER (Read-Only, Papan Terkunci Penuh)</option>
            </select>
          </div>

          <div className="text-xs text-slate-450 space-y-1 sm:w-2/3">
            <p>• <strong>ADMIN</strong>: Memiliki kontrol penuh, berhak menghapus tugas dari papan utama.</p>
            <p>• <strong>VIEWER</strong>: Mode tontonan murni. Drag-and-drop dinonaktifkan, tombol tambah & hapus dihilangkan.</p>
          </div>
        </div>
      </div>

      {/* Synchronized devices & Real-time sync tracker */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Device Sync List */}
        <div className="p-5 bg-white dark:bg-slate-950 border border-slate-200/80 dark:border-slate-850 rounded-2xl shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm flex items-center gap-1.5">
              <RefreshCw className="w-4.5 h-4.5 text-indigo-500" />
              Sikronisasi Multi Perangkat
            </h3>
            <button
              id="manual-sync-trigger"
              onClick={handleSyncClick}
              disabled={syncing}
              className="flex items-center gap-1 text-[10px] uppercase font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
              <span>{syncing ? "Sinkronisasi..." : "Sinkronisasi Manual"}</span>
            </button>
          </div>

          <p className="text-xs text-slate-400">Hubungkan device seluler Android & iOS untuk mensinkronisasikan tugas secara mulus.</p>

          <div className="space-y-2.5">
            {syncDevices.map((device) => (
              <div key={device.id} className="flex items-center justify-between p-3 border border-slate-150 dark:border-slate-850 rounded-xl bg-slate-50/50 dark:bg-slate-900/10">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${device.isOnline ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600' : 'bg-slate-100 dark:bg-slate-900 text-slate-400'}`}>
                    {getDeviceIcon(device.type)}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">{device.name}</h4>
                    <span className="text-[10px] text-slate-400">Sync terakhir: {device.lastSync}</span>
                  </div>
                </div>

                {/* Device Status toggle */}
                <button
                  onClick={() => onToggleDeviceOnline(device.id)}
                  className={`px-3 py-1 text-[10px] font-bold rounded-lg border transition cursor-pointer ${
                    device.isOnline
                      ? 'border-indigo-200 dark:border-indigo-900/30 bg-indigo-50/45 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400'
                      : 'border-slate-205 dark:border-slate-800 bg-slate-102 dark:bg-slate-900 text-slate-501 dark:text-slate-500 bg-slate-100'
                  }`}
                >
                  {device.isOnline ? "Online (Hubungan Aktif)" : "Offline (Terputus)"}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Live Collaboration Feeds */}
        <div className="p-5 bg-white dark:bg-slate-950 border border-slate-200/80 dark:border-slate-850 rounded-2xl shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm flex items-center gap-1.5 mb-2">
              <Send className="w-4.5 h-4.5 text-emerald-500" />
              Notifikasi Akivitas Kolaborasi
            </h3>
            <p className="text-xs text-slate-400 mb-4">Aktivitas real-time rekan kerja demi mempercepat penyelesaian target papan proyek bersama.</p>

            {/* Events scroller */}
            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
              {realtimeEvents.map((evt) => (
                <div key={evt.id} className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-850 flex gap-2 text-xs">
                  <div className="w-5.5 h-5.5 rounded-full bg-indigo-500 flex items-center justify-center font-bold text-[10px] text-white shrink-0">
                    {evt.userName.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-slate-650 text-slate-600 dark:text-slate-450">
                      <strong>{evt.userName}</strong> {evt.action} <span className="font-bold text-indigo-600 dark:text-indigo-400">"{evt.taskTitle}"</span>
                    </p>
                    <time className="text-[10px] text-slate-400 font-mono block">{evt.timestamp}</time>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-4 border-t border-slate-100 dark:border-slate-900 pt-3">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
            <span>Riwayat di atas disinkronisasi setiap kali ada perubahan pada board utama.</span>
          </div>
        </div>
      </div>

      {/* Members list management section */}
      <div className="p-6 bg-white dark:bg-slate-950 border border-slate-200/80 dark:border-slate-850 rounded-2xl shadow-sm space-y-4">
        <h3 className="font-bold text-slate-850 dark:text-slate-100 text-sm flex items-center gap-1.5">
          <Users className="w-4.5 h-4.5 text-indigo-500" />
          Manajemen Anggota Tim ({members.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Members form */}
          <form onSubmit={handleCreateMember} className="col-span-12 md:col-span-5 p-4 bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-850 rounded-xl space-y-3.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <UserPlus className="w-4.5 h-4.5 text-slate-500" />
              Tambah Tim Baru
            </h4>

            <div>
              <label className="text-[10px] text-slate-400 font-bold uppercase">Nama Lengkap</label>
              <input
                id="member-name-input"
                type="text"
                required
                value={newMemberName}
                onChange={(e) => setNewMemberName(e.target.value)}
                className="w-full px-3 py-1.8 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-250 focus:ring-2 focus:ring-indigo-500 transition"
                placeholder="cth. Begolo Solusi"
              />
            </div>

            <div>
              <label className="text-[10px] text-slate-400 font-bold uppercase">Email Keanggotaan</label>
              <input
                id="member-email-input"
                type="email"
                required
                value={newMemberEmail}
                onChange={(e) => setNewMemberEmail(e.target.value)}
                className="w-full px-3 py-1.8 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-250 focus:ring-2 focus:ring-indigo-550 transition"
                placeholder="cth. begolo111@gmail.com"
              />
            </div>

            <div>
              <label className="text-[10px] text-slate-400 font-bold uppercase">Peran Hak Akses (RBAC)</label>
              <select
                id="member-role-select"
                value={newMemberRole}
                onChange={(e) => setNewMemberRole(e.target.value as UserRole)}
                className="w-full px-3 py-1.8 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-250 focus:ring-2 focus:ring-indigo-500 transition"
              >
                <option value="admin">ADMIN (Kontrol Penuh)</option>
                <option value="manager">MANAGER (Tambah & Edit Pekerjaan)</option>
                <option value="member">MEMBER (Dapat Update Status Kerja)</option>
                <option value="viewer">VIEWER (Read Only)</option>
              </select>
            </div>

            <button
              id="member-submit-btn"
              type="submit"
              className="w-full py-2 bg-indigo-650 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition shadow cursor-pointer"
            >
              Undang & Gabungkan Tim
            </button>
          </form>

          {/* Members Table */}
          <div className="col-span-12 md:col-span-7 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-450 text-slate-400 mb-2">Anggota Aktif yang Tergabung</h4>

            <div className="border border-slate-150 dark:border-slate-900 rounded-xl overflow-hidden divide-y divide-slate-100 dark:divide-slate-900 text-xs">
              {members.map((member) => (
                <div key={member.id} className="p-3 flex items-center justify-between hover:bg-slate-50/60 dark:hover:bg-slate-900/10 transition bg-white dark:bg-slate-950">
                  <div className="flex items-center gap-2.5">
                    <div 
                      className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs text-white"
                      style={{ backgroundColor: member.avatarColor || '#6366f1' }}
                    >
                      {member.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 dark:text-slate-200">{member.name} {member.id === 'user-1' ? "(Anda)" : ""}</h4>
                      <span className="text-[10px] text-slate-400 font-mono">{member.email}</span>
                    </div>
                  </div>

                  <div>{getRoleBadge(member.role)}</div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
      
    </div>
  );
}
