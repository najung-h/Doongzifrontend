import { apiClient } from './index';
import { env } from '../config/env';
import type { ChecklistTab, ScanResponse } from '../types';

/**
 * 체크리스트 관련 API
 */
export const checklistAPI = {
  /**
   * 계약서 분석
   * actionType: "analyzeContract"
   */
  analyzeContract: async (files: File[]): Promise<ScanResponse> => {
    try {
      const formData = new FormData();
      formData.append('actionType', 'analyzeContract');
      files.forEach((file) => {
        formData.append('files', file);
      });

      const response = await apiClient.post(env.checklistWebhookUrl, formData, {
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
   * 보증보험 가입 가능 여부 확인
   * actionType: "checkInsurance"
   */
  checkInsurance: async (propertyInfo: {
    address: string;
    deposit: number;
    monthlyRent?: number;
  }): Promise<{ success: boolean; eligible: boolean; message: string; details?: string }> => {
    try {
      const response = await apiClient.post(env.checklistWebhookUrl, {
        actionType: 'checkInsurance',
        propertyInfo,
      });
      return response.data;
    } catch (error) {
      console.error('Failed to check insurance eligibility:', error);
      return { success: false, eligible: false, message: '보증보험 확인에 실패했습니다.' };
    }
  },

  /**
   * 깡통전세 위험도 분석
   * actionType: "analyzeRisk"
   * Note: 프론트엔드 Modal은 'area'를 사용하고, 반환값으로 'low'|'medium'|'high'를 기대함
   */
  analyzeRisk: async (propertyInfo: {
    address: string;
    deposit: number;
    area: number;
    propertyType: '아파트' | '오피스텔' | '연립,다세대주택' | '단독,다가구';
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
        propertyInfo,
      });
      
      // API 응답이 safe/warning/danger로 올 경우를 대비한 매핑 (혹은 그대로 반환)
      // n8n에서 low/medium/high로 준다면 그대로 사용
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
   * 등기부등본 분석 결과 PDF 다운로드
   */
  exportRegistryAnalysisPDF: async (analysisResult: any): Promise<{ success: boolean; pdfUrl?: string; message?: string }> => {
    try {
      const response = await apiClient.post(env.checklistWebhookUrl, {
        actionType: 'exportRegistryAnalysisPDF',
        analysisResult,
      });
      return response.data;
    } catch (error) {
      return { success: false, message: 'PDF 생성 실패' };
    }
  },

  /**
   * 등기부등본 분석 결과 이메일 전송
   */
  sendRegistryAnalysisEmail: async (analysisResult: any): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await apiClient.post(env.checklistWebhookUrl, {
        actionType: 'sendRegistryAnalysisEmail',
        analysisResult,
      });
      return response.data;
    } catch (error) {
      return { success: false, message: '이메일 전송 실패' };
    }
  },

  /**
   * 계약서 분석 결과 PDF 다운로드
   */
  exportContractAnalysisPDF: async (analysisResult: any): Promise<{ success: boolean; pdfUrl?: string; message?: string }> => {
    try {
      const response = await apiClient.post(env.checklistWebhookUrl, {
        actionType: 'exportContractAnalysisPDF',
        analysisResult,
      });
      return response.data;
    } catch (error) {
      return { success: false, message: 'PDF 생성 실패' };
    }
  },

  /**
   * 계약서 분석 결과 이메일 전송
   */
  sendContractAnalysisEmail: async (analysisResult: any): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await apiClient.post(env.checklistWebhookUrl, {
        actionType: 'sendContractAnalysisEmail',
        analysisResult,
      });
      return response.data;
    } catch (error) {
      return { success: false, message: '이메일 전송 실패' };
    }
  },

  /**
   * 건축물대장 분석 결과 PDF 다운로드
   */
  exportBuildingAnalysisPDF: async (analysisResult: any): Promise<{ success: boolean; pdfUrl?: string; message?: string }> => {
    try {
      const response = await apiClient.post(env.checklistWebhookUrl, {
        actionType: 'exportBuildingAnalysisPDF',
        analysisResult,
      });
      return response.data;
    } catch (error) {
      return { success: false, message: 'PDF 생성 실패' };
    }
  },

  /**
   * 건축물대장 분석 결과 이메일 전송
   */
  sendBuildingAnalysisEmail: async (analysisResult: any): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await apiClient.post(env.checklistWebhookUrl, {
        actionType: 'sendBuildingAnalysisEmail',
        analysisResult,
      });
      return response.data;
    } catch (error) {
      return { success: false, message: '이메일 전송 실패' };
    }
  },
};