import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User } from 'lucide-react';

export default function SignupPage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== passwordConfirm) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    // TODO: 실제 회원가입 로직 구현
    console.log('회원가입 시도:', { name, email, password });
    alert('회원가입이 완료되었습니다!');
    navigate('/login');
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

      {/* Signup Card */}
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
          회원가입
        </h2>
        <p style={{
          fontSize: '14px',
          color: '#666666',
          marginBottom: '32px',
          textAlign: 'center'
        }}>
          둥지와 함께 안전한 전월세 계약을 시작하세요
        </p>

        <form onSubmit={handleSignup}>
          {/* Name Input */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: '#2C2C2C',
              marginBottom: '8px'
            }}>
              이름
            </label>
            <div style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center'
            }}>
              <User
                size={18}
                style={{
                  position: 'absolute',
                  left: '14px',
                  color: '#999999'
                }}
              />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="이름을 입력하세요"
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
          <div style={{ marginBottom: '20px' }}>
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
                minLength={6}
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

          {/* Password Confirm Input */}
          <div style={{ marginBottom: '28px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: '#2C2C2C',
              marginBottom: '8px'
            }}>
              비밀번호 확인
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
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                placeholder="비밀번호를 다시 입력하세요"
                required
                minLength={6}
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

          {/* Signup Button */}
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
            회원가입
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

        {/* Login Link */}
        <div style={{ textAlign: 'center' }}>
          <span style={{ fontSize: '14px', color: '#666666' }}>
            이미 계정이 있으신가요?{' '}
          </span>
          <button
            onClick={() => navigate('/login')}
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
            로그인
          </button>
        </div>
      </div>
    </div>
  );
}
