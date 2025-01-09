import PropTypes from "prop-types";
import Typography from "../typography";
import { getSpacingClass } from "../../utils/common";
import { SPACING_OPTIONS } from "../../constants/common";
import getClassNames from "../../utils/get-class-names";
import utilStyles from "../../styles/utils.module.scss";
import styles from "./Footer.module.scss";

const Footer = ({
  margin = "m-0",
  size = "large",
  variant = "light",
  brandName = "",
  poweredByLabel = "",
  poweredByLink = "",
  children,
  className = "",
}) => {
  const marginClass = getSpacingClass(margin, utilStyles, "m");

  const footerClasses = getClassNames(
    styles["footer"],
    styles[size],
    styles[variant],
    marginClass,
    className
  );
  const currentYear = new Date().getFullYear();
  return (
    <footer className={footerClasses}>
      {children && (
        <div className={styles.footerCustomContents}>{children}</div>
      )}
      <div className={styles.copyright}>
        <Typography variant="small">
          &copy; {`${currentYear} ${brandName}. All rights reserved.`}
          {poweredByLabel && poweredByLink && (
            <>
              &nbsp;
              <a href={poweredByLink} target="_blank">
                {poweredByLabel}
              </a>
            </>
          )}
        </Typography>
      </div>
    </footer>
  );
};

Footer.propTypes = {
  brandName: PropTypes.string,
  poweredByLabel: PropTypes.string,
  poweredByLink: PropTypes.string,
  size: PropTypes.oneOf(["small", "medium", "large"]),
  variant: PropTypes.oneOf(["light", "dark"]),
  margin: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(SPACING_OPTIONS),
  ]),
};

export default Footer;
