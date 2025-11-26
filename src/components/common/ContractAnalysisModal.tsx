import { useState, useRef } from 'react';
import { X, Upload, FileText, AlertTriangle, CheckCircle, Shield, Mail, Download } from 'lucide-react';
import { checklistAPI } from '../../api/checklist';
import type { ScanResponse } from '../../types';
import AnalysisLoadingView from './AnalysisLoadingView';
import AnalysisResultModal from './AnalysisResultModal';

interface ContractAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ContractAnalysisModal({ isOpen, onClose }: ContractAnalysisModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<ScanResponse | null>(null);
  const [htmlOutput, setHtmlOutput] = useState<string>('');
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleClose = () => {
    setFile(null);
    setPreviewUrl(null);
    setAnalysisResult(null);
    setHtmlOutput('');
    setIsResultModalOpen(false);
    onClose();
  };

  const handleFileSelect = (selectedFile: File) => {
    const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (!validTypes.includes(selectedFile.type)) {
      alert('PDF, JPG, PNG 파일만 업로드 가능합니다.');
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      alert('파일 크기는 10MB를 초과할 수 없습니다.');
      return;
    }

    setFile(selectedFile);
    setAnalysisResult(null);

    if (selectedFile.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(selectedFile);
    } else if (selectedFile.type === 'application/pdf') {
      setPreviewUrl('pdf');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileSelect(droppedFile);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      handleFileSelect(selectedFile);
    }
  };

  const handleAnalyze = async () => {
    if (!file) {
      alert('파일을 선택해주세요.');
      return;
    }

    setIsAnalyzing(true);
    setAnalysisResult(null);
    setHtmlOutput('');

    try {
      // Let's assume the API response has the HTML content in an 'output' field.
      const result = await checklistAPI.analyzeContract([file], '임대차계약서') as any;
      if (result && result.output) {
        setHtmlOutput(result.output);
        setIsResultModalOpen(true);
      } else {
        // Fallback to old result display if no html output
        setAnalysisResult(result);
      }
    } catch (error) {
      console.error('Analysis error:', error);
      alert('분석 중 오류가 발생했습니다.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <>
      <AnalysisLoadingView isLoading={isAnalyzing} analysisType="contract" />

      <AnalysisResultModal
        isOpen={isResultModalOpen}
        onClose={() => setIsResultModalOpen(false)}
        htmlContent={htmlOutput}
      />

      <div
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px',
        }}
        onClick={handleClose}
      >
      <div
        style={{
          backgroundColor: '#FFFFFF', borderRadius: '16px', width: '100%', maxWidth: '700px',
          maxHeight: '90vh', overflow: 'auto', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ padding: '24px', borderBottom: '1px solid #E8E8E8', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#2C2C2C', margin: 0 }}>계약서 분석</h2>
          <button onClick={handleClose} style={{ width: '32px', height: '32px', borderRadius: '50%', border: 'none', backgroundColor: '#F0F0F0', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#666666' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: '24px' }}>
          <div onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop} onClick={() => fileInputRef.current?.click()} style={{ border: `2px dashed ${isDragging ? '#8FBF4D' : '#E8E8E8'}`, borderRadius: '12px', padding: '40px 20px', textAlign: 'center', cursor: 'pointer', backgroundColor: isDragging ? '#F5F3E6' : '#FAFAFA', transition: 'all 0.2s', marginBottom: '20px' }}>
            <input ref={fileInputRef} type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileInputChange} style={{ display: 'none' }} />
            <Upload size={48} color={isDragging ? '#8FBF4D' : '#CCCCCC'} style={{ margin: '0 auto 16px' }} />
            <p style={{ fontSize: '16px', fontWeight: '600', color: '#2C2C2C', margin: '0 0 8px 0' }}>{file ? file.name : '파일을 여기에 드롭하거나 클릭하여 선택하세요'}</p>
            <p style={{ fontSize: '13px', color: '#999999', margin: 0 }}>PDF, JPG, PNG (최대 10MB)</p>
          </div>

          {previewUrl && (
            <div style={{ marginBottom: '20px', padding: '16px', backgroundColor: '#F8F8F8', borderRadius: '8px' }}>
              <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#2C2C2C', marginBottom: '12px' }}>파일 미리보기</h4>
              {previewUrl === 'pdf' ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', backgroundColor: '#FFFFFF', borderRadius: '8px' }}>
                  <FileText size={40} color="#F44336" />
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: '600', color: '#2C2C2C', margin: '0 0 4px 0' }}>{file?.name}</p>
                    <p style={{ fontSize: '12px', color: '#999999', margin: 0 }}>{file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : ''}</p>
                  </div>
                </div>
              ) : (
                <img src={previewUrl} alt="미리보기" style={{ width: '100%', maxHeight: '300px', objectFit: 'contain', borderRadius: '8px', backgroundColor: '#FFFFFF' }} />
              )}
            </div>
          )}

          {file && (
            <button onClick={handleAnalyze} disabled={isAnalyzing} style={{ width: '100%', padding: '14px', borderRadius: '8px', border: 'none', backgroundColor: isAnalyzing ? '#CCCCCC' : '#8FBF4D', color: '#FFFFFF', fontSize: '15px', fontWeight: '600', cursor: isAnalyzing ? 'not-allowed' : 'pointer', marginBottom: '20px' }}>
              {isAnalyzing ? '분석 중...' : '즉시 분석하기'}
            </button>
          )}

          </div>
        </div>
      </div>
    </>
  );
}