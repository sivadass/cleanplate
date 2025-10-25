import React from "react";
import PropTypes from "prop-types";
import Icon from "../icon";
import Avatar from "../avatar";
import styles from "./MediaObject.module.scss";
import utilStyles from "../../styles/utils.module.scss";
import { getSpacingClass } from "../../utils/common";
import { SPACING_OPTIONS } from "../../constants/common";
import getClassNames from "../../utils/get-class-names";
import Typography from "../typography";

const MediaObject = ({
  mediaIcon = "",
  mediaImage = "",
  mediaAvatar = "",
  title,
  description,
  margin = "0",
  padding = "0",
  className = "media-object",
  onClick,
}) => {
  const marginClass = getSpacingClass(margin, utilStyles, "m");
  const paddingClass = getSpacingClass(padding, utilStyles, "p");
  const classNames = getClassNames(styles["cp-media-object"], marginClass, paddingClass,
    className);

  const handleClick = (e) => {
    if (typeof onClick === "function") {
      onClick(e);
    }
  };
  return (
    <div className={classNames} onClick={(e) => handleClick(e)}>
      <div className={styles["cp-media-object-media"]}>
        <Avatar name={mediaAvatar} image={mediaImage} icon={mediaIcon} />
      </div>
      <div className={styles["cp-media-object-content"]}>
        <Typography isBold>{title}</Typography>
        {description && <Typography variant="small">{description}</Typography>}
      </div>
    </div>
  );
};

MediaObject.propTypes = {
  mediaIcon: PropTypes.string,
  mediaImage: PropTypes.string,
  mediaAvatar: PropTypes.string,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  className: PropTypes.string,
  onClick: PropTypes.func,
  margin: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(SPACING_OPTIONS),
  ]),
  padding: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(SPACING_OPTIONS),
  ]),
};

export default MediaObject;
