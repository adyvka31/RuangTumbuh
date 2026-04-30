module.exports = {
  testEnvironment: "node",
  clearMocks: true,
  testMatch: ["**/__tests__/**/*.test.js"],
  transformIgnorePatterns: ["/node_modules/(?!@rutu/shared)"],
};
