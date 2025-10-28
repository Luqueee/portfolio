// ------------------------------------------------------------
// Optional helper: build OG URLs in one place
// Save as: lib/og.ts
export function ogUrl(
  base: string,
  {
    title,
    subtitle,
    brand = "#7c3aed",
    site = "luqueee.dev",
    logo = "https://luqueee.dev/favicon-32x32.png",
    mode = "dark",
    image,
  }: {
    title: string;
    subtitle?: string;
    brand?: string;
    site?: string;
    logo?: string;
    mode?: "dark" | "light";
    image?: string;
  }
) {
  const u = new URL("/api/og", base);
  u.searchParams.set("title", title);
  if (subtitle) u.searchParams.set("subtitle", subtitle);
  if (brand) u.searchParams.set("brand", brand);
  if (site) u.searchParams.set("site", site);
  if (logo) u.searchParams.set("logo", logo);
  if (mode) u.searchParams.set("mode", mode);
  if (image) u.searchParams.set("image", image);
  return u.toString();
}
