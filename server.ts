import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini safely, using lazy client/guarding
let aiClient: GoogleGenAI | null = null;
function getAi(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY is not defined in environment variables");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// API Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "healthy", time: new Date().toISOString() });
});

// API - Gemini productivity coach endpoint
app.post("/api/gemini/coach", async (req, res) => {
  try {
    const { tasks, userName, insightsType } = req.body;
    
    if (!tasks || !Array.isArray(tasks)) {
      res.status(400).json({ error: "Tasks array is required" });
      return;
    }

    const ai = getAi();
    
    // Construct descriptive prompt
    let promptText = `Anda adalah "Asisten PetaTugas AI Coach". Bantu menganalisis tugas-tugas dari papan Kanban pengguna bernama "${userName || 'Karyawan'}".

Tipe analisis yang diminta: ${insightsType || 'weekly_productivity'}
Berikut daftar tugas yang ada sekarang:
${tasks.map((t: any, i: number) => `- [${t.status}] ${t.title} (Prioritas: ${t.priority}, Tenggat: ${t.dueDate || 'Tidak ada'}, Pihak Terlibat: ${t.assigneeName || 'Belum diatur'}, Selesai: ${t.completed ? 'Ya' : 'Belum'})`).join("\n")}

Berikan tanggapan yang terperinci dalam Bahasa Indonesia terstruktur dalam Markdown yang indah dan rapi.
Tolong sertakan bagian-bagian berikut:
1. **Ringkasan Kemajuan**: Berikan evaluasi objektif tentang seberapa produktif minggu ini secara energetik dan memotivasi.
2. **Analisis Bottleneck**: Identifikasi tugas-tugas prioritas tinggi atau yang tertunda yang membutuhkan perhatian segera.
3. **Saran Pembagian Kerja**: Jika ada banyak anggota tim, berikan rekomendasi pembagian tugas yang efisien.
4. **Tips Produktivitas Khusus & Kalender**: Berikan 3 tips praktis untuk mengoptimalkan jadwal minggu depan.

Format jawaban harus rapi dengan bullet points, warna tebal, dan gaya desain editorial yang sopan dan profesional. Jangan gunakan jargon teknis yang berlebihan.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: promptText,
    });

    res.json({ analysis: response.text });
  } catch (error: any) {
    console.error("Gemini Coach Error:", error);
    res.status(500).json({ 
      error: "Gagal berinteraksi dengan AI Coach", 
      details: error.message || String(error) 
    });
  }
});

// Setup Vite middleware for development
async function bootstrap() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting in development mode with Vite HMR middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Serving static production assets from /dist...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

bootstrap().catch((err) => {
  console.error("Bootstrap failure:", err);
  process.exit(1);
});
