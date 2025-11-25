# API 사용 가이드

## 환경 변수 설정

1. `.env` 파일에 백엔드 팀에서 제공받은 n8n 웹훅 URL 입력

```bash
# n8n Webhook URLs
VITE_N8N_CHATBOT_WEBHOOK_URL=
VITE_N8N_SCAN_WEBHOOK_URL=
VITE_N8N_CHECKLIST_WEBHOOK_URL=
VITE_N8N_LEGAL_WEBHOOK_URL=
```

## API 구조

모든 API는 **actionType 기반 라우팅**을 사용합니다.
각 기능별로 하나의 웹훅 URL을 사용하며, `actionType` 필드로 세부 기능을 구분합니다.

### 1. 챗봇 API (`VITE_N8N_CHATBOT_WEBHOOK_URL`)

```typescript
import { chatbotAPI } from './api/chatbot';

// 메시지 전송
const response = await chatbotAPI.sendMessage(
  '확정일자가 뭔가요?',
  'conversation-id-123'
);

// Request Body:
{
  actionType: 'sendMessage',
  query: '확정일자가 뭔가요?',
  conversation_id: 'conversation-id-123'
}

// Response:
{
  reply: '확정일자는...',
  conversation_id: 'conversation-id-123'
}
```

### 2. 스캔/분석 API (`VITE_N8N_SCAN_WEBHOOK_URL`)

```typescript
import { scanAPI } from './api/scan';

// 문서 분석
const files = [file1, file2, file3];
const result = await scanAPI.analyzeDocuments(files);

// Request (FormData):
{
  actionType: 'analyzeDocuments',
  files: [File, File, File]
}

// Response:
{
  success: true,
  analysis: {
    riskLevel: 25,
    riskGrade: 'low',
    issues: [...],
    recommendations: [...]
  }
}
```

### 3. 체크리스트 API (`VITE_N8N_CHECKLIST_WEBHOOK_URL`)

#### 3.1 PDF 다운로드

```typescript
import { checklistAPI } from './api/checklist';

// PDF 생성
const result = await checklistAPI.exportPDF(checklistData);

// Request Body:
{
  actionType: 'exportPDF',
  checklistData: [...]
}

// Response:
{
  success: true,
  pdfUrl: 'https://...'
}
```

#### 3.2 이메일 전송

```typescript
// 이메일 전송
const result = await checklistAPI.sendEmail(
  'user@example.com',
  checklistData
);

// Request Body:
{
  actionType: 'sendEmail',
  email: 'user@example.com',
  checklistData: [...]
}

// Response:
{
  success: true,
  message: '이메일이 전송되었습니다.'
}
```

#### 3.3 등기부등본 발급

```typescript
// 등기부등본 발급
const result = await checklistAPI.issueRegistry(
  '서울시 강남구 역삼동 123-45',
  '010-1234-5678',
  'password123'
);

// Request Body:
{
  actionType: 'issueRegistry',
  address: '서울시 강남구 역삼동 123-45',
  phone: '010-1234-5678',
  password: 'password123'
}

// Response:
{
  success: true,
  registryUrl: 'https://...',
  message: '발급이 완료되었습니다.'
}
```

#### 3.4 보증보험 가입 가능 여부 확인

```typescript
// 보증보험 확인
const result = await checklistAPI.checkInsurance({
  address: '서울시 강남구 역삼동 123-45',
  deposit: 300000000,
  monthlyRent: 0
});

// Request Body:
{
  actionType: 'checkInsurance',
  propertyInfo: {
    address: '서울시 강남구 역삼동 123-45',
    deposit: 300000000,
    monthlyRent: 0
  }
}

// Response:
{
  success: true,
  eligible: true,
  message: '보증보험 가입이 가능합니다.',
  details: 'HUG, SGI 모두 가입 가능'
}
```

#### 3.5 깡통전세 위험도 분석

```typescript
// 위험도 분석
const result = await checklistAPI.analyzeRisk({
  address: '서울시 강남구 역삼동 123-45',
  marketPrice: 350000000,
  deposit: 300000000
});

// Request Body:
{
  actionType: 'analyzeRisk',
  propertyInfo: {
    address: '서울시 강남구 역삼동 123-45',
    marketPrice: 350000000,
    deposit: 300000000
  }
}

// Response:
{
  success: true,
  riskLevel: 'medium',
  riskScore: 65,
  message: '보증금 비율이 85%로 다소 높습니다.',
  recommendations: [
    '보증보험 가입을 권장합니다.',
    '선순위 권리관계를 확인하세요.'
  ]
}
```

### 4. 법률/판례 검색 API (`VITE_N8N_LEGAL_WEBHOOK_URL`)

#### 4.1 법률/판례 검색

```typescript
import { legalAPI } from './api/legal';

// 법률/판례 검색
const result = await legalAPI.searchLegal('전세사기', 'all');

// Request Body:
{
  actionType: 'searchLegal',
  query: '전세사기',
  filter: 'all'  // 'all' | 'case' | 'law'
}

// Response:
{
  success: true,
  results: [
    {
      id: '1',
      type: 'case',
      title: '전세사기 관련 판례',
      court: '대법원',
      caseNumber: '2023다123456',
      summary: '...',
      url: 'https://...'
    },
    {
      id: '2',
      type: 'law',
      title: '주택임대차보호법',
      lawName: '주택임대차보호법',
      article: '제3조의2',
      summary: '...',
      url: 'https://...'
    }
  ],
  totalCount: 42
}
```

#### 4.2 법률/판례 상세 조회

```typescript
// 상세 조회
const result = await legalAPI.getLegalDetail('case-123');

// Request Body:
{
  actionType: 'getLegalDetail',
  id: 'case-123'
}

// Response:
{
  success: true,
  data: {
    id: 'case-123',
    type: 'case',
    title: '전세사기 관련 판례',
    content: '...(전체 내용)...',
    court: '대법원',
    caseNumber: '2023다123456',
    date: '2023-05-15',
    url: 'https://...'
  }
}
```

#### 4.3 인기 검색어 조회

```typescript
// 인기 검색어 조회
const result = await legalAPI.getPopularKeywords();

// Request Body:
{
  actionType: 'getPopularKeywords'
}

// Response:
{
  success: true,
  keywords: ['전세사기', '임대차보호법', '확정일자', '계약해지', '보증금반환']
}
```

## n8n Switch 노드 설정 예시

### 체크리스트 웹훅의 n8n 플로우

```
Webhook Trigger
  ↓
Switch ({{ $json.actionType }})
  ├─ Case: exportPDF → PDF 생성 로직
  ├─ Case: sendEmail → 이메일 전송 로직
  ├─ Case: issueRegistry → 등기부등본 API 호출
  ├─ Case: checkInsurance → 보증보험 확인 로직
  └─ Case: analyzeRisk → 위험도 분석 로직
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

## 개발 모드 테스트

환경 변수가 설정되지 않은 경우, 각 API는 Mock 데이터를 반환하여 프론트엔드 개발을 계속할 수 있습니다.

```bash
# 환경 변수 없이 개발 서버 실행
npm run dev
```