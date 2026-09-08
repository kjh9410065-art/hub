/* HUB 처음 방문 사용자를 위한 짧은 인터랙티브 튜토리얼입니다. */
"use client";

import { useEffect, useState } from "react";
import "./hub-tutorial.css";

// 튜토리얼은 실제 사용 순서만 짧게 안내하고, 사용자가 명시적으로 다시 보지 않겠다고 선택할 때까지 반복합니다.
const steps = [
  {
    number: "01",
    label: "HUB에서 하는 일",
    title: "만들고 싶은 것을 먼저 선택하세요.",
    description: "HUB는 수많은 AI·개발 서비스를 직접 찾아다니지 않아도 목적에 맞는 서비스를 골라주는 서비스입니다.",
    action: "쇼츠, 이미지, 영상, 음성, 챗봇, API 중 원하는 목적을 선택합니다."
  },
  {
    number: "02",
    label: "조건 설정",
    title: "예산과 개발 경험을 알려주세요.",
    description: "무료로 시작하고 싶은지, 개발이 익숙한지 같은 조건을 함께 반영하면 추천 결과가 달라집니다.",
    action: "예산과 개발 경험을 선택하고 가장 중요한 기능도 고를 수 있습니다."
  },
  {
    number: "03",
    label: "더 빠른 방법",
    title: "원하는 내용을 한 문장으로 입력해도 됩니다.",
    description: "조건을 하나씩 고르기 번거롭다면 검색창에 평소 말하듯 입력하세요.",
    action: "예: 무료로 쇼츠 만들고 싶어 / 상품 사진을 AI로 만들고 싶어"
  },
  {
    number: "04",
    label: "추천 결과 사용",
    title: "추천 서비스를 확인하고 바로 시작하세요.",
    description: "가장 잘 맞는 서비스가 먼저 표시되고, 다른 후보와 비교하거나 상세 정보를 확인할 수 있습니다.",
    action: "상세 보기로 정보를 확인하거나 서비스 시작하기를 눌러 공식 서비스로 이동합니다."
  }
];

const TUTORIAL_OPT_OUT_KEY = "hub-tutorial-opt-out";

export default function HubTutorial() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [ready, setReady] = useState(false);
  const [doNotShowAgain, setDoNotShowAgain] = useState(false);

  useEffect(() => {
    // 브라우저에서만 localStorage를 읽어 사용자가 자동 표시를 중단했는지 확인합니다.
    const optedOut = window.localStorage.getItem(TUTORIAL_OPT_OUT_KEY) === "1";
    setDoNotShowAgain(optedOut);
    setReady(true);

    // 자동 표시 중단을 직접 선택하지 않았다면 접속할 때마다 튜토리얼을 보여줍니다.
    if (!optedOut) setOpen(true);
  }, []);

  const closeTutorial = () => {
    // 단순히 닫거나 건너뛰는 것은 기억하지 않습니다. 다음 접속 때 다시 표시됩니다.
    setOpen(false);
    setStep(0);
  };

  const setTutorialOptOut = (checked) => {
    setDoNotShowAgain(checked);
    if (checked) {
      window.localStorage.setItem(TUTORIAL_OPT_OUT_KEY, "1");
    } else {
      window.localStorage.removeItem(TUTORIAL_OPT_OUT_KEY);
    }
  };

  const goNext = () => {
    if (step >= steps.length - 1) {
      // 마지막 단계까지 봐도 자동 표시 중단으로 처리하지 않습니다.
      closeTutorial();
      return;
    }
    setStep((current) => current + 1);
  };

  // hydration 전에는 화면이 튀지 않도록 튜토리얼과 도움말 버튼을 렌더링하지 않습니다.
  if (!ready) return null;

  return <>
    <button className="hubTutorialHelp" type="button" onClick={() => { setStep(0); setOpen(true); }} aria-label="HUB 사용법 다시 보기">
      사용법
    </button>

    {open && <div className="hubTutorialBackdrop" role="presentation" onMouseDown={(event) => {
      if (event.target === event.currentTarget) closeTutorial();
    }}>
      <section className="hubTutorial" role="dialog" aria-modal="true" aria-labelledby="hub-tutorial-title">
        <button className="hubTutorialClose" type="button" onClick={closeTutorial} aria-label="튜토리얼 닫기">닫기</button>

        <div className="hubTutorialProgress" aria-label={`전체 ${steps.length}단계 중 ${step + 1}단계`}>
          {steps.map((item, index) => <span key={item.number} className={index <= step ? "active" : ""} />)}
        </div>

        <div className="hubTutorialStepNumber">STEP {steps[step].number}</div>
        <div className="hubTutorialLabel">{steps[step].label}</div>
        <h2 id="hub-tutorial-title">{steps[step].title}</h2>
        <p className="hubTutorialDescription">{steps[step].description}</p>
        <div className="hubTutorialAction"><strong>이렇게 사용하세요</strong><span>{steps[step].action}</span></div>

        <label className="hubTutorialOptOut">
          <input
            type="checkbox"
            checked={doNotShowAgain}
            onChange={(event) => setTutorialOptOut(event.target.checked)}
          />
          <span>다시 보지 않기</span>
        </label>

        <div className="hubTutorialFooter">
          <button className="hubTutorialSkip" type="button" onClick={closeTutorial}>건너뛰기</button>
          <button className="hubTutorialNext" type="button" onClick={goNext}>{step === steps.length - 1 ? "시작하기" : "다음"}</button>
        </div>
      </section>
    </div>}
  </>;
}
