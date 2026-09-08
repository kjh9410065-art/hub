// HUB 추천 엔진 1.7: 목적을 가장 크게 반영하고 예산·난이도·기능·API 조건을 함께 계산합니다.
const goalWeights = {
  shorts: { shorts: 10, video: 6, image: 5, voice: 4 },
  image: { image: 10, video: 4, shorts: 2 },
  video: { video: 10, image: 5, shorts: 3 },
  voice: { voice: 10, shorts: 3 },
  chat: { chat: 10, api: 5, text: 3 },
  api: { api: 10, search: 5, chat: 2 }
};

const difficultyWeight = { easy: 5, medium: 3, hard: 1 };
const difficultyMap = { "쉬움": "easy", "보통": "medium", "어려움": "hard" };
const priceWeight = { "저렴": 5, "중간": 2, "높음": 0 };
const featureMap = { 이미지: "image", 영상: "video", 음성: "voice", 챗봇: "text", 검색: "search", 텍스트: "text" };

export function scoreService(service, { goal = "shorts", budget = "any", skill = "any", feature = "all" } = {}) {
  let score = 0;
  const reasons = [];
  const weights = goalWeights[goal] || {};

  // 선택한 목적과 서비스의 uses/features를 비교합니다. 직접적인 uses 일치가 가장 높은 점수를 받습니다.
  for (const [key, weight] of Object.entries(weights)) {
    if (service.uses?.includes(key)) score += weight;
    else if (service.features?.[key]) score += Math.round(weight * 0.7);
  }

  if (service.uses?.includes(goal)) {
    score += 7;
    reasons.push("선택한 목적과 직접 연결");
  }

  // 서비스의 대표 용도와 목적이 의미상 맞으면 작은 보정 점수를 추가합니다.
  const purposeText = `${service.bestFor || ""} ${(service.tags || []).join(" ")}`.toLowerCase();
  const purposeHints = {
    shorts: ["쇼츠", "콘텐츠", "영상"],
    image: ["이미지", "디자인", "상품"],
    video: ["영상", "비디오"],
    voice: ["음성", "더빙", "tts"],
    chat: ["챗봇", "llm", "텍스트"],
    api: ["api", "검색", "데이터", "개발"]
  }[goal] || [];
  if (purposeHints.some((hint) => purposeText.includes(hint))) score += 2;

  // 예산 조건입니다.
  if (budget === "free") {
    if (service.free) {
      score += 9;
      reasons.push("무료로 시작 가능");
    } else {
      score -= 8;
    }
  } else if (budget === "low") {
    score += priceWeight[service.price] || 0;
    if (service.price === "저렴") reasons.push("비용 부담이 낮은 편");
    if (service.free) {
      score += 3;
      reasons.push("무료 구간으로 테스트 가능");
    }
  }

  // 개발 경험과 실제 서비스 난이도를 맞춥니다.
  if (skill !== "any") {
    const expected = difficultyMap[service.difficulty] || "medium";
    if (expected === skill) {
      score += difficultyWeight[skill] || 2;
      reasons.push(`${service.difficulty} 수준으로 접근 가능`);
    } else if (skill === "easy" && expected === "hard") {
      score -= 7;
      reasons.push("초보자에게는 설정 난도가 높을 수 있음");
    } else if (skill === "medium" && expected === "hard") {
      score -= 3;
    }
  }

  // 사용자가 고른 핵심 기능은 결과 순위를 크게 바꾸도록 별도 가중치를 적용합니다.
  if (feature !== "all") {
    const featureKey = featureMap[feature];
    if (featureKey && service.features?.[featureKey]) {
      score += 9;
      reasons.push(`${feature} 기능 지원`);
    } else {
      score -= 8;
    }
  }

  // API 목적에는 API 제공 여부를 명확하게 반영합니다.
  if (goal === "api") {
    if (service.api) {
      score += 6;
      reasons.push("개발용 API 제공");
    } else {
      score -= 8;
    }
  } else if (service.api) {
    score += 1;
  }

  return { score, reasons: [...new Set(reasons)].slice(0, 3) };
}

// 점수가 같을 때도 무료·쉬운 서비스·API 제공 순으로 안정적으로 정렬합니다.
export function rankServices(services, options) {
  return services
    .map((service) => ({ service, ...scoreService(service, options) }))
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (Number(b.service.free) !== Number(a.service.free)) return Number(b.service.free) - Number(a.service.free);
      if (a.service.difficulty !== b.service.difficulty) return (difficultyMap[a.service.difficulty] === "easy" ? -1 : 1) - (difficultyMap[b.service.difficulty] === "easy" ? -1 : 1);
      return a.service.name.localeCompare(b.service.name);
    });
}
