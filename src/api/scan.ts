import { apiClient } from './index';
import { env } from '../config/env';
import type { ScanResponse } from '../types';

/**
 * 스캔/분석 API
 */
export const scanAPI = {
  /**
   * 문서 분석 (등기부등본, 계약서, 건축물대장)
   * actionType: "scanDocuments"
   */
  analyzeDocuments: async (
    files: File[],
    docType: '등기부등본' | '임대차계약서' | '건축물대장',
    userId: string = '61a8fc1d-67b0-45db-b913-602654b45c3c' // 하드코딩된 테스트 userId
  ): Promise<ScanResponse> => {
    try {
      const formData = new FormData();

      // actionType, userId, docType 추가
      formData.append('actionType', 'scanDocuments');
      formData.append('userId', userId);
      formData.append('docType', docType);

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
        fileKey: '',
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
  }
}