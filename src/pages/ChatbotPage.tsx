import { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import type { Message } from '../types';
import { chatbotAPI } from '../api/chat';
import Navigation from '../components/common/Navigation';

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
    const userMessage: Message = {
      role: 'user',
      content: question,
      timestamp: new Date()
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);

    const messagesForAPI = updatedMessages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));

    setIsLoading(true);
    chatbotAPI.sendMessage(messagesForAPI)
      .then(response => {
        const aiMessage: Message = {
          role: 'assistant',
          content: response.answer,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiMessage]);
      })
      .catch(() => {
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

  const handleSend = () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      role: 'user',
      content: inputText,
      timestamp: new Date()
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputText('');

    const messagesForAPI = updatedMessages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));

    setIsLoading(true);
    chatbotAPI.sendMessage(messagesForAPI)
      .then(response => {
        const aiMessage: Message = {
          role: 'assistant',
          content: response.answer,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiMessage]);
      })
      .catch(() => {
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
      backgroundColor: '#FAF8F3' // 전체 배경색
    }}>
      <Navigation />

      {/* Main Layout Container (가독성을 위한 중앙 정렬 및 너비 제한) */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        maxWidth: '800px', // 가독성을 위한 최대 너비 설정
        margin: '0 auto',  // 중앙 정렬
        backgroundColor: '#FAF8F3',
        boxShadow: '0 0 20px rgba(0,0,0,0.03)' // 은은한 그림자로 구분감
      }}>
        
        {/* Chat Header (Compact Design) */}
        <div style={{
          padding: '16px 24px',
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid #E5E5E5',
          display: 'flex', // 가로 배치
          alignItems: 'center',
          gap: '16px'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            backgroundColor: '#FFF9E6', // 연한 노란색 배경 추가
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <img
              src="/mom.png"
              alt="어미새"
              style={{
                width: '36px',
                height: '36px',
                objectFit: 'contain'
              }}
            />
          </div>
          
          <div style={{ flex: 1 }}>
            <h2 style={{ 
              fontSize: '18px',
              fontWeight: '700',
              color: '#2C2C2C',
              margin: '0 0 4px 0'
            }}>
              어미새 챗봇
            </h2>
            <p style={{ 
              fontSize: '13px', 
              color: '#666666',
              margin: 0,
              lineHeight: '1.4',
              wordBreak: 'keep-all'
            }}>
              막막한 계약 용어를 쉽게 설명해드려요. 법적 문제는 전문가와 상담하세요.
            </p>
          </div>
        </div>

        {/* Messages Area */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
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
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: '#FFE4C4',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  padding: '4px',
                  marginTop: '4px' // 말풍선 상단과 높이 맞춤
                }}>
                  <img
                    src="/mom.png"
                    alt="어미새"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain'
                    }}
                  />
                </div>
              )}
              <div
                style={{
                  maxWidth: '80%', // 말풍선 너비 조금 더 확보
                  padding: '14px 20px',
                  borderRadius: '16px',
                  borderTopLeftRadius: message.role === 'assistant' ? '4px' : '16px',
                  borderTopRightRadius: message.role === 'user' ? '4px' : '16px',
                  backgroundColor: message.role === 'user' 
                    ? '#D4E5B8' 
                    : '#FFF9E6', // AI 말풍선 배경색을 더 따뜻하게 변경
                  color: '#2C2C2C',
                  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                  fontSize: '15px'
                }}
              >
                <p style={{ 
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
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: '#FFE4C4',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                padding: '4px'
              }}>
                <img
                  src="/mom.png"
                  alt="어미새"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain'
                  }}
                />
              </div>
              <div
                style={{
                  padding: '14px 20px',
                  borderRadius: '16px',
                  borderTopLeftRadius: '4px',
                  backgroundColor: '#FFF9E6',
                  color: '#2C2C2C',
                  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
                }}
              >
                <div style={{ display: 'flex', gap: '4px', alignItems: 'center', height: '24px' }}>
                  <span style={{ width: '6px', height: '6px', backgroundColor: '#8FBF4D', borderRadius: '50%', animation: 'bounce 1s infinite' }}></span>
                  <span style={{ width: '6px', height: '6px', backgroundColor: '#8FBF4D', borderRadius: '50%', animation: 'bounce 1s infinite 0.2s' }}></span>
                  <span style={{ width: '6px', height: '6px', backgroundColor: '#8FBF4D', borderRadius: '50%', animation: 'bounce 1s infinite 0.4s' }}></span>
                </div>
                <style>{`
                  @keyframes bounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-4px); }
                  }
                `}</style>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Questions */}
        <div style={{
          padding: '12px 24px',
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          backgroundColor: '#FFFFFF',
          borderTop: '1px solid #E5E5E5',
          scrollbarWidth: 'none' // 스크롤바 숨김
        }}>
          {suggestedQuestions.map((question, index) => (
            <button
              key={index}
              onClick={() => handleSuggestedQuestion(question)}
              style={{
                padding: '8px 16px',
                borderRadius: '20px',
                border: '1px solid #8FBF4D',
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
              fontSize: '15px',
              outline: 'none',
              color: '#2C2C2C',
              transition: 'all 0.2s'
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#8FBF4D';
              e.currentTarget.style.backgroundColor = '#FFFFFF';
              e.currentTarget.style.boxShadow = '0 0 0 2px rgba(143, 191, 77, 0.1)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = '#D9D9D9';
              e.currentTarget.style.backgroundColor = '#F8F8F8';
              e.currentTarget.style.boxShadow = 'none';
            }}
          />
          <button
            onClick={handleSend}
            disabled={!inputText.trim() || isLoading}
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              backgroundColor: inputText.trim() && !isLoading ? '#8FBF4D' : '#E8E8E8',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: inputText.trim() && !isLoading ? 'pointer' : 'not-allowed',
              transition: 'all 0.2s',
              flexShrink: 0
            }}
          >
            <Send size={20} color={inputText.trim() && !isLoading ? 'white' : '#999999'} />
          </button>
        </div>
      </div>
    </div>
  );
}