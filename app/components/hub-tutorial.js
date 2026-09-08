/* HUB 사용법 안내: 사용자가 다시 보지 않기를 직접 선택할 때까지 접속할 때마다 표시합니다. */
"use client";

import { useEffect, useState } from "react";
import "./hub-tutorial.css";

// 튜토리얼은 기능을 길게 설명하기보다 사용자가 실제로 해야 할 행동 순서만 보여줍니다.
const steps = [
  {
    number: "01",
    label: "목적 선택",
    title: "무엇을 만들고 싶은지 먼저 골라보세요.",
    description: "HUB는 목적을 기준으로 여러 AI·개발 서비스를 찾아주고, 나에게 맞는 후보를 먼저 보여줍니다.",
    action: "쇼츠, 이미지, 영상, 음성, 챗봇, API 중 원하는 목적을 선택합니다."
  },
  {
    number: "02",
    label: "조건 설정",
    title: "예산과 개발 경험을 알려주세요.",
    description: "무료로 시작하고 싶은지, 개발이 익숙한지 같은 조건까지 반영하면 추천 결과가 달라집니다.",
    action: "예산과 개발 난이도를 선택하고 필요한 기능을 추가로 고릅니다."
  },
  {
    number: "03",
    label: "자연어 검색",
    title: "그냥 원하는 걸 한 문장으로 말해도 됩니다.",
    description: "조건을 하나씩 선택하기 어렵다면 검색창에 평소 말하듯 입력하면 됩니다.",
    action: "예: 무료로 쇼츠 만들고 싶어 / 상품 사진을 AI로 만들고 싶어"
  },
  {
    number: "04",
    label: "추천과 비교",
    title: "추천 결과를 확인하고 필요한 경우 비교하세요.",
    description: "가장 잘 맞는 서비스가 먼저 나오고, 상세 정보와 다른 후보를 비교한 뒤 공식 서비스로 이동할 수 있습니다.",
    action: "상세 보기를 누르거나 비교할 서비스를 골라 나란히 확인합니다."
  }
];

export default function HubTutorial() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [ready, setReady] = useState(false);
  const [neverShow, setNeverShow] = useState(false);

  useEffect(() => {
    // 브라우저에서만 저장된 '다시 보지 않기' 설정을 읽습니다.
    const saved = window.localStorage.getItem("hub-tutorial-never-show") === "1";
    setNeverShow(saved);
    setReady(true);

    // 사용자가 직접 다시 보지 않기를 선택하기 전까지는 접속할 때마다 자동으로 보여줍니다.
    if (!saved) setOpen(true);
  }, []);

  const closeTutorial = () => {
    // 단순히 닫거나 건너뛰는 것은 저장하지 않습니다.
    // 따라서 다음 접속에서는 튜토리얼이 다시 표시됩니다.
    setOpen(false);
    setStep(0);
  };

  const finishTutorial = () => {
    // 마지막 단계까지 본 것만으로는 종료 처리하지 않습니다.
    // 체크박스를 직접 선택한 경우에만 이후 자동 표시를 중단합니다.
    setOpen(false);
    setStep(0);
  };

  const setNeverShowAgain = (checked) => {
    setNeverShow(checked);
    if (checked) {
      window.localStorage.setItem("hub-tutorial-never-show", "1");
      finishTutorial();
    } else {
      window.localStorage.removeItem("hub-tutorial-never-show");
    }
  };

  const goNext = () => {
    if (step >= steps.length - 1) {
      finishTutorial();
      return;
    }
    setStep((current) => current + 1);
  };

  // hydration 전에는 화면이 튀지 않도록 도움말 버튼을 렌더링하지 않습니다.
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

        <label className="hubTutorialNever">
          <input type="checkbox" checked={neverShow} onChange={(event) => setNeverShowAgain(event.target.checked)} />
          <span>다시 보지 않기</span>
        </label>

        <div className="hubTutorialFooter">
          <button className="hubTutorialSkip" type="button" onClick={closeTutorial}>닫기</button>
          <button className="hubTutorialNext" type="button" onClick={goNext}>{step === steps.length - 1 ? "시작하기" : "다음"}</button>
        </div>
      </section>
    </div>}
  </>;
}
