// HUB 검색 보조 모듈 3.0입니다.
// 검색어를 단순 문자열이 아니라 "목적 + 조건"으로 해석해 관련 서비스가 먼저 나오도록 합니다.
// 홈과 카탈로그가 같은 검색 엔진을 사용하도록 모든 검색 순위 계산을 이 모듈에서 처리합니다.

const aliases = {
  쇼츠: ["shorts", "영상", "콘텐츠", "숏폼"],
  숏츠: ["shorts", "영상", "콘텐츠", "숏폼"],
  릴스: ["shorts", "영상", "콘텐츠", "숏폼"],
  틱톡: ["shorts", "영상", "콘텐츠", "숏폼"],
  숏폼: ["shorts", "영상", "콘텐츠"],
  이미지: ["image", "생성", "디자인", "사진"],
  사진: ["image", "상품 이미지", "이미지"],
  상품사진: ["image", "상품", "커머스", "상품 이미지"],
  상품이미지: ["image", "상품", "커머스", "상품 사진"],
  썸네일: ["image", "디자인", "콘텐츠"],
  영상: ["video", "동영상", "쇼츠", "숏폼"],
  비디오: ["video", "동영상"],
  음성: ["voice", "tts", "더빙", "목소리"],
  목소리: ["voice", "tts", "음성"],
  더빙: ["voice", "음성", "아바타"],
  tts: ["voice", "음성", "더빙"],
  stt: ["voice", "전사", "음성"],
  챗봇: ["chat", "llm", "대화"],
  채팅봇: ["chat", "llm", "대화"],
  llm: ["chat", "text", "모델"],
  모델: ["llm", "chat", "text"],
  api: ["api", "개발", "developer", "개발용 api"],
  개발: ["api", "developer", "개발용 api", "자동화"],
  크롤링: ["search", "웹 데이터", "firecrawl", "스크래핑"],
  스크래핑: ["search", "웹 데이터", "크롤링"],
  검색: ["search", "웹 데이터", "크롤링", "리서치"],
  리서치: ["search", "웹 검색", "검색", "데이터"],
  무료: ["free"],
  공짜: ["free"],
  오픈소스: ["open model", "huggingface", "오픈 모델"],
  오픈모델: ["open model", "오픈 모델", "huggingface"],
  빠른: ["fast", "추론", "groq", "cerebras", "고속"],
  고속: ["fast", "추론", "groq", "cerebras", "빠른"],
  한국어: ["korean", "음성", "text", "tts"],
  기업: ["기업용", "enterprise", "cloud", "보안"],
  자동화: ["api", "워크플로", "개발", "영상"]
};

// 검색 조건으로만 쓰이고 일반 관련도 점수에는 넣지 않는 단어입니다.
const conditionTerms = new Set(["무료", "공짜", "api", "개발"]);

// 사용 목적은 aliases의 확장어와 별도로 직접 판별해 과도한 연쇄 매칭을 막습니다.
const purposeAliases = {
  쇼츠: "shorts", 숏츠: "shorts", 릴스: "shorts", 틱톡: "shorts", 숏폼: "shorts",
  이미지: "image", 사진: "image", 상품사진: "image", 상품이미지: "image", 썸네일: "image",
  영상: "video", 비디오: "video",
  음성: "voice", 목소리: "voice", 더빙: "voice", tts: "voice", stt: "voice",
  챗봇: "chat", 채팅봇: "chat", llm: "chat", 모델: "chat",
  검색: "search", 크롤링: "search", 스크래핑: "search", 리서치: "search"
};

const fieldWeights = {
  name: 18,
  category: 8,
  bestFor: 7,
  tags: 6,
  strengths: 4,
  uses: 5,
  caveat: 0
};

function clean(value = "") {
  // 검색어와 서비스 데이터를 같은 형태로 비교하기 위해 공백과 기호를 단순화합니다.
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[·,./|()[\]{}:_-]+/g, " ")
    .replace(/\s+/g, " ");
}

function buildTerms(query) {
  const raw = clean(query);
  if (!raw) return { raw: "", terms: [], expanded: [], purposes: [], conditions: [] };

  const terms = raw.split(/\s+/).filter(Boolean);
  const expanded = new Set(terms);
  const purposes = new Set();
  const conditions = new Set();

  terms.forEach((word) => {
    const purpose = purposeAliases[word];
    if (purpose) purposes.add(purpose);

    if (conditionTerms.has(word)) conditions.add(word === "공짜" ? "무료" : word);

    // 조건어는 일반 검색 확장에서 제외합니다. 무료/API가 텍스트 필드 때문에 엉뚱한 서비스를 올리는 것을 막습니다.
    if (!conditionTerms.has(word)) {
      (aliases[word] || []).forEach((alias) => expanded.add(clean(alias)));
    }
  });

  return {
    raw,
    terms,
    expanded: [...expanded].filter(Boolean),
    purposes: [...purposes],
    conditions: [...conditions]
  };
}

