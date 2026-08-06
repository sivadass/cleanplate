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
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  type Placement,
} from "@floating-ui/react";
import Icon from "../icon";
import getClassNames from "../../utils/get-class-names";
import styles from "./FormControls.module.scss";
import {
  DEFAULT_FORM_FIELD_MARGIN,
  getFormFieldMarginClass,
  type FormFieldMargin,
} from "./form-field-margin";
import { useMediaQuery } from "./date/use-media-query";
import Input from "./Input";

const COLOR_PICKER_SHEET_MEDIA = "(max-width: 768px)";

/** Keep in sync with `FormControls.module.scss` (`--cp-select-mobile-sheet-ms`). */
const COLOR_PICKER_MOBILE_SHEET_MS = 300;
/** Desktop fade — sync `--cp-select-desktop-panel-ms` (same as Select). */
const COLOR_PICKER_DESKTOP_PANEL_MS = 200;

type RGB = { r: number; g: number; b: number };
type HSV = { h: number; s: number; v: number };

const DEFAULT_COLOR_HEX = "#1264A3";

const COLOR_PICKER_MOBILE_SHEET_SURFACE_STYLE: React.CSSProperties = {
  position: "fixed",
  left: 0,
  right: 0,
  bottom: 0,
  top: "auto",
  width: "100%",
  maxWidth: "100vw",
  margin: 0,
  zIndex: "var(--cp-z-picker-panel)",
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function normalizeHex(value: string | null | undefined): string | null {
  if (value == null) return null;
  const cleaned = value.trim().replace(/^#/, "");
  if (!cleaned) return null;
  if (!/^[\da-fA-F]{3}$|^[\da-fA-F]{6}$/.test(cleaned)) return null;
  const expanded =
    cleaned.length === 3
      ? cleaned
          .split("")
          .map((char) => `${char}${char}`)
          .join("")
      : cleaned;
  return `#${expanded.toUpperCase()}`;
}

function hexToRgb(hex: string): RGB | null {
  const normalized = normalizeHex(hex);
  if (!normalized) return null;
  const value = normalized.slice(1);
  return {
    r: Number.parseInt(value.slice(0, 2), 16),
    g: Number.parseInt(value.slice(2, 4), 16),
    b: Number.parseInt(value.slice(4, 6), 16),
  };
}

function rgbToHex(rgb: RGB): string {
  const toHex = (value: number) => clamp(Math.round(value), 0, 255).toString(16).padStart(2, "0");
  return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`.toUpperCase();
}

function rgbToHsv(rgb: RGB): HSV {
  const r = clamp(rgb.r, 0, 255) / 255;
  const g = clamp(rgb.g, 0, 255) / 255;
  const b = clamp(rgb.b, 0, 255) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  let h = 0;
  if (delta !== 0) {
    if (max === r) {
      h = ((g - b) / delta) % 6;
    } else if (max === g) {
      h = (b - r) / delta + 2;
    } else {
      h = (r - g) / delta + 4;
    }
  }
  const hue = Math.round(((h * 60) + 360) % 360);
  const saturation = max === 0 ? 0 : Math.round((delta / max) * 100);
  const value = Math.round(max * 100);

  return { h: hue, s: saturation, v: value };
}

function hsvToRgb(hsv: HSV): RGB {
  const h = ((hsv.h % 360) + 360) % 360;
  const s = clamp(hsv.s, 0, 100) / 100;
  const v = clamp(hsv.v, 0, 100) / 100;

  const c = v * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = v - c;

  let rPrime = 0;
  let gPrime = 0;
  let bPrime = 0;

  if (h < 60) {
    rPrime = c;
    gPrime = x;
  } else if (h < 120) {
    rPrime = x;
    gPrime = c;
  } else if (h < 180) {
    gPrime = c;
    bPrime = x;
  } else if (h < 240) {
    gPrime = x;
    bPrime = c;
  } else if (h < 300) {
    rPrime = x;
    bPrime = c;
  } else {
    rPrime = c;
    bPrime = x;
  }

  return {
    r: Math.round((rPrime + m) * 255),
    g: Math.round((gPrime + m) * 255),
    b: Math.round((bPrime + m) * 255),
  };
}

/** Root `dataTestId` plus `{base}-{suffix}` on trigger, panel, and channel inputs. */
function colorFieldTestId(
  base: string | undefined,
  suffix: string,
): string | undefined {
  return base ? `${base}-${suffix}` : undefined;
}

export interface ColorPickerProps {
  /** Controlled hex value. Supports `#RGB` / `#RRGGBB` input and emits normalized `#RRGGBB`. */
  value?: string | null;
  /** Uncontrolled initial color (`#RGB` / `#RRGGBB`). */
  defaultValue?: string | null;
  onChange?: (color: string | null) => void;
  id?: string;
  name?: string;
  label?: string;
  placeholder?: string;
  clearable?: boolean;
  isDisabled?: boolean;
  /** When true, value cannot change and the picker does not open. */
  readOnly?: boolean;
  isRequired?: boolean;
  error?: string;
  isFluid?: boolean;
  /** Spacing suffix for outer margin. @default "b-4" */
  margin?: FormFieldMargin;
  /**
   * Root `data-testid` on the field wrapper. When set, interactive parts also get
   * suffixed ids: `-trigger`, `-clear`, `-panel`, `-swatch`, `-sv-area`, `-hue-slider`,
   * `-hex-input`, `-rgb-r`, `-rgb-g`, `-rgb-b`, `-input`.
   */
  dataTestId?: string;
  popoverPlacement?: Placement;
  onOpen?: () => void;
  onClose?: () => void;
  className?: string;
}

const ColorPicker: React.FC<ColorPickerProps> = ({
  value,
  defaultValue = DEFAULT_COLOR_HEX,
  onChange,
  id,
  name,
  label = "",
  placeholder = "Select color",
  clearable = true,
  isDisabled = false,
  readOnly = false,
  isRequired = false,
  error = "",
  isFluid = false,
  margin = DEFAULT_FORM_FIELD_MARGIN,
  dataTestId,
  popoverPlacement = "bottom-start",
  onOpen,
  onClose,
  className = "",
}) => {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const labelId = `${fieldId}-label`;
  const errorId = `${fieldId}-error`;
  const triggerId = `${fieldId}-trigger`;
  const panelDomId = `${fieldId}-color-panel`;

  const normalizedDefaultValue = useMemo(
    () => normalizeHex(defaultValue) ?? DEFAULT_COLOR_HEX,
    [defaultValue],
  );
  const normalizedControlledValue = useMemo(
    () => normalizeHex(value),
    [value],
  );

  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState<string | null>(
    normalizedDefaultValue,
  );

  const selectedHex = isControlled ? normalizedControlledValue : internalValue;

  const [isOpen, setIsOpen] = useState(false);
  const isMobileSheetViewport = useMediaQuery(COLOR_PICKER_SHEET_MEDIA);
  const isMobileSheetViewportRef = useRef(isMobileSheetViewport);
  isMobileSheetViewportRef.current = isMobileSheetViewport;

  const initialHsv = useMemo(() => {
    const rgb = hexToRgb(selectedHex ?? normalizedDefaultValue);
    return rgb ? rgbToHsv(rgb) : rgbToHsv({ r: 18, g: 100, b: 163 });
  }, [normalizedDefaultValue, selectedHex]);

  const [hsv, setHsv] = useState<HSV>(initialHsv);
  const hsvRef = useRef(hsv);
  hsvRef.current = hsv;

  const [hexInputValue, setHexInputValue] = useState(
    selectedHex ?? normalizedDefaultValue,
  );

  useEffect(() => {
    const nextHex = selectedHex ?? normalizedDefaultValue;
    const rgb = hexToRgb(nextHex);
    if (rgb) {
      setHsv(rgbToHsv(rgb));
    }
    if (!isOpen) {
      setHexInputValue(nextHex);
    }
  }, [isOpen, normalizedDefaultValue, selectedHex]);

  const prevOpenRef = useRef(isOpen);
  useEffect(() => {
    if (isOpen && !prevOpenRef.current) onOpen?.();
    if (!isOpen && prevOpenRef.current) onClose?.();
    prevOpenRef.current = isOpen;
  }, [isOpen, onClose, onOpen]);

  const [panelEntered, setPanelEntered] = useState(false);
  const [panelExitAnimating, setPanelExitAnimating] = useState(false);
  const panelExitAnimatingRef = useRef(false);
  panelExitAnimatingRef.current = panelExitAnimating;

  const beginClosingPanel = useCallback((closingAction: () => void) => {
    setPanelExitAnimating(true);
    setPanelEntered(false);
    closingAction();
  }, []);

  const floatingMiddleware = useMemo(
    () =>
      isMobileSheetViewport
        ? []
        : [offset(4), flip({ padding: 8 }), shift({ padding: 8 })],
    [isMobileSheetViewport],
  );

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen && !isDisabled && !readOnly,
    placement: isMobileSheetViewport ? "bottom" : popoverPlacement,
    strategy: "fixed",
    transform: !isMobileSheetViewport,
    middleware: floatingMiddleware,
    whileElementsMounted: isMobileSheetViewport ? undefined : autoUpdate,
    onOpenChange(openNext) {
      if (isDisabled || readOnly) return;
      if (openNext) {
        setPanelExitAnimating(false);
        setIsOpen(true);
        return;
      }
      if (isOpen) {
        beginClosingPanel(() => setIsOpen(false));
        return;
      }
      setPanelExitAnimating(false);
    },
  });

  const panelMounted = isOpen || panelExitAnimating;

  const handlePanelTransitionEnd = useCallback(
    (event: React.TransitionEvent<HTMLDivElement>) => {
      if (event.target !== event.currentTarget) return;
      if (!panelExitAnimatingRef.current) return;
      const mobile = isMobileSheetViewportRef.current;
      if (mobile && event.propertyName !== "transform") return;
      if (!mobile && event.propertyName !== "opacity") return;
      setPanelExitAnimating(false);
    },
    [],
  );

  useLayoutEffect(() => {
    if (!isOpen) {
      if (!panelExitAnimating) {
        setPanelEntered(false);
      }
      return undefined;
    }
    const animationFrame = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => setPanelEntered(true));
    });
    return () => window.cancelAnimationFrame(animationFrame);
  }, [isOpen, panelExitAnimating]);

  useEffect(() => {
    if (!isMobileSheetViewport) return undefined;
    if (!(isOpen || panelExitAnimating)) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMobileSheetViewport, isOpen, panelExitAnimating]);

  useEffect(() => {
    if (!isMobileSheetViewport) {
      setPanelExitAnimating(false);
    }
  }, [isMobileSheetViewport]);

  useEffect(() => {
    if (!panelExitAnimating) return undefined;
    const fallbackMs =
      (isMobileSheetViewport ? COLOR_PICKER_MOBILE_SHEET_MS : COLOR_PICKER_DESKTOP_PANEL_MS) +
      80;
    const timeoutId = window.setTimeout(() => {
      setPanelExitAnimating(false);
    }, fallbackMs);
    return () => window.clearTimeout(timeoutId);
  }, [isMobileSheetViewport, panelExitAnimating]);

  const click = useClick(context, { enabled: !isDisabled && !readOnly });
  const dismiss = useDismiss(context, {
    ancestorScroll: !isMobileSheetViewport,
    bubbles: false,
    outsidePressEvent: "pointerdown",
  });

  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    dismiss,
  ]);

  useEffect(() => {
    if ((!isDisabled && !readOnly) || !isOpen) return;
    beginClosingPanel(() => setIsOpen(false));
  }, [beginClosingPanel, isDisabled, isOpen, readOnly]);

  const commitHex = useCallback(
    (nextHex: string | null) => {
      const normalized = nextHex ? normalizeHex(nextHex) : null;
      if (!normalized && nextHex !== null) return;
      if (normalized === selectedHex) return;
      if (!isControlled) {
        setInternalValue(normalized);
      }
      onChange?.(normalized);
    },
    [isControlled, onChange, selectedHex],
  );

  const applyHsvColor = useCallback(
    (nextHsv: HSV) => {
      const boundedHsv: HSV = {
        h: clamp(nextHsv.h, 0, 360),
        s: clamp(nextHsv.s, 0, 100),
        v: clamp(nextHsv.v, 0, 100),
      };
      setHsv(boundedHsv);
      const nextHex = rgbToHex(hsvToRgb(boundedHsv));
      setHexInputValue(nextHex);
      commitHex(nextHex);
    },
    [commitHex],
  );

  const saturationRef = useRef<HTMLDivElement>(null);

  const updateFromSaturationPosition = useCallback(
    (clientX: number, clientY: number) => {
      const element = saturationRef.current;
      if (!element) return;
      const rect = element.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      const nextSaturation = clamp(
        ((clientX - rect.left) / rect.width) * 100,
        0,
        100,
      );
      const nextValue = clamp(
        100 - ((clientY - rect.top) / rect.height) * 100,
        0,
        100,
      );
      applyHsvColor({ ...hsvRef.current, s: nextSaturation, v: nextValue });
    },
    [applyHsvColor],
  );

  const handleSaturationPointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (isDisabled || readOnly) return;
      event.preventDefault();
      updateFromSaturationPosition(event.clientX, event.clientY);

      const pointerTarget = event.currentTarget;
      pointerTarget.setPointerCapture?.(event.pointerId);

      const handlePointerMove = (moveEvent: PointerEvent) => {
        updateFromSaturationPosition(moveEvent.clientX, moveEvent.clientY);
      };
      const handlePointerUp = () => {
        pointerTarget.removeEventListener("pointermove", handlePointerMove);
        pointerTarget.removeEventListener("pointerup", handlePointerUp);
        pointerTarget.removeEventListener("pointercancel", handlePointerUp);
      };

      pointerTarget.addEventListener("pointermove", handlePointerMove);
      pointerTarget.addEventListener("pointerup", handlePointerUp);
      pointerTarget.addEventListener("pointercancel", handlePointerUp);
    },
    [isDisabled, readOnly, updateFromSaturationPosition],
  );

  const handleHueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextHue = Number.parseFloat(event.target.value);
    if (!Number.isFinite(nextHue)) return;
    applyHsvColor({ ...hsvRef.current, h: nextHue });
  };

  const handleHexInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = event.target.value.toUpperCase();
    setHexInputValue(rawValue);
    const normalized = normalizeHex(rawValue);
    if (!normalized) return;
    const rgb = hexToRgb(normalized);
    if (!rgb) return;
    setHsv(rgbToHsv(rgb));
    commitHex(normalized);
  };

  const handleHexInputBlur = () => {
    const fallback = selectedHex ?? rgbToHex(hsvToRgb(hsvRef.current));
    const normalized = normalizeHex(hexInputValue);
    if (!normalized) {
      setHexInputValue(fallback);
      return;
    }
    setHexInputValue(normalized);
  };

  const rgb = useMemo(() => hsvToRgb(hsv), [hsv]);

  const handleRgbChange =
    (channel: keyof RGB) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = event.target.value;
      if (inputValue === "") return;
      const parsed = Number.parseInt(inputValue, 10);
      if (!Number.isFinite(parsed)) return;
      const nextRgb: RGB = {
        ...rgb,
        [channel]: clamp(parsed, 0, 255),
      };
      const nextHsv = rgbToHsv(nextRgb);
      setHsv(nextHsv);
      const nextHex = rgbToHex(nextRgb);
      setHexInputValue(nextHex);
      commitHex(nextHex);
    };

  const handleClear = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (isDisabled || readOnly) return;
    commitHex(null);
  };

  const handlePanelPointerDown = (event: React.PointerEvent) => {
    const target = event.target as HTMLElement | null;
    if (target?.closest("button, input, textarea, select, a")) return;
    event.preventDefault();
  };

  const triggerText = selectedHex ?? placeholder;
  const swatchColor = selectedHex ?? "var(--white)";
  const isPlaceholder = selectedHex == null;

  const floatingSurfaceClass = getClassNames(
    styles["cp-select-field-options"],
    isMobileSheetViewport && styles["cp-select-mobile-sheet"],
    styles["cp-color-picker-floating-shell"],
    isMobileSheetViewport &&
      panelEntered &&
      styles["cp-select-mobile-sheet-entered"],
    !isMobileSheetViewport && styles["cp-select-dropdown-panel"],
    !isMobileSheetViewport &&
      panelEntered &&
      styles["cp-select-dropdown-panel-entered"],
  );

  const hueBackgroundStyle = useMemo(
    () =>
      ({
        "--cp-color-picker-hue": `hsl(${hsv.h} 100% 50%)`,
      }) as React.CSSProperties,
    [hsv.h],
  );

  return (
    <div
      className={getClassNames(
        styles["cp-form-field"],
        {
          [styles["cp-form-field-fluid"]]: isFluid,
          [styles["cp-form-field-disabled"]]: isDisabled,
        },
        getFormFieldMarginClass(margin),
        className,
      )}
      data-testid={dataTestId}
    >
      {label ? (
        <label id={labelId} htmlFor={triggerId} className={styles["cp-form-label"]}>
          {label} {isRequired ? <span aria-hidden="true">*</span> : null}
        </label>
      ) : null}

      <div
        className={styles["cp-select-field"]}
        data-invalid={error ? "true" : undefined}
      >
        <div
          ref={refs.setReference}
          data-testid={colorFieldTestId(dataTestId, "trigger")}
          {...getReferenceProps({
            id: triggerId,
            className: getClassNames(
              styles["cp-select-field-header"],
              styles["cp-color-picker-trigger"],
              isOpen && styles["cp-select-field-header-open"],
            ),
            role: "combobox",
            tabIndex: isDisabled || readOnly ? -1 : 0,
            "aria-expanded": isOpen,
            "aria-controls": isOpen ? panelDomId : undefined,
            "aria-haspopup": "dialog",
            "aria-labelledby": label ? labelId : undefined,
            "aria-disabled": isDisabled || undefined,
            "aria-required": isRequired || undefined,
            "aria-invalid": error ? true : undefined,
            "aria-describedby": error ? errorId : undefined,
            "aria-readonly": readOnly || undefined,
            onKeyDown(event: React.KeyboardEvent<HTMLElement>) {
              if (event.defaultPrevented || isDisabled || readOnly) return;
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                if (!isOpen) setIsOpen(true);
              }
              if (isOpen && (event.key === "Escape" || event.key === "Esc")) {
                event.preventDefault();
                beginClosingPanel(() => setIsOpen(false));
              }
            },
          })}
        >
          <div
            className={getClassNames(
              styles["cp-select-trigger-main"],
              styles["cp-color-picker-trigger-main"],
            )}
          >
            <span
              className={styles["cp-color-picker-trigger-swatch"]}
              data-testid={colorFieldTestId(dataTestId, "swatch")}
              style={{ backgroundColor: swatchColor }}
              aria-hidden
            />
            <span
              className={getClassNames(
                isPlaceholder
                  ? styles["cp-select-placeholder"]
                  : styles["cp-select-value"],
                styles["cp-color-picker-trigger-text"],
              )}
            >
              {triggerText}
            </span>
          </div>
          <div className={styles["cp-select-trigger-actions"]}>
            {clearable && selectedHex && !isDisabled && !readOnly ? (
              <button
                type="button"
                tabIndex={-1}
                className={styles["cp-select-trigger-clear"]}
                aria-label="Clear color"
                data-testid={colorFieldTestId(dataTestId, "clear")}
                onMouseDown={(mouseEvent) => {
                  mouseEvent.preventDefault();
                  mouseEvent.stopPropagation();
                }}
                onClick={handleClear}
              >
                <Icon name="close" size="small" color="gray" />
              </button>
            ) : null}
            <Icon name="palette" size="small" color="gray" aria-hidden />
          </div>
        </div>

        {panelMounted ? (
          <FloatingPortal>
            {isMobileSheetViewport ? (
              <div
                className={styles["cp-select-mobile-backdrop"]}
                data-visible={
                  isMobileSheetViewport && panelEntered ? "true" : undefined
                }
                aria-hidden
              />
            ) : null}

            <div
              ref={refs.setFloating}
              data-testid={colorFieldTestId(dataTestId, "panel")}
              {...getFloatingProps({
                id: panelDomId,
                role: "dialog",
                "aria-modal": isMobileSheetViewport || undefined,
                "aria-labelledby": label ? labelId : undefined,
                className: floatingSurfaceClass,
                style: isMobileSheetViewport
                  ? COLOR_PICKER_MOBILE_SHEET_SURFACE_STYLE
                  : floatingStyles,
                onPointerDown: handlePanelPointerDown,
                onTransitionEnd: handlePanelTransitionEnd,
              })}
            >
              <div className={styles["cp-color-picker-panel-inner"]}>
                <div
                  ref={saturationRef}
                  className={styles["cp-color-picker-saturation-area"]}
                  style={hueBackgroundStyle}
                  data-testid={colorFieldTestId(dataTestId, "sv-area")}
                  role="presentation"
                  onPointerDown={handleSaturationPointerDown}
                >
                  <span
                    className={styles["cp-color-picker-saturation-thumb"]}
                    style={{
                      left: `${hsv.s}%`,
                      top: `${100 - hsv.v}%`,
                    }}
                    aria-hidden
                  />
                </div>

                <div className={styles["cp-color-picker-hue-wrap"]}>
                  <input
                    type="range"
                    min={0}
                    max={360}
                    step={1}
                    value={Math.round(hsv.h)}
                    aria-label="Hue"
                    className={styles["cp-color-picker-hue-slider"]}
                    data-testid={colorFieldTestId(dataTestId, "hue-slider")}
                    onChange={handleHueChange}
                  />
                </div>

                <div className={styles["cp-color-picker-channel-grid"]}>
                  <Input
                    label="HEX"
                    value={hexInputValue}
                    maxLength={7}
                    margin="0"
                    isFluid
                    isDisabled={isDisabled || readOnly}
                    className={styles["cp-color-picker-channel-field"]}
                    dataTestId={colorFieldTestId(dataTestId, "hex-input")}
                    onChange={handleHexInputChange}
                    onBlur={handleHexInputBlur}
                  />

                  <Input
                    label="R"
                    type="number"
                    value={String(rgb.r)}
                    min={0}
                    max={255}
                    maxLength={3}
                    margin="0"
                    isFluid
                    isDisabled={isDisabled || readOnly}
                    className={styles["cp-color-picker-channel-field"]}
                    dataTestId={colorFieldTestId(dataTestId, "rgb-r")}
                    onChange={handleRgbChange("r")}
                  />

                  <Input
                    label="G"
                    type="number"
                    value={String(rgb.g)}
                    min={0}
                    max={255}
                    maxLength={3}
                    margin="0"
                    isFluid
                    isDisabled={isDisabled || readOnly}
                    className={styles["cp-color-picker-channel-field"]}
                    dataTestId={colorFieldTestId(dataTestId, "rgb-g")}
                    onChange={handleRgbChange("g")}
                  />

                  <Input
                    label="B"
                    type="number"
                    value={String(rgb.b)}
                    min={0}
                    max={255}
                    maxLength={3}
                    margin="0"
                    isFluid
                    isDisabled={isDisabled || readOnly}
                    className={styles["cp-color-picker-channel-field"]}
                    dataTestId={colorFieldTestId(dataTestId, "rgb-b")}
                    onChange={handleRgbChange("b")}
                  />
                </div>
              </div>
            </div>
          </FloatingPortal>
        ) : null}
      </div>

      {name ? (
        <input
          type="hidden"
          name={name}
          value={selectedHex ?? ""}
          data-testid={colorFieldTestId(dataTestId, "input")}
        />
      ) : null}

      {error ? (
        <p id={errorId} role="alert" className={styles["cp-form-error-message"]}>
          {error}
        </p>
      ) : null}
    </div>
  );
};

export default ColorPicker;
