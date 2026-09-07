/* HUB 1.6 비교 화면: 추천·카탈로그·도구와 동일한 전체 서비스 카탈로그를 사용합니다. */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { catalog, catalogMap } from "../lib/catalog";
import "./compare.css";

const fallback = catalog.slice(0, 4).map((service) => service.id);
const rows = [["category", "분류"], ["price", "비용 부담"], ["free", "무료 시작"], ["difficulty", "개발 난이도"], ["api", "API"], ["image", "이미지"], ["video", "영상"], ["voice", "음성"], ["search", "검색"], ["bestFor", "추천 용도"], ["strengths", "강점"], ["caveat", "주의할 점"]];

function featureValue(service, key) {
  if (["image", "video", "voice", "search"].includes(key)) return service.features?.[key] ? "지원" : "미지원";
  if (key === "free") return service.free ? "가능" : "없음";
  if (key === "api") return service.api ? "제공" : "확인 필요";
  if (key === "strengths") return service.strengths?.join(" · ") || "—";
  return service[key] ?? "—";
}

export default function Compare() {
  const [selected, setSelected] = useState([]);
  useEffect(() => { try { const raw = JSON.parse(localStorage.getItem("hub-compare") || "[]"); setSelected(raw.filter((id) => catalogMap[id]).slice(0, 4)); } catch { setSelected([]); } }, []);
  const list = selected.length ? selected : fallback;
  const remove = (id) => { const next = selected.filter((item) => item !== id); setSelected(next); localStorage.setItem("hub-compare", JSON.stringify(next)); };
  const clear = () => { setSelected([]); localStorage.removeItem("hub-compare"); };

  return <main className="page comparePage compareModern">
    <header className="header"><Link className="logo" href="/">HUB</Link><nav><Link href="/catalog">서비스 찾기</Link><Link href="/recommend">추천받기</Link><Link href="/tools">무료 도구</Link></nav></header>
    <section className="guideHero compareHero"><div className="eyebrow">SERVICE COMPARE · HUB 1.6</div><h1>선택지를 한눈에,<br /><span>내게 맞는 쪽을 비교하세요.</span></h1><p>최대 4개 서비스를 비용·기능·난이도 기준으로 비교합니다.</p></section>
    <section className="section compareSection">
      <div className="compareToolbar"><div><b>{selected.length || 4}개 서비스</b><span>{selected.length ? "추천에서 선택한 서비스" : "기본 비교 목록"}</span></div><div className="toolbarActions"><Link href="/recommend">서비스 더 고르기</Link>{selected.length > 0 && <button onClick={clear}>전체 해제</button>}</div></div>
      <div className="compareDesktop"><div className="compareMatrixHead"><div className="matrixLabel">비교 항목</div>{list.map((id) => <div className="matrixService" key={id}><img src={catalogMap[id].icon} alt="" /><strong>{catalogMap[id].name}</strong>{selected.includes(id) && <button onClick={() => remove(id)} aria-label={`${catalogMap[id].name} 제거`}>제거</button>}</div>)}</div>{rows.map(([key, label]) => <div className="compareMatrixRow" key={key}><div className="matrixLabel">{label}</div>{list.map((id) => <div key={id} className={key === "bestFor" ? "matrixStrong" : ""}>{featureValue(catalogMap[id], key)}</div>)}</div>)}</div>
      <div className="compareMobile">{list.map((id, index) => { const service = catalogMap[id]; return <article className={`mobileCompareCard ${index === 0 ? "featured" : ""}`} key={id}><header><div className="mobileServiceIcon"><img src={service.icon} alt="" /></div><div><strong>{service.name}</strong><small>{service.category}</small></div>{selected.includes(id) && <button onClick={() => remove(id)} aria-label={`${service.name} 제거`}>제거</button>}</header><div className="mobileScore"><span>{index === 0 ? "비교 기준 추천" : "비교 대상"}</span><b>{service.price}</b></div><dl>{rows.slice(2, 11).map(([key, label]) => <div key={key}><dt>{label}</dt><dd>{featureValue(service, key)}</dd></div>)}</dl><a href={`/services/${service.id}`}>상세 정보 보기</a></article>; })}</div>
      <Link className="primaryLink compareBottomLink" href="/recommend">내 조건으로 다시 추천받기</Link>
    </section>
  </main>;
}
