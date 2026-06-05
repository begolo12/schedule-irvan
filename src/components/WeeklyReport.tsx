import React from 'react';
import { Task, Member } from '../types';
import { FileUp, FileSpreadsheet, Printer, Award, BookOpen, AlertCircle, Heart } from 'lucide-react';

interface WeeklyReportProps {
  tasks: Task[];
  members: Member[];
}

export function WeeklyReport({ tasks, members }: WeeklyReportProps) {
  const total = tasks.length;
  const completed = tasks.filter(t => t.status === 'done');
  const size = completed.length;
  const donePercent = total > 0 ? Math.round((size / total) * 100) : 0;

  // Efficiency calculation
  const highPriorityCompleted = completed.filter(t => t.priority === 'high').length;
  const inProgress = tasks.filter(t => t.status === 'inprogress').length;

  // Contributor of the week (member with most completed tasks)
  let bestContributor = { name: "Belum Ada", count: 0 };
  members.forEach(m => {
    const doneCount = completed.filter(t => t.assigneeId === m.id).length;
    if (doneCount > bestContributor.count) {
      bestContributor = { name: m.name, count: doneCount };
    }
  });

  // Export to Excel (CSV syntax builder)
  const exportToExcelSync = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    // CSV Header row
    csvContent += "ID Tugas,Judul Tugas,Deskripsi,Status,Prioritas,Tenggat Waktu,Pihak Terkait,Tipe Enkripsi (E2EE)\n";

    tasks.forEach(t => {
      // Escape commas to keep CSV formatting aligned
      const escTitle = t.title.replace(/"/g, '""');
      const escDesc = t.description.replace(/"/g, '""');
      const row = `"${t.id}","${escTitle}","${escDesc}","${t.status}","${t.priority}","${t.dueDate || '-'}","${t.assigneeName}","${t.isEncrypted ? 'Ya' : 'Tidak'}"`;
      csvContent += row + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Laporan_PetaTugas_Mingguan_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleTriggerPrintpdf = () => {
    // Elegant system instruction notice to user before calling standard clean print dialogue
    window.print();
  };

  return (
    <div id="weekly-report-container" className="bg-white dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
      
      {/* Top Banner Action Panel */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-5 border-b border-slate-100 dark:border-slate-900 print:hidden">
        <div>
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            Laporan Produktivitas Mingguan
          </h2>
          <p className="text-xs text-slate-400 dark:text-slate-500">Kumpulkan metrik, ekspor untuk stakeholder luar, dan download transkrip kerja</p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Export CSV (Excel) */}
          <button
            id="export-csv-btn"
            onClick={exportToExcelSync}
            className="flex items-center gap-2 px-3.5 py-1.8 bg-emerald-605 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition shadow-sm cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Ekspor ke Excel (CSV)</span>
          </button>
          
          {/* Quick PDF Print */}
          <button
            id="export-pdf-btn"
            onClick={handleTriggerPrintpdf}
            className="flex items-center gap-2 px-3.5 py-1.8 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-350 hover:bg-slate-150 dark:hover:bg-slate-800 text-xs font-bold rounded-xl transition cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak PDF</span>
          </button>
        </div>
      </div>

      {/* Visual Report Document (Perfect for Print Layout as well!) */}
      <div className="border border-slate-100 dark:border-slate-900 rounded-2xl p-6 sm:p-8 bg-slate-50/50 dark:bg-slate-950/20 shadow-inner grid grid-cols-1 md:grid-cols-12 gap-8 print:border-none print:p-0 print:bg-white print:text-black">
        
        {/* Document Header */}
        <div className="col-span-12 flex flex-col md:flex-row justify-between items-start gap-4 pb-4 border-b border-dashed border-slate-200 dark:border-slate-800">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-850 dark:text-white print:text-black">LAPORAN PRODUKTIVITAS TIM MINGGUAN</h1>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 print:text-slate-600 font-mono text-indigo-500">Dokumen Autogenerate - ID #PET-2026-WK23</p>
          </div>
          <div className="text-right text-xs font-mono text-slate-500 dark:text-slate-400 print:text-slate-600">
            <p>Tanggal: 05 Juni 2026</p>
            <p>Status: Ringkasan Selesai</p>
          </div>
        </div>

        {/* Highlight Stats Dashboard Grid */}
        <div className="col-span-12 md:col-span-7 space-y-6">
          <h3 className="font-bold text-slate-700 dark:text-slate-200 text-xs uppercase tracking-wider">Metrik Utama Penyelesaian</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="p-4 bg-white dark:bg-slate-950 border border-slate-200/50 dark:border-slate-850 rounded-xl flex items-center gap-3">
              <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{donePercent}%</div>
              <div>
                <p className="text-xs font-bold text-slate-700 dark:text-slate-350">Keberhasilan Proyek</p>
                <span className="text-[10px] text-slate-400">{size} dari {total} tugas tuntas</span>
              </div>
            </div>

            <div className="p-4 bg-white dark:bg-slate-950 border border-slate-200/50 dark:border-slate-850 rounded-xl flex items-center gap-3">
              <div className="text-2xl font-black text-emerald-500">{highPriorityCompleted}</div>
              <div>
                <p className="text-xs font-bold text-slate-700 dark:text-slate-350">Tinggi Prioritas Tuntas</p>
                <span className="text-[10px] text-slate-400">Penyelesaian urgensi tertinggi</span>
              </div>
            </div>
            
          </div>

          {/* Performance narrative column summary */}
          <div className="bg-white dark:bg-slate-950 border border-slate-200/40 dark:border-slate-850 p-5 rounded-xl space-y-3">
            <h4 className="text-xs font-bold text-slate-855 text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-indigo-500" />
              Narasi Kinerja Minggu Ini
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Tim menunjukkan kemajuan yang luar biasa pada minggu ke-4 kuartal ini. Sebanyak {size} tugas telah berhasil dimigrasikan ke status <strong>"Selesai" (Done)</strong> dengan penekanan pada prioritas tinggi. 
              Tingkat kemacetan (Bottleneck) berada di kisaran sehat, dengan hanya {inProgress} tugas berstatus "Sedang Dikerjakan". 
              Pola kolaborasi berada pada tingkat optimum yang didukung oleh kestabilan mode sinkronisasi offline.
            </p>
          </div>
        </div>

        {/* Best performer / Member summary layout side panel */}
        <div className="col-span-12 md:col-span-5 space-y-6">
          <h3 className="font-bold text-slate-705 text-slate-700 dark:text-slate-200 text-xs uppercase tracking-wider">Pencapaian Minggu Ini</h3>
          
          {/* Award card */}
          <div className="p-5 rounded-xl border border-amber-200/80 dark:border-amber-950/40 bg-amber-50/45 dark:bg-amber-950/10 flex items-center gap-4">
            <div className="p-3 bg-amber-500 rounded-lg text-white">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-amber-600 dark:text-amber-400">Kontributor Paling Aktif</p>
              <h4 className="text-sm font-extrabold text-slate-800 dark:text-amber-300">{bestContributor.name}</h4>
              <span className="text-[10px] text-slate-450">{bestContributor.count || 0} tugas diselesaikan sepihak</span>
            </div>
          </div>

          {/* List of workload done */}
          <div className="space-y-2 text-xs">
            <h4 className="font-bold text-slate-600 dark:text-slate-400 mb-1">Rincian Performa Individu</h4>
            {members.map((m, idx) => {
              const mCompleted = completed.filter(t => t.assigneeId === m.id).length;
              return (
                <div key={idx} className="flex justify-between items-center bg-white dark:bg-slate-950 p-3.5 border border-slate-150 dark:border-slate-850 rounded-xl">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: m.avatarColor }}></span>
                    <span className="font-semibold text-slate-700 dark:text-slate-350">{m.name}</span>
                  </div>
                  <span className="font-bold text-slate-400 dark:text-slate-500">
                    <strong className="text-indigo-500">{mCompleted} Tugas</strong> Tuntas
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Seal and signature mock footer */}
        <div className="col-span-12 pt-6 border-t border-dashed border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500 font-sans">
          <div className="flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 text-rose-500" />
            <span>PetaTugas Board - Berkolaborasi Lebih Efisien</span>
          </div>
          <div className="text-right">
            <p>Terverifikasi oleh Sistem Enkripsi E2EE</p>
          </div>
        </div>
      </div>
      
    </div>
  );
}
