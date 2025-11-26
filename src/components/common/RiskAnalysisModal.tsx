import { useState } from 'react';
import { X, AlertTriangle, Shield, TrendingUp } from 'lucide-react';
import { PieChart, Pie, Cell } from 'recharts';
import { checklistAPI } from '../../api/checklist';

interface RiskAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type PropertyType = '아파트' | '오피스텔' | '연립,다세대주택' | '단독,다가구';

export default function RiskAnalysisModal({ isOpen, onClose }: RiskAnalysisModalProps) {
  const [address, setAddress] = useState('');
  const [deposit, setDeposit] = useState('');
  const [area, setArea] = useState('');
  const [propertyType, setPropertyType] = useState<PropertyType>('아파트');

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    riskLevel: 'safe' | 'warning' | 'danger';
    ratio: number;
    message: string;
    graphData: {
      safeLine: number;
      current: number;
    };
    extraToWarning_만원: number;
    extraToDanger_만원: number;
    mortgageMessage: string;
  } | null>(null);

  if (!isOpen) return null;

  const handleAnalyze = async () => {
    if (!address || !deposit || !area) {
      alert('모든 항목을 입력해주세요.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await checklistAPI.analyzeRisk({
        address,
        deposit: Number(deposit),
        area: Number(area),
        propertyType,
      });

      if (response.success && response.result) {
        setResult(response.result);
      } else {
        alert('분석에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (error) {
      console.error('Risk analysis error:', error);
      alert('분석 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setAddress('');
    setDeposit('');
    setArea('');
    setPropertyType('아파트');
    setResult(null);
    onClose();
  };

  const getRiskColor = (level: 'safe' | 'warning' | 'danger') => {
    switch (level) {
      case 'safe': return '#4CAF50';
      case 'warning': return '#FFC107';
      case 'danger': return '#F44336';
      default: return '#999999';
    }
  };

  const getRiskLabel = (level: 'safe' | 'warning' | 'danger') => {
    switch (level) {
      case 'safe': return '안전';
      case 'warning': return '주의';
      case 'danger': return '위험';
      default: return '알 수 없음';
    }
  };

  const getRiskIcon = (level: 'safe' | 'warning' | 'danger') => {
    switch (level) {
      case 'safe': return <Shield size={24} />;
      case 'warning': return <TrendingUp size={24} />;
      case 'danger': return <AlertTriangle size={24} />;
    }
  };

  // 반원형 게이지 데이터 생성
  const getGaugeData = () => {
    // 3개 구간: 안전(0-70), 주의(70-80), 위험(80-100)
    return [
      { name: '안전', value: 70, color: '#4CAF50' },
      { name: '주의', value: 10, color: '#FFC107' },
      { name: '위험', value: 20, color: '#F44336' },
    ];
  };

  // 바늘 각도 계산 (0-100% -> -90도 ~ 90도)
  const getNeedleAngle = () => {
    const ratio = result?.ratio || 0;
    // ratio가 100을 넘을 수 있으므로 최대값을 100으로 제한
    const normalizedRatio = Math.min(ratio, 100);
    return -90 + (normalizedRatio * 1.8);
  };

  const propertyTypes: PropertyType[] = ['아파트', '오피스텔', '연립,다세대주택', '단독,다가구'];

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px',
      }}
      onClick={handleClose}
    >
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '600px',
          maxHeight: '90vh',
          overflow: 'auto',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '24px',
            borderBottom: '1px solid #E8E8E8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <h2
            style={{
              fontSize: '20px',
              fontWeight: '700',
              color: '#2C2C2C',
              margin: 0,
            }}
          >
            깡통전세 위험도 분석
          </h2>
          <button
            onClick={handleClose}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              border: 'none',
              backgroundColor: '#F0F0F0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#666666',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '24px' }}>
          {/* Input Form */}
          <div style={{ marginBottom: '24px' }}>
            {/* 도로명 주소 */}
            <div style={{ marginBottom: '16px' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#2C2C2C',
                  marginBottom: '8px',
                }}
              >
                도로명 주소
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="예: 서울특별시 강남구 테헤란로 123"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: '1px solid #E8E8E8',
                  fontSize: '14px',
                  color: '#2C2C2C',
                  outline: 'none',
                  boxSizing: 'border-box',
                  marginBottom: '6px',
                }}
              />
              <p
                style={{
                  fontSize: '12px',
                  color: '#F44336',
                  margin: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <AlertTriangle size={14} />
                <strong>반드시 도로명 주소를 입력해주세요 (지번 주소 불가)</strong>
              </p>
            </div>

            {/* 보증금 */}
            <div style={{ marginBottom: '16px' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#2C2C2C',
                  marginBottom: '8px',
                }}
              >
                전세보증금 (만원)
              </label>
              <input
                type="number"
                value={deposit}
                onChange={(e) => setDeposit(e.target.value)}
                placeholder="예: 40000 (4억원)"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: '1px solid #E8E8E8',
                  fontSize: '14px',
                  color: '#2C2C2C',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {/* 전용면적 */}
            <div style={{ marginBottom: '16px' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#2C2C2C',
                  marginBottom: '8px',
                }}
              >
                전용면적 (㎡)
              </label>
              <input
                type="number"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                placeholder="예: 84"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: '1px solid #E8E8E8',
                  fontSize: '14px',
                  color: '#2C2C2C',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {/* 주택 타입 */}
            <div style={{ marginBottom: '20px' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#2C2C2C',
                  marginBottom: '8px',
                }}
              >
                주택 유형
              </label>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '8px',
                }}
              >
                {propertyTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => setPropertyType(type)}
                    style={{
                      padding: '12px',
                      borderRadius: '8px',
                      border: propertyType === type ? 'none' : '1px solid #E8E8E8',
                      backgroundColor: propertyType === type ? '#8FBF4D' : '#FFFFFF',
                      color: propertyType === type ? '#FFFFFF' : '#666666',
                      fontSize: '14px',
                      fontWeight: propertyType === type ? '600' : '500',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleAnalyze}
              disabled={isLoading || !address || !deposit || !area}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor:
                  isLoading || !address || !deposit || !area
                    ? '#CCCCCC'
                    : '#8FBF4D',
                color: '#FFFFFF',
                fontSize: '15px',
                fontWeight: '600',
                cursor:
                  isLoading || !address || !deposit || !area
                    ? 'not-allowed'
                    : 'pointer',
              }}
            >
              {isLoading ? '분석 중...' : '위험도 분석하기'}
            </button>
          </div>

          {/* Result Display */}
          {result && (
            <div
              style={{
                padding: '24px',
                borderRadius: '12px',
                backgroundColor: '#F8F8F8',
                border: `2px solid ${getRiskColor(result.riskLevel)}`,
              }}
            >
              {/* Semi-circle Gauge Chart */}
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                {/* Score and Status */}
                <div style={{ marginBottom: '12px' }}>
                  <div style={{ fontSize: '48px', fontWeight: '700', color: getRiskColor(result.riskLevel), lineHeight: '1' }}>
                    {result.ratio.toFixed(1)}%
                  </div>
                  <div style={{ fontSize: '14px', color: '#666666', marginTop: '4px', marginBottom: '8px' }}>
                    전세가율
                  </div>
                  <div style={{ fontSize: '18px', fontWeight: '600', color: getRiskColor(result.riskLevel), display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    {getRiskIcon(result.riskLevel)}
                    {getRiskLabel(result.riskLevel)}
                  </div>
                </div>

                {/* Semi-circle Gauge */}
                <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
                  <PieChart width={300} height={160}>
                    <Pie
                      data={getGaugeData()}
                      cx={150}
                      cy={150}
                      startAngle={180}
                      endAngle={0}
                      innerRadius={80}
                      outerRadius={120}
                      paddingAngle={0}
                      dataKey="value"
                    >
                      {getGaugeData().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>

                  {/* Needle */}
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '10px',
                      left: '50%',
                      width: '2px',
                      height: '80px',
                      backgroundColor: '#2C2C2C',
                      transformOrigin: 'bottom center',
                      transform: `translateX(-50%) rotate(${getNeedleAngle()}deg)`,
                      transition: 'transform 0.5s ease-out',
                    }}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        top: '-6px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '0',
                        height: '0',
                        borderLeft: '6px solid transparent',
                        borderRight: '6px solid transparent',
                        borderBottom: '12px solid #2C2C2C',
                      }}
                    />
                  </div>

                  {/* Center dot */}
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '10px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      backgroundColor: '#2C2C2C',
                    }}
                  />
                </div>

                {/* Labels */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '0 30px',
                    marginTop: '8px',
                  }}
                >
                  <span style={{ fontSize: '12px', color: '#4CAF50', fontWeight: '600' }}>
                    안전<br />0-70%
                  </span>
                  <span style={{ fontSize: '12px', color: '#FFC107', fontWeight: '600' }}>
                    주의<br />70-80%
                  </span>
                  <span style={{ fontSize: '12px', color: '#F44336', fontWeight: '600' }}>
                    위험<br />80-100%
                  </span>
                </div>
              </div>

              {/* Message */}
              <div
                style={{
                  padding: '16px',
                  borderRadius: '8px',
                  backgroundColor: '#FFFFFF',
                  marginBottom: '16px',
                }}
              >
                <p
                  style={{
                    fontSize: '14px',
                    color: '#2C2C2C',
                    lineHeight: '1.6',
                    margin: 0,
                  }}
                >
                  {result.message}
                </p>
              </div>

              {/* 추가 정보 섹션 */}
              {(result.extraToWarning_만원 > 0 || result.extraToDanger_만원 > 0) && (
                <div style={{ padding: '16px', borderRadius: '8px', backgroundColor: '#FFF9E6', border: '1px solid #FFE082', marginBottom: '16px' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#F57C00', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <AlertTriangle size={16} />
                    위험도 변화 예측
                  </h4>
                  {result.extraToWarning_만원 > 0 && (
                    <p style={{ fontSize: '13px', color: '#424242', lineHeight: '1.6', margin: '0 0 6px 0' }}>
                      • <strong style={{ color: '#FFC107' }}>주의 단계</strong>까지: 추가 근저당 <strong>{result.extraToWarning_만원.toLocaleString()}만원</strong>
                    </p>
                  )}
                  {result.extraToDanger_만원 > 0 && (
                    <p style={{ fontSize: '13px', color: '#424242', lineHeight: '1.6', margin: 0 }}>
                      • <strong style={{ color: '#F44336' }}>위험 단계</strong>까지: 추가 근저당 <strong>{result.extraToDanger_만원.toLocaleString()}만원</strong>
                    </p>
                  )}
                </div>
              )}

              {/* 근저당 안내 메시지 */}
              {result.mortgageMessage && (
                <div style={{ padding: '16px', borderRadius: '8px', backgroundColor: '#E3F2FD', border: '1px solid #90CAF9' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#1976D2', marginBottom: '8px' }}>
                    💡 근저당 확인 안내
                  </h4>
                  <p style={{ fontSize: '13px', color: '#424242', lineHeight: '1.6', margin: 0 }}>
                    {result.mortgageMessage}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
