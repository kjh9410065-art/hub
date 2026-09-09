// HUB 추천 엔진 3.1
// 목적 적합도, 기능, 예산, 난이도, API 여부를 하나의 점수로 계산합니다.
// 화면에서 표시하는 별점도 이 최종 점수를 그대로 사용하므로 순위와 별점이 어긋나지 않습니다.

const goalProfiles = {
  shorts:{label:"쇼츠 제작",uses:["shorts","video","image","voice"],weights:{shorts:12,video:7,image:5,voice:4},hints:["쇼츠","콘텐츠","영상","릴스","숏폼"],categories:["AI 영상","이미지 생성","AI 음성","콘텐츠 디자인","생성형 미디어 API"]},
  image:{label:"이미지 제작",uses:["image","video"],weights:{image:12,video:4,shorts:2},hints:["이미지","디자인","상품","썸네일","생성"],categories:["이미지 생성","생성형 디자인","콘텐츠 디자인"]},
  video:{label:"영상 제작",uses:["video","image","shorts"],weights:{video:12,image:5,shorts:3},hints:["영상","비디오","아바타","생성","편집"],categories:["AI 영상","AI 아바타 영상","생성형 미디어 API"]},
  voice:{label:"음성 제작",uses:["voice"],weights:{voice:12,shorts:3},hints:["음성","더빙","tts","stt","전사","실시간"],categories:["AI 음성","AI 음성 API","AI 음성·전사","실시간 음성 AI"]},
  chat:{label:"AI 챗봇",uses:["chat","api","text"],weights:{chat:12,api:5,text:4},hints:["챗봇","llm","텍스트","검색","rag","모델"],categories:["AI 모델","AI 모델·검색","AI 모델·라우팅","고속 AI 추론 API"]},
  api:{label:"개발용 API",uses:["api","search","chat"],weights:{api:12,search:6,chat:3},hints:["api","개발","검색","데이터","크롤링","자동화","인프라"],categories:["AI 검색","검색 API","웹 데이터 API","웹 데이터·자동화","AI 인프라"]}
};

const difficultyWeight={easy:5,medium:3,hard:1};
const difficultyMap={"쉬움":"easy","보통":"medium","어려움":"hard"};
const priceWeight={"저렴":5,"중간":2,"높음":0};
const featureMap={이미지:"image",영상:"video",음성:"voice",챗봇:"chat",검색:"search",텍스트:"text"};
const featureLabels={text:"텍스트 처리",image:"이미지 생성·처리",video:"영상 생성·처리",voice:"음성 기능",search:"검색 기능",api:"개발용 API"};

function addReason(reasons,reason){if(reason&&!reasons.includes(reason))reasons.push(reason);}
function serviceSearchText(service){return[service.name,service.category,service.bestFor,service.caveat,...(service.tags||[]),...(service.strengths||[])].filter(Boolean).join(" ").toLowerCase();}
function getFeatureMatches(service,profile){return Object.entries(profile.weights).filter(([key])=>service.uses?.includes(key)||service.features?.[key]).sort((a,b)=>b[1]-a[1]);}

