import React, {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  autoUpdate,
  flip,
  FloatingPortal,
  offset,
  shift,
  size,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
} from "@floating-ui/react";
import Icon from "../icon";
import type { MaterialIconName } from "../icon/material-icon-names";
import Spinner from "../spinner";
import styles from "./FormControls.module.scss";
import getClassNames from "../../utils/get-class-names";

const MSG_SYNC_NO_OPTIONS = "No options available";
const MSG_SYNC_NO_MATCH = "No matching results";
const MSG_ASYNC_EMPTY = "No results";
const MSG_ASYNC_ERROR =
  "Couldn’t load options. Check your connection and try again.";

/** Frozen Select plan: viewport → bottom sheet shell instead of anchored dropdown. */
const SELECT_MOBILE_SHEET_MEDIA = "(max-width: 768px)";

/** Keep in sync with `FormControls.module.scss` (`--cp-select-mobile-sheet-ms`). */
const SELECT_MOBILE_SHEET_MS = 300;
/** Desktop dropdown fade; sync `--cp-select-desktop-panel-ms` in SCSS. */
const SELECT_DESKTOP_DROPDOWN_MS = 200;

function toCssLength(value: number | string): string {
  return typeof value === "number" ? `${value}px` : value;
}

function selectOptionTestKey(value: string | number): string {
  const key = String(value).replace(/\W/g, "-");
  return key || "option";
}

/** Root `dataTestId` plus `{base}-{suffix}` on trigger, panel, listbox, options, etc. */
function selectFieldTestId(
  base: string | undefined,
  suffix: string,
): string | undefined {
  return base ? `${base}-${suffix}` : undefined;
}

const SELECT_MOBILE_SHEET_SURFACE_STYLE: React.CSSProperties = {
  position: "fixed",
  left: 0,
  right: 0,
  bottom: 0,
  top: "auto",
  width: "100%",
  maxWidth: "100vw",
  margin: 0,
  zIndex: 1100,
};

function useMediaQuery(matchesQuery: string): boolean {
  const [matches, setMatches] = useState(() => {
    if (
      typeof window === "undefined" ||
      typeof window.matchMedia !== "function"
    ) {
      return false;
    }
    return window.matchMedia(matchesQuery).matches;
  });

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      typeof window.matchMedia !== "function"
    ) {
      return undefined;
    }
    const mq = window.matchMedia(matchesQuery);
    const listener = (): void => {
      setMatches(mq.matches);
    };
    listener();
    mq.addEventListener("change", listener);
    return () => mq.removeEventListener("change", listener);
  }, [matchesQuery]);

  return matches;
}

/** Stable DOM id per rendered presentation row (`rowIdx` aligns with filtering / groups). */
function selectPresentationRowDomId(fieldId: string, rowIdx: number): string {
  return `${fieldId}-list-row-${rowIdx}`;
}

/** One row in `options`; richer fields (`group`, `icon`, …) are used in later select phases. */
export interface Option {
  value: string | number;
  label: string;
  group?: string;
  icon?: string;
  avatar?: string;
  meta?: string;
  disabled?: boolean;
}

/**
 * @deprecated Use `Option`; name kept for backwards compatibility.
 */
export type SelectOption = Option;

/** Current selection: one option, many options, or none. */
export type SelectValue = Option | Option[] | null;

export interface SelectProps {
  name?: string;
  id?: string;
  /**
   * Emits one `Option` (single), an array (multi), or `null` when cleared (single clear control).
   * Multi clears use `[]`.
   */
  onChange?: (option: Option | Option[] | null) => void;
  /**
   * Multi only: maximum number of selections shown as chips before a `+N` overflow badge.
   * @default 2
   */
  triggerMaxItems?: number;
  /**
   * When true, the trigger shows an action to clear the selection (when not disabled).
   * @default true
   */
  clearable?: boolean;
  value?: SelectValue;
  label?: string;
  isDisabled?: boolean;
  className?: string;
  triggerClassName?: string;
  triggerActiveClassName?: string;
  contentsClassName?: string;
  /**
   * Desktop dropdown only: minimum width of the portalled options panel (px number or CSS length).
   * The panel still matches the trigger width when it is wider; use this when options are longer than the trigger.
   * Ignored on mobile (≤768px bottom sheet is full viewport width).
   */
  panelMinWidth?: number | string;
  /**
   * Option list when static. Pass `null` with `onSearch` for async/search-backed data.
   * Omit or pass an array — use `undefined`/`[]` for an empty sync list.
   */
  options?: Option[] | null;
  /**
   * Required when `options` is `null`. Debounced by `searchDebounce` (ms).
   */
  onSearch?: (query: string) => Promise<Option[]>;
  /**
   * Debounce applied to `onSearch` only. An empty query runs immediately (no wait).
   * @default 300
   */
  searchDebounce?: number;
  /**
   * When false, hides the panel search field and shows the full static list (or async results for `onSearch("")`).
   * @default true
   */
  searchable?: boolean;
  /** Placeholder for the panel search field. @default "Search" */
  searchPlaceholder?: string;
  /**
   * When provided, panel shows an “add” action when search text doesn’t match any option.
   * The trimmed search string is passed back — callers create the `{ label, value }` if needed.
   */
  onAddOption?: (value: string) => void;
  /**
   * Close the panel after `onAddOption` runs successfully (sync).
   * @default true
   */
  closeOnAddOption?: boolean;
  isRequired?: boolean;
  placeholder?: string;
  error?: string;
  isFluid?: boolean;
  /**
   * Selection behaviour. Defaults to `'single'`.
   * When set, overrides the legacy `isMulti` flag.
   */
  mode?: "single" | "multi";
  /**
   * @deprecated Use {@link SelectProps.mode `mode='multi'`} instead.
   */
  isMulti?: boolean;
  /**
   * When true, contiguous options with the same non-empty {@link Option.group} show a sticky-style heading row.
   * @default false
   */
  groups?: boolean;
  /**
   * Multi only: maximum number of selectable options at once (no effect in single-mode).
   * When the cap is reached, unselected options look disabled until you remove some.
   * “Select all” adds only until the cap.
   */
  maxSelect?: number;
  /**
   * Root `data-testid` on the field wrapper. When set, related elements also get
   * suffixed ids: `-trigger`, `-clear`, `-panel`, `-search`, `-search-clear`,
   * `-listbox`, `-option-{value}`, `-input` (hidden `name` field), `-error`.
   */
  dataTestId?: string;
}

