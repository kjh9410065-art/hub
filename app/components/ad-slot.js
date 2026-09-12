/* 공통 AdSense 광고 슬롯입니다. 각 슬롯을 한 번만 초기화해 중복 광고 요청 충돌을 막습니다. */
"use client";

import { useEffect, useRef } from "react";

const CLIENT_ID = process.env.NEXT_PUBLIC_ADSENSE_CLIENT?.trim() || "";

export default function AdSlot({ slot = "", label = "광고" }) {
  // 같은 React 컴포넌트가 다시 렌더링되어도 동일 슬롯을 중복 초기화하지 않습니다.
  const adRef = useRef(null);

  useEffect(() => {
    if (!CLIENT_ID || typeof window === "undefined" || !adRef.current) return;

    // 이미 AdSense가 처리한 슬롯에는 다시 push하지 않습니다.
    if (adRef.current.getAttribute("data-adsbygoogle-status")) return;

    try {
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.push({});
    } catch {
      // 광고 로딩 실패가 사이트 이용에 영향을 주지 않도록 무시합니다.
    }
  }, []);

  return (
    <div className={`movaAdSlot${CLIENT_ID ? " movaAdSlotEnabled" : ""}`} aria-label={`${label} 영역`}>
      {CLIENT_ID ? (
        <ins
          ref={adRef}
          className="adsbygoogle movaAdSlotInner"
          style={{ display: "block" }}
          data-ad-client={CLIENT_ID}
          {...(slot ? { "data-ad-slot": slot } : {})}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      ) : null}
    </div>
  );
}
