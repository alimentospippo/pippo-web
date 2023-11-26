import React from "react";
import logo from "../assets/logo_pipo.png";

export const icons = (icon) => {
  const listIcons = {
    logo: logo,
  };

  return <img src={listIcons[icon]} alt={icon} />;
};
