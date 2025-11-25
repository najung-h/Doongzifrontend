import { useState } from 'react';
import { Header } from '../components/Header';
import { Search, FileText, Scale } from 'lucide-react';
import type { LegalCase } from '../types';
import { legalAPI } from '../api/legal';

// Mock data - 2개의 하드코딩된 판례
const mockLegalCases: LegalCase[] = [
  {
    id: '1',
    type: 'case',
    title: '[판례] 전세보증금 반환 청구 사건',
    court: '대법원',
    caseNumber: '2023다12345',
    summary: '임차인이 임대차 계약 종료 후 전세보증금 반환을 청구한 사건. 임대인의 지연 반환에 대한 법적 책임이 인정되었습니다.'
  },
  {
    id: '2',
    type: 'law',
    title: '[법령] 주택임대차보호법 제3조 (대항력 등)',
    lawName: '주택임대차보호법',
    article: '제3조',
    summary: '임차인이 주택의 인도와 주민등록을 마친 때에는 그 다음 날부터 제3자에 대하여 효력이 생긴다. 임차인은 임대인에 대하여 임차주택에 관한 물권을 취득한 자에게도 임대차를 주장할 수 있다.'
  }
];

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [displayedCases, setDisplayedCases] = useState<LegalCase[]>(mockLegalCases);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setHasSearched(true);
    setIsSearching(true);
    
    try {
      const result = await legalAPI.searchLegal(searchQuery, 'all');
      
      if (result.success && result.results.length > 0) {
        setDisplayedCases(result.results);
      } else {
        setDisplayedCases([]);
      }
    } catch (error) {
      console.error('검색 실패:', error);
      // 에러 시 mock data 표시
      setDisplayedCases(mockLegalCases);
    } finally {
      setIsSearching(false);
    }
  };

  const placeholderText = '예: 확정일자, 전세사기, 보증금 반환';

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--color-bg-primary)'
    }}>
      <Header title="메인으로" showBack showLogin />

      {/* Page Header */}
      <div style={{
        padding: 'clamp(24px, 5vw, 40px) var(--spacing-lg)',
        textAlign: 'center',
        backgroundColor: 'var(--color-bg-white)',
        borderBottom: '2px solid var(--color-border)',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ 
          fontSize: 'clamp(56px, 12vw, 72px)', 
          marginBottom: 'clamp(12px, 2vw, 16px)',
          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
        }}>
          👨‍⚖️
        </div>
        <h2 style={{ 
          marginBottom: 'clamp(8px, 1.5vw, 12px)',
          fontSize: 'clamp(22px, 4vw, 28px)'
        }}>
          똑똑한 법률 사전
        </h2>
        <p style={{ 
          fontSize: 'clamp(14px, 2.5vw, 16px)', 
          color: 'var(--color-text-secondary)' 
        }}>
          궁금한 건 언제든 물어봐!
        </p>
      </div>

      <div style={{
        padding: 'clamp(20px, 4vw, 32px) var(--spacing-lg)',
        maxWidth: '900px',
        margin: '0 auto'
      }}>
        {/* Search Bar */}
        <div style={{
          display: 'flex',
          gap: 'clamp(8px, 2vw, 12px)',
          marginBottom: 'clamp(24px, 5vw, 32px)',
          flexWrap: 'wrap'
        }}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            placeholder={hasSearched ? placeholderText : '확정일자'}
            style={{
              flex: 1,
              minWidth: 'min(100%, 250px)',
              padding: 'clamp(14px, 2.5vw, 16px) clamp(18px, 3vw, 24px)',
              borderRadius: 'var(--radius-full)',
              border: '2px solid var(--color-border)',
              backgroundColor: 'var(--color-bg-white)',
              fontSize: 'clamp(14px, 2.5vw, 16px)',
              outline: 'none',
              transition: 'all 0.2s ease',
              boxShadow: 'var(--shadow-sm)'
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-accent-green)';
              e.currentTarget.style.boxShadow = '0 0 0 3px var(--color-accent-green-light)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-border)';
              e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
            }}
          />
          <button
            onClick={handleSearch}
            style={{
              padding: 'clamp(14px, 2.5vw, 16px) clamp(24px, 4vw, 32px)',
              borderRadius: 'var(--radius-full)',
              border: 'none',
              backgroundColor: 'var(--color-accent-green)',
              color: 'white',
              fontWeight: '700',
              fontSize: 'clamp(14px, 2.5vw, 16px)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 'clamp(6px, 1vw, 8px)',
              transition: 'all 0.2s ease',
              boxShadow: 'var(--shadow-md)',
              whiteSpace: 'nowrap'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-accent-green-hover)';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-accent-green)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'var(--shadow-md)';
            }}
          >
            <Search size={18} />
            검색
          </button>
        </div>

        {/* Results or Empty State */}
        {!hasSearched ? (
          // Initial state - Show mock cases
          <div>
            <h3 style={{ 
              marginBottom: 'clamp(16px, 3vw, 24px)',
              fontSize: 'clamp(18px, 3vw, 22px)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-sm)'
            }}>
              <span style={{ fontSize: 'clamp(20px, 3.5vw, 24px)' }}>📚</span>
              추천 법률 정보
            </h3>
            
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'clamp(16px, 3vw, 20px)'
            }}>
              {displayedCases.map((legalCase) => (
                <div
                  key={legalCase.id}
                  style={{
                    backgroundColor: 'var(--color-bg-white)',
                    borderRadius: 'var(--radius-lg)',
                    padding: 'clamp(20px, 4vw, 28px)',
                    boxShadow: 'var(--shadow-md)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    border: '2px solid transparent'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.12)';
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.borderColor = legalCase.type === 'case' 
                      ? 'var(--color-info)' 
                      : 'var(--color-accent-green)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = 'transparent';
                  }}
                >
                  <div style={{
                    display: 'flex',
                    gap: 'clamp(16px, 3vw, 20px)',
                    alignItems: 'flex-start'
                  }}>
                    {/* Icon */}
                    <div style={{
                      width: 'clamp(48px, 10vw, 56px)',
                      height: 'clamp(48px, 10vw, 56px)',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: legalCase.type === 'case' 
                        ? 'var(--color-info)' + '20' 
                        : 'var(--color-accent-green-light)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)'
                    }}>
                      {legalCase.type === 'case' ? (
                        <Scale size={24} color="var(--color-info)" strokeWidth={2.5} />
                      ) : (
                        <FileText size={24} color="var(--color-accent-green)" strokeWidth={2.5} />
                      )}
                    </div>

                    {/* Content */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h3 style={{ 
                        fontSize: 'clamp(15px, 2.5vw, 18px)', 
                        marginBottom: 'clamp(8px, 1.5vw, 12px)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'clamp(6px, 1vw, 8px)',
                        fontWeight: '700',
                        flexWrap: 'wrap'
                      }}>
                        {legalCase.title}
                        <span style={{ fontSize: 'clamp(18px, 3vw, 22px)' }}>📋</span>
                      </h3>
                      
                      {legalCase.type === 'case' && (
                        <p style={{ 
                          fontSize: 'clamp(12px, 2vw, 14px)', 
                          color: 'var(--color-text-secondary)',
                          marginBottom: 'clamp(10px, 2vw, 12px)',
                          fontWeight: '600',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 'var(--spacing-xs)',
                          flexWrap: 'wrap'
                        }}>
                          <span>⚖️</span>
                          {legalCase.court} {legalCase.caseNumber}
                        </p>
                      )}
                      
                      {legalCase.type === 'law' && (
                        <p style={{ 
                          fontSize: 'clamp(12px, 2vw, 14px)', 
                          color: 'var(--color-text-secondary)',
                          marginBottom: 'clamp(10px, 2vw, 12px)',
                          fontWeight: '600',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 'var(--spacing-xs)',
                          flexWrap: 'wrap'
                        }}>
                          <span>📖</span>
                          {legalCase.lawName}
                        </p>
                      )}
                      
                      {legalCase.summary && (
                        <p style={{
                          fontSize: 'clamp(13px, 2vw, 15px)',
                          lineHeight: '1.7',
                          color: 'var(--color-text-primary)',
                          backgroundColor: 'var(--color-bg-secondary)',
                          padding: 'clamp(12px, 2vw, 16px)',
                          borderRadius: 'var(--radius-md)',
                          borderLeft: `4px solid ${legalCase.type === 'case' ? 'var(--color-info)' : 'var(--color-accent-green)'}`
                        }}>
                          {legalCase.summary}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          // After search - Empty state
          <div style={{
            backgroundColor: 'var(--color-bg-white)',
            borderRadius: 'var(--radius-lg)',
            padding: 'clamp(40px, 8vw, 60px)',
            textAlign: 'center',
            boxShadow: 'var(--shadow-md)'
          }}>
            <Search 
              size={64} 
              color="var(--color-text-light)" 
              style={{ 
                margin: '0 auto clamp(20px, 4vw, 32px)',
                opacity: 0.5
              }} 
            />
            <p style={{ 
              fontSize: 'clamp(15px, 2.5vw, 18px)',
              color: 'var(--color-text-secondary)',
              marginBottom: 'clamp(24px, 5vw, 32px)',
              lineHeight: '1.7',
              maxWidth: '500px',
              margin: '0 auto clamp(24px, 5vw, 32px)'
            }}>
              검색어를 입력하면<br />
              관련 판례와 법률을 찾아드립니다.
            </p>
            <button
              onClick={() => window.location.href = '/chatbot'}
              style={{
                padding: 'clamp(14px, 2.5vw, 16px) clamp(24px, 4vw, 32px)',
                backgroundColor: 'var(--color-accent-green)',
                color: 'white',
                border: 'none',
                borderRadius: 'var(--radius-full)',
                fontWeight: '700',
                fontSize: 'clamp(14px, 2.5vw, 16px)',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 'clamp(8px, 1.5vw, 10px)',
                boxShadow: 'var(--shadow-md)',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-accent-green-hover)';
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-accent-green)';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <span style={{ fontSize: 'clamp(18px, 3vw, 22px)' }}>🐦</span>
              어미새 챗봇에게 물어보기
            </button>
          </div>
        )}

        {/* Info Box */}
        <div style={{
          marginTop: 'clamp(24px, 5vw, 32px)',
          backgroundColor: 'var(--color-accent-green-light)',
          border: '2px solid var(--color-accent-green)',
          borderRadius: 'var(--radius-lg)',
          padding: 'clamp(16px, 3vw, 20px)',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <p style={{ 
            fontSize: 'clamp(13px, 2vw, 14px)', 
            lineHeight: '1.7',
            color: 'var(--color-text-primary)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: 'var(--spacing-sm)'
          }}>
            <span style={{ fontSize: 'clamp(16px, 2.5vw, 18px)', flexShrink: 0 }}>💡</span>
            <span>
              <strong>Tip:</strong> 구체적인 법률 질문은 어미새 챗봇에게 물어보시면 더 정확한 답변을 받으실 수 있습니다!
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}