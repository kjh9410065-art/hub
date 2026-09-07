// HUB 추천 엔진 1.3: 목적을 가장 크게 반영하고 예산·난이도·기능 조건으로 후보를 정교하게 좁힙니다.
const goalWeights = {
  shorts: { shorts: 8, video: 5, image: 4, voice: 3 },
  image: { image: 9, video: 3, shorts: 2 },
  video: { video: 9, image: 4, shorts: 3 },
  voice: { voice: 10, shorts: 3 },
  chat: { chat: 10, api: 4 },
  api: { api: 10, search: 5, chat: 2 }
};

const difficultyWeight = { easy: 5, medium: 3, hard: 1 };
const difficultyMap = { "쉬움": "easy", "보통": "medium", "어려움": "hard" };
const priceWeight = { "저렴": 5, "중간": 2, "높음": 0 };

export function scoreService(service, { goal = "shorts", budget = "any", skill = "any", feature = "all" } = {}) {
  let score = 0;
  const reasons = [];
  const weights = goalWeights[goal] || {};

  // 선택한 목적과 서비스의 uses/features를 비교해 가장 큰 비중으로 점수를 줍니다.
  for (const [key, weight] of Object.entries(weights)) {
    if (service.uses?.includes(key)) score += weight;
    else if (service.features?.[key]) score += Math.round(weight * 0.75);
  }

  if (service.uses?.includes(goal)) {
    score += 5;
    reasons.push("선택한 목적과 직접 연결");
  }

  // 예산: 무료 우선은 무료 서비스를 강하게 우대하고, 저렴하게 시작은 가격 부담을 반영합니다.
  if (budget === "free") {
    if (service.free) {
      score += 8;
      reasons.push("무료로 시작 가능");
    } else {
      score -= 7;
    }
  } else if (budget === "low") {
    score += priceWeight[service.price] || 0;
    if (service.price === "저렴") reasons.push("비용 부담이 낮은 편");
    if (service.free) {
      score += 3;
      reasons.push("무료 구간으로 테스트 가능");
    }
  }

  // 개발 경험: 서비스의 실제 난이도를 사용자가 선택한 수준과 맞춥니다.
  if (skill !== "any") {
    const expected = difficultyMap[service.difficulty] || "medium";
    if (expected === skill) {
      score += difficultyWeight[skill] || 2;
      reasons.push(`${service.difficulty} 수준으로 접근 가능`);
    } else if (skill === "easy" && expected === "hard") {
      score -= 6;
    } else if (skill === "medium" && expected === "hard") {
      score -= 2;
    }
  }

  // 가장 중요한 기능을 별도 가중치로 적용합니다.
  if (feature !== "all") {
    const featureKey = { 이미지: "image", 영상: "video", 음성: "voice", 챗봇: "text", 검색: "search" }[feature];
    if (featureKey && service.features?.[featureKey]) {
      score += 8;
      reasons.push(`${feature} 기능 지원`);
    } else {
      score -= 6;
    }
  }

  if (service.api) score += 1;
  return { score, reasons: [...new Set(reasons)].slice(0, 3) };
}

// 모든 카탈로그 서비스를 같은 기준으로 계산하고 높은 순서대로 정렬합니다.
export function rankServices(services, options) {
  return services
    .map((service) => ({ service, ...scoreService(service, options) }))
    .sort((a, b) => b.score - a.score);
}
