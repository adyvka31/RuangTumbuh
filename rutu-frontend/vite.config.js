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
      '/api': {
        target: 'http://localhost:5001',   
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '/api')
      }
    }
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@pages": path.resolve(__dirname, "./src/pages"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@assets": path.resolve(__dirname, "./src/assets"),
      "@layouts": path.resolve(__dirname, "./src/layouts"),
    },
  },
  test: {
    globals: true,
    environment: "happy-dom", // Simulasi browser di terminal
    setupFiles: "./src/setupTests.js",
  },
  esbuild: {
    drop: ["console", "debugger"],
  },

  // Memaksa Vite mem-bundle package lokal yang menggunakan CommonJS (saat development)
  optimizeDeps: {
    include: ["@rutu/shared"],
  },

  // Memastikan package lokal ikut diproses saat build untuk production
  build: {
    commonjsOptions: {
      include: [/@rutu\/shared/, /node_modules/],
    },
  },
});
