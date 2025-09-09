import React from "react";
import { FaTimes } from "react-icons/fa";
import "./styles.scss";

function Index({ children, isOpen, onClose, title, actions, footerActions }) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-background-web">
      <div className="modal-content">
        <div className="title">
          {title}
          <div className="actions">
            {actions && (
              <button className="button-ok" onClick={() => actions()}>
                Guardar
              </button>
            )}
            <button onClick={onClose}>
              <FaTimes />
            </button>
          </div>
        </div>
        <div className="children">{children}</div>
        {footerActions && (
          <div className="footer-actions">
            {footerActions.map((f) => (
              <button className={f.className} onClick={() => f.action()}>
                {f.title}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Index;
