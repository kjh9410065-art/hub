/* HUB 0.7 메인 화면: 목적 → 검색 → 필터 → 추천 → 상세 정보까지 한 번에 제공합니다. */
"use client";

import { useEffect, useMemo, useState } from "react";

// 사용자가 가장 먼저 선택하는 제작 목적입니다.
const tasks = [
  { id: "shorts", icon: "🎬", title: "쇼츠 만들기", desc: "이미지·영상·음성까지 한 번에" },
  { id: "image", icon: "🖼️", title: "AI 이미지 만들기", desc: "생성·편집·상품 이미지" },
  { id: "video", icon: "🎥", title: "AI 영상 만들기", desc: "텍스트·이미지로 영상 생성" },
  { id: "voice", icon: "🎙️", title: "AI 음성 만들기", desc: "음성 생성·더빙·변환" },
  { id: "chat", icon: "🧠", title: "AI 챗봇 만들기", desc: "LLM API로 서비스 개발" },
  { id: "api", icon: "⚙️", title: "개발용 API 찾기", desc: "검색·크롤링·AI 인프라" }
];

// HUB의 서비스 카탈로그입니다.
// 가격은 자주 바뀌므로 현재 단계에서는 가격 숫자를 하드코딩하지 않습니다.
const services = [
  { id: "openai", name: "OpenAI API", category: "AI 모델", icon: "🧠", tags: ["텍스트", "이미지", "멀티모달"], desc: "텍스트·이미지·음성 등 다양한 AI 기능을 애플리케이션에 연결할 수 있습니다.", bestFor: "챗봇·콘텐츠·멀티모달", strengths: ["범용성이 높음", "여러 AI 기능을 한 곳에서 구성하기 좋음"], url: "https://platform.openai.com/", uses: ["chat", "image", "voice", "shorts", "api"] },
  { id: "gemini", name: "Google Gemini API", category: "AI 모델", icon: "✨", tags: ["텍스트", "이미지", "멀티모달"], desc: "Gemini 계열 모델을 애플리케이션에서 사용할 수 있는 개발자용 API입니다.", bestFor: "텍스트·이미지 기반 기능", strengths: ["멀티모달 활용", "Google AI 생태계와 연계"], url: "https://ai.google.dev/", uses: ["chat", "image", "video", "shorts", "api"] },
  { id: "claude", name: "Claude API", category: "AI 모델", icon: "🟠", tags: ["텍스트", "코딩", "분석"], desc: "Claude 모델을 애플리케이션에 연결해 텍스트 처리와 AI 기능을 구축할 수 있습니다.", bestFor: "문서·분석·코딩", strengths: ["텍스트 중심 작업", "긴 문서 처리에 활용하기 좋음"], url: "https://www.anthropic.com/api", uses: ["chat", "api"] },
  { id: "groq", name: "Groq", category: "AI 추론 API", icon: "⚡", tags: ["빠른 응답", "LLM", "API"], desc: "지원되는 오픈 모델을 빠른 추론 API 형태로 사용할 수 있는 플랫폼입니다.", bestFor: "빠른 AI 앱·챗봇", strengths: ["빠른 추론을 목표로 한 인프라", "API 방식으로 연결 가능"], url: "https://groq.com/", uses: ["chat", "api"] },
  { id: "replicate", name: "Replicate", category: "AI 모델 실행", icon: "🔁", tags: ["이미지", "영상", "오픈 모델"], desc: "다양한 AI 모델을 API로 실행할 수 있는 플랫폼입니다.", bestFor: "이미지·영상 생성", strengths: ["다양한 모델 선택", "생성형 미디어 실험에 적합"], url: "https://replicate.com/", uses: ["shorts", "image", "video", "api"] },
  { id: "fal", name: "fal", category: "생성형 미디어 API", icon: "🪄", tags: ["이미지", "영상", "음성"], desc: "생성형 미디어 모델을 API로 활용할 수 있는 개발 플랫폼입니다.", bestFor: "생성 이미지·영상 앱", strengths: ["생성형 미디어 모델 활용", "개발자용 API 제공"], url: "https://fal.ai/", uses: ["shorts", "image", "video", "voice", "api"] },
  { id: "elevenlabs", name: "ElevenLabs", category: "AI 음성", icon: "🎙️", tags: ["음성", "더빙", "TTS"], desc: "텍스트 음성 변환과 음성 관련 기능을 애플리케이션에 연결할 수 있습니다.", bestFor: "TTS·더빙·음성 콘텐츠", strengths: ["음성 콘텐츠 제작", "더빙·TTS 활용"], url: "https://elevenlabs.io/", uses: ["voice", "shorts"] },
  { id: "firecrawl", name: "Firecrawl", category: "웹 데이터 API", icon: "🔎", tags: ["검색", "크롤링", "데이터"], desc: "웹 페이지를 AI 애플리케이션에서 활용할 수 있도록 수집·변환하는 API입니다.", bestFor: "웹 검색·데이터 수집", strengths: ["웹 데이터 파이프라인", "AI 앱에 웹 콘텐츠 연결"], url: "https://www.firecrawl.dev/", uses: ["api", "chat"] },
  { id: "runpod", name: "Runpod", category: "AI 인프라", icon: "☁️", tags: ["GPU", "클라우드", "AI"], desc: "AI 개발과 모델 실행에 사용할 수 있는 GPU 기반 인프라를 제공합니다.", bestFor: "GPU 작업·AI 인프라", strengths: ["GPU 컴퓨팅", "AI 개발 인프라 구성"], url: "https://www.runpod.io/", uses: ["api", "image", "video"] },
  { id: "huggingface", name: "Hugging Face", category: "AI 모델·플랫폼", icon: "🤗", tags: ["오픈 모델", "데이터", "ML"], desc: "오픈 모델과 데이터셋을 탐색하고 AI 개발에 활용할 수 있는 플랫폼입니다.", bestFor: "오픈 모델 탐색·실험", strengths: ["폭넓은 모델 생태계", "모델·데이터셋 탐색"], url: "https://huggingface.co/", uses: ["image", "chat", "api"] },
  { id: "mistral", name: "Mistral AI", category: "AI 모델", icon: "🌬️", tags: ["LLM", "API", "오픈 모델"], desc: "Mistral 계열 모델을 API와 개발 도구를 통해 활용할 수 있습니다.", bestFor: "LLM 앱·개발", strengths: ["LLM 중심 서비스", "개발자용 API 제공"], url: "https://mistral.ai/", uses: ["chat", "api"] },
  { id: "together", name: "Together AI", category: "AI 인프라·API", icon: "🧩", tags: ["오픈 모델", "GPU", "API"], desc: "오픈 모델을 활용한 생성형 AI 애플리케이션 개발을 위한 API와 인프라를 제공합니다.", bestFor: "오픈 모델 기반 AI 앱", strengths: ["오픈 모델 활용", "AI 개발 인프라"], url: "https://www.together.ai/", uses: ["chat", "image", "api"] }
];

