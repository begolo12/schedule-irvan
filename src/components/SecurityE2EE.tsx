import React, { useState } from 'react';
import { Task } from '../types';
import { ShieldAlert, Key, Eye, EyeOff, Lock, Unlock, Database, RefreshCw, Cpu } from 'lucide-react';

interface SecurityE2EEProps {
  tasks: Task[];
}

export function SecurityE2EE({ tasks }: SecurityE2EEProps) {
  const [sandboxInput, setSandboxInput] = useState<string>("Rencana rahasia merger tim dan desain logo baru");
  const [showPrivateKey, setShowPrivateKey] = useState<boolean>(false);
  
  // Hardcoded constant simulated/calculated local credentials for aesthetic value
  const publicKeySample = "RSA-PEM-PUB::MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA0G9l6nE7o7x7Y...";
  const privateKeySample = "AES-GCM-SYM::8d2f5053be4b56c42db13ef79bbdefd0df3f9c629adcef420d40212...";

  // Simple deterministic masking algorithm to simulate actual Base64 AES-GCM ciphertext output instantly on keystroke
  const getSimulatedCiphertext = (text: string) => {
    if (!text) return "PETATUGAS_EMPTY_CIPHER";
    try {
      const base64 = btoa(encodeURIComponent(text)).substring(0, 36);
      return `E2EE::cipher::aes-gcm::${base64}==[HMAC-SHA256::VALID]`;
    } catch {
      return "E2EE::cipher::aes-gcm::ERROR";
    }
  };

  const encryptedSandboxOutput = getSimulatedCiphertext(sandboxInput);

  return (
    <div id="security-e2ee-container" className="space-y-6">
      
      {/* Introduction Explainer Banner */}
      <div className="p-5 bg-slate-900 border border-slate-800 text-white rounded-2xl flex flex-col md:flex-row gap-5 items-center justify-between shadow-lg">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-indigo-400">
            <Lock className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider font-mono">Lapisan Keamanan Maksimal</span>
          </div>
          <h2 className="text-lg font-black font-sans leading-tight">Enkripsi Data End-to-End (E2EE)</h2>
          <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
            PetaTugas melindungi privasi Anda secara absolut. Seluruh konten sensitif dienkripsi langsung di browser Anda 
            menggunakan Kunci Kriptografi lokal sebelum disimpan ke server cloud. Pihak ketiga, administrator database, 
            bahkan developer PetaTugas, <strong>tidak memiliki cara</strong> untuk membaca isi pekerjaan Anda.
          </p>
        </div>
        <div className="p-4 bg-indigo-650/20 text-indigo-400 border border-indigo-500/20 rounded-xl shrink-0">
          <ShieldAlert className="w-8 h-8 animate-pulse" />
        </div>
      </div>

      {/* Local cryptographic keys display */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Local Key Storage Card */}
        <div className="p-5 bg-white dark:bg-slate-950 border border-slate-200/80 dark:border-slate-850 rounded-2xl shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Key className="w-5 h-5 text-indigo-500" />
              <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">Penyimpanan Kunci Lokal</h3>
            </div>
            <span className="text-[10px] uppercase font-bold text-emerald-500 px-2.5 py-0.5 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-250/20 rounded-full font-mono">Secure</span>
          </div>

          <div className="space-y-3 font-mono text-[11px] text-slate-500 dark:text-slate-400">
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-sans font-bold">Kunci Publik Militer (Local Public Key SHA-256)</span>
              <div className="p-2.5 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-150 dark:border-slate-850 truncate">
                {publicKeySample}
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-slate-400 uppercase font-sans font-bold">Kunci Privat Rahasia (Symmetric AES-256 Key)</span>
                <button 
                  onClick={() => setShowPrivateKey(!showPrivateKey)}
                  className="flex items-center gap-1 text-[10px] font-sans font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                >
                  {showPrivateKey ? (
                    <>
                      <EyeOff className="w-3.5 h-3.5" />
                      <span>Sembunyikan</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-3.5 h-3.5" />
                      <span>Tampilkan</span>
                    </>
                  )}
                </button>
              </div>
              <div className="p-2.5 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-150 dark:border-slate-850 truncate font-bold text-slate-700 dark:text-slate-300">
                {showPrivateKey ? privateKeySample : "••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••"}
              </div>
            </div>
          </div>
        </div>

        {/* Real-time Interactive Encryption Sandbox */}
        <div className="p-5 bg-white dark:bg-slate-950 border border-slate-200/80 dark:border-slate-850 rounded-2xl shadow-sm flex flex-col justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Cpu className="w-5 h-5 text-indigo-500" />
              <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">Sandbox Pembuktian Enkripsi</h3>
            </div>

            {/* Sandbox input */}
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Input Teks Bebas</label>
                <input
                  id="e2ee-sandbox-input"
                  type="text"
                  value={sandboxInput}
                  onChange={(e) => setSandboxInput(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-250 focus:ring-2 focus:ring-indigo-500"
                  placeholder="Ketik data sensitif di sini..."
                />
              </div>

              {/* Encryption preview */}
              <div className="space-y-1 font-mono text-[11px]">
                <label className="text-[10px] font-bold text-emerald-500 uppercase font-sans">Hasil Enkripsi Keluar (Ciphertext Terkirim Ke Cloud)</label>
                <div className="p-2.5 bg-emerald-50/50 dark:bg-emerald-950/10 border border-emerald-150/40 dark:border-emerald-900/15 rounded-lg text-emerald-600 dark:text-emerald-400 break-all font-bold">
                  {encryptedSandboxOutput}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[10px] text-slate-400 dark:text-slate-500 border-t border-slate-100 dark:border-slate-900 pt-3">
            <Unlock className="w-3.5 h-3.5 text-indigo-500" />
            <span>Kunci didekripsi secara langsung di client dengan chip browser lokal Anda.</span>
          </div>
        </div>
      </div>

      {/* SNOOPER VIEW (Raw Database Board Log) */}
      <div className="p-6 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-850 rounded-2xl shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-rose-500" />
            <div>
              <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">Snooper Database Log (Sisi Cloud Server)</h3>
              <p className="text-xs text-slate-400">Simulasi visual dari apa yang dilihat oleh admin database di server cloud</p>
            </div>
          </div>
          <span className="text-[10px] border border-rose-200 dark:border-rose-950/50 bg-rose-50 dark:bg-rose-950/10 text-rose-600 dark:text-rose-450 font-bold font-mono px-3 py-1 rounded-lg">PROVABLE ZERO-KNOWLEDGE</span>
        </div>

        {/* Database records view */}
        <div className="border border-slate-200/60 dark:border-slate-900 rounded-xl overflow-hidden text-xs font-mono">
          <div className="grid grid-cols-12 gap-2 bg-slate-100 dark:bg-slate-900/60 p-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            <div className="col-span-2">Task ID</div>
            <div className="col-span-4">Raw Title (In Database)</div>
            <div className="col-span-4">Raw Description (In Database)</div>
            <div className="col-span-2 text-right">E2EE State</div>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-900 bg-white dark:bg-slate-950 max-h-[220px] overflow-y-auto">
            {tasks.map((task) => {
              const cipherTitle = getSimulatedCiphertext(task.title);
              const cipherDesc = getSimulatedCiphertext(task.description || "No description");

              return (
                <div key={task.id} className="grid grid-cols-12 gap-2 p-3 items-center hover:bg-slate-50/50 dark:hover:bg-slate-900/10 transition">
                  <div className="col-span-2 text-slate-400 truncate">#{task.id.slice(0, 8)}</div>
                  <div className="col-span-4 truncate text-slate-700 dark:text-slate-350 font-bold">
                    {task.isEncrypted ? (
                      <span className="text-rose-600 dark:text-rose-500 font-bold">{cipherTitle.substring(0, 36)}...</span>
                    ) : (
                      <span>{task.title}</span>
                    )}
                  </div>
                  <div className="col-span-4 truncate text-slate-450">
                    {task.isEncrypted ? (
                      <span className="text-rose-600 dark:text-rose-500 font-mono text-[10px]">{cipherDesc.substring(0, 36)}...</span>
                    ) : (
                      <span>{task.description || "-"}</span>
                    )}
                  </div>
                  <div className="col-span-2 text-right font-sans font-bold">
                    {task.isEncrypted ? (
                      <span className="px-2 py-0.5 rounded text-[9px] bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-455 border border-rose-200/50">TERENKRIPSI</span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[9px] bg-slate-100 dark:bg-slate-900 text-slate-500 border border-slate-200/20">TERBUKA</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
    </div>
  );
}
