import React from "react";
import "./styles.scss";
import { Tooltip } from "react-tooltip";

function Index({ active, onClick, id, disabled }) {
  return (
    <div
      data-tooltip-id={`my-tooltip-${id}`}
      data-tooltip-content={active ? "Desactivar" : "Activar"}
      data-tooltip-place="bottom"
    >
      <div
        className={`toogle ${active ? "active" : "inactive"} ${
          disabled ? "disabled" : ""
        }`}
        onClick={() => !disabled && onClick(id, active)}
      >
        <div className={`toogle__item ${active ? "active" : "inactive"}`}></div>
      </div>
      <Tooltip id={`my-tooltip-${id}`} />
    </div>
  );
}

export default Index;
