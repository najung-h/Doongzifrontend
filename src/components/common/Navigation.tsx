import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, logout } = useAuth();

  return (
    <nav style={{
      backgroundColor: '#FFFFFF',
      borderBottom: '1px solid #E5E5E5',
      width: '100%',
      display: 'flex',
      justifyContent: 'center' // 내부 컨텐츠 중앙 정렬
    }}>
      {/* Inner Container: 최대 너비 제한 및 중앙 정렬 */}
      <div style={{
        width: '100%',
        maxWidth: '1200px', // 메인 컨텐츠 폭에 맞춰 제한 (너무 넓어지지 않게)
        padding: '16px 24px', // 좌우 여백 (기존 40px -> 24px로 조정하여 모바일/태블릿 대응력 향상)
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative' // 로고 절대 위치의 기준점
      }}>
        {/* Left Menu */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '32px'
        }}>
          <button
            onClick={() => navigate('/checklist')}
            style={{
              background: 'none',
              border: 'none',
              color: location.pathname === '/checklist' ? '#8FBF4D' : '#2C2C2C',
              fontSize: '15px',
              cursor: 'pointer',
              padding: '8px 0',
              fontWeight: location.pathname === '/checklist' ? '600' : '400'
            }}
          >
            체크리스트
          </button>
          <button
            onClick={() => navigate('/chatbot')}
            style={{
              background: 'none',
              border: 'none',
              color: location.pathname === '/chatbot' ? '#8FBF4D' : '#2C2C2C',
              fontSize: '15px',
              cursor: 'pointer',
              padding: '8px 0',
              fontWeight: location.pathname === '/chatbot' ? '600' : '400'
            }}
          >
            AI 챗봇
          </button>
          <button
            onClick={() => navigate('/search')}
            style={{
              background: 'none',
              border: 'none',
              color: location.pathname === '/search' ? '#8FBF4D' : '#2C2C2C',
              fontSize: '15px',
              cursor: 'pointer',
              padding: '8px 0',
              fontWeight: location.pathname === '/search' ? '600' : '400'
            }}
          >
            법률 검색
          </button>
          <button
            onClick={() => navigate('/mypage')}
            style={{
              background: 'none',
              border: 'none',
              color: location.pathname === '/mypage' ? '#8FBF4D' : '#2C2C2C',
              fontSize: '15px',
              cursor: 'pointer',
              padding: '8px 0',
              fontWeight: location.pathname === '/mypage' ? '600' : '400'
            }}
          >
            마이페이지
          </button>
        </div>

        {/* Center Logo */}
        <div style={{
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          cursor: 'pointer'
        }}
        onClick={() => navigate('/')}
        >
          <img
            src="/logo.png"
            alt="둥지 로고"
            style={{
              width: '48px',
              height: '48px',
              objectFit: 'contain'
            }}
          />
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
          {!isLoggedIn ? (
            // 로그인하지 않은 상태: 로그인 + 회원가입 버튼
            <>
              <button
                onClick={() => navigate('/login')}
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
                onClick={() => navigate('/signup')}
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
            </>
          ) : (
            // 로그인한 상태: 로그아웃 버튼만
            <button
              onClick={logout}
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
              로그아웃
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}