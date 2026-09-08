// HUB 제휴 프로그램 정보입니다.
// 승인 전에는 서비스의 고유 제휴 링크를 임의로 만들지 않습니다.
// 승인 후 발급받은 개인 링크만 affiliateUrl에 입력하면 HUB의 CTA가 자동으로 제휴 링크를 사용합니다.
export const affiliatePrograms = {
  elevenlabs: {
    provider: "ElevenLabs",
    // 2026-09-08 사용자가 직접 발급받은 개인 제휴 링크입니다.
    affiliateUrl: "https://try.elevenlabs.io/z67o177bkbyh",
    applicationUrl: "https://elevenlabs.io/affiliates",
    status: "active",
    commissionNote: "개인 제휴 링크를 통한 가입/결제에 대해 제휴 수익이 발생할 수 있습니다.",
    disclosure: "이 링크를 통해 가입하면 HUB가 제휴 수수료를 받을 수 있습니다."
  },
  runway: {
    provider: "Runway",
    affiliateUrl: "",
    applicationUrl: "https://runway.com/affiliate-program",
    status: "pending",
    commissionNote: "제휴 신청 후 승인되면 개인 제휴 링크를 연결합니다.",
    disclosure: "이 링크를 통해 가입하면 HUB가 제휴 수수료를 받을 수 있습니다."
  },
  descript: {
    provider: "Descript",
    affiliateUrl: "",
    applicationUrl: "https://www.descript.com/affiliate",
    status: "apply",
    commissionNote: "승인 후 고유 affiliate link를 발급받습니다.",
    disclosure: "이 링크를 통해 가입하면 HUB가 제휴 수수료를 받을 수 있습니다."
  },
  heygen: {
    provider: "HeyGen",
    affiliateUrl: "",
    applicationUrl: "https://www.heygen.com/affiliate-program",
    status: "pending",
    commissionNote: "제휴 신청 후 승인되면 개인 referral link를 연결합니다.",
    disclosure: "이 링크를 통해 가입하면 HUB가 제휴 수수료를 받을 수 있습니다."
  },
  synthesia: {
    provider: "Synthesia",
    // 2026-09-08 사용자가 직접 발급받은 개인 제휴 링크입니다.
    affiliateUrl: "https://www.synthesia.io?via=260e21",
    applicationUrl: "https://www.synthesia.io/partners/affiliates",
    status: "active",
    commissionNote: "개인 제휴 링크를 통한 결제에 대해 제휴 수익이 발생할 수 있습니다.",
    disclosure: "이 링크를 통해 가입하면 HUB가 제휴 수수료를 받을 수 있습니다."
  },
  leonardo: {
    provider: "Leonardo AI",
    affiliateUrl: "",
    applicationUrl: "https://www.leonardo.ai/leonardo-creator-program/",
    status: "hold",
    commissionNote: "현재 Creator Program 신청이 보류된 상태라 링크를 연결하지 않습니다.",
    disclosure: "이 링크를 통해 가입하면 HUB가 제휴 수수료를 받을 수 있습니다."
  },
  jasper: {
    provider: "Jasper",
    affiliateUrl: "",
    applicationUrl: "https://www.jasper.ai/partners",
    status: "apply",
    commissionNote: "공식 제휴 프로그램 승인 후 개인 affiliate link를 사용합니다.",
    disclosure: "이 링크를 통해 가입하면 HUB가 제휴 수수료를 받을 수 있습니다."
  }
};

// 서비스 id와 제휴 프로그램 id를 연결합니다.
export const serviceAffiliateMap = {
  elevenlabs: "elevenlabs",
  runway: "runway",
  descript: "descript",
  heygen: "heygen",
  synthesia: "synthesia",
  leonardo: "leonardo",
  jasper: "jasper"
};

export function getAffiliateProgram(serviceId) {
  const programId = serviceAffiliateMap[serviceId];
  return programId ? affiliatePrograms[programId] : null;
}

// 승인 전에는 공식 사이트로 보내고, 개인 제휴 링크가 있으면 그 링크를 우선 사용합니다.
export function getOutboundUrl(service) {
  const program = getAffiliateProgram(service.id);
  return program?.affiliateUrl?.trim() || service.url;
}

export function hasAffiliateLink(service) {
  const program = getAffiliateProgram(service.id);
  return Boolean(program?.affiliateUrl?.trim());
}

export function getAffiliateDisclosure(service) {
  return getAffiliateProgram(service)?.disclosure || "";
}

// 외부 이동 전 브라우저에 최소한의 클릭 기록을 남겨 어떤 추천이 실제 행동으로 이어지는지 확인합니다.
// 실제 서버 분석을 붙일 때도 이 이벤트 구조를 기준으로 확장할 수 있습니다.
export function trackOutboundClick(service, source = "unknown") {
  if (typeof window === "undefined" || !service?.id) return;

  const event = {
    serviceId: service.id,
    provider: service.name,
    source,
    affiliate: hasAffiliateLink(service),
    timestamp: new Date().toISOString()
  };

  try {
    const key = "hub-outbound-clicks";
    const current = JSON.parse(window.localStorage.getItem(key) || "[]");
    const next = Array.isArray(current) ? current.slice(-199) : [];
    next.push(event);
    window.localStorage.setItem(key, JSON.stringify(next));
  } catch {
    // 저장이 막힌 브라우저에서도 외부 링크 이동 자체는 정상적으로 동작합니다.
  }
}
