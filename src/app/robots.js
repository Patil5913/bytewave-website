export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/dashboard/",
        "/admin/",
        "/private/",
        "/login/",
        "/internal-console/",
      ],
    },
    sitemap: "https://www.bytewavetechnology.com/sitemap.xml",
  };
}
