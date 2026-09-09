import fs from "node:fs";
import path from "node:path";

// 서비스 데이터 파일 두 개를 읽어 하나의 카탈로그로 검사합니다.
const root = process.cwd();
const files = ["app/lib/services.js", "app/data/service-catalog.js"];
const required = ["id", "name", "category", "icon", "url", "free", "price", "difficulty", "api", "features", "bestFor", "strengths", "caveat", "tags", "uses"];
const allowedPrices = new Set(["무료", "저렴", "중간", "높음"]);
const allowedDifficulty = new Set(["쉬움", "보통", "어려움"]);
const services = [];
const errors = [];

for (const relative of files) {
  const filename = path.join(root, relative);
  const source = fs.readFileSync(filename, "utf8");

  // 현재 카탈로그는 서비스 하나를 한 줄의 객체로 관리하므로 각 객체 줄을 검사합니다.
  for (const [index, line] of source.split("\n").entries()) {
    if (!line.includes('{id:"')) continue;
    const id = line.match(/\{id:"([^"]+)"/)?.[1];
    if (!id) continue;

    const entry = { id, file: relative, line: index + 1, source: line };
    services.push(entry);

    for (const key of required) {
      if (!line.includes(`${key}:`)) errors.push(`${relative}:${index + 1} ${id} → ${key} 누락`);
    }

    const url = line.match(/url:"([^"]+)"/)?.[1] || "";
    const icon = line.match(/icon:"([^"]+)"/)?.[1] || "";
    const price = line.match(/price:"([^"]+)"/)?.[1] || "";
    const difficulty = line.match(/difficulty:"([^"]+)"/)?.[1] || "";

    if (!/^https:\/\//.test(url)) errors.push(`${relative}:${index + 1} ${id} → URL 형식 오류`);
    if (!/^\/illustrations\/service-[^"/]+\.svg$/.test(icon)) errors.push(`${relative}:${index + 1} ${id} → 아이콘 경로 형식 오류`);
    if (!allowedPrices.has(price)) errors.push(`${relative}:${index + 1} ${id} → 가격 분류 오류: ${price || "없음"}`);
    if (!allowedDifficulty.has(difficulty)) errors.push(`${relative}:${index + 1} ${id} → 난이도 분류 오류: ${difficulty || "없음"}`);
    if (/api:false/.test(line) && /uses:\[[^\]]*"api"/.test(line)) errors.push(`${relative}:${index + 1} ${id} → api:false인데 uses에 api 포함`);
  }
}

// ID 중복은 catalogMap에서 앞선 데이터가 덮어써지는 치명적인 문제이므로 즉시 실패시킵니다.
const seen = new Map();
for (const item of services) {
  if (seen.has(item.id)) errors.push(`중복 ID: ${item.id} (${seen.get(item.id)} / ${item.file}:${item.line})`);
  else seen.set(item.id, `${item.file}:${item.line}`);
}

// 실제 public 폴더에 서비스 아이콘이 존재하는지도 함께 검사합니다.
for (const item of services) {
  const icon = item.source.match(/icon:"([^"]+)"/)?.[1];
  if (icon) {
    const iconFile = path.join(root, "public", icon.replace(/^\//, ""));
    if (!fs.existsSync(iconFile)) errors.push(`${item.file}:${item.line} ${item.id} → 아이콘 파일 없음: ${icon}`);
  }
}

console.log(`HUB catalog validation: ${services.length}개 서비스 검사`);
if (errors.length) {
  console.error(`검사 실패: ${errors.length}건`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}
console.log("검사 통과: 중복 ID / 필수 필드 / URL / 아이콘 / 분류 / API 데이터 구조에 이상이 없습니다.");
