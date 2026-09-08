"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { catalog, categoryGroups, matchesCategory } from "./lib/catalog";
import { rankServices } from "./lib/recommendation";
import "./home.css";

// 목적 카드에는 운영체제별 이모지가 아니라 HUB 전용 SVG 일러스트만 사용합니다.
const tasks = [
  { id: "shorts", icon: "/illustrations/task-short.svg", title: "쇼츠 만들기", desc: "이미지·영상·음성까지 한 번에" },
  { id: "image", icon: "/illustrations/task-image-new.svg", title: "AI 이미지 만들기", desc: "생성·편집·상품 이미지" },
  { id: "video", icon: "/illustrations/task-video-new.svg", title: "AI 영상 만들기", desc: "텍스트·이미지로 영상 생성" },
  { id: "voice", icon: "/illustrations/task-voice-new.svg", title: "AI 음성 만들기", desc: "음성 생성·더빙·변환" },
  { id: "chat", icon: "/illustrations/task-chat-new.svg", title: "AI 챗봇 만들기", desc: "LLM API로 서비스 개발" },
  { id: "api", icon: "/illustrations/task-api-new.svg", title: "개발용 API 찾기", desc: "검색·크롤링·AI 인프라" }
];

const categories = categoryGroups.map((group) => [group.id, group.label]);
const featureFilters = ["전체", "텍스트", "이미지", "영상", "음성", "검색", "API"];

function serviceSupports(service, feature) {
  if (feature === "전체") return true;
  if (feature === "API") return Boolean(service.api);
  const key = { 텍스트: "text", 이미지: "image", 영상: "video", 음성: "voice", 검색: "search" }[feature];
  return Boolean(key && service.features?.[key]);
}

