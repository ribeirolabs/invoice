import { AppHeader } from "@common/components/Header";
import { EyeClosedIcon, EyeIcon } from "@common/components/Icons";
import { useSettings } from "@common/components/Settings";
import Link from "next/link";

export const Header = () => {
  const [sensitiveInformation, update] = useSettings("sensitiveInformation");

  return (
    <AppHeader>
      <div className="flex items-center gap-4">
        <Link href="/generate">
          <a className="btn btn-sm btn-primary btn-outline">Generate</a>
        </Link>

        <button
          className="btn btn-circle btn-sm btn-ghost"
          onClick={() => {
            update((current) => !current);
          }}
        >
          {sensitiveInformation ? <EyeIcon /> : <EyeClosedIcon />}
        </button>
      </div>
    </AppHeader>
  );
};
