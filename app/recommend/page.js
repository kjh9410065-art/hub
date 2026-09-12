/* MOVA 추천 화면: 목적, 예산, 난이도, 핵심 기능과 자연어 요구사항을 함께 반영합니다. */
"use client";

import { useEffect, useMemo, useState } from "react";
import "./recommend.css";
import "./recommend-next.css";
import "./mobile-ui-fix.css";
import { catalog, catalogMap } from "../lib/catalog";
import { rankServices } from "../lib/recommendation";
import { rankSearchResults, scoreSearch } from "../lib/search";
import { parseRecommendationIntent } from "../lib/recommendation-intent";
import { getAffiliateDisclosure, getOutboundUrl, hasAffiliateLink, trackOutboundClick } from "../lib/affiliate-programs";

// 목적 카드에는 MOVA 전용 SVG 일러스트만 사용합니다.
const goals = [
  ["shorts", "/illustrations/task-short.svg", "쇼츠 만들기", "이미지·영상·음성을 조합해 콘텐츠 제작"],
  ["image", "/illustrations/task-image-new.svg", "AI 이미지 만들기", "생성·편집·상품 이미지 제작"],
  ["video", "/illustrations/task-video-new.svg", "AI 영상 만들기", "텍스트·이미지 기반 영상 제작"],
  ["voice", "/illustrations/task-voice-new.svg", "AI 음성 만들기", "TTS·더빙·음성 콘텐츠 제작"],
  ["chat", "/illustrations/task-chat-new.svg", "AI 챗봇 만들기", "LLM을 활용한 서비스 개발"],
  ["api", "/illustrations/task-api-new.svg", "개발용 API 찾기", "검색·크롤링·AI 인프라 연결"]
];
const budgetOptions = [["free", "무료 우선"], ["low", "저렴하게 시작"], ["any", "비용 상관없음"]];
const skillOptions = [["easy", "초보"], ["medium", "보통"], ["hard", "개발자"]];
const featureOptions = [["all", "상관없음"], ["이미지", "이미지"], ["영상", "영상"], ["음성", "음성"], ["챗봇", "챗봇"], ["검색", "검색"]];

// 추천 점수를 0~5점, 0.5점 단위의 별점으로 변환합니다.
function getStarRating(score) {
  const normalized = Math.max(0, Math.min(5, Number(score || 0) / 20));
  return Math.round(normalized * 2) / 2;
}

// 숫자 점수 대신 별 5개로 추천 결과를 보여줍니다.
function StarRating({ score }) {
  const rating = getStarRating(score);
  return <div className="recommendStarRating" role="img" aria-label={`MOVA 추천 별점 ${rating.toFixed(1)}점 / 5점`}>
    {Array.from({ length: 5 }, (_, index) => {
      const value = index + 1;
      const type = rating >= value ? "filled" : rating >= value - 0.5 ? "half" : "emptyStar";
      return <span className={`recommendRatingStar ${type}`} key={value} aria-hidden="true">★</span>;
    })}
  </div>;
}

function readCompare() {
  try {
    const raw = JSON.parse(localStorage.getItem("hub-compare") || "[]");
    return Array.isArray(raw) ? raw.filter((id) => catalogMap[id]).slice(0, 4) : [];
  } catch { return []; }
}

