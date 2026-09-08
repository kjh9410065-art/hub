// HUB 추천 엔진 2.0
// 단순히 서비스 이름이나 무료 여부만 비교하지 않고,
// 사용자가 선택한 목적과 실제 서비스 기능의 겹치는 정도를 중심으로 순위를 계산합니다.

const goalWeights = {
  shorts: { shorts: 10, video: 6, image: 5, voice: 4 },
  image: { image: 10, video: 4, shorts: 2 },
  video: { video: 10, image: 5, shorts: 3 },
  voice: { voice: 10, shorts: 3 },
  chat: { chat: 10, api: 5, text: 3 },
  api: { api: 10, search: 5, chat: 2 }
};

const goalLabels = {
  shorts: "쇼츠 제작",
  image: "이미지 제작",
  video: "영상 제작",
  voice: "음성 제작",
  chat: "AI 챗봇",
  api: "개발용 API"
};

const difficultyWeight = { easy: 5, medium: 3, hard: 1 };
const difficultyMap = { "쉬움": "easy", "보통": "medium", "어려움": "hard" };
const priceWeight = { "저렴": 5, "중간": 2, "높음": 0 };
const featureMap = { 이미지: "image", 영상: "video", 음성: "voice", 챗봇: "text", 검색: "search", 텍스트: "text" };

// 서비스 기능을 사람이 바로 이해할 수 있는 추천 문구로 바꿉니다.
const featureLabels = {
  text: "텍스트 처리",
  image: "이미지 생성·처리",
  video: "영상 생성·처리",
  voice: "음성 기능",
  search: "검색 기능",
  api: "개발용 API"
};

function addReason(reasons, reason) {
  if (reason && !reasons.includes(reason)) reasons.push(reason);
}

export function scoreService(service, { goal = "shorts", budget = "any", skill = "any", feature = "all" } = {}) {
  let score = 0;
  const reasons = [];
  const weights = goalWeights[goal] || {};

  // 목적별 핵심 uses/features에 가중치를 적용합니다.
  // uses가 직접 일치하면 가장 높은 점수를 주고, 기능만 지원하는 경우에는 일부 점수만 줍니다.
  for (const [key, weight] of Object.entries(weights)) {
    if (service.uses?.includes(key)) {
      score += weight;
    } else if (service.features?.[key]) {
      score += Math.round(weight * 0.7);
    }
  }

  // 선택 목적 자체를 지원하는 서비스는 강하게 우선합니다.
  if (service.uses?.includes(goal)) {
    score += 7;
    addReason(reasons, `${goalLabels[goal] || "선택한 목적"}에 직접 활용 가능`);
  }

  // 대표 설명과 태그가 목적과 맞는 경우 실제 사용 맥락을 보정합니다.
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
      addReason(reasons, "무료로 시작 가능");
    } else {
      score -= 8;
    }
  } else if (budget === "low") {
    score += priceWeight[service.price] || 0;
    if (service.price === "저렴") addReason(reasons, "비용 부담이 낮은 편");
    if (service.free) {
      score += 3;
      addReason(reasons, "무료 구간으로 테스트 가능");
    }
  }

  // 개발 난이도 조건이 선택된 경우 목적 적합도와 별도로 난이도를 반영합니다.
  if (skill !== "any") {
    const expected = difficultyMap[service.difficulty] || "medium";
    if (expected === skill) {
      score += difficultyWeight[skill] || 2;
      addReason(reasons, `${service.difficulty} 수준으로 접근 가능`);
    } else if (skill === "easy" && expected === "hard") {
      score -= 7;
      addReason(reasons, "초보자에게는 설정 난도가 높을 수 있음");
    } else if (skill === "medium" && expected === "hard") {
      score -= 3;
    }
  }

  // 사용자가 고른 핵심 기능은 결과 순위를 크게 바꾸도록 별도 가중치를 적용합니다.
  if (feature !== "all") {
    const featureKey = featureMap[feature];
    if (featureKey && service.features?.[featureKey]) {
      score += 9;
      addReason(reasons, `${feature} 기능 지원`);
    } else {
      score -= 8;
    }
  }

  // API 목적에는 API 제공 여부를 명확하게 반영합니다.
  if (goal === "api") {
    if (service.api) {
      score += 6;
      addReason(reasons, "개발용 API 제공");
    } else {
      score -= 8;
    }
  } else if (service.api) {
    // 다른 목적에서도 개발 확장성이 있는 서비스는 소폭 우대합니다.
    score += 1;
  }

  // 목적과 실제 기능이 동시에 맞는 경우 카드에 보여줄 두 번째 이유를 보강합니다.
  const matchingFeatures = Object.entries(service.features || {})
    .filter(([key, enabled]) => enabled && weights[key])
    .sort((a, b) => (weights[b[0]] || 0) - (weights[a[0]] || 0));

  if (matchingFeatures.length && reasons.length < 3) {
    const [key] = matchingFeatures[0];
    addReason(reasons, `${featureLabels[key] || key} 활용 가능`);
  }

  // 이유는 카드가 길어지지 않도록 최대 3개까지만 제공합니다.
  return { score, reasons: reasons.slice(0, 3) };
}

// 점수가 같을 때도 무료·쉬운 서비스·API 제공 순으로 안정적으로 정렬합니다.
export function rankServices(services, options) {
  return services
    .map((service) => ({ service, ...scoreService(service, options) }))
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (Number(b.service.free) !== Number(a.service.free)) return Number(b.service.free) - Number(a.service.free);

      const aDifficulty = difficultyMap[a.service.difficulty] || "medium";
      const bDifficulty = difficultyMap[b.service.difficulty] || "medium";
      if (aDifficulty !== bDifficulty) {
        return (aDifficulty === "easy" ? -1 : 1) - (bDifficulty === "easy" ? -1 : 1);
      }

      if (Number(b.service.api) !== Number(a.service.api)) return Number(b.service.api) - Number(a.service.api);
      return a.service.name.localeCompare(b.service.name);
    });
}
