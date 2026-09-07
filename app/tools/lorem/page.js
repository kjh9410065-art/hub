"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

// 개발 화면이나 디자인 시안에서 사용할 테스트용 문장을 즉석 생성합니다.
const words = "lorem ipsum dolor sit amet consectetur adipiscing elit integer posuere sapien vitae libero tincidunt porta mauris feugiat tellus gravida nunc pretium".split(" ");
export default function LoremPage(){const [count,setCount]=useState(30);const [seed,setSeed]=useState(0);const text=useMemo(()=>Array.from({length:count},(_,i)=>words[(i*7+seed*3)%words.length]).join(" "),[count,seed]);return <main className="page toolPage"><header className="header"><Link className="logo" href="/">HUB</Link><nav><Link href="/tools">도구 모음</Link><Link href="/">서비스 찾기</Link></nav></header><section className="guideHero"><div className="eyebrow">TEST DATA</div><h1>더미 텍스트<br/><span>빠르게 생성</span></h1><p>UI 시안·개발 테스트에 사용할 Lorem Ipsum 텍스트를 만듭니다.</p></section><section className="section"><div className="toolPanel"><label>단어 수<input type="number" min="5" max="500" value={count} onChange={e=>setCount(Math.max(5,Math.min(500,Number(e.target.value)||5)))} /></label><div className="toolActions"><button onClick={()=>setSeed(x=>x+1)}>새로 만들기</button><button onClick={()=>navigator.clipboard.writeText(text)}>복사</button></div><div className="toolResult"><small>{count} words</small><p>{text}.</p></div><p className="toolNote">실제 콘텐츠가 아닌 개발·디자인 테스트용 더미 텍스트입니다.</p></div></section></main>}
