/* HUB 1.2: 목적과 조건을 반영하고 비교 목록까지 이어지는 개인화 추천 화면입니다. */
"use client";

import { useEffect, useMemo, useState } from "react";
import "./recommend.css";
import { serviceMap, services } from "../lib/services";

const goals = [
  ["shorts","🎬","쇼츠 만들기","이미지·영상·음성을 조합해 콘텐츠 제작"],
  ["image","🖼️","AI 이미지 만들기","생성·편집·상품 이미지 제작"],
  ["video","🎥","AI 영상 만들기","텍스트·이미지 기반 영상 제작"],
  ["voice","🎙️","AI 음성 만들기","TTS·더빙·음성 콘텐츠 제작"],
  ["chat","🧠","AI 챗봇 만들기","LLM을 활용한 서비스 개발"],
  ["api","⚙️","개발용 API 찾기","검색·크롤링·AI 인프라 연결"]
];

const featureOptions=[["all","상관없음"],["이미지","이미지"],["영상","영상"],["음성","음성"],["챗봇","챗봇"],["검색","검색"]];

function readCompare(){try{return JSON.parse(localStorage.getItem("hub-compare")||"[]")}catch{return[]}}

export default function RecommendPage(){
  const [goal,setGoal]=useState("shorts");
  const [budget,setBudget]=useState("low");
  const [skill,setSkill]=useState("beginner");
  const [feature,setFeature]=useState("all");
  const [compare,setCompare]=useState([]);

  useEffect(()=>{
    const params=new URLSearchParams(window.location.search);
    const task=params.get("task");
    if(goals.some(g=>g[0]===task)) setGoal(task);
    setCompare(readCompare());
  },[]);

  const results=useMemo(()=>{
    const wanted={shorts:["replicate","fal","elevenlabs","openai","gemini"],image:["replicate","fal","openai","gemini","huggingface","runpod"],video:["fal","replicate","gemini","openai","runpod"],voice:["elevenlabs","openai","fal","gemini"],chat:["openai","claude","gemini","groq","mistral","together"],api:["firecrawl","openai","groq","runpod","huggingface","mistral","together"]}[goal]||[];
    return wanted.map(id=>serviceMap[id]).filter(Boolean).map((s,index)=>{
      let score=100-index*4;
      if(budget==="free") score+=s.free?18:-18;
      if(budget==="low") score+=s.price==="저렴"?12:s.price==="중간"?5:-8;
      if(skill==="beginner") score+=s.difficulty==="쉬움"?12:s.difficulty==="보통"?3:-8;
      if(skill==="developer") score+=s.api?8:0;
      if(feature!=="all"){
        const featureMatch={이미지:s.features.image,영상:s.features.video,음성:s.features.voice,챗봇:s.features.text,검색:s.features.search}[feature];
        score+=featureMatch?15:-10;
      }
      const reasons=[];
      if(index===0) reasons.push("선택한 목적에 특히 잘 맞음");
      if(budget==="free"&&s.free) reasons.push("무료로 시작하기 쉬움");
      if(budget==="low"&&s.price==="저렴") reasons.push("비용 부담을 낮추기 좋음");
      if(skill==="beginner"&&s.difficulty==="쉬움") reasons.push("초보자도 접근하기 쉬움");
      if(feature!=="all"&&({이미지:s.features.image,영상:s.features.video,음성:s.features.voice,챗봇:s.features.text,검색:s.features.search}[feature])) reasons.push(`${feature} 기능을 지원`);
      return {...s,score:Math.round(Math.min(100,score)),reason:reasons.slice(0,3).join(" · ")||s.bestFor};
    }).sort((a,b)=>b.score-a.score);
  },[goal,budget,skill,feature]);

  const toggleCompare=(id)=>{
    setCompare(current=>{
      const next=current.includes(id)?current.filter(x=>x!==id):current.length>=4?current:[...current,id];
      localStorage.setItem("hub-compare",JSON.stringify(next));
      return next;
    });
  };

  const selectedGoal=goals.find(g=>g[0]===goal);
  return <main className="recommendPage">
    <div className="recommendShell">
      <header className="recommendTop"><a className="recommendBrand" href="/">HUB</a><a className="recommendBack" href="/">홈으로</a></header>
      <section className="recommendIntro"><div className="eyebrow">HUB 1.2 · PERSONAL RECOMMEND</div><h1>조건까지 반영해서<br/><span>{selectedGoal?.[2]}</span>을 찾아보세요.</h1><p>{selectedGoal?.[3]}</p></section>
      <section className="conditionGrid">
        <div className="conditionCard"><h2>① 만들고 싶은 것</h2><div className="choiceGrid">{goals.map(g=><button className={`choice ${goal===g[0]?"active":""}`} key={g[0]} onClick={()=>setGoal(g[0])}>{g[1]} {g[2]}</button>)}</div></div>
        <div className="conditionCard"><h2>② 예산</h2><div className="choiceGrid">{[["free","무료 우선"],["low","저렴하게 시작"],["any","비용 상관없음"]].map(x=><button className={`choice ${budget===x[0]?"active":""}`} key={x[0]} onClick={()=>setBudget(x[0])}>{x[1]}</button>)}</div></div>
        <div className="conditionCard"><h2>③ 개발 경험</h2><div className="choiceGrid">{[["beginner","초보"],["normal","보통"],["developer","개발자"]].map(x=><button className={`choice ${skill===x[0]?"active":""}`} key={x[0]} onClick={()=>setSkill(x[0])}>{x[1]}</button>)}</div></div>
      </section>
      <section className="conditionCard"><h2>④ 가장 중요한 기능</h2><div className="choiceGrid">{featureOptions.map(x=><button className={`choice ${feature===x[0]?"active":""}`} key={x[0]} onClick={()=>setFeature(x[0])}>{x[1]}</button>)}</div></section>
      <section className="results"><div className="resultHead"><div><div className="eyebrow">STEP 02 · RESULT</div><h2>당신에게 맞는 추천 TOP {Math.min(5,results.length)}</h2></div><span className="resultCount">{results.length}개 후보 분석</span></div>
        <div className="resultGrid">{results.slice(0,5).map((s,i)=><article className={`resultCard ${i===0?"top":""}`} key={s.id}>
          {i===0&&<span className="topBadge">🏆 가장 추천</span>}
          <div className="resultServiceTop"><div className="resultIcon">{s.icon}</div><div><div className="resultTitle">{s.name}</div><div className="resultCategory">{s.category}</div></div><div className="score">{s.score}<small>점</small></div></div>
          <div className="reason"><b>추천 이유</b><br/>{s.reason}</div>
          <div className="chips"><span className="good">{s.free?"무료 시작 가능":"유료 중심"}</span><span>비용 {s.price}</span><span>난이도 {s.difficulty}</span><span>{s.api?"API 제공":"API 확인 필요"}</span>{s.tags.slice(0,3).map(t=><span key={t}>{t}</span>)}</div>
          <div className="resultActions"><button className="compareBtn" onClick={()=>toggleCompare(s.id)}>{compare.includes(s.id)?"✓ 비교 선택됨":"+ 비교하기"}</button><a className="officialBtn" href={s.url} target="_blank" rel="noreferrer">공식 사이트 ↗</a></div>
        </article>)}</div>
      </section>
    </div>
    {compare.length>0&&<div className="compareBar"><strong>{compare.length}/4 비교</strong><div className="compareNames">{compare.map(id=><span className="compareName" key={id}>{serviceMap[id]?.name}</span>)}</div><a className="compareGo" href="/compare">비교하기 →</a></div>}
  </main>;
}