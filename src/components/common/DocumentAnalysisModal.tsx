import { useState, useRef } from 'react';
import { X, Upload, FileText, Download, Mail, AlertTriangle, Shield, CheckCircle } from 'lucide-react';
import { checklistAPI } from '../../api/checklist';
import type { ScanResponse } from '../../types';

interface DocumentAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  docType: '임대차계약서' | '등기부등본' | '건축물대장';
}

export default function DocumentAnalysisModal({ isOpen, onClose, docType }: DocumentAnalysisModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<ScanResponse | null>(null);
  const [reportHtml, setReportHtml] = useState<string | null>(null);
  const [fileKey, setFileKey] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // [수정] 컬러 팔레트 정의
  const COLORS = {
    bgMain: '#F2E5D5',
    bgCard: '#FFFFFF',
    bgSub: '#F9F7F5',       // 연한 배경
    primary: '#A68263',     // 브랜드 메인 (갈색)
    primaryDark: '#8C6F5D', // 버튼 호버
    textMain: '#402211',    // 메인 텍스트
    textSub: '#857162',     // 보조 텍스트
    textLight: '#999999',
    border: '#E6D8CC',      // 테두리
    accent: '#8C0707',      // 강조/경고 (필요 시)
    riskHigh: '#F44336',
    riskMedium: '#FFC107',
    riskLow: '#4CAF50'
  };

  if (!isOpen) return null;

  const handleClose = () => {
    setFile(null);
    setPreviewUrl(null);
    setAnalysisResult(null);
    setReportHtml(null);
    setFileKey(null);
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
    setFileKey(null);

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
    setFileKey(null);

    try {
      const result = await checklistAPI.analyzeDocuments([file], docType);
      setAnalysisResult(result);

      if (result.success) {
        if (result.result) {
          setReportHtml(result.result);
        }
        if (result.fileKey) {
          setFileKey(result.fileKey);
        }
      } else {
        alert(result.message || '분석에 실패했습니다.');
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
      const result = await checklistAPI.exportAnalysisPDF(
        analysisResult.analysis || analysisResult,
        fileKey || undefined
      );

      if (result.success && result.downloadUrl) {
        window.open(result.downloadUrl, '_blank');
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
      const result = await checklistAPI.sendAnalysisEmail(
        analysisResult.analysis || analysisResult,
        fileKey || undefined
      );
      
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
      case 'low': return COLORS.riskLow;
      case 'medium': return COLORS.riskMedium;
      case 'high': return COLORS.riskHigh;
      default: return COLORS.textLight;
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

  const getDocumentTitle = () => {
    switch (docType) {
      case '임대차계약서': return '계약서';
      case '등기부등본': return '등기부등본';
      case '건축물대장': return '건축물대장';
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
      {reportHtml ? (
        <div
          style={{
            backgroundColor: COLORS.bgCard, // [수정]
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
            borderBottom: `1px solid ${COLORS.border}`, // [수정]
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: COLORS.bgCard, // [수정]
            flexShrink: 0
          }}>
            <h2 style={{ fontSize: '18px', fontWeight: '700', margin: 0, color: COLORS.textMain }}>
              📄 {getDocumentTitle()} 정밀 분석 리포트
            </h2>
            <button
              onClick={() => {
                setReportHtml(null);
                handleClose();
              }}
              style={{ border: 'none', background: 'none', cursor: 'pointer' }}
            >
              <X size={24} color={COLORS.textSub} />
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
              title="Analysis Report"
            />
          </div>

          {/* 리포트 하단 액션 버튼 영역 */}
          <div style={{
            padding: '16px 24px',
            borderTop: `1px solid ${COLORS.border}`,
            backgroundColor: COLORS.bgCard,
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
                border: `1px solid ${COLORS.primary}`, // [수정] 테두리
                backgroundColor: COLORS.bgCard,
                color: COLORS.primary, // [수정] 텍스트
                fontSize: '15px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = COLORS.bgSub}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = COLORS.bgCard}
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
                backgroundColor: COLORS.primary, // [수정] 메인 버튼
                color: 'white',
                fontSize: '15px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = COLORS.primaryDark}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = COLORS.primary}
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
            backgroundColor: COLORS.bgCard, // [수정]
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
              borderBottom: `1px solid ${COLORS.border}`, // [수정]
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <h2
              style={{
                fontSize: '20px',
                fontWeight: '700',
                color: COLORS.textMain, // [수정]
                margin: 0,
              }}
            >
              {getDocumentTitle()} 정밀 분석
            </h2>
            <button
              onClick={handleClose}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                border: 'none',
                backgroundColor: COLORS.bgSub, // [수정]
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: COLORS.textSub, // [수정]
              }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div style={{ padding: '24px' }}>
            {/* File Upload Area */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: `2px dashed ${isDragging ? COLORS.primary : COLORS.border}`, // [수정]
                borderRadius: '12px',
                padding: '40px 20px',
                textAlign: 'center',
                cursor: 'pointer',
                backgroundColor: isDragging ? COLORS.bgSub : '#FAFAFA', // [수정]
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
                color={isDragging ? COLORS.primary : '#CCCCCC'} // [수정]
                style={{ margin: '0 auto 16px' }}
              />

              <p
                style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: COLORS.textMain, // [수정]
                  margin: '0 0 8px 0',
                }}
              >
                {file ? file.name : '파일을 여기에 드롭하거나 클릭하여 선택하세요'}
              </p>

              <p
                style={{
                  fontSize: '13px',
                  color: COLORS.textSub, // [수정]
                  margin: 0,
                }}
              >
                PDF, JPG, PNG (최대 10MB)
              </p>
            </div>

            {/* File Preview */}
            {previewUrl && (
              <div
                style={{
                  marginBottom: '20px',
                  padding: '16px',
                  backgroundColor: COLORS.bgSub, // [수정]
                  borderRadius: '8px',
                }}
              >
                <h4
                  style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: COLORS.textMain, // [수정]
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
                      backgroundColor: COLORS.bgCard, // [수정]
                      borderRadius: '8px',
                    }}
                  >
                    <FileText size={40} color={COLORS.riskHigh} />
                    <div>
                      <p
                        style={{
                          fontSize: '14px',
                          fontWeight: '600',
                          color: COLORS.textMain, // [수정]
                          margin: '0 0 4px 0',
                        }}
                      >
                        {file?.name}
                      </p>
                      <p
                        style={{
                          fontSize: '12px',
                          color: COLORS.textSub, // [수정]
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
                      backgroundColor: COLORS.bgCard, // [수정]
                    }}
                  />
                )}
              </div>
            )}

            {/* Analyze Button */}
            {file && !analysisResult && (
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: isAnalyzing ? '#CCCCCC' : COLORS.primary, // [수정]
                  color: '#FFFFFF',
                  fontSize: '15px',
                  fontWeight: '600',
                  cursor: isAnalyzing ? 'not-allowed' : 'pointer',
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                {isAnalyzing ? (
                  <>
                    <div style={{
                      width: '16px',
                      height: '16px',
                      border: '2px solid #FFFFFF',
                      borderTopColor: 'transparent',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }} />
                    <span>정밀 분석 중... (최대 3분 소요)</span>
                  </>
                ) : '분석 시작하기'}
              </button>
            )}

            {/* Analysis Result (기존 JSON 기반 결과 뷰 - Fallback용) */}
            {analysisResult && !reportHtml && (
              <div
                style={{
                  padding: '24px',
                  borderRadius: '12px',
                  backgroundColor: COLORS.bgSub, // [수정]
                  border: `2px solid ${getRiskColor(analysisResult.analysis.riskGrade)}`,
                  marginBottom: '20px',
                }}
              >
                {/* Risk Badge */}
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
                      backgroundColor: getRiskColor(analysisResult.analysis.riskGrade),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#FFFFFF',
                    }}
                  >
                    {getRiskIcon(analysisResult.analysis.riskGrade)}
                  </div>
                  <div>
                    <h3
                      style={{
                        fontSize: '18px',
                        fontWeight: '700',
                        color: getRiskColor(analysisResult.analysis.riskGrade),
                        margin: '0 0 4px 0',
                      }}
                    >
                      {getRiskLabel(analysisResult.analysis.riskGrade)}
                    </h3>
                    <p
                      style={{
                        fontSize: '14px',
                        color: COLORS.textSub, // [수정]
                        margin: 0,
                      }}
                    >
                      {getDocumentTitle()} 분석 완료
                    </p>
                  </div>
                </div>

                {/* Summary */}
                <div
                  style={{
                    padding: '16px',
                    borderRadius: '8px',
                    backgroundColor: COLORS.bgCard, // [수정]
                    marginBottom: '16px',
                  }}
                >
                  <h4
                    style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      color: COLORS.textMain, // [수정]
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
                    {analysisResult.analysis.summary}
                  </p>
                </div>

                {/* Issues */}
                {analysisResult.analysis.issues.length > 0 && (
                  <div>
                    <h4
                      style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: COLORS.textMain, // [수정]
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
                            backgroundColor: COLORS.bgCard, // [수정]
                            borderLeft: `3px solid ${
                              issue.severity === 'danger' ? COLORS.riskHigh : COLORS.riskMedium
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
                              <AlertTriangle size={16} color={COLORS.riskHigh} style={{ marginTop: '2px', flexShrink: 0 }} />
                            ) : (
                              <CheckCircle size={16} color={COLORS.riskMedium} style={{ marginTop: '2px', flexShrink: 0 }} />
                            )}
                            <div style={{ flex: 1 }}>
                              <p
                                style={{
                                  fontSize: '13px',
                                  fontWeight: '600',
                                  color: COLORS.textMain, // [수정]
                                  margin: '0 0 4px 0',
                                }}
                              >
                                {issue.title}
                              </p>
                              <p
                                style={{
                                  fontSize: '12px',
                                  color: COLORS.textSub, // [수정]
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
          </div>

          <style>{`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      )}
    </div>
  );
}