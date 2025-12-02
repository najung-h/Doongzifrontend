import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: 실제 로그인 로직 구현
    console.log('로그인 시도:', { email, password });
    login();
    navigate('/');
  };

  // 컬러 팔레트 정의
  const COLORS = {
    bg: '#F2E5D5',          // 메인 배경
    card: '#FFFFFF',        // 카드 배경
    textMain: '#402211',    // 메인 텍스트
    textSub: '#A68263',     // 서브 텍스트
    primary: '#A68263',     // 버튼/강조 색상 (갈색)
    primaryDark: '#8C6F5D', // 버튼 호버
    border: '#E6D8CC',      // 테두리
    placeholder: '#999999'  // 플레이스홀더/아이콘 기본
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: COLORS.bg, // [수정] 배경색 변경
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      {/* Logo */}
      <div
        onClick={() => navigate('/')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '40px',
          cursor: 'pointer'
        }}
      >
        <img
          src="/logo.png"
          alt="둥지 로고"
          style={{
            width: '56px',
            height: '56px',
            objectFit: 'contain'
          }}
        />
        <span style={{
          fontSize: '28px',
          fontWeight: '700',
          color: COLORS.textMain // [수정] 텍스트 색상 변경
        }}>
          둥지
        </span>
      </div>

      {/* Login Card */}
      <div style={{
        backgroundColor: COLORS.card,
        borderRadius: '16px',
        padding: '40px',
        boxShadow: '0 8px 32px rgba(166, 130, 99, 0.1)', // [수정] 그림자 톤 조정
        width: '100%',
        maxWidth: '400px'
      }}>
        <h2 style={{
          fontSize: '24px',
          fontWeight: '700',
          color: COLORS.textMain, // [수정]
          marginBottom: '8px',
          textAlign: 'center'
        }}>
          로그인
        </h2>
        <p style={{
          fontSize: '14px',
          color: COLORS.textSub, // [수정]
          marginBottom: '32px',
          textAlign: 'center'
        }}>
          둥지에 오신 것을 환영합니다
        </p>

        <form onSubmit={handleLogin}>
          {/* Email Input */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: COLORS.textMain, // [수정]
              marginBottom: '8px'
            }}>
              이메일
            </label>
            <div style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center'
            }}>
              <Mail
                size={18}
                style={{
                  position: 'absolute',
                  left: '14px',
                  color: COLORS.placeholder
                }}
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="이메일을 입력하세요"
                required
                style={{
                  width: '100%',
                  padding: '12px 12px 12px 44px',
                  border: `1px solid ${COLORS.border}`, // [수정] 테두리 색상
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  color: COLORS.textMain
                }}
                onFocus={(e) => e.target.style.borderColor = COLORS.primary} // [수정] 포커스 색상
                onBlur={(e) => e.target.style.borderColor = COLORS.border}
              />
            </div>
          </div>

          {/* Password Input */}
          <div style={{ marginBottom: '28px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: COLORS.textMain, // [수정]
              marginBottom: '8px'
            }}>
              비밀번호
            </label>
            <div style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center'
            }}>
              <Lock
                size={18}
                style={{
                  position: 'absolute',
                  left: '14px',
                  color: COLORS.placeholder
                }}
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호를 입력하세요"
                required
                style={{
                  width: '100%',
                  padding: '12px 12px 12px 44px',
                  border: `1px solid ${COLORS.border}`, // [수정]
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  color: COLORS.textMain
                }}
                onFocus={(e) => e.target.style.borderColor = COLORS.primary} // [수정]
                onBlur={(e) => e.target.style.borderColor = COLORS.border}
              />
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '14px',
              backgroundColor: COLORS.primary, // [수정] 버튼 색상
              border: 'none',
              borderRadius: '8px',
              color: '#FFFFFF',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = COLORS.primaryDark} // [수정] 호버 색상
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = COLORS.primary}
          >
            로그인
          </button>
        </form>

        {/* Divider */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          margin: '24px 0',
          gap: '12px'
        }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: COLORS.border }} />
          <span style={{ fontSize: '13px', color: COLORS.placeholder }}>또는</span>
          <div style={{ flex: 1, height: '1px', backgroundColor: COLORS.border }} />
        </div>

        {/* Sign Up Link */}
        <div style={{ textAlign: 'center' }}>
          <span style={{ fontSize: '14px', color: '#666666' }}>
            계정이 없으신가요?{' '}
          </span>
          <button
            onClick={() => navigate('/signup')}
            style={{
              background: 'none',
              border: 'none',
              color: COLORS.primary, // [수정] 링크 색상
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            회원가입
          </button>
        </div>
      </div>
    </div>
  );
}