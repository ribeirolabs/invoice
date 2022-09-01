import { sensitiveInformationAtom } from "@/atoms/settings";
import { PropsWithChildren, useState } from "react";

export const Senstive = ({ children }: PropsWithChildren) => {
  const [sensitiveInformation] = useState(true);

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
