import React, { useState } from "react";
import Icon from "../icon";
import Typography from "../typography";
import { SPACING_OPTIONS } from "../../constants/common";
import { getSpacingClass } from "../../utils/common";
import getClassNames from "../../utils/get-class-names";
import utilStyles from "../../styles/utils.module.scss";
import styles from "./Accordion.module.scss";

export interface AccordionItem {
  title: string;
  content: React.ReactNode;
}

export type SpacingOption = (typeof SPACING_OPTIONS)[number];
export type AccordionIconVariant = "expand" | "plus";
export type AccordionVariant = "grouped" | "spaced";
export type AccordionTitleTag = "span" | "h2" | "h3" | "h4" | "h5" | "h6";
export type AccordionMargin = string | SpacingOption[];
export type AccordionPadding = string | SpacingOption[];

export interface AccordionProps {
  items: AccordionItem[];
  allowMultiple?: boolean;
  defaultExpandedIndex?: number | number[];
  iconVariant?: AccordionIconVariant;
  variant?: AccordionVariant;
  titleTag?: AccordionTitleTag;
  margin?: AccordionMargin;
  padding?: AccordionPadding;
  className?: string;
}

const getIconName = (iconVariant: AccordionIconVariant, isOpen: boolean): "add" | "remove" | "expand_more" | "expand_less" =>
  iconVariant === "plus"
    ? isOpen ? "remove" : "add"
    : isOpen ? "expand_less" : "expand_more";

const getInitialOpenIndices = (defaultExpanded: number | number[], itemCount: number): Set<number> => {
  const indices = Array.isArray(defaultExpanded) ? defaultExpanded : [defaultExpanded];
  return new Set(indices.filter((i) => i >= 0 && i < itemCount));
};

const Accordion: React.FC<AccordionProps> = ({
  items,
  allowMultiple = false,
  defaultExpandedIndex = 0,
  iconVariant = "expand",
  variant = "grouped",
  titleTag = "span",
  margin,
  padding,
  className = "",
}) => {
  const [openIndices, setOpenIndices] = useState<Set<number>>(() =>
    getInitialOpenIndices(defaultExpandedIndex, items.length)
  );

  const toggle = (index: number) => {
    setOpenIndices((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else {
        if (!allowMultiple) next.clear();
        next.add(index);
      }
      return next;
    });
  };

  const onKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggle(index);
    }
  };

  const useHeading = titleTag !== "span";
  const TitleTag = titleTag;

  const marginClass = margin ? getSpacingClass(margin, utilStyles, "m") : undefined;
  const paddingClass = padding ? getSpacingClass(padding, utilStyles, "p") : undefined;

  const rootClassName = getClassNames(
    styles["cp-accordion"],
    variant === "spaced" && styles["cp-accordion_spaced"],
    marginClass,
    paddingClass,
    className
  );

  return (
    <div className={rootClassName}>
      {items.map((item, index) => {
        const isOpen = openIndices.has(index);
        const headerId = `accordion-header-${index}`;
        const contentId = `accordion-content-${index}`;

        const headerProps = {
          className: styles.accordion__header,
          onClick: () => toggle(index),
          "aria-expanded": isOpen,
          "aria-controls": contentId,
          id: headerId,
        };

        const titleContent = useHeading ? (
          <TitleTag className={styles.accordion__title}>{item.title}</TitleTag>
        ) : (
          <Typography variant="span">{item.title}</Typography>
        );

        const headerContent = (
          <>
            {titleContent}
            <Icon
              name={getIconName(iconVariant, isOpen)}
              size="small"
              className={styles.accordion__icon}
            />
          </>
        );

        return (
          <div key={index} className={styles.accordion__item}>
            {useHeading ? (
              <div
                {...headerProps}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => onKeyDown(e, index)}
              >
                {headerContent}
              </div>
            ) : (
              <button type="button" {...headerProps}>
                {headerContent}
              </button>
            )}
            <div
              id={contentId}
              role="region"
              aria-labelledby={headerId}
              className={`${styles.accordion__content} ${isOpen ? styles.accordion__content_open : ""}`}
            >
              {typeof item.content === "string" ? (
                <Typography variant="p">{item.content}</Typography>
              ) : (
                item.content
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

Accordion.displayName = "Accordion";

export default Accordion;
