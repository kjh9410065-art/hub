import Link from "next/link";
import { catalog } from "../../lib/catalog";
import "../guide.css";

export const metadata = {
  title: "개발용 AI API 선택 가이드 | HUB",
  description: "챗봇, 검색, 이미지, 음성 등 개발 목적에 맞는 AI API 선택 기준을 정리한 HUB 가이드입니다."
};

const services = catalog.filter((service) => service.api).slice(0, 10);

export default function ApiGuide() {
  return <main className="guideArticle">
    <header className="header"><Link className="logo" href="/">HUB</Link><nav><Link href="/catalog">서비스 찾기</Link><Link href="/recommend">추천받기</Link><Link href="/guides">가이드</Link></nav></header>
    <section className="guideArticleHero"><div className="eyebrow">API GUIDE</div><h1>API는 가격만 보지 말고<br /><span>무엇을 연결할지부터 보세요.</span></h1><p>지원 기능, 난이도, 무료 구간, 모델 범위를 함께 비교해야 실제 개발에서 선택이 쉬워집니다.</p></section>
    <section className="guideArticleBody">
      <article><h2>API 선택 순서</h2><p>먼저 텍스트·이미지·영상·음성·검색 중 필요한 기능을 정합니다. 그다음 무료 테스트 가능 여부와 API 제공 방식, 마지막으로 모델별 비용과 사용량 제한을 확인하는 방식이 가장 효율적입니다.</p></article>
      <article><h2>API를 제공하는 서비스</h2><div className="guideServiceList">{services.map((service) => <Link href={`/services/${service.id}`} key={service.id}><strong>{service.name}</strong><span>{service.category} · {service.bestFor}</span></Link>)}</div></article>
      <article><h2>처음 개발한다면</h2><ul><li>챗봇은 LLM의 응답 품질과 문서 처리 능력을 우선 확인</li><li>이미지·영상은 생성 모델의 결과 스타일과 속도를 직접 테스트</li><li>웹 검색은 검색 정확도와 데이터 추출 방식을 함께 확인</li><li>비용은 1회 가격보다 예상 월 사용량으로 계산</li></ul></article>
      <Link className="primaryLink" href="/recommend?goal=api">내 개발 목적에 맞는 API 찾기</Link>
    </section>
  </main>;
}
