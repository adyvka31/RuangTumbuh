/* eslint-disable no-undef */
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
// 1. Import plugin-nya di sini
import { viteCommonjs } from '@originjs/vite-plugin-commonjs';

export default defineConfig({
  // 2. Tambahkan viteCommonjs() ke dalam plugins
  plugins: [react(), viteCommonjs()], 
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:5001",
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
      // Hapus alias 'cookie' jika tidak perlu, biarkan Vite mencarinya secara natural
    },
  },
  optimizeDeps: {
    // Pastikan library yang bermasalah masuk ke sini
    include: ["@rutu/shared", "cookie"],
  },
  build: {
    commonjsOptions: {
      // Ini sudah benar, tapi pastikan transformMixedEsModules aktif
      include: [/@rutu\/shared/, /node_modules/],
      transformMixedEsModules: true,
    },
  },
  // ... sisa config lainnya
});