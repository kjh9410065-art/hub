"use client";

import { useState } from "react";
import Link from "next/link";

// JWT의 헤더와 payload를 읽기만 합니다. 서명 검증이나 인증은 수행하지 않습니다.
function decodePart(part) {
  const normalized = part.replace(/-/g, "+").replace(/_/g, "/");
  return decodeURIComponent(atob(normalized.padEnd(normalized.length + (4-normalized.length%4)%4, "=")).split("").map(c=>"%"+("00"+c.charCodeAt(0).toString(16)).slice(-2)).join(""));
}
export default function JwtPage() {
  const [token, setToken] = useState(""); const [result, setResult] = useState(null); const [error, setError] = useState("");
  const decode = () => { try { const p=token.trim().split("."); if(p.length!==3) throw new Error("JWT는 header.payload.signature 형식이어야 합니다."); setResult({header:JSON.parse(decodePart(p[0])),payload:JSON.parse(decodePart(p[1]))}); setError(""); } catch(e){setResult(null);setError(e.message||"JWT를 읽을 수 없습니다.");} };
  return <main className="page toolPage"><header className="header"><Link className="logo" href="/">HUB</Link><nav><Link href="/tools">도구 모음</Link><Link href="/">서비스 찾기</Link></nav></header><section className="guideHero"><div className="eyebrow">JWT DECODER</div><h1>JWT 디코더<br/><span>내용만 빠르게 확인</span></h1><p>JWT의 Header와 Payload를 브라우저에서 디코딩합니다.</p></section><section className="section"><div className="toolPanel"><label>JWT<textarea value={token} onChange={e=>setToken(e.target.value)} placeholder="eyJhbGciOi..." /></label><div className="toolActions"><button onClick={decode}>디코딩</button><button onClick={()=>{setToken("");setResult(null);setError("")}}>초기화</button></div>{error&&<p className="toolError">{error}</p>}{result&&<div className="toolInfoGrid"><div className="toolResult"><small>Header</small><pre>{JSON.stringify(result.header,null,2)}</pre></div><div className="toolResult"><small>Payload</small><pre>{JSON.stringify(result.payload,null,2)}</pre></div></div>}<p className="toolNote">중요: 이 도구는 서명을 검증하지 않습니다. 비밀번호·API 키 등 민감한 JWT는 외부 도구에 붙여 넣지 않는 것을 권장합니다.</p></div></section></main>}
