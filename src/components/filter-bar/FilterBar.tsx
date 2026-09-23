import React, { useEffect, useMemo, useRef, useState } from "react";
import styles from "./FilterBar.module.scss";
import utilStyles from "../../styles/utils.module.scss";
import { getSpacingClass } from "../../utils/common";
import getClassNames from "../../utils/get-class-names";
import { Input, Select } from "../form-controls";
import type { Option } from "../form-controls/Select";
import Button from "../button";
import Drawer from "../drawer";
import { usePrototypeAttributes } from "../../prototype/CleanPlatePrototypeAttributes";
import { emitDataCp } from "../../prototype/emit-data-cp";
import type { FilterBarField, FilterBarFieldValue, FilterBarProps, FilterBarValues } from "./filter-bar-types";
import {
  activeDrawerCount,
  dedupeFields,
  drawerDraftEqualsCommitted,
  emptyValue,
  readValue,
  withFieldValue,
} from "./filter-bar-model";

function controlTestId(base: string | undefined, id: string): string | undefined {
  return base ? `${base}-field-${id}` : undefined;
}

function selectValue(value: FilterBarFieldValue, multi: boolean): Option | Option[] | null {
  if (multi) {
    return Array.isArray(value) ? value : [];
  }
  return value !== null && !Array.isArray(value) && typeof value === "object" && "value" in value
    ? value
    : null;
}

function renderFieldControl(
  field: FilterBarField,
  value: FilterBarFieldValue,
  testId: string | undefined,
  onFieldChange: (next: FilterBarFieldValue) => void,
  options?: { isFluid?: boolean },
) {
  if (field.type === "search") {
    return (
      <Input
        label={field.label}
        placeholder={field.placeholder}
        size="small"
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
        isFluid={options?.isFluid}
        mode={multi ? "multi" : "single"}
        options={field.options}
        value={selectValue(value, multi)}
        onChange={(next: Option | Option[] | null) => onFieldChange(next as FilterBarFieldValue)}
        dataTestId={testId}
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
  const openIdsRef = useRef<string | null>(null);

  const barFields = uniqueFields.filter((field) => field.placement === "bar");
  const drawerFields = uniqueFields.filter((field) => field.placement === "drawer");
  const drawerIdsKey = drawerFields.map((field) => field.id).join("\0");
  const marginClass = getSpacingClass(margin, utilStyles, "cp-m");
  const activeCount = activeDrawerCount(drawerFields, values);

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

  function apply() {
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

  return (
    <div
      {...dataCp}
      className={getClassNames(styles["cp-filter-bar"], marginClass, className)}
      data-testid={dataTestId}
    >
      <div className={styles["cp-filter-bar__fields"]}>
        {barFields.map((field) => {
          const value = readValue(field, values);
          const testId = controlTestId(dataTestId, field.id);
          return (
            <React.Fragment key={field.id}>
              {renderFieldControl(field, value, testId, (next) =>
                onChange(withFieldValue(values, field.id, next)),
              )}
            </React.Fragment>
          );
        })}
        {drawerFields.length > 0 && (
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
          isPrimaryButtonDisabled={false}
          dataTestId={dataTestId ? `${dataTestId}-drawer` : undefined}
        >
          <div className={styles["cp-filter-bar__drawer-fields"]}>
            {drawerFields.map((field) => {
              const value = readValue(field, draft);
              const testId = controlTestId(dataTestId, field.id);
              return (
                <React.Fragment key={field.id}>
                  {renderFieldControl(
                    field,
                    value,
                    testId,
                    (next) => setDraft((current) => withFieldValue(current, field.id, next)),
                    { isFluid: true },
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </Drawer>
      )}
    </div>
  );
};

export default FilterBar;
