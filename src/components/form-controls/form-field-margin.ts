import { SPACING_OPTIONS } from "../../constants/common";
import { getSpacingClass } from "../../utils/common";
import utilStyles from "../../styles/utils.module.scss";

export type SpacingOption = (typeof SPACING_OPTIONS)[number];
export type FormFieldMargin = string | SpacingOption[];

export const DEFAULT_FORM_FIELD_MARGIN = "b-4";

export const getFormFieldMarginClass = (
  margin: FormFieldMargin = DEFAULT_FORM_FIELD_MARGIN,
): string | undefined => getSpacingClass(margin, utilStyles, "m");
