import type { MetadataRoute } from "next";

const siteUrl = "https://myles-scott-portfolio.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: siteUrl, lastModified: new Date() },
    { url: `${siteUrl}/#work`, lastModified: new Date() },
    { url: `${siteUrl}/#about`, lastModified: new Date() },
    { url: `${siteUrl}/#contact`, lastModified: new Date() },
    { url: `${siteUrl}/work/cash-flow-simulator`, lastModified: new Date() },
    { url: `${siteUrl}/work/fade-society`, lastModified: new Date() },
    { url: `${siteUrl}/work/sneaker-signal`, lastModified: new Date() },
  ];
}
