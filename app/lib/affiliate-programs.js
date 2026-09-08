// HUB 제휴 프로그램 정보입니다.
// 중요: 승인 전에는 서비스의 고유 제휴 링크를 임의로 만들어 사용하지 않습니다.
// 각 서비스의 공식 제휴 프로그램 가입 페이지를 기록해 두고,
// 승인 후 발급받은 개인 referralUrl만 affiliateUrl에 넣으면 사이트 전체 CTA가 자동으로 전환됩니다.
export const affiliatePrograms = {
  elevenlabs: {
    provider: "ElevenLabs",
    affiliateUrl: "",
    applicationUrl: "https://elevenlabs.io/affiliates",
    status: "apply",
    commissionNote: "승인된 제휴 파트너에게 고유 referral link가 발급됩니다.",
    disclosure: "이 링크를 통해 가입하면 HUB가 제휴 수수료를 받을 수 있습니다."
  },
  runway: {
    provider: "Runway",
    affiliateUrl: "",
    applicationUrl: "https://affiliates.runwayml.com/",
    status: "apply",
    commissionNote: "공식 Affiliate Portal에서 신청 후 개인 제휴 링크를 발급받습니다.",
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
    status: "apply",
    commissionNote: "승인 후 Rewardful을 통해 개인 referral link를 발급받습니다.",
    disclosure: "이 링크를 통해 가입하면 HUB가 제휴 수수료를 받을 수 있습니다."
  },
  synthesia: {
    provider: "Synthesia",
    affiliateUrl: "",
    applicationUrl: "https://www.synthesia.io/partners/affiliates",
    status: "apply",
    commissionNote: "승인 후 개인 referral link를 발급받습니다.",
    disclosure: "이 링크를 통해 가입하면 HUB가 제휴 수수료를 받을 수 있습니다."
  },
  leonardo: {
    provider: "Leonardo AI",
    affiliateUrl: "",
    applicationUrl: "https://leonardo.ai/leonardo-creator-program/",
    status: "apply",
    commissionNote: "Creator Program에서 제휴 프로그램 참여 기회를 제공합니다.",
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

// 승인 전에는 반드시 공식 사이트로 보내고, 개인 제휴 링크가 입력되면 그 링크를 우선 사용합니다.
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
