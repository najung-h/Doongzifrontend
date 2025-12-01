import { useState, useRef } from 'react';
import { X, Upload, FileText, AlertTriangle, CheckCircle, Shield, Mail, Download } from 'lucide-react';
import { scanAPI } from '../../api/scan';
import { checklistAPI } from '../../api/checklist';
import type { ScanResponse } from '../../types';

interface RegistryAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RegistryAnalysisModal({ isOpen, onClose }: RegistryAnalysisModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<ScanResponse | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [reportHtml, setReportHtml] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleClose = () => {
    setFile(null);
    setPreviewUrl(null);
    setAnalysisResult(null);
    setReportHtml(null); // 초기화
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
    setReportHtml(null);

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
    setReportHtml(null);

    try {
      // 등기부등본은 scanAPI를 사용 (n8n analyzeDocuments)
      const result = await scanAPI.analyzeDocuments([file], '등기부등본');
      setAnalysisResult(result);

      // HTML 결과가 있으면 상태에 저장
      if (result.success && result.result) {
        setReportHtml(result.result);
      } else {
        if (!result.success) alert(result.message || '분석에 실패했습니다.');
      }
    } catch (error: any) {
      console.error('Analysis error:', error);
      if (error.code === 'ECONNABORTED') {
        alert('분석 시간이 길어지고 있습니다. 잠시 후 이메일로 결과가 전송됩니다.');
      } else {
        alert('분석 중 오류가 발생했습니다.');
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!analysisResult) {
      alert('분석 결과가 없습니다.');
      return;
    }

    try {
      const result = await checklistAPI.exportAnalysisPDF(analysisResult.analysis || analysisResult);
      if (result.success && result.pdfUrl) {
        window.open(result.pdfUrl, '_blank');
        alert('PDF가 생성되었습니다!');
      } else {
        alert(result.message || 'PDF 생성에 실패했습니다.');
      }
    } catch (error) {
      console.error('PDF 다운로드 실패:', error);
      alert('PDF 다운로드 중 오류가 발생했습니다.');
    }
  };

  const handleSendEmail = async () => {
    if (!analysisResult) {
      alert('분석 결과가 없습니다.');
      return;
    }

    try {
      const result = await checklistAPI.sendAnalysisEmail(analysisResult.analysis || analysisResult);
      if (result.success) {
        alert(result.message || '이메일이 전송되었습니다!');
      } else {
        alert(result.message || '이메일 전송에 실패했습니다.');
      }
    } catch (error) {
      console.error('이메일 전송 실패:', error);
      alert('이메일 전송 중 오류가 발생했습니다.');
    }
  };

  const getRiskColor = (grade: 'low' | 'medium' | 'high') => {
    switch (grade) {
      case 'low': return '#4CAF50';
      case 'medium': return '#FFC107';
      case 'high': return '#F44336';
      default: return '#999999';
    }
  };

  const getRiskLabel = (grade: 'low' | 'medium' | 'high') => {
    switch (grade) {
      case 'low': return '안전';
      case 'medium': return '주의';
      case 'high': return '위험';
      default: return '알 수 없음';
    }
  };

  const getRiskIcon = (grade: 'low' | 'medium' | 'high') => {
    switch (grade) {
      case 'low': return <Shield size={24} />;
      case 'medium': return <AlertTriangle size={24} />;
      case 'high': return <AlertTriangle size={24} />;
    }
  };

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
      {/* HTML 리포트 뷰어 */}
      {reportHtml ? (
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            width: '100%',
            maxWidth: '900px',
            height: '90vh',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
            position: 'relative'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* 리포트 헤더 */}
          <div style={{
            padding: '16px 24px',
            borderBottom: '1px solid #E8E8E8',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#fff',
            flexShrink: 0
          }}>
            <h2 style={{ fontSize: '18px', fontWeight: '700', margin: 0, color: '#2C2C2C' }}>
              📄 등기부등본 정밀 분석 리포트
            </h2>
            <button
              onClick={() => {
                setReportHtml(null);
                handleClose();
              }}
              style={{ border: 'none', background: 'none', cursor: 'pointer' }}
            >
              <X size={24} color="#666" />
            </button>
          </div>

          {/* HTML 내용 (Iframe) */}
          <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
            <iframe
              srcDoc={reportHtml}
              style={{
                width: '100%',
                height: '100%',
                border: 'none',
                backgroundColor: '#f9f9f9'
              }}
              title="Registry Analysis Report"
            />
          </div>

          {/* 하단 버튼 */}
          <div style={{
            padding: '16px 24px',
            borderTop: '1px solid #E8E8E8',
            backgroundColor: '#fff',
            display: 'flex',
            gap: '12px',
            flexShrink: 0
          }}>
            <button
              onClick={handleDownloadPDF}
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #8FBF4D',
                backgroundColor: '#FFFFFF',
                color: '#8FBF4D',
                fontSize: '15px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F5F9F0'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
            >
              <Download size={18} />
              PDF로 저장
            </button>
            <button
              onClick={handleSendEmail}
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: '#8FBF4D',
                color: '#FFFFFF',
                fontSize: '15px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#7AA83F'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#8FBF4D'}
            >
              <Mail size={18} />
              메일로 보내기
            </button>
          </div>
        </div>
      ) : (
        /* 파일 업로드 뷰 */
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            width: '100%',
            maxWidth: '700px',
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
            <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#2C2C2C', margin: 0 }}>
              등기부등본 정밀 분석
            </h2>
            <button onClick={handleClose} style={{ border: 'none', background: 'none', cursor: 'pointer' }}>
              <X size={20} color="#666" />
            </button>
          </div>

          {/* Content */}
          <div style={{ padding: '24px' }}>
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: `2px dashed ${isDragging ? '#8FBF4D' : '#E8E8E8'}`,
                borderRadius: '12px',
                padding: '40px 20px',
                textAlign: 'center',
                cursor: 'pointer',
                backgroundColor: isDragging ? '#F5F3E6' : '#FAFAFA',
                transition: 'all 0.2s',
                marginBottom: '20px',
              }}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileInputChange}
                style={{ display: 'none' }}
              />
              <Upload size={48} color={isDragging ? '#8FBF4D' : '#CCCCCC'} style={{ margin: '0 auto 16px' }} />
              <p style={{ fontSize: '16px', fontWeight: '600', color: '#2C2C2C', margin: '0 0 8px 0' }}>
                {file ? file.name : '파일을 여기에 드롭하거나 클릭하여 선택하세요'}
              </p>
              <p style={{ fontSize: '13px', color: '#999999', margin: 0 }}>
                PDF, JPG, PNG (최대 10MB)
              </p>
            </div>

            {/* Preview */}
            {previewUrl && (
              <div style={{ marginBottom: '20px', padding: '16px', backgroundColor: '#F8F8F8', borderRadius: '8px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#2C2C2C', marginBottom: '12px' }}>
                  파일 미리보기
                </h4>
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

            {/* Analyze Button */}
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !file}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: isAnalyzing || !file ? '#CCCCCC' : '#8FBF4D',
                color: '#FFFFFF',
                fontSize: '15px',
                fontWeight: '600',
                cursor: isAnalyzing ? 'not-allowed' : 'pointer',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              {isAnalyzing ? (
                <>
                  <div style={{ width: '16px', height: '16px', border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                  <span>정밀 분석 중... (최대 3분 소요)</span>
                </>
              ) : '분석 시작하기'}
            </button>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        </div>
      )}
    </div>
  );
}