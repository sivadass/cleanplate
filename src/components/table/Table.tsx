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

export interface TableMobileColumns {
  title: string;
  description?: string;
  mediaAvatar?: string;
  mediaIcon?: string;
  mediaImage?: string;
  className?: string;
  margin?: TableMargin;
  padding?: string | SpacingOption[];
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
  mobileColumns?: TableMobileColumns | null;
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
            const titleVal = row[mobileColumns.title];
            const descriptionVal = mobileColumns.description
              ? row[mobileColumns.description]
              : undefined;
            const mediaAvatarVal = mobileColumns.mediaAvatar
              ? row[mobileColumns.mediaAvatar]
              : undefined;
            return (
              <MediaObject
                key={rowId}
                title={titleVal != null ? String(titleVal) : ""}
                description={
                  descriptionVal != null ? String(descriptionVal) : undefined
                }
                mediaAvatar={
                  mediaAvatarVal != null ? String(mediaAvatarVal) : undefined
                }
                mediaIcon={mobileColumns.mediaIcon}
                mediaImage={mobileColumns.mediaImage}
                margin={mobileColumns.margin}
                padding={mobileColumns.padding}
                className={mobileColumns.className}
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
