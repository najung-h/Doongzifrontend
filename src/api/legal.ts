import { apiClient } from './index';
import { env } from '../config/env';

/**
 * 법률/판례 검색 API
 */
export const legalAPI = {
  /**
   * 법률/판례 검색
   * actionType: "searchLegal"
   */
  searchLegal: async (query: string, filter?: 'all' | 'case' | 'law'): Promise<{
    success: boolean;
    results: Array<{
      id: string;
      type: 'case' | 'law';
      title: string;
      court?: string;
      caseNumber?: string;
      lawName?: string;
      article?: string;
      summary?: string;
      url?: string;
    }>;
    totalCount: number;
  }> => {
    try {
      const response = await apiClient.post(env.legalWebhookUrl, {
        actionType: 'searchLegal',
        query,
        filter: filter || 'all',
      });

      return response.data;
    } catch (error) {
      console.error('Failed to search legal documents:', error);
      // Mock response for development
      return {
        success: false,
        results: [],
        totalCount: 0,
      };
    }
  },

  /**
   * 법률/판례 상세 조회
   * actionType: "getLegalDetail"
   */
  getLegalDetail: async (id: string): Promise<{
    success: boolean;
    data?: {
      id: string;
      type: 'case' | 'law';
      title: string;
      content: string;
      court?: string;
      caseNumber?: string;
      date?: string;
      lawName?: string;
      article?: string;
      url?: string;
    };
  }> => {
    try {
      const response = await apiClient.post(env.legalWebhookUrl, {
        actionType: 'getLegalDetail',
        id,
      });

      return response.data;
    } catch (error) {
      console.error('Failed to get legal detail:', error);
      return {
        success: false,
      };
    }
  },

  /**
   * 인기 검색어 조회
   * actionType: "getPopularKeywords"
   */
  getPopularKeywords: async (): Promise<{
    success: boolean;
    keywords: string[];
  }> => {
    try {
      const response = await apiClient.post(env.legalWebhookUrl, {
        actionType: 'getPopularKeywords',
      });

      return response.data;
    } catch (error) {
      console.error('Failed to get popular keywords:', error);
      return {
        success: false,
        keywords: ['전세사기', '임대차보호법', '확정일자', '계약해지', '보증금반환'],
      };
    }
  },
};
