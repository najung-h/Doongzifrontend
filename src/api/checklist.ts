import { apiClient } from './index';
import { env } from '../config/env';
import type { ChecklistTab, ScanResponse, InsuranceCheckResponse } from '../types';

/**
 * 체크리스트 관련 API
 * 모든 요청은 동일한 웹훅 URL로 전송되며, actionType으로 분기됨
 */
export const checklistAPI = {
/**
   * 문서 정밀 분석 (계약서, 등기부등본, 건축물대장 꼼꼼히 살펴보기)
   * actionType: "analyzeDocuments"
   * n8n Workflow: 문서로직0500.json -> Switch Node (analyzeDocuments)
   */
  analyzeDocuments: async (files: File[], docType: '임대차계약서' | '등기부등본' | '건축물대장'): Promise<ScanResponse> => {
    try {
      const formData = new FormData();

      // actionType 및 docType 추가
      formData.append('actionType', 'analyzeDocuments');
      formData.append('docType', docType);

      // 파일들 추가 (n8n Webhook의 binaryPropertyName: "file" 설정에 따름)
      files.forEach((file) => {
        formData.append('file', file);
      });

      // 문서 분석은 Scan Webhook Endpoint 사용
      const response = await apiClient.post(env.scanWebhookUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Failed to analyze document:', error);
      // Mock response for development or error fallback
      return {
        success: false,
        message: '문서 정밀 분석 서버와 연결할 수 없습니다.',
        analysis: {
          riskGrade: 'low',
          summary: '서버 연결 오류',
          issues: [
            {
              title: '서버 연결 오류',
              description: '문서 정밀 분석 서버와 연결할 수 없습니다.',
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
  exportPDF: async (checklistData: ChecklistTab[]): Promise<{ success: boolean; downloadUrl?: string }> => {
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
  checkInsurance: async (
    registryFile: File,
    buildingFile: File,
    deposit: number
  ): Promise<InsuranceCheckResponse> => { // 반환 타입이 변경된 인터페이스를 따름
    try {
      const formData = new FormData();
      formData.append('actionType', 'checkInsurance');
      formData.append('registry', registryFile);
      formData.append('building', buildingFile);
      formData.append('deposit', deposit.toString());

      const response = await apiClient.post(env.checklistWebhookUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // API 응답이 배열인 경우 results에 담아서 반환
      if (Array.isArray(response.data)) {
        return {
          success: true,
          results: response.data,
          message: '분석이 완료되었습니다.'
        };
      }
      
      // API 응답이 객체이고 result 필드에 배열이 있는 경우
      if (response.data.result && Array.isArray(response.data.result)) {
         return {
            success: true,
            results: response.data.result,
            message: response.data.message || '분석이 완료되었습니다.'
         };
      }

      // 그 외의 경우 (기존 BaseResponse 형태 등)
      return response.data;

    } catch (error) {
      console.error('Failed to check insurance:', error);
      return {
        success: false,
        message: '보증보험 가입 가능 여부 확인 중 오류가 발생했습니다.',
        results: [], // 빈 배열 제공
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
  exportAnalysisPDF: async (analysisResult: any, fileKey?: string): Promise<{ success: boolean; downloadUrl?: string; message?: string }> => {
    try {
      const payload = {
        actionType: 'exportAnalysisPDF',
        analysisResult,
        ...(fileKey && { fileKey }),
      };

      console.log('=== exportAnalysisPDF API Call ===');
      console.log('Payload:', JSON.stringify(payload, null, 2));
      console.log('fileKey included:', !!fileKey);

      const response = await apiClient.post(env.checklistWebhookUrl, payload);

      console.log('API Response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Failed to export document analysis PDF:', error);
      console.error('Error details:', error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || '문서 분석 결과 PDF 생성에 실패했습니다.',
      };
    }
  },

  /**
   * [통합됨] 분석 결과 이메일 전송
   * n8n actionType: sendAnalysisEmail
   */
  sendAnalysisEmail: async (analysisResult: any, fileKey?: string): Promise<{ success: boolean; downloadUrl?: string; message?: string }> => {
    try {
      const response = await apiClient.post(env.checklistWebhookUrl, {
        actionType: 'sendAnalysisEmail',
        analysisResult,
        ...(fileKey && { fileKey }), // fileKey가 있을 때만 포함
      });

      return response.data;
    } catch (error) {
      console.error('Failed to send document analysis email:', error);
      return {
        success: false,
        message: '문서 분석 결과 이메일 전송에 실패했습니다.',
      };
    }
  }
};