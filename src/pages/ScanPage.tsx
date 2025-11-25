import { useState } from 'react';
import { Header } from '../components/common/Header';
import { Upload, FileText, AlertCircle } from 'lucide-react';
import { scanAPI } from '../api/scan';

export default function ScanPage() {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    setUploadedFiles(prev => [...prev, ...files]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setUploadedFiles(prev => [...prev, ...files]);
    }
  };

  const handleAnalyze = async () => {
    if (uploadedFiles.length === 0) return;
    
    setIsAnalyzing(true);
    
    try {
      const result = await scanAPI.analyzeDocuments(uploadedFiles);

      if (result.success) {
        alert(`분석 완료!\n등급: ${result.analysis.riskGrade}`);
      }
    } catch (error) {
      console.error('문서 분석 실패:', error);
      alert('문서 분석 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--color-bg-primary)'
    }}>
      <Header title="메인으로" showBack showLogin />

      {/* Page Header */}
      <div style={{
        padding: 'var(--spacing-lg)',
        textAlign: 'center',
        backgroundColor: 'var(--color-bg-white)',
        borderBottom: '1px solid var(--color-border)'
      }}>
        <div style={{ fontSize: '48px', marginBottom: 'var(--spacing-sm)' }}>
          🔍
        </div>
        <h2 style={{ marginBottom: 'var(--spacing-sm)' }}>둥지 스캔하기</h2>
        <p style={{ 
          fontSize: '14px', 
          color: 'var(--color-text-secondary)' 
        }}>
          등기부등본, 임대차계약서, 토지대장을 분석해드려요
        </p>
      </div>

      <div style={{
        padding: 'var(--spacing-lg)',
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        {/* Upload Area */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          style={{
            border: `2px dashed ${isDragging ? 'var(--color-accent-green)' : 'var(--color-border)'}`,
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--spacing-2xl)',
            textAlign: 'center',
            backgroundColor: isDragging 
              ? 'var(--color-accent-green-light)' 
              : 'var(--color-bg-white)',
            transition: 'all 0.2s ease',
            marginBottom: 'var(--spacing-lg)'
          }}
        >
          <Upload 
            size={48} 
            color={isDragging ? 'var(--color-accent-green)' : 'var(--color-text-light)'}
            style={{ margin: '0 auto var(--spacing-md)' }}
          />
          <h3 style={{ marginBottom: 'var(--spacing-sm)' }}>
            파일을 드래그하거나 선택해주세요
          </h3>
          <p style={{ 
            fontSize: '14px', 
            color: 'var(--color-text-secondary)',
            marginBottom: 'var(--spacing-md)'
          }}>
            PDF, JPG, PNG 파일 (최대 10MB)
          </p>
          <input
            type="file"
            multiple
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
            id="file-upload"
          />
          <label htmlFor="file-upload">
            <button
              onClick={() => document.getElementById('file-upload')?.click()}
              style={{
                padding: '12px 24px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-accent-green)',
                backgroundColor: 'var(--color-accent-green)',
                color: 'white',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              파일 선택
            </button>
          </label>
        </div>

        {/* Info Box */}
        <div style={{
          backgroundColor: 'var(--color-info)' + '20',
          border: '1px solid var(--color-info)',
          borderRadius: 'var(--radius-md)',
          padding: 'var(--spacing-md)',
          marginBottom: 'var(--spacing-lg)',
          display: 'flex',
          gap: 'var(--spacing-sm)'
        }}>
          <AlertCircle size={20} color="var(--color-info)" style={{ flexShrink: 0 }} />
          <div>
            <p style={{ fontSize: '13px', lineHeight: '1.6' }}>
              <strong>분석 가능한 서류:</strong> 등기부등본, 임대차계약서, 토지대장
            </p>
            <p style={{ fontSize: '13px', lineHeight: '1.6', marginTop: 'var(--spacing-xs)' }}>
              여러 파일을 한 번에 업로드하면 종합 분석을 받을 수 있습니다.
            </p>
          </div>
        </div>

        {/* Uploaded Files */}
        {uploadedFiles.length > 0 && (
          <div style={{
            backgroundColor: 'var(--color-bg-white)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--spacing-md)',
            marginBottom: 'var(--spacing-lg)'
          }}>
            <h3 style={{ marginBottom: 'var(--spacing-md)' }}>
              업로드된 파일 ({uploadedFiles.length})
            </h3>
            {uploadedFiles.map((file, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--spacing-sm)',
                  padding: 'var(--spacing-sm)',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--color-bg-secondary)',
                  marginBottom: 'var(--spacing-sm)'
                }}
              >
                <FileText size={20} color="var(--color-accent-green)" />
                <span style={{ flex: 1, fontSize: '14px' }}>{file.name}</span>
                <button
                  onClick={() => {
                    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
                  }}
                  style={{
                    padding: '4px 8px',
                    borderRadius: 'var(--radius-sm)',
                    border: 'none',
                    backgroundColor: 'var(--color-warning)' + '20',
                    color: 'var(--color-warning)',
                    fontSize: '12px',
                    cursor: 'pointer'
                  }}
                >
                  삭제
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Analyze Button */}
        {uploadedFiles.length > 0 && (
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            style={{
              width: '100%',
              padding: '16px',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              backgroundColor: isAnalyzing 
                ? 'var(--color-text-light)' 
                : 'var(--color-accent-green)',
              color: 'white',
              fontWeight: '600',
              fontSize: '16px',
              cursor: isAnalyzing ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            {isAnalyzing ? '분석 중...' : '🔍 둥지 스캔 시작하기'}
          </button>
        )}

        {/* Sample Analysis Result (placeholder) */}
        {isAnalyzing && (
          <div style={{
            marginTop: 'var(--spacing-lg)',
            backgroundColor: 'var(--color-bg-white)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--spacing-lg)',
            textAlign: 'center'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              margin: '0 auto var(--spacing-md)',
              border: '4px solid var(--color-accent-green)',
              borderTopColor: 'transparent',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }} />
            <p style={{ color: 'var(--color-text-secondary)' }}>
              서류를 분석하고 있습니다...
            </p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}