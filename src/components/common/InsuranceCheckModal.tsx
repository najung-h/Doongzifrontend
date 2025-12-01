import { useState, useRef } from 'react';
import { X, Upload, Shield, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { checklistAPI } from '../../api/checklist';
import type { InsuranceCheckResponse } from '../../types';

interface InsuranceCheckModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function InsuranceCheckModal({ isOpen, onClose }: InsuranceCheckModalProps) {
  const [deposit, setDeposit] = useState('');
  const [registryFile, setRegistryFile] = useState<File | null>(null);
  const [buildingFile, setBuildingFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<InsuranceCheckResponse | null>(null);

  const registryInputRef = useRef<HTMLInputElement>(null);
  const buildingInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleAnalyze = async () => {
    if (!deposit || !registryFile || !buildingFile) {
      alert('보증금과 두 가지 서류를 모두 등록해주세요.');
      return;
    }

    setIsAnalyzing(true);
    try {
      const response = await checklistAPI.checkInsurance(
        registryFile,
        buildingFile,
        Number(deposit)
      );

      setResult(response); // 결과 저장하여 UI에 표시
    } catch (error) {
      console.error(error);
      alert('분석 중 오류가 발생했습니다.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setDeposit('');
    setRegistryFile(null);
    setBuildingFile(null);
  };

  const FileUploadBox = ({ 
    title, 
    file, 
    onSelect, 
    inputRef 
  }: { 
    title: string, 
    file: File | null, 
    onSelect: (f: File) => void, 
    inputRef: React.RefObject<HTMLInputElement> 
  }) => (
    <div 
      onClick={() => inputRef.current?.click()}
      style={{
        border: `1px dashed ${file ? '#8FBF4D' : '#D9D9D9'}`,
        borderRadius: '8px',
        padding: '20px',
        textAlign: 'center',
        cursor: 'pointer',
        backgroundColor: file ? '#F0F7FA' : '#FAFAFA',
        marginBottom: '12px'
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.jpg,.png"
        style={{ display: 'none' }}
        onChange={(e) => {
          if (e.target.files?.[0]) onSelect(e.target.files[0]);
        }}
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

  // 결과 화면 렌더링
  if (result) {
    const getStatusConfig = () => {
      switch (result.status) {
        case 'PASS':
          return {
            color: '#4CAF50',
            bgColor: '#E8F5E9',
            icon: <CheckCircle size={48} color="#4CAF50" />,
            title: '가입 가능',
            subtitle: '전세보증보험에 가입하실 수 있습니다!'
          };
        case 'FAIL':
          return {
            color: '#F44336',
            bgColor: '#FFEBEE',
            icon: <XCircle size={48} color="#F44336" />,
            title: '가입 불가',
            subtitle: '전세보증보험 가입이 어려울 수 있습니다.'
          };
        case 'REVIEW_REQUIRED':
          return {
            color: '#FF9800',
            bgColor: '#FFF3E0',
            icon: <AlertTriangle size={48} color="#FF9800" />,
            title: '검토 필요',
            subtitle: '추가 검토가 필요한 항목이 있습니다.'
          };
        default:
          return {
            color: '#999',
            bgColor: '#F5F5F5',
            icon: <Shield size={48} color="#999" />,
            title: '결과 확인',
            subtitle: '확인 결과입니다.'
          };
      }
    };

    const config = getStatusConfig();

    return (
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000,
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
      }} onClick={(e) => e.target === e.currentTarget && onClose()}>
        <div style={{
          backgroundColor: 'white', borderRadius: '16px', width: '100%', maxWidth: '600px',
          maxHeight: '90vh', overflow: 'auto',
          padding: '32px', position: 'relative', boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
        }} onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => { handleReset(); onClose(); }}
            style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            <X size={24} color="#666" />
          </button>

          {/* 상태 아이콘 및 제목 */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{
              width: '80px', height: '80px',
              backgroundColor: config.bgColor,
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 20px'
            }}>
              {config.icon}
            </div>
            <h2 style={{ fontSize: '24px', fontWeight: '700', color: config.color, marginBottom: '8px' }}>
              {config.title}
            </h2>
            <p style={{ fontSize: '16px', color: '#666', marginBottom: '16px' }}>
              {config.subtitle}
            </p>
            {result.message && (
              <p style={{ fontSize: '14px', color: '#424242', lineHeight: '1.6' }}>
                {result.message}
              </p>
            )}
          </div>

          {/* 실패 항목 리스트 */}
          {result.failedItems && result.failedItems.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#2C2C2C', marginBottom: '12px' }}>
                ❌ 가입 불가 항목
              </h3>
              {result.failedItems.map((item, index) => (
                <div key={index} style={{
                  padding: '16px',
                  backgroundColor: '#FFEBEE',
                  borderLeft: '4px solid #F44336',
                  borderRadius: '8px',
                  marginBottom: '12px'
                }}>
                  <p style={{ fontSize: '14px', fontWeight: '600', color: '#D32F2F', marginBottom: '8px' }}>
                    {item.question}
                  </p>
                  <p style={{ fontSize: '13px', color: '#666', margin: 0, lineHeight: '1.5' }}>
                    {item.reason}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* 검토 필요 항목 리스트 */}
          {result.reviewItems && result.reviewItems.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#2C2C2C', marginBottom: '12px' }}>
                ⚠️ 검토 필요 항목
              </h3>
              {result.reviewItems.map((item, index) => (
                <div key={index} style={{
                  padding: '16px',
                  backgroundColor: '#FFF3E0',
                  borderLeft: '4px solid #FF9800',
                  borderRadius: '8px',
                  marginBottom: '12px'
                }}>
                  <p style={{ fontSize: '14px', fontWeight: '600', color: '#F57C00', marginBottom: '8px' }}>
                    {item.question}
                  </p>
                  <p style={{ fontSize: '13px', color: '#666', margin: 0, lineHeight: '1.5' }}>
                    {item.reason_why}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* 추가 세부 정보 */}
          {result.details && (
            <div style={{
              padding: '16px',
              backgroundColor: '#F5F5F5',
              borderRadius: '8px',
              marginBottom: '24px'
            }}>
              <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#2C2C2C', marginBottom: '8px' }}>
                📋 상세 정보
              </h3>
              <p style={{ fontSize: '13px', color: '#666', margin: 0, lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                {result.details}
              </p>
            </div>
          )}

          {/* 액션 버튼 */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={handleReset}
              style={{
                flex: 1,
                padding: '14px',
                borderRadius: '8px',
                border: '1px solid #E0E0E0',
                backgroundColor: '#FFFFFF',
                color: '#666',
                fontSize: '15px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              다시 확인하기
            </button>
            <button
              onClick={() => { handleReset(); onClose(); }}
              style={{
                flex: 1,
                padding: '14px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: '#8FBF4D',
                color: '#FFFFFF',
                fontSize: '15px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              닫기
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 입력 화면 렌더링
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white', borderRadius: '16px', width: '100%', maxWidth: '500px',
        padding: '24px', position: 'relative', boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
      }}>
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', cursor: 'pointer' }}
        >
          <X size={24} color="#666" />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ width: '48px', height: '48px', backgroundColor: '#E3F2FD', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
            <Shield size={24} color="#2196F3" />
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#2C2C2C', marginBottom: '8px' }}>보증보험 가입 가능 여부 확인</h2>
          <p style={{ fontSize: '14px', color: '#666' }}>전세보증금을 안전하게 지킬 수 있는지 확인해드려요.</p>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#2C2C2C' }}>전세 보증금 (만원)</label>
          <input
            type="number"
            value={deposit}
            onChange={(e) => setDeposit(e.target.value)}
            placeholder="예: 20000"
            style={{
              width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #E8E8E8',
              fontSize: '14px', outline: 'none'
            }}
          />
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#2C2C2C' }}>필수 서류 업로드</label>
          <FileUploadBox
            title="등기부등본"
            file={registryFile}
            onSelect={setRegistryFile}
            inputRef={registryInputRef}
          />
          <FileUploadBox
            title="건축물대장"
            file={buildingFile}
            onSelect={setBuildingFile}
            inputRef={buildingInputRef}
          />
        </div>

        <div style={{ backgroundColor: '#FFF3E0', padding: '12px', borderRadius: '8px', marginBottom: '24px', display: 'flex', gap: '8px' }}>
          <AlertTriangle size={18} color="#F57C00" style={{ flexShrink: 0, marginTop: '2px' }} />
          <p style={{ fontSize: '12px', color: '#E65100', margin: 0, lineHeight: '1.5' }}>
            두 서류의 정보를 종합하여 분석하므로, 정확한 결과를 위해 <strong>모두 업로드</strong>해주셔야 합니다.
          </p>
        </div>

        <button
          onClick={handleAnalyze}
          disabled={isAnalyzing}
          style={{
            width: '100%', padding: '14px', borderRadius: '8px', border: 'none',
            backgroundColor: isAnalyzing ? '#E0E0E0' : '#8FBF4D',
            color: 'white', fontSize: '16px', fontWeight: '600', cursor: isAnalyzing ? 'not-allowed' : 'pointer'
          }}
        >
          {isAnalyzing ? '분석 중...' : '확인하기'}
        </button>
      </div>
    </div>
  );
}