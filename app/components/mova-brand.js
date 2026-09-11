"use client";

import { useEffect } from "react";

// 화면에 남아 있는 이전 브랜드명만 사용자에게 보이는 텍스트/접근성 문구에서 MOVA로 교체합니다.
export default function MovaBrand() {
  useEffect(() => {
    const replace = () => {
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      const nodes = [];
      while (walker.nextNode()) nodes.push(walker.currentNode);
      nodes.forEach((node) => {
        if (node.nodeValue?.includes("HUB")) node.nodeValue = node.nodeValue.replace(/HUB/g, "MOVA");
      });

      document.querySelectorAll("[aria-label], [title]").forEach((element) => {
        ["aria-label", "title"].forEach((attr) => {
          const value = element.getAttribute(attr);
          if (value?.includes("HUB")) element.setAttribute(attr, value.replace(/HUB/g, "MOVA"));
        });
      });
    };

    replace();
    const observer = new MutationObserver(replace);
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
    return () => observer.disconnect();
  }, []);

  return null;
}
