// 목적형 가이드 상세 페이지입니다.
// generateStaticParams로 모든 가이드를 빌드 시 정적 HTML로 만들어 검색엔진 유입을 확보합니다.
import Link from "next/link";
import { notFound } from "next/navigation";
import { catalogMap } from "../../lib/catalog";
import { guides, getGuide } from "../data";
import "../guide.css";

export const dynamicParams = false;

export function generateStaticParams() {
  return guides.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) return { title: "가이드를 찾을 수 없습니다 | HUB" };
  return {
    title: `${guide.title} | HUB`,
    description: guide.description,
    keywords: [guide.keyword, "AI 서비스 추천", "HUB"],
    alternates: { canonical: `https://hub.carpick.workers.dev/guides/${guide.slug}` }
  };
}

export default async function GuideDetail({ params }) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) notFound();

  const services = guide.recommendedServices?.map((id) => catalogMap[id]).filter(Boolean) || [];

  return (
    <main className="guideArticle guideDetailPage">
      <header className="header">
        <Link className="logo" href="/">HUB</Link>
        <nav>
          <Link href="/">서비스 찾기</Link>
          <Link href="/recommend">추천받기</Link>
          <Link href="/compare">비교하기</Link>
          <Link href="/guides">가이드</Link>
        </nav>
      </header>

      <section className="guideArticleHero">
        <div className="eyebrow">HUB GUIDE · {guide.keyword}</div>
        <h1>{guide.title}</h1>
        <p>{guide.description}</p>
      </section>

      <section className="guideArticleBody">
        <article>
          <h2>먼저 확인할 기준</h2>
          <p>서비스 이름부터 고르기보다 실제로 만들려는 결과물과 작업 방식을 먼저 정하면 선택이 훨씬 쉬워집니다.</p>
          <ul>{guide.points.map((point) => <li key={point}>{point}</li>)}</ul>
        </article>

        <article>
          <h2>이렇게 선택하세요</h2>
          <p>무료 사용량, 결과 품질, 사용 난이도, API 제공 여부는 서비스마다 다릅니다. 현재 필요한 기능을 기준으로 비교한 뒤 최종 조건은 각 서비스의 공식 안내에서 확인하는 것이 좋습니다.</p>
          <Link className="primaryLink" href={`/recommend?task=${guide.recommendedTask}`}>내 조건으로 서비스 추천받기</Link>
        </article>

        {services.length > 0 && (
          <article>
            <h2>관련 서비스</h2>
            <div className="guideRelatedServices">
              {services.map((service) => (
                <Link href={`/services/${service.id}`} key={service.id}>
                  <strong>{service.name}</strong>
                  <span>{service.bestFor}</span>
                </Link>
              ))}
            </div>
          </article>
        )}

        <article>
          <h2>HUB에서 더 비교하기</h2>
          <p>조건이 아직 정해지지 않았다면 추천 페이지에서 목적과 예산, 개발 경험을 선택해 후보를 좁힐 수 있습니다.</p>
          <Link className="primaryLink" href="/recommend">추천 서비스 전체 보기</Link>
        </article>
      </section>
    </main>
  );
}
