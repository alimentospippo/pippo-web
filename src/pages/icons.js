import React from "react";
import logo from "../assets/logo_pipo.png";
import loading from "../assets/loading.gif";

export const icons = (icon) => {
  const listIcons = {
    logo: logo,
    loading: loading,
  };

  return <img src={listIcons[icon]} alt={icon} />;
};
