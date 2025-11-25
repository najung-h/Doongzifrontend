# 🏗️ Doongzi Frontend - 전체 프로젝트 구조 분석 (상세)

**분석 일시**: 2024년 11월 25일
**분석 범위**: src/ 디렉토리의 모든 파일 및 폴더 구조
**결론**: 기초는 견고하지만 **아키텍처 개선이 필요한 상태** (점수: 5.4/10)

---

## 1️⃣ 프로젝트 파일 구성

### 전체 파일 목록 (77개)

```
src/
├── api/                    (5개 파일)
│   ├── index.ts           Axios 인스턴스 + 인터셉터 ✅
│   ├── chatbot.ts         sendMessage만 구현 (searchLegal 없음)
│   ├── scan.ts            analyzeDocuments, analyzeDetailedDocument ✅
│   ├── checklist.ts       exportPDF, sendEmail, analyzeRisk 등 ✅
│   └── legal.ts           searchLegal, getLegalDetail, getPopularKeywords ✅
│
├── pages/                  (6개 파일)
│   ├── HomePage.tsx
│   ├── ChatbotPage.tsx
│   ├── ChecklistPage.tsx
│   ├── ScanPage.tsx
│   ├── SearchPage.tsx      (legalAPI 사용)
│   └── MyPage.tsx
│
├── components/
│   ├── common/             (5개 파일)
│   │   ├── Navigation.tsx  페이지 네비게이션
│   │   ├── Header.tsx      페이지 헤더
│   │   ├── FloatingChatButton.tsx
│   │   ├── FloatingChatWidget.tsx (api/chatbot 직접 호출)
│   │   └── GlobalNav.tsx
│   │
│   ├── ui/                 (55개 파일 - Radix UI 래퍼)
│   │   ├── button.tsx, card.tsx, dialog.tsx, input.tsx, tabs.tsx
│   │   ├── accordion.tsx, alert.tsx, avatar.tsx, badge.tsx, ...
│   │   ├── use-mobile.ts, utils.ts
│   │   └── 50+ 추가 UI 컴포넌트
│   │
│   └── figma/              (1개 파일)
│       └── ImageWithFallback.tsx
│
├── types/                  (1개 파일)
│   └── index.ts            240+ 라인의 타입 정의 ✅
│
├── config/                 (1개 파일)
│   └── env.ts              환경 변수 관리 + 검증 ✅
│
├── App.tsx                 라우터 설정 (6개 페이지)
├── main.tsx                React 부트스트랩
└── index.html              (root에 이동)
```

---

## 2️⃣ 심각한 문제점 (🔴 P0)

### 문제 1: chatbot.ts vs legal.ts 역할 분담 혼란

**현재 상태:**
```typescript
// chatbot.ts
export const chatbotAPI = {
  sendMessage: async (...) => { /* ✅ 구현됨 */ }
  // ❌ searchLegal이 없음
};

// legal.ts (별도 파일)
export const legalAPI = {
  searchLegal: async (...) => { /* ✅ 구현됨 */ }
  getLegalDetail: async (...) => { /* ✅ 구현됨 */ }
  getPopularKeywords: async (...) => { /* ✅ 구현됨 */ }
};

// SearchPage.tsx
import { legalAPI } from '../api/legal';  // ✅ 올바르게 사용 중
```

**실제 상황:**
- ✅ API 구현은 올바르게 되어 있음
- ✅ SearchPage도 legalAPI를 올바르게 사용
- ⚠️ 하지만 chatbot.ts 파일명이 혼란을 야기

**권장사항:**
```
현재: api/chatbot.ts (sendMessage만)
     api/legal.ts (searchLegal, getLegalDetail, getPopularKeywords)

권장: api/chat.ts (sendMessage)
     api/legal.ts (searchLegal, getLegalDetail, getPopularKeywords)
```

---

### 문제 2: 타입 정의와 API 응답 불일치

#### 2.1 ChatResponse 불일치
```typescript
// types/index.ts
export interface ChatResponse extends BaseResponse {
  reply: string;
  conversation_id?: string;
}

export interface BaseResponse {
  success: boolean;
  message?: string;
}

// 실제 API 응답 (API_USAGE.md)
{
  reply: '...',
  conversation_id: '...'
  // ❌ success 필드가 없을 수 있음!
}

// 실제 fallback 응답 (chatbot.ts)
{
  reply: '죄송합니다...',
  conversation_id: conversationId,
  // ❌ success 필드 없음!
}
```

