import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useDatePickerState } from "./use-date-picker-state";

describe("useDatePickerState", () => {
  it("open copies committed calendar day to staged", () => {
    const d = new Date(2026, 4, 10);
    const { result } = renderHook(() =>
      useDatePickerState({
        value: d,
        defaultValue: undefined,
        onChange: vi.fn(),
        constraints: {},
      }),
    );
    act(() => result.current.open());
    expect(result.current.isOpen).toBe(true);
    expect(result.current.staged?.getFullYear()).toBe(2026);
    expect(result.current.staged?.getMonth()).toBe(4);
    expect(result.current.staged?.getDate()).toBe(10);
  });

  it("cancel restores staged from committed after selectDay", () => {
    const d = new Date(2026, 4, 10);
    const { result } = renderHook(() =>
      useDatePickerState({
        value: d,
        defaultValue: undefined,
        onChange: vi.fn(),
        constraints: {},
      }),
    );
    act(() => result.current.open());
    act(() => result.current.selectDay(new Date(2026, 4, 18)));
    expect(result.current.staged?.getDate()).toBe(18);
    act(() => result.current.cancel());
    expect(result.current.isOpen).toBe(false);
    expect(result.current.staged?.getDate()).toBe(10);
  });

  it("confirm calls onChange and closes", () => {
    const d = new Date(2026, 4, 10);
    const fn = vi.fn();
    const { result } = renderHook(() =>
      useDatePickerState({
        value: d,
        defaultValue: undefined,
        onChange: fn,
        constraints: {},
      }),
    );
    act(() => result.current.open());
    act(() => result.current.selectDay(new Date(2026, 4, 12)));
    act(() => result.current.confirm());
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn.mock.calls[0][0].getDate()).toBe(12);
    expect(result.current.isOpen).toBe(false);
  });
});
