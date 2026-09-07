"use client";

import { useState } from "react";
import Link from "next/link";

// 기본적인 5필드 Cron 표현식을 사람이 읽기 쉬운 문장으로 설명합니다.
export default function CronPage(){const [expr,setExpr]=useState("0 9 * * 1-5");const parts=expr.trim().split(/\s+/);const valid=parts.length===5;const names=["분","시","일","월","요일"];return <main className="page toolPage"><header className="header"><Link className="logo" href="/">HUB</Link><nav><Link href="/tools">도구 모음</Link><Link href="/">서비스 찾기</Link></nav></header><section className="guideHero"><div className="eyebrow">CRON HELPER</div><h1>Cron 표현식<br/><span>한눈에 확인</span></h1><p>자동화 작업에 사용하는 5필드 Cron 값을 빠르게 분해해서 확인합니다.</p></section><section className="section"><div className="toolPanel"><label>Cron 표현식<input value={expr} onChange={e=>setExpr(e.target.value)} placeholder="*/5 * * * *" /></label>{valid?<div className="statGrid">{parts.map((p,i)=><div className="statCard" key={i}><b>{p}</b><span>{names[i]}</span></div>)}</div>:<p className="toolError">5개의 필드가 필요합니다. 예: 0 9 * * 1-5</p>}<div className="toolResult"><small>필드 순서</small><p>분 → 시 → 일 → 월 → 요일</p><p>예시 <code>0 9 * * 1-5</code> = 평일 오전 9시</p></div><p className="toolNote">이 도구는 Cron 표현식을 실행하거나 실제 예약 작업을 등록하지 않습니다.</p></div></section></main>}
