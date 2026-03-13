"use client";

import type { CompanyData } from "../lib/types";

function isValidHex(hex: string): boolean {
  return /^#[0-9A-Fa-f]{6}$/.test(hex);
}

export default function ProfileRenderer({ data }: { data: CompanyData }) {
  const accent = isValidHex(data.primaryColor) ? data.primaryColor : "#1a1a1a";
  const hasProducts = data.products && data.products.length > 0;
  const pOff = hasProducts ? 1 : 0; // page offset for dynamic numbering

  const page: React.CSSProperties = {
    width: "210mm",
    minHeight: "297mm",
    margin: "20px auto",
    background: "#fff",
    position: "relative",
    overflow: "hidden",
    boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.03)",
    fontFamily: "var(--font-noto), sans-serif",
    color: "#1a1a1a",
    letterSpacing: "0.04em",
  };

  const now = new Date();
  const coverDate = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, "0")}`;

  const pageFooter = (num: number) => (
    <div style={{ position: "absolute", bottom: 32, left: 64, right: 64, display: "flex", justifyContent: "space-between" }}>
      <span style={{ fontSize: 9, color: "#ccc", fontWeight: 500, letterSpacing: "0.08em" }}>{data.logoText}</span>
      <span style={{ fontSize: 9, color: "#ccc", fontWeight: 500 }}>{String(num).padStart(2, "0")}</span>
    </div>
  );

  return (
    <div role="document" aria-label="会社紹介資料">

      {/* ── P1: COVER ── */}
      <div className="profile-page" style={{ ...page, display: "flex", flexDirection: "column", padding: "64px" }}>
        <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.08em" }}>
          {data.logoText}
        </div>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ width: 28, height: 2, background: accent, marginBottom: 32 }} />
          <div style={{ fontSize: 11, color: "#999", fontWeight: 500, marginBottom: 16 }}>
            {data.companyName}
          </div>
          <h1 style={{
            fontSize: 34, fontWeight: 700, lineHeight: 1.6,
            letterSpacing: "0.06em", marginBottom: 20,
            whiteSpace: "pre-line", maxWidth: 520,
          }}>
            {data.tagline}
          </h1>
          <p style={{ fontSize: 13, color: "#888", lineHeight: 2.0, maxWidth: 420 }}>
            {data.subtitle}
          </p>
        </div>

        <div style={{ fontSize: 10, color: "#ccc" }}>
          会社紹介資料　　{coverDate}
        </div>
      </div>

      {/* ── P2: MISSION / VISION / VALUES ── */}
      <div className="profile-page" style={{ ...page, padding: "64px" }}>
        <div style={{ marginBottom: 56 }}>
          <div style={{ fontSize: 10, color: "#aaa", fontWeight: 500, marginBottom: 6 }}>理念体系</div>
          <h2 style={{ fontSize: 20, fontWeight: 700 }}>Mission / Vision / Values</h2>
        </div>

        <div style={{ borderLeft: `3px solid ${accent}`, paddingLeft: 28, marginBottom: 56 }}>
          <div style={{ fontSize: 10, color: accent, fontWeight: 600, marginBottom: 16 }}>Mission</div>
          <div style={{ fontSize: 22, fontWeight: 700, lineHeight: 1.8, whiteSpace: "pre-line" }}>
            {data.mission}
          </div>
        </div>

        <div style={{ paddingLeft: 31, marginBottom: 56 }}>
          <div style={{ fontSize: 10, color: "#aaa", fontWeight: 600, marginBottom: 12 }}>Vision</div>
          <div style={{ fontSize: 15, fontWeight: 500, lineHeight: 1.9, color: "#333" }}>
            {data.vision}
          </div>
        </div>

        <div style={{ paddingLeft: 31 }}>
          <div style={{ fontSize: 10, color: "#aaa", fontWeight: 600, marginBottom: 24 }}>Values</div>
          {data.values.map((v, i) => (
            <div key={i} style={{ display: "flex", gap: 20, alignItems: "baseline", marginBottom: i < data.values.length - 1 ? 24 : 0 }}>
              <span style={{ fontFamily: "var(--font-inter)", fontSize: 24, fontWeight: 300, color: "#e0e0e0", lineHeight: 1, minWidth: 36 }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{v.name}</div>
                <div style={{ fontSize: 12, color: "#777", lineHeight: 1.8 }}>{v.description}</div>
              </div>
            </div>
          ))}
        </div>

        {pageFooter(2)}
      </div>

      {/* ── P3: COMPANY OVERVIEW ── */}
      <div className="profile-page" style={{ ...page, padding: "64px" }}>
        <div style={{ marginBottom: 40 }}>
          <div style={{ fontSize: 10, color: "#aaa", fontWeight: 500, marginBottom: 6 }}>会社概要</div>
          <h2 style={{ fontSize: 20, fontWeight: 700 }}>Company Overview</h2>
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <tbody>
            {data.overview.map((item, i) => (
              <tr key={i}>
                <th style={{
                  textAlign: "left", padding: "16px 24px 16px 0",
                  fontSize: 12, fontWeight: 600, color: "#999",
                  width: 120, verticalAlign: "top",
                  borderBottom: "1px solid #f0f0f0",
                }}>{item.label}</th>
                <td style={{
                  padding: "16px 0", fontSize: 13, lineHeight: 1.8,
                  color: "#333", borderBottom: "1px solid #f0f0f0",
                }}>{item.value}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {pageFooter(3)}
      </div>

      {/* ── P4: SERVICES ── */}
      <div className="profile-page" style={{ ...page, padding: "64px" }}>
        <div style={{ marginBottom: 40 }}>
          <div style={{ fontSize: 10, color: "#aaa", fontWeight: 500, marginBottom: 6 }}>事業内容</div>
          <h2 style={{ fontSize: 20, fontWeight: 700 }}>Services</h2>
        </div>

        {data.services.map((svc, i) => (
          <div key={i} style={{
            display: "flex", gap: 16,
            paddingBottom: i < data.services.length - 1 ? 28 : 0,
            marginBottom: i < data.services.length - 1 ? 28 : 0,
            borderBottom: i < data.services.length - 1 ? "1px solid #f0f0f0" : "none",
          }}>
            <span style={{
              fontFamily: "var(--font-inter)", fontSize: 18, fontWeight: 300,
              color: "#ddd", lineHeight: 1.4, minWidth: 28,
            }}>
              {String(i + 1).padStart(2, "0")}
            </span>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{svc.title}</h3>
              <div style={{ fontSize: 12, color: "#666", lineHeight: 1.9, marginBottom: 8 }}>
                {svc.description}
              </div>
              <span style={{ fontSize: 11, color: accent, fontWeight: 600 }}>{svc.highlight}</span>
            </div>
          </div>
        ))}

        {pageFooter(4)}
      </div>

      {/* ── P4.5: PRODUCTS ── */}
      {data.products && data.products.length > 0 && (
        <div className="profile-page" style={{ ...page, padding: "64px" }}>
          <div style={{ marginBottom: 40 }}>
            <div style={{ fontSize: 10, color: "#aaa", fontWeight: 500, marginBottom: 6 }}>商品・サービス</div>
            <h2 style={{ fontSize: 20, fontWeight: 700 }}>Products</h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: data.products.length === 1 ? "1fr" : "1fr 1fr", gap: 24 }}>
            {data.products.map((product, i) => (
              <div key={i} style={{
                border: "1px solid #f0f0f0", borderRadius: 4, padding: 24,
                display: "flex", flexDirection: "column", gap: 12,
              }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.4 }}>{product.name}</h3>
                <div style={{ fontSize: 12, color: "#666", lineHeight: 1.9 }}>{product.description}</div>
                {product.price && (
                  <div style={{ fontSize: 13, fontWeight: 700, color: accent }}>{product.price}</div>
                )}
                {product.features && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {product.features.split("/").map((f, j) => (
                      <span key={j} style={{
                        fontSize: 10, color: "#666", background: "#f8f8f8",
                        padding: "3px 8px", borderRadius: 2, fontWeight: 500,
                      }}>{f.trim()}</span>
                    ))}
                  </div>
                )}
                {product.targetAudience && (
                  <div style={{ fontSize: 11, color: "#999", marginTop: 4 }}>
                    <span style={{ fontWeight: 600 }}>対象:</span> {product.targetAudience}
                  </div>
                )}
              </div>
            ))}
          </div>

          {pageFooter(5)}
        </div>
      )}

      {/* ── P5: NUMBERS ── */}
      <div className="profile-page" style={{ ...page, padding: "64px" }}>
        <div style={{ marginBottom: 48 }}>
          <div style={{ fontSize: 10, color: "#aaa", fontWeight: 500, marginBottom: 6 }}>実績</div>
          <h2 style={{ fontSize: 20, fontWeight: 700 }}>
            数字で見る{data.companyName?.replace(/株式会社|合同会社|有限会社/, "") || "当社"}
          </h2>
        </div>

        {data.stats.length > 0 && (
          <div style={{
            display: "grid",
            gridTemplateColumns: `repeat(${Math.min(data.stats.length, 3)}, 1fr)`,
            gap: 40, marginBottom: 48,
          }}>
            {data.stats.slice(0, 3).map((stat, i) => (
              <div key={i}>
                <div style={{
                  fontFamily: "var(--font-inter)",
                  fontSize: stat.value.length > 5 ? 36 : stat.value.length > 3 ? 44 : 52,
                  fontWeight: 700, color: accent, lineHeight: 1, letterSpacing: "-0.02em",
                }}>
                  {stat.value}
                  <span style={{ fontSize: 14, fontWeight: 400, color: "#999", marginLeft: 2 }}>{stat.unit}</span>
                </div>
                <div style={{ fontSize: 11, color: "#999", marginTop: 8, fontWeight: 500 }}>{stat.label}</div>
              </div>
            ))}
          </div>
        )}

        {data.stats.length > 3 && (
          <div style={{
            display: "grid",
            gridTemplateColumns: `repeat(${Math.min(data.stats.length - 3, 3)}, 1fr)`,
            gap: 32, marginBottom: 48,
          }}>
            {data.stats.slice(3).map((stat, i) => (
              <div key={i}>
                <div style={{
                  fontFamily: "var(--font-inter)", fontSize: 28, fontWeight: 600,
                  color: "#333", lineHeight: 1,
                }}>
                  {stat.value}
                  <span style={{ fontSize: 12, fontWeight: 400, color: "#999" }}>{stat.unit}</span>
                </div>
                <div style={{ fontSize: 11, color: "#999", marginTop: 6, fontWeight: 500 }}>{stat.label}</div>
              </div>
            ))}
          </div>
        )}

        {data.clientLogos.length > 0 && (
          <div style={{ borderTop: "1px solid #f0f0f0", paddingTop: 32 }}>
            <div style={{ fontSize: 10, color: "#ccc", marginBottom: 20, fontWeight: 500 }}>主要取引先</div>
            <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
              {data.clientLogos.map((logo, i) => (
                <span key={i} style={{ fontSize: 12, color: "#aaa", fontWeight: 600, letterSpacing: "0.02em" }}>{logo}</span>
              ))}
            </div>
          </div>
        )}

        {pageFooter(5 + pOff)}
      </div>

      {/* ── P6: TEAM ── */}
      <div className="profile-page" style={{ ...page, padding: "64px" }}>
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 10, color: "#aaa", fontWeight: 500, marginBottom: 6 }}>メンバー</div>
          <h2 style={{ fontSize: 20, fontWeight: 700 }}>経営チーム</h2>
        </div>
        <p style={{ fontSize: 12, color: "#777", marginBottom: 40, lineHeight: 1.9 }}>{data.teamIntro}</p>

        {data.team.length > 0 && data.team.map((member, i) => (
          <div key={i} style={{
            display: "flex", gap: 20, alignItems: "flex-start",
            paddingBottom: i < data.team.length - 1 ? 24 : 32,
            marginBottom: i < data.team.length - 1 ? 24 : 32,
            borderBottom: i < data.team.length - 1 ? "1px solid #f0f0f0" : "none",
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: "50%", background: "#f4f4f4",
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
              <span style={{ fontSize: 15, fontWeight: 600, color: "#bbb" }}>{member.name.charAt(0)}</span>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 6 }}>
                <span style={{ fontSize: 15, fontWeight: 700 }}>{member.name}</span>
                <span style={{ fontSize: 11, color: accent, fontWeight: 600 }}>{member.role}</span>
              </div>
              <div style={{ fontSize: 12, color: "#777", lineHeight: 1.8 }}>{member.bio}</div>
            </div>
          </div>
        ))}

        {data.orgStats.length > 0 && (
          <div style={{ borderTop: "1px solid #f0f0f0", paddingTop: 32 }}>
            <div style={{ fontSize: 10, color: "#ccc", marginBottom: 20, fontWeight: 500 }}>組織データ</div>
            <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(data.orgStats.length, 4)}, 1fr)`, gap: 24 }}>
              {data.orgStats.map((stat, i) => (
                <div key={i}>
                  <div style={{ fontFamily: "var(--font-inter)", fontSize: 24, fontWeight: 700, color: "#333", lineHeight: 1 }}>
                    {stat.value}<span style={{ fontSize: 11, fontWeight: 400, color: "#999" }}>{stat.unit}</span>
                  </div>
                  <div style={{ fontSize: 10, color: "#999", marginTop: 6, fontWeight: 500 }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {pageFooter(6 + pOff)}
      </div>

      {/* ── P7: TIMELINE ── */}
      <div className="profile-page" style={{ ...page, padding: "64px" }}>
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 10, color: "#aaa", fontWeight: 500, marginBottom: 6 }}>沿革</div>
          <h2 style={{ fontSize: 20, fontWeight: 700 }}>History</h2>
        </div>
        <p style={{ fontSize: 12, color: "#777", marginBottom: 40, lineHeight: 1.9 }}>{data.timelineIntro}</p>

        {data.timeline.map((event, i) => (
          <div key={i} style={{
            display: "flex", gap: 32,
            paddingBottom: i < data.timeline.length - 1 ? 24 : 0,
            marginBottom: i < data.timeline.length - 1 ? 24 : 0,
            borderBottom: i < data.timeline.length - 1 ? "1px solid #f5f5f5" : "none",
          }}>
            <div style={{
              width: 88, flexShrink: 0, fontSize: 12,
              fontWeight: event.isHighlight ? 700 : 500,
              color: event.isHighlight ? accent : "#aaa",
              paddingTop: 2,
            }}>
              {event.year}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{
                fontSize: 14, fontWeight: 700, marginBottom: 4,
                color: event.isHighlight ? "#1a1a1a" : "#444",
              }}>
                {event.title}
              </div>
              <div style={{ fontSize: 12, color: "#888", lineHeight: 1.8 }}>{event.description}</div>
            </div>
          </div>
        ))}

        {pageFooter(7 + pOff)}
      </div>

      {/* ── P8: CONTACT ── */}
      <div className="profile-page" style={{ ...page, display: "flex", flexDirection: "column", padding: "64px" }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", maxWidth: 480 }}>
          <div style={{ width: 28, height: 2, background: accent, marginBottom: 40 }} />
          <h2 style={{
            fontSize: 26, fontWeight: 700, lineHeight: 1.7,
            letterSpacing: "0.04em", marginBottom: 20, whiteSpace: "pre-line",
          }}>
            {data.ctaHeading}
          </h2>
          <p style={{ fontSize: 13, color: "#777", lineHeight: 2.0, marginBottom: 48 }}>
            {data.ctaSubtext}
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 48 }}>
            {data.contactEmail && (
              <div style={{ fontSize: 12, color: "#555" }}>
                <span style={{ color: "#bbb", fontWeight: 500, display: "inline-block", width: 48 }}>Email</span>
                {data.contactEmail}
              </div>
            )}
            {data.contactPhone && (
              <div style={{ fontSize: 12, color: "#555" }}>
                <span style={{ color: "#bbb", fontWeight: 500, display: "inline-block", width: 48 }}>Tel</span>
                {data.contactPhone}
              </div>
            )}
            {data.contactWeb && (
              <div style={{ fontSize: 12, color: "#555" }}>
                <span style={{ color: "#bbb", fontWeight: 500, display: "inline-block", width: 48 }}>Web</span>
                {data.contactWeb}
              </div>
            )}
          </div>

          <button type="button" style={{
            display: "inline-block", width: "fit-content",
            background: accent, color: "#fff",
            fontSize: 12, fontWeight: 600, letterSpacing: "0.06em",
            padding: "14px 36px", borderRadius: 32,
            border: "none", cursor: "pointer",
          }}>
            {data.ctaButtonText}
          </button>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div style={{ fontSize: 10, color: "#ccc" }}>{data.companyName}</div>
          <span style={{ fontSize: 9, color: "#ccc", fontWeight: 500 }}>{String(8 + pOff).padStart(2, "0")}</span>
        </div>
      </div>
    </div>
  );
}
