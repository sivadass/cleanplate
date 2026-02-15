import React from "react";
import styles from "./Pagination.module.scss";
import utilStyles from "../../styles/utils.module.scss";
import { getSpacingClass, getUniqueId } from "../../utils/common";
import { SPACING_OPTIONS } from "../../constants/common";
import getClassNames from "../../utils/get-class-names";
import Icon from "../icon";
import Button from "../button";
import Container from "../container";
import FormControls from "../form-controls";
import Typography from "../typography";

const getPaginationButtons = (
  totalItems: number = 120,
  itemsPerPage: number = 10,
  currentPage: number = 5
): (number | null)[] => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (totalPages <= 1) return [1];
  let page = currentPage;
  if (page < 1) page = 1;
  if (page > totalPages) page = totalPages;

  const firstPage = 1;
  const lastPage = totalPages;
  const pagination: (number | null)[] = [];

  pagination.push(firstPage);

  const showRange = 2;
  const startRange = Math.max(page - showRange, 1);
  const endRange = Math.min(page + showRange, totalPages);

  if (startRange > firstPage + 1) {
    pagination.push(null);
  }

  for (let i = startRange; i <= endRange; i++) {
    if (i !== firstPage && i !== lastPage) {
      pagination.push(i);
    }
  }

  if (endRange < lastPage - 1) {
    pagination.push(null);
  }

  if (lastPage !== firstPage) {
    pagination.push(lastPage);
  }

  return pagination;
};

const defaultRowsPerPageOptions: PaginationRowsPerPageOption[] = [
  { label: "10", value: 10 },
  { label: "20", value: 20 },
  { label: "50", value: 50 },
];

export type SpacingOption = (typeof SPACING_OPTIONS)[number];

export type PaginationMargin = string | SpacingOption[];

export type PaginationVariant = "default" | "minimal";

export interface PaginationRowsPerPageOption {
  label: string;
  value: number;
}

export interface PaginationProps {
  /** Total number of items across all pages */
  totalItems: number;
  /** Label for the total count (e.g. "Items") */
  totalLabel?: string;
  /** Current 1-based page number */
  currentPage: number;
  /** Number of rows per page */
  rowsPerPage?: number;
  /** Options for the rows-per-page select (label and value) */
  rowsPerPageOptions?: PaginationRowsPerPageOption[];
  /** Called when the page changes; receives (page, rowsPerPage) */
  onPageChange: (page: number, rowsPerPage: number) => void;
  /** Called when rows per page changes; receives the new value */
  onRowsPerPageChange?: (rowsPerPage: number) => void;
  /** Visual variant */
  variant?: PaginationVariant;
  /** Margin spacing (suffix or array of spacing suffixes; component adds m- prefix) */
  margin?: PaginationMargin;
  /** Additional class names for the root element */
  className?: string;
}

const Pagination: React.FC<PaginationProps> = ({
  variant = "default",
  margin = "0",
  className = "",
  totalItems,
  totalLabel = "Items",
  currentPage = 1,
  rowsPerPage = 10,
  rowsPerPageOptions = defaultRowsPerPageOptions,
  onPageChange,
  onRowsPerPageChange,
}) => {
  const visibleButtons = getPaginationButtons(
    totalItems,
    rowsPerPage,
    currentPage
  );
  const defaultRowsPerPage = rowsPerPageOptions?.find(
    (f) => f.value === rowsPerPage
  );
  const totalPages = Math.ceil(totalItems / rowsPerPage);
  const isPrevBtnDisabled = currentPage === 1;
  const isNextBtnDisabled = currentPage === totalPages;
  const marginClass = getSpacingClass(margin, utilStyles, "m");
  const paginationClasses = getClassNames(
    styles["pagination"],
    {
      [styles[variant]]: variant,
    },
    marginClass,
    className
  );

  const handlePageChange = (p: number | null) => {
    if (p !== null && typeof onPageChange === "function") {
      onPageChange(p, rowsPerPage);
    }
  };

  const handleRowsPerPage = (v: PaginationRowsPerPageOption) => {
    if (typeof onRowsPerPageChange === "function") {
      onRowsPerPageChange(v.value);
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  };

  return (
    <div className={paginationClasses}>
      <Container
        display="flex"
        align="center"
        justify="center"
        className={styles["pagination-wrapper"]}
      >
        <Container className={styles["total-count"]}>
          <Typography variant="small">{`Total ${totalLabel}: ${totalItems}`}</Typography>
        </Container>
        <Container
          display="flex"
          align="center"
          justify="center"
          className={styles["buttons-wrapper"]}
        >
          <Button
            variant="outline"
            className={styles["pagination-button"]}
            isDisabled={isPrevBtnDisabled}
            onClick={() => handlePrev()}
          >
            <Icon name="chevron_left" />
          </Button>

          {visibleButtons?.map((btn) => {
            const isActive = btn === currentPage;
            const btnId = getUniqueId();
            return (
              <Button
                variant={isActive ? "solid" : "outline"}
                className={styles["pagination-button"]}
                key={btnId}
                isDisabled={btn === null}
                onClick={() => handlePageChange(btn)}
              >
                {btn ?? "..."}
              </Button>
            );
          })}

          <Button
            variant="outline"
            className={styles["pagination-button"]}
            isDisabled={isNextBtnDisabled}
            onClick={() => handleNext()}
          >
            <Icon name="chevron_right" />
          </Button>
        </Container>

        <Container
          display="flex"
          align="center"
          className={styles["show-per-page"]}
        >
          <Typography variant="small">Show per page</Typography>
          <FormControls.Select
            className={styles["rows-select"]}
            placeholder="Rows per page"
            triggerClassName={styles["rows-select-trigger"]}
            contentsClassName={styles["rows-select-content"]}
            options={rowsPerPageOptions}
            value={defaultRowsPerPage}
            onChange={(v: PaginationRowsPerPageOption) => handleRowsPerPage(v)}
          />
        </Container>
      </Container>
    </div>
  );
};

export default Pagination;