function searchable(service) {
  return [service.name, service.category, service.bestFor, service.caveat, ...(service.tags || []), ...(service.uses || []), ...(service.strengths || [])].filter(Boolean).join(" ").toLowerCase();
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
      const storedFavorites = JSON.parse(localStorage.getItem("hub-favorites") || "[]");
      const storedCompare = JSON.parse(localStorage.getItem("hub-compare") || "[]");
      setFavorites(Array.isArray(storedFavorites) ? storedFavorites : []);
      setCompare(Array.isArray(storedCompare) ? storedCompare.slice(0, 4) : []);
    } catch {
      setFavorites([]);
      setCompare([]);
    }
  }, []);

  useEffect(() => { localStorage.setItem("hub-favorites", JSON.stringify(favorites)); }, [favorites]);
  useEffect(() => { localStorage.setItem("hub-compare", JSON.stringify(compare)); }, [compare]);

  const ranked = useMemo(() => rankServices(catalog, {
    goal: selectedTask,
    budget: "any",
    skill: "any",
    feature: feature === "전체" ? "all" : feature
  }), [selectedTask, feature]);

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return ranked.filter((service) => {
      if (!matchesCategory(service, category)) return false;
      if (!serviceSupports(service, feature)) return false;
      if (onlyFree && !service.free) return false;
      if (onlyApi && !service.api) return false;
      return !needle || searchable(service).includes(needle);
    });
  }, [ranked, query, category, feature, onlyFree, onlyApi]);

  const toggleFavorite = (id) => setFavorites((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  const toggleCompare = (id) => setCompare((current) => current.includes(id) ? current.filter((item) => item !== id) : current.length >= 4 ? current : [...current, id]);
  const resetFilters = () => {
    setQuery("");
    setCategory("all");
    setFeature("전체");
    setOnlyFree(false);
    setOnlyApi(false);
  };
  const activeTask = tasks.find((task) => task.id === selectedTask) || tasks[0];
  const activeCategory = categories.find(([id]) => id === category)?.[1] || "전체";

  return (
    <main className="homePage">
      <header className="homeHeader">
        <Link className="brand" href="/">HUB</Link>
        <nav className="topNav" aria-label="주요 메뉴">
          <Link href="/recommend">추천</Link>
          <Link href="/catalog">전체 서비스</Link>
          <Link href="/tools">무료 도구</Link>
          <Link href="/compare">비교함{compare.length ? ` ${compare.length}` : ""}</Link>
        </nav>
      </header>

      <section className="heroSection">
        <div className="heroCopy">
          <p className="eyebrow">AI SERVICE HUB</p>
          <h1>무엇을 만들고 싶으세요?</h1>
          <p className="heroLead">목적을 고르면 지금 쓸 만한 AI·개발 서비스를 먼저 찾아드립니다.</p>
          <div className="heroActions"><Link href="/recommend" className="primaryButton">맞춤 추천 받기</Link><Link href="/catalog" className="secondaryButton">전체 카탈로그 보기</Link></div>
        </div>
        <div className="heroStat"><strong>{catalog.length}</strong><span>서비스를 한곳에서 비교</span></div>
      </section>

      <section className="taskSection">
        <div className="sectionHeading"><div><p className="sectionKicker">START HERE</p><h2>만들고 싶은 것을 선택하세요</h2></div><span>{activeTask.title}</span></div>
        <div className="taskGrid">{tasks.map((task) => <button key={task.id} type="button" className={`taskCard ${selectedTask === task.id ? "isActive" : ""}`} onClick={() => setSelectedTask(task.id)}><img src={task.icon} alt="" className="taskIllustration" /><span className="taskTitle">{task.title}</span><span className="taskDesc">{task.desc}</span></button>)}</div>
      </section>

      <section className="searchSection">
        <div className="searchBox"><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="서비스 이름, 기능, 용도로 검색" aria-label="서비스 검색" />{query && <button type="button" onClick={() => setQuery("")}>지우기</button>}</div>
        <div className="filterRow">
          <div className="filterGroup" aria-label="카테고리 필터">{categories.map(([id, label]) => <button key={id} type="button" className={category === id ? "active" : ""} onClick={() => setCategory(id)}>{label}</button>)}</div>
          <div className="filterGroup featureGroup" aria-label="기능 필터">{featureFilters.map((item) => <button key={item} type="button" className={feature === item ? "active" : ""} onClick={() => setFeature(item)}>{item}</button>)}</div>
          <label className="checkFilter"><input type="checkbox" checked={onlyFree} onChange={(event) => setOnlyFree(event.target.checked)} /> 무료 우선</label>
          <label className="checkFilter"><input type="checkbox" checked={onlyApi} onChange={(event) => setOnlyApi(event.target.checked)} /> API 제공</label>
        </div>
        <div className="activeFilters"><span>{activeCategory}</span><span>{feature}</span>{onlyFree && <span>무료</span>}{onlyApi && <span>API</span>}<b>{results.length}개 결과</b>{(query || category !== "all" || feature !== "전체" || onlyFree || onlyApi) && <button type="button" onClick={resetFilters}>필터 초기화</button>}</div>
      </section>

      <section className="resultSection">
        <div className="resultHeading"><div><p className="sectionKicker">RECOMMENDED</p><h2>{activeTask.title}에 맞는 서비스</h2></div><span>{results.length}개 결과</span></div>
        {results.length === 0 ? <div className="emptyState"><strong>조건에 맞는 서비스가 없습니다.</strong><p>필터를 조금 완화하거나 전체 카탈로그에서 다시 찾아보세요.</p><button type="button" onClick={resetFilters}>필터 초기화</button></div> : <div className="serviceGrid">{results.map((service, index) => {
          const isFavorite = favorites.includes(service.id);
          const isCompared = compare.includes(service.id);
          return <article className={`serviceCard ${index === 0 && !query ? "topMatch" : ""}`} key={service.id}>
            <div className="cardTop"><div className="serviceIconWrap"><img src={service.icon} alt="" className="serviceIconImage" /></div><div className="cardBadges">{index === 0 && !query && <span className="matchBadge">TOP MATCH</span>}{service.free && <span>무료 사용 가능</span>}{service.api && <span>API</span>}</div><button type="button" className={`favoriteButton ${isFavorite ? "isFavorite" : ""}`} onClick={() => toggleFavorite(service.id)} aria-label={isFavorite ? "즐겨찾기 해제" : "즐겨찾기 추가"}>{isFavorite ? "즐겨찾기됨" : "즐겨찾기"}</button></div>
            <Link href={`/services/${service.id}`} className="serviceName">{service.name}</Link><p className="serviceCategory">{service.category} · {service.difficulty || "보통"}</p><p className="serviceBest">{service.bestFor}</p>
            <div className="tagList">{(service.tags || []).slice(0, 3).map((tag) => <span key={tag}>{tag}</span>)}</div>
            <div className="cardBottom"><Link href={`/services/${service.id}`} className="detailLink">자세히 보기</Link><button type="button" className={`compareButton ${isCompared ? "selected" : ""}`} onClick={() => toggleCompare(service.id)}>{isCompared ? "비교함에서 제거" : "비교하기"}</button></div>
          </article>;
        })}</div>}
      </section>

      {compare.length > 0 && <div className="compareBar"><div><strong>비교함</strong><span>{compare.length}/4개 선택</span></div><div className="compareBarActions"><button type="button" onClick={() => setCompare([])}>전체 해제</button><Link href="/compare">비교 화면 열기</Link></div></div>}
      <footer className="homeFooter"><div><strong>HUB</strong><span>목적에 맞는 AI·개발 서비스 탐색</span></div><div className="footerLinks"><Link href="/recommend">추천</Link><Link href="/catalog">카탈로그</Link><Link href="/tools">무료 도구</Link><Link href="/compare">비교</Link></div></footer>
    </main>
  );
}
