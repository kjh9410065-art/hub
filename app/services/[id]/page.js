/* 서비스별 상세 화면: 전체 카탈로그의 동일한 데이터를 사용합니다. */
import Link from "next/link";
import { catalog, catalogMap } from "../../lib/catalog";
import "./service.css";

export function generateStaticParams() {
  return catalog.map((service) => ({ id: service.id }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const service = catalogMap[id];
  if (!service) return { title: "서비스를 찾을 수 없습니다. | HUB" };
  return {
    title: `${service.name} | HUB`,
    description: `${service.name}의 주요 기능, 비용, 난이도와 추천 용도를 확인하세요.`
  };
}

export default async function ServiceDetail({ params }) {
  // 최신 Next.js의 비동기 params 형태에 맞춰 정적 상세 페이지에서도 안전하게 ID를 읽습니다.
  const { id } = await params;
  const service = catalogMap[id];

  if (!service) {
    return (
      <main className="serviceNotFound">
        <h1>서비스를 찾을 수 없습니다.</h1>
        <Link href="/catalog">카탈로그로 돌아가기</Link>
      </main>
    );
  }

  const features = [
    ["text", "텍스트"],
    ["image", "이미지"],
    ["video", "영상"],
    ["voice", "음성"],
    ["search", "검색"]
  ];

  return (
    <main className="serviceDetail">
      <header className="header serviceHeader">
        <Link className="logo" href="/">HUB</Link>
        <nav>
          <Link href="/catalog">전체 서비스</Link>
          <Link href="/recommend">추천받기</Link>
          <Link href="/compare">비교하기</Link>
        </nav>
      </header>

      <section className="serviceHero">
        <div className="serviceIdentity">
          <img src={service.icon} alt="" />
          <div>
            <div className="eyebrow">{service.category}</div>
            <h1>{service.name}</h1>
          </div>
        </div>
        <p>{service.bestFor}</p>
        <div className="serviceBadges">
          <span>{service.price}</span>
          <span>{service.difficulty}</span>
          <span>{service.free ? "무료 시작 가능" : "무료 시작 정보 없음"}</span>
          <span>{service.api ? "API 제공" : "API 없음"}</span>
        </div>
      </section>

      <section className="serviceDetailGrid">
        <article>
          <h2>왜 추천하나요?</h2>
          <ul>{service.strengths.map((item) => <li key={item}>{item}</li>)}</ul>
          <div className="detailReason">
            <b>주의할 점</b>
            <p>{service.caveat}</p>
          </div>
        </article>
        <article>
          <h2>지원 기능</h2>
          <div className="featureList">
            {features.map(([key, label]) => (
              <div key={key} className={service.features?.[key] ? "supported" : "disabled"}>
                <span>{label}</span>
                <b>{service.features?.[key] ? "지원" : "미지원"}</b>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="serviceBottom">
        <Link href="/recommend">내 조건으로 다시 추천받기</Link>
        <a href={service.url} target="_blank" rel="noreferrer">공식 사이트 방문</a>
      </section>
    </main>
  );
}
