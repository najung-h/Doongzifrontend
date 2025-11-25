// 환경 변수 관리
export const env = {
  // n8n Webhook URLs
  chatbotWebhookUrl: (typeof import.meta !== 'undefined' && import.meta.env?.VITE_N8N_CHATBOT_WEBHOOK_URL) || '',
  scanWebhookUrl: (typeof import.meta !== 'undefined' && import.meta.env?.VITE_N8N_SCAN_WEBHOOK_URL) || '',
  checklistWebhookUrl: (typeof import.meta !== 'undefined' && import.meta.env?.VITE_N8N_CHECKLIST_WEBHOOK_URL) || '',
  legalWebhookUrl: (typeof import.meta !== 'undefined' && import.meta.env?.VITE_N8N_LEGAL_WEBHOOK_URL) || '',
};

// 환경 변수 유효성 검사
export const validateEnv = () => {
  const missingVars: string[] = [];

  if (!env.chatbotWebhookUrl) missingVars.push('VITE_N8N_CHATBOT_WEBHOOK_URL');
  if (!env.scanWebhookUrl) missingVars.push('VITE_N8N_SCAN_WEBHOOK_URL');
  if (!env.checklistWebhookUrl) missingVars.push('VITE_N8N_CHECKLIST_WEBHOOK_URL');
  if (!env.legalWebhookUrl) missingVars.push('VITE_N8N_LEGAL_WEBHOOK_URL');

  if (missingVars.length > 0) {
    console.warn('⚠️ Missing environment variables:', missingVars.join(', '));
    console.warn('📝 Copy .env.example to .env and add your n8n webhook URLs');
    console.warn('Some features may not work properly.');
  }

  return missingVars.length === 0;
};