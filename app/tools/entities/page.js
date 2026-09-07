"use client";

import { useState } from "react";
import Link from "next/link";

// HTML 특수문자를 엔티티로 바꾸거나 다시 원래 문자로 복원합니다.
const entities = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
export default function EntitiesPage() {
  const [text, setText] = useState("");
  const [mode, setMode] = useState("encode");
  const output = mode === "encode" ? text.replace(/[&<>"']/g, c => entities[c]) : text.replace(/&(amp|lt|gt|quot|#39);/g, (_, k) => ({amp:"&",lt:"<",gt:">",quot:'"',"#39":"'"}[k]));
  return <main className="page toolPage"><header className="header"><Link className="logo" href="/">HUB</Link><nav><Link href="/tools">도구 모음</Link><Link href="/">서비스 찾기</Link></nav></header><section className="guideHero"><div className="eyebrow">HTML ENTITY</div><h1>HTML 엔티티<br/><span>인코더·디코더</span></h1><p>HTML에서 의미가 달라질 수 있는 특수문자를 안전한 표현으로 변환합니다.</p></section><section className="section"><div className="toolPanel"><div className="toolActions"><button className={mode==="encode"?"active":""} onClick={()=>setMode("encode")}>인코딩</button><button className={mode==="decode"?"active":""} onClick={()=>setMode("decode")}>디코딩</button></div><label>입력<textarea value={text} onChange={e=>setText(e.target.value)} placeholder={mode==="encode"?"예: <div>Tom & Jerry</div>":"예: &lt;div&gt;Tom &amp; Jerry&lt;/div&gt;"}/></label><div className="toolResult"><small>결과</small><code>{output || "여기에 결과가 표시됩니다."}</code></div><button onClick={()=>navigator.clipboard.writeText(output)}>결과 복사</button><p className="toolNote">브라우저에서 처리되며 서버로 입력 내용을 전송하지 않습니다.</p></div></section></main>}
