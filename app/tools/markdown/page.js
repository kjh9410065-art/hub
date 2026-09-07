"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

// Markdown 정리기: 흔히 쓰는 문서 서식을 자동으로 다듬고 기본 통계를 보여줍니다.
export default function MarkdownToolPage() {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);

  const cleaned = useMemo(() => {
    if (!text) return "";
    return text
      .replace(/\r\n/g, "\n")
      .split("\n")
      .map((line) => line.trimEnd())
      .join("\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
  }, [text]);

  const stats = useMemo(() => ({
    chars: text.length,
    lines: text ? text.split(/\r?\n/).length : 0,
    words: text.trim() ? text.trim().split(/\s+/).length : 0
  }), [text]);

  async function copy() {
    if (!cleaned) return;
    await navigator.clipboard.writeText(cleaned);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  }

  return (
    <main className="page guideArticle">
      <header className="header">
        <Link className="logo" href="/">HUB</Link>
        <nav><Link href="/tools">무료 도구</Link><Link href="/compare">비교하기</Link></nav>
      </header>
      <article>
        <div className="eyebrow">HUB TOOLS</div>
        <h1>Markdown <span>정리기</span></h1>
        <p className="lead">AI가 만들어 준 Markdown 문서를 붙여 넣으면 불필요한 공백과 과도한 빈 줄을 정리해 복사하기 좋은 형태로 만들어줍니다.</p>
        <div className="calculatorCard">
          <div className="calcField">
            <label>원본 Markdown</label>
            <textarea className="toolTextarea large" value={text} onChange={(e) => { setText(e.target.value); setCopied(false); }} placeholder="# 제목\n\n본문을 입력하세요." />
          </div>
          <div className="calcField">
            <label>정리된 Markdown</label>
            <textarea className="toolTextarea large" value={cleaned} readOnly placeholder="정리 결과가 표시됩니다." />
          </div>
          <div className="toolStats calcWide">
            <span>문자 <b>{stats.chars.toLocaleString()}</b></span>
            <span>줄 <b>{stats.lines.toLocaleString()}</b></span>
            <span>단어 <b>{stats.words.toLocaleString()}</b></span>
          </div>
          <div className="toolActions calcWide">
            <button className="primaryCalc" onClick={copy}>{copied ? "복사 완료 ✓" : "정리 결과 복사"}</button>
            <button className="toolSecondary" onClick={() => { setText(""); setCopied(false); }}>초기화</button>
          </div>
        </div>
        <p className="calcNote">이 도구는 Markdown을 완전하게 재포맷하는 편집기가 아니라 공백과 빈 줄을 정리하는 간단한 클리너입니다. 입력 내용은 브라우저에서 처리됩니다.</p>
        <Link className="primaryLink" href="/tools">← 무료 도구 모음으로</Link>
      </article>
    </main>
  );
}
