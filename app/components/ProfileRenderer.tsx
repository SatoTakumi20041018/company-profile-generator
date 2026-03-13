"use client";

import type { CompanyData } from "../lib/types";

// SVG Icons as components
const Icons = {
  bolt: (color: string) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
  ),
  shield: (color: string) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
  ),
  clock: (color: string) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
  ),
  chart: (color: string) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12V7H5a2 2 0 010-4h14v4"/><path d="M3 5v14a2 2 0 002 2h16v-5"/><path d="M18 12a2 2 0 000 4h4v-4h-4z"/></svg>
  ),
  ai: (color: string) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a4 4 0 014 4v2H8V6a4 4 0 014-4z"/><rect x="3" y="8" width="18" height="14" rx="2"/><circle cx="12" cy="16" r="2"/></svg>
  ),
  cloud: (color: string) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.5 19H9a7 7 0 110-14h8.5"/><path d="M17 21l3-3-3-3"/></svg>
  ),
  users: (color: string) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
  ),
};

const serviceIcons = [Icons.chart, Icons.ai, Icons.cloud, Icons.users];
const serviceAccents = ["", "#7C3AED", "#059669", "#F59E0B"];

function hexToRgba(hex: string, alpha: number) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

function lightenColor(hex: string, amount: number) {
  const r = Math.min(255, parseInt(hex.slice(1, 3), 16) + amount);
  const g = Math.min(255, parseInt(hex.slice(3, 5), 16) + amount);
  const b = Math.min(255, parseInt(hex.slice(5, 7), 16) + amount);
  return `rgb(${r},${g},${b})`;
}

