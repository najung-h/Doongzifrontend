import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';

interface AnalysisResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  htmlContent: string;
}

const AnalysisResultModal: React.FC<AnalysisResultModalProps> = ({ isOpen, onClose, htmlContent }) => {
  const [htmlBody, setHtmlBody] = useState('');

  useEffect(() => {
    if (htmlContent) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlContent, 'text/html');
      
      const styleElement = doc.querySelector('style');
      if (styleElement) {
        // To avoid polluting global scope or head, we can try to scope styles later if needed.
        // For now, let's just append it.
        const existingStyle = document.getElementById('analysis-style');
        if (!existingStyle) {
            styleElement.id = 'analysis-style';
            document.head.appendChild(styleElement);
        }
      }

      const bodyContent = doc.body.innerHTML;
      setHtmlBody(bodyContent);
    }

    return () => {
        const styleElement = document.getElementById('analysis-style');
        if (styleElement) {
            styleElement.remove();
        }
    }
  }, [htmlContent]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex',
        alignItems: 'center', justifyContent: 'center', zIndex: 1050, padding: '20px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#FFFFFF', borderRadius: '16px', width: '100%', maxWidth: '800px',
          height: '90vh', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
          display: 'flex', flexDirection: 'column'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ padding: '24px', borderBottom: '1px solid #E8E8E8', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#2C2C2C', margin: 0 }}>계약서 분석 리포트</h2>
          <button onClick={onClose} style={{ width: '32px', height: '32px', borderRadius: '50%', border: 'none', backgroundColor: '#F0F0F0', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#666666' }}>
            <X size={20} />
          </button>
        </div>
        <div 
          style={{ overflowY: 'auto', padding: '20px' }} 
          dangerouslySetInnerHTML={{ __html: htmlBody }} 
        />
      </div>
    </div>
  );
};

export default AnalysisResultModal;
