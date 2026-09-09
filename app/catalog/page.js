/* HUB 서비스 카탈로그: 전체 서비스를 검색·분류·기능·비용 기준으로 탐색합니다. */
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { catalog, categoryGroups, matchesCategory } from "../lib/catalog";
import { getSearchSuggestions, rankSearchResults } from "../lib/search";
import { getOutboundUrl, hasAffiliateLink, trackOutboundClick } from "../lib/affiliate-programs";
import "./catalog.css";

const filters = categoryGroups.map((group) => [group.id, group.label]);
const featureFilters = [["전체", "전체"], ["image", "이미지"], ["video", "영상"], ["voice", "음성"], ["chat", "챗봇"], ["search", "검색"], ["text", "텍스트"]];
const featureLabels = { text: "텍스트", image: "이미지", video: "영상", voice: "음성", search: "검색", chat: "챗봇" };

function readStoredList(key) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(value) ? value : [];
  } catch { return []; }
}

function serviceSupportsFeature(service, feature) {
  // features 또는 uses 중 한쪽에만 기능이 정의돼 있어도 필터에 포함합니다.
  return Boolean(service.features?.[feature] || service.uses?.includes(feature));
}

function getSupportedFeatures(service) {
  // 카탈로그 카드에는 실제 지원 기능 중 핵심 3개만 표시해 정보량을 제한합니다.
  return Object.keys(featureLabels).filter((key) => Boolean(service.features?.[key] || service.uses?.includes(key))).slice(0, 3);
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

  // 정적 export에서는 useSearchParams()가 빌드 시 Suspense 경계를 요구합니다.
  // 대신 브라우저에서 마운트된 뒤 현재 URL을 읽어 카테고리 딥링크를 적용합니다.
  useEffect(() => {
    const requestedCategory = new URLSearchParams(window.location.search).get("category");
    if (requestedCategory && categoryGroups.some((group) => group.id === requestedCategory)) {
      setCategory(requestedCategory);
    }
  }, []);

  useEffect(() => {
    setFavorites(readStoredList("hub-favorites"));
    setCompare(readStoredList("hub-compare").slice(0, 4));
  }, []);
  useEffect(() => { localStorage.setItem("hub-favorites", JSON.stringify(favorites)); }, [favorites]);
  useEffect(() => { localStorage.setItem("hub-compare", JSON.stringify(compare)); }, [compare]);

  const list = useMemo(() => {
    const searched = rankSearchResults(catalog, query);
    const filtered = searched.filter((service) => {
      if (!matchesCategory(service, category)) return false;
      if (feature !== "전체" && !serviceSupportsFeature(service, feature)) return false;
      if (onlyFree && !service.free) return false;
      if (onlyApi && !service.api) return false;
      return true;
    });
    if (sort === "recommended") return filtered;
    return [...filtered].sort((a, b) => {
      if (sort === "name") return a.name.localeCompare(b.name);
      if (sort === "easy") return (a.difficulty === "쉬움" ? 0 : 1) - (b.difficulty === "쉬움" ? 0 : 1);
      if (sort === "free") return Number(b.free) - Number(a.free) || Number(b.api) - Number(a.api);
      if (sort === "api") return Number(b.api) - Number(a.api) || Number(b.free) - Number(a.free);
      return 0;
    });
  }, [query, category, feature, onlyFree, onlyApi, sort]);

  const suggestions = useMemo(() => {
    if (!query.trim() || list.length > 0) return [];
    return getSearchSuggestions(catalog, query, { onlyFree, onlyApi }).slice(0, 3);
  }, [query, list.length, onlyFree, onlyApi]);

  const toggleFavorite = (id) => setFavorites((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  const toggleCompare = (id) => setCompare((current) => current.includes(id) ? current.filter((item) => item !== id) : current.length >= 4 ? current : [...current, id]);
  const resetFilters = () => { setQuery(""); setCategory("all"); setFeature("전체"); setOnlyFree(false); setOnlyApi(false); setSort("recommended"); };
  const activeCategory = filters.find(([id]) => id === category)?.[1] || "전체";
  const openService = (service, source) => trackOutboundClick(service, source);

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
      {list.length > 0 && <div className="catalogGrid">
        {list.map((s, index) => {
          const affiliate = hasAffiliateLink(s);
          const supportedFeatures = getSupportedFeatures(s);
          return <article className={`catalogCard ${affiliate ? "affiliateCard" : ""} ${index < 3 ? "catalogTopResult" : ""}`} key={s.id}>
            <div className="catalogRankLine"><span>{index < 3 ? `추천 ${index + 1}` : "서비스"}</span><span>{s.category}</span></div>
            <div className="catalogTop"><img src={s.icon} alt=""/><div><strong>{s.name}</strong><small>{s.bestFor}</small></div><button type="button" className={`catalogFavorite ${favorites.includes(s.id) ? "active" : ""}`} onClick={() => toggleFavorite(s.id)}>{favorites.includes(s.id) ? "즐겨찾기됨" : "즐겨찾기"}</button></div>
            <div className="catalogFeatureRow">{supportedFeatures.map((key) => <span key={key}>{featureLabels[key]}</span>)}{s.api && <span className="catalogApiBadge">API</span>}</div>
            <div className="catalogMeta"><span>{s.price}</span><span>{s.difficulty}</span><span className={s.free ? "catalogFreeBadge" : ""}>{s.free ? "무료 시작" : "유료 중심"}</span></div>
            <div className="catalogTags">{(s.tags || []).slice(0, 3).map((tag) => <span key={tag}>{tag}</span>)}</div>
            <div className="catalogActions"><Link href={`/services/${s.id}`}>자세히 보기</Link><a className={affiliate ? "affiliateCatalogLink" : ""} href={getOutboundUrl(s)} target="_blank" rel="nofollow sponsored noopener noreferrer" onClick={() => openService(s, "catalog")}>{affiliate ? "서비스 시작하기" : "공식 사이트"}</a><button type="button" onClick={() => toggleCompare(s.id)}>{compare.includes(s.id) ? "비교 선택됨" : "비교하기"}</button></div>
            {affiliate && <p className="affiliateCatalogDisclosure">제휴 링크를 통해 가입하면 HUB가 제휴 수수료를 받을 수 있습니다.</p>}
          </article>;
        })}
      </div>}
      {list.length === 0 && <div className="emptyCatalog"><b>{query.trim() ? "검색 결과가 없습니다." : "조건에 맞는 서비스가 없습니다."}</b><p>{query.trim() ? "입력한 목적과 가까운 서비스를 대신 찾아봤어요." : "검색어 또는 필터를 바꿔보세요."}</p>{suggestions.length > 0 && <div className="searchSuggestions"><strong>이런 서비스를 찾아보세요</strong><div>{suggestions.map((service) => <Link key={service.id} href={`/services/${service.id}`} className="searchSuggestionCard"><img src={service.icon} alt=""/><span><b>{service.name}</b><small>{service.bestFor}</small></span><i aria-hidden="true">›</i></Link>)}</div></div>}<button type="button" onClick={resetFilters}>필터 초기화</button></div>}
    </section>
    {compare.length > 0 && <div className="catalogCompareBar"><strong>비교함 {compare.length}/4</strong><span>{compare.map((id) => catalog.find((s) => s.id === id)?.name).filter(Boolean).join(" · ")}</span><Link href="/compare">비교 화면 열기</Link></div>}
  </main>;
}
