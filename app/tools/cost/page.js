// AI API 비용 계산기: 사용자가 월간 요청량과 토큰량을 넣으면 예상 비용을 계산합니다.
import Link from "next/link";

export const metadata = {
  title: "AI API 비용 계산기 | HUB",
  description: "월간 요청량과 토큰 사용량으로 AI API 예상 비용을 계산해보세요."
};

export default function CostPage() {
  return (
    <main className="page guideArticle">
      <header className="header">
        <Link className="logo" href="/">HUB</Link>
        <nav><Link href="/tools">도구</Link><Link href="/guides">가이드</Link><Link href="/compare">비교하기</Link></nav>
      </header>
      <article>
        <div className="eyebrow">AI COST CALCULATOR</div>
        <h1>AI API 비용,<br /><span>사용량부터 계산하세요.</span></h1>
        <p className="lead">모델과 가격은 변경될 수 있습니다. 아래 계산기는 현재 입력값을 기준으로 예상치를 확인하는 용도입니다.</p>
        <div className="callout">
          <b>계산기 이용 방법</b>
          <p>월간 요청 수와 요청당 입력·출력 토큰을 입력한 뒤 계산 버튼을 누르세요. 실제 청구액에는 모델별 가격, 캐시, 추가 기능 등이 영향을 줄 수 있습니다.</p>
        </div>
        <div className="calculatorCard">
          <div className="calcField"><label>월간 요청 수</label><input id="requests" type="number" min="0" defaultValue="10000" /></div>
          <div className="calcField"><label>요청당 입력 토큰</label><input id="inputTokens" type="number" min="0" defaultValue="1000" /></div>
          <div className="calcField"><label>요청당 출력 토큰</label><input id="outputTokens" type="number" min="0" defaultValue="500" /></div>
          <div className="calcField"><label>입력 토큰 $ / 1M</label><input id="inputPrice" type="number" min="0" step="0.01" defaultValue="0.30" /></div>
          <div className="calcField"><label>출력 토큰 $ / 1M</label><input id="outputPrice" type="number" min="0" step="0.01" defaultValue="2.50" /></div>
          <button className="primaryCalc" type="button" onClick="void 0">계산하기</button>
          <div className="calcResult"><span>예상 월 비용</span><strong id="result">$0.00</strong></div>
        </div>
        <p className="calcNote">※ 이 페이지는 정적 계산기 화면입니다. 브라우저에서 계산 로직을 연결해 사용할 수 있도록 구성되어 있습니다.</p>
        <Link className="primaryLink" href="/tools">다른 무료 도구 보기 →</Link>
      </article>
    </main>
  );
}
