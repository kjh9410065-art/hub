// HUB 검색 보조 모듈 3.1입니다.
// 검색어를 목적 + 조건으로 해석하고, 결과가 없을 때도 관련 목적을 기준으로 대안을 제시합니다.

const aliases = {
  쇼츠: ["shorts", "영상", "콘텐츠", "숏폼"], 숏츠: ["shorts", "영상", "콘텐츠", "숏폼"], 릴스: ["shorts", "영상", "콘텐츠", "숏폼"], 틱톡: ["shorts", "영상", "콘텐츠", "숏폼"], 숏폼: ["shorts", "영상", "콘텐츠"],
  이미지: ["image", "생성", "디자인", "사진"], 사진: ["image", "상품 이미지", "이미지"], 상품사진: ["image", "상품", "커머스", "상품 이미지"], 상품이미지: ["image", "상품", "커머스", "상품 사진"], 썸네일: ["image", "디자인", "콘텐츠"],
  영상: ["video", "동영상", "쇼츠", "숏폼"], 비디오: ["video", "동영상"],
  음성: ["voice", "tts", "더빙", "목소리"], 목소리: ["voice", "tts", "음성"], 더빙: ["voice", "음성", "아바타"], tts: ["voice", "음성", "더빙"], stt: ["voice", "전사", "음성"],
  챗봇: ["chat", "llm", "대화"], 채팅봇: ["chat", "llm", "대화"], llm: ["chat", "text", "모델"], 모델: ["llm", "chat", "text"],
  api: ["api", "개발", "developer", "개발용 api"], 개발: ["api", "developer", "개발용 api", "자동화"],
  크롤링: ["search", "웹 데이터", "firecrawl", "스크래핑"], 스크래핑: ["search", "웹 데이터", "크롤링"], 검색: ["search", "웹 데이터", "크롤링", "리서치"], 리서치: ["search", "웹 검색", "검색", "데이터"],
  무료: ["free"], 공짜: ["free"], 오픈소스: ["open model", "huggingface", "오픈 모델"], 오픈모델: ["open model", "오픈 모델", "huggingface"],
  빠른: ["fast", "추론", "groq", "cerebras", "고속"], 고속: ["fast", "추론", "groq", "cerebras", "빠른"], 한국어: ["korean", "음성", "text", "tts"], 기업: ["기업용", "enterprise", "cloud", "보안"], 자동화: ["api", "워크플로", "개발", "영상"]
};

const conditionTerms = new Set(["무료", "공짜", "api", "개발"]);
const purposeAliases = {
  쇼츠: "shorts", 숏츠: "shorts", 릴스: "shorts", 틱톡: "shorts", 숏폼: "shorts",
  이미지: "image", 사진: "image", 상품사진: "image", 상품이미지: "image", 썸네일: "image",
  영상: "video", 비디오: "video", 음성: "voice", 목소리: "voice", 더빙: "voice", tts: "voice", stt: "voice",
  챗봇: "chat", 채팅봇: "chat", llm: "chat", 모델: "chat", 검색: "search", 크롤링: "search", 스크래핑: "search", 리서치: "search"
};
const fieldWeights = { name: 18, category: 8, bestFor: 7, tags: 6, strengths: 4, uses: 5, caveat: 0 };

function clean(value = "") {
  // 검색어와 서비스 데이터를 동일한 규칙으로 정규화합니다.
  return String(value).trim().toLowerCase().replace(/[·,./|()[\]{}:_-]+/g, " ").replace(/\s+/g, " ");
}

function buildTerms(query) {
  const raw = clean(query);
  if (!raw) return { raw: "", terms: [], expanded: [], purposes: [], conditions: [] };
  const terms = raw.split(/\s+/).filter(Boolean);
  const expanded = new Set(terms);
  const purposes = new Set();
  const conditions = new Set();

  terms.forEach((word) => {
    if (purposeAliases[word]) purposes.add(purposeAliases[word]);
    if (conditionTerms.has(word)) conditions.add(word === "공짜" ? "무료" : word);
    if (!conditionTerms.has(word)) (aliases[word] || []).forEach((alias) => expanded.add(clean(alias)));
  });

  return { raw, terms, expanded: [...expanded].filter(Boolean), purposes: [...purposes], conditions: [...conditions] };
}

