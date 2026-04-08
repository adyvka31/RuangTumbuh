import genAI from "../config/gemini.config.js";

export const getChatbotReply = async (userMessage) => {
  try {
    const model = genAI.getGenerativeModel({
      model: "models/gemini-1.5-flash",
      systemInstruction: {
        role: "system",
        parts: [{ 
          text: `Kamu adalah RuangTumbuh Bot, asisten virtual untuk platform edukasi RuangTumbuh.
          
          Informasi Layanan RuangTumbuh:
          1. Konsep: RuangTumbuh adalah platform pembelajaran yang menggunakan sistem poin/koin.
          2. Sistem Koin: User harus top-up minimal Rp100.000 untuk mendapatkan koin. Koin ini digunakan untuk membayar atau berkonsultasi dengan Mentor.
          3. Mentor: User bisa mencari mentor ahli di dalam platform untuk bimbingan belajar.
          4. Reset Password: Jika user lupa password, arahkan mereka ke menu 'Lupa Password' di halaman login atau periksa email untuk link pemulihan.
          
          Gaya Bahasa:
          - Jika user menyapa (Hai, Halo, Tes, Lupa password, dkk), balas dengan ramah, perkenalkan dirimu, dan tawarkan bantuan terkait layanan RuangTumbuh.
          - Gunakan bahasa yang santun dan informatif.` 
        }],
      },
    });
    const result = await model.generateContent(userMessage);
        const response = await result.response;
    const responseText = response.text();

    return responseText.trim();

  } catch (error) {
    console.error("=== GEMINI API ERROR ===");
    console.error("Detail:", error.message);
        throw error;
  }
};