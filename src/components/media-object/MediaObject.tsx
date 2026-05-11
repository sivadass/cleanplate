import React from "react";
import Avatar from "../avatar";
import type { MaterialIconName } from "../icon/material-icon-names";
import styles from "./MediaObject.module.scss";
import utilStyles from "../../styles/utils.module.scss";
import { getSpacingClass } from "../../utils/common";
import getClassNames from "../../utils/get-class-names";
import type { SpacingOption } from "../typography";

export type MediaObjectMargin = string | SpacingOption[];

export type MediaObjectPadding = string | SpacingOption[];

export interface MediaObjectProps extends React.HTMLAttributes<HTMLDivElement> {
  mediaIcon?: MaterialIconName | string;
  mediaImage?: string;
  mediaAvatar?: string;
  /** Primary line (e.g. sender, name); emphasized */
  title: string;
  /** Optional middle line (e.g. subject) */
  subtitle?: React.ReactNode;
  /** Optional preview line(s); muted and line-clamped */
  description?: React.ReactNode;
  /**
   * Top of trailing rail, row 1 (e.g. date).
   * Plain strings render with subdued meta styling.
   */
  meta?: React.ReactNode;
  /** Bottom rail, last text row — e.g. star / menu trigger */
  action?: React.ReactNode;
  /** Max visible lines for `description` before ellipsis */
  descriptionLineClamp?: number;
  margin?: MediaObjectMargin;
  padding?: MediaObjectPadding;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

function isRenderableTextLike(node: unknown): node is string | number {
  return typeof node === "string" || typeof node === "number";
}

function renderMetaStatic(node: React.ReactNode): React.ReactNode {
  if (node == null || node === "" || node === false) {
    return null;
  }
  if (isRenderableTextLike(node)) {
    return <span className={styles["cp-media-object-meta"]}>{node}</span>;
  }
  return <div className={styles["cp-media-object-meta-slot"]}>{node}</div>;
}

const MediaObject: React.FC<MediaObjectProps> = ({
  mediaIcon = "",
  mediaImage = "",
  mediaAvatar = "",
  title,
  subtitle,
  description,
  meta,
  action,
  descriptionLineClamp = 2,
  margin = "0",
  padding = "0",
  className = "media-object",
  onClick,
  ...rest
}) => {
  const marginClass = getSpacingClass(margin, utilStyles, "m");
  const paddingClass = getSpacingClass(padding, utilStyles, "p");
  const classNames = getClassNames(
    styles["cp-media-object"],
    marginClass,
    paddingClass,
    className
  );

  const hasRail =
    (meta != null && meta !== false && meta !== "") || Boolean(action);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (typeof onClick === "function") {
      onClick(e);
    }
  };

  const metaContent = meta != null && meta !== false && meta !== "" ? renderMetaStatic(meta) : null;
  const subtitleContent =
    subtitle != null && subtitle !== "" && subtitle !== false ? subtitle : null;
  const snippetContent =
    description != null && description !== "" && description !== false
      ? description
      : null;

  const snippetStyle = snippetContent
    ? ({
        "--cp-media-object-desc-lines": descriptionLineClamp,
      } as React.CSSProperties)
    : undefined;

  const textRowCount =
    1 + (subtitleContent ? 1 : 0) + (snippetContent ? 1 : 0);

  const showMetaSlot = metaContent != null;
  const showActionSlot = Boolean(action);

  const singleRowRails =
    textRowCount === 1 && showMetaSlot && showActionSlot;

  const bodyRailStyle =
    hasRail && !singleRowRails
      ? ({
          "--cp-media-object-action-row": textRowCount,
        } as React.CSSProperties)
      : undefined;

  return (
    <div className={classNames} onClick={handleClick} {...rest}>
      <div className={styles["cp-media-object-media"]}>
        <Avatar
          name={mediaAvatar}
          image={mediaImage}
          icon={mediaIcon ? (mediaIcon as MaterialIconName) : undefined}
          onClick={onClick ? handleClick : undefined}
        />
      </div>

      <div
        className={styles["cp-media-object-body"]}
        data-has-rail={hasRail ? "true" : "false"}
        style={bodyRailStyle}
      >
        <strong className={styles["cp-media-object-title"]}>{title}</strong>

        {subtitleContent != null ? (
          <div className={styles["cp-media-object-subtitle"]}>{subtitleContent}</div>
        ) : null}

        {snippetContent != null ? (
          <div className={styles["cp-media-object-snippet"]} style={snippetStyle}>
            {snippetContent}
          </div>
        ) : null}

        {hasRail && singleRowRails ? (
          <div className={styles["cp-media-object-rail-single"]}>
            {metaContent}
            <div>{action}</div>
          </div>
        ) : (
          <>
            {showMetaSlot ? (
              <div className={styles["cp-media-object-meta-cell"]}>{metaContent}</div>
            ) : null}
            {showActionSlot ? (
              <div className={styles["cp-media-object-action-cell"]}>{action}</div>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
};

export default MediaObject;
