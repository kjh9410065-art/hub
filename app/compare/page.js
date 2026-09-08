/* HUB 비교 화면: 선택한 서비스의 차이를 빠르게 판단할 수 있도록 구성합니다. */
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { catalog, catalogMap } from "../lib/catalog";
import { rankServices } from "../lib/recommendation";
import "./compare.css";
import "./compare-readability.css";

const goals = [["shorts", "쇼츠 제작"], ["image", "이미지 제작"], ["video", "영상 제작"], ["voice", "음성 제작"], ["chat", "AI 챗봇"], ["api", "개발용 API"]];
const rows = [["category", "분류"], ["price", "비용 부담"], ["free", "무료 시작"], ["difficulty", "개발 난이도"], ["api", "API"], ["image", "이미지"], ["video", "영상"], ["voice", "음성"], ["search", "검색"], ["bestFor", "추천 용도"], ["strengths", "강점"], ["caveat", "주의할 점"]];
const featureLabels = { image: "이미지", video: "영상", voice: "음성", search: "검색", api: "API" };

function featureValue(service, key) {
  // 기능은 features와 uses 중 한쪽에만 정의되어 있어도 지원으로 표시합니다.
  if (["image", "video", "voice", "search"].includes(key)) return service.features?.[key] || service.uses?.includes(key) ? "지원" : "미지원";
  if (key === "free") return service.free ? "가능" : "없음";
  if (key === "api") return service.api ? "제공" : "확인 필요";
  if (key === "strengths") return service.strengths?.join(" · ") || "—";
  return service[key] ?? "—";
}

function getSupportedFeatures(service) {
  // 비교 카드에서 실제로 지원하는 기능을 짧은 배지로 보여줍니다.
  return Object.entries(featureLabels).filter(([key]) => key === "api" ? service.api : Boolean(service.features?.[key] || service.uses?.includes(key))).map(([, label]) => label);
}

function findWinner(services, predicate, fallbackService) {
  return services.filter(predicate).sort((a, b) => b.score - a.score)[0] || fallbackService;
}

function getStarRating(score) {
  // 내부 추천 점수를 사용자에게는 0~5점, 0.5점 단위의 별점으로만 보여줍니다.
  const normalized = Math.max(0, Math.min(5, Number(score || 0) / 10));
  return Math.round(normalized * 2) / 2;
}

