/* 페이지마다 공통으로 사용할 광고 영역입니다. AdSense 승인/ID 설정 전에도 자리만 유지합니다. */
"use client";

import { useEffect } from "react";

const CLIENT_ID = process.env.NEXT_PUBLIC_ADSENSE_CLIENT?.trim() || "";

export default function AdSlot({ slot = "", label = "광고" }) {
  useEffect(() => {
    // Publisher ID가 있을 때만 해당 광고 슬롯을 AdSense에 요청합니다.
    if (!CLIENT_ID || typeof window === "undefined") return;

    try {
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.push({});
    } catch {
      // 광고 로딩 실패가 사이트 이용에 영향을 주지 않도록 무시합니다.
    }
  }, []);

  return (
    <div className="movaAdSlot" aria-label={`${label} 영역`}>
      {CLIENT_ID ? (
        <ins
          className="adsbygoogle movaAdSlotInner"
          style={{ display: "block" }}
          data-ad-client={CLIENT_ID}
          {...(slot ? { "data-ad-slot": slot } : {})}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      ) : (
        <span className="movaAdPlaceholder">{label}</span>
      )}
    </div>
  );
}
