# Menggunakan Node.js versi 22 sesuai dengan package.json
FROM node:22-alpine

# Menginstal pnpm
RUN npm install -g pnpm

# Mengatur direktori kerja di dalam container
WORKDIR /app

# Menyalin konfigurasi workspace monorepo
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./

# Menyalin package shared dan backend
COPY packages/shared ./packages/shared
COPY rutu-backend ./rutu-backend

RUN pnpm config set shamefully-hoist true

# Menginstal dependency khusus untuk backend dan shared package
RUN pnpm install --filter rutu-backend...

# Pindah ke direktori backend
WORKDIR /app/rutu-backend

# Generate Prisma Client
RUN npx prisma generate

# Mengekspos port backend
EXPOSE 5001

# Menjalankan server
CMD ["pnpm", "start"]