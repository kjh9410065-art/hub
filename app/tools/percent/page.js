"use client";

// 퍼센트 계산기: 할인, 인상, 증감률처럼 자주 쓰는 퍼센트 계산을 즉시 처리합니다.
import { useMemo, useState } from "react";
import Link from "next/link";

export default function PercentTool() {
  const [amount, setAmount] = useState("100000");
  const [rate, setRate] = useState("15");
  const [mode, setMode] = useState("discount");
  const result = useMemo(() => {
    const a=Number(amount), r=Number(rate);
    if(!Number.isFinite(a)||!Number.isFinite(r)) return null;
    const value=a*r/100;
    return { value, total: mode === "discount" ? a-value : a+value };
  },[amount,rate,mode]);
  return <main className="page guideArticle"><header className="header"><Link className="logo" href="/">HUB</Link><nav><Link href="/tools">무료 도구</Link><Link href="/">홈</Link></nav></header><article><div className="eyebrow">PERCENT CALCULATOR</div><h1>퍼센트를<br/><span>빠르게 계산하세요.</span></h1><p className="lead">할인율이나 인상률을 입력하면 적용 금액과 최종 금액을 바로 확인합니다.</p><div className="calculatorCard"><div className="calcField"><label>기준 금액</label><input type="number" value={amount} onChange={e=>setAmount(e.target.value)}/></div><div className="calcField"><label>퍼센트 (%)</label><input type="number" value={rate} onChange={e=>setRate(e.target.value)}/></div><div className="calcField calcWide"><label>계산 방식</label><select value={mode} onChange={e=>setMode(e.target.value)}><option value="discount">할인 / 차감</option><option value="increase">인상 / 증가</option></select></div><div className="calcResult"><span>적용 금액</span><strong>{result ? result.value.toLocaleString() : "-"}</strong></div><div className="calcResult"><span>최종 금액</span><strong>{result ? result.total.toLocaleString() : "-"}</strong></div></div><p className="calcNote">금액은 소수점까지 계산한 뒤 표시할 때 천 단위 구분을 적용합니다.</p></article></main>;
}
