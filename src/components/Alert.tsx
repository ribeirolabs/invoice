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
  message: string;
  onClick?: () => void;
};

export const Alert = ({ type = "info", message, onClick }: AlertProps) => {
  const Icon = ICONS[type];

  return (
    <div
      className={`alert ${CLASSES[type]} cursor-pointer max-w-[400px]`}
      onClick={onClick}
    >
      <div>
        <div>
          <Icon size={24} />
        </div>

        <span className="leading-4">{message}</span>
      </div>
    </div>
  );
};
