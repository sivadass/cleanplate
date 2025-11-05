import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import styles from "./Table.module.scss";
import utilStyles from "../../styles/utils.module.scss";
import { getSpacingClass, getUniqueId, isNotEmptyObject } from "../../utils/common";
import { SPACING_OPTIONS } from "../../constants/common";
import getClassNames from "../../utils/get-class-names";
import Typography from "../typography";
import Pagination from "../pagination";
import Container from "../container";
import MediaObject from "../media-object";

const Table = ({
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
  const [viewportWidth, setViewportWidth] = useState(window.innerWidth);

  const isMobile = viewportWidth < 768;
  const isMobileColumnsConfigured = isNotEmptyObject(mobileColumns);

  const canShowMobileColumns = isMobile && isMobileColumnsConfigured;

  const marginClass = getSpacingClass(margin, utilStyles, "m");
  const tableClasses = getClassNames(
    styles["table"],
    {
      [styles[variant]]: variant,
    },
    marginClass,
    className
  );
  const handleRowClick = (rowData) => {
    if (typeof onRowClick === "function") {
      onRowClick(rowData);
    }
  };
  const handlePageChange = (page, rPerPage) => {
    if (typeof onPageChange === "function") {
      onPageChange(page, rPerPage);
    }
  };
  const handleRowsPerPageChange = (rPerPage) => {
    if (typeof onRowsPerPageChange === "function") {
      onRowsPerPageChange(rPerPage);
    }
  };

  useEffect(() => {
    const handleResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return (
    <div className={tableClasses}>
      {canShowMobileColumns ? (
        <div className={styles["mobile-columns"]}>
          {data?.map((row) => {
            const rowId = getUniqueId();
            return (
              <MediaObject
                key={rowId}
                title={row[mobileColumns.title]}
                description={row[mobileColumns.description]}
                mediaAvatar={row[mobileColumns.mediaAvatar]}
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
                const columnStyles = {
                  ...(column?.widthPercentage && {
                    width: column.widthPercentage,
                  }),
                };
                return (
                  <th key={column.id} style={columnStyles}>
                    <Typography
                      variant="p"
                      isBold
                      align={column.textAlign || "left"}
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
                            align={column.textAlign || "left"}
                            wordBreak="all"
                          >
                            {d[column.id]}
                          </Typography>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>)}
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

Table.propTypes = {
  variant: PropTypes.oneOf(["default", "compact"]),
  margin: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(SPACING_OPTIONS),
  ]),
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      textAlign: PropTypes.oneOf(["left", "center", "right"]),
      customRender: PropTypes.func,
      widthPercentage: PropTypes.string,
    })
  ).isRequired,
  mobileColumns: PropTypes.shape({
    mediaIcon: PropTypes.string,
    mediaImage: PropTypes.string,
    mediaAvatar: PropTypes.string,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    className: PropTypes.string,
    margin: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(SPACING_OPTIONS),
    ]),
    padding: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(SPACING_OPTIONS),
    ]),
  }),
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  onRowClick: PropTypes.func,
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
  hidePagination: PropTypes.bool,
};

export default Table;
