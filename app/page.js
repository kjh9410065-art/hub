/* HUB 0.6 메인 화면: 목적 선택 → 검색 → 추천 → 서비스 비교 흐름을 한 화면에서 제공합니다. */
"use client";

import { useMemo, useState } from "react";

// 사용자가 처음 선택하는 '목적' 목록입니다.
const tasks = [
  { id: "shorts", icon: "🎬", title: "쇼츠 만들기", desc: "이미지·영상·음성까지 한 번에" },
  { id: "image", icon: "🖼️", title: "AI 이미지 만들기", desc: "생성·편집·상품 이미지" },
  { id: "video", icon: "🎥", title: "AI 영상 만들기", desc: "텍스트·이미지로 영상 생성" },
  { id: "voice", icon: "🎙️", title: "AI 음성 만들기", desc: "음성 생성·더빙·변환" },
  { id: "chat", icon: "🧠", title: "AI 챗봇 만들기", desc: "LLM API로 서비스 개발" },
  { id: "api", icon: "⚙️", title: "개발용 API 찾기", desc: "검색·크롤링·AI API" }
];

// HUB가 소개하는 서비스 데이터입니다.
// 나중에 제휴 링크가 생기면 url만 교체해도 전체 화면에 반영됩니다.
const services = [
  { id: "openai", name: "OpenAI API", category: "AI 모델", icon: "🧠", tags: ["텍스트", "이미지", "멀티모달"], desc: "AI 기능을 애플리케이션에 연결하기 좋은 범용 API입니다.", bestFor: "챗봇·콘텐츠·멀티모달", url: "https://platform.openai.com/" },
  { id: "gemini", name: "Google Gemini API", category: "AI 모델", icon: "✨", tags: ["텍스트", "이미지", "멀티모달"], desc: "Gemini 계열 모델을 애플리케이션에서 사용할 수 있습니다.", bestFor: "텍스트·이미지 기반 기능", url: "https://ai.google.dev/" },
  { id: "replicate", name: "Replicate", category: "AI 모델 실행", icon: "🔁", tags: ["이미지", "영상", "오픈 모델"], desc: "다양한 AI 모델을 API로 실행할 수 있는 플랫폼입니다.", bestFor: "이미지·영상 생성", url: "https://replicate.com/" },
  { id: "firecrawl", name: "Firecrawl", category: "AI 검색", icon: "🔎", tags: ["검색", "크롤링", "데이터"], desc: "웹 데이터를 AI 애플리케이션에서 활용하기 위한 API입니다.", bestFor: "웹 검색·데이터 수집", url: "https://www.firecrawl.dev/" },
  { id: "runpod", name: "Runpod", category: "개발 인프라", icon: "☁️", tags: ["GPU", "클라우드", "AI"], desc: "AI·개발 작업에 사용할 수 있는 GPU 인프라 서비스입니다.", bestFor: "GPU 작업·AI 인프라", url: "https://www.runpod.io/" },
  { id: "elevenlabs", name: "ElevenLabs", category: "AI 음성", icon: "🎙️", tags: ["음성", "더빙", "TTS"], desc: "텍스트를 자연스러운 음성으로 변환하는 서비스입니다.", bestFor: "TTS·더빙·음성 콘텐츠", url: "https://elevenlabs.io/" }
];

