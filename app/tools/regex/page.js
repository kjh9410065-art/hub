"use client";

// 정규식 테스트기: 개발자가 정규식과 테스트 문자열을 브라우저에서 바로 확인할 수 있습니다.
import { useMemo, useState } from "react";
import Link from "next/link";

export default function RegexTool() {
  const [pattern, setPattern] = useState("\\d+");
  const [flags, setFlags] = useState("g");
  const [text, setText] = useState("주문번호 12345, 문의번호 67890");

  const result = useMemo(() => {
    try {
      const regex = new RegExp(pattern, flags);
      const matches = text.match(regex) || [];
      return { ok: true, matches: Array.from(matches), error: "" };
    } catch (error) {
      return { ok: false, matches: [], error: error.message };
    }
  }, [pattern, flags, text]);

  return (
    <main className="page guideArticle">
      <header className="header">
        <Link className="logo" href="/">HUB</Link>
        <nav><Link href="/tools">무료 도구</Link><Link href="/compare">비교하기</Link></nav>
      </header>
      <article>
        <div className="eyebrow">REGEX TESTER</div>
        <h1>정규식을<br /><span>바로 테스트하세요.</span></h1>
        <p className="lead">패턴과 테스트 문자열을 입력하면 매칭 결과를 즉시 확인할 수 있습니다.</p>
        <div className="calculatorCard">
          <div className="calcField calcWide"><label>정규식 패턴</label><input value={pattern} onChange={(e) => setPattern(e.target.value)} placeholder="예: \\d+" /></div>
          <div className="calcField"><label>Flags</label><input value={flags} onChange={(e) => setFlags(e.target.value)} placeholder="g, i, m" /></div>
          <div className="calcField calcWide"><label>테스트 문자열</label><textarea className="toolTextarea" value={text} onChange={(e) => setText(e.target.value)} /></div>
          <div className={`calcResult ${result.ok ? "" : "toolError"}`}><span>{result.ok ? "매칭 결과" : "정규식 오류"}</span><strong>{result.ok ? `${result.matches.length}개` : "확인 필요"}</strong></div>
          {result.ok ? <div className="resultList calcWide">{result.matches.length ? result.matches.map((item, i) => <span key={`${item}-${i}`}>{item}</span>) : <em>일치하는 문자열이 없습니다.</em>}</div> : <p className="errorText calcWide">{result.error}</p>}
        </div>
        <p className="calcNote">정규식은 브라우저의 JavaScript RegExp 기준으로 테스트됩니다. 민감한 데이터는 입력하지 않는 것을 권장합니다.</p>
      </article>
    </main>
  );
}
