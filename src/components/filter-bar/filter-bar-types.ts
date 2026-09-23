import type { Option } from "../form-controls/Select";
import { SPACING_OPTIONS } from "../../constants/common";

export type FilterBarPlacement = "bar" | "drawer";

export interface FilterBarFieldBase {
  id: string;
  label: string;
  placement: FilterBarPlacement;
}

export interface FilterBarSearchField extends FilterBarFieldBase {
  type: "search";
  placeholder?: string;
}

export interface FilterBarSelectField extends FilterBarFieldBase {
  type: "select";
  options: Option[];
}

export interface FilterBarMultiSelectField extends FilterBarFieldBase {
  type: "multiSelect";
  options: Option[];
}

export interface FilterBarDateRangeField extends FilterBarFieldBase {
  type: "dateRange";
}

export type FilterBarField =
  | FilterBarSearchField
  | FilterBarSelectField
  | FilterBarMultiSelectField
  | FilterBarDateRangeField;

export interface FilterBarDateRangeValue {
  from: Date | null;
  to: Date | null;
}

export type FilterBarFieldValue =
  | string
  | Option
  | null
  | Option[]
  | FilterBarDateRangeValue;

export type FilterBarValues = Record<string, FilterBarFieldValue>;

export type SpacingOption = (typeof SPACING_OPTIONS)[number];
export type FilterBarMargin = string | SpacingOption[];

export interface FilterBarProps {
  fields: FilterBarField[];
  values: FilterBarValues;
  onChange: (values: FilterBarValues) => void;
  className?: string;
  margin?: FilterBarMargin;
  dataTestId?: string;
}
