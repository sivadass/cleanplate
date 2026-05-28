import React, { useState, useEffect } from "react";
import styles from "./Table.module.scss";
import utilStyles from "../../styles/utils.module.scss";
import {
  getSpacingClass,
  getUniqueId,
  isNotEmptyObject,
} from "../../utils/common";
import { SPACING_OPTIONS } from "../../constants/common";
import getClassNames from "../../utils/get-class-names";
import Typography from "../typography";
import Pagination from "../pagination";
import Container from "../container";
import MediaObject from "../media-object";
import type { MediaObjectProps } from "../media-object";
import type { PaginationRowsPerPageOption } from "../pagination";

export type SpacingOption = (typeof SPACING_OPTIONS)[number];

export type TableMargin = string | SpacingOption[];

export type TableVariant = "default" | "compact";

export type TableColumnTextAlign = "left" | "center" | "right";

export type TableRow = Record<string, unknown>;

export interface TableColumn {
  id: string;
  title: string;
  textAlign?: TableColumnTextAlign;
  customRender?: (
    rowData: TableRow,
    column: TableColumn
  ) => React.ReactNode;
  widthPercentage?: string;
}

/** Row key used to read a value from each `TableRow`. */
export type TableMobileColumnKey = string;

/**
 * Row key, static value, or per-row resolver.
 * For `mediaIcon` / `mediaImage` strings: if the string is a key on the row, the row value wins;
 * otherwise the string is treated as a static icon name or image URL.
 */
export type TableMobileColumnField<T = React.ReactNode> =
  | TableMobileColumnKey
  | ((row: TableRow) => T | undefined);

/**
 * Maps table rows to {@link MediaObject} on viewports under 768px.
 * Inherits static MediaObject options (`margin`, `padding`, `descriptionLineClamp`, etc.).
 * Text and media slots accept row keys or resolvers; `action` is always a per-row render function.
 */
export interface TableMobileColumns
  extends Omit<
    MediaObjectProps,
    | "title"
    | "subtitle"
    | "description"
    | "meta"
    | "action"
    | "mediaAvatar"
    | "mediaAvatarCodeText"
    | "mediaIcon"
    | "mediaImage"
    | "onClick"
  > {
  /** Row key for MediaObject `title` (required) */
  title: TableMobileColumnKey;
  /** Row key or per-row resolver for `subtitle` */
  subtitle?: TableMobileColumnField<React.ReactNode>;
  /** Row key or per-row resolver for `description` */
  description?: TableMobileColumnField<React.ReactNode>;
  /** Row key or per-row resolver for `meta` */
  meta?: TableMobileColumnField<React.ReactNode>;
  /** Row key for `mediaAvatar` */
  mediaAvatar?: TableMobileColumnKey;
  /** Static value, row key, or per-row resolver for `mediaAvatarCodeText` */
  mediaAvatarCodeText?: TableMobileColumnField<string>;
  /** Static icon name, row key, or per-row resolver for `mediaIcon` */
  mediaIcon?: TableMobileColumnField<MediaObjectProps["mediaIcon"]>;
  /** Static image URL, row key, or per-row resolver for `mediaImage` */
  mediaImage?: TableMobileColumnField<string>;
  /** Per-row `action` slot; use `stopPropagation` on interactive children when the row is clickable */
  action?: (row: TableRow) => React.ReactNode;
}

export interface TableProps {
  variant?: TableVariant;
  margin?: TableMargin;
  className?: string;
  columns: TableColumn[];
  data: TableRow[];
  onRowClick?: (rowData: TableRow) => void;
  totalItems?: number;
  totalLabel?: string;
  currentPage?: number;
  rowsPerPage?: number;
  rowsPerPageOptions?: PaginationRowsPerPageOption[];
  onPageChange?: (page: number, rowsPerPage: number) => void;
  onRowsPerPageChange?: (rowsPerPage: number) => void;
  hidePagination?: boolean;
  /**
   * When set and viewport width is under 768px, each row renders as a MediaObject.
   * See {@link TableMobileColumns}.
   */
  mobileColumns?: TableMobileColumns | null;
}

function resolveRowKeyField(
  field: TableMobileColumnField<React.ReactNode> | undefined,
  row: TableRow,
): React.ReactNode | undefined {
  if (field == null) {
    return undefined;
  }

  if (typeof field === "function") {
    return field(row);
  }

  if (!Object.prototype.hasOwnProperty.call(row, field)) {
    return undefined;
  }

  const value = row[field];
  if (value == null || value === "") {
    return undefined;
  }

  if (typeof value === "string" || typeof value === "number") {
    return String(value);
  }

  return value as React.ReactNode;
}

