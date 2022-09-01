import { AppHeader } from "@common/components/Header";
import { EyeClosedIcon, EyeIcon } from "@common/components/Icons";
import Link from "next/link";
import { useState } from "react";

export const Header = () => {
  const [sensitiveInformation, setSenstiveInformation] = useState(true);

  return (
    <AppHeader>
      <div className="flex items-center gap-4">
        <Link href="/generate">
          <a className="btn btn-sm btn-primary btn-outline">Generate</a>
        </Link>

        <button
          className="btn btn-circle btn-sm btn-ghost"
          onClick={() =>
            setSenstiveInformation((current) => {
              return !current;
            })
          }
        >
          {sensitiveInformation ? <EyeIcon /> : <EyeClosedIcon />}
        </button>
      </div>
    </AppHeader>
  );
};
