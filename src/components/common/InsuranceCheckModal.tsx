import { useState, useRef, useMemo } from 'react';
import { X, Upload, Shield, CheckCircle, AlertTriangle, XCircle, ChevronLeft, ChevronRight, HelpCircle } from 'lucide-react';
import { checklistAPI } from '../../api/checklist';
import type { InsuranceCheckItem, InsuranceVerdict } from '../../types';

interface InsuranceCheckModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function InsuranceCheckModal({ isOpen, onClose }: InsuranceCheckModalProps) {
  // --- 상태 관리 ---
  const [step, setStep] = useState<'upload' | 'analyzing' | 'wizard' | 'summary'>('upload');
  
  // 입력 데이터
  const [deposit, setDeposit] = useState('');
  const [registryFile, setRegistryFile] = useState<File | null>(null);
  const [buildingFile, setBuildingFile] = useState<File | null>(null);
  
  // 분석 데이터
  const [checkItems, setCheckItems] = useState<InsuranceCheckItem[]>([]);
  
  // 위저드 진행 상태
  const [currentIndex, setCurrentIndex] = useState(0);
  // 사용자의 수동 체크 결과 저장 (id -> verdict)
  const [userDecisions, setUserDecisions] = useState<Record<number, InsuranceVerdict>>({});

  const registryInputRef = useRef<HTMLInputElement>(null);
  const buildingInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // --- 핸들러 ---