function resolveMediaField(
  field: TableMobileColumnField<string> | undefined,
  row: TableRow,
): string | undefined {
  if (field == null) {
    return undefined;
  }

  if (typeof field === "function") {
    const value = field(row);
    return value != null && value !== "" ? String(value) : undefined;
  }

  if (Object.prototype.hasOwnProperty.call(row, field)) {
    const value = row[field];
    return value != null && value !== "" ? String(value) : undefined;
  }

  return field;
}

function buildMobileMediaObjectProps(
  config: TableMobileColumns,
  row: TableRow,
): MediaObjectProps {
  const {
    title: titleKey,
    subtitle,
    description,
    meta,
    mediaAvatar,
    mediaAvatarCodeText,
    mediaIcon,
    mediaImage,
    action,
    ...rest
  } = config;

  const titleVal = row[titleKey];
  const mediaAvatarVal = mediaAvatar ? row[mediaAvatar] : undefined;

  return {
    ...rest,
    title: titleVal != null ? String(titleVal) : "",
    subtitle: resolveRowKeyField(subtitle, row),
    description: resolveRowKeyField(description, row),
    meta: resolveRowKeyField(meta, row),
    mediaAvatar:
      mediaAvatarVal != null && mediaAvatarVal !== ""
        ? String(mediaAvatarVal)
        : undefined,
    mediaAvatarCodeText: resolveMediaField(mediaAvatarCodeText, row),
    mediaIcon: resolveMediaField(mediaIcon, row),
    mediaImage: resolveMediaField(mediaImage, row),
    action: action?.(row),
  };
}

const Table: React.FC<TableProps> = ({
  variant,
  margin = "0",
  className = "",
  columns = [],
  data = [],
  onRowClick,
  totalItems = 0,
  totalLabel = "Items",
  currentPage = 1,
  rowsPerPage = 10,
  rowsPerPageOptions,
  onPageChange,
  onRowsPerPageChange,
  hidePagination = false,
  mobileColumns = null,
}) => {
  const [viewportWidth, setViewportWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1024
  );

  const isMobile = viewportWidth < 768;
  const isMobileColumnsConfigured = isNotEmptyObject(mobileColumns as object);

  const canShowMobileColumns = isMobile && isMobileColumnsConfigured;

  const marginClass = getSpacingClass(margin, utilStyles, "m");
  const tableClasses = getClassNames(
    styles["table"],
    {
      [styles[variant ?? "default"]]: variant,
    },
    marginClass,
    className
  );

  const handleRowClick = (rowData: TableRow) => {
    if (typeof onRowClick === "function") {
      onRowClick(rowData);
    }
  };

  const handlePageChange = (page: number, rPerPage: number) => {
    if (typeof onPageChange === "function") {
      onPageChange(page, rPerPage);
    }
  };

  const handleRowsPerPageChange = (rPerPage: number) => {
    if (typeof onRowsPerPageChange === "function") {
      onRowsPerPageChange(rPerPage);
    }
  };

  useEffect(() => {
    const handleResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className={tableClasses}>
      {canShowMobileColumns && mobileColumns ? (
        <div className={styles["mobile-columns"]}>
          {data?.map((row) => {
            const rowId = getUniqueId();
            return (
              <MediaObject
                key={rowId}
                {...buildMobileMediaObjectProps(mobileColumns, row)}
                onClick={() => handleRowClick(row)}
              />
            );
          })}
        </div>
      ) : (
        <table className={styles["core-table"]}>
          <thead>
            <tr>
              {columns?.map((column) => {
                const columnStyles: React.CSSProperties = {
                  ...(column?.widthPercentage && {
                    width: column.widthPercentage,
                  }),
                };
                return (
                  <th key={column.id} style={columnStyles}>
                    <Typography
                      variant="p"
                      isBold
                      align={column.textAlign ?? "left"}
                      wordBreak="all"
                    >
                      {column.title}
                    </Typography>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {data?.map((d) => {
              const rowId = getUniqueId();
              return (
                <tr key={rowId} onClick={() => handleRowClick(d)}>
                  {columns?.map((column) => {
                    const columnId = getUniqueId();
                    return (
                      <td key={columnId}>
                        {column.customRender ? (
                          column.customRender(d, column)
                        ) : (
                          <Typography
                            variant="p"
                            align={column.textAlign ?? "left"}
                            wordBreak="all"
                          >
                            {String(d[column.id] ?? "")}
                          </Typography>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
      {totalItems > 0 && !hidePagination && (
        <Container className={styles["pagination-wrapper"]}>
          <Pagination
            totalItems={totalItems}
            totalLabel={totalLabel}
            currentPage={currentPage}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={rowsPerPageOptions}
            onPageChange={(page, rPerPage) => handlePageChange(page, rPerPage)}
            onRowsPerPageChange={(rPerPage) =>
              handleRowsPerPageChange(rPerPage)
            }
          />
        </Container>
      )}
    </div>
  );
};

export default Table;
