// HUB 가이드 허브: 검색엔진에서 목적별 서비스 추천 콘텐츠로 진입할 수 있게 합니다.
import Link from "next/link";
import "./guide.css";

const guides = [
  ["shorts", "쇼츠 만들기", "쇼츠 제작에 필요한 이미지·영상·음성 도구를 목적별로 정리"],
  ["image", "AI 이미지 만들기", "이미지 생성·편집에 사용할 수 있는 대표 서비스를 비교"],
  ["video", "AI 영상 만들기", "텍스트·이미지 기반 영상 제작 서비스와 선택 기준을 정리"],
  ["chat", "AI 챗봇 만들기", "LLM API를 이용해 챗봇을 만들 때 고려할 서비스를 정리"],
  ["voice", "AI 음성 만들기", "TTS·더빙·음성 콘텐츠 제작에 적합한 서비스를 정리"],
  ["api", "개발용 AI API 찾기", "기능·난이도·비용·API 제공 여부를 기준으로 선택하는 방법을 정리"]
];

export const metadata = {
  title: "AI 서비스 선택 가이드 | HUB",
  description: "무엇을 만들지에 따라 어떤 AI 서비스를 선택하면 좋은지 목적별로 정리한 HUB 가이드입니다."
};

export default function Guides() {
  return <main className="guideArticle">
    <header className="header"><Link className="logo" href="/">HUB</Link><nav><Link href="/">서비스 찾기</Link><Link href="/recommend">추천받기</Link><Link href="/compare">비교하기</Link><Link href="/tools/ai-cost-calculator">비용 계산기</Link></nav></header>
    <section className="guideArticleHero"><div className="eyebrow">HUB GUIDE</div><h1>무엇을 만들지 정했다면,<br /><span>도구 선택은 더 쉽게.</span></h1><p>목적별로 어떤 서비스가 잘 맞는지 빠르게 확인하세요.</p></section>
    <section className="guideArticleBody">
      <div className="guideServiceList">{guides.map(([id,title,desc]) => <Link href={`/guides/${id}`} key={id}><strong>{title}</strong><span>{desc}</span></Link>)}</div>
      <Link className="primaryLink" href="/tools/ai-cost-calculator">AI API 비용 계산기 열기</Link>
    </section>
  </main>;
}
