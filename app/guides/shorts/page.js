// 쇼츠 제작 가이드: 실제 제작 흐름을 기준으로 서비스 선택 기준을 설명합니다.
import Link from "next/link";

export const metadata = { title: "쇼츠 만들기 AI 서비스 선택 가이드 | HUB", description: "쇼츠를 만들 때 필요한 이미지·영상·음성 AI 서비스를 어떤 기준으로 선택할지 정리했습니다." };

const rows = [
  ["이미지", "Replicate / fal", "장면 이미지나 생성형 이미지를 만들 때"],
  ["영상", "fal / Replicate", "이미지나 텍스트를 영상으로 확장할 때"],
  ["음성", "ElevenLabs", "내레이션·TTS·더빙이 필요할 때"],
  ["대본·기획", "OpenAI / Gemini", "대본 작성과 콘텐츠 아이디어를 만들 때"],
];

export default function ShortsGuide() {
  return <main className="page guideArticle"><header className="header"><Link className="logo" href="/">HUB</Link><nav><Link href="/guides">가이드</Link><Link href="/compare">비교하기</Link></nav></header>
    <article><div className="eyebrow">SHORTS GUIDE</div><h1>쇼츠 만들 때<br /><span>어떤 AI 서비스를 써야 할까?</span></h1><p className="lead">쇼츠 제작은 하나의 서비스보다 이미지·영상·음성을 각각 목적에 맞게 조합하는 방식이 편합니다.</p>
      <h2>목적별로 보면 간단합니다.</h2><div className="guideTable">{rows.map(([a,b,c]) => <div className="guideRow" key={a}><b>{a}</b><strong>{b}</strong><span>{c}</span></div>)}</div>
      <div className="callout"><b>처음 시작한다면</b><p>이미지 → 영상 → 음성 순서로 필요한 기능을 고르고, 여러 기능을 한 서비스에서 처리해야 한다면 범용 AI API를 함께 검토하면 됩니다.</p></div>
      <Link className="primaryLink" href="/?task=shorts#recommend">쇼츠용 서비스 바로 찾기 →</Link></article></main>;
}
