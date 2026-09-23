export type FormControlSize = "small" | "medium" | "large";

export const DEFAULT_FORM_CONTROL_SIZE: FormControlSize = "medium";

export const getFormControlSizeClass = (
  size: FormControlSize = DEFAULT_FORM_CONTROL_SIZE,
  styles: Record<string, string>,
): string | undefined => styles[`cp-form-field--${size}`];
