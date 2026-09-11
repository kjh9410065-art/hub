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
import Adsense from "./components/adsense";
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
    type: "website"
  },
  verification: {
    google: "hAHkcvWFhoATFOdphua3yECySUCnJXT2IC9gfm0cYew",
    other: {
      "naver-site-verification": "470f41c9c7c695bedafdedaa15bf205009b0b1"
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
      <head><link rel="stylesheet" href="/illustrations.css" /></head>
      <body>
        {adsenseClient && <Script async src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`} crossOrigin="anonymous" strategy="afterInteractive" />}
        {/* 상단 광고 자리: AdSense 설정 전에는 자리만 표시됩니다. */}
        <AdSlot label="광고" />
        {children}
        {/* 하단 광고 자리: 모든 페이지에서 공통으로 사용할 수 있습니다. */}
        <AdSlot label="광고" />
        <Adsense />
        <SiteFooter />
        <HubTheme />
        <HubTutorial />
        <MovaBrand />
      </body>
    </html>
  );
}
