"use client";

import type { CompanyData } from "../lib/types";

// SVG Icons as components
const Icons = {
  bolt: (color: string, size = 22) => (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
  ),
  shield: (color: string, size = 22) => (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
  ),
  clock: (color: string, size = 22) => (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
  ),
  chart: (color: string, size = 22) => (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12V7H5a2 2 0 010-4h14v4"/><path d="M3 5v14a2 2 0 002 2h16v-5"/><path d="M18 12a2 2 0 000 4h4v-4h-4z"/></svg>
  ),
  ai: (color: string, size = 22) => (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a4 4 0 014 4v2H8V6a4 4 0 014-4z"/><rect x="3" y="8" width="18" height="14" rx="2"/><circle cx="12" cy="16" r="2"/></svg>
  ),
  cloud: (color: string, size = 22) => (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.5 19H9a7 7 0 110-14h8.5"/><path d="M17 21l3-3-3-3"/></svg>
  ),
  users: (color: string, size = 22) => (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
  ),
  building: (color: string, size = 22) => (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>
  ),
  trending: (color: string, size = 22) => (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
  ),
  target: (color: string, size = 22) => (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
  ),
  star: (color: string, size = 22) => (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
  ),
  check: (color: string, size = 22) => (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
  ),
  arrowRight: (color: string, size = 22) => (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
  ),
  mail: (color: string, size = 22) => (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
  ),
  phone: (color: string, size = 22) => (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.574 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
  ),
  globe: (color: string, size = 22) => (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
  ),
};

const serviceIcons = [Icons.chart, Icons.ai, Icons.cloud, Icons.users];

function isValidHex(hex: string): boolean {
  return /^#[0-9A-Fa-f]{6}$/.test(hex);
}

