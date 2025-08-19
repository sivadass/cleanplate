import React from "react";
import PropTypes from "prop-types";
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
  totalItems = 120,
  itemsPerPage = 10,
  currentPage = 5
) => {
  // Calculate total pages
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Handle edge cases
  if (totalPages <= 1) return [1];
  if (currentPage < 1) currentPage = 1;
  if (currentPage > totalPages) currentPage = totalPages;

  const firstPage = 1;
  const lastPage = totalPages;
  const pagination = [];

  // Always show first page
  pagination.push(firstPage);

  // Determine the range of pages to show around current page
  const showRange = 2; // Show 2 pages before and after current page
  const startRange = Math.max(currentPage - showRange, 1);
  const endRange = Math.min(currentPage + showRange, totalPages);

  // Add ellipsis after first page if there's a gap
  if (startRange > firstPage + 1) {
    pagination.push(null); // null represents ellipsis
  }

  // Add pages in the range around current page
  for (let i = startRange; i <= endRange; i++) {
    if (i !== firstPage && i !== lastPage) {
      pagination.push(i);
    }
  }

  // Add ellipsis before last page if there's a gap
  if (endRange < lastPage - 1) {
    pagination.push(null); // null represents ellipsis
  }

  // Always show last page (if it's different from first page)
  if (lastPage !== firstPage) {
    pagination.push(lastPage);
  }

  return pagination;
};

const defaultRowsPerPageOptions = [
  {
    label: "10",
    value: 10,
  },
  {
    label: "20",
    value: 20,
  },
  {
    label: "50",
    value: 50,
  },
];

const Pagination = ({
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
  const handlePageChange = (p) => {
    if (typeof onPageChange === "function") {
      onPageChange(p, rowsPerPage);
    }
  };
  const handleRowsPerPage = (v) => {
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
            variant={"outline"}
            className={styles["pagination-button"]}
            isDisabled={isPrevBtnDisabled}
            onClick={() => handlePrev()}
          >
            <Icon name="chevron_left" color="" />
          </Button>

          {visibleButtons?.map((btn) => {
            const isActive = btn === currentPage;
            const btnId = getUniqueId();
            return (
              <Button
                variant={isActive ? "primary" : "outline"}
                className={styles["pagination-button"]}
                key={btnId}
                isDisabled={btn === null}
                onClick={() => handlePageChange(btn)}
              >
                {btn || "..."}
              </Button>
            );
          })}

          <Button
            variant={"outline"}
            className={styles["pagination-button"]}
            isDisabled={isNextBtnDisabled}
            onClick={() => handleNext()}
          >
            <Icon name="chevron_right" color="" />
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
            onChange={(v) => handleRowsPerPage(v)}
          />
        </Container>
      </Container>
    </div>
  );
};

Pagination.propTypes = {
  totalItems: PropTypes.number.isRequired,
  totalLabel: PropTypes.string,
  currentPage: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number,
  rowsPerPageOptions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.string,
    })
  ),
  onPageChange: PropTypes.func.isRequired,
  onRowsPerPageChange: PropTypes.func,
  variant: PropTypes.oneOf(["default", "minimal"]),
  margin: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(SPACING_OPTIONS),
  ]),
};

export default Pagination;
