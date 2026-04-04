const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  // Ambil token dari header "Authorization: Bearer <token>"
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Akses ditolak. Token tidak ditemukan!" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "rahasia-ruang-tumbuh-super-aman",
    );
    req.user = decoded; // Tempelkan data user (id, email) ke request
    next(); // Lanjutkan ke controller
  } catch (error) {
    return res
      .status(403)
      .json({ message: "Sesi kedaluwarsa atau token tidak valid." });
  }
};

module.exports = { verifyToken };
