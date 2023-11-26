import React from "react";
import { FaTimes } from "react-icons/fa";
import "./styles.scss";

function Index({ isOpen, onClose, onDelete, type, dataModal }) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-delete">
      <div className="modal-background">
        <div className="modal-content">
          <div className="title">Eliminar</div>
          <div className="text-cont">{`¿ Desea eliminar el ${type} ${dataModal}?`}</div>
          <div className="buttons-cont">
            <button className="button-cancel" onClick={onClose}>
              Cancelar
            </button>
            <button className="button" onClick={onDelete}>
              Aceptar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Index;
