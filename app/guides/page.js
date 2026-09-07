// HUB 가이드 허브: 검색엔진에서 목적별 서비스 추천 콘텐츠로 진입할 수 있게 합니다.
import Link from "next/link";

const guides = [
  ["shorts", "쇼츠 만들기", "쇼츠 제작에 필요한 이미지·영상·음성 도구를 목적별로 정리"],
  ["image", "AI 이미지 만들기", "이미지 생성·편집에 사용할 수 있는 대표 서비스를 비교"],
  ["chat", "AI 챗봇 만들기", "LLM API를 이용해 챗봇을 만들 때 고려할 서비스를 정리"],
  ["voice", "AI 음성 만들기", "TTS·더빙·음성 콘텐츠 제작에 적합한 서비스를 정리"],
];

export const metadata = {
  title: "AI 서비스 선택 가이드 | HUB",
  description: "무엇을 만들지에 따라 어떤 AI 서비스를 선택하면 좋은지 목적별로 정리한 HUB 가이드입니다."
};

export default function Guides() {
  return <main className="page guidePage">
    <header className="header"><Link className="logo" href="/">HUB</Link><nav><Link href="/">서비스 찾기</Link><Link href="/compare">비교하기</Link><Link href="/tools/ai-cost-calculator">비용 계산기</Link></nav></header>
    <section className="guideHero"><div className="eyebrow">HUB GUIDE</div><h1>무엇을 만들지 정했다면,<br /><span>도구 선택은 더 쉽게.</span></h1><p>목적별로 어떤 서비스가 잘 맞는지 빠르게 확인하세요.</p></section>
    <section className="section"><div className="guideGrid">{guides.map(([id,title,desc]) => <Link className="guideCard" href={`/guides/${id}`} key={id}><span>HUB GUIDE</span><h2>{title}</h2><p>{desc}</p><b>가이드 보기 →</b></Link>)}</div><Link className="primaryLink" href="/tools/ai-cost-calculator" style={{display:"block",marginTop:18,textAlign:"center"}}>AI API 비용 계산기 →</Link></section>
  </main>;
}
