import { apiClient } from './index';
import { env } from '../config/env';
import type { ChecklistTab, ScanResponse, DocumentDataType } from '../types';

/**
 * 체크리스트 관련 API
 * 모든 요청은 동일한 웹훅 URL로 전송되며, actionType으로 분기됨
 */
export const checklistAPI = {
  /**
   * 계약서 분석
   * actionType: "analyzeContract"
   */
  analyzeContract: async (files: File[]): Promise<ScanResponse> => {
    try {
      const formData = new FormData();

      // actionType 추가
      formData.append('actionType', 'analyzeContract');

      // 파일들 추가
      files.forEach((file) => {
        formData.append('files', file);
      });

      const response = await apiClient.post(env.checklistWebhookUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Failed to analyze contract:', error);
      // Mock response for development
      return {
        success: false,
        message: '계약서 분석 서버와 연결할 수 없습니다.',
        analysis: {
          riskGrade: 'low',
          summary: '서버 연결 오류',
          issues: [
            {
              title: '서버 연결 오류',
              description: '계약서 분석 서버와 연결할 수 없습니다.',
              severity: 'warning',
            },
          ],
          autoCheckItems: [],
        },
      };
    }
  },

  /**
   * PDF 다운로드 (전체 체크리스트)
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
   * 이메일 전송 (전체 체크리스트)
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

  // === [문서 분석 결과 후속 처리 통합 함수] ===
  
  /**
   * 문서 분석 결과 PDF 다운로드 (통합)
   * actionType: "exportAnalysisPDF"
   * @param dataType 'registry' | 'contract' | 'building'
   * @param analysisResult 분석 결과 데이터
   */
  exportAnalysisPDF: async (
    dataType: DocumentDataType,
    analysisResult: ScanResponse['analysis']
  ): Promise<{ success: boolean; pdfUrl?: string; message?: string }> => {
    try {
      const response = await apiClient.post(env.checklistWebhookUrl, {
        actionType: 'exportAnalysisPDF',
        dataType, // 보고서 종류 명시
        analysisResult,
      });
      return response.data;
    } catch (error) {
      console.error(`Failed to export ${dataType} analysis PDF:`, error);
      return {
        success: false,
        message: `${dataType} 분석 결과 PDF 생성에 실패했습니다.`,
      };
    }
  },
  
  /**
   * 문서 분석 결과 이메일 전송 (통합)
   * actionType: "sendAnalysisEmail"
   * @param dataType 'registry' | 'contract' | 'building'
   * @param analysisResult 분석 결과 데이터
   * @param email 수신자 이메일
   */
  sendAnalysisEmail: async (
    dataType: DocumentDataType,
    analysisResult: ScanResponse['analysis'],
    email: string = 'user@example.com' // 이메일은 모달에서 입력받아야 함
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await apiClient.post(env.checklistWebhookUrl, {
        actionType: 'sendAnalysisEmail',
        dataType, // 보고서 종류 명시
        email,
        analysisResult,
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