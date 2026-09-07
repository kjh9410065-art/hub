"use client";

// 텍스트 분석기: 글 작성이나 프롬프트 작성 전에 분량을 빠르게 확인합니다.
import { useMemo, useState } from "react";
import Link from "next/link";

export default function WordTool() {
  const [text, setText] = useState("");
  const stats = useMemo(() => {
    const trimmed = text.trim();
    const words = trimmed ? trimmed.split(/\s+/).length : 0;
    const lines = text ? text.split(/\r?\n/).length : 0;
    const noSpace = text.replace(/\s/g, "").length;
    const korean = (text.match(/[가-힣]/g) || []).length;
    return { chars: text.length, noSpace, words, lines, korean };
  }, [text]);

  return (
    <main className="page guideArticle">
      <header className="header">
        <Link className="logo" href="/">HUB</Link>
        <nav><Link href="/tools">무료 도구</Link><Link href="/guides">가이드</Link></nav>
      </header>
      <article>
        <div className="eyebrow">TEXT ANALYZER</div>
        <h1>글의 분량을<br /><span>한눈에 확인하세요.</span></h1>
        <p className="lead">블로그 글, 프롬프트, 소개 문구 등을 붙여 넣으면 글자·단어·줄 수를 바로 계산합니다.</p>
        <div className="calculatorCard">
          <div className="calcField calcWide"><label>분석할 텍스트</label><textarea className="toolTextarea large" value={text} onChange={(e) => setText(e.target.value)} placeholder="텍스트를 입력하거나 붙여 넣으세요." /></div>
          <div className="statGrid calcWide">
            <div><span>전체 글자</span><strong>{stats.chars.toLocaleString()}</strong></div>
            <div><span>공백 제외</span><strong>{stats.noSpace.toLocaleString()}</strong></div>
            <div><span>단어</span><strong>{stats.words.toLocaleString()}</strong></div>
            <div><span>줄</span><strong>{stats.lines.toLocaleString()}</strong></div>
            <div><span>한글</span><strong>{stats.korean.toLocaleString()}</strong></div>
          </div>
          <button className="primaryCalc" onClick={() => setText("")}>전체 지우기</button>
        </div>
        <p className="calcNote">글자 수는 JavaScript 문자열 길이를 기준으로 계산합니다. 플랫폼별 글자 수 기준과 일부 차이가 날 수 있습니다.</p>
      </article>
    </main>
  );
}