**문제점:**
- ChatResponse는 BaseResponse를 상속받아 success 필드를 가져야 함
- 그러나 실제 API 응답에는 success가 없을 수 있음
- 페이지에서 `response.success` 확인 시 undefined일 수 있음

#### 2.2 AnalysisResult 타입 정의 모호
```typescript
export interface AnalysisResult {
  riskLevel: number;           // 0-100? 0-1? 백분율?
  riskGrade: RiskGrade;        // 'low' | 'medium' | 'high'
  summary: string;
  issues: ScanIssue[];
  recommendations?: string[];  // 옵션
  autoCheckItems?: AutoCheckItem[]; // 옵션
}
```

**문제점:**
- `riskLevel`의 범위가 명확하지 않음
- 스캔 결과에는 riskLevel이 숫자로 나오는데, UI에서는 riskGrade만 사용
- 필드들이 선택적(optional)이라서 실제 데이터 구조 불명확

#### 2.3 ChecklistItem 타입 중복
```typescript
// types/index.ts에서:
export type ChecklistItem = { ... };

// ChecklistPage.tsx에서:
type ChecklistItem = {
  id: string;
  title: string;
  whatIsIt?: string;
  whyDoIt?: string;
  completed?: boolean;
  subItems?: SubChecklistItem[];
  buttons?: Array<{...}>;
  isGroup?: boolean;
};
```

**문제점:**
- 같은 이름의 타입이 두 곳에서 정의됨
- 로컬 타입이 types/index.ts의 정의와 다름
- 타입 동기화 필요

---

### 문제 3: 50+ UI 컴포넌트 (비현실적)

**components/ui/ 디렉토리의 55개 파일:**

실제로 사용 중인 것:
- ✅ button.tsx
- ✅ card.tsx
- ✅ dialog.tsx
- ✅ input.tsx
- ✅ tabs.tsx
- ✅ checkbox.tsx
- ✅ label.tsx
- ✅ progress.tsx (약 10개)

불필요하거나 미사용:
- ❌ accordion.tsx
- ❌ alert.tsx, alert-dialog.tsx
- ❌ aspect-ratio.tsx
- ❌ avatar.tsx, badge.tsx
- ❌ breadcrumb.tsx
- ❌ calendar.tsx, carousel.tsx, chart.tsx
- ❌ collapsible.tsx, command.tsx, context-menu.tsx
- ❌ drawer.tsx, dropdown-menu.tsx
- ❌ form.tsx
- ❌ hover-card.tsx
- ❌ input-otp.tsx
- ❌ menubar.tsx, navigation-menu.tsx
- ❌ pagination.tsx, popover.tsx
- ❌ radio-group.tsx, resizable.tsx
- ❌ scroll-area.tsx, select.tsx, separator.tsx
- ❌ sheet.tsx, sidebar.tsx, skeleton.tsx
- ❌ slider.tsx, sonner.tsx, switch.tsx
- ❌ table.tsx, textarea.tsx
- ❌ toggle.tsx, toggle-group.tsx, tooltip.tsx
- (약 45개가 사용되지 않음)

**영향:**
- 📦 번들 크기 증가 (불필요한 컴포넌트 코드)
- 🤔 개발자 혼란 (어떤 컴포넌트를 써야 할지 불명확)
- 🔧 유지보수 어려움 (사용하지 않는 것들도 관리 필요)

---

### 문제 4: env.ts의 불필요한 타입 가드

```typescript
// 현재
chatbotWebhookUrl: (typeof import.meta !== 'undefined' && import.meta.env?.VITE_N8N_CHATBOT_WEBHOOK_URL) || ''

// 문제점:
// 1. Vite 환경에서는 import.meta는 항상 존재
// 2. typeof 검사가 불필요함
// 3. 코드 가독성 저하

// 더 간단한 방식:
chatbotWebhookUrl: import.meta.env.VITE_N8N_CHATBOT_WEBHOOK_URL || ''
```

---

## 3️⃣ 아키텍처 문제 (🟡 P1)

### 문제 5: 폴더 구조가 도메인 중심이 아님

**현재 구조 (기술 계층별):**
```
src/
├── api/            # 모든 API 함수
├── pages/          # 모든 페이지
├── components/     # 모든 컴포넌트
├── types/          # 모든 타입
└── config/         # 모든 설정
```

**문제점:**
- 페이지와 API의 관계가 불명확함
- 새로운 기능 추가 시 여러 폴더를 건드려야 함
- 기능별 의존성 추적 어려움
- 규모가 커질수록 유지보수 어려워짐

