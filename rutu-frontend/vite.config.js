/* eslint-disable no-undef */
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "https://ruangtumbuh-production.up.railway.app",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, "/api"),
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@pages": path.resolve(__dirname, "./src/pages"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@assets": path.resolve(__dirname, "./src/assets"),
      "@layouts": path.resolve(__dirname, "./src/layouts"),
      // PAKSA VITE PAKAI ENTRY POINT YANG BENAR UNTUK COOKIE
      cookie: "cookie",
    },
  },
  test: {
    globals: true,
    environment: "happy-dom",
    setupFiles: "./src/setupTests.js",
  },
  esbuild: {
    drop: ["console", "debugger"],
  },

  optimizeDeps: {
    // TAMBAHKAN 'cookie' DI SINI
    include: ["@rutu/shared", "cookie"],
  },

  build: {
    commonjsOptions: {
      include: [/@rutu\/shared/, /node_modules/],
      exclude: [/node_modules\/cookie/],
    },
  },
});