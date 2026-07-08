export default function Timeline({ id, eyebrowText, title, items, dotClass, badgeClass, section }) {
  return (
    <section className={`${section} section-editable`} id={id}>
      <div className="eyebrow-center">
        <div className="eyebrow">{eyebrowText}</div>
      </div>
      <h2 className="section-title centered">{title}</h2>

      <div className="timeline">
        {items.map((item, i) => (
          <div className={`tl-row reveal${i % 2 === 1 ? " right" : ""}`} key={item.id}>
            <div className={`tl-dot ${dotClass}`}></div>
            <div className="tl-card">
              <div className={`tl-badge ${badgeClass}`}>
                <i className={item.badgeIcon}></i> {item.badgeText}
              </div>
              <span className="tl-date">
                <i className="fa-regular fa-calendar"></i> {item.date}
              </span>
              <h3>{item.title}</h3>
              <h4>
                <i className="fa-solid fa-building"></i> {item.organization}
              </h4>
              <ul>
                {item.bullets.map((b, bi) => (
                  <li key={bi}>{b}</li>
                ))}
              </ul>
              <div className="tl-tags">
                {item.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
