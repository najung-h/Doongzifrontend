# 체크리스트 ActionType 연결 현황

## 총 6개 ActionType → CHECKLIST Webhook 사용

Endpoint: `VITE_N8N_CHECKLIST_WEBHOOK_URL` (`/api/checklist`)

통합된 ActionType은 dataType 필드를 사용하여 보고서의 종류(registry, contract, building)를 구분합니다.

---

## 1. 페이지 상단 (2개)

### 1.1 체크리스트 전체 PDF 다운로드
- **ActionType:** `exportPDF`
- **API:** `checklistAPI.exportPDF(checklist)`
- **요청 데이터:** `{ actionType: 'exportPDF', checklistData }`
- **응답:** `{ success, pdfUrl }`

### 1.2 체크리스트 전체 이메일 전송
- **ActionType:** `sendEmail`
- **API:** `checklistAPI.sendEmail(email, checklist)`
- **요청 데이터:** `{ actionType: 'sendEmail', email, checklistData }`
- **응답:** `{ success, message }`

---

## 2. 체크리스트 항목 버튼 (2개)

### 2.1 깡통전세 위험도 분석
- **ActionType:** `analyzeRisk`
- **API:** `checklistAPI.analyzeRisk(propertyInfo)`
- **요청 데이터:** `{ actionType: 'analyzeRisk', propertyInfo: { address, deposit, area, propertyType } }`
- **응답:** `{ success, riskLevel, riskScore, message, recommendations }`

### 2.2 보증보험 가입 가능 여부 확인
- **ActionType:** `checkInsurance`
- **API:** `checklistAPI.checkInsurance(propertyInfo)`
- **요청 데이터:** `{ actionType: 'checkInsurance', propertyInfo: { address, deposit, monthlyRent } }`
- **응답:** `{ success, eligible, message, details }`

---

## 3. 문서 분석 결과 후속 처리 (2개)

### 3.1 분석결과 PDF 다운로드
- **ActionType:** `exportAnalysisPDF`
- **요청 데이터:**
  ```json
  {
    "actionType": "exportAnalysisPDF",
    "dataType": "registry" | "contract" | "building", // 보고서 유형
    "analysisResult": { ... } 
  }
  ```
- **응답:** `{ success, pdfUrl, message }`

### 3.2 분석결과 이메일 전송
- **ActionType:** `sendAnalysisEmail`
- **요청 데이터:** 
  ```json
  {
    "actionType": "sendAnalysisEmail",
    "dataType": "registry" | "contract" | "building", // 보고서 유형
    "email": "user@example.com",
    "analysisResult": { ... }
  }
  ```
- **응답:** `{ success, message }`

---

## n8n Switch 노드 설정

### 1. Webhook 노드 → Switch 노드 연결

### 2. Switch 노드 설정
- **Mode:** `Rules`
- **Data Property Name:** `actionType` (또는 `{{ $json.actionType }}`)

### 3. 6개 분기 규칙 추가

각 규칙마다:
- **Condition:** `Equal`
- **Value:** actionType 값 입력

```
Rule 0:  actionType = "exportPDF"                      → Output 0
Rule 1:  actionType = "sendEmail"                      → Output 1
Rule 2:  actionType = "analyzeRisk"                    → Output 2
Rule 3:  actionType = "checkInsurance"                 → Output 3
Rule 4:  actionType = "exportAnalysisPDF"              → Output 4
Rule 5:  actionType = "sendAnalysisEmail"              → Output 5
```

### 4. 통합 Output 내부 처리 로직 (예시: Output 4)
```
Output 4 (exportAnalysisPDF)
  ↓
Switch (dataType 분기)
  ├─ Condition: dataType = "registry"  → 레지스트리 PDF 생성 로직
  ├─ Condition: dataType = "contract"  → 계약서 PDF 생성 로직
  └─ Condition: dataType = "building"  → 건축물대장 PDF 생성 로직
```

---

## 플로우 다이어그램

```
Webhook (CHECKLIST)
  ↓
Switch (actionType 분기 - 6 branches)
  ├─ Output 0 (exportPDF)           → PDF 생성 → 응답
  ├─ Output 1 (sendEmail)           → 이메일 전송 → 응답
  ├─ Output 2 (analyzeRisk)         → 위험도 분석 → 응답
  ├─ Output 3 (checkInsurance)      → 보험 확인 → 응답
  ├─ Output 4 (exportAnalysisPDF)   → Sub-Switch (dataType) → PDF 생성 → 응답
  └─ Output 5 (sendAnalysisEmail)   → Sub-Switch (dataType) → 이메일 전송 → 응답
```

---

## API 파일 위치
- **API 함수:** `src/api/checklist.ts` (기존 6개 함수 제거 및 2개 통합 함수 추가 필요)
- **타입 정의:** `src/types/index.ts` (`ActionType` Enum에 통합된 타입 추가 필요)
- **axios 설정:** `src/api/index.ts`

---

## 통합 요청 예시 및 응답 스펙

### 분석 결과 PDF 다운로드 (`exportAnalysisPDF`)
- 등기부, 계약서, 건축물대장 분석 결과를 PDF로 생성 및 다운로드 링크 반환

```json
// 요청 예시 (Request Body)
{
  "actionType": "exportAnalysisPDF",
  "dataType": "registry", // 'registry' | 'contract' | 'building' 중 하나
  "analysisResult": {
    "riskGrade": "medium",
    "summary": "등기부 분석 결과, 근저당 설정 비율이 높습니다.",
    "issues": [
      {
        "title": "근저당 설정 확인",
        "severity": "warning",
        "description": "..."
      }
    ]
  }
}

// 응답 예시 (Response Body)
{
  "success": true,
  "pdfUrl": "https://n8n-server.com/files/registry_report_20241126.pdf",
  "message": "PDF가 성공적으로 생성되었습니다."
}
```

### 분석 결과 이메일 전송 (`sendAnalysisEmail`)

```json
// 요청 예시 (Request Body)
{
  "actionType": "sendAnalysisEmail",
  "dataType": "contract", // 'registry' | 'contract' | 'building' 중 하나
  "email": "user@example.com",
  "analysisResult": {
    "riskGrade": "low",
    "summary": "계약서 분석 결과, 독소조항이 발견되지 않았습니다.",
    "issues": []
  }
}

// 응답 예시 (Response Body)
{
  "success": true,
  "message": "user@example.com으로 보고서가 성공적으로 발송되었습니다."
}
```
