import React from "react";
import Typography from "../typography";
import { getSpacingClass } from "../../utils/common";
import { SPACING_OPTIONS } from "../../constants/common";
import getClassNames from "../../utils/get-class-names";
import utilStyles from "../../styles/utils.module.scss";
import styles from "./Footer.module.scss";

export type SpacingOption = (typeof SPACING_OPTIONS)[number];

export type FooterSize = "small" | "medium" | "large";

export type FooterVariant = "light" | "dark";

export type FooterMargin = string | SpacingOption[];

export interface FooterProps {
  /** Spacing suffix(s) for outer margin; component adds m- prefix */
  margin?: FooterMargin;
  /** Size of the footer */
  size?: FooterSize;
  /** Visual variant */
  variant?: FooterVariant;
  /** Brand name shown in copyright (e.g. "Acme Inc") */
  brandName?: string;
  /** Label for the powered-by link (e.g. "Powered by X") */
  poweredByLabel?: string;
  /** URL for the powered-by link; shown when poweredByLabel is also set */
  poweredByLink?: string;
  /** Custom content rendered above the copyright line */
  children?: React.ReactNode;
  /** Additional class names for the root element */
  className?: string;
}

const Footer: React.FC<FooterProps> = ({
  margin = "0",
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
    styles["cp-footer"],
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
              <a href={poweredByLink} target="_blank" rel="noopener noreferrer">
                {poweredByLabel}
              </a>
            </>
          )}
        </Typography>
      </div>
    </footer>
  );
};

Footer.displayName = "Footer";

export default Footer;
