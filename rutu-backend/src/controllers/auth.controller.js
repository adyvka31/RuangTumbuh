const logger = require("../utils/logger");
const authService = require("../services/auth.service");

const register = async (req, res, next) => {
  try {
    const newUser = await authService.registerUser(req.body);
    logger.info(
      `[Register] User baru berhasil mendaftar: ${newUser.id} (${req.body.email})`,
    );

    res.status(201).json({
      success: true,
      message: "Registrasi berhasil!",
      data: {
        user: { id: newUser.id, name: newUser.name, email: newUser.email },
      },
    });
  } catch (error) {
    logger.error(`[Register] Error Server: ${error.message}`, {
      stack: error.stack,
    });
    res.status(error.statusCode || 500).json({
      success: false,
      message:
        error.statusCode !== 500 ? error.message : "Terjadi kesalahan server",
      error: error.message,
    });
  }
};

const login = async (req, res, next) => {
  try {
    const { user, token } = await authService.loginUser(req.body);
    logger.info(`[Login] User berhasil login: ${user.id} (${req.body.email})`);

    res.status(200).json({
      success: true,
      message: "Login berhasil!",
      data: {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          timeBalance: user.timeBalance,
        },
      },
    });
  } catch (error) {
    logger.error(`[Login] Error Server: ${error.message}`, {
      stack: error.stack,
    });
    res.status(error.statusCode || 500).json({
      success: false,
      message:
        error.statusCode !== 500 ? error.message : "Terjadi kesalahan server",
      error: error.message,
    });
  }
};

module.exports = { register, login };