**더 나은 구조 (도메인/기능 중심):**
```
src/
├── features/
│   ├── chat/
│   │   ├── pages/
│   │   │   └── ChatbotPage.tsx
│   │   ├── components/
│   │   │   ├── FloatingChatWidget.tsx
│   │   │   └── ChatMessage.tsx
│   │   ├── api/
│   │   │   └── index.ts (sendMessage)
│   │   └── types/
│   │       └── index.ts (ChatMessage, ChatResponse)
│   │
│   ├── scan/
│   │   ├── pages/
│   │   │   └── ScanPage.tsx
│   │   ├── components/
│   │   ├── api/
│   │   └── types/
│   │
│   ├── checklist/
│   ├── search/
│   └── mypage/
│
├── shared/
│   ├── components/
│   │   ├── Navigation.tsx
│   │   ├── Header.tsx
│   │   └── GlobalNav.tsx
│   ├── ui/          # 실제로 사용하는 UI 컴포넌트만 (10-15개)
│   ├── types/       # 공통 타입
│   └── hooks/       # 커스텀 hooks
│
└── core/
    ├── config/
    │   └── env.ts
    ├── routing/
    │   └── App.tsx
    └── styles/
        └── globals.css
```

---

### 문제 6: API 레이어가 너무 단순함

**현재 상태:**
```typescript
// 단순 함수만 있음
export const chatbotAPI = {
  sendMessage: async (query, conversationId) => {
    try {
      const response = await apiClient.post(env.chatbotWebhookUrl, {...});
      return response.data;
    } catch (error) {
      return { fallback };
    }
  }
};
```

**부족한 기능들:**
- ❌ 캐싱 (같은 검색 반복 시 API 호출)
- ❌ 재시도 (네트워크 오류 시 자동 재시도)
- ❌ 요청 취소 (페이지 이동 시 미해결 요청 취소)
- ❌ 에러 분류 (어떤 종류의 에러인지 구분 안 함)
- ❌ 응답 검증 (받은 데이터가 유효한지 확인 안 함)

**더 나은 패턴:**
```typescript
type ApiError = {
  code: string;
  message: string;
  details?: unknown;
};

type Result<T> =
  | { success: true; data: T }
  | { success: false; error: ApiError };

export const chatbotAPI = {
  sendMessage: async (query, conversationId): Promise<Result<ChatResponse>> => {
    // 캐시 확인
    // API 호출 (취소 가능)
    // 응답 검증
    // 에러 분류
  }
};
```

---

### 문제 7: 컴포넌트 캡슐화 부족

**문제점:**
```typescript
// FloatingChatWidget.tsx
import { chatbotAPI } from '../../api/chatbot';

export function FloatingChatWidget() {
  const handleSend = async () => {
    const response = await chatbotAPI.sendMessage(input);
    // ❌ 컴포넌트가 API를 직접 호출
  };
}
```

**문제:**
- 컴포넌트가 API에 강하게 결합됨
- 테스트 시 API를 Mock할 수 없음
- 다른 곳에서 재사용 어려움
- 로직을 따로 테스트할 수 없음

**더 나은 패턴:**
```typescript
// CustomHook으로 분리
export function useChatbot() {
  const [messages, setMessages] = useState([]);

  const sendMessage = async (query: string) => {
    const response = await chatbotAPI.sendMessage(query);
    setMessages([...messages, response]);
  };

  return { messages, sendMessage };
}

// 컴포넌트에서는 hook만 사용
function ChatMessage() {
  const { messages, sendMessage } = useChatbot();
  // 테스트 가능, 재사용 가능
}
```

---

### 문제 8: 데이터 흐름이 명확하지 않음

**ScanPage → ChecklistPage 연동:**
```
ScanPage에서:
  analyzeDocuments() 호출
  → autoCheckItems 반환 (예: [{ id: 'owner_match', completed: true }])
  → ChecklistPage로 네비게이션?

ChecklistPage에서:
  어떻게 ScanPage의 결과를 받는가?
  → 라우터 state? localStorage? Context? 불명확!
```

**문제:**
- 페이지 간 데이터 전달 방식이 불명확
- 새로고침 시 데이터 손실 가능성
- 상태 관리 방식이 정해지지 않음

---

## 4️⃣ 타입 안정성 문제

### 타입 불일치 정리

| 항목 | 문제 | 영향 |
|------|------|------|
| ChatResponse | success 필드 불명확 | 런타임 에러 가능성 |
| AnalysisResult | riskLevel 범위 모호 | UI 렌더링 오류 |
| ChecklistItem | 로컬/글로벌 정의 중복 | 유지보수 어려움 |
| API 응답 | 검증 없음 | 잘못된 데이터 처리 |

