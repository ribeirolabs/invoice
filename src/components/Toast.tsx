import { PropsWithChildren, useCallback, useState } from "react";
import { useEvent } from "@ribeirolabs/events/react";
import { Alert, AlertProps } from "./Alert";
import { dispatchCustomEvent } from "@ribeirolabs/events";

type ToastWithId = Pick<AlertProps, "type"> & { id: string; message: string };

const TOAST_TIMEOUT = 3000;

export const addToast = (message: string, type: AlertType, id?: string) => {
  dispatchCustomEvent("toast", {
    id,
    message,
    type,
  });
};

export const ToastProvider = ({ children }: PropsWithChildren) => {
  const [toasts, setToasts] = useState<ToastWithId[]>([]);

  const remove = useCallback((id: string) => {
    setToasts((toasts) => toasts.filter((toast) => toast.id !== id));
  }, []);

  useEvent(
    "toast",
    useCallback(
      (e) => {
        const id = e.detail.id ?? window.crypto.randomUUID();

        if (e.detail.id) {
          remove(id);
        }

        setTimeout(() => remove(id), TOAST_TIMEOUT);

        setToasts((toasts) =>
          toasts.concat({
            ...e.detail,
            id,
          })
        );
      },
      [remove]
    )
  );

  return (
    <>
      {children}

      <div className="toast">
        {toasts.map(({ id, ...props }) => (
          <Alert key={id} type={props.type} onClick={() => remove(id)}>
            {props.message}
          </Alert>
        ))}
      </div>
    </>
  );
};
