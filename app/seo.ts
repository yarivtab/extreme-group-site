export const previewSiteUrl = "https://extreme-group-smart-tech.yarivtabac.chatgpt.site";

export function configuredSiteUrl() {
  return (process.env.SITE_URL ?? previewSiteUrl).replace(/\/$/, "");
}

export function isPublicProductionHost(host: string) {
  const hostname = host.split(":")[0].toLowerCase();
  return hostname === "extreme.co.il" || hostname === "www.extreme.co.il";
}