// 목적별 기본 추천 순서입니다.
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
  const [sortMode, setSortMode] = useState("recommend");
  const [query, setQuery] = useState("");
  const [selectedService, setSelectedService] = useState(null);

  // 목적 추천 목록을 만들고 검색어가 있으면 전체 서비스에서 검색합니다.
  const results = useMemo(() => {
    const ids = recommendations[selectedTask] || [];
    let list = ids.map((id) => services.find((s) => s.id === id)).filter(Boolean);

    if (query.trim()) {
      const q = query.toLowerCase();
      list = services.filter((s) =>
        `${s.name} ${s.category} ${s.tags.join(" ")} ${s.desc} ${s.bestFor}`.toLowerCase().includes(q)
      );
    }

    // 현재는 가격을 실시간 비교하는 단계가 아니므로 '가격 우선' 같은 오해를 만들지 않고
    // 서비스명/카테고리 기준의 간단한 정렬만 제공합니다.
    if (sortMode === "name") return [...list].sort((a, b) => a.name.localeCompare(b.name));
    if (sortMode === "category") return [...list].sort((a, b) => a.category.localeCompare(b.category));
    return list;
  }, [selectedTask, query, sortMode]);

  const selectTask = (id) => {
    setSelectedTask(id);
    setQuery("");
    document.getElementById("recommend")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <main className="page">
      <header className="header">
        <a className="logo" href="#top">HUB</a>
        <nav>
          <a href="#tasks">목적별 찾기</a>
          <a href="#recommend">추천 결과</a>
          <a href="#compare">서비스 목록</a>
        </nav>
      </header>

      <section id="top" className="hero">
        <div className="badge">HUB 0.6 · 목적 기반 추천</div>
        <h1>뭘 써야 할지 모르겠다면,<br /><span>목적을 알려주세요.</span></h1>
        <p>서비스 이름이 없어도 괜찮아요. 만들고 싶은 것을 선택하면 됩니다.</p>
        <div className="searchBox">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && document.getElementById("recommend")?.scrollIntoView({ behavior: "smooth" })}
            placeholder="예: 이미지, 음성, 검색, GPU..."
            aria-label="서비스 검색"
          />
          <button onClick={() => document.getElementById("recommend")?.scrollIntoView({ behavior: "smooth" })}>찾아보기</button>
        </div>
        <div className="quickSearches">
          <span>빠른 검색</span>
          {["이미지", "영상", "음성", "챗봇", "GPU"].map((item) => (
            <button key={item} onClick={() => { setQuery(item); document.getElementById("recommend")?.scrollIntoView({ behavior: "smooth" }); }}>#{item}</button>
          ))}
        </div>
      </section>

      <section id="tasks" className="section">
        <div className="eyebrow">STEP 01</div>
        <h2>무엇을 만들고 있나요?</h2>
        <div className="taskGrid">
          {tasks.map((task) => (
            <button key={task.id} className={`taskCard ${selectedTask === task.id && !query ? "selected" : ""}`} onClick={() => selectTask(task.id)}>
              <span className="taskIcon">{task.icon}</span>
              <span className="taskText"><b>{task.title}</b><small>{task.desc}</small></span>
              <span className="arrow">→</span>
            </button>
          ))}
        </div>
      </section>

      <section id="recommend" className="recommendSection">
        <div className="sectionHead">
          <div>
            <div className="eyebrow">STEP 02 · RECOMMEND</div>
            <h2>{query ? `“${query}” 검색 결과` : "당신에게 먼저 보여줄 서비스"}</h2>
          </div>
          <div className="budget" aria-label="정렬 기준">
            <button className={sortMode === "recommend" ? "active" : ""} onClick={() => setSortMode("recommend")}>추천순</button>
            <button className={sortMode === "name" ? "active" : ""} onClick={() => setSortMode("name")}>이름순</button>
            <button className={sortMode === "category" ? "active" : ""} onClick={() => setSortMode("category")}>분류순</button>
          </div>
        </div>

        <div className="recommendNote">
          <strong>{query ? "검색" : tasks.find((t) => t.id === selectedTask)?.title}</strong>
          {query ? "에 맞는 서비스를 찾았습니다." : "에 맞춰 우선순위가 높은 서비스를 보여주고 있어요."}
          <span>{results.length}개 서비스</span>
        </div>

        <div className="serviceGrid">
          {results.map((service, index) => (
            <article className={`serviceCard ${index === 0 && !query ? "featured" : ""}`} key={service.id}>
              <div className="serviceTop">
                <div className="serviceIcon">{service.icon}</div>
                <span className="rank">{index === 0 && !query ? "BEST MATCH" : `추천 ${index + 1}`}</span>
              </div>
              <div className="category">{service.category}</div>
              <h3>{service.name}</h3>
              <p>{service.desc}</p>
              <div className="bestFor"><span>추천 용도</span><b>{service.bestFor}</b></div>
              <div className="tags">{service.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
              <div className="serviceActions">
                <button onClick={() => setSelectedService(service)}>자세히 보기</button>
                <a href={service.url} target="_blank" rel="noreferrer">공식 사이트 ↗</a>
              </div>
            </article>
          ))}
          {results.length === 0 && (
            <div className="empty"><b>찾는 서비스가 아직 없어요.</b><span>다른 키워드로 검색하거나 목적을 선택해보세요.</span><button onClick={() => setQuery("")}>추천 다시 보기</button></div>
          )}
        </div>
      </section>

      <section id="compare" className="allSection">
        <div className="eyebrow">ALL SERVICES</div>
        <h2>서비스를 한눈에 둘러보세요.</h2>
        <p className="sectionSub">관심 있는 서비스를 누르면 추천 영역에서 바로 확인할 수 있습니다.</p>
        <div className="miniGrid">
          {services.map((service) => (
            <button key={service.id} className="miniCard" onClick={() => { setQuery(service.name); document.getElementById("recommend")?.scrollIntoView({ behavior: "smooth" }); }}>
              <span>{service.icon}</span>
              <div><b>{service.name}</b><small>{service.category}</small></div>
              <strong>→</strong>
            </button>
          ))}
        </div>
      </section>

      <footer>
        <b>HUB</b>
        <span>목적에 맞는 AI·개발 서비스를 더 쉽게 찾을 수 있도록 계속 확장합니다.</span>
      </footer>

      {selectedService && (
        <div className="modalBackdrop" onClick={() => setSelectedService(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="modalClose" onClick={() => setSelectedService(null)} aria-label="닫기">×</button>
            <div className="modalIcon">{selectedService.icon}</div>
            <div className="category">{selectedService.category}</div>
            <h3>{selectedService.name}</h3>
            <p>{selectedService.desc}</p>
            <div className="modalInfo"><span>추천 용도</span><b>{selectedService.bestFor}</b></div>
            <div className="tags">{selectedService.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
            <a className="modalLink" href={selectedService.url} target="_blank" rel="noreferrer">공식 사이트 방문 ↗</a>
          </div>
        </div>
      )}
    </main>
  );
}
