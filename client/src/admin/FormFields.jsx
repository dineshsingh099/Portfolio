export function Field({ label, value, onChange, placeholder }) {
  return (
    <div className="form-group">
      <label>{label}</label>
      <input value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

export function TextAreaField({ label, value, onChange, rows = 4, placeholder }) {
  return (
    <div className="form-group">
      <label>{label}</label>
      <textarea rows={rows} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

export function StringListField({ label, items, onChange, placeholder }) {
  const update = (i, val) => {
    const next = [...items];
    next[i] = val;
    onChange(next);
  };
  const remove = (i) => onChange(items.filter((_, idx) => idx !== i));
  const add = () => onChange([...items, ""]);

  return (
    <div className="form-group">
      <label>{label}</label>
      {items.map((val, i) => (
        <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
          <input value={val} placeholder={placeholder} onChange={(e) => update(i, e.target.value)} />
          <button type="button" className="array-block-remove" style={{ position: "static" }} onClick={() => remove(i)}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
      ))}
      <button type="button" className="btn-add" onClick={add}>
        <i className="fa-solid fa-plus"></i> Add {label}
      </button>
    </div>
  );
}
