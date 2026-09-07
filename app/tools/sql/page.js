"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

// 외부 SQL 라이브러리 없이 자주 쓰는 SQL을 읽기 쉽게 정리합니다.
const keywords = /\b(SELECT|FROM|WHERE|GROUP BY|ORDER BY|HAVING|LIMIT|LEFT JOIN|RIGHT JOIN|INNER JOIN|JOIN|ON|AND|OR|VALUES|SET|INSERT INTO|UPDATE|DELETE FROM|CREATE TABLE)\b/gi;
export default function SqlPage(){const [input,setInput]=useState("");const output=useMemo(()=>input.trim().replace(/\s+/g," ").replace(/\s*,\s*/g,", ").replace(keywords,m=>`\n${m.toUpperCase()}`).trim(),[input]);return <main className="page toolPage"><header className="header"><Link className="logo" href="/">HUB</Link><nav><Link href="/tools">도구 모음</Link><Link href="/">서비스 찾기</Link></nav></header><section className="guideHero"><div className="eyebrow">SQL FORMATTER</div><h1>SQL 포맷터<br/><span>읽기 쉽게 정리</span></h1><p>한 줄로 뭉친 SQL을 주요 절 기준으로 보기 좋게 나눕니다.</p></section><section className="section"><div className="toolPanel"><textarea value={input} onChange={e=>setInput(e.target.value)} placeholder="SELECT id, name FROM users WHERE age >= 20 ORDER BY name;"/><div className="toolActions"><button onClick={()=>navigator.clipboard.writeText(output)}>결과 복사</button><button onClick={()=>setInput("")}>초기화</button></div><div className="toolResult"><small>정리된 SQL</small><pre>{output||"여기에 결과가 표시됩니다."}</pre></div><p className="toolNote">간단한 포맷팅 도구이며 SQL 문법을 검증하거나 실행하지 않습니다.</p></div></section></main>}
