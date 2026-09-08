// HUB 전체 화면이 동일한 서비스 카탈로그와 분류 체계를 사용하도록 한 곳에서 관리합니다.
import { services as coreServices } from "./services";
import { additionalServices } from "../data/service-catalog";

export const catalog = [...coreServices, ...additionalServices];
export const catalogMap = Object.fromEntries(catalog.map((service) => [service.id, service]));

// 홈과 카탈로그에서 사용하는 목적형 분류입니다.
// 실제 서비스의 category, tags, uses를 기준으로 묶기 때문에 서비스가 늘어나도 필터가 깨지지 않습니다.
export const categoryGroups = [
  { id: "all", label: "전체", test: () => true },
  { id: "llm", label: "LLM", test: (s) => /AI 모델|추론|LLM/i.test(s.category) || (s.tags || []).some((tag) => /LLM|Gemini|Claude|RAG/.test(tag)) },
  { id: "image", label: "이미지", test: (s) => Boolean(s.features?.image) || /이미지|디자인/i.test(s.category) },
  { id: "video", label: "영상", test: (s) => Boolean(s.features?.video) || /영상/i.test(s.category) },
  { id: "voice", label: "음성", test: (s) => Boolean(s.features?.voice) || /음성|음악/i.test(s.category) },
  { id: "search", label: "검색", test: (s) => Boolean(s.features?.search) || /검색|웹 데이터/i.test(s.category) },
  { id: "developer", label: "개발", test: (s) => Boolean(s.api) || /개발|API|인프라|플랫폼/i.test(s.category) },
  { id: "infra", label: "인프라", test: (s) => /인프라|GPU|클라우드/i.test(`${s.category} ${(s.tags || []).join(" ")}`) },
  { id: "design", label: "콘텐츠", test: (s) => /디자인|콘텐츠|음악/i.test(s.category) || (s.tags || []).some((tag) => /디자인|썸네일|콘텐츠/.test(tag)) }
];

export function matchesCategory(service, categoryId) {
  return categoryGroups.find((group) => group.id === categoryId)?.test(service) ?? true;
}

export function findServices(query = "") {
  const keyword = query.trim().toLowerCase();
  if (!keyword) return catalog;
  return catalog.filter((service) => [
    service.name,
    service.category,
    service.bestFor,
    service.caveat,
    ...(service.tags || []),
    ...(service.uses || []),
    ...(service.strengths || [])
  ].filter(Boolean).join(" ").toLowerCase().includes(keyword));
}
