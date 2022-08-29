import { ComponentType, ReactElement, ReactNode, useMemo } from "react";
import {
  ErrorIcon,
  IconProps,
  InfoIcon,
  SuccessIcon,
  WarningIcon,
} from "./Icons";

const CLASSES = {
  alert: {
    info: "alert-info",
    success: "alert-success",
    warning: "alert-warning",
    error: "alert-error",
  },
  text: {
    info: "text-info",
    success: "text-success",
    warning: "text-warning",
    error: "text-error",
  },
};

const ICONS: Record<AlertType, ComponentType<IconProps>> = {
  info: InfoIcon,
  success: SuccessIcon,
  warning: WarningIcon,
  error: ErrorIcon,
};

export type AlertProps = {
  type?: AlertType;
  onClick?: () => void;
  children: ReactNode;
  fluid?: boolean;
  inverse?: boolean;
};

export const Alert = ({
  type = "info",
  onClick,
  children,
  fluid,
  inverse,
}: AlertProps) => {
  const Icon = ICONS[type];

  const className = useMemo(() => {
    return inverse ? CLASSES.text[type] : CLASSES.alert[type];
  }, [type, inverse]);

  return (
    <div
      className={`alert ${className} cursor-pointer min-w-[400px] ${
        fluid ? "w-full" : ""
      }`}
      onClick={onClick}
    >
      <div>
        <div>
          <Icon size={24} />
        </div>

        <span className="leading-4 text-sm">{children}</span>
      </div>
    </div>
  );
};