// 목적별 추천 우선순위입니다. 숫자가 높을수록 해당 목적과 더 잘 맞습니다.
const recommendationScores = {
  shorts: { replicate: 100, fal: 96, elevenlabs: 92, openai: 82, gemini: 78 },
  image: { replicate: 100, fal: 96, openai: 88, gemini: 86, huggingface: 80, runpod: 76 },
  video: { fal: 100, replicate: 96, gemini: 82, openai: 78, runpod: 74 },
  voice: { elevenlabs: 100, openai: 86, fal: 82, gemini: 76 },
  chat: { openai: 100, claude: 96, gemini: 91, groq: 89, mistral: 84, together: 80 },
  api: { firecrawl: 100, openai: 86, groq: 82, runpod: 80, huggingface: 78, mistral: 76, together: 74 }
};

const quickSearches = ["이미지", "영상", "음성", "챗봇", "GPU", "크롤링"];

export default function Home() {
  const [selectedTask, setSelectedTask] = useState("shorts");
  const [sortMode, setSortMode] = useState("recommend");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("전체");
  const [selectedService, setSelectedService] = useState(null);
  const [favorites, setFavorites] = useState([]);

  // 브라우저에 즐겨찾기를 저장해 재방문해도 유지합니다.
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("hub-favorites") || "[]");
      setFavorites(Array.isArray(saved) ? saved : []);
    } catch {
      setFavorites([]);
    }
  }, []);

  const toggleFavorite = (id) => {
    setFavorites((current) => {
      const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
      localStorage.setItem("hub-favorites", JSON.stringify(next));
      return next;
    });
  };

  // 검색어·카테고리·목적을 조합해 결과를 계산합니다.
  const results = useMemo(() => {
    const scores = recommendationScores[selectedTask] || {};
    let list = services.filter((service) => service.uses.includes(selectedTask));

    if (query.trim()) {
      const q = query.toLowerCase();
      list = services.filter((service) => `${service.name} ${service.category} ${service.tags.join(" ")} ${service.desc} ${service.bestFor}`.toLowerCase().includes(q));
    }

    if (category !== "전체") list = list.filter((service) => service.category === category);

    if (sortMode === "favorite") return [...list].sort((a, b) => Number(favorites.includes(b.id)) - Number(favorites.includes(a.id)) || (scores[b.id] || 0) - (scores[a.id] || 0));
    if (sortMode === "name") return [...list].sort((a, b) => a.name.localeCompare(b.name));
    if (sortMode === "category") return [...list].sort((a, b) => a.category.localeCompare(b.category));
    return [...list].sort((a, b) => (scores[b.id] || 60) - (scores[a.id] || 60));
  }, [selectedTask, query, category, sortMode, favorites]);

  const categories = ["전체", ...new Set(services.map((service) => service.category))];
  const selectedTaskInfo = tasks.find((task) => task.id === selectedTask);

  const selectTask = (id) => {
    setSelectedTask(id);
    setQuery("");
    setCategory("전체");
    setSortMode("recommend");
    setTimeout(() => document.getElementById("recommend")?.scrollIntoView({ behavior: "smooth", block: "start" }), 0);
  };

  const search = (value) => {
    setQuery(value);
    setCategory("전체");
    setTimeout(() => document.getElementById("recommend")?.scrollIntoView({ behavior: "smooth", block: "start" }), 0);
  };

  return (
    <main className="page">
      <header className="header">
        <a className="logo" href="#top">HUB</a>
        <nav><a href="#tasks">목적별 찾기</a><a href="#recommend">추천 결과</a><a href="#compare">서비스 목록</a></nav>
      </header>

      <section id="top" className="hero">
        <div className="badge">HUB 0.7 · 목적 기반 추천</div>
        <h1>뭘 써야 할지 모르겠다면,<br /><span>목적을 알려주세요.</span></h1>
        <p>서비스 이름이 없어도 괜찮아요. 만들고 싶은 것을 선택하면 됩니다.</p>
        <div className="searchBox">
          <input value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => e.key === "Enter" && search(query)} placeholder="예: 이미지, 음성, 검색, GPU..." aria-label="서비스 검색" />
          <button onClick={() => search(query)}>찾아보기</button>
        </div>
        <div className="quickSearches"><span>빠른 검색</span>{quickSearches.map((item) => <button key={item} onClick={() => search(item)}>#{item}</button>)}</div>
      </section>

      <section id="tasks" className="section">
        <div className="eyebrow">STEP 01</div><h2>무엇을 만들고 있나요?</h2>
        <div className="taskGrid">
          {tasks.map((task) => (
            <button key={task.id} className={`taskCard ${selectedTask === task.id && !query ? "selected" : ""}`} onClick={() => selectTask(task.id)}>
              <span className="taskIcon">{task.icon}</span><span className="taskText"><b>{task.title}</b><small>{task.desc}</small></span><span className="arrow">→</span>
            </button>
          ))}
        </div>
      </section>

      <section id="recommend" className="recommendSection">
        <div className="sectionHead">
          <div><div className="eyebrow">STEP 02 · RECOMMEND</div><h2>{query ? `“${query}” 검색 결과` : `${selectedTaskInfo?.title}에 맞는 서비스`}</h2></div>
          <div className="sortButtons" aria-label="정렬 기준">
            <button className={sortMode === "recommend" ? "active" : ""} onClick={() => setSortMode("recommend")}>추천순</button>
            <button className={sortMode === "favorite" ? "active" : ""} onClick={() => setSortMode("favorite")}>즐겨찾기</button>
            <button className={sortMode === "name" ? "active" : ""} onClick={() => setSortMode("name")}>이름순</button>
          </div>
        </div>

        <div className="filterRow">
          <span>분류</span>
          <div className="categoryFilters">{categories.map((item) => <button key={item} className={category === item ? "active" : ""} onClick={() => setCategory(item)}>{item}</button>)}</div>
        </div>

        <div className="recommendNote"><strong>{query ? "검색" : selectedTaskInfo?.title}</strong>{query ? "에 맞는 서비스를 찾았습니다." : "에 맞춰 우선순위가 높은 서비스를 보여주고 있어요."}<span>{results.length}개 서비스 · 즐겨찾기 {favorites.length}개</span></div>

        <div className="serviceGrid">
          {results.map((service, index) => {
            const score = recommendationScores[selectedTask]?.[service.id] || 60;
            return (
              <article className={`serviceCard ${index === 0 && !query ? "featured" : ""}`} key={service.id}>
                <div className="serviceTop"><div className="serviceIcon">{service.icon}</div><button className={`favorite ${favorites.includes(service.id) ? "saved" : ""}`} onClick={() => toggleFavorite(service.id)} aria-label={`${service.name} 즐겨찾기`}>{favorites.includes(service.id) ? "★" : "☆"}</button></div>
                <div className="cardMeta"><span className="category">{service.category}</span><span className="match">{score}% MATCH</span></div>
                <h3>{service.name}</h3><p>{service.desc}</p>
                <div className="bestFor"><span>추천 용도</span><b>{service.bestFor}</b></div>
                <div className="tags">{service.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
                <div className="serviceActions"><button onClick={() => setSelectedService(service)}>자세히 보기</button><a href={service.url} target="_blank" rel="noreferrer">공식 사이트 ↗</a></div>
              </article>
            );
          })}
          {results.length === 0 && <div className="empty"><b>찾는 서비스가 아직 없어요.</b><span>다른 키워드로 검색하거나 분류를 바꿔보세요.</span><button onClick={() => { setQuery(""); setCategory("전체"); }}>추천 다시 보기</button></div>}
        </div>
      </section>

      <section id="compare" className="allSection">
        <div className="eyebrow">ALL SERVICES · {services.length}</div><h2>서비스를 한눈에 둘러보세요.</h2><p className="sectionSub">관심 있는 서비스를 누르면 추천 영역에서 바로 확인할 수 있습니다.</p>
        <div className="miniGrid">
          {services.map((service) => <button key={service.id} className="miniCard" onClick={() => { setSelectedService(service); }}><span>{service.icon}</span><div><b>{service.name}</b><small>{service.category}</small></div><strong>{favorites.includes(service.id) ? "★" : "→"}</strong></button>)}
        </div>
      </section>

      <footer><b>HUB</b><span>목적에 맞는 AI·개발 서비스를 더 쉽게 찾을 수 있도록 계속 확장합니다.</span></footer>

      {selectedService && (
        <div className="modalBackdrop" onClick={() => setSelectedService(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="modalClose" onClick={() => setSelectedService(null)} aria-label="닫기">×</button>
            <div className="modalIcon">{selectedService.icon}</div>
            <div className="category">{selectedService.category}</div><h3>{selectedService.name}</h3><p>{selectedService.desc}</p>
            <div className="modalInfo"><span>추천 용도</span><b>{selectedService.bestFor}</b></div>
            <div className="modalInfo"><span>이 서비스가 좋은 이유</span><div>{selectedService.strengths.map((item) => <b className="reason" key={item}>✓ {item}</b>)}</div></div>
            <div className="tags">{selectedService.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
            <div className="modalActions"><button onClick={() => toggleFavorite(selectedService.id)}>{favorites.includes(selectedService.id) ? "★ 저장됨" : "☆ 저장하기"}</button><a className="modalLink" href={selectedService.url} target="_blank" rel="noreferrer">공식 사이트 방문 ↗</a></div>
          </div>
        </div>
      )}
    </main>
  );
}
