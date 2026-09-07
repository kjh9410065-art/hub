"use client";

// 데이터 단위 변환기: Bytes와 KB/MB/GB/TB를 서로 변환합니다.
import { useMemo, useState } from "react";
import Link from "next/link";

export default function BytesTool() {
  const [value,setValue]=useState("1024");
  const [unit,setUnit]=useState("B");
  const units=["B","KB","MB","GB","TB"];
  const result=useMemo(()=>{const n=Number(value);if(!Number.isFinite(n)||n<0)return null;const base=n*Math.pow(1024,units.indexOf(unit));return units.map((u,i)=>({u,v:base/Math.pow(1024,i)}));},[value,unit]);
  return <main className="page guideArticle"><header className="header"><Link className="logo" href="/">HUB</Link><nav><Link href="/tools">무료 도구</Link><Link href="/guides">가이드</Link></nav></header><article><div className="eyebrow">DATA UNIT CONVERTER</div><h1>데이터 용량을<br/><span>쉽게 변환하세요.</span></h1><p className="lead">파일 크기, 저장공간, API 응답 용량 등을 Bytes부터 TB까지 한눈에 변환합니다.</p><div className="calculatorCard"><div className="calcField"><label>값</label><input type="number" min="0" value={value} onChange={e=>setValue(e.target.value)}/></div><div className="calcField"><label>단위</label><select value={unit} onChange={e=>setUnit(e.target.value)}>{units.map(u=><option key={u}>{u}</option>)}</select></div><div className="resultList calcWide">{result?.map(({u,v})=><div key={u}><span>{u}</span><strong>{v.toLocaleString(undefined,{maximumFractionDigits:8})}</strong></div>)}</div></div><p className="calcNote">이 도구는 1KB = 1024B인 이진 단위 기준으로 계산합니다.</p></article></main>;
}