type AsyncPanelStatus = "idle" | "loading" | "success" | "error";

type OptionPresentationRow =
  | { kind: "header"; id: string; label: string }
  | { kind: "option"; option: Option };

const Select: React.FC<SelectProps> = ({
  name,
  id,
  onChange,
  value,
  label = "",
  isDisabled = false,
  className = "",
  triggerClassName = "",
  triggerActiveClassName = "",
  contentsClassName = "",
  panelMinWidth,
  options,
  onSearch,
  searchDebounce = 300,
  searchable = true,
  searchPlaceholder = "Search",
  onAddOption,
  closeOnAddOption = true,
  isRequired = false,
  placeholder = "Select an option",
  error = "",
  isFluid = false,
  mode,
  isMulti = false,
  triggerMaxItems = 2,
  clearable = true,
  groups = false,
  maxSelect,
  dataTestId,
}) => {
  const resolvedMode: "single" | "multi" =
    mode !== undefined ? mode : isMulti ? "multi" : "single";
  const isMultiMode = resolvedMode === "multi";

  const cappedMaxSelections =
    isMultiMode &&
    typeof maxSelect === "number" &&
    Number.isFinite(maxSelect) &&
    maxSelect >= 1
      ? Math.floor(maxSelect)
      : null;

  const isAsyncMode = options === null;
  const syncOptionSource = isAsyncMode ? [] : (options ?? []);

  useEffect(() => {
    if (isAsyncMode && !onSearch) {
      // eslint-disable-next-line no-console
      console.warn(
        "CleanPlate Select: `options={null}` requires an `onSearch` callback."
      );
    }
  }, [isAsyncMode, onSearch]);

  useEffect(() => {
    if (!searchable && onAddOption) {
      // eslint-disable-next-line no-console
      console.warn(
        "CleanPlate Select: `onAddOption` requires `searchable` (search field) to enter a new value."
      );
    }
  }, [searchable, onAddOption]);

  const generatedId = useId();
  const fieldId = id ?? name ?? generatedId;
  const labelId = `${fieldId}-label`;
  const triggerId = `${fieldId}-trigger`;
  const listboxId = `${fieldId}-listbox`;
  const searchInputId = `${fieldId}-search`;
  const errorId = `${fieldId}-error`;

  const searchInputRef = useRef<HTMLInputElement>(null);
  const selectAllCheckboxRef = useRef<HTMLInputElement>(null);
  const asyncRequestSeqRef = useRef(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [asyncOptions, setAsyncOptions] = useState<Option[]>([]);
  const [asyncStatus, setAsyncStatus] = useState<AsyncPanelStatus>("idle");
  const [retryNonce, setRetryNonce] = useState(0);

  const [isOpen, setIsOpen] = useState(false);
  /** Floating list keyboard highlight index into {@link navigableFlat}. */
  const [activeNavIndex, setActiveNavIndex] = useState<number | null>(null);
  /** When opened via Arrow keys on trigger, anchor highlight to first/last row once options mount. */
  const pendingKeyboardOpenRef = useRef<"first" | "last" | null>(null);
  const isMobileSheetViewport = useMediaQuery(SELECT_MOBILE_SHEET_MEDIA);
  const isMobileSheetViewportRef = useRef(isMobileSheetViewport);
  isMobileSheetViewportRef.current = isMobileSheetViewport;

  /** Post-mount “open” visuals (backdrop fade + sheet slide / desktop fade). */
  const [selectPanelEntered, setSelectPanelEntered] = useState(false);
  /** Keeps portal mounted until close transition finishes (mobile + desktop). */
  const [selectPanelExitAnimating, setSelectPanelExitAnimating] =
    useState(false);
  const selectPanelExitAnimatingRef = useRef(false);
  selectPanelExitAnimatingRef.current = selectPanelExitAnimating;

  const [selectedOption, setSelectedOption] = useState<
    Option | Option[] | null | undefined
  >(value);

  const floatingMiddleware = useMemo(
    () =>
      isMobileSheetViewport
        ? []
        : [
            offset(4),
            flip({ padding: 8 }),
            shift({ padding: 8 }),
            size({
              apply({ availableHeight, rects, elements }) {
                const panelStyle: Partial<CSSStyleDeclaration> = {
                  maxHeight: `${Math.max(96, Math.floor(availableHeight) - 12)}px`,
                  width: `${rects.reference.width}px`,
                };
                if (panelMinWidth != null) {
                  panelStyle.minWidth = toCssLength(panelMinWidth);
                }
                Object.assign(elements.floating.style, panelStyle);
              },
            }),
          ],
    [isMobileSheetViewport, panelMinWidth]
  );

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    placement: isMobileSheetViewport ? "bottom" : "bottom-start",
    strategy: "fixed",
    transform: !isMobileSheetViewport,
    middleware: floatingMiddleware,
    whileElementsMounted: isMobileSheetViewport ? undefined : autoUpdate,
    onOpenChange(nextOpen) {
      if (isDisabled) {
        return;
      }
      if (nextOpen) {
        setSelectPanelExitAnimating(false);
        setIsOpen(true);
        return;
      }
      if (isOpen) {
        setSelectPanelExitAnimating(true);
        setSelectPanelEntered(false);
        setIsOpen(false);
        return;
      }
      setSelectPanelExitAnimating(false);
      setIsOpen(false);
    },
  });

  const selectPanelMounted = isOpen || selectPanelExitAnimating;

  const handleSelectPanelTransitionEnd = useCallback(
    (event: React.TransitionEvent<HTMLDivElement>) => {
      if (event.target !== event.currentTarget) return;
      if (!selectPanelExitAnimatingRef.current) return;
      const mobile = isMobileSheetViewportRef.current;
      if (mobile && event.propertyName !== "transform") return;
      if (!mobile && event.propertyName !== "opacity") return;
      setSelectPanelExitAnimating(false);
    },
    [],
  );

  const click = useClick(context, {
    enabled: !isDisabled,
  });
  const dismiss = useDismiss(context, {
    ancestorScroll: !isMobileSheetViewport,
    bubbles: false,
    outsidePressEvent: "pointerdown",
  });
  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    dismiss,
  ]);

  /** Programmatic closes mirror dismiss exit timing (slide / fade). */
  const closeFloatingPanel = useCallback(() => {
    if (isOpen) {
      setSelectPanelExitAnimating(true);
      setSelectPanelEntered(false);
      setIsOpen(false);
      return;
    }
    setSelectPanelExitAnimating(false);
    setIsOpen(false);
  }, [isOpen]);

  useLayoutEffect(() => {
    if (!isOpen) {
      if (!selectPanelExitAnimating) {
        setSelectPanelEntered(false);
      }
      return undefined;
    }
    const id = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => setSelectPanelEntered(true));
    });
    return () => window.cancelAnimationFrame(id);
  }, [isOpen, selectPanelExitAnimating]);

  const filteredSyncOptions = useMemo(() => {
    if (!searchable) {
      return syncOptionSource;
    }
    const q = searchQuery.trim().toLowerCase();
    if (!q) {
      return syncOptionSource;
    }
    return syncOptionSource.filter(
      (o) =>
        String(o.label).toLowerCase().includes(q) ||
        String(o.value).toLowerCase().includes(q)
    );
  }, [syncOptionSource, searchQuery, searchable]);

  const displayedOptions = isAsyncMode ? asyncOptions : filteredSyncOptions;

  const syncEmptyPanel =
    !isAsyncMode && selectPanelMounted && filteredSyncOptions.length === 0;

  const asyncLoadingPanel =
    isAsyncMode &&
    selectPanelMounted &&
    (asyncStatus === "loading" || asyncStatus === "idle");

  const asyncErrorPanel =
    isAsyncMode && selectPanelMounted && asyncStatus === "error";

  const asyncEmptyPanel =
    isAsyncMode &&
    selectPanelMounted &&
    asyncStatus === "success" &&
    asyncOptions.length === 0;

  const showOptionRows =
    selectPanelMounted &&
    !syncEmptyPanel &&
    !asyncLoadingPanel &&
    !asyncErrorPanel &&
    !asyncEmptyPanel &&
    displayedOptions.length > 0;

  const syncEmptyMessage =
    syncOptionSource.length === 0 ? MSG_SYNC_NO_OPTIONS : MSG_SYNC_NO_MATCH;

  const addQueryTrimmed = searchQuery.trim();
  const addQueryNormalized = addQueryTrimmed.toLowerCase();
  const duplicateAddAgainstList =
    addQueryTrimmed.length > 0 &&
    displayedOptions.some(
      (o) =>
        String(o.label).trim().toLowerCase() === addQueryNormalized ||
        String(o.value).toLowerCase() === addQueryNormalized
    );

  const panelHasNoSelectableRows =
    selectPanelMounted &&
    !asyncLoadingPanel &&
    !asyncErrorPanel &&
    displayedOptions.length === 0 &&
    ((syncEmptyPanel && addQueryTrimmed.length > 0) ||
      asyncEmptyPanel);

  const showAddOptionRow =
    Boolean(onAddOption) &&
    !isDisabled &&
    panelHasNoSelectableRows &&
    !duplicateAddAgainstList;

  const showResultsEmptyRegion = syncEmptyPanel || asyncEmptyPanel;

  const optionPresentationRows = useMemo((): OptionPresentationRow[] => {
    if (!showOptionRows || displayedOptions.length === 0) {
      return [];
    }
    if (!groups) {
      return displayedOptions.map((option) => ({
        kind: "option" as const,
        option,
      }));
    }
    let previousBucket: string | undefined;
    const rows: OptionPresentationRow[] = [];
    displayedOptions.forEach((option, idx) => {
      const bucket = option.group?.trim() ?? "";
      if (bucket !== previousBucket) {
        if (bucket) {
          rows.push({
            kind: "header",
            id: `select-group-${bucket}-${idx}`,
            label: bucket,
          });
        }
        previousBucket = bucket;
      }
      rows.push({ kind: "option", option });
    });
    return rows;
  }, [displayedOptions, groups, showOptionRows]);

  const selectableDisplayedOptions = useMemo(
    () => displayedOptions.filter((o) => !o.disabled),
    [displayedOptions]
  );

  const selectedArray = Array.isArray(selectedOption) ? selectedOption : [];
  const selectionValueSet = useMemo(
    () => new Set(selectedArray.map((o) => o.value)),
    [selectedArray]
  );

  const isAtSelectionCap =
    cappedMaxSelections != null &&
    selectedArray.length >= cappedMaxSelections;

  const {
    navigableFlat,
    presentationNavFlatIndex,
    navigableSourceRowIndexes,
  }: {
    navigableFlat: Option[];
    presentationNavFlatIndex: (number | null)[];
    navigableSourceRowIndexes: number[];
  } = useMemo(() => {
    const flat: Option[] = [];
    const sourcePresentationRows: number[] = [];
    const presIdx = new Array<number | null>(
      optionPresentationRows.length
    ).fill(null);
    optionPresentationRows.forEach((row, i) => {
      if (row.kind === "header") return;
      const opt = row.option;
      const isSel = isMultiMode
        ? selectedArray.some((s) => s.value === opt.value)
        : Boolean(
            selectedOption &&
              !Array.isArray(selectedOption) &&
              selectedOption.value === opt.value
          );
      const blockedByCapNav =
        isMultiMode &&
        isAtSelectionCap &&
        !opt.disabled &&
        !isSel;
      const navigable = !opt.disabled && !blockedByCapNav;
      if (!navigable) return;
      presIdx[i] = flat.length;
      flat.push(opt);
      sourcePresentationRows.push(i);
    });
    return {
      navigableFlat: flat,
      presentationNavFlatIndex: presIdx,
      navigableSourceRowIndexes: sourcePresentationRows,
    };
  }, [
    isAtSelectionCap,
    isMultiMode,
    optionPresentationRows,
    selectedArray,
    selectedOption,
  ]);

  const allEligibleVisibleSelected =
    selectableDisplayedOptions.length > 0 &&
    selectableDisplayedOptions.every((o) => selectionValueSet.has(o.value));

  const someEligibleVisibleSelected =
    selectableDisplayedOptions.some((o) => selectionValueSet.has(o.value)) &&
    !allEligibleVisibleSelected;

  const showMultiBulkBar =
    showOptionRows && isMultiMode && selectableDisplayedOptions.length > 0;

  const hasSingleSelection =
    selectedOption != null && !Array.isArray(selectedOption);
  const hasMultiSelection = isMultiMode && selectedArray.length > 0;
  const hasSelection = hasMultiSelection || hasSingleSelection;

  const maxChips =
    typeof triggerMaxItems === "number" &&
    Number.isFinite(triggerMaxItems) &&
    triggerMaxItems >= 0
      ? Math.floor(triggerMaxItems)
      : 2;
  const visibleChips = hasMultiSelection
    ? selectedArray.slice(0, maxChips)
    : [];
  const overflowChipCount =
    hasMultiSelection && maxChips < selectedArray.length
      ? selectedArray.length - maxChips
      : 0;

  const singleSelectValue =
    hasSingleSelection &&
    typeof selectedOption === "object" &&
    "label" in selectedOption
      ? selectedOption.label
      : "";

  const selectHeaderOpenClass = isOpen
    ? `${styles["cp-select-field-header-open"]} ${triggerActiveClassName}`
    : "";
  const selectHeaderWrapperClass = `${styles["cp-select-field-header"]} ${selectHeaderOpenClass} ${triggerClassName}`;

  const handleClearTrigger = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (isDisabled) return;
    if (isMultiMode) {
      setSelectedOption([]);
      onChange?.([]);
    } else {
      setSelectedOption(null);
      onChange?.(null);
    }
    closeFloatingPanel();
  };

  const handleChipRemove =
    (toRemove: Option) => (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      event.stopPropagation();
      if (isDisabled || !isMultiMode) return;
      const current = Array.isArray(selectedOption) ? selectedOption : [];
      const next = current.filter((o) => o.value !== toRemove.value);
      setSelectedOption(next);
      onChange?.(next);
    };

  const focusTrigger = () => {
    const el = document.getElementById(triggerId);
    if (el instanceof HTMLElement) el.focus();
  };

  const applyOptionSelection = (optionValue: Option) => {
    if (optionValue.disabled || isDisabled) return;
    if (isMultiMode) {
      const current = Array.isArray(selectedOption) ? selectedOption : [];
      const values = current.map((s) => s.value);
      const already = values.includes(optionValue.value);
      if (!already && isAtSelectionCap) return;
      if (already) {
        const selection = current.filter((f) => f.value !== optionValue.value);
        setSelectedOption(selection);
        onChange?.(selection);
      } else {
        const selection = [...current, optionValue];
        setSelectedOption(selection);
        onChange?.(selection);
      }
    } else {
      setSelectedOption(optionValue);
      onChange?.(optionValue);
    }
    closeFloatingPanel();
  };

  const handleBulkSelectAllChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    event.stopPropagation();
    if (isDisabled || !isMultiMode) return;
    const eligible = selectableDisplayedOptions;
    if (eligible.length === 0) return;

    const visibleValues = new Set(eligible.map((o) => o.value));

    if (allEligibleVisibleSelected) {
      const next = selectedArray.filter((s) => !visibleValues.has(s.value));
      setSelectedOption(next);
      onChange?.(next);
      return;
    }

    let next = [...selectedArray];
    const cap = cappedMaxSelections ?? Number.MAX_SAFE_INTEGER;
    const merged = new Set(next.map((o) => o.value));
    for (const o of eligible) {
      if (next.length >= cap) break;
      if (!merged.has(o.value)) {
        next.push(o);
        merged.add(o.value);
      }
    }
    setSelectedOption(next);
    onChange?.(next);
  };

  const handleBulkClearAll = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (isDisabled || !isMultiMode || selectedArray.length === 0) return;
    setSelectedOption([]);
    onChange?.([]);
  };

  const handleOptionClick = (
    event: React.MouseEvent,
    optionValue: Option
  ) => {
    if (optionValue.disabled || isDisabled) {
      return;
    }
    event.stopPropagation();
    event.preventDefault();
    applyOptionSelection(optionValue);
  };

  const handleFloatingKeyDownCapture = (
    event: React.KeyboardEvent<HTMLDivElement>
  ) => {
    if (!isOpen || isDisabled) return;
    const floatingEl = refs.floating.current;
    if (!floatingEl?.contains(event.target as Node)) return;

    if (event.key === "Tab") {
      event.preventDefault();
      closeFloatingPanel();
      queueMicrotask(focusTrigger);
      return;
    }

    const target = event.target as HTMLElement | null;
    const onNonOptionButton =
      !!target?.closest("button") && !target?.closest('[role="option"]');
    if (onNonOptionButton && event.key === "Enter") {
      return;
    }

    if (!showOptionRows || navigableFlat.length === 0) return;

    const nativeKb = event.nativeEvent as KeyboardEvent;
    if (nativeKb.isComposing) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveNavIndex((prev) => {
        if (prev == null) return 0;
        return Math.min(prev + 1, navigableFlat.length - 1);
      });
      return;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveNavIndex((prev) => {
        if (prev == null) return navigableFlat.length - 1;
        return Math.max(prev - 1, 0);
      });
      return;
    }
    if (event.key === "Home") {
      event.preventDefault();
      setActiveNavIndex(0);
      return;
    }
    if (event.key === "End") {
      event.preventDefault();
      setActiveNavIndex(navigableFlat.length - 1);
      return;
    }
    if (event.key === "Enter") {
      event.preventDefault();
      const idx =
        activeNavIndex != null
          ? activeNavIndex
          : navigableFlat.length > 0
            ? 0
            : null;
      if (idx != null && idx >= 0 && idx < navigableFlat.length) {
        applyOptionSelection(navigableFlat[idx]);
      }
    }
  };

  const focusPanelListbox = useCallback(() => {
    const el = document.getElementById(listboxId);
    if (el instanceof HTMLElement) {
      el.focus();
    }
  }, [listboxId]);

  const handleRetrySearch = () => {
    setRetryNonce((n) => n + 1);
    if (searchable) {
      searchInputRef.current?.focus();
    } else {
      focusPanelListbox();
    }
  };

  const handleAddOptionConfirm = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    const next = searchQuery.trim();
    if (!next || isDisabled || duplicateAddAgainstList) return;
    onAddOption?.(next);
    setSearchQuery("");
    if (closeOnAddOption) {
      closeFloatingPanel();
    } else if (searchable) {
      searchInputRef.current?.focus();
    } else {
      focusPanelListbox();
    }
  };

  const searchAriaActiveDescendant =
    activeNavIndex != null &&
    showOptionRows &&
    navigableFlat[activeNavIndex] &&
    navigableSourceRowIndexes[activeNavIndex] !== undefined
      ? selectPresentationRowDomId(
          fieldId,
          navigableSourceRowIndexes[activeNavIndex],
        )
      : undefined;

  useEffect(() => {
    if (!isOpen) {
      pendingKeyboardOpenRef.current = null;
      setActiveNavIndex(null);
    }
  }, [isOpen]);

  useEffect(() => {
    setActiveNavIndex(null);
  }, [searchQuery]);

  useEffect(() => {
    if (!isOpen || !pendingKeyboardOpenRef.current) return;
    if (!showOptionRows || navigableFlat.length === 0) return;
    const pend = pendingKeyboardOpenRef.current;
    pendingKeyboardOpenRef.current = null;
    setActiveNavIndex(pend === "first" ? 0 : navigableFlat.length - 1);
  }, [isOpen, showOptionRows, navigableFlat]);

  useEffect(() => {
    if (activeNavIndex == null || !showOptionRows) return;
    if (navigableFlat.length === 0) {
      setActiveNavIndex(null);
      return;
    }
    if (activeNavIndex >= navigableFlat.length) {
      setActiveNavIndex(navigableFlat.length - 1);
    }
  }, [activeNavIndex, navigableFlat, showOptionRows]);

  useLayoutEffect(() => {
    if (
      activeNavIndex == null ||
      !showOptionRows ||
      navigableFlat[activeNavIndex] == null ||
      navigableSourceRowIndexes[activeNavIndex] === undefined
    ) {
      return undefined;
    }
    const anchorId = selectPresentationRowDomId(
      fieldId,
      navigableSourceRowIndexes[activeNavIndex],
    );
    document.getElementById(anchorId)?.scrollIntoView({
      block: "nearest",
      inline: "nearest",
    });
    return undefined;
  }, [activeNavIndex, navigableFlat, navigableSourceRowIndexes, showOptionRows, fieldId]);

  useEffect(() => {
    if (!isDisabled) return;
    closeFloatingPanel();
  }, [isDisabled, closeFloatingPanel]);

  /** Mobile sheet: stop background page scroll/bounce while the dialog is open (iOS chaining). */
  useEffect(() => {
    const lock =
      isMobileSheetViewport && (isOpen || selectPanelExitAnimating);
    if (!lock) {
      return undefined;
    }
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMobileSheetViewport, isOpen, selectPanelExitAnimating]);

  useEffect(() => {
    if (!isMobileSheetViewport) {
      setSelectPanelExitAnimating(false);
    }
  }, [isMobileSheetViewport]);

  useEffect(() => {
    if (!selectPanelExitAnimating) return undefined;
    const fallbackMs =
      (isMobileSheetViewport ? SELECT_MOBILE_SHEET_MS : SELECT_DESKTOP_DROPDOWN_MS) +
      80;
    const id = window.setTimeout(() => {
      setSelectPanelExitAnimating(false);
    }, fallbackMs);
    return () => window.clearTimeout(id);
  }, [selectPanelExitAnimating, isMobileSheetViewport]);

  useEffect(() => {
    setSelectedOption(value);
  }, [value]);

  useEffect(() => {
    const el = selectAllCheckboxRef.current;
    if (!el) return;
    el.indeterminate = someEligibleVisibleSelected;
  }, [someEligibleVisibleSelected]);

  useEffect(() => {
    if (!selectPanelMounted) {
      asyncRequestSeqRef.current += 1;
      setSearchQuery("");
      setAsyncOptions([]);
      setAsyncStatus("idle");
      return undefined;
    }
    if (!isOpen) {
      return undefined;
    }
    /* Mobile sheet: avoid autofocus so the OS keyboard doesn’t jump in immediately. */
    if (isMobileSheetViewport) {
      return undefined;
    }
    const rid = window.requestAnimationFrame(() => {
      if (searchable) {
        searchInputRef.current?.focus();
      } else {
        focusPanelListbox();
      }
    });
    return () => window.cancelAnimationFrame(rid);
  }, [
    selectPanelMounted,
    isOpen,
    isMobileSheetViewport,
    searchable,
    focusPanelListbox,
  ]);

  useEffect(() => {
    if (!isOpen || !isAsyncMode || !onSearch) return;

    let cancelled = false;
    const delayMs =
      searchQuery.trim() === "" ? 0 : Math.max(0, Number(searchDebounce) || 0);

    const timer = window.setTimeout(() => {
      const seq = asyncRequestSeqRef.current + 1;
      asyncRequestSeqRef.current = seq;
      setAsyncStatus("loading");

      const query = searchQuery.trim();
      onSearch(query)
        .then((res) => {
          if (cancelled) return;
          if (asyncRequestSeqRef.current !== seq) return;
          setAsyncStatus("success");
          setAsyncOptions(Array.isArray(res) ? res : []);
        })
        .catch(() => {
          if (cancelled) return;
          if (asyncRequestSeqRef.current !== seq) return;
          setAsyncStatus("error");
          setAsyncOptions([]);
        });
    }, delayMs);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [
    isOpen,
    isAsyncMode,
    onSearch,
    searchDebounce,
    searchQuery,
    retryNonce,
  ]);

  return (
    <div
      className={getClassNames(
        styles["cp-form-field"],
        {
          [styles["cp-form-field-fluid"]]: isFluid,
          [styles["cp-form-field-disabled"]]: isDisabled,
        },
        className
      )}
      data-testid={dataTestId}
    >
      {label && (
        <label
          id={labelId}
          htmlFor={triggerId}
          className={styles["cp-form-label"]}
        >
          {label}{" "}
          {isRequired && <span aria-hidden="true">*</span>}
        </label>
      )}
      <div
        className={styles["cp-select-field"]}
        data-invalid={error ? "true" : undefined}
      >
        <div
          ref={refs.setReference}
          data-testid={selectFieldTestId(dataTestId, "trigger")}
          {...getReferenceProps({
            id: triggerId,
            role: "combobox",
            tabIndex: isDisabled ? -1 : 0,
            "aria-haspopup": "listbox",
            "aria-expanded": isOpen,
            "aria-controls": isOpen ? listboxId : undefined,
            "aria-labelledby": label ? labelId : undefined,
            "aria-disabled": isDisabled || undefined,
            "aria-required": isRequired || undefined,
            "aria-invalid": error ? true : undefined,
            "aria-describedby": error ? errorId : undefined,
            className: selectHeaderWrapperClass,
            onKeyDown(event: React.KeyboardEvent) {
              if (event.key !== "ArrowDown" && event.key !== "ArrowUp") {
                return;
              }
              if (isOpen || isDisabled) return;
              event.preventDefault();
              pendingKeyboardOpenRef.current =
                event.key === "ArrowDown" ? "first" : "last";
              setIsOpen(true);
            },
          })}
        >
          <div className={styles["cp-select-trigger-main"]}>
            {hasMultiSelection ? (
              <div className={styles["cp-select-chips"]}>
                {visibleChips.map((opt) => (
                  <span
                    key={String(opt.value)}
                    className={styles["cp-select-chip"]}
                  >
                    <span className={styles["cp-select-chip-label"]}>
                      {opt.label}
                    </span>
                    <button
                      type="button"
                      tabIndex={-1}
                      className={styles["cp-select-chip-remove"]}
                      aria-label={`Remove ${opt.label}`}
                      disabled={isDisabled}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onClick={handleChipRemove(opt)}
                    >
                      <Icon name="close" size="small" color="gray" />
                    </button>
                  </span>
                ))}
                {overflowChipCount > 0 && (
                  <span
                    className={styles["cp-select-overflow"]}
                    aria-label={`${overflowChipCount} more selected`}
                  >
                    +{overflowChipCount}
                  </span>
                )}
              </div>
            ) : hasSingleSelection ? (
              <span className={styles["cp-select-value"]}>
                {singleSelectValue}
              </span>
            ) : (
              <span className={styles["cp-select-placeholder"]}>
                {placeholder}
              </span>
            )}
          </div>
          <div className={styles["cp-select-trigger-actions"]}>
            {clearable && hasSelection && !isDisabled && (
              <button
                type="button"
                tabIndex={-1}
                className={styles["cp-select-trigger-clear"]}
                aria-label="Clear selection"
                data-testid={selectFieldTestId(dataTestId, "clear")}
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onClick={handleClearTrigger}
              >
                <Icon name="close" size="small" color="gray" />
              </button>
            )}
            <Icon
              name={isOpen ? "arrow_drop_up" : "arrow_drop_down"}
              className={`arrow ${isOpen ? "up" : "down"}`}
              aria-hidden
            />
          </div>
        </div>
        {selectPanelMounted && (
          <FloatingPortal>
            {isMobileSheetViewport ? (
              <div
                className={styles["cp-select-mobile-backdrop"]}
                data-visible={
                  isMobileSheetViewport && selectPanelEntered
                    ? "true"
                    : undefined
                }
                aria-hidden
              />
            ) : null}
            <div
              ref={refs.setFloating}
              data-testid={selectFieldTestId(dataTestId, "panel")}
              {...getFloatingProps({
                style: isMobileSheetViewport
                  ? SELECT_MOBILE_SHEET_SURFACE_STYLE
                  : floatingStyles,
                className: getClassNames(
                  styles["cp-select-field-options"],
                  isMobileSheetViewport && styles["cp-select-mobile-sheet"],
                  isMobileSheetViewport &&
                    selectPanelEntered &&
                    styles["cp-select-mobile-sheet-entered"],
                  !isMobileSheetViewport && styles["cp-select-dropdown-panel"],
                  !isMobileSheetViewport &&
                    selectPanelEntered &&
                    styles["cp-select-dropdown-panel-entered"],
                  contentsClassName
                ),
                onKeyDownCapture: handleFloatingKeyDownCapture,
                onTransitionEnd: handleSelectPanelTransitionEnd,
                ...(isMobileSheetViewport
                  ? {
                      id: `${fieldId}-select-panel`,
                      role: "dialog",
                      "aria-modal": true as const,
                      "aria-labelledby": label ? labelId : undefined,
                    }
                  : {}),
              })}
            >
              {searchable ? (
              <div
                className={styles["cp-select-panel-search"]}
                role="presentation"
                onPointerDown={(e) => {
                  /*
                   * Unconditional preventDefault broke mobile touch: activation/focus never
                   * reached the search input. Skip for interactive descendants.
                   */
                  const t = e.target as HTMLElement | null;
                  if (t?.closest("input, button, textarea, label")) {
                    return;
                  }
                  e.preventDefault();
                }}
              >
                <div className={styles["cp-select-search-wrap"]}>
                  <Icon
                    name="search"
                    className={styles["cp-select-search-icon"]}
                    aria-hidden
                  />
                  <input
                    ref={searchInputRef}
                    id={searchInputId}
                    type="search"
                    className={getClassNames(
                      styles["cp-select-search-input"],
                      searchQuery && styles["cp-select-search-input-has-clear"]
                    )}
                    placeholder={searchPlaceholder}
                    autoComplete="off"
                    aria-label={label ? `Search ${label}` : "Search options"}
                    aria-autocomplete="list"
                    aria-controls={isOpen ? listboxId : undefined}
                    aria-activedescendant={searchAriaActiveDescendant}
                    aria-invalid={error ? true : undefined}
                    data-testid={selectFieldTestId(dataTestId, "search")}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery ? (
                    <button
                      type="button"
                      className={styles["cp-select-search-clear"]}
                      aria-label="Clear search"
                      data-testid={selectFieldTestId(dataTestId, "search-clear")}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSearchQuery("");
                        searchInputRef.current?.focus();
                      }}
                    >
                      <Icon name="close" size="small" color="gray" />
                    </button>
                  ) : null}
                </div>
              </div>
              ) : null}
              {showMultiBulkBar ? (
                <div
                  className={styles["cp-select-panel-bulk"]}
                  role="presentation"
                  onPointerDown={(e) => {
                    const t = e.target as HTMLElement | null;
                    if (t?.closest("input, button, textarea, label")) {
                      return;
                    }
                    e.preventDefault();
                  }}
                >
                  <label className={styles["cp-select-bulk-select-all"]}>
                    <input
                      ref={selectAllCheckboxRef}
                      type="checkbox"
                      className={styles["cp-select-bulk-checkbox"]}
                      checked={allEligibleVisibleSelected}
                      disabled={isDisabled}
                      tabIndex={-1}
                      aria-label={
                        label
                          ? `Select all matching ${label} options`
                          : "Select all matching options"
                      }
                      onChange={handleBulkSelectAllChange}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <span>Select all</span>
                  </label>
                  <button
                    type="button"
                    className={styles["cp-select-bulk-clear-all"]}
                    disabled={isDisabled || selectedArray.length === 0}
                    onMouseDown={(e) => {
                      e.preventDefault();
                    }}
                    onClick={handleBulkClearAll}
                  >
                    Clear all
                  </button>
                </div>
              ) : null}
              <div
                id={listboxId}
                data-testid={selectFieldTestId(dataTestId, "listbox")}
                role={showOptionRows ? "listbox" : "group"}
                tabIndex={!searchable && showOptionRows ? 0 : undefined}
                aria-label={
                  showOptionRows
                    ? label
                      ? undefined
                      : "Options"
                    : label
                      ? `${label} options panel`
                      : "Options panel"
                }
                aria-multiselectable={
                  showOptionRows && isMultiMode ? true : undefined
                }
                aria-labelledby={
                  showOptionRows && label ? labelId : undefined
                }
                aria-busy={asyncLoadingPanel || undefined}
                aria-invalid={error ? true : undefined}
                className={styles["cp-select-field-options-list"]}
              >
                {asyncLoadingPanel ? (
                  <div
                    className={styles["cp-select-panel-status"]}
                    aria-live="polite"
                  >
                    <Spinner size="small" margin="0" />
                    <span className={styles["cp-select-panel-status-text"]}>
                      Loading…
                    </span>
                  </div>
                ) : null}
                {asyncErrorPanel ? (
                  <div
                    className={styles["cp-select-panel-status"]}
                    role="alert"
                  >
                    <span className={styles["cp-select-panel-status-msg"]}>
                      {MSG_ASYNC_ERROR}
                    </span>
                    <button
                      type="button"
                      className={styles["cp-select-retry"]}
                      onMouseDown={(e) => {
                        e.preventDefault();
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRetrySearch();
                      }}
                    >
                      Retry
                    </button>
                  </div>
                ) : null}
                {showResultsEmptyRegion ? (
                  <div
                    className={getClassNames(
                      styles["cp-select-empty-region"],
                      showAddOptionRow &&
                        styles["cp-select-empty-region-has-add"]
                    )}
                  >
                    <div
                      className={styles["cp-select-panel-status"]}
                      aria-live="polite"
                    >
                      <span className={styles["cp-select-panel-status-msg"]}>
                        {syncEmptyPanel ? syncEmptyMessage : MSG_ASYNC_EMPTY}
                      </span>
                    </div>
                    {showAddOptionRow ? (
                      <button
                        type="button"
                        className={styles["cp-select-option-add"]}
                        onMouseDown={(e) => {
                          e.preventDefault();
                        }}
                        onClick={handleAddOptionConfirm}
                      >
                        <Icon
                          name="add_circle"
                          size="small"
                          className={styles["cp-select-option-add-icon"]}
                          aria-hidden
                        />
                        <span>
                          Add &quot;{addQueryTrimmed}&quot;
                        </span>
                      </button>
                    ) : null}
                  </div>
                ) : null}
                {showOptionRows
                  ? optionPresentationRows.map((row, rowIdx) => {
                      if (row.kind === "header") {
                        return (
                          <div
                            key={row.id}
                            className={
                              styles["cp-select-field-group-heading"]
                            }
                            role="presentation"
                          >
                            {row.label}
                          </div>
                        );
                      }
                      const { option } = row;
                      const navFlatIdx = presentationNavFlatIndex[rowIdx];
                      const isKeyboardActive =
                        navFlatIdx != null && navFlatIdx === activeNavIndex;
                      const isSelected = isMultiMode
                        ? selectedArray.some((s) => s.value === option.value)
                        : selectedOption &&
                          !Array.isArray(selectedOption) &&
                          option.value === selectedOption.value;
                      const blockedByCap =
                        isMultiMode &&
                        isAtSelectionCap &&
                        !option.disabled &&
                        !isSelected;
                      const hasMedia = Boolean(option.avatar || option.icon);
                      const presentationRowDomId =
                        selectPresentationRowDomId(fieldId, rowIdx);
                      return (
                        <div
                          key={`${presentationRowDomId}-${row.kind}`}
                          id={presentationRowDomId}
                          data-testid={selectFieldTestId(
                            dataTestId,
                            `option-${selectOptionTestKey(option.value)}`,
                          )}
                          role="option"
                          aria-selected={Boolean(isSelected)}
                          aria-disabled={
                            option.disabled || blockedByCap ? true : undefined
                          }
                          className={getClassNames(
                            styles["cp-select-field-option"],
                            hasMedia &&
                              styles["cp-select-field-option-has-media"],
                            option.disabled &&
                              styles["cp-select-field-option-disabled"],
                            blockedByCap &&
                              styles["cp-select-field-option-capped"],
                            isSelected &&
                              styles["cp-select-field-option-selected-row"],
                            isKeyboardActive &&
                              styles["cp-select-field-option-keyboard-active"]
                          )}
                          onMouseEnter={() => {
                            if (
                              navFlatIdx == null ||
                              option.disabled ||
                              isDisabled ||
                              blockedByCap
                            ) {
                              return;
                            }
                            setActiveNavIndex(navFlatIdx);
                          }}
                          onMouseDown={(e) => {
                            if (option.disabled || isDisabled || blockedByCap)
                              return;
                            e.preventDefault();
                          }}
                          onClick={(e) => handleOptionClick(e, option)}
                        >
                          {hasMedia ? (
                            <span
                              className={
                                styles["cp-select-field-option-leading"]
                              }
                              aria-hidden
                            >
                              {option.avatar ? (
                                <img
                                  src={option.avatar}
                                  alt=""
                                  className={
                                    styles["cp-select-field-option-avatar"]
                                  }
                                  draggable={false}
                                />
                              ) : option.icon ? (
                                <Icon
                                  name={
                                    option.icon as MaterialIconName
                                  }
                                  size="medium"
                                  className={
                                    styles["cp-select-field-option-icon"]
                                  }
                                />
                              ) : null}
                            </span>
                          ) : null}
                          <div
                            className={
                              styles["cp-select-field-option-body"]
                            }
                          >
                            <span className={styles["cp-select-field-option-label"]}>
                              {option.label}
                            </span>
                            {option.meta ? (
                              <span
                                className={styles["cp-select-field-option-meta"]}
                              >
                                {option.meta}
                              </span>
                            ) : null}
                          </div>
                          <span className={styles["cp-select-field-option-trailing"]}>
                            {isSelected ? (
                              <Icon
                                name="done"
                                className={
                                  styles["cp-select-field-option-selected"]
                                }
                              />
                            ) : null}
                          </span>
                        </div>
                      );
                    })
                  : null}
              </div>
            </div>
          </FloatingPortal>
        )}
      </div>
      {/* Hidden form control to participate in HTML form submission and validation */}
      {name && (
        <input
          type="hidden"
          name={name}
          data-testid={selectFieldTestId(dataTestId, "input")}
          value={
            isMultiMode
              ? selectedArray.map((s) => String(s.value)).join(",")
              : selectedOption && !Array.isArray(selectedOption)
                ? String(selectedOption.value)
                : ""
          }
        />
      )}
      {error && (
        <p
          id={errorId}
          role="alert"
          className={styles["cp-form-error-message"]}
          data-testid={selectFieldTestId(dataTestId, "error")}
        >
          {error}
        </p>
      )}
    </div>
  );
};

export default Select;
