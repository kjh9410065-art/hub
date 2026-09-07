/* HUB 서비스 카탈로그: 전체 서비스를 검색·분류·기능 기준으로 탐색합니다. */
"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { catalog } from "../lib/catalog";
import "./catalog.css";

const filters=["전체","AI 모델","AI 영상","이미지 생성","AI 음성","AI 검색","웹 데이터 API","콘텐츠 디자인","AI 개발 도구","AI 인프라"];
const featureFilters=[["전체","전체"],["image","이미지"],["video","영상"],["voice","음성"],["search","검색"],["text","텍스트"]];
export default function CatalogPage(){
 const [query,setQuery]=useState(""); const [category,setCategory]=useState("전체"); const [feature,setFeature]=useState("전체");
 const list=useMemo(()=>catalog.filter(s=>{const q=query.trim().toLowerCase(); const text=[s.name,s.category,s.bestFor,...s.tags].join(" ").toLowerCase(); return (!q||text.includes(q))&&(category==="전체"||s.category===category)&&(feature==="전체"||s.features?.[feature]);}),[query,category,feature]);
 return <main className="catalogPage"><header className="header catalogHeader"><Link className="logo" href="/">HUB</Link><nav><Link href="/recommend">추천받기</Link><Link href="/compare">비교하기</Link></nav></header><section className="catalogHero"><div className="eyebrow">HUB SERVICE CATALOG</div><h1>필요한 서비스를<br/><span>직접 찾아보세요.</span></h1><p>AI 모델부터 영상·이미지·음성·검색·인프라까지 한 곳에서 탐색할 수 있습니다.</p><div className="catalogSearch"><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="서비스 이름, 기능, 용도로 검색" aria-label="서비스 검색"/><strong>{list.length}개</strong></div></section><section className="catalogBody"><div className="filterBlock"><div><b>분류</b><div className="filterScroll">{filters.map(x=><button key={x} className={category===x?"active":""} onClick={()=>setCategory(x)}>{x}</button>)}</div></div><div><b>기능</b><div className="filterScroll">{featureFilters.map(([id,label])=><button key={id} className={feature===id?"active":""} onClick={()=>setFeature(id)}>{label}</button>)}</div></div></div><div className="catalogGrid">{list.map(s=><article className="catalogCard" key={s.id}><div className="catalogTop"><img src={s.icon} alt=""/><div><strong>{s.name}</strong><small>{s.category}</small></div></div><p>{s.bestFor}</p><div className="catalogMeta"><span>{s.price}</span><span>{s.difficulty}</span><span>{s.free?"무료 시작":"유료 중심"}</span></div><div className="catalogTags">{s.tags.slice(0,3).map(t=><span key={t}>{t}</span>)}</div><div className="catalogActions"><Link href={`/services/${s.id}`}>상세 보기</Link><a href={s.url} target="_blank" rel="noreferrer">공식 사이트</a></div></article>)}</div>{list.length===0&&<div className="emptyCatalog"><b>조건에 맞는 서비스가 없습니다.</b><p>검색어 또는 필터를 바꿔보세요.</p></div>}</section></main>;
}
