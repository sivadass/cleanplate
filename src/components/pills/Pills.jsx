import React from "react";
import PropTypes from "prop-types";
import styles from "./Pills.module.scss";
import utilStyles from "../../styles/utils.module.scss";
import { getSpacingClass } from "../../utils/common";
import { SPACING_OPTIONS } from "../../constants/common";
import getClassNames from "../../utils/get-class-names";
import Icon from "../icon";
import Button from "../button";
import Container from "../container";
import FormControls from "../form-controls";
import Typography from "../typography";
import Spinner from "../spinner";

const Pills = ({
  margin = "0",
  className = "",
  label = "Shopping",
  placeholder = "Add tag",
  onChange,
  onRemove,
  isDisabled = false,
  isLoading = false,
  mode = "read-only",
}) => {
  const marginClass = getSpacingClass(margin, utilStyles, "m");
  const pillsClasses = getClassNames(
    styles["pills"],
    {
      [styles[mode]]: mode,
    },
    marginClass,
    className
  );
  const handleOnChange = (v) => {
    if (typeof onChange === "function") {
      onChange(v);
    }
  };
  const handleOnRemove = () => {
    if (typeof onRemove === "function") {
      onRemove();
    }
  };
  return (
    <Container className={pillsClasses}>
      {mode === "read-only" && (
        <Typography className={styles["pill-label"]}>{label}</Typography>
      )}
      {(mode === "edit" || mode === "remove") && (
        <>
          <FormControls.Input
            name="pill"
            className={styles["pill-input"]}
            value={label}
            placeholder={placeholder}
            onChange={(v) => handleOnChange(v)}
            isDisabled={isLoading || isDisabled || mode === "remove"}
          />
          <Button
            className={styles["pill-button"]}
            variant="icon"
            onClick={() => handleOnRemove()}
            isDisabled={isLoading || isDisabled}
          >
            {isLoading ? (
              <Spinner className={styles["pill-spinner"]} />
            ) : (
              <Icon name={mode === "edit" ? "check" : "close"} />
            )}
          </Button>
        </>
      )}
    </Container>
  );
};

Pills.propTypes = {
  label: PropTypes.string,
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
  onRemove: PropTypes.func,
  mode: PropTypes.oneOf(["read-only", "edit", "remove"]),
  isLoading: PropTypes.bool,
  margin: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(SPACING_OPTIONS),
  ]),
};

export default Pills;
