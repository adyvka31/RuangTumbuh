const logger = require("../utils/logger");
const authService = require("../services/auth.service");
const catchAsync = require("../utils/catchAsync");

const register = catchAsync(async (req, res) => {
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
});

const login = catchAsync(async (req, res) => {
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
});

module.exports = { register, login };
