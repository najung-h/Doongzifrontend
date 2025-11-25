import { useState } from 'react';
import { Header } from '../components/Header';
import { User, Home, MessageSquare, Bookmark, Edit2, Trash2, ExternalLink, Plus } from 'lucide-react';
import type { User as UserType, Property, Conversation, URLResource } from '../types';

type TabType = 'profile' | 'property' | 'conversations' | 'links';

// Mock data (will be replaced with Supabase)
const mockUser: UserType = {
  id: '1',
  email: 'doongzi@example.com',
  name: '김둥지',
  phone: '010-1234-5678',
  createdAt: new Date('2024-01-01')
};

const mockProperties: Property[] = [
  {
    id: '1',
    userId: '1',
    address: '서울특별시 강남구 역삼동 123-45',
    propertyType: 'apartment',
    contractType: 'jeonse',
    deposit: 300000000,
    createdAt: new Date('2024-01-15')
  }
];

const mockConversations: Conversation[] = [
  {
    id: '1',
    userId: '1',
    title: '확정일자에 대해 물어봤어요',
    lastMessage: '확정일자는 임대차 계약서에 날짜를 확정해주는 제도입니다. 전입신고와 함께 받으면 대항력을 갖게 됩니다...',
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01')
  },
  {
    id: '2',
    userId: '1',
    title: '전세사기 예방법 질문',
    lastMessage: '전세사기를 예방하려면 등기부등본을 꼭 확인해야 합니다. 선순위 권리관계와 근저당 설정액을 확인하세요...',
    createdAt: new Date('2024-02-03'),
    updatedAt: new Date('2024-02-03')
  },
  {
    id: '3',
    userId: '1',
    title: '보증보험 가입 방법',
    lastMessage: 'HUG(주택도시보증공사)나 SGI(서울보증보험)에서 전세보증보험에 가입할 수 있습니다...',
    createdAt: new Date('2024-02-05'),
    updatedAt: new Date('2024-02-05')
  }
];

const mockURLs: URLResource[] = [
  {
    id: '1',
    userId: '1',
    url: 'https://www.court.go.kr',
    title: '대법원 판례검색',
    description: '전세보증금 반환 관련 판례 모음',
    category: '법률',
    savedAt: new Date('2024-02-05')
  },
  {
    id: '2',
    userId: '1',
    url: 'https://www.molit.go.kr',
    title: '국토교통부 임대차 정보',
    description: '주택임대차보호법 관련 자료 및 FAQ',
    category: '정부자료',
    savedAt: new Date('2024-02-10')
  }
];

