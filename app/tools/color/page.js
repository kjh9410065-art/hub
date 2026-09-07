"use client";

// 색상 변환기: HEX, RGB, HSL 값을 서로 변환해 웹 디자인에 활용할 수 있습니다.
import { useMemo, useState } from "react";
import Link from "next/link";

export default function ColorTool() {
  const [hex, setHex] = useState("#6955d9");
  const rgb = useMemo(() => {
    const value = hex.replace("#", "");
    if (!/^[0-9a-fA-F]{6}$/.test(value)) return null;
    return { r: parseInt(value.slice(0,2),16), g: parseInt(value.slice(2,4),16), b: parseInt(value.slice(4,6),16) };
  }, [hex]);
  const hsl = useMemo(() => {
    if (!rgb) return null;
    const r=rgb.r/255,g=rgb.g/255,b=rgb.b/255,max=Math.max(r,g,b),min=Math.min(r,g,b),d=max-min;
    let h=0;
    if(d){ if(max===r) h=((g-b)/d)%6; else if(max===g) h=(b-r)/d+2; else h=(r-g)/d+4; h=Math.round(h*60); if(h<0)h+=360; }
    const l=(max+min)/2,s=d===0?0:d/(1-Math.abs(2*l-1));
    return {h, s:Math.round(s*100), l:Math.round(l*100)};
  }, [rgb]);
  return (
    <main className="page guideArticle">
      <header className="header"><Link className="logo" href="/">HUB</Link><nav><Link href="/tools">무료 도구</Link><Link href="/">홈</Link></nav></header>
      <article>
        <div className="eyebrow">COLOR CONVERTER</div>
        <h1>색상값을<br /><span>쉽게 변환하세요.</span></h1>
        <p className="lead">웹사이트와 디자인에 사용하는 HEX 색상을 RGB와 HSL 값으로 확인합니다.</p>
        <div className="calculatorCard">
          <div className="calcField calcWide"><label>HEX 색상</label><input value={hex} onChange={(e)=>setHex(e.target.value)} placeholder="#6955d9" /></div>
          <div className="colorPreview calcWide" style={{background: rgb ? hex : "transparent"}}>{rgb ? hex.toUpperCase() : "유효한 HEX 값을 입력하세요"}</div>
          <div className="resultList calcWide">
            <div><span>RGB</span><strong>{rgb ? `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` : "-"}</strong></div>
            <div><span>HSL</span><strong>{hsl ? `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` : "-"}</strong></div>
          </div>
        </div>
        <p className="calcNote">HEX는 6자리 형식(#RRGGBB)을 기준으로 합니다. 색상값은 브라우저에서만 계산됩니다.</p>
      </article>
    </main>
  );
}
