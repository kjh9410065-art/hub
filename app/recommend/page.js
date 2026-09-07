/* HUB 1.5: 추천 화면의 목적 아이콘을 캐시가 남아 있는 기존 파일과 분리된 SVG 자산으로 교체합니다. */
"use client";

import { useEffect, useMemo, useState } from "react";
import "./recommend.css";
import "./recommend-next.css";
import { catalog, catalogMap } from "../lib/catalog";
import { rankServices } from "../lib/recommendation";

// 운영체제별 이모지 대신 HUB 전용 SVG 일러스트를 사용합니다.
// 새 파일명을 사용해 이전 배포본의 아이콘 캐시와도 확실하게 분리합니다.
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

function readCompare() {
  try {
    const raw = JSON.parse(localStorage.getItem("hub-compare") || "[]");
    return raw.filter((id) => catalogMap[id]).slice(0, 4);
  } catch {
    return [];
  }
}

export default function RecommendPage() {
  const [goal, setGoal] = useState("shorts");
  const [budget, setBudget] = useState("low");
  const [skill, setSkill] = useState("easy");
  const [feature, setFeature] = useState("all");
  const [compare, setCompare] = useState([]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const task = params.get("task");
    if (goals.some((item) => item[0] === task)) setGoal(task);
    setCompare(readCompare());
  }, []);

  // 공통 추천 엔진에 전체 카탈로그를 넣어 서비스가 늘어나도 같은 기준으로 평가합니다.
  const results = useMemo(() => {
    const ranked = rankServices(catalog, { goal, budget, skill, feature });
    const max = ranked[0]?.score || 1;
    return ranked.slice(0, 8).map(({ service, score, reasons }, index) => ({
      ...service,
      score: Math.max(0, Math.min(100, Math.round((score / max) * 100))),
      rank: index + 1,
      reason: reasons.length ? reasons.join(" · ") : service.bestFor
    }));
  }, [goal, budget, skill, feature]);

  const toggleCompare = (id) => {
    setCompare((current) => {
      const next = current.includes(id)
        ? current.filter((item) => item !== id)
        : current.length >= 4
          ? current
          : [...current, id];
      localStorage.setItem("hub-compare", JSON.stringify(next));
      return next;
    });
  };

  const selectedGoal = goals.find((item) => item[0] === goal);
  const top = results[0];

  return (
    <main className="recommendPage">
      <div className="recommendShell">
        <header className="recommendTop">
          <a className="recommendBrand" href="/">HUB</a>
          <nav className="recommendNav" aria-label="주요 메뉴">
            <a href="/catalog">서비스 찾기</a>
            <a href="/compare">비교</a>
            <a className="recommendBack" href="/">홈으로</a>
          </nav>
        </header>

        <section className="recommendIntro">
          <div className="eyebrow">HUB 1.5 · PERSONAL RECOMMEND</div>
          <h1>조건까지 반영해서<br /><span>{selectedGoal?.[2]}</span>을 찾아보세요.</h1>
          <p>{selectedGoal?.[3]}</p>
        </section>

        <section className="conditionGrid">
          <div className="conditionCard">
            <h2>01. 만들고 싶은 것</h2>
            <div className="choiceGrid">
              {goals.map(([id, icon, label]) => (
                <button className={`choice ${goal === id ? "active" : ""}`} key={id} onClick={() => setGoal(id)}>
                  <img src={icon} alt="" />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="conditionCard">
            <h2>02. 예산</h2>
            <div className="choiceGrid">
              {budgetOptions.map(([id, label]) => (
                <button className={`choice ${budget === id ? "active" : ""}`} key={id} onClick={() => setBudget(id)}>{label}</button>
              ))}
            </div>
          </div>
          <div className="conditionCard">
            <h2>03. 개발 경험</h2>
            <div className="choiceGrid">
              {skillOptions.map(([id, label]) => (
                <button className={`choice ${skill === id ? "active" : ""}`} key={id} onClick={() => setSkill(id)}>{label}</button>
              ))}
            </div>
          </div>
        </section>

        <section className="conditionCard featureCondition">
          <h2>04. 가장 중요한 기능</h2>
          <div className="choiceGrid">
            {featureOptions.map(([id, label]) => (
              <button className={`choice ${feature === id ? "active" : ""}`} key={id} onClick={() => setFeature(id)}>{label}</button>
            ))}
          </div>
        </section>

        <section className="recommendResult">
          <div className="resultHead">
            <div>
              <div className="eyebrow">STEP 02 · RESULT</div>
              <h2>당신에게 맞는 서비스</h2>
            </div>
            <a className="catalogLink" href="/catalog">전체 {catalog.length}개 보기</a>
          </div>

          {top && (
            <article className="topMatch">
              <div className="topMatchMain">
                <div className="topMatchLabel">TOP MATCH</div>
                <div className="topMatchService">
                  <img src={top.icon} alt="" />
                  <div>
                    <h3>{top.name}</h3>
                    <p>{top.category} · {top.bestFor}</p>
                  </div>
                </div>
                <p className="topReason">{top.reason}</p>
                <div className="chips">
                  <span className="good">추천 점수 {top.score}점</span>
                  <span>{top.free ? "무료 시작 가능" : "유료 중심"}</span>
                  <span>비용 {top.price}</span>
                  <span>난이도 {top.difficulty}</span>
                  <span>{top.api ? "API 제공" : "API 확인 필요"}</span>
                </div>
              </div>
              <div className="topMatchActions">
                <a className="primaryAction" href={`/services/${top.id}`}>상세 보기</a>
                <a className="secondaryAction" href={top.url} target="_blank" rel="noreferrer">공식 사이트</a>
              </div>
            </article>
          )}

          <div className="resultHead resultHeadSub">
            <div><div className="eyebrow">ALTERNATIVES</div><h3>함께 비교해볼 후보</h3></div>
            <span className="resultCount">{results.length}개 후보 분석</span>
          </div>

          <div className="resultGrid">
            {results.slice(1, 6).map((service) => (
              <article className="resultCard" key={service.id}>
                <div className="resultServiceTop">
                  <img className="resultIcon" src={service.icon} alt="" />
                  <div><div className="resultTitle">{service.name}</div><div className="resultCategory">{service.category}</div></div>
                  <div className="score">{service.score}<small>점</small></div>
                </div>
                <div className="reason"><b>추천 이유</b><br />{service.reason}</div>
                <div className="chips">
                  <span className="good">{service.free ? "무료 시작 가능" : "유료 중심"}</span>
                  <span>비용 {service.price}</span>
                  <span>난이도 {service.difficulty}</span>
                  {service.tags.slice(0, 2).map((tag) => <span key={tag}>{tag}</span>)}
                </div>
                <div className="resultActions">
                  <button className="compareBtn" onClick={() => toggleCompare(service.id)}>{compare.includes(service.id) ? "비교 선택됨" : "비교하기"}</button>
                  <a className="officialBtn" href={`/services/${service.id}`}>상세 보기</a>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>

      {compare.length > 0 && (
        <div className="compareBar">
          <strong>{compare.length}/4 비교</strong>
          <div className="compareNames">{compare.map((id) => <span className="compareName" key={id}>{catalogMap[id]?.name}</span>)}</div>
          <a className="compareGo" href="/compare">비교하기</a>
        </div>
      )}
    </main>
  );
}
