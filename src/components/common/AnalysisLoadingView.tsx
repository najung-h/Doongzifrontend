interface AnalysisLoadingViewProps {
  isLoading: boolean;
  analysisType?: 'registry' | 'contract' | 'building' | 'insurance';
}

export default function AnalysisLoadingView({ isLoading }: AnalysisLoadingViewProps) {
  if (!isLoading) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
    }}>
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        padding: '40px',
        textAlign: 'center',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
      }}>
        {/* 원형 스피너 */}
        <div style={{
          width: '60px',
          height: '60px',
          margin: '0 auto 20px',
          border: '4px solid #E8E8E8',
          borderTop: '4px solid #8FBF4D',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }} />

        {/* 메시지 */}
        <p style={{
          fontSize: '16px',
          fontWeight: '600',
          color: '#2C2C2C',
          margin: 0,
        }}>
          AI가 문서를 분석하고 있어요
        </p>
        <p style={{
          fontSize: '14px',
          color: '#666',
          margin: '8px 0 0 0',
        }}>
          잠시만 기다려주세요...
        </p>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
