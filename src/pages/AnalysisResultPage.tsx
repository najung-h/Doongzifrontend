import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

interface AnalysisResponse {
  file_key: string;
  output: string;
}

const AnalysisResultPage: React.FC = () => {
  const location = useLocation();
  const [htmlBody, setHtmlBody] = useState('');

  // Sample data reflecting the new structure provided by the user
  const sampleResponse: AnalysisResponse = {
    "file_key": "doongzi/1764165243742",
    "output": `
<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<style>
  @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');
  body { font-family: 'Pretendard', sans-serif; background-color: #f9f9f9; color: #333; padding: 40px; max-width: 800px; margin: 0 auto; }
  .header { text-align: center; margin-bottom: 40px; }
  .brand-logo { font-size: 24px; font-weight: bold; color: #2c3e50; }
  .brand-highlight { color: #8CB800; }
  .card { background: white; border-radius: 20px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); padding: 30px; margin-bottom: 25px; border: 1px solid #eee; }
  .title-section { text-align: center; border-bottom: 2px solid #f0f0f0; padding-bottom: 20px; margin-bottom: 20px; }
  .report-badge { background-color: #F44336; color: white; padding: 8px 16px; border-radius: 50px; font-size: 14px; font-weight: bold; display: inline-block; margin-bottom: 10px; }
  h1 { font-size: 28px; margin: 10px 0; }
  .summary-text { color: #555; font-size: 16px; line-height: 1.6; word-break: keep-all; }
  .risk-card { border-left: 5px solid #FF5252; background-color: #FFFDFD; }
  .risk-header { display: flex; align-items: center; margin-bottom: 10px; }
  .risk-icon { font-size: 20px; margin-right: 8px; }
  .risk-title { color: #D32F2F; font-weight: bold; font-size: 18px; }
  .risk-content-box { background: #fff; border: 1px solid #ffcdd2; border-radius: 8px; padding: 15px; margin-top: 10px; }
  .label { display: inline-block; font-size: 12px; font-weight: bold; color: #777; width: 50px; vertical-align: top; }
  .content-text { display: inline-block; font-size: 14px; color: #333; width: calc(100% - 60px); line-height: 1.5; margin-bottom: 8px; word-break: keep-all; }
  .solution-box { background-color: #E8F5E9; padding: 10px; border-radius: 6px; margin-top: 5px; color: #2E7D32; font-size: 14px; font-weight: bold; }
  .schedule-box { display: flex; justify-content: space-around; background: #F9FBE7; padding: 15px; border-radius: 12px; margin-top: 20px; text-align: center;}
  .date-item { width: 30%; }
  .date-label { display: block; font-size: 12px; color: #777; margin-bottom: 5px; }
  .date-value { display: block; font-size: 15px; font-weight: bold; color: #33691E; }
  .footer { text-align: center; font-size: 12px; color: #aaa; margin-top: 50px; line-height: 1.6; }
</style>
</head>
<body>
  <div class="header">
    <div class="brand-logo">🏠 둥지 <span class="brand-highlight">AI 리포트</span></div>
  </div>
  <div class="card">
    <div class="title-section">
      <span class="report-badge">위험 요소 발견!</span>
      <h1>임대차계약서 분석 결과</h1>
      <p class="summary-text">계약서 전반적으로 임차인에게 불리한 조항이 존재하며, 특히 수선의무와 관련된 조항이 임대인에게 유리하게 설정되어 있습니다. 또한, 계약 해지 조건과 위약금 조항이 임차인에게 불리하게 작용할 수 있는 요소가 포함되어 있습니다. 보증금 반환 지연 시 이자 지급 조항이 누락되어 있어 임차인의 권리가 충분히 보호되지 않고 있습니다.</p>
    </div>
    <div class="schedule-box">
      <div class="date-item">
        <span class="date-label">계약 체결일</span>
        <span class="date-value">2025-11-27</span>
      </div>
      <div class="date-item">
        <span class="date-label">입주 예정일</span>
        <span class="date-value">2025-11-30</span>
      </div>
      <div class="date-item">
        <span class="date-label">분석 일자</span>
        <span class="date-value">2025-11-27</span>
      </div>
    </div>
  </div>
  <h2 style="margin: 30px 0 15px 10px; color: #333;">⚠️ 발견된 위험 요소 (5건)</h2>
  <div class="card risk-card">
    <div class="risk-header">
       <span class="risk-title">Issue #1</span>
    </div>
    <div class="risk-content-box">
       <div>
         <span class="label">조항</span>
         <span class="content-text" style="color: #d32f2f;">"본 임대차 계약 기간 중 보일러, 배관, 전기시설 등 주요 설비의 노후 및 고장으로 인한 수리 비용은 원 인을 불문하고 전액 임차인이 부담하며, 임차인은 이에 대해 임대인에게 비용을 청구할 수 없다."</span>
       </div>
       <div style="margin-top:8px;">
         <span class="label">이유</span>
         <span class="content-text">임대인이 부담해야 할 주요 설비의 수리비용을 임차인에게 전가하고 있어, 임차인의 경제적 부담이 과도하게 증가합니다.</span>
       </div>
       <div class="solution-box">
         💡 해결방안: 주요 설비의 수리 비용은 임대인이 부담한다는 조항으로 수정 필요.
       </div>
    </div>
  </div>
</body>
</html>`
  };

  const result: AnalysisResponse = location.state?.result || sampleResponse;

  useEffect(() => {
    if (result.output) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(result.output, 'text/html');
      
      // Extract style and inject it into the head
      const styleElement = doc.querySelector('style');
      if (styleElement) {
        document.head.appendChild(styleElement);
      }

      // Extract body content
      const bodyContent = doc.body.innerHTML;
      setHtmlBody(bodyContent);
    }
  }, [result]);

  return (
    <div dangerouslySetInnerHTML={{ __html: htmlBody }} />
  );
};

export default AnalysisResultPage;
