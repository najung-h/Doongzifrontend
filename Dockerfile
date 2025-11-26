# 1단계: React 애플리케이션 빌드 (Builder Stage)
FROM node:20-alpine AS builder

# 작업 디렉터리 설정
WORKDIR /app

# package.json과 package-lock.json을 먼저 복사하여 의존성 캐싱 활용
COPY package*.json ./

# 의존성 설치
RUN npm ci

# 전체 소스 코드 복사
COPY . .

# 🔥 빌드 인자로 환경변수 받기
ARG VITE_N8N_CHATBOT_WEBHOOK_URL=/api/chatbot
ARG VITE_N8N_SCAN_WEBHOOK_URL=/api/scan
ARG VITE_N8N_CHECKLIST_WEBHOOK_URL=/api/checklist
ARG VITE_N8N_LEGAL_WEBHOOK_URL=

# 🔥 빌드 시점에 환경변수로 설정 (Vite가 읽을 수 있도록)
ENV VITE_N8N_CHATBOT_WEBHOOK_URL=$VITE_N8N_CHATBOT_WEBHOOK_URL
ENV VITE_N8N_SCAN_WEBHOOK_URL=$VITE_N8N_SCAN_WEBHOOK_URL
ENV VITE_N8N_CHECKLIST_WEBHOOK_URL=$VITE_N8N_CHECKLIST_WEBHOOK_URL
ENV VITE_N8N_LEGAL_WEBHOOK_URL=$VITE_N8N_LEGAL_WEBHOOK_URL

# 애플리케이션 빌드 (vite.config.ts의 outDir 설정에 따라 'build' 폴더에 결과물 생성)
RUN npm run build

# 2단계: Nginx 웹서버 설정 (Final Stage)
FROM nginx:stable-alpine

# 빌드 단계(builder)에서 생성된 결과물('build' 폴더)을 Nginx의 기본 웹 루트 디렉터리로 복사
COPY --from=builder /app/build /usr/share/nginx/html

# 80번 포트 노출
EXPOSE 80 443

# Nginx 서버 실행
CMD ["nginx", "-g", "daemon off;"]