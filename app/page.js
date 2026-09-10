"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { catalog, catalogMap, categoryGroups, matchesCategory } from "./lib/catalog";
import { rankServices } from "./lib/recommendation";
import { matchesSearch, rankSearchResults, scoreSearch, getSearchSuggestions } from "./lib/search";
import "./home.css";
import "./home-responsive.css";
import "./home-polish.css";

// 목적 카드에는 HUB 전용 SVG 일러스트를 사용합니다.
const tasks = [
  { id: "shorts", icon: "/illustrations/task-short-v2.svg", title: "쇼츠 만들기", desc: "이미지·영상·음성까지 한 번에" },
  { id: "image", icon: "/illustrations/task-image-v2.svg", title: "AI 이미지 만들기", desc: "생성·편집·상품 이미지" },
  { id: "video", icon: "/illustrations/task-video-v2.svg", title: "AI 영상 만들기", desc: "텍스트·이미지로 영상 생성" },
  { id: "voice", icon: "/illustrations/task-voice-v2.svg", title: "AI 음성 만들기", desc: "음성 생성·더빙·변환" },
  { id: "chat", icon: "/illustrations/task-chat-v2.svg", title: "AI 챗봇 만들기", desc: "LLM API로 서비스 개발" },
  { id: "api", icon: "/illustrations/task-api-v2.svg", title: "개발용 API 찾기", desc: "검색·크롤링·AI 인프라" }
];

const categories = categoryGroups.filter((group) => group.id !== "all");
const featureFilters = ["전체", "텍스트", "이미지", "영상", "음성", "검색", "API"];
const featureLabels = { text: "텍스트", image: "이미지", video: "영상", voice: "음성", search: "검색" };

function serviceSupports(service, feature) {
  if (feature === "전체") return true;
  if (feature === "API") return Boolean(service.api);
  const key = { 텍스트: "text", 이미지: "image", 영상: "video", 음성: "voice", 검색: "search" }[feature];
  return Boolean(key && (service.features?.[key] || service.uses?.includes(key)));
}

// 카드에 표시할 실제 지원 기능을 features와 uses 양쪽에서 합칩니다.
function getSupportedFeatures(service) {
  return Object.keys(featureLabels).filter((key) => Boolean(service.features?.[key] || service.uses?.includes(key)));
}

function getCategoryCount(categoryId) {
  return catalog.filter((service) => matchesCategory(service, categoryId)).length;
}

