import React, { useEffect, useMemo } from "react";
import styles from "./FilterBar.module.scss";
import utilStyles from "../../styles/utils.module.scss";
import { getSpacingClass } from "../../utils/common";
import getClassNames from "../../utils/get-class-names";
import { Input, Select } from "../form-controls";
import type { Option } from "../form-controls/Select";
import { usePrototypeAttributes } from "../../prototype/CleanPlatePrototypeAttributes";
import { emitDataCp } from "../../prototype/emit-data-cp";
import type { FilterBarFieldValue, FilterBarProps } from "./filter-bar-types";
import { dedupeFields, readValue, withFieldValue } from "./filter-bar-model";

function controlTestId(base: string | undefined, id: string): string | undefined {
  return base ? `${base}-field-${id}` : undefined;
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

  useEffect(() => {
    if (process.env.NODE_ENV === "production" || duplicateKey.length === 0) return;
    for (const id of duplicateKey.split("\0")) {
      console.warn(`FilterBar: duplicate field id "${id}" ignored.`);
    }
  }, [duplicateKey]);

  if (uniqueFields.length === 0) return null;

  const barFields = uniqueFields.filter((field) => field.placement === "bar");
  const marginClass = getSpacingClass(margin, utilStyles, "cp-m");

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
          if (field.type === "search") {
            return (
              <Input
                key={field.id}
                label={field.label}
                placeholder={field.placeholder}
                size="small"
                value={typeof value === "string" ? value : ""}
                onChange={(event) => onChange(withFieldValue(values, field.id, event.target.value))}
                dataTestId={testId}
              />
            );
          }
          if (field.type === "select" || field.type === "multiSelect") {
            const multi = field.type === "multiSelect";
            const selectValue: Option | Option[] | null = multi
              ? Array.isArray(value)
                ? value
                : []
              : value !== null && !Array.isArray(value) && typeof value === "object" && "value" in value
                ? value
                : null;
            return (
              <Select
                key={field.id}
                label={field.label}
                size="small"
                mode={multi ? "multi" : "single"}
                options={field.options}
                value={selectValue}
                onChange={(next: Option | Option[] | null) =>
                  onChange(withFieldValue(values, field.id, next as FilterBarFieldValue))
                }
                dataTestId={testId}
              />
            );
          }
          return null;
        })}
      </div>
    </div>
  );
};

export default FilterBar;
