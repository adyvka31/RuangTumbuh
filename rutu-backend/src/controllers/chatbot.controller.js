import { getChatbotReply } from "../services/chatbot.service.js";

export const chatbotHandler = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || typeof message !== "string" || message.trim() === "") {
      return res.status(400).json({ 
        success: false, 
        error: "Pesan tidak boleh kosong" 
      });
    }

    const reply = await getChatbotReply(message);
    return res.status(200).json({
      success: true,
      reply: reply
    });

  } catch (error) {
    console.error("=== Controller Error ===");
    console.error("Detail:", error.message);

    return res.status(500).json({
      success: false,
      reply: "Maaf, RuangTumbuh Bot sedang mengalami gangguan teknis. Coba lagi nanti ya!",
      error: error.message 
    });
  }
};