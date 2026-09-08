// 추천 화면에서 자연어로 입력한 요구사항을 기존 추천 조건으로 변환합니다.
// 예: "무료로 쇼츠 만들기" -> 쇼츠 + 무료 우선
// 사용자가 직접 고른 조건보다 검색어에서 명확하게 드러난 조건을 먼저 반영합니다.
const goalKeywords = {
  shorts: ["쇼츠", "숏츠", "숏폼", "릴스", "틱톡"],
  image: ["이미지", "사진", "상품사진", "상품 이미지", "썸네일", "디자인"],
  video: ["영상", "비디오", "동영상"],
  voice: ["음성", "목소리", "tts", "stt", "더빙"],
  chat: ["챗봇", "채팅봇", "llm", "대화형", "모델"],
  api: ["api", "개발", "크롤링", "스크래핑", "자동화"]
};

const featureKeywords = {
  이미지: "이미지",
  사진: "이미지",
  영상: "영상",
  비디오: "영상",
  음성: "음성",
  tts: "음성",
  더빙: "음성",
  검색: "검색",
  크롤링: "검색",
  챗봇: "챗봇"
};

export function parseRecommendationIntent(query = "") {
  const text = String(query).trim().toLowerCase();
  if (!text) return { goal: null, budget: null, skill: null, feature: null, labels: [] };

  let goal = null;
  for (const [key, words] of Object.entries(goalKeywords)) {
    if (words.some((word) => text.includes(word))) {
      goal = key;
      break;
    }
  }

  let budget = null;
  if (/무료|공짜|돈 안|비용.*없|가격.*낮|저렴/.test(text)) budget = text.includes("저렴") ? "low" : "free";

  let skill = null;
  if (/초보|처음|쉽게|간단하게|코딩.*없이|노코드/.test(text)) skill = "easy";
  else if (/개발자|개발용|코드|sdk|api/.test(text)) skill = "hard";

  let feature = null;
  for (const [word, value] of Object.entries(featureKeywords)) {
    if (text.includes(word)) {
      feature = value;
      break;
    }
  }

  const labels = [];
  if (goal) labels.push(goal === "shorts" ? "쇼츠" : goal === "image" ? "이미지" : goal === "video" ? "영상" : goal === "voice" ? "음성" : goal === "chat" ? "챗봇" : "API");
  if (budget === "free") labels.push("무료 우선");
  if (budget === "low") labels.push("저렴하게 시작");
  if (skill === "easy") labels.push("초보자 우선");
  if (skill === "hard") labels.push("개발자 기준");
  if (feature) labels.push(`${feature} 기능`);

  return { goal, budget, skill, feature, labels };
}
