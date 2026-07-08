export default function Modal({ title, onClose, children, wide }) {
  return (
    <div className="modal-overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-box" style={wide ? { maxWidth: 760 } : undefined}>
        <button className="modal-close" onClick={onClose} aria-label="Close">
          <i className="fa-solid fa-xmark"></i>
        </button>
        <div className="modal-title">{title}</div>
        {children}
      </div>
    </div>
  );
}