function StarRating({ score, size = "normal" }) {
  const rating = getStarRating(score);
  const stars = Array.from({ length: 5 }, (_, index) => {
    const value = index + 1;
    // 'empty'라는 클래스명은 전역 다크모드의 .empty 카드 규칙과 충돌하므로 사용하지 않습니다.
    const type = rating >= value ? "filled" : rating >= value - 0.5 ? "half" : "emptyStar";
    return <span className={`ratingStar ${type}`} key={value} aria-hidden="true">★</span>;
  });

  return <div className={`starRating ${size}`} role="img" aria-label={`HUB 추천 별점 ${rating.toFixed(1)}점 / 5점`}>{stars}</div>;
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

  const candidates = useMemo(() => {
    return rankServices(catalog, { goal, budget: "any", skill: "any", feature: "all" }).slice(0, 3).map((item) => ({ ...item.service, score: item.score, reasons: item.reasons || [] }));
  }, [goal]);

  const ranked = useMemo(() => {
    if (!selected.length) return [];
    const services = selected.map((id) => catalogMap[id]).filter(Boolean);
    const scored = rankServices(services, { goal, budget: "any", skill: "any", feature: "all" });

    // 내부 추천 엔진의 원점수는 계산에만 사용하고 화면에는 별점으로 변환해 보여줍니다.
    return scored.map((item) => ({
      ...item.service,
      score: item.score,
      reasons: item.reasons || [],
      supportedFeatures: getSupportedFeatures(item.service)
    }));
  }, [selected, goal]);

  const winners = useMemo(() => {
    const top = ranked[0];
    return [
      { key: "goal", label: "목적 적합도", description: "현재 선택한 제작 목적을 기준으로 주요 기능, 추천 용도, API 지원 여부 등을 종합해 가장 높은 HUB 기준 추천 결과를 받은 서비스입니다.", service: top },
      { key: "free", label: "무료 시작", description: "무료로 시작할 수 있는 후보만 놓고 비교했을 때 현재 목적에 가장 잘 맞는 서비스입니다. 무료 범위와 실제 사용 조건은 서비스 정책에 따라 달라질 수 있습니다.", service: findWinner(ranked, (item) => item.free, top) },
      { key: "api", label: "API 활용", description: "API를 제공하는 후보 중 현재 목적에 대한 적합도가 가장 높은 서비스입니다. 자동화나 직접 연동이 필요한 경우 특히 확인할 가치가 있습니다.", service: findWinner(ranked, (item) => item.api, top) },
      { key: "easy", label: "쉬운 시작", description: "사용 난이도가 '쉬움'으로 분류된 후보 중 현재 목적 점수가 가장 높은 서비스입니다. 처음 사용하는 경우 설정 부담을 줄이는 데 초점을 둔 결과입니다.", service: findWinner(ranked, (item) => item.difficulty === "쉬움", top) }
    ];
  }, [ranked]);

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
        <div className="compareGoalHeading"><strong>먼저, 무엇을 만들고 싶은지 선택하세요</strong><span>목적을 바꾸면 아래 후보와 비교 기준도 달라집니다.</span></div>
        <div className="compareGoalTabs" role="tablist" aria-label="비교 목적">{goals.map(([id, label]) => <button type="button" key={id} className={goal === id ? "active" : ""} onClick={() => setGoal(id)} aria-selected={goal === id}>{label}</button>)}</div>
      </div>

      {!selected.length ? <section className="compareStartState" aria-label="비교할 서비스 선택">
        <div className="compareStartHeading"><span>현재 목적에 맞는 후보</span><strong>비교하고 싶은 서비스를 골라주세요</strong><p>최대 4개까지 선택할 수 있습니다. 아직 선택하지 않았다면 임의의 서비스를 비교하지 않습니다.</p></div>
        <div className="compareCandidateGrid">
          {candidates.map((service, index) => <article className={`compareCandidate ${index === 0 ? "recommended" : ""}`} key={service.id}>
            <div className="compareCandidateTop"><div className="compareCandidateIcon"><img src={service.icon} alt="" /></div><div><strong>{service.name}</strong><small>{service.category}</small></div>{index === 0 && <span>목적 추천 1위</span>}</div>
            <b>{service.bestFor}</b>
            <p>{service.reasons?.slice(0, 3).join(" · ") || "현재 선택한 목적과 주요 기능을 기준으로 추천된 후보입니다."}</p>
            <div className="compareCandidateMeta"><span>비용 {service.price}</span><span>{service.free ? "무료 시작 가능" : "무료 시작 없음"}</span>{service.api && <span>API 제공</span>}</div>
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
          <div className="compareWinnerIdentity">
            {ranked[0] && <div className="compareWinnerIcon"><img src={ranked[0].icon} alt="" /></div>}
            <div className="compareWinnerIdentityText">
              <span className="compareWinnerKicker">현재 목적 기준 1위</span>
              <strong>{ranked[0]?.name || "비교할 서비스가 없습니다."}</strong>
              <small>{ranked[0]?.category || ""}</small>
              <StarRating score={ranked[0]?.score} size="large" />
              <div className="compareWinnerFeatures">{ranked[0]?.supportedFeatures?.slice(0, 4).map((feature) => <span key={feature}>{feature}</span>)}</div>
            </div>
          </div>
          <div className="compareWinnerReason">
            <span>추천 이유</span>
            <strong>{ranked[0] ? `왜 ${ranked[0].name}이(가) 1위인가요?` : "추천 이유"}</strong>
            <p>{ranked[0]?.reasons?.slice(0, 3).join(" ") || "서비스를 선택하면 목적별 비교 이유가 표시됩니다."}</p>
            <ul>
              {(ranked[0]?.reasons?.slice(0, 3) || ["선택한 목적에 맞는 기능과 활용도를 종합했습니다.", "비교 대상의 주요 조건을 함께 반영했습니다."]).map((reason, index) => <li key={`${reason}-${index}`}>{reason}</li>)}
            </ul>
          </div>
          <div className="compareWinnerActions">
            {ranked[0] && <Link href={`/services/${ranked[0].id}`}>상세 정보 보기 <span>→</span></Link>}
            <div className="compareWinnerActionLinks"><span>HUB 추천 결과</span><span>서비스 상세에서 더 확인</span></div>
          </div>
        </div>
        <p className="scoreNotice">HUB 추천 별점 · 선택한 목적과 서비스 데이터를 기반으로 계산한 내부 추천 결과입니다. 객관적인 시장 평가 점수는 아닙니다.</p>

        <section className="decisionGrid" aria-label="조건별 비교 결과">
          <div className="decisionSectionIntro"><span>비교 결과</span><strong>어떤 조건에서 누가 앞서는지</strong><p>4가지 조건을 각각 보여줍니다. 한 서비스가 여러 조건에서 1위일 수 있습니다.</p></div>
          {winners.map((winner) => <article className={`decisionCard ${winner.service?.id === ranked[0]?.id ? "primary" : ""}`} key={winner.key}>
            <span>{winner.label}</span>
            <div className="decisionServiceHead">{winner.service?.icon && <div className="decisionServiceIcon"><img src={winner.service.icon} alt="" /></div>}<strong>{winner.service?.name || "없음"}</strong></div>
            {winner.service && <StarRating score={winner.service.score} />}
            <p>{winner.description}</p>
            {winner.service && <Link href={`/services/${winner.service.id}`}>상세 정보 보기</Link>}
          </article>)}
        </section>

        <section className="comparisonSnapshot" aria-label="비교 핵심 요약">
          <div className="snapshotIntro"><span>QUICK SNAPSHOT</span><strong>4개 서비스를 한눈에 비교</strong><p>점수보다 실제 조건과 기능 차이를 먼저 확인하세요.</p></div>
          <div className="snapshotGrid">
            {ranked.map((service, index) => <article className={index === 0 ? "snapshotCard winner" : "snapshotCard"} key={service.id}>
              <div className="snapshotTop"><img src={service.icon} alt="" /><div><strong>{service.name}</strong><small>{service.category}</small></div><StarRating score={service.score} /></div>
              <div className="snapshotBadges"><span>{service.price}</span><span>{service.free ? "무료 시작" : "유료 시작"}</span><span>{service.api ? "API" : "API 없음"}</span></div>
              <div className="snapshotFeatures">{service.supportedFeatures.length ? service.supportedFeatures.map((feature) => <span key={feature}>{feature}</span>) : <span>주요 기능 정보 확인 필요</span>}</div>
              <p>{service.reasons?.slice(0, 3).join(" · ") || service.bestFor}</p>
            </article>)}
          </div>
        </section>

        <div className="compareDesktop">
          <div className="compareMatrixHead"><div className="matrixLabel">비교 항목</div>{ranked.map((service) => <div className="matrixService" key={service.id}><img src={service.icon} alt=""/><strong>{service.name}</strong><button type="button" onClick={() => remove(service.id)} aria-label={`${service.name} 제거`}>제거</button></div>)}</div>
          <div className="compareMatrixRow compareScoreRow"><div className="matrixLabel">HUB 추천 별점</div>{ranked.map((service) => <div key={service.id} className="matrixScore"><StarRating score={service.score}/><small>내부 추천 결과</small></div>)}</div>
          {rows.map(([key, label]) => <div className="compareMatrixRow" key={key}><div className="matrixLabel">{label}</div>{ranked.map((service) => <div key={service.id} className={key === "bestFor" ? "matrixStrong" : ""}>{featureValue(service, key)}</div>)}</div>)}
        </div>

        <div className="compareMobile">
          {ranked.map((service, index) => <article className={`mobileCompareCard ${index === 0 ? "featured" : ""}`} key={service.id}>
            <header><div className="mobileServiceIcon"><img src={service.icon} alt="" /></div><div><strong>{service.name}</strong><small>{service.category}</small></div><button type="button" onClick={() => remove(service.id)} aria-label={`${service.name} 제거`}>제거</button></header>
            <div className="mobileScore"><span>{index === 0 ? "현재 목적 추천 1위" : "HUB 추천 별점"}</span><StarRating score={service.score} size="large" /></div>
            <div className="mobileSnapshotBadges">{service.supportedFeatures.map((feature) => <span key={feature}>{feature}</span>)}<span>{service.api ? "API 제공" : "API 없음"}</span><span>{service.free ? "무료 시작" : "유료 시작"}</span></div>
            <p className="mobileCompareReason">{service.reasons?.slice(0, 3).join(" · ") || "현재 목적과 주요 기능을 기준으로 비교했습니다."}</p>
            <dl>{rows.slice(0, 9).map(([key, label]) => <div key={key}><dt>{label}</dt><dd>{featureValue(service, key)}</dd></div>)}</dl>
            <Link href={`/services/${service.id}`}>상세 정보 보기</Link>
          </article>)}
        </div>

        <Link className="primaryLink compareBottomLink" href={`/recommend?goal=${goal}`}>내 조건으로 다시 추천받기</Link>
      </>}
    </section>
  </main>;
}
