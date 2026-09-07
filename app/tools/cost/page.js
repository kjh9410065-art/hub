"use client";

import Link from "next/link";
import { useState } from "react";

// 자주 쓰는 모델의 예시 계산값입니다.
// 가격은 변동될 수 있으므로 선택 후 직접 최신 공식 가격으로 수정할 수 있게 했습니다.
const PRESETS = {
  custom: { label: "직접 입력", input: 0.3, output: 2.5 },
  budget: { label: "저비용 예시", input: 0.1, output: 0.4 },
  standard: { label: "일반형 예시", input: 0.3, output: 2.5 },
  premium: { label: "고성능 예시", input: 2.5, output: 10 },
};

export default function CostPage() {
  const [requests, setRequests] = useState(10000);
  const [inputTokens, setInputTokens] = useState(1000);
  const [outputTokens, setOutputTokens] = useState(500);
  const [inputPrice, setInputPrice] = useState(0.3);
  const [outputPrice, setOutputPrice] = useState(2.5);
  const [preset, setPreset] = useState("standard");
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);

  // 프리셋을 고르면 입력·출력 토큰 가격만 자동으로 채웁니다.
  function applyPreset(key) {
    setPreset(key);
    const selected = PRESETS[key];
    setInputPrice(selected.input);
    setOutputPrice(selected.output);
    setResult(null);
  }

  // 월간 요청량과 토큰 사용량을 기준으로 예상 비용을 계산합니다.
  function calculate() {
    const inputCost = (Number(requests) * Number(inputTokens) / 1_000_000) * Number(inputPrice);
    const outputCost = (Number(requests) * Number(outputTokens) / 1_000_000) * Number(outputPrice);
    setResult(inputCost + outputCost);
  }

  // 계산 결과를 클립보드에 복사해 다른 곳에 바로 붙여넣을 수 있게 합니다.
  async function copyResult() {
    if (result === null) return;
    const text = `HUB AI API 예상 월 비용: $${result.toFixed(2)}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <main className="page guideArticle">
      <header className="header">
        <Link className="logo" href="/">HUB</Link>
        <nav><Link href="/tools">도구</Link><Link href="/guides">가이드</Link><Link href="/compare">비교하기</Link></nav>
      </header>

      <article>
        <div className="eyebrow">AI COST CALCULATOR</div>
        <h1>AI API 비용,<br /><span>사용량부터 계산하세요.</span></h1>
        <p className="lead">월간 요청량과 토큰 사용량을 입력하면 예상 API 비용을 바로 계산합니다.</p>

        <div className="callout">
          <b>이 계산기는 이렇게 계산합니다</b>
          <p>월간 요청 수 × 요청당 입력 토큰 × 입력 단가 + 월간 요청 수 × 요청당 출력 토큰 × 출력 단가입니다.</p>
        </div>

        <div className="calculatorCard">
          <div className="calcField calcWide">
            <label>가격 프리셋</label>
            <select value={preset} onChange={(e) => applyPreset(e.target.value)}>
              {Object.entries(PRESETS).map(([key, value]) => <option key={key} value={key}>{value.label}</option>)}
            </select>
            <small>프리셋은 계산 편의를 위한 예시입니다. 실제 사용 모델의 최신 공식 가격을 확인하세요.</small>
          </div>

          <div className="calcField"><label>월간 요청 수</label><input type="number" min="0" value={requests} onChange={(e) => setRequests(e.target.value)} /></div>
          <div className="calcField"><label>요청당 입력 토큰</label><input type="number" min="0" value={inputTokens} onChange={(e) => setInputTokens(e.target.value)} /></div>
          <div className="calcField"><label>요청당 출력 토큰</label><input type="number" min="0" value={outputTokens} onChange={(e) => setOutputTokens(e.target.value)} /></div>
          <div className="calcField"><label>입력 토큰 $ / 1M</label><input type="number" min="0" step="0.01" value={inputPrice} onChange={(e) => { setPreset("custom"); setInputPrice(e.target.value); }} /></div>
          <div className="calcField"><label>출력 토큰 $ / 1M</label><input type="number" min="0" step="0.01" value={outputPrice} onChange={(e) => { setPreset("custom"); setOutputPrice(e.target.value); }} /></div>

          <button className="primaryCalc" type="button" onClick={calculate}>비용 계산하기</button>

          <div className="calcResult">
            <span>예상 월 비용</span>
            <strong>{result === null ? "$0.00" : `$${result.toFixed(2)}`}</strong>
            {result !== null && <button type="button" onClick={copyResult}>{copied ? "복사됨 ✓" : "결과 복사"}</button>}
          </div>
        </div>

        <div className="sourceBox">
          <b>공식 가격 확인</b>
          <p>API 가격은 수시로 바뀔 수 있으므로 결제 전에는 반드시 제공사의 공식 가격표를 확인하세요.</p>
          <div className="sourceLinks">
            <a href="https://openai.com/api/pricing/" target="_blank" rel="noreferrer">OpenAI 가격 ↗</a>
            <a href="https://ai.google.dev/gemini-api/docs/pricing" target="_blank" rel="noreferrer">Google Gemini 가격 ↗</a>
            <a href="https://www.anthropic.com/pricing#api" target="_blank" rel="noreferrer">Anthropic 가격 ↗</a>
            <a href="https://console.groq.com/docs/models" target="_blank" rel="noreferrer">Groq 모델 ↗</a>
          </div>
        </div>

        <p className="calcNote">※ 실제 청구액은 캐시, 배치 처리, 검색·이미지·음성 등 추가 기능과 각 제공사의 과금 정책에 따라 달라질 수 있습니다.</p>
        <Link className="primaryLink" href="/tools">다른 무료 도구 보기 →</Link>
      </article>
    </main>
  );
}
