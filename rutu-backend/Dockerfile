# Menggunakan Node.js versi 20 yang stabil dan ringan (alpine)
FROM node:20-alpine

# Menentukan direktori kerja di dalam container
WORKDIR /app

# Install pnpm secara global di dalam container
RUN npm install -g pnpm

# Salin file konfigurasi package untuk menginstall dependensi
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install

# Salin seluruh kode backend
COPY . .

# Generate Prisma Client agar bisa berkomunikasi dengan database
RUN npx prisma generate

# Ekspos port yang digunakan oleh backend
EXPOSE 5001

# Perintah untuk menjalankan server
CMD ["pnpm", "start"]