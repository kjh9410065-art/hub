import "./globals.css";
import "./responsive.css";
import "./home-typography.css";
import "./readable-ui.css";
import "./components/adsense.css";
import "./components/ad-slot.css";
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
import AdSlot from "./components/ad-slot";
import SiteFooter from "./components/site-footer";
import MovaBrand from "./components/mova-brand";

const adsenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT?.trim();

export const metadata = {
  title: "MOVA — 목적에 맞는 AI·개발 서비스 찾기",
  description: "만들고 싶은 목적에 맞는 AI·개발 서비스를 빠르게 찾고 비교할 수 있습니다.",
  metadataBase: new URL("https://mova.tcflick.com"),
  icons: { icon: "/icon.svg", shortcut: "/icon.svg", apple: "/icon.svg" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "MOVA — 목적에 맞는 AI·개발 서비스 찾기",
    description: "만들고 싶은 목적에 맞는 AI·개발 서비스를 빠르게 찾고 비교할 수 있습니다.",
    url: "https://mova.tcflick.com",
    siteName: "MOVA",
    locale: "ko_KR",
    type: "website",
    images: [{ url: "/MOVA-og-image.jpg", width: 1199, height: 675, alt: "MOVA AI 서비스 찾기" }]
  },
  verification: {
    google: "hAHkcvWFhoATFOdphua3yECySUCnJXT2IC9gfm0cYew"
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
        <link rel="stylesheet" href="/illustrations.css" />
        {/* 네이버 소유확인용 메타 태그를 head에 직접 넣어 정적 배포에서도 확실하게 노출합니다. */}
        <meta name="naver-site-verification" content="470f41c9c7c695bedafdedaa15bf205009b0b1e1" />
      </head>
      <body>
        {adsenseClient && <Script async src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`} crossOrigin="anonymous" strategy="afterInteractive" />}
        {/* 상단/하단 슬롯은 각각 자기 자신만 한 번 초기화합니다. */}
        <AdSlot label="광고" />
        {children}
        <AdSlot label="광고" />
        <SiteFooter />
        <HubTheme />
        <HubTutorial />
        <MovaBrand />
      </body>
    </html>
  );
}
