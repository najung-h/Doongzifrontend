import { useState, useRef } from 'react';
import { X, Upload, AlertCircle, CheckCircle } from 'lucide-react';
import { checklistAPI } from '../../api/checklist';
import AnalysisLoadingView from './AnalysisLoadingView';

interface InsuranceCheckModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function InsuranceCheckModal({ isOpen, onClose }: InsuranceCheckModalProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [deposit, setDeposit] = useState('');
  const [landlordName, setLandlordName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    eligible: boolean;
    message: string;
    details?: string;
  } | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleCheck = async () => {
    if (files.length === 0 || !deposit) {
      alert('파일(등기부등본, 건축물대장)과 보증금을 모두 입력해주세요.');
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('target_deposit', deposit);
      formData.append('target_landlord_name', landlordName);
      
      files.forEach((file) => {
        formData.append('files', file);
      });

      const response = await checklistAPI.checkInsurance(formData);
      setResult(response);
    } catch (error) {
      console.error(error);
      alert('오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFiles([]);
    setDeposit('');
    setLandlordName('');
    setResult(null);
    onClose();
  };

  return (
    <>
      <AnalysisLoadingView isLoading={isLoading} analysisType="insurance" />

      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
        alignItems: 'center', justifyContent: 'center', zIndex: 1000
      }}>
        <div style={{
          backgroundColor: 'white', padding: '24px', borderRadius: '16px',
          width: '100%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold' }}>보증보험 가입 확인</h2>
            <button onClick={handleClose} style={{ border: 'none', background: 'none', cursor: 'pointer' }}>
              <X />
            </button>
          </div>

          {!result ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: '2px dashed #ddd', padding: '30px', textAlign: 'center',
                  borderRadius: '8px', cursor: 'pointer', backgroundColor: '#fafafa'
                }}
              >
                <Upload style={{ margin: '0 auto 10px', display: 'block', color: '#8FBF4D' }} />
                <p style={{ fontWeight: 600, marginBottom: '4px' }}>등기부등본 및 건축물대장 업로드</p>
                <p style={{ fontSize: '12px', color: '#999' }}>
                  {files.length > 0 ? `${files.length}개 파일 선택됨` : '클릭하여 파일 선택 (PDF, 이미지)'}
                </p>
                <input
                  ref={fileInputRef} type="file" multiple
                  accept=".pdf,.jpg,.png,.jpeg"
                  style={{ display: 'none' }} onChange={handleFileChange}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>보증금 (만원)</label>
                <input
                  type="number" placeholder="예: 10000" value={deposit}
                  onChange={e => setDeposit(e.target.value)}
                  style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>임대인 성명 (선택)</label>
                <input
                  type="text" placeholder="임대인 성명" value={landlordName}
                  onChange={e => setLandlordName(e.target.value)}
                  style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px' }}
                />
              </div>

              <button
                onClick={handleCheck} disabled={isLoading}
                style={{
                  padding: '14px', backgroundColor: isLoading ? '#ccc' : '#8FBF4D',
                  color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold',
                  cursor: isLoading ? 'not-allowed' : 'pointer', marginTop: '8px'
                }}
              >
                {isLoading ? 'AI 분석 중...' : '가입 가능 여부 확인'}
              </button>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              {result.eligible ?
                <CheckCircle size={48} color="#4CAF50" style={{ margin: '0 auto 16px' }} /> :
                <AlertCircle size={48} color="#F44336" style={{ margin: '0 auto 16px' }} />
              }
              <h3 style={{ fontSize: '20px', marginBottom: '12px', color: result.eligible ? '#4CAF50' : '#F44336' }}>
                {result.message}
              </h3>
              {result.details && (
                <div style={{
                  backgroundColor: '#f5f5f5', padding: '16px', borderRadius: '8px',
                  textAlign: 'left', fontSize: '14px', lineHeight: '1.6', color: '#444', whiteSpace: 'pre-wrap'
                }}>
                  {result.details}
                </div>
              )}
              <button
                onClick={handleClose}
                style={{
                  marginTop: '24px', padding: '12px 24px', backgroundColor: '#f0f0f0',
                  border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', color: '#333'
                }}
              >
                닫기
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}