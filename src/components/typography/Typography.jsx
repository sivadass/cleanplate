import React from "react";
import "./styles.css";

const Typography = ({ children, variant }) => {
  switch (variant) {
    case "h1":
      return <h1 className="cp-typography">{children}</h1>;
    case "h2":
      return <h2 className="cp-typography">{children}</h2>;
    case "h3":
      return <h3 className="cp-typography">{children}</h3>;
    case "h4":
      return <h4 className="cp-typography">{children}</h4>;
    case "h5":
      return <h5 className="cp-typography">{children}</h5>;
    case "h6":
      return <h6 className="cp-typography">{children}</h6>;
    default:
      return <p className="cp-typography">{children}</p>;
  }
};

export default Typography;
