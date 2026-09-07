"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

// 큰 숫자를 천 단위 구분과 한글 단위로 보기 쉽게 표시합니다.
const units=[[1e12,"조"],[1e8,"억"],[1e4,"만"]];
function korean(n){let rest=Math.abs(n),parts=[];for(const [v,name] of units){if(rest>=v){const q=Math.floor(rest/v);parts.push(`${q}${name}`);rest%=v;}}return parts.length?parts.join(" "):(n===0?"0":"-");}
export default function NumberPage(){const [value,setValue]=useState("123456789");const n=Number(value.replace(/,/g,""));const formatted=Number.isFinite(n)?n.toLocaleString("ko-KR"):"-";const unit=Number.isFinite(n)?korean(n):"-";return <main className="page toolPage"><header className="header"><Link className="logo" href="/">HUB</Link><nav><Link href="/tools">도구 모음</Link><Link href="/">서비스 찾기</Link></nav></header><section className="guideHero"><div className="eyebrow">NUMBER FORMATTER</div><h1>숫자 포맷터<br/><span>큰 숫자도 쉽게</span></h1><p>숫자에 천 단위 구분을 넣고 만·억·조 단위로 빠르게 확인합니다.</p></section><section className="section"><div className="toolPanel"><label>숫자<input value={value} onChange={e=>setValue(e.target.value)} placeholder="123456789" /></label><div className="statGrid"><div className="statCard"><b>{formatted}</b><span>천 단위 표시</span></div><div className="statCard"><b>{unit}</b><span>한글 단위</span></div></div><p className="toolNote">표시는 읽기 편하게 만든 참고용 표현입니다. 금융·회계 문서에서는 원본 숫자를 함께 확인하세요.</p></div></section></main>}
