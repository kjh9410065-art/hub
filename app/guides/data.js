// 검색 유입을 위한 목적형 가이드 데이터입니다.
// 서비스 카탈로그와 별도로 관리해 긴 설명형 콘텐츠를 계속 추가할 수 있습니다.
export const guides = [
  {
    slug: "ai-image-generator",
    title: "AI 이미지 생성 서비스 고르는 법",
    description: "상품 이미지, 썸네일, 디자인 작업에 맞는 AI 이미지 서비스를 고르는 기준을 정리했습니다.",
    keyword: "AI 이미지 생성",
    points: ["생성 품질보다 사용 목적을 먼저 정하기", "무료 플랜과 상업적 이용 조건 확인하기", "웹 도구와 API 중 필요한 방식을 선택하기"],
    recommendedTask: "image"
  },
  {
    slug: "ai-video-generator",
    title: "AI 영상 생성 서비스 비교 가이드",
    description: "텍스트·이미지로 영상을 만들거나 쇼츠를 제작할 때 어떤 AI 영상 서비스를 선택하면 좋은지 정리했습니다.",
    keyword: "AI 영상 생성",
    points: ["텍스트 기반과 이미지 기반 생성 방식 구분하기", "짧은 콘텐츠와 장편 제작의 요구사항 비교하기", "크레딧과 워터마크 조건 확인하기"],
    recommendedTask: "video"
  },
  {
    slug: "ai-voice-generator",
    title: "AI 음성 생성 서비스 선택 가이드",
    description: "쇼츠 내레이션, 더빙, 음성 콘텐츠에 필요한 AI 음성 서비스를 목적별로 비교하는 방법입니다.",
    keyword: "AI 음성 생성",
    points: ["한국어 자연스러움과 음색을 직접 확인하기", "상업적 사용 가능 범위 확인하기", "API가 필요한지 웹 편집기면 충분한지 판단하기"],
    recommendedTask: "voice"
  },
  {
    slug: "ai-chatbot-api",
    title: "AI 챗봇 API 고르는 기준",
    description: "AI 챗봇이나 서비스 개발에 사용할 LLM API를 고를 때 확인해야 할 핵심 항목을 정리했습니다.",
    keyword: "AI 챗봇 API",
    points: ["모델 성능과 응답 속도를 함께 보기", "토큰 비용과 무료 사용량 확인하기", "개발 환경에 맞는 API 호환성 확인하기"],
    recommendedTask: "chat"
  },
  {
    slug: "ai-tools-for-shorts",
    title: "쇼츠 제작에 필요한 AI 도구 정리",
    description: "아이디어부터 이미지, 영상, 음성까지 쇼츠 제작 과정에 맞춰 AI 도구를 선택하는 방법입니다.",
    keyword: "쇼츠 AI 도구",
    points: ["한 서비스로 모두 처리할지 전문 도구를 조합할지 결정하기", "이미지·영상·음성 단계별 비용 확인하기", "반복 제작이라면 API와 자동화를 고려하기"],
    recommendedTask: "shorts"
  },
  {
    slug: "free-ai-tools",
    title: "무료로 시작할 수 있는 AI 서비스 찾는 법",
    description: "처음 AI 서비스를 사용할 때 비용을 줄이면서 실제 작업에 맞는 도구를 찾는 방법을 소개합니다.",
    keyword: "무료 AI 서비스",
    points: ["완전 무료와 무료 체험을 구분하기", "사용량 제한과 워터마크 확인하기", "무료로 검증한 뒤 유료 전환 여부를 판단하기"],
    recommendedTask: "image"
  }
];

export function getGuide(slug) {
  return guides.find((guide) => guide.slug === slug);
}
