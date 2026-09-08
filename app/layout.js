import "./globals.css";
import "./responsive.css";
import "./home-typography.css";
import "./readable-ui.css";
import HubTutorial from "./components/hub-tutorial";

export const metadata = {
  title: "HUB — 목적에 맞는 AI·개발 서비스 찾기",
  description: "만들고 싶은 목적을 선택하면 필요한 AI·개발 서비스를 빠르게 비교하고 추천받을 수 있습니다.",
  metadataBase: new URL("https://hub.carpick.workers.dev"),
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg"
  }
};

// 모바일 브라우저가 실제 화면 폭을 기준으로 레이아웃을 계산하도록 설정합니다.
// viewport-fit=cover와 CSS의 safe-area 환경 변수를 함께 사용해 노치·둥근 모서리·폴더블 화면에서도 콘텐츠가 잘리지 않게 합니다.
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
        {children}
        {/* 모든 페이지에서 같은 튜토리얼을 사용할 수 있도록 공통 레이아웃에 연결합니다. */}
        <HubTutorial />
      </body>
    </html>
  );
}
