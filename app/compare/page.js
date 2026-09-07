/* HUB 1.2 비교 화면: 추천 페이지에서 고른 서비스를 최대 4개까지 PC·모바일 각각 최적화해 비교합니다. */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { serviceMap } from "../lib/services";
import "./compare.css";

const fallback=["openai","gemini","claude","groq"];
const rows=[["category","분류"],["price","비용 부담"],["free","무료 시작"],["difficulty","개발 난이도"],["api","API"],["image","이미지"],["video","영상"],["voice","음성"],["search","검색"],["bestFor","추천 용도"],["strengths","강점"],["caveat","주의할 점"]];

export default function Compare(){
  const [selected,setSelected]=useState([]);
  useEffect(()=>{try{const raw=JSON.parse(localStorage.getItem("hub-compare")||"[]");setSelected(raw.filter(id=>serviceMap[id]).slice(0,4));}catch{setSelected([])}},[]);
  const list=selected.length?selected:fallback;
  const remove=(id)=>{const next=selected.filter(x=>x!==id);setSelected(next);localStorage.setItem("hub-compare",JSON.stringify(next));};
  const clear=()=>{setSelected([]);localStorage.removeItem("hub-compare")};
  const value=(s,key)=>{if(["image","video","voice","search"].includes(key))return s.features[key]?"지원":"—";if(key==="free")return s.free?"가능":"없음";if(key==="api")return s.api?"제공":"확인 필요";if(key==="strengths")return s.strengths.join(" · ");return s[key]??"—"};
  return <main className="page comparePage compareModern"><header className="header"><Link className="logo" href="/">HUB</Link><nav><Link href="/guides">가이드</Link><Link href="/recommend">추천받기</Link></nav></header><section className="guideHero compareHero"><div className="eyebrow">SERVICE COMPARE · HUB 1.2</div><h1>선택지를 한눈에,<br/><span>내게 맞는 쪽을 비교하세요.</span></h1><p>최대 4개 서비스를 비용·기능·난이도 기준으로 비교합니다.</p></section><section className="section compareSection"><div className="compareToolbar"><div><b>{selected.length||4}개 서비스</b><span>{selected.length?"추천에서 선택한 서비스":"기본 비교 목록"}</span></div><div className="toolbarActions"><Link href="/recommend">서비스 더 고르기</Link>{selected.length>0&&<button onClick={clear}>전체 해제</button>}</div></div><div className="compareDesktop"><div className="compareMatrixHead"><div className="matrixLabel">비교 항목</div>{list.map(id=><div className="matrixService" key={id}><span>{serviceMap[id].icon}</span><strong>{serviceMap[id].name}</strong>{selected.includes(id)&&<button onClick={()=>remove(id)} aria-label={`${serviceMap[id].name} 제거`}>×</button>}</div>)}</div>{rows.map(([key,label])=><div className="compareMatrixRow" key={key}><div className="matrixLabel">{label}</div>{list.map(id=><div key={id} className={key==="bestFor"?"matrixStrong":""}>{value(serviceMap[id],key)}</div>)}</div>)}</div><div className="compareMobile">{list.map((id,index)=>{const s=serviceMap[id];return <article className={`mobileCompareCard ${index===0?"featured":""}`} key={id}><header><div className="mobileServiceIcon">{s.icon}</div><div><strong>{s.name}</strong><small>{s.category}</small></div>{selected.includes(id)&&<button onClick={()=>remove(id)}>×</button>}</header><div className="mobileScore"><span>{index===0?"비교 기준 추천":"비교 대상"}</span><b>{s.price}</b></div><dl>{rows.slice(2,11).map(([key,label])=><div key={key}><dt>{label}</dt><dd>{value(s,key)}</dd></div>)}</dl><a href={s.url} target="_blank" rel="noreferrer">공식 사이트 ↗</a></article>})}</div><Link className="primaryLink compareBottomLink" href="/recommend">내 조건으로 다시 추천받기 →</Link></section></main>;
}