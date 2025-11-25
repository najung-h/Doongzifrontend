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
    // 로그인 상태 업데이트
    login();
    // 홈으로 이동
    navigate('/');
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#FAF8F3',
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
          color: '#2C2C2C'
        }}>
          둥지
        </span>
      </div>

      {/* Login Card */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        padding: '40px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
        width: '100%',
        maxWidth: '400px'
      }}>
        <h2 style={{
          fontSize: '24px',
          fontWeight: '700',
          color: '#2C2C2C',
          marginBottom: '8px',
          textAlign: 'center'
        }}>
          로그인
        </h2>
        <p style={{
          fontSize: '14px',
          color: '#666666',
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
              color: '#2C2C2C',
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
                  color: '#999999'
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
                  border: '1px solid #E8E8E8',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = '#8FBF4D'}
                onBlur={(e) => e.target.style.borderColor = '#E8E8E8'}
              />
            </div>
          </div>

          {/* Password Input */}
          <div style={{ marginBottom: '28px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: '#2C2C2C',
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
                  color: '#999999'
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
                  border: '1px solid #E8E8E8',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = '#8FBF4D'}
                onBlur={(e) => e.target.style.borderColor = '#E8E8E8'}
              />
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '14px',
              backgroundColor: '#8FBF4D',
              border: 'none',
              borderRadius: '8px',
              color: '#FFFFFF',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#7AA83F'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#8FBF4D'}
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
          <div style={{ flex: 1, height: '1px', backgroundColor: '#E8E8E8' }} />
          <span style={{ fontSize: '13px', color: '#999999' }}>또는</span>
          <div style={{ flex: 1, height: '1px', backgroundColor: '#E8E8E8' }} />
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
              color: '#8FBF4D',
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
