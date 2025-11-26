import { useState, useRef } from 'react';
import { X, Upload, FileText, AlertTriangle, CheckCircle, Shield, Mail, Download } from 'lucide-react';
import { checklistAPI } from '../../api/checklist';
import type { ScanResponse } from '../../types';

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
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleClose = () => {
    setFile(null);
    setPreviewUrl(null);
    setAnalysisResult(null);
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
    try {
      const result = await checklistAPI.analyzeDocuments([file], '임대차계약서');
      setAnalysisResult(result);
    } catch (error) {
      console.error('Analysis error:', error);
      alert('분석 중 오류가 발생했습니다.');
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
      const result = await checklistAPI.exportAnalysisPDF(analysisResult.analysis);
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
      const result = await checklistAPI.sendAnalysisEmail(analysisResult.analysis);
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
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '800px',
          maxHeight: '90vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
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
            flexShrink: 0,
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
            계약서 분석
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
        <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
          
          {/* 1. 파일 업로드 영역 (결과가 없을 때만 표시) */}
          {!analysisResult && (
            <>
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

                <Upload
                  size={48}
                  color={isDragging ? '#8FBF4D' : '#CCCCCC'}
                  style={{ margin: '0 auto 16px' }}
                />

                <p
                  style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#2C2C2C',
                    margin: '0 0 8px 0',
                  }}
                >
                  {file ? file.name : '파일을 여기에 드롭하거나 클릭하여 선택하세요'}
                </p>

                <p
                  style={{
                    fontSize: '13px',
                    color: '#999999',
                    margin: 0,
                  }}
                >
                  PDF, JPG, PNG (최대 10MB)
                </p>
              </div>

              {/* File Preview (복구됨) */}
              {previewUrl && (
                <div
                  style={{
                    marginBottom: '20px',
                    padding: '16px',
                    backgroundColor: '#F8F8F8',
                    borderRadius: '8px',
                  }}
                >
                  <h4
                    style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#2C2C2C',
                      marginBottom: '12px',
                    }}
                  >
                    파일 미리보기
                  </h4>

                  {previewUrl === 'pdf' ? (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '16px',
                        backgroundColor: '#FFFFFF',
                        borderRadius: '8px',
                      }}
                    >
                      <FileText size={40} color="#F44336" />
                      <div>
                        <p
                          style={{
                            fontSize: '14px',
                            fontWeight: '600',
                            color: '#2C2C2C',
                            margin: '0 0 4px 0',
                          }}
                        >
                          {file?.name}
                        </p>
                        <p
                          style={{
                            fontSize: '12px',
                            color: '#999999',
                            margin: 0,
                          }}
                        >
                          {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : ''}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <img
                      src={previewUrl}
                      alt="미리보기"
                      style={{
                        width: '100%',
                        maxHeight: '300px',
                        objectFit: 'contain',
                        borderRadius: '8px',
                        backgroundColor: '#FFFFFF',
                      }}
                    />
                  )}
                </div>
              )}

              {/* Analyze Button */}
              {file && (
                <button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  style={{
                    width: '100%',
                    padding: '14px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: isAnalyzing ? '#CCCCCC' : '#8FBF4D',
                    color: '#FFFFFF',
                    fontSize: '15px',
                    fontWeight: '600',
                    cursor: isAnalyzing ? 'not-allowed' : 'pointer',
                    marginBottom: '20px',
                  }}
                >
                  {isAnalyzing ? '분석 중...' : '즉시 분석하기'}
                </button>
              )}
            </>
          )}

          {/* 2. 분석 결과 표시 */}
          {analysisResult && (
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              {analysisResult.output ? (
                <div style={{ flex: 1, minHeight: '500px', borderRadius: '12px', overflow: 'hidden', border: '1px solid #E8E8E8' }}>
                  <iframe
                    srcDoc={analysisResult.output}
                    style={{ width: '100%', height: '100%', border: 'none' }}
                    title="Contract Analysis Report"
                  />
                </div>
              ) : (
                /* output이 없으면 기존 UI */
                <div
                  style={{
                    padding: '24px',
                    borderRadius: '12px',
                    backgroundColor: '#F8F8F8',
                    border: `2px solid ${getRiskColor(analysisResult.analysis?.riskGrade || 'low')}`,
                    marginBottom: '20px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      marginBottom: '16px',
                    }}
                  >
                    <div
                      style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '50%',
                        backgroundColor: getRiskColor(analysisResult.analysis?.riskGrade || 'low'),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#FFFFFF',
                      }}
                    >
                      {getRiskIcon(analysisResult.analysis?.riskGrade || 'low')}
                    </div>
                    <div>
                      <h3
                        style={{
                          fontSize: '18px',
                          fontWeight: '700',
                          color: getRiskColor(analysisResult.analysis?.riskGrade || 'low'),
                          margin: '0 0 4px 0',
                        }}
                      >
                        {getRiskLabel(analysisResult.analysis?.riskGrade || 'low')}
                      </h3>
                      <p
                        style={{
                          fontSize: '14px',
                          color: '#666666',
                          margin: 0,
                        }}
                      >
                        계약서 분석 완료
                      </p>
                    </div>
                  </div>

                  <div
                    style={{
                      padding: '16px',
                      borderRadius: '8px',
                      backgroundColor: '#FFFFFF',
                      marginBottom: '16px',
                    }}
                  >
                    <h4
                      style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#2C2C2C',
                        marginBottom: '8px',
                      }}
                    >
                      요약
                    </h4>
                    <p
                      style={{
                        fontSize: '14px',
                        color: '#424242',
                        lineHeight: '1.6',
                        margin: 0,
                      }}
                    >
                      {analysisResult.analysis?.summary || '요약 정보를 불러오지 못했습니다.'}
                    </p>
                  </div>

                  {analysisResult.analysis?.issues?.length > 0 && (
                    <div>
                      <h4
                        style={{
                          fontSize: '14px',
                          fontWeight: '600',
                          color: '#2C2C2C',
                          marginBottom: '12px',
                        }}
                      >
                        주요 발견사항
                      </h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {analysisResult.analysis.issues.map((issue, index) => (
                          <div
                            key={index}
                            style={{
                              padding: '12px',
                              borderRadius: '8px',
                              backgroundColor: '#FFFFFF',
                              borderLeft: `3px solid ${
                                issue.severity === 'danger' ? '#F44336' : '#FFC107'
                              }`,
                            }}
                          >
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: '8px',
                              }}
                            >
                              {issue.severity === 'danger' ? (
                                <AlertTriangle size={16} color="#F44336" style={{ marginTop: '2px', flexShrink: 0 }} />
                              ) : (
                                <CheckCircle size={16} color="#FFC107" style={{ marginTop: '2px', flexShrink: 0 }} />
                              )}
                              <div style={{ flex: 1 }}>
                                <p
                                  style={{
                                    fontSize: '13px',
                                    fontWeight: '600',
                                    color: '#2C2C2C',
                                    margin: '0 0 4px 0',
                                  }}
                                >
                                  {issue.title}
                                </p>
                                <p
                                  style={{
                                    fontSize: '12px',
                                    color: '#666666',
                                    lineHeight: '1.5',
                                    margin: 0,
                                  }}
                                >
                                  {issue.description}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons (주석 해제됨) */}
              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button
                  onClick={handleDownloadPDF}
                  style={{
                    flex: 1,
                    padding: '14px',
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
                  }}
                >
                  <Download size={18} />
                  분석결과 PDF로 다운받기
                </button>
                <button
                  onClick={handleSendEmail}
                  style={{
                    flex: 1,
                    padding: '14px',
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
                  }}
                >
                  <Mail size={18} />
                  분석결과 이메일로 전송하기
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}