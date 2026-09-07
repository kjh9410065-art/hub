"use client";

// QR 도구 안내 페이지: 외부 라이브러리 없이 안전하게 사용할 수 있는 QR 생성 방식을 안내합니다.
import Link from "next/link";

export default function QRTool() {
  const services = [
    ["URL 공유", "웹주소를 QR로 만들어 모바일에서 쉽게 열 수 있습니다."],
    ["텍스트 전달", "짧은 메모나 안내 문구를 QR에 담아 공유할 수 있습니다."],
    ["주의", "비밀번호, API 키 등 비밀정보를 QR에 넣어 공유하지 마세요."]
  ];
  return (
    <main className="page guideArticle">
      <header className="header"><Link className="logo" href="/">HUB</Link><nav><Link href="/tools">무료 도구</Link><Link href="/">홈</Link></nav></header>
      <article>
        <div className="eyebrow">QR QUICK TOOL</div>
        <h1>QR을 이용한<br /><span>빠른 공유 가이드.</span></h1>
        <p className="lead">HUB의 개발자용 도구 모음에서 QR 공유에 필요한 내용을 간단히 확인할 수 있습니다.</p>
        <div className="miniGrid toolInfoGrid">
          {services.map(([title, desc]) => <div className="miniCard" key={title}><span>▣</span><div><strong>{title}</strong><small>{desc}</small></div></div>)}
        </div>
        <div className="callout"><b>개인정보 보호</b><p>QR 코드는 누구나 스캔할 수 있는 형태로 공유되므로 인증정보나 API 키처럼 유출되면 안 되는 값은 넣지 않는 것을 권장합니다.</p></div>
        <Link className="primaryLink" href="/tools">다른 무료 도구 보기 →</Link>
      </article>
    </main>
  );
}