  const handleReset = () => {
    setStep('upload');
    setDeposit('');
    setRegistryFile(null);
    setBuildingFile(null);
    setCheckItems([]);
    setCurrentIndex(0);
    setUserDecisions({});
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const handleAnalyze = async () => {
    if (!deposit || !registryFile || !buildingFile) {
      alert('보증금과 두 가지 서류를 모두 등록해주세요.');
      return;
    }

    setStep('analyzing');
    try {
      const response = await checklistAPI.checkInsurance(
        registryFile,
        buildingFile,
        Number(deposit)
      );

      if (response.success && response.results) {
        setCheckItems(response.results);
        setStep('wizard'); // 분석 완료 후 위저드 모드로 진입
      } else {
        alert(response.message || '분석 데이터를 가져오지 못했습니다.');
        setStep('upload');
      }
    } catch (error) {
      console.error(error);
      alert('분석 중 오류가 발생했습니다.');
      setStep('upload');
    }
  };

  // 위저드 네비게이션
  const handleNext = () => {
    if (currentIndex < checkItems.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setStep('summary'); // 마지막 항목이면 요약 화면으로
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  // 사용자 응답 처리 (예/아니오)
  const handleUserDecision = (decision: 'PASS' | 'FAIL') => {
    const currentItem = checkItems[currentIndex];
    setUserDecisions(prev => ({
      ...prev,
      [currentItem.id]: decision
    }));
    handleNext(); // 선택 후 자동 다음 이동
  };

  // 최종 결과 계산
  const finalResults = useMemo(() => {
    return checkItems.map(item => {
      // 사용자가 수동으로 결정한 값이 있으면 그 값을 우선, 없으면 원래 verdict 사용
      const finalVerdict = userDecisions[item.id] || item.verdict;
      return { ...item, verdict: finalVerdict };
    });
  }, [checkItems, userDecisions]);

  const failCount = finalResults.filter(i => i.verdict === 'FAIL').length;
  const reviewCount = finalResults.filter(i => i.verdict === 'REVIEW_REQUIRED').length; // 요약 화면에선 없어야 정상

  // --- 서브 컴포넌트: 파일 업로드 박스 ---
  const FileUploadBox = ({ title, file, onSelect, inputRef }: any) => (
    <div 
      onClick={() => inputRef.current?.click()}
      style={{
        border: `1px dashed ${file ? '#8FBF4D' : '#D9D9D9'}`,
        borderRadius: '8px',
        padding: '20px',
        textAlign: 'center',
        cursor: 'pointer',
        backgroundColor: file ? '#F0F7FA' : '#FAFAFA',
        marginBottom: '12px',
        transition: 'all 0.2s'
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.jpg,.png"
        style={{ display: 'none' }}
        onChange={(e) => e.target.files?.[0] && onSelect(e.target.files[0])}
      />
      {file ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#2C2C2C' }}>
          <CheckCircle size={20} color="#8FBF4D" />
          <span style={{ fontSize: '14px', fontWeight: '500' }}>{file.name}</span>
        </div>
      ) : (
        <div style={{ color: '#666' }}>
          <Upload size={24} style={{ marginBottom: '8px', color: '#999' }} />
          <div style={{ fontSize: '14px', fontWeight: '600' }}>{title} 업로드</div>
          <div style={{ fontSize: '12px', color: '#999' }}>PDF, JPG, PNG</div>
        </div>
      )}
    </div>
  );

  // --- 렌더링: 업로드 화면 ---
  if (step === 'upload') {
    return (
      <div style={overlayStyle} onClick={(e) => e.target === e.currentTarget && handleClose()}>
        <div style={modalStyle} onClick={e => e.stopPropagation()}>
          <CloseButton onClick={handleClose} />
          
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={iconCircleStyle('#E3F2FD')}>
              <Shield size={24} color="#2196F3" />
            </div>
            <h2 style={titleStyle}>보증보험 가입 가능 여부 확인</h2>
            <p style={subtitleStyle}>전세보증금을 안전하게 지킬 수 있는지 확인해드려요.</p>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <Label text="전세 보증금 (만원)" />
            <input
              type="number"
              value={deposit}
              onChange={(e) => setDeposit(e.target.value)}
              placeholder="예: 20000"
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <Label text="필수 서류 업로드" />
            <FileUploadBox title="등기부등본" file={registryFile} onSelect={setRegistryFile} inputRef={registryInputRef} />
            <FileUploadBox title="건축물대장" file={buildingFile} onSelect={setBuildingFile} inputRef={buildingInputRef} />
          </div>

          <div style={{ backgroundColor: '#FFF3E0', padding: '12px', borderRadius: '8px', marginBottom: '24px', display: 'flex', gap: '8px' }}>
            <AlertTriangle size={18} color="#F57C00" style={{ flexShrink: 0, marginTop: '2px' }} />
            <p style={{ fontSize: '12px', color: '#E65100', margin: 0, lineHeight: '1.5' }}>
              정확한 분석을 위해 <strong>모든 서류</strong>를 업로드해주세요.
            </p>
          </div>

          <button onClick={handleAnalyze} style={primaryButtonStyle}>
            확인하기
          </button>
        </div>
      </div>
    );
  }

  // --- 렌더링: 분석 중 ---
  if (step === 'analyzing') {
    return (
      <div style={overlayStyle}>
        <div style={{ ...modalStyle, textAlign: 'center', padding: '60px 40px' }}>
          <div style={{ width: '48px', height: '48px', border: '4px solid #8FBF4D', borderTopColor: 'transparent', borderRadius: '50%', margin: '0 auto 20px', animation: 'spin 1s linear infinite' }} />
          <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#2C2C2C', marginBottom: '8px' }}>서류를 분석하고 있어요</h3>
          <p style={{ fontSize: '14px', color: '#666' }}>잠시만 기다려주세요...</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  // --- 렌더링: 위저드 (카드 뷰) ---
  if (step === 'wizard') {
    const item = checkItems[currentIndex];
    const total = checkItems.length;
    
    // 현재 항목의 상태 (사용자 결정이 있으면 그것을 따름)
    const currentStatus = userDecisions[item.id] || item.verdict;
    const isReview = item.verdict === 'REVIEW_REQUIRED';

    return (
      <div style={overlayStyle}>
        <div style={{ ...modalStyle, padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          
          {/* Header */}
          <div style={{ padding: '20px', borderBottom: '1px solid #E8E8E8', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#2C2C2C' }}>보증보험 가입 여부 확인</h2>
            <CloseButton onClick={handleClose} absolute={false} />
          </div>

          {/* Progress Bar */}
          <div style={{ width: '100%', height: '4px', backgroundColor: '#F0F0F0' }}>
            <div style={{ 
              width: `${((currentIndex + 1) / total) * 100}%`, 
              height: '100%', 
              backgroundColor: '#8FBF4D',
              transition: 'width 0.3s ease'
            }} />
          </div>

          {/* Content Area */}
          <div style={{ padding: '20px', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            
            {/* Step Badge */}
            <div style={{ 
              backgroundColor: '#666', color: 'white', padding: '4px 12px', borderRadius: '12px', 
              fontSize: '12px', fontWeight: '600', marginBottom: '20px' 
            }}>
              {currentIndex + 1} / {total}
            </div>

            {/* Navigation & Question Wrapper */}
            <div style={{ display: 'flex', alignItems: 'flex-start', width: '100%', gap: '16px', marginBottom: '24px' }}>
              
              {/* Prev Button */}
              <button 
                onClick={handlePrev} 
                disabled={currentIndex === 0}
                style={navButtonStyle(currentIndex === 0)}
              >
                <ChevronLeft size={24} />
              </button>

              {/* Question Text */}
              <div style={{ flex: 1, textAlign: 'center' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#2C2C2C', lineHeight: '1.5', marginBottom: '8px' }}>
                  {item.question}
                </h3>
                {/* 힌트/가이드 텍스트 */}
                {isReview && !userDecisions[item.id] && (
                  <span style={{ fontSize: '12px', color: '#FF9800', fontWeight: '600' }}>
                    ✍️ 서류로 확인이 어려워요. 직접 확인해주세요!
                  </span>
                )}
              </div>

              {/* Next Button */}
              <button 
                onClick={handleNext}
                style={navButtonStyle(false)} // Always enabled to skip/next
              >
                <ChevronRight size={24} />
              </button>
            </div>

            {/* Context/Reason Box */}
            <div style={{ 
              backgroundColor: '#F8F9FA', borderRadius: '12px', padding: '20px', 
              width: '100%', textAlign: 'left', border: '1px solid #E9ECEF'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                <HelpCircle size={16} color="#666" />
                <span style={{ fontSize: '13px', fontWeight: '600', color: '#666' }}>상세 설명 및 판단 기준</span>
              </div>
              <p style={{ fontSize: '14px', color: '#424242', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                {item.reason_why}
              </p>
            </div>

          </div>

          {/* Footer Action Area */}
          <div style={{ padding: '20px', borderTop: '1px solid #E8E8E8', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            
            {/* Case 1: REVIEW_REQUIRED -> Yes/No Buttons */}
            {isReview ? (
              <>
                <button
                  onClick={() => handleUserDecision('FAIL')}
                  style={{ ...actionButtonStyle, backgroundColor: currentStatus === 'FAIL' ? '#FFEBEE' : '#FFF', color: '#D32F2F', border: '1px solid #FFCDD2' }}
                >
                  {currentStatus === 'FAIL' && <CheckCircle size={16} style={{marginRight: 6}}/>}
                  아니오 (조건 미충족)
                </button>
                <button
                  onClick={() => handleUserDecision('PASS')}
                  style={{ ...actionButtonStyle, backgroundColor: currentStatus === 'PASS' ? '#E8F5E9' : '#8FBF4D', color: currentStatus === 'PASS' ? '#2E7D32' : '#FFF' }}
                >
                  {currentStatus === 'PASS' && <CheckCircle size={16} style={{marginRight: 6}}/>}
                  {currentStatus === 'PASS' ? '확인됨' : '예 (충족합니다)'}
                </button>
              </>
            ) : item.verdict === 'PASS' ? (
              // Case 2: Already PASSED
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', justifyContent: 'center' }}>
                <span style={{ color: '#4CAF50', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle size={20} /> 서류상 안전합니다
                </span>
                <button onClick={handleNext} style={{ ...primaryButtonStyle, width: 'auto', padding: '10px 24px' }}>
                  다음
                </button>
              </div>
            ) : (
              // Case 3: FAIL
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', justifyContent: 'center' }}>
                <span style={{ color: '#F44336', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <XCircle size={20} /> 가입 불가 사유입니다
                </span>
                <button onClick={handleNext} style={{ ...primaryButtonStyle, width: 'auto', padding: '10px 24px' }}>
                  다음
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    );
  }

  // --- 렌더링: 요약 화면 (Summary) ---
  if (step === 'summary') {
    const isSuccess = failCount === 0;

    return (
      <div style={overlayStyle}>
        <div style={{ ...modalStyle, maxHeight: '90vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          
          <div style={{ padding: '24px', borderBottom: '1px solid #E8E8E8', textAlign: 'center' }}>
            <div style={iconCircleStyle(isSuccess ? '#E8F5E9' : '#FFEBEE')}>
              {isSuccess ? <CheckCircle size={32} color="#4CAF50" /> : <XCircle size={32} color="#F44336" />}
            </div>
            <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#2C2C2C', marginBottom: '8px' }}>
              {isSuccess ? '가입 가능합니다!' : '가입이 어려울 수 있습니다'}
            </h2>
            <p style={{ fontSize: '14px', color: '#666' }}>
              총 {checkItems.length}개 항목 중 <strong style={{ color: '#F44336' }}>{failCount}건</strong>의 부적격 사유가 발견되었습니다.
            </p>
          </div>

          <div style={{ padding: '20px', overflowY: 'auto', flex: 1, backgroundColor: '#FAFAFA' }}>
            {failCount > 0 ? (
              <>
                <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#D32F2F', marginBottom: '12px' }}>발견된 문제점</h4>
                {finalResults.filter(i => i.verdict === 'FAIL').map((item) => (
                  <div key={item.id} style={{ backgroundColor: 'white', padding: '16px', borderRadius: '8px', marginBottom: '10px', border: '1px solid #FFCDD2' }}>
                    <p style={{ fontSize: '14px', fontWeight: '600', color: '#2C2C2C', marginBottom: '6px' }}>Q. {item.question}</p>
                    <p style={{ fontSize: '13px', color: '#D32F2F' }}>{item.reason_why}</p>
                  </div>
                ))}
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px 0', color: '#4CAF50' }}>
                <Shield size={48} style={{ marginBottom: '16px', opacity: 0.8 }} />
                <p style={{ fontWeight: '600' }}>모든 필수 요건을 충족합니다.</p>
              </div>
            )}
          </div>

          <div style={{ padding: '20px', borderTop: '1px solid #E8E8E8' }}>
            <button onClick={handleClose} style={primaryButtonStyle}>
              확인 완료
            </button>
          </div>

        </div>
      </div>
    );
  }

  return null;
}

// --- Styles & Components ---

const overlayStyle: React.CSSProperties = {
  position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000,
  display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
};

const modalStyle: React.CSSProperties = {
  backgroundColor: 'white', borderRadius: '16px', width: '100%', maxWidth: '600px',
  boxShadow: '0 4px 20px rgba(0,0,0,0.15)', position: 'relative',
  padding: '32px'
};

const CloseButton = ({ onClick, absolute = true }: { onClick: () => void, absolute?: boolean }) => (
  <button onClick={onClick} style={{
    position: absolute ? 'absolute' : 'static', top: absolute ? '20px' : 'auto', right: absolute ? '20px' : 'auto',
    background: 'none', border: 'none', cursor: 'pointer', padding: '4px'
  }}>
    <X size={24} color="#666" />
  </button>
);

const iconCircleStyle = (bgColor: string): React.CSSProperties => ({
  width: '64px', height: '64px', backgroundColor: bgColor, borderRadius: '50%',
  display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px'
});

const titleStyle: React.CSSProperties = { fontSize: '20px', fontWeight: '700', color: '#2C2C2C', marginBottom: '8px' };
const subtitleStyle: React.CSSProperties = { fontSize: '14px', color: '#666', margin: 0 };

const Label = ({ text }: { text: string }) => (
  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#2C2C2C' }}>{text}</label>
);

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #E8E8E8',
  fontSize: '14px', outline: 'none'
};

const primaryButtonStyle: React.CSSProperties = {
  width: '100%', padding: '14px', borderRadius: '8px', border: 'none',
  backgroundColor: '#8FBF4D', color: 'white', fontSize: '16px', fontWeight: '600', cursor: 'pointer'
};

const navButtonStyle = (disabled: boolean): React.CSSProperties => ({
  width: '40px', height: '40px', borderRadius: '50%', border: '1px solid #E0E0E0',
  backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
  cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.3 : 1,
  flexShrink: 0
});

const actionButtonStyle: React.CSSProperties = {
  flex: 1, padding: '12px', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center'
};