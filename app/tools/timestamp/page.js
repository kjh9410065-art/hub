"use client";

// 타임스탬프 변환기: Unix timestamp와 사람이 읽는 날짜를 서로 변환합니다.
import { useMemo, useState } from "react";
import Link from "next/link";

export default function TimestampTool() {
  const [value, setValue] = useState(String(Math.floor(Date.now()/1000)));
  const result = useMemo(() => {
    const n = Number(value);
    if (!Number.isFinite(n)) return null;
    const date = new Date(Math.abs(n) < 1e12 ? n * 1000 : n);
    if (Number.isNaN(date.getTime())) return null;
    return { date, seconds: Math.floor(date.getTime()/1000), millis: date.getTime() };
  }, [value]);
  const now = () => setValue(String(Math.floor(Date.now()/1000)));
  return (
    <main className="page guideArticle">
      <header className="header"><Link className="logo" href="/">HUB</Link><nav><Link href="/tools">무료 도구</Link><Link href="/guides">가이드</Link></nav></header>
      <article>
        <div className="eyebrow">TIMESTAMP CONVERTER</div>
        <h1>Unix 시간을<br /><span>날짜로 바꿔보세요.</span></h1>
        <p className="lead">API 로그와 개발 문서에서 자주 사용하는 Unix timestamp를 읽기 쉬운 날짜와 시간으로 변환합니다.</p>
        <div className="calculatorCard">
          <div className="calcField calcWide"><label>Timestamp</label><input value={value} onChange={(e)=>setValue(e.target.value)} placeholder="예: 1760000000" /></div>
          <button className="primaryCalc" onClick={now}>현재 시간 넣기</button>
          <div className="resultList calcWide">
            <div><span>로컬 시간</span><strong>{result ? result.date.toLocaleString() : "-"}</strong></div>
            <div><span>UTC</span><strong>{result ? result.date.toISOString() : "-"}</strong></div>
            <div><span>초</span><strong>{result ? result.seconds : "-"}</strong></div>
            <div><span>밀리초</span><strong>{result ? result.millis : "-"}</strong></div>
          </div>
        </div>
        <p className="calcNote">입력값이 13자리 정도이면 밀리초, 10자리 정도이면 초 단위 timestamp로 처리합니다. 날짜는 현재 브라우저의 로컬 시간대를 사용합니다.</p>
      </article>
    </main>
  );
}
