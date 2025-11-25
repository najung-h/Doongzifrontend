import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { X, Upload, Mail, CheckCircle, MessageCircle } from 'lucide-react';
import { scanAPI } from '../api/scan';
import FloatingChatWidget from '../components/FloatingChatWidget';

export default function HomePage() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [uploadStep, setUploadStep] = useState<'upload' | 'email' | 'complete'>('upload');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [email, setEmail] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleFileSubmit = async () => {
    if (!selectedFile) return;
    
    setIsUploading(true);
    try {
      // 파일 업로드 API 호출
      const result = await scanAPI.uploadDocument(selectedFile);
      
      if (result.success) {
        // 업로드 성공시 이메일 입력 단계로 이동
        setUploadStep('email');
      } else {
        alert('파일 업로드에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (error) {
      console.error('파일 업로드 오류:', error);
      alert('파일 업로드 중 오류가 발생했습니다.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleEmailSubmit = () => {
    if (!email || !email.includes('@')) {
      alert('올바른 이메일을 입력해주세요.');
      return;
    }
    
    // 완료 단계로 이동
    setUploadStep('complete');
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setUploadStep('upload');
    setSelectedFile(null);
    setEmail('');
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#FAF8F3'
    }}>
      {/* Top Navigation */}
      <nav style={{
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid #E5E5E5',
        padding: '16px 40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Left Menu */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '32px'
        }}>
          <div style={{
            width: '24px',
            height: '24px',
            backgroundColor: '#9ACD32',
            borderRadius: '4px'
          }} />
          <button
            onClick={() => navigate('/checklist')}
            style={{
              background: 'none',
              border: 'none',
              color: '#2C2C2C',
              fontSize: '15px',
              cursor: 'pointer',
              padding: '8px 0'
            }}
          >
            체크리스트
          </button>
          <button
            onClick={() => navigate('/chatbot')}
            style={{
              background: 'none',
              border: 'none',
              color: '#2C2C2C',
              fontSize: '15px',
              cursor: 'pointer',
              padding: '8px 0'
            }}
          >
            AI 챗봇
          </button>
          <button
            onClick={() => navigate('/search')}
            style={{
              background: 'none',
              border: 'none',
              color: '#2C2C2C',
              fontSize: '15px',
              cursor: 'pointer',
              padding: '8px 0'
            }}
          >
            법률 검색
          </button>
        </div>

        {/* Center Logo */}
        <div style={{
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            backgroundColor: '#FFE4C4',
            borderRadius: '50%'
          }} />
          <span style={{
            fontSize: '20px',
            fontWeight: '700',
            color: '#2C2C2C'
          }}>
            둥지
          </span>
        </div>

        {/* Right Buttons */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          <button
            style={{
              background: 'none',
              border: 'none',
              color: '#666666',
              fontSize: '15px',
              cursor: 'pointer',
              padding: '8px 16px'
            }}
          >
            로그인
          </button>
          <button
            onClick={() => navigate('/mypage')}
            style={{
              backgroundColor: '#8FBF4D',
              border: 'none',
              color: '#FFFFFF',
              fontSize: '15px',
              fontWeight: '600',
              cursor: 'pointer',
              padding: '10px 20px',
              borderRadius: '8px'
            }}
          >
            회원가입
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div style={{
        textAlign: 'center',
        padding: '60px 40px 50px'
      }}>
        <h2 style={{
          fontSize: '17px',
          fontWeight: '500',
          color: '#666666',
          marginBottom: '40px',
          letterSpacing: '-0.3px'
        }}>
          안전한 임대차 계약의 시작
        </h2>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '20px',
          marginBottom: '30px'
        }}>
          <div style={{
            width: '100px',
            height: '100px',
            backgroundColor: '#FFE4C4',
            borderRadius: '50%'
          }} />
          <div style={{
            textAlign: 'left'
          }}>
            <h1 style={{
              fontSize: '48px',
              fontWeight: '700',
              color: '#8FBF4D',
              marginBottom: '4px',
              lineHeight: '1',
              letterSpacing: '-1px'
            }}>
              둥지
            </h1>
            <p style={{
              fontSize: '16px',
              color: '#999999',
              fontWeight: '400',
              letterSpacing: '-0.3px'
            }}>
              집 찾는 아기새
            </p>
          </div>
        </div>

        <p style={{
          fontSize: '15px',
          color: '#2C2C2C',
          lineHeight: '1.7',
          marginBottom: '4px',
          letterSpacing: '-0.3px',
          fontWeight: '400'
        }}>
          처음 집을 구하는 사회 초년생을 위한 임대차 계약 가이드입니다.
        </p>
        <p style={{
          fontSize: '15px',
          color: '#2C2C2C',
          lineHeight: '1.7',
          letterSpacing: '-0.3px',
          fontWeight: '400'
        }}>
          법률 용어 한 줄 모르는 '아기새'도 안전하게 둥지를 틀 수 있도록 도와드릴게요.
        </p>
      </div>

      {/* Feature Cards */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 40px 80px',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: '20px',
        alignItems: 'start'
      }}>
        {/* Card 1: 둥지 스캔하기 */}
        <div
          onClick={openModal}
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            padding: '28px 24px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
            cursor: 'pointer',
            border: '1px solid #F0F0F0',
            display: 'flex',
            flexDirection: 'column',
            height: '100%'
          }}
        >
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
            marginBottom: '20px'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              backgroundColor: '#8B6F47',
              borderRadius: '50%',
              flexShrink: 0
            }} />
            <div>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '700',
                color: '#2C2C2C',
                marginBottom: '6px',
                letterSpacing: '-0.3px'
              }}>
                둥지 스캔하기
              </h3>
              <p style={{
                fontSize: '13px',
                color: '#666666',
                lineHeight: '1.5',
                letterSpacing: '-0.2px'
              }}>
                등기부등본, 건축물대장, 계약서를 업로드하면 어미새가 확인해드려요
              </p>
            </div>
          </div>

          <div style={{
            backgroundColor: '#FAFAFA',
            border: '2px dashed #D9D9D9',
            borderRadius: '12px',
            padding: '28px 16px',
            textAlign: 'center',
            marginBottom: '14px',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              backgroundColor: '#E8E8E8',
              borderRadius: '50%',
              margin: '0 auto 12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px'
            }}>
              ⬆
            </div>
            <p style={{
              fontSize: '13px',
              color: '#666666',
              marginBottom: '2px',
              letterSpacing: '-0.2px'
            }}>
              파일을 드래그하거나 클릭하여
            </p>
            <p style={{
              fontSize: '13px',
              color: '#666666',
              marginBottom: '10px',
              letterSpacing: '-0.2px'
            }}>
              업로드
            </p>
            <p style={{
              fontSize: '11px',
              color: '#999999',
              letterSpacing: '-0.1px'
            }}>
              PDF, JPG, PNG 파일 (최대 10MB)
            </p>
          </div>

          <div style={{
            backgroundColor: '#EEF5FF',
            border: '1px solid #D0E3FF',
            borderRadius: '8px',
            padding: '10px 14px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '8px'
          }}>
            <span style={{
              color: '#4A90E2',
              fontSize: '14px',
              lineHeight: '1',
              marginTop: '1px'
            }}>
              ℹ️
            </span>
            <div>
              <p style={{
                fontSize: '11px',
                color: '#4A90E2',
                fontWeight: '600',
                marginBottom: '3px',
                letterSpacing: '-0.1px'
              }}>
                확인하는 목록: 계약 전 조건, 건축물대장 등
              </p>
              <p style={{
                fontSize: '10px',
                color: '#666666',
                lineHeight: '1.4',
                letterSpacing: '-0.1px'
              }}>
                개인정보는 분석 후 즉시 서버에서 자동 삭제됩니다!
              </p>
            </div>
          </div>
        </div>

        {/* Card 2: 둥지 짓기 플랜 */}
        <div
          onClick={() => navigate('/checklist')}
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            padding: '40px 28px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
            cursor: 'pointer',
            border: '1px solid #F0F0F0',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            height: '100%',
            justifyContent: 'center'
          }}
        >
          <div style={{
            width: '80px',
            height: '80px',
            backgroundColor: '#4FC3F7',
            borderRadius: '50%',
            marginBottom: '24px'
          }} />
          <h3 style={{
            fontSize: '18px',
            fontWeight: '700',
            color: '#2C2C2C',
            marginBottom: '10px',
            letterSpacing: '-0.3px'
          }}>
            둥지 짓기 플랜
          </h3>
          <p style={{
            fontSize: '13px',
            color: '#666666',
            lineHeight: '1.6',
            letterSpacing: '-0.2px'
          }}>
            집 구하는 순서대로 하나씩 따라해보세요
          </p>
        </div>

        {/* Card 3 & 4: Right Column */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          height: '100%'
        }}>
          {/* 어미새 챗봇 */}
          <div
            onClick={() => navigate('/chatbot')}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              padding: '36px 24px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
              cursor: 'pointer',
              border: '1px solid #F0F0F0',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              flex: 1,
              justifyContent: 'center'
            }}
          >
            <div style={{
              width: '68px',
              height: '68px',
              backgroundColor: '#FFB74D',
              borderRadius: '50%',
              marginBottom: '18px'
            }} />
            <h3 style={{
              fontSize: '18px',
              fontWeight: '700',
              color: '#2C2C2C',
              marginBottom: '10px',
              letterSpacing: '-0.3px'
            }}>
              어미새 챗봇
            </h3>
            <p style={{
              fontSize: '13px',
              color: '#666666',
              lineHeight: '1.5',
              letterSpacing: '-0.2px'
            }}>
              막막한 계약 용어, 쉽게 알려줄게!
            </p>
          </div>

          {/* 똑똑한 법률 사전 */}
          <div
            onClick={() => navigate('/search')}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              padding: '36px 24px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
              cursor: 'pointer',
              border: '1px solid #F0F0F0',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              flex: 1,
              justifyContent: 'center'
            }}
          >
            <div style={{
              width: '68px',
              height: '68px',
              backgroundColor: '#4FC3F7',
              borderRadius: '50%',
              marginBottom: '18px'
            }} />
            <h3 style={{
              fontSize: '18px',
              fontWeight: '700',
              color: '#2C2C2C',
              marginBottom: '10px',
              letterSpacing: '-0.3px'
            }}>
              똑똑한 법률 사전
            </h3>
            <p style={{
              fontSize: '13px',
              color: '#666666',
              lineHeight: '1.5',
              letterSpacing: '-0.2px'
            }}>
              궁금한 건 언제든 물어봐!
            </p>
          </div>
        </div>
      </div>

      {/* Floating Chat Button */}
      <button
        onClick={() => setIsChatOpen(!isChatOpen)}
        style={{
          position: 'fixed',
          bottom: '32px',
          right: '32px',
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          backgroundColor: '#8FBF4D',
          border: 'none',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '28px',
          transition: 'transform 0.2s ease',
          zIndex: 9998
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        <MessageCircle size={32} color="#FFFFFF" />
        {/* Red notification dot */}
        {!isChatOpen && (
          <div style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            width: '12px',
            height: '12px',
            backgroundColor: '#FF5252',
            borderRadius: '50%',
            border: '2px solid #FFFFFF'
          }} />
        )}
      </button>

      {/* Floating Chat Widget */}
      <FloatingChatWidget
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />

      {/* Modal */}
      {isModalOpen && (
        <div 
          style={{
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}
          onClick={handleModalClose}
        >
          <div 
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              padding: '32px 40px',
              width: '500px',
              maxWidth: '90%',
              boxShadow: '0 4px 24px rgba(0, 0, 0, 0.15)',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={handleModalClose}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#999999',
                padding: '8px'
              }}
            >
              <X size={24} />
            </button>

            {/* Upload Step */}
            {uploadStep === 'upload' && (
              <div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '24px'
                }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    backgroundColor: '#8B6F47',
                    borderRadius: '50%'
                  }} />
                  <div>
                    <h2 style={{
                      fontSize: '22px',
                      fontWeight: '700',
                      color: '#2C2C2C',
                      marginBottom: '4px'
                    }}>
                      둥지 스캔하기
                    </h2>
                    <p style={{
                      fontSize: '13px',
                      color: '#666666'
                    }}>
                      등기부등본, 건축물대장, 계약서 중 하나를 선택해주세요
                    </p>
                  </div>
                </div>

                <div style={{
                  backgroundColor: '#FAFAFA',
                  border: '2px dashed #D9D9D9',
                  borderRadius: '12px',
                  padding: '40px 20px',
                  textAlign: 'center',
                  marginBottom: '20px',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onClick={() => document.getElementById('fileInput')?.click()}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#F5F5F5';
                  e.currentTarget.style.borderColor = '#8FBF4D';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#FAFAFA';
                  e.currentTarget.style.borderColor = '#D9D9D9';
                }}
                >
                  <div style={{
                    width: '64px',
                    height: '64px',
                    backgroundColor: '#E8E8E8',
                    borderRadius: '50%',
                    margin: '0 auto 16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Upload size={32} color="#8FBF4D" />
                  </div>
                  <p style={{
                    fontSize: '14px',
                    color: '#2C2C2C',
                    fontWeight: '600',
                    marginBottom: '8px'
                  }}>
                    파일을 드래그하거나 클릭하여 업로드
                  </p>
                  <p style={{
                    fontSize: '12px',
                    color: '#999999'
                  }}>
                    PDF, JPG, PNG 파일 (최대 10MB)
                  </p>
                </div>

                <input
                  type="file"
                  accept="application/pdf,image/jpeg,image/png"
                  onChange={handleFileSelect}
                  style={{ display: 'none' }}
                  id="fileInput"
                />

                {selectedFile && (
                  <div style={{
                    backgroundColor: '#F0F7FA',
                    border: '1px solid #D0E3FF',
                    borderRadius: '8px',
                    padding: '12px 16px',
                    marginBottom: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <CheckCircle size={20} color="#8FBF4D" />
                      <span style={{
                        fontSize: '13px',
                        color: '#2C2C2C',
                        fontWeight: '500'
                      }}>
                        {selectedFile.name}
                      </span>
                    </div>
                    <button
                      onClick={() => setSelectedFile(null)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#999999',
                        padding: '4px'
                      }}
                    >
                      <X size={18} />
                    </button>
                  </div>
                )}

                <button
                  onClick={handleFileSubmit}
                  disabled={!selectedFile || isUploading}
                  style={{
                    width: '100%',
                    backgroundColor: selectedFile && !isUploading ? '#8FBF4D' : '#E8E8E8',
                    color: selectedFile && !isUploading ? '#FFFFFF' : '#999999',
                    fontSize: '15px',
                    fontWeight: '600',
                    padding: '14px',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: selectedFile && !isUploading ? 'pointer' : 'not-allowed',
                    transition: 'all 0.2s'
                  }}
                >
                  {isUploading ? '업로드 중...' : '분석 시작하기'}
                </button>
              </div>
            )}

            {/* Email Step */}
            {uploadStep === 'email' && (
              <div>
                <div style={{
                  textAlign: 'center',
                  marginBottom: '24px'
                }}>
                  <div style={{
                    width: '64px',
                    height: '64px',
                    backgroundColor: '#E3F2FD',
                    borderRadius: '50%',
                    margin: '0 auto 16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Mail size={32} color="#2196F3" />
                  </div>
                  <h2 style={{
                    fontSize: '22px',
                    fontWeight: '700',
                    color: '#2C2C2C',
                    marginBottom: '8px'
                  }}>
                    분석 결과를 받을 이메일
                  </h2>
                  <p style={{
                    fontSize: '13px',
                    color: '#666666',
                    lineHeight: '1.5'
                  }}>
                    파일 분석이 완료되면 결과를 이메일로 전송해드려요
                  </p>
                </div>

                <div style={{
                  backgroundColor: '#FFF9E6',
                  border: '1px solid #FFE4B3',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  marginBottom: '20px'
                }}>
                  <p style={{
                    fontSize: '12px',
                    color: '#F57C00',
                    lineHeight: '1.6',
                    margin: 0
                  }}>
                    💡 <strong>개인정보 보호</strong><br />
                    업로드된 파일과 민감정보는 분석 완료 후 즉시 서버에서 자동으로 삭제됩니다.
                  </p>
                </div>

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@email.com"
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    marginBottom: '20px',
                    border: '1px solid #D9D9D9',
                    borderRadius: '8px',
                    fontSize: '15px',
                    color: '#2C2C2C',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#8FBF4D';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#D9D9D9';
                  }}
                />

                <button
                  onClick={handleEmailSubmit}
                  style={{
                    width: '100%',
                    backgroundColor: '#8FBF4D',
                    color: '#FFFFFF',
                    fontSize: '15px',
                    fontWeight: '600',
                    padding: '14px',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#7DA842';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#8FBF4D';
                  }}
                >
                  결과 받기
                </button>
              </div>
            )}

            {/* Complete Step */}
            {uploadStep === 'complete' && (
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  backgroundColor: '#E8F5E9',
                  borderRadius: '50%',
                  margin: '0 auto 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <CheckCircle size={48} color="#4CAF50" />
                </div>

                <h2 style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  color: '#2C2C2C',
                  marginBottom: '12px'
                }}>
                  분석 요청이 완료되었어요!
                </h2>

                <p style={{
                  fontSize: '14px',
                  color: '#666666',
                  lineHeight: '1.7',
                  marginBottom: '24px'
                }}>
                  분석 결과는 <strong style={{ color: '#8FBF4D' }}>{email}</strong>로<br />
                  5-10분 이내에 전송될 예정입니다.
                </p>

                <div style={{
                  backgroundColor: '#F0F7FA',
                  border: '1px solid #D0E3FF',
                  borderRadius: '8px',
                  padding: '16px',
                  marginBottom: '24px',
                  textAlign: 'left'
                }}>
                  <p style={{
                    fontSize: '12px',
                    color: '#2C2C2C',
                    lineHeight: '1.6',
                    margin: 0
                  }}>
                    📧 <strong>이메일 확인 안내</strong><br />
                    • 스팸 메일함도 확인해주세요<br />
                    • 발신자: noreply@doongzi.com<br />
                    • 10분 이내 미수신 시 고객센터로 문의해주세요
                  </p>
                </div>

                <div style={{
                  backgroundColor: '#FFF9E6',
                  border: '1px solid #FFE4B3',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  marginBottom: '24px'
                }}>
                  <p style={{
                    fontSize: '12px',
                    color: '#F57C00',
                    lineHeight: '1.6',
                    margin: 0
                  }}>
                    🔒 <strong>개인정보 보호</strong><br />
                    업로드하신 파일과 개인정보는 분석 완료 후<br />
                    즉시 서버에서 자동으로 삭제되었습니다.
                  </p>
                </div>

                <button
                  onClick={handleModalClose}
                  style={{
                    width: '100%',
                    backgroundColor: '#8FBF4D',
                    color: '#FFFFFF',
                    fontSize: '15px',
                    fontWeight: '600',
                    padding: '14px',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#7DA842';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#8FBF4D';
                  }}
                >
                  확인
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}