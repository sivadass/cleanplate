import React from "react";
import PropTypes from "prop-types";
import styles from "./Typography.module.scss";
import utilStyles from "../../styles/utils.module.scss";
import { getSpacingClass } from "../../utils/common";
import { SPACING_OPTIONS } from "../../constants/common";
import getClassNames from "../../utils/get-class-names";

const Typography = ({
  children,
  variant,
  margin = "m-0",
  className = "",
  isBold = false,
  align = "left",
}) => {
  const marginClass = getSpacingClass(margin, utilStyles, "m");
  const alignClass = `align-${align}`;
  const typographyClasses = getClassNames(
    styles["typography"],
    {
      [styles[variant]]: variant,
      [styles["bold"]]: isBold,
      [styles["align"]]: align,
      [styles[alignClass]]: align,
    },
    marginClass,
    className
  );

  switch (variant) {
    case "h1":
      return <h1 className={typographyClasses}>{children}</h1>;
    case "h2":
      return <h2 className={typographyClasses}>{children}</h2>;
    case "h3":
      return <h3 className={typographyClasses}>{children}</h3>;
    case "h4":
      return <h4 className={typographyClasses}>{children}</h4>;
    case "h5":
      return <h5 className={typographyClasses}>{children}</h5>;
    case "h6":
      return <h6 className={typographyClasses}>{children}</h6>;
    case "small":
      return <small className={typographyClasses}>{children}</small>;
    default:
      return <p className={typographyClasses}>{children}</p>;
  }
};

Typography.propTypes = {
  variant: PropTypes.oneOf(["h1", "h2", "h3", "h4", "h5", "h6", "p"]),
  margin: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(SPACING_OPTIONS),
  ]),
  isBold: PropTypes.bool,
  align: PropTypes.oneOf(["left", "right", "center"]),
};

export default Typography;
