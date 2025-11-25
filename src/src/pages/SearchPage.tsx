import { useState } from 'react';
import { Search, FileText, Scale } from 'lucide-react';
import type { LegalCase } from '../types';
import { legalAPI } from '../api/legal';
import Navigation from '../components/Navigation';

// Mock data - 확정일자 관련 판례 및 법령
const mockLegalCases: LegalCase[] = [
  {
    id: '1',
    type: 'case',
    title: '전세보증금 반환 청구 사건',
    court: '대법원',
    caseNumber: '2023다12345',
    date: '2023. 5. 15.',
    summary: `【판시사항】
임대차계약이 종료된 후 임차인이 임대인에게 목적물을 반환하였음에도 임대인이 보증금을 반환하지 않는 경우, 임차인은 보증금 반환청구권을 행사할 수 있습니다.

【판결요지】
1. 임대차계약이 종료되면 임대인은 임차인에게 보증금을 반환할 의무가 있습니다.
2. 임차인이 목적물을 명도하였다면, 특별한 사정이 없는 한 임대인은 지체 없이 보증금을 반환하여야 합니다.
3. 임대인이 보증금 반환을 지체하는 경우, 임차인은 지연손해금을 청구할 수 있습니다.

【참조조문】
민법 제618조, 주택임대차보호법 제3조

【참조판례】
대법원 2020다234567 판결`
  },
  {
    id: '2',
    type: 'law',
    title: '주택임대차보호법 제3조 (대항력 등)',
    lawName: '주택임대차보호법',
    article: '제3조',
    summary: `제3조(대항력 등)

① 임대차는 그 등기가 없는 경우에도 임차인이 주택의 인도와 주민등록을 마친 때에는 그 다음 날부터 제3자에 대하여 효력이 생긴다.

② 임차인은 임차주택을 양수인에게 인도하고 보증금을 반환받을 때까지는 양수인에게 대항할 수 있다.

③ 제1항의 대항요건을 갖춘 임차인은 민사집행법에 따른 경매 또는 국세징수법에 따른 공매 시 임차주택(대지를 포함한다)의 환가대금에서 후순위권리자나 그 밖의 채권자보다 우선하여 보증금을 변제받을 권리가 있다.`
  }
];

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [displayedCases, setDisplayedCases] = useState<LegalCase[]>(mockLegalCases);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedCase, setSelectedCase] = useState<LegalCase | null>(null);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setHasSearched(true);
    setIsSearching(true);
    
    // 시연용: 어떤 검색어를 입력하더라도 확정일자 관련 목업 데이터를 표시
    setTimeout(() => {
      setDisplayedCases(mockLegalCases);
      setIsSearching(false);
    }, 500);
  };

  const placeholderText = '예: 확정일자, 전세사기, 보증금 반환';

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--color-bg-primary)'
    }}>
      <Navigation title="메인으로" showBack showLogin />

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
          법률과 판례를 쉽게 검색해보세요
        </p>
      </div>

      <div style={{
        padding: 'clamp(20px, 4vw, 32px) var(--spacing-lg)',
        maxWidth: '900px',
        margin: '0 auto'
      }}>
        {/* Search Section Title */}
        <h3 style={{
          marginBottom: 'clamp(16px, 3vw, 20px)',
          fontSize: 'clamp(18px, 3vw, 22px)',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--spacing-sm)'
        }}>
          <span style={{ fontSize: 'clamp(20px, 3.5vw, 24px)' }}>🔍</span>
          법률 및 판례 검색
        </h3>

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
        {isSearching ? (
          // Loading state
          <div style={{
            textAlign: 'center',
            padding: 'clamp(40px, 8vw, 60px)',
            color: 'var(--color-text-secondary)'
          }}>
            <div style={{
              fontSize: 'clamp(48px, 10vw, 64px)',
              marginBottom: 'clamp(16px, 3vw, 20px)',
              animation: 'pulse 1.5s ease-in-out infinite'
            }}>
              🔍
            </div>
            <p style={{ fontSize: 'clamp(16px, 3vw, 18px)' }}>
              검색 중...
            </p>
          </div>
        ) : (
          <>
            {/* Search Results (if searched) */}
            {hasSearched && (
              <div style={{ marginBottom: 'clamp(32px, 6vw, 48px)' }}>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'clamp(12px, 2vw, 16px)'
                }}>
                  {displayedCases.map((legalCase) => (
                    <div
                      key={legalCase.id}
                      onClick={() => setSelectedCase(legalCase)}
                      style={{
                        backgroundColor: 'var(--color-bg-white)',
                        borderRadius: 'var(--radius-lg)',
                        padding: 'clamp(16px, 3vw, 20px)',
                        boxShadow: 'var(--shadow-sm)',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        border: '2px solid transparent'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.borderColor = legalCase.type === 'case' 
                          ? 'var(--color-info)' 
                          : 'var(--color-accent-green)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.borderColor = 'transparent';
                      }}
                    >
                      <div style={{
                        display: 'flex',
                        gap: 'clamp(12px, 2vw, 16px)',
                        alignItems: 'center'
                      }}>
                        {/* Icon */}
                        <div style={{
                          width: 'clamp(40px, 8vw, 48px)',
                          height: 'clamp(40px, 8vw, 48px)',
                          borderRadius: 'var(--radius-md)',
                          backgroundColor: legalCase.type === 'case' 
                            ? 'var(--color-info)' + '20' 
                            : 'transparent',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}>
                          {legalCase.type === 'case' ? (
                            <Scale size={20} color="var(--color-info)" strokeWidth={2.5} />
                          ) : (
                            <span style={{ fontSize: 'clamp(24px, 5vw, 28px)' }}>📜</span>
                          )}
                        </div>

                        {/* Content */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <h3 style={{ 
                            fontSize: 'clamp(14px, 2.5vw, 16px)', 
                            marginBottom: 'clamp(4px, 1vw, 6px)',
                            fontWeight: '700'
                          }}>
                            {legalCase.title}
                          </h3>
                          
                          {legalCase.type === 'case' && (
                            <p style={{ 
                              fontSize: 'clamp(12px, 2vw, 13px)', 
                              color: 'var(--color-text-secondary)'
                            }}>
                              {legalCase.court} {legalCase.caseNumber}
                            </p>
                          )}
                          
                          {legalCase.type === 'law' && (
                            <p style={{ 
                              fontSize: 'clamp(12px, 2vw, 13px)', 
                              color: 'var(--color-text-secondary)'
                            }}>
                              {legalCase.lawName} {legalCase.article}
                            </p>
                          )}
                        </div>

                        {/* Arrow indicator */}
                        <div style={{
                          fontSize: 'clamp(18px, 3vw, 22px)',
                          color: 'var(--color-text-light)',
                          flexShrink: 0
                        }}>
                          →
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommended Legal Info (always show) */}
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
                gap: 'clamp(12px, 2vw, 16px)'
              }}>
                {mockLegalCases.map((legalCase) => (
                  <div
                    key={legalCase.id}
                    onClick={() => setSelectedCase(legalCase)}
                    style={{
                      backgroundColor: 'var(--color-bg-white)',
                      borderRadius: 'var(--radius-lg)',
                      padding: 'clamp(16px, 3vw, 20px)',
                      boxShadow: 'var(--shadow-sm)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      border: '2px solid transparent'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.borderColor = legalCase.type === 'case' 
                        ? 'var(--color-info)' 
                        : 'var(--color-accent-green)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.borderColor = 'transparent';
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      gap: 'clamp(12px, 2vw, 16px)',
                      alignItems: 'center'
                    }}>
                      {/* Icon */}
                      <div style={{
                        width: 'clamp(40px, 8vw, 48px)',
                        height: 'clamp(40px, 8vw, 48px)',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: legalCase.type === 'case' 
                          ? 'var(--color-info)' + '20' 
                          : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        {legalCase.type === 'case' ? (
                          <Scale size={20} color="var(--color-info)" strokeWidth={2.5} />
                        ) : (
                          <span style={{ fontSize: 'clamp(16px, 3vw, 18px)' }}>📜</span>
                        )}
                      </div>

                      {/* Content */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h3 style={{ 
                          fontSize: 'clamp(14px, 2.5vw, 16px)', 
                          marginBottom: 'clamp(4px, 1vw, 6px)',
                          fontWeight: '700'
                        }}>
                          {legalCase.title}
                        </h3>
                        
                        {legalCase.type === 'case' && (
                          <p style={{ 
                            fontSize: 'clamp(12px, 2vw, 13px)', 
                            color: 'var(--color-text-secondary)'
                          }}>
                            {legalCase.court} {legalCase.caseNumber}
                          </p>
                        )}
                        
                        {legalCase.type === 'law' && (
                          <p style={{ 
                            fontSize: 'clamp(12px, 2vw, 13px)', 
                            color: 'var(--color-text-secondary)'
                          }}>
                            {legalCase.lawName} {legalCase.article}
                          </p>
                        )}
                      </div>

                      {/* Arrow indicator */}
                      <div style={{
                        fontSize: 'clamp(18px, 3vw, 22px)',
                        color: 'var(--color-text-light)',
                        flexShrink: 0
                      }}>
                        →
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
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
            fontSize: 'clamp(14px, 2.5vw, 16px)', 
            lineHeight: '1.7',
            color: 'var(--color-text-primary)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: 'var(--spacing-sm)'
          }}>
            <span style={{ fontSize: 'clamp(16px, 2.5vw, 18px)', flexShrink: 0 }}>💡</span>
            <span>
              <strong>Tip:</strong> 구체적인 법률 질문은 어미새 챗봇에게 물어보시면 더 상세한 답변을 받으실 수 있어요!
            </span>
          </p>
        </div>
      </div>

      {/* Modal */}
      {selectedCase && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 'var(--spacing-lg)',
            zIndex: 1000,
            backdropFilter: 'blur(4px)'
          }}
          onClick={() => setSelectedCase(null)}
        >
          <div
            style={{
              backgroundColor: 'var(--color-bg-white)',
              borderRadius: 'var(--radius-xl)',
              padding: 'clamp(24px, 5vw, 40px)',
              maxWidth: '800px',
              width: '100%',
              maxHeight: '80vh',
              overflow: 'auto',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setSelectedCase(null)}
              style={{
                position: 'absolute',
                top: 'clamp(16px, 3vw, 24px)',
                right: 'clamp(16px, 3vw, 24px)',
                width: 'clamp(32px, 6vw, 40px)',
                height: 'clamp(32px, 6vw, 40px)',
                borderRadius: '50%',
                border: 'none',
                backgroundColor: 'var(--color-bg-secondary)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 'clamp(18px, 3vw, 24px)',
                color: 'var(--color-text-secondary)',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-border)';
                e.currentTarget.style.transform = 'scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-bg-secondary)';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              ✕
            </button>

            {/* Icon */}
            <div style={{
              width: 'clamp(56px, 10vw, 72px)',
              height: 'clamp(56px, 10vw, 72px)',
              borderRadius: 'var(--radius-lg)',
              backgroundColor: selectedCase.type === 'case' 
                ? 'var(--color-info)' + '20' 
                : 'var(--color-accent-green-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 'clamp(16px, 3vw, 24px)',
              boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)'
            }}>
              {selectedCase.type === 'case' ? (
                <Scale size={32} color="var(--color-info)" strokeWidth={2.5} />
              ) : (
                <FileText size={32} color="var(--color-accent-green)" strokeWidth={2.5} />
              )}
            </div>

            {/* Title */}
            <h2 style={{ 
              fontSize: 'clamp(20px, 4vw, 24px)',
              marginBottom: 'clamp(12px, 2vw, 16px)',
              fontWeight: '700'
            }}>
              {selectedCase.title}
            </h2>

            {/* Meta info */}
            {selectedCase.type === 'case' && (
              <div style={{
                display: 'flex',
                gap: 'clamp(8px, 1.5vw, 12px)',
                marginBottom: 'clamp(16px, 3vw, 24px)',
                flexWrap: 'wrap'
              }}>
                <span style={{
                  backgroundColor: 'var(--color-info)' + '20',
                  color: 'var(--color-info)',
                  padding: 'clamp(4px, 1vw, 6px) clamp(10px, 2vw, 14px)',
                  borderRadius: 'var(--radius-full)',
                  fontSize: 'clamp(12px, 2vw, 14px)',
                  fontWeight: '600'
                }}>
                  {selectedCase.court}
                </span>
                <span style={{
                  backgroundColor: 'var(--color-bg-secondary)',
                  color: 'var(--color-text-secondary)',
                  padding: 'clamp(4px, 1vw, 6px) clamp(10px, 2vw, 14px)',
                  borderRadius: 'var(--radius-full)',
                  fontSize: 'clamp(12px, 2vw, 14px)',
                  fontWeight: '600'
                }}>
                  {selectedCase.caseNumber}
                </span>
                {selectedCase.date && (
                  <span style={{
                    backgroundColor: 'var(--color-bg-secondary)',
                    color: 'var(--color-text-secondary)',
                    padding: 'clamp(4px, 1vw, 6px) clamp(10px, 2vw, 14px)',
                    borderRadius: 'var(--radius-full)',
                    fontSize: 'clamp(12px, 2vw, 14px)',
                    fontWeight: '600'
                  }}>
                    {selectedCase.date}
                  </span>
                )}
              </div>
            )}

            {selectedCase.type === 'law' && (
              <div style={{
                display: 'flex',
                gap: 'clamp(8px, 1.5vw, 12px)',
                marginBottom: 'clamp(16px, 3vw, 24px)',
                flexWrap: 'wrap'
              }}>
                <span style={{
                  backgroundColor: 'var(--color-accent-green-light)',
                  color: 'var(--color-accent-green)',
                  padding: 'clamp(4px, 1vw, 6px) clamp(10px, 2vw, 14px)',
                  borderRadius: 'var(--radius-full)',
                  fontSize: 'clamp(12px, 2vw, 14px)',
                  fontWeight: '600'
                }}>
                  {selectedCase.lawName}
                </span>
                {selectedCase.article && (
                  <span style={{
                    backgroundColor: 'var(--color-bg-secondary)',
                    color: 'var(--color-text-secondary)',
                    padding: 'clamp(4px, 1vw, 6px) clamp(10px, 2vw, 14px)',
                    borderRadius: 'var(--radius-full)',
                    fontSize: 'clamp(12px, 2vw, 14px)',
                    fontWeight: '600'
                  }}>
                    {selectedCase.article}
                  </span>
                )}
              </div>
            )}

            {/* Content */}
            <div style={{
              backgroundColor: 'var(--color-bg-secondary)',
              padding: 'clamp(20px, 4vw, 28px)',
              borderRadius: 'var(--radius-lg)',
              borderLeft: `4px solid ${selectedCase.type === 'case' ? 'var(--color-info)' : 'var(--color-accent-green)'}`
            }}>
              <p style={{
                fontSize: 'clamp(14px, 2.5vw, 16px)',
                lineHeight: '1.8',
                color: 'var(--color-text-primary)',
                whiteSpace: 'pre-wrap'
              }}>
                {selectedCase.summary}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}