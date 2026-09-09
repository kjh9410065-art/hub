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
  // 높은 점수가 너무 쉽게 5점이 되지 않도록 55점 이상을 5점 기준으로 잡습니다.
  // 0~5점, 0.5점 단위로만 표시하며 내부 추천 점수 자체는 변경하지 않습니다.
  const normalized = Math.max(0, Math.min(5, Number(score || 0) / 11));
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
