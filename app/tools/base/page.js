"use client";

// 진법 변환기: 2진수, 8진수, 10진수, 16진수 사이를 변환합니다.
import { useMemo, useState } from "react";
import Link from "next/link";

export default function BaseTool(){
 const [value,setValue]=useState("255");const [base,setBase]=useState("10");
 const result=useMemo(()=>{try{const n=parseInt(value,Number(base));if(!Number.isFinite(n)||n<0)return null;return {2:n.toString(2),8:n.toString(8),10:String(n),16:n.toString(16).toUpperCase()};}catch{return null;}},[value,base]);
 return <main className="page guideArticle"><header className="header"><Link className="logo" href="/">HUB</Link><nav><Link href="/tools">무료 도구</Link><Link href="/">홈</Link></nav></header><article><div className="eyebrow">NUMBER BASE CONVERTER</div><h1>진법을<br/><span>간단하게 변환하세요.</span></h1><p className="lead">개발 중 자주 사용하는 2진수·8진수·10진수·16진수를 서로 변환합니다.</p><div className="calculatorCard"><div className="calcField"><label>숫자</label><input value={value} onChange={e=>setValue(e.target.value)}/></div><div className="calcField"><label>입력 진법</label><select value={base} onChange={e=>setBase(e.target.value)}><option value="2">2진수</option><option value="8">8진수</option><option value="10">10진수</option><option value="16">16진수</option></select></div><div className="resultList calcWide"><div><span>2진수</span><strong>{result?.[2]||"-"}</strong></div><div><span>8진수</span><strong>{result?.[8]||"-"}</strong></div><div><span>10진수</span><strong>{result?.[10]||"-"}</strong></div><div><span>16진수</span><strong>{result?.[16]||"-"}</strong></div></div></div><p className="calcNote">음수나 소수는 이 간단한 변환기에서 지원하지 않습니다.</p></article></main>;
}
