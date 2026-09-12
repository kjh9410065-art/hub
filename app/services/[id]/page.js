/* MOVA 서비스 상세 화면: 서비스 선택에 필요한 정보와 대안을 한 화면에서 보여줍니다. */
import Link from "next/link";
import { catalog, catalogMap } from "../../lib/catalog";
import { scoreService } from "../../lib/recommendation";
import { getAffiliateDisclosure, getOutboundUrl, hasAffiliateLink } from "../../lib/affiliate-programs";
import HubOutboundLink from "../../components/hub-outbound-link";
import CompareServiceLink from "../../components/compare-service-link";
import "./service.css";

export function generateStaticParams() {
  return catalog.map((service) => ({ id: service.id }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const service = catalogMap[id];
  if (!service) return { title: "서비스를 찾을 수 없습니다. | MOVA" };
  return {
    title: `${service.name} — 기능·비용·추천 용도 | MOVA`,
    description: `${service.name}의 주요 기능, 비용, 난이도, API 제공 여부와 어떤 작업에 잘 맞는지 확인하세요.`
  };
}

function getPrimaryGoal(service) {
  const goals = [
    ["shorts", "쇼츠 제작"], ["image", "AI 이미지"], ["video", "AI 영상"],
    ["voice", "AI 음성"], ["chat", "AI 챗봇"], ["api", "개발용 API"]
  ];
  return goals.map(([id, label]) => ({ id, label, score: scoreService(service, { goal: id }).score })).sort((a, b) => b.score - a.score)[0];
}

export default async function ServiceDetail({ params }) {
  const { id } = await params;
  const service = catalogMap[id];
  if (!service) return <main className="serviceNotFound"><h1>서비스를 찾을 수 없습니다.</h1><Link href="/catalog">카탈로그로 돌아가기</Link></main>;

  const features = [["text", "텍스트"], ["image", "이미지"], ["video", "영상"], ["voice", "음성"], ["search", "검색"], ["api", "API"]];
  const primaryGoal = getPrimaryGoal(service);
  const primaryResult = scoreService(service, { goal: primaryGoal.id });
  const affiliateReady = hasAffiliateLink(service);
  const outboundUrl = getOutboundUrl(service);
  const supportedFeatureKeys = features.filter(([key]) => key === "api" ? service.api : Boolean(service.features?.[key] || service.uses?.includes(key))).map(([key]) => key);

  // 같은 목적과 기능을 공유하는 서비스를 계산해 상세 페이지의 대안으로 보여줍니다.
  const related = catalog.filter((item) => item.id !== service.id).map((item) => {
    const categoryMatch = item.category === service.category ? 3 : 0;
    const useMatch = (item.uses || []).filter((use) => (service.uses || []).includes(use)).length;
    const featureMatch = Object.keys(service.features || {}).filter((key) => {
      const serviceSupports = service.features?.[key] || service.uses?.includes(key);
      const itemSupports = item.features?.[key] || item.uses?.includes(key);
      return serviceSupports && itemSupports;
    }).length;
    return { item, score: categoryMatch + useMatch * 2 + featureMatch };
  }).sort((a, b) => b.score - a.score).slice(0, 3).map(({ item }) => item);

  const suitableFor = service.uses?.map((use) => ({ shorts: "쇼츠", image: "이미지", video: "영상", voice: "음성", chat: "챗봇", api: "API" }[use])).filter(Boolean).slice(0, 5) || [];

  return (
    <main className="serviceDetail">
      <header className="header serviceHeader"><Link className="logo" href="/">MOVA</Link><nav><Link href="/catalog">전체 서비스</Link><Link href="/recommend">추천받기</Link><Link href="/compare">비교하기</Link></nav></header>
      <section className="serviceHero">
        <div className="serviceIdentity"><img src={service.icon} alt="" /><div><div className="eyebrow">{service.category}</div><h1>{service.name}</h1></div></div>
        <p>{service.bestFor}</p>
        <div className="serviceBadges"><span>{service.price}</span><span>{service.difficulty}</span><span>{service.free ? "무료 시작 가능" : "무료 시작 정보 없음"}</span><span>{service.api ? "API 제공" : "API 없음"}</span></div>
        <div className="heroFeatureRow"><strong>핵심 기능</strong>{supportedFeatureKeys.slice(0, 5).map((key) => <span key={key}>{features.find(([featureKey]) => featureKey === key)?.[1]}</span>)}</div>
      </section>
      <section className="serviceVerdict"><div><div className="eyebrow">MOVA QUICK VERDICT</div><h2>{primaryGoal.label} 목적에 특히 잘 맞습니다.</h2><p>{service.bestFor}. {service.api ? "개발 단계에서 API로 연결하기에도 적합합니다." : "개발용 API가 핵심이라면 API 제공 서비스를 함께 비교하는 것이 좋습니다."}</p></div><div className="verdictScore"><strong>{primaryResult.score}</strong><span>추천 기준점</span></div></section>
      <section className="suitableSection"><div className="sectionTitle"><div><div className="eyebrow">GOOD FOR</div><h2>이럴 때 먼저 살펴보세요</h2></div></div><div className="suitableGrid">{suitableFor.map((item) => <span key={item}>{item} 제작</span>)}{service.free && <span>비용을 아끼며 테스트</span>}{service.difficulty === "쉬움" && <span>처음 시작하는 경우</span>}{service.api && <span>서비스에 API 연결</span>}</div></section>
      <section className="serviceDetailGrid">
        <article><h2>왜 추천하나요?</h2><ul>{service.strengths.map((item) => <li key={item}>{item}</li>)}</ul><div className="detailReason"><b>주의할 점</b><p>{service.caveat}</p></div></article>
        <article><h2>지원 기능</h2><div className="featureList">{features.map(([key, label]) => { const supported = key === "api" ? Boolean(service.api) : Boolean(service.features?.[key] || service.uses?.includes(key)); return <div key={key} className={supported ? "supported" : "disabled"}><span>{label}</span><b>{supported ? "지원" : "미지원"}</b></div>; })}</div></article>
      </section>
      <section className="relatedSection"><div className="relatedHeading"><div><div className="eyebrow">ALTERNATIVES</div><h2>함께 살펴볼 서비스</h2></div><Link href="/catalog">전체 보기</Link></div><div className="relatedGrid">{related.map((item) => <Link className="relatedCard" href={`/services/${item.id}`} key={item.id}><img src={item.icon} alt="" /><div><strong>{item.name}</strong><span>{item.category}</span><p>{item.bestFor}</p></div></Link>)}</div></section>
      <section className="serviceGuideLinks"><div><div className="eyebrow">NEXT STEP</div><h2>더 비교해보고 결정하세요.</h2><p>목적별 추천과 전체 서비스 비교에서 다른 선택지를 확인할 수 있습니다.</p></div><div className="guideLinkGrid"><Link href={`/recommend?goal=${primaryGoal.id}`}>내 조건으로 추천받기</Link><Link href="/compare">서비스 비교하기</Link><Link href="/guides">선택 가이드 보기</Link></div></section>
      <section className={`serviceBottom ${affiliateReady ? "affiliateBottom" : ""}`}>
        <Link href="/recommend">맞춤 추천 다시 받기</Link>
        <CompareServiceLink serviceId={service.id}>이 서비스 비교하기</CompareServiceLink>
        <HubOutboundLink service={service} href={outboundUrl} className="serviceOutbound" source="service-detail" rel="nofollow sponsored noopener noreferrer">{affiliateReady ? "서비스 시작하기" : "공식 사이트 방문"}</HubOutboundLink>
        {affiliateReady && <p className="affiliateDisclosure">{getAffiliateDisclosure(service)}</p>}
      </section>
    </main>
  );
}
