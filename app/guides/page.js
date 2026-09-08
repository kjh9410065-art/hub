// HUB 가이드 허브: 검색엔진에서 목적별 서비스 추천 콘텐츠로 진입할 수 있게 합니다.
import Link from "next/link";
import { guides } from "./data";
import "./guide.css";

export const metadata = {
  title: "AI 서비스 선택 가이드 | HUB",
  description: "무엇을 만들지에 따라 어떤 AI 서비스를 선택하면 좋은지 목적별로 정리한 HUB 가이드입니다."
};

export default function Guides() {
  return (
    <main className="guideArticle">
      <header className="header">
        <Link className="logo" href="/">HUB</Link>
        <nav>
          <Link href="/">서비스 찾기</Link>
          <Link href="/recommend">추천받기</Link>
          <Link href="/compare">비교하기</Link>
          <Link href="/tools/ai-cost-calculator">비용 계산기</Link>
        </nav>
      </header>

      <section className="guideArticleHero">
        <div className="eyebrow">HUB GUIDE</div>
        <h1>무엇을 만들지 정했다면,<br /><span>도구 선택은 더 쉽게.</span></h1>
        <p>목적별로 어떤 서비스가 잘 맞는지 빠르게 확인하세요.</p>
      </section>

      <section className="guideArticleBody">
        <div className="guideServiceList">
          {guides.map((guide) => (
            <Link href={`/guides/${guide.slug}`} key={guide.slug}>
              <strong>{guide.title}</strong>
              <span>{guide.description}</span>
            </Link>
          ))}
        </div>
        <Link className="primaryLink" href="/recommend">내 목적에 맞는 서비스 추천받기</Link>
      </section>
    </main>
  );
}
