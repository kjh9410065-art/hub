/* HUB 서비스 카탈로그: 전체 서비스를 검색·분류·기능·비용 기준으로 탐색합니다. */
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { catalog, categoryGroups, matchesCategory } from "../lib/catalog";
import "./catalog.css";

const filters = categoryGroups.map((group) => [group.id, group.label]);
const featureFilters = [["전체", "전체"], ["image", "이미지"], ["video", "영상"], ["voice", "음성"], ["search", "검색"], ["text", "텍스트"]];

function readStoredList(key) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(value) ? value : [];
  } catch { return []; }
}

export default function CatalogPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [feature, setFeature] = useState("전체");
  const [onlyFree, setOnlyFree] = useState(false);
  const [onlyApi, setOnlyApi] = useState(false);
  const [sort, setSort] = useState("recommended");
  const [favorites, setFavorites] = useState([]);
  const [compare, setCompare] = useState([]);

  useEffect(() => {
    setFavorites(readStoredList("hub-favorites"));
    setCompare(readStoredList("hub-compare").slice(0, 4));
  }, []);
  useEffect(() => { localStorage.setItem("hub-favorites", JSON.stringify(favorites)); }, [favorites]);
  useEffect(() => { localStorage.setItem("hub-compare", JSON.stringify(compare)); }, [compare]);

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = catalog.filter((service) => {
      const text = [service.name, service.category, service.bestFor, service.caveat, ...(service.tags || []), ...(service.strengths || []), ...(service.uses || [])].join(" ").toLowerCase();
      if (q && !text.includes(q)) return false;
      if (!matchesCategory(service, category)) return false;
      if (feature !== "전체" && !service.features?.[feature]) return false;
      if (onlyFree && !service.free) return false;
      if (onlyApi && !service.api) return false;
      return true;
    });

    return filtered.sort((a, b) => {
      if (sort === "name") return a.name.localeCompare(b.name);
      if (sort === "easy") return (a.difficulty === "쉬움" ? 0 : 1) - (b.difficulty === "쉬움" ? 0 : 1);
      if (sort === "free") return Number(b.free) - Number(a.free) || Number(b.api) - Number(a.api);
      if (sort === "api") return Number(b.api) - Number(a.api) || Number(b.free) - Number(a.free);
      return Number(b.free) - Number(a.free) || Number(b.api) - Number(a.api);
    });
  }, [query, category, feature, onlyFree, onlyApi, sort]);

  const toggleFavorite = (id) => setFavorites((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  const toggleCompare = (id) => setCompare((current) => current.includes(id) ? current.filter((item) => item !== id) : current.length >= 4 ? current : [...current, id]);
  const resetFilters = () => { setQuery(""); setCategory("all"); setFeature("전체"); setOnlyFree(false); setOnlyApi(false); setSort("recommended"); };
  const activeCategory = filters.find(([id]) => id === category)?.[1] || "전체";

  return <main className="catalogPage">
    <header className="header catalogHeader"><Link className="logo" href="/">HUB</Link><nav><Link href="/recommend">추천받기</Link><Link href="/tools">무료 도구</Link><Link href="/compare">비교하기</Link></nav></header>
    <section className="catalogHero">
      <div className="eyebrow">HUB SERVICE CATALOG</div><h1>필요한 서비스를<br/><span>직접 찾아보세요.</span></h1><p>AI 모델부터 영상·이미지·음성·검색·인프라까지 한 곳에서 탐색할 수 있습니다.</p>
      <div className="catalogSearch"><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="서비스 이름, 기능, 용도로 검색" aria-label="서비스 검색"/><strong>{list.length}개</strong></div>
    </section>
    <section className="catalogBody">
      <div className="filterBlock">
        <div><b>분류</b><div className="filterScroll">{filters.map(([id, label]) => <button key={id} className={category === id ? "active" : ""} onClick={() => setCategory(id)}>{label}</button>)}</div></div>
        <div><b>기능</b><div className="filterScroll">{featureFilters.map(([id, label]) => <button key={id} className={feature === id ? "active" : ""} onClick={() => setFeature(id)}>{label}</button>)}</div></div>
        <div className="catalogOptions"><label><input type="checkbox" checked={onlyFree} onChange={(e) => setOnlyFree(e.target.checked)}/> 무료 시작</label><label><input type="checkbox" checked={onlyApi} onChange={(e) => setOnlyApi(e.target.checked)}/> API 제공</label><select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="정렬 방식"><option value="recommended">추천순</option><option value="free">무료 우선</option><option value="api">API 우선</option><option value="easy">쉬운 서비스 우선</option><option value="name">이름순</option></select></div>
      </div>
      <div className="catalogState"><span>{activeCategory}</span><span>{feature}</span>{onlyFree && <span>무료</span>}{onlyApi && <span>API</span>}<b>{list.length}개 결과</b>{(query || category !== "all" || feature !== "전체" || onlyFree || onlyApi) && <button type="button" onClick={resetFilters}>필터 초기화</button>}</div>
      <div className="catalogGrid">
        {list.map((s) => <article className="catalogCard" key={s.id}>
          <div className="catalogTop"><img src={s.icon} alt=""/><div><strong>{s.name}</strong><small>{s.category}</small></div><button type="button" className={`catalogFavorite ${favorites.includes(s.id) ? "active" : ""}`} onClick={() => toggleFavorite(s.id)}>{favorites.includes(s.id) ? "즐겨찾기됨" : "즐겨찾기"}</button></div>
          <p>{s.bestFor}</p><div className="catalogMeta"><span>{s.price}</span><span>{s.difficulty}</span><span>{s.free ? "무료 시작" : "유료 중심"}</span>{s.api && <span>API</span>}</div>
          <div className="catalogTags">{(s.tags || []).slice(0, 3).map((tag) => <span key={tag}>{tag}</span>)}</div>
          <div className="catalogActions"><Link href={`/services/${s.id}`}>상세 보기</Link><a href={s.url} target="_blank" rel="noreferrer">공식 사이트</a><button type="button" onClick={() => toggleCompare(s.id)}>{compare.includes(s.id) ? "비교 선택됨" : "비교하기"}</button></div>
        </article>)}
      </div>
      {list.length === 0 && <div className="emptyCatalog"><b>조건에 맞는 서비스가 없습니다.</b><p>검색어 또는 필터를 바꿔보세요.</p><button type="button" onClick={resetFilters}>필터 초기화</button></div>}
    </section>
    {compare.length > 0 && <div className="catalogCompareBar"><strong>비교함 {compare.length}/4</strong><span>{compare.map((id) => catalog.find((s) => s.id === id)?.name).filter(Boolean).join(" · ")}</span><Link href="/compare">비교 화면 열기</Link></div>}
  </main>;
}
