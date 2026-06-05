import React, { useState } from 'react';
import { Task, Member } from '../types';
import { Sparkles, BrainCircuit, AlertCircle, CalendarRange, ListChecks, HelpCircle } from 'lucide-react';

interface AICoachProps {
  tasks: Task[];
  members: Member[];
  userName: string;
}

export function AICoach({ tasks, members, userName }: AICoachProps) {
  const [analysisType, setAnalysisType] = useState<string>("weekly_productivity");
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Simulated inspirational loading states while Gemini parses the task list backend-side
  const loadingMessages = [
    "Membaca daftar rincian papan Kanban...",
    "Menganalisis kemajuan tugas dan tingkat keterisian...",
    "Mengevaluasi beban kerja merata bagi tim...",
    "Merumuskan strategi optimalisasi performa kerja minggu depan...",
    "Menyusun laporan AI Coach eksklusif untuk Anda..."
  ];
  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0);

  // Rotation effect for loading prompts
  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading) {
      interval = setInterval(() => {
        setLoadingMsgIdx((prev) => (prev + 1) % loadingMessages.length);
      }, 1600);
    } else {
      setLoadingMsgIdx(0);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleFetchCoachAnalysis = async () => {
    setLoading(true);
    setErrorMsg(null);
    setAnalysisResult(null);

    try {
      const response = await fetch("/api/gemini/coach", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          tasks,
          userName,
          insightsType: analysisType
        })
      });

      if (!response.ok) {
        throw new Error("Respon server gagal: Periksa koneksi atau ketersediaan kunci API.");
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setAnalysisResult(data.analysis || "AI Coach selesai membuat laporan!");
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Gagal menghubungi AI Coach.");
    } finally {
      setLoading(false);
    }
  };

  // Simple, robust editorial markdown renderer helper to build titles, lines, bullets, bold marks instantly
  const renderMarkdown = (md: string) => {
    if (!md) return null;
    return md.split("\n").map((line, idx) => {
      const trimmed = line.trim();
      
      // H3
      if (trimmed.startsWith("###")) {
        return (
          <h4 key={idx} className="text-sm font-bold text-slate-800 dark:text-indigo-300 mt-4 mb-2 border-l-2 border-indigo-500 pl-2">
            {trimmed.replace(/^###\s*/, "")}
          </h4>
        );
      }
      
      // H2
      if (trimmed.startsWith("**") && trimmed.endsWith("**") && trimmed.length < 50) {
        return (
          <h3 key={idx} className="text-sm font-black text-slate-800 dark:text-slate-100 uppercase tracking-wider mt-5 mb-3 flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-850 pb-1">
            {trimmed.replace(/\*\*/g, "")}
          </h3>
        );
      }

      // Large Title H1
      if (trimmed.startsWith("##")) {
        return (
          <h3 key={idx} className="text-base font-extrabold text-slate-900 dark:text-white mt-6 mb-3">
            {trimmed.replace(/^##\s*/, "")}
          </h3>
        );
      }

      // Checklists/Bullet points
      if (trimmed.startsWith("-") || trimmed.startsWith("*")) {
        const content = trimmed.replace(/^[-*]\s*/, "");
        // Format bold prefix in bullet points
        const boldMatch = content.match(/^\*\*([^*]+)\*\*:(.*)$/);
        if (boldMatch) {
          return (
            <li key={idx} className="ml-5 list-disc text-xs text-slate-650 text-slate-605 text-slate-600 dark:text-slate-350 pr-2 leading-relaxed mt-1.5">
              <strong className="text-slate-800 dark:text-slate-100 font-bold">{boldMatch[1]}:</strong>
              {boldMatch[2]}
            </li>
          );
        }
        return (
          <li key={idx} className="ml-5 list-disc text-xs text-slate-600 dark:text-slate-300 pr-2 leading-relaxed mt-1.5">
            {content.replace(/\*\*/g, "")}
          </li>
        );
      }

      // Horizontal rules
      if (trimmed === "---") {
        return <hr key={idx} className="my-6 border-slate-100 dark:border-slate-850" />;
      }

      // Standard paragraphs
      if (trimmed.length > 0) {
        // Strip out lingering bold stars in raw statements
        const cleanPrg = trimmed.replace(/\*\*/g, "");
        return (
          <p key={idx} className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
            {cleanPrg}
          </p>
        );
      }

      return <div key={idx} className="h-2"></div>;
    });
  };

  return (
    <div id="ai-coach-workspace" className="space-y-6">
      
      {/* Visual Identity Title banner */}
      <div className="p-6 bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-950 border border-indigo-950 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-md text-white">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-indigo-400 font-mono text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-5 h-5 text-indigo-450 animate-pulse" />
            AI Productivity Companion
          </div>
          <h2 className="text-xl font-bold tracking-tight">AI Coach PetaTugas</h2>
          <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
            Dapatkan rekomendasi penjadwalan cerdas, pendeteksi hambatan performa, 
            dan pembagian kerja otomatis berbasis kecerdasan buatan. Model dilatih mendalam menggunakan <strong>Gemini 3.5</strong>.
          </p>
        </div>

        {/* Dropdown controls */}
        <div className="w-full md:w-auto shrink-0 flex flex-col sm:flex-row items-center gap-3">
          <div className="w-full sm:w-48 text-left">
            <label className="text-[9px] uppercase font-bold text-indigo-300 tracking-wide font-sans mb-1 block">Fokus Konsultasi</label>
            <select
              id="coach-analysis-type"
              value={analysisType}
              onChange={(e) => setAnalysisType(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs font-bold rounded-xl border border-indigo-800 bg-indigo-950/70 text-indigo-100 focus:ring-2 focus:ring-indigo-400 select-custom"
            >
              <option value="weekly_productivity">Evaluasi Produktivitas</option>
              <option value="bottlenecks">Deteksi Hambatan Kerja</option>
              <option value="delegation">Optimasi Mutasi Anggota</option>
            </select>
          </div>

          <button
            id="trigger-ai-coach-btn"
            onClick={handleFetchCoachAnalysis}
            disabled={loading}
            className="w-full sm:w-auto px-5 py-2.5 mt-4 sm:mt-0 bg-indigo-500 hover:bg-indigo-650 hover:bg-indigo-600 text-white text-xs font-bold rounded-xl transition shadow shadow-indigo-500/10 cursor-pointer flex items-center justify-center gap-2 shrink-0 border border-indigo-400"
          >
            <BrainCircuit className="w-4.5 h-4.5" />
            <span>{loading ? "AI Sedang Berpikir..." : "Mulai Analisis AI"}</span>
          </button>
        </div>
      </div>

      {/* Main Results Board */}
      <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-2xl p-6 shadow-sm min-h-[300px] flex flex-col justify-between">
        
        {loading ? (
          /* Premium Loading UI */
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-4">
            <div className="p-4 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-full animate-bounce">
              <BrainCircuit className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-255">AI Coach sedang menyusun strategi...</h4>
              <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold font-mono animate-pulse">{loadingMessages[loadingMsgIdx]}</p>
            </div>
          </div>
        ) : errorMsg ? (
          /* Error State styling */
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-3">
            <AlertCircle className="w-10 h-10 text-rose-500 shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-150">Layanan AI Mengalami Kendala</h4>
              <p className="text-xs text-rose-600 font-medium font-sans mt-1 max-w-sm">{errorMsg}</p>
            </div>
            <button
              onClick={handleFetchCoachAnalysis}
              className="px-4 py-1.8 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition"
            >
              Ulangi Percobaan
            </button>
          </div>
        ) : analysisResult ? (
          /* Parsed Markdown output */
          <div className="flex-1 space-y-4 prose prose-indigo dark:prose-invert max-w-none">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-900 justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4.5 h-4.5 text-indigo-550 shrink-0" />
                <span className="text-sm font-extrabold text-slate-800 dark:text-slate-100 uppercase tracking-widest font-mono">Hasil Laporan AI Coach</span>
              </div>
              <span className="text-[9px] font-mono font-bold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 px-2.5 py-0.5 rounded-full border border-indigo-250/10">June 2026</span>
            </div>
            <div className="space-y-2 select-text">
              {renderMarkdown(analysisResult)}
            </div>
          </div>
        ) : (
          /* Welcoming Default State */
          <div className="flex-1 flex flex-col items-center justify-center text-center p-12 space-y-4">
            <div className="p-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-150 dark:border-slate-850 rounded-2xl text-slate-400">
              <HelpCircle className="w-10 h-10 text-slate-350 dark:text-slate-650" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Menanti Perintah Analisis</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm">
                Klik tombol "Mulai Analisis AI" di atas untuk menganalisis daftar tugas Anda secara real-time dan mendapatkan kesimpulan produktivitas mingguan yang akurat.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-4 text-xs font-medium text-slate-500 pt-2 text-[11px]">
              <span className="flex items-center gap-1"><ListChecks className="w-3.5 h-3.5" /> Konsep Kanban Trello</span>
              <span className="flex items-center gap-1"><CalendarRange className="w-3.5 h-3.5" /> Prediksi Hambatan Kerja</span>
            </div>
          </div>
        )}

      </div>
      
    </div>
  );
}
