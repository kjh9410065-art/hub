"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

export default function PromptToolPage() {
  const [text, setText] = useState("");

  // 프롬프트를 작성하면서 길이와 기본적인 사용량을 바로 확인합니다.
  const stats = useMemo(() => {
    const chars = text.length;
    const lines = text ? text.split(/\r?\n/).length : 0;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    // 실제 토크나이저가 아니므로 빠른 참고용 추정치입니다.
    const tokens = Math.ceil(chars / 3);
    return { chars, lines, words, tokens };
  }, [text]);

  const copy = async () => {
    if (!text) return;
    await navigator.clipboard.writeText(text);
  };

  return (
    <main className="page toolPage">
      <header className="header">
        <Link className="logo" href="/">HUB</Link>
        <nav><Link href="/tools">무료 도구</Link><Link href="/compare">비교하기</Link></nav>
      </header>

      <section className="guideHero">
        <div className="eyebrow">PROMPT TOOL</div>
        <h1>프롬프트를 작성하고,<br /><span>길이를 바로 확인하세요.</span></h1>
        <p>AI에 넣기 전 글자 수와 예상 토큰을 빠르게 확인할 수 있습니다.</p>
      </section>

      <section className="section">
        <div className="toolPanel">
          <textarea
            className="toolTextarea"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="여기에 프롬프트를 입력하세요..."
            aria-label="프롬프트 입력"
          />

          <div className="toolStats">
            <div><strong>{stats.chars.toLocaleString()}</strong><span>글자</span></div>
            <div><strong>{stats.words.toLocaleString()}</strong><span>단어</span></div>
            <div><strong>{stats.lines.toLocaleString()}</strong><span>줄</span></div>
            <div><strong>약 {stats.tokens.toLocaleString()}</strong><span>토큰</span></div>
          </div>

          <div className="toolActions">
            <button onClick={copy} disabled={!text}>프롬프트 복사</button>
            <button onClick={() => setText("")} disabled={!text}>초기화</button>
          </div>

          <p className="toolNote">토큰 수는 약 3글자당 1토큰으로 계산한 참고용 추정치이며, 실제 값은 모델별 토크나이저에 따라 달라집니다.</p>
        </div>
      </section>
    </main>
  );
}
