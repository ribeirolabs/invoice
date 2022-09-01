import { useSettings, useSettingsValue } from "@common/components/Settings";
import { PropsWithChildren, useState } from "react";

export const Senstive = ({ children }: PropsWithChildren) => {
  const sensitiveInformation = useSettingsValue("sensitiveInformation");

  return (
    <div
      className={`w-content ${
        sensitiveInformation ? "" : "select-none text-transparent bg-base-300"
      }`}
    >
      {children}
    </div>
  );
};