export function scoreService(service,{goal="shorts",budget="any",skill="any",feature="all"}={}){
  const profile=goalProfiles[goal]||goalProfiles.shorts;
  let score=0;const reasons=[];const text=serviceSearchText(service);

  // 목적과 실제 제공 기능을 가장 크게 반영합니다.
  for(const [key,weight] of Object.entries(profile.weights)){
    if(service.uses?.includes(key))score+=weight;
    else if(service.features?.[key])score+=Math.round(weight*.65);
  }
  if(service.uses?.includes(goal)){score+=9;addReason(reasons,`${profile.label}에 직접 활용 가능`);}

  const hintMatches=profile.hints.filter((hint)=>text.includes(hint));
  if(hintMatches.length){score+=Math.min(6,hintMatches.length*2);if(reasons.length<2)addReason(reasons,`${hintMatches.slice(0,2).join("·")} 중심 작업에 적합`);}
  if(profile.categories.some((category)=>service.category===category))score+=4;

  const matchingFeatures=getFeatureMatches(service,profile);
  if(goal==="shorts"&&matchingFeatures.length>=3){score+=5;addReason(reasons,"이미지·영상·음성을 함께 구성하기 좋음");}
  else if(goal==="video"&&service.features?.video&&service.features?.image){score+=3;addReason(reasons,"이미지 기반 영상 제작에 활용 가능");}
  else if(goal==="voice"&&service.features?.voice&&service.api){score+=3;addReason(reasons,"음성 기능을 API로 연결 가능");}
  else if(goal==="chat"&&service.features?.text&&service.api){score+=3;addReason(reasons,"텍스트 모델을 서비스에 연결 가능");}
  else if(goal==="api"&&service.api&&service.features?.search){score+=3;addReason(reasons,"검색·데이터 기능을 API로 활용 가능");}

  // 예산 조건을 반영합니다.
  if(budget==="free"){
    if(service.free){score+=10;addReason(reasons,"무료로 시작 가능");}else score-=10;
  }else if(budget==="low"){
    score+=priceWeight[service.price]||0;
    if(service.price==="저렴")addReason(reasons,"비용 부담이 낮은 편");
    if(service.free){score+=4;addReason(reasons,"무료 구간으로 테스트 가능");}
  }

  // 개발 경험과 실제 설정 난도를 맞춥니다.
  if(skill!=="any"){
    const expected=difficultyMap[service.difficulty]||"medium";
    if(expected===skill){score+=difficultyWeight[skill]||2;addReason(reasons,`${service.difficulty} 수준으로 접근 가능`);}
    else if(skill==="easy"&&expected==="hard"){score-=8;addReason(reasons,"초보자에게는 설정 난도가 높을 수 있음");}
    else if(skill==="medium"&&expected==="hard")score-=4;
  }

  // 핵심 기능을 선택했다면 해당 기능을 강하게 반영합니다.
  if(feature!=="all"){
    const featureKey=featureMap[feature];
    const featureSupported=featureKey&&(service.features?.[featureKey]||service.uses?.includes(featureKey));
    if(featureSupported){score+=11;addReason(reasons,`${feature} 기능 지원`);}else score-=10;
  }

  // 개발용 API 목적에서는 API 여부를 강하게 평가합니다.
  if(goal==="api"){
    if(service.api){score+=8;addReason(reasons,"개발용 API 제공");}else score-=10;
  }else if(service.api)score+=1;

  if(matchingFeatures.length&&reasons.length<3){const [key]=matchingFeatures[0];addReason(reasons,`${featureLabels[key]||key} 활용 가능`);}
  return{score,reasons:reasons.slice(0,3)};
}

function stableSort(items){
  return items.sort((a,b)=>{
    if(b.score!==a.score)return b.score-a.score;
    if(Number(b.service.free)!==Number(a.service.free))return Number(b.service.free)-Number(a.service.free);
    const aDifficulty=difficultyMap[a.service.difficulty]||"medium";const bDifficulty=difficultyMap[b.service.difficulty]||"medium";
    if(aDifficulty!==bDifficulty){const order={easy:0,medium:1,hard:2};return order[aDifficulty]-order[bDifficulty];}
    if(Number(b.service.api)!==Number(a.service.api))return Number(b.service.api)-Number(a.service.api);
    return a.service.name.localeCompare(b.service.name);
  });
}

// 카테고리 다양성은 동점/근접 점수에서만 약하게 적용합니다.
// 실제 score 자체는 변경하지 않으므로 별점과 순위의 기준이 동일하게 유지됩니다.
function diversify(items,limit=items.length){
  const pool=[...items],selected=[],categoryCounts=new Map();
  while(pool.length&&selected.length<limit){
    let bestIndex=0,bestAdjusted=-Infinity;
    pool.forEach((item,index)=>{
      const count=categoryCounts.get(item.service.category)||0;
      const repetitionPenalty=Math.min(5,count*2);
      const adjusted=item.score-repetitionPenalty;
      if(adjusted>bestAdjusted){bestAdjusted=adjusted;bestIndex=index;}
    });
    const [picked]=pool.splice(bestIndex,1);selected.push(picked);
    const category=picked.service.category;
    categoryCounts.set(category,(categoryCounts.get(category)||0)+1);
  }
  return selected;
}

export function rankServices(services,options){
  const scored=services.map((service)=>({service,...scoreService(service,options)}));
  return diversify(stableSort(scored));
}
