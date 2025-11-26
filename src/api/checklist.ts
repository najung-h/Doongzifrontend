import { apiClient } from './index';
import { env } from '../config/env';
import type { ChecklistTab, ScanResponse } from '../types';

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
   * PDF 다운로드
   * actionType: "exportPDF"
   */
  exportPDF: async (checklistData: ChecklistTab[]): Promise<{ success: boolean; pdfUrl?: string }> => {
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
  exportAnalysisPDF: async (fileKey: string): Promise<{ success: boolean; pdfUrl?: string; message?: string }> => {
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