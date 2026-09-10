import Link from "next/link";
import "../legal.css";

export const metadata = {
  title: "이용약관 | HUB",
  description: "HUB 이용약관"
};

export default function TermsPage() {
  return (
    <main className="legalPage">
      <header className="legalHeader"><Link href="/">HUB</Link><Link href="/">홈으로</Link></header>
      <article className="legalArticle">
        <p className="legalKicker">TERMS</p>
        <h1>이용약관</h1>
        <p className="legalLead">HUB는 사용자가 목적에 맞는 AI·개발 서비스를 탐색하고 비교할 수 있도록 정보를 제공하는 서비스입니다.</p>

        <section><h2>1. 서비스의 성격</h2><p>HUB가 제공하는 추천, 설명, 가격 및 기능 정보는 서비스 탐색을 돕기 위한 참고 정보입니다. 실제 요금, 제공 기능, 이용 가능 지역 및 약관은 연결되는 각 서비스의 최신 정보를 기준으로 합니다.</p></section>
        <section><h2>2. 외부 서비스</h2><p>HUB에서 외부 서비스로 이동하면 해당 서비스의 이용약관과 개인정보처리방침이 적용됩니다. HUB는 외부 서비스의 운영이나 정책 변경을 직접 통제하지 않습니다.</p></section>
        <section><h2>3. 제휴 및 광고</h2><p>HUB는 일부 서비스에 대한 제휴 링크와 광고를 통해 운영 수익을 얻을 수 있습니다. 제휴 링크가 사용되는 경우 해당 사실을 이용자가 알 수 있도록 표시합니다.</p></section>
        <section><h2>4. 정보의 변경</h2><p>서비스 목록과 추천 기준은 새로운 서비스와 정책 변화에 따라 변경될 수 있습니다. 중요한 변경이 있을 경우 사이트에 반영합니다.</p></section>
        <section><h2>5. 문의</h2><p>약관과 관련한 문의는 <a href="mailto:kjh9410065@gmail.com">kjh9410065@gmail.com</a>으로 보내주세요.</p></section>
        <p className="legalUpdated">시행일: 2026년 9월 11일</p>
      </article>
    </main>
  );
}
