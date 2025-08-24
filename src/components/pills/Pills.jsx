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
  label = "",
  placeholder = "Add tag",
  onSubmit,
  onRemove,
  isDisabled = false,
  isLoading = false,
  mode = "read-only",
}) => {
  const [labelValue, setLabelValue] = React.useState(label);
  const marginClass = getSpacingClass(margin, utilStyles, "m");
  const pillsClasses = getClassNames(styles["pills"], marginClass, className);
  const pillsWrapperClasses = getClassNames(styles["pill-wrapper"], {
    [styles[mode]]: mode,
  });
  const handlePillAction = () => {
    if (mode === "remove" && typeof onRemove === "function") {
      onRemove();
    }
    if (mode === "edit" && typeof onSubmit === "function") {
      onSubmit(labelValue);
      setLabelValue("");
    }
  };
  return (
    <Container className={pillsClasses}>
      <Container className={pillsWrapperClasses}>
        {(mode === "read-only" || mode === "remove") && (
          <Typography className={styles["pill-label"]}>{label}</Typography>
        )}
        {mode === "edit" && (
          <FormControls.Input
            name="pill"
            className={styles["pill-input"]}
            value={labelValue}
            placeholder={placeholder}
            onChange={(event) => setLabelValue(event.target.value)}
            isDisabled={isLoading || isDisabled}
          />
        )}
        {(mode === "remove" || mode === "edit") && (
          <Button
            className={styles["pill-button"]}
            variant="icon"
            onClick={() => handlePillAction()}
            isDisabled={isLoading || isDisabled || labelValue === ""}
          >
            {isLoading ? (
              <Spinner className={styles["pill-spinner"]} />
            ) : (
              <Icon name={mode === "edit" ? "check" : "close"} />
            )}
          </Button>
        )}
      </Container>
    </Container>
  );
};

Pills.propTypes = {
  label: PropTypes.string,
  placeholder: PropTypes.string,
  onRemove: PropTypes.func,
  onSubmit: PropTypes.func,
  mode: PropTypes.oneOf(["read-only", "edit", "remove"]),
  isLoading: PropTypes.bool,
  margin: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(SPACING_OPTIONS),
  ]),
};

export default Pills;
