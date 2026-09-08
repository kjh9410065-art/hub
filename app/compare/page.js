/* HUB 비교 화면: 비교 전에 사용자가 목적과 비교 대상을 이해할 수 있도록 흐름을 단순화합니다. */
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { catalog, catalogMap } from "../lib/catalog";
import { rankServices } from "../lib/recommendation";
import "./compare.css";

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
    } catch {
      setSelected([]);
    }
  }, []);

  // 사용자가 아직 비교 대상을 고르지 않았다면 임의의 서비스를 비교하지 않습니다.
  // 현재 목적에 맞는 후보를 먼저 보여주고, 사용자가 원하는 서비스만 비교 목록에 넣게 합니다.
  const candidates = useMemo(() => {
    return rankServices(catalog, { goal, budget: "any", skill: "any", feature: "all" }).slice(0, 3).map((item) => ({ ...item.service, score: item.score, reasons: item.reasons || [] }));
  }, [goal]);

  const ranked = useMemo(() => {
    if (!selected.length) return [];
    const services = selected.map((id) => catalogMap[id]).filter(Boolean);
    const scored = rankServices(services, { goal, budget: "any", skill: "any", feature: "all" });
    const scores = scored.map((item) => item.score);
    const max = Math.max(...scores, 0);
    const min = Math.min(...scores, 0);
    const range = max - min;
    return scored.map((item) => ({
      ...item.service,
      score: item.score,
      reasons: item.reasons || [],
      relativeScore: range ? Math.round(((item.score - min) / range) * 100) : 100
    }));
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
  const uniqueWinnerGroups = useMemo(() => {
    const groups = new Map();
    winners.forEach((winner) => {
      if (!winner.service) return;
      const current = groups.get(winner.service.id) || [];
      groups.set(winner.service.id, [...current, winner.label]);
    });
    return [...groups.entries()].map(([serviceId, labels]) => ({ service: ranked.find((item) => item.id === serviceId), labels }));
  }, [winners, ranked]);

  const addCompare = (id) => {
    setSelected((current) => {
      if (current.includes(id) || current.length >= 4) return current;
      const next = [...current, id];
      localStorage.setItem("hub-compare", JSON.stringify(next));
      return next;
    });
  };

  const remove = (id) => {
    const next = selected.filter((item) => item !== id);
    setSelected(next);
    localStorage.setItem("hub-compare", JSON.stringify(next));
  };

  const clear = () => {
    setSelected([]);
    localStorage.removeItem("hub-compare");
  };

  const comparisonTitle = ranked.length > 1 ? ranked.map((service) => service.name).join(" vs ") : ranked[0]?.name || "비교할 서비스를 골라주세요";

  return <main className="page comparePage compareModern">
    <header className="header">
      <Link className="logo" href="/">HUB</Link>
      <nav><Link href="/catalog">서비스 찾기</Link><Link href="/recommend">추천받기</Link><Link href="/tools">무료 도구</Link></nav>
    </header>

    <section className="guideHero compareHero">
      <div className="eyebrow">SERVICE COMPARE · HUB 2.0</div>
      <h1>{selected.length ? <>선택한 서비스를<br /><span>내 목적에 맞게 비교하세요.</span></> : <>무엇을 만들고 싶으세요?<br /><span>목적부터 선택해보세요.</span></>}</h1>
      <p>{selected.length ? <><strong>{comparisonTitle}</strong>을 현재 목적 기준으로 비교합니다. 비용, 기능, 무료 시작, 난이도를 한 번에 확인할 수 있습니다.</> : "비교할 서비스를 먼저 정하는 대신, 만들고 싶은 목적을 고르면 HUB가 잘 맞는 후보를 먼저 보여드립니다."}</p>
    </section>

    <section className="section compareSection">
      <div className="compareGoalBox compareGoalBoxPrimary">
        <div className="compareGoalHeading"><strong>먼저, 무엇을 만들고 싶은지 선택하세요</strong><span>목적을 바꾸면 아래 후보와 비교 점수도 달라집니다.</span></div>
        <div className="compareGoalTabs" role="tablist" aria-label="비교 목적">{goals.map(([id, label]) => <button type="button" key={id} className={goal === id ? "active" : ""} onClick={() => setGoal(id)} aria-selected={goal === id}>{label}</button>)}</div>
      </div>

      {!selected.length ? <section className="compareStartState" aria-label="비교할 서비스 선택">
        <div className="compareStartHeading"><span>현재 목적에 맞는 후보</span><strong>비교하고 싶은 서비스를 골라주세요</strong><p>최대 4개까지 선택할 수 있습니다. 아직 선택하지 않았다면 임의의 서비스를 비교하지 않습니다.</p></div>
        <div className="compareCandidateGrid">
          {candidates.map((service, index) => <article className={`compareCandidate ${index === 0 ? "recommended" : ""}`} key={service.id}>
            <div className="compareCandidateTop"><div className="compareCandidateIcon"><img src={service.icon} alt="" /></div><div><strong>{service.name}</strong><small>{service.category}</small></div>{index === 0 && <span>목적 추천 1위</span>}</div>
            <b>{service.bestFor}</b>
            <p>{service.reasons?.slice(0, 2).join(" · ") || "현재 선택한 목적과 주요 기능을 기준으로 추천된 후보입니다."}</p>
            <div className="compareCandidateMeta"><span>비용 {service.price}</span><span>{service.free ? "무료 시작 가능" : "무료 시작 없음"}</span></div>
            <button type="button" onClick={() => addCompare(service.id)}>비교에 추가</button>
          </article>)}
        </div>
        <div className="compareStartActions"><Link href={`/recommend?goal=${goal}`}>조건까지 반영해서 추천받기</Link><Link href="/catalog">전체 서비스에서 찾기</Link></div>
      </section> : <>
        <div className="compareToolbar">
          <div><b>{ranked.length}개 서비스 비교</b><span>{ranked.map((service) => service.name).join(" · ")}</span></div>
          <div className="toolbarActions"><Link href={`/recommend?goal=${goal}`}>서비스 더 고르기</Link><button type="button" onClick={clear}>전체 해제</button></div>
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
          <div className="compareMatrixHead"><div className="matrixLabel">비교 항목</div>{ranked.map((service) => <div className="matrixService" key={service.id}><img src={service.icon} alt=""/><strong>{service.name}</strong><button type="button" onClick={() => remove(service.id)} aria-label={`${service.name} 제거`}>제거</button></div>)}</div>
          <div className="compareMatrixRow compareScoreRow"><div className="matrixLabel">목적 적합도</div>{ranked.map((service) => <div key={service.id} className="matrixScore"><strong>{service.relativeScore}점</strong><small>{service.reasons?.[0] || "목적과 기능을 비교 중"}</small></div>)}</div>
          {rows.map(([key, label]) => <div className="compareMatrixRow" key={key}><div className="matrixLabel">{label}</div>{ranked.map((service) => <div key={service.id} className={key === "bestFor" ? "matrixStrong" : ""}>{featureValue(service, key)}</div>)}</div>)}
        </div>

        <div className="compareMobile">
          {ranked.map((service, index) => <article className={`mobileCompareCard ${index === 0 ? "featured" : ""}`} key={service.id}>
            <header><div className="mobileServiceIcon"><img src={service.icon} alt="" /></div><div><strong>{service.name}</strong><small>{service.category}</small></div><button type="button" onClick={() => remove(service.id)} aria-label={`${service.name} 제거`}>제거</button></header>
            <div className="mobileScore"><span>{index === 0 ? "현재 목적 추천 1위" : "목적 적합도"}</span><b>{service.relativeScore}점</b></div>
            <p className="mobileCompareReason">{service.reasons?.slice(0, 2).join(" · ") || "현재 목적과 주요 기능을 기준으로 비교했습니다."}</p>
            <dl>{rows.slice(0, 9).map(([key, label]) => <div key={key}><dt>{label}</dt><dd>{featureValue(service, key)}</dd></div>)}</dl>
            <Link href={`/services/${service.id}`}>상세 정보 보기</Link>
          </article>)}
        </div>

        <Link className="primaryLink compareBottomLink" href={`/recommend?goal=${goal}`}>내 조건으로 다시 추천받기</Link>
      </>}
    </section>
  </main>;
}
