import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  useMemo,
  useEffect,
  useRef,
} from "react";
import ReactDOM from "react-dom";
import { getUniqueId, getVariantIcon } from "../../utils/common";
import styles from "./Toast.module.scss";
import Icon from "../icon";
import type { MaterialIconName } from "../icon/material-icon-names";

export type ToastVariant = "info" | "error" | "warning" | "success";

export interface ToastMessage {
  mode: ToastVariant;
  message: string;
}

export interface ToastRefHandle {
  addMessage: (toast: ToastMessage) => void;
}

export interface ToastProps {
  /** Whether toasts auto-close after autoCloseTime */
  autoClose?: boolean;
  /** Duration in ms before auto-closing (when autoClose is true) */
  autoCloseTime?: number;
}

interface ToastItemWithId extends ToastMessage {
  id: string;
}

const useToastPortal = () => {
  const [loaded, setLoaded] = useState(false);
  const [portalId] = useState(`toast-portal-${getUniqueId()}`);

  useEffect(() => {
    const div = document.createElement("div");
    div.id = portalId;
    div.style.cssText = "position: fixed; top: 16px; right: 16px";
    const body = document.getElementsByTagName("body")[0];
    if (body) {
      body.prepend(div);
      setLoaded(true);
      return () => {
        body.removeChild(div);
      };
    }
    return undefined;
  }, [portalId]);

  return { loaded, portalId };
};

const useToastAutoClose = ({
  toasts,
  setToasts,
  autoClose,
  autoCloseTime,
}: {
  toasts: ToastItemWithId[];
  setToasts: React.Dispatch<React.SetStateAction<ToastItemWithId[]>>;
  autoClose: boolean;
  autoCloseTime: number;
}) => {
  const [removing, setRemoving] = useState<string>("");

  useEffect(() => {
    if (removing) {
      setToasts((t) => t.filter((_t) => _t.id !== removing));
    }
  }, [removing, setToasts]);

  useEffect(() => {
    if (autoClose && toasts.length) {
      const id = toasts[toasts.length - 1].id;
      const timer = setTimeout(() => setRemoving(id), autoCloseTime);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [toasts, autoClose, autoCloseTime]);
};

const ToastItem = ({
  mode,
  onClose,
  message,
}: {
  mode: ToastVariant;
  onClose: () => void;
  message: string;
}) => {
  const classes = useMemo(() => [styles.toast, styles[mode]].join(" "), [mode]);
  const iconName = getVariantIcon(mode);
  return (
    <div onClick={onClose} className={classes} role="button" tabIndex={0} onKeyDown={(e) => e.key === "Enter" && onClose()}>
      <Icon className={styles.icon} name={iconName as MaterialIconName} size="medium" />
      <div className={styles.message}>{message}</div>
    </div>
  );
};

/**
 * Toast displays transient messages in a portal (top-right). Use a ref to call
 * addMessage({ mode, message }). The parent does not need to manage toast state.
 * useImperativeHandle + forwardRef expose addMessage to the parent.
 */
const Toast = forwardRef<ToastRefHandle, ToastProps>(
  ({ autoClose = false, autoCloseTime = 5000 }, ref) => {
    const [toasts, setToasts] = useState<ToastItemWithId[]>([]);
    const toastsRef = useRef(toasts);
    toastsRef.current = toasts;

    const { loaded, portalId } = useToastPortal();

    useToastAutoClose({
      toasts,
      setToasts,
      autoClose,
      autoCloseTime,
    });

    const removeToast = (id: string) => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    useImperativeHandle(
      ref,
      () => ({
        addMessage(toast: ToastMessage) {
          setToasts([...toastsRef.current, { ...toast, id: getUniqueId() }]);
        },
      }),
      []
    );

    if (!loaded) {
      return null;
    }

    const portalEl = document.getElementById(portalId);
    if (!portalEl) {
      return null;
    }

    return ReactDOM.createPortal(
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
      portalEl
    );
  }
);

Toast.displayName = "Toast";

export default Toast;
