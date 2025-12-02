import { useState } from 'react';
import { Mail, CheckCircle, X } from 'lucide-react';
import { scanAPI } from '../../api/scan';

interface NestScanModalProps {
  isOpen: boolean;
  onClose: () => void;
  file: File | null;
}

export default function NestScanModal({ isOpen, onClose, file }: NestScanModalProps) {
  const [email, setEmail] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [step, setStep] = useState<'email' | 'complete'>('email');

  // 컬러 상수 (Earth Tone)
  const COLORS = {
    brand: '#A68263',
    brandLight: 'rgba(166, 130, 99, 0.1)',
    textMain: '#402211',
    textSub: '#857162', // 또는 #A68263
    border: '#E6D8CC',
    bgOverlay: 'rgba(0,0,0,0.6)'
  };

  if (!isOpen || !file) return null;

  const handleEmailSubmit = async () => {
    if (!email || !email.includes('@')) {
      alert('올바른 이메일을 입력해주세요.');
      return;
    }

    setIsUploading(true);
    try {
      const result = await scanAPI.scanDocuments([file], email);
      
      if (result.success) {
        setStep('complete');
      } else {
        alert(result.message || '전송에 실패했습니다.');
      }
    } catch (error) {
      console.error(error);
      alert('분석 중 오류가 발생했습니다.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div 
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: COLORS.bgOverlay, zIndex: 1000,
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px',
        backdropFilter: 'blur(4px)'
      }} 
      onClick={onClose}
    >
      <div 
        style={{
          backgroundColor: 'white', borderRadius: '24px', padding: '40px',
          maxWidth: '500px', width: '100%', position: 'relative',
          boxShadow: '0 10px 40px rgba(166, 130, 99, 0.2)'
        }} 
        onClick={e => e.stopPropagation()}
      >
        
        {/* 닫기 버튼 */}
        <button onClick={onClose} style={{ position: 'absolute', top: '24px', right: '24px', background: 'none', border: 'none', cursor: 'pointer' }}>
          <X size={24} color={COLORS.textSub} />
        </button>

        {/* Email Step */}
        {step === 'email' && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{
                width: '64px', height: '64px',
                backgroundColor: COLORS.brandLight,
                borderRadius: '50%',
                margin: '0 auto 16px',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <Mail size={32} color={COLORS.brand} />
              </div>
              <h2 style={{
                fontSize: '22px', fontWeight: '700', color: COLORS.textMain, marginBottom: '8px'
              }}>
                분석 결과를 받을 이메일
              </h2>
              <p style={{ fontSize: '14px', color: COLORS.textSub, lineHeight: '1.5' }}>
                파일 분석이 완료되면 결과를 이메일로 전송해드려요
              </p>
            </div>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              style={{
                width: '100%', padding: '14px 16px', marginBottom: '20px',
                border: `1px solid ${COLORS.border}`, borderRadius: '8px',
                fontSize: '15px', color: COLORS.textMain, outline: 'none',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = COLORS.brand; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = COLORS.border; }}
            />

            <button
              onClick={handleEmailSubmit}
              disabled={isUploading}
              style={{
                width: '100%',
                backgroundColor: isUploading ? '#CCCCCC' : COLORS.brand,
                color: '#FFFFFF',
                fontSize: '15px', fontWeight: '600', padding: '14px',
                borderRadius: '8px', border: 'none', cursor: isUploading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => !isUploading && (e.currentTarget.style.backgroundColor = '#8C6F5D')}
              onMouseLeave={(e) => !isUploading && (e.currentTarget.style.backgroundColor = COLORS.brand)}
            >
              {isUploading ? '전송 중...' : '결과 받기'}
            </button>
          </div>
        )}

        {/* Complete Step */}
        {step === 'complete' && (
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '80px', height: '80px',
              backgroundColor: '#E8F5E9',
              borderRadius: '50%',
              margin: '0 auto 20px',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <CheckCircle size={48} color="#4CAF50" />
            </div>

            <h2 style={{
              fontSize: '24px', fontWeight: '700', color: COLORS.textMain, marginBottom: '12px'
            }}>
              분석 요청이 완료되었어요!
            </h2>

            <p style={{
              fontSize: '14px', color: COLORS.textSub, lineHeight: '1.7', marginBottom: '24px'
            }}>
              분석 결과는 <strong style={{ color: COLORS.brand }}>{email}</strong>로<br />
              5-10분 이내에 전송될 예정입니다.
            </p>

            <div style={{
              backgroundColor: COLORS.brandLight,
              border: `1px solid ${COLORS.border}`,
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '24px',
              textAlign: 'left'
            }}>
              <p style={{
                fontSize: '13px', color: COLORS.textMain, lineHeight: '1.6', margin: 0
              }}>
                📧 <strong>이메일 확인 안내</strong><br />
                • 스팸 메일함도 확인해주세요<br />
                • 발신자: noreply@doongzi.com<br />
                • 10분 이내 미수신 시 고객센터로 문의해주세요
              </p>
            </div>

            <button
              onClick={onClose}
              style={{
                width: '100%',
                backgroundColor: COLORS.brand,
                color: '#FFFFFF',
                fontSize: '15px', fontWeight: '600', padding: '14px',
                borderRadius: '8px', border: 'none', cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#8C6F5D'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = COLORS.brand}
            >
              확인
            </button>
          </div>
        )}
      </div>
    </div>
  );
}