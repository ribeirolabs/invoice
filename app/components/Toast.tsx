import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useReducer,
} from "react";
import { Portal } from "./Portal";
import { cn } from "~/utils";
import { CancelIcon, CheckCircleIcon } from "./Icons";

type Toast = {
  key: string;
  type: "success" | "error" | "loading";
  timeout?: number;
  icon?: ReactNode;
  content: ReactNode;
};

const TOAST_FIXED_KEY = "_FIXED_";

type ToastActionsContext = {
  add: (toast: Omit<Toast, "key"> & { key?: string }) => void;
  clear: (key?: string) => void;
};

const ActionsContext = createContext<ToastActionsContext>({
  add: () => {},
  clear: () => {},
});

type ToastReducerState = {
  toasts: Toast[];
  keys: Record<string, boolean>;
};

type ToastReducerAction =
  | {
      type: "ADD";
      toast: Omit<Toast, "key"> & { key?: string };
    }
  | {
      type: "CLEAR";
      key?: string;
    };

function reducer(
  state: ToastReducerState,
  action: ToastReducerAction
): ToastReducerState {
  if (action.type === "ADD") {
    const key = action.toast.key ?? TOAST_FIXED_KEY;
    const newToast = {
      key,
      ...action.toast,
    };

    if (!state.keys[key]) {
      return {
        keys: {
          ...state.keys,
          [key]: true,
        },
        toasts: state.toasts.concat(newToast),
      };
    }

    const toasts = [...state.toasts].map((toast) => {
      if (toast.key === key) {
        return newToast;
      }

      return toast;
    });

    return {
      keys: state.keys,
      toasts,
    };
  }

  if (action.type === "CLEAR") {
    if (!action.key) {
      return {
        keys: {},
        toasts: [],
      };
    }

    const toasts = state.toasts.filter((toast) => toast.key !== action.key);
    const keys = { ...state.keys };
    delete keys[action.key];

    return {
      toasts,
      keys,
    };
  }

  return state;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [state, send] = useReducer<typeof reducer>(reducer, {
    toasts: [],
    keys: {},
  });

  const add = useCallback<ToastActionsContext["add"]>((toast) => {
    send({ type: "ADD", toast });
  }, []);

  const clear = useCallback<ToastActionsContext["clear"]>((key) => {
    send({ type: "CLEAR", key });
  }, []);

  return (
    <>
      <ActionsContext.Provider value={{ add, clear }}>
        {children}
      </ActionsContext.Provider>

      <Portal selector="#toasts">
        <div className="toast max-sm:w-full z-20">
          {state.toasts.map((toast) => {
            const icon =
              toast.icon === undefined
                ? ICON_BY_TYPE[toast.type] ?? null
                : toast.icon;

            return (
              <div
                key={toast.key}
                onClick={() => clear(toast.key)}
                className={cn(
                  "alert cursor-pointer max-sm:grid-flow-col max-sm:grid-cols-[auto_1fr] max-sm:justify-items-start font-medium",
                  toast.type === "success"
                    ? "alert-success"
                    : toast.type === "error"
                    ? "alert-error"
                    : ""
                )}
              >
                {icon}
                {toast.content}
              </div>
            );
          })}
        </div>
      </Portal>
    </>
  );
}

export function useToastActions() {
  return useContext(ActionsContext);
}

const ICON_BY_TYPE: Record<Toast["type"], ReactNode> = {
  success: <CheckCircleIcon />,
  error: <CancelIcon />,
  loading: <div className="loading" />,
};
