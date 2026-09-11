import Link from "next/link";
import "../legal.css";

export const metadata = {
  title: "개인정보처리방침 | MOVA",
  description: "MOVA 개인정보처리방침"
};

export default function PrivacyPage() {
  return (
    <main className="legalPage">
      <header className="legalHeader"><Link href="/">MOVA</Link><Link href="/">홈으로</Link></header>
      <article className="legalArticle">
        <p className="legalKicker">PRIVACY</p>
        <h1>개인정보처리방침</h1>
        <p className="legalLead">MOVA는 서비스 이용에 필요한 범위에서만 정보를 처리하며, 이용자의 개인정보를 불필요하게 수집하지 않습니다.</p>
        <section><h2>1. 수집하는 정보</h2><p>MOVA는 별도의 회원가입 없이 대부분의 기능을 이용할 수 있습니다. 즐겨찾기와 비교 목록 등 일부 설정은 이용자의 브라우저 저장공간에 저장될 수 있습니다.</p></section>
        <section><h2>2. 외부 서비스 및 광고</h2><p>MOVA는 서비스 추천과 운영을 위해 외부 AI·개발 서비스로 연결되는 링크를 제공할 수 있습니다. 또한 Google AdSense 등의 광고 서비스를 사용할 수 있으며, 광고 제공 과정에서 쿠키 또는 유사 기술이 사용될 수 있습니다.</p></section>
        <section><h2>3. 제휴 링크</h2><p>일부 외부 서비스 링크는 제휴 링크일 수 있습니다. 이용자가 제휴 링크를 통해 가입하거나 결제하면 MOVA가 수수료를 받을 수 있습니다. 제휴 여부는 가능한 경우 서비스 이용 버튼 주변에 표시합니다.</p></section>
        <section><h2>4. 이용자 선택</h2><p>브라우저 설정을 통해 쿠키를 제한할 수 있습니다. 다만 일부 기능이나 광고 개인화에 영향을 줄 수 있습니다.</p></section>
        <section><h2>5. 문의</h2><p>개인정보와 관련한 문의는 <a href="mailto:kjh9410065@gmail.com">kjh9410065@gmail.com</a>으로 보내주세요.</p></section>
        <p className="legalUpdated">시행일: 2026년 9월 11일</p>
      </article>
    </main>
  );
}
