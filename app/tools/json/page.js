"use client";

import Link from "next/link";
import { useState } from "react";

const sample = '{"name":"HUB","type":"ai-tool","free":true}';

export default function JsonToolPage() {
  const [input, setInput] = useState(sample);
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  // 브라우저 안에서만 JSON을 처리하므로 입력 데이터가 서버로 전송되지 않습니다.
  function formatJson() {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, 2));
      setError("");
    } catch (e) {
      setOutput("");
      setError(`JSON 형식 오류: ${e.message}`);
    }
  }

  async function copyJson() {
    if (!output) return;
    await navigator.clipboard.writeText(output);
  }

  return (
    <main className="page guideArticle">
      <header className="header">
        <Link className="logo" href="/">HUB</Link>
        <nav><Link href="/tools">도구</Link><Link href="/guides">가이드</Link><Link href="/compare">비교하기</Link></nav>
      </header>

      <article>
        <div className="eyebrow">FREE DEVELOPER TOOL</div>
        <h1>JSON을 붙여 넣고<br /><span>깔끔하게 정리하세요.</span></h1>
        <p className="lead">AI API 응답이나 설정 파일을 브라우저에서 바로 검사하고 보기 좋게 포맷합니다.</p>

        <div className="callout">
          <b>브라우저에서 처리</b>
          <p>입력한 JSON을 이 도구의 브라우저에서 처리합니다. API 키나 개인정보가 포함된 데이터는 그래도 사용 전에 직접 확인하세요.</p>
        </div>

        <div className="calculatorCard jsonCard">
          <div className="calcField">
            <label>JSON 입력</label>
            <textarea value={input} onChange={(e) => setInput(e.target.value)} rows="10" spellCheck="false" />
          </div>
          <div className="toolButtons">
            <button className="primaryCalc" type="button" onClick={formatJson}>JSON 정리하기</button>
            <button className="secondaryButton" type="button" onClick={() => { setInput(""); setOutput(""); setError(""); }}>초기화</button>
          </div>

          {error && <div className="jsonError">{error}</div>}
          {output && (
            <div className="jsonOutput">
              <div className="outputHead"><span>정리된 JSON</span><button type="button" onClick={copyJson}>복사</button></div>
              <pre>{output}</pre>
            </div>
          )}
        </div>

        <p className="calcNote">※ 유효한 JSON인지 검사하면서 2칸 들여쓰기로 포맷합니다.</p>
        <div className="toolLinks">
          <Link className="primaryLink" href="/tools/token">AI 토큰 추정기 →</Link>
          <Link className="secondaryLink" href="/tools">무료 도구 더 보기</Link>
        </div>
      </article>
    </main>
  );
}
