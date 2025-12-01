// ==========================================
// 1. Common & Base Types
// ==========================================
export type DocumentDataType = 'registry' | 'contract' | 'building'; // 새 타입 추가

export type ActionType =
  // CHATBOT Service
  | 'sendMessage'                                                     // 챗봇 메시지 전송
  | 'searchLegal'                                                     // 법률 검색

  // SCAN Service (문서 분석)
  | 'analyzeDocuments'                                                // 문서 통합 분석 (등기부/계약서/건축물대장)
  | 'scanDocuments'                                         // 상세 문서 분석 (이메일 리포트)
  | 'checkInsurance'                                                  // 보증보험 가입 확인
  
  // CHECKLIST Service
  | 'exportPDF'                                                       // 체크리스트 PDF 다운로드
  | 'sendEmail'                                                       // 체크리스트 이메일 전송
  | 'analyzeRisk'                                                     // 깡통전세 위험도 분석
  | 'exportAnalysisPDF'                                               // 통합: 분석 결과 PDF 다운로드 (dataType 구분)
  | 'sendAnalysisEmail';                                              // 통합: 분석 결과 이메일 전송 (dataType 구분)
  
export interface BaseResponse {
  success: boolean;
  message?: string;
}

// ==========================================
// 2. Chat Service Types (어미새 챗봇 & 법률 사전)
// ==========================================
export type MessageRole = 'user' | 'assistant';

export interface Message {
  role: MessageRole;
  content: string;
  timestamp?: Date;
}

// Alias for backwards compatibility
export type ChatMessage = Message;

export interface LegalSearchResult {
  title: string;
  summary: string;
  link: string;
}

// API Request/Response Types
export interface ChatRequest {
  messages: Array<{
    role: string;
    content: string;
  }>;
}

export interface ChatResponse extends BaseResponse {
  success: boolean;
  answer: string;
  full_log?: any;
}

export interface LegalSearchResponse extends BaseResponse {
  results: LegalSearchResult[];
}

// ==========================================
// 3. Document Service Types (둥지 스캔)
// ==========================================
export type RiskGrade = 'low' | 'medium' | 'high';
export type IssueSeverity = 'warning' | 'danger';

export interface ScanIssue {
  title: string;
  severity: IssueSeverity;
  description: string;
}

// Backwards compatibility
export type RiskIssue = ScanIssue;

export interface AutoCheckItem {
  id: string;
  completed: boolean;
  reason?: string; // UI 표시용 설명
}

export interface ToxicClause {
  article: string;        // 예: "제 5조 (수선)"
  original: string;       // 원문
  risk: string;           // 위험 사유
  recommendation: string; // 수정 권고안
}

export interface AnalysisResult {
  riskGrade: RiskGrade;
  summary: string;
  issues: ScanIssue[];
  autoCheckItems: AutoCheckItem[];
}

// 기존 ScanResponse 인터페이스를 수정하거나 확장합니다.
export interface ScanResponse extends BaseResponse {
  analysis: AnalysisResult;
  uploadedFiles?: Array<{
    filename: string;
    url: string;
  }>;
  result?: string; // n8n에서 보내주는 HTML 문자열을 받을 필드 추가
}

export interface DeepAnalysisResponse extends BaseResponse {
  report: {
    score: number;
    toxicClauses: ToxicClause[];
    safeClauses: string[];
  };
}

export interface RegistryResponse extends BaseResponse {
  registryUrl?: string;
  requestId?: string;
  estimatedTime?: number;
}

// ==========================================
// 4. Checklist Service Types (둥지 짓기 플랜)
// ==========================================
export type RiskLevel = 'safe' | 'warning' | 'danger';

export interface RiskCheckResponse extends BaseResponse {
  result: {
    riskLevel: RiskLevel;
    ratio: number;       // 전세가율
    message: string;
    graphData: {
      safeLine: number;  // 안전 기준선 (예: 70%)
      current: number;   // 현재 전세가율
    };
  };
}

export interface RiskAnalysisRequest {
  address: string;       // 도로명 주소
  deposit: number;       // 보증금 (만원)
  area: number;          // 전용면적 (㎡)
  propertyType: '아파트' | '오피스텔' | '연립,다세대주택' | '단독,다가구';
}

export interface RiskAnalysisResponse extends BaseResponse {
  riskLevel: string;
  riskScore: number;
  recommendations?: string[];
}

export interface InsuranceCheckRequest {
  address: string;
  deposit: number;
  monthlyRent?: number;
}

// 보증보험 체크 결과 타입
export type InsuranceVerdict = 'PASS' | 'FAIL' | 'REVIEW_REQUIRED';

export interface InsuranceFailedItem {
  id: string;
  question: string;
  reason: string;
}

export interface InsuranceReviewItem {
  id: string;
  question: string;
  reason_why: string;
}

export interface InsuranceCheckResponse extends BaseResponse {
  status: InsuranceVerdict;
  failedItems?: InsuranceFailedItem[];
  reviewItems?: InsuranceReviewItem[];
  details?: string;
}

export interface ExportPDFResponse extends BaseResponse {
  pdfUrl?: string;
}

export interface SendEmailResponse extends BaseResponse {
  // message inherited from BaseResponse
}

// UI Management Types
export interface ChecklistItem {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  helpKeyword?: string; // 챗봇 질문용 키워드
}

export interface ChecklistTab {
  id: 'before' | 'during' | 'after';
  name: string;
  items: ChecklistItem[];
}

// ==========================================
// 5. ERD-based Database Types
// ==========================================
export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  createdAt: Date;
}

export interface Property {
  id: string;
  userId: string;
  address: string;
  propertyType: 'apartment' | 'villa' | 'officetel' | 'house';
  contractType: 'jeonse' | 'monthly' | 'purchase';
  deposit?: number;
  monthlyRent?: number;
  nickname?: string;
  createdAt: Date;
}

export interface DocumentFile {
  id: string;
  propertyId: string;
  fileKey: string;
  fileName: string;
  fileType: 'registry' | 'contract' | 'land';
  uploadedAt: Date;
}

export interface Conversation {
  id: string;
  userId: string;
  title: string;
  lastMessage?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface URLResource {
  id: string;
  userId: string;
  url: string;
  title: string;
  description?: string;
  category?: string;
  savedAt: Date;
}

// ==========================================
// 6. Legal Search Types
// ==========================================
export interface LegalCase {
  id: string;
  type: 'case' | 'law';
  title: string;
  court?: string;
  caseNumber?: string;
  lawName?: string;
  article?: string;
  summary?: string;
  date?: string;
}
