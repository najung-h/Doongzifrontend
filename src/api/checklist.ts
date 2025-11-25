import { apiClient } from './index';
import { env } from '../config/env';
import type { ChecklistTab } from '../types';

/**
 * 체크리스트 관련 API
 * 모든 요청은 동일한 웹훅 URL로 전송되며, actionType으로 분기됨
 */
export const checklistAPI = {
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
  checkInsurance: async (propertyInfo: {
    address: string;
    deposit: number;
    monthlyRent?: number;
  }): Promise<{
    success: boolean;
    eligible: boolean;
    message: string;
    details?: string;
  }> => {
    try {
      const response = await apiClient.post(env.checklistWebhookUrl, {
        actionType: 'checkInsurance',
        propertyInfo,
      });

      return response.data;
    } catch (error) {
      console.error('Failed to check insurance eligibility:', error);
      return {
        success: false,
        eligible: false,
        message: '보증보험 확인에 실패했습니다.',
      };
    }
  },

  /**
   * 깡통전세 위험도 분석
   * actionType: "analyzeRisk"
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
   * actionType: "exportRegistryAnalysisPDF"
   */
  exportRegistryAnalysisPDF: async (analysisResult: any): Promise<{ success: boolean; pdfUrl?: string; message?: string }> => {
    try {
      const response = await apiClient.post(env.checklistWebhookUrl, {
        actionType: 'exportRegistryAnalysisPDF',
        analysisResult,
      });

      return response.data;
    } catch (error) {
      console.error('Failed to export registry analysis PDF:', error);
      return {
        success: false,
        message: '등기부등본 분석 결과 PDF 생성에 실패했습니다.',
      };
    }
  },

  /**
   * 등기부등본 분석 결과 이메일 전송
   * actionType: "sendRegistryAnalysisEmail"
   */
  sendRegistryAnalysisEmail: async (analysisResult: any): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await apiClient.post(env.checklistWebhookUrl, {
        actionType: 'sendRegistryAnalysisEmail',
        analysisResult,
      });

      return response.data;
    } catch (error) {
      console.error('Failed to send registry analysis email:', error);
      return {
        success: false,
        message: '등기부등본 분석 결과 이메일 전송에 실패했습니다.',
      };
    }
  },

  /**
   * 계약서 분석 결과 PDF 다운로드
   * actionType: "exportContractAnalysisPDF"
   */
  exportContractAnalysisPDF: async (analysisResult: any): Promise<{ success: boolean; pdfUrl?: string; message?: string }> => {
    try {
      const response = await apiClient.post(env.checklistWebhookUrl, {
        actionType: 'exportContractAnalysisPDF',
        analysisResult,
      });

      return response.data;
    } catch (error) {
      console.error('Failed to export contract analysis PDF:', error);
      return {
        success: false,
        message: '계약서 분석 결과 PDF 생성에 실패했습니다.',
      };
    }
  },

  /**
   * 계약서 분석 결과 이메일 전송
   * actionType: "sendContractAnalysisEmail"
   */
  sendContractAnalysisEmail: async (analysisResult: any): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await apiClient.post(env.checklistWebhookUrl, {
        actionType: 'sendContractAnalysisEmail',
        analysisResult,
      });

      return response.data;
    } catch (error) {
      console.error('Failed to send contract analysis email:', error);
      return {
        success: false,
        message: '계약서 분석 결과 이메일 전송에 실패했습니다.',
      };
    }
  },

  /**
   * 건축물대장 분석 결과 PDF 다운로드
   * actionType: "exportBuildingAnalysisPDF"
   */
  exportBuildingAnalysisPDF: async (analysisResult: any): Promise<{ success: boolean; pdfUrl?: string; message?: string }> => {
    try {
      const response = await apiClient.post(env.checklistWebhookUrl, {
        actionType: 'exportBuildingAnalysisPDF',
        analysisResult,
      });

      return response.data;
    } catch (error) {
      console.error('Failed to export building analysis PDF:', error);
      return {
        success: false,
        message: '건축물대장 분석 결과 PDF 생성에 실패했습니다.',
      };
    }
  },

  /**
   * 건축물대장 분석 결과 이메일 전송
   * actionType: "sendBuildingAnalysisEmail"
   */
  sendBuildingAnalysisEmail: async (analysisResult: any): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await apiClient.post(env.checklistWebhookUrl, {
        actionType: 'sendBuildingAnalysisEmail',
        analysisResult,
      });

      return response.data;
    } catch (error) {
      console.error('Failed to send building analysis email:', error);
      return {
        success: false,
        message: '건축물대장 분석 결과 이메일 전송에 실패했습니다.',
      };
    }
  },
};
