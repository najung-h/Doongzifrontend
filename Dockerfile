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

# 애플리케이션 빌드 (vite.config.ts의 outDir 설정에 따라 'dist' 폴더에 결과물 생성)
RUN npm run build

# 2단계: Nginx 웹서버 설정 (Final Stage)
FROM nginx:stable-alpine

# 빌드 단계(builder)에서 생성된 결과물('build' 폴더)을 Nginx의 기본 웹 루트 디렉터리로 복사
COPY --from=builder /app/build /usr/share/nginx/html

# 80번 포트 노출
EXPOSE 80 443

# Nginx 서버 실행
CMD ["nginx", "-g", "daemon off;"]