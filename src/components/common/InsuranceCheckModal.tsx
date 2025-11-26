import { useState, useRef } from 'react';
import { X, Upload, FileText, Shield, CheckCircle, AlertTriangle } from 'lucide-react';
import { checklistAPI } from '../../api/checklist';

interface InsuranceCheckModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function InsuranceCheckModal({ isOpen, onClose }: InsuranceCheckModalProps) {
  const [deposit, setDeposit] = useState('');
  const [registryFile, setRegistryFile] = useState<File | null>(null);
  const [buildingFile, setBuildingFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
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
      const result = await checklistAPI.checkInsurance(
        registryFile,
        buildingFile,
        Number(deposit)
      );

      if (result.success) {
        alert(`[분석 결과]\n${result.message}\n\n${result.details || ''}`);
        onClose(); // 성공 시 모달 닫기
      } else {
        alert(`확인 실패: ${result.message}`);
      }
    } catch (error) {
      console.error(error);
      alert('분석 중 오류가 발생했습니다.');
    } finally {
      setIsAnalyzing(false);
    }
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