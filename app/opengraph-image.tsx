import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/constants/site";
import { ImageResponse } from "@vercel/og";

export const alt = `${SITE_NAME} — Fullstack Developer`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** OG card via @vercel/og — dark brand surface for recruiters / social shares. */
export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0d0e10",
          color: "#f4f4f5",
          padding: "72px 80px",
          fontFamily:
            'ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif',
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 28,
            fontWeight: 500,
            letterSpacing: "-0.02em",
            color: "rgba(244,244,245,0.55)",
          }}
        >
          jason-leroy.com
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              display: "flex",
              fontSize: 88,
              fontWeight: 700,
              letterSpacing: "-0.04em",
              lineHeight: 1.05,
            }}
          >
            {SITE_NAME}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 36,
              fontWeight: 500,
              letterSpacing: "-0.02em",
              color: "rgba(244,244,245,0.72)",
              maxWidth: 920,
            }}
          >
            {SITE_DESCRIPTION}
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
