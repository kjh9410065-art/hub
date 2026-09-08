/* HUB 화면 테마를 사용자가 직접 전환할 수 있게 하는 공통 클라이언트 컴포넌트입니다. */
"use client";

import { useEffect, useState } from "react";
import "./hub-theme.css";

const STORAGE_KEY = "hub-theme";

export default function HubTheme() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    // 저장된 사용자 선택을 복원하고, 처음에는 기본값인 밝은 화면을 사용합니다.
    const saved = window.localStorage.getItem(STORAGE_KEY);
    const next = saved === "dark" ? "dark" : "light";
    document.documentElement.dataset.theme = next;
    setTheme(next);
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    window.localStorage.setItem(STORAGE_KEY, next);
    setTheme(next);
  };

  return (
    <button
      className="hubThemeToggle"
      type="button"
      onClick={toggleTheme}
      aria-label={theme === "dark" ? "밝은 화면으로 변경" : "어두운 화면으로 변경"}
      aria-pressed={theme === "dark"}
    >
      <span>{theme === "dark" ? "밝게" : "어둡게"}</span>
    </button>
  );
}