export function normalizeSearchQuery(query = "") {
  const { raw, terms, expanded } = buildTerms(query);
  return { raw, terms: expanded.length ? [raw, ...expanded] : terms };
}

export function getSearchText(service) {
  return [service.name, service.category, service.bestFor, ...(service.tags || []), ...(service.uses || []), ...(service.strengths || [])].filter(Boolean).join(" ").toLowerCase();
}

function fieldText(service, field) {
  if (["tags", "uses", "strengths"].includes(field)) return clean((service[field] || []).join(" "));
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

  // 서비스명 직접 일치를 가장 강하게 반영합니다.
  if (name === raw) score += 80;
  else if (name.includes(raw)) score += 55;

  // 일반 검색은 설명·태그 등을 참고하되 주의사항은 순위에 사용하지 않습니다.
  for (const field of fields) {
    const text = fieldText(service, field);
    if (!text) continue;
    let best = 0;
    for (const term of expanded) best = Math.max(best, termMatches(text, term));
    if (best > 0) score += fieldWeights[field] * best;
  }

  // 복합 검색은 입력한 각각의 단어가 실제 정보에 맞는지 확인합니다.
  const matchedOriginalTerms = terms.filter((term) => conditionTerms.has(term) || fields.some((field) => termMatches(fieldText(service, field), term) > 0));
  score += matchedOriginalTerms.length * 3;
  if (terms.length > 1 && matchedOriginalTerms.length === terms.length) score += 12;

  // 목적은 단순 문자열보다 uses를 우선하고 features는 보조 점수만 줍니다.
  purposes.forEach((purpose) => {
    if (service.uses?.includes(purpose)) { score += 24; reasons.push("목적과 직접 연결"); }
    else if (service.features?.[purpose]) { score += 10; reasons.push("관련 기능 지원"); }
    else score -= 8;
  });

  if (purposes.length > 1 && purposes.every((purpose) => serviceSupportsPurpose(service, purpose))) {
    score += 14;
    reasons.push("여러 기능을 함께 지원");
  }

  // 무료/API는 일반 텍스트 검색이 아니라 명시적인 조건으로 처리합니다.
  if (conditions.includes("무료")) {
    if (service.free) { score += 24; reasons.push("무료 시작 가능"); }
    else score -= 30;
  }
  if (conditions.includes("api")) {
    if (service.api) { score += 24; reasons.push("API 제공"); }
    else score -= 30;
  }

  return { score: Math.max(0, Math.round(score)), reasons: [...new Set(reasons)].slice(0, 2) };
}

export function matchesSearch(service, query) {
  return !clean(query) || scoreSearch(service, query).score > 0;
}

export function searchCatalog(catalog, query) {
  if (!clean(query)) return catalog;
  return catalog.map((service, index) => ({ service, index, ...scoreSearch(service, query) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .map((item) => item.service);
}

export function rankSearchResults(services, query) {
  return searchCatalog(services, query);
}

// 검색 결과가 없을 때 원래 검색 의도를 바탕으로 보여줄 대안을 계산합니다.
// 현재 검색어와 완전히 일치할 필요는 없으며, 목적/기능이 비슷한 서비스만 선택합니다.
export function getSearchSuggestions(services, query, limit = 3) {
  const { raw, purposes, conditions } = buildTerms(query);
  if (!raw) return [];

  const candidates = services.map((service, index) => {
    let score = 0;
    if (purposes.length) {
      purposes.forEach((purpose) => {
        if (service.uses?.includes(purpose)) score += 20;
        else if (service.features?.[purpose]) score += 8;
      });
    }
    if (conditions.includes("무료") && service.free) score += 6;
    if (conditions.includes("api") && service.api) score += 6;
    if (!purposes.length) {
      const text = getSearchText(service);
      if (raw && text.includes(raw)) score += 10;
    }
    return { service, score, index };
  });

  return candidates.filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .slice(0, limit)
    .map((item) => item.service);
}
