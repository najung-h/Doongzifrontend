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
      backgroundColor: COLORS.bg, // [수정] 배경색
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
          color: COLORS.textMain // [수정] 텍스트 색상
        }}>
          둥지
        </span>
      </div>

      {/* Signup Card */}
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
          회원가입
        </h2>
        <p style={{
          fontSize: '14px',
          color: COLORS.textSub, // [수정]
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
              color: COLORS.textMain, // [수정]
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
                  color: COLORS.placeholder
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

          {/* Password Input */}
          <div style={{ marginBottom: '20px' }}>
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
                minLength={6}
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

          {/* Password Confirm Input */}
          <div style={{ marginBottom: '28px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: COLORS.textMain, // [수정]
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
                  color: COLORS.placeholder
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

          {/* Signup Button */}
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
          <div style={{ flex: 1, height: '1px', backgroundColor: COLORS.border }} />
          <span style={{ fontSize: '13px', color: COLORS.placeholder }}>또는</span>
          <div style={{ flex: 1, height: '1px', backgroundColor: COLORS.border }} />
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
              color: COLORS.primary, // [수정] 링크 색상
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