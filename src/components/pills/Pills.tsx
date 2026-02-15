import React, { useState } from "react";
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

export type SpacingOption = (typeof SPACING_OPTIONS)[number];

export type PillsMargin = string | SpacingOption[];

export type PillsMode = "read-only" | "edit" | "remove";

export interface PillsProps {
  /** Margin spacing (suffix or array of spacing suffixes; component adds m- prefix) */
  margin?: PillsMargin;
  /** Additional class names for the root element */
  className?: string;
  /** Label text shown in read-only or remove mode; initial value in edit mode */
  label?: string;
  /** Placeholder for the input in edit mode */
  placeholder?: string;
  /** Called when user submits in edit mode (e.g. Enter or check button); receives the current input value */
  onSubmit?: (value: string) => void;
  /** Called when user triggers remove (e.g. close button in remove mode) */
  onRemove?: () => void;
  /** Disables the input and action button */
  isDisabled?: boolean;
  /** Shows spinner instead of icon in edit/remove mode */
  isLoading?: boolean;
  /** Display mode: read-only (label only), edit (input + check), remove (label + close) */
  mode?: PillsMode;
}

const Pills: React.FC<PillsProps> = ({
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
  const [labelValue, setLabelValue] = useState(label);
  const marginClass = getSpacingClass(margin, utilStyles, "m");
  const pillsClasses = getClassNames(styles["pills"], marginClass, className);
  const pillsWrapperClasses = getClassNames(styles["pill-wrapper"], {
    [styles[mode]]: mode,
  });

  const handleSubmit = () => {
    if (typeof onSubmit === "function") {
      onSubmit(labelValue);
      setLabelValue("");
    }
  };

  const handleRemove = () => {
    if (typeof onRemove === "function") {
      onRemove();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handlePillAction = () => {
    if (mode === "remove") {
      handleRemove();
    }
    if (mode === "edit") {
      handleSubmit();
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
            id="pill-input"
            className={styles["pill-input"]}
            value={labelValue}
            defaultValue=""
            placeholder={placeholder}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setLabelValue(event.target.value)
            }
            onKeyDown={handleKeyDown}
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

export default Pills;
