import { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import type { Message } from '../types';
import { chatbotAPI } from '../api/chatbot';
import Navigation from '../components/Navigation';

// Mock answers for suggested questions
const mockAnswers: { [key: string]: string } = {
  '확정일자를 왜 받아야 하나요?': `확정일자는 전월세 계약서에 계약날짜를 도장으로 찍어서, 임차인의 우선변제권을 보장받는 중요한 절차예요. 계약 체결 후 주민센터나 등기소에서 무료로 받을 수 있어요.\n\n확정일자를 받으면 전입신고와 함께 대항력을 갖추어 계약 체결 순서에 따라 보증금을 우선적으로 돌려받을 수 있는 권리가 생겨요.`,
  '전세사기의 위험 징후에는 무엇이 있을까요?': `전세사기 위험징후는 전월세 계약 시에 나타나는 다음과 같은 신호예요:\n\n• 시세보다 현저히 낮은 보증금\n• 임대인의 부당한 우선변제권 보유 요구\n• 계약 체결 후 주민센터나 등기소에서 무료로 받을 수 있어요\n• 중개인이 여러 명 개입되는 복잡한 계약 구조\n\n이런 징후가 보이면 반드시 전문가에게 상담을 받아야 합니다.`,
  '반전세가 뭐예요?': `반전세는 월세와 전세의 중간 형태로, 일정 보증금과 함께 소액의 월세를 내는 임대차 계약 방식이에요.\n\n예를 들어, 전세 2억원짜리 집을 보증금 1억 5천만원에 월세 30만원을 내는 식으로 계약하는 거예요. 계약 체결 후 주민센터나 등기소에서 무료로 받을 수 있어요.\n\n초기 목돈 부담은 전세보다 적지만, 매달 월세를 내야 하는 단점이 있어요.`
};

export default function ChatbotPage() {
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
    '확정일자를 왜 받아야 하나요?',
    '전세사기의 위험 징후에는 무엇이 있을까요?',
    '반전세가 뭐예요?'
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSuggestedQuestion = (question: string) => {
    // Add user message
    const userMessage: Message = {
      role: 'user',
      content: question,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);

    // Add mock response immediately
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

    // Add user message
    const userMessage: Message = {
      role: 'user',
      content: inputText,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');

    // Call API or use mock
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

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#FAF8F3'
    }}>
      <Navigation title="메인으로" showBack showLogin />

      {/* Chat Header */}
      <div style={{
        padding: '24px',
        textAlign: 'center',
        borderBottom: '1px solid #E5E5E5',
        backgroundColor: '#FFFFFF'
      }}>
        <div style={{ 
          fontSize: '40px', 
          marginBottom: '12px'
        }}>
          🐦
        </div>
        <h2 style={{ 
          fontSize: '24px',
          fontWeight: '700',
          color: '#2C2C2C',
          marginBottom: '8px'
        }}>
          어미새 챗봇
        </h2>
        <p style={{ 
          fontSize: '14px', 
          color: '#666666'
        }}>
          막막한 계약 용어를 쉽게 설명해드려요.
          <br />
          법적 책임은 행위자에게 있으니 챗봇의 답변 내용은 참고용으로만 사용하고 중요한 법률 문제는 반드시 전문가와 상담하세요.
        </p>
      </div>

      {/* Messages Area */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        backgroundColor: '#FAF8F3'
      }}>
        {messages.map((message, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
              alignItems: 'flex-start',
              gap: '12px'
            }}
          >
            {message.role === 'assistant' && (
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: '#FFE4C4',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                fontSize: '18px'
              }}>
                🐦
              </div>
            )}
            <div
              style={{
                maxWidth: '70%',
                padding: '14px 18px',
                borderRadius: '16px',
                backgroundColor: message.role === 'user' 
                  ? '#D4E5B8' 
                  : '#FFF9E6',
                color: '#2C2C2C',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.08)',
                border: '1px solid rgba(0, 0, 0, 0.05)'
              }}
            >
              <p style={{ 
                fontSize: '14px', 
                lineHeight: '1.6',
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
              gap: '12px'
            }}
          >
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: '#FFE4C4',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              fontSize: '18px'
            }}>
              🐦
            </div>
            <div
              style={{
                padding: '14px 18px',
                borderRadius: '16px',
                backgroundColor: '#FFF9E6',
                color: '#2C2C2C',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.08)',
                border: '1px solid rgba(0, 0, 0, 0.05)'
              }}
            >
              <p style={{ fontSize: '14px', margin: 0 }}>답변 작성 중...</p>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Questions - More prominent */}
      <div style={{
        padding: '16px 24px',
        display: 'flex',
        gap: '8px',
        overflowX: 'auto',
        backgroundColor: '#FFFFFF',
        borderTop: '1px solid #E5E5E5'
      }}>
        {suggestedQuestions.map((question, index) => (
          <button
            key={index}
            onClick={() => handleSuggestedQuestion(question)}
            style={{
              padding: '10px 18px',
              borderRadius: '20px',
              border: '2px solid #8FBF4D',
              backgroundColor: '#FFFFFF',
              color: '#8FBF4D',
              fontSize: '13px',
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
        padding: '16px 24px 24px',
        backgroundColor: '#FFFFFF',
        display: 'flex',
        gap: '12px',
        alignItems: 'center'
      }}>
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="궁금한 질문을 물어보세요..."
          style={{
            flex: 1,
            padding: '14px 20px',
            borderRadius: '24px',
            border: '1px solid #D9D9D9',
            backgroundColor: '#F8F8F8',
            fontSize: '14px',
            outline: 'none',
            color: '#2C2C2C'
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
          disabled={!inputText.trim() || isLoading}
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            backgroundColor: inputText.trim() && !isLoading ? '#8FBF4D' : '#D9D9D9',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: inputText.trim() && !isLoading ? 'pointer' : 'not-allowed',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            if (inputText.trim() && !isLoading) {
              e.currentTarget.style.backgroundColor = '#7DA842';
            }
          }}
          onMouseLeave={(e) => {
            if (inputText.trim() && !isLoading) {
              e.currentTarget.style.backgroundColor = '#8FBF4D';
            }
          }}
        >
          <Send size={20} color="white" />
        </button>
      </div>
    </div>
  );
}