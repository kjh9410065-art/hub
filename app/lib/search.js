// HUB 검색 보조 모듈 3.3입니다.
// 검색어를 목적 + 조건으로 해석하고, 결과가 없을 때도 관련 목적을 기준으로 대안을 제시합니다.

const aliases={쇼츠:["shorts","영상","콘텐츠","숏폼"],숏츠:["shorts","영상","콘텐츠","숏폼"],릴스:["shorts","영상","콘텐츠","숏폼"],틱톡:["shorts","영상","콘텐츠","숏폼"],숏폼:["shorts","영상","콘텐츠"],이미지:["image","생성","디자인","사진"],사진:["image","상품 이미지","이미지"],상품사진:["image","상품","커머스","상품 이미지"],상품이미지:["image","상품","커머스","상품 사진"],썸네일:["image","디자인","콘텐츠"],영상:["video","동영상","쇼츠","숏폼"],비디오:["video","동영상"],음성:["voice","tts","더빙","목소리"],목소리:["voice","tts","음성"],더빙:["voice","음성","아바타"],tts:["voice","음성","더빙"],stt:["voice","전사","음성"],챗봇:["chat","llm","대화"],채팅봇:["chat","llm","대화"],llm:["chat","text","모델"],모델:["llm","chat","text"],api:["api","개발","developer","개발용 api"],개발:["api","developer","개발용 api","자동화"],크롤링:["search","웹 데이터","firecrawl","스크래핑"],스크래핑:["search","웹 데이터","크롤링"],검색:["search","웹 데이터","크롤링","리서치"],리서치:["search","웹 검색","검색","데이터"],무료:["free"],공짜:["free"],오픈소스:["open model","huggingface","오픈 모델"],오픈모델:["open model","오픈 모델","huggingface"],빠른:["fast","추론","groq","cerebras","고속"],고속:["fast","추론","groq","cerebras","빠른"],한국어:["korean","음성","text","tts"],기업:["기업용","enterprise","cloud","보안"],자동화:["api","워크플로","개발","영상"]};
const conditionTerms=new Set(["무료","공짜","api","개발"]);
const purposeAliases={쇼츠:"shorts",숏츠:"shorts",릴스:"shorts",틱톡:"shorts",숏폼:"shorts",이미지:"image",사진:"image",상품사진:"image",상품이미지:"image",썸네일:"image",영상:"video",비디오:"video",음성:"voice",목소리:"voice",더빙:"voice",tts:"voice",stt:"voice",챗봇:"chat",채팅봇:"chat",llm:"chat",모델:"chat",검색:"search",크롤링:"search",스크래핑:"search",리서치:"search"};
const fieldWeights={name:18,category:8,bestFor:7,tags:6,strengths:4,uses:5};

function clean(value=""){return String(value).trim().toLowerCase().replace(/[·,./|()[\]{}:_-]+/g," ").replace(/\s+/g," ");}
function buildTerms(query){
  const raw=clean(query);if(!raw)return{raw:"",terms:[],expanded:[],purposes:[],conditions:[]};
  const terms=raw.split(/\s+/).filter(Boolean),expanded=new Set(terms),purposes=new Set(),conditions=new Set();
  terms.forEach((word)=>{if(purposeAliases[word])purposes.add(purposeAliases[word]);if(conditionTerms.has(word))conditions.add(word==="공짜"?"무료":word);if(!conditionTerms.has(word))(aliases[word]||[]).forEach((alias)=>expanded.add(clean(alias)));});
  return{raw,terms,expanded:[...expanded].filter(Boolean),purposes:[...purposes],conditions:[...conditions]};
}
export function normalizeSearchQuery(query=""){const{raw,terms,expanded}=buildTerms(query);return{raw,terms:expanded.length?[raw,...expanded]:terms};}
export function getSearchText(service){return[service.name,service.category,service.bestFor,...(service.tags||[]),...(service.uses||[]),...(service.strengths||[])].filter(Boolean).join(" ").toLowerCase();}
function fieldText(service,field){return["tags","uses","strengths"].includes(field)?clean((service[field]||[]).join(" ")):clean(service[field]);}
function termMatches(text,term){if(!term)return 0;if(text===term)return 1;if(text.includes(term))return .75;const tokens=text.split(" ");return tokens.some((token)=>token.startsWith(term)||term.startsWith(token)) ? .35 : 0;}
function serviceSupportsPurpose(service,purpose){return Boolean(service.uses?.includes(purpose)||service.features?.[purpose]);}

export function scoreSearch(service,query){
  const{raw,terms,expanded,purposes,conditions}=buildTerms(query);if(!raw)return{score:0,reasons:[]};
  let score=0;const reasons=[],fields=["name","category","bestFor","tags","uses","strengths"],name=fieldText(service,"name");
  if(name===raw)score+=80;else if(name.includes(raw))score+=55;
  for(const field of fields){const text=fieldText(service,field);if(!text)continue;let best=0;for(const term of expanded)best=Math.max(best,termMatches(text,term));if(best>0)score+=fieldWeights[field]*best;}
  const matchedOriginalTerms=terms.filter((term)=>conditionTerms.has(term)||fields.some((field)=>termMatches(fieldText(service,field),term)>0));score+=matchedOriginalTerms.length*3;if(terms.length>1&&matchedOriginalTerms.length===terms.length)score+=12;
  purposes.forEach((purpose)=>{if(service.uses?.includes(purpose)){score+=24;reasons.push("목적과 직접 연결");}else if(service.features?.[purpose]){score+=10;reasons.push("관련 기능 지원");}else score-=8;});
  if(purposes.length>1&&purposes.every((purpose)=>serviceSupportsPurpose(service,purpose))){score+=14;reasons.push("여러 기능을 함께 지원");}
  if(conditions.includes("무료")){if(service.free){score+=24;reasons.push("무료 시작 가능");}else score-=30;}
  if(conditions.includes("api")){if(service.api){score+=24;reasons.push("API 제공");}else score-=30;}
  return{score:Math.max(0,Math.round(score)),reasons:[...new Set(reasons)].slice(0,2)};
}
export function matchesSearch(service,query){return!clean(query)||scoreSearch(service,query).score>0;}
export function searchCatalog(catalog,query){if(!clean(query))return catalog;return catalog.map((service,index)=>({service,index,...scoreSearch(service,query)})).filter((item)=>item.score>0).sort((a,b)=>b.score-a.score||a.index-b.index).map((item)=>item.service);}
export function rankSearchResults(services,query){return searchCatalog(services,query);}

// 결과가 없을 때 검색 의도와 명시 조건을 보존한 대안을 찾습니다.
export function getSearchSuggestions(services,query,options={}){
  const{raw,purposes,conditions}=buildTerms(query);if(!raw)return[];
  const onlyFree=Boolean(options.onlyFree),onlyApi=Boolean(options.onlyApi),candidates=[];
  services.forEach((service,index)=>{
    if(onlyFree&&!service.free)return;if(onlyApi&&!service.api)return;
    let score=0;
    purposes.forEach((purpose)=>{if(service.uses?.includes(purpose))score+=30;else if(service.features?.[purpose])score+=10;});
    if(conditions.includes("무료")&&service.free)score+=10;if(conditions.includes("api")&&service.api)score+=10;
    if(!purposes.length&&getSearchText(service).includes(raw))score+=10;
    if(score>0)candidates.push({service,index,score});
  });
  return candidates.sort((a,b)=>b.score-a.score||a.index-b.index).slice(0,3).map((item)=>item.service);
}
