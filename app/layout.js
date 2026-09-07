import "./globals.css";

export const metadata = {
  title: "HUB — 목적에 맞는 AI·개발 서비스 찾기",
  description: "무엇을 만들지 선택하면 필요한 AI·개발 서비스를 추천합니다."
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
