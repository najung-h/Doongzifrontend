# 체크리스트 ActionType 연결 현황

## 총 10개 버튼 → CHECKLIST Webhook 사용

**Endpoint:** `VITE_N8N_CHECKLIST_WEBHOOK_URL` (`/api/checklist`)

---

## 1. 페이지 상단 (2개)

### 1.1 체크리스트 전체 PDF 다운로드
- **ActionType:** `exportPDF`
- **Handler:** `handleExportPDF` (ChecklistPage.tsx:420)
- **API:** `checklistAPI.exportPDF(checklist)`
- **요청 데이터:** `{ actionType: 'exportPDF', checklistData }`
- **응답:** `{ success, pdfUrl }`

### 1.2 체크리스트 전체 이메일 전송
- **ActionType:** `sendEmail`
- **Handler:** `handleSendEmail` (ChecklistPage.tsx:434)
- **API:** `checklistAPI.sendEmail(email, checklist)`
- **요청 데이터:** `{ actionType: 'sendEmail', email, checklistData }`
- **응답:** `{ success, message }`

---

## 2. 체크리스트 항목 버튼 (2개)

### 2.1 깡통전세 위험도 분석
- **ActionType:** `analyzeRisk`
- **Handler:** `handleAnalyze` (RiskAnalysisModal.tsx:28)
- **API:** `checklistAPI.analyzeRisk(propertyInfo)`
- **요청 데이터:** `{ actionType: 'analyzeRisk', propertyInfo: { address, deposit, area, propertyType } }`
- **응답:** `{ success, riskLevel, riskScore, message, recommendations }`

### 2.2 보증보험 가입 가능 여부 확인
- **ActionType:** `checkInsurance`
- **Handler:** `handleCheckInsurance` (ChecklistPage.tsx:447)
- **API:** `checklistAPI.checkInsurance(propertyInfo)`
- **요청 데이터:** `{ actionType: 'checkInsurance', propertyInfo: { address, deposit, monthlyRent } }`
- **응답:** `{ success, eligible, message, details }`

---

## 3. 등기부등본 분석 모달 (2개)

### 3.1 분석결과 PDF 다운로드
- **ActionType:** `exportRegistryAnalysisPDF`
- **Handler:** `handleDownloadPDF` (RegistryAnalysisModal.tsx:104)
- **API:** `checklistAPI.exportRegistryAnalysisPDF(analysisResult)`
- **요청 데이터:** `{ actionType: 'exportRegistryAnalysisPDF', analysisResult }`
- **응답:** `{ success, pdfUrl, message }`

### 3.2 분석결과 이메일 전송
- **ActionType:** `sendRegistryAnalysisEmail`
- **Handler:** `handleSendEmail` (RegistryAnalysisModal.tsx:124)
- **API:** `checklistAPI.sendRegistryAnalysisEmail(analysisResult)`
- **요청 데이터:** `{ actionType: 'sendRegistryAnalysisEmail', analysisResult }`
- **응답:** `{ success, message }`

---

## 4. 계약서 분석 모달 (2개)

### 4.1 분석결과 PDF 다운로드
- **ActionType:** `exportContractAnalysisPDF`
- **Handler:** `handleDownloadPDF` (ContractAnalysisModal.tsx:104)
- **API:** `checklistAPI.exportContractAnalysisPDF(analysisResult)`
- **요청 데이터:** `{ actionType: 'exportContractAnalysisPDF', analysisResult }`
- **응답:** `{ success, pdfUrl, message }`

### 4.2 분석결과 이메일 전송
- **ActionType:** `sendContractAnalysisEmail`
- **Handler:** `handleSendEmail` (ContractAnalysisModal.tsx:124)
- **API:** `checklistAPI.sendContractAnalysisEmail(analysisResult)`
- **요청 데이터:** `{ actionType: 'sendContractAnalysisEmail', analysisResult }`
- **응답:** `{ success, message }`

---

## 5. 건축물대장 분석 모달 (2개)

