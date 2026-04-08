import express from "express";
import cors from "cors";
import dotenv from "dotenv";
// Pastikan path import benar sesuai struktur folder kamu
import { getChatbotReply } from "./src/services/chatbot.service.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json()); 
console.log("=== Konfigurasi RuangTumbuh ===");
console.log("Cek API Key:", process.env.GEMINI_API_KEY ? "✅ Terdeteksi" : "❌ Tidak Terdeteksi");

app.post("/api/chatbot", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || message.trim() === "") {
      return res.status(400).json({ error: "Pesan tidak boleh kosong" });
    }

    // Memanggil service AI
    const reply = await getChatbotReply(message);
    
    // Pastikan mengirim properti 'reply' agar sesuai dengan kebutuhan frontend
    res.json({ 
      success: true,
      reply: reply 
    });

  } catch (error) {
    console.error("Error pada endpoint /api/chatbot:", error.message);
    res.status(500).json({ 
      success: false,
      reply: "Maaf, server RuangTumbuh sedang sibuk. Coba lagi nanti ya!",
      error: error.message 
    });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server RuangTumbuh jalan di http://localhost:${PORT}`);
});