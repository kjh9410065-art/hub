/* HUB 2.0 비교 화면: 선택한 서비스의 목적 적합도와 조건별 승자를 함께 보여줍니다. */
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { catalog, catalogMap } from "../lib/catalog";
import { rankServices } from "../lib/recommendation";
import "./compare.css";

const fallback = catalog.slice(0, 4).map((service) => service.id);
const goals = [["shorts", "쇼츠 제작"], ["image", "이미지 제작"], ["video", "영상 제작"], ["voice", "음성 제작"], ["chat", "AI 챗봇"], ["api", "개발용 API"]];
const rows = [["category", "분류"], ["price", "비용 부담"], ["free", "무료 시작"], ["difficulty", "개발 난이도"], ["api", "API"], ["image", "이미지"], ["video", "영상"], ["voice", "음성"], ["search", "검색"], ["bestFor", "추천 용도"], ["strengths", "강점"], ["caveat", "주의할 점"]];

function featureValue(service, key) {
  if (["image", "video", "voice", "search"].includes(key)) return service.features?.[key] ? "지원" : "미지원";
  if (key === "free") return service.free ? "가능" : "없음";
  if (key === "api") return service.api ? "제공" : "확인 필요";
  if (key === "strengths") return service.strengths?.join(" · ") || "—";
  return service[key] ?? "—";
}

function findWinner(services, predicate, fallbackService) {
  return services.filter(predicate).sort((a, b) => b.score - a.score)[0] || fallbackService;
}

