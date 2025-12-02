import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/common/Navigation';
import { User, Home, MessageSquare, Bookmark, Edit2, Trash2, ExternalLink, Plus, X, Upload, FileText, Search } from 'lucide-react';
import type { User as UserType, Property, Conversation, URLResource } from '../types';
import { useAuth } from '../context/AuthContext';
import DocumentAnalysisModal from '../components/common/DocumentAnalysisModal';

type TabType = 'profile' | 'property' | 'conversations' | 'links';

// Mock data
const mockUser: UserType = {
  id: '1',
  email: 'asgi.doongzi@gmail.com',
  name: '김아기',
  phone: '010-1234-5678',
  createdAt: new Date('2024-01-01')
};

const mockProperties: Property[] = [
  {
    id: '1',
    userId: '1',
    address: '서울특별시 강남구 테헤란로 123',
    propertyType: 'apartment',
    contractType: 'jeonse',
    deposit: 300000000,
    createdAt: new Date('2024-01-15'),
    nickname: '16평 남향 아파트'
  },
  {
    id: '2',
    userId: '1',
    address: '서울특별시 강서구 공항대로 456',
    propertyType: 'officetel',
    contractType: 'monthly',
    deposit: 10000000,
    monthlyRent: 700000,
    createdAt: new Date('2024-02-08'),
    nickname: '13평 강서구 오피스텔'
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
    url: 'https://portal.scourt.go.kr/pgp/index.on?m=PGP1011M01&l=N&c=900',
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
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [user] = useState<UserType>(mockUser);
  const [properties, setProperties] = useState<Property[]>(mockProperties);
  const [conversations] = useState<Conversation[]>(mockConversations);
  const [savedURLs] = useState<URLResource[]>(mockURLs);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false);
  const [isEditingProperty, setIsEditingProperty] = useState(false);
  const [editedProperty, setEditedProperty] = useState<Property | null>(null);

  const [isDocumentAnalysisOpen, setIsDocumentAnalysisOpen] = useState(false);
  const [analysisDocType, setAnalysisDocType] = useState<'임대차계약서' | '등기부등본' | '건축물대장' | null>(null);
  const [viewModalType, setViewModalType] = useState<'registry' | 'building' | 'contract' | null>(null);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);

  // [수정] 컬러 팔레트 정의
  const COLORS = {
    bgMain: '#F2E5D5',
    bgCard: '#FFFFFF',
    bgSub: '#F9F7F5',
    primary: '#A68263',
    primaryLight: 'rgba(166, 130, 99, 0.1)',
    primaryDark: '#8C6F5D',
    accent: '#8C0707',
    textMain: '#402211',
    textSub: '#857162',
    textLight: '#999999',
    border: '#E6D8CC',
    white: '#FFFFFF'
  };

  const tabs = [
    { id: 'profile' as TabType, name: '내 프로필', icon: User },
    { id: 'property' as TabType, name: '관심 주택', icon: Home },
    { id: 'conversations' as TabType, name: '대화 기록', icon: MessageSquare },
    { id: 'links' as TabType, name: '저장 링크', icon: Bookmark }
  ];

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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

  const handleStartEditProperty = () => {
    if (selectedProperty) {
      setEditedProperty({ ...selectedProperty });
      setIsEditingProperty(true);
    }
  };

  const handleSaveProperty = () => {
    if (editedProperty) {
      setProperties(properties.map(p =>
        p.id === editedProperty.id ? editedProperty : p
      ));
      setSelectedProperty(editedProperty);
      setIsEditingProperty(false);
    }
  };

  const handleCancelEdit = () => {
    setEditedProperty(null);
    setIsEditingProperty(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: COLORS.bgMain
    }}>
      <Navigation />

      {/* Page Header */}
      <div style={{
        textAlign: 'center',
        padding: '40px 20px 40px',
        backgroundColor: COLORS.bgMain
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          marginBottom: '12px'
        }}>
          <img
            src="/baby.png"
            alt="아기새"
            style={{
              width: '56px',
              height: '56px',
              objectFit: 'contain'
            }}
          />
          <h1 style={{
            fontSize: '36px',
            fontWeight: '700',
            color: COLORS.textMain,
            marginBottom: '0',
            lineHeight: '1.2'
          }}>
            마이페이지
          </h1>
        </div>
        <p style={{ fontSize: '16px', color: COLORS.textSub }}>
          내 정보와 보관함을 확인하세요
        </p>
      </div>

      <div style={{ 
        padding: '0 clamp(16px, 3vw, 24px) clamp(24px, 4vw, 32px)',
        maxWidth: '1000px',
        margin: '0 auto'
      }}>
        {/* [수정] Tabs - 체크리스트 스타일(버튼형)로 변경 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '8px',
          marginBottom: '24px'
        }}>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '12px',
                  backgroundColor: isActive ? COLORS.primary : COLORS.bgCard,
                  color: isActive ? COLORS.white : COLORS.textSub,
                  border: isActive ? 'none' : `1px solid ${COLORS.border}`,
                  borderRadius: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: isActive ? '0 4px 12px rgba(166, 130, 99, 0.2)' : 'none'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = COLORS.bgSub;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = COLORS.bgCard;
                  }
                }}
              >
                <Icon 
                  size={20} 
                  color={isActive ? COLORS.white : COLORS.textSub}
                />
                <span style={{
                  fontSize: 'clamp(12px, 1.5vw, 13px)',
                  fontWeight: isActive ? '700' : '500',
                  whiteSpace: 'nowrap'
                }}>
                  {tab.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        {activeTab === 'profile' && (
          <div>
            <div style={{
              backgroundColor: COLORS.bgCard,
              borderRadius: '16px',
              padding: 'clamp(24px, 5vw, 40px)',
              marginBottom: '24px',
              boxShadow: '0 4px 12px rgba(166, 130, 99, 0.1)',
              border: `1px solid ${COLORS.border}`
            }}>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                marginBottom: 'clamp(24px, 4vw, 32px)',
                textAlign: 'center'
              }}>
                <div style={{
                  width: 'clamp(80px, 15vw, 100px)',
                  height: 'clamp(80px, 15vw, 100px)',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  marginBottom: 'clamp(16px, 3vw, 20px)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  border: '4px solid white',
                  backgroundColor: COLORS.bgSub,
                  position: 'relative'
                }}>
                  <img 
                    src="/profile.png" 
                    alt="프로필 이미지"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.parentElement!.style.display = 'flex';
                      e.currentTarget.parentElement!.style.alignItems = 'center';
                      e.currentTarget.parentElement!.style.justifyContent = 'center';
                      e.currentTarget.parentElement!.style.background = COLORS.primaryLight;
                      e.currentTarget.parentElement!.innerText = '👤';
                      e.currentTarget.parentElement!.style.fontSize = '40px';
                    }}
                  />
                </div>
                
                <h2 style={{ 
                  marginBottom: '8px',
                  fontSize: 'clamp(22px, 4vw, 26px)',
                  color: COLORS.textMain,
                  fontWeight: '700'
                }}>
                  {user.name}
                </h2>
                  <p style={{ 
                    fontSize: '14px', 
                    color: COLORS.textSub
                  }}>
                    가입일: {formatDate(user.createdAt)}
                  </p>
                </div>

                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '16px 20px',
                    backgroundColor: COLORS.bgSub,
                    borderRadius: '12px',
                    flexWrap: 'wrap',
                    gap: '8px'
                  }}>
                    <span style={{ 
                      color: COLORS.textSub,
                      fontSize: '14px',
                      fontWeight: '600'
                    }}>
                      이메일
                    </span>
                    <span style={{ fontSize: '14px', color: COLORS.textMain, fontWeight: '500' }}>
                      {user.email}
                    </span>
                  </div>

                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '16px 20px',
                    backgroundColor: COLORS.bgSub,
                    borderRadius: '12px',
                    flexWrap: 'wrap',
                    gap: '8px'
                  }}>
                    <span style={{ 
                      color: COLORS.textSub,
                      fontSize: '14px',
                      fontWeight: '600'
                    }}>
                      전화번호
                    </span>
                    <span style={{ fontSize: '14px', color: COLORS.textMain, fontWeight: '500' }}>
                      {user.phone}
                    </span>
                  </div>
                </div>

                <button style={{
                  width: '100%',
                  marginTop: '28px',
                  padding: '16px',
                  backgroundColor: COLORS.primary,
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontWeight: '600',
                  fontSize: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 4px 12px rgba(166, 130, 99, 0.2)'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = COLORS.primaryDark}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = COLORS.primary}
                >
                  <Edit2 size={18} />
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
              marginBottom: '20px',
              flexWrap: 'wrap',
              gap: '16px'
            }}>
              <h3 style={{ fontSize: '20px', fontWeight: '700', color: COLORS.textMain }}>
                관심 주택 정보
              </h3>
              <button style={{
                padding: '10px 20px',
                backgroundColor: COLORS.primary,
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 12px rgba(166, 130, 99, 0.2)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = COLORS.primaryDark}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = COLORS.primary}
              >
                <Plus size={18} />
                주택 추가
              </button>
            </div>

            {properties.map((property) => (
              <div
                key={property.id}
                onClick={() => {
                  setSelectedProperty(property);
                  setIsDocumentModalOpen(true);
                }}
                style={{
                  backgroundColor: COLORS.bgCard,
                  borderRadius: '16px',
                  padding: '24px',
                  marginBottom: '16px',
                  boxShadow: '0 2px 8px rgba(166, 130, 99, 0.08)',
                  border: '2px solid transparent',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(166, 130, 99, 0.15)';
                  e.currentTarget.style.borderColor = COLORS.primary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(166, 130, 99, 0.08)';
                  e.currentTarget.style.borderColor = 'transparent';
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '12px',
                  gap: '16px'
                }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{
                      fontSize: '18px',
                      marginBottom: '8px',
                      fontWeight: '700',
                      color: COLORS.textMain,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      🏡 {property.nickname || '계약 예정 물건'}
                    </h3>
                    <span style={{
                      display: 'inline-block',
                      padding: '4px 10px',
                      backgroundColor: COLORS.primaryLight,
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '700',
                      color: COLORS.primary,
                      marginBottom: '8px'
                    }}>
                      {getContractTypeLabel(property.contractType)} · {getPropertyTypeLabel(property.propertyType)}
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // TODO: 편집 기능
                    }}
                    style={{
                      padding: '8px',
                      backgroundColor: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      flexShrink: 0,
                      borderRadius: '8px',
                      transition: 'background-color 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = COLORS.primaryLight}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <Edit2 size={18} color={COLORS.primary} />
                  </button>
                </div>

                <p style={{
                  fontSize: '14px',
                  color: COLORS.textSub,
                  marginBottom: '12px',
                  lineHeight: '1.6'
                }}>
                  📍 {property.address}
                </p>

                <p style={{
                  fontSize: '12px',
                  color: COLORS.textLight
                }}>
                  📌 {formatDate(property.createdAt)}
                </p>
              </div>
            ))}

            {properties.length === 0 && (
              <div style={{
                backgroundColor: COLORS.bgCard,
                borderRadius: '16px',
                padding: '60px',
                textAlign: 'center',
                color: COLORS.textSub,
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                border: `1px solid ${COLORS.border}`
              }}>
                <Home size={48} color={COLORS.textLight} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
                <p style={{ fontSize: '16px' }}>
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
              marginBottom: '20px',
              flexWrap: 'wrap',
              gap: '16px'
            }}>
              <h3 style={{ fontSize: '20px', fontWeight: '700', color: COLORS.textMain }}>
                대화 기록
              </h3>
              <span style={{ 
                fontSize: '13px', 
                color: COLORS.textSub,
                backgroundColor: COLORS.bgSub,
                padding: '6px 12px',
                borderRadius: '12px',
                fontWeight: '600',
                border: `1px solid ${COLORS.border}`
              }}>
                총 {conversations.length}개
              </span>
            </div>

            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => setSelectedConversation(conversation)}
                style={{
                  backgroundColor: COLORS.bgCard,
                  borderRadius: '16px',
                  padding: '24px',
                  marginBottom: '16px',
                  boxShadow: '0 2px 8px rgba(166, 130, 99, 0.08)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  border: '2px solid transparent'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(166, 130, 99, 0.15)';
                  e.currentTarget.style.borderColor = COLORS.primary;
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(166, 130, 99, 0.08)';
                  e.currentTarget.style.borderColor = 'transparent';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '12px',
                  gap: '16px'
                }}>
                  <h3 style={{
                    fontSize: '16px',
                    flex: 1,
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: COLORS.textMain
                  }}>
                    <span style={{ fontSize: '20px' }}>💬</span>
                    {conversation.title}
                  </h3>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // TODO: 삭제 기능
                    }}
                    style={{
                      padding: '6px',
                      backgroundColor: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      flexShrink: 0,
                      borderRadius: '4px',
                      transition: 'background-color 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FFEBEE'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <Trash2 size={18} color={COLORS.accent} />
                  </button>
                </div>

                <p style={{
                  fontSize: '14px',
                  color: COLORS.textSub,
                  marginBottom: '12px',
                  lineHeight: '1.6',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {conversation.lastMessage}
                </p>

                <p style={{
                  fontSize: '12px',
                  color: COLORS.textLight
                }}>
                  🕒 {formatDate(conversation.updatedAt)}
                </p>
              </div>
            ))}

            {conversations.length === 0 && (
              <div style={{
                backgroundColor: COLORS.bgCard,
                borderRadius: '16px',
                padding: '60px',
                textAlign: 'center',
                color: COLORS.textSub,
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                border: `1px solid ${COLORS.border}`
              }}>
                <MessageSquare size={48} color={COLORS.textLight} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
                <p style={{ fontSize: '16px' }}>
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
              marginBottom: '20px',
              flexWrap: 'wrap',
              gap: '16px'
            }}>
              <h3 style={{ fontSize: '20px', fontWeight: '700', color: COLORS.textMain }}>
                저장한 링크
              </h3>
              <button style={{
                padding: '10px 20px',
                backgroundColor: COLORS.primary, // [수정]
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 12px rgba(166, 130, 99, 0.2)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = COLORS.primaryDark}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = COLORS.primary}
              >
                <Plus size={18} />
                링크 추가
              </button>
            </div>

            {savedURLs.map((link) => (
              <div
                key={link.id}
                style={{
                  backgroundColor: COLORS.bgCard,
                  borderRadius: '16px',
                  padding: '24px',
                  marginBottom: '16px',
                  boxShadow: '0 2px 8px rgba(166, 130, 99, 0.08)',
                  border: '2px solid transparent',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(166, 130, 99, 0.15)';
                  e.currentTarget.style.borderColor = COLORS.primary;
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(166, 130, 99, 0.08)';
                  e.currentTarget.style.borderColor = 'transparent';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '12px',
                  gap: '16px'
                }}>
                  <div style={{ flex: 1 }}>
                    {link.category && (
                      <span style={{
                        display: 'inline-block',
                        padding: '4px 10px',
                        backgroundColor: COLORS.primaryLight,
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '700',
                        color: COLORS.primary,
                        marginBottom: '8px'
                      }}>
                        🏷️ {link.category}
                      </span>
                    )}
                    <h3 style={{ 
                      fontSize: '16px', 
                      marginBottom: '8px',
                      fontWeight: '600',
                      color: COLORS.textMain
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
                    borderRadius: '4px',
                    transition: 'background-color 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FFEBEE'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <Trash2 size={18} color={COLORS.accent} />
                  </button>
                </div>

                {link.description && (
                  <p style={{
                    fontSize: '14px',
                    color: COLORS.textSub,
                    marginBottom: '12px',
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
                  gap: '8px'
                }}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontSize: '13px',
                      color: COLORS.primary, // [수정]
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      textDecoration: 'underline',
                      fontWeight: '600'
                    }}
                  >
                    🔗 링크 열기
                    <ExternalLink size={14} />
                  </a>
                  <p style={{
                    fontSize: '12px',
                    color: COLORS.textLight
                  }}>
                    📌 {formatDate(link.savedAt)}
                  </p>
                </div>
              </div>
            ))}

            {savedURLs.length === 0 && (
              <div style={{
                backgroundColor: COLORS.bgCard,
                borderRadius: '16px',
                padding: '60px',
                textAlign: 'center',
                color: COLORS.textSub,
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                border: `1px solid ${COLORS.border}`
              }}>
                <Bookmark size={48} color={COLORS.textLight} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
                <p style={{ fontSize: '16px' }}>
                  저장한 링크가 없습니다
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Document Management Modal */}
      {/* (모달 내부 코드는 생략하지 않고 기존 로직 유지하되 색상 변수만 적용) */}
      {isDocumentModalOpen && selectedProperty && (
        <div
          onClick={() => setIsDocumentModalOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: COLORS.bgCard,
              borderRadius: '16px',
              width: '100%',
              maxWidth: '900px',
              maxHeight: '90vh',
              overflow: 'auto',
              boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
            }}
          >
            {/* Modal Header */}
            <div style={{
              padding: '20px 24px',
              borderBottom: `1px solid ${COLORS.border}`,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              position: 'sticky',
              top: 0,
              backgroundColor: COLORS.bgCard,
              zIndex: 10
            }}>
              <div style={{ flex: 1, marginRight: '16px' }}>
                {isEditingProperty && editedProperty ? (
                  // 편집 모드
                  <div>
                    <div style={{ marginBottom: '12px' }}>
                      <label style={{
                        display: 'block',
                        fontSize: '13px',
                        color: COLORS.textSub,
                        marginBottom: '4px',
                        fontWeight: '600'
                      }}>
                        별칭
                      </label>
                      <input
                        type="text"
                        value={editedProperty.nickname || ''}
                        onChange={(e) => setEditedProperty({ ...editedProperty, nickname: e.target.value })}
                        placeholder="예: 16평 남향 아파트"
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          fontSize: '16px',
                          border: `2px solid ${COLORS.border}`,
                          borderRadius: '8px',
                          outline: 'none',
                          transition: 'border-color 0.2s ease',
                          color: COLORS.textMain
                        }}
                        onFocus={(e) => e.currentTarget.style.borderColor = COLORS.primary}
                        onBlur={(e) => e.currentTarget.style.borderColor = COLORS.border}
                      />
                    </div>
                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '13px',
                        color: COLORS.textSub,
                        marginBottom: '4px',
                        fontWeight: '600'
                      }}>
                        주소
                      </label>
                      <input
                        type="text"
                        value={editedProperty.address}
                        onChange={(e) => setEditedProperty({ ...editedProperty, address: e.target.value })}
                        placeholder="주소를 입력하세요"
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          fontSize: '14px',
                          border: `2px solid ${COLORS.border}`,
                          borderRadius: '8px',
                          outline: 'none',
                          transition: 'border-color 0.2s ease',
                          color: COLORS.textMain
                        }}
                        onFocus={(e) => e.currentTarget.style.borderColor = COLORS.primary}
                        onBlur={(e) => e.currentTarget.style.borderColor = COLORS.border}
                      />
                    </div>
                    <div style={{
                      display: 'flex',
                      gap: '8px',
                      marginTop: '12px'
                    }}>
                      <button
                        onClick={handleSaveProperty}
                        style={{
                          padding: '8px 16px',
                          backgroundColor: COLORS.primary,
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          fontSize: '13px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'background-color 0.2s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = COLORS.primaryDark}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = COLORS.primary}
                      >
                        저장
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        style={{
                          padding: '8px 16px',
                          backgroundColor: COLORS.bgSub,
                          color: COLORS.textMain,
                          border: `1px solid ${COLORS.border}`,
                          borderRadius: '8px',
                          fontSize: '13px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'background-color 0.2s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = COLORS.border}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = COLORS.bgSub}
                      >
                        취소
                      </button>
                    </div>
                  </div>
                ) : (
                  // 보기 모드
                  <div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '4px'
                    }}>
                      <h2 style={{
                        fontSize: '24px',
                        fontWeight: '700',
                        margin: 0,
                        color: COLORS.textMain
                      }}>
                        📄 {selectedProperty.nickname || '계약 예정 물건'}
                      </h2>
                      <button
                        onClick={handleStartEditProperty}
                        style={{
                          padding: '6px',
                          backgroundColor: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          borderRadius: '4px',
                          transition: 'background-color 0.2s ease',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = COLORS.primaryLight}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <Edit2 size={16} color={COLORS.primary} />
                      </button>
                    </div>
                    <p style={{
                      fontSize: '14px',
                      color: COLORS.textSub,
                      margin: 0
                    }}>
                      {selectedProperty.address}
                    </p>
                  </div>
                )}
              </div>
              <button
                onClick={() => {
                  setIsDocumentModalOpen(false);
                  setIsEditingProperty(false);
                  setEditedProperty(null);
                }}
                style={{
                  padding: '8px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  borderRadius: '4px',
                  transition: 'background-color 0.2s ease',
                  flexShrink: 0
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = COLORS.bgSub}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <X size={24} color={COLORS.textSub} />
              </button>
            </div>

            {/* Modal Content */}
            <div style={{
              padding: '24px',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '16px'
            }}>
              {/* 각 문서 섹션 (등기부등본, 건축물대장, 계약서) */}
              {['등기부등본', '건축물대장', '계약서'].map((docName, index) => {
                 // 아이콘 및 변수 설정
                 const iconMap: Record<string, string> = { '등기부등본': '📋', '건축물대장': '🏗️', '계약서': '📝' };
                 const typeMap: Record<string, 'registry' | 'building' | 'contract'> = { '등기부등본': 'registry', '건축물대장': 'building', '계약서': 'contract' };
                 const analysisTypeMap: Record<string, '등기부등본' | '건축물대장' | '임대차계약서'> = { '등기부등본': '등기부등본', '건축물대장': '건축물대장', '계약서': '임대차계약서' };
                 
                 const docTypeKey = typeMap[docName];
                 const analysisKey = analysisTypeMap[docName];

                 return (
                  <div key={index} style={{
                    backgroundColor: COLORS.bgSub,
                    borderRadius: '12px',
                    padding: '18px',
                    border: `1px solid ${COLORS.border}`
                  }}>
                    <h3 style={{
                      fontSize: '15px',
                      fontWeight: '700',
                      marginBottom: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      color: COLORS.textMain
                    }}>
                      {iconMap[docName]} {docName}
                    </h3>

                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px'
                    }}>
                      <button
                        onClick={() => navigate('/checklist')}
                        style={{
                          padding: '10px 14px',
                          backgroundColor: 'transparent',
                          color: COLORS.primary,
                          border: `1px solid ${COLORS.primary}`,
                          borderRadius: '8px',
                          fontSize: '13px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'flex-start',
                          gap: '10px'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = COLORS.primary;
                          e.currentTarget.style.color = 'white';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = COLORS.primary;
                        }}
                      >
                        <Upload size={16} />
                        <span style={{ flex: 1, textAlign: 'left' }}>업로드</span>
                      </button>

                      <button
                        onClick={() => setViewModalType(docTypeKey)}
                        style={{
                          padding: '10px 14px',
                          backgroundColor: 'transparent',
                          color: COLORS.textMain,
                          border: `1px solid ${COLORS.border}`,
                          borderRadius: '8px',
                          fontSize: '13px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'flex-start',
                          gap: '10px'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = COLORS.primary;
                          e.currentTarget.style.backgroundColor = COLORS.primaryLight;
                          e.currentTarget.style.color = COLORS.primary;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = COLORS.border;
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = COLORS.textMain;
                        }}
                      >
                        <FileText size={16} />
                        <span style={{ flex: 1, textAlign: 'left' }}>조회</span>
                      </button>

                      <button
                        onClick={() => {
                          setAnalysisDocType(analysisKey);
                          setIsDocumentAnalysisOpen(true);
                        }}
                        style={{
                          padding: '10px 14px',
                          backgroundColor: 'transparent',
                          color: '#7DA8B8', // Info color
                          border: '1px solid #7DA8B8',
                          borderRadius: '8px',
                          fontSize: '13px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'flex-start',
                          gap: '10px'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#7DA8B8';
                          e.currentTarget.style.color = 'white';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = '#7DA8B8';
                        }}
                      >
                        <Search size={16} />
                        <span style={{ flex: 1, textAlign: 'left' }}>분석</span>
                      </button>
                    </div>
                  </div>
                 );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 분석 모달 */}
      {analysisDocType && (
        <DocumentAnalysisModal
          isOpen={isDocumentAnalysisOpen}
          onClose={() => {
            setIsDocumentAnalysisOpen(false);
            setAnalysisDocType(null);
          }}
          docType={analysisDocType}
        />
      )}

      {/* 조회 모달 */}
      {viewModalType && (
        <div
          onClick={() => setViewModalType(null)}
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
            zIndex: 1000,
            padding: '20px'
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: COLORS.bgCard,
              borderRadius: '16px',
              padding: '32px',
              maxWidth: '600px',
              width: '100%',
              maxHeight: '80vh',
              overflow: 'auto',
              boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '700', margin: 0, color: COLORS.textMain }}>
                {viewModalType === 'registry' && '등기부등본 조회'}
                {viewModalType === 'building' && '건축물대장 조회'}
                {viewModalType === 'contract' && '계약서 조회'}
              </h2>
              <button
                onClick={() => setViewModalType(null)}
                style={{
                  padding: '8px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  borderRadius: '8px'
                }}
              >
                <X size={24} color={COLORS.textSub} />
              </button>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <p style={{ fontSize: '14px', color: COLORS.textSub, marginBottom: '16px' }}>
                {selectedProperty?.address}
              </p>

              {/* 문서 기본 정보 (공통) */}
              <div style={{
                backgroundColor: COLORS.bgSub,
                padding: '20px',
                borderRadius: '12px',
                marginBottom: '16px',
                border: `1px solid ${COLORS.border}`
              }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px', color: COLORS.textMain }}>문서 정보</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '14px', color: COLORS.textSub }}>발급일</span>
                    <span style={{ fontSize: '14px', fontWeight: '600', color: COLORS.textMain }}>2024.11.27</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '14px', color: COLORS.textSub }}>상태</span>
                    <span style={{ fontSize: '14px', fontWeight: '600', color: COLORS.primary }}>정상</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '14px', color: COLORS.textSub }}>파일 크기</span>
                    <span style={{ fontSize: '14px', fontWeight: '600', color: COLORS.textMain }}>1.2 MB</span>
                  </div>
                </div>
              </div>

              {/* 등기부등본 상세 */}
              {viewModalType === 'registry' && (
                <div style={{
                  backgroundColor: COLORS.bgSub,
                  padding: '20px',
                  borderRadius: '12px',
                  marginBottom: '16px',
                  border: `1px solid ${COLORS.border}`
                }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px', color: COLORS.textMain }}>소유권 정보</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '14px', color: COLORS.textSub }}>소유자</span>
                      <span style={{ fontSize: '14px', fontWeight: '600', color: COLORS.textMain }}>홍길동</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '14px', color: COLORS.textSub }}>근저당</span>
                      <span style={{ fontSize: '14px', fontWeight: '600', color: COLORS.textMain }}>2억 5천만원</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '14px', color: COLORS.textSub }}>선순위</span>
                      <span style={{ fontSize: '14px', fontWeight: '600', color: COLORS.textMain }}>없음</span>
                    </div>
                  </div>
                </div>
              )}

              {/* 건축물대장 상세 */}
              {viewModalType === 'building' && (
                 <div style={{
                  backgroundColor: COLORS.bgSub,
                  padding: '20px',
                  borderRadius: '12px',
                  marginBottom: '16px',
                  border: `1px solid ${COLORS.border}`
                }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px', color: COLORS.textMain }}>건물 정보</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '14px', color: COLORS.textSub }}>건축년도</span>
                      <span style={{ fontSize: '14px', fontWeight: '600', color: COLORS.textMain }}>2018년</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '14px', color: COLORS.textSub }}>전용면적</span>
                      <span style={{ fontSize: '14px', fontWeight: '600', color: COLORS.textMain }}>84.5㎡</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '14px', color: COLORS.textSub }}>용도</span>
                      <span style={{ fontSize: '14px', fontWeight: '600', color: COLORS.textMain }}>아파트</span>
                    </div>
                  </div>
                </div>
              )}
              
              {/* 계약서 상세 */}
              {viewModalType === 'contract' && (
                <div style={{
                  backgroundColor: COLORS.bgSub,
                  padding: '20px',
                  borderRadius: '12px',
                  marginBottom: '16px',
                  border: `1px solid ${COLORS.border}`
                }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px', color: COLORS.textMain }}>계약 정보</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '14px', color: COLORS.textSub }}>계약일</span>
                      <span style={{ fontSize: '14px', fontWeight: '600', color: COLORS.textMain }}>2024.01.15</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '14px', color: COLORS.textSub }}>보증금</span>
                      <span style={{ fontSize: '14px', fontWeight: '600', color: COLORS.textMain }}>3억원</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '14px', color: COLORS.textSub }}>계약기간</span>
                      <span style={{ fontSize: '14px', fontWeight: '600', color: COLORS.textMain }}>2년</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => setViewModalType(null)}
              style={{
                width: '100%',
                padding: '14px',
                backgroundColor: COLORS.primary,
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '15px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'background-color 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = COLORS.primaryDark}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = COLORS.primary}
            >
              확인
            </button>
          </div>
        </div>
      )}

      {/* 대화 상세 모달 */}
      {selectedConversation && (
        <div
          onClick={() => setSelectedConversation(null)}
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
            zIndex: 1000,
            padding: '20px'
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: COLORS.bgCard,
              borderRadius: '16px',
              padding: '32px',
              maxWidth: '700px',
              width: '100%',
              maxHeight: '80vh',
              overflow: 'auto',
              boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
              <div style={{ flex: 1 }}>
                <h2 style={{ fontSize: '22px', fontWeight: '700', margin: '0 0 8px 0', color: COLORS.textMain }}>
                  {selectedConversation.title}
                </h2>
                <p style={{ fontSize: '13px', color: COLORS.textSub, margin: 0 }}>
                  {formatDate(selectedConversation.createdAt)}
                </p>
              </div>
              <button
                onClick={() => setSelectedConversation(null)}
                style={{
                  padding: '8px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  borderRadius: '8px',
                  flexShrink: 0
                }}
              >
                <X size={24} color={COLORS.textSub} />
              </button>
            </div>

            {/* 대화 내용 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* 사용자 메시지 */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <div style={{
                  backgroundColor: COLORS.primary, // [수정] 사용자 메시지는 브랜드 컬러
                  color: 'white',
                  padding: '12px 16px',
                  borderRadius: '12px 12px 4px 12px',
                  maxWidth: '80%'
                }}>
                  <p style={{ fontSize: '14px', lineHeight: '1.6', margin: 0 }}>
                    {selectedConversation.id === '1' && '확정일자가 뭔가요? 전입신고와 무슨 차이가 있나요?'}
                    {selectedConversation.id === '2' && '전세사기를 예방하려면 어떻게 해야 하나요?'}
                    {selectedConversation.id === '3' && '전세보증보험은 어디서 가입할 수 있나요?'}
                  </p>
                </div>
                <span style={{ fontSize: '12px', color: COLORS.textLight, marginTop: '4px' }}>
                  {formatDate(selectedConversation.createdAt)}
                </span>
              </div>

              {/* AI 응답 */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <div style={{
                  backgroundColor: COLORS.bgSub, // [수정] AI 메시지는 연한 배경
                  padding: '12px 16px',
                  borderRadius: '12px 12px 12px 4px',
                  maxWidth: '80%',
                  border: `1px solid ${COLORS.border}`,
                  color: COLORS.textMain
                }}>
                  <p style={{ fontSize: '14px', lineHeight: '1.6', margin: 0, whiteSpace: 'pre-wrap' }}>
                    {selectedConversation.lastMessage}
                  </p>
                </div>
                <span style={{ fontSize: '12px', color: COLORS.textLight, marginTop: '4px' }}>
                  둥지 AI · {formatDate(selectedConversation.updatedAt)}
                </span>
              </div>
            </div>

            <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: `1px solid ${COLORS.border}` }}>
              <button
                onClick={() => setSelectedConversation(null)}
                style={{
                  width: '100%',
                  padding: '14px',
                  backgroundColor: COLORS.primary,
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '15px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = COLORS.primaryDark}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = COLORS.primary}
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}