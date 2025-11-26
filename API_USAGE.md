# API 사용 가이드

## 환경 변수 설정

백엔드 로직은 3개의 n8n 워크플로우로 통합 관리됩니다.
```bash
# .env
VITE_N8N_CHATBOT_WEBHOOK_URL=       # 어미새 챗봇 + 법률 사전
VITE_N8N_SCAN_WEBHOOK_URL=          # 둥지 스캔 (문서 분석/OCR)
VITE_N8N_CHECKLIST_WEBHOOK_URL=     # 둥지 짓기 플랜 (위험도 분석, PDF, 이메일 등)
```

## API 구조

모든 API는 **actionType 기반 라우팅**을 사용합니다.
각 기능별로 하나의 웹훅 URL을 사용하며, `actionType` 필드로 세부 기능을 구분합니다.

### 1. Chat Service (어미새 챗봇 + 법률 사전)
- Endpoint: `VITE_N8N_CHATBOT_WEBHOOK_URL` 
- 담당 기능: 어미새 챗봇 대화, 법률/판례 검색 (PRD 4.2, 4.5)
- n8n Switch Logic (`actionType`)
  - `sendMessage`: 일반 대화 및 고정 질문 처리 (어미새 챗봇)
  - `searchLegal`: 법률 사전 키워드 검색

#### 1.1 메시지 전송 (`sendMessage`)

```json
// Request Body:
{
  "actionType": "sendMessage",
  "query": "확정일자가 뭔가요?",
  "conversation_id": "conv_12345" // 선택사항 (첫 대화 시 생략)
}
```

```json
// Response Body:
{
  "success": true,
  "reply": "확정일자란 법원 또는 동사무소 등에서 주택임대차계약을 체결한 날짜를 확인하여 주기 위해...",
  "conversation_id": "conv_12345"
}
```

#### 1.2 법률 정보 검색 (`searchLegal`)

```json
// !TODO 구현하려면 법령정보센터 API 규격에 맞게 수정
// Request Body:
{
  "actionType": "searchLegal",
  "query": "전세사기",
  "category": "case" // 'all' | 'law' (법령) | 'case' (판례)
}
```

```json
// Response Body:
{
  "success": true,
  "results": [
    {
      "title": "전세사기 관련 주요 판례 2023다1234",
      "summary": "임대인이 보증금 반환 의사 없이...",
      "link": "https://..."
    }
  ]
}
```

### 2. Document Service (문서 분석)
- Endpoint: `VITE_N8N_SCAN_WEBHOOK_URL`
- 담당 기능: 둥지 스캔, 계약서 정밀 진단 (PRD 4.3, 4.4-MVP1)
- n8n Switch Logic (`actionType`)
  - 주의: 파일 업로드이므로 `Content-Type: multipart/form-data`를 사용합니다. `actionType`은 FormData의 필드로 전송합니다.
  - `scanDocuments`: (둥지 스캔) 등기부등본/건축물대장/계약서 통합 분석 및 체크리스트 자동 완료. 처리 방식은 비동기 (Asynchronous) - 요청 즉시 200 OK 응답, 분석은 백그라운드에서 진행됨.
  - `analyzeDocuments`: (체크리스트 내부) 계약서 독소조항 정밀 진단 / 등기부등본 근저당 정밀 진단 / 건축물대장 정밀 진단. doc_type 필드로 구분함.

#### 2.1 둥지 스캔 (`scanDocuments`)
프론트엔드는 파일만 전송하고 연결을 종료합니다. 로딩 화면 대신 "분석이 시작되었습니다. 결과는 이메일로 전송됩니다."라는 안내가 필요합니다.

```json
// Request (FormData):
{
  "actionType": "scanDocuments",
  // "files": [File Object, File Object...]
  "files": [File Object]
}
```

```json
// Response (즉시 반환)
{
  "message": "Workflow started" 
}
```

#### 2.2 계약서 정밀 진단 (`analyzeDocuments`)

```json
// Request (FormData):
{
  "actionType": "analyzeDocuments",
  "userId": "61a8fc1d-67b0-45db-b913-602654b45c3c",
  "file": [File Object],
  "docType": "등기부등본" // '등기부등본' | '임대차계약서' | '건축물대장'
}
```

```json
// Response:
{
  "success": true,
  "analysis": {
    "riskGrade": "low",
    "summary": "문서 분석 완료. 위험 등급: low",
    "issues": [],
    "autoCheckItems": [
      {
        "id": "owner_match",
        "completed": false,
        "reason": "문서에서 소유자 정보를 추출했습니다."
      }
    ]
  },
  "schedule": {}
}
```


### 3. Checklist Service (둥지 짓기 플랜)

- Endpoint: `VITE_N8N_CHECKLIST_WEBHOOK_URL` 
- 담당 기능: 깡통전세 분석, 보험 확인, PDF 내보내기 (PRD 4.4)
- n8n Switch Logic (`actionType`)
  - `analyzeRisk`: 깡통전세 위험도 분석
  - `exportPDF`: 체크리스트 PDF 생성 및 다운로드 링크
  - `sendEmail`: 체크리스트 PDF 이메일 발송


#### 3.1 깡통전세 위험도 분석 (`analyzeRisk`)

```json
// Request Body:
{
  "actionType": "analyzeRisk",
  "address": "서울특별시 관악구 쑥고개로 123",
  "exclusiveArea": 20.74,
  "type": "오피스텔",      // '아파트' | '단독/다가구' | '연립/다세대' | '오피스텔' 
  "deposit": 12000        // 보증금 (단위: 만 원)
}
```

