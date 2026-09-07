/* HUB 1.0: 예산·개발 경험·필요 기능을 반영해 목적에 맞는 서비스를 다시 계산합니다. */
"use client";

import { useMemo, useState } from "react";
import "./recommend.css";

const services = [
  { id:"replicate", name:"Replicate", type:"이미지·영상", free:true, price:2, difficulty:2, api:true, tags:["이미지","영상","오픈 모델"], desc:"다양한 AI 모델을 API로 실행하기 좋은 선택" },
  { id:"fal", name:"fal", type:"이미지·영상·음성", free:true, price:2, difficulty:2, api:true, tags:["이미지","영상","음성"], desc:"생성형 미디어 API를 빠르게 붙이기 좋은 선택" },
  { id:"openai", name:"OpenAI API", type:"텍스트·이미지·음성", free:false, price:3, difficulty:1, api:true, tags:["챗봇","이미지","음성","멀티모달"], desc:"여러 AI 기능을 하나의 생태계에서 구성하기 좋은 선택" },
  { id:"gemini", name:"Google Gemini API", type:"텍스트·이미지·멀티모달", free:true, price:1, difficulty:1, api:true, tags:["챗봇","이미지","멀티모달"], desc:"비용 부담을 낮추면서 멀티모달 기능을 시작하기 좋은 선택" },
  { id:"elevenlabs", name:"ElevenLabs", type:"음성·TTS", free:true, price:2, difficulty:1, api:true, tags:["음성","TTS","더빙"], desc:"음성 생성과 더빙을 중심으로 만들 때 적합" },
  { id:"claude", name:"Claude API", type:"텍스트·코딩·분석", free:false, price:3, difficulty:1, api:true, tags:["챗봇","문서","코딩"], desc:"문서·분석·코딩 중심 AI 기능에 적합" },
  { id:"groq", name:"Groq", type:"빠른 LLM 추론", free:true, price:1, difficulty:1, api:true, tags:["챗봇","LLM","빠른 응답"], desc:"응답 속도를 중요하게 보는 LLM 앱에 적합" },
  { id:"firecrawl", name:"Firecrawl", type:"검색·크롤링", free:true, price:2, difficulty:2, api:true, tags:["검색","크롤링","웹 데이터"], desc:"웹 데이터를 AI 앱에 연결할 때 적합" }
];

const goals = [
  ["shorts","쇼츠 만들기","이미지·영상·음성을 조합해 콘텐츠 제작"],
  ["image","AI 이미지 만들기","생성·편집·상품 이미지 제작"],
  ["video","AI 영상 만들기","텍스트·이미지 기반 영상 제작"],
  ["voice","AI 음성 만들기","TTS·더빙·음성 콘텐츠 제작"],
  ["chat","AI 챗봇 만들기","LLM을 활용한 서비스 개발"],
  ["api","개발용 API 찾기","검색·크롤링·AI 인프라 연결"]
];

export default function RecommendPage(){
  const [goal,setGoal]=useState("shorts");
  const [budget,setBudget]=useState("low");
  const [skill,setSkill]=useState("beginner");
  const [feature,setFeature]=useState("all");

  const results=useMemo(()=>{
    const wanted={shorts:["replicate","fal","elevenlabs","openai","gemini"],image:["replicate","fal","openai","gemini"],video:["fal","replicate","gemini","openai"],voice:["elevenlabs","openai","fal","gemini"],chat:["openai","claude","gemini","groq"],api:["firecrawl","openai","groq","replicate"]}[goal]||[];
    return services.filter(s=>wanted.includes(s.id)).map(s=>{
      let score=100-(wanted.indexOf(s.id)*4);
      if(budget==="free") score+=s.free?18:-18;
      if(budget==="low") score+=s.price<=1?12:s.price===2?5:-8;
      if(skill==="beginner") score+=s.difficulty===1?12:s.difficulty===2?3:-8;
      if(skill==="developer") score+=s.api?8:0;
      if(feature!=="all") score+=s.tags.some(t=>t.includes(feature))?15:-10;
      return {...s,score};
    }).sort((a,b)=>b.score-a.score);
  },[goal,budget,skill,feature]);

  const selectedGoal=goals.find(g=>g[0]===goal);
  return <main className="recommendPage">
    <a className="back" href="/">← HUB 홈</a>
    <header className="recommendHero"><span>HUB 1.0 · PERSONAL RECOMMEND</span><h1>내 조건까지 반영해서<br/><b>딱 맞는 서비스를 찾아보세요.</b></h1><p>{selectedGoal?.[1]} · {selectedGoal?.[2]}</p></header>
    <section className="conditionCard">
      <div className="conditionBlock"><label>무엇을 만들고 있나요?</label><div className="choiceGrid">{goals.map(g=><button key={g[0]} className={goal===g[0]?"active":""} onClick={()=>setGoal(g[0])}><strong>{g[1]}</strong><small>{g[2]}</small></button>)}</div></div>
      <div className="conditionBlock"><label>예산은 어느 정도인가요?</label><div className="pills">{[["free","무료 우선"],["low","저렴하게 시작"],["any","비용 상관없음"]].map(x=><button key={x[0]} className={budget===x[0]?"active":""} onClick={()=>setBudget(x[0])}>{x[1]}</button>)}</div></div>
      <div className="conditionBlock"><label>개발 경험은 어떤가요?</label><div className="pills">{[["beginner","초보"],["normal","보통"],["developer","개발자"]].map(x=><button key={x[0]} className={skill===x[0]?"active":""} onClick={()=>setSkill(x[0])}>{x[1]}</button>)}</div></div>
      <div className="conditionBlock"><label>가장 중요한 기능은?</label><div className="pills">{[["all","상관없음"],["이미지","이미지"],["영상","영상"],["음성","음성"],["챗봇","챗봇"],["검색","검색"]].map(x=><button key={x[0]} className={feature===x[0]?"active":""} onClick={()=>setFeature(x[0])}>{x[1]}</button>)}</div></div>
    </section>
    <section className="results"><div className="resultHead"><div><span>STEP 02 · RESULT</span><h2>당신에게 맞는 추천 TOP {Math.min(5,results.length)}</h2></div><em>{results.length}개 후보 분석 완료</em></div>
      {results.slice(0,5).map((s,i)=><article className={`resultCard ${i===0?"best":""}`} key={s.id}><div className="rank">{i===0?"BEST":`0${i+1}`}</div><div className="resultMain"><div className="resultTitle"><div><h3>{s.name}</h3><small>{s.type}</small></div><strong>{Math.round(Math.min(100,s.score))}<small>점</small></strong></div><p>{s.desc}</p><div className="chips">{s.tags.map(t=><span key={t}>{t}</span>)}<span>{s.free?"무료 시작 가능":"유료 중심"}</span><span>난이도 {s.difficulty===1?"쉬움":s.difficulty===2?"보통":"높음"}</span></div></div><div className="resultActions"><button onClick={()=>window.open(`https://www.google.com/search?q=${encodeURIComponent(s.name)}`,"_blank")}>서비스 보기 ↗</button></div></article>)}
    </section>
  </main>;
}
