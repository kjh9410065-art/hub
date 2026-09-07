"use client";

import Link from "next/link";
import { useState } from "react";

export default function Base64Page() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState("encode");
  const [error, setError] = useState("");

  // 한글까지 안전하게 처리하도록 UTF-8 바이트 기준으로 Base64를 변환합니다.
  function convert() {
    try {
      if (!input) {
        setOutput("");
        setError("");
        return;
      }
      if (mode === "encode") {
        setOutput(btoa(String.fromCharCode(...new TextEncoder().encode(input))));
      } else {
        const bytes = Uint8Array.from(atob(input.replace(/\s/g, "")), (c) => c.charCodeAt(0));
        setOutput(new TextDecoder().decode(bytes));
      }
      setError("");
    } catch (e) {
      setOutput("");
      setError(`변환 오류: ${e.message}`);
    }
  }

  async function copyOutput() {
    if (output) await navigator.clipboard.writeText(output);
  }

  return (
    <main className="page guideArticle">
      <header className="header">
        <Link className="logo" href="/">HUB</Link>
        <nav><Link href="/tools">도구</Link><Link href="/guides">가이드</Link><Link href="/compare">비교하기</Link></nav>
      </header>

      <article>
        <div className="eyebrow">FREE DEVELOPER TOOL</div>
        <h1>Base64를<br /><span>빠르게 변환하세요.</span></h1>
        <p className="lead">텍스트를 Base64로 인코딩하거나 Base64 문자열을 다시 텍스트로 디코딩합니다.</p>

        <div className="callout">
          <b>브라우저에서 처리</b>
          <p>입력값은 서버로 보내지 않고 현재 브라우저에서 변환합니다. Base64는 암호화가 아니므로 비밀번호나 비밀키 보호 용도로 사용하면 안 됩니다.</p>
        </div>

        <div className="calculatorCard jsonCard">
          <div className="toolButtons">
            <button className={mode === "encode" ? "primaryCalc" : "secondaryButton"} type="button" onClick={() => { setMode("encode"); setOutput(""); setError(""); }}>텍스트 → Base64</button>
            <button className={mode === "decode" ? "primaryCalc" : "secondaryButton"} type="button" onClick={() => { setMode("decode"); setOutput(""); setError(""); }}>Base64 → 텍스트</button>
          </div>
          <div className="calcField">
            <label>입력</label>
            <textarea value={input} onChange={(e) => setInput(e.target.value)} rows="10" spellCheck="false" placeholder={mode === "encode" ? "변환할 텍스트를 입력하세요." : "Base64 문자열을 입력하세요."} />
          </div>
          <div className="toolButtons">
            <button className="primaryCalc" type="button" onClick={convert}>변환하기</button>
            <button className="secondaryButton" type="button" onClick={() => { setInput(""); setOutput(""); setError(""); }}>초기화</button>
          </div>
          {error && <div className="jsonError">{error}</div>}
          {output && <div className="jsonOutput"><div className="outputHead"><span>결과</span><button type="button" onClick={copyOutput}>복사</button></div><pre>{output}</pre></div>}
        </div>

        <div className="toolLinks">
          <Link className="primaryLink" href="/tools/json">JSON 정리하기 →</Link>
          <Link className="secondaryLink" href="/tools">무료 도구 더 보기</Link>
        </div>
      </article>
    </main>
  );
}
