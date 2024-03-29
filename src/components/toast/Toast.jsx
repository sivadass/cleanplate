import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  useMemo,
  useEffect,
} from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import { getUniqueId, getVariantIcon } from "../../utils/common";
import styles from "./Toast.module.scss";
import Icon from "../icon";

const useToastPortal = () => {
  const [loaded, setLoaded] = useState(false);
  const [portalId] = useState(`toast-portal-${getUniqueId()}`);

  useEffect(() => {
    const div = document.createElement("div");
    div.id = portalId;
    div.style = "position: fixed; top: 16px; right: 16px";
    document.getElementsByTagName("body")[0].prepend(div);

    setLoaded(true);

    return () => document.getElementsByTagName("body")[0].removeChild(div);
  }, [portalId]);

  return { loaded, portalId };
};

const useToastAutoClose = ({ toasts, setToasts, autoClose, autoCloseTime }) => {
  const [removing, setRemoving] = useState("");

  useEffect(() => {
    if (removing) {
      setToasts((t) => t.filter((_t) => _t.id !== removing));
    }
  }, [removing, setToasts]);

  useEffect(() => {
    if (autoClose && toasts.length) {
      const id = toasts[toasts.length - 1].id;
      setTimeout(() => setRemoving(id), autoCloseTime);
    }
  }, [toasts, autoClose, autoCloseTime]);
};

const ToastItem = ({ mode, onClose, message }) => {
  const classes = useMemo(() => [styles.toast, styles[mode]].join(" "), [mode]);
  const iconName = getVariantIcon(mode);
  return (
    <div onClick={onClose} className={classes}>
      <Icon className={styles.icon} name={iconName} size={32} />
      <div className={styles.message}>{message}</div>
    </div>
  );
};

/**
 * The parent of this component should not have
 * to worry about maintaining a list of message
 * objects. That would require the parent to
 * also manage the deletion of toasts, etc.
 *
 * To accommodate this, we are using a combination
 * of useImperativeHandle and forwardRef to give
 * the parent access to this component's addMessage
 * functionality.
 */

const Toast = forwardRef(({ autoClose = false, autoCloseTime = 5000 }, ref) => {
  const [toasts, setToasts] = useState([]);
  const { loaded, portalId } = useToastPortal();

  useToastAutoClose({
    toasts,
    setToasts,
    autoClose,
    autoCloseTime,
  });

  const removeToast = (id) => {
    setToasts(toasts.filter((t) => t.id !== id));
  };

  useImperativeHandle(ref, () => ({
    addMessage(toast) {
      setToasts([...toasts, { ...toast, id: getUniqueId() }]);
    },
  }));

  return loaded ? (
    ReactDOM.createPortal(
      <div className={styles["toast-container"]}>
        {toasts.map((t) => (
          <ToastItem
            key={t.id}
            mode={t.mode}
            message={t.message}
            onClose={() => removeToast(t.id)}
          />
        ))}
      </div>,

      document.getElementById(portalId)
    )
  ) : (
    <></>
  );
});

Toast.propTypes = {
  ref: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.any }),
  ]),
  autoClose: PropTypes.bool,
  autoCloseTime: PropTypes.number,
};

export default Toast;
