// HUB 검색 보조 모듈 2.0입니다.
// 정확한 서비스 이름을 몰라도 목적·기능·태그·무료 여부·API 제공 여부를 함께 찾아낼 수 있게 합니다.
// 검색 결과는 단순 포함 여부가 아니라 점수를 계산하므로 더 관련성 높은 서비스가 먼저 노출됩니다.

const aliases = {
  쇼츠: ["shorts", "영상", "콘텐츠", "음성", "숏폼"],
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
  챗봇: ["chat", "llm", "text", "api", "대화"],
  채팅봇: ["chat", "llm", "api", "대화"],
  llm: ["chat", "text", "api", "모델"],
  모델: ["llm", "chat", "text", "api"],
  api: ["api", "개발", "developer", "개발용 API"],
  개발: ["api", "developer", "개발용 API", "자동화"],
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

const fieldWeights = {
  name: 14,
  category: 9,
  bestFor: 8,
  tags: 7,
  strengths: 5,
  uses: 5,
  caveat: 1
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
  const normalized = clean(query);
  if (!normalized) return { raw: "", terms: [], expanded: [] };

  const terms = new Set(normalized.split(/\s+/).filter(Boolean));
  const expanded = new Set(terms);

  // 한글 목적어와 영어 서비스 용어를 함께 검색할 수 있도록 별칭을 확장합니다.
  terms.forEach((word) => {
    (aliases[word] || []).forEach((alias) => expanded.add(clean(alias)));
  });

  return { raw: normalized, terms: [...terms], expanded: [...expanded].filter(Boolean) };
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
    service.caveat,
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
  if (!term) return false;
  if (text === term) return 1;
  if (text.includes(term)) return 0.75;

  // 영어·한글이 섞인 검색어는 토큰 일부가 일치해도 약한 점수를 줍니다.
  const tokens = text.split(" ");
  return tokens.some((token) => token.startsWith(term) || term.startsWith(token)) ? 0.35 : 0;
}

export function scoreSearch(service, query) {
  const { raw, terms, expanded } = buildTerms(query);
  if (!raw) return 0;

  let score = 0;
  const reasons = [];

  // 원문 검색어가 서비스명에 직접 들어가면 가장 높은 가중치를 줍니다.
  const name = fieldText(service, "name");
  if (name === raw) score += 60;
  else if (name.includes(raw)) score += 45;

  // 원문 검색어와 확장어를 각 정보 필드에 적용합니다.
  const fields = ["name", "category", "bestFor", "tags", "uses", "strengths", "caveat"];
  for (const field of fields) {
    const text = fieldText(service, field);
    if (!text) continue;

    let best = 0;
    for (const term of expanded) {
      best = Math.max(best, termMatches(text, term));
    }

    if (best > 0) score += fieldWeights[field] * best;
  }

  // 여러 검색어를 입력했다면 서로 다른 단어가 모두 맞는 서비스에 추가 점수를 줍니다.
  const matchedOriginalTerms = terms.filter((term) => {
    const normalizedTerm = clean(term);
    return fields.some((field) => termMatches(fieldText(service, field), normalizedTerm) > 0);
  });
  score += matchedOriginalTerms.length * 4;
  if (matchedOriginalTerms.length === terms.length && terms.length > 1) score += 10;

  // 사용자가 명시한 무료/API 조건은 데이터 필드를 직접 확인해 오검색을 줄입니다.
  if (terms.some((term) => term === "무료" || term === "공짜")) {
    if (service.free) {
      score += 18;
      reasons.push("무료 시작 가능");
    } else {
      score -= 18;
    }
  }

  if (terms.some((term) => term === "api" || term === "개발")) {
    if (service.api) {
      score += 12;
      reasons.push("API 제공");
    } else {
      score -= 12;
    }
  }

  // 목적형 별칭이 검색된 경우 실제 uses/features도 확인합니다.
  const purposeKeys = ["shorts", "image", "video", "voice", "chat", "search", "text"];
  const matchedPurpose = expanded.find((term) => purposeKeys.includes(term));
  if (matchedPurpose) {
    if (service.uses?.includes(matchedPurpose)) {
      score += 12;
      reasons.push("목적과 직접 연결");
    } else if (service.features?.[matchedPurpose]) {
      score += 8;
      reasons.push("관련 기능 지원");
    }
  }

  return { score: Math.max(0, Math.round(score)), reasons: reasons.slice(0, 2) };
}

export function matchesSearch(service, query) {
  return !clean(query) || scoreSearch(service, query).score > 0;
}

// 검색어가 없으면 원래 카탈로그 순서를 유지하고, 검색어가 있으면 관련도 높은 순으로 정렬합니다.
export function searchCatalog(catalog, query) {
  if (!clean(query)) return catalog;

  return catalog
    .map((service, index) => ({
      service,
      index,
      ...scoreSearch(service, query)
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .map((item) => item.service);
}

// 홈 추천 화면에서 기존 추천 순위를 유지하면서 검색어가 강하게 맞는 서비스만 위로 올립니다.
export function rankSearchResults(services, query) {
  if (!clean(query)) return services;

  return services
    .map((service, index) => ({
      service,
      index,
      ...scoreSearch(service, query)
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .map((item) => item.service);
}
