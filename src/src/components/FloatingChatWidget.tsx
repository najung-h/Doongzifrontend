import { useState, useRef, useEffect } from 'react';
import { Send, X, Minimize2 } from 'lucide-react';
import type { Message } from '../types';
import { chatbotAPI } from '../api/chatbot';

// Mock answers for suggested questions
const mockAnswers: { [key: string]: string } = {
  '확정일자 왜 받아야 하나요?': `확정일자는 전월세 계약서에 계약날짜를 도장으로 찍어서, 임차인의 우선변제권을 보장받는 중요한 절차예요. 계약 체결 후 주민센터나 등기소에서 무료로 받을 수 있어요.

확정일자를 받으면 전입신고와 함께 대항력을 갖추어 계약 체결 순서에 따라 보증금을 우선적으로 돌려받을 수 있는 권리가 생겨요.`,
  '전세사기 위험징후는 뭘까요?': `전세사기 위험징후는 전월세 계약 시에 나타나는 다음과 같은 신호예요:

• 시세보다 현저히 낮은 보증금
• 임대인의 부당한 우선변제권 보유 요구
• 계약 체결 후 주민센터나 등기소에서 무료로 받을 수 있어요
• 중개인이 여러 명 개입되는 복잡한 계약 구조

이런 징후가 보이면 반드시 전문가에게 상담을 받아야 합니다.`,
  '반전세는 뭘까요?': `반전세는 월세와 전세의 중간 형태로, 일정 보증금과 함께 소액의 월세를 내는 임대차 계약 방식이에요.

예를 들어, 전세 2억원짜리 집을 보증금 1억 5천만원에 월세 30만원을 내는 식으로 계약하는 거예요. 계약 체결 후 주민센터나 등기소에서 무료로 받을 수 있어요.

초기 목돈 부담은 전세보다 적지만, 매달 월세를 내야 하는 단점이 있어요.`
};

