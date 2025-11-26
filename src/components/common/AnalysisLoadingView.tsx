import { useEffect, useState } from 'react';

interface AnalysisLoadingViewProps {
  isLoading: boolean;
  analysisType?: 'registry' | 'contract' | 'building' | 'insurance';
}

const loadingSteps = [
  { label: '파일 업로드 중', duration: 2000, icon: '📤' },
  { label: 'AI가 문서를 읽고 있어요', duration: 8000, icon: '🤖' },
  { label: '위험 요소를 찾고 있어요', duration: 6000, icon: '🔍' },
  { label: '분석 결과를 정리하고 있어요', duration: 4000, icon: '✨' },
];

const tips = [
  '💡 등기부등본의 을구에는 근저당권이 기재돼요',
  '💡 전세 계약 전 확정일자를 꼭 받으세요',
  '💡 건축물대장에서 위반건축물 표기를 확인하세요',
  '💡 임대인과 소유자가 같은 사람인지 확인하세요',
  '💡 보증보험 가입으로 전세금을 안전하게 보호하세요',
  '💡 매매가 대비 전세가율 80% 이상은 위험해요',
  '💡 선순위 근저당권이 많으면 보증금 회수가 어려워요',
];

export default function AnalysisLoadingView({ isLoading }: AnalysisLoadingViewProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [currentTip] = useState(() => tips[Math.floor(Math.random() * tips.length)]);

  useEffect(() => {
    if (!isLoading) {
      setCurrentStepIndex(0);
      setProgress(0);
      return;
    }

    let elapsedTime = 0;
    const interval = setInterval(() => {
      elapsedTime += 100;

      // 진행률 계산 (전체 20초 기준)
      const newProgress = Math.min((elapsedTime / 20000) * 100, 95);
      setProgress(newProgress);

      // 단계 전환
      let accumulatedTime = 0;
      for (let i = 0; i < loadingSteps.length; i++) {
        accumulatedTime += loadingSteps[i].duration;
        if (elapsedTime < accumulatedTime) {
          setCurrentStepIndex(i);
          break;
        }
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isLoading]);

  if (!isLoading) return null;

  const currentStep = loadingSteps[currentStepIndex];

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
      padding: '20px',
    }}>
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '20px',
        padding: '40px 30px',
        maxWidth: '500px',
        width: '100%',
        textAlign: 'center',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
      }}>
        {/* 회전 아이콘 */}
        <div style={{
          fontSize: '64px',
          marginBottom: '20px',
          animation: 'spin 2s linear infinite',
        }}>
          {currentStep.icon}
        </div>

        {/* 현재 단계 */}
        <h3 style={{
          fontSize: '20px',
          fontWeight: '700',
          color: '#2C2C2C',
          margin: '0 0 10px 0',
        }}>
          {currentStep.label}
        </h3>

        {/* 진행률 바 */}
        <div style={{
          width: '100%',
          height: '8px',
          backgroundColor: '#E8E8E8',
          borderRadius: '10px',
          overflow: 'hidden',
          marginBottom: '20px',
        }}>
          <div style={{
            height: '100%',
            width: `${progress}%`,
            backgroundColor: '#8FBF4D',
            transition: 'width 0.3s ease',
            borderRadius: '10px',
          }} />
        </div>

        {/* 진행률 텍스트 */}
        <p style={{
          fontSize: '14px',
          color: '#666',
          marginBottom: '25px',
        }}>
          {Math.round(progress)}% 완료
        </p>

        {/* 단계 표시 */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '8px',
          marginBottom: '30px',
        }}>
          {loadingSteps.map((step, index) => (
            <div
              key={index}
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor: index <= currentStepIndex ? '#8FBF4D' : '#E8E8E8',
                transition: 'background-color 0.3s ease',
              }}
            />
          ))}
        </div>

        {/* 대기 팁 */}
        <div style={{
          backgroundColor: '#F8F9FA',
          borderRadius: '12px',
          padding: '15px',
          borderLeft: '4px solid #8FBF4D',
        }}>
          <p style={{
            fontSize: '13px',
            color: '#555',
            margin: 0,
            lineHeight: '1.5',
          }}>
            {currentTip}
          </p>
        </div>

        {/* 대기 메시지 */}
        <p style={{
          fontSize: '12px',
          color: '#999',
          marginTop: '20px',
          marginBottom: 0,
        }}>
          잠시만 기다려주세요. AI가 열심히 분석하고 있어요! 🏠
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