### 5.1 분석결과 PDF 다운로드
- **ActionType:** `exportBuildingAnalysisPDF`
- **Handler:** `handleDownloadPDF` (BuildingAnalysisModal.tsx:104)
- **API:** `checklistAPI.exportBuildingAnalysisPDF(analysisResult)`
- **요청 데이터:** `{ actionType: 'exportBuildingAnalysisPDF', analysisResult }`
- **응답:** `{ success, pdfUrl, message }`

### 5.2 분석결과 이메일 전송
- **ActionType:** `sendBuildingAnalysisEmail`
- **Handler:** `handleSendEmail` (BuildingAnalysisModal.tsx:124)
- **API:** `checklistAPI.sendBuildingAnalysisEmail(analysisResult)`
- **요청 데이터:** `{ actionType: 'sendBuildingAnalysisEmail', analysisResult }`
- **응답:** `{ success, message }`

---

## n8n Switch 노드 설정 방법

### 1. Webhook 노드 → Switch 노드 연결

### 2. Switch 노드 설정
- **Mode:** `Rules`
- **Data Property Name:** `actionType` (또는 `{{ $json.actionType }}`)

### 3. 10개 분기 규칙 추가

각 규칙마다:
- **Condition:** `Equal`
- **Value:** actionType 값 입력

```
Rule 0:  actionType = "exportPDF"                      → Output 0
Rule 1:  actionType = "sendEmail"                      → Output 1
Rule 2:  actionType = "analyzeRisk"                    → Output 2
Rule 3:  actionType = "checkInsurance"                 → Output 3
Rule 4:  actionType = "exportRegistryAnalysisPDF"      → Output 4
Rule 5:  actionType = "sendRegistryAnalysisEmail"      → Output 5
Rule 6:  actionType = "exportContractAnalysisPDF"      → Output 6
Rule 7:  actionType = "sendContractAnalysisEmail"      → Output 7
Rule 8:  actionType = "exportBuildingAnalysisPDF"      → Output 8
Rule 9:  actionType = "sendBuildingAnalysisEmail"      → Output 9
```

### 4. 각 Output에 처리 로직 노드 연결
- Output 0 → PDF 생성 로직
- Output 1 → 이메일 전송 로직
- ... (각 actionType에 맞는 처리)

---

## 플로우 다이어그램

```
Webhook (CHECKLIST)
  ↓
Switch (actionType 분기)
  ├─ Output 0 (exportPDF) → PDF 생성 → 응답
  ├─ Output 1 (sendEmail) → 이메일 전송 → 응답
  ├─ Output 2 (analyzeRisk) → 위험도 분석 → 응답
  ├─ Output 3 (checkInsurance) → 보험 확인 → 응답
  ├─ Output 4 (exportRegistryAnalysisPDF) → PDF 생성 → 응답
  ├─ Output 5 (sendRegistryAnalysisEmail) → 이메일 전송 → 응답
  ├─ Output 6 (exportContractAnalysisPDF) → PDF 생성 → 응답
  ├─ Output 7 (sendContractAnalysisEmail) → 이메일 전송 → 응답
  ├─ Output 8 (exportBuildingAnalysisPDF) → PDF 생성 → 응답
  └─ Output 9 (sendBuildingAnalysisEmail) → 이메일 전송 → 응답
```

---

## API 파일 위치
- **API 함수:** `src/api/checklist.ts`
- **타입 정의:** `src/types/index.ts`
- **axios 설정:** `src/api/index.ts`

---

## 요청 예시

```json
{
  "actionType": "analyzeRisk",
  "propertyInfo": {
    "address": "서울특별시 강남구 테헤란로 123",
    "deposit": 40000,
    "area": 84,
    "propertyType": "아파트"
  }
}
```

## 응답 예시

```json
{
  "success": true,
  "riskLevel": "low",
  "riskScore": 65,
  "message": "안전한 수준입니다.",
  "recommendations": [
    "등기부등본 재확인 권장",
    "확정일자 받기"
  ]
}
```
