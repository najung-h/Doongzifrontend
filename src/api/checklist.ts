import { apiClient } from './index';
import { env } from '../config/env';
import type { ChecklistTab, ScanResponse } from '../types';

/**
 * 체크리스트 관련 API
 */
export const checklistAPI = {
  /**
   * 계약서 분석 (파일 업로드)
   * actionType: "analyzeDocuments"
   * URL: /api/scan
   */
  analyzeContract: async (files: File[], docType?: string): Promise<ScanResponse> => {
    try {
      const formData = new FormData();
      formData.append('actionType', 'analyzeDocuments');
      formData.append('userId', '61a8fc1d-67b0-45db-b913-602654b45c3c');
      if (docType) {
        formData.append('doc_type', docType);
      }
      files.forEach((file) => {
        formData.append('files', file);
      });

      const response = await apiClient.post(env.scanWebhookUrl, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error) {
      console.error('Failed to analyze contract:', error);
      return {
        success: false,
        message: '계약서 분석 서버와 연결할 수 없습니다.',
        analysis: {
          riskGrade: 'low',
          summary: '서버 연결 오류',
          issues: [],
          autoCheckItems: [],
        },
      };
    }
  },

  /**
   * PDF 다운로드
   * actionType: "exportPDF"
   */
  exportPDF: async (checklistData: ChecklistTab[]): Promise<{ success: boolean; pdfUrl?: string }> => {
    try {
      const response = await apiClient.post(env.checklistWebhookUrl, {
        actionType: 'exportPDF',
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
        email,
        checklistData,
      });
      return response.data;
    } catch (error) {
      console.error('Failed to send email:', error);
      return { success: false, message: '이메일 전송에 실패했습니다.' };
    }
  },
/**
   * [수정됨] 보증보험 가입 가능 여부 확인 (파일 업로드)
   * n8n 요구사항: 파일(등기부, 건축물대장) + target_deposit
   * URL: /api/scan
   */
  checkInsurance: async (formData: FormData): Promise<{
    success: boolean;
    eligible: boolean;
    message: string;
    details?: string;
  }> => {
    try {
      // n8n 워크플로우에 맞춰 actionType, userId 추가
      formData.append('actionType', 'checkInsurance');
      formData.append('userId', '61a8fc1d-67b0-45db-b913-602654b45c3c');

      const response = await apiClient.post(env.scanWebhookUrl, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error) {
      console.error('Failed to check insurance:', error);
      return {
        success: false,
        eligible: false,
        message: '보증보험 확인에 실패했습니다.',
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
    propertyType: string;
  }): Promise<{
    success: boolean;
    riskLevel: 'low' | 'medium' | 'high';
    riskScore: number;
    message: string;
    recommendations?: string[];
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
        riskLevel: 'medium',
        riskScore: 0,
        message: '위험도 분석에 실패했습니다.',
      };
    }
  },

  /**
   * [통합됨] 분석 결과 PDF 다운로드
   * n8n actionType: exportAnalysisPDF
   */
  exportAnalysisPDF: async (fileKey: string): Promise<{ success: boolean; pdfUrl?: string; message?: string }> => {
    try {
      const response = await apiClient.post(env.checklistWebhookUrl, {
        actionType: 'exportAnalysisPDF',
        fileKey,
      });
      return response.data;
    } catch (error) {
      return { success: false, message: 'PDF 생성 실패' };
    }
  },

  /**
   * [통합됨] 분석 결과 이메일 전송
   * n8n actionType: sendAnalysisEmail
   */
  sendAnalysisEmail: async (fileKey: string, email: string): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await apiClient.post(env.checklistWebhookUrl, {
        actionType: 'sendAnalysisEmail',
        fileKey,
        email
      });
      return response.data;
    } catch (error) {
      return { success: false, message: '이메일 전송 실패' };
    }
  },
};