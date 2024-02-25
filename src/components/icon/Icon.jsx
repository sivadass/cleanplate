import React from "react";
import "./styles.css";

const Icon = ({ name = "" }) => {
  const iconClassName = `cp-icon`;
  return <span class={iconClassName}>{name}</span>;
};

export default Icon;
