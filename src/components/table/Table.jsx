import React from "react";
import PropTypes from "prop-types";
import styles from "./Table.module.scss";
import utilStyles from "../../styles/utils.module.scss";
import { getSpacingClass, getUniqueId } from "../../utils/common";
import { SPACING_OPTIONS } from "../../constants/common";
import getClassNames from "../../utils/get-class-names";
import Typography from "../typography";

const Table = ({
  variant,
  margin = "0",
  className = "",
  columns = [],
  data = [],
  onRowClick,
}) => {
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
  return (
    <div className={tableClasses}>
      <table>
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
                      <Typography
                        variant="p"
                        align={column.textAlign || "left"}
                      >
                        {d[column.id]}
                      </Typography>
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
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
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  onRowClick: PropTypes.func,
};

export default Table;
