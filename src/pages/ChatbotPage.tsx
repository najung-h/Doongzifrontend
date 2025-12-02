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
  }, [messages, isLoading]); // isLoading 상태 변경 시에도 스크롤

  const handleSuggestedQuestion = (question: string) => {
    const userMessage: Message = {
      role: 'user',
      content: question,
      timestamp: new Date()
    };
    sendToAPI([...messages, userMessage]);
  };

  const handleSend = () => {
    if (!inputText.trim()) return;
    const userMessage: Message = {
      role: 'user',
      content: inputText,
      timestamp: new Date()
    };
    setInputText('');
    sendToAPI([...messages, userMessage]);
  };

  const sendToAPI = (updatedMessages: Message[]) => {
    setMessages(updatedMessages);
    setIsLoading(true);

    const messagesForAPI = updatedMessages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));

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
          content: '죄송합니다. 잠시 후 다시 시도해주세요.',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiMessage]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // 컬러 팔레트
  const COLORS = {
    bgMain: '#F2E5D5',      // 전체 배경
    bgCard: '#FFFFFF',      // 카드 배경
    bgChat: '#F9F7F5',      // 채팅창 배경
    textMain: '#402211',    // 메인 텍스트
    textSub: '#A68263',     // 서브 텍스트
    userBubble: '#A68263',  // 사용자 말풍선
    aiBubble: '#FFFFFF',    // AI 말풍선
    border: '#E5E5E5'
  };

  return (
    // [Root] 100vh 고정 및 스크롤 방지
    <div style={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: COLORS.bgMain,
      overflow: 'hidden' // 전체 화면 스크롤 방지
    }}>
      <Navigation />

      {/* Page Header */}
      <div style={{
        textAlign: 'center',
        padding: '20px 20px 60px',
        backgroundColor: COLORS.bgMain,
        flexShrink: 0
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
          marginBottom: '12px'
        }}>
          <img
            src="/mom.png"
            alt="어미새"
            style={{
              width: '76px',
              height: '76px',
              objectFit: 'contain'
            }}
          />
          <h1 style={{
            fontSize: '32px',
            fontWeight: '700',
            color: COLORS.textMain,
            marginBottom: '12px'
            // lineHeight: '1.2'
          }}>
            어미새 챗봇
          </h1>
        </div>
        <p style={{ fontSize: '16px', color: COLORS.textSub }}>
          막막한 계약 용어를 쉽게 설명해드려요. 법적 문제는 전문가와 상담하세요.
        </p>
      </div>

      {/* Main Layout Container (Card Style with Overlap) */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        maxWidth: '1000px',
        margin: '-30px auto 60px', // 헤더와 겹치도록 음수 마진 적용
        backgroundColor: COLORS.bgCard,
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
        borderRadius: '16px', // 상단 모서리 둥글게
        position: 'relative',
        overflow: 'hidden',
        zIndex: 10,
        border: `1px solid ${COLORS.border}`,
        borderBottom: 'none'
      }}>
        
        {/* 기존 내부 Chat Header 제거됨 */}

        {/* Messages Area */}
        <div style={{
          flex: 1,
          overflowY: 'auto', 
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          scrollBehavior: 'smooth',
          minHeight: 0,
          backgroundColor: '#F9F7F5' // 채팅 영역 내부 배경색 (선택사항)
        }}>
          {messages.map((message, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
                alignItems: 'flex-start',
                gap: '10px'
              }}
            >
              {message.role === 'assistant' && (
                <div style={{
                  width: '36px', height: '36px', borderRadius: '50%',
                  backgroundColor: COLORS.bgMain,
                  display: 'flex', alignItems: 'baseline', justifyContent: 'center',
                  flexShrink: 0, marginTop: '4px'
                }}>
                  <img src="/mom.png" alt="어미새" style={{ width: '32px' }} />
                </div>
              )}
              
              <div
                style={{
                  maxWidth: '75%',
                  padding: '12px 18px',
                  borderRadius: '12px',
                  borderTopLeftRadius: '12px',
                  borderTopRightRadius: '12px',
                  borderBottomLeftRadius: message.role === 'assistant' ? '4px' : '12px',
                  borderBottomRightRadius: message.role === 'user' ? '4px' : '12px',
                  backgroundColor: message.role === 'user' ? COLORS.userBubble : COLORS.aiBubble,
                  color: message.role === 'user' ? '#FFFFFF' : COLORS.textMain,
                  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                  fontSize: '15px'
                }}
              >
                <p style={{ margin: 0, lineHeight: '1.6', whiteSpace: 'pre-wrap', color: 'inherit' }}>
                  {message.content}
                </p>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div style={{ display: 'flex', gap: '10px' }}>
              <div style={{ width: '32px', height: '32px' }} />
              <div style={{
                padding: '12px 18px',
                borderRadius: '12px',
                borderTopLeftRadius: '12px',
                borderBottomLeftRadius: '4px',
                backgroundColor: COLORS.aiBubble,
                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
              }}>
                 <div style={{ display: 'flex', gap: '4px', alignItems: 'center', height: '24px' }}>
                  <span style={{ width: '6px', height: '6px', backgroundColor: COLORS.textSub, borderRadius: '50%', animation: 'bounce 1s infinite' }}></span>
                  <span style={{ width: '6px', height: '6px', backgroundColor: COLORS.textSub, borderRadius: '50%', animation: 'bounce 1s infinite 0.2s' }}></span>
                  <span style={{ width: '6px', height: '6px', backgroundColor: COLORS.textSub, borderRadius: '50%', animation: 'bounce 1s infinite 0.4s' }}></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>


        {/* Input & Suggested Area Wrapper */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderTop: `1px solid ${COLORS.border}`,
          flexShrink: 0 // 크기 축소 방지
        }}>
          {/* Suggested Questions */}
          <div style={{
            padding: '12px 24px 0',
            display: 'flex',
            gap: '8px',
            overflowX: 'auto',
            scrollbarWidth: 'none'
          }}>
            {suggestedQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => handleSuggestedQuestion(question)}
                style={{
                  padding: '8px 14px',
                  borderRadius: '20px',
                  border: `1px solid ${COLORS.textSub}`,
                  backgroundColor: '#FFFFFF',
                  color: COLORS.textSub,
                  fontSize: '12px',
                  fontWeight: '600',
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  flexShrink: 0
                }}
              >
                {question}
              </button>
            ))}
          </div>

          {/* Input Field */}
          <div style={{ padding: '16px 24px 24px', display: 'flex', gap: '10px' }}>
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="궁금한 내용을 입력하세요..."
              style={{
                flex: 1,
                padding: '12px 16px',
                borderRadius: '24px',
                border: '1px solid #D9D9D9',
                backgroundColor: '#F8F8F8',
                fontSize: '15px',
                outline: 'none',
                color: COLORS.textMain
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = COLORS.textSub;
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
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                backgroundColor: inputText.trim() && !isLoading ? COLORS.textSub : '#E8E8E8',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: inputText.trim() ? 'pointer' : 'default',
                transition: 'background-color 0.2s',
                flexShrink: 0
              }}
            >
              <Send size={20} color={inputText.trim() && !isLoading ? 'white' : '#999999'} />
            </button>
          </div>
        </div>

        <style>{`
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-4px); }
          }
        `}</style>
      </div>
    </div>
  );
}