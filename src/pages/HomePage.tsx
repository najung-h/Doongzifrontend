import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { X, Upload, Mail, CheckCircle } from 'lucide-react';
import { scanAPI } from '../api/scan';
import Navigation from '../components/common/Navigation';

export default function HomePage() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
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
      // 파일 업로드 API 호출 (둥지 스캔하기 - 빠른 분석)
      // docType은 파일명이나 사용자 선택으로 결정 가능 (현재는 임대차계약서로 기본값)
      const result = await scanAPI.scanDocuments([selectedFile], '임대차계약서');
      
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
      <Navigation />

      {/* Hero Section */}
      <div style={{
        textAlign: 'center',
        padding: '60px 40px 50px'
      }}>
        <h2 style={{
          fontSize: '17px',
          fontWeight: '500',
          color: '#666666',
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
          <img
            src="/logo.png"
            alt="둥지 메인 로고"
            style={{
              width: '180px',
              height: '180px',
              objectFit: 'contain'
            }}
          />
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
            height: '100%',
            transition: 'all 0.3s ease',
            transform: 'scale(1)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.03)';
            e.currentTarget.style.borderColor = '#8FBF4D';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.borderColor = '#F0F0F0';
          }}
        >
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
            marginBottom: '20px'
          }}>
            <img
              src="/scan.png"
              alt="둥지스캔하기"
              style={{
                width: '56px',
                height: '56px',
                objectFit: 'contain',
                flexShrink: 0
              }}
            />
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
                letterSpacing: '-0.1px'
              }}>
                문서를 빠르게 스캔해서 완료된 체크리스트 항목을 자동으로 체크해드려요
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
            justifyContent: 'center',
            transition: 'all 0.3s ease',
            transform: 'scale(1)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.03)';
            e.currentTarget.style.borderColor = '#8FBF4D';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.borderColor = '#F0F0F0';
          }}
        >
          <img
            src="/baby.png"
            alt="아기새"
            style={{
              width: '96px',
              height: '96px',
              objectFit: 'contain',
              marginBottom: '24px'
            }}
          />
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
              justifyContent: 'center',
              transition: 'all 0.3s ease',
              transform: 'scale(1)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.03)';
              e.currentTarget.style.borderColor = '#8FBF4D';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.borderColor = '#F0F0F0';
            }}
          >
            <img
              src="/mom.png"
              alt="어미새"
              style={{
                width: '84px',
                height: '84px',
                objectFit: 'contain',
                marginBottom: '18px'
              }}
            />
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
              막막한 계약 용어를 쉽게 설명해드려요
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
              justifyContent: 'center',
              transition: 'all 0.3s ease',
              transform: 'scale(1)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.03)';
              e.currentTarget.style.borderColor = '#8FBF4D';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.borderColor = '#F0F0F0';
            }}
          >
            <img
              src="/law.png"
              alt="똑똑한 법률 사전"
              style={{
                width: '84px',
                height: '84px',
                objectFit: 'contain',
                marginBottom: '18px'
              }}
            />
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
              법률과 판례를 쉽게 검색해보세요
            </p>
          </div>
        </div>
      </div>

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

            {uploadStep === 'upload' && (
              <div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '24px'
                }}>
                  {/* [수정] 기존 div(갈색 원)를 img(둥지 이미지)로 교체 */}
                  <img
                    src="/scan.png"
                    alt="둥지스캔하기"
                    style={{
                      width: '48px',
                      height: '48px',
                      objectFit: 'contain'
                    }}
                  />
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
                      등기부등본, 건축물대장, 계약서를 업로드하면 어미새가 확인해드려요
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