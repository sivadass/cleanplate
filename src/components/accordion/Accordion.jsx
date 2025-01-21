import React from "react";
import PropTypes from "prop-types";
import Container from "../container";
import Icon from "../icon";
import styles from "./Accordion.module.scss";
import utilStyles from "../../styles/utils.module.scss";
import { getSpacingClass } from "../../utils/common";
import { SPACING_OPTIONS } from "../../constants/common";
import getClassNames from "../../utils/get-class-names";

const Accordion = ({
  size = "medium",
  variant = "light",
  margin = "m-0",
  className = "",
}) => {
  const marginClass = getSpacingClass(margin, utilStyles, "m");

  const iconClasses = getClassNames(
    styles[size],
    styles[variant],
    marginClass,
    className
  );

  return (
    <Container className={[styles["cp-spinner"], iconClasses]}>
      <Icon name="progress_activity" className={[styles["cp-spinner-icon"]]} />
    </Container>
  );
};

Accordion.propTypes = {
  size: PropTypes.oneOf(["small", "medium", "large"]),
  variant: PropTypes.oneOf(["light", "dark"]),
  margin: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(SPACING_OPTIONS),
  ]),
};

export default Accordion;
