import "./globals.css";
import "./responsive.css";
import "./home-typography.css";
import "./readable-ui.css";
import "./components/adsense.css";
import "./components/hub-floating-controls.css";
import "./dark-mode-hardening.css";
import "./light-mode-cleanup.css";
import "./components/compare-bar-unified.css";
import "./ui-visibility-polish.css";
import "./button-clarity.css";
import "./catalog-icon-scale.css";
import Script from "next/script";
import HubTutorial from "./components/hub-tutorial";
import HubTheme from "./components/hub-theme";
import Adsense from "./components/adsense";

// AdSense Publisher ID는 Cloudflare Pages/Workers 빌드 환경변수로 넣습니다.
// 아직 ID가 없으면 광고 스크립트와 광고 영역을 모두 비활성화해 승인 전 상태를 유지합니다.
const adsenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT?.trim();

export const metadata = {
  title: "HUB — 목적에 맞는 AI·개발 서비스 찾기",
  description: "만들고 싶은 목적을 선택하면 필요한 AI·개발 서비스를 빠르게 비교하고 추천받을 수 있습니다.",
  metadataBase: new URL("https://hub.carpick.workers.dev"),
  icons: { icon: "/icon.svg", shortcut: "/icon.svg", apple: "/icon.svg" },
  robots: { index: true, follow: true },
  openGraph: {
    // 검색·공유 서비스가 HUB 페이지를 소개할 때 사용할 기본 제목입니다.
    title: "HUB — 목적에 맞는 AI·개발 서비스 찾기",
    // 페이지 미리보기에서 사용할 기본 설명입니다.
    description: "만들고 싶은 목적을 선택하면 필요한 AI·개발 서비스를 빠르게 비교하고 추천받을 수 있습니다.",
    url: "https://hub.carpick.workers.dev",
    siteName: "HUB",
    locale: "ko_KR",
    type: "website"
  },
  verification: {
    // 네이버와 Google Search Console 소유확인용 메타 태그를 공통으로 제공합니다.
    google: "CjJyOINZWHQ-9KzyjIGyjBW1NOMoMbt0KNXQppgT1O0",
    other: {
      "naver-site-verification": "4ad3c9f5acc394846e3abd9efd832308390fcc46"
    }
  }
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover"
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <head>
        {/* HUB 전용 SVG 일러스트 스타일을 공통으로 연결합니다. */}
        <link rel="stylesheet" href="/illustrations.css" />
      </head>
      <body>
        {adsenseClient && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
        {children}
        {/* Publisher ID가 실제로 설정된 경우에만 자동 광고 영역을 렌더링합니다. */}
        <Adsense />
        {/* 모든 페이지에서 사용자가 화면 테마를 바꿀 수 있게 공통 토글을 표시합니다. */}
        <HubTheme />
        {/* 모든 페이지에서 같은 튜토리얼을 사용할 수 있도록 공통 레이아웃에 연결합니다. */}
        <HubTutorial />
      </body>
    </html>
  );
}
