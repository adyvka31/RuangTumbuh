const { getChatbotReply } = require("../services/chatbot.service");

exports.chatbotHandler = async (req, res) => {
  console.log("\n=== 1. ADA PESAN MASUK KE CHATBOT ===");
  console.log("Isi dari Frontend (req.body):", req.body);

  try {
    // Kita antisipasi jika frontend mengirim "text" alih-alih "message"
    const userMessage = req.body.message || req.body.text;

    if (
      !userMessage ||
      typeof userMessage !== "string" ||
      userMessage.trim() === ""
    ) {
      console.log("❌ ERROR: Pesan kosong atau format salah");
      return res
        .status(400)
        .json({ success: false, error: "Pesan tidak boleh kosong" });
    }

    console.log(`=== 2. MENERUSKAN PESAN: "${userMessage}" KE GEMINI ===`);
    const reply = await getChatbotReply(userMessage);

    console.log("=== 3. BERHASIL DIBALAS GEMINI! ===");
    return res.status(200).json({ success: true, reply: reply });
  } catch (error) {
    console.error("\n❌ === ERROR DI CONTROLLER ===");
    console.error("Pesan Error:", error.message);
    return res.status(500).json({
      success: false,
      reply:
        "Maaf, RuangTumbuh Bot sedang mengalami gangguan teknis. Coba lagi nanti ya!",
    });
  }
};