export default function HomePage() {
  const [selectedTask, setSelectedTask] = useState("shorts");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [feature, setFeature] = useState("전체");
  const [onlyFree, setOnlyFree] = useState(false);
  const [onlyApi, setOnlyApi] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [compare, setCompare] = useState([]);

  useEffect(() => {
    try {
      setFavorites(JSON.parse(localStorage.getItem("hub-favorites") || "[]"));
      setCompare(JSON.parse(localStorage.getItem("hub-compare") || "[]").slice(0, 4));
    } catch {
      setFavorites([]);
      setCompare([]);
    }
  }, []);

  useEffect(() => { localStorage.setItem("hub-favorites", JSON.stringify(favorites)); }, [favorites]);
  useEffect(() => { localStorage.setItem("hub-compare", JSON.stringify(compare)); }, [compare]);

  const ranked = useMemo(() => rankServices(catalog, {
    goal: selectedTask,
    budget: onlyFree ? "free" : "any",
    skill: "any",
    feature: feature === "전체" ? "all" : feature
  }).map((item) => ({
    ...item.service,
    recommendationScore: item.score,
    recommendationReasons: item.reasons || []
  })), [selectedTask, onlyFree, feature]);

  const searchedRanked = useMemo(() => rankSearchResults(ranked, query), [ranked, query]);

  const results = useMemo(() => searchedRanked.filter((service) => {
    if (!matchesCategory(service, category)) return false;
    if (!serviceSupports(service, feature)) return false;
    if (onlyFree && !service.free) return false;
    if (onlyApi && !service.api) return false;
    return matchesSearch(service, query);
  }), [searchedRanked, query, category, feature, onlyFree, onlyApi]);

  // 검색 결과가 없을 때 검색 엔진이 계산한 목적 기반 대안을 보여줍니다.
  const suggestions = useMemo(() => {
    if (!query.trim() || results.length > 0) return [];
    return getSearchSuggestions(catalog, query, { onlyFree, onlyApi }).slice(0, 3);
  }, [query, results.length, onlyFree, onlyApi]);

  const visibleResults = results.slice(0, 5);
  const activeTask = tasks.find((task) => task.id === selectedTask) || tasks[0];
  const isSearching = Boolean(query.trim());

  const toggleFavorite = (id) => setFavorites((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  const toggleCompare = (id) => setCompare((current) => current.includes(id) ? current.filter((item) => item !== id) : current.length >= 4 ? current : [...current, id]);
  const resetFilters = () => { setQuery(""); setCategory("all"); setFeature("전체"); setOnlyFree(false); setOnlyApi(false); };

  return (
    <main className="homePage">
      <header className="homeHeader">
        <Link className="brand" href="/" aria-label="HUB 홈">HUB</Link>
        <nav className="topNav" aria-label="주요 메뉴">
          <Link href="/recommend">추천</Link><Link href="/catalog">전체 서비스</Link><Link href="/tools">무료 도구</Link><Link href="/compare">비교함{compare.length ? ` ${compare.length}` : ""}</Link>
        </nav>
      </header>

      <section className="stepSection stepOne">
        <div className="stepHeading"><p className="sectionKicker">STEP 01</p><h1>무엇을 만들고 있나요?</h1><p>목적에 맞는 AI 서비스를 먼저 추천해드려요.</p></div>
        <div className="taskList">
          {tasks.map((task) => <button key={task.id} type="button" className={`taskCard ${selectedTask === task.id ? "isActive" : ""}`} onClick={() => setSelectedTask(task.id)} aria-pressed={selectedTask === task.id}><img src={task.icon} alt="" className="taskIllustration" /><span className="taskCopy"><strong>{task.title}</strong><small>{task.desc}</small></span><span className="taskChevron" aria-hidden="true">›</span></button>)}
        </div>
      </section>

      <section className="stepSection recommendationStep">
        <div className="stepHeading compactHeading"><p className="sectionKicker">STEP 02 · RECOMMEND</p><h2>{activeTask.title}에 맞는 서비스</h2><p>목적과 기능을 함께 계산해 지금 조건에 맞는 순서로 보여드려요.</p></div>
        <div className="recommendTabs" role="tablist" aria-label="추천 정렬"><button type="button" className="active" aria-selected="true">추천순</button><label><input type="checkbox" checked={onlyFree} onChange={(event) => setOnlyFree(event.target.checked)} /> 무료만</label><label><input type="checkbox" checked={onlyApi} onChange={(event) => setOnlyApi(event.target.checked)} /> API 제공</label><Link href={`/recommend?task=${selectedTask}`}>조건 더 고르기</Link></div>

        <div className="searchBox compactSearch">
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="서비스 이름, 기능, 용도로 검색" aria-label="서비스 검색" />
          {query && <button type="button" onClick={() => setQuery("")}>지우기</button>}
        </div>
        <div className="featureFilters" aria-label="기능 필터">{featureFilters.map((item) => <button key={item} type="button" className={feature === item ? "active" : ""} onClick={() => setFeature(item)} aria-pressed={feature === item}>{item}</button>)}</div>
        <div className="resultMeta"><span>{isSearching ? `검색 결과 ${results.length}개` : `${results.length}개 서비스 중 상위 ${Math.min(5, results.length)}개`}</span>{(query || category !== "all" || feature !== "전체" || onlyFree || onlyApi) && <button type="button" onClick={resetFilters}>필터 초기화</button>}</div>

        {visibleResults.length === 0 ? (
          <div className="emptyState">
            <strong>{isSearching ? "검색 결과가 없습니다." : "조건에 맞는 서비스가 없습니다."}</strong>
            <p>{isSearching ? "비슷한 목적의 서비스를 확인해보세요." : "검색어나 필터를 조금 완화해보세요."}</p>
            {suggestions.length > 0 && <div className="emptySuggestions"><b>이런 서비스는 어떠세요?</b><div className="suggestionList">{suggestions.map((service) => <Link key={service.id} href={`/services/${service.id}`} className="suggestionCard"><img src={service.icon} alt=""/><span><strong>{service.name}</strong><small>{service.bestFor}</small></span><i aria-hidden="true">›</i></Link>)}</div></div>}
            <button type="button" onClick={resetFilters}>필터 초기화</button>
          </div>
        ) : (
          <div className="serviceList">
            {visibleResults.map((service, index) => {
              const isFavorite = favorites.includes(service.id);
              const isCompared = compare.includes(service.id);
              const reasons = service.recommendationReasons?.length ? service.recommendationReasons : [service.bestFor];
              const searchResult = isSearching ? scoreSearch(service, query) : null;
              const displayReasons = searchResult?.reasons?.length ? searchResult.reasons : reasons;
              const supportedFeatures = getSupportedFeatures(service).slice(0, 3);
              return <article className={`serviceCard ${index === 0 ? "topMatch" : ""}`} key={service.id}>
                <div className="serviceMain"><div className="serviceIconWrap"><img src={service.icon} alt="" className="serviceIconImage" /></div><div className="serviceInfo"><div className="serviceTitleRow"><Link href={`/services/${service.id}`} className="serviceName">{service.name}</Link>{index === 0 && <span className="matchBadge">{isSearching ? "검색 일치" : "추천"}</span>}{service.free && <span className="freeBadge">무료 시작</span>}</div><p className="serviceBest">{service.bestFor}</p><div className="serviceMetaRow"><span>{service.price}</span><span>{service.difficulty}</span>{service.free && <span className="isPositive">무료 시작</span>}{service.api && <span className="isApi">API</span>}</div>{supportedFeatures.length > 0 && <div className="tagList">{supportedFeatures.map((key) => <span key={key}>{featureLabels[key]}</span>)}</div>}<div className="recommendReason" aria-label={isSearching ? "검색 일치 이유" : "추천 이유"}><span className="recommendReasonLabel">{isSearching ? "검색 일치" : "추천 이유"}</span><span>{displayReasons.slice(0, 2).join(" · ")}</span></div></div><button type="button" className={`favoriteButton ${isFavorite ? "isFavorite" : ""}`} onClick={() => toggleFavorite(service.id)} aria-label={isFavorite ? "즐겨찾기 해제" : "즐겨찾기 추가"}>{isFavorite ? "저장됨" : "저장"}</button></div>
                <div className="serviceActions"><Link href={`/services/${service.id}`} className="detailButton">자세히 보기</Link><button type="button" className={`compareButton ${isCompared ? "selected" : ""}`} onClick={() => toggleCompare(service.id)}>{isCompared ? "비교함에서 제거" : "비교하기"}</button></div>
              </article>;
            })}
          </div>
        )}
        <Link className="moreLink" href={`/recommend?task=${selectedTask}`}>조건을 더 고르고 전체 추천 보기</Link>
      </section>

      <section className="stepSection categoryStep"><div className="stepHeading compactHeading"><p className="sectionKicker">STEP 03</p><h2>서비스를 한눈에 둘러보세요.</h2><p>인기 있는 AI 서비스를 카테고리별로 확인하세요.</p></div><div className="categoryList">{categories.map((group) => <Link key={group.id} href={`/catalog?category=${group.id}`} className="categoryCard"><img src={tasks.find((task) => task.id === ({ llm: "chat", image: "image", video: "video", voice: "voice", search: "api", developer: "api", infra: "api", design: "image" }[group.id] || "api"))?.icon || "/icon.svg"} alt="" /><span>{group.label}</span><b>{getCategoryCount(group.id)}개</b><i aria-hidden="true">›</i></Link>)}</div></section>
      <section className="stepSection compareStep"><div className="stepHeading compactHeading"><p className="sectionKicker">STEP 04</p><h2>서비스를 고르기 전에<br />비교부터 해보세요.</h2><p>최대 4개의 서비스를 한 번에 비교해서 나에게 가장 잘 맞는 서비스를 찾아보세요.</p></div><Link href="/compare" className="compareCta"><span className="compareCtaIcon" aria-hidden="true">+</span><span><strong>서비스 비교하기</strong><small>최대 4개의 서비스를 한 번에 비교</small></span><b aria-hidden="true">›</b></Link></section>
      {compare.length > 0 && <div className="compareBar"><div className="compareBarInfo"><div className="compareBarTitle"><strong>비교함</strong><span>{compare.length}/4개 선택</span></div><div className="compareBarHint">{compare.length < 4 ? "서비스를 더 추가해 비교해보세요!" : "선택한 서비스를 비교해보세요."}</div><div className="compareSelectedIcons" aria-label="선택한 서비스">{compare.map((id) => <span className="compareSelectedIcon" key={id} title={catalogMap[id]?.name}><img src={catalogMap[id]?.icon} alt={catalogMap[id]?.name || ""}/></span>)}{compare.length < 4 && <span className="compareSelectedIcon compareAddIcon" aria-hidden="true">+</span>}</div></div><div className="compareBarActions"><button type="button" className="compareReset" onClick={() => setCompare([])}>전체 해제</button><Link className="compareGo" href="/compare">비교 화면 열기</Link></div></div>}
      <footer className="homeFooter"><div><strong>HUB</strong><span>목적에 맞는 AI·개발 서비스 탐색</span></div><div className="footerLinks"><Link href="/recommend">추천</Link><Link href="/catalog">카탈로그</Link><Link href="/tools">무료 도구</Link><Link href="/compare">비교</Link></div></footer>
    </main>
  );
}
