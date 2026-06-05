import React, { useState } from 'react';
import { DeveloperApiKey } from '../types';
import { Key, Plus, Terminal, RefreshCw, Layers, Radio, Play, Check, Trash2, HelpCircle } from 'lucide-react';

interface APIWorkspaceProps {
  apiKeys: DeveloperApiKey[];
  onGenerateKey: (name: string) => void;
  onRevokeKey: (keyId: string) => void;
  tasks: any[];
}

export function APIWorkspace({ apiKeys, onGenerateKey, onRevokeKey, tasks }: APIWorkspaceProps) {
  const [newKeyName, setNewKeyName] = useState("");
  const [selectedEndpoint, setSelectedEndpoint] = useState("GET /v1/tasks");
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [loadingPlayground, setLoadingPlayground] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState("https://api.perusahaan-saya.com/webhooks/petatugas");
  const [webhookLogs, setWebhookLogs] = useState<{ id: string; event: string; status: number; time: string }[]>([
    { id: "log-1", event: "task.created", status: 200, time: "2026-06-05 09:12:11" },
    { id: "log-2", event: "task.status_changed", status: 202, time: "2026-06-05 10:02:44" }
  ]);

  const handleGenerateKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName) return;
    onGenerateKey(newKeyName);
    setNewKeyName("");
  };

  // Run simulated API playground calls
  const handleTriggerPlayground = () => {
    setLoadingPlayground(true);
    setApiResponse(null);
    setTimeout(() => {
      if (selectedEndpoint === "GET /v1/tasks") {
        setApiResponse({
          status: "success",
          results: tasks.length,
          timestamp: new Date().toISOString(),
          data: tasks.slice(0, 2).map((t) => ({
            id: t.id,
            judul: t.isEncrypted ? "E2EE::TERKUNCI" : t.title,
            status_kanban: t.status,
            prioritas: t.priority,
            tenggat_waktu: t.dueDate || null,
            is_encrypted: t.isEncrypted
          }))
        });
      } else if (selectedEndpoint === "POST /v1/tasks") {
        setApiResponse({
          status: "created",
          message: "Tugas berhasil ditambahkan via API Pihak Ketiga!",
          data: {
            id: `task_api_${Math.floor(Math.random() * 10000)}`,
            title: "Tari Integrasi Otomatis CRM",
            description: "Dibuat otomatis dari REST API endpoint",
            status: "todo",
            priority: "medium",
            assigneeName: "Analis Sistem"
          }
        });
      } else {
        setApiResponse({
          status: "success",
          metrics: {
            total_pekerjaan: tasks.length,
            selesai: tasks.filter((t) => t.status === 'done').length,
            proses: tasks.filter((t) => t.status === 'inprogress').length,
            terlambat: tasks.filter((t) => t.status !== 'done' && t.dueDate && new Date(t.dueDate) < new Date()).length
          }
        });
      }
      setLoadingPlayground(false);
    }, 800);
  };

  return (
    <div id="api-integration-workspace" className="space-y-6">
      
      {/* Introduction Explainer */}
      <div className="p-5 bg-white dark:bg-slate-950 border border-slate-205 dark:border-slate-850 rounded-2xl flex flex-col md:flex-row gap-5 items-center justify-between shadow-sm">
        <div className="space-y-1">
          <h2 className="text-sm font-black text-slate-800 dark:text-slate-100 uppercase tracking-widest font-mono text-indigo-505 text-indigo-550 flex items-center gap-1.5">
            <Layers className="w-5 h-5 text-indigo-500" />
            Integrasi API Pihak Ketiga
          </h2>
          <h1 className="text-xl font-bold text-slate-800 dark:text-white leading-tight">Hubungkan Aplikasi dengan Sistem Eksternal</h1>
          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            Gunakan Kunci Token API dan Webhooks Developer kami untuk melakukan sinkronisasi otomatis jadwal pekerjaan Anda 
            dengan CRM (cth. Salesforce), ERP, Google Calendar eksternal, GitHub trigger, dsb.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* API Credentials Manager */}
        <div className="lg:col-span-6 p-5 bg-white dark:bg-slate-950 border border-slate-200/80 dark:border-slate-850 rounded-2xl shadow-sm space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <Key className="w-5 h-5 text-indigo-500" />
            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">Token Token Akses Pengembang</h3>
          </div>

          {/* Form to generate keys */}
          <form onSubmit={handleGenerateKey} className="flex gap-2.5">
            <input
              id="api-key-name-input"
              type="text"
              required
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              className="flex-1 px-3 py-1.8 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-250 focus:ring-2 focus:ring-indigo-500"
              placeholder="cth. Integrasi Server-CRM-2026"
            />
            <button
              id="generate-api-key-btn"
              type="submit"
              className="px-4 py-1.8 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition cursor-pointer shrink-0 flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              <span>Buat Token</span>
            </button>
          </form>

          {/* Map Keys list */}
          <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
            {apiKeys.length === 0 ? (
              <div className="text-center py-6 border border-dashed border-slate-200 dark:border-slate-900 rounded-xl">
                <p className="text-xs text-slate-400">Belum ada token pengembang aktif.</p>
              </div>
            ) : (
              apiKeys.map((item) => (
                <div key={item.id} className="p-3 border border-slate-150 dark:border-slate-850 rounded-xl bg-slate-50/50 dark:bg-slate-900/10 flex items-center justify-between text-xs">
                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-700 dark:text-slate-350">{item.name}</h4>
                    <code className="text-[10px] text-slate-400 font-mono bg-slate-100 dark:bg-slate-900 px-1.5 py-0.5 rounded">{item.key}</code>
                  </div>

                  <div className="flex items-center gap-2">
                    {item.status === 'active' ? (
                      <>
                        <span className="text-[9px] font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 px-1.5 py-0.5 rounded border border-emerald-250/10">Aktif</span>
                        <button
                          onClick={() => onRevokeKey(item.id)}
                          className="p-1 rounded hover:bg-rose-100 dark:hover:bg-rose-950/40 text-rose-500 hover:text-rose-600 transition"
                          title="Cabut Hak Akses Token"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </>
                    ) : (
                      <span className="text-[9px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-900 px-1.5 py-0.5 rounded">Dicabut</span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Webhooks configuration simulation */}
        <div className="lg:col-span-6 p-5 bg-white dark:bg-slate-950 border border-slate-200/80 dark:border-slate-850 rounded-2xl shadow-sm space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <Radio className="w-5 h-5 text-emerald-500" />
            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">Payload Webhook Otomatis</h3>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Target Endpoint URL</label>
              <input
                id="webhook-url-input"
                type="url"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                className="w-full px-3 py-1.8 text-xs rounded-xl border border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-250 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] text-slate-450 font-bold uppercase block">Log Terakhir Firing Webhook (Push Events)</label>
              <div className="border border-slate-150 dark:border-slate-900 rounded-xl overflow-hidden divide-y divide-slate-100 dark:divide-slate-900 text-[11px] font-mono">
                {webhookLogs.map((log) => (
                  <div key={log.id} className="p-2.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-900/40">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      <span className="font-bold text-slate-700 dark:text-slate-300">{log.event}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-slate-400">{log.time}</span>
                      <span className="px-1.5 py-0.5 rounded font-bold bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600">HTTP {log.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* API PLAYGROUND SANDBOX */}
      <div className="p-6 bg-slate-900 text-slate-100 border border-slate-800 rounded-2xl shadow-md space-y-4">
        <div className="flex items-center gap-2">
          <Terminal className="w-5 h-5 text-indigo-400 animate-pulse" />
          <div>
            <h3 className="font-bold text-sm">API Playground & Code Sandbox</h3>
            <p className="text-[11px] text-slate-400">Pilih REST API Endpoint, lalu kirim request pengujian untuk memverifikasi struktur respon JSON</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          {/* Controls column */}
          <div className="md:col-span-5 space-y-4">
            <div>
              <label className="text-[10px] text-indigo-400 uppercase font-bold block mb-1">Pilih Endpoint</label>
              <select
                id="api-endpoint-selector"
                value={selectedEndpoint}
                onChange={(e) => {
                  setSelectedEndpoint(e.target.value);
                  setApiResponse(null);
                }}
                className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-slate-800 bg-slate-950 text-slate-200 focus:ring-2 focus:ring-indigo-500"
              >
                <option value="GET /v1/tasks">GET /v1/tasks (Ambil Semua Daftar Pekerjaan)</option>
                <option value="POST /v1/tasks">POST /v1/tasks (Tambah Tugas OtomatisCRM)</option>
                <option value="GET /v1/analytics">GET /v1/analytics (Dapatkan Ringkasan Statistik)</option>
              </select>
            </div>

            {/* Simulated terminal Command preview */}
            <div className="p-3 bg-slate-950 border border-slate-850 rounded-xl space-y-1 font-mono text-[11px] text-indigo-300">
              <span className="text-[9px] text-slate-500 uppercase font-bold">Raw CURL CLI Command</span>
              <p className="break-all whitespace-pre-wrap">
                curl -X {selectedEndpoint.split(" ")[0]} "https://ais-api.perusahaan-saya.com{selectedEndpoint.split(" ")[1]}" \
                <br />  -H "Authorization: Bearer pet_api_live_•••••••"
              </p>
            </div>

            <button
              id="api-run-request-btn"
              onClick={handleTriggerPlayground}
              disabled={loadingPlayground}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition shadow-md flex items-center justify-center gap-2 shrink-0 cursor-pointer disabled:opacity-50"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{loadingPlayground ? "Mengirim Request..." : "Kirim Request (Testing)"}</span>
            </button>
          </div>

          {/* RESPONSE terminal Column */}
          <div className="md:col-span-7 flex flex-col justify-between">
            <div className="space-y-1.5 flex-1 flex flex-col">
              <span className="text-[10px] text-indigo-400 uppercase font-bold">JSON API Server Response</span>
              
              <div className="flex-1 min-h-[180px] p-4 bg-slate-950 border border-slate-800 rounded-xl font-mono text-[11px] text-slate-350 overflow-auto scrollbar-thin">
                {loadingPlayground ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-500 gap-2">
                    <RefreshCw className="w-5 h-5 animate-spin text-indigo-500" />
                    <span>Processing transaction payload...</span>
                  </div>
                ) : apiResponse ? (
                  <pre className="whitespace-pre-wrap">{JSON.stringify(apiResponse, null, 2)}</pre>
                ) : (
                  <div className="h-full flex items-center justify-center text-slate-600 text-center py-12">
                    <HelpCircle className="w-8 h-8 opacity-40 mb-2 block mx-auto text-slate-500" />
                    <span className="block mt-2">Belum ada request terkirim. Klik tombol Kirim Request untuk melihat hasil.</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
}
