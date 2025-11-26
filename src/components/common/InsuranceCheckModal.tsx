import { useState, useRef } from 'react';
import { X, Upload, FileText, AlertTriangle, CheckCircle, Shield } from 'lucide-react';
import { checklistAPI } from '../../api/checklist';
import type { InsuranceFailedItem, InsuranceReviewItem } from '../../types';

interface InsuranceCheckModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function InsuranceCheckModal({ isOpen, onClose }: InsuranceCheckModalProps) {
  // 모달 단계 관리
  const [stage, setStage] = useState<'upload' | 'analyzing' | 'result'>('upload');

  // Stage 1: 파일 업로드
  const [registryFile, setRegistryFile] = useState<File | null>(null);
  const [buildingFile, setBuildingFile] = useState<File | null>(null);
  const [deposit, setDeposit] = useState<string>('');
  const [registryPreview, setRegistryPreview] = useState<string | null>(null);
  const [buildingPreview, setBuildingPreview] = useState<string | null>(null);
  const [isDraggingRegistry, setIsDraggingRegistry] = useState(false);
  const [isDraggingBuilding, setIsDraggingBuilding] = useState(false);

  // Stage 2: 분석
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Stage 3: 결과
  const [analysisStatus, setAnalysisStatus] = useState<'FAIL' | 'REVIEW_REQUIRED' | 'PASS' | 'FINAL_FAIL' | null>(null);
  const [failedItems, setFailedItems] = useState<InsuranceFailedItem[]>([]);
  const [reviewItems, setReviewItems] = useState<InsuranceReviewItem[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [failReasons, setFailReasons] = useState<string[]>([]);

  // Refs
  const registryInputRef = useRef<HTMLInputElement>(null);
  const buildingInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleClose = () => {
    // 모든 상태 초기화
    setStage('upload');
    setRegistryFile(null);
    setBuildingFile(null);
    setDeposit('');
    setRegistryPreview(null);
    setBuildingPreview(null);
    setIsAnalyzing(false);
    setAnalysisStatus(null);
    setFailedItems([]);
    setReviewItems([]);
    setCurrentQuestionIndex(0);
    setFailReasons([]);
    onClose();
  };

  // 파일 미리보기 생성
  const generatePreview = (file: File, setPreview: (url: string | null) => void) => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else if (file.type === 'application/pdf') {
      setPreview('pdf');
    }
  };

  // 파일 선택 핸들러
  const handleFileSelect = (file: File, type: 'registry' | 'building') => {
    // 파일 타입 검증
    const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      alert('PDF, JPG, PNG 파일만 업로드 가능합니다.');
      return;
    }

