/* HUB 외부 서비스 이동 버튼: 제휴 링크와 일반 공식 링크를 같은 방식으로 처리합니다. */
"use client";

import { trackOutboundClick } from "../lib/affiliate-programs";

export default function HubOutboundLink({ service, href, className, children, source, rel = "noreferrer" }) {
  const handleClick = () => trackOutboundClick(service, source);

  return (
    <a
      className={className}
      href={href}
      target="_blank"
      rel={rel}
      onClick={handleClick}
    >
      {children}
    </a>
  );
}
