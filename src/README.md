# 둥지 (Doongzi) - 부동산 계약 안전 도우미

부동산 임대차 계약 시 안전한 거래를 돕는 통합 웹 서비스

## 🏠 프로젝트 개요

둥지는 부동산 계약 과정에서 발생할 수 있는 리스크를 사전에 파악하고, 안전한 계약을 위한 가이드를 제공하는 서비스입니다.

## 🎨 주요 색상

- **배경색**: `#FAF8F3` (밝은 크림) / 메시지 영역: `#E8E5CE` (연한 베이지)
- **포인트 컬러**: `#8FBF4D` (올리브 그린) / 액센트: `#9ACD32` (연두색)
- **AI 메시지**: `#FFFACD` (연한 노란색)
- **사용자 메시지**: `#D4E5B8` (연한 그린)

## 🚀 시작하기

### 1. 설치

```bash
npm install
```

### 2. 환경변수 설정

`.env.example` 파일을 복사하여 `.env` 파일을 생성하고, n8n 웹훅 URL을 설정하세요:

```bash
cp .env.example .env
```

`.env` 파일 예시:
```env
VITE_N8N_CHATBOT_WEBHOOK_URL=https://your-n8n-instance.com/webhook/chatbot
VITE_N8N_SCAN_WEBHOOK_URL=https://your-n8n-instance.com/webhook/scan
VITE_N8N_CHECKLIST_WEBHOOK_URL=https://your-n8n-instance.com/webhook/checklist
VITE_N8N_LEGAL_WEBHOOK_URL=https://your-n8n-instance.com/webhook/legal
```

### 3. 개발 서버 실행

```bash
npm run dev
```

### 4. 빌드

```bash
# 프로덕션 빌드
npm run build

# 개발 빌드
npm run build:dev
```

## 📁 프로젝트 구조

```
doongzi/
├── src/
│   ├── pages/          # 페이지 컴포넌트
│   │   ├── HomePage.tsx
│   │   ├── ChatbotPage.tsx
│   │   ├── ChecklistPage.tsx
│   │   └── ScanPage.tsx
│   ├── components/     # 공통 컴포넌트
│   │   └── Header.tsx
│   ├── types/          # TypeScript 타입 정의
│   │   └── index.ts
│   ├── App.tsx         # 라우팅 설정
│   └── main.tsx        # 엔트리포인트
├── styles/
│   └── globals.css     # 전역 스타일 및 CSS 변수
└── public/             # 정적 파일
```

## 🎯 핵심 기능

- **어미새 챗봇**: AI 기반 부동산 법률 상담
- **둥지 스캔하기**: 계약서/등기부등본 AI 분석
- **체크리스트**: 단계별 계약 가이드
- **깡통전세 위험도 분석**: 리스크 평가 및 점수화

## 🛠 기술 스택

- React 18 + TypeScript
- Vite
- React Router v6
- Lucide React (아이콘)
- Axios (HTTP 클라이언트)

## 🌐 배포

- **도메인**: doongzi.site
- **호스팅**: EC2 + Nginx + Let's Encrypt SSL

## 📄 라이선스

해커톤 프로젝트 (2일)