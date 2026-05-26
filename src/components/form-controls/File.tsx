import React, { useId, useRef, useState } from "react";
import styles from "./FormControls.module.scss";
import getClassNames from "../../utils/get-class-names";
import Icon from "../icon";
import type { MaterialIconName } from "../icon/material-icon-names";

export type FileVariant = "button" | "card";

export interface FileProps {
  name?: string;
  id?: string;
  /**
   * Fires with the next list of selected files (and the underlying change event
   * when triggered by the native picker). For removals / drag-and-drop the
   * second argument is `undefined`.
   */
  onChange?: (
    files: File[],
    e?: React.ChangeEvent<HTMLInputElement>
  ) => void;
  /** Controlled list of currently selected files. */
  value?: File[];
  /** Uncontrolled initial file list. Note: this seeds the visual list only — browsers
   * don't allow programmatic pre-population of `<input type="file">` for security. */
  defaultValue?: File[];
  /** Allow selecting multiple files (and append on subsequent selections / drops). */
  multiple?: boolean;
  /** Native `accept` attribute (e.g. `"image/*"`, `".pdf,image/*"`). */
  accept?: string;
  /**
   * Visual style for the trigger:
   * - `button` (default): a single primary-brand button.
   * - `card`: a dashed drop zone with icon, helper text, and "Browse file" CTA.
   */
  variant?: FileVariant;
  /** Label rendered on the trigger button / card CTA. */
  buttonLabel?: string;
  /** Helper text shown above the "or" inside the card drop zone. */
  dropZoneText?: string;
  /** Visible field label rendered above the trigger. */
  label?: string;
  isDisabled?: boolean;
  isRequired?: boolean;
  isFluid?: boolean;
  className?: string;
  error?: string;
  /**
   * Maps to `data-testid` on the underlying `<input type="file">`.
   * When set, related elements also get suffixed ids:
   * `-trigger`, `-list`, `-item-{i}`, `-remove-{i}`.
   */
  dataTestId?: string;
}

/* Format bytes as "5.2 MB" / "812 B" — single source of truth for file sizes. */
const formatBytes = (bytes: number): string => {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"];
  const idx = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1
  );
  const value = bytes / Math.pow(1024, idx);
  const decimals = idx === 0 ? 0 : value < 10 ? 1 : 0;
  return `${value.toFixed(decimals)} ${units[idx]}`;
};

const fileIconName = (file: File): MaterialIconName => {
  const t = file.type || "";
  if (t.startsWith("image/")) return "image";
  if (t === "application/pdf") return "picture_as_pdf";
  if (t.startsWith("video/")) return "movie";
  if (t.startsWith("audio/")) return "music_note";
  if (t.includes("zip") || t.includes("compressed")) return "folder_zip";
  return "description";
};

function fileFieldTestId(
  base: string | undefined,
  suffix: string,
): string | undefined {
  return base ? `${base}-${suffix}` : undefined;
}

