import { useNavigate } from 'react-router-dom';

interface FloatingChatButtonProps {
  hasNotification?: boolean;
}

export function FloatingChatButton({ hasNotification = false }: FloatingChatButtonProps) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate('/chatbot')}
      style={{
        position: 'fixed',
        bottom: 'var(--spacing-lg)',
        right: 'var(--spacing-lg)',
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        backgroundColor: 'var(--color-accent-green)',
        border: 'none',
        boxShadow: 'var(--shadow-lg)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.3s ease',
        zIndex: 1000
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.1)';
        e.currentTarget.style.boxShadow = '0 12px 20px rgba(0, 0, 0, 0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
      }}
      aria-label="어미새 챗봇 열기"
    >
      {/* Mom Bird Icon */}
      <img
        src="/mom.png"
        alt="어미새 챗봇"
        style={{
          width: '40px',
          height: '40px',
          objectFit: 'contain',
          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))'
        }}
      />

      {/* Notification Badge */}
      {hasNotification && (
        <div style={{
          position: 'absolute',
          top: '8px',
          right: '8px',
          width: '12px',
          height: '12px',
          borderRadius: '50%',
          backgroundColor: '#FF4444',
          border: '2px solid white',
          animation: 'pulse 2s infinite'
        }} />
      )}

      {/* Pulse animation */}
      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.1);
          }
        }
      `}</style>
    </button>
  );
}
