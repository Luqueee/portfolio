// app/api/og/route.ts
// Dynamic OG image generator for App Router using @vercel/og
// Place an "Inter-Bold.ttf" (or similar) file next to this file, or update the font import path below.
import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const title = searchParams.get("title") ?? "Luqueee Portfolio";
  const subtitle = searchParams.get("subtitle") ?? "Front‑End Developer";
  const site = searchParams.get("site") ?? "luqueee.dev";
  const logo =
    searchParams.get("logo") ?? "https://luqueee.dev/favicon-32x32.png"; // change if needed
  const brand = searchParams.get("brand") ?? "#7c3aed"; // accent color
  const mode = (searchParams.get("mode") ?? "dark").toLowerCase(); // "dark" | "light"
  const image = searchParams.get("image"); // optional hero/background image URL

  const bg = mode === "light" ? "#ffffff" : "#0B0B0B";
  const fg = mode === "light" ? "#0B0B0B" : "#ffffff";

  const fontData = await fetch(`${process.env.SITE_URL}/inter-bold.ttf`).then(
    (r) => r.arrayBuffer()
  );

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          position: "relative",
          background: bg,
          overflow: "hidden",
          padding: 64,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Background decoration */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: image
              ? `linear-gradient(0deg, ${bg}AA, ${bg}AA), url(${image}) center/cover no-repeat`
              : `radial-gradient(800px 800px at 0% 0%, ${brand}22, transparent 40%),\n                   radial-gradient(800px 800px at 100% 100%, ${brand}22, transparent 40%)`,
            filter: image ? "none" : "saturate(110%)",
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            maxWidth: 1000,
            zIndex: 1,
          }}
        >
          <div
            style={{
              fontFamily: "Inter",
              fontWeight: 800,
              fontSize: 78,
              lineHeight: 1.05,
              letterSpacing: -1.2,
              color: fg,
            }}
          >
            {title}
          </div>

          {subtitle && (
            <div style={{ marginTop: 18, fontSize: 34, color: `${fg}CC` }}>
              {subtitle}
            </div>
          )}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "Inter",
          data: fontData,
          weight: 800,
          style: "normal",
        },
      ],
    }
  );
}