---

## 5️⃣ 현재 구조 점수 평가

| 카테고리 | 점수 | 평가 |
|---------|------|------|
| 기초 설정 | 8/10 | ✅ React, TypeScript, Vite 견고함 |
| 폴더 구조 | 5/10 | ⚠️ 기술 계층별, 도메인 중심으로 개선 필요 |
| API 설계 | 6/10 | ⚠️ 기능은 있으나 고도화 필요 |
| 타입 안정성 | 6/10 | ⚠️ 정의는 있으나 불일치 있음 |
| 컴포넌트 설계 | 4/10 | ❌ 50+ UI 컴포넌트 과다, 캡슐화 부족 |
| 에러 처리 | 5/10 | ⚠️ 기본만 구현, 분류 없음 |
| 테스트 가능성 | 4/10 | ❌ API 직접 호출로 테스트 어려움 |
| 유지보수성 | 5/10 | ⚠️ 규모 커질수록 어려워질 구조 |
| **평균** | **5.4/10** | ⚠️ **개선이 필요한 상태** |

---

## 6️⃣ 우선순위별 개선 방안

### P0 - 즉시 필요 (1주일)

1. **ChatResponse 타입 수정**
   ```typescript
   export interface ChatResponse extends BaseResponse {
     reply?: string;           // optional로 변경
     conversation_id?: string;
   }
   ```

2. **ChecklistItem 타입 통일**
   - ChecklistPage의 로컬 타입 삭제
   - types/index.ts의 정의 사용

3. **env.ts 간소화**
   ```typescript
   chatbotWebhookUrl: import.meta.env.VITE_N8N_CHATBOT_WEBHOOK_URL || ''
   ```

4. **chatbot.ts 파일명 변경**
   - `api/chatbot.ts` → `api/chat.ts` (searchLegal이 없으므로)

---

### P1 - 중요 (2주일)

1. **UI 컴포넌트 정리**
   - 사용하지 않는 40+ 컴포넌트 제거
   - 필요한 것만 10-15개 유지

2. **폴더 구조 개선**
   - 도메인/기능 중심으로 재구성
   - features/ 폴더 생성

3. **타입 정의 분리**
   - types/index.ts → types/api.ts, types/domain.ts 등으로 분할

4. **API 에러 타입 정의**
   ```typescript
   type ApiError = { code: string; message: string };
   type Result<T> = { success: true; data: T } | { success: false; error: ApiError };
   ```

---

### P2 - 선택 (3주일 이후)

1. API 캐싱 추가
2. 요청 취소 지원 (AbortController)
3. 응답 검증 (Validation)
4. 커스텀 hooks로 로직 분리
5. 단위 테스트 작성

---

## 7️⃣ 결론

### "현재 구조가 충분히 좋은가?"

**답: 아니오. 기초는 견고하지만 프로덕션 수준의 아키텍처가 필요하다.**

### 핵심 이슈:

1. ✅ **장점:**
   - React 18 + TypeScript 기초 견고
   - 6개 페이지 라우팅 잘 설계됨
   - API 구현은 완료됨 (파일명 제외)
   - 환경 변수 관리 체계 있음

2. ❌ **단점:**
   - 폴더 구조가 도메인 중심이 아님
   - 50+ UI 컴포넌트는 비현실적
   - 타입 정의와 API 응답 불일치
   - 컴포넌트 캡슐화 부족
   - 에러 처리 미흡

### 권장 액션:

1. **즉시 (이번 주)**: P0 항목 4개 수정
2. **1-2주**: P1 항목 4개 개선
3. **3주 이후**: P2 항목 진행

### 예상 타임라인:
- **3-4주**: 구조 개선 완료
- **5-6주**: 프로덕션 준비

---

## 📋 체크리스트

- [ ] P0-1: ChatResponse 타입 수정
- [ ] P0-2: ChecklistItem 타입 통일
- [ ] P0-3: env.ts 간소화
- [ ] P0-4: chatbot.ts 파일명 변경
- [ ] P1-1: UI 컴포넌트 정리
- [ ] P1-2: 폴더 구조 개선
- [ ] P1-3: 타입 정의 분리
- [ ] P1-4: API 에러 타입 정의
- [ ] P2-1: API 캐싱 추가
- [ ] P2-2: 요청 취소 지원
- [ ] P2-3: 응답 검증
- [ ] P2-4: 커스텀 hooks
- [ ] P2-5: 단위 테스트
