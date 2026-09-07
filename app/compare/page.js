// 서비스 비교 페이지: 검색 유입 사용자가 대표 서비스를 한 화면에서 비교하도록 합니다.
import Link from "next/link";

export const metadata = { title: "AI 서비스 비교 | HUB", description: "대표 AI API와 생성형 미디어 서비스를 목적과 주요 활용 분야 기준으로 비교합니다." };

const services = [
  ["OpenAI API", "AI 모델", "텍스트·이미지·음성·멀티모달", "챗봇·콘텐츠·범용 AI 앱"],
  ["Google Gemini API", "AI 모델", "텍스트·이미지·멀티모달", "Google 생태계·멀티모달 앱"],
  ["Claude API", "AI 모델", "텍스트·코딩·분석", "문서·분석·코딩"],
  ["Groq", "AI 추론 API", "빠른 LLM 추론", "빠른 AI 앱·챗봇"],
  ["Replicate", "AI 모델 실행", "이미지·영상·오픈 모델", "생성형 미디어·모델 실험"],
  ["fal", "생성형 미디어 API", "이미지·영상·음성", "생성형 미디어 앱"],
  ["ElevenLabs", "AI 음성", "TTS·더빙·음성", "음성 콘텐츠"],
  ["Firecrawl", "웹 데이터 API", "검색·크롤링·데이터", "웹 데이터 수집"],
];

export default function Compare() { return <main className="page comparePage"><header className="header"><Link className="logo" href="/">HUB</Link><nav><Link href="/guides">가이드</Link><Link href="/">추천받기</Link></nav></header><section className="guideHero"><div className="eyebrow">SERVICE COMPARE</div><h1>이름만 보지 말고,<br /><span>용도로 비교하세요.</span></h1><p>가격과 기능은 계속 변할 수 있으므로 최신 공식 정보를 확인하면서 선택하세요.</p></section><section className="section"><div className="compareTable"><div className="compareHead"><b>서비스</b><b>분류</b><b>주요 기능</b><b>추천 용도</b></div>{services.map(([name,category,features,best]) => <div className="compareRow" key={name}><strong>{name}</strong><span>{category}</span><span>{features}</span><span>{best}</span></div>)}</div><Link className="primaryLink" href="/">내 목적에 맞는 서비스 찾기 →</Link></section></main>; }
