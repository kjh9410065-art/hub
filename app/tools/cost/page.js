// AI API 비용 계산기: 브라우저에서 입력값을 즉시 계산합니다.
"use client";

import Link from "next/link";
import { useState } from "react";

export default function CostPage() {
  // 계산기에 사용할 기본값입니다.
  const [requests, setRequests] = useState(10000);
  const [inputTokens, setInputTokens] = useState(1000);
  const [outputTokens, setOutputTokens] = useState(500);
  const [inputPrice, setInputPrice] = useState(0.3);
  const [outputPrice, setOutputPrice] = useState(2.5);
  const [result, setResult] = useState(null);

  // 월간 요청량 × 요청당 토큰량을 백만 토큰 단위로 바꿔 예상 비용을 계산합니다.
  function calculate() {
    const inputCost = (Number(requests) * Number(inputTokens) / 1_000_000) * Number(inputPrice);
    const outputCost = (Number(requests) * Number(outputTokens) / 1_000_000) * Number(outputPrice);
    setResult(inputCost + outputCost);
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
          <b>계산 방법</b>
          <p>입력 토큰 비용 + 출력 토큰 비용을 합산합니다. 실제 청구액은 선택한 모델의 최신 가격과 추가 기능에 따라 달라질 수 있습니다.</p>
        </div>

        <div className="calculatorCard">
          <div className="calcField"><label>월간 요청 수</label><input type="number" min="0" value={requests} onChange={(e) => setRequests(e.target.value)} /></div>
          <div className="calcField"><label>요청당 입력 토큰</label><input type="number" min="0" value={inputTokens} onChange={(e) => setInputTokens(e.target.value)} /></div>
          <div className="calcField"><label>요청당 출력 토큰</label><input type="number" min="0" value={outputTokens} onChange={(e) => setOutputTokens(e.target.value)} /></div>
          <div className="calcField"><label>입력 토큰 $ / 1M</label><input type="number" min="0" step="0.01" value={inputPrice} onChange={(e) => setInputPrice(e.target.value)} /></div>
          <div className="calcField"><label>출력 토큰 $ / 1M</label><input type="number" min="0" step="0.01" value={outputPrice} onChange={(e) => setOutputPrice(e.target.value)} /></div>

          <button className="primaryCalc" type="button" onClick={calculate}>비용 계산하기</button>

          <div className="calcResult">
            <span>예상 월 비용</span>
            <strong>{result === null ? "$0.00" : `$${result.toFixed(2)}`}</strong>
          </div>
        </div>

        <p className="calcNote">※ 가격 입력란에 사용하려는 모델의 최신 공식 가격을 넣어 계산하세요.</p>
        <Link className="primaryLink" href="/tools">다른 무료 도구 보기 →</Link>
      </article>
    </main>
  );
}
