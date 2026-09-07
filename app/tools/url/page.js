"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

// URL 인코더/디코더: API 파라미터나 링크에 사용할 문자열을 브라우저에서 바로 변환합니다.
export default function UrlToolPage() {
  const [mode, setMode] = useState("encode");
  const [input, setInput] = useState("");
  const [copied, setCopied] = useState(false);

  const output = useMemo(() => {
    if (!input) return "";
    try {
      return mode === "encode" ? encodeURIComponent(input) : decodeURIComponent(input);
    } catch {
      return "변환할 수 없는 URL 문자열입니다.";
    }
  }, [input, mode]);

  async function copyOutput() {
    if (!output) return;
    await navigator.clipboard.writeText(output);
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
        <h1>URL <span>인코더·디코더</span></h1>
        <p className="lead">공백, 한글, 특수문자가 포함된 문자열을 URL에서 안전하게 사용할 수 있는 형태로 변환하거나 다시 복원합니다.</p>
        <div className="calculatorCard">
          <div className="calcField calcWide">
            <label>변환 방식</label>
            <select value={mode} onChange={(e) => setMode(e.target.value)}>
              <option value="encode">URL 인코딩</option>
              <option value="decode">URL 디코딩</option>
            </select>
          </div>
          <div className="calcField calcWide">
            <label>입력</label>
            <textarea className="toolTextarea" value={input} onChange={(e) => setInput(e.target.value)} placeholder="변환할 문자열을 입력하세요." />
          </div>
          <div className="calcField calcWide">
            <label>결과</label>
            <textarea className="toolTextarea" value={output} readOnly placeholder="결과가 여기에 표시됩니다." />
          </div>
          <div className="toolActions calcWide">
            <button className="primaryCalc" onClick={copyOutput}>{copied ? "복사 완료 ✓" : "결과 복사"}</button>
            <button className="toolSecondary" onClick={() => { setInput(""); setCopied(false); }}>초기화</button>
          </div>
        </div>
        <p className="calcNote">브라우저에서만 처리하므로 입력한 문자열은 HUB 서버로 전송되지 않습니다. URL 인코딩은 암호화가 아니며 비밀번호나 비밀정보 보호 수단으로 사용하면 안 됩니다.</p>
        <Link className="primaryLink" href="/tools">← 무료 도구 모음으로</Link>
      </article>
    </main>
  );
}
