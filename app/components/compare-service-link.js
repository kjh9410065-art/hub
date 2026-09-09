"use client";

import Link from "next/link";

// 상세 페이지에서 선택한 서비스를 비교함에 넣고 비교 화면으로 이동합니다.
export default function CompareServiceLink({ serviceId, children, className }) {
  const handleClick = () => {
    try {
      const raw = JSON.parse(localStorage.getItem("hub-compare") || "[]");
      const current = Array.isArray(raw) ? raw.filter(Boolean) : [];
      if (!current.includes(serviceId)) {
        localStorage.setItem("hub-compare", JSON.stringify([...current, serviceId].slice(0, 4)));
      }
    } catch {
      localStorage.setItem("hub-compare", JSON.stringify([serviceId]));
    }
  };

  return <Link className={className} href="/compare" onClick={handleClick}>{children}</Link>;
}
