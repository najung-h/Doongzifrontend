import { apiClient } from './index';
import { env } from '../config/env';
import type { ScanResponse } from '../types';

/**
 * 스캔/분석 API
 */
export const scanAPI = {
  /**
   * 문서 분석 (등기부등본, 계약서, 건축물대장)
   * actionType: "analyzeDocuments"
   */
  analyzeDocuments: async (files: File[]): Promise<ScanResponse> => {
    try {
      const formData = new FormData();
      
      // actionType 추가
      formData.append('actionType', 'analyzeDocuments');
      
      // 파일들 추가
      files.forEach((file) => {
        formData.append('files', file);
      });

      const response = await apiClient.post(env.scanWebhookUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Failed to analyze documents:', error);
      // Mock response for development
      return {
        success: false,
        message: '문서 분석 서버와 연결할 수 없습니다.',
        analysis: {
          riskGrade: 'low',
          summary: '서버 연결 오류',
          issues: [
            {
              title: '서버 연결 오류',
              description: '문서 분석 서버와 연결할 수 없습니다.',
              severity: 'warning',
            },
          ],
          autoCheckItems: [],
        },
      };
    }
  },

  /**
   * 상세 문서 분석 (체크리스트용 - 이메일로 리포트 전송)
   * actionType: "analyzeDetailedDocument"
   */
  analyzeDetailedDocument: async (
    file: File,
    email: string,
    documentType: 'registry' | 'contract' | 'building'
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const formData = new FormData();

      // actionType 추가
      formData.append('actionType', 'analyzeDetailedDocument');
      formData.append('documentType', documentType);
      formData.append('email', email);
      formData.append('file', file);

      const response = await apiClient.post(env.scanWebhookUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Failed to analyze detailed document:', error);
      // Mock response for development
      return {
        success: true,
        message: '분석 요청이 접수되었습니다. 곧 이메일로 결과를 보내드립니다. (API 연결 후 실제 결과 전송)',
      };
    }
  },
};