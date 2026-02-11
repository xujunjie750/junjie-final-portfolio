export function Modal({ title, children, onClose }) {
  return (
    <div className="modalOverlay" role="dialog" aria-modal="true">
      <div className="modalCard">
        <div className="modalHeader">
          <div className="modalTitle">{title}</div>
          <button className="iconButton" onClick={onClose} type="button" aria-label="关闭">
            ×
          </button>
        </div>
        <div className="modalBody">{children}</div>
      </div>
      <button className="modalBackdrop" onClick={onClose} type="button" aria-label="关闭背景" />
    </div>
  );
}

