# === STAGE 1: Build React App ===
FROM node:22-alpine AS builder

RUN npm install -g pnpm
WORKDIR /app

# Menyalin konfigurasi workspace
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./

# Menyalin package shared dan frontend
COPY packages/shared ./packages/shared
COPY rutu-frontend ./rutu-frontend

# Menginstal dependency khusus untuk frontend
RUN pnpm install --filter rutu-frontend...

# Build frontend menggunakan Vite
WORKDIR /app/rutu-frontend
RUN pnpm build

# === STAGE 2: Serve dengan Nginx ===
FROM nginx:alpine

# Menyalin hasil build dari stage 1 ke folder publik Nginx
COPY --from=builder /app/rutu-frontend/dist /usr/share/nginx/html

# Mengekspos port 80 (default HTTP)
EXPOSE 80

# Menjalankan Nginx
CMD ["nginx", "-g", "daemon off;"]