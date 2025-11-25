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
    marketPrice: number;
    deposit: number;
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
};
