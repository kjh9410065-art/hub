import Link from "next/link";
import { catalog } from "../../lib/catalog";
import "../guide.css";

export const metadata = {
  title: "AI 영상 생성 서비스 선택 가이드 | HUB",
  description: "AI 영상 생성 목적에 따라 어떤 서비스를 먼저 비교하면 좋은지 정리한 HUB 가이드입니다."
};

const services = catalog.filter((service) => service.features?.video).slice(0, 6);

export default function VideoGuide() {
  return <main className="guideArticle">
    <header className="header"><Link className="logo" href="/">HUB</Link><nav><Link href="/catalog">서비스 찾기</Link><Link href="/recommend">추천받기</Link><Link href="/guides">가이드</Link></nav></header>
    <section className="guideArticleHero"><div className="eyebrow">AI VIDEO GUIDE</div><h1>AI 영상은<br /><span>무엇을 만들지부터 정하세요.</span></h1><p>짧은 영상, 이미지 기반 영상, 생성형 영상은 필요한 서비스가 다릅니다.</p></section>
    <section className="guideArticleBody">
      <article><h2>먼저 확인할 것</h2><p>텍스트만으로 영상을 만들지, 이미지를 움직일지, 쇼츠처럼 빠르게 여러 장면을 만들지에 따라 선택지가 달라집니다. 처음이라면 사용 난도가 낮고 무료 구간을 제공하는 서비스를 먼저 테스트하는 편이 좋습니다.</p></article>
      <article><h2>영상 기능을 제공하는 서비스</h2><div className="guideServiceList">{services.map((service) => <Link href={`/services/${service.id}`} key={service.id}><strong>{service.name}</strong><span>{service.bestFor}</span></Link>)}</div></article>
      <article><h2>빠른 선택 기준</h2><ul><li>쇼츠 제작이 목적이면 이미지·음성까지 함께 지원하는 서비스를 우선 비교</li><li>개발용이면 API 제공 여부와 모델별 비용을 먼저 확인</li><li>고품질 생성이 중요하면 결과물 스타일과 모델별 지원 기능을 직접 테스트</li></ul></article>
      <Link className="primaryLink" href="/recommend?goal=video">영상 제작 서비스 추천받기</Link>
    </section>
  </main>;
}
