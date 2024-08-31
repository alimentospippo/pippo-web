import React from "react";
import "./styles.scss";

function Index({ active, onClick, id, disabled }) {
  return (
    <div
      className={`toogle ${active ? "active" : "inactive"} ${
        disabled ? "disabled" : ""
      }`}
      onClick={() => !disabled && onClick(id, active)}
    >
      <div className={`toogle__item ${active ? "active" : "inactive"}`}></div>
    </div>
  );
}

export default Index;