    // 파일 크기 검증 (10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('파일 크기는 10MB를 초과할 수 없습니다.');
      return;
    }

    if (type === 'registry') {
      setRegistryFile(file);
      generatePreview(file, setRegistryPreview);
    } else {
      setBuildingFile(file);
      generatePreview(file, setBuildingPreview);
    }
  };

  // 드래그 앤 드롭 핸들러
  const handleDragOver = (e: React.DragEvent, type: 'registry' | 'building') => {
    e.preventDefault();
    if (type === 'registry') {
      setIsDraggingRegistry(true);
    } else {
      setIsDraggingBuilding(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent, type: 'registry' | 'building') => {
    e.preventDefault();
    if (type === 'registry') {
      setIsDraggingRegistry(false);
    } else {
      setIsDraggingBuilding(false);
    }
  };

  const handleDrop = (e: React.DragEvent, type: 'registry' | 'building') => {
    e.preventDefault();
    if (type === 'registry') {
      setIsDraggingRegistry(false);
    } else {
      setIsDraggingBuilding(false);
    }

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileSelect(droppedFile, type);
    }
  };

  // 파일 입력 변경 핸들러
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'registry' | 'building') => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      handleFileSelect(selectedFile, type);
    }
  };

  // 분석 시작
  const handleStartAnalysis = async () => {
    if (!registryFile || !buildingFile || !deposit) {
      alert('모든 항목을 입력해주세요.');
      return;
    }

    setStage('analyzing');
    setIsAnalyzing(true);

    try {
      const formData = new FormData();
      formData.append('actionType', 'checkInsurance');
      formData.append('files', registryFile);
      formData.append('files', buildingFile);
      formData.append('deposit', deposit);

      const response = await checklistAPI.checkInsurance(formData);

      if (response.success) {
        setAnalysisStatus(response.status);

        if (response.status === 'FAIL') {
          setFailedItems(response.failedItems || []);
        } else if (response.status === 'REVIEW_REQUIRED') {
          setReviewItems(response.reviewItems || []);
          setCurrentQuestionIndex(0);
          setFailReasons([]);
        }

        setStage('result');
      } else {
        alert('분석에 실패했습니다. 다시 시도해주세요.');
        setStage('upload');
      }
    } catch (error) {
      console.error('Insurance check error:', error);
      alert('분석 중 오류가 발생했습니다.');
      setStage('upload');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // YES 버튼 클릭
  const handleYesClick = () => {
    if (currentQuestionIndex < reviewItems.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // 모든 질문 완료 → PASS
      setAnalysisStatus('PASS');
    }
  };

  // NO 버튼 클릭
  const handleNoClick = () => {
    const currentItem = reviewItems[currentQuestionIndex];
    setFailReasons(prev => [...prev, currentItem.reason_why]);

    if (currentQuestionIndex < reviewItems.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // 마지막 질문 → FINAL_FAIL
      setAnalysisStatus('FINAL_FAIL');
    }
  };

  return (
    <div
      onClick={isAnalyzing ? undefined : handleClose}
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
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          width: '90%',
          maxWidth: '600px',
          maxHeight: '90vh',
          overflow: 'auto',
          position: 'relative',
        }}
      >
        {/* 닫기 버튼 */}
        <button
          onClick={handleClose}
          disabled={isAnalyzing}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'none',
            border: 'none',
            cursor: isAnalyzing ? 'not-allowed' : 'pointer',
            padding: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            transition: 'background-color 0.2s',
            opacity: isAnalyzing ? 0.5 : 1,
          }}
          onMouseEnter={(e) => !isAnalyzing && (e.currentTarget.style.backgroundColor = '#F5F5F5')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          <X size={24} color="#666" />
        </button>

        {/* Stage 1: 파일 업로드 */}
        {stage === 'upload' && (
          <div style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <Shield size={28} color="#8FBF4D" />
              <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: '#2C2C2C' }}>
                보증보험 가입 가능 여부 확인
              </h2>
            </div>
            <p style={{ color: '#666', marginBottom: '24px', fontSize: '14px' }}>
              등기부등본과 건축물대장을 업로드하고 보증금을 입력해주세요.
            </p>

            {/* 등기부등본 업로드 */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 600, color: '#2C2C2C' }}>
                등기부등본 *
              </label>
              <div
                onDragOver={(e) => handleDragOver(e, 'registry')}
                onDragLeave={(e) => handleDragLeave(e, 'registry')}
                onDrop={(e) => handleDrop(e, 'registry')}
                onClick={() => registryInputRef.current?.click()}
                style={{
                  border: `2px dashed ${isDraggingRegistry ? '#8FBF4D' : '#E8E8E8'}`,
                  borderRadius: '8px',
                  padding: '24px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  backgroundColor: isDraggingRegistry ? '#F5F3E6' : '#FAFAFA',
                  transition: 'all 0.2s',
                }}
              >
                <Upload size={32} color={isDraggingRegistry ? '#8FBF4D' : '#CCCCCC'} style={{ margin: '0 auto 12px' }} />
                <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>
                  {registryFile ? registryFile.name : '파일을 드래그하거나 클릭하여 업로드'}
                </p>
                <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#999' }}>
                  PDF, JPG, PNG (최대 10MB)
                </p>
              </div>
              <input
                ref={registryInputRef}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => handleFileInputChange(e, 'registry')}
                style={{ display: 'none' }}
              />
              {registryPreview && (
                <div style={{ marginTop: '12px', textAlign: 'center' }}>
                  {registryPreview === 'pdf' ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', padding: '12px', backgroundColor: '#F8F8F8', borderRadius: '8px' }}>
                      <FileText size={24} color="#8FBF4D" />
                      <span style={{ fontSize: '14px', color: '#666' }}>{registryFile?.name}</span>
                      <span style={{ fontSize: '12px', color: '#999' }}>({(registryFile!.size / 1024 / 1024).toFixed(2)}MB)</span>
                    </div>
                  ) : (
                    <img src={registryPreview} alt="등기부등본 미리보기" style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px', border: '1px solid #E8E8E8' }} />
                  )}
                </div>
              )}
            </div>

            {/* 건축물대장 업로드 */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 600, color: '#2C2C2C' }}>
                건축물대장 *
              </label>
              <div
                onDragOver={(e) => handleDragOver(e, 'building')}
                onDragLeave={(e) => handleDragLeave(e, 'building')}
                onDrop={(e) => handleDrop(e, 'building')}
                onClick={() => buildingInputRef.current?.click()}
                style={{
                  border: `2px dashed ${isDraggingBuilding ? '#8FBF4D' : '#E8E8E8'}`,
                  borderRadius: '8px',
                  padding: '24px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  backgroundColor: isDraggingBuilding ? '#F5F3E6' : '#FAFAFA',
                  transition: 'all 0.2s',
                }}
              >
                <Upload size={32} color={isDraggingBuilding ? '#8FBF4D' : '#CCCCCC'} style={{ margin: '0 auto 12px' }} />
                <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>
                  {buildingFile ? buildingFile.name : '파일을 드래그하거나 클릭하여 업로드'}
                </p>
                <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#999' }}>
                  PDF, JPG, PNG (최대 10MB)
                </p>
              </div>
              <input
                ref={buildingInputRef}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => handleFileInputChange(e, 'building')}
                style={{ display: 'none' }}
              />
              {buildingPreview && (
                <div style={{ marginTop: '12px', textAlign: 'center' }}>
                  {buildingPreview === 'pdf' ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', padding: '12px', backgroundColor: '#F8F8F8', borderRadius: '8px' }}>
                      <FileText size={24} color="#8FBF4D" />
                      <span style={{ fontSize: '14px', color: '#666' }}>{buildingFile?.name}</span>
                      <span style={{ fontSize: '12px', color: '#999' }}>({(buildingFile!.size / 1024 / 1024).toFixed(2)}MB)</span>
                    </div>
                  ) : (
                    <img src={buildingPreview} alt="건축물대장 미리보기" style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px', border: '1px solid #E8E8E8' }} />
                  )}
                </div>
              )}
            </div>

            {/* 보증금 입력 */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 600, color: '#2C2C2C' }}>
                보증금 (만원) *
              </label>
              <input
                type="number"
                value={deposit}
                onChange={(e) => setDeposit(e.target.value)}
                placeholder="예: 12000"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #E8E8E8',
                  borderRadius: '8px',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {/* 분석 시작 버튼 */}
            <button
              onClick={handleStartAnalysis}
              disabled={!registryFile || !buildingFile || !deposit}
              style={{
                width: '100%',
                padding: '14px',
                backgroundColor: !registryFile || !buildingFile || !deposit ? '#CCCCCC' : '#8FBF4D',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '15px',
                fontWeight: 600,
                cursor: !registryFile || !buildingFile || !deposit ? 'not-allowed' : 'pointer',
                transition: 'background-color 0.2s',
              }}
            >
              분석 시작하기
            </button>
          </div>
        )}

        {/* Stage 2: 분석 중 */}
        {stage === 'analyzing' && (
          <div style={{ textAlign: 'center', padding: '60px 24px' }}>
            <style>
              {`
                @keyframes spin {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }
              `}
            </style>
            <div style={{
              width: '60px',
              height: '60px',
              border: '4px solid #E8E8E8',
              borderTop: '4px solid #8FBF4D',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 24px'
            }} />
            <h3 style={{ margin: '0 0 12px', fontSize: '18px', fontWeight: 600, color: '#2C2C2C' }}>
              분석을 수행하고 있습니다
            </h3>
            <p style={{ color: '#666666', margin: 0, fontSize: '14px' }}>
              문서를 분석하고 있습니다. 잠시만 기다려주세요.<br />
              (약 30~60초 소요)
            </p>
          </div>
        )}

        {/* Stage 3-FAIL: LLM 판정 실패 */}
        {stage === 'result' && analysisStatus === 'FAIL' && (
          <div style={{ padding: '24px' }}>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                backgroundColor: '#FFEEEE',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto'
              }}>
                <AlertTriangle size={40} color="#F44336" />
              </div>
            </div>

            <h3 style={{ textAlign: 'center', marginBottom: '16px', fontSize: '18px', fontWeight: 600, color: '#2C2C2C' }}>
              보증보험 가입이 불가능합니다
            </h3>

            <div style={{
              backgroundColor: '#FEF5F5',
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '24px'
            }}>
              {failedItems.map((item, index) => (
                <div key={item.id} style={{ marginBottom: index < failedItems.length - 1 ? '12px' : 0 }}>
                  <div style={{ fontWeight: 600, color: '#F44336', marginBottom: '4px', fontSize: '14px' }}>
                    {item.question}
                  </div>
                  <div style={{ fontSize: '14px', color: '#666' }}>
                    {item.reason}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={handleClose}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#8FBF4D',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '15px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              확인
            </button>
          </div>
        )}

        {/* Stage 3-REVIEW: 순차 질문 */}
        {stage === 'result' && analysisStatus === 'REVIEW_REQUIRED' && reviewItems.length > 0 && (
          <div style={{ padding: '24px' }}>
            <div style={{ marginBottom: '24px', textAlign: 'center' }}>
              <span style={{ color: '#8FBF4D', fontWeight: 600, fontSize: '16px' }}>
                {currentQuestionIndex + 1} / {reviewItems.length}
              </span>
            </div>

            <div style={{
              backgroundColor: '#F8F8F8',
              borderRadius: '12px',
              padding: '24px',
              marginBottom: '24px'
            }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600, color: '#2C2C2C', lineHeight: '1.5' }}>
                {reviewItems[currentQuestionIndex].question}
              </h3>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={handleYesClick}
                style={{
                  flex: 1,
                  padding: '16px',
                  backgroundColor: '#8FBF4D',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                예
              </button>
              <button
                onClick={handleNoClick}
                style={{
                  flex: 1,
                  padding: '16px',
                  backgroundColor: '#F44336',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                아니오
              </button>
            </div>
          </div>
        )}

        {/* Stage 3-FINAL_FAIL: NO 선택 실패 */}
        {stage === 'result' && analysisStatus === 'FINAL_FAIL' && (
          <div style={{ padding: '24px' }}>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                backgroundColor: '#FFEEEE',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto'
              }}>
                <AlertTriangle size={40} color="#F44336" />
              </div>
            </div>

            <h3 style={{ textAlign: 'center', marginBottom: '16px', fontSize: '18px', fontWeight: 600, color: '#2C2C2C' }}>
              보증보험 가입이 불가능합니다
            </h3>

            <p style={{ textAlign: 'center', color: '#666', marginBottom: '24px', fontSize: '14px' }}>
              다음 항목에서 문제가 발견되었습니다:
            </p>

            <div style={{
              backgroundColor: '#FEF5F5',
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '24px'
            }}>
              {failReasons.map((reason, index) => (
                <div key={index} style={{
                  marginBottom: index < failReasons.length - 1 ? '12px' : 0,
                  paddingBottom: index < failReasons.length - 1 ? '12px' : 0,
                  borderBottom: index < failReasons.length - 1 ? '1px solid #FFDDDD' : 'none'
                }}>
                  <div style={{ fontSize: '14px', color: '#666' }}>
                    • {reason}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={handleClose}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#8FBF4D',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '15px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              확인
            </button>
          </div>
        )}

        {/* Stage 3-PASS: 성공 */}
        {stage === 'result' && analysisStatus === 'PASS' && (
          <div style={{ padding: '24px', textAlign: 'center' }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              backgroundColor: '#E8F5E9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px'
            }}>
              <CheckCircle size={40} color="#4CAF50" />
            </div>

            <h3 style={{ marginBottom: '12px', fontSize: '18px', fontWeight: 600, color: '#2C2C2C' }}>
              보증보험 가입이 가능합니다
            </h3>

            <p style={{ color: '#666', marginBottom: '24px', fontSize: '14px' }}>
              모든 확인 항목을 통과하였습니다.
            </p>

            <button
              onClick={handleClose}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#8FBF4D',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '15px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              확인
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
