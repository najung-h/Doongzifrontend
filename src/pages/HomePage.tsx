import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Upload, ChevronRight, MessageCircle, ChevronsRight } from 'lucide-react';
import Navigation from '../components/common/Navigation';
import NestScanModal from '../components/common/NestScanModal';

export default function HomePage() {
  const navigate = useNavigate();
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // 파일 업로드 핸들러
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  // --- 디자인 스타일 (기존 유지) ---
  const COLORS = {
    bg: '#F2E5D5',
    textMain: '#402211',
    textSub: '#A68263',
    brand: 'rgba(166, 130, 99, 1)',
    brandLight: 'rgba(166, 130, 99, 0.1)',
    danger: '#8d0707ff',
    white: '#FFFFFF',
    border: '#E6D8CC'
  };

  const glassStyle = {
    background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.95) 0%, rgba(245, 240, 235, 0.5) 100%)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    border: '1px solid rgba(255, 255, 255, 0.9)',
    boxShadow: '0 8px 32px 0 rgba(166, 130, 99, 0.15)',
    borderRadius: '24px',
  };

  return (
    <div style={{ minHeight: '100vh', paddingBottom: '80px', backgroundColor: COLORS.bg }}>
      <Navigation />

      {/* SVG Gradient Definition (화살표 그라데이션용) */}
      <svg width="0" height="0" style={{ position: 'absolute', visibility: 'hidden' }}>
        <defs>
          <linearGradient id="arrow-gradient" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="24" y2="0">
            <stop offset="20%" stopColor={COLORS.brand} />
            <stop offset="110%" stopColor={COLORS.danger} />
          </linearGradient>
        </defs>
      </svg>
      
      {/* Hero Section */}
      <div style={{ textAlign: 'center', padding: '60px 20px 40px' }}>
        <div style={{
          display: 'inline-block',
          padding: '8px 16px',
          borderRadius: '30px',
          background: COLORS.brandLight,
          color: COLORS.brand,
          fontSize: '15px',
          fontWeight: '600',
          marginBottom: '16px'
        }}>
          🏠 사회초년생을 위한 안심 계약 가이드
        </div>
        <h1 style={{
          fontSize: '42px',
          fontWeight: '800',
          color: COLORS.textMain,
          marginBottom: '12px',
          letterSpacing: '-0.5px'
        }}>
          안전한 둥지를 찾아드릴게요
        </h1>
        <p style={{ fontSize: '17px', color: COLORS.danger, fontWeight: 500 }}>
          서류 스캔 한 번으로 위험 진단부터 체크리스트 관리까지!
        </p>
      </div>

      {/* 3. [하단] 어미새 챗봇 (Support Zone) */}
      <div style={{ maxWidth: '1100px', margin: '0 auto 24px', padding: '0 24px',  }}>
        <div
          onClick={() => navigate('/chatbot')}
          style={{
            ...glassStyle,
            background: 'rgba(255, 255, 255, 0.4)',
            borderRadius: '40px', padding: '24px 40px',
            display: 'flex', alignItems: 'center', gap: '20px',
            cursor: 'pointer', border: `1px solid ${COLORS.border}`,
            boxShadow: '0 4px 12px rgba(0,0,0,0.07)',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = COLORS.brand;
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = COLORS.border;
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'rgba(255, 255, 255, 0.5)', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, 
            boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.1)' }}>
            <img src="/mom.png" alt="어미새" style={{ width: '58px' }}/>
          </div>

          <div style={{ flex: 1 }}>
            <h4 style={{ fontSize: '22px', fontWeight: '800', color: COLORS.textMain, marginBottom: '4px' }}>
              어미새 챗봇에게 무엇이든 물어보세요!
            </h4>
            <p style={{ fontSize: '14px', color: '#888' }}>
              어려운 용어와 복잡한 절차, 쉽게 설명해드려요
            </p>
          </div>
          <div style={{ ...glassStyle, padding: '8px', borderRadius: '16px', height: '56px', width: '200px', gap: '8px',
            // background: 'linear-gradient(0deg, rgba(166, 130, 99, 0.25) 25%, rgba(166, 130, 99, 0.1) 90%)',
            // background: 'rgba(255, 255, 255, 0.7)', 
            border: `1px solid rgba(166, 130, 99, 0.3)`,
            fontSize: '17px', fontWeight: '700', display: 'flex', justifyContent: 'center', alignItems: 'center', color: COLORS.brand
           }}>
            <MessageCircle size={21} /> 
            대화 시작하기
          </div>
        </div>
      </div>

      {/* Main Process Zone */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px' }}>

        {/* Background Zone Container */}
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.4)', // 은은한 배경 깔기
          boxShadow: '0 4px 12px rgba(0,0,0,0.07)',
          borderRadius: '40px',
          padding: '40px',
          border: `1px solid ${COLORS.border}`,
          marginBottom: '32px'
        }}>

          <div style={{ display: 'flex', flexDirection: 'row', gap: '16px', alignItems: 'stretch', flexWrap: 'wrap' }}>

            {/* 1. [좌측] 둥지 스캔하기 (진입점 - 고정 너비) */}
            <label
              style={{
                ...glassStyle,
                flex: '0 0 320px', // 고정 너비
                padding: '32px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                position: 'relative'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.borderColor = COLORS.brand;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.9)';
              }}
            >
              <input type="file" onChange={handleFileSelect} accept=".pdf,.jpg,.png" hidden />
              <div style={{ background: COLORS.brand, color: 'white', padding: '6px 18px', borderRadius: '20px', fontSize: '14px', fontWeight: '500', marginBottom: '20px' }}>
                먼저, 서류를 진단받으세요
              </div>

              <div style={{ width: '80px', height: '80px', background: '#F9F7F5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', boxShadow: 'inset 0 4px 8px rgba(0,0,0,0.05)' }}>
                <img src="/scan.png" alt="스캔" style={{ width: '100px' }} />
              </div>

              <h3 style={{ fontSize: '24px', fontWeight: '800', color: COLORS.textMain, marginBottom: '12px' }}>
                둥지 스캔하기
              </h3>
              <p style={{ fontSize: '14px', color: COLORS.textSub, lineHeight: '1.6', marginBottom: '24px', flex: 1 }}>
                AI가 <strong>위험 요소를 분석</strong>하고<br />
                체크리스트를 자동으로 채워줘요!
              </p>

              <div style={{
                width: '100%', padding: '12px', borderRadius: '12px',
                // background: 'linear-gradient(0deg, rgba(166, 130, 99, 1) 25%, rgba(166, 130, 99, 0.65) 90%)',
                background: COLORS.brand,
                border: `1px solid ${COLORS.brand}`, color: 'white', height: '52px',
                fontSize: '17px', fontWeight: '600', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px'
              }}>
                <Upload size={20} /> 둥지 스캔 시작하기
              </div>
            </label>

            {/* 화살표 아이콘 (데스크탑에서만 보임) */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ChevronsRight 
                size={56} 
                strokeWidth={3} 
                style={{ stroke: "url(#arrow-gradient)" }} 
              />
            </div>

            {/* 2. [우측] 둥지 계약 체크리스트 (메인 - 넓은 영역) */}
            <div
              onClick={() => navigate('/checklist')}
              style={{
                ...glassStyle,
                flex: 1, // 남은 공간 모두 차지
                minWidth: '320px',
                padding: '32px 48px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                cursor: 'pointer',
                transition: 'transform 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.borderColor = COLORS.danger;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.9)';
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ background: '#eae0d5ff', marginBottom: '24px', color: COLORS.danger, padding: '6px 18px', borderRadius: '20px', fontSize: '14px', fontWeight: '500' }}>
                  진단 결과를 기반으로 <strong>단계별 체크리스트</strong>를 안내해드려요
                </div>
                <img src="/rest.png" alt="둥지안착" style={{ width: '80px' }} />
              </div>

              <h3 style={{ fontSize: '24px', fontWeight: '800', color: COLORS.textMain, marginBottom: '12px' }}>
                둥지 계약 체크리스트
              </h3>
              <p style={{ fontSize: '14px', color: COLORS.danger, lineHeight: '1.6', marginBottom: '32px' }}>
                스캔된 내용이 자동으로 채워진<br />
                <strong>나만의 체크리스트</strong>를 확인하세요.
              </p>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: COLORS.textMain }}>
                <span>둥지 마련까지</span>
                <span style={{ color: COLORS.danger }}>35%</span>
              </div>
              <div style={{ width: '100%', height: '14px', backgroundColor: '#EAE0D5', borderRadius: '7px', overflow: 'hidden', marginBottom: '24px', marginTop: '12px' }}>
                <img
                  src="/baby.png"
                  alt="아기새"
                  style={{
                    position: 'absolute',
                    left: `calc(35% - 25px)`,
                    transform: 'translateY(-50%)',
                    width: '58px',
                    height: '58px',
                    objectFit: 'contain',
                    zIndex: 2,
                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))',
                    transition: 'left 0.3s ease'
                  }}
                />
                <img
                  src="/nest.png"
                  alt="둥지"
                  style={{
                    position: 'absolute',
                    right: '25px',
                    transform: 'translateY(-50%)',
                    width: '58px',
                    height: '58px',
                    objectFit: 'contain',
                    zIndex: 1,
                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                  }}
                />
                <div style={{ width: '35%', height: '100%', backgroundColor: 'rgba(140, 7, 7, 0.95)', borderRadius: '16px' }}></div>
              </div>

              <div style={{
                width: '100%', padding: '14px', borderRadius: '12px',
                // background: 'linear-gradient(0deg, rgba(140, 7, 7, 0.9) 25%, rgba(140, 7, 7, 0.6) 90%)',
                background: COLORS.danger,
                color: 'white', border: `1px solid ${COLORS.danger}`,
                fontSize: '17px', fontWeight: '600', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)', height: '52px'
              }}>
                체크리스트 보러가기 <ChevronRight size={20} />
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* NestScanModal */}
      {selectedFile && (
        <NestScanModal
          isOpen={!!selectedFile}
          file={selectedFile}
          onClose={() => setSelectedFile(null)}
        />
      )}
    </div>
  );
}