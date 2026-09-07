// 추천 로직을 화면에서 분리합니다. 서비스가 늘어나도 이 파일의 규칙만 조정하면 됩니다.
const goalWeights={
  shorts:{shorts:8,video:5,image:4,voice:3},
  image:{image:9,video:3,shorts:2},
  video:{video:9,image:4,shorts:3},
  voice:{voice:10,shorts:3},
  chat:{chat:10,api:4},
  api:{api:10,search:5,chat:2}
};
const budgetWeight={free:4,paid:0};
const difficultyWeight={easy:4,medium:2,hard:0};
const difficultyMap={"쉬움":"easy","보통":"medium","어려움":"hard"};
const priceMap={"저렴":"free","중간":"paid","높음":"paid"};

export function scoreService(service,{goal="shorts",budget="any",skill="any",feature="all"}={}){
  let score=0;
  const reasons=[];
  const weights=goalWeights[goal]||{};
  for(const [key,weight] of Object.entries(weights)){
    if(service.uses?.includes(key)||service.features?.[key]) score+=weight;
  }
  if(budget==="free"){
    if(service.free){score+=budgetWeight.free;reasons.push("무료 시작 가능")}
    else score-=3;
  }
  if(skill!=="any"){
    const expected=difficultyMap[service.difficulty]||"medium";
    if(expected===skill){score+=difficultyWeight[skill]||2;reasons.push(`${service.difficulty} 수준으로 접근 가능`)}
    else if(skill==="easy"&&expected==="hard") score-=4;
  }
  if(feature!=="all"){
    const featureKey={이미지:"image",영상:"video",음성:"voice",챗봇:"text",검색:"search"}[feature];
    if(featureKey&&service.features?.[featureKey]){score+=6;reasons.push(`${feature} 기능 지원`)}else score-=5;
  }
  if(service.uses?.includes(goal)) reasons.push("선택한 목적과 직접 연결");
  if(service.api) score+=1;
  return {score,reasons:[...new Set(reasons)].slice(0,3)};
}

export function rankServices(services,options){
  return services.map(service=>({service,...scoreService(service,options)})).sort((a,b)=>b.score-a.score);
}
