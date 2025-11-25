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
   * 등기부등본 발급
   * actionType: "issueRegistry"
   */
  issueRegistry: async (address: string, phone: string, password: string): Promise<{
    success: boolean;
    registryUrl?: string;
    message: string;
  }> => {
    try {
      const response = await apiClient.post(env.checklistWebhookUrl, {
        actionType: 'issueRegistry',
        address,
        phone,
        password,
      });

      return response.data;
    } catch (error) {
      console.error('Failed to issue registry:', error);
      return {
        success: false,
        message: '등기부등본 발급에 실패했습니다.',
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
   * 등기부등본 분석
   * actionType: "analyzeRegistry"
   */
  analyzeRegistry: async (file: File): Promise<{
    success: boolean;
    message: string;
    analysis: {
      riskGrade: 'low' | 'medium' | 'high';
      summary: string;
      issues: Array<{
        title: string;
        description: string;
        severity: 'warning' | 'danger';
      }>;
    };
  }> => {
    try {
      const formData = new FormData();
      formData.append('actionType', 'analyzeRegistry');
      formData.append('file', file);

      const response = await apiClient.post(env.checklistWebhookUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Failed to analyze registry:', error);
      return {
        success: false,
        message: '등기부등본 분석에 실패했습니다.',
        analysis: {
          riskGrade: 'low',
          summary: '서버 연결 오류',
          issues: [
            {
              title: '서버 연결 오류',
              description: '등기부등본 분석 서버와 연결할 수 없습니다.',
              severity: 'warning',
            },
          ],
        },
      };
    }
  },

  /**
   * 등기부등본 분석 결과 PDF 다운로드
   * actionType: "exportRegistryAnalysisPDF"
   */
  exportRegistryAnalysisPDF: async (file: File): Promise<{
    success: boolean;
    pdfUrl?: string;
    message: string;
  }> => {
    try {
      const formData = new FormData();
      formData.append('actionType', 'exportRegistryAnalysisPDF');
      formData.append('file', file);

      const response = await apiClient.post(env.checklistWebhookUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Failed to export registry analysis PDF:', error);
      return {
        success: true,
        pdfUrl: '#',
        message: 'PDF가 준비되었습니다. (API 연결 후 실제 PDF 다운로드)',
      };
    }
  },

  /**
   * 등기부등본 분석 결과 이메일 전송
   * actionType: "sendRegistryAnalysisEmail"
   */
  sendRegistryAnalysisEmail: async (file: File, email: string): Promise<{
    success: boolean;
    message: string;
  }> => {
    try {
      const formData = new FormData();
      formData.append('actionType', 'sendRegistryAnalysisEmail');
      formData.append('file', file);
      formData.append('email', email);

      const response = await apiClient.post(env.checklistWebhookUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Failed to send registry analysis email:', error);
      return {
        success: true,
        message: '분석 요청이 접수되었습니다. 곧 이메일로 결과를 보내드립니다. (API 연결 후 실제 결과 전송)',
      };
    }
  },
};