interface FloatingChatWidgetProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FloatingChatWidget({ isOpen, onClose }: FloatingChatWidgetProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: '안녕하세요! 둥지 AI 챗봇입니다. 전월세 계약에 대해 궁금한 점을 물어보세요. 👋',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedQuestions = [
    '확정일자 왜 받아야 하나요?',
    '전세사기 위험징후는 뭘까요?',
    '반전세는 뭘까요?'
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSuggestedQuestion = (question: string) => {
    const userMessage: Message = {
      role: 'user',
      content: question,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);

    setTimeout(() => {
      const aiMessage: Message = {
        role: 'assistant',
        content: mockAnswers[question] || '답변 준비 중입니다...',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
    }, 500);
  };

  const handleSend = () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      role: 'user',
      content: inputText,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');

    setIsLoading(true);
    chatbotAPI.sendMessage(inputText, conversationId)
      .then(response => {
        const aiMessage: Message = {
          role: 'assistant',
          content: response.message,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiMessage]);
        setConversationId(response.conversationId);
      })
      .catch(error => {
        const aiMessage: Message = {
          role: 'assistant',
          content: '답변 준비 중입니다... (API 연결 후 실제 답변이 표시됩니다)',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiMessage]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  if (!isOpen) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        width: '400px',
        maxWidth: 'calc(100vw - 48px)',
        height: '600px',
        maxHeight: 'calc(100vh - 100px)',
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 9999,
        animation: 'slideIn 0.3s ease-out',
        overflow: 'hidden'
      }}
    >
      <style>
        {`
          @keyframes slideIn {
            from {
              transform: translateY(20px);
              opacity: 0;
            }
            to {
              transform: translateY(0);
              opacity: 1;
            }
          }
        `}
      </style>

      {/* Header */}
      <div style={{
        padding: '16px 20px',
        backgroundColor: '#8FBF4D',
        borderTopLeftRadius: '16px',
        borderTopRightRadius: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: '#FFE4C4',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px'
          }}>
            🐦
          </div>
          <div>
            <h3 style={{
              fontSize: '16px',
              fontWeight: '700',
              color: '#FFFFFF',
              margin: 0
            }}>
              어미새 챗봇
            </h3>
            <p style={{
              fontSize: '12px',
              color: 'rgba(255, 255, 255, 0.9)',
              margin: 0
            }}>
              부동산 계약 질문에 답해드려요
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#FFFFFF',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '4px',
            transition: 'background-color 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          <X size={20} />
        </button>
      </div>

      {/* Messages Area */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        backgroundColor: '#FAF8F3'
      }}>
        {messages.map((message, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
              alignItems: 'flex-start',
              gap: '8px'
            }}
          >
            {message.role === 'assistant' && (
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                backgroundColor: '#FFE4C4',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                fontSize: '14px'
              }}>
                🐦
              </div>
            )}
            <div
              style={{
                maxWidth: '75%',
                padding: '10px 14px',
                borderRadius: '12px',
                backgroundColor: message.role === 'user' 
                  ? '#D4E5B8' 
                  : '#FFF9E6',
                color: '#2C2C2C',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                border: '1px solid rgba(0, 0, 0, 0.05)'
              }}
            >
              <p style={{ 
                fontSize: '13px', 
                lineHeight: '1.5',
                margin: 0,
                whiteSpace: 'pre-wrap',
                wordBreak: 'keep-all'
              }}>
                {message.content}
              </p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
              gap: '8px'
            }}
          >
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              backgroundColor: '#FFE4C4',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              fontSize: '14px'
            }}>
              🐦
            </div>
            <div
              style={{
                padding: '10px 14px',
                borderRadius: '12px',
                backgroundColor: '#FFF9E6',
                color: '#2C2C2C',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                border: '1px solid rgba(0, 0, 0, 0.05)'
              }}
            >
              <p style={{ fontSize: '13px', margin: 0 }}>답변 작성 중...</p>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Questions */}
      <div style={{
        padding: '12px 16px',
        display: 'flex',
        gap: '6px',
        overflowX: 'auto',
        backgroundColor: '#FFFFFF',
        borderTop: '1px solid #E5E5E5',
        flexShrink: 0
      }}>
        {suggestedQuestions.map((question, index) => (
          <button
            key={index}
            onClick={() => handleSuggestedQuestion(question)}
            style={{
              padding: '8px 14px',
              borderRadius: '16px',
              border: '1.5px solid #8FBF4D',
              backgroundColor: '#FFFFFF',
              color: '#8FBF4D',
              fontSize: '11px',
              fontWeight: '600',
              whiteSpace: 'nowrap',
              flexShrink: 0,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#8FBF4D';
              e.currentTarget.style.color = '#FFFFFF';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#FFFFFF';
              e.currentTarget.style.color = '#8FBF4D';
            }}
          >
            {question}
          </button>
        ))}
      </div>

      {/* Input Area */}
      <div style={{
        padding: '12px 16px',
        backgroundColor: '#FFFFFF',
        display: 'flex',
        gap: '8px',
        alignItems: 'center',
        borderTop: '1px solid #E5E5E5',
        flexShrink: 0
      }}>
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="궁금한 점을 물어보세요..."
          style={{
            flex: 1,
            padding: '10px 14px',
            borderRadius: '20px',
            border: '1px solid #D9D9D9',
            backgroundColor: '#F8F8F8',
            fontSize: '13px',
            outline: 'none',
            transition: 'all 0.2s'
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = '#8FBF4D';
            e.currentTarget.style.backgroundColor = '#FFFFFF';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = '#D9D9D9';
            e.currentTarget.style.backgroundColor = '#F8F8F8';
          }}
        />
        <button
          onClick={handleSend}
          disabled={!inputText.trim()}
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            border: 'none',
            backgroundColor: inputText.trim() ? '#8FBF4D' : '#E8E8E8',
            color: '#FFFFFF',
            cursor: inputText.trim() ? 'pointer' : 'not-allowed',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s',
            flexShrink: 0
          }}
          onMouseEnter={(e) => {
            if (inputText.trim()) {
              e.currentTarget.style.backgroundColor = '#7AA83F';
            }
          }}
          onMouseLeave={(e) => {
            if (inputText.trim()) {
              e.currentTarget.style.backgroundColor = '#8FBF4D';
            }
          }}
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}