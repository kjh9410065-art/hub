"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

export const metadata = { title: "AI API 비용 계산기 | HUB", description: "월간 입력·출력 토큰을 기준으로 AI API 예상 사용 비용을 계산하는 무료 도구입니다." };

const models = [
  { name: "직접 입력", input: 0, output: 0, note: "공식 가격을 확인한 뒤 직접 입력" },
  { name: "Gemini 3.7 Flash · Standard", input: 0.75, output: 3.75, note: "2026-12-31까지 공개된 현재 프로모션 가격" },
  { name: "Gemini 3.7 Flash-Lite · Standard", input: 0.25, output: 1.5, note: "Google 공식 가격표 기준" },
  { name: "예시: 저가형 LLM", input: 0.2, output: 1.2, note: "비교용 예시값 · 실제 선택 전 공식 가격 확인" },
];

export default function Calculator() {
  const [model, setModel] = useState(models[1]);
  const [inputTokens, setInputTokens] = useState(10);
  const [outputTokens, setOutputTokens] = useState(5);
  const [requests, setRequests] = useState(1000);

  const cost = useMemo(() => {
    const monthlyInput = Number(inputTokens) * Number(requests);
    const monthlyOutput = Number(outputTokens) * Number(requests);
    return (monthlyInput / 1_000_000) * model.input + (monthlyOutput / 1_000_000) * model.output;
  }, [inputTokens, outputTokens, requests, model]);

  return (
    <main className="page">
      <header className="header"><Link className="logo" href="/">HUB</Link><nav><Link href="/guides">가이드</Link><Link href="/compare">서비스 비교</Link><Link href="/">추천받기</Link></nav></header>
      <section className="hero" style={{ textAlign: "left", padding: "55px 30px" }}>
        <div className="badge">HUB TOOL</div>
        <h1 style={{ fontSize: "clamp(36px,5vw,58px)" }}>AI API 비용을<br /><span>미리 계산해보세요.</span></h1>
        <p>월간 요청량과 토큰 사용량을 입력하면 예상 비용을 계산합니다.</p>
      </section>

      <section className="section" style={{ maxWidth: 820, margin: "auto" }}>
        <div style={{ display: "grid", gap: 14 }}>
          <label style={{ background: "#fff", border: "1px solid #e5e2eb", borderRadius: 18, padding: 20 }}>
            <b>모델 / 가격표</b>
            <select value={model.name} onChange={(e) => setModel(models.find((m) => m.name === e.target.value) || models[0])} style={{ display: "block", width: "100%", marginTop: 10, padding: 13, borderRadius: 10, border: "1px solid #ddd" }}>
              {models.map((m) => <option key={m.name}>{m.name}</option>)}
            </select>
            <small style={{ display: "block", marginTop: 8, color: "#888" }}>{model.note}</small>
          </label>

          {[["월간 요청 수", requests, setRequests], ["요청당 입력 토큰 (천 단위)", inputTokens, setInputTokens], ["요청당 출력 토큰 (천 단위)", outputTokens, setOutputTokens]].map(([label, value, setter]) => (
            <label key={label} style={{ background: "#fff", border: "1px solid #e5e2eb", borderRadius: 18, padding: 20 }}>
              <b>{label}</b>
              <input type="number" min="0" value={value} onChange={(e) => setter(Number(e.target.value))} style={{ display: "block", width: "100%", marginTop: 10, padding: 13, borderRadius: 10, border: "1px solid #ddd" }} />
            </label>
          ))}
        </div>

        <div style={{ marginTop: 18, padding: 26, borderRadius: 22, background: "#19191d", color: "#fff" }}>
          <span style={{ color: "#b9afff", fontSize: 12, fontWeight: 800 }}>ESTIMATED MONTHLY COST</span>
          <div style={{ fontSize: 42, fontWeight: 900, marginTop: 8 }}>${cost.toFixed(2)}</div>
          <p style={{ margin: "8px 0 0", color: "#aaa", fontSize: 12 }}>입력·출력 토큰 가격을 단순 적용한 예상치이며 실제 청구액과 다를 수 있습니다.</p>
        </div>

        <div style={{ marginTop: 18, padding: 18, borderRadius: 16, background: "#fff", border: "1px solid #e5e2eb", fontSize: 12, color: "#666", lineHeight: 1.7 }}>
          <b style={{ color: "#444" }}>가격 데이터 안내</b><br />
          Gemini 가격은 Google의 공식 Gemini API 가격표를 기준으로 입력했습니다. 가격과 모델은 변경될 수 있으므로 결제 전 공식 가격 페이지를 확인하세요.
        </div>

        <Link href="/compare" className="primaryLink" style={{ display: "block", marginTop: 18, textAlign: "center" }}>서비스 비교로 돌아가기 →</Link>
      </section>
    </main>
  );
}
