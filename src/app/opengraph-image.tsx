import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site";

export const alt = `${siteConfig.name} — Full-Stack Web, Mobile & 3D Product Builder`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#04060E",
          padding: "64px",
          position: "relative",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -180,
            right: -140,
            width: 620,
            height: 620,
            borderRadius: 999,
            background:
              "radial-gradient(circle, rgba(99,102,241,0.55), rgba(168,85,247,0.25) 45%, transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -220,
            left: -120,
            width: 560,
            height: 560,
            borderRadius: 999,
            background:
              "radial-gradient(circle, rgba(56,189,248,0.42), transparent 70%)",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 68,
              height: 68,
              borderRadius: 18,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(120deg,#6366F1,#A855F7 52%,#38BDF8)",
              color: "#04060E",
              fontSize: 30,
              fontWeight: 800,
            }}
          >
            MI
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ color: "#EAEEFB", fontSize: 34, fontWeight: 700 }}>
              {siteConfig.name}
            </div>
            <div
              style={{
                color: "#74809F",
                fontSize: 19,
                letterSpacing: 3,
                textTransform: "uppercase",
              }}
            >
              Product Engineer · Abbottabad, PK
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <div
            style={{
              color: "#EAEEFB",
              fontSize: 74,
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: -2,
              maxWidth: 940,
            }}
          >
            Full-Stack Web, Mobile & 3D Product Builder.
          </div>
          <div style={{ color: "#AAB5D0", fontSize: 27, maxWidth: 880 }}>
            Next.js 16 · React 19 · Supabase · React Native &amp; Expo · Tailwind
            v4 · Blender 5.2
          </div>
        </div>

        <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
          {[
            "8 GitHub Repos",
            "5 Live Vercel Sites",
            "6 Supabase Clouds",
            "3 Mobile Apps",
            "408 Learning Drills",
            "96 Automated Tests",
          ].map((chip) => (
            <div
              key={chip}
              style={{
                display: "flex",
                padding: "10px 20px",
                borderRadius: 999,
                border: "1px solid rgba(255,255,255,0.14)",
                background: "rgba(255,255,255,0.05)",
                color: "#AAB5D0",
                fontSize: 20,
              }}
            >
              {chip}
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
