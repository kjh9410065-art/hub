/* HUB 추천 화면: 목적, 예산, 난이도, 핵심 기능과 자연어 요구사항을 함께 반영합니다. */
"use client";

import { useEffect, useMemo, useState } from "react";
import "./recommend.css";
import "./recommend-next.css";
import "./mobile-ui-fix.css";
import { catalog, catalogMap } from "../lib/catalog";
import { rankServices } from "../lib/recommendation";
import { rankSearchResults, scoreSearch } from "../lib/search";
import { parseRecommendationIntent } from "../lib/recommendation-intent";
import { getAffiliateDisclosure, getOutboundUrl, hasAffiliateLink, trackOutboundClick } from "../lib/affiliate-programs";

// 목적 카드에는 HUB 전용 SVG 일러스트만 사용합니다.
const goals = [
  ["shorts", "/illustrations/task-short.svg", "쇼츠 만들기", "이미지·영상·음성을 조합해 콘텐츠 제작"],
  ["image", "/illustrations/task-image-new.svg", "AI 이미지 만들기", "생성·편집·상품 이미지 제작"],
  ["video", "/illustrations/task-video-new.svg", "AI 영상 만들기", "텍스트·이미지 기반 영상 제작"],
  ["voice", "/illustrations/task-voice-new.svg", "AI 음성 만들기", "TTS·더빙·음성 콘텐츠 제작"],
  ["chat", "/illustrations/task-chat-new.svg", "AI 챗봇 만들기", "LLM을 활용한 서비스 개발"],
  ["api", "/illustrations/task-api-new.svg", "개발용 API 찾기", "검색·크롤링·AI 인프라 연결"]
];

// 이하 추천 페이지 로직은 기존 구현을 유지합니다.
