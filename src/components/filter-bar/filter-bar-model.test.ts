import { describe, expect, it } from "vitest";
import type { FilterBarField } from "./filter-bar-types";
import {
  DATE_RANGE_ERROR,
  activeDrawerCount,
  dedupeFields,
  drawerDraftEqualsCommitted,
  emptyValue,
  isDateRangeInvalid,
  isFieldActive,
  readValue,
  withFieldValue,
} from "./filter-bar-model";

const search: FilterBarField = { id: "q", type: "search", label: "Search", placement: "bar" };
const status: FilterBarField = {
  id: "status",
  type: "select",
  label: "Status",
  placement: "bar",
  options: [{ value: "active", label: "Active" }],
};
const owner: FilterBarField = {
  id: "owner",
  type: "multiSelect",
  label: "Owner",
  placement: "drawer",
  options: [{ value: "asha", label: "Asha" }],
};
const due: FilterBarField = { id: "due", type: "dateRange", label: "Due", placement: "drawer" };

describe("filter-bar model", () => {
  it("uses an empty value when the key is missing", () => {
    expect(readValue(search, {})).toBe("");
    expect(readValue(status, {})).toBeNull();
    expect(readValue(owner, {})).toEqual([]);
    expect(readValue(due, {})).toEqual({ from: null, to: null });
  });

  it("returns the stored value when the key is present", () => {
    expect(readValue(search, { q: "bill" })).toBe("bill");
  });

  it("treats a non-empty search string as active, including whitespace", () => {
    expect(isFieldActive(search, "")).toBe(false);
    expect(isFieldActive(search, " ")).toBe(true);
  });

  it("counts a date range as one active drawer field when either end is set", () => {
    expect(activeDrawerCount([owner, due], { owner: [], due: { from: null, to: null } })).toBe(0);
    expect(
      activeDrawerCount([owner, due], {
        owner: [{ value: "asha", label: "Asha" }],
        due: { from: new Date(2026, 7, 1), to: null },
      }),
    ).toBe(2);
  });

  it("rejects a from day that is after to, and accepts the same calendar day", () => {
    expect(DATE_RANGE_ERROR).toBe("From must be on or before To");
    expect(
      isDateRangeInvalid({
        from: new Date(2026, 7, 14, 18, 0),
        to: new Date(2026, 7, 14, 1, 0),
      }),
    ).toBe(false);
    expect(
      isDateRangeInvalid({
        from: new Date(2026, 7, 15),
        to: new Date(2026, 7, 14),
      }),
    ).toBe(true);
    expect(isDateRangeInvalid({ from: new Date(2026, 7, 1), to: null })).toBe(false);
  });

  it("compares drawer drafts by option value and calendar day", () => {
    const committed = {
      owner: [{ value: "asha", label: "Asha" }],
      due: { from: new Date(2026, 7, 1, 8), to: null },
    };
    const same = {
      owner: [{ value: "asha", label: "Other label" }],
      due: { from: new Date(2026, 7, 1, 20), to: null },
    };
    const differentOrder = {
      owner: [
        { value: "leo", label: "Leo" },
        { value: "asha", label: "Asha" },
      ],
      due: { from: new Date(2026, 7, 1), to: null },
    };
    expect(drawerDraftEqualsCommitted([owner, due], committed, same)).toBe(true);
    expect(
      drawerDraftEqualsCommitted(
        [owner],
        { owner: [{ value: "asha", label: "Asha" }, { value: "leo", label: "Leo" }] },
        differentOrder,
      ),
    ).toBe(false);
  });

  it("keeps the first field when ids repeat", () => {
    const second = { ...search, label: "Query", placement: "drawer" as const };
    expect(dedupeFields([search, second])).toEqual({
      fields: [search],
      duplicateIds: ["q"],
    });
  });

  it("replaces one key and preserves the rest", () => {
    expect(withFieldValue({ q: "", status: null }, "q", "a")).toEqual({
      q: "a",
      status: null,
    });
    expect(emptyValue(search)).toBe("");
  });
});
