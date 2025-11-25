import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';

export default function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
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
        <div 
          onClick={() => navigate('/')}
          style={{
            width: '24px',
            height: '24px',
            backgroundColor: '#9ACD32',
            borderRadius: '4px',
            cursor: 'pointer'
          }} 
        />
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
          onClick={() => setIsLoggedIn(!isLoggedIn)}
          style={{
            background: 'none',
            border: 'none',
            color: '#666666',
            fontSize: '15px',
            cursor: 'pointer',
            padding: '8px 16px'
          }}
        >
          {isLoggedIn ? '로그아웃' : '로그인'}
        </button>
        <button
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
  );
}