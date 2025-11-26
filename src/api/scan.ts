import { apiClient } from './index';
import { env } from '../config/env';
import type { ScanResponse } from '../types';

/**
 * 스캔/분석 API
 */
export const scanAPI = {
  /**
   * 문서 분석 (등기부등본, 계약서, 건축물대장) - 둥지 스캔하기
   * actionType: "scanDocuments"
   * n8n Workflow: 문서로직0500.json -> Switch Node (둥지 스캔하기) -> [S3]사용자_파일_적재1 (file0 참조)
   */
  scanDocuments: async (
    files: File[],
    docType?: '등기부등본' | '임대차계약서' | '건축물대장', // n8n AI가 자동 분류하므로 Optional 처리
    userId: string = '61a8fc1d-67b0-45db-b913-602654b45c3c' // 하드코딩된 테스트 userId
  ): Promise<ScanResponse> => {
    try {
      const formData = new FormData();

      // actionType, userId 추가
      formData.append('actionType', 'scanDocuments');
      formData.append('userId', userId);
      
      if (docType) {
        formData.append('docType', docType);
      }

      // 파일들 추가
      // 중요: n8n의 '[S3]사용자_파일_적재1' 노드가 'file0' 키를 참조하므로 키 이름을 'file0'로 설정
      files.forEach((file) => {
        formData.append('file', file);
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
        // @ts-ignore: types definition mismatch fix
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
};