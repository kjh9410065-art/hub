import "./globals.css";
import "./responsive.css";
import "./home-typography.css";
import "./readable-ui.css";
import "./components/adsense.css";
import "./components/hub-floating-controls.css";
import "./dark-mode-hardening.css";
import "./light-mode-cleanup.css";
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
  robots: { index: true, follow: true }
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
