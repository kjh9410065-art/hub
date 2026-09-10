import Link from "next/link";
import "./site-footer.css";

export default function SiteFooter() {
  return (
    <footer className="siteFooter">
      <div className="siteFooterInner">
        <div className="siteFooterBrand">
          <Link href="/" className="siteFooterLogo">HUB</Link>
          <p>목적에 맞는 AI·개발 서비스를 찾고 비교하는 서비스</p>
        </div>

        <nav className="siteFooterLinks" aria-label="사이트 정책 및 안내">
          <Link href="/terms">이용약관</Link>
          <Link href="/privacy">개인정보처리방침</Link>
          <Link href="/contact">문의하기</Link>
          <Link href="/external-links">외부 링크 안내</Link>
        </nav>

        <div className="siteFooterInfo">
          <span>운영 문의</span>
          <a href="mailto:kjh9410065@gmail.com">kjh9410065@gmail.com</a>
        </div>

        <p className="siteFooterNotice">
          HUB는 외부 서비스의 공식 사이트로 연결되는 링크를 제공하며, 외부 서비스의 가격·정책·운영 내용은 각 서비스의 최신 정보를 기준으로 합니다.
        </p>
        <p className="siteFooterCopyright">© 2026 HUB. All rights reserved.</p>
      </div>
    </footer>
  );
}
