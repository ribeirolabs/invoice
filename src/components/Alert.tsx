import { ComponentType, ReactElement, ReactNode } from "react";
import {
  ErrorIcon,
  IconProps,
  InfoIcon,
  SuccessIcon,
  WarningIcon,
} from "./Icons";

const CLASSES: Record<AlertType, string> = {
  info: "alert-info",
  success: "alert-success",
  warning: "alert-warning",
  error: "alert-error",
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
};

export const Alert = ({
  type = "info",
  onClick,
  children,
  fluid,
}: AlertProps) => {
  const Icon = ICONS[type];

  return (
    <div
      className={`alert ${CLASSES[type]} cursor-pointer min-w-[400px] ${
        fluid ? "w-full" : ""
      }`}
      onClick={onClick}
    >
      <div>
        <div>
          <Icon size={24} />
        </div>

        <span className="leading-4">{children}</span>
      </div>
    </div>
  );
};