const File: React.FC<FileProps> = ({
  name,
  id,
  onChange,
  value,
  defaultValue,
  multiple = false,
  accept,
  variant = "button",
  buttonLabel = "Browse file",
  dropZoneText = "Drag files to upload",
  label = "",
  isDisabled = false,
  isRequired = false,
  isFluid = false,
  className = "",
  error = "",
  dataTestId,
}) => {
  const generatedId = useId();
  const inputId = id ?? name ?? generatedId;
  const errorId = `${inputId}-error`;
  const inputRef = useRef<HTMLInputElement | null>(null);

  const isControlled = value !== undefined;
  const [internalFiles, setInternalFiles] = useState<File[]>(
    defaultValue ?? []
  );
  const files: File[] = isControlled ? (value as File[]) : internalFiles;

  const [isDragging, setIsDragging] = useState(false);

  const wrapperClass = getClassNames(
    styles["cp-form-field"],
    styles["cp-file-field"],
    { [styles["cp-form-field-fluid"]]: isFluid },
    className
  );

  const triggerClass = getClassNames(
    styles["cp-file-trigger"],
    variant === "card"
      ? styles["cp-file-trigger-card"]
      : styles["cp-file-trigger-button"],
    isDragging ? styles["cp-file-trigger-card-active"] : ""
  );

  const updateFiles = (
    next: File[],
    e?: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!isControlled) {
      setInternalFiles(next);
    }
    onChange?.(next, e);
  };

  const handleNativeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = e.target.files ? Array.from(e.target.files) : [];
    const next = multiple ? [...files, ...picked] : picked;
    updateFiles(next, e);
  };

  const handleRemove = (idx: number) => {
    const next = files.filter((_, i) => i !== idx);
    /* Clear the native input so re-selecting the same file still fires onChange. */
    if (inputRef.current) inputRef.current.value = "";
    updateFiles(next);
  };

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    if (isDisabled) return;
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (isDisabled) return;
    const dropped = Array.from(e.dataTransfer?.files ?? []);
    if (dropped.length === 0) return;
    const next = multiple ? [...files, ...dropped] : dropped.slice(0, 1);
    updateFiles(next);
  };

  return (
    <div
      className={wrapperClass}
      data-invalid={error ? "true" : undefined}
      data-variant={variant}
    >
      {label && (
        <label className={styles["cp-form-label"]} htmlFor={inputId}>
          {label}
          {isRequired && (
            <>
              {" "}
              <span aria-hidden="true">*</span>
            </>
          )}
        </label>
      )}

      <input
        ref={inputRef}
        className={styles["cp-visually-hidden"]}
        type="file"
        disabled={isDisabled}
        /* Once a file is picked we drop the native required so submit isn't blocked. */
        required={isRequired && files.length === 0}
        aria-required={isRequired || undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        name={name}
        id={inputId}
        multiple={multiple}
        accept={accept}
        onChange={handleNativeChange}
        data-testid={dataTestId}
      />

      {variant === "card" ? (
        <label
          htmlFor={inputId}
          className={triggerClass}
          data-testid={fileFieldTestId(dataTestId, "trigger")}
          onDragEnter={handleDragOver}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Icon name="cloud_upload" size="large" aria-hidden={true} />
          <span className={styles["cp-file-trigger-card-helper"]}>
            {dropZoneText}
          </span>
          <span className={styles["cp-file-trigger-card-or"]} aria-hidden="true">
            or
          </span>
          <span className={styles["cp-file-trigger-cta"]}>{buttonLabel}</span>
        </label>
      ) : (
        <label
          htmlFor={inputId}
          className={triggerClass}
          data-testid={fileFieldTestId(dataTestId, "trigger")}
        >
          <Icon name="upload" size="medium" aria-hidden={true} />
          <span>{buttonLabel}</span>
        </label>
      )}

      {files.length > 0 && (
        <ul
          className={styles["cp-file-list"]}
          aria-label={`Selected ${files.length === 1 ? "file" : "files"}`}
          data-testid={fileFieldTestId(dataTestId, "list")}
        >
          {files.map((f, i) => (
            <li
              key={`${f.name}-${i}`}
              className={styles["cp-file-item"]}
              data-testid={dataTestId ? `${dataTestId}-item-${i}` : undefined}
            >
              <span className={styles["cp-file-item-thumb"]} aria-hidden="true">
                <Icon name={fileIconName(f)} size="medium" />
              </span>
              <span className={styles["cp-file-item-text"]}>
                <span className={styles["cp-file-item-name"]} title={f.name}>
                  {f.name}
                </span>
                <span className={styles["cp-file-item-size"]}>
                  {formatBytes(f.size)}
                </span>
              </span>
              <button
                type="button"
                className={styles["cp-file-item-remove"]}
                onClick={() => handleRemove(i)}
                disabled={isDisabled}
                aria-label={`Remove ${f.name}`}
                data-testid={
                  dataTestId ? `${dataTestId}-remove-${i}` : undefined
                }
              >
                <Icon name="close" size="small" aria-hidden={true} />
              </button>
            </li>
          ))}
        </ul>
      )}

      {error && (
        <p
          id={errorId}
          role="alert"
          className={styles["cp-form-error-message"]}
        >
          {error}
        </p>
      )}
    </div>
  );
};

export default File;
