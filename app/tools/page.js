// HUB 무료 도구 모음: 방문자가 서비스 선택 전에 직접 계산하고 판단할 수 있는 실용 도구를 제공합니다.
import Link from "next/link";

export const metadata = {
  title: "AI 무료 도구 | HUB",
  description: "AI 서비스 선택에 도움이 되는 무료 계산기와 실용 도구를 HUB에서 이용하세요."
};

const tools = [
  { href: "/tools/cost", icon: "🧮", title: "AI API 비용 계산기", desc: "예상 사용량을 입력하고 월간 API 비용을 빠르게 계산합니다." },
  { href: "/tools/token", icon: "🔢", title: "AI 토큰 추정기", desc: "프롬프트를 붙여 넣고 대략적인 토큰 사용량을 확인합니다." },
  { href: "/compare", icon: "⚖️", title: "AI 서비스 비교", desc: "대표 AI 서비스를 기능과 용도 중심으로 한눈에 비교합니다." },
  { href: "/guides", icon: "🧭", title: "목적별 선택 가이드", desc: "쇼츠·이미지·챗봇·음성 등 만들고 싶은 결과물부터 서비스를 찾습니다." }
];

export default function ToolsPage() {
  return (
    <main className="page toolPage">
      <header className="header">
        <Link className="logo" href="/">HUB</Link>
        <nav><Link href="/guides">가이드</Link><Link href="/compare">비교하기</Link></nav>
      </header>

      <section className="guideHero">
        <div className="eyebrow">HUB TOOLS</div>
        <h1>서비스를 고르기 전에,<br /><span>직접 계산하고 비교하세요.</span></h1>
        <p>무료 도구를 이용해 필요한 서비스와 예상 비용을 먼저 확인할 수 있습니다.</p>
      </section>

      <section className="section">
        <div className="guideGrid">
          {tools.map((tool) => (
            <Link className="guideCard" href={tool.href} key={tool.href}>
              <span className="toolIcon">{tool.icon}</span>
              <h2>{tool.title}</h2>
              <p>{tool.desc}</p>
              <b>사용하기 →</b>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
