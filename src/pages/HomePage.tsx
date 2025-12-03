import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Upload, ChevronRight, MessageCircle } from 'lucide-react';
import Navigation from '../components/common/Navigation';
import NestScanModal from '../components/common/NestScanModal';

export default function HomePage() {
  const navigate = useNavigate();
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // 파일 업로드 핸들러
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  // 공통 글래스모피즘 스타일
  const glassStyle = {
    // background: 'rgba(255, 255, 255, 0.9)', // 배경색이 진해져서 투명도 약간 조정
    background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.95) 0%, rgba(245, 240, 235, 0.5) 100%)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    border: '1px solid rgba(255, 255, 255, 0.9)',
    boxShadow: '0 8px 32px 0 rgba(166, 130, 99, 0.35)', // #A68263 계열 그림자
    borderRadius: '24px',
  };

  // 컬러 상수 (재사용을 위해 정의)
  const COLORS = {
    bg: '#F2E5D5',
    textMain: '#402211',
    textSub: '#A68263',
    brand: '#a68263ff',
    brandLight: 'rgba(166, 130, 99, 0.1)',
    danger: '#8C0707',
    white: '#FFFFFF',
    border: '#E6D8CC'
  };

  return (
    <div style={{ minHeight: '100vh', paddingBottom: '80px', backgroundColor: COLORS.bg }}>
      <Navigation />

      {/* Hero Section */}
      <div style={{ textAlign: 'center', padding: '60px 20px 50px' }}>
        <div style={{ 
          display: 'inline-block', 
          padding: '8px 16px', 
          borderRadius: '30px', 
          background: 'rgba(166, 130, 99, 0.1)', // Brand color opacity
          color: COLORS.brand, 
          fontSize: '14px', 
          fontWeight: '600',
          marginBottom: '16px' 
        }}>
          🏠 사회초년생을 위한 안심 계약 가이드
        </div>
        <h1 style={{ 
          fontSize: '42px', 
          fontWeight: '800', 
          color: COLORS.textMain, 
          marginBottom: '12px', 
          letterSpacing: '-0.5px' 
        }}>
          안전한 둥지를 찾아드릴게요
        </h1>
        <p style={{ fontSize: '17px', color: COLORS.textSub, fontWeight: 500 }}>
          서류 스캔 한 번으로 위험 진단부터 체크리스트 관리까지!
        </p>
      </div>

      {/* Bento Grid Layout (3 Columns) */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 24px',
        display: 'grid',
        gridTemplateColumns: '1fr 1.4fr 1fr', // 좌:중:우 비율 조정
        gap: '24px',
        alignItems: 'stretch'
      }}>
        
        {/* 1. [좌측] 둥지 스캔하기 (Action) */}
        <label 
          style={{
            ...glassStyle,
            padding: '40px 24px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            transition: 'transform 0.2s, border-color 0.2s',
            position: 'relative',
            overflow: 'hidden'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.borderColor = COLORS.brand;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.9)';
          }}
        >
          <div style={{ 
            background: COLORS.brand, color: 'white', padding: '6px 12px', borderRadius: '20px', alignSelf: 'center',
            fontSize: '12px', fontWeight: '500', textAlign: 'center', marginBottom: '24px', width: '100px' 
          }}>
            STEP 1
          </div>

          <input type="file" onChange={handleFileSelect} accept=".pdf,.jpg,.png" hidden />

          <div style={{ marginBottom: '24px', position: 'relative' }}>
            {/* 둥지 이미지 */}
            <div style={{ 
              width: '120px', height: '120px', 
              background: '#F9F7F5', // 아주 연한 회색/베이지
              borderRadius: '50%', 
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: 'inset 0 4px 8px rgba(0,0,0,0.05)'
            }} >
              <img src="/scan.png" alt="스캔" style={{ width: '120px' }} />
            </div>
            <div style={{
              position: 'absolute', bottom: 0, right: 0,
              background: COLORS.brand, 
              borderRadius: '50%', padding: '8px',
              border: '3px solid white',
              boxShadow: '0 4px 8px rgba(0,0,0,0.15)'
            }}>
              <Upload size={20} color="white" />
            </div>
          </div>

          <h3 style={{ fontSize: '22px', fontWeight: '800', color: COLORS.textMain, marginBottom: '8px' }}>
            둥지 스캔하기
          </h3>
          <p style={{ fontSize: '13px', color: COLORS.textSub, lineHeight: '1.6', marginBottom: '24px' }}>
            계약서나 등기부등본을 올리면<br/>
            <strong>AI가 위험요소를 분석</strong>하고<br/>
            체크리스트를 자동으로 채워줘요!
          </p>

          <div style={{
            padding: '12px 24px',
            background: 'linear-gradient(0deg, rgba(166, 130, 99, 1) 25%, rgba(166, 130, 99, 0.65) 90%)',
            border: `1px solid ${COLORS.brand}`,
            color: 'white',
            borderRadius: '12px',
            fontSize: '15px',
            fontWeight: '600',
            width: '100%',
            maxWidth: '200px',
            boxShadow: `0 4px 12px rgba(166, 130, 99, 0.4)`
          }}>
            파일 업로드
          </div>
          
        </label>


        {/* 2. [중앙] 둥지 계약 체크리스트 (Status Hub) */}
        <div 
          onClick={() => navigate('/checklist')}
          style={{
            ...glassStyle,
            padding: '40px 56px',
            display: 'flex',
            flexDirection: 'column',
            cursor: 'pointer',
            justifyContent: 'space-between',
            transition: 'transform 0.2s',
            background: 'linear-gradient(0deg, rgba(255, 255, 255) 0%, rgba(245, 240, 235) 100%)'
          }}

          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.borderColor = COLORS.danger;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.9)';
          }}
        >
          <div style={{ 
            background: COLORS.brand, color: 'white', padding: '6px 12px', borderRadius: '20px', alignSelf: 'center',
            fontSize: '12px', fontWeight: '500', textAlign: 'center', marginBottom: '24px', width: '100px' 
          }}>
            STEP 2
          </div>


          {/* Circular Progress Graph & Status */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
            
            {/* CSS-only Circular Progress */}
            <div style={{ 
              position: 'relative', width: '160px', height: '160px',
              borderRadius: '50%',
              background: `conic-gradient(${COLORS.danger} 35%, #EBE5DD 0)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 20px rgba(166, 130, 99, 0.15)'
            }}>
              <div style={{ 
                width: '120px', height: '120px', background: '#F9F7F5', borderRadius: '50%',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                boxShadow: 'inset 0 4px 8px rgba(0,0,0,0.05)'
              }}>
                <span style={{ fontSize: '13px', color: COLORS.textSub, fontWeight: '600' }}>둥지 마련까지</span>
                <span style={{ fontSize: '32px', fontWeight: '800', color: COLORS.textMain }}>35%</span>
              </div>
            </div>

            <div style={{ marginTop: '24px', textAlign: 'center' }}>
              <p style={{ fontSize: '16px', fontWeight: '700', color: COLORS.textMain, marginBottom: '4px' }}>
                계약 전 확인 단계
              </p>
              <p style={{ fontSize: '13px', color: COLORS.textSub }}>
                필수 항목 <strong>4개</strong>가 남아있어요!
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <h3 style={{ fontSize: '22px', fontWeight: '800', color: COLORS.textMain }}>둥지 계약 체크리스트</h3>
            <div style={{ 
              background: 'rgba(166, 130, 99, 0.1)', padding: '6px 14px', borderRadius: '20px', 
              fontSize: '16px', fontWeight: '600', color: COLORS.danger, display: 'flex', alignItems: 'center', gap: '4px'
            }}>
              전체 보기 <ChevronRight size={14} />
            </div>
          </div>
        </div>


        {/* 3. [우측] 어미새 챗봇 (Support) */}
        <div 
          onClick={() => navigate('/chatbot')}
          style={{
            ...glassStyle,
            padding: '40px 24px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            transition: 'transform 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.borderColor = COLORS.brand;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.9)';
          }}
        >
          <div style={{ 
            background: COLORS.brand, color: 'white', padding: '6px 12px', borderRadius: '20px', 
            fontSize: '12px', fontWeight: '500', marginBottom: '24px' 
          }}>
            무엇이든 물어보세요
          </div>

          <div style={{ marginBottom: '16px', position: 'relative' }}>
            <img src="/baby.png" alt="챗봇" style={{ width: '90px', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))' }} />
            <div style={{
              position: 'absolute', top: -10, right: -10,
              background: '#FFFFFF', padding: '8px 12px', borderRadius: '12px',
              fontSize: '20px', boxShadow: '0 4px 10px rgba(0,0,0,0.08)',
              fontWeight: 'bold', color: COLORS.brand
            }}>
              ?
            </div>
          </div>

          <h3 style={{ fontSize: '22px', fontWeight: '800', color: COLORS.textMain, marginBottom: '8px' }}>
            어미새 챗봇
          </h3>
          <p style={{ fontSize: '13px', color: COLORS.textSub, lineHeight: '1.5', marginBottom: '24px' }}>
            "특약사항이 뭔가요?"<br/>
            "확정일자는 언제 받나요?"<br/>
            <br/>
            어려운 용어와 절차,<br/>
            친절하게 알려드릴게요!
          </p>

          <div style={{
            width: '100%',
            maxWidth: '200px',
            padding: '12px',
            border: `1px solid ${COLORS.brand}`,
            color: COLORS.brand,
            borderRadius: '12px',
            fontSize: '14px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            backgroundColor: 'rgba(255,255,255,0.5)'
          }}>
            <MessageCircle size={18} />
            대화 시작하기
          </div>
        </div>
      </div>

      {/* 둥지 스캔 모달 */}
      {selectedFile && (
        <NestScanModal
          isOpen={!!selectedFile}
          file={selectedFile}
          onClose={() => setSelectedFile(null)}
        />
      )}
    </div>
  );
}