import { SkelBlock, SkelCircle, SkelText } from "../../effects/Skeleton";

export function AdminDashboardSkeleton() {
  return (
    <div className="dash-shell" aria-hidden="true" aria-busy="true">
      <aside className="dash-sidebar">
        <SkelBlock w={70} h={26} style={{ margin: "0 10px 24px" }} />

        <div className="dash-profile-card">
          <SkelCircle size={44} />
          <div style={{ flex: 1 }}>
            <SkelText w="70%" style={{ marginBottom: 8 }} />
            <SkelText w="45%" />
          </div>
        </div>

        <nav>
          <SkelText w="80px" style={{ height: 10, margin: "18px 10px 10px" }} />
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px" }}>
              <SkelBlock w={16} h={16} radius={4} />
              <SkelText w={`${60 + (i % 3) * 15}%`} />
            </div>
          ))}
          <SkelText w="100px" style={{ height: 10, margin: "18px 10px 10px" }} />
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px" }}>
              <SkelBlock w={16} h={16} radius={4} />
              <SkelText w={`${50 + (i % 2) * 20}%`} />
            </div>
          ))}
        </nav>
      </aside>

      <div className="dash-main">
        <header className="dash-topbar">
          <div>
            <SkelBlock w={160} h={22} style={{ marginBottom: 8 }} />
            <SkelText w={200} />
          </div>
          <SkelBlock w={260} h={40} radius={12} style={{ marginLeft: "auto", marginRight: 20 }} />
          <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
            <SkelCircle size={36} />
            <SkelCircle size={36} />
            <SkelCircle size={36} />
          </div>
        </header>

        <main className="dash-content">
          <DashPanelSkeleton variant="cards" />
        </main>
      </div>
    </div>
  );
}

/**
 * Shown inside dash-content while a lazily-loaded panel (Overview,
 * SectionManager, Messages, ...) is still downloading/mounting. The
 * "variant" prop picks the closest real shape instead of one generic block:
 *  - cards: stat tiles + a chart, for Overview / Visitors Analytics
 *  - form:  labeled input rows + preview pane, for section edit forms / Settings
 *  - list:  row-based list, for Messages / Media Library / Social Links
 */
export function DashPanelSkeleton({ variant = "cards" }) {
  if (variant === "form") {
    return (
      <div aria-hidden="true" aria-busy="true">
        <SkelBlock w={220} h={24} style={{ marginBottom: 24 }} />
        <div className="dash-card" style={{ background: "var(--db-card)", border: "1px solid var(--db-border)", borderRadius: 16, padding: 24, marginBottom: 20 }}>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} style={{ marginBottom: 18 }}>
              <SkelText w="120px" style={{ marginBottom: 8 }} />
              <SkelBlock h={42} radius={10} />
            </div>
          ))}
          <SkelBlock w={140} h={44} radius={10} style={{ marginTop: 10 }} />
        </div>
      </div>
    );
  }

  if (variant === "list") {
    return (
      <div aria-hidden="true" aria-busy="true">
        <SkelBlock w={220} h={24} style={{ marginBottom: 24 }} />
        <div style={{ background: "var(--db-card)", border: "1px solid var(--db-border)", borderRadius: 16, overflow: "hidden" }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "16px 20px",
                borderBottom: i < 4 ? "1px solid var(--db-border)" : "none",
              }}
            >
              <SkelCircle size={38} />
              <div style={{ flex: 1 }}>
                <SkelText w="40%" style={{ marginBottom: 8 }} />
                <SkelText w="70%" />
              </div>
              <SkelBlock w={70} h={26} radius={14} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // "cards" (default) — Overview / Analytics style
  return (
    <div aria-hidden="true" aria-busy="true">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 18, marginBottom: 24 }}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} style={{ background: "var(--db-card)", border: "1px solid var(--db-border)", borderRadius: 16, padding: 20, display: "flex", gap: 14, alignItems: "center" }}>
            <SkelBlock w={44} h={44} radius={12} />
            <div style={{ flex: 1 }}>
              <SkelText w="60%" style={{ marginBottom: 10 }} />
              <SkelBlock w="40%" h={20} />
            </div>
          </div>
        ))}
      </div>
      <div style={{ background: "var(--db-card)", border: "1px solid var(--db-border)", borderRadius: 16, padding: 24 }}>
        <SkelText w="180px" style={{ marginBottom: 20 }} />
        <SkelBlock h={220} radius={12} />
      </div>
    </div>
  );
}

/**
 * Shown while the login / forgot-password chunk downloads. Mirrors the
 * admin-auth-card so the swap from skeleton -> real form is seamless.
 */
export function AuthCardSkeleton() {
  return (
    <div className="admin-auth-screen" aria-hidden="true" aria-busy="true">
      <div className="admin-auth-card">
        <SkelBlock w={60} h={28} style={{ margin: "0 auto 16px" }} />
        <SkelBlock w="70%" h={22} style={{ margin: "0 auto 10px" }} />
        <SkelText w="85%" style={{ margin: "0 auto 28px" }} />
        <div style={{ textAlign: "left" }}>
          <SkelText w="60px" style={{ marginBottom: 8 }} />
          <SkelBlock h={44} radius={10} style={{ marginBottom: 18 }} />
          <SkelText w="80px" style={{ marginBottom: 8 }} />
          <SkelBlock h={44} radius={10} style={{ marginBottom: 24 }} />
          <SkelBlock h={46} radius={10} />
        </div>
      </div>
    </div>
  );
}
