# STAGE 1: Proses Build React/Vite
FROM node:20-alpine AS builder
WORKDIR /app
RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install
COPY . .
RUN pnpm build

# STAGE 2: Menyajikan file statis dengan Nginx (Web Server)
FROM nginx:alpine
# Hapus konfigurasi default Nginx
RUN rm /etc/nginx/conf.d/default.conf
# Salin hasil build dari Stage 1 ke folder Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Konfigurasi Nginx agar mendukung React Router (mencegah error 404 saat refresh)
RUN echo 'server { \
    listen 80; \
    location / { \
        root   /usr/share/nginx/html; \
        index  index.html index.htm; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]