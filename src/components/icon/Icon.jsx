import "./styles.css";

const Icon = ({ name = "" }) => {
  const iconName = `cp-icon ${name}`;
  return <i className={iconName} />;
};

export default Icon;
