import { apiClient } from './index';
import { env } from '../config/env';
import type { ChecklistTab, ScanResponse, InsuranceCheckResponse } from '../types';

/**
 * 체크리스트 관련 API
 * 모든 요청은 동일한 웹훅 URL로 전송되며, actionType으로 분기됨
 */
export const checklistAPI = {
/**
   * 문서 정밀 분석 (계약서, 등기부등본, 건축물대장 꼼꼼히 살펴보기)
   * actionType: "analyzeDocuments"
   * n8n Workflow: 문서로직0500.json -> Switch Node (analyzeDocuments)
   */
  analyzeDocuments: async (files: File[], docType: '임대차계약서' | '등기부등본' | '건축물대장'): Promise<ScanResponse> => {
    try {
      const formData = new FormData();

      // actionType 및 docType 추가
      formData.append('actionType', 'analyzeDocuments');
      formData.append('docType', docType);

      // 파일들 추가 (n8n Webhook의 binaryPropertyName: "file" 설정에 따름)
      files.forEach((file) => {
        formData.append('file', file);
      });

      // 문서 분석은 Scan Webhook Endpoint 사용
      const response = await apiClient.post(env.scanWebhookUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Failed to analyze document:', error);
      // Mock response for development or error fallback
      return {
        success: false,
        message: '문서 정밀 분석 서버와 연결할 수 없습니다.',
        analysis: {
          riskGrade: 'low',
          summary: '서버 연결 오류',
          issues: [
            {
              title: '서버 연결 오류',
              description: '문서 정밀 분석 서버와 연결할 수 없습니다.',
              severity: 'warning',
            },
          ],
          autoCheckItems: [],
        },
      };
    }
  },

  /**
   * PDF 다운로드
   * actionType: "exportPDF"
   */
  exportPDF: async (checklistData: ChecklistTab[]): Promise<{ success: boolean; downloadUrl?: string }> => {
    try {
      const response = await apiClient.post(env.checklistWebhookUrl, {
        actionType: 'exportPDF',
        // 해커톤 데모용 Hardcoded User ID (API_USAGE.md 참고)
        userId: '61a8fc1d-67b0-45db-b913-602654b45c3c',
        checklistData,
      });

      return response.data;
    } catch (error) {
      console.error('Failed to export PDF:', error);
      return { success: false };
    }
  },

  /**
   * 이메일 전송
   * actionType: "sendEmail"
   */
  sendEmail: async (email: string, checklistData: ChecklistTab[]): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await apiClient.post(env.checklistWebhookUrl, {
        actionType: 'sendEmail',
        // 해커톤 데모용 Hardcoded User ID
        userId: '61a8fc1d-67b0-45db-b913-602654b45c3c',
        email,
        checklistData,
      });

      return response.data;
    } catch (error) {
      console.error('Failed to send email:', error);
      return {
        success: false,
        message: '이메일 전송에 실패했습니다.',
      };
    }
  },

  /**
   * 보증보험 가입 가능 여부 확인
   * actionType: "checkInsurance"
   */
  checkInsurance: async (registryFile: File, buildingFile: File, deposit: number): Promise<InsuranceCheckResponse> => {
    try {
      const formData = new FormData();

      formData.append('actionType', 'checkInsurance');

      // n8n '분기처리' 노드 기준: file0=등기부등본, file1=건축물대장
      formData.append('file0', registryFile);
      formData.append('file1', buildingFile);
      // 보증금 및 고정된 사용자 ID 추가
      formData.append('target_deposit', deposit.toString());
      formData.append('userId', '61a8fc1d-67b0-45db-b913-602654b45c3c');

      const response = await apiClient.post(env.scanWebhookUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Failed to check insurance eligibility:', error);
      return {
        success: false,
        status: 'FAIL',
        message: '보증보험 확인 서버와 연결할 수 없습니다.',
      };
    }
  },
  
  /**
   * [수정됨] 깡통전세 위험도 분석
   * n8n 요구 변수명: address, exclusiveArea, type, deposit
   */
  analyzeRisk: async (propertyInfo: {
    address: string;
    deposit: number;
    area: number;
    propertyType: '아파트' | '오피스텔' | '연립,다세대주택' | '단독,다가구';
  }): Promise<{
    success: boolean;
    result: {
      riskLevel: 'safe' | 'warning' | 'danger';
      ratio: number;
      message: string;
      graphData: {
        safeLine: number;
        current: number;
      };
      extraToWarning_만원: number;
      extraToDanger_만원: number;
      mortgageMessage: string;
    };
  }> => {
    try {
      const response = await apiClient.post(env.checklistWebhookUrl, {
        actionType: 'analyzeRisk',
        // n8n 변수명 매핑
        'address': propertyInfo.address,
        'deposit': propertyInfo.deposit,
        'exclusiveArea': propertyInfo.area,
        'type': propertyInfo.propertyType,
      });

      return response.data;
    } catch (error) {
      console.error('Failed to analyze risk:', error);
      return {
        success: false,
        result: {
          riskLevel: 'warning',
          ratio: 0,
          message: '위험도 분석에 실패했습니다.',
          graphData: {
            safeLine: 70,
            current: 0,
          },
          extraToWarning_만원: 0,
          extraToDanger_만원: 0,
          mortgageMessage: '',
        },
      };
    }
  },

  /**
   * [통합됨] 분석 결과 PDF 다운로드
   * n8n actionType: exportAnalysisPDF
   */
  exportAnalysisPDF: async (analysisResult: any, fileKey?: string): Promise<{ success: boolean; downloadUrl?: string; message?: string }> => {
    try {
      const response = await apiClient.post(env.checklistWebhookUrl, {
        actionType: 'exportAnalysisPDF',
        analysisResult,
        fileKey, // PDF 생성을 위한 원본 파일 키 추가
      });

      return response.data;
    } catch (error) {
      console.error('Failed to export document analysis PDF:', error);
      return {
        success: false,
        message: '문서 분석 결과 PDF 생성에 실패했습니다.',
      };
    }
  },

  /**
   * [통합됨] 분석 결과 이메일 전송
   * n8n actionType: sendAnalysisEmail
   */
  sendAnalysisEmail: async (analysisResult: any, fileKey?: string): Promise<{ success: boolean; downloadUrl?: string; message?: string }> => {
    try {
      const response = await apiClient.post(env.checklistWebhookUrl, {
        actionType: 'sendAnalysisEmail',
        analysisResult,
        fileKey, // PDF 생성을 위한 원본 파일 키 추가
      });

      return response.data;
    } catch (error) {
      console.error('Failed to send document analysis email:', error);
      return {
        success: false,
        message: '문서 분석 결과 이메일 전송에 실패했습니다.',
      };
    }
  }
};