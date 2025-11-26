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
    email?: string, // [추가] 이메일 파라미터 (선택적)
    docType?: '등기부등본' | '임대차계약서' | '건축물대장', // n8n AI가 자동 분류하므로 Optional 처리
    userId: string = '61a8fc1d-67b0-45db-b913-602654b45c3c' // 하드코딩된 테스트 userId
  ): Promise<ScanResponse> => {
    try {
      const formData = new FormData();

      // actionType, userId 추가
      formData.append('actionType', 'scanDocuments');
      formData.append('userId', userId);
      
      // [추가] 이메일이 있으면 FormData에 추가
      if (email) {
        formData.append('email', email);
      }
      
      if (docType) {
        formData.append('docType', docType);
      }

      // 파일들 추가
      // 중요: n8n의 '[S3]사용자_파일_적재1' 노드가 'file0' 키를 참조하므로 키 이름을 'file0'로 설정
      files.forEach((file) => {
        formData.append('file0', file);
      });

      const response = await apiClient.post(env.scanWebhookUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // n8n의 즉시 응답(message only)을 ScanResponse 형식에 맞게 변환
      return {
        success: true,
        message: response.data.message || '문서가 성공적으로 접수되었습니다.',
        // @ts-ignore: 비동기 처리로 인해 fileKey가 즉시 반환되지 않을 수 있음
        fileKey: '',
        // 비동기 처리이므로 분석 결과는 더미 데이터로 채움 (이메일로 결과 전송됨)
        analysis: {
          riskGrade: 'low',
          summary: '분석이 시작되었습니다. 결과는 이메일로 전송됩니다.',
          issues: [],
          autoCheckItems: []
        }
      };
    } catch (error) {
      console.error('Failed to analyze documents:', error);
      
      // 타임아웃 에러일 경우 (n8n 응답 노드가 없는 경우 대비) 성공으로 간주하는 로직 추가 가능
      // 현재는 에러 처리 유지
      return {
        success: false,
        message: '문서 분석 서버와 연결할 수 없습니다.',
        // @ts-ignore
        fileKey: '',
        analysis: {
          riskGrade: 'low',
          summary: '서버 연결 오류',
          issues: [],
          autoCheckItems: [],
        },
      };
    }
  }
};