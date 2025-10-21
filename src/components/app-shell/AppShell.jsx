import styles from "./AppShell.module.scss";

const AppShell = ({ children }) => {
  return <div className={styles["app-shell"]}>{children}</div>;
};

export default AppShell;