export default function ProfileRenderer({ data }: { data: CompanyData }) {
  const p = data.primaryColor;
  const pLight = lightenColor(p, 200);

  const pageStyle: React.CSSProperties = {
    width: "210mm",
    minHeight: "297mm",
    margin: "20px auto",
    background: "#fff",
    position: "relative",
    overflow: "hidden",
    boxShadow: "0 24px 48px rgba(0,0,0,0.12)",
    fontFamily: "var(--font-noto), var(--font-inter), sans-serif",
  };

  return (
    <div>
      {/* PAGE 1: COVER */}
      <div className="profile-page" style={{ ...pageStyle, background: "#0F172A", display: "flex", flexDirection: "column", justifyContent: "center", padding: "80px 72px" }}>
        <div style={{ position: "absolute", top: 0, right: 0, width: "45%", height: "100%", background: `linear-gradient(135deg, ${p} 0%, ${data.secondaryColor} 100%)`, opacity: 0.12, clipPath: "polygon(30% 0%, 100% 0%, 100% 100%, 0% 100%)" }} />
        <div style={{ position: "absolute", bottom: -100, right: -100, width: 400, height: 400, borderRadius: "50%", background: p, opacity: 0.06 }} />
        <div style={{ fontFamily: "var(--font-inter)", fontSize: 18, fontWeight: 800, color: "#fff", letterSpacing: "0.08em", marginBottom: 96, position: "relative", zIndex: 1 }}>
          <span style={{ color: p, fontSize: 24 }}>{data.logoText.charAt(0)}</span>{data.logoText.slice(1)}
        </div>
        <h1 style={{ fontFamily: "var(--font-inter)", fontSize: 52, fontWeight: 900, color: "#fff", lineHeight: 1.15, letterSpacing: "-0.03em", marginBottom: 24, position: "relative", zIndex: 1, whiteSpace: "pre-line" }}>
          {data.tagline}
        </h1>
        <p style={{ fontSize: 18, color: "rgba(255,255,255,0.6)", lineHeight: 1.6, maxWidth: 480, marginBottom: 64, position: "relative", zIndex: 1 }}>
          {data.subtitle}
        </p>
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", position: "relative", zIndex: 1 }}>
          {data.companyName}｜会社紹介資料｜2026年3月
        </p>
      </div>

      {/* PAGE 2: MVV */}
      <div className="profile-page" style={pageStyle}>
        <div style={{ padding: "48px 52px" }}>
          <div style={{ fontFamily: "var(--font-inter)", fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" as const, color: p, marginBottom: 8 }}>Mission / Vision / Value</div>
          <h2 style={{ fontFamily: "var(--font-inter)", fontSize: 32, fontWeight: 700, lineHeight: 1.25, marginBottom: 16 }}>私たちが目指す世界</h2>

          {/* Mission block */}
          <div style={{ background: `linear-gradient(135deg, ${p} 0%, ${hexToRgba(p, 0.85)} 100%)`, borderRadius: 16, padding: "40px 44px", color: "#fff", position: "relative", overflow: "hidden", marginBottom: 24 }}>
            <div style={{ position: "absolute", top: -60, right: -60, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" as const, opacity: 0.6, marginBottom: 16 }}>Mission</div>
            <div style={{ fontFamily: "var(--font-inter)", fontSize: 32, fontWeight: 800, lineHeight: 1.35, whiteSpace: "pre-line", position: "relative", zIndex: 1 }}>{data.mission}</div>
          </div>

          {/* Vision & Values */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 24 }}>
            <div style={{ background: "#F8FAFC", borderRadius: 10, padding: "28px 32px", border: "1px solid #E2E8F0" }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" as const, color: p, marginBottom: 8 }}>Vision</div>
              <div style={{ fontSize: 18, fontWeight: 600, lineHeight: 1.5, marginBottom: 8 }}>{data.vision}</div>
            </div>
            <div style={{ background: "#F8FAFC", borderRadius: 10, padding: "28px 32px", border: "1px solid #E2E8F0" }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" as const, color: p, marginBottom: 8 }}>Values</div>
              <div style={{ fontSize: 18, fontWeight: 600, lineHeight: 1.5, marginBottom: 8 }}>
                {data.values.map((v) => v.name).join(" / ")}
              </div>
            </div>
          </div>

          {/* Values detail */}
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${data.values.length}, 1fr)`, gap: 16 }}>
            {data.values.map((v, i) => (
              <div key={i} style={{ textAlign: "center", padding: "20px 16px" }}>
                <div style={{ width: 48, height: 48, borderRadius: "50%", background: pLight, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 8px" }}>
                  {[Icons.bolt, Icons.shield, Icons.clock][i % 3](p)}
                </div>
                <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{v.name}</div>
                <div style={{ fontSize: 10, color: "#64748B", lineHeight: 1.5 }}>{v.description}</div>
              </div>
            ))}
          </div>

          <div style={{ position: "absolute", bottom: 24, left: 52, fontSize: 10, color: "#94A3B8", fontWeight: 600 }}>{data.logoText}</div>
          <div style={{ position: "absolute", bottom: 24, right: 52, fontSize: 12, color: "#94A3B8", fontWeight: 500 }}>02</div>
        </div>
      </div>

      {/* PAGE 3: OVERVIEW */}
      <div className="profile-page" style={pageStyle}>
        <div style={{ padding: "48px 52px" }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" as const, color: p, marginBottom: 8 }}>Company Overview</div>
          <h2 style={{ fontFamily: "var(--font-inter)", fontSize: 32, fontWeight: 700, marginBottom: 8 }}>会社概要</h2>
          <p style={{ fontSize: 14, color: "#64748B", marginBottom: 32 }}>
            {data.overview[2]?.value || ""}年の創業以来、急成長を続けるリーディングカンパニー。
          </p>

          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <tbody>
              {data.overview.map((item, i) => (
                <tr key={i} style={{ borderBottom: i < data.overview.length - 1 ? "1px solid #E2E8F0" : "none" }}>
                  <th style={{ textAlign: "left", padding: "12px 0", fontSize: 12, fontWeight: 600, color: "#64748B", width: 110, verticalAlign: "top" }}>{item.label}</th>
                  <td style={{ padding: "12px 0 12px 8px", fontSize: 12, lineHeight: 1.5 }}>{item.value}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ position: "absolute", bottom: 24, left: 52, fontSize: 10, color: "#94A3B8", fontWeight: 600 }}>{data.logoText}</div>
          <div style={{ position: "absolute", bottom: 24, right: 52, fontSize: 12, color: "#94A3B8", fontWeight: 500 }}>03</div>
        </div>
      </div>

      {/* PAGE 4: SERVICES */}
      <div className="profile-page" style={pageStyle}>
        <div style={{ padding: "48px 52px" }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" as const, color: p, marginBottom: 8 }}>Our Services</div>
          <h2 style={{ fontFamily: "var(--font-inter)", fontSize: 32, fontWeight: 700, marginBottom: 8 }}>{data.services.length}つの事業で、包括支援</h2>
          <p style={{ fontSize: 14, color: "#64748B", marginBottom: 32 }}>戦略策定からシステム構築、運用まで一気通貫で支援します。</p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            {data.services.map((svc, i) => {
              const accent = serviceAccents[i % 4] || p;
              const icon = serviceIcons[i % 4];
              return (
                <div key={i} style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 16, padding: 32, position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: accent || p, borderRadius: "16px 16px 0 0" }} />
                  <div style={{ width: 48, height: 48, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16, background: hexToRgba(accent || p, 0.1) }}>
                    {icon(accent || p)}
                  </div>
                  <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{svc.title}</div>
                  <div style={{ fontSize: 12, color: "#64748B", lineHeight: 1.65, marginBottom: 12 }}>{svc.description}</div>
                  <div style={{ fontSize: 12, fontWeight: 700 }}>{svc.highlight}</div>
                </div>
              );
            })}
          </div>

          <div style={{ position: "absolute", bottom: 24, left: 52, fontSize: 10, color: "#94A3B8", fontWeight: 600 }}>{data.logoText}</div>
          <div style={{ position: "absolute", bottom: 24, right: 52, fontSize: 12, color: "#94A3B8", fontWeight: 500 }}>04</div>
        </div>
      </div>

      {/* PAGE 5: NUMBERS */}
      <div className="profile-page" style={pageStyle}>
        <div style={{ padding: "48px 52px", textAlign: "center" }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" as const, color: p, marginBottom: 8 }}>Track Record</div>
          <h2 style={{ fontFamily: "var(--font-inter)", fontSize: 32, fontWeight: 700, marginBottom: 48 }}>数字で見る{data.companyName.replace(/株式会社/, "")}</h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 32, marginBottom: 48 }}>
            {data.stats.map((stat, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "var(--font-inter)", fontSize: 72, fontWeight: 900, color: p, lineHeight: 1, letterSpacing: "-0.03em" }}>
                  {stat.value}<span style={{ fontSize: 24, fontWeight: 400, opacity: 0.7 }}>{stat.unit}</span>
                </div>
                <div style={{ fontSize: 12, color: "#64748B", marginTop: 8, fontWeight: 500 }}>{stat.label}</div>
              </div>
            ))}
          </div>

          <div style={{ fontSize: 12, color: "#94A3B8", marginBottom: 16 }}>主要クライアント</div>
          <div style={{ borderTop: "1px solid #E2E8F0", paddingTop: 32, display: "flex", justifyContent: "center", gap: 48, flexWrap: "wrap" }}>
            {data.clientLogos.map((logo, i) => (
              <div key={i} style={{ width: 100, height: 40, background: "#F8FAFC", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "#94A3B8", fontWeight: 600 }}>{logo}</div>
            ))}
          </div>

          <div style={{ position: "absolute", bottom: 24, left: 52, fontSize: 10, color: "#94A3B8", fontWeight: 600 }}>{data.logoText}</div>
          <div style={{ position: "absolute", bottom: 24, right: 52, fontSize: 12, color: "#94A3B8", fontWeight: 500 }}>05</div>
        </div>
      </div>

      {/* PAGE 6: TEAM */}
      <div className="profile-page" style={pageStyle}>
        <div style={{ padding: "48px 52px" }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" as const, color: p, marginBottom: 8 }}>Our Team</div>
          <h2 style={{ fontFamily: "var(--font-inter)", fontSize: 32, fontWeight: 700, marginBottom: 8 }}>経営チーム</h2>
          <p style={{ fontSize: 14, color: "#64748B", marginBottom: 32 }}>{data.teamIntro}</p>

          <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(data.team.length, 3)}, 1fr)`, gap: 24, marginBottom: 32 }}>
            {data.team.map((member, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <div style={{ width: 96, height: 96, borderRadius: "50%", background: `linear-gradient(135deg, ${pLight} 0%, ${hexToRgba(p, 0.2)} 100%)`, margin: "0 auto 16px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, color: p, fontWeight: 700, fontFamily: "var(--font-inter)" }}>
                  {member.name.charAt(0)}
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{member.name}</div>
                <div style={{ fontSize: 12, color: p, fontWeight: 600, marginBottom: 8 }}>{member.role}</div>
                <div style={{ fontSize: 10, color: "#64748B", lineHeight: 1.6 }}>{member.bio}</div>
              </div>
            ))}
          </div>

          {data.orgStats.length > 0 && (
            <div style={{ display: "grid", gridTemplateColumns: `repeat(${data.orgStats.length}, 1fr)`, gap: 16, paddingTop: 24, borderTop: "1px solid #E2E8F0" }}>
              {data.orgStats.map((stat, i) => (
                <div key={i} style={{ textAlign: "center" }}>
                  <div style={{ fontFamily: "var(--font-inter)", fontSize: 24, fontWeight: 800, color: p }}>
                    {stat.value}<span style={{ fontSize: 12, fontWeight: 400, opacity: 0.7 }}>{stat.unit}</span>
                  </div>
                  <div style={{ fontSize: 10, color: "#64748B", marginTop: 4 }}>{stat.label}</div>
                </div>
              ))}
            </div>
          )}

          <div style={{ position: "absolute", bottom: 24, left: 52, fontSize: 10, color: "#94A3B8", fontWeight: 600 }}>{data.logoText}</div>
          <div style={{ position: "absolute", bottom: 24, right: 52, fontSize: 12, color: "#94A3B8", fontWeight: 500 }}>06</div>
        </div>
      </div>

      {/* PAGE 7: TIMELINE */}
      <div className="profile-page" style={pageStyle}>
        <div style={{ padding: "48px 52px" }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" as const, color: p, marginBottom: 8 }}>History</div>
          <h2 style={{ fontFamily: "var(--font-inter)", fontSize: 32, fontWeight: 700, marginBottom: 8 }}>創業からの歩み</h2>
          <p style={{ fontSize: 14, color: "#64748B", marginBottom: 32 }}>{data.timelineIntro}</p>

          <div style={{ position: "relative", paddingLeft: 32 }}>
            <div style={{ position: "absolute", left: 7, top: 4, bottom: 4, width: 2, background: hexToRgba(p, 0.2) }} />
            {data.timeline.map((event, i) => (
              <div key={i} style={{ position: "relative", paddingBottom: i < data.timeline.length - 1 ? 24 : 0, paddingLeft: 24 }}>
                <div style={{
                  position: "absolute", left: -29, top: 6, width: 12, height: 12, borderRadius: "50%",
                  background: event.isHighlight ? p : "#fff",
                  border: `3px solid ${p}`,
                  boxShadow: event.isHighlight ? `0 0 0 4px ${pLight}` : "none",
                }} />
                <div style={{ fontSize: 12, fontWeight: 700, color: p, marginBottom: 4 }}>{event.year}</div>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{event.title}</div>
                <div style={{ fontSize: 12, color: "#64748B", lineHeight: 1.5 }}>{event.description}</div>
              </div>
            ))}
          </div>

          <div style={{ position: "absolute", bottom: 24, left: 52, fontSize: 10, color: "#94A3B8", fontWeight: 600 }}>{data.logoText}</div>
          <div style={{ position: "absolute", bottom: 24, right: 52, fontSize: 12, color: "#94A3B8", fontWeight: 500 }}>07</div>
        </div>
      </div>

      {/* PAGE 8: CTA */}
      <div className="profile-page" style={{ ...pageStyle, background: "#0F172A", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", padding: "80px 72px" }}>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 600, height: 600, borderRadius: "50%", background: `radial-gradient(circle, ${p} 0%, transparent 70%)`, opacity: 0.08 }} />
        <h2 style={{ fontFamily: "var(--font-inter)", fontSize: 42, fontWeight: 900, color: "#fff", lineHeight: 1.25, letterSpacing: "-0.02em", marginBottom: 24, position: "relative", zIndex: 1, whiteSpace: "pre-line" }}>
          {data.ctaHeading}
        </h2>
        <p style={{ fontSize: 18, color: "rgba(255,255,255,0.5)", maxWidth: 500, lineHeight: 1.7, marginBottom: 64, position: "relative", zIndex: 1 }}>
          {data.ctaSubtext}
        </p>
        <a style={{ display: "inline-flex", alignItems: "center", gap: 8, background: p, color: "#fff", fontFamily: "var(--font-inter)", fontSize: 14, fontWeight: 700, padding: "16px 40px", borderRadius: 9999, textDecoration: "none", position: "relative", zIndex: 1, letterSpacing: "0.02em" }}>
          {data.ctaButtonText} →
        </a>
        <div style={{ display: "flex", gap: 48, marginTop: 64, position: "relative", zIndex: 1 }}>
          {[
            { label: "Email", value: data.contactEmail },
            { label: "Phone", value: data.contactPhone },
            { label: "Web", value: data.contactWeb },
          ].map((c, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" as const, marginBottom: 4 }}>{c.label}</div>
              <div style={{ fontSize: 14, color: "rgba(255,255,255,0.7)", fontWeight: 500 }}>{c.value}</div>
            </div>
          ))}
        </div>
        <div style={{ position: "absolute", bottom: 48, fontSize: 12, color: "rgba(255,255,255,0.2)", fontWeight: 700, letterSpacing: "0.08em" }}>{data.logoText} Inc.</div>
      </div>
    </div>
  );
}
