import { PropsWithChildren, useCallback, useState } from "react";
import { useEvent } from "@ribeirolabs/events/react";
import { Alert, AlertProps } from "./Alert";

type ToastWithId = Pick<AlertProps, "type" | "message"> & { id: string };

const TOAST_TIMEOUT = 3000;

export const ToastProvider = ({ children }: PropsWithChildren) => {
  const [toasts, setToasts] = useState<ToastWithId[]>([]);

  const remove = useCallback((id: string) => {
    setToasts((toasts) => toasts.filter((toast) => toast.id !== id));
  }, []);

  useEvent(
    "toast",
    useCallback(
      (e) => {
        const id = window.crypto.randomUUID();

        if (/success|info/.test(e.detail.type)) {
          setTimeout(() => remove(id), TOAST_TIMEOUT);
        }

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
          <Alert key={id} {...props} onClick={() => remove(id)} />
        ))}
      </div>
    </>
  );
};
