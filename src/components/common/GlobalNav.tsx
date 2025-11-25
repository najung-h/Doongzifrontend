import { useNavigate, useLocation } from 'react-router-dom';
import { Home, ClipboardCheck, MessageCircle, Search } from 'lucide-react';

export function GlobalNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { 
      id: 'home', 
      label: '홈', 
      icon: Home, 
      path: '/' 
    },
    { 
      id: 'checklist', 
      label: '체크리스트', 
      icon: ClipboardCheck, 
      path: '/checklist' 
    },
    { 
      id: 'chatbot', 
      label: 'AI 챗봇', 
      icon: MessageCircle, 
      path: '/chatbot' 
    },
    { 
      id: 'search', 
      label: '법률 검색', 
      icon: Search, 
      path: '/search' 
    }
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      backgroundColor: 'var(--color-bg-white)',
      borderBottom: '2px solid var(--color-border)',
      zIndex: 1000,
      boxShadow: 'var(--shadow-sm)'
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              style={{
                padding: 'clamp(12px, 2vw, 16px)',
                backgroundColor: active 
                  ? 'var(--color-accent-green-light)' 
                  : 'transparent',
                border: 'none',
                borderBottom: active 
                  ? '3px solid var(--color-accent-green)' 
                  : '3px solid transparent',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 'clamp(4px, 1vw, 8px)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                position: 'relative'
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  e.currentTarget.style.backgroundColor = 'var(--color-bg-secondary)';
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              <Icon 
                size={22} 
                color={active ? 'var(--color-accent-green)' : 'var(--color-text-secondary)'} 
                strokeWidth={active ? 2.5 : 2}
              />
              <span style={{
                fontSize: 'clamp(10px, 1.8vw, 12px)',
                fontWeight: active ? '600' : '500',
                color: active ? 'var(--color-accent-green)' : 'var(--color-text-secondary)',
                textAlign: 'center',
                whiteSpace: 'nowrap'
              }}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}