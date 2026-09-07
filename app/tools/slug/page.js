"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

// URL에 쓰기 좋은 영문 소문자 슬러그를 만드는 간단한 브라우저 도구입니다.
export default function SlugPage() {
  const [text, setText] = useState("");
  const slug = useMemo(() => text
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9가-힣]+/g, "-")
    .replace(/^-+|-+$/g, ""), [text]);

  const copy = async () => { if (slug) await navigator.clipboard.writeText(slug); };
  return <main className="page toolPage"><header className="header"><Link className="logo" href="/">HUB</Link><nav><Link href="/tools">도구 모음</Link><Link href="/">서비스 찾기</Link></nav></header><section className="guideHero"><div className="eyebrow">URL SLUG</div><h1>URL 슬러그<br/><span>깔끔하게 만들기</span></h1><p>제목이나 문장을 URL에 넣기 좋은 형태로 정리합니다.</p></section><section className="section"><div className="toolPanel"><label>원본 텍스트<textarea value={text} onChange={e=>setText(e.target.value)} placeholder="예: AI 이미지 생성 서비스 추천" /></label><div className="toolResult"><small>생성된 슬러그</small><code>{slug || "여기에 결과가 표시됩니다."}</code></div><div className="toolActions"><button onClick={copy}>복사</button><button onClick={()=>setText("")}>초기화</button></div><p className="toolNote">영문·숫자·한글을 유지하고 나머지 문자는 하이픈으로 정리합니다.</p></div></section></main>}
