/* HUB 0.5.0 메인 화면: 사용자의 목적을 받아 필요한 서비스를 추천합니다. */
"use client";

import { useMemo, useState } from "react";

const tasks = [
  { id: "shorts", icon: "🎬", title: "쇼츠 만들기", desc: "이미지·영상·음성까지 한 번에" },
  { id: "image", icon: "🖼️", title: "AI 이미지 만들기", desc: "생성·편집·상품 이미지" },
  { id: "video", icon: "🎥", title: "AI 영상 만들기", desc: "텍스트·이미지로 영상 생성" },
  { id: "voice", icon: "🎙️", title: "AI 음성 만들기", desc: "음성 생성·더빙·변환" },
  { id: "chat", icon: "🧠", title: "AI 챗봇 만들기", desc: "LLM API로 서비스 개발" },
  { id: "api", icon: "⚙️", title: "개발용 API 찾기", desc: "검색·크롤링·AI API" }
];

const services = [
  { id: "openai", name: "OpenAI API", category: "AI 모델", icon: "🧠", tags: ["텍스트", "이미지", "멀티모달"], desc: "AI 기능을 애플리케이션에 연결하기 좋은 범용 API입니다.", url: "https://platform.openai.com/" },
  { id: "gemini", name: "Google Gemini API", category: "AI 모델", icon: "✨", tags: ["텍스트", "이미지", "멀티모달"], desc: "Gemini 계열 모델을 애플리케이션에서 사용할 수 있습니다.", url: "https://ai.google.dev/" },
  { id: "replicate", name: "Replicate", category: "AI 이미지", icon: "🔁", tags: ["이미지", "영상", "오픈 모델"], desc: "다양한 AI 모델을 API로 실행할 수 있는 플랫폼입니다.", url: "https://replicate.com/" },
  { id: "firecrawl", name: "Firecrawl", category: "AI 검색", icon: "🔎", tags: ["검색", "크롤링", "데이터"], desc: "웹 데이터를 AI 애플리케이션에서 활용하기 위한 API입니다.", url: "https://www.firecrawl.dev/" },
  { id: "runpod", name: "Runpod", category: "개발 인프라", icon: "☁️", tags: ["GPU", "클라우드", "AI"], desc: "AI·개발 작업에 사용할 수 있는 GPU 인프라 서비스입니다.", url: "https://www.runpod.io/" },
  { id: "elevenlabs", name: "ElevenLabs", category: "AI 음성", icon: "🎙️", tags: ["음성", "더빙", "TTS"], desc: "텍스트를 자연스러운 음성으로 변환하는 서비스입니다.", url: "https://elevenlabs.io/" }
];

const recommendations = {
  shorts: ["replicate", "elevenlabs", "openai"],
  image: ["replicate", "openai", "gemini"],
  video: ["replicate", "openai", "gemini"],
  voice: ["elevenlabs", "openai", "gemini"],
  chat: ["openai", "gemini", "replicate"],
  api: ["firecrawl", "openai", "runpod"]
};

export default function Home() {
  const [selectedTask, setSelectedTask] = useState("shorts");
  const [budget, setBudget] = useState("balanced");
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const ids = recommendations[selectedTask] || [];
    let list = ids.map((id) => services.find((s) => s.id === id)).filter(Boolean);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = services.filter((s) => `${s.name} ${s.category} ${s.tags.join(" ")} ${s.desc}`.toLowerCase().includes(q));
    }
    return list;
  }, [selectedTask, query]);

  return (
    <main className="page">
      <header className="header">
        <a className="logo" href="#">HUB</a>
        <nav><a href="#tasks">목적별 찾기</a><a href="#recommend">추천 결과</a><a href="#compare">서비스 목록</a></nav>
      </header>

      <section className="hero">
        <div className="badge">HUB 0.5 · 목적 기반 추천</div>
        <h1>뭘 써야 할지 모르겠다면,<br /><span>목적을 알려주세요.</span></h1>
        <p>원하는 작업을 선택하면 필요한 서비스를 먼저 골라드립니다.</p>
        <div className="searchBox">
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="서비스 이름이나 기능을 검색해보세요" />
          <button onClick={() => document.getElementById("recommend")?.scrollIntoView({ behavior: "smooth" })}>찾아보기</button>
        </div>
      </section>

      <section id="tasks" className="section">
        <div className="eyebrow">STEP 01</div><h2>무엇을 만들고 있나요?</h2>
        <div className="taskGrid">
          {tasks.map((task) => (
            <button key={task.id} className={`taskCard ${selectedTask === task.id ? "selected" : ""}`} onClick={() => { setSelectedTask(task.id); setQuery(""); }}>
              <span className="taskIcon">{task.icon}</span><span className="taskText"><b>{task.title}</b><small>{task.desc}</small></span><span className="arrow">→</span>
            </button>
          ))}
        </div>
      </section>

      <section id="recommend" className="recommendSection">
        <div className="sectionHead">
          <div><div className="eyebrow">STEP 02 · RECOMMEND</div><h2>당신에게 먼저 보여줄 서비스</h2></div>
          <div className="budget">{[["cheap", "가격 우선"], ["balanced", "균형"], ["quality", "품질 우선"]].map(([id, label]) => <button key={id} className={budget === id ? "active" : ""} onClick={() => setBudget(id)}>{label}</button>)}</div>
        </div>
        <div className="recommendNote"><strong>{tasks.find(t => t.id === selectedTask)?.title}</strong>에 맞춰 우선순위가 높은 서비스를 보여주고 있어요.<span>※ 현재는 MVP 추천 데이터입니다.</span></div>
        <div className="serviceGrid">
          {results.map((service, index) => (
            <article className="serviceCard" key={service.id}>
              <div className="serviceTop"><div className="serviceIcon">{service.icon}</div><span className="rank">{index === 0 ? "BEST MATCH" : `추천 ${index + 1}`}</span></div>
              <div className="category">{service.category}</div><h3>{service.name}</h3><p>{service.desc}</p>
              <div className="tags">{service.tags.map(tag => <span key={tag}>{tag}</span>)}</div>
              <a href={service.url} target="_blank" rel="noreferrer">공식 사이트 보기 ↗</a>
            </article>
          ))}
          {results.length === 0 && <div className="empty">검색 결과가 없습니다.</div>}
        </div>
      </section>

      <section id="compare" className="allSection">
        <div className="eyebrow">ALL SERVICES</div><h2>서비스를 직접 비교해보세요.</h2>
        <div className="miniGrid">
          {services.map((service) => <button key={service.id} className="miniCard" onClick={() => { setQuery(service.name); document.getElementById("recommend")?.scrollIntoView({ behavior: "smooth" }); }}><span>{service.icon}</span><div><b>{service.name}</b><small>{service.category}</small></div><strong>→</strong></button>)}
        </div>
      </section>

      <footer><b>HUB</b><span>서비스 정보와 추천 기준은 실제 데이터와 제휴 조건에 맞춰 계속 업데이트합니다.</span></footer>
    </main>
  );
}