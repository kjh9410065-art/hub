import Link from "next/link";
import "../legal.css";

export const metadata = {
  title: "외부 링크 안내 | MOVA",
  description: "MOVA 외부 링크 안내"
};

export default function ExternalLinksPage() {
  return (
    <main className="legalPage">
      <header className="legalHeader"><Link href="/">MOVA</Link><Link href="/">홈으로</Link></header>
      <article className="legalArticle">
        <p className="legalKicker">EXTERNAL LINKS</p>
        <h1>외부 링크 안내</h1>
        <p className="legalLead">MOVA는 AI·개발 서비스를 쉽게 찾을 수 있도록 각 서비스의 공식 사이트로 연결되는 링크를 제공합니다.</p>
        <section><h2>공식 사이트 연결</h2><p>MOVA에서 서비스 이름이나 공식 사이트 버튼을 선택하면 해당 서비스가 운영하는 외부 사이트로 이동할 수 있습니다.</p></section>
        <section><h2>외부 사이트의 책임</h2><p>외부 사이트의 콘텐츠, 가격, 기능, 서비스 운영 및 개인정보 처리에 관한 사항은 해당 사이트의 정책과 책임에 따릅니다. 이용 전 각 서비스의 최신 정보를 확인해 주세요.</p></section>
        <section><h2>TCFLiCK</h2><p>MOVA는 TCFLiCK 아래에서 독립적으로 운영되는 서비스입니다.</p></section>
        <section><h2>제휴 링크</h2><p>일부 링크는 제휴 링크일 수 있으며, 제휴 링크를 통해 가입 또는 결제가 이루어지는 경우 MOVA가 수수료를 받을 수 있습니다. 해당 링크는 가능한 경우 이용자가 알 수 있도록 표시합니다.</p></section>
        <section><h2>문의</h2><p>외부 링크의 오류나 서비스 정보 수정이 필요한 경우 <a href="mailto:kjh9410065@gmail.com">kjh9410065@gmail.com</a>으로 알려주세요.</p></section>
        <p className="legalUpdated">시행일: 2026년 9월 11일</p>
      </article>
    </main>
  );
}
