"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

export default function TokenPage() {
  const [text, setText] = useState("");
  const [chars, setChars] = useState(4);

  // 정확한 토크나이저가 아니라, 한국어/영어가 섞인 일반적인 텍스트의
  // 토큰 사용량을 빠르게 가늠하기 위한 무료 추정 도구입니다.
  const estimate = useMemo(() => {
    const value = text.trim();
    if (!value) return { tokens: 0, words: 0, chars: 0 };
    const wordCount = value.split(/\s+/).length;
    const korean = (value.match(/[가-힣]/g) || []).length;
    const latin = (value.match(/[A-Za-z0-9]/g) || []).length;
    const other = Math.max(0, value.length - korean - latin);
    const divisor = Math.max(2, Number(chars) || 4);
    const tokens = Math.max(1, Math.ceil(korean / 1.8 + latin / divisor + other / 2.5));
    return { tokens, words: wordCount, chars: value.length };
  }, [text, chars]);

  return (
    <main className="page guideArticle">
      <header className="header">
        <Link className="logo" href="/">HUB</Link>
        <nav><Link href="/tools">도구</Link><Link href="/guides">가이드</Link><Link href="/compare">비교하기</Link></nav>
      </header>

      <article>
        <div className="eyebrow">FREE TOOL</div>
        <h1>AI 토큰 사용량을<br /><span>빠르게 추정하세요.</span></h1>
        <p className="lead">프롬프트를 붙여 넣으면 대략적인 토큰 수를 계산해 비용 계산에 활용할 수 있습니다.</p>

        <div className="callout">
          <b>중요</b>
          <p>이 도구는 빠른 예상용입니다. 모델마다 실제 토크나이저가 다르므로 결제 전 정확한 토큰 수는 해당 모델의 공식 도구로 확인하세요.</p>
        </div>

        <div className="calculatorCard">
          <div className="calcField">
            <label>토큰 추정 기준</label>
            <select value={chars} onChange={(e) => setChars(e.target.value)}>
              <option value="4">영어 중심 · 약 4자 / 토큰</option>
              <option value="3">혼합 텍스트 · 약 3자 / 토큰</option>
              <option value="2">짧은 문장 · 보수적으로 계산</option>
            </select>
          </div>
          <div className="calcField">
            <label>텍스트</label>
            <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="AI에게 보낼 프롬프트를 붙여 넣으세요." rows="10" />
          </div>

          <div className="calcResult tokenStats">
            <div><span>예상 토큰</span><strong>{estimate.tokens.toLocaleString()}</strong></div>
            <div><span>문자 수</span><strong>{estimate.chars.toLocaleString()}</strong></div>
            <div><span>단어 수</span><strong>{estimate.words.toLocaleString()}</strong></div>
          </div>
        </div>

        <p className="calcNote">※ 실제 토큰 수는 모델과 토크나이저에 따라 달라집니다.</p>
        <div className="toolLinks">
          <Link className="primaryLink" href="/tools/cost">API 비용 계산하기 →</Link>
          <Link className="secondaryLink" href="/tools">무료 도구 더 보기</Link>
        </div>
      </article>
    </main>
  );
}
