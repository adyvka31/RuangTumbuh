require("dotenv").config();
const app = require("./src/app");

const PORT = process.env.PORT || 5001;

const server = app.listen(PORT, () => {
  console.log(`🚀 Server berjalan optimal di http://localhost:${PORT}`);
});

server.on("error", (err) => {
  console.error("❌ Gagal menyalakan server:", err.message);
});
