/* Google AdSense 자동 광고를 연결하기 위한 공통 컴포넌트입니다. */
"use client";

import { useEffect } from "react";

const CLIENT_ID = process.env.NEXT_PUBLIC_ADSENSE_CLIENT || "";

export default function Adsense() {
  useEffect(() => {
    // Cloudflare 빌드 환경에 Publisher ID가 설정된 경우에만 AdSense를 초기화합니다.
    // ID가 없는 상태에서는 아무 광고 요청도 보내지 않아 개발/승인 대기 상태가 안전합니다.
    if (!CLIENT_ID || typeof window === "undefined") return;

    try {
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.push({});
    } catch {
      // 광고 차단기나 네트워크 문제로 광고가 로드되지 않아도 HUB 사용에는 영향이 없게 합니다.
    }
  }, []);

  if (!CLIENT_ID) return null;

  return (
    <ins
      className="adsbygoogle hubAd"
      style={{ display: "block" }}
      data-ad-client={CLIENT_ID}
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
}
