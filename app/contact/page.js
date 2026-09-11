import Link from "next/link";
import "../legal.css";

export const metadata = {
  title: "문의 | MOVA",
  description: "MOVA 서비스 문의 안내"
};

export default function ContactPage() {
  return (
    <main className="legalPage">
      <header className="legalHeader"><Link href="/">MOVA</Link><Link href="/">홈으로</Link></header>
      <article className="legalArticle">
        <p className="legalKicker">CONTACT</p>
        <h1>MOVA 문의</h1>
        <p className="legalLead">서비스 정보 오류, 제휴 문의, 광고 문의가 있다면 MOVA 운영자에게 알려주세요.</p>
        <section><h2>서비스 정보 수정</h2><p>가격, 기능, 서비스 상태처럼 변경된 정보를 알려주시면 확인 후 카탈로그에 반영하겠습니다.</p></section>
        <section><h2>제휴 및 광고</h2><p>AI·개발 서비스의 제휴 또는 MOVA 광고를 제안하려면 문의 내용을 준비해 주세요.</p></section>
        <section><h2>문의 방법</h2><p><a href="mailto:kjh9410065@gmail.com">kjh9410065@gmail.com</a>으로 문의해 주세요.</p></section>
      </article>
    </main>
  );
}