export default function MyPage() {
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [user] = useState<UserType>(mockUser);
  const [properties] = useState<Property[]>(mockProperties);
  const [conversations] = useState<Conversation[]>(mockConversations);
  const [savedURLs] = useState<URLResource[]>(mockURLs);

  const tabs = [
    { id: 'profile' as TabType, name: '내 프로필', icon: User },
    { id: 'property' as TabType, name: '내 주택 정보', icon: Home },
    { id: 'conversations' as TabType, name: '대화 기록', icon: MessageSquare },
    { id: 'links' as TabType, name: '저장한 링크', icon: Bookmark }
  ];

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return `${(amount / 10000).toLocaleString()}만원`;
  };

  const getContractTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      jeonse: '전세',
      monthly: '월세',
      purchase: '매매'
    };
    return labels[type] || type;
  };

  const getPropertyTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      apartment: '아파트',
      villa: '빌라',
      officetel: '오피스텔',
      house: '단독주택'
    };
    return labels[type] || type;
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--color-bg-primary)'
    }}>
      <Header title="마이페이지" showBack showLogin />

      {/* Tabs */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))',
        backgroundColor: 'var(--color-bg-white)',
        borderBottom: '2px solid var(--color-border)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        boxShadow: 'var(--shadow-sm)'
      }}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: 'clamp(12px, 2vw, 16px)',
                backgroundColor: activeTab === tab.id 
                  ? 'var(--color-accent-green-light)' 
                  : 'transparent',
                border: 'none',
                borderBottom: activeTab === tab.id 
                  ? '3px solid var(--color-accent-green)' 
                  : 'none',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 'clamp(4px, 1vw, 8px)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <Icon 
                size={20} 
                color={activeTab === tab.id ? 'var(--color-accent-green)' : 'var(--color-text-secondary)'} 
              />
              <span style={{
                fontSize: 'clamp(10px, 1.5vw, 12px)',
                color: activeTab === tab.id ? 'var(--color-accent-green)' : 'var(--color-text-secondary)',
                fontWeight: activeTab === tab.id ? '600' : '400',
                textAlign: 'center',
                whiteSpace: 'nowrap'
              }}>
                {tab.name}
              </span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div style={{ 
        padding: 'clamp(16px, 3vw, 24px)',
        maxWidth: '1000px',
        margin: '0 auto'
      }}>
        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div>
            <div style={{
              backgroundColor: 'var(--color-bg-white)',
              borderRadius: 'var(--radius-lg)',
              padding: 'clamp(20px, 4vw, 32px)',
              marginBottom: 'var(--spacing-md)',
              boxShadow: 'var(--shadow-md)'
            }}>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                marginBottom: 'clamp(24px, 4vw, 32px)',
                textAlign: 'center'
              }}>
                <div style={{
                  width: 'clamp(80px, 15vw, 120px)',
                  height: 'clamp(80px, 15vw, 120px)',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--color-accent-green-light) 0%, var(--color-accent-green) 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 'clamp(40px, 8vw, 56px)',
                  marginBottom: 'clamp(16px, 3vw, 20px)',
                  boxShadow: 'var(--shadow-md)',
                  border: '4px solid white'
                }}>
                  👤
                </div>
                <h2 style={{ 
                  marginBottom: 'clamp(8px, 1.5vw, 12px)',
                  fontSize: 'clamp(20px, 4vw, 26px)'
                }}>
                  {user.name}
                </h2>
                <p style={{ 
                  fontSize: 'clamp(12px, 2vw, 14px)', 
                  color: 'var(--color-text-secondary)' 
                }}>
                  가입일: {formatDate(user.createdAt)}
                </p>
              </div>

              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'clamp(12px, 2vw, 16px)'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: 'clamp(14px, 2.5vw, 18px)',
                  backgroundColor: 'var(--color-bg-secondary)',
                  borderRadius: 'var(--radius-md)',
                  flexWrap: 'wrap',
                  gap: 'var(--spacing-sm)'
                }}>
                  <span style={{ 
                    color: 'var(--color-text-secondary)',
                    fontSize: 'clamp(13px, 2vw, 15px)',
                    fontWeight: '600'
                  }}>
                    이메일
                  </span>
                  <span style={{ fontSize: 'clamp(13px, 2vw, 15px)' }}>
                    {user.email}
                  </span>
                </div>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: 'clamp(14px, 2.5vw, 18px)',
                  backgroundColor: 'var(--color-bg-secondary)',
                  borderRadius: 'var(--radius-md)',
                  flexWrap: 'wrap',
                  gap: 'var(--spacing-sm)'
                }}>
                  <span style={{ 
                    color: 'var(--color-text-secondary)',
                    fontSize: 'clamp(13px, 2vw, 15px)',
                    fontWeight: '600'
                  }}>
                    전화번호
                  </span>
                  <span style={{ fontSize: 'clamp(13px, 2vw, 15px)' }}>
                    {user.phone}
                  </span>
                </div>
              </div>

              <button style={{
                width: '100%',
                marginTop: 'clamp(20px, 3vw, 28px)',
                padding: 'clamp(14px, 2.5vw, 18px)',
                backgroundColor: 'var(--color-accent-green)',
                color: 'white',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                fontWeight: '600',
                fontSize: 'clamp(14px, 2vw, 16px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 'var(--spacing-sm)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-accent-green-hover)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-accent-green)';
              }}
              >
                <Edit2 size={16} />
                프로필 수정
              </button>
            </div>
          </div>
        )}

        {/* Property Tab */}
        {activeTab === 'property' && (
          <div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 'clamp(16px, 3vw, 20px)',
              flexWrap: 'wrap',
              gap: 'var(--spacing-md)'
            }}>
              <h3 style={{ fontSize: 'clamp(18px, 3vw, 22px)' }}>
                내 주택 정보
              </h3>
              <button style={{
                padding: 'clamp(10px, 2vw, 12px) clamp(16px, 3vw, 20px)',
                backgroundColor: 'var(--color-accent-green)',
                color: 'white',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                fontSize: 'clamp(13px, 2vw, 14px)',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-xs)',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-accent-green-hover)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-accent-green)';
              }}
              >
                <Plus size={16} />
                주택 추가
              </button>
            </div>

            {properties.map((property) => (
              <div
                key={property.id}
                style={{
                  backgroundColor: 'var(--color-bg-white)',
                  borderRadius: 'var(--radius-lg)',
                  padding: 'clamp(20px, 4vw, 28px)',
                  marginBottom: 'var(--spacing-md)',
                  boxShadow: 'var(--shadow-md)',
                  border: '2px solid transparent',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-accent-green)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'transparent';
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: 'clamp(16px, 3vw, 20px)',
                  gap: 'var(--spacing-md)'
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 'var(--spacing-xs)',
                      padding: '6px 12px',
                      backgroundColor: 'var(--color-accent-green-light)',
                      borderRadius: 'var(--radius-full)',
                      fontSize: 'clamp(11px, 1.8vw, 13px)',
                      fontWeight: '700',
                      color: 'var(--color-accent-green)',
                      marginBottom: 'clamp(12px, 2vw, 16px)'
                    }}>
                      <span>🏠</span>
                      {getContractTypeLabel(property.contractType)} · {getPropertyTypeLabel(property.propertyType)}
                    </div>
                    <p style={{ 
                      fontWeight: '600', 
                      marginBottom: 'clamp(8px, 1.5vw, 12px)',
                      fontSize: 'clamp(15px, 2.5vw, 17px)',
                      lineHeight: '1.5'
                    }}>
                      {property.address}
                    </p>
                  </div>
                  <button style={{
                    padding: '8px',
                    backgroundColor: 'var(--color-bg-secondary)',
                    border: 'none',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    flexShrink: 0
                  }}>
                    <Edit2 size={16} color="var(--color-text-secondary)" />
                  </button>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))',
                  gap: 'clamp(10px, 2vw, 12px)'
                }}>
                  {property.deposit && (
                    <div style={{
                      padding: 'clamp(14px, 2.5vw, 16px)',
                      backgroundColor: 'var(--color-bg-secondary)',
                      borderRadius: 'var(--radius-md)',
                      border: '2px solid var(--color-border)'
                    }}>
                      <span style={{ 
                        fontSize: 'clamp(12px, 1.8vw, 13px)', 
                        color: 'var(--color-text-secondary)',
                        display: 'block',
                        marginBottom: 'var(--spacing-xs)'
                      }}>
                        💰 보증금
                      </span>
                      <p style={{ 
                        fontWeight: '700', 
                        marginTop: 'var(--spacing-xs)',
                        fontSize: 'clamp(16px, 2.5vw, 20px)',
                        color: 'var(--color-accent-green)'
                      }}>
                        {formatCurrency(property.deposit)}
                      </p>
                    </div>
                  )}

                  {property.monthlyRent && (
                    <div style={{
                      padding: 'clamp(14px, 2.5vw, 16px)',
                      backgroundColor: 'var(--color-bg-secondary)',
                      borderRadius: 'var(--radius-md)',
                      border: '2px solid var(--color-border)'
                    }}>
                      <span style={{ 
                        fontSize: 'clamp(12px, 1.8vw, 13px)', 
                        color: 'var(--color-text-secondary)',
                        display: 'block',
                        marginBottom: 'var(--spacing-xs)'
                      }}>
                        📅 월세
                      </span>
                      <p style={{ 
                        fontWeight: '700', 
                        marginTop: 'var(--spacing-xs)',
                        fontSize: 'clamp(16px, 2.5vw, 20px)',
                        color: 'var(--color-accent-green)'
                      }}>
                        {formatCurrency(property.monthlyRent)}
                      </p>
                    </div>
                  )}
                </div>

                <p style={{
                  fontSize: 'clamp(11px, 1.8vw, 12px)',
                  color: 'var(--color-text-light)',
                  marginTop: 'clamp(16px, 3vw, 20px)'
                }}>
                  📌 등록일: {formatDate(property.createdAt)}
                </p>
              </div>
            ))}

            {properties.length === 0 && (
              <div style={{
                backgroundColor: 'var(--color-bg-white)',
                borderRadius: 'var(--radius-lg)',
                padding: 'clamp(40px, 8vw, 60px)',
                textAlign: 'center',
                color: 'var(--color-text-secondary)',
                boxShadow: 'var(--shadow-sm)'
              }}>
                <Home size={48} color="var(--color-text-light)" style={{ margin: '0 auto var(--spacing-lg)' }} />
                <p style={{ fontSize: 'clamp(14px, 2vw, 16px)' }}>
                  등록된 주택 정보가 없습니다
                </p>
              </div>
            )}
          </div>
        )}

        {/* Conversations Tab */}
        {activeTab === 'conversations' && (
          <div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 'clamp(16px, 3vw, 20px)',
              flexWrap: 'wrap',
              gap: 'var(--spacing-md)'
            }}>
              <h3 style={{ fontSize: 'clamp(18px, 3vw, 22px)' }}>
                대화 기록
              </h3>
              <span style={{ 
                fontSize: 'clamp(12px, 2vw, 14px)', 
                color: 'var(--color-text-secondary)',
                backgroundColor: 'var(--color-bg-secondary)',
                padding: '6px 12px',
                borderRadius: 'var(--radius-full)',
                fontWeight: '600'
              }}>
                총 {conversations.length}개
              </span>
            </div>

            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                style={{
                  backgroundColor: 'var(--color-bg-white)',
                  borderRadius: 'var(--radius-lg)',
                  padding: 'clamp(18px, 3.5vw, 24px)',
                  marginBottom: 'var(--spacing-md)',
                  boxShadow: 'var(--shadow-sm)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  border: '2px solid transparent'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                  e.currentTarget.style.borderColor = 'var(--color-accent-green)';
                  e.currentTarget.style.transform = 'translateX(4px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                  e.currentTarget.style.borderColor = 'transparent';
                  e.currentTarget.style.transform = 'translateX(0)';
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: 'clamp(10px, 2vw, 12px)',
                  gap: 'var(--spacing-md)'
                }}>
                  <h3 style={{ 
                    fontSize: 'clamp(15px, 2.5vw, 17px)', 
                    flex: 1,
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--spacing-sm)'
                  }}>
                    <span style={{ fontSize: 'clamp(16px, 2.5vw, 18px)' }}>💬</span>
                    {conversation.title}
                  </h3>
                  <button style={{
                    padding: '6px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    flexShrink: 0,
                    borderRadius: 'var(--radius-sm)',
                    transition: 'background-color 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--color-warning)' + '20';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                  >
                    <Trash2 size={16} color="var(--color-warning)" />
                  </button>
                </div>

                <p style={{
                  fontSize: 'clamp(13px, 2vw, 14px)',
                  color: 'var(--color-text-secondary)',
                  marginBottom: 'clamp(12px, 2vw, 16px)',
                  lineHeight: '1.6',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {conversation.lastMessage}
                </p>

                <p style={{
                  fontSize: 'clamp(11px, 1.8vw, 12px)',
                  color: 'var(--color-text-light)'
                }}>
                  🕒 {formatDate(conversation.updatedAt)}
                </p>
              </div>
            ))}

            {conversations.length === 0 && (
              <div style={{
                backgroundColor: 'var(--color-bg-white)',
                borderRadius: 'var(--radius-lg)',
                padding: 'clamp(40px, 8vw, 60px)',
                textAlign: 'center',
                color: 'var(--color-text-secondary)',
                boxShadow: 'var(--shadow-sm)'
              }}>
                <MessageSquare size={48} color="var(--color-text-light)" style={{ margin: '0 auto var(--spacing-lg)' }} />
                <p style={{ fontSize: 'clamp(14px, 2vw, 16px)' }}>
                  저장된 대화 기록이 없습니다
                </p>
              </div>
            )}
          </div>
        )}

        {/* Links Tab */}
        {activeTab === 'links' && (
          <div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 'clamp(16px, 3vw, 20px)',
              flexWrap: 'wrap',
              gap: 'var(--spacing-md)'
            }}>
              <h3 style={{ fontSize: 'clamp(18px, 3vw, 22px)' }}>
                저장한 링크
              </h3>
              <button style={{
                padding: 'clamp(10px, 2vw, 12px) clamp(16px, 3vw, 20px)',
                backgroundColor: 'var(--color-accent-green)',
                color: 'white',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                fontSize: 'clamp(13px, 2vw, 14px)',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-xs)',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-accent-green-hover)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-accent-green)';
              }}
              >
                <Plus size={16} />
                링크 추가
              </button>
            </div>

            {savedURLs.map((link) => (
              <div
                key={link.id}
                style={{
                  backgroundColor: 'var(--color-bg-white)',
                  borderRadius: 'var(--radius-lg)',
                  padding: 'clamp(18px, 3.5vw, 24px)',
                  marginBottom: 'var(--spacing-md)',
                  boxShadow: 'var(--shadow-sm)',
                  border: '2px solid transparent',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                  e.currentTarget.style.borderColor = 'var(--color-info)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                  e.currentTarget.style.borderColor = 'transparent';
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: 'clamp(10px, 2vw, 12px)',
                  gap: 'var(--spacing-md)'
                }}>
                  <div style={{ flex: 1 }}>
                    {link.category && (
                      <span style={{
                        display: 'inline-block',
                        padding: '4px 10px',
                        backgroundColor: 'var(--color-info)' + '20',
                        borderRadius: 'var(--radius-full)',
                        fontSize: 'clamp(10px, 1.5vw, 11px)',
                        fontWeight: '700',
                        color: 'var(--color-info)',
                        marginBottom: 'clamp(8px, 1.5vw, 10px)'
                      }}>
                        🏷️ {link.category}
                      </span>
                    )}
                    <h3 style={{ 
                      fontSize: 'clamp(15px, 2.5vw, 17px)', 
                      marginBottom: 'clamp(6px, 1vw, 8px)',
                      fontWeight: '600'
                    }}>
                      {link.title}
                    </h3>
                  </div>
                  <button style={{
                    padding: '6px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    flexShrink: 0,
                    borderRadius: 'var(--radius-sm)',
                    transition: 'background-color 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--color-warning)' + '20';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                  >
                    <Trash2 size={16} color="var(--color-warning)" />
                  </button>
                </div>

                {link.description && (
                  <p style={{
                    fontSize: 'clamp(13px, 2vw, 14px)',
                    color: 'var(--color-text-secondary)',
                    marginBottom: 'clamp(12px, 2vw, 16px)',
                    lineHeight: '1.6'
                  }}>
                    {link.description}
                  </p>
                )}

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: 'var(--spacing-sm)'
                }}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontSize: 'clamp(12px, 1.8vw, 13px)',
                      color: 'var(--color-accent-green)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--spacing-xs)',
                      textDecoration: 'underline',
                      fontWeight: '600'
                    }}
                  >
                    🔗 링크 열기
                    <ExternalLink size={12} />
                  </a>
                  <p style={{
                    fontSize: 'clamp(11px, 1.8vw, 12px)',
                    color: 'var(--color-text-light)'
                  }}>
                    📌 {formatDate(link.savedAt)}
                  </p>
                </div>
              </div>
            ))}

            {savedURLs.length === 0 && (
              <div style={{
                backgroundColor: 'var(--color-bg-white)',
                borderRadius: 'var(--radius-lg)',
                padding: 'clamp(40px, 8vw, 60px)',
                textAlign: 'center',
                color: 'var(--color-text-secondary)',
                boxShadow: 'var(--shadow-sm)'
              }}>
                <Bookmark size={48} color="var(--color-text-light)" style={{ margin: '0 auto var(--spacing-lg)' }} />
                <p style={{ fontSize: 'clamp(14px, 2vw, 16px)' }}>
                  저장한 링크가 없습니다
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
