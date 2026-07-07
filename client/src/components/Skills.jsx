import { useState } from "react";

const FILTERS = [
  { key: "all", label: "All" },
  { key: "frontend", label: "Frontend" },
  { key: "backend", label: "Backend" },
  { key: "data", label: "Data & ML" },
  { key: "tools", label: "Tools" },
];

export default function Skills({ skills }) {
  const [filter, setFilter] = useState("all");

  const visible = filter === "all" ? skills : skills.filter((s) => s.category === filter);

  return (
    <section className="skills section-editable" id="skills">
      <div className="eyebrow-center">
        <div className="eyebrow">TECHNICAL SKILLS</div>
      </div>
      <h2 className="section-title centered">My Expertise</h2>

      <div className="skill-filters">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            className={`filter-btn${filter === f.key ? " active" : ""}`}
            onClick={() => setFilter(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="skill-grid">
        {visible.map((cat) => (
          <div className="skill-card reveal" key={cat.id}>
            <div className="skill-card-shine"></div>
            <div className="skill-card-icon">
              <i className={cat.icon}></i>
            </div>
            <h3>{cat.title}</h3>
            <ul>
              {cat.items.map((item, i) => (
                <li key={i}>
                  <i className={item.icon}></i>
                  {item.label}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
