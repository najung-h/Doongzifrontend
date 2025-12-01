import { useState, useRef } from 'react';
import { X, Upload, Shield, CheckCircle, AlertTriangle, XCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { checklistAPI } from '../../api/checklist';
import type { InsuranceCheckItem, InsuranceVerdict } from '../../types';

interface InsuranceCheckModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function InsuranceCheckModal({ isOpen, onClose }: InsuranceCheckModalProps) {
  const [deposit, setDeposit] = useState('');
  const [registryFile, setRegistryFile] = useState<File | null>(null);
  const [buildingFile, setBuildingFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [checkItems, setCheckItems] = useState<InsuranceCheckItem[] | null>(null);
  const [showPassItems, setShowPassItems] = useState(false);

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
      // API 호출
      // checkInsurance의 시그니처가 (registryFile, buildingFile, deposit) 형태라고 가정합니다.
      // 만약 checklistAPI.checkInsurance가 객체 하나를 받는 형태라면 그에 맞게 수정해주세요.
      const response = await checklistAPI.checkInsurance(
        registryFile, // 실제 구현된 API에 맞게 파라미터 전달
        buildingFile,
        Number(deposit)
      );

      // response가 배열이라고 가정 (InsuranceCheckItem[])
      // 만약 { result: [...] } 형태라면 response.result로 접근
      const items = Array.isArray(response) ? response : (response as any).result || [];
      setCheckItems(items);

    } catch (error) {
      console.error(error);
      alert('분석 중 오류가 발생했습니다.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setCheckItems(null);
    setDeposit('');
    setRegistryFile(null);
    setBuildingFile(null);
    setShowPassItems(false);
  };

  // 결과 분류
  const failItems = checkItems?.filter(item => item.verdict === 'FAIL') || [];
  const reviewItems = checkItems?.filter(item => item.verdict === 'REVIEW_REQUIRED') || [];
  const passItems = checkItems?.filter(item => item.verdict === 'PASS') || [];

  // 전체 상태 판단
  const hasFail = failItems.length > 0;
  const isAllPass = checkItems && !hasFail && reviewItems.length === 0;

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

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
    }} onClick={(e) => e.target === e.currentTarget && onClose()}>
      
      <div style={{
        backgroundColor: 'white', borderRadius: '16px', width: '100%', maxWidth: '600px',
        maxHeight: '90vh', overflow: 'hidden', display: 'flex', flexDirection: 'column',
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
      }} onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div style={{ 
          padding: '24px', borderBottom: '1px solid #E8E8E8', 
          display: 'flex', justifyContent: 'space-between', alignItems: 'center' 
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Shield size={24} color="#8FBF4D" />
            <h2 style={{ fontSize: '20px', fontWeight: '700', margin: 0, color: '#2C2C2C' }}>
              보증보험 가입 가능 여부 확인
            </h2>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <X size={24} color="#666" />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
          {!checkItems ? (
            // 입력 화면 (기존과 동일)
            <>
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#2C2C2C' }}>
                  전세 보증금 (만원)
                </label>
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
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#2C2C2C' }}>
                  필수 서류 업로드
                </label>
                <FileUploadBox title="등기부등본" file={registryFile} onSelect={setRegistryFile} inputRef={registryInputRef} />
                <FileUploadBox title="건축물대장" file={buildingFile} onSelect={setBuildingFile} inputRef={buildingInputRef} />
              </div>

              <div style={{ backgroundColor: '#FFF3E0', padding: '12px', borderRadius: '8px', marginBottom: '24px', display: 'flex', gap: '8px' }}>
                <AlertTriangle size={18} color="#F57C00" style={{ flexShrink: 0, marginTop: '2px' }} />
                <p style={{ fontSize: '12px', color: '#E65100', margin: 0, lineHeight: '1.5' }}>
                  정확한 분석을 위해 <strong>모든 서류</strong>를 업로드해주세요.
                </p>
              </div>

              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                style={{
                  width: '100%', padding: '16px', borderRadius: '8px', border: 'none',
                  backgroundColor: isAnalyzing ? '#E0E0E0' : '#8FBF4D',
                  color: 'white', fontSize: '16px', fontWeight: '600', cursor: isAnalyzing ? 'not-allowed' : 'pointer'
                }}
              >
                {isAnalyzing ? '분석 중...' : '가입 가능 여부 확인하기'}
              </button>
            </>
          ) : (
            // 결과 화면
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* 종합 결과 요약 */}
              <div style={{ 
                textAlign: 'center', padding: '20px', 
                backgroundColor: hasFail ? '#FFEBEE' : (reviewItems.length > 0 ? '#FFF3E0' : '#E8F5E9'),
                borderRadius: '12px' 
              }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
                  {hasFail ? <XCircle size={48} color="#F44336" /> : 
                   reviewItems.length > 0 ? <AlertTriangle size={48} color="#FF9800" /> : 
                   <CheckCircle size={48} color="#4CAF50" />}
                </div>
                <h3 style={{ 
                  fontSize: '20px', fontWeight: '700', margin: '0 0 8px 0',
                  color: hasFail ? '#D32F2F' : (reviewItems.length > 0 ? '#E65100' : '#2E7D32')
                }}>
                  {hasFail ? '가입 불가 예상' : (reviewItems.length > 0 ? '추가 확인 필요' : '가입 가능')}
                </h3>
                <p style={{ fontSize: '14px', color: '#666', margin: 0 }}>
                  {hasFail ? '가입이 거절될 수 있는 항목이 발견되었습니다.' : 
                   reviewItems.length > 0 ? '서류만으로는 확인이 어려운 항목들을 직접 체크해주세요.' : 
                   '분석된 모든 항목이 안전합니다!'}
                </p>
              </div>

              {/* 1. 가입 불가 항목 (FAIL) - 질문 + 불가 사유 표시 */}
              {failItems.length > 0 && (
                <div>
                  <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#D32F2F', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <XCircle size={18} /> 가입 불가 사유 ({failItems.length})
                  </h4>
                  {failItems.map((item) => (
                    <div key={item.id} style={{ 
                      padding: '16px', border: '1px solid #FFCDD2', borderRadius: '8px', 
                      marginBottom: '12px', backgroundColor: '#FFEBEE' 
                    }}>
                      <p style={{ fontSize: '14px', fontWeight: '600', color: '#2C2C2C', marginBottom: '8px', lineHeight: '1.5' }}>
                        Q. {item.question}
                      </p>
                      <div style={{ fontSize: '13px', color: '#D32F2F', backgroundColor: 'rgba(255,255,255,0.6)', padding: '10px', borderRadius: '6px', lineHeight: '1.5' }}>
                        <strong>[불가 사유]</strong><br/>
                        {item.reason_why}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* 2. 검토 필요 항목 (REVIEW_REQUIRED) - 질문만 표시 */}
              {reviewItems.length > 0 && (
                <div>
                  <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#F57C00', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <AlertTriangle size={18} /> 직접 확인이 필요한 항목 ({reviewItems.length})
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {reviewItems.map((item) => (
                      <div key={item.id} style={{ 
                        padding: '16px', border: '1px solid #FFE0B2', borderRadius: '8px', backgroundColor: '#FFF8E1' 
                      }}>
                        <span style={{ 
                          display: 'inline-block', padding: '4px 8px', borderRadius: '4px', 
                          backgroundColor: '#FF9800', color: 'white', fontSize: '11px', fontWeight: '700', marginBottom: '8px'
                        }}>
                          확인 필요
                        </span>
                        <p style={{ fontSize: '14px', color: '#2C2C2C', margin: 0, lineHeight: '1.5', fontWeight: '600' }}>
                          Q. {item.question}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 3. 통과 항목 (PASS) - 접기/펼치기 */}
              {passItems.length > 0 && (
                <div>
                  <button 
                    onClick={() => setShowPassItems(!showPassItems)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '8px',
                      fontSize: '14px', fontWeight: '600', color: '#4CAF50',
                      background: 'none', border: 'none', cursor: 'pointer', padding: 0
                    }}
                  >
                    {showPassItems ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    안전한 항목 확인하기 ({passItems.length})
                  </button>
                  
                  {showPassItems && (
                    <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {passItems.map((item) => (
                        <div key={item.id} style={{ 
                          padding: '12px 16px', backgroundColor: '#F1F8E9', borderRadius: '8px',
                          display: 'flex', alignItems: 'center', gap: '10px'
                        }}>
                          <CheckCircle size={16} color="#4CAF50" style={{ flexShrink: 0 }} />
                          <p style={{ fontSize: '13px', color: '#558B2F', margin: 0, lineHeight: '1.4' }}>
                            {item.question}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <button
                onClick={handleReset}
                style={{
                  width: '100%', padding: '14px', borderRadius: '8px', border: '1px solid #E0E0E0',
                  backgroundColor: 'white', color: '#666', fontSize: '15px', fontWeight: '600',
                  cursor: 'pointer', marginTop: '12px'
                }}
              >
                처음으로 돌아가기
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}