```json
// Response:
{
  "success": true,
  "result": {
    "riskLevel": "safe",  // 'safe' | 'warning' | 'danger'
    "ratio": 66.3,
    "message": "매매가 대비 전세가율이 70% 이하로 비교적 안전한 편입니다.",
    "graphData": {
      "safeLine": 70,
      "current": 66.3
    },
    "extraToWarning_만원": 670,
    "extraToDanger_만원": 0,
    "mortgageMessage": "현재 보증금 기준으로 약 670만 원 이상 추가되는 근저당·선순위 채권이 잡히면 전세가율이 70%를 넘어 '주의' 단계로 올라갈 수 있어요. 등기부등본에서 근저당 설정 금액이 이 금액을 넘지 않는지 꼭 확인해보세요."
  }
}
```

#### 3.2 PDF 내보내기 (`exportPDF`)

```json
// Request Body:
{
  "actionType": "exportPDF",
  "userId": "61a8fc1d-67b0-45db-b913-602654b45c3c"
}
```

```json
// Response:
{
  "success": true,
  "downloadUrl": "https://n8n-server.com/files/checklist_20231124.pdf"
}
```

#### 3.3 이메일 전송 (`sendEmail`)

```json
// Request Body:
{
  "actionType": "sendEmail",
  "userId": "61a8fc1d-67b0-45db-b913-602654b45c3c"
}
```

```json
// Response:
{
  "success": true,
  "message": "user@example.com으로 리포트가 발송되었습니다."
}
```

## Axios 인스턴스 설정 (`src/api/http.ts`)
중복 코드를 줄이기 위해 Axios 인스턴스를 생성합니다.

```typescript
// src/api/http.ts
import axios from 'axios';

export const apiClient = axios.create({
  timeout: 60000, // 60초 타임아웃 (AI 분석 시간이 걸릴 수 있음)
  headers: {
    'Content-Type': 'application/json',
  },
});

// 응답 인터셉터 (에러 처리 공통화)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    // 필요 시 에러 토스트 메시지 띄우기 로직 추가
    return Promise.reject(error);
  }
);
```

## 서비스별 API 모듈 구현
각 서비스 파일은 actionType을 페이로드에 포함하여 n8n의 Switch 노드가 작동하도록 합니다.

### 1. Chat Service (`src/api/chat.ts`)
```typescript
import { apiClient } from './http';
import { ChatResponse } from '../types/api';

const WEBHOOK_URL = import.meta.env.VITE_N8N_CHAT_WEBHOOK_URL;

export const chatAPI = {
  // 일반 대화 보내기
  sendMessage: async (query: string, conversationId?: string) => {
    const { data } = await apiClient.post<ChatResponse>(WEBHOOK_URL, {
      actionType: 'sendMessage',
      query,
      conversation_id: conversationId,
    });
    return data;
  },

  // 법률/판례 검색
  searchLegal: async (keyword: string, category: 'all' | 'law' | 'case' = 'all') => {
    const { data } = await apiClient.post<ChatResponse>(WEBHOOK_URL, {
      actionType: 'searchLegal',
      keyword,
      category,
    });
    return data;
  },
};
```

### 2. Document Service (`src/api/document.ts`)
파일 업로드를 위해 FormData를 사용해야 합니다.

```typescript
import { apiClient } from './http';
import { DocAnalysisResponse } from '../types/api';

const WEBHOOK_URL = import.meta.env.VITE_N8N_DOC_WEBHOOK_URL;

export const docAPI = {
  // 둥지 스캔 (등기부등본, 계약서 등 다중 파일 분석)
  scanDocuments: async (files: File[]) => {
    const formData = new FormData();
    formData.append('actionType', 'scanDocuments');
    
    // 파일 배열 처리
    files.forEach((file) => {
      formData.append('files', file);
    });

    const { data } = await apiClient.post<DocAnalysisResponse>(WEBHOOK_URL, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }, // 필수
    });
    return data;
  },

  // 계약서 정밀 진단 (체크리스트 내부 기능)
  deepAnalyzeContract: async (file: File) => {
    const formData = new FormData();
    formData.append('actionType', 'deepAnalyzeContract');
    formData.append('files', file);

    const { data } = await apiClient.post<DocAnalysisResponse>(WEBHOOK_URL, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },
};
```

### 3. Checklist Service (`src/api/checklist.ts`)
```typescript
import { apiClient } from './http';
import { ChecklistToolResponse } from '../types/api';

const WEBHOOK_URL = import.meta.env.VITE_N8N_CHECKLIST_WEBHOOK_URL;

export const checklistAPI = {
  // 깡통전세 위험도 분석
  analyzeRisk: async (address: string, deposit: number, marketPrice: number) => {
    const { data } = await apiClient.post<ChecklistToolResponse>(WEBHOOK_URL, {
      actionType: 'analyzeRisk',
      data: { address, deposit, exclusiveArea, type },
    });
    return data;
  },

  // PDF 내보내기
  exportPDF: async (checklistData: any) => {
    const { data } = await apiClient.post<ChecklistToolResponse>(WEBHOOK_URL, {
      actionType: 'exportPDF',
      checklistData,
    });
    return data;
  },

  // 이메일 전송
  sendEmail: async (email: string, checklistData: any) => {
    const { data } = await apiClient.post<ChecklistToolResponse>(WEBHOOK_URL, {
      actionType: 'sendEmail',
      email,
      checklistData,
    });
    return data;
  },
};
```


## 에러 핸들링

모든 API는 try-catch로 감싸져 있으며, 에러 발생 시 fallback 응답을 반환합니다.

```typescript
try {
  const response = await chatbotAPI.sendMessage('안녕하세요');
} catch (error) {
  console.error('API 호출 실패:', error);
  // 자동으로 fallback 응답 반환됨
}
```
