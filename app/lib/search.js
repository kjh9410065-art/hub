// HUB 검색 보조 모듈입니다.
// 사용자가 서비스 이름을 정확히 입력하지 않아도 목적·기능·약어로 찾을 수 있도록 검색어를 확장합니다.

const aliases = {
  쇼츠: ["shorts", "영상", "콘텐츠", "음성"],
  숏츠: ["shorts", "영상", "콘텐츠"],
  릴스: ["shorts", "영상", "콘텐츠"],
  틱톡: ["shorts", "영상", "콘텐츠"],
  이미지: ["image", "생성", "디자인"],
  사진: ["image", "상품 이미지"],
  상품사진: ["image", "상품", "커머스"],
  상품이미지: ["image", "상품", "커머스"],
  영상: ["video", "동영상", "쇼츠"],
  비디오: ["video", "동영상"],
  음성: ["voice", "tts", "더빙"],
  목소리: ["voice", "tts"],
  더빙: ["voice", "음성"],
  tts: ["voice", "음성"],
  챗봇: ["chat", "llm", "text", "api"],
  채팅봇: ["chat", "llm", "api"],
  llm: ["chat", "text", "api"],
  api: ["api", "개발", "developer"],
  개발: ["api", "developer"],
  크롤링: ["search", "웹 데이터", "firecrawl"],
  검색: ["search", "웹 데이터", "크롤링"],
  무료: ["free"],
  공짜: ["free"],
  오픈소스: ["open model", "huggingface", "오픈 모델"],
  빠른: ["fast", "추론", "groq"],
  한국어: ["korean", "음성", "text"]
};

export function normalizeSearchQuery(query = "") {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return { raw: "", terms: [] };

  const terms = new Set([normalized]);
  normalized.split(/\s+/).forEach((word) => {
    terms.add(word);
    (aliases[word] || []).forEach((alias) => terms.add(alias.toLowerCase()));
  });

  return { raw: normalized, terms: [...terms] };
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

export function matchesSearch(service, query) {
  const { raw, terms } = normalizeSearchQuery(query);
  if (!raw) return true;

  // 무료/공짜는 서비스 데이터의 별도 boolean 값을 직접 검사합니다.
  if ((raw === "무료" || raw === "공짜") && service.free) return true;

  // 원래 검색어가 직접 포함되면 가장 확실한 일치로 처리합니다.
  const text = getSearchText(service);
  if (text.includes(raw)) return true;

  // 확장된 목적·기능 단어 중 하나라도 서비스 정보에 포함되면 결과에 포함합니다.
  return terms.slice(1).some((term) => term !== "free" && text.includes(term));
}

export function searchCatalog(catalog, query) {
  return catalog.filter((service) => matchesSearch(service, query));
}
