// Simple test component to verify rendering
export default function TestSimple() {
  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      backgroundColor: '#E8E5CE',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      gap: '20px'
    }}>
      <h1 style={{ fontSize: '48px', color: '#2C2C2C' }}>🏠</h1>
      <h2 style={{ fontSize: '32px', color: '#2C2C2C' }}>둥지</h2>
      <p style={{ fontSize: '18px', color: '#666666' }}>부동산 계약 안전 도우미</p>
      <button style={{
        padding: '12px 24px',
        backgroundColor: '#8FBF4D',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '16px',
        cursor: 'pointer'
      }}>
        시작하기
      </button>
    </div>
  );
}
