import { catalog } from "./lib/catalog";

const baseUrl = "https://mova.tcflick.com";

export default function sitemap() {
  const staticRoutes = ["/", "/recommend", "/catalog", "/tools", "/compare", "/terms", "/privacy", "/contact", "/external-links"];
  const serviceRoutes = catalog.map((service) => `/services/${service.id}`);

  return [...staticRoutes, ...serviceRoutes].map((path) => ({
    url: `${baseUrl}${path}`,
    changeFrequency: path.startsWith("/services/") ? "weekly" : "daily",
    priority: path === "/" ? 1 : path.startsWith("/services/") ? 0.7 : 0.8
  }));
}
