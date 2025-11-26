import { apiClient } from './index';
import { env } from '../config/env';
import type { ScanResponse, DocumentDataType, InsuranceCheckResponse } from '../types';

/**
 * 체크리스트 관련 API
 * 모든 요청은 동일한 웹훅 URL로 전송되며, actionType으로 분기됨
 */
export const checklistAPI = {

  exportPDF: async (checklistData: any): Promise<{ success: boolean; pdfUrl?: string }> => {
    try {
      const response = await apiClient.post(env.checklistWebhookUrl, {
        actionType: 'exportPDF',
        checklistData,
      });

      return response.data;
    } catch (error) {
      console.error('Failed to export PDF:', error);
      return { success: false, pdfUrl: '' };
    }
  },

  /**
   * 이메일 전송 (전체 체크리스트)
   * actionType: "sendEmail"
   */
  sendEmail: async (email: string, checklistData: any): Promise<{ success: boolean; message: string }> => {
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
   * 보증보험 가입 가능 여부 확인 (파일 업로드 포함)
   * actionType: "checkInsurance"
   */
  checkInsurance: async (formData: FormData): Promise<InsuranceCheckResponse> => {
    try {
      const response = await apiClient.post(env.checklistWebhookUrl, formData, {
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
        message: '보증보험 가입 가능 여부 확인에 실패했습니다. 서버에 연결할 수 없습니다.',
        details: [],
        failedItems: [{
          id: 'error',
          question: '오류 발생',
          reason: '보증보험 확인에 실패했습니다. 다시 시도해주세요.'
        }]
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
    propertyType: '아파트' | '오피스텔' | '연립/다세대' | '단독/다가구';
  }): Promise<{
    success: boolean;
    riskLevel: 'safe' | 'warning' | 'danger';
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
        riskLevel: 'warning',
        riskScore: 0,
        message: '위험도 분석에 실패했습니다.',
        recommendations: [],
      };
    }
  },

  // === [문서 분석 결과 후속 처리 통합 함수] ===
  
  /**
   * 문서 분석 결과 PDF 다운로드 (통합)
   * actionType: "exportAnalysisPDF"
   * @param dataType 'registry' | 'contract' | 'building'
   * @param fileKey 분석 API 응답에서 받은 fileKey
   */
  exportAnalysisPDF: async (
    dataType: DocumentDataType,
    fileKey: string
  ): Promise<{ success: boolean; pdfUrl?: string; message?: string }> => {
    try {
      const response = await apiClient.post(env.checklistWebhookUrl, {
        actionType: 'exportAnalysisPDF',
        dataType,
        fileKey,
      });
      return response.data;
    } catch (error) {
      console.error(`Failed to export ${dataType} analysis PDF:`, error);
      return {
        success: false,
        message: `${dataType} 분석 결과 PDF 생성에 실패했습니다.`,
        pdfUrl: '',
      };
    }
  },

  /**
   * 문서 분석 결과 이메일 전송 (통합)
   * actionType: "sendAnalysisEmail"
   * @param dataType 'registry' | 'contract' | 'building'
   * @param fileKey 분석 API 응답에서 받은 fileKey
   */
  sendAnalysisEmail: async (
    dataType: DocumentDataType,
    fileKey: string
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await apiClient.post(env.checklistWebhookUrl, {
        actionType: 'sendAnalysisEmail',
        dataType,
        fileKey,
      });
      return response.data;
    } catch (error) {
      console.error(`Failed to send ${dataType} analysis email:`, error);
      return {
        success: false,
        message: `${dataType} 분석 결과 이메일 전송에 실패했습니다.`,
      };
    }
  },
};