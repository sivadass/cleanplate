import React, { useEffect, useMemo, useRef, useState } from "react";
import styles from "./FilterBar.module.scss";
import utilStyles from "../../styles/utils.module.scss";
import { getSpacingClass } from "../../utils/common";
import getClassNames from "../../utils/get-class-names";
import { Date as DateField, Input, Select } from "../form-controls";
import type { Option } from "../form-controls/Select";
import Button from "../button";
import Drawer from "../drawer";
import { usePrototypeAttributes } from "../../prototype/CleanPlatePrototypeAttributes";
import { emitDataCp } from "../../prototype/emit-data-cp";
import type {
  FilterBarDateRangeField,
  FilterBarDateRangeValue,
  FilterBarField,
  FilterBarFieldValue,
  FilterBarProps,
  FilterBarValues,
} from "./filter-bar-types";
import {
  activeDrawerCount,
  DATE_RANGE_ERROR,
  dedupeFields,
  drawerDraftEqualsCommitted,
  emptyValue,
  isDateRangeInvalid,
  readValue,
  withFieldValue,
} from "./filter-bar-model";

function controlTestId(base: string | undefined, id: string): string | undefined {
  return base ? `${base}-field-${id}` : undefined;
}

function asDateRange(value: FilterBarFieldValue): FilterBarDateRangeValue {
  if (
    value !== null &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    "from" in value &&
    "to" in value
  ) {
    return value;
  }
  return { from: null, to: null };
}

function selectValue(value: FilterBarFieldValue, multi: boolean): Option | Option[] | null {
  if (multi) {
    return Array.isArray(value) ? value : [];
  }
  return value !== null && !Array.isArray(value) && typeof value === "object" && "value" in value
    ? value
    : null;
}

function DateRangeFields({
  field,
  range,
  error,
  isFluid,
  fieldMargin = "b-4",
  testId,
  onChange,
}: {
  field: FilterBarDateRangeField;
  range: FilterBarDateRangeValue;
  error?: string;
  isFluid?: boolean;
  fieldMargin?: "0" | "b-4";
  testId?: string;
  onChange: (next: FilterBarDateRangeValue) => void;
}) {
  return (
    <div className={styles["cp-filter-bar__date-range"]}>
      <DateField
        label={`${field.label} from`}
        size="small"
        margin={fieldMargin}
        isFluid={isFluid}
        value={range.from}
        onChange={(from) => onChange({ ...range, from })}
        dataTestId={testId ? `${testId}-from` : undefined}
      />
      <DateField
        label={`${field.label} to`}
        size="small"
        margin={fieldMargin}
        isFluid={isFluid}
        value={range.to}
        error={error}
        onChange={(to) => onChange({ ...range, to })}
        dataTestId={testId ? `${testId}-to` : undefined}
      />
    </div>
  );
}

function renderFieldControl(
  field: FilterBarField,
  value: FilterBarFieldValue,
  testId: string | undefined,
  onFieldChange: (next: FilterBarFieldValue) => void,
  options?: {
    isFluid?: boolean;
    dateRange?: FilterBarDateRangeValue;
    dateError?: string;
    fieldMargin?: "0" | "b-4";
  },
) {
  const fieldMargin = options?.fieldMargin ?? "b-4";
  if (field.type === "search") {
    return (
      <Input
        label={field.label}
        placeholder={field.placeholder}
        size="small"
        margin={fieldMargin}
        value={typeof value === "string" ? value : ""}
        onChange={(event) => onFieldChange(event.target.value)}
        dataTestId={testId}
      />
    );
  }
  if (field.type === "select" || field.type === "multiSelect") {
    const multi = field.type === "multiSelect";
    return (
      <Select
        label={field.label}
        size="small"
        margin={fieldMargin}
        isFluid={options?.isFluid}
        mode={multi ? "multi" : "single"}
        options={field.options}
        value={selectValue(value, multi)}
        onChange={(next: Option | Option[] | null) => onFieldChange(next as FilterBarFieldValue)}
        dataTestId={testId}
      />
    );
  }
  if (field.type === "dateRange" && options?.dateRange) {
    return (
      <DateRangeFields
        field={field}
        range={options.dateRange}
        error={options.dateError}
        isFluid={options?.isFluid}
        fieldMargin={fieldMargin}
        testId={testId}
        onChange={onFieldChange as (next: FilterBarDateRangeValue) => void}
      />
    );
  }
  return null;
}

