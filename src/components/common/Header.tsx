import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  showLogin?: boolean;
}

export function Header({ title, showBack = false, showLogin = false }: HeaderProps) {
  const navigate = useNavigate();

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      backgroundColor: 'var(--color-bg-primary)',
      padding: 'var(--spacing-md) var(--spacing-lg)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottom: '1px solid var(--color-border)',
      zIndex: 100
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
        {showBack && (
          <button
            onClick={() => navigate(-1)}
            style={{
              background: 'none',
              border: 'none',
              padding: 'var(--spacing-sm)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              color: 'var(--color-text-primary)'
            }}
          >
            <ArrowLeft size={20} />
          </button>
        )}
        <span style={{ 
          fontSize: '16px',
          fontWeight: '600',
          color: 'var(--color-text-primary)'
        }}>
          {title}
        </span>
      </div>

      {showLogin && (
        <button style={{
          backgroundColor: 'transparent',
          border: '1px solid var(--color-accent-green)',
          color: 'var(--color-accent-green)',
          padding: '8px 16px',
          borderRadius: 'var(--radius-full)',
          fontSize: '14px',
          fontWeight: '500'
        }}>
          로그인
        </button>
      )}
    </header>
  );
}
