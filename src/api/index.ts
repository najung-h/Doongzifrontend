import axios from 'axios';

// Axios 인스턴스 생성
export const apiClient = axios.create({
  // n8n 워크플로우에 대기 시간(30초 등)이 포함되어 있으므로 
  // 타임아웃을 넉넉하게 3분(180000ms) 이상으로 설정해야 합니다.
  timeout: 180000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터 (로깅용)
apiClient.interceptors.request.use(
  (config) => {
    console.log('🚀 API Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// 응답 인터셉터 (에러 핸들링)
apiClient.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('❌ Response Error:', error.response?.status, error.message);
    return Promise.reject(error);
  }
);
