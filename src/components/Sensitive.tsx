import { useSettingsValue } from "@common/components/Settings";
import { PropsWithChildren } from "react";

export const Senstive = ({ children }: PropsWithChildren) => {
  const sensitiveInformation = useSettingsValue("sensitiveInformation");

  return (
    <div className="w-fit relative">
      {children}
      <div
        className={`absolute top-0 left-0 w-full h-full bg-base-300 transition-opacity ${
          sensitiveInformation
            ? "opacity-1 select-none"
            : "opacity-0 pointer-events-none"
        } `}
      ></div>
    </div>
  );
};
