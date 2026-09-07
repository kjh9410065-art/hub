"use client";

import { useState } from "react";
import Link from "next/link";

// UUID 생성기: 브라우저의 crypto API를 이용해 랜덤 UUID를 생성합니다.
export default function UuidToolPage() {
  const [count, setCount] = useState(1);
  const [items, setItems] = useState([]);
  const [copied, setCopied] = useState(false);

  function generate() {
    const amount = Math.min(20, Math.max(1, Number(count) || 1));
    const result = Array.from({ length: amount }, () => {
      if (crypto.randomUUID) return crypto.randomUUID();
      const bytes = crypto.getRandomValues(new Uint8Array(16));
      bytes[6] = (bytes[6] & 0x0f) | 0x40;
      bytes[8] = (bytes[8] & 0x3f) | 0x80;
      const hex = [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("");
      return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
    });
    setItems(result);
    setCopied(false);
  }

  async function copyAll() {
    if (!items.length) return;
    await navigator.clipboard.writeText(items.join("\n"));
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
        <h1>UUID <span>생성기</span></h1>
        <p className="lead">회원·게시물·작업 등의 데이터를 구분할 때 사용할 UUID를 한 번에 최대 20개까지 생성합니다.</p>
        <div className="calculatorCard">
          <div className="calcField calcWide">
            <label>생성 개수</label>
            <input type="number" min="1" max="20" value={count} onChange={(e) => setCount(e.target.value)} />
            <small>1~20개까지 생성할 수 있습니다.</small>
          </div>
          <button className="primaryCalc" onClick={generate}>UUID 생성하기</button>
          <div className="toolOutput calcWide">
            {items.length ? items.map((item) => <code key={item}>{item}</code>) : <span>생성 버튼을 누르면 UUID가 표시됩니다.</span>}
          </div>
          <div className="toolActions calcWide">
            <button className="primaryCalc" onClick={copyAll}>{copied ? "전체 복사 완료 ✓" : "전체 복사"}</button>
            <button className="toolSecondary" onClick={() => { setItems([]); setCopied(false); }}>초기화</button>
          </div>
        </div>
        <p className="calcNote">UUID는 식별자 생성용입니다. 인증 토큰, 비밀번호, 암호화 키 등 높은 보안이 필요한 값의 대체 수단으로 사용하지 마세요. 생성은 브라우저에서 처리됩니다.</p>
        <Link className="primaryLink" href="/tools">← 무료 도구 모음으로</Link>
      </article>
    </main>
  );
}
