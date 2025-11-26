import { apiClient } from './index';
import { env } from '../config/env';
import type { ChatResponse } from '../types';

/**
 * 챗봇 API
 */
export const chatbotAPI = {
  /**
   * 챗봇에게 메시지 전송 (전체 대화 이력 전송)
   */
  sendMessage: async (messages: Array<{ role: string; content: string }>): Promise<ChatResponse> => {
    try {
      const response = await apiClient.post(env.chatbotWebhookUrl, {
        messages,
      });

      return response.data;
    } catch (error) {
      console.error('Failed to send message:', error);
      // Mock response for development
      return {
        success: false,
        answer: '죄송합니다. 현재 서버와 연결할 수 없습니다. 잠시 후 다시 시도해주세요.',
      };
    }
  },
};
