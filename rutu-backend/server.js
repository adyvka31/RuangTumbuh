require("dotenv").config();
const app = require("./src/app");

const PORT = process.env.PORT || 5001;

const server = app.listen(PORT, () => {
  console.log(`🚀 Server berjalan optimal pada Port: ${PORT}`);
});

server.on("error", (err) => {
  console.error("❌ Gagal menyalakan server:", err.message);
});