const FilterBar: React.FC<FilterBarProps> = ({
  fields,
  values,
  onChange,
  className = "",
  margin = "0",
  dataTestId,
}) => {
  const prototypeEnabled = usePrototypeAttributes();
  const dataCp = emitDataCp(prototypeEnabled, "FilterBar", { margin }, { margin: "0" });
  const { fields: uniqueFields, duplicateIds } = useMemo(() => dedupeFields(fields), [fields]);
  const duplicateKey = duplicateIds.join("\0");
  const [isOpen, setIsOpen] = useState(false);
  const [draft, setDraft] = useState<FilterBarValues>({});
  const [barDateDraft, setBarDateDraft] = useState<Record<string, FilterBarDateRangeValue>>({});
  const openIdsRef = useRef<string | null>(null);

  const barFields = uniqueFields.filter((field) => field.placement === "bar");
  const drawerFields = uniqueFields.filter((field) => field.placement === "drawer");
  const drawerIdsKey = drawerFields.map((field) => field.id).join("\0");
  const marginClass = getSpacingClass(margin, utilStyles, "cp-m");
  const activeCount = activeDrawerCount(drawerFields, values);

  const drawerDateRangeInvalid = drawerFields.some(
    (field) =>
      field.type === "dateRange" &&
      isDateRangeInvalid(asDateRange(readValue(field, draft))),
  );

  useEffect(() => {
    if (process.env.NODE_ENV === "production" || duplicateKey.length === 0) return;
    for (const id of duplicateKey.split("\0")) {
      console.warn(`FilterBar: duplicate field id "${id}" ignored.`);
    }
  }, [duplicateKey]);

  useEffect(() => {
    if (!isOpen) return;
    if (openIdsRef.current !== drawerIdsKey) dismiss();
  }, [isOpen, drawerIdsKey]);

  if (uniqueFields.length === 0) return null;

  function openDrawer() {
    const next: FilterBarValues = {};
    for (const field of drawerFields) {
      next[field.id] = readValue(field, values);
    }
    setDraft(next);
    openIdsRef.current = drawerIdsKey;
    setIsOpen(true);
  }

  function dismiss() {
    openIdsRef.current = null;
    setDraft({});
    setIsOpen(false);
  }

  function clearDraft() {
    const next: FilterBarValues = {};
    for (const field of drawerFields) {
      next[field.id] = emptyValue(field);
    }
    setDraft(next);
  }

  function changeBarDate(fieldId: string, next: FilterBarDateRangeValue) {
    if (isDateRangeInvalid(next)) {
      setBarDateDraft((current) => ({ ...current, [fieldId]: next }));
      return;
    }
    setBarDateDraft((current) => {
      const copy = { ...current };
      delete copy[fieldId];
      return copy;
    });
    onChange(withFieldValue(values, fieldId, next));
  }

  function apply() {
    if (drawerDateRangeInvalid) return;
    if (drawerDraftEqualsCommitted(drawerFields, values, draft)) {
      dismiss();
      return;
    }
    const next = { ...values };
    for (const field of drawerFields) {
      next[field.id] = readValue(field, draft);
    }
    onChange(next);
    dismiss();
  }

  function renderBarField(field: FilterBarField) {
    const testId = controlTestId(dataTestId, field.id);
    if (field.type === "dateRange") {
      const displayed = barDateDraft[field.id] ?? asDateRange(readValue(field, values));
      return renderFieldControl(field, readValue(field, values), testId, (next) =>
        changeBarDate(field.id, next as FilterBarDateRangeValue),
      {
        fieldMargin: "0",
        dateRange: displayed,
        dateError: isDateRangeInvalid(displayed) ? DATE_RANGE_ERROR : undefined,
      });
    }
    const value = readValue(field, values);
    return renderFieldControl(field, value, testId, (next) =>
      onChange(withFieldValue(values, field.id, next)),
    { fieldMargin: "0" });
  }

  function renderDrawerField(field: FilterBarField) {
    const value = readValue(field, draft);
    const testId = controlTestId(dataTestId, field.id);
    if (field.type === "dateRange") {
      const range = asDateRange(value);
      return renderFieldControl(
        field,
        value,
        testId,
        (next) => setDraft((current) => withFieldValue(current, field.id, next)),
        {
          isFluid: true,
          dateRange: range,
          dateError: isDateRangeInvalid(range) ? DATE_RANGE_ERROR : undefined,
        },
      );
    }
    return renderFieldControl(
      field,
      value,
      testId,
      (next) => setDraft((current) => withFieldValue(current, field.id, next)),
      { isFluid: true },
    );
  }

  return (
    <div
      {...dataCp}
      className={getClassNames(styles["cp-filter-bar"], marginClass, className)}
      data-testid={dataTestId}
    >
      <div className={styles["cp-filter-bar__fields"]}>
        {barFields.map((field) => (
          <React.Fragment key={field.id}>{renderBarField(field)}</React.Fragment>
        ))}
        {drawerFields.length > 0 && (
          <div className={styles["cp-filter-bar__button-slot"]}>
            <span className={styles["cp-filter-bar__button-label"]} aria-hidden="true">
              {"\u00a0"}
            </span>
            <Button
              variant="outline"
              size="small"
              type="button"
              className={styles["cp-filter-bar__button"]}
              data-testid={dataTestId ? `${dataTestId}-button` : undefined}
              onClick={openDrawer}
            >
              {activeCount === 0 ? "Filters" : `Filters ${activeCount}`}
            </Button>
          </div>
        )}
      </div>
      {drawerFields.length > 0 && isOpen && (
        <Drawer
          isOpen
          onClose={dismiss}
          title="Filters"
          placement="right"
          primaryButtonLabel="Apply"
          onPrimaryButtonClick={apply}
          secondaryButtonLabel="Clear"
          onSecondaryButtonClick={clearDraft}
          isPrimaryButtonDisabled={drawerDateRangeInvalid}
          dataTestId={dataTestId ? `${dataTestId}-drawer` : undefined}
        >
          <div className={styles["cp-filter-bar__drawer-fields"]}>
            {drawerFields.map((field) => (
              <React.Fragment key={field.id}>{renderDrawerField(field)}</React.Fragment>
            ))}
          </div>
        </Drawer>
      )}
    </div>
  );
};

export default FilterBar;
