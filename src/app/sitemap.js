export default function sitemap() {
  const baseUrl = "https://www.bytewavetechnology.com";

  const mainRoutes = [
    "",
    "/about",
    "/blog",
    "/careers",
    "/contact",
    "/services",
    "/training",
  ];

  const legalRoutes = [
    "/cookies-policy",
    "/privacy-policy",
    "/refund",
    "/terms",
  ];

  const allRoutes = [...mainRoutes, ...legalRoutes];

  return allRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.8,
  }));
}