export default function Compare() {
  const [selected, setSelected] = useState([]);
  const [goal, setGoal] = useState("shorts");

  useEffect(() => {
    try {
      const raw = JSON.parse(localStorage.getItem("hub-compare") || "[]");
      setSelected([...new Set(raw)].filter((id) => catalogMap[id]).slice(0, 4));
    } catch { setSelected([]); }
  }, []);

  const ranked = useMemo(() => {
    const ids = selected.length ? selected : fallback;
    const services = ids.map((id) => catalogMap[id]).filter(Boolean);
    const scored = rankServices(services, { goal, budget: "any", skill: "any", feature: "all" });
    const scores = scored.map((item) => item.score);
    const max = Math.max(...scores, 0);
    const min = Math.min(...scores, 0);
    const range = max - min;
    return scored.map((item) => ({ ...item.service, score: item.score, reasons: item.reasons || [], relativeScore: range ? Math.round(((item.score - min) / range) * 100) : 100 }));
  }, [selected, goal]);

  const winners = useMemo(() => {
    const top = ranked[0];
    return [
      { key: "goal", label: "목적 적합도", description: "현재 선택한 제작 목적을 가장 잘 맞추는 서비스", service: top },
      { key: "free", label: "무료 시작", description: "무료 시작이 가능한 후보 중 목적 점수가 높은 서비스", service: findWinner(ranked, (item) => item.free, top) },
      { key: "api", label: "API 활용", description: "API 연결이 가능한 후보 중 목적 점수가 높은 서비스", service: findWinner(ranked, (item) => item.api, top) },
      { key: "easy", label: "쉬운 시작", description: "쉬운 난이도 후보 중 목적 점수가 높은 서비스", service: findWinner(ranked, (item) => item.difficulty === "쉬움", top) }
    ];
  }, [ranked]);

  // 같은 서비스가 여러 조건에서 1위를 차지하면 하나의 카드로 합칩니다.
  // 비교 대상 자체는 아래 비교표와 모바일 카드에서 각각 한 번씩만 보여줍니다.
  const uniqueWinnerGroups = useMemo(() => {
    const groups = new Map();
    winners.forEach((winner) => {
      if (!winner.service) return;
      const current = groups.get(winner.service.id) || [];
      groups.set(winner.service.id, [...current, winner.label]);
    });
    return [...groups.entries()].map(([serviceId, labels]) => ({ service: ranked.find((item) => item.id === serviceId), labels }));
  }, [winners, ranked]);

  const remove = (id) => {
    const next = selected.filter((item) => item !== id);
    setSelected(next);
    localStorage.setItem("hub-compare", JSON.stringify(next));
  };

  const clear = () => {
    setSelected([]);
    localStorage.removeItem("hub-compare");
  };

  const comparisonTitle = ranked.length > 1 ? ranked.map((service) => service.name).join(" vs ") : ranked[0]?.name || "서비스 비교";

  return <main className="page comparePage compareModern">
    <header className="header">
      <Link className="logo" href="/">HUB</Link>
      <nav><Link href="/catalog">서비스 찾기</Link><Link href="/recommend">추천받기</Link><Link href="/tools">무료 도구</Link></nav>
    </header>

    <section className="guideHero compareHero">
      <div className="eyebrow">SERVICE COMPARE · HUB 2.0</div>
      <h1>선택지를 한눈에,<br /><span>내 목적에 맞게 비교하세요.</span></h1>
      <p><strong>{comparisonTitle}</strong>을 현재 선택한 목적 기준으로 비교합니다. 비용, 무료 시작, 기능, 난이도까지 한 번에 확인할 수 있습니다.</p>
    </section>

    <section className="section compareSection">
      <div className="compareGoalBox">
        <div className="compareGoalHeading"><strong>무엇을 만들려고 하나요?</strong><span>목적을 바꾸면 비교 점수와 추천 이유도 함께 바뀝니다.</span></div>
        <div className="compareGoalTabs" role="tablist" aria-label="비교 목적">{goals.map(([id, label]) => <button type="button" key={id} className={goal === id ? "active" : ""} onClick={() => setGoal(id)} aria-selected={goal === id}>{label}</button>)}</div>
      </div>

      <div className="compareToolbar">
        <div><b>{ranked.length}개 서비스 비교</b><span>{selected.length ? ranked.map((service) => service.name).join(" · ") : "기본 비교 목록"}</span></div>
        <div className="toolbarActions"><Link href="/recommend">서비스 더 고르기</Link>{selected.length > 0 && <button type="button" onClick={clear}>전체 해제</button>}</div>
      </div>

      <div className="compareWinner">
        <div><span className="compareWinnerKicker">현재 목적 기준 1위</span><strong>{ranked[0]?.name || "비교할 서비스가 없습니다."}</strong><p>{ranked[0]?.reasons?.slice(0, 2).join(" · ") || "서비스를 선택하면 목적별 비교 이유가 표시됩니다."}</p></div>
        {ranked[0] && <b>{ranked[0].relativeScore}점</b>}
      </div>

      <section className="decisionGrid" aria-label="조건별 비교 결과">
        <div className="decisionSectionIntro"><span>비교 결과</span><strong>어떤 조건에서 누가 앞서는지</strong><p>같은 서비스가 여러 조건에서 1위를 하면 한 번만 표시합니다.</p></div>
        {uniqueWinnerGroups.map((group) => <article className={`decisionCard ${group.service?.id === ranked[0]?.id ? "primary" : ""}`} key={group.service?.id}>
          <span>{group.labels.join(" · ")}</span><strong>{group.service?.name || "없음"}</strong><p>{group.service?.bestFor || "현재 목적과 주요 기능을 기준으로 비교합니다."}</p>{group.service && <Link href={`/services/${group.service.id}`}>상세 보기</Link>}
        </article>)}
      </section>

      <div className="compareDesktop">
        <div className="compareMatrixHead"><div className="matrixLabel">비교 항목</div>{ranked.map((service) => <div className="matrixService" key={service.id}><img src={service.icon} alt=""/><strong>{service.name}</strong>{selected.includes(service.id) && <button type="button" onClick={() => remove(service.id)} aria-label={`${service.name} 제거`}>제거</button>}</div>)}</div>
        <div className="compareMatrixRow compareScoreRow"><div className="matrixLabel">목적 적합도</div>{ranked.map((service) => <div key={service.id} className="matrixScore"><strong>{service.relativeScore}점</strong><small>{service.reasons?.[0] || "목적과 기능을 비교 중"}</small></div>)}</div>
        {rows.map(([key, label]) => <div className="compareMatrixRow" key={key}><div className="matrixLabel">{label}</div>{ranked.map((service) => <div key={service.id} className={key === "bestFor" ? "matrixStrong" : ""}>{featureValue(service, key)}</div>)}</div>)}
      </div>

      <div className="compareMobile">
        {ranked.map((service, index) => <article className={`mobileCompareCard ${index === 0 ? "featured" : ""}`} key={service.id}>
          <header><div className="mobileServiceIcon"><img src={service.icon} alt="" /></div><div><strong>{service.name}</strong><small>{service.category}</small></div>{selected.includes(service.id) && <button type="button" onClick={() => remove(service.id)} aria-label={`${service.name} 제거`}>제거</button>}</header>
          <div className="mobileScore"><span>{index === 0 ? "현재 목적 추천 1위" : "목적 적합도"}</span><b>{service.relativeScore}점</b></div>
          <p className="mobileCompareReason">{service.reasons?.slice(0, 2).join(" · ") || "현재 목적과 주요 기능을 기준으로 비교했습니다."}</p>
          <dl>{rows.slice(0, 9).map(([key, label]) => <div key={key}><dt>{label}</dt><dd>{featureValue(service, key)}</dd></div>)}</dl>
          <Link href={`/services/${service.id}`}>상세 정보 보기</Link>
        </article>)}
      </div>

      <Link className="primaryLink compareBottomLink" href="/recommend">내 조건으로 다시 추천받기</Link>
    </section>
  </main>;
}