export function normalizeSearchQuery(query = "") {
  const { raw, terms, expanded } = buildTerms(query);
  return { raw, terms: expanded.length ? [raw, ...expanded] : terms };
}

export function getSearchText(service) {
  return [
    service.name,
    service.category,
    service.bestFor,
    ...(service.tags || []),
    ...(service.uses || []),
    ...(service.strengths || [])
  ].filter(Boolean).join(" ").toLowerCase();
}

function fieldText(service, field) {
  if (field === "tags" || field === "uses" || field === "strengths") {
    return clean((service[field] || []).join(" "));
  }
  return clean(service[field]);
}

function termMatches(text, term) {
  if (!term) return 0;
  if (text === term) return 1;
  if (text.includes(term)) return 0.75;

  const tokens = text.split(" ");
  return tokens.some((token) => token.startsWith(term) || term.startsWith(token)) ? 0.35 : 0;
}

function serviceSupportsPurpose(service, purpose) {
  return Boolean(service.uses?.includes(purpose) || service.features?.[purpose]);
}

export function scoreSearch(service, query) {
  const { raw, terms, expanded, purposes, conditions } = buildTerms(query);
  if (!raw) return { score: 0, reasons: [] };

  let score = 0;
  const reasons = [];
  const fields = ["name", "category", "bestFor", "tags", "uses", "strengths"];
  const name = fieldText(service, "name");

  // 서비스 이름을 직접 찾은 경우 가장 강하게 올립니다.
  if (name === raw) score += 80;
  else if (name.includes(raw)) score += 55;

  // 일반 검색어는 서비스 설명을 참고하되, caveat(주의사항)는 검색 순위에 사용하지 않습니다.
  for (const field of fields) {
    const text = fieldText(service, field);
    if (!text) continue;

    let best = 0;
    for (const term of expanded) {
      best = Math.max(best, termMatches(text, term));
    }
    if (best > 0) score += fieldWeights[field] * best;
  }

  // 검색어 각각이 실제 서비스 정보에 존재하는지 확인해 복합 검색의 정확도를 높입니다.
  const matchedOriginalTerms = terms.filter((term) => {
    if (conditionTerms.has(term)) return true;
    return fields.some((field) => termMatches(fieldText(service, field), term) > 0);
  });
  score += matchedOriginalTerms.length * 3;
  if (terms.length > 1 && matchedOriginalTerms.length === terms.length) score += 12;

  // 목적어는 단순 문자열 일치보다 실제 uses/features를 우선합니다.
  purposes.forEach((purpose) => {
    if (service.uses?.includes(purpose)) {
      score += 24;
      reasons.push("목적과 직접 연결");
    } else if (service.features?.[purpose]) {
      score += 10;
      reasons.push("관련 기능 지원");
    } else {
      score -= 8;
    }
  });

  // 여러 목적을 동시에 검색하면 모든 목적을 지원하는 서비스에 추가 보너스를 줍니다.
  if (purposes.length > 1 && purposes.every((purpose) => serviceSupportsPurpose(service, purpose))) {
    score += 14;
    reasons.push("여러 기능을 함께 지원");
  }

  // 무료/API는 검색 조건으로 강하게 반영합니다.
  if (conditions.includes("무료")) {
    if (service.free) {
      score += 24;
      reasons.push("무료 시작 가능");
    } else {
      score -= 30;
    }
  }

  if (conditions.includes("api")) {
    if (service.api) {
      score += 24;
      reasons.push("API 제공");
    } else {
      score -= 30;
    }
  }

  // 이유는 최대 2개만 표시해 카드가 복잡해지지 않게 합니다.
  return { score: Math.max(0, Math.round(score)), reasons: [...new Set(reasons)].slice(0, 2) };
}

export function matchesSearch(service, query) {
  return !clean(query) || scoreSearch(service, query).score > 0;
}

// 검색어가 없으면 카탈로그 원래 순서를 유지하고, 검색어가 있으면 동일한 엔진으로 관련도를 계산합니다.
export function searchCatalog(catalog, query) {
  if (!clean(query)) return catalog;

  return catalog
    .map((service, index) => ({ service, index, ...scoreSearch(service, query) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .map((item) => item.service);
}

// 홈과 카탈로그가 같은 검색 결과를 사용하도록 동일한 순위 계산을 적용합니다.
export function rankSearchResults(services, query) {
  return searchCatalog(services, query);
}
