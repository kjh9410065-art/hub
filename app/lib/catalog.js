// 모든 서비스 화면이 동일한 카탈로그를 바라보도록 기존 12개와 확장 서비스를 합칩니다.
import { services as coreServices } from "./services";
import { additionalServices } from "../data/service-catalog";

export const catalog=[...coreServices,...additionalServices];
export const catalogMap=Object.fromEntries(catalog.map(service=>[service.id,service]));

export function findServices(query=""){
  const keyword=query.trim().toLowerCase();
  if(!keyword)return catalog;
  return catalog.filter(service=>[
    service.name,service.category,service.bestFor,...service.tags,...service.uses
  ].join(" ").toLowerCase().includes(keyword));
}