export default function RecommendPage() {
  const [goal, setGoal] = useState("shorts");
  const [budget, setBudget] = useState("low");
  const [skill, setSkill] = useState("easy");
  const [feature, setFeature] = useState("all");
  const [query, setQuery] = useState("");
  const [compare, setCompare] = useState([]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const requestedGoal = params.get("goal") || params.get("task");
    if (goals.some((item) => item[0] === requestedGoal)) setGoal(requestedGoal);
    setCompare(readCompare());
  }, []);

  // 자연어 검색어에서 명확하게 드러나는 목적·예산·난이도·기능을 읽어냅니다.
  const intent = useMemo(() => parseRecommendationIntent(query), [query]);
  const effectiveGoal = intent.goal || goal;
  const effectiveBudget = intent.budget || budget;
  const effectiveSkill = intent.skill || skill;
  const effectiveFeature = intent.feature || feature;

  const results = useMemo(() => {
    const ranked = rankServices(catalog, { goal: effectiveGoal, budget: effectiveBudget, skill: effectiveSkill, feature: effectiveFeature });
    if (!query.trim()) return ranked.slice(0, 8).map((item, index) => ({ ...item.service, score: Math.max(0, Math.min(100, Math.round(item.score))), rank: index + 1, reason: item.service.bestFor, searchScore: 0 }));
    const searched = rankSearchResults(ranked.map((item) => item.service), query);
    const searchMap = new Map(searched.map((service) => [service.id, scoreSearch(service, query)]));
    const final = ranked.filter((item) => searchMap.has(item.service.id)).map((item) => {
      const search = searchMap.get(item.service.id);
      const searchBonus = Math.min(15, Math.round((search.score || 0) * 0.15));
      return { ...item.service, score: Math.max(0, Math.min(100, Math.round(item.score + searchBonus))), baseScore: item.score, searchScore: search.score || 0, rank: 0, reason: search.reasons?.length ? search.reasons.join(" · ") : item.service.bestFor };
    }).sort((a, b) => b.score - a.score || b.searchScore - a.searchScore || a.name.localeCompare(b.name));
    return final.slice(0, 8).map((service, index) => ({ ...service, rank: index + 1 }));
  }, [effectiveGoal, effectiveBudget, effectiveSkill, effectiveFeature, query]);

  const toggleCompare = (id) => setCompare((current) => {
    const next = current.includes(id) ? current.filter((item) => item !== id) : current.length >= 4 ? current : [...current, id];
    localStorage.setItem("hub-compare", JSON.stringify(next));
    return next;
  });
  const resetConditions = () => { setQuery(""); setGoal("shorts"); setBudget("low"); setSkill("easy"); setFeature("all"); };
  const selectedGoal = goals.find((item) => item[0] === effectiveGoal) || goals[0];
  const top = results[0];
  const topHasAffiliate = top ? hasAffiliateLink(top) : false;
  const openService = (service, source) => trackOutboundClick(service, source);

  return <main className="recommendPage"><div className="recommendShell">
    <header className="recommendTop"><a className="recommendBrand" href="/">MOVA</a><nav className="recommendNav" aria-label="주요 메뉴"><a href="/catalog">서비스 찾기</a><a href="/tools">무료 도구</a><a href="/compare">비교</a><a className="recommendBack" href="/">홈으로</a></nav></header>
    <section className="recommendIntro"><div className="eyebrow">MOVA 2.0 · PERSONAL RECOMMEND</div><h1>조건까지 반영해서<br/><span>{selectedGoal[2]}</span>을 찾아보세요.</h1><p>{selectedGoal[3]}</p></section>
    <section className="recommendSearch recommendIntentSearch"><label htmlFor="recommend-query">원하는 조건을 한 문장으로 입력해도 됩니다.</label><div className="recommendSearchRow"><input id="recommend-query" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="예: 무료로 쇼츠 만들고 싶어" autoComplete="off"/>{query && <button type="button" onClick={() => setQuery("")}>지우기</button>}</div>{intent.labels.length > 0 && <div className="intentLabels" aria-label="검색어에서 인식한 조건">{intent.labels.map((label) => <span key={label}>{label}</span>)}</div>}</section>
    <section className="conditionGrid"><div className="conditionCard"><h2>01. 만들고 싶은 것</h2><div className="choiceGrid">{goals.map(([id, icon, label]) => <button type="button" className={`choice ${effectiveGoal === id ? "active" : ""}`} key={id} onClick={() => { setGoal(id); setQuery(""); }}><img src={icon} alt=""/><span>{label}</span></button>)}</div></div><div className="conditionCard"><h2>02. 예산</h2><div className="choiceGrid">{budgetOptions.map(([id, label]) => <button type="button" className={`choice ${effectiveBudget === id ? "active" : ""}`} key={id} onClick={() => { setBudget(id); setQuery(""); }}>{label}</button>)}</div></div><div className="conditionCard"><h2>03. 개발 경험</h2><div className="choiceGrid">{skillOptions.map(([id, label]) => <button type="button" className={`choice ${effectiveSkill === id ? "active" : ""}`} key={id} onClick={() => { setSkill(id); setQuery(""); }}>{label}</button>)}</div></div></section>
    <section className="conditionCard featureCondition"><div className="conditionTitleRow"><h2>04. 가장 중요한 기능</h2><button type="button" onClick={resetConditions}>조건 초기화</button></div><div className="choiceGrid">{featureOptions.map(([id, label]) => <button type="button" className={`choice ${effectiveFeature === id ? "active" : ""}`} key={id} onClick={() => { setFeature(id); setQuery(""); }}>{label}</button>)}</div></section>
    <section className="recommendResult"><div className="resultHead"><div><div className="eyebrow">STEP 02 · RESULT</div><h2>{query ? "입력한 조건에 맞는 서비스" : "당신에게 맞는 서비스"}</h2></div><a className="catalogLink" href="/catalog">전체 {catalog.length}개 보기</a></div>
      {top && <article className={`topMatch ${topHasAffiliate ? "affiliateMatch" : ""}`}><div className="topMatchMain"><div className="topMatchLabel">TOP MATCH</div><div className="topMatchService"><img src={top.icon} alt=""/><div><h3>{top.name}</h3><p>{top.category} · {top.bestFor}</p></div></div><p className="topReason">{top.reason}</p><div className="chips"><span className="good">추천 점수 {top.score}점</span><span>{top.free ? "무료 시작 가능" : "유료 중심"}</span><span>비용 {top.price}</span><span>난이도 {top.difficulty}</span><span>{top.api ? "API 제공" : "API 확인 필요"}</span></div>{topHasAffiliate && <p className="affiliateDisclosure">{getAffiliateDisclosure(top)}</p>}</div><div className="topMatchActions"><a className="primaryAction" href={`/services/${top.id}`}>상세 보기</a><a className="secondaryAction" href={getOutboundUrl(top)} target="_blank" rel="nofollow sponsored noopener noreferrer" onClick={() => openService(top, "recommend-top")}>서비스 시작하기</a></div></article>}
      <div className="resultHead resultHeadSub"><div><div className="eyebrow">ALTERNATIVES</div><h3>함께 비교해볼 후보</h3></div><span className="resultCount">{results.length}개 후보 분석</span></div>
      <div className="resultGrid">{results.slice(1, 6).map((service) => { const affiliate = hasAffiliateLink(service); return <article className={`resultCard ${affiliate ? "affiliateCandidate" : ""}`} key={service.id}><div className="resultServiceTop"><img className="resultIcon" src={service.icon} alt=""/><div><div className="resultTitle">{service.name}</div><div className="resultCategory">{service.category}</div></div><div className="score"><StarRating score={service.score}/></div></div><div className="reason"><b>추천 이유</b><br/>{service.reason}</div><div className="chips"><span className="good">{service.free ? "무료 시작 가능" : "유료 중심"}</span><span>비용 {service.price}</span><span>난이도 {service.difficulty}</span>{service.tags.slice(0, 2).map((tag) => <span key={tag}>{tag}</span>)}</div><div className="resultActions"><button type="button" className="compareBtn" onClick={() => toggleCompare(service.id)}>{compare.includes(service.id) ? "비교 선택됨" : "비교하기"}</button><a className="officialBtn" href={`/services/${service.id}`}>상세 보기</a><a className={affiliate ? "affiliateMiniBtn" : "officialBtn"} href={getOutboundUrl(service)} target="_blank" rel="nofollow sponsored noopener noreferrer" onClick={() => openService(service, "recommend-candidate")}>서비스 시작하기</a></div>{affiliate && <p className="affiliateDisclosure miniDisclosure">{getAffiliateDisclosure(service)}</p>}</article>; })}</div>
    </section>
  </div>{compare.length > 0 && <div className="compareBar"><div className="compareBarInfo"><div className="compareBarTitle"><strong>비교함</strong><span>{compare.length}/4개 선택</span></div><div className="compareBarHint">{compare.length < 4 ? "서비스를 더 추가해 비교해보세요!" : "선택한 서비스를 비교해보세요."}</div><div className="compareSelectedIcons" aria-label="선택한 서비스">{compare.map((id) => <span className="compareSelectedIcon" key={id} title={catalogMap[id]?.name}><img src={catalogMap[id]?.icon} alt={catalogMap[id]?.name || ""}/></span>)}{compare.length < 4 && <span className="compareSelectedIcon compareAddIcon" aria-hidden="true">+</span>}</div></div><div className="compareBarActions"><button type="button" className="compareReset" onClick={() => { setCompare([]); localStorage.setItem("hub-compare", "[]"); }}>전체 해제</button><a className="compareGo" href="/compare">비교 화면 열기</a></div></div>}</main>;
}