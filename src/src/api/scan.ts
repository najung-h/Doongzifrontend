import { apiClient } from './index';
import { env } from '../config/env';
import type { AnalysisResult } from '../types';

/**
 * 스캔/분석 API
 */
export const scanAPI = {
  /**
   * 문서 분석 (등기부등본, 계약서, 건축물대장)
   * actionType: "analyzeDocuments"
   */
  analyzeDocuments: async (files: File[]): Promise<AnalysisResult> => {
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
        analysis: {
          riskLevel: 0,
          riskGrade: 'low',
          issues: [
            {
              title: '서버 연결 오류',
              description: '문서 분석 서버와 연결할 수 없습니다.',
              severity: 'warning',
            },
          ],
          recommendations: ['잠시 후 다시 시도해주세요.'],
        },
      };
    }
  },
};