function hexToRgba(hex: string, alpha: number) {
  if (!isValidHex(hex)) return `rgba(37,99,235,${alpha})`;
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

function lightenColor(hex: string, amount: number) {
  if (!isValidHex(hex)) hex = "#2563EB";
  const r = Math.min(255, parseInt(hex.slice(1, 3), 16) + amount);
  const g = Math.min(255, parseInt(hex.slice(3, 5), 16) + amount);
  const b = Math.min(255, parseInt(hex.slice(5, 7), 16) + amount);
  return `rgb(${r},${g},${b})`;
}

export default function ProfileRenderer({ data }: { data: CompanyData }) {
  const p = isValidHex(data.primaryColor) ? data.primaryColor : "#2563EB";
  const s = isValidHex(data.secondaryColor) ? data.secondaryColor : "#7C3AED";
  const pLight = lightenColor(p, 200);

  const pageStyle: React.CSSProperties = {
    width: "210mm",
    minHeight: "297mm",
    margin: "20px auto",
    background: "#fff",
    position: "relative",
    overflow: "hidden",
    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05), 0 24px 48px rgba(0,0,0,0.12)",
    fontFamily: "var(--font-noto), var(--font-inter), sans-serif",
  };

  // Extract key metrics from overview for hero display on P3
  const keyMetricLabels = ["設立", "資本金", "従業員数", "売上高"];
  const keyMetrics = keyMetricLabels
    .map(label => data.overview.find(item => item.label.includes(label)))
    .filter(Boolean) as { label: string; value: string }[];

  // Dynamic cover date
  const now = new Date();
  const coverDate = `${now.getFullYear()}年${now.getMonth() + 1}月`;

  return (
    <div role="document" aria-label="会社紹介資料プレビュー">
      {/* ═══════════ PAGE 1: COVER ═══════════
          Design science: Initial Effect (primacy), F-pattern entry point,
          dark theme for authority & sophistication, social proof stats */}
      <div className="profile-page" style={{ ...pageStyle, background: "#0F172A", display: "flex", flexDirection: "column", justifyContent: "center", padding: "80px 72px" }}>
        {/* Decorative: gradient overlay */}
        <div aria-hidden="true" style={{ position: "absolute", top: 0, right: 0, width: "45%", height: "100%", background: `linear-gradient(135deg, ${p} 0%, ${s} 100%)`, opacity: 0.12, clipPath: "polygon(30% 0%, 100% 0%, 100% 100%, 0% 100%)" }} />
        <div aria-hidden="true" style={{ position: "absolute", bottom: -100, right: -100, width: 400, height: 400, borderRadius: "50%", background: p, opacity: 0.06 }} />
        {/* Subtle dot pattern for texture */}
        <div aria-hidden="true" style={{ position: "absolute", inset: 0, backgroundImage: `radial-gradient(${hexToRgba(p, 0.07)} 1px, transparent 1px)`, backgroundSize: "32px 32px" }} />

        {/* Logo */}
        <div style={{ fontFamily: "var(--font-inter)", fontSize: 18, fontWeight: 800, color: "#fff", letterSpacing: "0.08em", marginBottom: 96, position: "relative", zIndex: 1 }}>
          <span style={{ color: p, fontSize: 24 }}>{data.logoText.charAt(0)}</span>{data.logoText.slice(1)}
        </div>

        {/* Tagline (Assertion headline - Garner & Alley 2013) */}
        <h1 style={{ fontFamily: "var(--font-inter)", fontSize: 52, fontWeight: 900, color: "#fff", lineHeight: 1.15, letterSpacing: "-0.03em", marginBottom: 24, position: "relative", zIndex: 1, whiteSpace: "pre-line", overflowWrap: "break-word", wordBreak: "break-word" }}>
          {data.tagline}
        </h1>

        {/* Subtitle */}
        <p style={{ fontSize: 18, color: "rgba(255,255,255,0.6)", lineHeight: 1.7, maxWidth: 520, marginBottom: 48, position: "relative", zIndex: 1 }}>
          {data.subtitle}
        </p>

        {/* Key stats bar (Social proof - Cialdini + Von Restorff isolation) */}
        {data.stats.length >= 3 && (
          <div style={{ display: "flex", gap: 40, marginBottom: 64, position: "relative", zIndex: 1 }}>
            {data.stats.slice(0, 3).map((stat, i) => (
              <div key={i}>
                <div style={{ fontFamily: "var(--font-inter)", fontSize: 28, fontWeight: 800, color: p, lineHeight: 1 }}>
                  {stat.value}<span style={{ fontSize: 14, fontWeight: 400, opacity: 0.7 }}>{stat.unit}</span>
                </div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginTop: 4, fontWeight: 500 }}>{stat.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Footer line */}
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", position: "relative", zIndex: 1 }}>
          {data.companyName}｜会社紹介資料｜{coverDate}
        </p>
      </div>

      {/* ═══════════ PAGE 2: MVV ═══════════
          Design science: Gestalt proximity for grouping MVV,
          gradient hero block for Mission (Von Restorff),
          visual hierarchy via size/weight differentiation */}
      <div className="profile-page" style={pageStyle}>
        <div style={{ padding: "48px 52px" }}>
          <div style={{ fontFamily: "var(--font-inter)", fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" as const, color: p, marginBottom: 8 }}>Mission / Vision / Value</div>
          <h2 style={{ fontFamily: "var(--font-inter)", fontSize: 28, fontWeight: 800, lineHeight: 1.25, marginBottom: 24 }}>私たちが目指す世界</h2>

          {/* Mission hero block */}
          <div style={{ background: `linear-gradient(135deg, ${p} 0%, ${s} 100%)`, borderRadius: 16, padding: "36px 40px", color: "#fff", position: "relative", overflow: "hidden", marginBottom: 24 }}>
            <div aria-hidden="true" style={{ position: "absolute", top: -60, right: -60, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />
            <div aria-hidden="true" style={{ position: "absolute", bottom: -40, left: -40, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" as const, opacity: 0.6, marginBottom: 16 }}>Our Mission</div>
            <div style={{ fontFamily: "var(--font-inter)", fontSize: 28, fontWeight: 800, lineHeight: 1.4, whiteSpace: "pre-line", position: "relative", zIndex: 1 }}>{data.mission}</div>
          </div>

          {/* Vision block */}
          <div style={{ background: "#F8FAFC", borderRadius: 12, padding: "24px 28px", border: "1px solid #E2E8F0", marginBottom: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: hexToRgba(p, 0.1), display: "flex", alignItems: "center", justifyContent: "center" }}>
                {Icons.target(p, 18)}
              </div>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" as const, color: p }}>Vision 2030</div>
            </div>
            <div style={{ fontSize: 18, fontWeight: 700, lineHeight: 1.5, color: "#1E293B" }}>{data.vision}</div>
          </div>

          {/* Values with icons */}
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" as const, color: p, marginBottom: 16 }}>Our Values</div>
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${data.values.length}, 1fr)`, gap: 16 }}>
            {data.values.map((v, i) => (
              <div key={i} style={{ background: "#F8FAFC", borderRadius: 12, padding: "20px 16px", textAlign: "center", border: "1px solid #E2E8F0", position: "relative" }}>
                <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 40, height: 3, background: p, borderRadius: "0 0 4px 4px" }} />
                <div style={{ width: 44, height: 44, borderRadius: "50%", background: hexToRgba(p, 0.1), display: "flex", alignItems: "center", justifyContent: "center", margin: "8px auto 12px" }}>
                  {[Icons.bolt, Icons.shield, Icons.clock][i % 3](p, 20)}
                </div>
                <div style={{ fontFamily: "var(--font-inter)", fontWeight: 800, fontSize: 16, marginBottom: 6, color: "#1E293B" }}>{v.name}</div>
                <div style={{ fontSize: 11, color: "#64748B", lineHeight: 1.6 }}>{v.description}</div>
              </div>
            ))}
          </div>

          <div style={{ position: "absolute", bottom: 24, left: 52, fontSize: 10, color: "#64748B", fontWeight: 600 }}>{data.logoText}</div>
          <div style={{ position: "absolute", bottom: 24, right: 52, fontSize: 12, color: "#64748B", fontWeight: 500 }}>02</div>
        </div>
      </div>

      {/* ═══════════ PAGE 3: OVERVIEW ═══════════
          Design science: Key metrics as Von Restorff hero cards,
          table with Gestalt proximity, company identity anchor at bottom */}
      <div className="profile-page" style={pageStyle}>
        <div style={{ padding: "48px 52px" }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" as const, color: p, marginBottom: 8 }}>Company Overview</div>
          <h2 style={{ fontFamily: "var(--font-inter)", fontSize: 28, fontWeight: 800, marginBottom: 32 }}>会社概要</h2>

          {/* Key metrics hero cards */}
          {keyMetrics.length > 0 && (
            <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(keyMetrics.length, 4)}, 1fr)`, gap: 16, marginBottom: 32 }}>
              {keyMetrics.map((item, i) => {
                const metricIcons = [Icons.building, Icons.chart, Icons.users, Icons.trending];
                return (
                  <div key={i} style={{ background: i === 0 ? hexToRgba(p, 0.06) : "#F8FAFC", borderRadius: 12, padding: "20px 16px", textAlign: "center", border: `1px solid ${i === 0 ? hexToRgba(p, 0.15) : "#E2E8F0"}` }}>
                    <div style={{ width: 36, height: 36, borderRadius: 8, background: hexToRgba(p, 0.1), display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 8px" }}>
                      {metricIcons[i % 4](p, 18)}
                    </div>
                    <div style={{ fontSize: 10, color: "#64748B", fontWeight: 600, marginBottom: 4, letterSpacing: "0.05em" }}>{item.label}</div>
                    <div style={{ fontSize: 15, fontWeight: 800, color: "#1E293B", lineHeight: 1.3 }}>{item.value}</div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Full info table */}
          <div style={{ background: "#F8FAFC", borderRadius: 12, border: "1px solid #E2E8F0", overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <tbody>
                {data.overview.map((item, i) => (
                  <tr key={i} style={{ borderBottom: i < data.overview.length - 1 ? "1px solid #E2E8F0" : "none" }}>
                    <th style={{ textAlign: "left", padding: "14px 20px", fontSize: 12, fontWeight: 700, color: "#64748B", width: 120, verticalAlign: "top", background: "rgba(255,255,255,0.5)" }}>{item.label}</th>
                    <td style={{ padding: "14px 20px", fontSize: 12, lineHeight: 1.6, color: "#1E293B" }}>{item.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Company identity anchor */}
          <div style={{ marginTop: 32, display: "flex", alignItems: "center", gap: 16, padding: "20px 24px", background: `linear-gradient(135deg, ${hexToRgba(p, 0.04)} 0%, ${hexToRgba(s, 0.04)} 100%)`, borderRadius: 12, border: `1px solid ${hexToRgba(p, 0.1)}` }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: `linear-gradient(135deg, ${p} 0%, ${s} 100%)`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span style={{ color: "#fff", fontFamily: "var(--font-inter)", fontSize: 20, fontWeight: 900 }}>{data.logoText.charAt(0)}</span>
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#1E293B", marginBottom: 2 }}>{data.companyName}</div>
              <div style={{ fontSize: 11, color: "#64748B", lineHeight: 1.5 }}>{data.overview.find(o => o.label === "事業内容")?.value || data.subtitle}</div>
            </div>
          </div>

          <div style={{ position: "absolute", bottom: 24, left: 52, fontSize: 10, color: "#64748B", fontWeight: 600 }}>{data.logoText}</div>
          <div style={{ position: "absolute", bottom: 24, right: 52, fontSize: 12, color: "#64748B", fontWeight: 500 }}>03</div>
        </div>
      </div>

      {/* ═══════════ PAGE 4: SERVICES ═══════════
          Design science: Bento grid layout, numbered cards (cognitive chunking),
          accent color per service (Gestalt similarity), Von Restorff highlight badges */}
      <div className="profile-page" style={pageStyle}>
        <div style={{ padding: "48px 52px" }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" as const, color: p, marginBottom: 8 }}>Our Services</div>
          <h2 style={{ fontFamily: "var(--font-inter)", fontSize: 28, fontWeight: 800, marginBottom: 8 }}>{data.services.length}つの事業で、包括支援</h2>
          <p style={{ fontSize: 13, color: "#64748B", marginBottom: 32, lineHeight: 1.6 }}>戦略策定からシステム構築、運用まで一気通貫で支援します。</p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            {data.services.map((svc, i) => {
              const accentColors = [p, s, "#059669", "#F59E0B"];
              const accent = accentColors[i % 4];
              const icon = serviceIcons[i % 4];
              return (
                <div key={i} className="card-no-break" style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 14, padding: "28px 24px", position: "relative", overflow: "hidden" }}>
                  {/* Top accent bar */}
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${accent}, ${hexToRgba(accent, 0.3)})` }} />
                  {/* Number + Icon row */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                    <div style={{ fontFamily: "var(--font-inter)", fontSize: 32, fontWeight: 900, color: hexToRgba(accent, 0.12), lineHeight: 1 }}>
                      {String(i + 1).padStart(2, "0")}
                    </div>
                    <div style={{ width: 44, height: 44, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", background: hexToRgba(accent, 0.08) }}>
                      {icon(accent)}
                    </div>
                  </div>
                  <div style={{ fontSize: 17, fontWeight: 800, marginBottom: 8, color: "#1E293B" }}>{svc.title}</div>
                  <div style={{ fontSize: 12, color: "#64748B", lineHeight: 1.7, marginBottom: 16 }}>{svc.description}</div>
                  {/* Highlight badge */}
                  <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 12px", background: hexToRgba(accent, 0.06), borderRadius: 8, border: `1px solid ${hexToRgba(accent, 0.12)}` }}>
                    {Icons.check(accent, 14)}
                    <div style={{ fontSize: 11, fontWeight: 700, color: accent }}>{svc.highlight}</div>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ position: "absolute", bottom: 24, left: 52, fontSize: 10, color: "#64748B", fontWeight: 600 }}>{data.logoText}</div>
          <div style={{ position: "absolute", bottom: 24, right: 52, fontSize: 12, color: "#64748B", fontWeight: 500 }}>04</div>
        </div>
      </div>

      {/* ═══════════ PAGE 5: NUMBERS ═══════════
          Design science: Von Restorff (hero numbers isolated at large size),
          tiered hierarchy (primary large, secondary smaller),
          social proof via client logos (Cialdini) */}
      <div className="profile-page" style={pageStyle}>
        <div style={{ padding: "48px 52px" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" as const, color: p, marginBottom: 8 }}>Track Record</div>
            <h2 style={{ fontFamily: "var(--font-inter)", fontSize: 28, fontWeight: 800 }}>数字で見る{data.companyName.replace(/株式会社/, "")}</h2>
          </div>

          {/* Primary stats (top 3) */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, marginBottom: 40 }}>
            {data.stats.slice(0, 3).map((stat, i) => (
              <div key={i} style={{ textAlign: "center", padding: "32px 16px", background: i === 0 ? hexToRgba(p, 0.04) : "#F8FAFC", borderRadius: 16, border: `1px solid ${i === 0 ? hexToRgba(p, 0.12) : "#E2E8F0"}` }}>
                <div style={{ fontFamily: "var(--font-inter)", fontSize: stat.value.length > 5 ? 40 : stat.value.length > 3 ? 48 : 56, fontWeight: 900, color: p, lineHeight: 1, letterSpacing: "-0.03em" }}>
                  {stat.value}
                </div>
                <div style={{ fontFamily: "var(--font-inter)", fontSize: 18, fontWeight: 400, color: hexToRgba(p, 0.6), marginTop: 4 }}>{stat.unit}</div>
                <div style={{ fontSize: 12, color: "#64748B", marginTop: 8, fontWeight: 600 }}>{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Secondary stats */}
          {data.stats.length > 3 && (
            <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(data.stats.length - 3, 3)}, 1fr)`, gap: 16, marginBottom: 40 }}>
              {data.stats.slice(3).map((stat, i) => (
                <div key={i} style={{ textAlign: "center", padding: "20px 12px", borderRadius: 12, background: "#FAFAFA" }}>
                  <div style={{ fontFamily: "var(--font-inter)", fontSize: 32, fontWeight: 800, color: "#334155", lineHeight: 1 }}>
                    {stat.value}<span style={{ fontSize: 14, fontWeight: 400, color: "#64748B" }}>{stat.unit}</span>
                  </div>
                  <div style={{ fontSize: 11, color: "#64748B", marginTop: 6, fontWeight: 500 }}>{stat.label}</div>
                </div>
              ))}
            </div>
          )}

          {/* Client logos */}
          <div style={{ borderTop: "1px solid #E2E8F0", paddingTop: 32 }}>
            <div style={{ fontSize: 11, color: "#64748B", marginBottom: 20, textAlign: "center", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" as const }}>Trusted by Leading Companies</div>
            <div style={{ display: "flex", justifyContent: "center", gap: 24, flexWrap: "wrap" }}>
              {data.clientLogos.map((logo, i) => (
                <div key={i} style={{ width: 110, height: 48, background: "#F8FAFC", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#64748B", fontWeight: 700, letterSpacing: "0.05em", border: "1px solid #F1F5F9" }}>{logo}</div>
              ))}
            </div>
          </div>

          <div style={{ position: "absolute", bottom: 24, left: 52, fontSize: 10, color: "#64748B", fontWeight: 600 }}>{data.logoText}</div>
          <div style={{ position: "absolute", bottom: 24, right: 52, fontSize: 12, color: "#64748B", fontWeight: 500 }}>05</div>
        </div>
      </div>

      {/* ═══════════ PAGE 6: TEAM ═══════════
          Design science: Authority principle (Cialdini) via credentials,
          gradient ring avatars for visual distinction,
          Gestalt similarity in card layout */}
      <div className="profile-page" style={pageStyle}>
        <div style={{ padding: "48px 52px" }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" as const, color: p, marginBottom: 8 }}>Our Team</div>
          <h2 style={{ fontFamily: "var(--font-inter)", fontSize: 28, fontWeight: 800, marginBottom: 8 }}>経営チーム</h2>
          <p style={{ fontSize: 13, color: "#64748B", marginBottom: 32, lineHeight: 1.6 }}>{data.teamIntro}</p>

          <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(data.team.length, 3)}, 1fr)`, gap: 24, marginBottom: 40 }}>
            {data.team.map((member, i) => (
              <div key={i} className="card-no-break" style={{ textAlign: "center", padding: "24px 16px", background: "#F8FAFC", borderRadius: 16, border: "1px solid #E2E8F0" }}>
                {/* Avatar with gradient ring */}
                <div style={{ width: 88, height: 88, borderRadius: "50%", background: `linear-gradient(135deg, ${p} 0%, ${s} 100%)`, margin: "0 auto 16px", display: "flex", alignItems: "center", justifyContent: "center", padding: 3 }}>
                  <div style={{ width: "100%", height: "100%", borderRadius: "50%", background: "#F8FAFC", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontSize: 32, fontWeight: 800, fontFamily: "var(--font-inter)", background: `linear-gradient(135deg, ${p}, ${s})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                      {member.name.charAt(0)}
                    </span>
                  </div>
                </div>
                <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 4, color: "#1E293B" }}>{member.name}</div>
                <div style={{ fontSize: 12, color: p, fontWeight: 700, marginBottom: 12, letterSpacing: "0.02em" }}>{member.role}</div>
                <div style={{ fontSize: 11, color: "#64748B", lineHeight: 1.7 }}>{member.bio}</div>
              </div>
            ))}
          </div>

          {/* Org stats */}
          {data.orgStats.length > 0 && (
            <div style={{ background: `linear-gradient(135deg, ${hexToRgba(p, 0.04)} 0%, ${hexToRgba(s, 0.04)} 100%)`, borderRadius: 14, padding: "24px 32px", border: `1px solid ${hexToRgba(p, 0.08)}` }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" as const, color: p, marginBottom: 16, textAlign: "center" }}>Organization Data</div>
              <div style={{ display: "grid", gridTemplateColumns: `repeat(${data.orgStats.length}, 1fr)`, gap: 16 }}>
                {data.orgStats.map((stat, i) => (
                  <div key={i} style={{ textAlign: "center" }}>
                    <div style={{ fontFamily: "var(--font-inter)", fontSize: 28, fontWeight: 900, color: p, lineHeight: 1 }}>
                      {stat.value}<span style={{ fontSize: 12, fontWeight: 400, opacity: 0.6 }}>{stat.unit}</span>
                    </div>
                    <div style={{ fontSize: 10, color: "#64748B", marginTop: 6, fontWeight: 500 }}>{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ position: "absolute", bottom: 24, left: 52, fontSize: 10, color: "#64748B", fontWeight: 600 }}>{data.logoText}</div>
          <div style={{ position: "absolute", bottom: 24, right: 52, fontSize: 12, color: "#64748B", fontWeight: 500 }}>06</div>
        </div>
      </div>

      {/* ═══════════ PAGE 7: TIMELINE ═══════════
          Design science: Von Restorff for highlight events (full card),
          visual continuity via gradient line,
          Peak-End Rule: future vision at bottom */}
      <div className="profile-page" style={pageStyle}>
        <div style={{ padding: "48px 52px" }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" as const, color: p, marginBottom: 8 }}>History</div>
          <h2 style={{ fontFamily: "var(--font-inter)", fontSize: 28, fontWeight: 800, marginBottom: 8 }}>創業からの歩み</h2>
          <p style={{ fontSize: 13, color: "#64748B", marginBottom: 40, lineHeight: 1.6 }}>{data.timelineIntro}</p>

          <div style={{ position: "relative", paddingLeft: 40 }}>
            {/* Gradient timeline line */}
            <div style={{ position: "absolute", left: 11, top: 8, bottom: 8, width: 2, background: `linear-gradient(to bottom, ${hexToRgba(p, 0.3)}, ${hexToRgba(p, 0.08)})` }} />

            {data.timeline.map((event, i) => (
              <div key={i} style={{ position: "relative", paddingBottom: i < data.timeline.length - 1 ? 28 : 0, paddingLeft: 24 }}>
                {/* Dot */}
                <div style={{
                  position: "absolute", left: -33, top: event.isHighlight ? 12 : 8,
                  width: event.isHighlight ? 16 : 12, height: event.isHighlight ? 16 : 12, borderRadius: "50%",
                  background: event.isHighlight ? `linear-gradient(135deg, ${p}, ${s})` : "#fff",
                  border: event.isHighlight ? "none" : `3px solid ${p}`,
                  boxShadow: event.isHighlight ? `0 0 0 4px ${hexToRgba(p, 0.15)}, 0 2px 8px ${hexToRgba(p, 0.25)}` : "none",
                }} />

                {event.isHighlight ? (
                  <div style={{ background: hexToRgba(p, 0.04), borderRadius: 12, padding: "20px 24px", border: `1px solid ${hexToRgba(p, 0.12)}`, marginLeft: -4 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                      <div style={{ fontSize: 12, fontWeight: 800, color: p }}>{event.year}</div>
                      {Icons.star(p, 14)}
                    </div>
                    <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 6, color: "#1E293B" }}>{event.title}</div>
                    <div style={{ fontSize: 12, color: "#64748B", lineHeight: 1.6 }}>{event.description}</div>
                  </div>
                ) : (
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: p, marginBottom: 4 }}>{event.year}</div>
                    <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4, color: "#1E293B" }}>{event.title}</div>
                    <div style={{ fontSize: 12, color: "#64748B", lineHeight: 1.6 }}>{event.description}</div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Future vision anchor (Peak-End Rule) */}
          <div style={{ marginTop: 40, padding: "24px 28px", borderRadius: 12, background: `linear-gradient(135deg, ${hexToRgba(p, 0.04)} 0%, ${hexToRgba(s, 0.04)} 100%)`, border: `1px dashed ${hexToRgba(p, 0.2)}`, display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: 40, height: 40, borderRadius: "50%", background: hexToRgba(p, 0.1), display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              {Icons.target(p, 20)}
            </div>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" as const, color: p, marginBottom: 4 }}>Next Milestone</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#1E293B", lineHeight: 1.5 }}>{data.vision}</div>
            </div>
          </div>

          <div style={{ position: "absolute", bottom: 24, left: 52, fontSize: 10, color: "#64748B", fontWeight: 600 }}>{data.logoText}</div>
          <div style={{ position: "absolute", bottom: 24, right: 52, fontSize: 12, color: "#64748B", fontWeight: 500 }}>07</div>
        </div>
      </div>

      {/* ═══════════ PAGE 8: CTA ═══════════
          Design science: Primacy-Recency (mirrors P1 dark theme),
          social proof avatars (Cialdini), Peak-End memorable close,
          contact icons for visual anchoring */}
      <div className="profile-page" style={{ ...pageStyle, background: "#0F172A", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", padding: "80px 72px" }}>
        {/* Decorative elements matching P1 */}
        <div aria-hidden="true" style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 600, height: 600, borderRadius: "50%", background: `radial-gradient(circle, ${p} 0%, transparent 70%)`, opacity: 0.08 }} />
        <div aria-hidden="true" style={{ position: "absolute", inset: 0, backgroundImage: `radial-gradient(${hexToRgba(p, 0.06)} 1px, transparent 1px)`, backgroundSize: "32px 32px" }} />

        {/* Social proof avatars */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 48, position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex" }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{ width: 28, height: 28, borderRadius: "50%", background: `linear-gradient(135deg, ${p}, ${s})`, border: "2px solid #0F172A", marginLeft: i > 0 ? -8 : 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: 10, color: "#fff", fontWeight: 700 }}>{data.team[i]?.name.charAt(0) || "+"}</span>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", fontWeight: 500 }}>
            {data.stats[0] ? `${data.stats[0].value}${data.stats[0].unit}の${data.stats[0].label}` : "多くの企業が選んでいます"}
          </div>
        </div>

        <h2 style={{ fontFamily: "var(--font-inter)", fontSize: 40, fontWeight: 900, color: "#fff", lineHeight: 1.3, letterSpacing: "-0.02em", marginBottom: 24, position: "relative", zIndex: 1, whiteSpace: "pre-line" }}>
          {data.ctaHeading}
        </h2>
        <p style={{ fontSize: 16, color: "rgba(255,255,255,0.5)", maxWidth: 480, lineHeight: 1.8, marginBottom: 48, position: "relative", zIndex: 1 }}>
          {data.ctaSubtext}
        </p>

        {/* CTA Button with gradient */}
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: `linear-gradient(135deg, ${p} 0%, ${s} 100%)`, color: "#fff", fontFamily: "var(--font-inter)", fontSize: 14, fontWeight: 700, padding: "16px 40px", borderRadius: 9999, position: "relative", zIndex: 1, letterSpacing: "0.02em", cursor: "pointer" }}>
          {data.ctaButtonText}
          <span style={{ marginLeft: 4, display: "inline-flex" }}>{Icons.arrowRight("#fff", 16)}</span>
        </div>

        {/* Contact info with icons */}
        <div style={{ display: "flex", gap: 40, marginTop: 56, position: "relative", zIndex: 1 }}>
          {[
            { icon: Icons.mail, label: "Email", value: data.contactEmail },
            { icon: Icons.phone, label: "Phone", value: data.contactPhone },
            { icon: Icons.globe, label: "Web", value: data.contactWeb },
          ].map((c, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>
                {c.icon("rgba(255,255,255,0.3)", 16)}
              </div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" as const, marginBottom: 4 }}>{c.label}</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", fontWeight: 500 }}>{c.value}</div>
            </div>
          ))}
        </div>

        <div style={{ position: "absolute", bottom: 40, fontSize: 12, color: "rgba(255,255,255,0.15)", fontWeight: 700, letterSpacing: "0.08em" }}>{data.logoText} Inc.</div>
      </div>
    </div>
  );
}
