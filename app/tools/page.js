// HUB 무료 도구 모음: 방문자가 서비스 선택 전에 직접 계산하고 판단할 수 있는 실용 도구를 제공합니다.
import Link from "next/link";
import "./tools-icons.css";

export const metadata = { title: "AI 무료 도구 | HUB", description: "AI 서비스 선택에 도움이 되는 무료 계산기와 개발자용 실용 도구를 HUB에서 이용하세요." };

// 카드 아이콘은 모두 SVG 스프라이트의 ID를 가리킵니다.
// 이렇게 하면 운영체제마다 모양이 달라지는 이모지 대신 HUB에서 통일한 아이콘이 표시됩니다.
const tools = [
 {href:"/tools/cost",icon:"calculator",title:"AI API 비용 계산기",desc:"예상 사용량을 입력하고 월간 API 비용을 빠르게 계산합니다."},
 {href:"/tools/token",icon:"token",title:"AI 토큰 추정기",desc:"프롬프트를 붙여 넣고 대략적인 토큰 사용량을 확인합니다."},
 {href:"/tools/prompt",icon:"prompt",title:"프롬프트 길이 측정",desc:"프롬프트의 글자·단어·줄 수와 예상 토큰을 바로 확인합니다."},
 {href:"/tools/json",icon:"json",title:"JSON 정리·검사",desc:"AI API 응답과 설정 JSON의 문법을 검사하고 보기 좋게 정리합니다."},
 {href:"/tools/base64",icon:"base64",title:"Base64 변환기",desc:"텍스트와 Base64 문자열을 인코딩·디코딩합니다."},
 {href:"/tools/url",icon:"url",title:"URL 인코더·디코더",desc:"한글·공백·특수문자를 URL용 문자열로 변환하거나 복원합니다."},
 {href:"/tools/uuid",icon:"uuid",title:"UUID 생성기",desc:"개발에 사용할 UUID를 최대 20개까지 한 번에 생성합니다."},
 {href:"/tools/markdown",icon:"markdown",title:"Markdown 정리기",desc:"AI가 만든 Markdown의 불필요한 공백과 빈 줄을 정리합니다."},
 {href:"/tools/regex",icon:"regex",title:"정규식 테스트기",desc:"정규식 패턴과 테스트 문자열을 넣어 매칭 결과를 즉시 확인합니다."},
 {href:"/tools/word",icon:"text",title:"텍스트 분석기",desc:"글자·단어·줄 수와 한글 글자 수를 한눈에 확인합니다."},
 {href:"/tools/color",icon:"color",title:"색상 변환기",desc:"HEX 색상을 RGB와 HSL 값으로 변환합니다."},
 {href:"/tools/timestamp",icon:"timestamp",title:"Timestamp 변환기",desc:"Unix timestamp를 날짜와 시간으로 변환합니다."},
 {href:"/tools/qr",icon:"qr",title:"QR 빠른 공유 가이드",desc:"URL과 텍스트를 QR로 공유할 때 알아둘 점을 확인합니다."},
 {href:"/tools/percent",icon:"percent",title:"퍼센트 계산기",desc:"할인·인상·증감 금액을 빠르게 계산합니다."},
 {href:"/tools/bytes",icon:"bytes",title:"데이터 용량 변환기",desc:"Bytes부터 TB까지 데이터 단위를 변환합니다."},
 {href:"/tools/base",icon:"base",title:"진법 변환기",desc:"2·8·10·16진수 값을 서로 변환합니다."},
 {href:"/tools/slug",icon:"slug",title:"URL 슬러그 생성기",desc:"제목과 문장을 검색·공유에 쓰기 좋은 URL 형태로 정리합니다."},
 {href:"/tools/entities",icon:"entities",title:"HTML 엔티티 변환기",desc:"HTML 특수문자를 엔티티로 인코딩하거나 다시 복원합니다."},
 {href:"/tools/jwt",icon:"jwt",title:"JWT 디코더",desc:"JWT의 Header와 Payload 내용을 브라우저에서 확인합니다."},
 {href:"/tools/csv-json",icon:"csv",title:"CSV · JSON 변환기",desc:"표 데이터를 JSON으로, JSON 배열을 CSV로 변환합니다."},
 {href:"/tools/sql",icon:"sql",title:"SQL 포맷터",desc:"한 줄 SQL을 주요 절 기준으로 읽기 쉽게 정리합니다."},
 {href:"/tools/html",icon:"html",title:"HTML 정리기",desc:"HTML을 압축하거나 태그별 줄바꿈으로 보기 좋게 정리합니다."},
 {href:"/tools/cron",icon:"cron",title:"Cron 도우미",desc:"5필드 Cron 표현식을 분·시·일·월·요일로 나눠 확인합니다."},
 {href:"/tools/table",icon:"table",title:"Markdown 표 생성기",desc:"쉼표로 구분한 데이터를 Markdown 표로 변환합니다."},
 {href:"/tools/lorem",icon:"lorem",title:"더미 텍스트 생성기",desc:"개발·디자인 테스트용 Lorem Ipsum을 원하는 길이로 만듭니다."},
 {href:"/tools/number",icon:"number",title:"숫자 포맷터",desc:"큰 숫자에 구분을 넣고 만·억·조 단위로 확인합니다."},
 {href:"/tools/discount",icon:"discount",title:"연속 할인 계산기",desc:"여러 할인율을 순서대로 적용한 실제 최종 가격을 계산합니다."},
 {href:"/compare",icon:"compare",title:"AI 서비스 비교",desc:"대표 AI 서비스를 기능과 용도 중심으로 한눈에 비교합니다."},
 {href:"/guides",icon:"guide",title:"목적별 선택 가이드",desc:"쇼츠·이미지·챗봇·음성 등 만들고 싶은 결과물부터 서비스를 찾습니다."}
];

export default function ToolsPage(){
  return (
    <main className="page toolPage">
      <header className="header"><Link className="logo" href="/">HUB</Link><nav><Link href="/guides">가이드</Link><Link href="/compare">비교하기</Link></nav></header>
      <section className="guideHero"><div className="eyebrow">HUB TOOLS</div><h1>서비스를 고르기 전에,<br/><span>직접 계산하고 비교하세요.</span></h1><p>무료 도구를 이용해 필요한 서비스와 예상 비용을 먼저 확인할 수 있습니다.</p></section>
      <section className="section"><div className="guideGrid">
        {tools.map((tool) => (
          <Link className="guideCard" href={tool.href} key={tool.href}>
            <svg className="toolIcon" viewBox="0 0 48 48" aria-hidden="true"><use href={`/illustrations/tool-icons.svg#${tool.icon}`} /></svg>
            <h2>{tool.title}</h2>
            <p>{tool.desc}</p>
            <b>사용하기 →</b>
          </Link>
        ))}
      </div></section>
    </main>
  );
}
