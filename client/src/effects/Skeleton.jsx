// Shape primitives used to assemble every skeleton screen in the app.
// Keeping these tiny and generic means each skeleton file only has to
// describe *layout* (rows/columns/sizes), not re-implement shimmer CSS.

export function SkelBlock({ w = "100%", h = 16, radius = 8, style, className = "" }) {
  return (
    <div
      className={`skel ${className}`}
      style={{ width: w, height: h, borderRadius: radius, ...style }}
    />
  );
}

export function SkelCircle({ size = 40, style }) {
  return <div className="skel skel-circle" style={{ width: size, height: size, ...style }} />;
}

export function SkelText({ w = "100%", style }) {
  return <div className="skel skel-text" style={{ width: w, ...style }} />;
}

/**
 * Skeleton for everything below the (eagerly-rendered) hero: About, Skills,
 * Timeline x2, Projects, Certifications, Resume, Contact, Footer. Shown
 * while those lazy-loaded chunks are still downloading, so scroll position
 * and page height stay roughly stable instead of jumping once they arrive.
 */
export function SectionsSkeleton() {
  return (
    <div aria-hidden="true" aria-busy="true">
      {/* About */}
      <section className="about" style={{ padding: "var(--section-pad)" }}>
        <SkelText w="120px" style={{ height: 11, marginBottom: 14 }} />
        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 50 }}>
          <div>
            <SkelBlock w="70%" h={36} style={{ marginBottom: 10 }} />
            <SkelBlock w="45%" h={36} style={{ marginBottom: 24 }} />
            <SkelText w="100%" style={{ marginBottom: 10 }} />
            <SkelText w="95%" style={{ marginBottom: 10 }} />
            <SkelText w="80%" style={{ marginBottom: 24 }} />
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 24 }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <SkelBlock key={i} w={70} h={30} radius={20} />
              ))}
            </div>
            <SkelBlock w={190} h={46} radius={30} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, alignContent: "start" }}>
            {Array.from({ length: 4 }).map((_, i) => (
              <SkelBlock key={i} h={110} radius={16} />
            ))}
          </div>
        </div>
      </section>

      {/* Skills */}
      <section className="skills" style={{ padding: "var(--section-pad)" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
          <SkelText w="140px" style={{ height: 11 }} />
        </div>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 30 }}>
          <SkelBlock w="260px" h={30} />
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 10, marginBottom: 40 }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <SkelBlock key={i} w={90} h={34} radius={20} />
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 20 }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <SkelBlock key={i} h={130} radius={16} />
          ))}
        </div>
      </section>

      {/* Timeline (experience/education share this shape) */}
      <section style={{ padding: "var(--section-pad)" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
          <SkelText w="160px" style={{ height: 11 }} />
        </div>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 40 }}>
          <SkelBlock w="300px" h={30} />
        </div>
        <div style={{ display: "grid", gap: 24, maxWidth: 900, margin: "0 auto" }}>
          {Array.from({ length: 2 }).map((_, i) => (
            <SkelBlock key={i} h={140} radius={18} />
          ))}
        </div>
      </section>

      {/* Projects */}
      <section className="projects" style={{ padding: "var(--section-pad)" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
          <SkelText w="90px" style={{ height: 11 }} />
        </div>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 40 }}>
          <SkelBlock w="320px" h={30} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 26 }}>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i}>
              <SkelBlock h={190} radius={16} style={{ marginBottom: 14 }} />
              <SkelBlock w="60%" h={20} style={{ marginBottom: 10 }} />
              <SkelText w="100%" style={{ marginBottom: 6 }} />
              <SkelText w="80%" />
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: "40px 80px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <SkelBlock w={60} h={26} />
        <SkelText w="220px" />
        <SkelBlock w={200} h={20} />
      </footer>
    </div>
  );
}

/**
 * Full-page skeleton shown only on the very first visit, before the
 * portfolio content API response (and its cache) exist at all. Mirrors
 * Navbar + Hero on top of SectionsSkeleton so the whole page shape is
 * recognizable immediately, instead of a spinner floating on a blank page.
 */
export default function PortfolioSkeleton() {
  return (
    <div aria-hidden="true" aria-busy="true">
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "20px 80px",
          background: "rgba(8, 12, 24, 0.6)",
          backdropFilter: "blur(10px)",
        }}
      >
        <SkelBlock w={50} h={26} />
        <div style={{ display: "flex", gap: 26 }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <SkelText key={i} w={54} />
          ))}
        </div>
      </nav>

      <section
        className="hero"
        style={{
          minHeight: "90vh",
          display: "grid",
          gridTemplateColumns: "1.1fr 0.9fr",
          alignItems: "center",
          gap: 40,
          padding: "0 80px",
        }}
      >
        <div>
          <SkelText w="160px" style={{ marginBottom: 22 }} />
          <SkelBlock w="80%" h={54} style={{ marginBottom: 12 }} />
          <SkelBlock w="60%" h={54} style={{ marginBottom: 22 }} />
          <SkelBlock w="45%" h={30} style={{ marginBottom: 22 }} />
          <SkelText w="90%" style={{ marginBottom: 8 }} />
          <SkelText w="70%" style={{ marginBottom: 30 }} />
          <div style={{ display: "flex", gap: 16, marginBottom: 30 }}>
            <SkelBlock w={170} h={50} radius={30} />
            <SkelBlock w={140} h={50} radius={30} />
          </div>
          <div style={{ display: "flex", gap: 14 }}>
            {Array.from({ length: 4 }).map((_, i) => (
              <SkelCircle key={i} size={38} />
            ))}
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <SkelCircle size={280} />
        </div>
      </section>

      <SectionsSkeleton />
    </div>
  );
}
