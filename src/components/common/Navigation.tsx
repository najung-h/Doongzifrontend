import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, logout } = useAuth();

  // 컬러 팔레트 정의 (메인 테마 Earth Tone 적용)
  const COLORS = {
    bgTranslucent: 'rgba(242, 229, 213, 0.3)', // [수정] 메인 배경색(#F2E5D5) 기반 투명 배경
    primary: '#A68263',     // 브랜드 메인 (갈색)
    primaryDark: '#8C6F5D', // 진한 갈색
    textMain: '#402211',    // 메인 텍스트 (짙은 고동색)
    textSub: '#857162',     // 보조 텍스트
    border: 'rgba(166, 130, 99, 0.2)', // 테두리 (브랜드 컬러 기반 은은하게)
    activeBg: 'rgba(166, 130, 99, 0.1)', // 활성 탭 배경
    white: '#FFFFFF'
  };

  // 활성화된 탭 스타일링 헬퍼
  const getLinkStyle = (path: string) => ({
    background: 'none',
    border: 'none',
    color: location.pathname === path ? COLORS.textMain : COLORS.textSub, // 활성: 짙은색, 비활성: 연한색
    fontSize: '15px',
    cursor: 'pointer',
    padding: '8px 12px',
    fontWeight: location.pathname === path ? '700' : '500',
    borderRadius: '12px',
    transition: 'all 0.2s ease',
    backgroundColor: location.pathname === path ? COLORS.activeBg : 'transparent',
  });

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      backgroundColor: COLORS.bgTranslucent, // [수정] 배경색 변경
      backdropFilter: 'blur(10px)',
      borderBottom: `1px solid ${COLORS.border}`, // [수정] 테두리 색상 변경
      padding: '16px 40px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      boxShadow: '0 4px 20px rgba(64, 34, 17, 0.05)' // 그림자 톤 조정
    }}>
      {/* Left Menu */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button onClick={() => navigate('/checklist')} style={getLinkStyle('/checklist')}>
          체크리스트
        </button>
        <button onClick={() => navigate('/chatbot')} style={getLinkStyle('/chatbot')}>
          AI 챗봇
        </button>
        <button onClick={() => navigate('/mypage')} style={getLinkStyle('/mypage')}>
          마이페이지
        </button>
      </div>

      {/* Center Logo */}
      <div 
        onClick={() => navigate('/')}
        style={{
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          cursor: 'pointer'
        }}
      >
        <img
          src="/logo.png"
          alt="둥지 로고"
          style={{ width: '50px', height: '50px', objectFit: 'contain' }}
        />
        {/* 텍스트 베이스라인 정렬을 위한 컨테이너 추가 */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
          <span style={{ fontSize: '24px', fontWeight: '800', color: COLORS.textMain, letterSpacing: '-0.5px' }}>
            둥지
          </span>
          <span style={{ fontSize: '20px', fontWeight: '500', color: COLORS.textSub}}>
            집 찾는 아기새
          </span>
        </div>
      </div>

      {/* Right Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {!isLoggedIn ? (
          <>
            <button
              onClick={() => navigate('/login')}
              style={{
                background: 'none',
                border: 'none',
                color: COLORS.textSub,
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                padding: '8px 16px'
              }}
            >
              로그인
            </button>
            <button
              onClick={() => navigate('/signup')}
              style={{
                backgroundColor: COLORS.primary,
                border: 'none',
                color: COLORS.white,
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                padding: '10px 24px',
                borderRadius: '20px',
                boxShadow: '0 4px 12px rgba(166, 130, 99, 0.2)',
                transition: 'transform 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.backgroundColor = COLORS.primaryDark;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.backgroundColor = COLORS.primary;
              }}
            >
              회원가입
            </button>
          </>
        ) : (
          <button
            onClick={logout}
            style={{
              backgroundColor: COLORS.activeBg,
              border: `1px solid ${COLORS.border}`,
              color: COLORS.primary, // 텍스트는 브랜드 컬러 유지
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              padding: '8px 20px',
              borderRadius: '20px'
            }}
          >
            로그아웃
          </button>
        )}
      </div>
    </nav>
  );
}